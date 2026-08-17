---
sidebar_position: 2
slug: /discrete-math/sets-functions-sequences
title: "집합, 함수, 수열과 점화식 (Sets, Functions & Recurrence Relations)"
description: "집합론의 기초, 전사/단사/일대일 대응 함수, 수열의 합, 그리고 마스터 정리(Master Theorem)를 통한 분할 정복 알고리즘 점화식 복잡도 분석"
---

# 집합, 함수, 수열과 점화식 (Sets, Functions & Recurrence Relations)

<br />

프로그래밍언어의 타입 시스템(Type System), 데이터베이스의 관계형 모델(Relational Model), 그리고 알고리즘의 시간 복잡도(Big-O) 분석은 모두 **집합, 함수, 점화식**이라는 이산수학적 개념에 기초한다.

이 문서에서는 집합의 연산부터 함수의 사상(Mapping) 특성, 그리고 합병 정렬(Merge Sort)과 같은 분할 정복 알고리즘의 실행 시간을 분석하는 **마스터 정리(Master Theorem)**까지 핵심적인 수학적 개념을 다룬다.

---

## 1. 집합론 기초 (Set Theory)

**집합(Set)**이란 구별 가능한 객체들의 명확한 모임이다.

### 1.1 기본 집합 연산
- **합집합 (Union)**: `A ∪ B = { x | x ∈ A ∨ x ∈ B }`
- **교집합 (Intersection)**: `A ∩ B = { x | x ∈ A ∧ x ∈ B }`
- **차집합 (Difference)**: `A \ B = { x | x ∈ A ∧ x ∉ B }`
- **카티션 곱 (Cartesian Product)**: `A × B = { (a, b) | a ∈ A ∧ b ∈ B }` (SQL `CROSS JOIN`의 수학적 정의)

---

## 2. 함수의 사상 (Functions & Mappings)

집합 $X$에서 $Y$로의 함수 $f: X \to Y$에 대해:

| 종류 | 정의 | 의미 |
|---|---|---|
| **단사함수 (Injective, 일대일)** | `x1 ≠ x2 => f(x1) ≠ f(x2)` | 서로 다른 입력은 서로 다른 출력을 가짐 (해시 충돌 방지 목표) |
| **전사함수 (Surjective, 위로의 함수)** | `∀ y ∈ Y, ∃ x ∈ X such that f(x) = y` | 공역과 치역이 일치함 |
| **전단사함수 (Bijective, 일대일 대응)** | 단사이면서 동시에 전사인 함수 | **역함수(Inverse Function)**가 존재함 (암호화/복호화의 기초) |

---

## 3. 점화식과 마스터 정리 (Master Theorem)

분할 정복 알고리즘의 점화식 `T(n) = a*T(n/b) + f(n)`의 점근적 복잡도를 빠르게 계산하는 정리다.

- `T(n) = a*T(n/b) + Θ(n^d)`
  - `d < log_b(a) => T(n) = Θ(n^(log_b(a)))`
  - `d = log_b(a) => T(n) = Θ(n^d * log n)` (예: 병합 정렬 `T(n) = 2*T(n/2) + O(n) => O(n log n)`)
  - `d > log_b(a) => T(n) = Θ(n^d)`
