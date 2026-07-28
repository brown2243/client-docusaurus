---
slug: custom-mcp-server-development
title: "Custom MCP(Model Context Protocol) Server 개발기: AI 에이전트에 사내 API 날개 달아주기"
authors: [brown]
tags: [AI, MCP, Agent, TypeScript, Integration]
Date: 2026-09-09 14:00
---

# Custom MCP(Model Context Protocol) Server 개발기: AI 에이전트에 사내 API 날개 달아주기

<br />

AI 에이전트(Cursor, Claude Desktop, Antigravity 등)를 활용하다 보면 **"에이전트가 내 사내 데이터베이스나 내부 백엔드 API를 직접 호출해서 상태를 조회하고 명령까지 내려주면 좋겠다"**는 요구사항이 생긴다.
Anthropic이 공개한 오픈 스펙인 **MCP(Model Context Protocol)** 기술을 활용해, AI 에이전트가 사내 백엔드 시스템과 대화형으로 연동되는 **커스텀 MCP 서버**를 직접 개발해보았다.

<!-- truncate -->

### 1. Model Context Protocol (MCP) 아키텍처 이해

MCP는 AI 클라이언트(Cursor, Claude Desktop 등)와 도구/데이터 제공자(MCP Server) 간의 **표준 통신 프로토콜**이다.

```
[MCP Client (AI IDE / Agent)] 
       │
  (JSON-RPC 2.0 via stdio or SSE)
       │
       ▼
[Custom MCP Server (TypeScript / Node.js)]
       ├── Tool 1: `search_db_users` (DB 유저 검색)
       ├── Tool 2: `trigger_deployment` (CI/CD 배포 스크립트 실행)
       └── Resource: `internal://logs/latest`
```

---

### 2. TypeScript SDK 기반 Custom MCP Server 구현

Node.js 환경에서 `@modelcontextprotocol/sdk`를 사용하여 사내 API 조회가 가능한 MCP 서버를 구현한 전체 코드다.

```typescript
// src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// MCP 서버 인스턴스 생성
const server = new Server(
  {
    name: 'internal-dev-tools-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. 제공할 Tool 목록 정의
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_user_info',
        description: '사용자 ID를 기반으로 사내 DB에서 유저 프로필 정보를 조회합니다.',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: '조회할 사용자 ID' },
          },
          required: ['userId'],
        },
      },
    ],
  };
});

// 2. Tool 실행 핸들링
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'get_user_info') {
    const userId = String(request.params.arguments?.userId);

    // 사내 내부 API / DB 호출 수행
    const userInfo = {
      userId,
      name: '브라운',
      role: 'Fullstack Dev',
      status: 'Active',
      createdAt: '2026-01-15',
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(userInfo, null, 2),
        },
      ],
    };
  }

  throw new Error(`알 수 없는 Tool: ${request.params.name}`);
});

// 3. Stdio 기반 서버 실행
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 Custom MCP Server가 성공적으로 실행되었습니다.');
}

main().catch(console.error);
```

---

### 3. Cursor / Claude Desktop에 커스텀 MCP 서버 등록

`claude_desktop_config.json` 또는 Cursor MCP 설정 메뉴에 방금 만든 서버를 추가한다.

```json
{
  "mcpServers": {
    "internal-tools": {
      "command": "node",
      "args": ["/Users/brown/dev/internal-mcp/dist/index.js"]
    }
  }
}
```

등록 후 AI에 **"유저 ID brown의 사내 프로필 정보를 조회해 줘"**라고 명령하면, AI가 자동으로 커스텀 MCP 서버의 `get_user_info` 도구를 호출하여 결과값을 렌더링해준다!

---

### 마무리 / Outro

MCP 프로토콜 덕분에 AI 에이전트가 단순히 코드를 생성하는 차원을 넘어, **실제 내 시스템을 관제하고 운영 타스크까지 대행하는 진정한 슈퍼 에이전트**로 진화하는 계기가 되었다.

나만의 MCP 서버 만들기 대성공! 한잔해🥂!
