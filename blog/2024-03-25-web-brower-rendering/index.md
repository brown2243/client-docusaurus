---
slug: web-brower-rendering
title: 웹 브라우저 렌더링

authors: [brown]
tags: [browser, chrome, navigation, rendering pipeline, reflow, repaint]
Date: 2024-03-25 18:00
endDate: 2024-03-29 03:00
---

# 웹 브라우저 렌더링

## Intro

[지난 게시글](https://braurus.dev/web-request-and-receive)에서는 클라이언트에게 전달되는 콘텐츠(`HTML`, `CSS`, `JS`)가 어떤 과정을 거쳐 현재의 모습으로 발전해 왔는지 알아봤다.

그러니 이번 주제는 자연스럽게 서버에서 전달 받은 `HTML 문서`를 브라우저가 어떻게 그려내는지(`rendering`)일 것이다.

바로 시작하자.

<!-- truncate -->

## 브라우저의 개념

> 웹 브라우저란 웹에서 정보를 탐색하고 HTML 문서, 이미지 등 여러 콘텐츠를 우리에게 표현해주는 소프트웨어

파인더(탐색기)가 파일 시스템을 통해 내 컴퓨터에 저장된 파일들에 접근할 수 있는 것처럼, 웹 브라우저는 **인터넷을 통해 웹 서버에 저장된 파일들에 접근**할 수 있게 해준다.

:::caution
네트워크: 네트워크는 두 대 이상의 컴퓨터 또는 장치가 서로 연결되어 데이터를 주고받을 수 있는 통신 시스템
ex) LAN(Local Area Network), MAN(Metropolitan Area Network), WAN(Wide Area Network)

인터넷: 전 세계적으로 연결된 컴퓨터 네트워크들의 네트워크(가장 큰 규모의 네트워크)
:::

## 크롬 아키텍쳐

브라우저라는 소프트웨어를 어떻게 구축할지는 개발자의 재량이니, 가장 메인인 크롬 브라우저의 아키텍쳐를 살펴 보겠다.
크롬은 **멀티 프로세스 소프트웨어**로 다음과 같은 주요 프로세스들이 있다.

- Browser 프로세스
  - 주소 표시줄, 북마크, 뒤로 및 앞으로 버튼을 포함한(사용자 인터페이스) "chrome" 전체를 제어
  - 다른 프로세스들을 관리
  - 네트워크 요청 및 파일 액세스와 같은 영역 처리
- Renderer 프로세스
  - 웹사이트가 표시되는 탭 내부의 모든 것을 제어합니다.
- Plugin 프로세스
  - 웹 사이트에서 사용하는 모든 플러그인(flash, media, music...)을 제어합니다.
- GPU 프로세스
  - 다른 프로세스와 격리된 상태에서 GPU 작업을 처리합니다.
  - GPU는 여러 앱에서 요청을 처리하여 동일한 표면에 그리므로 다른 프로세스로 분리됩니다.

그외 extension process, utility process와 같은 더 많은 프로세스가 있다. More Tools에 Task Manager 클릭하면 확인가능

### Chrome의 멀티 프로세스 구조의 장점

1. Chrome은 탭마다 기본적으로 각각 렌더러 프로세스 생성해서 사용하는데 이는 한 탭이 응답하지 않더라도 응답하지 않는 탭을 닫고 다른 탭을 계속 실행하면서 진행할 수 있게 해준다.
2. 브라우저의 작업을 여러 프로세스로 분리하는 또 다른 이점은 보안과 샌드박싱이다.
   1. 운영 체제는 프로세스의 권한을 제한하는 방법을 제공하므로 브라우저는 특정 프로세스를 특정 기능으로부터 샌드박싱가능(보호된 영역에서 동작해 시스템이 부정하게 조작되는 것을 막는 보안 형태)
   2. Chrome 브라우저는 렌더러 프로세스와 같은 임의 사용자 입력을 처리하는 프로세스에 대한 임의 파일 액세스를 제한한다.

### 메모리 사용량을 줄이기 위한 노력

process로 탭을 관리하는 것은 thread로 관리하는 것보다 메모리 사용량이 더 많을 수 밖에 없다.

