---
sidebar_position: 5
slug: /react/component-lifecycle
description: react-component-lifecycle-hooks-flow
---

# React Component Lifecycle & Hook Flow

React 컴포넌트의 라이프사이클(생명주기)은 컴포넌트가 화면에 생성(Mount), 업데이트(Update), 제거(Unmount)되는 전체 과정을 의미한다.

클래스 컴포넌트의 메서드 기반 생명주기와 함수 컴포넌트의 Hook 흐름(Hook Flow)의 차이를 정리한다.

---

## 1. 클래스 컴포넌트 라이프사이클 3단계

![react-hooks-lifecycle](https://raw.githubusercontent.com/Wavez/react-hooks-lifecycle/master/screenshot.jpg)

### 1) Mount (마운트)
컴포넌트 인스턴스가 생성되어 DOM에 삽입되는 단계.
- `constructor()`: 초기 state 설정 및 메서드 바인딩.
- `render()`: UI 렌더링.
- `componentDidMount()`: DOM 노드 접근, 네트워크 요청, 이벤트 리스너 등록.

### 2) Update (업데이트)
props나 state가 변경되어 컴포넌트가 리렌더링되는 단계.
- `shouldComponentUpdate(nextProps, nextState)`: 성능 최적화를 위해 리렌더링 여부를 결정 (Boolean 반환).
- `render()`: 변경된 state 반영 렌더링.
- `componentDidUpdate(prevProps, prevState)`: 업데이트 직후 DOM 작업 수행.

### 3) Unmount (언마운트)
컴포넌트가 DOM에서 제거되는 단계.
- `componentWillUnmount()`: 타이머 해제, 네트워크 요청 취소, 등록된 이벤트 리스너 제거 (메모리 누수 방지).

---

## 2. 함수 컴포넌트 Hook Flow (렌더 단계 vs 커밋 단계)

함수 컴포넌트는 생명주기 메서드 대신 **`useEffect`, `useLayoutEffect`**를 사용하여 동기화 작업을 처리한다.

![hook-flow.png](https://raw.githubusercontent.com/donavon/hook-flow/master/hook-flow.png)

### Hook 실행 순서 요약

1. **Run Lazy Initializers**: `useState(() => initialVal)` 초기화 함수 실행
2. **Render Phase**: 함수 컴포넌트 자체 실행 (JSX 반환)
3. **React Updates DOM**: DOM 트리가 실제 화면 노드로 변경됨
4. **LayoutEffects Phase**: `useLayoutEffect` 실행 (브라우저가 화면을 그리기(Paint) 전 동기적 실행 -> DOM 측정에 적합)
5. **Browser Paints Screen**: 브라우저 화면 그리기 완료
6. **Effects Phase**: `useEffect` 비동기 실행 (네트워크 요청, 구독 작업에 적합)

---

## 3. `useEffect` Cleanup 함수 동작 원리

`useEffect` 내부에서 반환하는 Cleanup 함수는 다음 두 가지 시점에 호출된다.

1. 의존성 배열(`deps`)의 값이 변경되어 **새로운 Effect가 실행되기 직전** (이전 Effect 청소)
2. 컴포넌트가 **Unmount되는 시점**

```javascript
import { useEffect, useState } from 'react';

function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // 1. 이벤트 리스너 등록 (Mount / Effect 실행)
    window.addEventListener('mousemove', handleMove);

    // 2. Cleanup 함수 (Unmount 또는 deps 변경 시 실행)
    return () => {
      window.removeEventListener('mousemove', handleMove);
    };
  }, []); // 빈 배열: Mount 시 1회 등록, Unmount 시 1회 해제

  return <div>X: {position.x}, Y: {position.y}</div>;
}
```

## 참조

- https://github.com/Wavez/react-hooks-lifecycle
- https://github.com/donavon/hook-flow
