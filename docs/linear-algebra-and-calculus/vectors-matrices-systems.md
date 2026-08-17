---
sidebar_position: 1
slug: /linear-algebra-and-calculus/vectors-matrices-systems
title: "벡터, 행렬 연산 및 선형연립방정식 (Vectors, Matrices & Linear Systems)"
description: "벡터의 내적과 코사인 유사도, 행렬 연산 및 역행렬, 가우스 소거법을 통한 선형연립방정식 풀이, 고윳값과 고유벡터의 핵심 분석"
---

# 벡터, 행렬 연산 및 선형연립방정식 (Vectors, Matrices & Linear Systems)

<br />

선형대수학(Linear Algebra)은 **3D 컴퓨터 그래픽스, 딥러닝/머신러닝(Tensor 연산), 이미지 처리, 추천 시스템, 그리고 구글의 PageRank 알고리즘**을 관통하는 컴퓨터공학 최고의 수학적 언어다.

이 문서에서는 벡터 공간, 내적과 코사인 유사도, 행렬의 기하학적 의미, 가우스 소거법, 그리고 고윳값(Eigenvalue)과 고유벡터(Eigenvector)의 핵심 원리를 완벽히 다룬다.

---

## 1. 벡터 공간과 벡터 연산 (Vectors & Vector Spaces)

**벡터(Vector)**는 공간에서의 크기(Magnitude)와 방향(Direction)을 가진 객체로, $n$차원 공간 $\\mathbb{R}^n$의 점으로도 해석된다.

### 1.1 내적 (Dot Product / Inner Product)과 코사인 유사도

두 $n$차원 벡터 $\\mathbf{u} = [u_1, u_2, \\dots, u_n]^T$, $\\mathbf{v} = [v_1, v_2, \\dots, v_n]^T$의 내적은 다음과 같다.

$$\\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^n u_i v_i = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos \\theta$$

```mermaid
graph LR
    VectorU[Vector u] -->|Dot Product| Product[u · v = ||u|| ||v|| cos θ]
    VectorV[Vector v] -->|Dot Product| Product
    Product -->|Norm Divide| CosineSim[Cosine Similarity: cos θ]
```

### 코사인 유사도 (Cosine Similarity)

자연어 처리(NLP) 및 추천 시스템에서 두 문서/벡터 간 유사도를 측정할 때 사용한다.

$$\\text{Cosine Similarity}(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|} = \\cos \\theta$
<truncated 4867 bytes>