> 1. 프로세스 생성 오버헤드: 새로운 프로세스를 생성하는 것은 쓰레드를 생성하는 것 보다 상대적으로 많은 시스템 자원을 필요
> 2. 프로세스 간 메모리 공유 제한: 각 프로세스는 독립적인 메모리 공간을 가지고 있어, 다른 프로세스의 메모리에 직접 접근할 수 없음
> 3. 프로세스 간 통신 오버헤드: 위의 이유로 프로세스 간 통신(IPC)이 필요
>
>    > IPC는 메모리 공유, 파이프, 소켓 등의 방법을 사용하는데, 이는 추가적인 메모리 사용을 유발 <br />
>    > 반면, 스레드는 같은 프로세스 내에서 메모리를 공유

그렇기에 메모리를 절약하기 위해 Chrome은 생성할 수 있는 프로세스 수에 제한을 둔다. 장치의 메모리와 CPU 성능에 따라 Chrome이 메모리 제한에 도달하면 동일한 사이트에서 여러 탭을 하나의 프로세스에서 실행한다.

또한 Chrome은 브라우저 프로그램의 각 부분을 서비스로 실행하여 다른 프로세스로 분할하거나 하나로 통합할 수 있는 아키텍처 변경을 진행 중인데, Chrome이 강력한 하드웨어에서 실행될 때는 각 서비스를 다른 프로세스로 분할하여 더 많은 안정성을 제공하지만, 리소스가 제한된 장치에서는 Chrome이 서비스를 하나의 프로세스로 통합하여 메모리 사용량을 절약한다는 아이디어를 바탕으로 한다.

## 탐색(navigation)

이번엔 **사용자가 사이트를 요청하고 브라우저가 페이지를 렌더링할 준비를 하는 부분**, 즉 **탐색(navigation)에 집중**해보자.

**탭 외부의 모든 것은 브라우저 프로세스에서 처리한다**.

브라우저 프로세스에는 UI 스레드, 네트워크 스레드, 스토리지 스레드 등이 있고 주소 표시줄에 URL을 입력하면, 브라우저 프로세스의 UI 스레드가 입력을 처리한다.

- UI 스레드: 브라우저의 버튼과 입력 필드를 관리
- 네트워크 스레드: 인터넷에서 데이터를 수신하기 위한 네트워크 스택을 다룸
- 스토리지 스레드: 파일 접근을 제어

### 탐색의 전반적인 흐름

