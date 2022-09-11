---
slug: post/16
title: Chap.5 Structs

authors: [brown]
tags: [rust, structs, codewars]
date: 2022-09-11 12:37
---

- 구조체(_struct_)는 여러 값을 묶어서 어떤 의미를 갖는 데이터 단위를 정의하는 데에 사용합니다.
- 객체지향 언어에 익숙하신 분들은 구조체를 "객체가 갖는 데이터 속성"과 같은 개념으로 이해하셔도 좋습니다.
- 이번 장에선 앞서 배운 튜플과 구조체 간 비교, 구조체 사용법, 구조체의 데이터와 연관된 동작을 표현하는 메소드, 연관함수(associated functions) 정의 방법을 다룹니다.
- 필요한 데이터 형식을 작성할 때 구조체나 열거형(6장에서 배울 예정입니다)을 이용하면, 여러분이 직접 만든 타입에도 러스트의 컴파일 시점 타입 검사 기능을 최대한 활용할 수 있습니다.

---

## [5.1 구조체 정의 및 인스턴트화](https://rust-kr.github.io/doc.rust-kr.org/ch05-01-defining-structs.html#%EA%B5%AC%EC%A1%B0%EC%B2%B4-%EC%A0%95%EC%9D%98-%EB%B0%8F-%EC%9D%B8%EC%8A%A4%ED%84%B4%ED%8A%B8%ED%99%94)

---

- 구조체는 3장에서 배운 튜플과 비슷합니다.
- 튜플처럼 구조체의 구성 요소들은 각각 다른 타입이 될 수 있습니다.
- 그리고 여기에 더해서, 구조체는 각각의 구성 요소에 이름을 붙일 수 있습니다.
- 따라서 각 요소가 더 명확한 의미를 갖게 되고, 특정 요소에 접근할 때 순서에 의존할 필요도 사라집니다.
- 결론적으로, 튜플보다 유연하게 사용할 수 있습니다.

구조체를 정의할 땐 `struct` 키워드와 해당 구조체에 지어줄 이름을 입력하면 됩니다. 이때 구조체 이름은 함께 묶을 데이터의 의미에 맞도록 지어주세요. 이후 **중괄호 안에서는 필드(_field_)라 하는 각 구성 요소의 이름 및 타입을 정의**합니다.

```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}
```

- 정의한 구조체를 사용하려면 해당 구조체 내 각 필드의 값을 정해 인스턴스(_instance_)를 생성해야 합니다.
- 구조체 정의는 대충 해당 구조체에 무엇이 들어갈지를 정해둔 양식이며, 인스턴스는 거기에 실제 값을 넣은 것이라고 생각하시면 됩니다. 예시로 확인해 보죠

```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

fn main() {
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
}
user1.email = String::from("anotheremail@example.com");
fn build_user(email: String, username: String) -> User {
    User {
        email: email,
        username: username,
        active: true,
        sign_in_count: 1,
    }
}
```

- 구조체 내 특정 값은 점(.) 표기법으로 얻어올 수 있습니다. 사용자의 이메일 주소를 얻어야 한다치면 `user1.email` 처럼 사용할 수 있죠.
- 변경 가능한 인스턴스라면, 같은 방식으로 특정 필드의 값을 변경할 수도 있습니다.
- **가변성은 해당 인스턴스 전체가 지니게 됩니다.**(일부 필드만 변경 가능하도록 만들 수는 없음)
- 구조체도 다른 표현식과 마찬가지로 함수 마지막 표현식에서 암묵적으로 새 인스턴스를 생성하고 반환할 수 있습니다.

## [변수명과 필드명이 같을 때 간단하게 필드 초기화하기](https://rust-kr.github.io/doc.rust-kr.org/ch05-01-defining-structs.html#%EB%B3%80%EC%88%98%EB%AA%85%EA%B3%BC-%ED%95%84%EB%93%9C%EB%AA%85%EC%9D%B4-%EA%B0%99%EC%9D%84-%EB%95%8C-%EA%B0%84%EB%8B%A8%ED%95%98%EA%B2%8C-%ED%95%84%EB%93%9C-%EC%B4%88%EA%B8%B0%ED%99%94%ED%95%98%EA%B8%B0)

