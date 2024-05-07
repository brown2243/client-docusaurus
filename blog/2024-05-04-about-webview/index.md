---
slug: about-webview
title: 웹뷰에 관해서

authors: [brown]
tags: [webview, react-native]
Date: 2024-05-04 22:00
---

# 웹뷰에 관해서

<br />

지난 주 금요일 사당에서 전 동료들과 저녁을 먹었다. 문어와 삼겹살이었는데 맛은 좋은데 양은 좀 실망이었다.

어쨌든 이런저런 얘기를 나눴는데 주제 중에 하나가 웹뷰에 관한 것이었다.

이미 앱으로 구현 되어있는 부분을 웹뷰로 대체할 지에 관한 내용이었는데, 다른 분도 자사 앱에서 웹뷰 비중이 높아지고 있다고 했다.

전 직장에서도 앱(플러터)에 특정 정보성 페이지들은 웹뷰로 처리했었는데, 이 방식은 확실히 장점이 있다.

그러다보니 갑자기 앱으로 어떻게 웹뷰를 구현하는지에 관심이 생겼다.

<!-- truncate -->

## web view란?

### 웹뷰의 장점

### 웹뷰의 단점

## 사전준비

1. native
   - android - java, kotlin
   - ios - swift,
2. cross flatform
   - react-native(js), flutter(dart)

## 프로젝트 사전 세팅

[공식 문서](https://reactnative.dev/docs/environment-setup?guide=native)를 통해 프로젝트 세팅을 해준다.

1. node 설치
2. watchman 설치 - 파일 변경 감지해서 app 갱신
3. xcode 업데이트
4. CocoaPods 설치 - ios 의존성 툴
   - pod repo update
5. android studio 설치
6. java 17 설치 - android
7. 프로젝트 세팅 - `npx react-native@latest init folder`

안드로이드, ios 양쪽을 다 실행해야하니 설치할 것들이 많은데 위 과정을 거치면 드디어 프로젝트를 실행할 수 있다.

## 프로젝트 실행

앱을 실행하려면 앱을 실행할 가상 환경이 필요하다.

안드로이드는 에뮬레이터 ios는 시뮬레이터로 가상환경을 제공한다.

안드로이드는 스튜디오는 상단에 tool - device manager에서 특정 디바이스의 에뮬레이터를 설치할 수 있고,

ios는 simulator앱을 실행 하면 된다.

![phones](/img/blog/about-webview/phones.png)

## 프로젝트 세팅

ts와 react 생태계로 app을 작성한다는게 매력적인 것 같다.

### 절대 경로 세팅

절대 경로 세팅을 하겠다. 경로 세팅을 할때는 번들러에도 설정을 해줘야한다.

```javascript
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "baseUrl": "."
  }
}
// metro.config.js
const config = {
  resolver: {
    extraNodeModules: {
      src: path.resolve(__dirname, 'src'),
    },
  },
};
```

### styled 세팅

`yarn add @emotion/native @emotion/react`

텍스트는 반드시 `Text` 컴포넌트를 사용해야 한다고 경고를 준다.

![styled](/img/blog/about-webview/styled.png)

와... 이게 되는게 좀 신기하다. 다만 최근에 프로젝트 세팅할 때도 겪었던 문제인데

styled import를 하면 `import styled from '@emotion/native/macro';`로 macro가 붙어서 나온다.

그리고 경로 문제로 실행이 안된다.

이 프로젝트는 babel을 사용하니 혹시나 `@emotion/babel-plugin` 플러그인을 설치해봤는데도 안되더라.

생각보다 많이 겪는 문제는 아닌건지, 검색해보면 생각보다 자료가 없는 것 같다. 해결책은 `d.ts` 파일로 모듈 선언하고 tsconfig에서 경로를 잡아주면 된다.

### navigation & web view 세팅

app에서는 react router dom 처럼 보이는 navigation이 필요한데 [@react-navigation/native가 보편적 인 것 같다.](https://npmtrends.com/@react-navigation/native-vs-react-native-navigation-vs-react-navigation)

![navi-trend](/img/blog/about-webview/navi-trend.png)

webview 쪽은 `react-native-webview`로 보인다.

`yarn add react-native-webview`

[`yarn add @react-navigation/native react-native-screens react-native-safe-area-context @react-navigation/native-stack`](https://reactnavigation.org/docs/getting-started)

react-native-screens 해당 패키지를 설치 후, 문서를 잘 따라가자 시간 날린다 ㅠㅠ

- MainActivity 파일 수정
- ios pod install

## navigation 사용

## webview 구현

![webview-blog](/img/blog/about-webview/webview-blog.png)
