---
sidebar_position: 1
slug: /linear-algebra-and-calculus/vectors-matrices-systems
title: "벡터, 행렬 연산 및 선형연립방정식 (Vectors, Matrices & Linear Systems)"
description: "벡터의 내적과 코사인 유사도, 행렬 연산 및 역행렬, 가우스 소거법을 통한 선형연립방정식 풀이, 고윳값과 고유벡터의 핵심 분석"
---

# 벡터, 행렬 연산 및 선형연립방정식 (Vectors, Matrices & Linear Systems)

<br />

선형대수학(Linear Algebra)은 **3D 컴퓨터 그래픽스, 딥러닝/머신러닝(Tensor 연산), 이미지 처리, 추천 시스템, 그리고 구글의 PageRank 알고리즘**을 관통하는 컴퓨터공학 최고의 수학적 언어다.

이 문서에서는 벡터 공간, 내적과 코사인 유사도, 행렬의 기하학적 의미, 가우스 소거법, 그리고 고윳값(Eigenvalue)과 고유벡터(Eigenvector)의 핵심 원리를 다룬다.

---

## 1. 벡터 공간과 벡터 연산 (Vectors & Vector Spaces)

**벡터(Vector)**는 공간에서의 크기(Magnitude)와 방향(Direction)을 가진 객체로, $n$차원 공간의 점으로도 해석된다.

### 1.1 내적 (Dot Product)과 코사인 유사도

두 $n$차원 벡터 $u = [u_1, u_2, \dots, u_n]^T$, $v = [v_1, v_2, \dots, v_n]^T$의 내적은 다음과 같다.

- `u · v = Σ (u_i * v_i) = ||u|| * ||v|| * cos(θ)`

### 1.2 코사인 유사도 (Cosine Similarity)

자연어 처리(NLP) 및 벡터 검색(RAG / Vector DB)에서 두 임베딩 벡터 간 방향 유사도를 측정할 때 핵심적으로 사용된다.

- `Cosine Similarity(u, v) = (u · v) / (||u|| * ||v||) = cos(θ)`

---

## 2. 행렬 연산과 선형 변환 (Matrix Operations)

행렬 $A$는 벡터를 다른 차원 또는 공간으로 회전, 확대, 축소하는 **선형 변환(Linear Transformation)** 함수로 볼 수 있다.

- `T(x) = A * x`

---

## 3. 고윳값과 고유벡터 (Eigenvalues & Eigenvectors)

정방행렬 $A$에 대해, 선형 변환 후에도 방향이 변하지 않고 크기만 $\lambda$배 변하는 0이 아닌 벡터 $v$를 **고유벡터**, 스칼라 $\lambda$를 **고윳값**이라 한다.

- `A * v = λ * v`

이는 주성분 분석(PCA, Principal Component Analysis), 특잇값 분해(SVD), PageRank 알고리즘의 기초가 된다.
