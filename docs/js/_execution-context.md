---
sidebar_position: 15
slug: /javascript/execution-context
description: javascript-execution-context
---

# Execution-context

자바스크립트의 `실행 컨텍스트(Execution Context)`는 **실행할 코드에 제공할 환경 정보들을 모아놓은 객체**이다.

실행될 코드가 필요한 환경 정보는 뭔데?

변수 환경(Variable Environment)
현재 컨텍스트 내의 변수와 함수 선언을 저장하는 공간입니다.
변수의 값과 함수의 참조를 포함합니다.
렉시컬 환경(Lexical Environment)
변수 환경과 유사하지만, 외부 렉시컬 환경에 대한 참조를 가집니다.
스코프 체인을 형성하여 변수의 유효 범위를 결정합니다.
this 바인딩
현재 컨텍스트의 this 값을 저장합니다.
함수 호출 방식에 따라 this 값이 결정됩니다

실행 컨텍스트는 코드의 실행에 필요한 정보를 담고 있으며, 코드의 실행 흐름을 관리하고, 크게 전역 실행 컨텍스트(Global Execution Context)와 함수 실행 컨텍스트(Function Execution Context)로 나눌 수 있다.

참조

- https://speakerdeck.com/deepu105/v8-memory-usage-stack-and-heap?slide=15
- https://velog.io/@minw0_o/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%BD%94%EB%93%9C%EC%9D%98-%EC%8B%A4%ED%96%89-%EA%B3%BC%EC%A0%95-%EC%8B%A4%ED%96%89-%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8
- https://catsbi.oopy.io/fffa6930-ca30-4f7e-88b6-28011fde5867