변수명과 구조체 필드명이 같을 땐, 필드 초기화 축약법(_field init shorthand_)을 사용해서 더 적은 타이핑으로 같은 기능을 구현할 수 있습니다.

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}
```

### [기존 인스턴스를 이용해 새 인스턴스를 만들 때 구조체 갱신법 사용하기](https://rust-kr.github.io/doc.rust-kr.org/ch05-01-defining-structs.html#%EA%B8%B0%EC%A1%B4-%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%B4-%EC%83%88-%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4%EB%A5%BC-%EB%A7%8C%EB%93%A4-%EB%95%8C-%EA%B5%AC%EC%A1%B0%EC%B2%B4-%EA%B0%B1%EC%8B%A0%EB%B2%95-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)

기존에 있던 인스턴스에서 대부분의 값을 유지한 채로 몇몇 값만 바꿔 새로운 인스턴스를 생성하게 되는 경우가 간혹 있습니다. 그럴 때 유용한 게 바로 구조체 갱신법(_struct update syntax_)입니다.

```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}
fn main() {
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
    // 구조체 갱신법 X
    let user2 = User {
        email: String::from("another@example.com"),
        username: String::from("anotherusername567"),
        active: user1.active,
        sign_in_count: user1.sign_in_count,
    };
    // 구조체 갱신법 O
    let user2 = User {
        email: String::from("another@example.com"),
        username: String::from("anotherusername567"),
        ..user1
    };
}
```

### [필드명이 없는, 타입 구분용 튜플 구조체](https://rust-kr.github.io/doc.rust-kr.org/ch05-01-defining-structs.html#%ED%95%84%EB%93%9C%EB%AA%85%EC%9D%B4-%EC%97%86%EB%8A%94-%ED%83%80%EC%9E%85-%EA%B5%AC%EB%B6%84%EC%9A%A9-%ED%8A%9C%ED%94%8C-%EA%B5%AC%EC%A1%B0%EC%B2%B4)

- 구조체를 사용해 튜플과 유사한 형태의 튜플 구조체(_tuple structs_)를 정의할 수도 있습니다.
- 튜플 구조체는 필드의 이름을 붙이지 않고 필드 타입 만을 정의하며, 구조체 명으로 의미를 갖는 구조체입니다.
- 이는 튜플 전체에 이름을 지어주거나 특정 튜플을 다른 튜플과 구분 짓고 싶은데, 그렇다고 각 필드명을 일일이 정해 일반적인 구조체를 만드는 것은 배보다 배꼽이 더 큰 격이 될 수 있을 때 유용합니다.

튜플 구조체의 정의는 일반적인 구조체처럼 `struct` 키워드와 구조체 명으로 시작되나, 그 뒤에는 타입들로 이루어진 튜플이 따라옵니다.

```rust
fn main() {
    struct Color(i32, i32, i32);
    struct Point(i32, i32, i32);

    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```

- `black`, `origin` 이 서로 다른 튜플 구조체의 인스턴스이므로, 타입이 서로 달라진다는 점이 중요합니다. 구조체 내 필드 구성이 같더라도 각각의 구조체는 별도의 타입이기 때문이죠.
- 즉, `Color` 타입과 `Point` 타입은 둘 다 `i32` 값 3 개로 이루어진 타입이지만, `Color` 타입을 매개변수로 받는 함수에 `Point` 타입을 인자로 넘겨주는 건 불가능합니다.

### [필드가 없는 유사 유닛 구조체](https://rust-kr.github.io/doc.rust-kr.org/ch05-01-defining-structs.html#%ED%95%84%EB%93%9C%EA%B0%80-%EC%97%86%EB%8A%94-%EC%9C%A0%EC%82%AC-%EC%9C%A0%EB%8B%9B-%EA%B5%AC%EC%A1%B0%EC%B2%B4)

- 필드가 아예 없는 구조체를 정의할 수도 있습니다.
- 유닛 타입인 `()` 과 비슷하게 동작하므로 유사 유닛 구조체(_unit-like structs_) 라 지칭
- 어떤 타입을 내부 데이터 저장 없이 10장에서 배울 트레잇을 구현하기만 하는 용도로 사용할 때 주로 활용됩니다.

### [구조체 데이터의 소유권](https://rust-kr.github.io/doc.rust-kr.org/ch05-01-defining-structs.html#%EA%B5%AC%EC%A1%B0%EC%B2%B4-%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%9D%98-%EC%86%8C%EC%9C%A0%EA%B6%8C)

- `User` 구조체 정의에서는 의도적으로 `&str` 문자열 슬라이스 대신 구조체가 소유권을 갖는 `String` 타입을 사용했습니다.
   - 구조체 인스턴스가 유효한 동안 인스턴스 내의 모든 데이터가 유효하도록 만들기 위해서죠.
   - 참조자를 이용해 구조체가 소유권을 갖지 않는 데이터도 저장할 수는 있지만,
   - 이는 10장에서 배울 라이프타임(_lifetime_)을 활용해야 합니다.
   - 라이프타임을 사용하면 구조체가 존재하는 동안에 구조체 내 참조자가 가리키는 데이터의 유효함을 보장받을 수 있기 때문이죠.

- 만약 라이프타임을 명시하지 않고 참조자를 저장하고자 하면 다음처럼 문제가 발생합니다.
- 위 에러를 해결하여 구조체에 참조자를 저장하는 방법은 10장에서 알아볼 겁니다.
- 지금 당장은 `&str` 대신 `String` 을 사용함으로써 넘어가도록 하죠.

---

## [5.2 구조체를 사용한 예제 프로그램](https://rust-kr.github.io/doc.rust-kr.org/ch05-02-example-structs.html#%EA%B5%AC%EC%A1%B0%EC%B2%B4%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%9C-%EC%98%88%EC%A0%9C-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8)

---

어떨 때 구조체를 사용하면 좋을지를, 사각형 넓이를 계산하는 프로그램을 작성하면서 익혀보도록 합시다.

아래 예제는 함수와 rect의 연관성 X

```rust
fn main() {
    let width1 = 30;
    let height1 = 50;
    println!(
        "The area of the rectangle is {} square pixels.",
        area(width1, height1)
    );
}
fn area(width: u32, height: u32) -> u32 {
    width * height
}
```

### [튜플로 리팩토링하기](https://rust-kr.github.io/doc.rust-kr.org/ch05-02-example-structs.html#%ED%8A%9C%ED%94%8C%EB%A1%9C-%EB%A6%AC%ED%8C%A9%ED%86%A0%EB%A7%81%ED%95%98%EA%B8%B0)

튜플을 사용함으로써 더 짜임새 있는 코드가 됐고, 인자도 단 하나만 넘기면 된다는 점에선 프로그램이 발전했다고 볼 수 있습니다. 하지만 각 요소가 이름을 갖지 않는 튜플의 특성 때문에 값을 인덱스로 접근해야 해서 계산식이 난잡해졌네요.

```rust
fn main() {
    let rect1 = (30, 50);
    println!(
        "The area of the rectangle is {} square pixels.",
        area(rect1)
    );
}
fn area(dimensions: (u32, u32)) -> u32 {
    dimensions.0 * dimensions.1
}
```

### [구조체로 리팩토링하여 코드에 더 많은 의미를 담기](https://rust-kr.github.io/doc.rust-kr.org/ch05-02-example-structs.html#%EA%B5%AC%EC%A1%B0%EC%B2%B4%EB%A1%9C-%EB%A6%AC%ED%8C%A9%ED%86%A0%EB%A7%81%ED%95%98%EC%97%AC-%EC%BD%94%EB%93%9C%EC%97%90-%EB%8D%94-%EB%A7%8E%EC%9D%80-%EC%9D%98%EB%AF%B8%EB%A5%BC-%EB%8B%B4%EA%B8%B0)

구조체는 데이터에 이름표를 붙여서 의미를 나타낼 수 있습니다.

```rust
struct Rectangle {
    width: u32,
    height: u32,
}
fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    println!(
        "The area of the rectangle is {} square pixels.",
        area(&rect1)
    );
}
fn area(rectangle: &Rectangle) -> u32 {
    rectangle.width * rectangle.height
}
```

- `area` 함수의 매개변수는 이제 `rectangle` 하나뿐입니다.
- **단, 구조체의 소유권을 가져와 버리면 `main` 함수에서 `area` 함수 호출 이후에 `rect1` 을 더 사용할 수 없으므로**, `rectangle` 매개변수의 타입을 불변 참조자 타입으로 정하여 소유권을 빌려오기만 하도록 만들었습니다.
- 불변 참조자 타입이니 함수 시그니처와 호출시에 `&` 를 작성합니다.
- `area` 함수는 `Rectangle` 인스턴스의 `width`, `height` 필드에 접근하여 `area`, 즉 넓이를 계산합니다.
- 이제 함수 시그니처만 봐도 의미를 정확히 알 수 있네요. `width`, `height` 가 서로 연관된 값이라는 것도 알 수 있고,
- `0` 이나 `1` 대신 필드명을 사용해 더 명확하게 구분할 수 있습니다.

## [트레잇 derive 로 유용한 기능 추가하기](https://rust-kr.github.io/doc.rust-kr.org/ch05-02-example-structs.html#%ED%8A%B8%EB%A0%88%EC%9E%87-derive-%EB%A1%9C-%EC%9C%A0%EC%9A%A9%ED%95%9C-%EA%B8%B0%EB%8A%A5-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0)

- `println!` 매크로에는 여러 출력 형식을 사용할 수 있습니다.
- 그리고 기본 형식인 `{}` 로 지정할 땐 `Display` 라는, 최종 사용자를 위한 출력 형식을 사용하죠.
- 여태 사용했던 기본 타입들은 `Display` 가 기본적으로 구현돼있었습니다. `1` 같은 기본 타입들을 사용자에게 보여줄 수 있는 형식은 딱 한 가지뿐이니까요.
- 하지만 구조체라면 이야기가 달라집니다. 중간중간 쉼표를 사용해야 할 수도 있고, 중괄호도 출력해야 할 수도 있고, 필드 일부를 생략해야 할 수도 있는 등 여러 경우가 있을 수 있습니다.
- 러스트는 이런 애매한 상황에 우리가 원하는 걸 임의로 예상해서 제공하려 들지 않기 때문에, 구조체에는 `Display` 구현체가 기본 제공되지 않습니다.
- 따라서 `println!` 에서 처리할 수 없죠.

- `println!` 매크로 호출을 `println!("rect1 is {:?}", rect1);` 으로 바꿔봅시다.
- `{}` 내에 `:?` 를 추가하는 건 `println!` 에 `Debug` 라는 출력 형식을 사용하고 싶다고 전달하는 것과 같습니다.
- 이 `Debug` 라는 트레잇은 최종 사용자가 아닌, 개발자에게 유용한 방식으로 출력하는, 즉 디버깅할 때 값을 볼 수 있게 해주는 트레잇입니다.
- 러스트는 디버깅 정보를 출력하는 기능을 *자체적으로 가지고 있습니다*.
- 하지만 우리가 만든 구조체에 해당 기능을 적용하려면 명시적인 동의가 필요하므로, **구조체 정의 바로 이전에 `#[derive(Debug)]` 어노테이션**을 작성해주어야 합니다.
  - **Annotation**은 프로그램 내에서 **주석**과 유사하게, 프로그래밍 언어에는 영향을 미치지 않으면서 프로그램/프로그래머에게 유의미한 정보를 제공하는 역할을 한다.
  - 컴파일러가 특정 오류를 억제하도록 지시하는 것과 같이 프로그램 코드의 일부가 아닌 프로그램에 관한 데이터를 제공, 코드에 정보를 추가하는 정형화된 방법.

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}
fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    println!("rect1 is {:?}", rect1);
}
```

- 가장 예쁜 출력 형태라 할 수는 없지만, 인스턴스 내 모든 필드 값을 보여주므로 디버깅하는 동안에는 확실히 유용할 겁니다.
- 필드가 더 많은 구조체라면 이보다 더 읽기 편한 형태가 필요할 텐데요.
- 그럴 땐 `println!` 문자열 내에 `{:?}` 대신 `{:#?}` 를 사용하면 됩니다.

러스트에선 이처럼 `derive` 어노테이션으로 우리가 만든 타입에 유용한 동작을 추가할 수 있는 트레잇을 여럿 제공합니다. 이들 목록 및 각각의 동작은 부록 C에서 확인할 수 있으니 참고해주세요. 또한, 여러분만의 트레잇을 직접 만들고, 이런 트레잇들의 동작을 원하는 대로 커스터마이징 해서 구현하는 방법은 10장에서 배울 예정입니다.

본론으로 돌아옵시다. 우리가 만든 `area` 함수는 사각형의 면적만을 계산하며, `Rectangle` 구조체를 제외한 다른 타입으로는 작동하지 않습니다. 그렇다면 아예 `Rectangle` 구조체와 더 밀접하게 만드는 편이 낫지 않을까요? 다음에는 `area` 함수를 `Rectangle` 타입 내에 *메소드(method)* 형태로 정의하여 코드를 리팩토링하는 방법을 알아보겠습니다.

---

## [5.3 메소드 문법](https://rust-kr.github.io/doc.rust-kr.org/ch05-03-method-syntax.html#%EB%A9%94%EC%86%8C%EB%93%9C-%EB%AC%B8%EB%B2%95)

---

- *메소드(method)* 는 함수와 유사합니다.
- `fn` 키워드와 함수명으로 선언하고, 매개변수와 반환 값을 가지며, 다른 어딘가로부터 호출될 때 실행됩니다.
- **하지만 메소드는 함수와 달리 구조체 문맥상에 정의**되고(열거형이나 트레잇 객체 안에 정의되기도 하며, 이는 각각 6장, 17장에서 알아보겠습니다), **첫 번째 매개변수가 항상 `self` 라는 차이점**이 있습니다.
  - `self` 매개변수는 메소드가 호출된 구조체 인스턴스를 나타냅니다.

### [메소드 정의](https://rust-kr.github.io/doc.rust-kr.org/ch05-03-method-syntax.html#%EB%A9%94%EC%86%8C%EB%93%9C-%EC%A0%95%EC%9D%98)

기존의 `Rectangle` 매개변수를 갖던 `area` 함수를 `Rectangle` 구조체에 정의된 `area` 메소드로 바꿔봅시다.

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}
fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}
```

1. `Rectangle` 내에 함수를 정의하기 위해서
2. `impl` (_구현: implementation_) 블록을 만들고
3. `area` 함수를 옮겨온 후,
4. 기존에 있던 첫 번째 매개변수를 (이 경우엔 유일한 매개변수네요) 함수 시그니처 및 본문 내에서 찾아 `self` 로 변경했습니다.
5. 그리고 `main` 함수 내에선 `rect1` 을 인수로 넘겨 `area` 함수를 호출하는 대신, *메소드 문법(method syntax)* 을 사용해 `Rectangle` 인스턴스의 `area` 메소드를 호출했습니다.
6. 메소드 문법은 차례대로 인스턴스, 점, 메소드명, 괄호 및 인수로 구성됩니다.

- `area` 시그니처부터 살펴보도록 하겠습니다.
- 기존의 `rectangle: &Rectangle` 이 `&self` 로 바뀌었네요.
- `Rectangle` 을 명시하지 않아도 되는 이유는, 메소드가 `impl Rectangle` 내에 있다는 점을 이용해 러스트가 `self` 의 타입을 알아낼 수 있기 때문입니다.
- 또한 `self` 앞에 기존 `&Rectangle` 처럼 `&` 가 붙은 점을 주목해주세요.
- 메소드는 지금처럼 `self` 를 변경 불가능하게 빌릴 수도 있고, 다른 매개변수처럼 변경 가능하도록 빌릴 수도 있고, 아예 소유권을 가져올 수도 있습니다.

- `&self` 를 사용해 변경 불가능하게 빌려온 이유는 기존에 `&Rectangle` 을 사용했던 이유와 같습니다.
- 우리가 원하는 건 소유권을 가져오는 것도, 데이터를 작성하는 것도 아닌, 데이터를 읽는 것뿐이니까요.
- 만약 메소드에서 호출된 인스턴스를 변경해야 한다면? `&mut self` 를 사용하면 됩니다.
- `self` 로만 작성하여 인스턴스의 소유권을 가져오도록 만드는 일은 거의 없습니다.
  - 그나마 `self` 를 다른 무언가로 변형시키고, 그 이후에는 원본 인스턴스 사용을 막고자 할 때나 종종 볼 수 있죠.

함수 대신 메소드를 이용했을 때의 주요 이점은 메소드 시그니처 내에서 `self` 의 타입을 반복해서 입력하지 않아도 된다는 것뿐만이 아닙니다.

코드를 더 조직적으로 만들 수 있죠. 우리가 라이브러리를 제공하게 된다고 가정해봅시다. 향후 우리가 제공한 라이브러리를 사용할 사람들이 `Rectangle` 에 관련된 코드를 라이브러리 곳곳에서 찾아내야 하는 것과, `impl` 블록 내에 모두 모아둔 것 중에 어떤 것이 나을까요? 답은 명확합니다.

### [`->` 연산자는 없나요?](https://rust-kr.github.io/doc.rust-kr.org/ch05-03-method-syntax.html#--%EC%97%B0%EC%82%B0%EC%9E%90%EB%8A%94-%EC%97%86%EB%82%98%EC%9A%94)

> C 나 C++ 언어에서는 메소드 호출에 두 종류의 연산자가 쓰입니다.
> 어떤 객체의 메소드를 직접 호출할 땐 `.` 를 사용하고, 어떤 객체의 포인터를 이용해 메소드를 호출하는 중이라서 역참조가 필요할 땐 `->` 를 사용하죠.
> 예를 들어서 `object` 라는 포인터가 있다면, `object->something()` 는 `(*object).something()` 로 나타낼 수 있습니다.
>
> 이 `->` 연산자와 동일한 기능을 하는 연산자는 러스트에 없습니다.
> 러스트에는 *자동 참조 및 역참조(automatic referencing and dereferencing)* 라는 기능이 있고,
> 메소드 호출에 이 기능이 포함돼있기 때문입니다.
>
> 여러분이 `object.something()` 코드로 메소드를 호출하면,
> 러스트에서 자동으로 해당 메소드의 시그니처에 맞도록 `&`, `&mut`, `*` 를 추가합니다.
> 즉, 다음 두 표현은 서로 같은 표현입니다:
> `p1.distance(&p2); (&p1).distance(&p2);`
>
> 첫 번째 표현이 더 깔끔하죠?
> 이런 자동 참조 동작은 메소드의 수신자(`self` 의 타입을 말합니다)가 명확하기 때문에 가능합니다.
> **수신자와 메소드명을 알면 해당 메소드가 인스턴스를 읽기만 하는지(`&self`), 변경하는지(`&mut self`), 소비하는지(`self`) 러스트가 알아낼 수 있거든요.**
> 또한 메소드의 수신자를 러스트에서 암묵적으로 빌린다는 점은, 실사용 환경에서 소유권을 인간공학적으로 만드는 중요한 부분입니다.

### [더 많은 파라미터를 가진 메소드](https://rust-kr.github.io/doc.rust-kr.org/ch05-03-method-syntax.html#%EB%8D%94-%EB%A7%8E%EC%9D%80-%ED%8C%8C%EB%9D%BC%EB%AF%B8%ED%84%B0%EB%A5%BC-%EA%B0%80%EC%A7%84-%EB%A9%94%EC%86%8C%EB%93%9C)

`Rectangle` 구조체의 두 번째 메소드를 구현하여 메소드 사용법을 연습해 봅시다.

- 새로 만들 메소드는 다른 `Rectangle` 인스턴스를 받아서,
- `self` 사각형 면적 내에 두 번째 사각형 `Rectangle` 인스턴스가 들어갈 수 있다면 `true` 를 반환하고,
- 못 들어가면 `false` 를 반환할 겁니다.
- 즉, `can_hold` 메소드를 정의하여 프로그램이 작동하도록 만들겠습니다:
  - 메소드의 정의는 `impl Rectangle` 블록 내에 위치할 것이고,
  - 메소드명은 `can_hold`, 매개변수는 `Rectangle` 을 불변 참조자로 받겠죠.
  - 이때 매개변수 타입은 메소드를 호출하는 코드를 보면 알아낼 수 있습니다.
  - `rect1.can_hold(&rect2)` 에서 `Rectangle` 인스턴스 `rect2` 의 불변 참조자인 `&rect2` 를 전달했으니까요.
  - `rect2` 를 읽을 수만 있으면 되기 때문에 변경 가능하게 빌려올 필요도 없으며, `rect2` 의 소유권을 `main` 에 남겨두지 않을 이유도 없으니, 논리적으로도 불변 참조자가 가장 적합합니다.
  - 반환값은 Boolean 타입이 될 거고, `self` 의 너비, 높이가 다른 `Rectangle` 의 너비, 높이보다 큰지 검사하는 식으로 구현될 겁니다.

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    let rect2 = Rectangle {
        width: 10,
        height: 40,
    };
    let rect3 = Rectangle {
        width: 60,
        height: 45,
    };
    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2));
    println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3));
}
```

