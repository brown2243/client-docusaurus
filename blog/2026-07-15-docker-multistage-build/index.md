---
slug: docker-multistage-build-optimization
title: Docker 멀티 스테이지 빌드로 Next.js & Spring Boot 이미지 용량 극한까지 줄이기
authors: [brown]
tags: [Docker, DevOps, Nextjs, SpringBoot, Optimization]
Date: 2026-07-15 16:00
---

# Docker 멀티 스테이지 빌드로 Next.js & Spring Boot 이미지 용량 극한까지 줄이기

<br />

Docker 빌드 후 생성된 이미지 용량을 확인하고 눈을 의심했다. **Next.js 컨테이너 이미지가 무려 1.8GB, Spring Boot 이미지가 800MB**를 넘어가고 있었다!
배포할 때마다 CI/CD 파이프라인에서 이미지를 넘기느라 시간이 한 세월 걸렸다. (흑흑...)

**Docker Multi-stage Build(멀티 스테이지 빌드)** 기술과 `distroless`/`alpine` 이미지를 적용하여 이미지 용량을 각각 **120MB, 160MB로 80% 이상 감량**시킨 실전 Dockerfile 템플릿을 공유한다.

<!-- truncate -->

### 1. 멀티 스테이지 빌드(Multi-stage Build)의 핵심 개념

단일 `Dockerfile` 안에서 여러 개의 `FROM` 절을 사용하여, **[빌드 단계(Build Stage)]**와 **[실행 단계(Runner Stage)]**를 완벽히 분리하는 기법이다.

```
[Stage 1: Builder]
node:18 / maven:3.8 (용량 1GB+)
  ├── 소스코드 복사
  ├── npm install / mvn package (npm node_modules, maven repo 다운로드)
  └── artifact (dist / .next / app.jar) 생성!

         ↓ (오직 final artifact만 복사!)

[Stage 2: Runner]
node:18-alpine / gcr.io/distroless/java17 (용량 50MB~)
  └── 최소한의 런타임 파일만 가지고 컨테이너 실행!
```

---

### 2. Next.js App Router용 최적화 Dockerfile

Next.js 13/14는 `next.config.js`에 `output: 'standalone'` 옵션을 주면 **필요한 최소 노드 모듈과 런타임 파일만 정밀하게 추려내어 `.next/standalone` 폴더를 생성**해준다.

```javascript
// next.config.js
module.exports = {
  output: 'standalone',
};
```

#### Next.js optimized Dockerfile

```dockerfile
# 1. Base 스테이지
FROM node:20-alpine AS base

# 2. Dependencies 스테이지
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 3. Builder 스테이지
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 4. Runner 스테이지 (최종 실행 이미지)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# non-root 사용자 생성 (보안 강화)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

---

### 3. Spring Boot layered jar & Distroless 최적화 Dockerfile

Spring Boot 2.3+부터 지원하는 **Layered JAR** 기능은 의존성 라이브러리(lib)와 자주 바뀌는 애플리케이션 클래스를 레이어로 분리해 Docker 캐싱 효율을 극대화해준다.

여기에 OS 셸(shell)조차 제거된 최고 수준의 보안 이미지인 Google **Distroless**를 적용했다.

#### Spring Boot optimized Dockerfile

```dockerfile
# 1. Builder 스테이지
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /builder
COPY gradle gradle
COPY gradlew build.gradle settings.gradle ./
COPY src src
RUN ./gradlew bootJar --no-daemon

# Layer 추출
RUN java -Djarmode=layertools -jar build/libs/*.jar extract

# 2. Runner 스테이지 (Distroless 사용)
FROM gcr.io/distroless/java17-debian12 AS runner
WORKDIR /app

# 레이어별로 분리 복사 (캐시 효율성 극대화)
COPY --from=builder /builder/dependencies/ ./
COPY --from=builder /builder/spring-boot-loader/ ./
COPY --from=builder /builder/snapshot-dependencies/ ./
COPY --from=builder /builder/application/ ./

EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
```

---

### 4. 경악할 만한 이미지 감량 결과 비교

| 애플리케이션 | 기본 Dockerfile 이미지 크기 | 멀티 스테이지 최적화 후 이미지 크기 | 감량률 |
| --- | --- | --- | --- |
| **Next.js App** | **1.85 GB** | **124 MB** | **`↓ 93.3%`** |
| **Spring Boot App** | **840 MB** | **165 MB** | **`↓ 80.3%`** |

---

### 마무리 / Outro

1.8GB에 달하던 거대 컨테이너 이미지가 100MB 대로 줄어들면서 GitHub Actions 배포 속도가 기존 5분에서 **45초**로 단축되었다!

보안성 향상(non-root user, shell 부재)은 덤이다. Dockerfile 다이어트는 백엔드/프론트엔드 불문하고 필수 과제다! 한잔해🥂!
