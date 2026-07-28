---
sidebar_position: 15
slug: /javascript/this
description: javascript-this-binding
---

# this

자바스크립트에서 `this`는 함수가 호출되는 방식(Execution Context)에 따라 동적으로 바인딩되는 키워드이다.

대부분의 객체지향 언어에서 `this`가 인스턴스 자신을 가리키는 정적 바인딩인 것과 달리, 자바스크립트는 **호출 시점(Call-site)**에 결정된다.

## 1. this 바인딩의 4가지 규칙

### 1) 기본 바인딩 (Default Binding)
독립적인 함수 호출(Plain Function Call) 시 적용된다.

- **Non-strict mode**: 전역 객체 (`window` 또는 `global`)에 바인딩
- **Strict mode (`'use strict'`)**: `undefined`가 바인딩 (전역 객체 오염 방지)

```javascript
function showThis() {
  console.log(this);
}

showThis(); // 브라우저: window, strict mode: undefined
```

### 2) 암시적 바인딩 (Implicit Binding)
함수가 객체의 메서드로 호출될 때, 메서드 호출을 주도한 **점 연산자 앞의 객체**가 `this`에 바인딩된다.

```javascript
const user = {
  name: 'Brown',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

user.greet(); // Hello, Brown (this -> user)

// 암시적 바인딩 소실 (Implicit Binding Loss)
const fn = user.greet;
fn(); // Hello, undefined (콜백 전달이나 변수 할당 시 기본 바인딩으로 전락)
```

### 3) 명시적 바인딩 (Explicit Binding)
`call`, `apply`, `bind` 메서드를 사용하여 `this`를 명시적으로 주입한다.

- `call(thisArg, arg1, arg2...)`: 즉시 실행 (인자를 쉼표 구분으로 전달)
- `apply(thisArg, [arg1, arg2])`: 즉시 실행 (인자를 배열로 전달)
- `bind(thisArg)`: `this`가 고정된 **새로운 함수를 반환**

```javascript
function multiply(a, b) {
  return (this.base || 1) * a * b;
}

const ctx = { base: 10 };

multiply.call(ctx, 2, 3); // 60
multiply.apply(ctx, [2, 3]); // 60

const boundFn = multiply.bind(ctx);
boundFn(2, 3); // 60
```

### 4) new 바인딩 (new Binding)
생성자 함수로 객체를 생성할 때(`new` 키워드) 다음과 같은 과정이 일어난다.

1. 빈 객체 `{}` 생성
2. 새로 생성된 객체의 `[[Prototype]]` 연결
3. 생성된 객체가 `this`로 바인딩되어 생성자 코드 실행
4. 명시적 객체 반환이 없다면 `this` 반환

```javascript
function Person(name) {
  this.name = name;
}

const p = new Person('Brown');
console.log(p.name); // Brown
```

---

## 2. 화살표 함수와 렉시컬 this (Lexical this)

ES6에 도입된 화살표 함수(Arrow Function)는 자신만의 `this`를 가지지 않는다.
화살표 함수 내부의 `this`는 **자신이 선언된 외부 스코프(Lexical Scope)의 this**를 그대로 상속받아 사용한다.

```javascript
const timer = {
  seconds: 0,
  start() {
    // 화살표 함수는 외부 start() 메서드의 this(timer)를 상속
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
};

timer.start();
```

> **주의**: 객체 메서드나 이벤트 리스너 정의 시 화살표 함수를 사용하면 `this`가 상위 전역 스코프를 가리키므로 일반 함수를 권장한다.

---

## 3. 바인딩 우선순위

`new 바인딩` > `명시적 바인딩 (call/apply/bind)` > `암시적 바인딩` > `기본 바인딩`

## 참조

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/this
- You Don't Know JS (this & Object Prototypes)