### [연관 함수](https://rust-kr.github.io/doc.rust-kr.org/ch05-03-method-syntax.html#%EC%97%B0%EA%B4%80-%ED%95%A8%EC%88%98)

- `impl` 블록에는 `self` 매개변수를 *갖지 않는* 함수도 정의할 수 있습니다.
- 이러한 함수는 구조체의 인스턴스로 동작하는 것이 아니기 때문에 메소드는 아니지만,
- 구조체와 연관돼있기에 *연관 함수(associated functions)* 라고 부릅니다.
- 여러분이 이미 사용해본 연관 함수로는 `String::from` 이 대표적이군요.

연관 함수는 주로 새로운 구조체 인스턴스를 반환해주는 생성자로 활용됩니다. 예시를 들어보죠.

- `Rectangle` 로 정사각형을 만들 때 너비, 높이에 같은 값을 두 번 명시하는 대신,
- 치수 하나를 매개변수로 받고 해당 치수로 너비 높이를 설정하는 연관함수를 만들어,
- 더 간단하게 정사각형을 만드는 방법을 제공해보겠습니다:

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}
impl Rectangle {
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}
fn main() {
    let sq = Rectangle::square(3);
}
```

연관 함수를 호출할 땐 `let sq=Rectangle::square(3);` 처럼 구조체 명에 `::` 구문을 붙여서 호출합니다.

연관 함수는 구조체의 네임스페이스 내에 위치하기 때문이죠. `::` 구문은 7장에서 알아볼 모듈에 의해 생성되는 네임스페이스에도 사용됩니다.

### [`impl` 블록은 여러 개일 수 있습니다](https://rust-kr.github.io/doc.rust-kr.org/ch05-03-method-syntax.html#impl-%EB%B8%94%EB%A1%9D%EC%9D%80-%EC%97%AC%EB%9F%AC-%EA%B0%9C%EC%9D%BC-%EC%88%98-%EC%9E%88%EC%8A%B5%EB%8B%88%EB%8B%A4)

각 구조체는 여러 개의 `impl` 블록을 가질 수 있습니다. 다음 Listing 5-16은 Listing 5-15에 나온 코드를 변경해 `impl` 블록을 여러 개로 만든 모습입니다:

```rust
...
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}
impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
...
```

위 코드에서는 `impl` 블록을 여러 개로 나눠야 할 이유가 전혀 없지만, `impl` 블록을 반드시 하나만 작성해야 할 필요는 없음을 보여드리기 위해 예시로 작성했습니다. 여러 `impl` 블록을 유용하게 사용하는 모습은 제네릭 타입 및 트레잇 내용을 다루는 10장에서 보실 수 있습니다.

## [요약](https://rust-kr.github.io/doc.rust-kr.org/ch05-03-method-syntax.html#%EC%9A%94%EC%95%BD)

- 구조체를 사용하면 우리에게 필요한 의미를 갖는 타입을 직접 만들 수 있습니다.
- 또한, 구조체를 사용함으로써 서로 관련 있는 데이터들을 하나로 묶어 관리할 수 있으며,
- 각 데이터 조각에 이름을 붙여 코드를 더 명확하게 만들 수 있습니다.
- 메소드를 이용하면 여러분이 만든 구조체의 인스턴스에 특정한 동작을 지정해 줄 수도 있고,
- 연관 함수로 인스턴스가 아닌 구조체 네임스페이스를 대상으로 기능을 추가할 수도 있습니다.

하지만, 구조체로만 커스텀 타입을 만들 수 있는 건 아닙니다. 다음엔 열거형을 배워서 여러분이 쓸 수 있는 도구를 하나 더 늘려보도록 합시다.

---

## codewars

0907

### Number of People in the Bus

```rust
fn number(bus_stops: &[(i32, i32)]) -> i32 {
    let mut come = 0;
    let mut out = 0;
    for peoples in bus_stops {
        let (push, pop) = peoples;
        come += push;
        out += pop;
    }
    come - out
}
//
fn number(bus_stops:&[(i32,i32)]) -> i32 {
    bus_stops.iter().fold(0,|acc,x| acc + x.0 - x.1)
}
fn number(bus_stops:&[(i32,i32)]) -> i32 {
    bus_stops
        .into_iter()
        .map(|n| n.0 - n.1)
        .sum()
}

