---
slug: post/18
title: Chap.6 enums and match

authors: [brown]
tags: [rust, study, enums, match]
date: 2022-09-11 15:38
---

이번 장에서는 *열거(enumerations)* 에 대해 살펴볼 것입니다. *열거형(enums)* 이라고도 합니다.

열거형은 하나의 타입이 가질 수 있는 variant들을 열거함으로써 타입을 정의할 수 있도록 합니다.

1. 우선, 하나의 열거형을 정의하고 사용해 봄으로써, 어떻게 열거형에 의미와 함께 데이터를 담을 수 있는지 보여줄 것입니다.
2. 다음으로, `Option` 이라고 하는 특히 유용한 열거형을 자세히 볼 텐데, 이것은 어떤 값을 가질 수도 있고, 갖지 않을 수도 있습니다.
3. 그 다음으로, 열거형의 값에 따라 쉽게 다른 코드를 실행하기 위해 `match` 표현식에서 패턴 매칭을 사용하는 방법을 볼 것입니다.
4. 마지막으로, 코드에서 열거형을 편하고 간결하게 다루기 위한 관용 표현인 `if let` 구문을 다룰 것입니다.

열거형은 다른 언어들에서도 볼 수 있는 특징이지만, 열거형으로 할 수 있는 것들은 언어마다 다릅니다.
p
러스트의 열거형은 F#, OCaml, Haskell 과 같은 함수형 언어의 *대수 데이터 타입*과 가장 비슷합니다.

## [6.1 열거형 정의하기](https://rust-kr.github.io/doc.rust-kr.org/ch06-01-defining-an-enum.html#%EC%97%B4%EA%B1%B0%ED%98%95-%EC%A0%95%EC%9D%98%ED%95%98%EA%B8%B0)

IP 주소를 다루는 프로그램을 만들어 보면서, 어떤 상황에서 열거형이 구조체보다 유용하고 적절한지 알아보겠습니다.

1. 현재 사용되는 IP 주소 표준은 IPv4, IPv6 두 종류입니다(앞으로 v4, v6 로 표기하겠습니다).
2. 즉, 우리가 만들 프로그램에서 다룰 IP 종류 역시 v4, v6 가 전부입니다.
3. 이번엔 단 두 가지뿐이긴 하지만, **이처럼 가능한 모든 variant들을 죽 늘어놓는 것을 `열거`라고 표현**합니다.
4. IP 주소는 반드시 v4나 v6 중 하나만 될 수 있는데, 이러한 특성은 열거형 자료 구조에 적합합니다.
   1. 왜냐하면, 열거형의 값은 여러 variant 중 하나만 될 수 있기 때문입니다.
   2. v4, v6 는 근본적으로 IP 주소이기 때문에, 이 둘은 코드에서 모든 종류의 IP 주소에 적용되는 상황을 다룰 때 동일한 타입으로 처리되는 것이 좋습니다.

```rust
enum IpAddrKind {
    V4,
    V6,
}
fn main() {
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;
    route(IpAddrKind::V4);
    route(IpAddrKind::V6);
}
fn route(ip_kind: IpAddrKind) {}
```

이제 `IpAddrKind` 은 우리의 코드 어디에서나 쓸 수 있는 데이터 타입이 되었습니다.

### [열거형 값](https://rust-kr.github.io/doc.rust-kr.org/ch06-01-defining-an-enum.html#%EC%97%B4%EA%B1%B0%ED%98%95-%EA%B0%92)

아래처럼 `IpAddrKind` 의 두 개의 variant 에 대한 인스턴스를 만들 수 있습니다:

```rust
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;
```

- **열거형을 정의할 때의 식별자로 네임스페이스가 만들어져서, 각 variant 앞에 콜론(`:`) 두 개를 붙여야 한다는 점을 알아두세요.**
- 이 방식은 `IpAddrKind::V4`, `IpAddrKind::V6` 가 모두 `IpAddrKind` 타입이라는 것을 표현할 수 있다는 장점이 있습니다.

이제 `IpAddrKind` 타입을 인자로 받는 함수를 정의해봅시다:

