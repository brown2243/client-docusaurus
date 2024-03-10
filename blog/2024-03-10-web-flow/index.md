---
slug: web-flow
title: 웹 개발 전반적인 흐름

authors: [brown]
tags: []
Date: 2024-03-10 15:00
---

# 웹 개발 전반적인 흐름

## Intro

**월드 와이드 웹(World Wide Web)**이란 인터넷에 연결된 사용자들이 **서로의 정보를 공유할 수 있는 공간**이라고 한다.

브라우저는 url로 해당 하는 서버에서 네트워크를 통해 html문서, 필요한 파일들을 받아와 내 화면에서 보여주는 역활을 한다.

그리고 프론트엔드 개발자의 역활은 어떤 기술을 사용하든 결국 **서버에서 제공해줄 `html`,`css`,`js`를 작성**하는 것이다.

js는 nextjs typscript로 컴포넌트별로 파일을 다 쪼개서 개발해도, 결국 사용자가 받는 파일은 트랜스파일링, 모듈번들링된 하나의 파일인 것이다.

우리가 작성한 파일이 사용자에게 가기까지의 긴 여정을 정리해보자.

<!-- truncate -->

## 브라우저에서 특정 사이트를 보여주는 프로세스

프론트엔드 기술면접 예상 질문에 단골인 *구글을 검색하면 웹은 무슨일을 할까*의 프로세스이다.

사용자에게 사이트를 보여주려면 브라우저는 사이트를 호스팅하는 서버를 찾아야 한다. 인터넷의 각 디바이스들은 `IP address`라는 고유한 주소를 가지는데, 서버를 찾는다는 건 해당 서버의 ip주소를 찾는다는 뜻이다.

> IPv4: 4개의 8비트(0 ~ 255)숫자로 구성, ex)192.0.2.1 최대 제공가능: 2 ** 32(대략 43억)
> IPv6: 8개의 16비트를 16진수로 구성,ex)2001:0DB8:0000:0000:0000:0000:1428:57ab 최대 제공가능:2 ** 128(거의 무제한)

하지만 우리는 이런 `IP 주소`를 입력하지 않는다. `domain` or `URL`을 입력한다.

잠깐 여기서 `domain`과 `URL`를 차이를 짚고 가자. 예제는 구글로 간다.

`domain`은 `서브도메인(subdomain)`, `이름(name)`, `최상위 도메인(TLD)`으로 나뉜다.

`www.google.com`은 도메인이다.

- "www"는 서브도메인 | 차상위도메인
  - 일반적으로 "world wide web"의 약자
  - 도메인 앞에 확장자로 서로 다른 서버를 가르킬 수 있음 `ex)_drive.google.com`
- "google"은 도메인의 이름 - 웹사이트를 운영하는 주체
- "com"은 최상위 도메인

  - 다양한 유형이 있음 `.com: company(상업용, 회사)`,`.net: network(네트워크 관련)`...

  여기서 `DNS(domain name system)`가 등장한다.

### 1. docusaurus 프로젝트 생성

[docusaurus/typescript-support](https://docusaurus.io/docs/typescript-support)

해당 링크를 참조해 프로젝트를 생성해준다. `docusaurus.config.ts`를 약간 수정해줘도 나만의 블로그를 시작할 수 있다.

### 2. doc search 신청 & algolia 회원가입

[docsearch]https://docsearch.algolia.com/apply/ 해당 링크에서 프로그램 조인을 하고

[algolia](https://www.algolia.com/) 접속해서 가입을 해주자.

무료플랜은 아래와 같다.

> Your first 1,000,000 records are free, and every month you'll receive 10,000 search requests and 10,000 recommend requests.

아래 내용도 참고하자.

> The Algolia Build plan is your Search & Discovery playground.
> It's not intended for production projects.
> **If your project is live, you'll need to display the Algolia Logo next to the search results** or upgrade to the Algolia Grow plan.

### 3. 도큐사우러스 doc search 문서 참조

아래 문서를 참조하여 순서대로 따라가자.

[search#using-algolia-docsearch](https://docusaurus.io/docs/search#using-algolia-docsearch)

1. 플러그인 설치 `npm install --save @docusaurus/theme-search-algolia`
2. config 설정 붙여넣기
   1. @docusaurus/preset-classic에 알고리아가 포함 돠어 있기 때문에 themeConfig에 algolia 관련 설정만 넣으면 됌
   2. 알고리아 앱 대시보드 API Keys 섹션
      1. Application ID
      2. Search-Only API Key
   3. 알고리아 앱 대시보드 search 섹션
      1. Index
   4. Application ID,Search-Only API Key, Index name을 config에 추가하기
3. 프로젝트 실행
   프로젝트 실행시, 알고리아 검색탭이 생성된 걸 볼 수 있다. 하지만 데이터가 크롤링 되지 않아, 사용은 할 수 없다.

### 4. 알고리아 크롤링

문서를 살펴보면 알고리아 크롤러를 사용하는게 권장하는 방식인것 같은데 무료요금제에서는 지원을 하지 않는다 ^^...

이 시점에서 포스트를 접어야하나 고민하다, [run-your-own](https://docsearch.algolia.com/docs/legacy/run-your-own/) 해당 방식으로 진행 해보겠다.

1. `.env`, 루트에 생성
   1. 여기 들어갈 api key는 `Admin API Key`로 공개되지 않게 할 것
2. `config.json`, 루트에 생성 - [config-file 참조 링크](https://docsearch.algolia.com/docs/legacy/config-file)
3. `jq`, `docker` 없으면 설치
4. 스크래퍼 실행 `docker run -it --env-file=.env -e "CONFIG=$(cat ./config.json | jq -r tostring)" algolia/docsearch-scraper`
   1. start_urls에 등록된 url로 데이터를 긁어 알고리아 인덱스에 저장
5. **검색 기능 on!!!**

![search-test](search-test.png)

이렇게 스크래핑까지 진행해주면, 기본 doc search 기능은 완성이다.

다만 **프로덕션에 배포가 마무리 된 후에, 스크래핑을 진행해야 최신 포스트까지 알고리아 index에 넣을 수 있다는 점** 유의하자.
