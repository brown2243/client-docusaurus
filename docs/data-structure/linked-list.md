---
sidebar_position: 5
description: about linked-list.
---

# Linked List

## 연결 리스트(Linked List)

- 데이터 요소들이 포인터나 참조를 사용하여 연결된 자료구조
- 각 데이터 요소는 노드(Node)라고 불리며, 노드는 데이터와 다음 노드를 가리키는 포인터로 구성
- 동적 메모리 할당을 사용하여 크기를 유동적으로 변경
- 데이터의 삽입과 삭제가 효율적
- 임의 접근이 불가능하며, 순차 접근만 가능

## 같은 선형 자료구조인 Array와 차이점

- 동적 크기 조정: 배열과 달리 초기 크기를 지정할 필요가 없습니다.
- 효율적인 삽입과 삭제: O(1) 시간 복잡도를 가짐, 배열에서는 요소를 삽입하거나 삭제할 때 다른 요소들을 이동해야 하므로 O(n) 시간 복잡도가 소요
- 메모리 효율성: 필요한 만큼의 메모리만 할당

- 순차 접근: 인덱스를 사용하여 직접 접근할 수 없으므로 배열에 비해 접근 속도가 느림
- 추가 메모리 사용: 각 노드마다 다음 노드를 가리키는 포인터나 참조를 저장해야 하므로 배열에 비해 추가적인 메모리를 사용
- 캐시 지역성: Linked List의 노드들은 메모리 상에서 불연속적으로 분포되어 있어 캐시 지역성이 좋지 않아 배열에 비해 메모리 접근 속도가 느릴 수 있음

- 삽입과 삭제가 빈번하고 크기 변경이 필요한 경우에는 Linked List
- 빠른 접근과 캐시 지역성이 중요한 경우에는 배열

```javascript
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  append(data) {
    const node = new Node(data);

    if (this.head === null) {
      this.head = node;
    } else {
      let cur = this.head;
      while (cur.next !== null) {
        cur = cur.next;
      }
      cur.next = node;
    }
    this.size++;
  }
  pop() {
    if (this.size === 0) {
      return null;
    }

    let cur = this.head;
    let next = cur.next;
    if (next === null) {
      this.head = null;
      return cur;
    } else {
      while (next.next !== null) {
        cur = next;
        next = cur.next;
      }
      cur.next = null;
    }
    this.size--;
    return next;
  }
  insert(idx, data) {
    if (idx < 0 || idx > this.size) {
      throw new Error("Invalid idx");
    }
    const node = new Node(data);
    if (idx === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let cnt = 0;
      let cur = this.head;
      let prev = null;
      while (cnt < idx) {
        prev = cur;
        cur = cur.next;
        cnt++;
      }
      node.next = cur;
      prev.next = node;
    }
    this.size++;
  }
  remove(idx) {
    if (idx < 0 || idx > this.size) {
      throw new Error("Invalid idx");
    }

    if (idx === 0) {
      this.head = this.head.next;
    } else {
      let cnt = 1;
      let prev = this.head;
      while (cnt < idx) {
        prev = prev.next;
        cnt++;
      }
      prev.next = prev.next.next;
    }
    this.size--;
  }
}

const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
console.log(list);
list.insert(0, 9);
console.log(list);
list.insert(3, 9);
console.log(list);
list.insert(5, 9);
console.log(list);
```

그외 바리에이션으로 이중 연결 리스트, 원형 연결 리스트가 있다.

- Doubly Linked List: prev 포인터 추가, 양방향 탐색가능
- Circular Linked List: 마지막 노드의 next가 첫 번째 노드를 가르킴
