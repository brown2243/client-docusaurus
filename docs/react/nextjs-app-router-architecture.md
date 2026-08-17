---
sidebar_position: 5
slug: /react/nextjs-app-router-architecture
title: "Next.js 12 Pages Router 대 Next.js 13~15 App Router 아키텍처 완전 분석"
description: "Pages Router 대 App Router 패러다임 전환, RSC 및 Client Component 경계, Server Actions RPC 프로토콜, Next.js 4계층 캐싱 시스템 완벽 분쇄"
---

# Next.js 12 Pages Router 대 Next.js 13~15 App Router 아키텍처 완전 분석

<br />

Next.js는 13버전(App Router 공식 도입)과 14~15버전을 거치며 단순한 React 래퍼(Wrapper) 프레임워크에서 **React Server Components(RSC)를 완벽하게 구동하기 위한 풀스택 런타임 플랫폼**으로 발전했다.

기존 Pages Router가 `getServerSideProps`나 `getStaticProps` 같은 페이지 단위 데이터 페칭에 의존했다면, App Router는 **컴포넌트 단위 비동기 렌더링과 4계층 캐싱 레이어**를 기반으로 작동한다. 이 문서에서는 두 라우터 아키텍처의 격차, 캐싱 시스템, Server Actions RPC 통신 체계를 정밀 분석한다.

---

## 1. Pages Router 대 App Router 구조적 비교

```mermaid
graph TD
    subgraph Pages Router (Next.js 12)
        P1[pages/_app.tsx] --> P2[pages/index.tsx]
        P2 -->|getServerSideProps| DB1[(Database / API)]
        P2 --> ClientBundle1[전체 페이지 JS 번들 전송 및 하이드레이션]
    end

    subgraph App Router (Next.js 13~15)
        A1[app/layout.tsx - Server] --> A2[app/page.tsx - Server Component]
        A2 -->|Direct async/await| DB2[(Database / ORM)]
        A2 --> A3[app/Counter.tsx - 'use client']
        A2 -.->|RSC Payload Stream| ClientBundle2[Client Component만 번들 전송]
    end
```

### 1.1 주요 비교 항목

| 항목 | Pages Router (`pages/`) | App Router (`app/`) |
|---|---|---|
| **기본 렌더링 주체** | Client Component (SSR 후 전체 하이드레이션) | **React Server Component (JS 번들 미포함)** |
| **데이터 페칭** | `getServerSideProps`, `getStaticProps` | 컴포넌트 내부 `async/await` 직접 호출 |
| **레이아웃 보존** | 수동 중첩 레이아웃 패턴 작성 | 폴더 구조 기반 중첩 `layout.tsx` (상태 자동 보존) |
| **스트리밍** | 제한적 (전체 HTML 생성 후 전송) | `loading.tsx` 및 `<Suspense>` 기반 즉시 점진 스트리밍 |

---

## 2. Server Component와 Client Component 경계

`'use client'` 지시문은 해당 파일이 클라이언트 전용임을 나타내는 것이 아니라, **서버-클라이언트 경계(Boundary)**를 선언하는 진입점이다.

```typescript
// app/UserProfile.tsx (Server Component)
import LikeButton from './LikeButton'; // Client Component

export default async function UserProfile({ id }: { id: string }) {
  const user = await db.user.findUnique({ where: { id } });

  return (
    <div className="profile-card">
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      {/* 클라이언트 컴포넌트에 직렬화 가능한 props 전달 */}
      <LikeButton initialCount={user.likeCount} />
    </div>
  );
}
```

---

## 3. Server Actions와 RPC 프로토콜

Server Actions는 별도의 API 라우트(`pages/api/*`)를 만들지 않고도 클라이언트 폼이나 이벤트 핸들러에서 서버 함수를 직접 호출할 수 있는 RPC 메커니즘이다.

```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
}
```
