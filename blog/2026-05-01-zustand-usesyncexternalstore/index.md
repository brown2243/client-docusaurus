---
slug: zustand-usesyncexternalstore-analysis
title: Zustand 내부 동작 분석과 useSyncExternalStore (React 18 Tearing 방지)
authors: [brown]
tags: [React, Zustand, JavaScript, 상태관리]
Date: 2026-05-01 10:00
---

# Zustand 내부 동작 분석과 useSyncExternalStore (React 18 Tearing 방지)

<br />

React 프로젝트를 진행하면서 Redux의 무거운 보일러플레이트에 지쳐 Zustand로 넘어온 지 꽤 되었다.
듣다보니 **"Zustand는 bundle size가 1KB 미만인데 React 18의 동시성(Concurrency) 기능까지 완전 지원한다"**라길래 내부 동작이 궁금해져서 라이브러리 코드를 까보기 시작했는데...

<!-- truncate -->

### 왜 useSyncExternalStore가 필요했을까?

React 18에 **Concurrent Rendering(동시성 렌더링)**이 도입되면서 재미있고도 무서운 현상이 생겼다. 바로 **Tearing(찢어짐 현상)**이다.

동시성 렌더링은 긴 렌더링 작업을 잘게 쪼개어 브라우저가 사용자 입력을 중간중간 처리할 수 있게 해준다. 그런데 이 와중에 React 외부 스토어(Redux, Zustand, RxJS 등)의 상태가 변경되면 어떻게 될까?

```
[렌더링 시작] ---> 컴포넌트 A (State: v1)
      |
      +---> (사용자 이벤트 발생 -> 외부 스토어 상태 변경: v1 -> v2)
      |
      +---> 컴포넌트 B (State: v2)  <-- Tearing 발생! 화면 불일치!
```

하나의 렌더링 프레임 안에서 컴포넌트 A는 v1을, 컴포넌트 B는 v2를 바라보는 대참사가 발생하는 것이다. (제발...)

이를 해결하기 위해 React 18 팀이 제공한 공식 훅이 바로 `useSyncExternalStore`다.

```typescript
import { useSyncExternalStore } from 'react';

// 시그니처
const state = useSyncExternalStore(
  subscribe,       // 스토어 변경을 구독하는 함수 (listener 등록)
  getSnapshot,     // 스토어의 현재 상태를 반환하는 함수
  getServerSnapshot // SSR 시 초기 상태를 반환하는 함수 (옵션)
);
```

React는 `useSyncExternalStore`를 사용하면 동시성 렌더링 도중 상태 변경이 감지될 때 **렌더링을 동기적으로 다시 수행(Deopt to synchronous render)**하여 항상 일관된 UI snapshot을 보장한다.

---

### Zustand의 40줄짜리 스토어 코어 까보기

Zustand의 핵심인 `vanilla.ts` 코드는 깜짝 놀랄 정도로 심플하다. 내가 핵심 구조만 요약해 작성해보았다.

```typescript
type Listener<T> = (state: T, previousState: T) => void;

export const createStore = <T>(createState: (set: any, get: any, api: any) => T) => {
  let state: T;
  const listeners: Set<Listener<T>> = new Set();

  const setState = (partial: any, replace?: boolean) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = replace ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  const getState = () => state;

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    // Unsubscribe 함수 반환
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, subscribe };
  state = createState(setState, getState, api);
  return api;
};
```

어라? 생각했던 것보다 훨씬 더 심플해서 처음에 **"어... 이게 끝인가?"** 싶었다. 🤣

스토어 자체는 React와 완전히 독립된 **순수 JavaScript Closure 객체**일 뿐이다. State는 캡슐화되어 있고, `Set`을 통해 구독자(listener)들을 관리한다.

---

### React 바인딩: create와 useBoundStore

이 순수 JS 스토어를 React 컴포넌트 훅으로 연결해주는 부분이 바로 `react.ts`다.

```typescript
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

export function useStore<TSlice>(
  api: StoreApi<TState>,
  selector: (state: TState) => TSlice = api.getState as any,
  equalityFn?: (a: TSlice, b: TSlice) => boolean
) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn
  );
  return slice;
}
```

Zustand는 selector 및 custom equality function(예: `shallow`)을 지원하기 위해 React 내부용 패키지인 `useSyncExternalStoreWithSelector`를 사용한다.

- `selector`: 필요한 상태 슬라이스만 추출 (`state => state.count`)
- `equalityFn`: 추출한 슬라이스가 이전 렌더링 대비 진짜 변경되었는지 비교 (불필요한 리렌더링 방지)

---

### Redux vs Zustand 비교

| 항목 | Redux Toolkit | Zustand |
| --- | --- | --- |
| **패키지 용량** | ~15KB+ | **~1KB 미만** |
| **Provider** | `<Provider store={store}>` 필수 | **필요 없음** (Context 감싸기 생략 가능) |
| **보일러플레이트** | Slice, Action, Reducer 정의 필요 | `create((set) => ({ ... }))` 하나로 끝 |
| **외부 스토어 접근** | `store.getState()` 가능 (상황별 설정 필요) | 언제 어디서든 `useStore.getState()` 호출 가능 |

```typescript
// Zustand의 압도적으로 간단한 스토어 선언
import { create } from 'zustand';

interface BearState {
  bears: number;
  increase: () => void;
}

export const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
}));
```

---

### 마무리 / Outro

Redux의 복잡성에 지쳤을 때 Zustand 코드를 열어보며 깨달은 점이 있다.

1. **상태 관리의 본질은 의외로 간단하다.** (클로저 + 관찰자 패턴/Set)
2. React 18 환경에서는 `useSyncExternalStore`를 잘 활용해야 Concurrency 렌더링 중 Tearing 이슈를 방지할 수 있다.

앞으로 가벼운 글로벌 상태 관리가 필요할 때는 망설임 없이 Zustand를 픽하게 될 것 같다. 한잔해🥂!
