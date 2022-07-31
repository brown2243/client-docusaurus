---
slug: post1
title: 첫 외주? 경험
authors: [brown]
tags: [hello, 외주]
---

## 첫 외주? 경험

오늘 아침에 일어나서 기묘한 이야기 시즌4 7화를 보다, 리액트 단톡방을 잠깐 보는데 아래의 메세지를 보았습니다.

`**카카오맵 API관련 페이지 작업 해주실 분 구합니다 보수는 다음날 오전에 12만원 드립니다.**`

뭔가 쉽고 재밌을 것 같아서 한다고 했습니다.

요청자는 **졸업작품 작업 중인 대학생**이셨습니다. <br />
요청사항은 **카카오맵 api로 검색해서 결과값들을 불러 놓는 것**까지는 구현했는데, **그 값들의 버튼을 클릭했을 때, 다른 컴포넌트에 이동시키는 것**이었습니다.

솔직히 듣자마자 전역 상태 관리 쓰면 바로 해결 될 것 같아서, 요청자와 협의 후 코드를 받아 작업 시작했습니다.

솔직히 놀랐습니다.

- **git 을 사용하지 않아 압축파일로 파일을 전달 받은 것**
- css 관리를 모듈조차 쓰지 않은 점
- 전역 상태관리를 모르는 상태에서 데아터를 여기저기 옮기려 시도했어서 인지, 컴포넌트 구조가 엉망
- 기타...

잘 모르는 상태에서 결과물을 내기위해 여기저기서 코드를 많이 가져오신 것 같았습니다.

검색어 입력시 카카오맵 API로 결과값들을 가져오는 부분은 잘 동작 했기 때문에, 그부분은 그냥 두고
상태관리 툴로 `zustand` 사용해 요구사항을 구현하고, 컴포넌트를 정리 하고, 불필요한 로직을 삭제 했습니다.
css도 좀 정리하고 나니 2시간 정도 걸렸습니다.

그분도 처음이라 하셨는데, 저도 처음이어서 그런지 2시간 일하고 10만원 받는게 과한 것 같았습니다(사기?).
상대도 학생이고 해서 8만원만 받겠다고 했는데, 요청자분이 페이지네이션기능도 요청 하시더군요.
그래서 페이지네이션, 결과 값 특정 컴포넌트에 추가,제거 , 추가 시 스크롤 이동 이것저것 기능을 넣다 보니
3시간 정도 추가로 작업 했습니다.
페이지네이션 컴포넌트를 예전에 만들어 놨던 걸 붙였는데, 카카오맵 API의 페이지네이션과 맞지 않아 거기서 시간을 좀 썼네요.

5시간에 10만원이면 시급 2만원, 회사에서 받는 돈이랑 같은 수준이지만 우연히 이런 경험도 해보고 회사 밖의 일로 돈을 벌었다는 것에 나름 신기 했습니다. 😎

요청사항보다 더 열심히 작업 해드렸는데 그분이 입소문 내줬으면 좋겠습니다. 😄

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
