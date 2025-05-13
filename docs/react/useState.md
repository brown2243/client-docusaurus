---
sidebar_position: 10
created_date: "2025-03-17"
last_updated: "2025-03-17"
tags: ["react", "hooks", "useState"]
complexity: "초급" # 문서 난이도
---

# useState

- 리액트에서 변수를 관리하는 방식
- setState를 사용시, 해당 컴포넌트를 리렌더링한다.
- 함수형 컴포넌트에서 상태를 관리하는 데 사용
- 상태 업데이트는 비동기적으로 처리되며, 여러 업데이트가 한 번의 리렌더링으로 병합(배치)

## useState의 동작 원리

`useState`는 클로저를 기반으로 하는데, 이로 인해 단골 질문이 되었다.

`React`의 함수형 컴포넌트는 렌더링될 때마다 새로 실행되는데, 이 과정에서 `useState`는 상태 값을 유지해야 한다.

그래서 `React` 내부적으로 컴포넌트별 상태 저장소를 유지 및 초기값 저장하고, 이후 렌더링에서는 상태 저장소에서 값을 가져오며, `setState`함수는 클로저를 통해 해당 상태 항목에 대한 참조를 유지한다.

```jsx
// 간단한 useState 구현
function createReactLikeHooks() {
  // 상태를 저장할 배열
  const states = [];
  // 현재 처리 중인 상태의 인덱스
  let stateIndex = 0;

  // useState 함수 구현
  function useState(initialValue) {
    // 현재 상태 인덱스를 저장
    const currentIndex = stateIndex;

    // 첫 렌더링 시에만 초기값을 설정
    if (states[currentIndex] === undefined) {
      // 초기값이 함수라면 호출하여 값을 얻음 (lazy initialization)
      if (typeof initialValue === "function") {
        states[currentIndex] = initialValue();
      } else {
        states[currentIndex] = initialValue;
      }
    }

    // setState 함수 - 클로저를 활용해 currentIndex를 "기억"함
    const setState = (newValue) => {
      // 새 값이 함수라면 이전 상태를 인자로 호출 (함수형 업데이트)
      if (typeof newValue === "function") {
        states[currentIndex] = newValue(states[currentIndex]);
      } else {
        states[currentIndex] = newValue;
      }

      // 실제 React에서는 여기서 렌더링 트리거
      render();
    };

    // 다음 상태를 위해 인덱스 증가
    stateIndex++;

    // 현재 상태 값과 setState 함수 반환
    return [states[currentIndex], setState];
  }
}
```

## lazy 초기화

- Lazy 초기화는 초기 상태 계산이 복잡하거나 비용이 많이 드는 경우에 사용

```jsx
const [state, setState] = useState(someExpensiveComputation());
// Lazy 초기화 - 초기 렌더링에만 실행됨
const [state, setState] = useState(() => someExpensiveComputation());
```
