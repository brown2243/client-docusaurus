---
slug: core-web-vitals-optimization-guide
title: Core Web Vitals 성능 최적화 실전 가이드 (LCP, INP, CLS 정복)
authors: [brown]
tags: [WebPerformance, WebVitals, LCP, INP, CLS, Frontend]
Date: 2026-06-10 15:00
---

# Core Web Vitals 성능 최적화 실전 가이드 (LCP, INP, CLS 정복)

<br />

웹 서비스 오픈을 앞두고 구글 PageSpeed Insights 점수를 돌려보았다가 경악을 금치 못했던 기억이 있다.
성능 점수가 빨간불(40점대...)로 나오고, 특히 **INP**와 **LCP**가 박살 나 있었다. (까비...)

구글 검색 랭킹 요소이자 사용자 경험의 핵심인 **Core Web Vitals (LCP, INP, CLS)** 지표를 실전에서 어떻게 튜닝하고 90점 이상 초록불로 만들었는지 실전 가이드를 정리해보았다.

<!-- truncate -->

### 1. 3대 핵심 지표(Core Web Vitals) 개념과 목표치

구글이 제시하는 사용자 경험 3대 지표는 다음과 같다.

| 지표 | 측정 대상 | 우수 기준 | 주요 원인 |
| --- | --- | --- | --- |
| **LCP (Largest Contentful Paint)** | 가장 큰 히어로 이미지/텍스트 블록의 렌더링 시간 | **`≤ 2.5s`** | 느린 서버 응답, 랜딩 이미지 용량, 렌더 차단 리소스 |
| **INP (Interaction to Next Paint)** | 사용자 클릭/키보드 입력 후 다음 화면 프레임 갱신까지 걸리는 지연 시간 | **`≤ 200ms`** | 메인 스레드를 오래 점유하는 긴 JS 작업(Long Task) |
| **CLS (Cumulative Layout Shift)** | 레이아웃 덜컹거림(의도치 않은 요소 이동)의 누적 합계 | **`≤ 0.1`** | `width`/`height` 미지정 이미지, 동적 광고/팝업 삽입 |

---

### 2. LCP 최적화: Critical Rendering Path 타격하기

LCP 개선의 핵심은 **"가장 덩치가 큰 요소(LCP Candidate)를 브라우저가 최대한 빨리 찾아내서 그리게 만드는 것"**이다.

#### 실전 조치 목록

1. **LCP 이미지에 `priority` 및 `fetchpriority="high"` 부여**
   ```html
   <!-- Next.js Image 컴포넌트인 경우 priority 속성 부여 -->
   <Image src="/hero-banner.webp" alt="Hero" width={1200} height={600} priority />
   ```
2. **Critical Rendering Path (CRP) 렌더 차단 리소스 제거**
   - Head 태그에 위치한 비필수 external CSS/JS에 `defer` 또는 `async` 부여
   - 폰트 사전 로딩 (`<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />`)

3. **이미지 포맷 modernizing (WebP / AVIF)**
   - PNG/JPEG 대비 30~50% 이상 용량을 감량해주는 AVIF 포맷 적극 활용

---

### 3. INP 최적화: Long Task 분할과 yieldToMain

FID(First Input Delay)를 대체하여 2024년부터 정식 지표가 된 **INP**는 사용자가 버튼을 눌렀을 때 반응 속도를 측정한다.

JS 메인 스레드가 50ms 이상 점유되는 작업(**Long Task**)을 실행 중이면 사용자의 이벤트 리스너가 제때 실행되지 못해 INP 점수가 감점된다.

#### 메인 스레드 쪼개기: `yieldToMain` 패턴

```javascript
// 긴 무거운 루프 작업을 메인 스레드에 양보하며 실행
function yieldToMain() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0); // microtask/macrotask 큐로 넘겨 브라우저가 UI 렌더링을 할 시간 제공!
  });
}

async function processLargeData(items) {
  for (let i = 0; i < items.length; i++) {
    doHeavyCalculation(items[i]);
    
    // 50개 단위로 메인 스레드에 제어권 양보!
    if (i % 50 === 0) {
      await yieldToMain();
    }
  }
}
```

추가로 React 18의 `useTransition`이나 `useDeferredValue`를 활용해 급하지 않은 렌더링 업데이트의 우선순위를 낮추는 것도 INP 개선에 큰 도움이 된다!

---

### 4. CLS 최적화: 레이아웃 덜컹거림 제로 만들기

CLS는 페이지가 로딩되는 동안 갑자기 이미지나 폰트가 튀어나와 텍스트 위치가 아래로 밀리는 현상이다.

#### 실전 해결법

1. **모든 `<img>` 및 `<iframe>` 태그에 explicit `width`, `height` 또는 `aspect-ratio` 설정**
   ```css
   .card-image {
     width: 100%;
     aspect-ratio: 16 / 9; /* 이미지 로딩 전에도 박스 영역 사전 확보! */
   }
   ```
2. **웹 폰트 폰트 스왑 방지 (`font-display: optional` 또는 `font-display: swap` + fallback size-adjust)**
   - 폰트가 로드된 후 글꼴 비율이 달라져 글자 줄바꿈이 이동하는 현상을 CSS `size-adjust`로 매칭!

---

### 마무리 / Outro

성능 최적화 조치를 적용한 후 Lighthouse 점수가 48점에서 **96점**으로 수직 상승한 화면을 확인했을 때의 쾌감은 정말 이루 말할 수 없었다! (한잔해🥂!)

Web Vitals 관리는 일회성 이벤트가 아니라 지속적으로 모니터링해야 하는 숙제다. 성능 개선 템플릿 잘 간직해둬야겠다.
