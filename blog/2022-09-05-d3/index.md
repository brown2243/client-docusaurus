---
slug: post/13
title: D3 관련 정리

authors: [brown]
tags: [chart, D3, flynt.finance]
Date: 2022-09-05 17:25
---

## Intro

---

[D3로 차트](https://flynt.finance/product)를 구현해달라는 요구사항을 받았었다.

- horizontal Pannable
- hover
- double line

**참고로 태그는 `z-index`, SVG는 그려진 순서대로 쌓여나간다**

기존에 `trading-view` 차트도 다뤄보고 `canvas`로 차트도 그려봤으니 어렵게 생각하진 않았던 task 였는데

생각보다 어려웠고, 시간이 더 걸렸다.

- 오래 된 library 라서 코드가 조금씩 다르다.
  - v7로 작업했는데, 인터넷에 돌아다니는 예시코드, 듀토리얼등은 대부분 v3,v4
- 러닝 커브가 예상 보다 높아서, 그냥 갖다 붙이면 되는 라이브러리가 아니라 학습이 필요하다.

그래서 새로운 한국인 사용자를 위해 기록을 남긴다.

## D3 간단 설명

---

- [d3.js 공식문서](https://d3js.org/)
- [d3.js github](https://github.com/d3/d3)

> **D3** (**Data-Driven Documents** or **D3.js**) is a JavaScript library for visualizing data using web standards. D3 helps you bring data to life using SVG, Canvas and HTML. D3 combines powerful visualization and interaction techniques with a data-driven approach to DOM manipulation, giving you the full capabilities of modern browsers and the freedom to design the right visual interface for your data.

> **D3.js는 데이터를 기반으로 문서를 조작하기 위한 자바스크립트 라이브러리이다. D3는 HTML, SVG 및 CSS를 사용하여 데이터를 생동감 있게 만들 수 있도록 도와줍니다.**

## D3 with React

NextJS + typescripts 로 사용했다.

관련 레퍼런스

- https://www.smashingmagazine.com/2018/02/react-d3-ecosystem/
- https://darrengwon.tistory.com/1140
- https://weiji.io/2020/06/09/d3-and-react/

## D3 study

---

### [밑바닥 부터 시작하는 d3.js (version 4) 와 Typescript 를 이용한 데이터 가시화](https://hamait.tistory.com/933)

영어자료가 한글로 번역 된 자료

### [dashingd3js](https://www.dashingd3js.com/)

한번 쭉 따라해보면, 도움되는 사이트

중요한 파트는 [Use D3.js To Bind Data to DOM Elements](https://www.dashingd3js.com/d3-tutorial/use-d3-js-to-bind-data-to-dom-elements)이다.

관련 레퍼런스

- https://d3-graph-gallery.com/ -> 예시를 보고 연습하기 제일 좋은 사이트
- [bl.ocks.org](https://bl.ocks.org/) -> 그다음
- [observablehq](https://observablehq.com/@d3/learn-d3-by-example?collection=@d3/learn-d3) -> 처음 하는 사람들이 바로 붙여넣기하고 분석하기는 힘들고, 살짝 감이 올 때 보는게 좋다.

중요한 개념들은

- 추상 셀렉션
- `data`, `datam`
- scale
- range
- Axis(축?)
- d3로 event 다루기

이정도 학습하면 어지간한 건 찾아가면서 구현할 수 있을 것이다!!
