---
slug: post/12
title: Chap.3 common-programming-concepts

authors: [brown]
tags: [hello-rust, rust, PS, codewars]
Date: 2022-08-28 22:31
---

<br />

`변수`, `타입`, `함수`, `주석`, `제어문`에 대해서 배울 것입니다.

## [3.1 변수와 가변성](https://rust-kr.github.io/doc.rust-kr.org/ch03-01-variables-and-mutability.html#%EB%B3%80%EC%88%98%EC%99%80-%EA%B0%80%EB%B3%80%EC%84%B1)

---

- **변수는 기본적으로 불변입니다.**
- 이것은 러스트가 제공하는 안정성과 쉬운 동시성이라는 이점을 얻을 수 있는 방향으로 코드를 쓰게 하는 강제사항(nudge)중 하나입니다.
- `mut`를 사용해 가변으로 만들 수 있음
  - `let mut x = 5;`
- 버그를 방지하는 것 외에도 고려해야 할 비용이 있습니다.(함수형 프로그래밍의 불변성 컨셉에 대한 내용)
  - 예를 들어, 큰 데이터 구조를 사용할 때, 인스턴스를 알맞게 가변으로 설정하는 것은 새로 인스턴스를 할당하고 복사해서 돌려주는 것보다 빠를 수 있습니다.
  - 작은 데이터 구조라면, 새 인스턴스를 만들고 더 함수형 프로그래밍 스타일 로 작성하는 것이 더 흐름을 따라가기 쉽기 때문에, 퍼포먼스가 느려지더라도 명확성을 얻는 것에 대한 패널티로 받아들이는 것이 좋을 수 있습니다.

### [변수와 상수의 차이](https://rust-kr.github.io/doc.rust-kr.org/ch03-01-variables-and-mutability.html#%EB%B3%80%EC%88%98%EC%99%80-%EC%83%81%EC%88%98%EC%9D%98-%EC%B0%A8%EC%9D%B4)

- 먼저, `mut`와 상수를 함께 사용할 수 없음 - 상수는 항상 불변
- 상수는  `const` 키워드로 선언하며, 값의 타입은 ***반드시* 어노테이션이 달려야** 합니다.
- 마지막 차이점은, 상수는 반드시 상수 표현식이어야 하고 함수의 결과값이나 런타임에 결정되는 그 어떤 값이어도 안된다는 것입니다.
- 상수를 위한 러스트의 작명 관례는 `대문자 스네이크 표기법`
  - `const MAX_POINTS: u32 = 100_000;`

### [덮어쓰기 ](https://rust-kr.github.io/doc.rust-kr.org/ch03-01-variables-and-mutability.html#%EB%8D%AE%EC%96%B4%EC%93%B0%EA%B8%B0)

- 새 변수를 이전 변 수명과 같은 이름으로 선언할 수 있고,
- 새 변수는 이전의 변수를 덮어씁니다.
- 러스트인들은 첫 번째 변수가 두 번째 변수에 의해 *덮어쓰였다*라고 표현
  - `let x = 5;`
  - `let x = x + 1;`
  - `let x = x * 2;` -> `x is: 12`
- **덮어쓰기는 변수를 `mut`로 표시하는 것과는 다릅니다.**
  - `let` 키워드 없이 값을 재할당 하려고 한다면 컴파일-타임 에러가 발생하기 때문입니다.
- `mut`과 덮어쓰기의 또다른 차이점은, **같은 변수명으로 다른 타입의 값을 저장할 수 있다는 것**입니다.

---

## [3.2 데이터 타입](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%EB%8D%B0%EC%9D%B4%ED%84%B0-%ED%83%80%EC%9E%85)

---

러스트에서 사용되는 모든 값들은 어떤 *타입*을 갖습니다.

그러니 어떤 형태의 데이터인지 명시하여 러스트 컴파일러가 데이터를 어떤 식으로 다룰 수 있는지 알게끔 해야합니다. 여기서는 타입을 스칼라 타입과 복합 타입, 두 가지 부분 집합으로 나누어 보겠습니다.

러스트는 *타입이 고정된 (statically typed)* 언어라는 점을 주지하세요.

이게 의미하는 바는 모든 변수의 타입이 컴파일 시점에 반드시 정해져 있어야 한다는 겁니다.

