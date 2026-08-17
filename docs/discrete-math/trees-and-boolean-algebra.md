---
sidebar_position: 4
slug: /discrete-math/trees-and-boolean-algebra
title: "트리 구조와 부울 대수 (Trees & Boolean Algebra)"
description: "트리의 수학적 공리, 최소 신장 트리(Kruskal/Prim MST), 부울 대수의 공리계 및 카르노 맵(Karnaugh Map)을 이용한 논리식 최적화"
---

# 트리 구조와 부울 대수 (Trees & Boolean Algebra)

<br />

계층적 구조를 표현하는 **트리(Tree)**와 디지털 컴퓨터 하드웨어의 스위칭 회로를 설계하는 **부울 대수(Boolean Algebra)**는 컴퓨터공학의 뼈대다.

이 문서에서는 트리의 수학적 정의와 최소 신장 트리(MST) 알고리즘, 그리고 부울 대수의 공리 체계 및 **카르노 맵(Karnaugh Map)**을 활용한 논리식 최적화 기법을 정리한다.

---

## 1. 트리의 수학적 성질 (Tree Properties)

**트리(Tree)**는 **사이클이 없는 연결 무방향 그래프 (Connected Acyclic Undirected Graph)**로 정의된다.

```mermaid
graph TD
    Root[Root: Depth 0] --> ChildA[Child A: Depth 1]
    Root --> ChildB[Child B: Depth 1]
    ChildA --> Leaf1[Leaf 1: Depth 2]
    ChildA --> Leaf2[Leaf 2: Depth 2]
    ChildB --> Leaf3[Leaf 3: Depth 2]
```

### 1.1 트리의 동치 조건
$N$개 정점을 가진 그래프 $G = (V, E)$에 대해 다음 조건들은 모두 동치(Equivalent)다.

1. $G$는 트리다.
2. $G$는 연결 그래프이고 $N-1$개의 간선을 갖는다 ($|E| = |V| - 1$).
3. $G$의 임의의 두 정점 사이에는 유일한 단순 경로(Simple Path)가 존재한다.
4. $G$에는 사이클이 없으며, 임의의 새 간선을 추가하면 정확히 하나의 사이클이 생성된다.

---

## 2. 최소 신장 트리 (MST: Minimum Spanning Tree)

가중치 연결 그래프에서 모든 정점을 포함하면서 간선 가중치의 합이 최소가 되는 트리다.

- **크루스칼 알고리즘 (Kruskal's Algorithm)**: 간선을 가중치 오름차순으로 정렬한 뒤, **유니온 파인드(Disjoint Set / Union-Find)** 자료구조로 사이클 형성 여부를 판별하며 탐욕적(Greedy) 선택 ($O(E \log E)$).
- **프림 알고리즘 (Prim's Algorithm)**: 임의의 시작 정점에서 출발하여 현재 트리에 인접한 간선 중 최소 가중치 간선을 우선순위 큐(Min Heap)로 선택 확장 ($O(E \log V)$).

---

## 3. 부울 대수와 논리식 간소화 (Boolean Algebra)

부울 대수는 $\{0, 1\}$ 원소와 $+$(OR), $\cdot$(AND), $'$(NOT) 연산자로 정의되는 대수 구조다.

### 3.1 주요 부울 대수 법칙
- **드모르간 법칙 (De Morgan's Laws)**:
  $$(A + B)' = A' \cdot B', \quad (A \cdot B)' = A' + B'$$
- **흡수 법칙 (Absorption Law)**:
  $$A + A \cdot B = A, \quad A \cdot (A + B) = A$$
- **분배 법칙 (Distributive Law)**:
  $$A + B \cdot C = (A + B) \cdot (A + C)$$

### 3.2 카르노 맵 (Karnaugh Map)
진리표의 입력 조합을 그레이 코드(Gray Code, 인접 칸과 1비트만 차이) 순서로 2차원 격자에 배치하여, 인접한 $1$들을 $2^n$개씩 묶어 최소항(Minterm)을 시각적으로 최적화하는 기법이다.
