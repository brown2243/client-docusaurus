---
sidebar_position: 1
slug: /math/intro
description: computer-science-math-binary-hex-bitwise-combinatorics
---

# 프로그래밍을 위한 컴퓨터 기초 수학 & 비트 연산

컴퓨터 프로그래밍과 알고리즘 구현에 필수적인 기초 수학 개념인 **진법 체계**, **비트 연산(Bitwise Operations)**, **경우의 수(조합/순열)** 개념을 정리한다.

---

## 1. 진법 체계 (2진수 & 16진수)

컴퓨터의 디지털 회로는 스위치의 ON/OFF(0과 1) 상태만 이해하므로 **2진수(Binary)**를 기본 단위로 사용한다.

- **2진수 (Binary - 0b)**: 0과 1로 수 표현. `0b1010` -> $1\times 2^3 + 0\times 2^2 + 1\times 2^1 + 0\times 2^0 = 10_{(10)}$
- **16진수 (Hexadecimal - 0x)**: 2진수의 4비트를 1글자로 축약 표현 (0~9, A~F). `0x0F` -> `0b00001111` -> $15_{(10)}$
  - 메모리 주소, RGB 색상 코드(`#FF5733`), 바이너리 파일 바이트 표현에 주로 활용됨.

---

## 2. 비트 연산자 (Bitwise Operators)

하드웨어 제어, 플래그 상태 관리, 메모리 최적화 및 알고리즘 풀이 시 극강의 속도를 내는 비트 단위 연산이다.

```javascript
// 1. AND (&): 두 비트가 모두 1일 때만 1
console.log(0b1100 & 0b1010); // 0b1000 (8)

// 2. OR (|): 두 비트 중 하나라도 1이면 1 (비트 플래그 켜기)
console.log(0b1100 | 0b1010); // 0b1110 (14)

// 3. XOR (^): 두 비트가 서로 다를 때 1 (비트 반전 / 스왑)
console.log(0b1100 ^ 0b1010); // 0b0110 (6)

// 4. Shift (<<, >>): 비트를 왼쪽/오른쪽으로 이동 (2의 거듭제곱 곱셈/나눗셈 효과)
console.log(1 << 3); // 1 * 2^3 = 8
console.log(16 >> 2); // 16 / 2^2 = 4
```

---

## 3. 경우의 수 (순열과 조합)

알고리즘에서 백트래킹(Backtracking) 및 완전 탐색 문제 풀이 시 시간 복잡도를 계산하는 기반이다.

### 1) 순열 (Permutation: $n P r$)
서로 다른 $n$개 중 **순서를 고려하여** $r$개를 선택하는 경우의 수.
$$n P r = \frac{n!}{(n - r)!}$$

### 2) 조합 (Combination: $n C r$)
서로 다른 $n$개 중 **순서에 상관없이** $r$개를 선택하는 경우의 수.
$$n C r = \frac{n!}{r!(n - r)!}$$

## 참조

- Concrete Mathematics (Ronald L. Graham)
- https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Expressions_and_Operators#bitwise_operators
