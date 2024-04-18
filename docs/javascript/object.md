---
sidebar_position: 11
description: javascript-object
---

# Object

[자바스크립트는 객체(object) 기반의 언어로서 **원시 타입(Primitives)을 제외한 나머지 값들은 모두 객체**이다.](./types#object-type객체-타입)

그러므로 객체에 대한 이해가 아주 중요하다고 생각한다.

## 프로그래밍에서의 객체

프로그래밍에서 객체(Object)는 관련된 데이터(프로퍼티)와 동작(메서드)을 포함하는 논리적인 단위?이다.

객체를 생성하는 방법은 언어마다 다르다.

1. 그냥 생성
   - C,C++(struct), js(객체 리터럴), python(딕셔너리로 흉내는 가능)
2. Class로 생성
   - C++, java, js(ES6), python
3. prototype으로 생성
   - js

## 객체 내부구조

객체는 해시테이블의 개념을 넘어서기에 객체가 해시테이블이라고 할수는 없다.

다만 JS에서 객체는 해시테이블 기반으로 구현된다고 한다. 그러면 타 언어는 어떨까

python은 내부의 딕셔너리(해시테이블)기반으로 객체를 구현한다고 한다.

C, C++, java는 객체를 구현하기 위해 내부적으로 해시테이블을 사용하지 않는데 이는 컴파일 시점에 객체에 필요한 메모리 크기를 알 수 있어,

해시 테이블을 사용하지 않고도 효율적으로 메모리를 할당할 수 있다.

반면에 js와 python은 런타임에서 객체에 필요한 메모리를 알 수 있기에 인접한 메모리공간을 사용하지 못하고 객체를 구현할 때 해시 테이블을 사용하여 속성과 값을 매핑하고 관리한다.

객체의 저장위치는 C, C++은 객체가 stack, heap 영역 둘다 저장 될 수 있으며, java, js, python에서는 heap영역에만 저장된다.

## Prototype

JS는 프로토타입 기반으로 객체를 생성하고 다루는 방식이 클래스 기반의 언어와는 조금 달랐었다.

대부분의 프로그래밍 언어에서 객체 생성 방법이 class를 사용하고, js에도 class가 도입 된 후부터 prototype 방식으로 객체를 생성하는 건

통일성을 위해 시대의 흐름에 따라 보내줘야 할 것 같다. 어짜피 내부적으로는 프로토타입으로 동작한다.

### `__proto__` 프로퍼티

js의 모든 객체는 `__proto__` 프로퍼티를 가지고 있는데 이 프로퍼티의 값은 `object`, `null` 만 할당 될 수 있다.

```javascript
a = {}
a.__proto__
{__defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, __lookupSetter__: ƒ, …}
a.toString()
'[object Object]'
a.__proto__ = null
null
a.toString()
// Uncaught TypeError: a.toString is not a function
```

해당 프로퍼티는 프로토 타입 체이닝에 사용된다. 일반적으로 prototype으로 객체를 생성할 때, 생성자 함수를 사용하지만

`__proto__` 프로퍼티를 직접 바꿀 수도 있다.

```javascript
function Test(){
    this.a = 'a'
    this.b = 'b'
}
t = new Test()
Test {a: 'a', b: 'b'}
tt = {}
tt.__proto__ = t
Test {a: 'a', b: 'b'}
//
tt.a
'a'
t.a = 'aa'
'aa'
tt.a
'aa'
//
tt.b += 'b'
'bb'
t.b
'b'
tt.b
'bb'
```

### Prototype Chain

Prototype Chain이란 객체에서 프로퍼티나, 메서드를 찾는 방식이다.

위 예제에서 a라는 객체를 생성 했을 때, a 객체가 가지고 있지 않은 toString() 메서드를 호출 했다.

이는 Prototype Chain이 동작한 것으로 a 객체에 해당 프로퍼티나 메서드가 없을 때, `__proto__`에 등록 된 객체에서 해당 값을 찾아보는 방식이다.

해당 값을 찾을 때까지, 값을 찾거나 null을 만날 때까지 상위 prototype을 타고 올라가며 값을 찾는다.

### 생성자 함수

객체를 프로토 타입으로 다룰 때, `__proto__`를 직접 건드리기 보다는 생성자 함수를 활용한다.

function 키워드로 선언된 함수는 전부 생성자 함수가 될 수 있는데 컨벤션으로 첫글자를 대문자로 한다.

function 키워드로 선언된 함수는 `prototype`이라는 특별한 프로퍼티를 가지는데 이 프로퍼티는 객체로, 해당 함수를 생성자로 사용하여 만들어진 객체들의 프로토타입을 정의한다.

prototype 객체는 constructor라는 프로퍼티를 가지고 있는데, 이 프로퍼티는 함수 자신을 가리키는 참조이다.

new 키워드와 함께 함수를 호출하면 해당 함수는 생성자로 동작하며, 함수 내부에서 this를 통해 새로운 객체의 프로퍼티를 설정하고 필요한 초기화 작업을 수행한다.

1. 함수를 new 키워드와 함께 호출
2. 새로운 빈 객체가 생성
3. 생성된 객체의 `__proto__`가 함수의 prototype 프로퍼티로 설정
4. 생성된 객체가 this 키워드로 바인딩
5. 함수 본문이 실행됩니다. 이때 this는 새로 생성된 객체를 참조
6. 함수가 명시적으로 객체를 반환하지 않으면, 새로 생성된 객체가 반환

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function () {
  console.log(this.name, this.age);
};

const person = new Person("John", 25);
console.log(person.constructor === Person); // 출력: true
person.sayHello();
```
