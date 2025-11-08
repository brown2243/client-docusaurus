---
sidebar_position: 2
created_date: "2025-11-08"
last_updated: "2025-11-08"
tags: ["spring", "spring boot"]
---

# Spring Boot

- 스프링(Spring Framework)은 기능은 강력했지만, 개발자가 직접 설정해야 할 XML이나 Java 설정이 너무 많고 복잡했다.
- **스프링 부트는 이 문제를 해결하기 위해 등장한 스프링 프레임워크를 빠르고 쉽게 설정할 수 있게 도와주는 툴**

## 관례 우선 설정(Convention over Configuration)

- CoC는 개발자가 내려야할 수 많은 결정들(decisions)을 줄여주어, 단순성(simplicity)을 확보하면서, 유연성(flexibility)을 잃어버리지 않도록 하기 위한 소프트웨어 디자인 패러다임이다.
- **설정 값을 개발자가 다 선택하는 것이 아니라, 대부분의 개발자들이 사용하는 관례를 따라 기본값을 설정하는 것**

## 자동 설정 (Auto-configuration)

- 스프링은 개발자가 **"명령"**한 것만 함 -> 심지어 DispatcherServlet조차 개발자가 직접 등록해 줬어야 했다.
- 스프링 부트의 자동 설정(Auto-configuration)은 개발자가 추가한 라이브러리(의존성)를 보고 스스로 관련 설정을 대부분 완료

### 내부적 동작

이 과정은 SpringApplication.run()이 실행될 때 ApplicationContext가 준비되는 과정에서 일어납니다.

- **1단계: @EnableAutoConfiguration**

- `@SpringBootApplication` 안에 `@EnableAutoConfiguration` 어노테이션으로 시작
- **AutoConfigurationImportSelector**라는 특별한 클래스를 스프링 컨테이너에 로드

- **2단계: AutoConfiguration.imports**

- `AutoConfigurationImportSelector`가 모든 자동 설정 클래스들의 전체 목록 로드

- **3단계: @Conditional 필터링**

- 수백 개의 후보 클래스(@Configuration 파일들)를 **하나씩 검사하며 '필터링'**
- 예: spring.jpa.hibernate.ddl-auto 속성이 설정되어 있을 때 JPA 관련 설정을 활성화합니다.

- **4단계: 빈(Bean) 등록**

## 내장 서버 (Embedded Server)

- Tomcat, Jetty 같은 웹 서버를 내장
- 톰캣을 따로 설치할 필요 없이 jar 파일만 실행 시키면 된다.

## 의존성 관리 (Dependency Management)

- `spring-boot-starter-\*`라는 의존성 묶음 제공
- 예를 들어 spring-boot-starter-web 하나만 추가하면, 웹 개발에 필요한 수많은 라이브러리(Spring MVC, Tomcat, JSON 처리 라이브러리 등)가 검증된 버전으로 한 번에 설치
