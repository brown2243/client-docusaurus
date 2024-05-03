---
sidebar_position: 14
description: javascript-function
---

# Function

- js에서 함수는 callable한 객체
- 함수는 1급 객체(First-class Object)

  - 변수에 할당 가능
  - 함수의 매개변수로 전달 가능
  - 함수의 반환값으로 사용 가능

- 매개변수(parameter): 함수 안에서의 정의 및 사용에 나열되어 있는 변수
- 전달인자(argument): 함수를 호출할 때 전달되는 실제 값

## 함수 생성 방법

- function kerword
- 함수 표현식
- arrow function

## function kerword

ES6 arrow function이 나오기 전 유일하게 함수를 생성하는 방법

### Hoisting

`function` 키워드를 사용하여 정의된 함수는 호이스팅(Hoisting)되어 함수 선언문보다 먼저 함수를 호출할 수 있다.

함수 표현식에 사용한 경우 값으로 취급되기에, 변수의 선언 keyword를 따른다.

### 생성자 함수

function 키워드로 선언된 함수는 전부 생성자 함수가 될 수 있는데, new 키워드와 함께 호출되며, 함수 내부에서 this를 통해 새로운 객체의 프로퍼티를 설정하고 필요한 초기화 작업을 수행한다.

컨벤션으로 첫글자를 대문자로 한다.

function 키워드로 선언된 함수는 `prototype`이라는 특별한 프로퍼티를 가지는데 해당 함수를 생성자로 사용하여 만들어진 객체들의 프로토타입을 정의한다.

prototype 객체는 constructor라는 프로퍼티를 가지고 있는데, 이 프로퍼티는 함수 자신을 가리키는 참조이다.

### 동적 this binding

function 키워드로 정의된 함수의 this는 호출시점에 따라 동적으로 결정된다.

- call, bind, apply등을 활용해 this 값을 명시적으로 설정가능

### arguments 객체

함수 내부에서 arguments 객체로 argument 처리가능

### 제너레이터 함수

함수의 실행을 중간에 멈추고 재개할 수 있는 특별한 함수

- 제너레이터 함수는 function\* 키워드를 사용하여 정의
- 함수 내부에서 yield 키워드를 사용하여 값을 반환하고 함수의 실행을 일시 중지
- 호출될 때 제너레이터 객체를 반환

  - next() 메서드를 가지고 있으며, next()를 호출할 때마다 제너레이터 함수의 실행이 재개되고 다음 yield 문을 만날 때까지 실행

```javascript
function* generatorFunction() {
  // 함수 본문
  yield value1;
  // 함수 본문
  yield value2;
  // 함수 본문
  return value3;
}
```

## arrow function

ES6에 추가 된 함수 생성 방식

- hoisting 안됌
- 생성자 함수 사용불가
- 정적 this binding
- arguments 객체 사용불가(명시적으로 rest 파라미터 문법 사용)
  - `(...args) => { }`

## function keyword를 사용하지 말아야 하는 이유

위 내용을 보면 arrow function이 더 제한적인 걸 알 수 있는데, 그렇기에 arrow function이 더 권장된다.

1. 프로토타입과 생성자함수는 [class](./class.md)로 대체 가능하기에 사용할 이유가 없음

2. this binding도 일반적인 함수의 사용에서는 의미가 없고, method는 function keyword를 사용하지 않음

```javascript
class T {
  constructor() {
    this.value = 100;
  }
  f = function () {
    console.log(this.value);
  };
  m() {
    console.log(this.value);
  }
  a = () => {
    console.log(this.value);
  };
}

const t = new T();
t.f(); // 100
t.m(); // 100
t.a(); // 100
const obj = { value: 50 };
obj.f = t.f;
obj.m = t.m;
obj.a = t.a;
obj.m(); // 50
obj.f(); // 50
obj.a(); // 100

const obj2 = {
  value: 50,
  f: function () {
    console.log(this.value);
  },
  a: () => {
    console.log(this.value);
  },
};
obj2.f(); // 50
obj2.a(); // undefined
```

해당주제에 [이 영상](https://www.youtube.com/watch?v=LPEwb5plEoU)을 추천한다.
