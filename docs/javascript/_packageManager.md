---
sidebar_position: 1
slug: /javascript/package-manager
description: npm-yarn-pnpm-package-manager-comparison
---

# Package Manager (npm, yarn, pnpm)

자바스크립트 생태계의 패키지 매جر는 외부 라이브러리(의존성)의 설치, 버전 관리 및 스크립트 실행을 담당한다.
`npm`, `yarn (v1 Classic / Berry)`, `pnpm`의 동작 원리와 `node_modules` 구조적 차이를 정리한다.

## 1. node_modules의 구조적 진화

### 1) 중첩 구조 (Nested Structure - npm v1/v2)
초기 npm은 의존성의 의존성을 각각의 `node_modules` 하위에 중첩 설치했다.

- **장점**: 의존성 충돌 없음
- **단점**: 용량 폭발(Disk Space Waste), 길어진 파일 경로로 인한 OS 한계(Windows MAX_PATH issue)

### 2) 평탄화 구조 (Flat Structure - npm v3+ / Yarn Classic)
중첩 문제를 해결하기 위해 중복 패키지를 루트 `node_modules`로 올려서 설치(Hoisting)한다.

- **문제점 (유령 의존성 - Phantom Dependency)**: `package.json`에 명시하지 않은 의존성 라이브러리도 호이스팅되어 코드에서 `import` 가능한 보안/재현성 문제 발생.

### 3) 콘텐츠 주소 지정형 저장소 (Content-Addressable Store - pnpm)
`pnpm`은 글로벌 저장소(`~/.local/share/pnpm/store`)에 실제 패키지를 1개만 저장하고, 각 프로젝트의 `node_modules`에는 **하드 링크(Hard Link)**와 **심볼릭 링크(Symlink)**로 연결한다.

- **유령 의존성 방지**: 실제 선언된 패키지만 심볼릭 링크로 노출.
- **디스크 용량 및 설치 속도 획기적 단축**.

---

## 2. 패키지 매니저 비교

| 구분 | npm | Yarn Classic (v1) | Yarn Berry (v2+) | pnpm |
| --- | --- | --- | --- | --- |
| **node_modules 구조** | 평탄화 (Hoisted) | 평탄화 (Hoisted) | Plug'n'Play (PnP / 옵션) | 심볼릭 링크 구조 |
| **유령 의존성** | 발생 위험 있음 | 발생 위험 있음 | 완전 차단 (PnP 사용 시) | 완전 차단 |
| **설치 속도** | 보통 | 빠름 | 매우 빠름 | 가장 빠름 |
| **디스크 효율** | 중복 저장 | 중복 저장 | PnP 캐시 활용 | 글로벌 하드링크 공유 |

---

## 3. Lockfile의 중요성 (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`)

`package.json`에 선언된 버전(`^1.2.0` 등)은 시점에 따라 다른 패키지가 설치될 수 있다.
Lockfile은 정확한 설치 시점의 **트리 구조, 버전에 대한 해시(Integrity)**를 기록하여 팀원 간 및 CI/CD 환경에서 100% 동일한 의존성을 보장한다.

> **주의**: 팀 내에서 혼용하지 않고 1개의 패키지 매니저와 Lockfile로 통일해야 의존성 꼬임(Dependency Hell)을 방지할 수 있다.

## 참조

- https://pnpm.io/motivation
- https://yarnpkg.com/features/pnp
