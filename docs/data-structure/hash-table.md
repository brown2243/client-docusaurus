---
sidebar_position: 3
description: about Hash Table
---

# Hash Table

- 해시 테이블은 **키(Key)와 값(Value)의 쌍으로 데이터를 저장하는 자료구조**
- **해시 함수를 사용하여 키를 해시값으로 변환**하고, 이 해시값을 인덱스로 사용하여 값을 저장하거나 검색
- 해시 테이블은 평균적으로 O(1) 시간 복잡도로 데이터를 삽입, 삭제, 검색할 수 있어 효율적
- 해시 충돌이 발생할 경우, 체이닝(Chaining)이나 개방 주소법(Open Addressing) 등의 방법으로 충돌을 해결
- 해시 테이블은 키-값 쌍의 개수가 많아질수록 메모리 사용량이 증가, 충돌가능성 증가로 인한 오버헤드
- 초기에는 작은 크기로 해시 테이블을 생성하고, 요소들이 추가되면 크기를 동적으로 늘림
  - 크기를 조정하는 기준으로는 일반적으로 로드 팩터(Load Factor)를 사용
  - 로드 팩터는 해시 테이블에 저장된 요소의 개수를 해시 테이블의 크기로 나눈 값
  - 로드 팩터가 특정 임계값을 초과하면 해시 테이블의 크기를 확장하고, 기존의 요소들을 재배치
- [hash(key)]: [key, value]

## 해시 함수(Hash Function)

- 해시 함수는 **임의의 길이의 데이터를 고정된 길이의 해시값(일반적으로 정수)**으로 매핑하는 함수
  - SHA-256 해시 함수는 입력 데이터의 크기에 관계없이 항상 256비트(32바이트)의 해시값을 출력
- 좋은 해시 함수는 입력 데이터의 **작은 변화에도 큰 해시값의 변화(눈사태 효과)**를 만들어내야 하며, **해시 충돌(서로 다른 입력이 같은 해시값을 가지는 경우)**을 최소화
- 대표적인 해시 함수로는 SHA(Secure Hash Algorithm) 계열
- 해시값을 버킷의 개수로 나눈 나머지를 사용하여 해시값을 버킷의 인덱스로 매핑

## 해시 충돌(Hash Collision)

해시 충돌은 **서로 다른 입력이 같은 해시값을 가져 키가 중복되는 경우**를 의미한다.

**의도치 않게 기존 데이터를 덮어버릴 수 있는 문제점을** 가지고 있다.

하지만 해시 충돌은 비둘기집 충돌 원리에 따라 반드시 일어날 수 밖에 없다(인풋은 무한한데, 결과는 고정된 길이로 유한).

> N개의 상자에 N+1개의 물건을 넣은 경우, 최소한 한 상자에는 물건이 반드시 두 개 이상 들어있다는 원리

<!-- 반드시 버킷의 개수가 해시값의 개수와 동일할 필요는 없다 -->

해시값의 범위는 버킷보다 크지만 일반적으로 해시값을 버킷의 개수로 나눈 나머지를 사용하여 버킷의 인덱스를 결정한다.

**버킷 인덱스 = 해시값 % 버킷 개수**

> 0부터 999까지의 해시값이 나올때 해시 테이블의 버킷 개수를 100개로 설정한다면, 해시값을 버킷 개수로 나눈 나머지를 사용하여 버킷의 인덱스를 결정

이를 통해 해시값을 버킷의 인덱스 범위로 매핑할 수 있고, 해시 충돌도 피할 수 없다. 그래서 좋은 해시함수는 키를 고르게 분포시킨다.

### 체이닝

충돌 발생 시,중복되는 해시 코드를 가진 키와 밸류를 해당 버킷에서 링크드 리스트로 연결하는 방법이다.

링크드 리스트 내에서 키를 비교하여 일치하는 키를 찾는 과정이 추가로 필요하기 때문에 해시 충돌이 많이 발생할 경우 검색 성능이 저하될 수 있지만

키를 고르게 분포시킨다면 링크드 리스트의 길이가 평균적으로 짧을 것이므로 검색 성능에 큰 영향을 미치지 않는다.

### 오픈 주소법

개방 주소법은 특정 버킷에서 충돌이 발생하면, 비어있는 버킷을 찾아 항목을 저장한다.

해시 테이블에서 비어있는 공간을 찾는 것을 조사(probing)라고 한다.

- 선형 탐사(Linear Probing)
- 제곱 탐사(Quadratic Probing)
- 이중 해싱(Double Hashing)

등의 방식을 통해 빈 버킷을 찾아 데이터를 저장하고, 값을 찾을 때도 동일한 방식으로 위치를 찾는다.

## 참조

- https://preamtree.tistory.com/20
- https://twinparadox.tistory.com/518
- https://namu.wiki/w/%ED%95%B4%EC%8B%9C

## 간단 구현 예제(체이닝)

```javascript
class Node {
  constructor(val) {
    this.data = val;
    this.next = null;
  }
}

class LinkedList {
  constructor(...args) {
    this.head = null;
    args.forEach((data) => {
      this.append(data);
    });
  }
  append(data) {
    const node = new Node(data);
    if (!this.head) {
      this.head = node;
      return;
    }
    let cur = this.head;
    while (cur.next) {
      cur = cur.next;
    }
    cur.next = node;
  }
}

class HashTable {
  constructor(size) {
    this.size = size;
    this.bucket = new Array(size);
  }

  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) {
      total += key.charCodeAt(i);
    }
    return total % this.size;
  }

  set(key, value) {
    const index = this.hash(key);
    const data = [key, value];
    if (!this.bucket[index]) {
      this.bucket[index] = new LinkedList();
    }
    let head = this.bucket[index].head;
    while (head) {
      if (head.data[0] === key) {
        head.data[1] = value;
        return;
      }
      head = head.next;
    }
    this.bucket[index].append(data);
  }
  get(key) {
    const index = this.hash(key);
    let head = this.bucket[index].head;
    while (head.data[0] !== key) {
      if (!head.next) {
        throw new Error("invalid");
      }
      head = head.next;
    }
    return head.data[1];
  }
}

const table = new HashTable(50);
table.set("test", 50);
table.set("b", 400);
console.log(table);
console.log(table.get("b"));
table.set("b", 300);
console.log(table.get("b"));
```
