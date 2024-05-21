---
sidebar_position: 10
description: about stack.
---

# Stack

- LIFO(Last-In-First-Out) 원칙에 따라 데이터를 저장하고 접근하는 자료구조
- 데이터의 삽입과 삭제는 스택의 top에서만 이루어짐
- 스택은 프로그램의 실행 흐름, 함수 호출, 메모리 관리 등 다양한 측면에서 사용 됌

```javascript
class Stack {
  constructor() {
    this._arr = [];
    this._size = 0;
  }

  isEmpty() {
    return this._size === 0;
  }

  push(value) {
    this._arr[this._size++] = value;
  }

  top() {
    const value = this._arr[this._size - 1];
    return value;
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error("stack underflow");
    }
    const value = this._arr[--this._size];
    return value;
  }
}
```
