---
sidebar_position: 1
slug: /express
description: about express.
---

# express

- 가장 유명하고 가장 널리 사용되는 Node.js 웹 애플리케이션 프레임워크
- 자유도 높음(정해진 형식 X)

## 초기 세팅

`npm init -y`, `npm install express`를 설치하면 후, 해당 파일만 만들어도 express 서버 완성이다.

```
// app.js
const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

`typescript`로 세팅하면 좀 더 번거롭다.

1. `npm i -D "@types/express" "typescript" "ts-node" "tsc-alias" "tsconfig-paths"` 모듈 설치
2. `npx tsc --init` `tsconfig` 생성

```
  "main": "dist/app.js",
  "scripts": {
    "dev": "nodemon --watch \"src/**/*.ts\" --exec \"ts-node  -r tsconfig-paths/register --transpile-only src/app.ts\"",
    "build": "tsc && tsc-alias",
    "start": "node dist/app.js"
  },
  "dependencies": {
    "express": "^4.19.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "nodemon": "^3.1.0",
    "typescript": "^5.4.3",
    "ts-node": "^10.9.2",
    "tsc-alias": "^1.8.8",
    "tsconfig-paths": "^4.2.0"
  }
```

`"dev": "nodemon --watch \"src/**/*.ts\" --exec \"ts-node -r tsconfig-paths/register --transpile-only src/app.ts\""` 명령어를 보자

- nodemon은 소스 변경 시, 서버를 자동으로 재시작시켜주는 동작한다.(글로벌로 설치 안해도 됌)
- ts-node는 typescript를 바로 실행 할 수 있게 해준다.
- 본인은 절대경로를 선호 하는데, `tsconfig`에서 `baseUrl`로 절대경로 설정 시, ts-node로 실행하면 경로를 못찾는다.
  - `tsconfig-paths`를 사용(`-r tsconfig-paths/register`)
- 또한 `tsc`로 ts -> js 트랜스파일링 시, js파일에서 경로문제가 발생하는데,(처음 만났을 때, 삽질 했음...)
  - `tsc-alias`를 사용(`"tsc && tsc-alias"`)하면 된다.

## router

위 처럼 세팅이 완료 됐다면, 이미 typescript express로 개발을 진행하는데 문제 없다.
lint, axios, winston, typeorm 뭐든지 붙여서 사용하면 된다.

그래도 mvc로 구조를 잡고가는게 좋으니, 일단 `app`과 `controller`를 분리하자.
app에는 router, middleware를 달고 router에서 http 요청에 관한 로직을 넣는 것이다.

```typescripts
  const app = express();
  const port = process.env.PORT || 8080;

  app.get("/", (req, res) => {
    res.send("Hello, TypeScript Express!");
  });
  app.get("/welcome", (req, res) => {
    res.send("welcome!");
  });
  app.get("/ping", (req, res) => {
    res.json({ ts: Date.now() });
  });
```

```typescripts
// appRouter.ts
export const appRouter = express.Router();

appRouter.get("/welcome", (req: Request, res: Response, next: NextFunction) => {
  res.send("welcome!");
});
appRouter.get("/ping", (req: Request, res: Response, next: NextFunction) => {
  res.json({ ts: Date.now() });
});
appRouter.get("/", (req, res) => {
  res.send("Hello, TypeScript Express!");
});
// app.ts
app.use("/", appRouter);
```

이제 app에서 router를 분리해, app 로직이 비대해 지는 것을 막았다.
**어플리케이션이 복잡해질수록 역활에 따른 분리가 중요하다.**

## Routing

"라우팅(Routing)이란 클라이언트의 요청에 적절한 핸들러 함수로 매핑하고, 해당 함수에서 요청을 처리한 후 응답을 반환하는 것으로 엔드포인트(Endpoint)를 정의하고, HTTP 메서드(GET, POST, PUT, DELETE...)와 URL 패턴에 따라 라우트를 설정하는 것이다.

```typescripts
appRouter.get("/ping", (req: Request, res: Response, next: NextFunction) => {
  res.json({ ts: Date.now() });
});
```

appRouter가 부착된 url + /ping으로 요청이 오면 위의 로직에 따라 timestamp속성을 가진 json이 응답으로 전달된다.

위 화살표 함수로 들어가 있는 handler는 매개변수로 `request`, `response`, `next`라는 3개의 변수를 받는다.

### request

HTTP 요청을 나타내는 객체로 클라이언트에서 서버로 전송된 요청 정보를 담고 있음

```
req.method: 요청의 HTTP 메서드 (예: GET, POST, PUT, DELETE 등)
req.url: 요청의 URL
req.params: 라우트 매개변수 객체
req.query: 쿼리 스트링 매개변수 객체
req.body: 요청 본문 데이터 객체 (미들웨어에 의해 파싱된 데이터)
req.headers: 요청 헤더 객체
req.cookies: 쿠키 데이터 객체
req.ip: 클라이언트의 IP 주소
req.path: 요청 경로
req.protocol: 요청 프로토콜 (예: http, https)
...
```

### response

HTTP 응답을 나타내는 객체로 서버에서 클라이언트로 전송할 응답 정보를 담고 있음

```
res.status(code): 응답의 HTTP 상태 코드를 설정
res.send(data): 응답으로 데이터(문자열, 객체, 배열 등 다양한 형태)를 전송
res.json(data): 응답으로 JSON 형식의 데이터를 전송
res.render(view, data): 뷰 템플릿을 렌더링하여 응답으로 전송
res.redirect(url): 지정된 URL로 리다이렉트
res.set(field, value): 응답 헤더를 설정
res.cookie(name, value, options): 쿠키를 설정
...
```

### next

`next() // pass control to the next handler`

- next()를 호출하면 요청 처리 제어권을 다음 handler로 전달한다.(개별 route가 달린 순서대로)
- error 객체를 담아 호출해 전역 에러핸들러로 에러처리 가능
