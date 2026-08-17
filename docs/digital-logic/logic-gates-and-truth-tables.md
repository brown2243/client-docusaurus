---
sidebar_position: 1
slug: /digital-logic/logic-gates-and-truth-tables
title: "디지털 논리 게이트, 진리표 및 조합논리회로 (Logic Gates & Combinational Circuits)"
description: "기본 논리 게이트(AND, OR, NOT, NAND, NOR, XOR), 유니버설 게이트, 정규형(SOP/POS), 가산기(Adder), MUX 및 ALU 조합논리회로 설계 완전 분석"
---

# 디지털 논리 게이트, 진리표 및 조합논리회로 (Logic Gates & Combinational Circuits)

<br />

모든 현대 컴퓨터 프로세서(CPU)는 $0$과 $1$의 전압 신호(Low=0V, High=3.3V/5V)를 처리하는 **디지털 논리 회로(Digital Logic Circuits)**의 집합체다.

디지털 시스템은 출력값이 오직 현재 입력값에 의해서만 결정되는 **조합논리회로(Combinational Logic Circuit)**와, 내부 상태(메모리)를 기억하는 **순차논리회로(Sequential Logic Circuit)**로 나뉜다. 이 문서에서는 논리 게이트부터 전가산기(Full Adder), MUX, 그리고 ALU 설계까지 조합논리회로의 전 과정을 다룬다.

---

## 1. 기본 논리 게이트 (Basic Logic Gates)

논리 게이트는 부울 연산을 수행하는 가장 작은 하드웨어 스위칭 소자다.

### 1.1 게이트별 진리표(Truth Table) 및 논리식

| 게이트   | 기호                     | 논리식       | 진리표 ($A, B \\to Y$)                                             | 특징                   |
| -------- | ------------------------ | ------------ | ------------------------------------------------------------------ | ---------------------- |
| **AND**  | $A \\cdot B$             | $Y = A B$    | $(0,0 \\to 0), (0,1 \\to 0), (1,0 \\to 0), (1,1 \\to \\mathbf{1})$ | 모두 1일 때만 1        |
| **OR**   | $A + B$                  | $Y = A + B$  | $(0,0 \\to \\mathbf{0}), (0,1 \\to 1), (1,0 \\to 1), (1,1 \\to 1)$ | 둘 중 하나라도 1이면 1 |
| **NOT**  | $\\bar{A}$               | $Y = A'$     | $(0 \\to \\mathbf{1}), (1 \\to \\mathbf{0})$                       | 반전 (Inverter)        |
| **NAND** | $\\overline{A \\cdot B}$ | $Y = (AB)'$  | $(0,0 \\to 1), (0,1 \\to 1), (1,0 \\to 1), (1,1 \\to \\mathbf{0})$ | AND 연산 후 반전       |
| **NOR**  | $\\overline{A + B}$      | $Y = (A+B)'$ | $(0,0 \\to \\mathbf{1}), (0,1 \\to 0), (1,0 \\to 0), (1,1 \\to 0)$ |

<truncated 4008 bytes>
