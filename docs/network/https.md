---
sidebar_position: 3
slug: /network/https
description: https-ssl-tls-handshake-security
---

# HTTPS와 SSL/TLS 동작 원리

HTTPS(HTTP Secure)는 기존 HTTP 프로토콜에 **SSL/TLS 암호화 계층**을 추가하여 클라이언트와 서버 간 통신을 보안 처리하는 프로토콜이다.

기본 HTTP의 평문 전송으로 인한 도청(Eavesdropping), 위변조(Tampering), 위장(Spoofing) 위험을 방지한다.

---

## 1. 대칭키 vs 비대칭키 암호화

HTTPS는 효율성과 보안성을 모두 챙기기 위해 **대칭키와 비대칭키(공개키) 암호화를 혼합**하여 사용한다.

- **대칭키 (Symmetric Key)**: 암호화와 복호화에 동일한 키 사용. 속도가 빠르지만 키 전달 과정에서 유출 위험 존재. (예: AES)
- **비대칭키 (Asymmetric Key / Public Key)**: 공개키(Public Key)로 암호화하고 비밀키(Private Key)로 복호화. 안전하지만 연산 비용이 큼. (예: RSA, ECC)

> **HTTPS의 전략**: 연산 비용이 큰 비대칭키로 대칭키(Session Key)를 안전하게 교환한 후, 실제 세션 데이터 전송은 속도가 빠른 대칭키로 암호화한다.

---

## 2. SSL/TLS Handshake 매커니즘 (TLS 1.2 기준)

클라이언트와 서버가 암호화 통신을 시작하기 전 수행하는 협상 과정이다.

```text
Client                                  Server
  |                                       |
  |------ 1. ClientHello ---------------->| (지원 가능한 Cipher Suite, Random Byte)
  |<----- 2. ServerHello -----------------| (선택된 Cipher Suite, Random Byte)
  |<----- 3. Certificate -----------------| (CA 서명 인증서, 공개키 포함)
  |                                       |
  | [인증서 검증 & Pre-Master Secret 생성]  |
  |------ 4. Client Key Exchange -------->| (서버 공개키로 암호화한 Pre-Master Secret)
  |                                       | [비밀키로 Pre-Master Secret 복호화]
  | [대칭키 (Master Secret / Session Key) 생성]
  |                                       |
  |------ 5. Finished (Encrypted) ------->|
  |<----- 6. Finished (Encrypted) --------|
  |                                       |
  |<==== [HTTPS 암호화 세션 데이터 통신] ====>|
```

---

## 3. CA (Certificate Authority)와 디지털 인증서 검증

서버가 전달한 인증서가 진짜인지 확인하기 위해 **체인 오브 트러스트(Chain of Trust)** 구조를 사용한다.

1. OS나 브라우저에는 신뢰할 수 있는 **최상위 인증 기관(Root CA)**의 공개키가 미리 설치되어 있다.
2. 서버의 인증서는 상위 CA의 비밀키로 암호화된 디지털 서명이 들어있다.
3. 클라이언트는 상위 CA의 공개키로 서명을 복호화하여 인증서의 **위변조 여부 및 도메인 일치 여부**를 검증한다.

---

## 4. HTTPS 관련 주요 기술 & 보완 요소

### SNI (Server Name Indication)
단일 IP 주소에서 여러 SSL 인증서(가상 호스팅)를 사용할 수 있도록 TLS 핸드셰이크 시작 시 클라이언트가 요청 도메인명을 전송하는 확장 기술.

### HSTS (HTTP Strict Transport Security)
브라우저가 해당 사이트에 접근할 때 강제로 `https://` 전송만 사용하도록 지시하는 보안 헤더.

```nginx
# Nginx HSTS 헤더 설정 예시
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## 참조

- https://developer.mozilla.org/ko/docs/Glossary/HTTPS
- https://cloudflare.com/learning/ssl/what-is-https/
