---
sidebar_position: 1
slug: /react/zustand-internals
title: Zustand 내부 메커니즘과 구독 모델 (useSyncExternalStore)
description: Zustand의 1KB 미만 코어 라이브러리 구조, Closure 기반 스토어, useSyncExternalStore 구독 모델, 트랜지언트 업데이트 및 미들웨어 아키텍처 완전 분석
---

# Zustand 내부 메커니즘과 구독 모델 (useSyncExternalStore)

<br />

React 생태계에서 상태 관리 라이브러리는 Redux의 중앙 집중형 복잡성에서 시작하여 Recoil/Jotai의 기본 단위(Atom) 모델, 그리고 Zustand의 **발행-구독(Publish-Subscribe) 기반 경량 스토어** 모델로 진화해 왔다.

Zustand는 번들 크기가 1KB 미만에 불과하면서도, React 18의 **Concurrent Rendering(동시성 렌더링)** 환경에서 발생하는 **Tearing(찢어짐 현상)**을 완벽히 방지한다. 이 문서에서는 Zustand의 내부 코어 구현, React 바인딩 원리, selector 비교 메커니즘, 그리고 미들웨어 파이프라인을 심층 분석한다.

---

## 1. React 18 Tearing 문제와 useSyncExternalStore

### 1.1 Tearing(찢어짐 현상)이란?

React 18 이전의 동기적(Synchronous) 렌더링에서는 한 프레임의 렌더링이 시작되면 끝날 때까지 브라우저 메인 쓰레드가 차단되었다. 그러나 React 18의 **Concurrent Mode**에서는 렌더링 작업이 타임 슬라이싱(Time Slicing)에 의해 중단(Pause)되고 다른 고우선순위 이벤트(사용자 입출력 등)가 실행될 수 있다.

```mermaid
sequenceDiagram
    autonumber
    participant React as React Fiber Reconciler
    participant ComponentA as Component A
    participant ExternalStore as External Store (State: v1)
    participant ComponentB as Component B

    React->>ComponentA: 렌더링 시작 (State: v1 읽음)
    Note over React: 시간 슬라이싱으로 렌더링 일시 중단 (Yield to Main Thread)
    ExternalStore->>ExternalStore: 외부 이벤트로 상태 변경 (v1 -> v2)
<truncated 8908 bytes>
```
