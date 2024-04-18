---
sidebar_position: 10
description: about stack.
---

# Stack

추상 자료형(Abstract Data Type, ADT)이란?
구현하고자 하는 구조에 대해 구현 방법은 명시하지 않고 자료구조의 특성들과 어떤 Operations들이 있는지를 설명하는 자료구조의 한가지 형태. 즉, 일종의 '규칙'들의 나열이라고 쉽게 이해할 수 있다. ADT의 가장 대표적 예로는 스택(Stack)과 큐(Queue)가 있다.

스택(Stack):
LIFO(Last-In-First-Out) 원칙에 따라 데이터를 저장하고 접근하는 자료구조입니다.
데이터의 삽입과 삭제는 스택의 top에서만 이루어집니다.
push 연산을 통해 데이터를 삽입하고, pop 연산을 통해 데이터를 삭제합니다.
함수 호출, 괄호 검사, 후위 표기법 계산 등에 사용됩니다.

큐(Queue):
FIFO(First-In-First-Out) 원칙에 따라 데이터를 저장하고 접근하는 자료구조입니다.
데이터의 삽입은 큐의 rear에서, 삭제는 큐의 front에서 이루어집니다.
enqueue 연산을 통해 데이터를 삽입하고, dequeue 연산을 통해 데이터를 삭제합니다.
버퍼, 우선순위 큐, BFS(Breadth-First Search) 알고리즘 등에 사용됩니다.
덱(Deque):
Double-Ended Queue의 약자로, 양쪽 끝에서 삽입과 삭제가 가능한 자료구조입니다.
스택과 큐의 특성을 모두 가지고 있습니다.
push_front, push_back, pop_front, pop_back 연산을 지원합니다.
슬라이딩 윈도우, 팰린드롬 검사 등에 사용됩니다.
