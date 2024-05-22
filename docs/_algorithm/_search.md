---
sidebar_position: 15
description: about search.
---

# search

## 선형 검색 (Linear Search)

선형 검색은 데이터 구조의 첫 번째 요소부터 시작하여 순차적으로 검색을 진행하는 알고리즘입니다.
배열이나 연결 리스트와 같은 선형 데이터 구조에 적합합니다.
시간 복잡도는 O(n)으로, 데이터의 크기에 비례하여 검색 시간이 증가합니다.
구현이 간단하지만 대량의 데이터에 대해서는 비효율적입니다.
최악의 경우 모든 요소를 검사해야 할 수 있습니다.

## 이진 검색 (Binary Search)

이진 검색은 정렬된 데이터 구조에서 중간 위치를 기준으로 검색 범위를 반으로 줄여가며 검색을 진행하는 알고리즘입니다.
정렬된 배열이나 이진 검색 트리와 같은 데이터 구조에 적합합니다.
시간 복잡도는 O(log n)으로, 데이터의 크기가 커질수록 검색 시간이 로그 스케일로 증가합니다.
검색 범위를 반으로 줄여가면서 검색하기 때문에 선형 검색보다 효율적입니다.
데이터가 정렬되어 있어야 하므로 데이터의 삽입이나 삭제 시 추가 작업이 필요할 수 있습니다.

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  return -1;
  return left;
}
const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const target = 7;

const index = binarySearch(arr, target);
if (index !== -1) {
  console.log(`${target}은(는) 인덱스 ${index}에 있습니다.`);
} else {
  console.log(`${target}은(는) 배열에 없습니다.`);
}
```

## 해시 검색 (Hash Search)

해시 검색은 해시 함수를 사용하여 데이터를 해시 테이블에 저장하고 검색하는 알고리즘입니다.
해시 함수는 데이터를 고정된 크기의 해시 값으로 변환합니다.
해시 테이블은 해시 값을 인덱스로 사용하여 데이터를 저장하고 검색합니다.
시간 복잡도는 평균적으로 O(1)로, 데이터의 크기와 관계없이 일정한 시간 내에 검색이 가능합니다.
해시 충돌이 발생할 경우 별도의 해결 방법(체이닝, 개방 주소법 등)이 필요합니다.

## 트리 검색 (Tree Search)

트리 검색은 트리 구조를 활용하여 데이터를 저장하고 검색하는 알고리즘입니다.
이진 검색 트리(BST), AVL 트리, 레드-블랙 트리 등의 자료구조를 사용합니다.
트리의 각 노드는 키(key)와 자식 노드에 대한 포인터를 가지고 있습니다.
시간 복잡도는 평균적으로 O(log n)이지만, 트리의 균형이 맞지 않을 경우 최악의 경우 O(n)이 될 수 있습니다.
트리의 균형을 유지하기 위해 자가 균형 이진 검색 트리(Self-balancing BST)를 사용하기도 합니다.

https://bba-dda.tistory.com/21
