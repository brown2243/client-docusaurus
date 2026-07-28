---
sidebar_position: 1
slug: /react/react-router
description: spa-routing-history-api-react-router
---

# Client-Side SPA Routing과 React Router 동작 원리

단일 페이지 애플리케이션(SPA - Single Page Application)에서 브라우저의 전체 페이지 새로고침 없이 URL 경로(Path) 변경에 따라 컴포넌트를 동적으로 교체하는 원리와 React Router의 구조를 정리한다.

---

## 1. SPA 라우팅의 핵심: HTML5 History API

서버로 HTTP 요청을 다시 보내지 않고 브라우저의 URL 주소창만 변경하기 위해 **HTML5 History API**를 활용한다.

### 핵심 API 메서드

1. `history.pushState(state, title, url)`: 브라우저 히스토리 스택에 새 세션을 추가하고 URL 변경 (페이지 이동 없이 주소만 변경됨).
2. `history.replaceState(state, title, url)`: 현재 히스토리 에세션을 덮어씀.
3. `window.addEventListener('popstate', callback)`: 뒤로가기 / 앞으로가기 버튼 클릭 시 이벤트 감지.

```javascript
// 커스텀 라우팅 구현 원리 예시
function navigate(url) {
  // 1. 브라우저 주소 변경 (새로고침 안됨)
  window.history.pushState({}, '', url);

  // 2. 라우터 상태 업데이트 함수 호출 -> React 컴포넌트 리렌더링 유발
  renderCurrentRoute();
}

// <a> 태그 클릭 시 기본 동작 방지 필수
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    navigate(e.target.getAttribute('href'));
  }
});
```

---

## 2. React Router v6 내부 구조

React Router는 React의 `Context API`와 `History Library`를 결합하여 URL에 알맞은 컴포넌트 트리를 구성한다.

```text
[Browser Navigation Event] -> [History Listener] -> [Router Provider Context] -> [Routes Matching] -> [Component Render]
```

### 주요 구성 컴포넌트

- `<BrowserRouter>`: HTML5 History API를 연결하는 최상위 Context Provider.
- `<Routes>`: 하위 `<Route>` 목록 중 현재 URL `location`과 패턴 매칭되는 최적의 노드를 탐색 (v6부터 서치 알고리즘 개선).
- `<Route path="..." element={<MyComponent />} />`: 경로 패턴과 매핑되는 UI 지정.
- `useNavigate()`: 프로그래밍 방식으로 경로 이동을 수행하는 Custom Hook.

---

## 3. Client-Side Routing 시 웹 서버(Nginx/Vercel) 필수 설정

SPA 라우터는 브라우저 내부에서 작동하므로, 만약 사용자가 `https://my-app.com/dashboard` 주소를 직접 입력하거나 새로고침하면 **웹 서버는 해당 경로의 실제 HTML 파일을 찾지 못해 404 Not Found 에러**를 반환한다.

따라서 웹 서버에 **모든 비정적 파일 요청을 `index.html`로 폴백(Fallback)**시키는 설정이 필수적이다.

```nginx
# Nginx SPA 라우팅 폴백 설정
location / {
    try_files $uri $uri/ /index.html;
}
```

## 참조

- https://developer.mozilla.org/ko/docs/Web/API/History_API
- https://reactrouter.com/en/main
