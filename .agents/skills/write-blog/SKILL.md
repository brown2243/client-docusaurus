---
name: write-blog
description: >-
  Draft or revise a Docusaurus blog post in brown's established Korean voice.
  Use for new technical notes, troubleshooting stories, retrospectives, travel
  guides, and firsthand reviews in this blog; not for generic marketing copy.
---

# Write Blog — brown

Write a useful record, not a polished persona performance. The post should retain
the author's firsthand constraints, judgments, dead ends, and degree of certainty.

Read [persona_style_guide.md](references/persona_style_guide.md) before drafting.
Read [templates.md](references/templates.md) only after selecting a post mode.

## Establish material

- Use user-provided notes, repository material, or verified sources. Do not turn
  assumptions into firsthand experience.
- When context is insufficient, request the minimum missing facts: why the work
  began, what actually happened, and what conclusion or unresolved point remains.
- Preserve useful failures. If a workaround was incomplete, say what it solved
  and what it did not solve.
- Separate observed behavior, a technical explanation, and personal inference.
  Do not use certainty or quantified claims without evidence.

## Pick the shape that fits the material

- **Troubleshooting / making:** trigger → initial model → test and obstacle →
  resolution or stopping point → practical takeaway. Do not fabricate a clean win.
- **Technical learning note:** state scope → explain the mental model → connect
  mechanisms and examples → record the remaining uncertainty or next topic.
- **Retrospective / career story:** use chronology only where it changes the
  conclusion; include decisions, conditions, and revised judgment rather than a
  résumé or motivational slogan.
- **Travel / firsthand guide:** lead with verdict and conditions; give preparation,
  cost, friction, and exceptions readers can use. Avoid presenting one trip as a
  universal fact.
- **Review / casual note:** keep the personal trigger and the specific reason for
  the reaction. A short post is valid when its observation is complete.

## Voice and structure

- Prefer clear Korean over inflated technical prose. Mix concise factual sentences
  with candid spoken reflections. Use `본인` naturally, not mechanically.
- Humour, ellipses, strike-throughs, and reactions should reveal a genuine moment;
  they are seasoning, not mandatory style tokens.
- Define technical terms at the level the intended reader needs. Show the causal
  chain behind a conclusion instead of merely naming a tool or best practice.
- Use headings to aid scanning. Use lists for procedures, comparisons, constraints,
  and checklists; use prose for narrative and judgment.

## Docusaurus delivery

- Create `blog/YYYY-MM-DD-<slug>/index.mdx` by default. Use `index.md` when MDX
  adds no value.
- Include `slug`, `title`, `authors: [brown]`, relevant `tags`, `startDate`, and
  `endDate` in frontmatter. Mark `draft: true` only when requested.
- Put `# <title>`, then `<br />`, then a 1–2 paragraph introduction. Place
  `{/* truncate */}` after that introduction for posts intended for listing pages.
- Import components only when the post uses them. Use `LinkPreview` for a source
  or product link when its preview adds reader value.

## Final check

- Title promises only what the post delivers.
- Intro gives a real reason to continue.
- Technical claims, dates, prices, and policy details have an attributable source
  or an explicit firsthand/uncertain qualifier.
- Steps, links, and code are sufficient to reproduce the useful part.
- Ending states the result, limitation, or next action without forced encouragement.
