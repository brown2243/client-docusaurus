---
slug: post/19
title: Chap.7 crates and modules

authors: [brown]
tags: [rust, study, crates, modules]
date: 2022-09-12 17:25
---

---

거대한 프로그램을 작성할 때에는 코드 관리가 무척 중요합니다.

- 어느 시점부터는 머릿속에서 생각하는 것만으로는 전체 프로그램의 변화를 쫓아갈 수 없기 때문입니다.
- 코드에서 연관된 기능은 묶고 서로 다른 기능은 분리해두어야,
- 이후 특정 기능을 구현하는 코드를 찾거나 변경할 때 헤맬 필요 없습니다.
- 따라서 프로젝트 규모가 커지면 코드를 여러 모듈, 여러 파일로 나누어 관리할 필요가 있습니다.

한 패키지 내에는 여러 바이너리 크레이트와 (원할 경우) 라이브러리 크레이트를 포함시킬 수 있으므로, 커진 프로젝트의 각 부분을 크레이트로 나눠서 외부 라이브러리처럼 쓸 수 있습니다.

이번 장에서 배워 볼 것은 이러한 기술들입니다. 상호연관된 패키지들로 이루어진 대규모 프로젝트의 경우, 14장 [“Cargo Workspaces”](https://rust-kr.github.io/doc.rust-kr.org/ch14-03-cargo-workspaces.html) 절에서 다룰 예정인, Cargo에서 제공하는 Workspace 기능을 이용합니다.

그룹화 외에도, 세부 구현을 캡슐화하면 더 고수준으로 코드를 재사용할 수 있습니다. 어떤 작업을 구현해두고 다른 코드에서 해당 코드의 공개 인터페이스를 통해 호출하면, 세부적인 작동은 알 필요 없죠. 여러분은 어떤 부분을 다른 코드에서 사용할 수 있도록 공개하고, 어떤 부분을 비공개된 세부 구현으로 만들어 자유롭게 수정할 수 있도록 할지를 정의하는 방식으로 코드를 작성합니다. 머릿속에 담아두어야 하는 정보의 양을 줄이는 또 다른 방법이기도 합니다.

스코프 개념도 관련되어 있습니다. 중첩된 컨텍스트에 작성한 코드는 "스코프 내" 정의된 다양한 이름들이 사용됩니다. 프로그래머나 컴파일러가 코드를 읽고, 쓰고, 컴파일할 때는 어떤 위치의 어떤 이름이 무엇을 의미하는지 알아야 합니다. 해당 이름이 변수인지, 함수인지, 열거형인지, 모듈인지, 상수인지, 그 외 요소인지 말이죠. 동일한 스코프 내에는 같은 이름을 가진 요소가 둘 이상 존재할 수 없기 때문에, 스코프를 의도적으로 생성해 어떤 이름은 스코프 내에 위치하고 어떤 이름은 스코프 밖에 위치하도록 조정하기도 합니다. (이름 충돌을 해결하는 도구도 존재합니다)

러스트에는 코드 조직화에 필요한 기능이 여럿 있습니다. 어떤 세부 정보를 외부에 노출할지, 비공개로 둘지, 프로그램의 스코프 내 항목 이름 등 다양합니다. 이를 통틀어 *모듈 시스템* 이라 하며, 다음 기능들이 포함됩니다.

- **패키지** 크레이트를 빌드하고, 테스트하고, 공유하는데 사용하는 Cargo 기능입니다.
- **크레이트** 라이브러리나 실행 가능한 모듈로 구성된 트리 구조입니다.
- **모듈**, **use:** 구조, 스코프를 제어하고, 조직 세부 경로를 감추는 데 사용합니다.
- **경로** 구조체, 함수, 모듈 등의 이름을 지정합니다.

이번 장에서는 이 기능들을 모두 다뤄보면서 어떻게 작동하고, 어떻게 사용해서 스코프를 관리하는지 등을 배워보겠습니다. 이번 장을 마치고 나면, 모듈 시스템을 확실히 이해하고 스코프를 자유자재로 다룰 수 있을 거랍니다!

## [7.1 패키지, 크레이트](https://rust-kr.github.io/doc.rust-kr.org/ch07-01-packages-and-crates.html#%ED%8C%A8%ED%82%A4%EC%A7%80-%ED%81%AC%EB%A0%88%EC%9D%B4%ED%8A%B8)

`모듈 시스템`에서 처음 다뤄볼 내용은 `패키지`와 `크레이트`입니다.

- 크레이트는 바이너리일 수도 있고, 라이브러리일 수도 있습니다.
- 러스트 컴파일러는 *크레이트 루트* 라는 소스 파일부터 컴파일을 시작해서 여러분이 작성한 크레이트의 루트 모듈을 구성합니다. (모듈은 ["모듈을 정의하여 스코프 및 공개 여부 제어하기"](https://rust-kr.github.io/doc.rust-kr.org/ch07-02-defining-modules-to-control-scope-and-privacy.html)에서 알아볼 예정입니다) *패키지* 는 하나 이상의 크레이트로 기능을 구성해 제공합니다.
- 패키지 내 *Cargo.toml* 파일은 패키지의 크레이트를 빌드하는 법을 나타냅니다.

패키지에 무엇을 포함할 수 있는가에 대해서는 규칙이 몇 가지 있습니다.

- 라이브러리 크레이트는 *하나만* 넣을 수 있습니다.
- 바이너리 크레이트는 원하는 만큼 포함할 수 있습니다.
- 단, 패키지에는 적어도 하나 이상의 크레이트(라이브러리이건, 바이너리이건)가 포함되어야 합니다.

패키지를 생성할 때 어떤 일이 일어나는지 살펴보죠. 먼저 `cargo new` 명령어를 입력합니다.

```bash
$ cargo new my-project
     Created binary (application) `my-project` package
$ ls my-project
Cargo.toml
src
$ ls my-project/src
main.rs
```

- 명령어를 입력하면 Cargo는 *Cargo.toml* 파일을 생성하여, **새로운 패키지를 만들어 줍니다.**
  - 패키지명과 같은 이름의 바이너리 크레이트는 크레이트 루트가 *src/main.rs* 라는 규칙이 있기 때문에, *Cargo.toml* 파일을 살펴보아도 *src/main.rs* 가 따로 언급되진 않습니다.
- 마찬가지로, 패키지 디렉토리에 *src/lib.rs* 파일이 존재할 경우, Cargo는 해당 패키지가 패키지명과 같은 이름의 라이브러리 크레이트를 포함하고 있다고 판단합니다.

  - 물론 그 라이브러리 크레이트의 크레이트 루트는 *src/lib.rs* 이고요. Cargo는 크레이트를 빌드할 때(라이브러리이건, 바이너리이건) 크레이트 루트 파일을 `rustc` 로 전달합니다.

- 현재 패키지는 *src/main.rs* 만 포함하고 있으므로 `my-project` 바이너리 크레이트만 포함합니다.
- 만약 어떤 패키지가 *src/main.rs* 와 *src/lib.rs* 를 포함한다면 해당 패키지는 패키지와 이름이 같은 바이너리, 라이브러리 크레이트를 포함하게 됩니다.
- *src/bin* 디렉토리 내에 파일을 배치하면 각각의 파일이 바이너리 크레이트가 되어, 여러 바이너리 크레이트를 패키지에 포함할 수 있습니다.

- 크레이트는 관련된 기능을 그룹화함으로써 특정 기능을 쉽게 여러 프로젝트 사이에서 공유합니다.
- 예를 들어, [2장](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#%EC%9E%84%EC%9D%98%EC%9D%98-%EC%88%AB%EC%9E%90%EB%A5%BC-%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0) 에서 사용한 `rand` 크레이트는 랜덤한 숫자를 생성하는 기능을 제공합니다.
- 우린 프로젝트 스코프에 `rand` 크레이트를 가져오기만 하면 우리가 만든 프로젝트에서 랜덤 숫자 생성 기능을 이용할 수 있죠.
- `rand` 크레이트가 제공하는 모든 기능은 크레이트의 이름인 `rand` 를 통해 접근 가능합니다.

크레이트의 기능이 각각의 스코프를 갖도록 하면 특정 기능이 우리 크레이트에 있는지, `rand` 크레이트에 있는지를 명확하게 알 수 있으며, 잠재적인 충돌을 방지할 수도 있습니다. 예를 들어, 우리가 만든 크레이트에 `Rng` 라는 이름의 구조체를 정의한 상태로, `Rng` 트레잇을 제공하는 `rand` 크레이트를 의존성에 추가하더라도 컴파일러는 `Rng` 라는 이름이 무엇을 가리키는지 정확히 알 수 있습니다. `Rng` 는 우리가 만든 크레이트 내에서 정의한 `struct Rng` 를 가르키고, `rand` 크레이트의 `Rng` 트레잇은 `rand::Rng` 로 접근해야 하죠.

## [7.2 모듈을 정의하여 스코프 및 공개 여부 제어하기](https://rust-kr.github.io/doc.rust-kr.org/ch07-02-defining-modules-to-control-scope-and-privacy.html#%EB%AA%A8%EB%93%88%EC%9D%84-%EC%A0%95%EC%9D%98%ED%95%98%EC%97%AC-%EC%8A%A4%EC%BD%94%ED%94%84-%EB%B0%8F-%EA%B3%B5%EA%B0%9C-%EC%97%AC%EB%B6%80-%EC%A0%9C%EC%96%B4%ED%95%98%EA%B8%B0)

이번에는 모듈, 항목의 이름을 지정하는 *경로(path)*, 스코프에 경로를 가져오는 `use` 키워드, 항목을 공개하는 데 사용하는 `pub` 키워드를 알아보겠습니다. `as` 키워드, 외부 패키지, 글롭 연산자 등도 다룰 예정이지만, 일단은 모듈에 집중하죠!

- ***모듈(module)* 은 가독성과 재사용성을 위해서 크레이트 내 코드를 그룹화하는 데 사용됩니다.**
- 외부에 *공개(public)* 할지, 내부의 세부 구현이니 외부에서 사용할 수 없도록 *비공개(private)* 할지 제어하는 역할도 있습니다.

예시로, 레스토랑 기능을 제공하는 라이브러리 크레이트를 작성한다고 가정해보죠. 코드 구조에 집중할 수 있도록 레스토랑을 실제 코드로 구현하지는 않고, 본문은 비워둔 함수 시그니처만 정의하겠습니다.

레스토랑 업계에서는 레스토랑을 크게 *접객 부서(front of house)* 와 *지원 부서(back of house)* 로 나눕니다. 접객 부서는 호스트가 고객을 안내하고, 웨이터가 주문 접수 및 결제를 담당하고, 바텐더가 음료를 만들어 주는 곳입니다. 지원 부서는 셰프, 요리사, 주방보조가 일하는 주방과 매니저가 행정 업무를 하는 곳입니다.

함수를 중첩 모듈로 구성하면 크레이트 구조를 실제 레스토랑이 일하는 방식과 동일하게 구성할 수 있습니다. `cargo new --lib restaurant` 명령어를 실행하여 `restaurant` 라는 새 라이브러리를 생성하고, Listing 7-1 코드를 *src/lib.rs* 에 작성하여 모듈, 함수 시그니처를 정의합시다.

```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
        fn seat_at_table() {}
    }
    mod serving {
        fn take_order() {}
        fn serve_order() {}
        fn take_payment() {}
    }
}
```

`mod` 키워드와 모듈 이름(이 경우 `front_of_house`)을 명시하고, 본문을 중괄호로 감싸 모듈을 정의하였습니다. `hosting`, `serving` 모듈처럼, 모듈 내에는 다른 모듈을 넣을 수 있습니다. 모듈은 구조체, 열거형, 상수, 트레잇, 함수(Listing 7-1처럼) 등의 항목 정의를 지닐 수 있습니다.

```
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```

위 코드를 모듈 트리로 나타낸 모습

- 트리는 모듈이 서로 어떻게 중첩되어 있는지 보여줍니다
  - (예시: `hosting` 모듈은 `front_of_house` 내에 위치함)
- `hosting`, `serving` 모듈이 둘 다 동일하게 `front_of_house` 모듈 내에 위치한 것처럼, 어떤 모듈이 *형제* 관계에 있는지 나타내기도 합니다.
- 가족 관계로 계속 비유하면, 모듈 A가 모듈 B 내에 있을 경우, 모듈 A는 모듈 B의 *자식* 이며, 모듈 B는 모듈 A의 *부모* 라고 표현할 수 있습니다.
- 전체 모듈 트리 최상위에 `crate` 라는 모듈이 암묵적으로 위치한다는 점을 기억해두세요.

모듈 트리에서 컴퓨터 파일 시스템의 디렉토리 트리를 연상하셨다면, 적절한 비유입니다! 파일 시스템의 디렉토리처럼, 여러분은 모듈로 코드를 조직화합니다.

## [7.3 경로를 사용해 모듈 트리에서 항목 가리키기](https://rust-kr.github.io/doc.rust-kr.org/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#%EA%B2%BD%EB%A1%9C%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%B4-%EB%AA%A8%EB%93%88-%ED%8A%B8%EB%A6%AC%EC%97%90%EC%84%9C-%ED%95%AD%EB%AA%A9-%EA%B0%80%EB%A6%AC%ED%82%A4%EA%B8%B0)

러스트 모듈 조직도에서 항목을 찾는 방법은, 파일 시스템에서 경로를 사용하는 방법과 동일합니다.

경로는 두 가지 형태가 존재합니다.

- *절대 경로* 는 크레이트 이름이나 `crate` 리터럴을 사용하며, 크레이트 루트를 기준점으로 사용합니다.
- *상대 경로* 는 `self`, `super` 를 사용하며, 현재 모듈을 기준점으로 사용합니다.

**절대 경로, 상대 경로 뒤에는 `::`으로 구분된 식별자가 하나 이상 따라옵니다.**

- `add_to_waitlist` 함수를 호출하려면 어떻게 해야 할까요?
- 다시 말해서, `add_to_waitlist` 함수의 경로는 무엇일까요?
- `eat_at_restaurant` 라는 새로운 함수에서 `add_to_waitlist` 함수를 두 가지 방법으로 호출하는 예시를 보여줍니다.
- `eat_at_restaurant` 함수는 우리가 만든 라이브러리 크레이트의 공개 API 중 하나입니다.
- 따라서 `pub` 키워드로 지정되어 있습니다.
- `pub` 키워드는 ["`pub` 키워드로 경로 노출하기"](https://rust-kr.github.io/doc.rust-kr.org/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#pub-%ED%82%A4%EC%9B%8C%EB%93%9C%EB%A1%9C-%EA%B2%BD%EB%A1%9C-%EB%85%B8%EC%B6%9C%ED%95%98%EA%B8%B0) 절에서 자세히 알아볼 예정입니다.

```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
    }
}
pub fn eat_at_restaurant() {
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();
    // Relative path
    front_of_house::hosting::add_to_waitlist();
}
```

- `eat_at_restaurant` 함수에서 처음 `add_to_waitlist` 함수를 호출할 때는 절대 경로를 사용했습니다.
  - `add_to_waitlist` 함수는 `eat_at_restaurant` 함수와 동일한 크레이트에 정의되어 있으므로, 절대 경로의 시작점에 `crate` 키워드를 사용할 수 있습니다.
  - `crate` 뒤에는 `add_to_waitlist` 함수에 도달할 때까지의 모듈을 연속해서 작성합니다.
  - 파일 시스템 구조로 생각해 보죠. `/front_of_house/hosting/add_to_waitlist` 경로를 작성하여 `add_to_waitlist` 프로그램을 실행했군요.
  - `crate`를 작성해 크레이트 루트를 기준으로 사용하는 것은 셸(shell)에서 `/` 로 파일 시스템의 최상위 디렉토리를 기준으로 사용하는 것과 같습니다.
- `eat_at_restaurant` 함수에서 두 번째로 `add_to_waitlist` 함수를 호출할 때는 상대 경로를 사용했습니다.

  - 경로는 모듈 트리에서 `eat_at_restaurant` 함수와 동일한 위치에 정의되어 있는 `front_of_house` 모듈로 시작합니다.
  - 파일 시스템으로 비유하자면 `front_of_house/hosting/add_to_waitlist` 가 되겠네요.
  - 파일 시스템 경로에서, 항목의 이름으로 시작하는 경로는 상대 경로입니다.

- 상대 경로, 절대 경로 중 무엇을 사용할지는 프로젝트에 맞추어 여러분이 선택해야 합니다.
- 이는 여러분이 항목을 정의하는 코드와 항목을 사용하는 코드를 분리하고 싶은지, 혹은 같이 두고 싶은지에 따라 결정되어야 합니다.
- 예를 들어, `front_of_house` 모듈과 `eat_at_restaurant` 함수를 `customer_experience` 라는 모듈 내부로 이동시켰다고 가정해보죠.
- `add_to_waitlist` 함수를 절대 경로로 작성했다면 코드를 수정해야 하지만, 상대 경로는 수정할 필요가 없습니다. 반면, `eat_at_restaurant` 함수를 분리하여 `dining` 이라는 모듈 내부로 이동시켰다면, `add_to_waitlist` 함수를 가리키는 절대 경로는 수정할 필요가 없지만, 상대 경로는 수정해야 합니다.
- 우리가 선호하는 경로는 절대 경로입니다.
  - 항목을 정의하는 코드와 호출하는 코드는 분리되어 있을 가능성이 높기 때문입니다.

우리는 `hosting` 모듈과 `add_to_waitlist` 함수의 경로를 정확히 명시했지만, 해당 영역은 비공개 영역이기 때문에 러스트가 접근을 허용하지 않습니다.

- 모듈은 코드를 조직화하는 용도로만 쓰이지 않습니다.
- **러스트의 *비공개 경계(privacy boundary)* 를 정의하는 역할도 있습니다.**
- `캡슐화`된 세부 구현은 외부 코드에서 호출하거나 의존할 수 없고, 알 수도 없습니다.
- 따라서 비공개로 만들고자 하는 함수나 구조체가 있다면, 모듈 내에 위치시키면 됩니다.

- 러스트에서, 모든 항목(함수, 메소드, 구조체, 열거형, 모듈, 상수)은 기본적으로 비공개입니다.
- 부모 모듈 내 항목은 자식 모듈 내 비공개 항목을 사용할 수 없지만, 자식 모듈 내 항목은 부모 모듈 내 항목을 사용할 수 있습니다.
- 이유는, 자식 모듈의 세부 구현은 감싸져서 숨겨져 있지만, 자식 모듈 내에서는 자신이 정의된 컨텍스트를 볼 수 있기 때문입니다.
- 러스트 모듈 시스템은 내부의 세부 구현을 기본적으로 숨기도록 되어 있습니다.
  - 이로써, 여러분은 외부 코드의 동작을 망가뜨릴 걱정 없이 수정할 수 있는 코드가 어느 부분인지 알 수 있죠.
  - 만약, 자식 모듈의 내부 요소를 공개(public)함으로써 외부 상위 모듈로 노출하고자 한다면, `pub` 키워드를 사용합니다.

### [`pub` 키워드로 경로 노출하기](https://rust-kr.github.io/doc.rust-kr.org/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#pub-%ED%82%A4%EC%9B%8C%EB%93%9C%EB%A1%9C-%EA%B2%BD%EB%A1%9C-%EB%85%B8%EC%B6%9C%ED%95%98%EA%B8%B0)

- `hosting` 모듈이 비공개임을 의미하던 Listing 7-4 오류로 돌아와보죠.
- 부모 모듈 내 `eat_at_restaurant` 함수가 자식 모듈 내 `add_to_waitlist` 함수에 접근해야 하니, `hosting` 모듈에 `pub` 키워드를 작성했습니다.
  - 우린 `mod hosting` 앞에 `pub` 키워드를 추가하여 모듈을 공개했습니다.
  - 따라서, `front_of_house` 에 접근할 수 있다면 `hosting` 모듈에도 접근할 수 있죠.
  - 하지만, `hosting` 모듈의 *내용*은 여전히 비공개입니다. **모듈을 공개했다고 해서 내용까지 공개되지는 않습니다.** 모듈의 `pub` 키워드는 상위 모듈이 해당 모듈을 가리킬 수 있도록 할 뿐입니다.
- `add_to_waitlist` 함수가 비공개라는 내용을 담고 있습니다.
- **비공개 규칙은 구조체, 열거형, 함수, 메소드, 모듈 모두 적용됩니다.**

- 절대 경로는 크레이트 모듈 트리의 최상위인 `crate`로 시작합니다.
- 그리고 크레이트 루트 내에 정의된 `front_of_house` 모듈이 이어집니다.
- `front_of_house` 모듈은 공개가 아니지만, `eat_at_restaurant` 함수와 `front_of_house` 모듈은 같은 모듈 내에 정의되어 있으므로 (즉, 서로 형제 관계이므로) `eat_at_restaurant` 함수에서 `front_of_house` 모듈을 참조할 수 있습니다.
- 다음은 `pub` 키워드가 지정된 `hosting` 모듈입니다.
  - `hosting`의 부모 모듈에 접근할 수 있으니, `hosting` 에도 접근할 수 있습니다.
- 마지막 `add_to_waitlist` 함수 또한 `pub` 키워드가 지정되어 있고, 부모 모듈에 접근할 수 있으니, 호출 가능합니다!

- 상대 경로는 첫 번째 과정을 제외하면 절대 경로와 동일합니다.
- 상대 경로는 크레이트 루트에서 시작하지 않고, `front_of_house` 로 시작합니다.
- `front_of_house` 모듈은 `eat_at_restaurant` 함수와 동일한 모듈 내에 정의되어 있으므로, `eat_at_restaurant` 함수가 정의되어 있는 모듈에서 시작하는 상대 경로를 사용할 수 있습니다.
- 이후 `hosting`, `add_to_waitlist` 은 `pub`으로 지정되어 있으므로 나머지 경로도 문제 없습니다.
- 따라서 이 함수 호출도 유효합니다!

### [`super`로 시작하는 상대 경로](https://rust-kr.github.io/doc.rust-kr.org/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#super%EB%A1%9C-%EC%8B%9C%EC%9E%91%ED%95%98%EB%8A%94-%EC%83%81%EB%8C%80-%EA%B2%BD%EB%A1%9C)

**`super`로 시작하는 상대 경로는 부모 모듈을 기준점으로 사용합니다.** 이는 파일시스템 경로에서 `..` 로 시작하는 것과 동일합니다.

부모 모듈을 기준으로 삼아야 하는 상황은 언제일까요?

`back_of_house` 모듈과 `serve_order` 함수는 크레이트 모듈 구조 변경 시 서로의 관계를 유지한 채 함께 이동될 가능성이 높습니다. 그러므로 `super`를 사용하면, 추후에 다른 모듈에 이동시키더라도 수정해야 할 코드를 줄일 수 있습니다

### [구조체, 열거형을 공개하기](https://rust-kr.github.io/doc.rust-kr.org/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#%EA%B5%AC%EC%A1%B0%EC%B2%B4-%EC%97%B4%EA%B1%B0%ED%98%95%EC%9D%84-%EA%B3%B5%EA%B0%9C%ED%95%98%EA%B8%B0)

- `pub` 키워드로 구조체와 열거형을 공개할 수도 있습니다.
- 단, 알아두어야 할 점이 몇 가지 있습니다.
- 구조체 정의에 `pub`를 사용하면 구조체는 공개되지만, 구조체 내 필드는 비공개로 유지됩니다.
- 공개 여부는 각 필드마다 정할 수 있습니다.
- Listing 7-9는 공개 구조체 `back_of_house::Breakfast`를 정의하고 `toast` 필드는 공개하지만 `seasonal_fruit` 필드는 비공개로 둔 예제입니다.
  - 이는 레스토랑에서 고객이 식사와 같이 나올 빵 종류를 선택하고, 셰프가 계절과 재고 상황에 맞춰서 식사에 포함할 과일을 정하는 상황을 묘사한 예제입니다.
  - 과일은 빈번히 변경되므로, 고객은 직접 과일을 선택할 수 없으며 어떤 과일을 받을지도 미리 알 수 없습니다.

```rust
#![allow(unused)]
fn main() {
	mod back_of_house {
	    pub struct Breakfast {
	        pub toast: String,
	        seasonal_fruit: String,
	    }
	    impl Breakfast {
	        pub fn summer(toast: &str) -> Breakfast {
	            Breakfast {
	                toast: String::from(toast),
	                seasonal_fruit: String::from("peaches"),
	            }
	        }
	    }
	}
	pub fn eat_at_restaurant() {
	    // Order a breakfast in the summer with Rye toast
	    let mut meal = back_of_house::Breakfast::summer("Rye");
	    // Change our mind about what bread we'd like
	    meal.toast = String::from("Wheat");
	    println!("I'd like {} toast please", meal.toast);
	    // The next line won't compile if we uncomment it; we're not allowed
	    // to see or modify the seasonal fruit that comes with the meal
	    // meal.seasonal_fruit = String::from("blueberries");
	}
}
```

- `back_of_house::Breakfast` 구조체 내 `toast` 필드는 공개 필드이기 때문에 `eat_at_restaurant` 함수에서 점 표기법으로 `toast` 필드를 읽고 쓸 수 있습니다.
- 반면, `seasonal_fruit` 필드는 비공개 필드이기 때문에 `eat_at_restaurant` 함수에서 사용할 수 없습니다.
- 한번 `seasonal_fruit` 필드를 수정하는 코드의 주석을 해제하고 어떤 오류가 발생하는지 확인해보세요!
- `back_of_house::Breakfast` 구조체는 비공개 필드를 갖고 있기 때문에, `Breakfast` **인스턴스를 생성할 공개 연관 함수를 반드시 제공**해야 합니다.
  - 예제에서는 `summer` 함수입니다
  - 만약 `Breakfast` 구조체에 그런 함수가 존재하지 않을 경우, `eat_at_restaurant` 함수에서 `Breakfast` 인스턴스를 생성할 수 없습니다.
  - `eat_at_restaurant` 함수 내에서는 비공개 필드인 `seasonal_fruit` 필드의 값을 지정할 방법이 없기 때문입니다.
- 반대로, `열거형`은 **공개로 지정할 경우 모든 variant가 공개됩니다**.
- 열거형을 공개하는 방법은 `enum` 키워드 앞에 `pub` 키워드만 작성하면 됩니다.

```rust
mod back_of_house {
    pub enum Appetizer {
        Soup,
        Salad,
    }
}
pub fn eat_at_restaurant() {
    let order1 = back_of_house::Appetizer::Soup;
    let order2 = back_of_house::Appetizer::Salad;
}
```

- `Appetizer` 열거형을 공개하였으니, `eat_at_restaurant` 함수에서 `Soup`, `Salad` variant를 사용할 수 있습니다.
- 공개 열거형의 variant가 전부 공개되는 이유는
  - variant가 전부 공개되지 않은 열거형의 활용도가 낮고,
  - 모든 variant에 `pub` 키워드를 작성하는 것도 귀찮은 일이기 때문입니다.

남은 `pub` 키워드 관련 내용은 모듈 시스템의 마지막 기능인 `use` 키워드입니다. 먼저 `use` 키워드 단독 사용법을 다루고, 그다음 `use` 와 `pub` 을 연계하여 사용하는 방법을 다루겠습니다.

## [`use` 키워드로 경로를 스코프 내로 가져오기](https://rust-kr.github.io/doc.rust-kr.org/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#use-%ED%82%A4%EC%9B%8C%EB%93%9C%EB%A1%9C-%EA%B2%BD%EB%A1%9C%EB%A5%BC-%EC%8A%A4%EC%BD%94%ED%94%84-%EB%82%B4%EB%A1%9C-%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0)

- 앞서 작성한 함수 호출 경로는 너무 길고 반복적으로 느껴지기도 합니다.
- 예를 들어, Listing 7-7에서는 절대 경로를 사용하건 상대 경로를 사용하건, `add_to_waitlist` 호출할 때마다 `front_of_house`, `hosting` 모듈을 매번 명시해 주어야 하죠.
- `use` 키워드를 사용해 경로를 스코프 내로 가져오면 이 과정을 단축하여 마치 로컬 항목처럼 호출할 수 있습니다.

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}
use crate::front_of_house::hosting;
pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}
```

- 스코프에 `use` 키워드와 경로를 작성하는 건 파일 시스템에서 심볼릭 링크를 생성하는 것과 유사합니다.
- 크레이트 루트에 `use crate::front_of_house::hosting`를 작성하면 해당 스코프에서 `hosting` 모듈을 크레이트 루트에 정의한 것처럼 사용할 수 있습니다.
- `use` 키워드로 가져온 경우 또한 다른 경로와 마찬가지로 비공개 규칙이 적용됩니다.

- `use` 키워드에 상대 경로를 사용할 수도 있습니다.
  - `use self::front_of_house::hosting;`

### [보편적인 `use` 경로 작성법](https://rust-kr.github.io/doc.rust-kr.org/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#%EB%B3%B4%ED%8E%B8%EC%A0%81%EC%9D%B8-use-%EA%B2%BD%EB%A1%9C-%EC%9E%91%EC%84%B1%EB%B2%95)

`add_to_waitlist` 함수까지 경로를 전부 작성하지 않고, `use crate::front_of_house::hosting` 까지만 작성한 뒤 `hosting::add_to_waitlist` 코드로 함수를 호출하는 점이 의아하실 수도 있습니다.

`use` 키워드로 `add_to_waitlist` 함수를 직접 가져오기 (**보편적이지 않은 작성 방식**)

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}
use crate::front_of_house::hosting::add_to_waitlist;
pub fn eat_at_restaurant() {
    add_to_waitlist();
    add_to_waitlist();
    add_to_waitlist();
}
```

- 함수의 부모 모듈을 `use` 키워드로 가져올 경우, 전체 경로 대신 축약 경로만 작성하면서도, 해당 함수가 현재 위치에 정의된 함수가 아님이 명확해지기 때문입니다.
- 반면, 위의 예시는 `add_to_waitlist` 함수가 어디에 정의되어 있는지 알기 어렵습니다.

한편, `use` 키워드로 구조체나 열거형 등의 타 항목을 가져올 시에는 전체 경로를 작성하는 것이 보편적입니다.

Listing 7-14는 `HashMap` 표준 라이브러리 구조체를 바이너리 크레이트의 스코프로 가져오는 관용적인 코드 예시입니다. (std == **standard**)

```rust
use std::collections::HashMap;
fn main() {
    let mut map = HashMap::new();
    map.insert(1, 2);
}
```

이러한 관용이 탄생하게 된 명확한 이유는 없습니다. 어쩌다 보니 관습이 생겼고, 사람들이 이 방식대로 러스트 코드를 읽고 쓰는 데에 익숙해졌을 뿐입니다.

하지만, 동일한 이름의 항목을 여럿 가져오는 경우는 이 방식을 사용하지 않습니다. 러스트가 허용하기 않기 때문이죠.

**이름이 같은 두 개의 타입을 동일한 스코프에 가져오려면 부모 모듈을 반드시 명시해야 합니다.**

### [`as` 키워드로 새로운 이름 제공하기](https://rust-kr.github.io/doc.rust-kr.org/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#as-%ED%82%A4%EC%9B%8C%EB%93%9C%EB%A1%9C-%EC%83%88%EB%A1%9C%EC%9A%B4-%EC%9D%B4%EB%A6%84-%EC%A0%9C%EA%B3%B5%ED%95%98%EA%B8%B0)

`use` 키워드로 동일한 이름의 타입을 스코프로 여러 개 가져올 경우의 또 다른 해결 방법이 있습니다. 경로 뒤에 `as` 키워드를 작성하고, 새로운 이름이나 타입 별칭을 작성을 작성하면 됩니다.

```rust
use std::fmt::Result;
use std::io::Result as IoResult;
fn function1() -> Result {
    // --snip--
    Ok(())
}

fn function2() -> IoResult<()> {
    // --snip--
    Ok(())
}
```

두 번째 `use` 구문에서는, 앞서 스코프 내로 가져온 `std::fmt` 의 `Result` 와 충돌을 방지하기 위해 `std::io::Result` 타입의 이름을 `IoResult` 로 새롭게 지정합니다.

### [`pub use` 로 다시 내보내기](https://rust-kr.github.io/doc.rust-kr.org/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#pub-use-%EB%A1%9C-%EB%8B%A4%EC%8B%9C-%EB%82%B4%EB%B3%B4%EB%82%B4%EA%B8%B0)

`use` 키워드로 이름을 가져올 경우, 해당 이름은 새 위치의 스코프에서 비공개가 됩니다. `pub` 와 `use` 를 결합하면 우리 코드를 호출하는 코드가, 해당 스코프에 정의된 것처럼 해당 이름을 참조할 수 있습니다. 이 기법은 항목을 스코프로 가져오는 동시에 다른 곳에서 항목을 가져갈 수 있도록 만들기 때문에, *다시 내보내기(Re-exporting)* 라고 합니다.

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}
pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}
```

`pub use`를 사용하면 외부 코드에서 `add_to_waitlist` 함수를 `hosting::add_to_waitlist` 코드로 호출할 수 있습니다. `pub use` 로 지정하지 않을 경우, `eat_at_restaurant` 함수에서는 여전히 `hosting::add_to_waitlist` 로 호출할 수 있지만, 외부 코드에서는 불가능합니다.

`pub use` 를 사용하면 코드를 작성할 때의 구조와, 노출할 때의 구조를 다르게 만들 수 있습니다.

라이브러리를 제작하는 프로그래머와, 라이브러리를 사용하는 프로그래머 모두를 위한 라이브러리를 구성하는데 큰 도움이 되죠.

### [외부 패키지 사용하기](https://rust-kr.github.io/doc.rust-kr.org/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#%EC%99%B8%EB%B6%80-%ED%8C%A8%ED%82%A4%EC%A7%80-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)

우린 2장에서 `rand` 라는 외부 패키지를 사용해 추리 게임의 랜덤 숫자 생성을 구현했었습니다. `rand` 패키지를 우리 프로젝트에서 사용하기 위해, *Cargo.toml* 에 다음 줄을 추가했었죠.

*Cargo.toml* 에 `rand` 를 의존성으로 추가하면 Cargo가 `rand` 패키지를 비롯한 모든 의존성을 [crates.io](https://crates.io/)에서 다운로드하므로 프로젝트 내에서 `rand` 패키지를 사용할 수 있게 됩니다.

그 후, `use` 키워드와 크레이트 이름인 `rand`를 작성하고, 가져올 항목을 나열하여, `rand` 정의를 우리가 만든 패키지의 스코프로 가져왔습니다. `Rng` 트레잇을 스코프로 가져오고 `rand::thread_rng` 함수를 호출했었습니다.

러스트 커뮤니티 구성원들은 [crates.io](https://crates.io/)에서 이용 가능한 다양한 패키지를 만들어두었으니, 같은 방식으로 가져와서 여러분의 패키지를 발전시켜보세요. 여러분이 만든 패키지의 *Cargo.toml* 파일에 추가하고, `use` 키워드를 사용해 스코프로 가져오면 됩니다.

알아 두어야 할 것은, **표준 라이브러리 `std`도 마찬가지로 외부 크레이트라는 겁니다.** 러스트 언어에 포함되어 있기 때문에 *Cargo.toml* 에 추가할 필요는 없지만, 표준 라이브러리에서 우리가 만든 패키지의 스코프로 가져오려면 `use` 문을 작성해야 합니다. 예를 들어, `HashMap`을 가져오는 코드는 다음과 같습니다.

`use std::collections::HashMap;`

표준 라이브러리 크레이트의 이름인 `std` 로 시작하는 절대 경로입니다.

### [대량의 `use` 구문을 중첩 경로로 정리하기](https://rust-kr.github.io/doc.rust-kr.org/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#%EB%8C%80%EB%9F%89%EC%9D%98-use-%EA%B5%AC%EB%AC%B8%EC%9D%84-%EC%A4%91%EC%B2%A9-%EA%B2%BD%EB%A1%9C%EB%A1%9C-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0)

동일한 크레이트나, 동일한 모듈 내에 정의된 항목을 여럿 사용할 경우, 각 항목당 한 줄씩 코드를 나열하면 수직 방향으로 너무 많은 영역을 차지합니다.

중첩 경로를 사용하면 한 줄로 작성할 수 있습니다. 경로의 공통된 부분을 작성하고, `::` 와 중괄호 내에 경로가 각각 다른 부분을 나열합니다.

```rust
use std::cmp::Ordering;
use std::io;

use std::{cmp::Ordering, io};
```

중첩 경로는 경로의 모든 부위에서 사용할 수 있으며, 하위 경로가 동일한 `use` 구문이 많을 때 특히 빛을 발합니다.

다음 Listing 7-19는 두 `use` 구문의 예시입니다. 하나는 `std::io` 를 스코프로 가져오고, 다른 하나는 `std::io::Write` 를 스코프로 가져옵니다.

```rust
use std::io;
use std::io::Write;

use std::io::{self, Write};
```

### [글롭 연산자](https://rust-kr.github.io/doc.rust-kr.org/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#%EA%B8%80%EB%A1%AD-%EC%97%B0%EC%82%B0%EC%9E%90)

경로에 글롭 연산자 `*`를 붙이면 경로 내 정의된 *모든* 공개 항목을 가져올 수 있습니다.

`use std::collections::*;`

이 `use` 구문은 `std::collections` 내에 정의된 모든 공개 항목을 현재 스코프로 가져옵니다. **하지만 글롭 연산자는 코드에서 사용된 어떤 이름이 어느 곳에 정의되어 있는지 파악하기 어렵게 만들 수 있으므로, 사용에 주의해야 합니다.**

## [별개의 파일로 모듈 분리하기](https://rust-kr.github.io/doc.rust-kr.org/ch07-05-separating-modules-into-different-files.html#%EB%B3%84%EA%B0%9C%EC%9D%98-%ED%8C%8C%EC%9D%BC%EB%A1%9C-%EB%AA%A8%EB%93%88-%EB%B6%84%EB%A6%AC%ED%95%98%EA%B8%B0)

이번 장에서 여태 나온 모든 예제들은 하나의 파일에 여러 모듈을 정의했습니다. 큰 모듈이라면, 정의를 여러 파일로 나누어 코드를 쉽게 찾아갈 수 있도록 만들어야 하겠죠.

각종 정의를 다른 파일로 이동했지만, 모듈 트리는 이전과 동일합니다. 거대한 모듈을 파일 하나에 전부 작성하지 않고, 필요에 따라 **새로운 파일을 만들어 분리할 수 있도록 하는 것이 모듈 분리 기법**입니다.

*src/lib.rs* 파일의 `pub use crate::front_of_house::hosting` 구문을 변경하지 않았으며, `use` 문이 크레이트의 일부로 컴파일 되는 파일에 영향을 주지 않는다는 점도 주목해 주세요. `mod` 키워드는 모듈을 선언하고, 러스트는 해당 모듈까지의 코드를 찾아서 모듈명과 동일한 이름의 파일을 찾습니다.

## [정리](https://rust-kr.github.io/doc.rust-kr.org/ch07-05-separating-modules-into-different-files.html#%EC%A0%95%EB%A6%AC)

러스트에서는 패키지를 여러 크레이트로 나눌 수 있고, 크레이트는 여러 모듈로 나눌 수 있습니다. 절대 경로나 상대 경로를 작성하여 어떤 모듈 내 항목을 다른 모듈에서 참조할 수 있습니다. 경로는 `use` 구문을 사용해 스코프 내로 가져와, 항목을 해당 스코프에서 여러 번 사용해야 할 때 더 짧은 경로를 사용할 수 있습니다. 모듈 코드는 기본적으로 비공개이지만, `pub` 키워드를 추가해 정의를 공개할 수 있습니다.

다음 장에서는 여러분의 깔끔하게 구성된 코드에서 사용할 수 있는 표준 라이브러리의 컬렉션 자료구조를 몇 가지 배워보겠습니다.