보통 컴파일러는 우리가 값을 어떻게 사용하는지에 따라 타입을 추측할 수 있습니다.

하지만 **타입의 선택 폭이 넓은 경우는 다음과 같이 반드시 타입을 명시**해야 합니다
`let guess: u32 = "42".parse().expect("Not a number!");`

### [스칼라 타입](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%EC%8A%A4%EC%B9%BC%EB%9D%BC-%ED%83%80%EC%9E%85)

- *스칼라* 타입은 하나의 값을 표현합니다.(JS의 `primitive`)
  - integers,
  - floating-point numbers
  - Booleans
  - characters.

#### [정수형](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%EC%A0%95%EC%88%98%ED%98%95)

- 정수형\_은 소수점이 없는 숫자입니다.
- 부호 있는 타입은  `i`로 시작
- 부호 없는 타입은  `u`로 시작

| Length  | Signed | Unsigned |
| ------- | ------ | -------- |
| 8-bit   | i8     | u8       |
| 16-bit  | i16    | u16      |
| 32-bit  | i32    | u32      |
| 64-bit  | i64    | u64      |
| 128-bit | i128   | u128     |
| arch    | isize  | usize    |

- 부호 있는 (signed), 부호 없는(unsigned)으로 나뉨
  - 오직 양수만을 가질 것인지
  - 부호와 함께 다뤄야 하는 경우 숫자는 더하기 혹은 빼기 기호와 함께 표시하죠.
  - 하지만 숫자가 양수라고 가정해도 문제 없는 상황에는 부호 없이 표시하게 됩니다.
- 각 부호 있는 타입의 변수는 -(2n - 1) 부터 2n - 1 - 1 까지의 값을 포괄합니다.
- 여기서  **n\_은 사용되는 타입의 비트 수 입니다.**
  - 따라서 `i8`은 -(27) 에서 27 - 1 까지의 값, 즉 -128 에서 127 사이의 값을 저장할 수 있습니다.
  - 부호 없는 타입은 0 에서 2n - 1 까지의 값을 저장할 수 있습니다.
  - 그래서 `u8` 타입은 0 에서 28 - 1 다시 말해, 0 에서 255 까지의 값을 저장할 수 있습니다.
- 추가로, `isize`와 `usize` 타입은 여러분의 프로그램이 동작하는 컴퓨터 환경에 따라 결정됩니다.
  - 64-bit 아키텍처이면 64bit를, 32-bit 아키텍처이면 32bit를 갖게 됩니다.
- 정수형 리터럴은 Table 3-2에서 보시는 것과 같은 형태로 작성할 수 있습니다.
- byte 리터럴을 제외한 모든 정수형 리터럴에는 `57u8`과 같은 타입 접미사와 `1_000`과 같이 시각적인 구분을 위한 `_`을 사용할 수 있습니다.

| Number literals | Example     |
| --------------- | ----------- |
| Decimal         | 98_222      |
| Hex             | 0xff        |
| Octal           | 0o77        |
| Binary          | 0b1111_0000 |
| Byte (u8 only)  | b'A'        |

그러면 어떤 타입의 정수를 사용해야 하는지는 어떻게 알까요? **확실하게 정해진 경우가 아니면 러스트의 기본 값인 `i32`가 일반적으로는 좋은 선택입니다.**

이 타입이 일반적으로 가장 빠르기 때문이죠. 심지어 64-bit 시스템에서도요. `isize`나 `usize`는 주로 컬렉션 타입 종류의 인덱스에 사용됩니다.

##### [정수 오버플로우](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%EC%A0%95%EC%88%98-%EC%98%A4%EB%B2%84%ED%94%8C%EB%A1%9C%EC%9A%B0)

- 여러분이 0과 255 사이의 값을 담을 수 있는 `u8` 타입의 변수를 갖고 있다고 해봅시다.

- 만약에 이 변수에 256처럼 범위 밖의 값으로 변경하려고 하면 *정수 오버플로우 (integer overflow)* 가 일어납니다.

- 코드를 **디버그 모드에서** 컴파일하는 경우에는 런타임에 정수 오버플로우가 발생했을 때 *패닉 (panic)* 을 발생시키도록 검사합니다.
  - 러스트에서는 에러가 발생하면서 프로그램이 종료되는 경우 패닉이라는 용어를 사용합니다.
