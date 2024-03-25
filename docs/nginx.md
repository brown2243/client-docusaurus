---
sidebar_position: 100
slug: /nginx
description: about nginx.
---

# Nginx

nginx는 Igor Sysoev라는 러시아 개발자가 C10K 문제를 해결하기 위해 개발한 웹 서버

- C10K 문제 - 동시에 10,000개의 연결을 처리하는 문제
- 기존의 Apache 웹서버는 프로세스/스레드 기반의 구조
  - Apache는 http 요청이 올때마다 스레드나 프로세스를 새로 생성, 많은 수의 사용자가 동시 접속을 할 수록 CPU 부하가 높아짐
  - 이는, 동시에 연결된 커넥션이 만 개 이상이 되면 하드웨어 성능과 관계없이 서버가 더 이상의 커넥션을 형성하지 못하는, C10K 문제를 발생
  - 만 개까지 도달하지 않더라도 사용자가 늘어날 때마다 프로세스/스레드가 생성되므로 자원 낭비
- Nginx는 한 개 또는 고정된 프로세스만 생성 후, 비동기 이벤트 기반의 처리방식 구조로 프로세스/스레드 생성보다 더 적은 리소스로 처리가 가능

Nginx는 하나의 Master Process와 다수의 Worker Process로 구성되어 실행

- Master Process: 설정 파일 읽기, 유효성 검사,Worker Process를 관리
- Worker Process: 요청 처리

https://oliveyoung.tech/blog/2023-10-02/c10-problem/

## 주요 기능

- 리버스 프록시: 클라이언트의 요청을 proxy server(nginx)가 받아 내부 서버로 전달하고, 응답을 클라이언트에게 반환

  - 보안 : 외부 사용자는 실제 내부망에 있는 서버의 존재를 모른다.
  - 이를 통해 로드 밸런싱, SSL 종료, 캐싱 등의 기능을 수행

- 로드 밸런싱: nginx는 다양한 로드 밸런싱 알고리즘을 지원하여 트래픽을 여러 백엔드 서버로 분산가능

  - Round-robin, IP hash, Least connections 등의 알고리즘을 사용할 수 있으며, 서버의 상태를 모니터링하여 장애가 발생한 서버를 자동으로 제외

- HTTP 캐싱: nginx는 강력한 캐싱 기능을 제공하여 정적 콘텐츠의 전송 속도를 향상가능

- SSL/TLS 지원, gzip 압축...

<!-- 모듈화된 구조: nginx는 모듈화된 구조로 되어 있어 필요한 기능만 선택적으로 사용할 수 있습니다. 다양한 내장 모듈과 서드파티 모듈을 통해 기능을 확장할 수 있습니다.
경량화된 설정: nginx는 간결하고 직관적인 설정 파일 구조를 가지고 있습니다. 블록 구조를 사용하여 설정을 계층적으로 관리할 수 있으며, 주석을 통해 설정의 의미를 명확히 할 수 있습니다. -->

## nginx.conf 문법 정리

nginx.conf 파일 경로는 brew로 설치 시, `/opt/homebrew/etc/nginx/nginx.conf`로 `brew info nginx`로 확인가능