```

0910

### Testing 1-2-3

```rust
fn number(lines: &[&str]) -> Vec<String> {
    lines
        .iter()
        .enumerate()
        .map(|(i, &item)| {
            let mut str = String::from("");
            let idx = i + 1;
            let s = format!("{}: {}", idx, item);
            str.push_str(&s);
            str
        })
        .collect::<Vec<String>>()
}
//
fn number(lines: &[&str]) -> Vec<String> {
    lines.iter().enumerate().map(|x| format!("{}: {}", x.0 + 1, x.1)).collect()
}
fn number(lines: &[&str]) -> Vec<String> {
    lines.iter().zip(1..).map(|(x, i)| format!("{i}: {x}")).collect()
}
fn number(lines: &[&str]) -> Vec<String> {
    lines.iter().enumerate().map(|(n, line)| format!("{}: {line}", n + 1)).collect()
}
```

### Complementary DNA

```rust
fn dna_strand(dna: &str) -> String {
    let mut ans = String::from("");
    dna.chars().for_each(|c| match c {
        'A' => ans.push_str("T"),
        'T' => ans.push_str("A"),
        'G' => ans.push_str("C"),
        _ => ans.push_str("G"),
    });
    ans
}
//
fn dna_strand(dna: &str) -> String {
  dna.chars().map(|c|
    match c {
        'A' => 'T',
        'T' => 'A',
        'G' => 'C',
        'C' => 'G',
        _ => c,
    })
    .collect()
}
use std::collections::HashMap;

