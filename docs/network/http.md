---
sidebar_position: 2
slug: /network/http
description: http-protocol-evolution-http1-http2-http3
---

# HTTP 프로토콜 및 진화 (HTTP/1.1 vs HTTP/2 vs HTTP/3)

HTTP(HyperText Transfer Protocol)는 웹 환경에서 클라이언트와 서버 간 데이터를 주고받기 위한 애플리케이션 계층(Application Layer) 통신 프로토콜이다.

웹 서비스의 규모가 확장됨에 따라 속도, 효율성, 안정성을 높이기 위해 HTTP 버전이 진화해온 과정을 정리한다.

---

## 1. HTTP/1.1

가장 오랫동안 사용된 표준 프로토콜로, 기본적으로 **TCP 3-way Handshake** 후 커넥션을 형성하여 데이터를 전송한다.

### 주요 특징
- **Keep-Alive**: 커넥션 재사용 옵션을 통해 지속적 연결(Persistent Connection) 지원.
- **Pipelining**: 하나의 커넥션에서 응답을 기다리지 않고 연속적으로 요청을 보내는 기능 (실무에서는 구현 난이도로 인해 비활성화가 일반적).

### 한계점
- **HOLB (Head-of-Line Blocking)**: 하나의 커넥션에서 앞선 요청의 처리가 늦어지면 뒤따르는 모든 요청이 대기 상태에 빠짐.
- **헤더 중복(Header Overhead)**: 매 요청마다 무거운 쿠키, User-Agent 등의 HTTP 헤더가 중복 전송됨.

---

## 2. HTTP/2

Google의 SPDY 프로토콜을 기반으로 2015년에 표준화된 프로토콜이다.

### 주요 개선점
1. **바이너리 프레이밍 계층 (Binary Framing Layer)**: 텍스트 기반이 아닌 0과 1의 바이너리 프레임 단위로 메시지를 파싱하여 속도 향상.
2. **멀티플렉싱 (Multiplexing)**: 단일 TCP 커넥션 상에서 여러 개의 독립적인 스트림(Stream)을 인터리빙(Interleaving) 방식으로 동시에 주고받음 -> **HTTP 계층의 HOLB 완전 해결**.
3. **HPACK 헤더 압축**: 허프만 코딩(Huffman Coding)과 정적/동적 테이블을 활용하여 헤더 중복 크기를 획기적으로 줄임.
4. **Server Push**: 클라이언트가 요청하지 않아도 필요한 리소스(CSS, JS 등)를 서버가 사전에 전송.

---

## 3. HTTP/3 (QUIC)

TCP 고유의 한계를 극복하기 위해 **UDP 기반의 QUIC 프로토콜** 위에 구축된 최신 HTTP 버전이다.

### 등장 배경
HTTP/2에서 HTTP 계층의 HOLB는 해결되었으나, 하위 **TCP 계층의 패킷 손실 발생 시 TCP 자체 재전송 메커니즘으로 인해 전체 스트림이 대기**하는 TCP HOLB 문제가 남아있었다.

### 주요 특징
- **UDP 기반 전송 (QUIC Protocol)**: TCP의 커넥션 맺기 오버헤드(Handshake) 제거 (1RTT 또는 0RTT 커넥션 수립).
- **독립적 스트림 (Transport-level No HOLB)**: 특정 패킷이 손실되어도 다른 독립 스트림에는 영향을 주지 않음.
- **Connection ID 기반 연결**: IP 주소가 바뀌어도(Wi-Fi <-> LTE) 커넥션을 끊지 않고 재연결 없이 지속 전송 가능.

---

## 4. HTTP 버전별 비교 요약

| 구분 | HTTP/1.1 | HTTP/2 | HTTP/3 |
| --- | --- | --- | --- |
| **전송 계층** | TCP | TCP | UDP (QUIC) |
| **데이터 형식** | 텍스트 (Text) | 바이너리 (Binary) | 바이너리 (Binary) |
| **다중화 (Multiplexing)** | 미지원 (파이프라이닝 제한적) | 지원 | 지원 |
| **HOLB 해결 여부** | 미해결 | HTTP 계층 해결 (TCP 계층 존재) | 완전 해결 (전송 계층까지) |
| **핸드셰이크 속도** | 1~2 RTT | 1~2 RTT (TLS 포함) | 0~1 RTT |

## 참조

- https://developer.mozilla.org/ko/docs/Web/HTTP/Overview
- https://cloud.google.com/blog/products/networking/http3-is-fast-and-reliable
