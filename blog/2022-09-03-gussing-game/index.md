---
slug: post/11
title: Chap.2 gussing-game

authors: [brown]
tags: [hello-rust, rust, PS, codewars]
Date: 2022-08-28 22:31
---

<br />

**[해당 학습 자료](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html)를 정리 및 수행한 기록입니다.**

이번 장은 몇몇 일반적인 Rust 개념과 활용 방법을 배울 수 있습니다.

- `let`
- `match`
- 메소드,
- 연관함수(assiciated functions),
- 외부 크레이트(external crates)

이번 장에서는 여러분이 직접 기초적인 내용을 실습합니다.

우리는 고전적인 입문자용 프로그래밍 문제인 추리 게임을 구현해 보려 합니다.

1. 먼저 프로그램은 1~100 사이의 임의의 정수를 생성합니다.
2. 다음으로 플레이어가 프로그램에 추리한 정수를 입력합니다.
3. 프로그램은 입력받은 추리값이 정답보다 높거나 낮은지를 알려줍니다.
4. 추리값이 정답이라면 축하 메세지를 보여주고 종료됩니다.

## 값을 변수에 저장하기

```rust
// 사용자 입력을 받고 결과값을 표시하기 위해서는 io (input/output) 라이브러리를 스코프로 가져와야 합니다.
// io 라이브러리는 std 라고 불리는 표준 라이브러리에 있습니다.

use std::io;

fn main() {
	// print
	println!("Guess the number!");
	println!("Please input your guess.");

	// mut string 변수 선언
	let mut guess = String::new();

	// input 받는 코드
	io::stdin()
	.read_line(&mut guess)
	.expect("Failed to read line");

	// 출력
	println!("You guessed: {}", guess);
}
```

> **러스트에서 변수는 기본적으로 불변입니다.**

```rust
let foo = 5; // 불변
let mut bar = 5; // 가변
```

