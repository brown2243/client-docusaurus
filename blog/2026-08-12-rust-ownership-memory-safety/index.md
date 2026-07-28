---
slug: rust-ownership-memory-safety
title: "Rust 소유권(Ownership)과 빌림(Borrowing)으로 이해하는 GC 없는 메모리 안전성"
authors: [brown]
tags: [Rust, Memory, SystemProgramming, CS]
Date: 2026-08-12 14:00
---

# Rust 소유권(Ownership)과 빌림(Borrowing)으로 이해하는 GC 없는 메모리 안전성

<br />

Java나 JavaScript에서는 Garbage Collector(GC)가 알아서 안 쓰는 메모리를 청소해주고, C/C++에서는 `malloc()` / `free()`로 개발자가 수동 관리한다.
그런데 Rust는 **"GC도 없는데 런타임 수동 해제도 안 한다"**라더라.

대체 어떻게 **컴파일 타임에 메모리 누수와 Dangling Pointer를 100% 잡아내는지** 핵심 원리인 **소유권(Ownership)**과 **빌림(Borrowing)** 개념을 철저히 파헤쳐보았다.

<!-- truncate -->

### 1. Rust 소유권(Ownership)의 3가지 대원칙

Rust 메모리 관리의 정점은 아래 3가지 규칙에서 출발한다.

:::note
1. Rust의 모든 값(Value)은 **소유자(Owner)**라고 불리는 변수를 하나 가진다.
2. 값은 한 번에 오직 **단 하나의 소유자**만 존재할 수 있다.
3. 소유자가 스코프(Scope)를 벗어나면, 그 값은 즉시 파기(`drop`)된다.
:::

```rust
fn main() {
    {
        let s1 = String::from("hello"); // s1이 String의 소유자
        let s2 = s1; // 💡 Move 발생! 소유권이 s2로 이동함

        // println!("{}", s1); // ❌ 컴파일 에러! s1은 더 이상 유효하지 않음!
        println!("{}", s2);   // ⭕ 정상 작동!
    } // 스코프 끝: s2의 drop() 자동 호출되어 힙 메모리 해제!
}
```

C++의 Shallow Copy 문제나 Double Free 버그가 소유권 이동(Move Semantics) 규칙 덕분에 컴파일 시점에 완전히 차단된다.

---

### 2. 빌림(Borrowing)과 참조(Reference) 규칙

매번 소유권을 넘겨주면(`Move`) 함수의 매개변수로 전달할 때마다 소유권을 주고받아야 해서 너무 불편하다.
이 때 사용하는 것이 **빌림(Borrowing)** 개념이다.

#### 불변 참조(`&T`) vs 가변 참조(`&mut T`)

```rust
fn calculate_length(s: &String) -> usize { // &String: 불변 참조로 빌려옴
    s.len()
} // s가 스코프를 벗어나도 소유권이 없으므로 drop되지 않음!
```

#### 빌림의 핵심 제약: Borrow Checker 규칙

:::caution
- **불변 참조(`&T`)는 동시에 여러 개 존재할 수 있다.** (Read-only는 다수 허용)
- **가변 참조(`&mut T`)는 특정 스코프 내에서 오직 단 하나만 존재할 수 있다.**
- **불변 참조와 가변 참조는 절대로 동시에 존재할 수 없다!**
:::

```rust
let mut s = String::from("hello");

let r1 = &s; // 불변 참조 1 OK
let r2 = &s; // 불변 참조 2 OK
// let r3 = &mut s; // ❌ 컴파일 에러! 이미 불변 참조 r1, r2가 빌려가 있는 동안엔 가변 참조 불가능!

println!("{}, {}", r1, r2);
```

이 규칙 하나 덕분에 백엔드/동시성 프로그래밍에서 가장 치명적인 **Data Race(여러 스레드가 동시에 같은 메모리를 읽고 쓰려고 할 때 발생하는 정합성 오류)**가 100% 예방된다.

---

### 3. 스마트 포인터와 소유권 공유 (`Rc`, `Arc`, `RefCell`)

실전 개발을 하다 보면 그래프 구조나 복잡한 개체 참조처럼 **"여러 곳에서 하나의 데이터 소유권을 공유해야 하는 경우"**가 생긴다.

| 타입 | 설명 | 스레드 안전성 |
| --- | --- | --- |
| **`Rc<T>`** | Reference Counting (참조 횟수 카운팅) | 단일 스레드 전용 |
| **`Arc<T>`** | Atomic Reference Counting | **멀티 스레드 안전 (Thread-Safe)** |
| **`RefCell<T>`** | 런타임에 빌림 규칙을 체크 (내부 가변성 패턴) | 단일 스레드 전용 |

```rust
use std::sync::Arc;
use std::thread;

fn main() {
    // 멀티 스레드 간 안전한 데이터 공유
    let data = Arc::new(vec![1, 2, 3]);

    let data_clone = Arc::clone(&data);
    thread::spawn(move || {
        println!("스레드 1: {:?}", data_clone);
    }).join().unwrap();
}
```

---

### 마무리 / Outro

Rust를 배우다 보면 컴파일러(Borrow Checker)에게 뺨을 맞으며(?) 계속 컴파일 에러를 마주치게 된다.
하지만 이 엄격한 규칙들을 통과하고 빌드가 성공하는 순간, **"이 코드는 런타임 메모리 에러로 터질 일은 절대 없겠구나"**라는 강력한 확신을 얻게 된다.

개발자에게 고통을 선사하지만 최상의 결과물을 보장하는 Rust의 소유권 철학... 알수록 대단하다!
