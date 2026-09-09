# Post-shape prompts

Use these as outlines, not copyable prose. Keep only sections supported by the
source material.

## Troubleshooting or repair

1. Situation and why the problem mattered
2. First assumption and the test that challenged it
3. Constraint, diagnosis, and attempts that did not work
4. Resolution—or the reason work stopped—with verification conditions
5. Reader takeaway: compatibility, cost, safety, or remaining limitation

## Technical learning note

1. Scope: question being answered and why it matters
2. Model: terms and relationships required to understand it
3. Walkthrough: representative example or lifecycle
4. Trade-offs, failure cases, or distinction from a nearby concept
5. Concise summary and unresolved topic

## Retrospective or career post

1. Timeframe and current position
2. Events that changed a decision or expectation
3. What worked, what did not, and conditions that shaped both
4. Updated view—not a mandatory lesson for everyone
5. Next intention if one genuinely exists

## Travel or firsthand guide

1. Destination, dates, group, and the reader this is useful for
2. Overall verdict with important caveats
3. Preparation: payment, transport, connectivity, booking, safety, and costs as
   relevant
4. Actual itinerary or incidents that qualify the advice
5. What to do differently next time

## Lightweight frontmatter

```yaml
---
slug: semantic-kebab-slug
title: Specific Korean title
authors: [brown]
tags: [relevant, tags]
startDate: "YYYY-MM-DD"
endDate: "YYYY-MM-DD"
---
```

For MDX posts, add `# <title>`, `<br />`, a short introduction, then
`{/* truncate */}`. Do not import a component before there is a real use for it.
