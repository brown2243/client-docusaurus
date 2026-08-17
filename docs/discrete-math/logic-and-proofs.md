---
sidebar_position: 1
slug: /discrete-math/logic-and-proofs
title: "명제 논리, 술어 논리 및 수학적 증명법 (Logic & Proofs)"
description: "컴퓨터공학의 근간이 되는 명제 논리, 진리표, 논리적 동치, 술어와 한정자, 그리고 귀류법과 수학적 귀납법 증명 체계 분석"
---

# 명제 논리, 술어 논리 및 수학적 증명법 (Logic & Proofs)

<br />

컴퓨터 과학의 모든 알고리즘, 조건문(`if-else`), 데이터베이스 쿼리, 하드웨어 회로는 **수학적 논리(Mathematical Logic)** 위에 구축되어 있다.

논리학은 참(True, $1$)과 거짓(False, $0$)이라는 명확한 비트 단위 판단에서 출발하여, 소프트웨어 프로그램의 정확성을 증명하고 부작용(Side Effect)이 없음을 연증하는 강인한 체계를 제공한다.

---

## 1. 명제 논리 (Propositional Logic)

**명제(Proposition)**란 그 내용이 객관적으로 **참(True)인지 거짓(False)인지 명확하게 판별할 수 있는 문장이나 식**을 의미한다.

### 1.1 기본 논리 연산자 (Logical Connectives)

| 연산자                | 기호                   | 이름                         | 의미 / 조건                                 |
| --------------------- | ---------------------- | ---------------------------- | ------------------------------------------- |
| **NOT**               | $\                     |
| eg P$ 또는 $\\bar{P}$ | 부정 (Negation)        | $P$의 진릿값을 반대로 뒤집음 |
| **AND**               | $P \\land Q$           | 논리곱 (Conjunction)         | $P$와 $Q$가 **모두 참**일 때만 참           |
| **OR**                | $P \\lor Q$            | 논리합 (Disjunction)         | $P$와 $Q$ 중 **적어도 하나가 참**이면 참    |
| **XOR**               | $P \\oplus Q$          | 배타적 논리합 (Exclusive OR) | $P$와 $Q$의 진릿값이 **다를 때만** 참       |
| **IMPLIES**           | $P \\rightarrow Q$     | 조건명제 (Implication)       | **$P$가 참인데 $Q$가 거짓**인 경우에만 거짓 |
| **IFF**               | $P \\leftrightarrow Q$ | 쌍조건명제 (Biconditional)   | $P$와 $Q$의 진릿값이 **같을 때만** 참       |

### 1.2 조건명제 ($P \\rightarrow Q$)의 진리표와 함정

조건명제 $P \\rightarrow Q$ ("$P$이면 $Q$이다")에서 가정 $P$가 거
<truncated 5552 bytes>
