---
slug: nextjs-app-router-migration-experience
title: Next.js 12 Pages Router에서 13/14 App Router로의 전환기 (RSC & Server Actions)
authors: [brown]
tags: [Nextjs, React, RSC, ServerActions, Frontend]
Date: 2026-06-01 11:00
---

# Next.js 12 Pages Router에서 13/14 App Router로의 전환기 (RSC & Server Actions)

<br />

오랫동안 친숙했던 Next.js Pages Router(`pages/` 디렉터리)에서 App Router(`app/` 디렉터리)로 프로덕션 프로젝트를 마이그레이션하는 작업을 진행했다.
처음에는 **"라우팅 폴더 구조만 좀 바뀌는 거겠지?"**라고 가볍게 생각했는데... 웬걸, 멘탈 모델 자체가 아예 마이크로 프론트엔드 수준으로 달라지는 패러다임 시프트였다! (흑흑...)

마이그레이션 과정에서 겪은 RSC(React Server Components) 아키텍처와 Hydration 경계 변화, 그리고 Server Actions 도입 후기를 적어본다.

<!-- truncate -->

### 1. Server Components(RSC) 패러다임과 Hydration Boundary의 변화

Pages Router에서는 모든 컴포넌트가 기본적으로 클라이언트 컴포넌트였고, `getServerSideProps`나 `getStaticProps`를 통해 최상위 페이지 레벨에서만 서버 사이드 데이터를 페칭해 마운트 시점에 Props로 내려주었다.

반면 App Router에서는 **모든 컴포넌트가 기본적으로 React Server Component (RSC)**다!

```
[Pages Router]
Page (SSR) -> 전체 HTML 렌더링 -> 전체 JS 번들 전송 -> 전체 페이지 Hydration

[App Router]
Server Component (서버에서만 실행, 번들 0B)
  |-- Server Component
  |-- 'use client' Client Component  <-- Hydration Boundary 발생!
        |-- Client Component
```

#### Hydration Boundary가 가지는 이점

1. **JS Bundle Size 획기적 감소**: Heavy한 라이브러리(marked, date-fns, highlight.js 등)를 RSC 내부에서만 사용하면 클라이언트 브라우저로 해당 라이브러리 JS 코드가 **단 1바이트도 전송되지 않는다!**
2. **Streaming & Suspense**: 페이지 전체 데이터가 준비될 때까지 기다릴 필요 없이, 준비된 부분부터 HTML 스트리밍(`renderToReadableStream`)으로 즉시 보여줄 수 있다.

---

### 2. 'use client' 경계선에서 겪은 마이그레이션 삽질들

처음 마이그레이션할 때 가장 흔히 범했던 실수가 파일 최상단에 `use client`를 아무 데나 붙이는 것이었다.

:::caution
`'use client'`는 해당 컴포넌트를 서버에서 렌더링하지 않는다는 뜻이 아니다!
서버에서 사전 HTML 렌더링을 한 후, 클라이언트 브라우저에서 **Hydration(이벤트 리스너 부착 및 상태 연결)을 수행하는 경계선(Boundary)**임을 명심해야 한다.
:::

#### 마이그레이션 이슈 사례: Context Provider 문제

Pages Router의 `_app.tsx`에서 감싸던 ThemeProvider, Redux/TanStackQuery Provider 등은 React Context API(`useState`, `useContext`)를 사용하므로 RSC인 `app/layout.tsx`에 직접 작성하면 에러가 터진다!

```tsx
// app/providers.tsx (별도 클라이언트 컴포넌트로 분리!)
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// app/layout.tsx (RSC 유지)
import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

### 3. Server Actions 도입으로 API Route 대체하기

Next.js 14에서 본격 고도화된 **Server Actions**는 API 라우트(`pages/api/*`) 작성 분량을 놀라울 정도로 줄여주었다.

이전에는 폼 제출 하나 하려면 `pages/api/submit.ts` 핸들러 만들고, 클라이언트에서 `fetch('/api/submit', { method: 'POST', body: ... })` 호출하고, 타입 정의 따로 만드는 번거로움이 있었다.

Server Actions를 사용하면 서버 함수를 컴포넌트나 서버 모듈에서 직접 호출한다.

```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function updateUsername(formData: FormData) {
  const newName = formData.get('username') as string;
  
  // DB 직접 수정 연산 수행
  await db.user.update({ where: { id: 1 }, data: { name: newName } });
  
  // RSC 캐시 갱신 (해당 경로의 서버 컴포넌트 재실행)
  revalidatePath('/profile');
}
```

```tsx
// app/profile/page.tsx (Server Component)
import { updateUsername } from '../actions';

export default function ProfilePage() {
  return (
    <form action={updateUsername}>
      <input type="text" name="username" placeholder="새 유저명" />
      <button type="submit">변경</button>
    </form>
  );
}
```

클라이언트 side JavaScript가 꺼져 있는 환경에서도 HTML `<form>` 전송으로 동작한다는 전통의 웹 표준 스타일 + Type safety까지 한 번에 잡는 경험이 진국이었다.

---

### 4. 전환 결과 비교 Summary

| 구분 | Pages Router (Next.js 12) | App Router (Next.js 14) |
| --- | --- | --- |
| **기본 아키텍처** | Client Component 중심 | **Server Component (RSC) 중심** |
| **데이터 페칭** | `getServerSideProps` / `getStaticProps` | `async/await` fetch in Component |
| **JS 번들 크기** | 페이지별 JS 번들에 노드 모듈 포함 | RSC 내 모듈은 **클라이언트 번들 0B** |
| **라우팅 구조** | `pages/index.tsx` 파일명 기반 | `app/page.tsx` 폴더 디렉터리 기반 |

---

### 마무리 / Outro

Pages Router에서 App Router로 마이그레이션하면서 처음에는 `use client` 경계 설정과 RSC 제약사항 때문에 고생을 꽤 했다.
하지만 완성 후 번들 용량이 35% 이상 감소하고 라우팅 구조가 훨씬 명확해진 것을 보니 **"마이그레이션하길 참 잘했다"** 싶다.

App Router로의 전환을 망설이고 있다면 복잡한 컴포넌트부터 차근차근 변환해보길 추천한다!
