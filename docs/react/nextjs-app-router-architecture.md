---
sidebar_position: 5
slug: /react/nextjs-app-router-architecture
title: Next.js 12 Pages Router 대 Next.js 13~15 App Router 아키텍처 완전 분석
description: Pages Router 대 App Router 패러다임 전환, RSC 및 Client Component 경계, Server Actions RPC 프로토콜, Next.js 4계층 캐싱 시스템 완벽 분쇄
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

| 항목                 | Pages Router (`pages/`)                     | App Router (`app/`)                             |
| -------------------- | ------------------------------------------- | ----------------------------------------------- |
| **기본 렌더링 주체** | Client Component (SSR 후 전체 하이드레이션) | **React Server Component (JS 번들 포함 안 됨)** |
| **데이터 페칭**      | `getServerSideProps`, `getStaticProps` (    |

<truncated 6027 bytes>
