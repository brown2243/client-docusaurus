---
sidebar_position: 4
slug: /react/react18-concurrent-architecture
title: "React 18 동시성(Concurrent) 엔진과 서버 컴포넌트(RSC) 심층 가이드"
description: "Fiber WorkLoop 타임 슬라이싱, Priority Lane 비트마스크 스케줄링, useTransition/useDeferredValue 내부 구현, Selective Hydration 및 RSC 스트리밍 파이프라인"
---

# React 18 동시성(Concurrent) 엔진과 서버 컴포넌트(RSC) 심층 가이드

<br />

React 18은 단순한 API 추가 버전이 아닌, **React의 렌더링 코어 패러다임이 '동기적 단일 스레드 작업'에서 '우선순위 기반의 비동기 타임 슬라이싱 엔진'으로 전환된 분기점**이다.

동시성(Concurrency) 기법을 통해 React는 긴 UI 업데이트 작업 중에도 사용자의 클릭, 타이핑, 마우스 호버 이벤트를 즉각 처리할 수 있게 되었다. 더 나아가 이 동시성 레일 위에서 **Selective Hydration**과 **React Server Components (RSC)** 스트리밍 아키텍처가 결합된다.

---

## 1. Concurrent React의 핵심: 타임 슬라이싱 (Time Slicing)

### 1.1 Stack Reconciler vs Fiber Reconciler

- **React 15 이전 (Stack Reconciler)**: 콜 스택을 통한 재귀적 트리 순회. 렌더링이 시작되면 트리가 끝날 때까지 브라우저 메인 스레드를 100% 점유. (Frame Drop 발생)
- **React 18 (Fiber Reconciler)**: 트리를 **단방향 링크드 리스트(Fiber Node)** 구조로 개편하여, `workInProgress` 포인터를 통해 **어디서든 작업을 멈추고(Pause), 우선순위 높은 작업으로 전환(Yield)한 뒤, 다시 돌아와 재개(Resume)**할 수 있다.

```mermaid
graph TD
    subgraph Fiber Linked List Node Structure
        F[Fiber Node] -->|child| C[Child Fiber Node]
        F -->|sibling| S[Sibling Fiber Node]
        F -->|return| P[Parent Fiber Node]
    end
```

### 1.2 Lane Model (비트마스크 우선순위)

React 18은 31비트 비트마스크(Bitmask) 기반의 **Lanes 모델**을 사용하여 렌더링 작업의 우선순위를 정밀하게 분류한다.

- `SyncLane`: 동기적 처리 (사용자 입력, 키보드 타이핑 등 긴급 이벤트)
- `InputContinuousLane`: 마우스 드래그, 스크롤 등 연속 입력
- `DefaultLane`: 일반 상태 업데이트 (`setState`)
- `TransitionLane`: 지연 가능한 업데이트 (`startTransition`)
- `IdleLane`: 백그라운드 유휴 작업

---

## 2. useTransition과 useDeferredValue의 내부 메커니즘

```typescript
function SearchFilter() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    // 1. 긴급 업데이트 (즉시 인풋에 타이핑 반영)
    setQuery(e.target.value);

    // 2. 비긴급 전환 업데이트 (무거운 필터링 작업 지연 처리)
    startTransition(() => {
      setResults(filterHeavyData(e.target.value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultList items={results} />
    </div>
  );
}
```

---

## 3. React Server Components (RSC)와 Streaming SSR

RSC는 컴포넌트를 서버에서만 실행하고 그 결과를 특수한 JSON 스트림 포맷(RSC Wire Format)으로 클라이언트에 점진적 전송한다.

```
M1:{"id":"./src/Button.tsx","chunks":["client-button"],"name":"default"}
J0:["$","div",null,{"children":[["$","h1",null,{"children":"Hello Server"}],["$","$L1",null,{"label":"Click Me"}]]}]
```

- **번들 크기 0KB**: 클라이언트로 JavaScript 코드가 다운로드되지 않음.
- **백엔드 리소스 직접 접근**: DB, 파일 시스템에 보안 토큰 노출 없이 직접 쿼리 가능.
