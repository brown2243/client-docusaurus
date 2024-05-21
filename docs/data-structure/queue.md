---
sidebar_position: 11
description: about queue.
---

# Queue

- FIFO(First-In-First-Out) 원칙에 따라 데이터를 저장하고 접근하는 자료구조
- 데이터의 삽입은 큐의 끝에서, 삭제는 큐의 앞에서
- 버퍼(Buffer),작업 스케줄링, BFS등에서 활용

```javascript
class Queue {
  constructor() {
    this._arr = [];
    this._front = 0;
    this._last = 0;
  }

  get size() {
    return this._last - this._front;
  }

  isEmpty() {
    return this._front === this._last;
  }

  enqueue(value) {
    this._arr[this._last++] = value;
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const value = this._arr[this._front++];
    return value;
  }
}
```

## Dequeue

- Double-Ended Queue의 약자로, 양쪽 끝에서 삽입과 삭제가 가능한 자료구조
- 스택과 큐의 특성을 모두 가짐

## primary queue

- priority Queue는 우선순위를 가진 요소들을 저장하는 큐입
- 각 요소는 우선순위를 가지며, 우선순위가 높은 요소가 먼저 제거
- 우선순위 큐는 힙(Heap) 자료구조를 사용하여 구현되는 경우가 많음
- 삽입 연산 시 요소를 우선순위에 따라 적절한 위치에 삽입하고, 삭제 연산 시 우선순위가 가장 높은 요소를 제거
- 우선순위 큐는 작업 스케줄링, 이벤트 처리, 다익스트라 알고리즘 등에서 사용
