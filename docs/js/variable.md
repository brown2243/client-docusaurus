---
sidebar_position: 11
slug: /javascript/variable
description: javascript-variable
---

# Variable

변수(Variable)는 프로그램에서 데이터를 저장하고 조작하는 데 사용되는 기본적인 요소이다.

- 변수명: 변수 값이 저장된 메모리 공간을 식별하기 위해 붙인 이름
- 변수값: 해당 메모리 공간에 들어 있는 데이터

js에서 원시 타입 변수들은 stack 영역에, object 타입 변수들은 heap 영역에 저장된다.

## 변수 선언 및 할당 단계

1. 변수 선언(Variable Declaration)

   - JavaScript 엔진이 변수 이름을 인식하고 해당 변수를 현재 스코프에 등록
   - 변수 선언 단계에서는 메모리 공간이 확보되지만, 실제로 값이 할당되지는 않음
   - var 키워드로 선언된 변수는 이 단계에서 undefined로 초기화
   - let과 const 키워드로 선언된 변수는 이 단계에서 초기화되지 않음(TDZ)

2. 변수 초기화(Variable Initialization)

   - 변수에 초기값을 할당하는 단계
   - 변수 선언과 동시에 초기값을 할당할 수도 있고, 선언 후 별도의 문장으로 초기화할 수도 있음
   - 변수값 없이 선언하면 `undefined`로 초기화
   - var로 선언된 변수는 선언 단계에서 이미 undefined로 초기화되었기 때문에, 초기화 단계에서는 새로운 값으로 덮음
   - let, const로 선언된 변수는 선언 단계에서 초기화되지 않았기 때문에, 초기화 단계에서 값을 할당

3. 변수 값 할당(Variable Assignment) or 재할당(Reassignment):

   - 이미 선언되고 초기화된 변수에 새로운 값을 할당하는 단계

```javascript
var one; // 선언(undefined로 초기화)
one = "one"; // 재할당
let two = "two"; // 선언 및 초기화
two = "three"; // 재할당
```

## Declaration Keywords

### `var`

- ES6 이전의 사용되던 변수 선언 키워드
- 권장 되지 않음
- [`함수 스코프`](https://braurus.dev/studies/javascript/scope#function-scope)를 가짐
- var로 선언된 변수는 함수 내부에서 선언 된게 아니라면 글로벌 객체의 속성으로 추가 됌

### `let`, `const`

- ES6에 추가
- 권장 됌
- [`블록 스코프`](https://braurus.dev/studies/javascript/scope#block-scope)를 가짐
- 전역 스코프에서 선언되어도 글로벌 객체를 오염시키지 않음
- 같은 스코프내에서 let, const 재선언 불가
- const는 재할당 불가

## Hoisting

Hoisting은 끌어 올리다는 뜻으로, **호이스팅은 자바스크립트에서 변수와 함수 선언을 코드의 최상단으로 끌어올리는 동작**을 말한다.

---

### 코드 실행과정

JavaScript 엔진은 다음과 같은 단계로 코드를 실행한다.

1. code parsing: JavaScript 엔진은 코드를 읽고 파싱하여 추상 구문 트리(Abstract Syntax Tree, AST)를 생성
   - 이 단계에서 코드의 구문 오류를 검사하고, 변수와 함수 선언을 식별
2. Hoisting: 파싱 단계에서 식별된 변수와 함수 선언은 호이스팅
   - 초기화는 원래 위치에서 이루어짐
   - 호이스팅된 변수와 함수 선언이 메모리에 저장
3. 코드 실행: 변수 할당과 함수 호출 등

---

var로 선언된 변수는 선언과 동시에 undefined로 초기화되며, 할당 라인 이후 실제 값으로 할당 된다. 이로 인해 **var로 선언된 변수는 선언이 코드의 실행 흐름에 도달하기 전에도 접근할 수 있다**.

반면, let과 const는 호이스팅되지만 초기화되지 않고, TDZ(Temporal Dead Zone)에 들어간다. TDZ는 초기화되지 않은 바인딩에 액세스하려는 경우 참조 에러 발생시켜 이로 인해 **선언이 코드의 실행 흐름에 도달하기 전에는 접근할 수 없다**.

그 후, 해당 변수의 선언이 코드의 실행 흐름에 도달했을 때 초기화된다.

```javascript
console.log(x); // undefined
var x = 5;
console.log(x); // 5

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

foo(); // "Hello"
function foo() {
  console.log("Hello");
}
```

## Js Naming Convention

- 변수와 함수는 Camel Case - `firstName`, `userAge`, `calculateTotal`...
- 클래스, 생성자 함수, react 컴포넌트는 Pascal Case - `Person`, `UserProfile`, `MyComponent`...
- 상수는 Upper Snake Case - `MAX_VALUE`, `API_URL`...

## 참조

- https://jisop.github.io/TIL/JavaScript/javascript-variable/
- https://ko.javascript.info/variables
- https://medium.com/korbit-engineering/let%EA%B3%BC-const%EB%8A%94-%ED%98%B8%EC%9D%B4%EC%8A%A4%ED%8C%85-%EB%90%A0%EA%B9%8C-72fcf2fac365
- https://f-lab.kr/insight/understanding-var-let-const-in-javascript?gad_source=1&gclid=Cj0KCQjwq86wBhDiARIsAJhuphnsR8WcgldDd8M-ppjdnzsCcI0yy5BVzDfw88KtoeTODQye5bRRVqoaAu5nEALw_wcB

created date: 2024-04-09
modified date: 2024-04-11
