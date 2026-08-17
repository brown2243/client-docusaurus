---
sidebar_position: 1
slug: /computer-architecture/cpu-memory-bus-architecture
title: "CPU 미시아키텍처, 암달의 법칙 및 메모리 버스 대역폭 정밀 분석"
description: "폰 노이만 아키텍처 한계(Bottleneck), CPU Execution Time 정량적 모델, Amdahl's Law 한계 정리가 수식 모델, DRAM Cell 전하 누설 물리 및 RAS/CAS 뱅크 인터리빙 버스 대역폭 방정식 분석"
---

# CPU 미시아키텍처, 암달의 법칙 및 메모리 버스 대역폭 정밀 분석

<br />

마이크로프로세서 분석은 단순 기능 분할을 넘어 정량적 성능 방정식(Quantitative Performance Equation), 전력 대비 성능, 메모리 뱅크 수준 인터리빙(Bank-Level Parallelism) 및 온칩 인터커넥트 파이프라이닝의 물리적 한계를 다룬다.

---

## 1. 정량적 성능 모델 (Quantitative CPU Performance Model)

### 1.1 CPU Execution Time 수식 모델

CPU의 프로그램 실행 시간 `T_CPU`는 명령어 수(Instruction Count, $IC$), 명령어당 평균 클록 주기(Cycles Per Instruction, $CPI$), 클록 주기($\tau$) 또는 클록 주파수($f\_clk$)로 정량화된다.

- **CPU 실행 시간**:
  `T_CPU = IC * CPI * τ = (IC * CPI) / f_clk`

- **Global CPI 방정식**:
  `CPI = CPI_ideal + Σ (Rate_i * Penalty_i)`

---

## 2. 암달의 법칙 (Amdahl's Law)

시스템의 특정 구성 소자를 개선할 때 얻는 전체 속도 향상 비율(Speedup, `S_overall`)은 개선된 영역의 병렬 비율($p$)과 해당 영역의 개선 배수($s$)로 결정된다.

- `S_overall = 1 / ((1 - p) + (p / s))`
- `lim_(s -> ∞) S_overall = 1 / (1 - p)`

#### 병렬 처리 한계 해석
$p = 0.95$ (95% 병렬화)인 고성능 컴퓨팅 워크로드라 하더라도, 직렬 연산 구간 $1 - p = 0.05$로 인해 아무리 많은 코어 수($s \to \infty$)를 투입해도 최대 이론적 속도 향상은 20배($1 / 0.05 = 20$)로 제한된다.

---

## 3. 메모리 버스 대역폭과 뱅크 인터리빙

DRAM은 행(Row)과 열(Column)로 구성된 2차원 매트릭스 셀 구조를 가진다.
- **RAS (Row Address Strobe)**: 행 활성화 (Row Active)
- **CAS (Column Address Strobe)**: 열 읽기/쓰기 명령

메모리 컨트롤러는 연속된 주소 접근 시 발생하는 프리차지(Precharge) 지연을 숨기기 위해 주소를 서로 다른 물리 뱅크(Bank)에 분산 매핑하는 **뱅크 인터리빙(Bank Interleaving)** 기법을 적용한다.