```nginx

# user user [group] 작업자 프로세스가 어떤 user, group으로 실행되는지에 대한 설정
user nginx;

# worker_processes는 워커 프로세스의 수
# 물리적인 CPU 코어 개수만큼 Worker Process 를 할당하는 것이 가장 이상적이며,
# nginx.conf 에서 auto 를 지정해주면 자동으로 CPU 코어 개수에 알맞게 프로세스를 생성
worker_processes auto;

# error_log 지시어는 에러 로그 파일의 경로와 로그 레벨을 설정
error_log logs/error.log;
# error_log logs/error.log notice;
# error_log logs/error.log info;

# pid 파일의 경로를 지정 - Nginx 마스터 프로세스의 PID가 저장
# nginx 명령어를 사용하여 Nginx를 시작, 중지, 재시작할 때 PID 파일을 참조
pid logs/nginx.pid;

# events 블록에서는 네트워크 연결 관련 설정
# worker_connections는 각 워커 프로세스가 동시에 처리할 수 있는 최대 연결 수
events {
    worker_connections 1024;
}

# http 블록은 여러개를 사용할 수 있지만 관리상의 이슈로 한번만 사용하는 것을 권장한다.
# http, server, location 블록은 계층구조를 가지고 있다.
# http 블록은 이후에 소개할 server, location의 루트 블록이라고 할 수 있고, 여기서 설정된 값을 하위 블록들은 상속한다.
# 그리고 하위의 블록에서 선언된 지시어는 상위의 선언을 무시하고 적용된다.
http {
    # mime.types 파일을 포함하여 MIME 타입 매핑을 설정합니다.
    # default_type은 MIME 타입이 알려지지 않은 파일의 기본 MIME 타입을 설정합니다.
    include mime.types;
    default_type application/octet-stream;

    # log_format은 액세스 로그의 형식을 정의
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
    '$status $body_bytes_sent "$http_referer" '
    '"$http_user_agent" "$http_x_forwarded_for"';

    # access_log는 액세스 로그 파일의 경로와 사용할 로그 형식을 지정합니다. 주석 처리되어 기본 경로와 형식이 사용됩니다.
    access_log logs/access.log main;

    # keepalive_timeout은 클라이언트 연결 유지 시간을 초 단위로 설정합니다.
    keepalive_timeout 65;
    # gzip 압축을 활성화하는 옵션입니다. 주석 처리되어 비활성화되어 있습니다.
    gzip on;

    # nginx와 연결한 WAS 서버를 지정하는데 사용
    # host.docker.internal는 nginx에서 도커 컨테이너에 접근 할 떄 사용
    # 도커 컨테이너에서 포트 호스트에서 접근 할 수 있게 열어놔야함
    upstream backend {
        least_conn;
        server host.docker.internal:3000;
        server host.docker.internal:3001;
        server host.docker.internal:3002;
    }

    # server 블록은 하나의 웹사이트를 선언하는데 사용된다. 가상 호스팅(Virtual Host)의 개념
    server {
        # listen은 서버가 수신할 포트를 지정
        listen 80;
        # server_name은 서버의 도메인 이름을 지정
        server_name localhost;

        # access_log는 해당 server 블록에 대한 액세스 로그 파일의 경로와 로그 형식을 지정
        access_log logs/host.access.log main;

        # location 블록은 특정 URL 경로에 대한 처리를 정의합니다.
        # root는 해당 경로에 대한 파일 시스템 루트 디렉토리를 지정
        # index는 디렉토리 접근 시 기본 인덱스 파일을 지정
        location / {
            # root html;
            # index index.html index.htm;
            # return 308 https://$host$request_uri;
        }
    }

    # HTTPS 서버 설정의 예시입니다.
    server {
        # listen 지시어를 사용하여 443 포트에서 SSL과 함께 수신
        listen 443 ssl;
        # listen 443 ssl http2; # http2
        # http3 https://nginx.org/en/docs/quic.html
        # https://nginxstore.com/blog/nginx/nginx-http-3-%EB%B0%8F-quic%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B8%B0%EC%88%A0-%EC%A7%80%EC%9B%90/


        # server_name은 localhost로 설정됩니다.
        server_name localhost;
        # ssl_certificate SSL 인증서 경로
        ssl_certificate cert.pem;
        # ssl_certificate_key는 개인 키 파일의 경로
        ssl_certificate_key cert.key;

        # ssl_session_cache와 ssl_session_timeout은 SSL 세션 캐시와 세션 만료 시간을 설정합니다.
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout 5m;
        # ssl_ciphers는 사용할 SSL 암호화 알고리즘을 지정합니다.
        ssl_ciphers HIGH:!aNULL:!MD5;
        # ssl_prefer_server_ciphers는 서버 선호 암호화 알고리즘을 사용하도록 설정합니다.
        ssl_prefer_server_ciphers on;

        # HSTS (ngx_http_headers_module is required) (63072000 seconds)
        add_header Strict-Transport-Security "max-age=63072000" always;

        location / {
            root html;
            index index.html index.htm;
        }

        location /api {
            proxy_pass http://backend;
            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
    # servers/ 디렉토리 내의 모든 파일을 포함하도록 설정
    include servers/*;
}
```

- https://icarus8050.tistory.com/57
- https://haon.blog/infra/nginx/improvement/
- https://opentutorials.org/module/384/4526
- https://minimilab.tistory.com/66

## nginx command

- nginx: 웹 서버를 시작
- nginx -s stop: 즉시 중지
- nginx -s quit: 현재 처리 중인 요청이 완료될 때까지 기다린 후 종료
- **nginx -s reload**: **서버를 중지하지 않고 Nginx 설정을 리로드**, 이전 워커 프로세스는 현재 요청 처리를 완료한 후 종료
- nginx -t: 서버를 시작하지 않고 Nginx 설정 파일의 문법을 테스트
- nginx -T: Nginx 설정 파일의 문법을 테스트하고 포함된 모든 파일과 함께 최종 설정을 출력

로컬서버를 퍼블릭 도메인으로 사용할 해야할 때는 `ngork` 사용
