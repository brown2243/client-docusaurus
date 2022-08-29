---
slug: post/10
title: Chap.1 hello-rust

authors: [brown]
tags: [hello-rust, rust, rustup, cargo]
Date: 2022-08-28 22:31
---

# hello-rust

---

## 학습 목표

**2022-09월까지 학습자료에 대한 학습 마무리하기!!!**

## 학습 자료

- https://rust-kr.github.io/doc.rust-kr.org/ (2018 edition)
- https://rinthel.github.io/rust-lang-book-ko/ (2nd- edition)

## 개발환경 세팅

- `rustup` : 러스트 버전 및 러스트 관련 툴을 관리하는 커맨드라인 도구

- `brew install rustup-init`
- `rustup-init`

- `rustup update` update
- `rustup self uninstall` delete

- rustup -  `rust` 버전 및 관련 도구들을 위한 커맨드라인 도구이다
  - `rustc` -> 컴파일러: `rust` 코드를 컴퓨터가 이해할 수 있는 언어로 변경해주는 도구
  - `rustfmt` -> 코드 포맷팅 도구
  - `cargo` -> `rust`의 의존성관리 도구이다.

## Hello, Rust!

`main.rs` 을 `rustc`로 바이너리파일로 컴파일 -> `main` 실행파일 생성
`rustc main.rs` -> `./main`

### Cargo 로 프로젝트 생성하기

`cargo init`
`cargo project name`

```toml
[package]
name = "hello_cargo"
version = "0.1.0"
authors = ["Your Name <you@example.com>"]
edition = "2018"

[dependencies]
...
```

Listing 1-2: `cargo new` 로 생성한 *Cargo.toml* 파일의 내용

이 포맷은 [_TOML_](https://toml.io/) (_Tom’s Obvious, Minimal Language_) 포맷으로, Cargo 설정에서 사용하는 포맷입니다.

**Cargo 는 최상위 프로젝트 디렉토리를 README, 라이센스, 설정 파일 등 코드 자체와는 관련 없는 파일들을 저장하는 데 사용하기 때문에, 소스 파일은 *src* 내에 저장합니다.**

### Cargo 빌드 및 실행

- `cargo build` 명령으로 프로젝트를 빌드할 수 있습니다.(`target/debug/$projectName`)
- `cargo run` 명령어는 한번에 프로젝트를 빌드하고 실행할 수 있습니다.
- `cargo check` 명령으로 바이너리를 생성하지 않고 프로젝트의 에러를 체크할 수 있습니다.
- `cargo build --release` 명령어를 사용해 릴리즈 빌드를 생성할 수 있습니다.
  - 일반 빌드와 차이점은 *target/debug* 가 아닌 *target/release* 에 실행 파일이 생성된다는 점
  - 컴파일 시 최적화를 진행해, 컴파일이 오래 걸리는 대신 러스트 코드가 더 빠르게 작동하는 점
