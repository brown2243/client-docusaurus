---
sidebar_position: 10
description: about sorting.
---

# Sorting

- 목록 안에 저장된 요소들을 특정한 순서대로 재배치하는 알고리즘
- 안정 정렬(Stable Sort)
  - 동일한 값을 가진 요소의 상대적인 순서를 유지
    - 정렬 전과 후에 동일한 값을 가진 요소들의 순서가 변경되지 않는다는 것
    - 정렬 기준 외에 다른 속성이 있는 데이터를 정렬할 때, 기존의 순서를 유지하고자 하는 경우
  - 버블 정렬, 삽입 정렬, 병합 정렬, 카운팅 정렬등
  - 불안정 정렬(Unstable Sort)은 동일한 값을 가진 요소의 상대적인 순서가 보장되지 않는 정렬 알고리즘(Quick Sort, Heap Sort, Selection Sort)
- 제자리 정렬(In-place Sort): 추가적인 메모리 공간을 사용하지 않고(stack영역의 추가 변수만을 사용) 주어진 배열 내에서 정렬을 수행하는 알고리즘
  - 메모리 공간의 효율성이 중요한 경우에 유용
  - 버블 정렬, 선택 정렬, 삽입 정렬, 퀵 정렬, 힙 정렬
  - 비제자리 정렬은 추가적인 배열이나 자료구조를 사용하여 정렬을 수행(병합 정렬, 카운팅 정렬, 기수 정렬(Radix Sort))

## 버블 정렬(Bubble Sort)

- 인접한 두 요소를 비교하여 순서가 잘못된 경우 교환하는 과정을 반복하여 정렬
- 시간 복잡도: O(n^2)

```javascript
function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

## 선택 정렬(Selection Sort)

- 배열에서 최솟값을 찾아 맨 앞으로 보내는 과정을 반복하여 정렬
- 시간 복잡도: O(n^2)

```javascript
function selectionSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}
```

시간 복잡도: O(n^2)

## 삽입 정렬(Insertion Sort)

- 배열의 모든 요소를 앞에서부터 차례대로 이미 정렬된 배열 부분과 비교하여, 자신의 위치를 찾아 삽입하여 정렬
- 시간 복잡도: O(n^2)

```javascript
function insertionSort(arr) {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}
```

시간 복잡도: O(n^2)

## 병합 정렬(Merge Sort)

- 배열을 절반으로 나누어 각각을 재귀적으로 정렬한 후, 두 개의 정렬된 배열을 합쳐 전체를 정렬
- 시간 복잡도: O(n log n)

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}
```

## 힙 정렬(heap sort)

## 퀵 정렬(Quick Sort)

- 배열에서 피벗(pivot)을 선택하고, 피벗보다 작은 요소들은 왼쪽으로, 큰 요소들은 오른쪽으로 분할하는 과정을 재귀적으로 반복하여 정렬
- 일반적으로 O(n log n), 최악의 경우 O(n^2)

```javascript
function quickSort(arr, low, high) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
```
