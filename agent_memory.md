
## 2026-07-28 [wiki] Writing Persona Document

- Request: Analyze project writing style and create a single persona guide document.
- Resolution: Analyzed blog posts and docs, created WRITING_STYLE_PERSONA.md covering tone, voice, markdown layout, frontmatter, code block conventions, and step-by-step templates.

## 2026-07-28 [wiki] Writing Persona Exhaustive Analysis & Grill-Me Alignment

- Request: Fully analyze all repository posts and refine persona document based on user feedback.
- Resolution: Scanned all 40+ blog posts and docs across 5 categories (dev log, tech deep-dive, retrospective/planning, travel, exam review). Updated WRITING_STYLE_PERSONA.md with 5 distinct templates and validated persona choice via interactive interview.

## 2026-07-28 [etc] Persona Guide Compression & Docs Skeleton Population

- Request: Compress WRITING_STYLE_PERSONA.md for token efficiency and populate all empty/stub documents in /docs using persona writing style and professional technical depth.
- Resolution: Compressed WRITING_STYLE_PERSONA.md into token-dense format. Identified and fully populated 13 stub/empty documents in /docs (this, _packageManager, class, http, https, _v18, _router, lifecycle, helloJpa, springMvc, easy-to-learn-operating-system, _math/intro, type-inference) with high-level technical documentation matching brown's persona.

## 2026-07-28 [wiki] Brown Persona-Based Technical Blog Posts Creation

- Request: Write 11 technical blog posts across 4 main categories based on brown's persona.
- Resolution: Created 11 in-depth, persona-aligned blog posts in /blog covering Frontend Cores, Web Performance & Security, Backend & Infra, and Dev Story & AI. Validated production build with zero errors.

## 2026-07-28 [wiki] Next Roadmap Technical Blog Posts Sequential Execution

- Request: List up next roadmap goals and execute them sequentially.
- Resolution: Written 7 new deep-dive technical blog posts in /blog covering Rust & Wasm, Rust Ownership, Spring WebFlux & R2DBC, Kafka Event-Driven Architecture, LangChain & LlamaIndex RAG, Custom MCP Server Development, and GitHub Actions & ArgoCD GitOps. Production build validated with 0 errors.

## 2026-07-28 [wiki] Computer Science Math & Architecture Docs Restoration and Creation

- Request: Restore math/CS documents lost during rewind and proceed with CPU, Memory, Bus, Cache, ISA, and Pipeline architecture documentation.
- Resolution: Extracted and restored 8 Math/CS documents from transcript logs. Authored 3 new deep-dive Computer Architecture documents in /docs/computer-architecture/ covering CPU/Memory/Bus, Cache Coherence (MESI), and ISA/Pipeline Hazards & Out-of-Order Execution.

## 2026-07-28 [wiki] Computer Architecture Docs Graduate Level Upgrade