fn dna_strand(dna: &str) -> String {
  let complements: HashMap<char, char> = [('A', 'T'), ('T', 'A'), ('C', 'G'), ('G', 'C')].iter().cloned().collect();
  dna.chars().map(|c| complements.get(&c).unwrap()).collect()
}
```

### Maximum Length Difference

into_iter, iter의 차이 https://sftblw.tistory.com/91

```rust
fn mx_dif_lg(a1: Vec<&str>, a2: Vec<&str>) -> i32 {
    if a1.len() == 0 || a2.len() == 0 {
        -1
    } else {
        let a_map1 = a1.into_iter().map(|x| x.len() as i32);
        let a_map2 = a_map1.clone();
        let b_map1 = a2.into_iter().map(|x| x.len() as i32);
        let b_map2 = b_map1.clone();
        //
        let x_max = a_map1.max().unwrap();
        let x_min = a_map2.min().unwrap();
        let y_max = b_map1.max().unwrap();
        let y_min = b_map2.min().unwrap();

        let a = (x_max - y_min).abs();
        let b = (y_max - x_min).abs();
        if a > b {
            a
        } else {
            b
        }
    }
}
//
use std::cmp::{max, min};
use std::usize::MAX;

pub fn mx_dif_lg(a1: Vec<&str>, a2: Vec<&str>) -> i32 {
    if a1.is_empty() || a2.is_empty() {
        return -1;
    }
    let (max1, min1) = a1
        .iter()
        .map(|&x| x.len())
        .fold((0, MAX), |ac, x| (max(ac.0, x), min(ac.1, x)));
    let (max2, min2) = a2
        .iter()
        .map(|&x| x.len())
        .fold((0, MAX), |ac, x| (max(ac.0, x), min(ac.1, x)));

    max(((max1 - min2) as i32).abs(), ((max2 - min1) as i32).abs())
}
fn mx_dif_lg(a1: Vec<&str>, a2: Vec<&str>) -> i32 {
    if a1.len() == 0 || a2.len() == 0 { return -1 }
    let a1_min = a1.iter().map(|s| s.len()).min().unwrap() as i32;
    let a1_max = a1.iter().map(|s| s.len()).max().unwrap() as i32;
    let a2_min = a2.iter().map(|s| s.len()).min().unwrap() as i32;
    let a2_max = a2.iter().map(|s| s.len()).max().unwrap() as i32;
    (a1_max - a2_min).max(a2_max - a1_min)
}
fn mx_dif_lg(a1: Vec<&str>, a2: Vec<&str>) -> i32 {
    // your code
    a1.iter().flat_map(|s1| a2.iter().map(|s2| (s1.len() as i32 - s2.len() as i32).abs()).collect::<Vec<_>>() ).max().unwrap_or(-1)
}
```

### Odd or Even?

```rust
fn odd_or_even(numbers: Vec<i32>) -> String {
    let sum: i32 = numbers.iter().sum();
    if sum % 2 == 0 {
        "even".to_string()
    } else {
        "odd".to_string()
    }
}
//
fn odd_or_even(numbers: Vec<i32>) -> String {
    match numbers.iter().sum::<i32>() % 2 == 0 {
        true => "even".to_string(),
        false => "odd".to_string()
    }
}
fn odd_or_even(numbers: Vec<i32>) -> String {
    (if numbers.iter().sum::<i32>() % 2 == 0 {"even"} else {"odd"}).to_string()
}
```

### Check the exam

```rust

