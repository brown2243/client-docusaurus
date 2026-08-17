---
name: write-blog
description: >-
  Use when drafting or writing a new Docusaurus blog post in author brown's persona. Triggers: /write-blog, "write blog", "블로그 글 작성", "블로그 글 써줘".
---

# Write Blog (Brown Persona)

> References: [persona_style_guide.md](references/persona_style_guide.md) · [templates.md](references/templates.md)

## Execution Workflow

1. **Context Interview (1-Shot Gate)**: If prompt lacks context, ask 2~3 questions (Motivation -> Obstacle/Gotcha -> Outro/Learnings) via `ask_question`.
2. **Persona Synthesis**: Apply voice rules (`~했다`, `~인 것 같다`, `~일 것이다`, `~더라`), identity (`본인`), reactions (`(제발...)`, `한잔해🥂`, `따란🔥🔥🔥`), and 5-stage narrative arc.
3. **Format & Scaffold**: Insert Docusaurus frontmatter (`slug`, `authors: [brown]`, `tags`, `startDate`/`endDate`), `# Title` + `<br />`, and `{/* truncate */}` below intro.
4. **Output Gate**: Write post to `blog/YYYY-MM-DD-<slug>/index.mdx` (or `index.md`) and verify checklist.
