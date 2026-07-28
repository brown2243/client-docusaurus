---
sidebar_position: 16
slug: /javascript/class
description: javascript-class-vs-prototype
---

# Class

ES6에 도입된 `class`는 자바스크립트의 프로토타입(Prototype) 기반 객체지향 프로그래밍을 더 명확하고 직관적으로 다룰 수 있게 해주는 객체 생성 문법이다.

`class`는 단순한 문법적 설탕(Syntactic Sugar)에 가깝다는 평가를 받기도 하지만, 내부 동작 및 엄격 모드 적용 측면에서 생성자 함수와 몇 가지 중요한 차이가 있다.

---

## 1. Class 문법과 주요 기능

### 1) 기본 구조 (Constructor, Method, Inheritance)

```javascript
class Animal {
  // 프라이빗 필드 (Private Field - ES2022)
  #age = 0;

  constructor(name) {
    this.name = name;
  }

  // 인스턴스 메서드 (Prototype에 등록)
  speak() {
    console.log(`${this.name} makes a noise.`);
  }

  // 정적 메서드 (클래스 자체에 등록)
  static isAnimal(obj) {
    return obj instanceof Animal;
  }
}

// 상속 (Inheritance)
class Dog extends Animal {
  constructor(name, breed) {
    // 상위 클래스 생성자 호출 필수
    super(name);
    this.breed = breed;
  }

  speak() {
    super.speak(); // 부모 메서드 호출
    console.log(`${this.name} barks.`);
  }
}

const dog = new Dog('Mina', 'Golden Retriever');
dog.speak();
```

---

## 2. 생성자 함수(Constructor Function)와의 차이점

`class` 문법은 기존 `function Component()` 방식의 생성자와 호환되지만 다음과 같이 엄격한 제약을 가진다.

1. **`new` 키워드 강제**: `class`는 `new` 없이 호출 시 `TypeError`가 발생한다. (생성자 함수는 전역 객체를 오염시키며 실행 가능)
2. **호이스팅 동작 방식**: `class` 역시 호이스팅되지만, **TDZ(Temporal Dead Zone)**가 적용되어 정의 이전에 호출 시 `ReferenceError`가 발생한다.
3. **Strict Mode 자동 적용**: `class` 바디 내부의 모든 코드는 기본적으로 `'use strict'` 모드로 실행된다.
4. **프로토타입 메서드의 열거 가능성(Enumerable)**: `class` 내부에 정의된 메서드는 `enumerable: false`로 설정되어 `for...in` 문이나 `Object.keys()`에 열거되지 않는다.

---

## 3. Class는 단지 Syntactic Sugar일까?

학계와 실무에서 `class`가 Syntactic Sugar인가에 대한 논의가 많았다.

- **Syntactic Sugar 관점**: `class` 내부 동작 원리는 결국 `Prototype Chain`에 기반하며, 기존 프로토타입 메커니즘을 대체하는 것이 아닌 감싸는 래퍼에 불과하다.
- **새로운 언어 스펙 관점**: `#private` 필드 지원, `super` 키워드 바인딩, `[[IsClassConstructor]]` 내부 슬롯 플래그 등은 기존 생성자 함수 방식으로는 완전한 폴리필(Polyfill)이 불가능하므로 단순 Sugar를 넘어서는 고유 기능이다.

결론적으로 `class`는 객체지향 코드의 가독성과 안전성을 향상시켜주므로 적극적인 활용이 권장된다.

## 참조

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes
- https://roy-jung.github.io/161007_is-class-only-a-syntactic-sugar/
