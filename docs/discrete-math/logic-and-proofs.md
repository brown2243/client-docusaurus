---
sidebar_position: 1
slug: /discrete-math/logic-and-proofs
title: "명제 논리, 술어 논리 및 수학적 증명법 (Logic & Proofs)"
description: "컴퓨터공학의 근간이 되는 명제 논리, 진리표, 논리적 동치, 술어와 한정자, 그리고 귀류법과 수학적 귀납법 증명 체계 분석"
---

# 명제 논리, 술어 논리 및 수학적 증명법 (Logic & Proofs)

<br />

컴퓨터 과학의 모든 알고리즘, 조건문(`if-else`), 데이터베이스 쿼리, 하드웨어 회로는 **수학적 논리(Mathematical Logic)** 위에 구축되어 있다.

논리학은 참(True, $1$)과 거짓(False, $0$)이라는 명확한 비트 단위 판단에서 출발하여, 소프트웨어 프로그램의 정확성을 증명하고 부작용이 없음을 입증하는 강인한 체계를 제공한다.

---

## 1. 명제 논리 (Propositional Logic)

**명제(Proposition)**란 참(True)인지 거짓(False)인지 명확하게 판별할 수 있는 문장이나 식을 의미한다.

### 1.1 기본 논리 연산자

| 연산자 | 기호 | 이름 | 의미 / 조건 |
|---|---|---|---|
| **NOT** | $\neg P$ | 부정 (Negation) | $P$의 진릿값을 반대로 뒤집음 |
| **AND** | $P \land Q$ | 논리곱 (Conjunction) | $P$와 $Q$가 **모두 참**일 때만 참 |
| **OR** | $P \lor Q$ | 논리합 (Disjunction) | $P$와 $Q$ 중 **적어도 하나가 참**이면 참 |
| **XOR** | $P \oplus Q$ | 배타적 논리합 | $P$와 $Q$의 진릿값이 **다를 때만** 참 |
| **IMPLIES** | $P \to Q$ | 조건명제 (Implication) | **$P$가 참이고 $Q$가 거짓**인 경우에만 거짓 |
| **IFF** | $P \leftrightarrow Q$ | 쌍조건명제 (Biconditional) | $P$와 $Q$의 진릿값이 **같을 때만** 참 |

---

## 2. 술어 논리와 한정자 (Predicate Logic)

- **전칭 한정자 (Universal Quantifier, $\forall$)**: 도메인의 **모든 $x$**에 대해 명제가 성립함 ("$\forall x P(x)$").
- **존재 한정자 (Existential Quantifier, $\exists$)**: 도메인에 명제를 만족하는 **어떤 $x$가 적어도 하나 존재함** ("$\exists x P(x)$").

---

## 3. 대표적인 수학적 증명 기법

### 3.1 귀류법 (Proof by Contradiction)
결론을 거짓이라 가정($\neg Q$)한 뒤, 논리 전개 과정에서 모순($R \land \neg R$)이 발생함을 보여 본래 결론이 참임을 증명하는 기법이다. (예: $\sqrt{2}$가 무리수임을 증명)

### 3.2 수학적 귀납법 (Mathematical Induction)
자연수 $n$에 대한 명제 $P(n)$에 대해:
1. **기초 단계 (Base Case)**: $P(1)$이 참임을 증명.
2. **귀납 단계 (Inductive Step)**: $P(k)$가 참이라 가정할 때 $P(k+1)$도 참임을 증명.
3. 결론: 모든 자연수 $n$에 대해 $P(n)$이 성립함을 확정. (재귀 알고리즘 정당성 증명의 기반)
