# ADR 0001: 블로그 글 생성 스킬 및 페르소나 아키텍처

## 1. Context & Problem Statement
- 사용자가 기존 43편의 블로그 글(Docusaurus 기반) 문체, 구조, 어조를 학습하여 새 주제 입력 시 본인 특유의 문체로 블로그 글을 자동 생성하는 워크플로우를 필요로 함.

## 2. Decision Drivers
- Docusaurus 블로그 포맷(`slug`, `authors: [brown]`, `tags`, `<br />`, `truncate`, admonition 등)과의 100% 호환성.
- LLM 특유의 기계적인 어투 배제 및 사용자의 실제 경험/생각을 자연스럽게 반영하는 진정성 확보.
- Antigravity IDE/CLI 내에서의 간결하고 직관적인 개발 경험.

## 3. Considered Options
- Option 1: 독립형 Node.js CLI 스크립트 + 외부 LLM API
- Option 2: RAG / 벡터 임베딩 기반 검색 생성 파이프라인
- Option 3: Antigravity 워크스페이스 전용 스킬 (`.gemini/skills/write-blog`) + 인터뷰형 Q&A + 통합 페르소나 가이드 (**선택**)

## 4. Decision Outcome
**Selected: Option 3**
1. **아티팩트 형태**: 워크스페이스 전용 커스텀 스킬 (`.gemini/skills/write-blog/`)
2. **페르소나 전략**: 단일 통합 페르소나 스타일 가이드 (`references/style_guide.md`)
3. **상호작용 워크플로우**: 인터뷰형 워크플로우 (주제 접수 -> 2~3개 핵심 질문으로 실제 맥락/경험 수집 -> 초안 작성)
4. **파일 출력 및 저장**: `blog/YYYY-MM-DD-slug/index.md` (또는 `index.mdx`) 경로로 완성본 자동 생성
5. **검증 및 빌드**: Docusaurus 빌드 및 린트 정적 게이트 검증

## 5. Consequences & Trade-offs
- **장점**:
  - 사용자 맞춤형 어조(`~했다`, `~인 것 같다`, `(제발...)`, 위트 있는 표현)의 높은 일관성.
  - 질문-답변을 통해 사용자의 실제 문제 해결 스토리와 주관적 견해가 글에 온전히 녹아듦.
  - 별도 API 키 설정 없이 Antigravity 내부 스킬로 즉시 구동.
- **트레이드오프**:
  - 글 생성 시 1회 질문-답변 인터랙션이 필요함 (완전 1-Shot 대비 진정성/품질 대폭 향상).
