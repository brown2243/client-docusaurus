---
sidebar_position: 2
slug: /linear-algebra-and-calculus/calculus-basics-for-cs
title: "컴퓨터공학을 위한 미적분학 기초 (Calculus for Computer Science)"
description: "극한과 연속, 미분법과 체인 룰(Chain Rule), 편미분과 그래디언트 벡터(Gradient), 그리고 경사하강법(Gradient Descent) 최적화 알고리즘 완벽 분쇄"
---

# 컴퓨터공학을 위한 미적분학 기초 (Calculus for Computer Science)

<br />

미적분학(Calculus)은 연속적인 변화(Change)와 누적(Accumulation)을 다루는 수학의 한 분야다.

현대 컴퓨터공학에서 미적분학은 단순히 연속 함수를 푸는 도구를 넘어, **인공지능 신경망의 역전파(Backpropagation) 손실 함수 최적화, 컴파일러 및 알고리즘 연속 한계 분석, 물리 기반 시뮬레이션, 수치 해석**의 핵심 엔진으로 활용된다.

---

## 1. 극한과 연속성 (Limits & Continuity)

### 1.1 극한의 정의
함수 $f(x)$에서 $x$가 $a$에 접근할 때 $f(x)$가 목표값 $L$에 한없이 가까워지면 `lim_{x -> a} f(x) = L`이라고 표기한다.

### 1.2 로피탈의 정리 (L'Hôpital's Rule)
알고리즘 복잡도 비교 시 부정형(Indeterminate Forms: `0/0` 또는 `∞/∞`)의 극한을 계산할 때 사용한다.

- `lim_{x -> a} [f(x) / g(x)] = lim_{x -> a} [f'(x) / g'(x)]` (단, `g'(x) != 0`)

---

## 2. 미분법과 연산 규칙 (Differentiation)

### 2.1 체인 룰 (Chain Rule, 합성함수 미분법)
딥러닝의 역전파(Backpropagation) 계산의 수학적 근간이다.

- `dz/dx = (dz/dy) * (dy/dx)`

### 2.2 편미분 (Partial Derivative)
다변수 함수 $f(x_1, x_2, \dots, x_n)$에서 하나의 변수만 변수로 취급하고 나머지 변수는 상수로 간주하여 미분하는 기법이다.

---

## 3. 그래디언트(Gradient)와 경사하강법 (Gradient Descent)

### 3.1 그래디언트 벡터
모든 입력 변수에 대한 편미분 값들을 모아둔 벡터로, 함수값이 가장 가파르게 증가하는 방향을 가리킨다.

- `∇f(x) = [∂f/∂x1, ∂f/∂x2, ..., ∂f/∂xn]^T`

### 3.2 경사하강법 업데이트 공식
손실 함수(Loss Function)를 최소화하기 위해 그래디언트의 반대 방향으로 파라미터를 점진적으로 갱신한다.

- `θ_(t+1) = θ_(t) - η * ∇L(θ_(t))` (`η`: 학습률 / Learning Rate)