- `String::new`의 결과값인 새로운 `String` 인스턴스가 묶이는 대상이 됩니다.
- [`String`](https://rust-kr.github.io/std/string/struct.String.html)은 표준 라이브러리에서 제공하는 확장 가능한(growable) UTF-8 인코딩의 문자열 타입입니다.

- `::new`에 있는 `::`는 `new`가 `String` 타입의 *연관 함수 (associated function)* 임을 나타냅니다.
- 연관함수는 하나의 타입을 위한 함수이며, 이 경우에는 하나의 `String` 인스턴스가 아니라 `String` 타입을 위한 함수입니다.
- 몇몇 언어에서는 이것을 *정적 메소드 (static method)* 라고 부릅니다.

- `new` 함수는 새로운 빈 `String`을 생성합니다. `new` 함수는 새로운 값을 생성하기 위한 일반적인 이름이므로 많은 타입에서 찾아볼 수 있습니다.

요약하자면 `let mut guess = String::new();` 라인은 새로운 빈 `String` 인스턴스와 연결된 가변변수를 생성합니다.

우리는 `io`의 연관함수인 `stdin`을 호출합니다:

    `io::stdin()
             .read_line(&mut guess)`

`stdin` 함수는 터미널의 표준 입력의 핸들(handle)을 나타내는 타입인 [`std::io::Stdin`](https://rust-kr.github.io/std/io/struct.Stdin.html)의 인스턴스를 돌려줍니다.

코드의 다음 부분인 `.read_line(&mut guess)`는 사용자로부터 입력을 받기 위해 표준 입력 핸들에서 [`read_line`](https://rust-kr.github.io/std/io/struct.Stdin.html#method.read_line) 메소드를 호출합니다. 또한 `read_line`에 `&mut guess`를 인자로 하나 넘깁니다.

- `&`는 코드의 여러 부분에서 **데이터를 여러 번 메모리로 복사하지 않고 접근하기 위한 방법을 제공하는 *참조자* 임을 나타냅니다.**
- 참조자는 복잡한 특성으로서 러스트의 큰 이점 중 하나가 참조자를 사용함으로써 얻는 안전성과 용이성입니다.
- 지금 당장은 참조자가 변수처럼 기본적으로 불변임을 알기만 하면 됩니다. 따라서 가변으로 바꾸기 위해 `&guess`가 아니라 `&mut guess`로 작성해야 합니다.

### `Result` 타입으로 잠재된 실패 다루기

1. `read_line`은 우리가 인자로 넘긴 문자열에 사용자가 입력을 저장할 뿐 아니라 하나의 값을 돌려 줍니다.
2. 여기서 돌려준 값은 [`io::Result`](https://rust-kr.github.io/std/io/type.Result.html) 입니다.
3. 러스트는 표준 라이브러리에 여러 종류의 `Result` 타입을 가지고 있습니다.
4. 제네릭 [`Result`](https://rust-kr.github.io/std/result/enum.Result.html)이나 `io:Result`가 그 예시입니다

`Result`의 variants는 `Ok`와 `Err`입니다.

`Ok`는 처리가 성공했음을 나타내며 내부적으로 성공적으로 생성된 결과를 가지고 있습니다.

`Err`는 처리가 실패했음을 나타내고 그 이유에 대한 정보를 가지고 있습니다.

`io::Result`가 `Ok` 값이라면 `expect`는 `Ok`가 가지고 있는 결과값을 돌려주어 사용할 수 있도록 합니다. **이 경우 결과값은 사용자가 표준 입력으로 입력했던 바이트의 개수입니다.**

만약 `expect`를 호출하지 않는다면 컴파일은 되지만 경고가 나타납니다.

### [`println!` 변경자(placeholder)를 이용한 값 출력](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#println-%EB%B3%80%EA%B2%BD%EC%9E%90placeholder%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EA%B0%92-%EC%B6%9C%EB%A0%A5)

`println!("You guessed: {}", guess);`

## [비밀번호를 생성하기](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#%EB%B9%84%EB%B0%80%EB%B2%88%ED%98%B8%EB%A5%BC-%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0)

러스트는 아직 표준 라이브러리에 임의의 값을 생성하는 기능이 없습니다.

하지만 러스트 팀에서는 [`rand` 크레이트](https://crates.io/crates/rand)를 제공합니다.

### [크레이트(Crate)를 사용하여 더 많은 기능 가져오기](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#%ED%81%AC%EB%A0%88%EC%9D%B4%ED%8A%B8crate%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%EB%8D%94-%EB%A7%8E%EC%9D%80-%EA%B8%B0%EB%8A%A5-%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0)

- 크레이트는 러스트 코드의 묶음(package)임을 기억하세요.
- 우리가 만들고 있는 프로젝트는 **실행이 가능한 *binary crate* 입니다.**
- `rand` crate는 다른 프로그램에서 사용되기 위한 용도인 *library crate* 입니다.

Cargo에서 외부 크레이트의 활용 예시

- `rand`를 사용하는 코드를 작성하기 전에 *Cargo.toml* 을 수정
  - `rand` 크레이트를 의존 리스트에 추가

```
[dependencies]
rand = "0.8.5"

```

우리는 외부 의존성을 가지게 되었고, Cargo는 [Crates.io](https://crates.io/) 데이터의 복사본인 *레지스트리(registry)* 에서 모든 것들을 가져옵니다.

Crates.io는 러스트 생태계의 개발자들이 다른 사람들도 이용할 수 있도록 러스트 오픈소스를 공개하는 곳입니다.

레지스트리를 업데이트하면 Cargo는 `[dependencies]` 절을 확인하고 아직 여러분이 가지고 있지 않은 것들을 다운 받습니다.

이 경우 우리는 `rand`만 의존한다고 명시했지만 `rand`는 `libc`에 의존하기 때문에 `libc`도 다운 받습니다.

러스트는 이것들을 다운받은 후 컴파일하여 의존성이 해결된 프로젝트를 컴파일합니다.

#### [크레이트를 새로운 버전으로 업그레이드하기](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#%ED%81%AC%EB%A0%88%EC%9D%B4%ED%8A%B8%EB%A5%BC-%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%B2%84%EC%A0%84%EC%9C%BC%EB%A1%9C-%EC%97%85%EA%B7%B8%EB%A0%88%EC%9D%B4%EB%93%9C%ED%95%98%EA%B8%B0)

Cargo는 `update` 명령어를 제공합니다.

이것은 *Cargo.lock* 파일을 무시하고 *Cargo.toml* 에 여러분이 명시한 요구사항에 맞는 최신 버전을 확인합니다.

확인이 되었다면Cargo는 해당 버전을 *Cargo.lock* 에 기록합니다.

### [임의의 숫자를 생성하기](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#%EC%9E%84%EC%9D%98%EC%9D%98-%EC%88%AB%EC%9E%90%EB%A5%BC-%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0)

이제 `rand` 크레이트를 *Cargo.toml* 에 추가 했으니, `rand`를 사용 해 봅시다.

**정말 놀라운 부분은 버전을 올려서 사용법이 달라졌는데, 사용법과 예시코드까지 보여줌 ㄷㄷ**

```rust
use rand::Rng;
...
// let secret_number = rand::thread_rng().gen_range(1, 101);
let secret_number = rand::thread_rng().gen_range(1..101);

let mut i = 0;
loop {
	if i > 100 {
		break;
	}
	let secret_number = rand::thread_rng().gen_range(1..101);
	println!("{} secret number is: {}", i, secret_number);
	i += 1;
}
...

```

- 먼저 `use` 라인인 `use rand::Rng`를 추가합니다.

  - `Rng`는 난수 생성기를 구현한 메소드들을 정의한 트레잇 (trait) 이며 해당 메소드들을 이용하기 위해서는 반드시 스코프 내에 있어야 합니다. 10장에서 트레잇에 대해 더 자세히 다룰 것입니다.

- `rand::thread_rng` 함수는 OS가 시드(seed)를 정하고 현재 스레드에서만 사용되는 특별한 난수 생성기를 돌려줍니다.
- 다음으로 우리는 `gen_range` 메소드를 호출합니다.
  - 이 메소드는 `Rng` 트레잇에 정의되어 있으므로 `use rand::Rng` 문을 통해 스코프로 가져올 수 있습니다.
  - `gen_range` 메소드는 두 개의 숫자를 인자로 받고 두 숫자 사이에 있는 임의의 숫자를 생성합니다. 하한선은 포함되지만 상한선은 제외되므로 1부터 100 사이의 숫자를 생성하려면 `1`과 `101`을 넘겨야 합니다.

> Note: 크레이트에서 트레잇과 메소드, 함수중 어떤 것을 호출해야 할지 모를 수도 있습니다.
> 각 크레이트의 사용법은 크레이트의 문서에 있습니다.

> Cargo의 다른 멋진 기능은 `cargo doc --open` 명령어를 사용하여 의존하는 크레이트의 문서를 로컬에서 모두 빌드한 다음, 브라우저에서 열 수 있다는 것입니다.

> `rand` 크레이트의 다른 기능이 궁금하시면, `cargo doc --open`을 실행하고, 왼쪽 사이드바에서 `rand`를 클릭하여 알 수 있습니다.

## [비밀번호와 추리값을 비교하기](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#%EB%B9%84%EB%B0%80%EB%B2%88%ED%98%B8%EC%99%80-%EC%B6%94%EB%A6%AC%EA%B0%92%EC%9D%84-%EB%B9%84%EA%B5%90%ED%95%98%EA%B8%B0)

```rust
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    // --snip--

    println!("You guessed: {}", guess);

    match guess.cmp(&secret_number) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => println!("You win!"),
    }
}
```

Listing 2-4: 두 숫자를 비교한 결과 처리하기

- `Ordering`은 `Result`와 같은 열거형이지만 `Ordering`의 값은 `Less`, `Greater`, `Equal`입니다. 이것들은 여러분이 두 개의 값을 비교할 때 나올 수 있는 결과들입니다.
- `cmp` 메소드는 두 값을 비교하며 비교 가능한 모든 것들에 대해 호출할 수 있습니다.
  - 이 메소드는 비교하고 싶은 것들의 참조자를 받습니다.
  - 여기서는 `guess`와 `secret_number`를 비교하고 있습니다.
  - `cmp`는 `Ordering` 열거형을 돌려줍니다.
- 우리는 [`match`](https://rust-kr.github.io/doc.rust-kr.org/ch06-02-match.html) 표현문을 이용하여 `cmp`가 `guess`와 `secret_number`를 비교한 결과인 `Ordering`의 값에 따라 무엇을 할 것인지 결정할 수 있습니다.

`match` 표현식은 *arm* 으로 이루어져 있습니다.

하나의 arm은 하나의 *패턴* 과 `match` 표현식에서 주어진 값이 패턴과 맞는다면 실행할 코드로 이루어져 있습니다.

러스트는 `match`에게 주어진 값을 arm의 패턴에 맞는지 순서대로 확인합니다.

`match` 생성자와 패턴들은 여러분의 코드가 마주칠 다양한 상황을 표현할 수 있도록 하고 모든 경우의 수를 처리했음을 확신할 수 있도록 도와주는 강력한 특성들입니다.

예제에서 사용된 `match` 표현식에 무엇이 일어날지 한번 따라가 봅시다.

1. 사용자가 50을 예측했다고 하고 비밀번호가 38이라 합시다.
2. 50과 38을 비교하면 `cmp` 메소드의 결과는 `Ordering::Greater` 입니다.
3. `match` 표현식은 `Ordering::Greater`를 값으로 받아서 각 arm의 패턴을 확인합니다.
4. 처음으로 마주하는 arm의 패턴인 `Ordering::Less`는 `Ordering::Greater`와 매칭되지 않으므로 첫번째 arm은 무시하고 다음으로 넘어갑니다.
5. 다음 arm의 패턴인 `Ordering::Greater`는 *확실히* `Ordering::Greater`와 매칭합니다!
6. arm과 연관된 코드가 실행될 것이고 `Too big!`가 출력될 것입니다. 이 경우 마지막 arm은 확인할 필요가 없으므로 `match` 표현식은 끝납니다.

비교하기 위해서 string을 i32로 변환 해줘야 함

`let guess: u32 = guess.trim().parse().expect("Please type a number!");`

우리는 `guess` 변수를 생성했습니다.

잠깐, 이미 프로그램에서 `guess`라는 이름의 변수가 생성되지 않았나요? 그렇긴 하지만 러스트는 이전에 있던 **`guess`의 값을 *가리는(shadow)* 것을 허락**합니다

. 이 특징은 종종 하나의 값을 현재 타입에서 다른 타입으로 변환하고 싶을 경우에 사용합니다.

Shadowing은 우리들이 `guess_str`과 `guess`처럼 고유의 변수명을 만들도록 강요하는 대신 `guess`를 재사용 가능하도록 합니다. (3장에서 더 자세한 이야기를 다룹니다)

1. 우리는 `guess`를 `guess.trim().parse()` 표현식과 묶습니다.
2. 표현식 내의 `guess`는 입력값을 가지고 있던 `String`을 참조합니다.
3. `String` 인스턴스의 `trim` 메소드는 처음과 끝 부분의 빈칸을 제거합니다.
   - `u32`는 정수형 글자만을 가져야 하지만 사용자들은 `read_line`을 끝내기 위해 enter키를 반드시 눌러야 합니다.
   - enter키가 눌리는 순간 개행문자가 문자열에 추가됩니다. 만약 사용자가 5를 누르고 enter키를 누르면 `guess`는 `5\n`처럼 됩니다. `\n`은 enter키, 즉 개행문자를 의미합니다. `trim` 메소드는 `\n`을 제거하고 `5`만 남도록 처리합니다.
4. [문자열의 `parse` 메소드](https://rust-kr.github.io/std/primitive.str.html#method.parse)는 문자열을 숫자형으로 파싱합니다.
   - 이 메소드는 다양한 종류의 정수형을 변환하므로 우리는 `let guess: u32`처럼 정확한 타입을 명시해야 합니다.
   - `guess` 뒤의 콜론(`:`)은 변수의 타입을 명시했음을 의미합니다.
   - `u32`은 부호가 없는 32비트의 정수입니다.
   - `parse` 메소드의 호출은 에러가 발생하기 쉽습니다.
   - 만약 `A👍%`과 같은 문자열이 포함되어 있다면 정수로 바꿀 방법이 없습니다.
   - [“`Result` 타입으로 잠재된 실패 다루기”](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#handling-potential-failure-with-the-result-type) 에서 `read_line`와 비슷하게 `parse` 메소드는 실패할 경우를 위해 `Result` 타입을 결과로 돌려 줍니다. 우리는 이 `Result`를 `expect` 메소드를 사용하여 같은 방식으로 처리합니다.
   - 만약 `parse` 메소드가 문자열에서 정수로 파싱을 실패하여 `Err` `Result` variant를 돌려준다면 `expect` 호출은 게임을 멈추고 우리가 명시한 메세지를 출력합니다. 만약 `parse` 메소드가 성공적으로 문자열을 정수로 바꾸었다면 `Result`의 `Ok` variant를 돌려 받으므로 `expect`에서 `Ok`에서 얻고 싶었던 값을 결과로 받게 됩니다.

## [반복문을 이용하여 여러 번의 추리 허용](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#%EB%B0%98%EB%B3%B5%EB%AC%B8%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%98%EC%97%AC-%EC%97%AC%EB%9F%AC-%EB%B2%88%EC%9D%98-%EC%B6%94%EB%A6%AC-%ED%97%88%EC%9A%A9)

`loop` 키워드는 무한루프를 제공합니다.

### [정답 이후에 종료하기](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#%EC%A0%95%EB%8B%B5-%EC%9D%B4%ED%9B%84%EC%97%90-%EC%A2%85%EB%A3%8C%ED%95%98%EA%B8%B0)

```rust
	loop {
		println!("Please input your guess.");
		match guess.cmp(&secret_number) {
			Ordering::Less => println!("Too small!"),
			Ordering::Greater => println!("Too big!"),
			Ordering::Equal => {
				println!("You win!");
				break;
			}
		}
	}
```

### [잘못된 입력값 처리하기](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#%EC%9E%98%EB%AA%BB%EB%90%9C-%EC%9E%85%EB%A0%A5%EA%B0%92-%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0)

사용자가 숫자가 아닌 값을 입력했을 때 프로그램이 종료되는 동작을 더 다듬어 숫자가 아닌 입력은 무시하여 사용자가 계속 입력할 수 있도록 해 봅시다.

`guess`가 `String`에서 `u32`로 변환되는 라인을 수정하면 됩니다.

`let guess: u32 = match guess.trim().parse() { Ok(num) => num, Err(_) => continue, };`

- `expect` 메소드 호출을 `match` 표현식으로 바꾸는 것은 에러 발생 시 종료되지 않게 처리하는 일반적인 방법입니다.
- `parse` 메소드가 `Result` 타입을 돌려주는 것과 `Result`는 `Ok`나 `Err` variants를 가진 열거형임을 떠올리세요.
- `cmp` 메소드의 `Ordering` 결과를 처리했을 때처럼 여기서 `match` 표현식을 사용하고 있습니다.

- 만약 `parse`가 성공적으로 문자열에서 정수로 변환했다면 결과값을 가진 `Ok` 를 돌려줍니다.
- `Ok`는 첫번째 arm의 패턴과 매칭하게 되고 `match` 표현식은 `parse` 가 생성한 `num`값을 돌려줍니다. 그 값은 우리가 생성하고 있던 새로운 `guess`과 묶이게 됩니다.

## [요약](https://rust-kr.github.io/doc.rust-kr.org/ch02-00-guessing-game-tutorial.html#%EC%9A%94%EC%95%BD)

이 프로젝트는 `let`, `match`, 메소드, 연관함수, 외부 크레이트 사용과 같은 많은 새로운 러스트 개념들을 소개하기 위한 실습이었습니다.

# Rust_PS in codewars

## 8 kyu

### Convert boolean values to strings 'Yes' or 'No'.

```rust
fn bool_to_word(value: bool) -> &'static str {
	match value {
	    true => "Yes",
	    false => "No",
    }
}
```

### DNA to RNA Conversion

```rust
fn dna_to_rna(dna: &str) -> String {
    let n = dna.len();
    let mut ans = String::new();
    let mut idx = 0;

    loop {
        if (idx == n) {
            break;
        }
        let t = dna.chars().nth(idx).unwrap();

        match t {
            'G' => ans.push_str("G"),
            'C' => ans.push_str("C"),
            'A' => ans.push_str("A"),
            _ => ans.push_str("U"),
        }

        idx += 1
    }
    return ans;
}
//
fn dna_to_rna(dna: &str) -> String {
 dna.replace("T", "U")
}
fn dna_to_rna(dna: &str) -> String {
    dna.chars().map(char_conversion).collect()
}
fn char_conversion(c: char) -> char {
    if c == 'T' {
        return 'U';
    }

    c
}
fn dna_to_rna(dna: &str) -> String {
    let mut res = String::new();
    for s in dna.chars() {
        match s {
            'T' => res.push('U'),
            _ => res.push(s),
        }
    }
    res
}

```

### Counting sheep...

```rust
fn count_sheep(sheep: &[bool]) -> u8 {
    let mut cnt = 0;
    for x in sheep {
        if *x {
            cnt += 1;
        } else {
            cnt += 0
        }
    }
    cnt
}
//
fn count_sheep(sheep: &[bool]) -> u8 {
  sheep              // take the sheep array
    .iter()          // turn it into an iterable
    .filter(|&&x| x) // filter it by taking the values in the array and returning only the true ones
    .count() as u8   // count all of the elements in the filtered array and return a u8
}

```

### Fake Binary

```rust
fn fake_bin(s: &str) -> String {
    let mut ans = String::new();

    for x in s.trim().split("").into_iter() {
        if x == "" {
            continue;
        }
        let num = x
            .parse::<i32>()
            .expect("please give me correct string number!");

        // println!("{num}");
        if num >= 5 {
            ans.push_str("1");
        } else {
            ans.push_str("0");
        }
    }
    println!("{ans}");
    ans
}

//
fn fake_bin(s: &str) -> String {
    s.chars().map(|c| if c < '5' {'0'} else {'1'}).collect()
}
fn fake_bin(s: &str) -> String {
    s.chars()
        .map(|c| match c {
            '0'..='4' => '0',
            '5'..='9' => '1',
            _ => c
        })
        .collect()
}
```

### Switch it Up!

```rust
fn switch_it_up(n: usize) -> &'static str {
    match n {
        0 => "Zero",
        1 => "One",
        2 => "Two",
        3 => "Three",
        4 => "Four",
        5 => "Five",
        6 => "Six",
        7 => "Seven",
        8 => "Eight",
        9 => "Nine",
        _ => "",
    }
}
//
fn switch_it_up(n: usize) -> &'static str {
    match n {
        1 => "One",
        2 => "Two",
        3 => "Three",
        4 => "Four",
        5 => "Five",
        6 => "Six",
        7 => "Seven",
        8 => "Eight",
        9 => "Nine",
        _ => "Zero"
    }
}
fn switch_it_up(n: usize) -> &'static str {
    match n {
        0 => "Zero",
        1 => "One",
        2 => "Two",
        3 => "Three",
        4 => "Four",
        5 => "Five",
        6 => "Six",
        7 => "Seven",
        8 => "Eight",
        9 => "Nine",
        _ => panic!()
    }
}

```

### The Feast of Many Beasts

```rust
fn feast(beast: &str, dish: &str) -> bool {
    return beast.chars().nth(0) == dish.chars().nth(0)
        && beast.chars().nth(beast.len() - 1) == dish.chars().nth(dish.len() - 1);
}
//
fn feast(beast: &str, dish: &str) -> bool {
    beast.chars().next() == dish.chars().next()
    && beast.chars().last() == dish.chars().last()
}
fn feast(beast: &str, dish: &str) -> bool {
    dish[..1] == beast[..1] && dish[dish.len()-1..] == beast[beast.len()-1..]
}
```

### Function 2 - squaring an argument

```rust
fn square(n: i32) -> i32 {
    n * n
}
//
fn square(n: i32) -> i32 {
    n.pow(2)
}
```

### Convert number to reversed array of digits

```rust
// error
// Creates a temporary which is freed while still in use Again slight_smile
let process = Command::new(location_test);
process.arg(address);

fn digitize(n: u64) -> Vec<u8> {
    const RADIX: u32 = 10;
    // your code here
    let str = n.to_string();
    let arr = str
        .chars()
        .rev()
        .map(|x| x.to_digit(RADIX).unwrap())
        .collect::<Vec<u32>>();

    let mut ans: Vec<u8> = [].to_vec();
    arr.into_iter()
        .for_each(|val| ans.push(val.try_into().unwrap()));
    println!("{ans:#?}");
    return ans;
}
// u32 -> u8로 변경하는 부분
fn digitize(n: u64) -> Vec<u8> {
    n
        .to_string()
        .chars()
        .map(|c| c.to_digit(10).unwrap() as u8)
        .rev()
        .collect::<Vec<u8>>()
}
```
