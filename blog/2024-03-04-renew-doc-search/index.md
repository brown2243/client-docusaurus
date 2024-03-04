---
slug: post/26
title: 블로그 개선 - Algolia Doc Search

authors: [brown]
tags: [docusaurus, DocSearch, algolia, 알고리아]
Date: 2024-03-04 15:00
---

# 블로그 개선 - algolia Doc Search

## Intro

예전에 블로그 처음 만들고, 표지도 그대로 두고 글만 썼었다.

최근에 블로그를 손 볼 마음으로 확인해보니 docusaurus 버전도 2에서 3로 올라 갔더라.

그래도 algolia Doc Search 기능은 붙여 놨었는데, 이번에 전반적으로 리뉴얼 해볼 겸 다시 붙이는 과정을 정리해보려고 한다.

## 1 docusaurus 프로젝트 생성

[docusaurus/typescript-support](https://docusaurus.io/docs/typescript-support)

해당 링크를 참조해 프로젝트를 생성해준다. 그리고 docusaurus.config.ts 부분믄 약간 수정해줘도 일단 블로그를 시작할 수 있다.

### 2. algolia 회원가입

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

### 3. 알고리아 회원가입

[algolia](https://www.algolia.com/users/sign_in)에서 회원 가입을 진행해준다.

### 4. create application

[어플리케이션을 생성해주는데](https://www.algolia.com/account/plan/create?planName=base&showSearch=true&units=100&showRecommend=false&recommendRequests=10&inCreateAppMode=true&from=dashboard)

1. app 이름 적고
2. **꼭 FREE Plan을 선택하자!!**
3. data는 샘플데이터 같은 것 넣으면 된다.
4. `index name` 은 사용하는 값이다.

### 5. API Key 체크

overview 화면에서 API Keys를 누르자

사용하는 key는 `Application ID`,`Search-Only API Key`,`Admin API Key`이다.

### 6. Data crawling

[최신 권장방식 문서](https://www.algolia.com/doc/tools/crawler/getting-started/overview/)이다.

본인은 아래의 방법을 사용했다.

**이 방식은 Legacy 입니다!**

[관련 문서](https://docsearch.algolia.com/docs/legacy/run-your-own/)

1. 이 단계에서는 도커 이미지를 통한 데이터 크롤링을 위해 `docker`, `jq`가 설치 되어 있어야 한다.

   - `brew install --cask docker`
   - `brew install jq`

2. `.env` 작성
   환경 변수를 작성해야 한다.
   ```
   APPLICATION_ID=어플아이디
   API_KEY=어드민키
   ```
3. project 최상단에 `config.json` 작성
   [참조 링크](https://github.com/algolia/docsearch-configs/blob/master/configs/docusaurus-2.json)
   `index_name`, `start_urls`,`sitemap_urls`만 본인에 맡게 변경하시라.
   ```
   {
       "index_name": "braurus", // 1
       "start_urls": ["https://braurus.dev/"], // 2
       "sitemap_urls": ["https://braurus.dev/sitemap.xml"], // 3
       "sitemap_alternate_links": true,
       "stop_urls": ["/tests"],
       "selectors": {
           "lvl0": {
           "selector": "(//ul[contains(@class,'menu__list')]//a[contains(@class, 'menu__link menu__link--sublist menu__link--active')]/text() | //nav[contains(@class, 'navbar')]//a[contains(@class, 'navbar__link--active')]/text())[last()]",
           "type": "xpath",
           "global": true,
           "default_value": "Documentation"
           },
           "lvl1": "header h1",
           "lvl2": "article h2",
           "lvl3": "article h3",
           "lvl4": "article h4",
           "lvl5": "article h5, article td:first-child",
           "lvl6": "article h6",
           "text": "article p, article li, article td:last-child"
       },
       "strip_chars": " .,;:#",
       "custom_settings": {
           "separatorsToIndex": "_",
           "attributesForFaceting": ["language", "version", "type", "docusaurus_tag"],
           "attributesToRetrieve": [
           "hierarchy",
           "content",
           "anchor",
           "url",
           "url_without_anchor",
           "type"
           ]
       }
   }
   ```
4. 스크래퍼 이미지 실행  
   `docker run -it --env-file=.env -e "CONFIG=$(cat ./config.json | jq -r tostring)" algolia/docsearch-scraper`

5. 알고리아 본인 앱 화면에 보면 데이터가 갱신 되어 있을 것이다.

### 7. `docusaurus.config.js`

[이 문서](https://docusaurus.io/ko/docs/search#using-algolia-docsearch)를 참조 하자!

```
// 본인 코드
...
algolia: {
    // 알골리아에서 제공한 appId를 사용하세요.
    appId: "BW2ZDYYT4N",
    // 공개 API 키: 커밋해도 문제가 생기지 않습니다.
    apiKey: "4a0c2546c188aacd5f5277a7a9b34896",
    indexName: "braurus",
    contextualSearch: true,
    },
...
```

---

**드디어 완성이다.**

<br />

검색기능을 붙이고 이 글을 쓰기까지 생각보다 시간이 걸렸지만, 누가 볼 수도 있다고 생각하니 살짝 기대 된다.
<br />

---

### Reference

- **https://younho9.dev/docusaurus-manage-docs-2**
- https://www.whatap.io/ko/blog/67/
