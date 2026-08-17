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

함수 $f(x)$에서 $x$가 $a$에 접근할 때 $f(x)$가 목표값 $L$에 한없이 가까워지면 $\\lim_{x \\to a} f(x) = L$이라고 표기한다.

### 1.2 로피탈의 정리 (L'Hôpital's Rule)

알고리즘 복잡도 비교 시 부정형(Indeterminate Forms: $\\frac{0}{0}$ 또는 $\\frac{\\infty}{\\infty}$)의 극한을 계산할 때 사용한다.

$$
\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)} \\quad (\\text{단, } g'(x) \
eq 0)
$$

> **응답 예시**: $x \\to \\infty$ 일 때 $\\frac{\\ln x}{x}$의 극한:
> $\\lim_{x \\to \\infty} \\frac{\\ln x}{x} = \\lim_{x \\to \\infty} \\frac{1/x}{1} = 0$. (다항식이 로그 함수보다 훨씬 빠르게 증가함을 증명)

---

## 2. 미분법과 주요 연산 규칙 (Differentiation)

미분(Derivative)이란 순간 변화율(Instantaneous Rate of Change)이자 접선의 기울기(Tangent Slope)다.

$$f'(x) = \\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$

### 2.1 미분 기본 공식

- \*\*다항함수 (Power Ru
  <truncated 4306 bytes>