```rust
fn route(ip_kind: IpAddrKind) {}
```

그리고, variant 중 하나를 사용해서 함수를 호출할 수 있습니다

```rust
route(IpAddrKind::V4);
route(IpAddrKind::V6);
```

열거형을 사용하면 이점이 더 있습니다. IP 주소 타입에 대해 더 생각해 볼 때, 지금으로써는 실제 IP 주소 *데이터* 를 저장할 방법이 없습니다. 단지 어떤 *종류* 인지만 알 뿐입니다.

5장에서 구조체에 대해 방금 공부했다고 한다면, 이 문제를 Listing 6-1에서 보이는 것처럼 풀려고 할 것입니다:

```rust
fn main() {
    enum IpAddrKind {
        V4,
        V6,
    }
    struct IpAddr {
        kind: IpAddrKind,
        address: String,
    }
    let home = IpAddr {
        kind: IpAddrKind::V4,
        address: String::from("127.0.0.1"),
    };
    let loopback = IpAddr {
        kind: IpAddrKind::V6,
        address: String::from("::1"),
    };
}
```

Listing 6-1: `struct` 를 사용해서 IP 주소의 데이터와 `IpAddrKind` variant 저장하기

- `IpAddrKind` (이전에 정의한 열거형) 타입 `kind` 필드와 `String` 타입 `address` 필드를 갖는 `IpAddr` 를 정의하고, 인스턴스를 두 개 생성했습니다.
- 첫 번째 `home` 은 `kind` 의 값으로 `IpAddrKind::V4` 을 갖고 연관된 주소 데이터로 `127.0.0.1` 를 갖습니다.
- 두 번째 `loopback` 은 `IpAddrKind` 의 다른 variant 인 `V6` 을 값으로 갖고, 연관된 주소로 `::1` 를 갖습니다.
- `kind` 와 `address` 의 값을 함께 사용하기 위해 구조체를 사용했습니다.
- 그렇게 함으로써 variant 가 연관된 값을 갖게 되었습니다.

**각 열거형 variant 에 데이터를 직접 넣는 방식**을 사용해서 **열거형을 구조체의 일부로 사용하는 방식**보다 더 간결하게 동일한 개념을 표현할 수 있습니다.

`IpAddr` 열거형의 새로운 정의에서는 두 개의 `V4` 와 `V6` variant 는 연관된 `String` 타입의 값을 갖게 됩니다:

```rust
    enum IpAddr {
        V4(String),
        V6(String),
    }
    let home = IpAddr::V4(String::from("127.0.0.1"));
    let loopback = IpAddr::V6(String::from("::1"));
```

열거형의 각 variant 에 직접 데이터를 붙임으로써, 구조체를 사용할 필요가 없어졌습니다.

- 구조체 대신 열거형을 사용할 때의 또 다른 장점이 있습니다.
- 각 variant 는 다른 타입과 다른 양의 연관된 데이터를 가질 수 있습니다.
- v4 타입의 IP 주소는 항상 0 ~ 255 사이의 숫자 4개로 된 구성요소를 갖게 될 것입니다.
- `V4` 주소에 4개의 `u8` 값을 저장하길 원하지만, v6 주소는 하나의 String 값으로 표현되길 원한다면, 구조체로는 이렇게 할 수 없습니다.
- 열거형은 이런 경우를 쉽게 처리합니다

```rust
    enum IpAddr {
        V4(u8, u8, u8, u8),
        V6(String),
    }
    let home = IpAddr::V4(127, 0, 0, 1);
    let loopback = IpAddr::V6(String::from("::1"));
```

