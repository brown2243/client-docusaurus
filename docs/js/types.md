---
sidebar_position: 1
slug: /javascript/types
description: javascript-types
---

# Types

코드에서 사용되는 모든 데이터는 메모리에 저장하고 참조할 수 있어야 한다. 데이터 타입은 데이터를 메모리에 저장할 때 확보해야 하는 메모리 공간의 크기와 할당할 수 있는 유효한 값에 대한 정보, 그리고 메모리에 저장되어 있는 2진수 데이터를 어떻게 해석할 지에 대한 정보를 컴퓨터와 개발자에게 제공한다.

javaScript는 동적 타이핑 언어로, 변수의 타입이 런타임에 결정된다. 내장 타입은 두가지로 나뉘는데, `Primitive type`과 `Object Type`이다.

## Primitive Type(원시 타입)

현 시점에서 원시타입은 다음과 같다.

- string
- number
- boolean
- undefined
- null
- symbol(ES6)
- bigint(ES11)

원시 값(자료형)이란 객체가 아니면서 **메서드 또는 속성도 가지지 않는 데이터이고, 변경 불가능한 값(immutable value)이며 pass-by-value(값에 의한 전달)이다**.

:::caution
원시 값 자체와, 원시 값을 할당한 변수는 다른 개념
변수에 새로운 값을 다시 할당할 수 있지만, 이미 생성한 원시 값은 Object type과 달리 변형할 수 없음
:::

원시 값에는 메서드가 없지만 마치 메서드가 있는 것처럼 동작합니다. 원시 값에서 속성에 접근하려면, JavaScript는 값을 래퍼 객체로 "자동으로 포장"하고 대신 해당 객체 속성에 접근합니다. 예를 들어, "foo".includes("f")는 암시적으로 String 래퍼 객체를 생성하고 해당 객체에 대해 String.prototype.includes()를 호출합니다. 이 "자동으로 포장"은 JavaScript 코드에서 관찰할 수 없지만 다양한 동작에 대한 좋은 정신적인 모델입니다. 예를 들어, "값을 변경하는" 원시 값이 작동하지 않는 이유는 str.foo = 1이 str 자체의 foo 속성에 할당되지 않기 때문입니다. 하지만, 임시 래퍼 객체에는 적용됩니다.

모든 원시 값은 "불변"하여 변형할 수 없습니다. 원시 값 자체와, 원시 값을 할당한 변수를 혼동하지 않는 것이 중요합니다. 변수는 새로운 값을 다시 할당할 수 있지만, 이미 생성한 원시 값은 객체, 배열, 함수와는 달리 변형할 수 없습니다. 언어에서는 원시 값을 변경하는 기능을 제공하지 않습니다

- https://developer.mozilla.org/ko/docs/Glossary/Primitive
- https://poiemaweb.com/js-data-type-variable
