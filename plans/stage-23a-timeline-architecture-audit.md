# Stage 23A: Timeline Content Architecture Audit

## 1. Current Timeline Schema Status
The `content.config.ts` currently defines the following fields for Timeline Events:
- `date`: `string`
- `era`: `string`
- `eraOrder`: `number`
- `participants`: `array(string)`
- `location`: `string`

In addition, standard base fields are available (`title`, `chinese`, `description`, `image`, `related`, `verificationStatus`, `sourceNotes`, etc.).
The template `content/_templates/timeline-event.md` correctly includes these fields.

## 2. What the Chronicle Rail Needs
Currently, `app/pages/timeline/index.vue` maps entries to the `TimelineChronicleRail` using:
- `title` → Event Title
- `era` (fallback to `category`) → Era Label
- `description` → Event Summary
- `participants` (fallback to `related`) → Character Tags
- `path` → Link to full record
- `image` → Preview Image

**Missing/Misconfigured Elements:**
1. **Chronological Sorting Blocked:** `app/pages/timeline/index.vue` currently queries timeline events using `.order('title', 'ASC')`. This is fundamentally incorrect for a timeline, which must be ordered chronologically. We need to query by `.order('eraOrder', 'ASC')` or a dedicated chronological index field.
2. **Era Grouping:** The rail currently flattens all events. To support true era grouping, we need to ensure `era` is consistently populated, and `eraOrder` is strictly maintained to sequence events within and across eras.

## 3. Recommended Timeline Frontmatter Fields
To fulfill the NotebookLM contract and ensure UI compatibility, NotebookLM must emit:
- `title`: Short, evocative English name of the event (e.g., "Battle of Dragon Springs").
- `chinese`: Chinese name of the event.
- `description`: A 1-2 sentence compelling summary for the rail preview.
- `era`: The major epoch or arc (e.g., "Lizhu Grotto Arc", "Great Wall Era").
- `eraOrder`: A global integer (e.g., 10, 20, 30) ensuring correct chronological sorting across the entire wiki.
- `participants`: An array of character names (e.g., `["Chen Ping'an", "Ning Yao"]`).
- `location`: The primary setting of the event.
- `verificationStatus`: `verified` or `to-be-verified`.
- `sourceNotes`: Citation of the chapters/volumes.

## 4. Importer & Editor Compatibility
The current Nuxt Content schema (`content.config.ts`) and the Editor API (`import-markdown.post.ts`) are **fully compatible** with this structure.
- `participants` is `z.array(z.string())`, which natively handles NotebookLM's YAML array output.
- `eraOrder` is `z.number()`, which parses correctly.
- No immediate changes are required to the importer scripts.

## 5. Recommended First NotebookLM Timeline Batch
We should start by mapping the foundational **Lizhu Grotto Heaven Arc (骊珠洞天)** to establish the timeline baseline.
**Events to extract:**
1. The shattering of the porcelain / Old Porcelain Maker's death
2. Qi Jingchun's arrival in town
3. Ning Yao's descent into Dragon Springs
4. The alleyway fight with Gu Can's father/relatives
5. The Battle of Dragon Springs (Qi Jingchun's stand)

## 6. Exact NotebookLM Prompt for Stage 23B
```text
You are the Jian Lai (Sword, Come!) Wiki Archival Scribe.
Extract the 5 most critical chronological events from the Lizhu Grotto Heaven Arc (骊珠洞天) and format them as individual markdown files.

For each event, use this EXACT frontmatter structure. Do NOT invent new fields.
---
title: [Event Name in English]
chinese: [Event Name in Chinese]
pinyin: [Pinyin]
section: timeline
category: Event
status: published
importance: major
verificationStatus: to-be-verified
image: ""
banner: ""
description: [One-sentence cinematic summary]
date: "Unknown"
era: "Lizhu Grotto Arc"
eraOrder: [10, 20, 30, etc., incrementing chronologically]
participants:
  - [Character 1]
  - [Character 2]
location: [Location Name]
tags: []
related: []
sourceNotes: "Volume X, Chapter Y"
---

## Summary

[2-3 paragraphs describing the event in detail, its buildup, and its immediate aftermath.]

## Outcome / Consequences

[1 paragraph explaining how this event changed the world state or character trajectories.]

## References

- **[Citation]:** [Details]
```

## 7. Required Code Changes (Pre-Import)
Before Stage 23B imports content, we MUST fix the sorting logic in `app/pages/timeline/index.vue`.
Change:
`.order('title', 'ASC')`
To:
`.order('eraOrder', 'ASC')`

No other codebase modifications are needed.
