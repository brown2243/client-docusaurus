---
slug: post/3
title: Nextjs Error Boundary 적용기

authors: [brown]
tags: [Nextjs, ErrorBoundary]
---

## Nextjs Error Boundary 적용기

신생 프로젝트를 작업하면 이것저것 할게 많다. 그래서 많이 배운다.

ErrorBoundary 적용해야 한다고 생각 했지만, 더 시급한 업무 때문에 우선 순위에서 약간 밀려있었다.

그러다 테스트 환경에서 사파리로 특정 페이지 접속 시 에러가 뜬다는 소식을 들었다.

결론부터 말하자면 원인은 `Array.prototype.at()` 때문이었다.

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

이렇게 [react-error-boundary](https://github.com/bvaughn/react-error-boundary)를 적용했다.

딱히 설명 할 것도 없이 보고 하면 된다.