- 두 가지 다른 종류의 IP 주소를 저장하기 위해 코드상에서 열거형을 정의하는 몇 가지 방법을 살펴봤습니다.
- 그러나, 누구나 알듯이 IP 주소와 그 종류를 저장하는 것은 흔하기 때문에, [표준 라이브러리에 사용할 수 있는 정의가 있습니다!](https://doc.rust-lang.org/std/net/enum.IpAddr.html) 표준 라이브러리에서 `IpAddr` 를 어떻게 정의하고 있는지 살펴봅시다.
- 위에서 정의하고 사용했던 것과 동일한 열거형과 variant 를 갖고 있지만, variant 에 포함된 주소 데이터는 두 가지 다른 구조체로 되어 있으며, 각 variant 마다 다르게 정의하고 있습니다:

```rust
#![allow(unused)]
fn main() {
	struct Ipv4Addr {
	    // --생략--
	}
	struct Ipv6Addr {
	    // --생략--
	}
	enum IpAddr {
	    V4(Ipv4Addr),
	    V6(Ipv6Addr),
	}
}
```

이 코드로 알 수 있듯, **열거형 variant 에는 어떤 종류의 데이터건 넣을 수 있습니다.** 문자열, 숫자 타입, 구조체 등은 물론, 다른 열거형마저도 포함할 수 있죠!

이건 여담이지만, 러스트의 표준 라이브러리 타입은 여러분 생각보다 단순한 경우가 꽤 있습니다.

현재 스코프에 표준 라이브러리를 가져오지 않았기 때문에, 표준 라이브러리에 `IpAddr` 정의가 있더라도, 동일한 이름의 타입을 만들고 사용할 수 있습니다.

열거형의 다른 예제를 살펴봅시다. 이 예제에서는 각 variant 에 다양한 유형의 타입들이 포함되어 있습니다:

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```

이 열거형에는 다른 데이터 타입을 갖는 네 개의 variant 가 있습니다:

- `Quit` 은 연관된 데이터가 전혀 없습니다.
- `Move` 은 익명 구조체를 포함합니다.
- `Write` 은 하나의 `String` 을 포함합니다.
- `ChangeColor` 는 세 개의 `i32` 을 포함합니다.

variant 로 열거형을 정의하는 것은 다른 종류의 구조체들을 정의하는 것과 비슷합니다. 열거형과 다른 점은 `struct` 키워드를 사용하지 않는다는 것과 모든 variant 가 `Message` 타입으로 그룹화된다는 것입니다. 아래 구조체들은 이전 열거형의 variant 가 갖는 것과 동일한 데이터를 포함할 수 있습니다:

```rust
struct QuitMessage; // unit struct
struct MoveMessage {
    x: i32,
    y: i32,
}
struct WriteMessage(String); // tuple struct
struct ChangeColorMessage(i32, i32, i32); // tuple struct
```

각기 다른 타입을 갖는 여러 개의 구조체를 사용한다면, 이 메시지 중 어떤 한 가지를 인자로 받는 함수를 정의하기 힘들 것입니다. Listing 6-2 에 정의한 `Message` 열거형은 하나의 타입으로 이것이 가능합니다.

- 열거형과 구조체는 한 가지 더 유사한 점이 있습니다.
- 구조체에 `impl` 을 사용해서 메소드를 정의한 것처럼, **열거형에도 정의할 수 있습니다.**
- 여기 `Message` 열거형에 에 정의한 `call` 이라는 메소드가 있습니다:

```rust
fn main() {
    enum Message {
        Quit,
        Move { x: i32, y: i32 },
        Write(String),
        ChangeColor(i32, i32, i32),
    }
    impl Message {
        fn call(&self) {
            // method body would be defined here
        }
    }
    let m = Message::Write(String::from("hello"));
    m.call();
}
```

열거형의 값을 가져오기 위해 메소드 안에서 `self` 를 사용할 것입니다.

이 예제에서 생성한 변수 `m` 은 `Message::Write(String::from("hello"))` 값을 갖게 되고, 이 값은 `m.call()`이 실행될 때, `call` 메소드 안에서 `self`가 될 것입니다.

이제 표준 라이브러리에 포함된 열거형 중 유용하고 굉장히 자주 사용되는 `Option` 열거형을 살펴봅시다:

### [`Option` 열거형이 Null 값 보다 좋은 점들](https://rust-kr.github.io/doc.rust-kr.org/ch06-01-defining-an-enum.html#option-%EC%97%B4%EA%B1%B0%ED%98%95%EC%9D%B4-null-%EA%B0%92-%EB%B3%B4%EB%8B%A4-%EC%A2%8B%EC%9D%80-%EC%A0%90%EB%93%A4)

이번 절에서는 표준 라이브러리에서 열거형으로 정의된 또 다른 타입인 `Option` 에 대한 사용 예를 살펴볼 것입니다.

- `Option` 타입은 많이 사용되는데, 값이 있거나 없을 수도 있는 아주 흔한 상황을 나타내기 때문입니다.
- 이 개념을 타입 시스템의 관점으로 표현하자면, 컴파일러가 발생할 수 있는 모든 경우를 처리했는지 체크할 수 있습니다.
- 이렇게 함으로써 버그를 방지할 수 있고, 이것은 다른 프로그래밍 언어에서 매우 흔합니다.

- 러스트는 다른 언어들에서 흔하게 볼 수 있는 null 개념이 없습니다.
  - *Null* 은 값이 없다는 것을 표현하는 하나의 값입니다.
- null 개념이 존재하는 언어에서, 변수의 상태는 둘 중 하나입니다.
- null 인 경우와, null 이 아닌 경우죠.
- null 값으로 발생하는 문제는, null 값을 null 이 아닌 값처럼 사용하려고 할 때 여러 종류의 오류가 발생할 수 있다는 것입니다.
- 하지만, "현재 어떠한 이유로 인해 유효하지 않거나, 존재하지 않는 하나의 값"이라는 null 이 표현하려고 하는 개념은 여전히 유용합니다.

null 의 문제는 실제 개념에 있기보다, 특정 구현에 있습니다. 이와 같이 러스트에는 null 이 없지만, 값의 존재 혹은 부재의 개념을 표현할 수 있는 열거형이 있습니다. 이 열거형은 `Option<T>` 이며, 다음과 같이 [표준 라이브러리에 정의되어](https://doc.rust-lang.org/std/option/enum.Option.html) 있습니다:

```rust
enum Option<T> {
    Some(T),
    None,
}
```

`Option<T>` 열거형은 너무나 유용하기 때문에, 러스트에서 기본으로 임포트하는 목록인 `prelude` 에도 포함돼있습니다. 따라서 명시적으로 가져올 필요가 없으며, `Some`, `None` variant 앞에 `Option::` 도 붙이지 않아도 됩니다.

여러모로 특별하긴 하지만 `Option<T>` 는 여전히 일반적인 열거형이며, `Some(T)`, `None` 도 여전히 `Option<T>` 의 variant 입니다.

> `<T>` 는 러스트의 문법이며 아직 다루지 않았습니다. 제너릭 타입 파라미터이며, 제너릭에 대해서는 10 장에서 더 자세히 다룰 것입니다. 지금은 단지 `<T>` 가 `Option` 열거형의 `Some` variant 가 어떤 타입의 데이터라도 가질 수 있다는 것을 의미한다는 것을 알고 있으면 됩니다. 여기 숫자 타입과 문자열 타입을 갖는 `Option` 값에 대한 예들이 있습니다:

```rust
    let some_number = Some(5);
    let some_string = Some("a string");

    let absent_number: Option<i32> = None;
```

`Some` 이 아닌 `None` 을 사용한다면, `Option<T>` 이 어떤 타입을 가질지 러스트에게 알려줄 필요가 있습니다. 컴파일러는 `None` 만 보고는 `Some` variant 가 어떤 타입인지 추론할 수 없습니다.

- `Some` 값을 얻게 되면, 값이 존재한다는 것과 해당 값이 `Some` 내에 있다는 것을 알 수 있습니다.
- `None` 값을 얻게 되면, 얻은 값이 유효하지 않은 값이라는, 어떤 면에서는 null 과 같은 의미를 갖습니다.
- 그렇다면 왜 `Option<T>` 가 null 을 갖는 것보다 나을까요?
  간단하게 말하면, `Option<T>` 와 `T`는 다른 타입이며, 컴파일러는 `Option<T>` 값을 명확하게 유효한 값처럼 사용하지 못하도록 합니다.
- `T` 에 대한 연산을 수행하기 전에 `Option<T>` 를 `T` 로 변환해야 합니다.
- 이런 방식은 null 로 인해 발생하는 가장 흔한 문제인, 실제로는 null 인데 null 이 아니라고 가정하는 상황을 발견하는 데 도움이 됩니다.

null 이 아닌 값을 갖는다는 가정을 놓치는 경우에 대해 걱정할 필요가 없게 되면, 코드에 더 확신을 갖게 됩니다. **null 일 수 있는 값을 사용하기 위해서, 명시적으로 값의 타입을 `Option<T>` 로 만들어 줘야 합니다.** 그다음엔 값을 사용할 때 명시적으로 null 인 경우를 처리해야 합니다. 값의 타입이 `Option<T>` 가 아닌 모든 곳은 값이 null 이 아니라고 안전하게 *가정할 수 있습니다*. 이것은 null을 너무 많이 사용하는 문제를 제한하고 러스트 코드의 안정성을 높이기 위한 러스트의 의도된 디자인 결정 사항입니다.

그래서, `Option<T>` 타입인 값을 사용할 때 `Some` variant 에서 `T` 값을 가져오려면 어떻게 해야 하냐고요?

- `Option<T>` 열거형이 가진 메소드는 많고, 저마다 다양한 상황에서 유용하게 쓰일 수 있습니다.
- 그러니 한번 [문서에서](https://doc.rust-lang.org/std/option/enum.Option.html) 여러분에게 필요한 메소드를 찾아보세요. `Option<T>` 의 여러 메소드를 익혀두면 앞으로의 러스트 프로그래밍에 매우 많은 도움이 될 겁니다.
- 일반적으로, `Option<T>` 값을 사용하기 위해서는 각 variant 를 처리할 코드가 필요할 겁니다.
- `Some(T)` 값일 때만 실행돼서 내부의 `T` 값을 사용할 코드도 필요할 테고, `None` 값일 때만 실행될, `T` 값을 쓸 수 없는 코드도 필요할 겁니다.
- `match` 라는 제어 흐름을 구성하는 데 쓰이는 표현식을 열거형과 함께 사용하면 이런 상황을 해결할 수 있습니다.
- 열거형의 variant 에 따라서 알맞은 코드를 실행하고, 해당 코드 내에선 매칭된 값의 데이터를 사용할 수 있죠.

## [6.2 `match` 흐름 제어 연산자](https://rust-kr.github.io/doc.rust-kr.org/ch06-02-match.html#match-%ED%9D%90%EB%A6%84-%EC%A0%9C%EC%96%B4-%EC%97%B0%EC%82%B0%EC%9E%90)

러스트는 `match`라고 불리는 흐름 제어 연산자를 가지고 있는데 이는 우리에게 일련의 패턴에 대해 어떤 값을 비교한 뒤 어떤 패턴에 매치되었는지를 바탕으로 코드를 수행하도록 해줍니다.

`match` 표현식을 동전 분류기와 비슷한 종류로 생각해보세요. 동전들은 다양한 크기의 구멍들이 있는 트랙으로 미끄러져 내려가고, 각 동전은 그것에 맞는 첫 번째 구멍을 만났을 때 떨어집니다. 동일한 방식으로, 값들은 `match` 내의 각 패턴을 통과하고, 해당 값에 "맞는" 첫 번째 패턴에서, 그 값은 실행 중에 사용될 연관된 코드 블록 안으로 떨어질 것입니다.

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}
fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

- `value_in_cents` 함수 내의 `match`를 쪼개 봅시다.
- 먼저, `match` 키워드 뒤에 표현식을 써줬는데, 위의 경우에는 `coin` 값입니다.
- 이는 `if` 에서 사용하는 표현식과 매우 유사하지만, 큰 차이점이 있습니다.
  - `if` 를 사용할 경우에는 표현식에서 boolean 값을 반환해야 하지만, 여기서는 어떤 타입이든 가능합니다.
- 다음은 `match` 갈래(arm)들입니다.
  - 하나의 갈래는 패턴과 코드 두 부분으로 이루어져 있습니다.
  - 여기서의 첫 번째 갈래는 값 `Coin::Penny`로 되어있는 패턴을 가지고 있고 그 후에 패턴과 실행되는 코드를 구분해주는 `=>` 연산자가 있습니다.
  - 위의 경우에서 코드는 그냥 값 `1`입니다.
  - 각 갈래는 그다음 갈래와 쉼표로 구분됩니다.
- `match` 표현식이 실행될 때, 결과 값을 각 갈래의 패턴에 대해서 순차적으로 비교합니다.
- 만일 어떤 패턴이 그 값과 매치되면, 그 패턴과 연관된 코드가 실행됩니다.
- 만일 그 패턴이 값과 매치되지 않는다면, 동전 분류기와 비슷하게 다음 갈래로 실행을 계속합니다.

### [값들을 바인딩하는 패턴들](https://rust-kr.github.io/doc.rust-kr.org/ch06-02-match.html#%EA%B0%92%EB%93%A4%EC%9D%84-%EB%B0%94%EC%9D%B8%EB%94%A9%ED%95%98%EB%8A%94-%ED%8C%A8%ED%84%B4%EB%93%A4)

`match`의 또 다른 유용한 기능은 패턴과 매치된 값들의 부분을 바인딩할 수 있다는 것입니다.

한 가지 예로서, 우리의 열거형 variant 중 하나를 내부에 값을 들고 있도록 바꿔봅시다.

- 1999년부터 2008년까지, 미국은 각 50개 주마다 한쪽 면의 디자인이 다른 쿼터 동전을 주조했습니다.
- 다른 동전들은 주의 디자인을 갖지 않고, 따라서 오직 쿼터 동전들만 이 특별 값을 갖습니다.
- 우리는 이 정보를 `Quarter` variant 내에 `UsState` 값을 포함하도록 우리의 `enum`을 변경함으로써 추가할 수 있습니다.

1. 우리의 친구가 모든 50개 주 쿼터 동전을 모으기를 시도하는 중이라고 상상해봅시다.
2. 동전의 종류에 따라 동전을 분류하는 동안,
3. 우리는 또한 각 쿼터 동전에 연관된 주의 이름을 외쳐서,
4. 만일 그것이 우리 친구가 가지고 있지 않은 것이라면,
5. 그 친구는 자기 컬렉션에 그 동전을 추가할 수 있겠지요.

이 코드를 위한 매치 표현식 내에서는 variant `Coin::Quarter`의 값과 매치되는 패턴에 `state`라는 이름의 변수를 추가합니다. `Coin::Quarter`이 매치될 때, `state` 변수는 그 쿼터 동전의 주에 대한 값에 바인드 될 것입니다. 그러면 우리는 다음과 같이 해당 갈래에서의 코드 내에서 `state`를 사용할 수 있습니다:

```rust
#[derive(Debug)]
enum UsState {
    Alabama,
    Alaska,
    // --snip--
}
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}
fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
    }
}
fn main() {
    value_in_cents(Coin::Quarter(UsState::Alaska));
}
```

1.  만일 우리가 `value_in_cents(Coin::Quarter(UsState::Alaska))`를 호출했다면,
2.  `coin`은 `Coin::Quarter(UsState::Alaska)`가 될 테지요.
3.  각각의 매치 갈래들과 이 값을 비교할 때, `Coin::Quarter(state)`에 도달할 때까지 아무것도 매치되지 않습니다.
4.  이 시점에서, `state`에 대한 바인딩은 값 `UsState::Alaska`가 될 것입니다.
5.  그러면 이 바인딩을 `println!` 표현식 내에서 사용할 수 있고,
6.  따라서 `Quarter`에 대한 `Coin` 열거형 variant로부터 내부의 주에 대한 값을 얻었습니다.

### [`Option<T>` 를 이용하는 매칭](https://rust-kr.github.io/doc.rust-kr.org/ch06-02-match.html#optiont-%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%98%EB%8A%94-%EB%A7%A4%EC%B9%AD)

이전 절에서 `Option<T>` 값을 사용하려면 `Some` 일 때 실행돼서, `Some` 내의 `T` 값을 얻을 수 있는 코드가 필요하다고 했었죠. 이제 `Coin` 열거형을 다뤘던 것처럼 `Option<T>` 도 `match` 로 다뤄보도록 하겠습니다. 동전들을 비교하는 대신, `Option<T>`의 variant를 비교할 것이지만, `match` 표현식이 동작하는 방법은 동일하게 남아있습니다.

`Option<i32>`를 파라미터로 받아서, 내부에 값이 있으면, 그 값에 1을 더하는 함수를 작성하고 싶다고 칩시다. 만일 내부에 값이 없으면, 이 함수는 `None` 값을 반환하고 다른 어떤 연산도 수행하는 시도를 하지 않아야 합니다.

```rust
fn main() {
    fn plus_one(x: Option<i32>) -> Option<i32> {
        match x {
            None => None,
            Some(i) => Some(i + 1),
        }
    }
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
}
```

`plus_one`의 첫 번째 실행을 좀 더 자세히 시험해봅시다.

1. `plus_one(five)`가 호출될 때, `plus_one`의 본체 내의 변수 `x`는 값 `Some(5)`를 갖게 될 것입니다.
2. 그런 다음 각각의 매치 갈래에 대하여 이 값을 비교합니다.
   1. `Some(5)` 값은 패턴 `None`과 매칭되지 않으므로, 다음 갈래로 계속 갑니다.
3. `Some(5)`가 `Some(i)`랑 매칭되나요?

   1. 예, 바로 그렇습니다! 동일한 variant를 갖고 있습니다.
   2. `Some` 내부에 담긴 값은 `i`에 바인드 되므로, `i`는 값 `5`를 갖습니다.
   3. 그런 다음 매치 갈래 내의 코드가 실행되므로,
   4. `i`의 값에 1을 더한 다음 최종적으로 `6`을 담은 새로운 `Some` 값을 생성합니다.

4. 이제 `x`가 `None`인 Listing 6-5에서의 `plus_one`의 두 번째 호출을 살펴봅시다.
5. `match` 안으로 들어와서 첫 번째 갈래와 비교합니다.
   1. `None => None,`
6. 매칭되었군요! 더할 값은 없으므로, 프로그램은 멈추고 `=>`의 우측 편에 있는 `None` 값을 반환합니다.

`match`와 열거형을 조합하는 것은 다양한 경우에 유용합니다. 여러분은 러스트 코드 내에서 이러한 패턴을 많이 보게 될 겁니다. 열거형에 대한 `match`, 내부의 데이터에 변수 바인딩, 그런 다음 그에 대한 수행 코드 말이지요. 처음에는 약간 까다롭지만, 여러분이 일단 익숙해지면, 이를 모든 언어에서 쓸 수 있게 되기를 바랄 것입니다. 이것은 꾸준히 사용자들이 가장 좋아하는 기능입니다.

### [`_` Placeholder](https://rust-kr.github.io/doc.rust-kr.org/ch06-02-match.html#_-placeholder)

러스트는 또한 우리가 모든 가능한 값을 나열하고 싶지 않을 경우에 사용할 수 있는 패턴을 가지고 있습니다.
이럴 땐 `_` 라는 특별한 패턴을 사용하면 됩니다:

```rust
fn main() {
    let some_u8_value = 0u8;
    match some_u8_value {
        1 => println!("one"),
        3 => println!("three"),
        5 => println!("five"),
        7 => println!("seven"),
        _ => (),
    }
}
```

- `_` 패턴은 어떠한 값과도 매칭될 것입니다.
- 우리의 다른 갈래 뒤에 이를 집어넣음으로써, `_`는 그전에 명시하지 않은 모든 가능한 경우에 대해 매칭될 것입니다.
- `()`는 단지 단윗값이므로, `_` 케이스에서는 어떤 일도 일어나지 않을 것입니다.
- 결과적으로, 우리가 `_` placeholder 이전에 나열하지 않은 모든 가능한 값들에 대해서는 아무것도 하고 싶지 않다는 것을 말해줄 수 있습니다.

하지만 `match` 표현식은 우리가 단 *한 가지* 경우에 대해 고려하는 상황에서는 다소 장황할 수 있습니다. 이러한 상황을 위하여, 러스트는 `if let`을 제공합니다.

## [`if let`을 사용한 간결한 흐름 제어](https://rust-kr.github.io/doc.rust-kr.org/ch06-03-if-let.html#if-let%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%9C-%EA%B0%84%EA%B2%B0%ED%95%9C-%ED%9D%90%EB%A6%84-%EC%A0%9C%EC%96%B4)

`if let` 문법은 `if`와 `let`을 조합하여 하나의 패턴만 매칭시키고 나머지 경우는 무시하는 값을 다루는 덜 수다스러운 방법을 제공합니다. 어떤 `Option<u8>` 값을 매칭 하지만 그 값이 3일 경우에만 코드를 실행시키고 싶어 하는 Listing 6-6에서의 프로그램을 고려해 보세요:

```rust
fn main() {
    let some_u8_value = Some(0u8); // some with 숫자에 타입 주는 방법
    match some_u8_value {
        Some(3) => println!("three"),
        _ => (),
    }
}
```

`if let`을 이용하여 이 코드를 더 짧게 쓸 수 있습니다.

```rust
fn main() {
    let some_u8_value = Some(0u8);
    if let Some(3) = some_u8_value {
        println!("three");
    }
}
```

`if let`은 `=`로 구분된 패턴과 표현식을 입력받습니다. 이는 `match`와 동일한 방식으로 작동하는데, 여기서 표현식은 `match`에 주어지는 것이고 패턴은 이 `match`의 첫 번째 갈래와 같습니다.

- `if let`을 이용하는 것은 여러분이 덜 타이핑하고, 덜 들여쓰기 하고, 보일러 플레이트 코드를 덜 쓰게 된다는 뜻입니다.
- 하지만, `match`가 강제했던 하나도 빠짐없는 검사를 잃게 되었습니다.
- `match`와 `if let` 사이에서 선택하는 것은 여러분의 특정 상황에서 여러분이 하고 있는 것에 따라, 그리고 간결함을 얻는 것이 전수 조사를 잃는 것에 대한 적절한 거래인지에 따라 달린 문제입니다.

즉 `if let` 은, 한 패턴에 매칭될 때만 코드를 실행하고 다른 경우는 무시하는 `match` 문을 작성할 때 사용하는 syntax sugar 라고 생각하시면 됩니다.

`if let`과 함께 `else`를 포함시킬 수 있습니다. `else` 뒤에 나오는 코드 블록은 `match` 표현식에서 `_` 케이스 뒤에 나오는 코드 블록과 동일합니다.

## [정리](https://rust-kr.github.io/doc.rust-kr.org/ch06-03-if-let.html#%EC%A0%95%EB%A6%AC)

- 지금까지 우리는 열거한 값들의 집합 중에서 하나가 될 수 있는 커스텀 타입을 만들기 위해서 열거형을 사용하는 방법을 다뤄보았습니다.
- 우리는 표준 라이브러리의 `Option<T>` 타입이 에러를 방지하기 위해 어떤 식으로 타입 시스템을 이용하도록 도움을 주는지 알아보았습니다.
- 열거형 값들이 내부에 데이터를 가지고 있을 때는, `match`나 `if let`을 이용하여 그 값들을 추출하고 사용할 수 있는데, 둘 중 어느 것을 이용할지는 여러분이 다루고 싶어 하는 경우가 얼마나 많은지에 따라 달라집니다.

**여러분은 이제 구조체와 열거형을 이용해 원하는 개념을 표현할 수 있습니다.** 또한, 여러분의 API 내에 커스텀 타입을 만들어서 사용하면, 작성한 함수가 원치 않는 값으로 작동하는 것을 컴파일러가 막아주기 때문에 타입 안정성도 보장받을 수 있습니다.

사용하기 직관적이고 여러분의 사용자가 필요로 할 것만 정확히 노출된 잘 조직화된 API를 여러분의 사용들에게 제공하기 위해서, 이제 러스트의 모듈로 넘어갑시다.
