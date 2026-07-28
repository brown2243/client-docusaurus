---
slug: tanstack-query-caching-mechanism
title: TanStack Query (React Query) 카테고리별 캐싱 메커니즘과 낙관적 업데이트
authors: [brown]
tags: [React, TanStackQuery, ReactQuery, Caching, Frontend]
Date: 2026-05-10 14:00
---

# TanStack Query (React Query) 카테고리별 캐싱 메커니즘과 낙관적 업데이트

<br />

프론트엔드 개발을 하면서 서버 상태(Server State) 관리 라이브러리로 TanStack Query(구 React Query)를 안 쓸래야 안 쓸 수가 없게 되었다.
근데 팀원들과 대화하다 보면 항상 헷갈려하는 주제가 하나 있다. **"staleTime이랑 gcTime(구 cacheTime) 차이가 정확히 뭐예요?"**

듣다보니 나도 원리를 완전히 정리하고 넘어가야겠다고 생각해서 내부 캐시 구조와 낙관적 업데이트(Optimistic Update) 패턴을 파헤쳐 보았다. 바로 시작하자.

<!-- truncate -->

### staleTime vs gcTime: 영원히 헷갈리지 않는 명확한 정리

TanStack Query에서 가장 중요한 두 가지 타임아웃 옵션이다.

:::note
- **staleTime (신선함의 유효기간)**: 데이터가 `fresh` 상태에서 `stale`(상한 상태)로 변경될 때까지 걸리는 시간. (기본값: `0`)
- **gcTime (Garbage Collection Time)**: 쿼리 인스턴스가 unmount된 후 메모리 캐시에서 완전히 제거될 때까지 보관하는 시간. v5 이전 이름은 `cacheTime`. (기본값: `5분`)
:::

#### 타임라인으로 이해하기

```
[Fetch 성공] ---> (fresh 상태) 
    |
   staleTime 경과 (예: 1분)
    |
    +---> (stale 상태로 전환) -> 이제 마운트/윈도우 포커스 시 background refetch 수행!
    |
   컴포넌트 Unmount 발생!
    |
   gcTime 경과 (예: 5분)
    |
    +---> 메모리 캐시에서 데이터 삭제 (GC 실행)
```

- `staleTime = 0`이면 컴포넌트가 재마운트되거나 윈도우가 재포커스될 때 무조건 백그라운드 요청(refetch)을 보낸다.
- 하지만 화면에는 메모리에 남아있는 `gcTime` 동안의 데이터(구 데이터)를 **즉시 렌더링**하고, 백그라운드 fetch가 완료되면 최신 데이터로 교체한다. 이것이 TanStack Query가 말하는 **Stale-While-Revalidate (SWR)** 전략의 핵심이다!

---

### 쿼리 키(Query Key) 직렬화와 캐시 매핑 구조

TanStack Query 내부에서는 캐시를 어떻게 매핑하고 있을까?

Query Key는 배열 형태로 전달하지만, 내부 `QueryCache` 클래스에서는 이 키를 **결정론적으로 직렬화(Deterministic Serialization)**하여 문자열 hash로 키를 만든다.

```typescript
// Query Key 직렬화 원리 예시
export function hashQueryKey(queryKey: QueryKey): string {
  return JSON.stringify(queryKey, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort() // 객체의 키 순서가 달라도 동일하게 정렬!
          .reduce((result, key) => {
            result[key] = val[key];
            return result;
          }, {} as any)
      : val
  );
}

// 아래 두 Query Key는 완전히 동일한 캐시 항목으로 취급된다!
useQuery({ queryKey: ['todos', { status: 'done', page: 1 }] });
useQuery({ queryKey: ['todos', { page: 1, status: 'done' }] });
```

객체 내부 키 순서가 달라도 `sort()`를 거쳐 동일한 string hash로 반환되기 때문에 캐시 미스가 발생하지 않는다. 이런 세심한 설계... 아주 감탄스럽다. 👍

---

### 낙관적 업데이트(Optimistic Update) 구현 패턴

사용자가 좋아요 버튼을 누르거나 할 일을 체크할 때, API 서버 응답을 기다리지 않고 UI를 먼저 변경하는 **낙관적 업데이트**는 UX를 획기적으로 개선해준다.

하지만 네트워크 실패 시 **이전 상태로 복원(Rollback)**하는 처리가 아주 매끄러워야 한다.

```typescript
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: updateTodoApi,
  
  // 1. onMutate: API 요청 출발 전 실행
  onMutate: async (newTodo) => {
    // 해당 쿼리 키의 refetch 취소 (낙관적 데이터 덮어쓰기 방지)
    await queryClient.cancelQueries({ queryKey: ['todos', newTodo.id] });

    // 이전 캐시 데이터 백업 (Rollback용)
    const previousTodo = queryClient.getQueryData(['todos', newTodo.id]);

    // 캐시 데이터를 낙관적으로 먼저 업데이트!
    queryClient.setQueryData(['todos', newTodo.id], newTodo);

    // context로 이전 데이터 전달
    return { previousTodo };
  },

  // 2. onError: 실패 시 이전 상태로 롤백
  onError: (err, newTodo, context) => {
    if (context?.previousTodo) {
      queryClient.setQueryData(['todos', newTodo.id], context.previousTodo);
    }
  },

  // 3. onSettled: 성공/실패 여부와 상관없이 최종 신선 데이터 동기화
  onSettled: (data, error, variables) => {
    queryClient.invalidateQueries({ queryKey: ['todos', variables.id] });
  },
});
```

---

### 지수 백오프(Exponential Backoff) 자동 재시도 서사

네트워크가 불안정할 때 TanStack Query는 기본 3회 재시도를 수행한다.
이 때 서버에 떼거지 요청 폭주(Thundering Herd)가 가는 것을 막기 위해 **Exponential Backoff with Jitter** 알고리즘을 사용한다.

```text
RetryDelay = min(1000 * 2^attempt, 30000)
```

```typescript
// TanStack Query 내부 retryDelay 예시 코드
const defaultRetryDelay = (failureCount: number) =>
  Math.min(1000 * 2 ** failureCount, 30000);
```

실패 횟수가 늘어날 때마다 1초 -> 2초 -> 4초 -> 8초... 지수적으로 대기 시간이 늘어난다.

---

### 마무리 / Outro

TanStack Query를 단순히 `useQuery` 데이터를 가져오는 도구로만 생각했었는데, `staleTime`/`gcTime` 메커니즘과 `QueryKey` 직렬화, 낙관적 업데이트 롤백 핸들링을 깊이 이해하니 프론트엔드 캐싱 설계가 훨씬 명확해졌다.

네트워크 상태에 휘둘리지 않고 사용자에게 반응성 높은 UI를 제공하는 프론트엔드 개발자가 되어야겠다고 다짐해본다!
