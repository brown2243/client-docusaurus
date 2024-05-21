---
sidebar_position: 21
description: about tree.
---

# Tree

그래프는 더 일반적인 구조인 반면, 트리는 그래프의 특별한 형태라고 볼 수 있습니다.

트리는 하나의 루트 노드를 갖는다.
루트 노드는 0개 이상의 자식 노드를 갖고 있다.
그 자식 노드 또한 0개 이상의 자식 노드를 갖고 있고, 이는 반복적으로 정의된다.
노드(node)들과 노드들을 연결하는 간선(edge)들로 구성되어 있다.
트리에는 사이클(cycle)이 존재할 수 없다.
노드들은 특정 순서로 나열될 수도 있고 그럴 수 없을 수도 있다.
각 노드는 부모 노드로의 연결이 있을 수도 있고 없을 수도 있다.
각 노드는 어떤 자료형으로도 표현 가능하다.

```
class Node {
public String name;
public Node[] children;
}
```

비선형 자료구조로 계층적 관계를 표현한다. Ex 디렉터리 구조, 조직도
그래프의 한 종류
사이클(cycle)이 없는 하나의 연결 그래프(Connected Graph)
또는 DAG(Directed Acyclic Graph, 방향성이 있는 비순환 그래프)의 한 종류 이다.

트리(Tree):
트리는 그래프의 특별한 형태로, 계층적 구조를 나타내는 비선형 자료구조입니다.
트리는 노드(Node)와 간선(Edge)으로 구성되며, 루트 노드(Root Node)라는 최상위 노드를 가집니다.
트리에서는 사이클이 존재하지 않습니다. 즉, 두 노드 사이에는 항상 단 하나의 경로만 존재합니다.
트리의 각 노드는 부모 노드(Parent Node)와 자식 노드(Child Node)로 구성됩니다.
루트 노드를 제외한 모든 노드는 정확히 하나의 부모 노드를 가집니다.
트리의 최하위 노드를 리프 노드(Leaf Node) 또는 단말 노드(Terminal Node)라고 합니다.
트리는 재귀적인 구조를 가지고 있어 부분 트리(Subtree)를 포함할 수 있습니다.
트리의 높이(Height)는 루트 노드에서 가장 깊은 리프 노드까지의 경로 길이를 나타냅니다.
트리는 다양한 종류가 있습니다. 예를 들어 이진 트리(Binary Tree), 이진 탐색 트리(Binary Search Tree), AVL 트리, 레드-블랙 트리 등이 있습니다.
트리는 계층적 데이터를 표현하고 관리하는 데 유용합니다. 예를 들어 파일 시스템, 조직도, 문서 구조 등을 트리로 표현할 수 있습니다.
그래프와 트리는 모두 데이터의 관계를 표현하는 데 사용되지만, 구조와 제약 조건에 차이가 있습니다. 그래프는 일반적인 관계를 나타내는 반면, 트리는 계층적 관계를 나타냅니다. 그래프는 사이클을 포함할 수 있지만 트리는 사이클을 포함하지 않습니다. 또한 트리에서는 노드 간의 부모-자식 관계가 명확하게 정의되어 있습니다.

그래프와 트리는 다양한 알고리즘과 문제 해결에 활용됩니다. 그래프는 최단 경로 문제, 네트워크 흐름 문제 등을 해결하는 데 사용되며, 트리는 탐색, 정렬, 데이터 압축 등의 문제를 해결하는 데 사용됩니다.

## search

노드 탐색은 트리 구조에서 특정 노드를 찾는 과정을 의미합니다. 트리 탐색의 대표적인 방법으로는 깊이 우선 탐색(DFS)과 너비 우선 탐색(BFS)이 있습니다.

깊이 우선 탐색 (DFS: Depth-First Search):
깊이 우선 탐색은 트리의 한 분기를 최대한 깊이 탐색한 후, 더 이상 탐색할 노드가 없으면 이전 분기로 돌아가는 방식입니다.
재귀 함수를 사용하거나 스택을 활용하여 구현할 수 있습니다.
전위 순회(Pre-order), 중위 순회(In-order), 후위 순회(Post-order) 등의 순회 방법이 있습니다.

```javascript

Copy code
class TreeNode {
constructor(value) {
this.value = value;
this.left = null;
this.right = null;
}
}

function dfs(node) {
if (node === null) return;

// 전위 순회
console.log(node.value);
dfs(node.left);
dfs(node.right);

// 중위 순회
// dfs(node.left);
// console.log(node.value);
// dfs(node.right);

// 후위 순회
// dfs(node.left);
// dfs(node.right);
// console.log(node.value);
}

// 트리 생성
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

// DFS 실행
dfs(root);
```

위의 코드에서는 전위 순회 방식으로 DFS를 구현하였습니다. 중위 순회와 후위 순회는 주석 처리된 부분을 활성화하고 다른 부분을 주석 처리하면 됩니다.

너비 우선 탐색 (BFS: Breadth-First Search):
너비 우선 탐색은 트리의 루트 노드부터 시작하여 같은 레벨의 노드들을 먼저 탐색한 후, 다음 레벨로 넘어가는 방식입니다.
큐(Queue)를 사용하여 구현할 수 있습니다.

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function bfs(root) {
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node.value);

    if (node.left !== null) {
      queue.push(node.left);
    }
    if (node.right !== null) {
      queue.push(node.right);
    }
  }
}

// 트리 생성
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

// BFS 실행
bfs(root);
```
