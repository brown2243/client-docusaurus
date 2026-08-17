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

- **합집합 (Union, $A \\cup B$)**: $\\{ x \\mid x \\in A \\lor x \\in B \\}$
- **교집합 (Intersection, $A \\cap B$)**: $\\{ x \\mid x \\in A \\land x \\in B \\}$
- **차집합 (Difference, $A \\setminus B$ 또는 $A - B$)**: $\\{ x \\mid x \\in A \\land x \
otin B \\}$
- **여집합 (Complement, $A^c$ 또는 $\\bar{A}$)**: 전체집합 $U$에 대해 $\\{ x \\in U \\mid x \
otin A \\}$

### 1.2 카티션 곱 (Cartesian Product)과 데카르트 곱

두 집합 $A, B$의 카티션 곱 $A \\times B$는 다음과 같이 정의되는 순서쌍(Ordered Pair)의 집합이다.

$$A \\times B = \\{ (a, b) \\mid a \\in A \\land b \\in B \\}$$

:::note DB에서의 카티션 곱
SQL에서 `CROSS JOIN`을 수행할 때 결과 행 수가 $|A| \\times |B|$가 되는 수학적 원리가 바로 카티션 곱이다.
:::

### 1.3 멱집합 (Power Set)

집합 $S$의 모든
<truncated 4601 bytes>