1. 사용자가 주소 표시줄에 입력
   1. UI 스레드에서 해당 입력값이 검색인지, url인지 판단
   2. URL로 판단된 경우, UI 스레드는 해당 URL로 http 요청
   3. 검색 쿼리로 판단된 경우, UI 스레드는 기본 설정된 검색 엔진에 해당 쿼리를 담아 http 요청(https://www.google.com/search?q=test)
2. [탐색 시작](https://braurus.dev/web-request-and-receive#dnsdomain-name-system)
   1. UI 스레드가 탭 모서리에 로딩 스피너가 표시
   2. 네트워크 스레드는 DNS 조회 및 요청에 대한 TLS 연결 설정과 같은 적절한 프로토콜을 수행
   3. 네트워크 응답에는 시간이 걸리므로 **UI 스레드는 네트워크 요청과 병렬로 렌더러 프로세스를 사전에 찾거나 새 프로세스 시작 요청**
3. 응답 읽기

   1. 네트워크 스레드가 서버로부터 응답을 받기 시작할 때, **응답 본문(페이로드)이 도착하기 전에 response header를 먼저 받음**
   2. 응답 헤더에는 Content-Type 필드가 포함되어 있는데, 이는 서버가 보내는 데이터의 MIME 유형
      - MIME 유형은 서버가 클라이언트에게 전송하는 컨텐츠의 종류를 알려주는 메타데이터(metadata)
      - 브라우저는 이를 기반으로 데이터의 형식과 구조를 식별하여 적절하게 처리하거나 렌더링함
   3. 응답 본문(페이로드)이 들어오기 시작하면, **서버 측에서 Content-Type을 누락하거나 잘못 지정하는 경우를 고려해 MIME type sniffing을 수행**
      - MIME 유형 스니핑이란, 브라우저가 응답 본문의 실제 데이터를 살펴보고 해당 데이터의 유형을 추측하는 과정
      - 네트워크 스레드는 응답 본문의 첫 몇 바이트를 검사하여 데이터의 특징을 파악하고, 이를 기반으로 MIME 유형을 추론
   4. 안전 브라우징(SafeBrowsing) 검사도 이 단계에서 수행

      - 도메인과 응답 데이터가 알려진 악성 사이트와 일치하는 것으로 보이면, 네트워크 스레드는 경고 페이지를 표시하도록 알림
      - 허용되지 않은 타 도메인의 리소스가 렌더러 프로세스에 도달하지 않도록 교차 출처 읽기 차단(CORB) 검사가 수행

4. 응답이 HTML 파일이면 브라우저 프로세스에서 IPC를 통해 데이터와 데이터 스트림을 렌더러 프로세스로 전달
   - zip 파일이나 다른 파일이라면 다운로드 요청을 의미하므로 다운로드 관리자에 데이터를 전달
5. 브라우저 프로세스에서 IPC를 통해 렌더러 프로세스로 데이터, 데이터 스트림 전송, 탐색 마무리(commit) 지시
6. 렌더러 프로세스에서 브라우저 프로세스로부터 전달받은 탐색 마무리(commit) 지시를 받은 후, 탐색 마무리 완료 메시지를 브라우저 프로세스에 전달
   - 렌더러 프로세스에 html 문서와 데이터 스트림을 넘기는 것까지가 탐색의 과정
7. 탐색이 완료되고 문서 로딩 단계가 시작
   - 이 시점에서 주소 표시줄이 업데이트되고, UI에서 새 페이지의 사이트 정보를 반영
   - history에 반영되어 앞으로가기/뒤로가기로 접근가능

탐색이 완료 된 후, 렌더러 프로세스는 리소스 로딩을 계속하고 페이지를 렌더링한다.

렌더러 프로세스가 렌더링을 완료하면, 브라우저 프로세스에 이를 전달한다(이 시점에서 UI 스레드는 탭의 로딩 스피너를 중지).

이 시점(초기로딩) 이후에도 JavaScript로 새로운 뷰를 렌더링할 수 있다.

## 렌더러 프로세스의 내부동작

위의 내용은 탐색이 어떻게 동작하는지에 관한 내용이었다. 렌더러 프로세스가 html 문서와 추가적인 내용을 전달 받기위한 데이터 스트림을 전달 받은 후, 사용자가 볼 수 있게 화면에 그려주는 과정을 알아보자!

렌더러 프로세스는 메인 쓰레드, 컴포지터 스레드, 래스터 스레드로 나뉜다.

- 메인 스레드에서 HTML parser, preload scanner, rendering engine, js engine등이 동작
- 컴포지터 스레드: 래스터화 된 레이어들을 합성
- 래스터 스레드: 레이어를 래스터화

### 렌더링 엔진

> 렌더링 엔진(rendering engine) 은 화면에 텍스트와 이미지를 그리는 소프트웨어입니다.
> 엔진은 문서 (종종 HTML)에서 구조화된 텍스트를, 그리고 주어진 선언에 따라 적절한 형식 (종종 CSS에 제공됨)을 지정합니다.
> https://developer.mozilla.org/ko/docs/Glossary/Rendering_engine

대표적인 렌더링 엔진들이다.

- Webkit
  - 애플에서 개발한 오픈 소스 렌더링 엔진
  - safari
  - JSC(JavaScriptCore)
- Gecko
  - 모질라에서 개발한 오픈 소스 렌더링 엔진
  - firefox
  - SpiderMonkey
- Blink
  - 구글은 웹킷을 포크하여 개발
  - chrome, opera
  - V8

### 렌더링 파이프라인

#### 1. DOM(Document Object Model) 트리 구축

- HTML 표준을 준수하는 파서가 HTML 문서를 파싱하여 DOM으로 변환

- Subresource loading(하위 자원 로드)

  - 프리로드 스캐너는 HTML 파서가 생성한 토큰을 기반으로 동작
  - HTML 파서가 생성한 토큰을 관찰하다가 `<img>`나 `<link>` 같은 태그를 발견시, 해당 리소스에 대한 요청을 브라우저 프로세스의 네트워크 스레드로 전송
  - `<link rel="preload">`는 현재 탐색에 해당 자원이 확실히 필요하며 가능한 한 빨리 다운로드하고 싶다는 것을 브라우저에 알리는 방법

- script 태그 발견 시, HTML 문서의 파싱을 일시 중지하고 JavaScript 코드를 로드, 파싱 및 실행
  - 이는 js는 문서 구조를 변경할 수 있기 때문
  - async나 defer 키워드 사용 시, 비동기적으로 로드하고 실행하며 파싱을 차단하지 않음

#### 2. CSSOM(CSS Object Model) 트리 구축

CSSOM은 CSS 규칙과 선택자의 계층 구조를 나타내는 트리 구조로 이를 기반으로 각 DOM 노드에 적용될 스타일을 계산한다.

#### 3. Render Tree 구축

Render Tree는 DOM 트리와 CSSOM 트리를 결합하여 생성되는 트리 구조

1. DOM 트리의 각 노드를 순회하면서 해당 노드에 적용되는 CSSOM 규칙을 확인
2. 화면에 표시되지 않는 노드(display: none 등)는 Render Tree에서 제외
3. 각 노드의 스타일 속성을 계산하여 렌더 객체(renderer, render object)를 생성
4. Render Tree 완성

- Render Tree에서 제외되는 노드의 유형
  - display: none 속성이 적용된 노드
  - 비시각적 DOM 요소
    - `<script>`,`<meta>`, `<title>`, `<link>`,`<style>`등등 태그
  - hidden, opacity:0 속성 적용 된 노드는 렌더트리에 포함

#### 4. Layout

기기의 viewport와 Render Tree를 기반으로 노드들의 정확한 위치와 크기를 계산하는 단계

- CSS의 박스 모델, 플로팅, 포지셔닝, 마진, 패딩 등의 속성을 고려하여 노드들의 위치를 계산
- 텍스트의 줄 바꿈, 이미지의 크기 조정, 테이블 셀의 크기 계산 등도 이 단계에서 처리

Layout 단계를 통해 Render Tree의 각 노드는 화면 상에서의 정확한 위치와 크기 정보를 가지게 된다.

#### 5. Layer tree 구축

레이어 트리는 효율적인 컴포지팅을 위해 레이어를 분리하는 것이다.

![layers](layers.png)
레이어 프로모션 조건을 만족하는 노드는 자식 노드를 포함하여 새로운 레이어로 승격 된다.

- position: fixed or sticky
- z-index 속성이 적용된 경우
- opacity 속성이 1보다 작은 경우
- transform, filter, mask, clip-path 속성이 적용된 경우

레이어 트리는 z-index 순서에 따라 레이어들을 정렬한다.

브라우저는 레이어 트리를 최적화하여 불필요한 레이어 생성을 최소화한다.

- 작은 크기의 레이어나 내용이 없는 빈 레이어는 제거되거나 병합될 수 있음
- 이를 통해 메모리 사용량을 줄이고 컴포지팅 성능을 향상시킴

#### 6. Painting

메인 스레드에서의 페인팅은 레이어 단위로 수행되며, 레이어에 속한 각 노드들의 시각적 속성(색상, 배경, 테두리 등)에 관한 페인트 레코드를 생성한다.

생성된 페인트 레코드는 해당 레이어를 레스터화할 때 사용된다.

여기까지가 렌더러 프로세스 메인쓰레드에서 진행된다. 그리고 레이어들의 정보를 컴포지터 스레드로 전달한다.

렌더링 파이프라인에서 **가장 중요한 점은 각 단계에서 이전 작업의 결과가 새로운 데이터를 만드는 데 사용된다는 것**인데, 예를 들어, 레이아웃 트리의 어떤 것이 변경되면 문서의 영향을 받는 부분에 대해 페인트 순서를 다시 생성해야 한다.

페인팅까지의 렌더링 파이프라인동작과 자바스크립트 실행은 메인 쓰레드에서 교대로 실행된다. 예를 들어, 자바스크립트 코드가 실행되는 동안에는 렌더링 작업이 중단되고, 자바스크립트 작업이 완료되면 렌더링 작업이 다시 시작되는 것이다.

그러니 js로 애니메이션을 구현한다면 [`requestAnimationFrame` api](https://inpa.tistory.com/entry/%F0%9F%8C%90-requestAnimationFrame-%EA%B0%80%EC%9D%B4%EB%93%9C)를 사용하자.

#### 7. Composition

1. 컴포지터 스레드는 전달받은 각 레이어들을 래스터화 하는데, 레이어는 페이지 전체 길이만큼 클 수 있으므로, 이를 타일로 나누고 각 타일을 래스터 스레드로 보낸다.

2. 래스터 스레드는 각 타일을 래스터화하여 GPU 메모리에 저장한다.

   - 컴포지터 스레드는 뷰포트 내부(또는 근처)의 것을 먼저 래스터화할 수 있도록 다양한 래스터 스레드의 우선순위를 지정할 수 있다.

3. 타일이 래스터화되면, 컴포지터 스레드는 draw quad라고 하는 타일 정보를 수집하여 컴포지터 프레임을 생성

   - Draw quad: 페이지 합성을 고려하여 타일의 메모리 위치와 페이지의 어디에 타일을 그릴지에 대한 정보를 포함
   - 컴포지터 프레임: 페이지의 한 프레임을 나타내는 draw quad의 모음

4. 컴포지터 프레임은 IPC를 통해 브라우저 프로세스로 제출

컴포지팅의 이점은 메인 스레드를 거치지 않고 수행된다는 것이다. 컴포지터 스레드는 스타일 계산이나 JavaScript 실행을 기다릴 필요가 없다.

레이아웃이나 페인트를 다시 계산해야 한다면 메인 스레드가 관여해야 하므로, [컴포지팅 전용 애니메이션](https://web.dev/articles/animations-guide?hl=ko)이 성능상 유리하다.

### Reflow, Repaint

렌더링 파이프라인은 HTML, CSS 파싱 → 렌더 트리 구축 → 레이아웃 → 레이어 트리 구축 -> 페인팅 → 컴포지팅 순으로 동작한다.

최초 렌더링이 완료된 후, 사용자 인터랙션이나 해당 페이지에 따라 화면이 변경 될 경우 렌더 트리가 업데이트 되어야 한다.

#### Reflow

이 경우를 Reflow, Repaint 두가지로 나누는데 Reflow는 layout 단계부터 실행 되는 것, Repaint는 페인팅 단계부터 실행 되는 것을 의미한다.

만약 `height` 속성을 이용한 애니메이션을 구현한다면, reflow가 발생한다.
반면에 `transform` 속성을 이용한 애니메이션이라면 컴포지팅과정만 필요한 것이다.

렌더링 파이프라인 앞단에 영향을 미칠수록 비용이 비싼 것이다.

Reflow가 발생하면 브라우저는 렌더 트리를 순회하며 변경된 요소와 그 자손 요소들의 위치와 크기를 다시 계산하고 계산된 값을 기반으로 렌더 트리를 업데이트한다.

- 브라우저 창의 크기 변경, 폰트 변경, 스타일시트 추가 또는 제거 등의 전역적인 변경
- 노드의 추가, 제거, 위치 변경, 크기 변경

#### Repaint

Repaint 요소의 시각적인 스타일(색상, 배경, 테두리 등)이 변경되었을 때 해당 요소를 다시 그리는 것이다.

Repaint는 화면에 가시성이 변하지만 레이아웃에 영향을 미치지 않는 요소의 외관(background-color, color...)을 변경할 때 발생한다.

- reflow 발생 시
- 가시성이 변하지만 레이아웃에 영향을 미치지 않는 요소의 외관(background-color, color...)을 변경할 때 발생

[csstriggers](https://csstriggers.com/)는 reflow, repaint, recomposition 을 유발하는 속성을 정리한 사이트다.

리플로우와 리페인트는 웹 페이지의 성능에 큰 영향을 미치므로, 개발자는 불필요한 리플로우와 리페인트를 최소화하자.

## outro

굉장히 방대한 내용이었고, 사실 [해당 시리즈](https://developer.chrome.com/blog/inside-browser-part1)의 번역본에 가깝다고 생각한다.

다음에는 웹 성능 최적화와 관련해 포스트를 작성 해야겠다.

reflow, repaint 및 웹 성능 최적화 관련한 내용들이 react rerendering 최적화 신경 쓰는 것보다 훨씬 효율이 좋을 것이다.

### 참조

- https://developer.chrome.com/blog/inside-browser-part1
- https://developer.chrome.com/blog/inside-browser-part2
- https://developer.chrome.com/blog/inside-browser-part3
- https://developer.chrome.com/blog/inside-browser-part4
- https://web.dev/explore/fast?hl=ko#prioritize-resources
- https://d2.naver.com/helloworld/59361
- https://onlydev.tistory.com/9
- https://12bme.tistory.com/140
