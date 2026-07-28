---
slug: react-rerender-and-dom-cost
title: React 리렌더링과 브라우저 DOM 조작 비용 (React.memo와 useCallback 올바르게 쓰기)
authors: [brown]
tags: [React, JavaScript, Performance, Browser, DOM]
Date: 2026-05-20 16:30
---

# React 리렌더링과 브라우저 DOM 조작 비용 (React.memo와 useCallback 올바르게 쓰기)

<br />

프로젝트 성능 튜닝 작업을 하다 보면 흔히 들리는 말이 있다. **"리렌더링 줄이게 컴포넌트에 React.memo 다 감싸고 콜백 함수는 모조리 useCallback 처리하죠!"**

과연 그럴까? 
듣다보니 나도 진짜 `React.memo`와 `useCallback`을 남용하면 무조건 빠른지 궁금해져서 Virtual DOM Reconciliation 과정과 실제 브라우저 Reflow/Repaint 비용을 비교 실험해 보았다. 

<!-- truncate -->

### 1. React 리렌더링 vs 브라우저 DOM 조작

많은 개발자들이 오해하는 부분이 있다. **"React 리렌더링 = 화면 DOM이 매번 새로 그려짐"**이라고 생각하는 것이다.

하지만 실제로는 2단계로 나뉜다.

```
[Render Phase (Virtual DOM)]        [Commit Phase (Real DOM)]
  컴포넌트 함수 호출                     실제 DOM 변경 발생
  -> VDOM 트리 생성                    -> Reflow (Layout 계산)
  -> 이전 VDOM과 Diffing 비교           -> Repaint (화면 그리기)
  (JavaScript 연산 - 비교적 저렴!)       (브라우저 렌더링 엔진 - 매우 비쌈!)
```

#### 왜 실제 DOM 조작(Reflow / Repaint)은 비쌀까?

브라우저가 DOM 노드의 위치나 크기(`width`, `height`, `margin` 등)가 바뀔 때 실행하는 **Reflow**는 단순한 작업이 아니다.

1. **DOM 트리 & CSSOM 트리 재계산**
2. **Layout Tree 생성**: 모든 엘리먼트의 기하학적 위치와 크기 계산 (부모-자식 연관 관계 재계산)
3. **Layer 분할 및 Paint**: 레이어별 픽셀 래스터화
4. **Composite Layers**: 레이어 합성 후 GPU 전송

이 일련의 과정이 60fps(프레임당 16.6ms) 내에 끝나지 않으면 화면 뚝뚝 끊김(Jank) 현상이 발생한다!

React의 Virtual DOM(Fiber Architecture)은 변경사항을 메모리상에서 비교한 뒤, **최종 변경된 최소한의 차이(Diff)만 가려내어 Real DOM에는 단 한 번만 반영(Batching)**하기 때문에 효율적인 것이다.

---

### 2. React.memo와 useCallback 남용의 역효과

그러면 Render Phase에서의 VDOM Diffing조차 줄이기 위해 모든 컴포넌트에 `React.memo`를 둘러싸면 무조건 이득일까?

답은 **"아니다, 오히려 더 느려질 수 있다."**이다. (까비...)

#### React.memo의 작동 원리와 비용

`React.memo`는 이전 Props와 다음 Props를 **얕은 비교(Shallow Compare)**하는 래퍼 함수다.

```javascript
// React.memo 내부 동작 개념
function arePropsEqual(prevProps, nextProps) {
  const keys = Object.keys(nextProps);
  if (keys.length !== Object.keys(prevProps).length) return false;
  for (let key of keys) {
    if (prevProps[key] !== nextProps[key]) return false;
  }
  return true;
}
```

- 만약 컴포넌트가 자식 요소를 거의 가지지 않거나, Props가 매번 바뀌는 구조라면?
- **Props 비교 비용(Shallow Compare) + 렌더링 비용**이 모두 지출되므로 안 하니만 못하다!

#### useCallback의 흔한 착각

```javascript
// 잘못된 예시: 의존성이 매번 바뀌거나 자식이 memo되어 있지 않은 경우
const handleClick = useCallback(() => {
  console.log(count);
}, [count]); // count가 바뀔 때마다 새로운 함수 객체 생성!
```

`useCallback`은 함수 생성을 막는 것이 아니라, **동일한 참조(Identity reference)**를 유지해주는 훅일 뿐이다.
함수 자체는 컴포넌트가 리렌더링될 때마다 매번 새로 생성되고, `useCallback` 내부에서 의존성 배열을 비교하여 이전 참조를 반환할지 결정한다.

즉, **받는 자식 컴포넌트가 `React.memo`로 감싸져 있지 않다면 `useCallback`은 아무런 리렌더링 방지 효과가 없다!** 메모리 매핑 비용과 의존성 배열 비교 비용만 추가될 뿐이다.

---

### 3. 올바른 최적화 지점 타격하기

그렇다면 언제 `React.memo`와 `useCallback`을 써야 할까?

:::tip
1. **차트, 무한 스크롤 리스트, 복잡한 SVG 렌더링**처럼 자식 컴포넌트 렌더링 비용이 압도적으로 큰 경우
2. **`useEffect`나 커스텀 훅의 의존성 배열(deps)**에 함수 객체가 참조로 전달되는 경우
3. Context Provider에 전달하는 value 객체의 불필요한 전체 리렌더링 방지
:::

#### 구조적 최적화(Component Composition) 우선 적용

코드 레벨 훅 적용보다 더 강력한 최적화는 **상태를 아래로 내리거나(State Colocation), 자식을 props/children으로 전달하는 것**이다.

```jsx
// ❌ bad: text 입력 시마다 HeavyComponent까지 리렌더링됨
function BadContainer() {
  const [text, setText] = useState('');
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <HeavyComponent />
    </div>
  );
}

// ⭕ good: input 상태를 별도 컴포넌트로 분리!
function FormInput() {
  const [text, setText] = useState('');
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}

function GoodContainer() {
  return (
    <div>
      <FormInput />
      <HeavyComponent /> {/* text가 바뀌어도 전혀 리렌더링되지 않음! */}
    </div>
  );
}
```

---

### 마무리 / Outro

최적화 조치를 취하기 전에 반드시 **React DevTools Profiler**로 진짜 병목이 발생하는 컴포넌트인지 먼저 측정한 후 튜닝을 진행해야 한다.

"측정 없는 최적화는 억측일 뿐이다!"라는 배움을 다시금 새겨본다. 렌더링 타임라인 측정하러 고고!