fn check_exam(arr_a: &[&str], arr_b: &[&str]) -> i64 {
    let ans = arr_a
        .iter()
        .enumerate()
        .map(|(idx, val)| {
            if arr_b[idx] == "" {
                0
            } else if &arr_b[idx] == val {
                4
            } else {
                -1
            }
        })
        .sum();
    if ans < 0 {
        0
    } else {
        ans
    }
}
//
fn check_exam(arr_a: &[&str], arr_b: &[&str]) -> i64 {
    arr_a.iter().zip(arr_b.iter()).fold(0, |pts, ans| {
        match ans {
            (a, b) if a == b => pts + 4,
            (_, b) if b == &"" => pts,
            _ => pts - 1
        }
    }).max(0)
}
fn check_exam(arr_a: &[&str], arr_b: &[&str]) -> i64 {
    arr_a
        .iter()
        .zip(arr_b)
        .map(|(&a, &b)| match b {
            "" => 0,
            _ if a == b => 4,
            _ => -1,
        })
        .sum::<i64>()
        .max(0)
}
```

### Highest and Lowest

```rust
fn high_and_low(numbers: &str) -> String {
    let vec = numbers.split(" ").map(|x| x.parse::<i32>().unwrap());
    let vec2 = vec.clone();
    let min = vec.min().unwrap();
    let max = vec2.max().unwrap();
    format!("{} {}", max, min)
}
//
fn high_and_low(numbers: &str) -> String {
    use std::cmp;
    let f = |(max, min), x| (cmp::max(max, x), cmp::min(min, x));

    let answer = numbers
        .split_whitespace()
        .map(|x| x.parse::<i32>().unwrap())
        .fold((i32::min_value(), i32::max_value()), f);
    format!("{} {}", answer.0, answer.1)
}
extern crate itertools;
use itertools::Itertools;

fn high_and_low(numbers: &str) -> String {
    let (min, max): (i32, i32) = numbers
        .split_whitespace()
        .map(|s| s.parse().unwrap())
        .minmax()
        .into_option()
        .unwrap();
    format!("{} {}", max, min)
}
fn high_and_low(numbers: &str) -> String {
  let as_ints: Vec<i32> = numbers.split(" ").map(|x| x.parse().unwrap()).collect();
  format!("{} {}", as_ints.iter().max().unwrap(), as_ints.iter().min().unwrap())
}
```

### Sum of Minimums!

```rust

fn sum_of_minimums(numbers: [[u8; 4]; 4]) -> u8 {
    numbers
        .map(|arr| arr.into_iter().min().unwrap())
        .iter()
        .sum()
}
//
fn sum_of_minimums(numbers: [[u8; 4]; 4]) -> u8 {
    numbers.iter().map(|row| row.iter().min().unwrap()).sum()
}
fn sum_of_minimums(numbers: [[u8; 4]; 4]) -> u8 {
    numbers.iter().filter_map(|v| v.iter().min()).sum()
}
fn sum_of_minimums(numbers: [[u8; 4]; 4]) -> u8 {
    numbers.iter().flat_map(|x| x.iter().min()).sum()
}

```
