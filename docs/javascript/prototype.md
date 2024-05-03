---
sidebar_position: 15
description: javascript-prototype
---

# Prototype

JS는 프로토타입 기반으로 객체를 생성하고 다루는 방식이 클래스 기반의 언어와는 조금 달랐었다.

대부분의 프로그래밍 언어에서 객체 생성 방법이 class를 사용하고, js에도 class가 도입 된 후부터 prototype 방식으로 객체를 생성하는 건

통일성을 위해 시대의 흐름에 따라 보내줘야 할 것 같다. 어짜피 내부적으로는 프로토타입으로 동작한다.

## `__proto__` 프로퍼티

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

## Prototype Chain

Prototype Chain이란 객체에서 프로퍼티나, 메서드를 찾는 방식이다.

위 예제에서 a라는 객체를 생성 했을 때, a 객체가 가지고 있지 않은 toString() 메서드를 호출 했다.

이는 Prototype Chain이 동작한 것으로 a 객체에 해당 프로퍼티나 메서드가 없을 때, `__proto__`에 등록 된 객체에서 해당 값을 찾아보는 방식이다.

해당 값을 찾을 때까지, 값을 찾거나 null을 만날 때까지 상위 prototype을 타고 올라가며 값을 찾는다.

## 생성자 함수로 객체 생성

[생성자 함수에 관해](./function.md#생성자-함수)

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
