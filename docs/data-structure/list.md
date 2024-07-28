---
sidebar_position: 2
description: about list.
---

# List

- 길이를 동적으로 변경할 수 있는 선형 자료구조
- 연결리스트, 동적 배열로 나뉨

## Dynamic Array(동적 배열)

- **같은 자료형의 데이터를 연속된 메모리 공간에 저장하는 선형 자료구조**
- 배열의 한계(선언 시점에 크기고정)을 극복한 **가변(Dynamic) 길이 배열**
- 동적 배열은 런타임에 크기를 조정할 수 있어 유연성을 제공

### Vector

- 동적배열의 구현체(C++)
- 벡터의 크기는 동적으로 변할 수 있기 때문에 heap에 저장
- 배열 기반 컨테이너(Array-based Container)
  - 내부적으로 배열 자료구조를 사용
  - 벡터에 저장된 데이터의 개수가 현재 배열 최대 길이에 도달하면, 벡터는 자동으로 크기를 확장
  - [기존 배열의 1.5배 큰 새로운 배열을 할당](https://maloveforme.tistory.com/40)하고 기존 데이터를 새로운 배열로 복사한 후, 이전 배열을 해제
- 벡터 객체가 선언된 스코프(함수, 블록 등)를 벗어나면 자동으로 해제

## 연결 리스트(Linked List)

- 데이터 요소들이 포인터나 참조를 사용하여 연결된 자료구조
- 각 데이터 요소는 노드(Node)라고 불리며, 노드는 데이터와 다음 노드를 가리키는 포인터로 구성
- 동적 메모리 할당을 사용하여 크기를 유동적으로 변경
- 데이터의 삽입과 삭제가 효율적
- 임의 접근이 불가능하며, 순차 접근만 가능

## 같은 선형 자료구조인 Array와 차이점

- 동적 크기 조정: 배열과 달리 초기 크기를 지정할 필요가 없음
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
