---
slug: post
title: 개발자 1주년 회고 및 주 회고 시작
authors: [brown]
tags: [hello, motivation]
---

## 1주년 회고

생각해보면 정말 많은 일이 있었습니다.

2020년 6월부터 개발 공부를 시작해서 1년 간 정말 열심히 공부했고,
운이 좋아서 2021년 코인 거래소 관련 스타트업에 FE 개발자로 취업 했습니다.

- 이벤트페이지의 일부를 작업해서 처음으로 배포되는 서비스에 기여
- 수익률 html 캡쳐 기능(clipboardAPI)
- 트레이딩 뷰 차트의 스크롤 로딩 구현
  - 그 당시, 한번만 요청하고 추가적인 요청을 넣지 않았음
- 거래화면 UI 개편
- 인증 관련 토큰 리프레쉬 로직 수정
  - 기존의 로직은 토큰을 리프레쉬하기 힘들었음
  - 사용자가 특정 시간이 지난 후, 유효한 토큰(access)을 사용하고 있을 때, 토큰을 리프레쉬해서 최소 사용시간을 보장
  - 차후, 401시 refresh 토큰으로 refresh 요청하고 api 재요청 하는 방식으로 변경
- 특정 라이브러리(axios, dayjs...)들을 그냥 import 하는 방식에서 특정파일에서 import해서 관련 함수들을 만들고 관련 함수들을 사용해서 사용하도록 변경
- 메인화면 UI 개편
- redux 관련 코드개선
  - connect 함수 제거
  - 리렌더링을 최소화(useSelector 잘게 쓰기, 자주 변하는 데이터와 변하지 않는 데이터 따로 묶기)
- react-router v5 -> v6 버전 업
- 번역팩 자동화 기능
- 거래 관련 로직 수정
- 기타...

개발자로 첫 직장생활이라서 열정도 있었고, 거래소 관련 비즈니스에서 일하고 싶었었기에 1년동안 정말 즐겁게 회사를 다녔습니다.
유능한 개발자들도 많아서 비즈니스만 잘 되었으면 참 좋았을 텐데, `Lxna`coin이 사망하게 되면서 이러저러한 이유로 거래소 프로젝트를 종료하게 되었습니다.

회사는 다른 비즈니스로 방향을 틀었지만 규모가 크지 않은 프로젝트였고, 이러저러한 이유로 많은 분들이 아쉽게 퇴사를 하셨습니다.

다행인 것은 최근에 한번 모임을 가졌는데, 나가신 분들이 **다들 짧은 기간임에도 불구하고 좋은 회사들과 계약을 마치거나, 협상 중이라는 소식**이었습니다.

저의 시선에서 유능한 사람들이 시장에서도 좋은 평가를 받는 것 같아서 기분이 좋으면서도, 내가 시장에 나가면 어떻게 될까에 대해 고민하게 되었습니다.

결론은 기존에 가지고 있던 **나만 열심히 하면 되겠지라는 생각**에서 **노력한 증거를 남기고 공개**하자는 것입니다.

앞으로

1. WIL - weekly i learned
2. 일일 커밋(에 준하는 꾸준한 커밋)

를 실천 할 예정입니다.

<!-- [Docusaurus blogging features](https://docusaurus.io/docs/blog) are powered by the [blog plugin](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-blog).

Simply add Markdown files (or folders) to the `blog` directory.

Regular blog authors can be added to `authors.yml`.

The blog post date can be extracted from filenames, such as:

- `2019-05-30-welcome.md`
- `2019-05-30-welcome/index.md`

A blog post folder can be convenient to co-locate blog post images:

![Docusaurus Plushie](./docusaurus-plushie-banner.jpeg)

The blog supports tags as well!

**And if you don't want a blog**: just delete this directory, and use `blog: false` in your Docusaurus config. -->
