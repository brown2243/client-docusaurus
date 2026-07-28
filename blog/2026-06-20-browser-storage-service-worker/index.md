---
slug: browser-storage-and-service-worker-pwa
title: 브라우저 스토리지 비교와 Service Worker 활용 PWA 캐싱 전략
authors: [brown]
tags: [Browser, PWA, ServiceWorker, Storage, WebAPI]
Date: 2026-06-20 17:00
---

# 브라우저 스토리지 비교와 Service Worker 활용 PWA 캐싱 전략

<br />

웹 앱을 개발하다 보니 오프라인 환경에서도 동작하는 웹 앱(PWA) 요구사항을 만났다.
클라이언트 쪽에 데이터를 저장하려고 보니 **LocalStorage, IndexedDB, Cache API** 등 선택지가 너무 많았다.

듣다보니 각각의 용도와 성능 한계가 명확하길래 정리해보고, **Service Worker**를 활용한 캐싱 전략까지 함께 정리해보았다.

<!-- truncate -->

### 1. 브라우저 스토리지 3대장 비교

클라이언트 데이터 저장을 위한 기술 3가지의 특징과 차이점이다.

| 구분 | LocalStorage / SessionStorage | IndexedDB | Cache API |
| --- | --- | --- | --- |
| **데이터 유형** | **Key-Value (String)** | **NoSQL Object Store (Structured)** | **Request / Response 객체 쌍** |
| **용량 제한** | ~5MB (아주 작음!) | 보통 디스크 공간의 **50% 이상** | 보통 디스크 공간의 **50% 이상** |
| **API 방식** | **동기식(Synchronous)** (메인스레드 블로킹!) | 비동기식(Asynchronous) (IDBRequest/Promise) | 비동기식(Asynchronous) (Promise 기반) |
| **Service Worker 접근** | ❌ 접근 불가 | **⭕ 접근 가능** | **⭕ 접근 가능** |
| **주 사용처** | 간단한 토큰, 사용자 탭 설정 | 대용량 Structured Data, 오프라인 데이터베이스 | **네트워크 요청/응답(HTML, JS, Image) 캐싱** |

:::caution
LocalStorage는 동기식(Synchronous) API이기 때문에 크기가 큰 JSON 문자열을 `JSON.parse`하여 자주 읽고 쓰면 메인 스레드가 순간적으로 멈칫거린다. 
대용량 데이터 저장은 망설임 없이 **IndexedDB**로 넘어가야 한다!
:::

---

### 2. Service Worker 생명주기(Lifecycle)와 제어 원리

Service Worker는 웹 페이지와 독립된 **웹 워커(Web Worker)** 환경에서 동작하며, 네트워크 요청을 중간에서 가로채는(Intercept) 프록시 역할을 수행한다.

```
[웹 페이지] ---> fetch('/api/data') ---> [Service Worker (Fetch Event)]
                                              |
                                              +-- Cache Hit? -> [Cache API] 응답! (오프라인 OK)
                                              |
                                              +-- Cache Miss? -> [실제 백엔드 서버] 요청!
```

#### Service Worker 생명주기 3단계

1. **Install (설치)**: 캐시 공간(`caches.open`)을 생성하고 정적 리소스(HTML, JS, CSS)를 사전 저장. `skipWaiting()`으로 즉시 활성화 가능.
2. **Activate (활성화)**: 이전 버전의 구 캐시 항목 제거 cleanup 작업 수행. `clients.claim()`으로 열려있는 페이지 제어권 즉시 확보.
3. **Fetch (수행)**: 페이지의 모든 네트워크 요청을 낚아채 캐싱 전략 적용.

---

### 3. Service Worker 실전 캐싱 전략 3선

Workbox 라이브러리나 순수 JS로 구현할 때 상황에 맞춰 선택하는 캐싱 패턴들이다.

#### A. Cache First (Cache Falling Back to Network)
- **적용 대상**: 폰트, 이미지, 빌드 타임 해시가 포함된 JS/CSS 정적 파일
- **동작**: 캐시에서 먼저 찾고, 없으면 네트워크로 가서 가져온 뒤 캐시에 저장.

#### B. Network First (Network Falling Back to Cache)
- **적용 대상**: 최신성이 매우 중요한 게시판 목록, 실시간 상태 API
- **동작**: 네트워크 요청을 먼저 시도하고, 네트워크 에러(오프라인) 발생 시 저장되어 있던 이전 캐시 반환.

#### C. Stale-While-Revalidate (SWR)
- **적용 대상**: 자주 업데이트되지만 즉각적인 반응성이 필요한 아바타 프로필, 블로그 글
- **동작**: 캐시 데이터를 즉시 화면에 반환하고, 백그라운드에서 네트워크 요청을 보내 캐시를 최신 상태로 업데이트!

```javascript
// Stale-While-Revalidate 구현 코드 (Service Worker fetch 이벤트)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('dynamic-cache-v1').then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      
      // 백그라운드 네트워크 페칭 수행
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      });

      // 캐시가 있으면 캐시 즉시 리턴, 없으면 네트워크 응답 대기
      return cachedResponse || fetchPromise;
    })
  );
});
```

---

### 마무리 / Outro

LocalStorage에 의존하던 습관에서 벗어나 **IndexedDB**와 **Cache API**, **Service Worker**의 삼각 편대를 조합해보니 브라우저 안에서 정말 강력한 오프라인 웹 앱을 만들 수 있었다.

네트워크가 연결되지 않은 비행기 안에서도 쌩쌩하게 터지는 PWA 서비스를 만드는 그날까지! 고고!
