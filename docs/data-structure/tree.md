---
sidebar_position: 21
description: about tree.
---

# Tree

- 그래프는 더 일반적인 구조인 반면, 트리는 그래프의 특별한 형태
- 노드(node)들과 노드들을 연결하는 간선(edge)들로 구성
- 트리는 하나의 루트 노드를 가짐
- 트리에는 사이클(cycle)이 존재할 수 없음
- 최하위 노드는 리프 노드(Leaf Node)
- 그래프는 일반적인 관계를 나타내는 반면, 트리는 계층적 관계를 나타냄
- 파일 시스템, 조직도, 문서 구조 등을 트리로 표현할 수 있다

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
  }
}

class Tree {
  constructor(rootValue) {
    this.root = new TreeNode(rootValue);
  }
}
```

## 순회

- 전위 순회(Pre-order): root -> left -> right
- 중위 순회(In-order): left -> root -> right
- 후위 순회(Post-order): left -> right -> root
- 레벨 순회(level-order): 위 -> 아래

## binary tree

- 자식 노드는 최대 2개
- 포화이진트리(Perfect Binary Tree): 모든 레벨에서 노드들이 꽉 채워져 있는 트리
- 완전이진트리(Complete Binary Tree): 마지막 레벨을 제외하고 노드들이 모두 채워져 있는 트리
- 정 이진 트리 (Full binary Tree): 모든 노드가 0개 또는 2개의 자식 노드를 갖는 트리
- 편향 트리 (Skewed Binary Tree): 한쪽으로 기울어진 트리

## binary search tree

- 왼쪽 자식 노드의 값은 부모 노드의 값보다 작고, 오른쪽 자식 노드의 값은 부모 노드의 값보다 큼
- 중복된 값을 허용하지 않음
- 검색, 삽입, 삭제 연산의 평균 시간 복잡도는 O(log n), 최악의 경우 O(n)

## heap tree

- 일반적으로 우선순위 큐를 구현하는데 사용되는 자료구조
- 힙은 완전 이진 트리의 일종으로, 우선순위 큐를 구현하는 데 자주 사용되는 자료구조
- 최대 힙(Max Heap), 최소 힙(Min Heap)
- 삽입과 삭제 연산은 O(log n)
- 힙은 우선순위 큐, 힙 정렬, 그래프 알고리즘(다익스트라 알고리즘, 프림 알고리즘) 등에 활용
