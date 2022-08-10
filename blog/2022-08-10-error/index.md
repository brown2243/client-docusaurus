---
slug: post/3
title: Nextjs Error Boundary 적용기

authors: [brown]
tags: [Nextjs, ErrorBoundary]
---

## Nextjs Error Boundary 적용기

신생 프로젝트를 작업하면 이것저것 할게 많다. 그래서 많이 배운다.

ErrorBoundary는 기회되면 적용해야지 생각만 했지, 아직 프로젝트 초기기도 하고 런타임에러가 날 일이 없어서

우선 순위에서 약간 밀려있었다.

그런데 앱 개발자분이 웹뷰 관련 작업을 하는데 **에러 발생한다는 내용을 전달** 받았다.

**아니... 나와 타입스크립트를 뚫고 에러가 난다고...?**

결론부터 문제는 `Array.prototype.at()` 때문이었다.

최신 문법이라서 **브라우저 호환성을 체크** 했어야 했는데...! 😵

그래서 관련 부분 수정을 하고, 이참에 아래의 방식으로 ErrorBoundary를 작업 했다.

1. [공식문서](https://nextjs.org/docs/advanced-features/error-handling) 체크 <br />
   내용중에서 이러한 부분이 있다.<br/>
   To use Error Boundaries for your Next.js application, **you must create a class component ErrorBoundary** <br/>
   클래스 컴포넌트 써본 지 1년은 넘은 것 같은데 + 예시코드가 jsx밖에 없네...
2. TS 예시코드 체크 <br />
   서치를 해보니 [해당 링크](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/)에 원하는 예시 코드가 있었다.

<br />

그런데 바로 설득 당했다.

> Option 1: Using react-error-boundary
> React-error-boundary - is a lightweight package ready to use for this scenario with TS support built-in. This approach also lets you avoid class components that are not that popular anymore.

**시간도 없는데 있는 바퀴는 써야지...?** 하면서 납득하고 [react-error-boundary](https://github.com/bvaughn/react-error-boundary)를 한번 보고 적용했다.

딱히 설명 할 것도 없이 보고 하면 된다. 역시 문서는 중요해...!