- `--release` 플래그를 사용하여 **코드를 릴리즈 모드로 컴파일하는 경우에는 패닉을 발생시키는 정수 오버플로우 검사를 실행파일에 포함시키지 않습니다**.
  - 대신 오버플로우가 발생하면 러스트는 *2의 보수 감싸기 (two's complement wrapping)* 을 수행합니다. 짧게 설명하자면, 해당 타입이 가질 수 있는 최대값보다 더 큰 값은 허용되는 최소값으로 “돌아갑니다 (wrap around)”.
  - `u8`의 경우 256은 0이, 257은 1이 되는 식입니다. 프로그램은 패닉을 발생시키지 않으나, 해당 변수는 아마도 여러분이 예상치 못했던 값을 갖게 될겁니다.
  - 정수 오버플로우의 감싸기 동작에 의존하는 것은 에러로 간주됩니다.

명시적으로 오버플로우의 가능성을 다루기 위해서는 표준 라이브러리가 기본 수치 타입에 대해 제공하는 아래 메소드 종류들을 사용할 수 있습니다:

- `wrapping_add`와 같은 `wrapping_*` 메소드로 감싸기 동작 실행하기
- `checked_*` 메소드를 사용하여 오버플로우가 발생하면 `None` 값 반환하기
- `overflowing_*` 메소드를 사용하여 값과 함께 오버플로우 발생이 있었는지를 알려주는 boolean 값 반환하기
- `saturating_*` 메소드를 사용하여 값의 최대 혹은 최소값 사이로 제한하기

#### [부동 소수점 타입](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%EB%B6%80%EB%8F%99-%EC%86%8C%EC%88%98%EC%A0%90-%ED%83%80%EC%9E%85)

러스트의 부동소수점 타입은 `f32`와 `f64`로, 각각 32bit와 64bit의 크기를 갖습니다.

기본 타입은 `f64`인데, 그 이유는 **현대의 CPU 상에서 `f64`가 `f32`와 대략 비슷한 속도를 내면서도 더 정밀하기 때문입니다.**

다음은 부동소수점 숫자의 용례입니다: - `let x = 2.0; // f64` - `let y: f32 = 3.0; // f32`

- 부동소수점 숫자는 IEEE-754 표준을 따릅니다.
- `f32` 타입은 1배수 정밀도 (single-precision)인 부동소수점이고,
- `f64`는 2배수 정밀도(double-precision)입니다.

#### [수치 연산](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%EC%88%98%EC%B9%98-%EC%97%B0%EC%82%B0)

러스트는 모든 숫자 타입에 대해서 여러분이 기대하는 기본 수학 연산 기능을 제공합니다.

[부록 B](https://rust-kr.github.io/doc.rust-kr.org/appendix-02-operators.html)에 Rust가 제공하는 모든 연산자 목록이 있습니다.

#### [Boolean 타입](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#boolean-%ED%83%80%EC%9E%85)

- 러스트에서의 boolean 타입도 `true`와 `false` 둘 중 하나의 값만 갖습니다.
- boolean 값은 1 byte 크기입니다.
- 러스트에서 boolean 타입은 `bool`로 명시됩니다.

#### [문자 타입](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%EB%AC%B8%EC%9E%90-%ED%83%80%EC%9E%85)

러스트의 `char`는 이 언어의 가장 기본적인 알파벳 타입입니다.

스트링 리터럴이 큰따옴표를 쓰는 것에 반면, `char` 타입은 **작은따옴표로 쓰는 점을 주목**하세요.

- `let c = 'z';`
- `let heart_eyed_cat = '😻';`

- 러스트의 `char`타입은 4 byte 크기이며
- 유니코드 스칼라 값을 표현하는데, 이는 ASCII 보다 훨씬 더 많은 값을 표현할 수 있다는 의미입니다.
- 억양 표시가 있는 문자, 한국어/중국어/일본어 문자, 이모지, 넓이가 0인 공백문자 모두가 러스트에서는 유효한 `char` 값입니다.
- 유니코드 스칼라 값의 범위는 `U+0000`에서 `U+D7FF`, 그리고 `U+E000`에서 `U+10FFFF`입니다.
- 하지만 “문자”는 유니코드를 위한 개념이 아니기 때문에, “문자”에 대한 여러분의 직관은 `char`와 들어맞지 않을지도 모릅니다. 8장의 [“문자열에 UTF-8 텍스트를 저장하기”](https://rust-kr.github.io/doc.rust-kr.org/ch08-02-strings.html#%EB%AC%B8%EC%9E%90%EC%97%B4%EC%97%90-utf-8-%ED%85%8D%EC%8A%A4%ED%8A%B8%EB%A5%BC-%EC%A0%80%EC%9E%A5%ED%95%98%EA%B8%B0) 에서 이 주제에 대해 자세히 다루겠습니다.

### [복합 타입](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%EB%B3%B5%ED%95%A9-%ED%83%80%EC%9E%85)

*복합 타입 (compound type)* 은 여러 값들을 하나의 타입으로 묶을 수 있습니다.

러스트는 `튜플(tuple)`과 `배열(array)` 두 가지 기본 복합 타입을 제공합니다.

#### [튜플 타입](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%ED%8A%9C%ED%94%8C-%ED%83%80%EC%9E%85)

튜플은 다양한 타입의 여러 값들을 묶어 하나의 복합 타입으로 만드는 일반적인 방법입니다.

튜플은 고정된 길이를 갖습니다. 즉, **한번 선언되면 그 크기를 늘리거나 줄일 수 없습니다.**

- 튜플 내의 각 위치는 타입을 갖고, 이 튜플 내의 타입들은 서로 달라도 됩니다. - `let tup: (i32, f64, u8) = (500, 6.4, 1);`

- 튜플은 하나의 복합 원소로 취급되므로, 변수 `tup`은 튜플 전체가 바인딩됩니다.
- 튜플로부터 개별 값을 얻어오려면 아래와 같이 `구조해체 (destructuring)`를 하여 튜플 값을 해체하면 사용하면 됩니다
  - `let (x, y, z) = tup
- 마침표(`.`) 뒤에 접근하고자 하는 값의 인덱스를 쓰는 방식으로도 값을 얻을 수 있습니다.
  - `let six_point_four = tup.1;`

#### [배열 타입](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%EB%B0%B0%EC%97%B4-%ED%83%80%EC%9E%85)

여러 값들의 집합체를 만드는 다른 방법으로는 `배열`이 있습니다.

- 튜플과는 달리 배열의 모든 요소는 모두 같은 타입이여야 합니다.
- 러스트의 배열은 튜플과 마찬가지로 고정된 길이를 갖습니다.
- 여러분이 힙보다는 스택에 데이터를 할당하고 싶을 때나 (힙과 스택은 4장에서 더 다루겠습니다) 항상 고정된 개수의 원소로 이루어진 경우라면 배열이 유용합니다.
- 하지만 배열은 벡터 타입처럼 유연하지는 않습니다.
  - 벡터는 표준 라이브러리가 제공하는 배열과 유사한 컬렉션 타입인데 크기를 늘리거나 줄일 수 있습니다. 배열을 이용할지 혹은 벡터를 이용할지 잘 모르겠다면, 아마도 벡터를 사용해야 할 겁니다.
  - 8장에서 벡터에 대해 더 자세히 다룰 예정입니다.
- 예시
  - `let a = [1, 2, 3, 4, 5];`
  - `let a: [i32; 5] = [1, 2, 3, 4, 5];` 배열 원소의 갯수 기입
  - `let a = [3; 5];` 3의 값을 가진 원소 5개 `[3,3,3,3,3]`

##### [배열 요소에 접근하기](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%EB%B0%B0%EC%97%B4-%EC%9A%94%EC%86%8C%EC%97%90-%EC%A0%91%EA%B7%BC%ED%95%98%EA%B8%B0)

- 배열은 스택에 할당된 단일 메모리 뭉치입니다.
- 인덱스를 통해 배열 요소에 접근할 수 있습니다

##### [유효하지 않은 배열 요소에 대한 접근](https://rust-kr.github.io/doc.rust-kr.org/ch03-02-data-types.html#%EC%9C%A0%ED%9A%A8%ED%95%98%EC%A7%80-%EC%95%8A%EC%9D%80-%EB%B0%B0%EC%97%B4-%EC%9A%94%EC%86%8C%EC%97%90-%EB%8C%80%ED%95%9C-%EC%A0%91%EA%B7%BC)

- 만약 배열의 끝을 넘어선 요소에 접근하려고 하면 컴파일은 되지만 실행 시에 에러가 발생하며 멈추게 됩니다.
- 컴파일 시점에서는 아무런 에러도 발생하지 않지만, 프로그램은 *런타임 (runtime)* 에러를 발생시켰고 성공적으로 끝나지 못했습니다.
  - 빌드할 때 `error: this operation will panic at runtime` 에러와 함께 빌드 안됌
  - could not compile `hello-rust` due to previous error

여러분이 인덱스를 이용해 원소에 접근 시도를 할 때, 러스트는 여러분이 명시한 인덱스가 배열 길이보다 작은지 검사할 것입니다. 인덱스가 배열 길이보다 크거나 같을 경우 러스트는 패닉(panic)을 일으킵니다.

---

## [함수](https://rust-kr.github.io/doc.rust-kr.org/ch03-03-how-functions-work.html#%ED%95%A8%EC%88%98)

---

- `main` 함수는 많은 프로그램의 시작 지점입니다.
- 새로운 함수를 선언하도록 해주는 `fn` 키워드
- **러스트 코드는 함수나 변수 이름을 위한 관례로 `스네이크 케이스 (snake case)` 방식**을 이용합니다.
- 러스트는 여러분의 함수 위치를 고려하지 않으며, 어디든 정의만 되어 있으면 됩니다.

### [함수 매개변수](https://rust-kr.github.io/doc.rust-kr.org/ch03-03-how-functions-work.html#%ED%95%A8%EC%88%98-%EB%A7%A4%EA%B0%9C%EB%B3%80%EC%88%98)

- 함수는 *매개변수 (parameter)* 를 갖도록 정의될 수 있으며, 이는 함수 시그니처 (function signiture) 의 일부인 특별한 변수입니다.
- 함수가 매개변수를 갖고 있으면 이 매개변수를 위한 고정값(concrete value)을 전달할 수 있습니다.
- 전문용어로 이런 고정값을 *인자 (argument)* 라고 부르지만, 사람들은 보통 *매개변수*와 *인자*라는 용어를 함수 정의부 내의 변수나 함수 호출시 집어넣는 고정값에 대해 말할 때 혼용하는 경향이 있습니다.
  - 엄밀히 말해서 `parameter`는 함수의 정의부분에 나열되어 있는 변수들을 의미하며,
  - `argument`는 함수를 호출할때 전달되는 실제 값을 의미한다.
  - 이같은 의미를 명확히 하기 위해 `parameter`는 변수(variable)로, `argument`는 값(value)으로 보는 것이 일반적이다.

### [함수 본문은 구문과 표현식으로 구성됩니다](https://rust-kr.github.io/doc.rust-kr.org/ch03-03-how-functions-work.html#%ED%95%A8%EC%88%98-%EB%B3%B8%EB%AC%B8%EC%9D%80-%EA%B5%AC%EB%AC%B8%EA%B3%BC-%ED%91%9C%ED%98%84%EC%8B%9D%EC%9C%BC%EB%A1%9C-%EA%B5%AC%EC%84%B1%EB%90%A9%EB%8B%88%EB%8B%A4)

- 함수 본문은 필요에 따라 `표현식(expression)`으로 종결되는 `구문(statement)`의 나열로 구성됩니다.
- 지금까지는 종결 표현식이 없는 함수만 다뤘지만, 구문의 일부분으로 표현식이 쓰인건 보셨습니다.
- 러스트는 표현식 기반의 언어이므로, 구문과 표현식의 구분은 러스트 이해에 중요합니다.
- 다른 언어들은 이런 구분이 없으므로, 구문과 표현식이 무엇이며 둘 간의 차이가 함수의 본문에 어떤 영향을 주는지 살펴보겠습니다.

> `구문(statement)`은 어떤 동작을 수행하고 값을 반환하지 않는 명령입니다.
> `표현식(expression)`은 결과 값을 산출해냅니다.

- `let` 키워드로 변수를 만들고 값을 할당하는 것은 구문입니다.
  - 이것이 C나 Ruby 같은 다른 언어와의 차이점인데, 이 언어들은 할당문이 할당된 값을 반환하죠.
  - 이런 언어들에서는 `x = y = 6`라고 작성하여 `x`와 `y`에 모두 `6`을 대입할 수 있지만,
  - 러스트에서는 이렇지 않습니다.
- 함수 정의도 구문입니다
- `5 + 6`과 같은 간단한 수학 연산을 살펴봅시다. 이 수식은 `11`이란 값을 산출하는 표현식입니다.
- 표현식은 구문의 일부일 수 있습니다.
- 함수를 호출하는 것도, 매크로를 호출하는 것도 표현식입니다.
- 아래 예제처럼 새로운 스코프 생성을 위해 사용된 `{}` 코드 블록도 표현식입니다:

```rust
let y = {
	let x = 3;
	x + 1
};
println!("The value of y is: {}", y); // 4
```

- `x + 1` 줄의 마지막이 세미콜론으로 끝나지 않은 점을 주목하세요.
- **표현식은 종결을 나타내는 세미콜론을 쓰지 않습니다.**
- 만약 표현식 끝에 세미콜론을 추가하면, 표현식은 구문으로 변경되고 값을 반환하지 않게 됩니다.

### [반환 값을 갖는 함수](https://rust-kr.github.io/doc.rust-kr.org/ch03-03-how-functions-work.html#%EB%B0%98%ED%99%98-%EA%B0%92%EC%9D%84-%EA%B0%96%EB%8A%94-%ED%95%A8%EC%88%98)

- 함수는 호출한 코드에게 값을 반환할 수 있습니다.
- 반환되는 값을 명명해야 할 필요는 없지만, 그 값의 타입은 화살표 (`->`) 뒤에 선언되어야 합니다.
- `return` 키워드와 값을 지정하여 함수로부터 일찍 값을 반환할 수 있지만, 대부분의 함수들은 암묵적으로 마지막 표현식 값을 반환합니다.

---

## [3.4 주석](https://rust-kr.github.io/doc.rust-kr.org/ch03-04-comments.html#%EC%A3%BC%EC%84%9D)

---

프로그래머들은 *주석 (comment)* 이라 불리우는 노트를 코드에 남겨서 컴파일러는 이를 무시하지만 코드를 읽는 사람들은 유용한 정보를 얻을 수 있게 합니다.

간단한 주석의 예를 봅시다:

`// hello, world`

러스트에서 주석은 두개의 슬래시로 시작하며, 이 주석은 해당 줄의 끝까지 계속됩니다.

한 줄을 넘기는 주석의 경우에는 아래처럼 각 줄마다 `//`를 추가하면 됩니다:

러스트는 문서화 주석 (documentation comment) 라고 불리우는 또다른 주석 형태를 가지고 있는데, 14장의 “크레이트를 Crates.io에 퍼블리싱 하기” 에서 다루도록 하겠습니다.

---

## [3.5 흐름 제어문](https://rust-kr.github.io/doc.rust-kr.org/ch03-05-control-flow.html#%ED%9D%90%EB%A6%84-%EC%A0%9C%EC%96%B4%EB%AC%B8)

---

러스트 코드의 실행 흐름을 제어하도록 해주는 가장 일반적인 재료는 `if` 표현식과 반복문입니다.

조건식은 *반드시* `bool` 이어야 한다는 점을 주목할 가치가 있습니다.

#### [`let` 구문에서 `if` 사용하기](https://rust-kr.github.io/doc.rust-kr.org/ch03-05-control-flow.html#let-%EA%B5%AC%EB%AC%B8%EC%97%90%EC%84%9C-if-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)

- `if`는 표현식이기 때문에 Listing 3-2처럼 `let` 구문의 우변에 사용할 수 있습니다.
  - `let number = if true { 5 } else { 6 };`
- 코드 블록은 블록 안의 마지막 표현식을 계산하고 **숫자는 그 자체로 표현식임을** 기억하세요

### [반복문을 이용한 반복](https://rust-kr.github.io/doc.rust-kr.org/ch03-05-control-flow.html#%EB%B0%98%EB%B3%B5%EB%AC%B8%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EB%B0%98%EB%B3%B5)

코드 블록을 한 번 이상 수행하는 일은 자주 쓰입니다. 반복 작업을 위해서, 러스트는 몇 가지 *반복문(loop)* 을 제공합니다.

러스트에는 `loop`, `while`, 그리고 `for`라는 세 종류의 반복문이 있습니다.

#### [`loop`로 코드 반복하기](https://rust-kr.github.io/doc.rust-kr.org/ch03-05-control-flow.html#loop%EB%A1%9C-%EC%BD%94%EB%93%9C-%EB%B0%98%EB%B3%B5%ED%95%98%EA%B8%B0)

`loop` 키워드는 여러분이 그만두라고 명시적으로 알려주기 전까지 혹은 영원히 코드 블록을 반복 수행되도록 해줍니다.

#### [반복문에서 값 반환하기](https://rust-kr.github.io/doc.rust-kr.org/ch03-05-control-flow.html#%EB%B0%98%EB%B3%B5%EB%AC%B8%EC%97%90%EC%84%9C-%EA%B0%92-%EB%B0%98%ED%99%98%ED%95%98%EA%B8%B0)

- `loop`의 용례 중 하나는 어떤 스레드가 실행 완료되었는지 검사하는 등 실패할지도 모르는 연산을 재시도할 때 입니다.
- 여기서 해당 연산의 결과를 이후 코드에 넘겨주고 싶을지도 모릅니다.
- 이를 위해서는 루프 정지를 위해 사용한 `break` 표현식 뒤에 반환하고자 하는 값을 넣으면 됩니다;
- 해당 값은 아래와 같이 반복문 밖으로 반환되여 사용 가능하게 됩니다:

```rust
fn main() {
	let mut counter = 0;
	let result = loop {
		counter += 1;
		if counter == 10 {
			break counter * 2;
		}
	};
	println!("The result is {}", result);
}

```

#### [`while`을 이용한 조건 반복문](https://rust-kr.github.io/doc.rust-kr.org/ch03-05-control-flow.html#while%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%A1%B0%EA%B1%B4-%EB%B0%98%EB%B3%B5%EB%AC%B8)

반복문 내에서 조건 검사를 하는 작업도 자주 사용됩니다. 조건문이 참인 동안에는 계속 반복하는 형태죠.

조건문이 참이 아니게 될 때 프로그램은 `break`를 호출하여 반복을 종료합니다.

이러한 반복문 형태는 `loop`, `if`, `else`와 `break`의 조합으로 구현할 수 있습니다.

하지만 이러한 패턴은 매우 흔하기 때문에 러스트에서는 `while` 반복문이라 일컫는 구조가 내장되어 있습니다.

```rust
	let mut num = 0
	while num < 10 {
		num += 1
	}
```

#### [`for`를 이용한 콜렉션에 대한 반복문](https://rust-kr.github.io/doc.rust-kr.org/ch03-05-control-flow.html#for%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%BD%9C%EB%A0%89%EC%85%98%EC%97%90-%EB%8C%80%ED%95%9C-%EB%B0%98%EB%B3%B5%EB%AC%B8)

`for` 반복문을 사용하여 콜렉션의 각 아이템에 대한 어떤 코드를 수행시킬 수 있습니다.

```rust
	let a = [1,2,3,4,5];
	for val in a.iter() {
		println("{val}");
	}
```

안전성과 간편성 덕분에 `for` 반복문은 러스트에서 가장 흔하게 사용되는 반복문 구성요소가 되었습니다.

표준 라이브러리가 제공하는 `Range` 타입을 이용하면 그렇게 원하는 횟수에 대한 반복문을 구현할 수 있는데, `Range`는 어떤 숫자에서 시작하여 다른 숫자 종료 전까지의 모든 숫자를 차례로 생성해줍니다.

`for number in (1..4)`

---

## 8 kyu

### Grasshopper - Messi Goals

```rust
static la_liga_goals: u32 = 43;
static champions_league_goals: u32 = 10;
static copa_del_rey_goals: u32 = 5;

static total_goals: u32 = la_liga_goals+champions_league_goals+copa_del_rey_goals;
```

### Remove First and Last Character

```rust
pub fn remove_char(s: &str) -> String {
    s[1..s.len() - 1].to_string()
}

```

### Welcome!

```rust
fn greet(language: &str) -> &str {
    match language {
        "czech" => "Vitejte",
        "danish" => "Velkomst",
        "dutch" => "Welkom",
        "estonian" => "Tere tulemast",
        "finnish" => "Tervetuloa",
        "flemish" => "Welgekomen",
        "french" => "Bienvenue",
        "german" => "Willkommen",
        "irish" => "Failte",
        "italian" => "Benvenuto",
        "latvian" => "Gaidits",
        "lithuanian" => "Laukiamas",
        "polish" => "Witamy",
        "spanish" => "Bienvenido",
        "swedish" => "Valkommen",
        "welsh" => "Croeso",
        _ => "Welcome",
    }
}
```

### Are You Playing Banjo?

- Rust에는 문자열 타입이 두가지 존재한다. 언어 자체로 지원하는 str과 표준 라이브러리에서 지원하는 String이 그렇다.
- `let s1: &str = "Hello str";`
- `let s2: String = String::from("Hello String");`
- str은 보통 &str로 많이 사용한다.
- String과 &str의 가장 큰 차이점은 String은 문자열 수정이 가능하지만 &str은 불가능하다는 점이다.
- &str은 보통 문자열 리터럴이나 문자열 슬라이스를 저장하는데 사용된다.
- 출처: https://steelbear.tistory.com/86 [steelbear's notes:티스토리]

```rust
fn are_you_playing_banjo(name: &str) -> String {
    let name = name.to_string();
    if name.starts_with('r') || name.starts_with('R') {
        name + " plays banjo"
    } else {
        name + " does not play banjo"
    }
}
//
fn are_you_playing_banjo(name: &str) -> String {
    match &name[0..1] {
        "R" | "r" => format!("{} plays banjo", name),
        _ => format!("{} does not play banjo", name)
    }
}
fn are_you_playing_banjo(name: &str) -> String {
    match name.to_lowercase().starts_with("r") {
        true => format!("{} plays banjo", name),
        false => format!("{} does not play banjo", name)
    }
}
```

## 7 kyu

### The highest profit wins!

<!--  * 를 아직 명확하게 모름 -->

```rust
fn min_max(lst: &[i32]) -> (i32, i32) {
    (*lst.iter().min().unwrap(), *lst.iter().max().unwrap())
}
//
use itertools::Itertools;

fn min_max(xs: &[i32]) -> (i32, i32) {
    xs.iter().cloned().minmax().into_option().unwrap()
}
fn min_max(lst: &[i32]) -> (i32, i32) {
    let min = lst.iter().min().unwrap();
    let max = lst.iter().max().unwrap();

    (*min, *max)
}

```

### Regex validate PIN code

```rust
Option
Some(_) =>
None =>
fn validate_pin(pin: &str) -> bool {
    let len = pin.len();
    if len == 4 || len == 6 {
        let mut ans = true;
        pin.chars().for_each(|x| match x.to_digit(10) {
            Some(_) => {}
            None => ans = false,
        });
        ans
    } else {
        false
    }
}
//
fn validate_pin(pin: &str) -> bool {
    pin.chars().all(|c| c.is_digit(10)) && (pin.len() == 4 || pin.len() == 6)
}
fn validate_pin(pin: &str) -> bool {
    if ![4, 6].contains(&pin.len()) { return false; }
    pin.chars().all(|c| c.is_ascii_digit())
}
```

### Printer Errors

```rust
fn printer_error(s: &str) -> String {
    static ASCII_LOWER: [char; 13] = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    ];
    let cnt = s
        .to_string()
        .chars()
        .into_iter()
        .filter(|x| !ASCII_LOWER.contains(x))
        .count()
        .to_string();

    let ans = cnt + "/" + &s.len().to_string();
    ans
}
//
fn printer_error(s: &str) -> String {
    // Your cude here
    format!("{}/{}", s.chars().filter(|&c| c > 'm').count(), s.len())
}
fn printer_error(s: &str) -> String {
    let total = s.len();
    let bad = s.chars().filter(|&c| c < 'a' || c > 'm').count();
    format!("{}/{}", bad, total)
}
```

### Shortest Word

```rust
fn find_short(s: &str) -> u32 {
    s.to_string()
        .split(" ")
        .map(|x| x.len() as u32)
        .min()
        .unwrap()
}
//
fn find_short(s: &str) -> usize {
  s.split_whitespace().map(str::len).min().unwrap()
}
fn find_short(s: &str) -> u32 {
  s.split_whitespace()
   .map(|word| word.len())
   .min()
   .unwrap_or(0) as u32
}
```

### Growth of a Population

```rust
fn nb_year(p0: i32, percent: f64, aug: i32, p: i32) -> i32 {
    let mut cnt = 0;
    let mut total = p0 as f64;

    while total < p as f64 {
        total = total + (total * (percent / 100 as f64)) + aug as f64;
        total = total.floor();
        cnt += 1
    }
    cnt
}
```
