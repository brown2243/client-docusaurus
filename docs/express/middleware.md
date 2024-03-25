---
sidebar_position: 2
---

# middleware

`express`의 꽃은 `middleware`라고 볼 수 있다.

- 로직의 분리,모듈화
- 인증, 권한 관리, 로깅, 에러 처리 등의 기능을 구현가능
- 요청 객체(req)와 응답 객체(res)에 접근가능
- 방대한 서드파티 생태계

특정 middleware를 개별 router에만 동작하도록 붙이는 것도 가능하다.

## middleware 분류

https://expressjs.com/en/guide/using-middleware.html

- Application-level middleware
- Router-level middleware
- Error-handling middleware
- Built-in middleware
- Third-party middleware

## middleware 동작 순서

요청 flow는 대략적으로 아래와 같다.

1. client에서 요청(예시로 get)
2. 서버는 요청을 처리하기 위해 등록된 미들웨어 함수들을 순차적으로 실행
   1. middleware1 eq, res, next를 매개변수로 받아 미들웨어 함수 내부에서 필요한 작업을 수행 후 `next()`로 넘김
   2. middleware2 eq, res, next를 매개변수로 받아 미들웨어 함수 내부에서 필요한 작업을 수행 후 `next()`로 넘김
   3. middleware3 eq, res, next를 매개변수로 받아 미들웨어 함수 내부에서 필요한 작업을 수행 후 `next()`로 넘김
3. 경로에 대한 라우트 핸들러 실행

   1. 라우트 핸들러는 req와 res를 매개변수로 받아 필요한 로직을 처리
   2. res 객체를 통해 응답을 전송

4. 요청 처리완료

만약 중간에 에러가 발생한다면, errorMiddleware로 받아서 처리 가능

- **에러 미들웨어는 마지막에 위치해야 함**
- 에러 미들웨어가 마지막에 위치해야 하는 이유는 요청 처리 과정에서 발생한 모든 에러를 캐치하고 처리할 수 있기 때문
- 만약 에러 미들웨어가 중간에 위치하면, 그 아래에 등록된 미들웨어나 라우트 핸들러에서 발생한 에러는 처리되지 않고 넘어갈 수 있음
- 에러 미들웨어는 (err, req, res, next) 순서로 매개변수를 받으며, 첫 번째 매개변수인 err가 에러 객체를 나타냄
- 에러 미들웨어에서 next(err)를 호출하면 다음 에러 미들웨어로 에러를 전파할 수 있음

**미들웨어 함수에서 next()를 호출하지 않으면 요청 처리가 중단되고 응답이 전송되지 않으므로 주의하자.**

## 유용한 middleware

body-parser는 express 4버전 부터 통합.

사용해본것도 있고, 이번에 알게 된 것도 있는데 요지는 익스프레스 생태계에는 다양한 기능의 middleware가 많고 해당 middleware를 조립해 빠르게 완성도를 올릴 수 있는 것이다.

**Don't reinvent the wheel!**

### morgan

https://www.npmjs.com/package/morgan
https://inpa.tistory.com/entry/EXPRESS-%F0%9F%93%9A-morgan-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4

- HTTP 요청 로깅을 위한 미들웨어
- 요청과 응답에 대한 로그를 생성하고 출력
- 다양한 로그 형식(dev, common, combined 등) 지원
- 로그 출력 대상(콘솔, 파일 등)을 설정할 수 있음

### cookie-parser

- 쿠키를 파싱하는 미들웨어
- 요청의 쿠키(string)를 파싱하여 req.cookies 객체에 저장
- 옵션을 통해 쿠키의 secret key, 쿠키 옵션 등을 설정할 수 있음

### cors

- Cross-Origin Resource Sharing(CORS) 지원을 위한 미들웨어
- 교차 출처 자원 공유를 가능케 하여 다른 도메인에서의 요청을 허용
- 옵션을 통해 허용할 출처, 메서드, 헤더 등을 설정할 수 있음
-

### helmet

- 보안 관련 HTTP 헤더를 설정하는 미들웨어
- XSS 보호, Content-Security-Policy, HSTS 등의 보안 헤더 설정
- 옵션을 통해 개별 보안 헤더를 활성화/비활성화할 수 있음

### express-rate-limit

- DDOS 방지

### multer

https://inpa.tistory.com/entry/EXPRESS-%F0%9F%93%9A-multer-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4

- multipart/form-data 형식의 요청 처리를 위한 미들웨어
- 파일 업로드 기능 지원
- 업로드된 파일을 디스크에 저장하거나 메모리에 버퍼링할 수 있음
- 옵션을 통해 파일 크기 제한, 저장 경로, 파일 이름 등을 설정할 수 있음

### passport

- 인증 기능을 제공하는 미들웨어
- 다양한 인증 전략(Local, OAuth, JWT 등) 지원
- 사용자 인증 상태를 세션에 저장하고 관리
- 인증 성공/실패 핸들링, 사용자 정보 접근 등의 기능 제공