- Request: Elevate document depth and rigor to graduate-student level for CPU, Memory, Bus, Cache, ISA, and Pipeline architecture.
- Resolution: Upgraded /docs/computer-architecture/ documents with formal quantitative models (Amdahl's Law, CPU Execution Time, AMAT, Pipeline Speedup & Throughput), DRAM Cell Leakage & BLP Interleaving, MESI/MOESI FSM Matrix, Spectre/Meltdown Side-Channel Attack Mechanics, and Tomasulo Out-of-Order Execution Architecture.

## 2026-07-28 [rule] Output Control Extreme Compression Rule Update

- Request: Update Output Control rule to default to extreme compression / telegram style word listing, switching to standard sentences only when explicitly requested.
- Resolution: Refactored Rule 1 (Output Control) directives. Set default to telegram-style extreme compression (omitting particles/connectives) with conditional fallback to standard sentence structure upon explicit user request.

## 2026-08-17 [feat] 이 블로그를 꽤 오랜 시간 방치했는데, 다시 좀 써볼까해.

- Request: 이 블로그를 꽤 오랜 시간 방치했는데, 다시 좀 써볼까해.
- Resolution: 블로그 재활성화를 위한 현황 분석 및 단계별 작업 리스트업입니다. / 1. SEO & 검색 엔진 최적화 (Google Search Console / Naver / Bing) / A. 긴급 적용 필요 항목 / - **`robots.txt` 파일 생성**: 현재 [static/](vscode://file/Users/brown/dev/client-docusaurus/static) 내 `robots.txt` 부재 -> 검색 크롤러의 `sitemap.xml` 인지 및 인덱싱 효율 저하. / - `static/robots.txt` 추가 필요:

## 2026-08-17 [edit] 번 진행

- Request: 1번 진행
- Resolution: [Build] `npm run build` 실행 중... 완료 시 즉시 결과 확인 및 다음 단계 안내 예정.

## 2026-08-17 [edit] 번 진행

- Request: 1번 진행
- Resolution: [Build] `npm run build` 실행 중... 완료 시 즉시 결과 확인 및 다음 단계 안내 예정. / [Build] `npm run build` 재검증 중... 완료 시 즉시 결과 보고 예정. / [Build] `npm run build` 번들 생성 확인 중... 완료 시 즉시 보고 예정. / SEO & 검색 엔진 설정 적용 완료 보고 / 1. 변경 및 생성 파일

## 2026-08-17 [ops] /commit

- Request: /commit
- Resolution: Git Commit 완료 / `f124a6e` **feat(seo): add robots.txt and configure sitemap metadata** / - [static/robots.txt](vscode://file/Users/brown/dev/client-docusaurus/static/robots.txt) 생성 / - [docusaurus.config.ts](vscode://file/Users/brown/dev/client-docusaurus/docusaurus.config.ts) sitemap, feed, metadata, trailingSlash 설정 / - [src/theme/Navbar/ColorModeToggle/index.tsx](vscode://file/Users/brown/dev/client-docusaurus/src/theme/Navbar/ColorModeToggle/index.tsx) Docusaurus v3 타입 호환 수정

## 2026-08-17 [refactor] @[bgmInjector.js] 리팩토링

- Request: @[bgmInjector.js] 리팩토링
- Resolution: [Edit] [bgmInjector.js](vscode://file/Users/brown/dev/client-docusaurus/bgmInjector.js) 리팩토링 완료 / 1. 주요 개선 사항 / - **Web Audio API 현대화 및 안정화**: / - `AudioContext` autoplay 정책 호환 (`ctx.state === 'suspended'` 시 `ctx.resume()` 처리). / - 마스터 `GainNode` 추가 (기본 볼륨 0.5 설정 및 향후 페이드 제어 확장성 확보).

## 2026-08-17 [feat] /grill-me 내가 작성한 글들을 기반으로 학습해서, 내가 특정 주제를 던졌을 때, 내가 작성한글...

- Request: /grill-me 내가 작성한 글들을 기반으로 학습해서, 내가 특정 주제를 던졌을 때, 내가 작성한글 처럼 글이 나오게 하는게 목표야
- Resolution: 아키텍처 및 페르소나 스킬 구축 완료 / `/grill-me` 인터뷰 결과를 바탕으로 의사결정 기록(ADR) 및 블로그 글 작성 전용 커스텀 스킬 구축을 완료했습니다. / 1. 주요 생성 산출물 / - **ADR 문서**: [`docs/adr/0001-blog-persona-skill.md`](vscode://file//Users/brown/dev/client-docusaurus/docs/adr/0001-blog-persona-skill.md) / - **스킬 정의**: [`.gemini/skills/write-blog/SKILL.md`](vscode://file//Users/brown/dev/client-docusaurus/.gemini/skills/write-blog/SKILL.md)

## 2026-08-17 [feat] /create-skill @[blog] 아래 모든 글을 읽고 하나의 페르소나로 write-blog sk...

- Request: /create-skill @[blog] 아래 모든 글을 읽고 하나의 페르소나로 write-blog skill 에 통합해
- Resolution: [Analysis] 43개 블로그 포스트 전수 분석 서브에이전트 실행 중. 완료 후 페르소나 스타일 가이드 및 스킬 정의에 통합 예정.

## 2026-08-17 [feat] /create-skill @[blog] 아래 모든 글을 읽고 하나의 페르소나로 write-blog sk...

- Request: /create-skill @[blog] 아래 모든 글을 읽고 하나의 페르소나로 write-blog skill 에 통합해
- Resolution: [Analysis] 43개 블로그 포스트 전수 분석 서브에이전트 실행 중. 완료 후 페르소나 스타일 가이드 및 스킬 정의에 통합 예정. / [Analysis] 서브에이전트 블로그 포스트 분석 진행 중...

## 2026-08-17 [feat] /create-skill @[blog] 아래 모든 글을 읽고 하나의 페르소나로 write-blog sk...

- Request: /create-skill @[blog] 아래 모든 글을 읽고 하나의 페르소나로 write-blog skill 에 통합해
- Resolution: [Analysis] 43개 블로그 포스트 전수 분석 서브에이전트 실행 중. 완료 후 페르소나 스타일 가이드 및 스킬 정의에 통합 예정. / [Analysis] 서브에이전트 블로그 포스트 분석 진행 중... / [Analysis] 마크다운 어노테이션 및 어투 패턴 심층 분석 중...

## 2026-08-17 [test] Analyze all 43 blog posts located under `/Users/brown/dev...

- Request: Analyze all 43 blog posts located under `/Users/brown/dev/client-docusaurus/blog/` to construct an exhaustive, unified persona and writing style guide for author `brown`.
- Resolution: Executed tools: grep_search, list_dir, view_file

## 2026-08-17 [feat] /create-skill @[blog] 아래 모든 글을 읽고 하나의 페르소나로 write-blog sk...

- Request: /create-skill @[blog] 아래 모든 글을 읽고 하나의 페르소나로 write-blog skill 에 통합해
- Resolution: [Analysis] 43개 블로그 포스트 전수 분석 서브에이전트 실행 중. 완료 후 페르소나 스타일 가이드 및 스킬 정의에 통합 예정. / [Analysis] 서브에이전트 블로그 포스트 분석 진행 중... / [Analysis] 마크다운 어노테이션 및 어투 패턴 심층 분석 중... / [Analysis] 페르소나 분석 결과 종합 및 요약 중... / [Analysis] 블로그 전수 분석 리포트 생성 중...

## 2026-08-17 [test] Analyze all 43 blog posts located under `/Users/brown/dev...

- Request: Analyze all 43 blog posts located under `/Users/brown/dev/client-docusaurus/blog/` to construct an exhaustive, unified persona and writing style guide for author `brown`.
- Resolution: Exhaustive persona and writing style guide for author `brown` synthesized from all 43 blog posts (2022–2026) and transmitted to the parent agent via `send_message`.

## 2026-08-17 [feat] /create-skill @[blog] 아래 모든 글을 읽고 하나의 페르소나로 write-blog sk...

- Request: /create-skill @[blog] 아래 모든 글을 읽고 하나의 페르소나로 write-blog skill 에 통합해
- Resolution: [Analysis] 43개 블로그 포스트 전수 분석 서브에이전트 실행 중. 완료 후 페르소나 스타일 가이드 및 스킬 정의에 통합 예정. / [Analysis] 서브에이전트 블로그 포스트 분석 진행 중... / [Analysis] 마크다운 어노테이션 및 어투 패턴 심층 분석 중... / [Analysis] 페르소나 분석 결과 종합 및 요약 중... / [Analysis] 블로그 전수 분석 리포트 생성 중...

## 2026-08-17 [ops] @WRITING_STYLE_PERSONA 필요해? 없으면 지워

- Request: 1. @WRITING_STYLE_PERSONA 필요해? 없으면 지워
- Resolution: 작업 완료 보고 / **파일 정리**: `WRITING_STYLE_PERSONA.md` 삭제 완료 (`.gemini/skills/write-blog/references/persona_style_guide.md`에 통합 관리). / **Git 커밋 완료**: / - **Commit**: `feat(skill): implement write-blog skill with unified persona` (`258a92b`) / - **Target Files**:

## 2026-08-17 [feat] /create-skill write-blog skill에 모호성에 대해서 질문하는 로직이 있나?

- Request: /create-skill write-blog skill에 모호성에 대해서 질문하는 로직이 있나?
- Resolution: [write-blog SKILL.md](file:///Users/brown/dev/client-docusaurus/.agents/skills/write-blog/SKILL.md#L13)에 질문 로직 존재. / 로직 구조 / - **위치**: [SKILL.md L13](file:///Users/brown/dev/client-docusaurus/.agents/skills/write-blog/SKILL.md#L13) (`Execution Workflow` 1단계) / - **규칙**: / - **동작 방식**:

## 2026-08-17 [feat] /write-blog @blog/2026-08-17-fe-dev-recap/index.mdx

- Request: /write-blog @blog/2026-08-17-fe-dev-recap/index.mdx
- Resolution: 💬thought / Subagent `verification` has completed and sent back its report: All 4 gates passed. / Now, let's formulate the final response in telegraphic style per user rules: / - Format file edit reports as: `[Edit] <filepath>` / - File links in markdown `[filename](file:///absolute/path)`

## 2026-08-17 [feat] /write-blog @blog/2026-08-17-fe-dev-recap/index.mdx

- Request: /write-blog @blog/2026-08-17-fe-dev-recap/index.mdx
- Resolution: 💬thought / Subagent `verification` has completed and sent back its report: All 4 gates passed. / Now, let's formulate the final response in telegraphic style per user rules: / - Format file edit reports as: `[Edit] <filepath>` / - File links in markdown `[filename](file:///absolute/path)`

## 2026-08-17 [test] Verify the blog post in `/Users/brown/dev/client-docusaur...

- Request: Verify the blog post in `/Users/brown/dev/client-docusaurus/blog/2026-08-17-fe-dev-recap/index.mdx`.
- Resolution: Verification Completed / The blog post at [`/Users/brown/dev/client-docusaurus/blog/2026-08-17-fe-dev-recap/index.mdx`](file:///Users/brown/dev/client-docusaurus/blog/2026-08-17-fe-dev-recap/index.mdx) has been verified. / | Check Category | Status | Details | / | **1. Outline Compliance** | **PASS** | Intro + `{/* truncate */}`, 7 body sections, Outro present | / | **2. Docusaurus Frontmatter** | **PASS** | `slug`, `title`, `authors`, `tags`, `startDate`, `endDate`, `LinkPreview` import, `<b...

## 2026-08-17 [refactor] 개못쓰네. 니가 써놓은거 저장해놔 내가 쓰고나서 비교해서 스킬 개선해야해

- Request: 개못쓰네. 니가 써놓은거 저장해놔 내가 쓰고나서 비교해서 스킬 개선해야해
- Resolution: AI 작성본 백업 완료: [ai_generated_fe_dev_recap.mdx](file:///Users/brown/dev/client-docusaurus/artifacts/ai_generated_fe_dev_recap.mdx) / - 작업 파일 [index.mdx](file:///Users/brown/dev/client-docusaurus/blog/2026-08-17-fe-dev-recap/index.mdx)에서 본인 글 작성 진행. / - 작성 완료 후 두 글을 비교 대조하여 `write-blog` 페르소나/서사 스킬(`SKILL.md` 및 `persona_style_guide.md`)을 리팩토링할 예정.

## 2026-08-17 [etc] mdx 아이프레임 되네, 마크다운도 되나?

- Request: mdx 아이프레임 되네, 마크다운도 되나?
- Resolution: Docusaurus에서 `.md` 파일도 `<iframe>` 지원됨. / 동작 원리 & 주의점 / **Docusaurus 파서**: Docusaurus는 `.md`와 `.mdx` 모두 MDX 파서로 처리하므로 원시 HTML/JSX 태그 파싱 가능. / **JSX 문법 규칙 필수 (닫는 태그/속성)**: / - Self-closing 필수: `<iframe ... />` 또는 `<iframe></iframe>`

## 2026-08-17 [etc] 일반 md도 iframe 되나? 다큐사우러스 아니어도?

- Request: 일반 md도 iframe 되나? 다큐사우러스 아니어도?
- Resolution: 마크다운 사양(CommonMark/GFM)상 Raw HTML은 지원되나, **플랫폼별 보안 필터(Sanitizer)** 에 따라 지원 여부 갈림. / 플랫폼별 지원 현황 / | 플랫폼 / 환경 | `<iframe>` 동작 여부 | 비고 | / | **GitHub (README, Issue)** | ❌ **불가** | XSS 방지 위해 `<iframe>` 태그 자동 제거/필터링 | / | **Obsidian** | ⭕ **가능** | 유튜브, 웹페이지 임베드 정상 렌더링 |

## 2026-08-23 [config] @[docusaurus.config.ts]

- Request: @[docusaurus.config.ts]
- Resolution: [docusaurus.config.ts](vscode://file/Users/brown/dev/client-docusaurus/docusaurus.config.ts) 보안 점검 결과입니다. / 1. 주요 항목별 점검 결과 / | 점검 항목 | 상태 | 설명 | / | **Algolia API Key 노출** (L89) | ⚠️ 주의 (확인 필요) | `apiKey: "9fa8995538ca578305f853bbcd7949a2"`<br>- 프론트엔드 노출용 **Search-Only API Key**(Search 권한만 부여된 키)인 경우 정상.<br>- **Admin / Write Key**가 아닌지 Algolia 대시보드 권한 확인 필요. | / | **Vercel Analytics 디버그 모드** (L167) | 💡 권장 수정 | `debug: true`<br>- 프로덕션 빌드 시 브라우저 콘솔에 이벤트/데이터 로깅 발생.<br>- `debug: process.env.NODE...

## 2026-08-29 [fix] 빌드 에러에 대해서 아래 경고 원인 분석

- Request: 빌드 에러에 대해서 아래 경고 원인 분석
- Resolution: 원인 분석 / Docusaurus 프로덕션 빌드 시 유효하지 않은 내부 링크(Broken Link) 감지로 인한 빌드 실패. / | 항목 | 내용 | / | **발생 위치** | [docs/data-structure/queue.md:L51](file:///Users/brown/dev/client-docusaurus/docs/data-structure/queue.md#L51) | / | **잘못된 링크** | `/studies/data-structure/tree#heap-tree` |

## 2026-08-29 [etc] 다큐 사우러스 v4가 있나?

- Request: 다큐 사우러스 v4가 있나?
- Resolution: **아직 미출시 (개발 진행 중)**. / 현황 / - **현재 최신 안정 버전**: `v3.10.x` (v3 시리즈 마지막 릴리스) / - **경고 배경**: v3.10은 v4 전환 준비 버전으로, v4에서 제거/변경될 옵션(`onBrokenMarkdownLinks` 등)에 대해 사전 deprecation 경고를 출력함. / - **v4 주요 변경 예정**:

## 2026-08-29 [fix] 에러 및 경고 사항 수정

- Request: 에러 및 경고 사항 수정
- Resolution: 빌드 검증 진행 중입니다. 완료 후 결과를 안내하겠습니다. / 빌드가 실행 중입니다. 완료 시 결과를 안내하겠습니다.

## 2026-08-29 [fix] 에러 및 경고 사항 수정

- Request: 에러 및 경고 사항 수정
- Resolution: 빌드 검증 진행 중입니다. 완료 후 결과를 안내하겠습니다. / 빌드가 실행 중입니다. 완료 시 결과를 안내하겠습니다. / 수정 완료 내역 / | 구분 | 파일 | 변경 내용 | / | **Broken Link 에러 해결** | [docs/data-structure/queue.md:L51](file:///Users/brown/dev/client-docusaurus/docs/data-structure/queue.md#L51) | `/studies/...` -> `./tree#heap-tree` 경로 수정 |

## 2026-08-30 [etc] 다큐사우러스 블로그 프론트매터 draft 동작하나?

- Request: 다큐사우러스 블로그 프론트매터 draft 동작하나?
- Resolution: **정상 동작함**. / 환경별 동작 방식 / | 환경 / 명령어 | `draft: true` 동작 | / | **개발 모드 (`npm start`)** | **노출됨** (작성 중 미리보기 지원, `[DRAFT]` 배지 표시) | / | **프로덕션 빌드 (`npm run build`)** | **완전 제외됨** (HTML 미생성, 목록/피드/사이트맵 제외) |

## 2026-08-30 [edit] @[blog/2026-09-05-쓰레기통-수리하는-이야기/index.mdx]

- Request: @[blog/2026-09-05-쓰레기통-수리하는-이야기/index.mdx]
- Resolution: [blog/2026-09-05-쓰레기통-수리하는-이야기/index.mdx](file:///Users/brown/dev/client-docusaurus/blog/2026-09-05-쓰레기통-수리하는-이야기/index.mdx) 작성 완료. / 적용된 페르소나 및 서사 구조 / - **메타데이터**: `slug: repair-townew-trash-can`, `authors: [brown]`, 기간(`2026-08-16` ~ `2026-08-26`) / - **시그니처 표현**: `본인`, `(제발...)`, `~~취소선 혼잣말~~`, `따란🔥🔥🔥`, `한잔해🥂`, `(The Gotcha 😵)` / - **서사 흐름 (5단계)**:
