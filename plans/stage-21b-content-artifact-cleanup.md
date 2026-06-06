# Stage 21B — Pre-Beta Content Artifact Cleanup (Plan)

Follow-on to Stage 21A (Public Beta Launch Readiness audit). Goal: remove visible
pre-beta content artifacts, stop sample scaffolds from being publicly generated,
and harden the NotebookLM import normalizer — without inventing lore or citations
and without removing valid `剑来<number>` references.

## Audit findings (read-only investigation, already done)

### A. Reference artifacts
- Repo-wide search for `剑来X`, `Volume X`, `[Volume Title]`, `[Chapter Number]`,
  `[specific claim]` across `content/**/*.md` returned **0 results**.
- Valid numbered citations (`剑来1`, `剑来2`, `剑来25`, `剑来33`, `剑来47`, …) are
  correctly placed under `## References` with consistent bullets. **Preserve all.**
- Conclusion: no malformed reference artifacts exist. No reference rewrites needed.

### B. Stray code fences (the real artifacts)
Exactly two files end with an accidental trailing ` ``` ` left over from NotebookLM
output being pasted inside a fenced block:
- `content/characters/ruan-xiu.md` — trailing ` ``` ` on the last line, immediately
  after the final `## References` bullet (line ~116).
- `content/characters/yao-laotou.md` — trailing ` ``` ` on the last line, after the
  final `## References` bullet (line ~84).
No content file legitimately contains code fences, so both are safe to remove.

### C. Sample pages leaking into public generation
11 scaffold files exist: `content/<section>/sample.md` for `artifacts`,
`cultivation`, `glossary`, `swordsmanship`, `factions`, `pantheon`, `rankings`,
`timeline`, `world`, `titles`, `teachings`.

How they leak today:
- Section index pages query `queryCollection('content').where('path','LIKE','/section/%')`
  → sample cards render in section grids.
- The crawler then prerenders each `/section/sample` route (counts toward the 207).
- `app/pages/index.vue` featured card "Haoran Tianxia" links directly to
  `/world/sample` — a visible public link to a scaffold (launch blocker).
- Samples therefore also appear in search and sitemap.

Existing convention: Nuxt Content treats `_`-prefixed files/folders as partials —
`content/_meta/*` and `content/_templates/*` are parsed but **not** returned by
`queryCollection` and **not** generated as routes. `isRoutedPath` already rejects
any path containing `/_`.

Chosen strategy (matches task's preferred option): **rename each
`content/<section>/sample.md` → `content/<section>/_sample.md`** (hide in place).
This removes them from grids, search, sitemap, and generated routes in one move,
while keeping the scaffolds available in their section folder for the editor
workflow. No new content is created; files are only renamed.

### D. Import normalizer structure
- Entry point: `server/api/editor/import-markdown.post.ts`
  - `splitMarkdown()` extracts frontmatter + body.
  - `buildParseResult()` runs taxonomy + field normalizers, validates, emits
    `warnings`/`errors`, detects `## References`.
- Field-level normalizer: `server/utils/importNormalize.ts`
  (`normalizeImportedFields`).
- QA fixtures live in `scripts/editor-qa.mjs` (parse-only, no writes), with prior
  stages (13F, 16A) each adding fixtures + warning assertions.

## Change set (for Code mode)

### 1. Remove stray code fences (`.md`)
- Delete the trailing ` ``` ` line in `content/characters/ruan-xiu.md`.
- Delete the trailing ` ``` ` line in `content/characters/yao-laotou.md`.
- Verify no other content file gains/keeps a fence (re-grep ` ``` ` under `content/`).

### 2. Hide sample scaffolds (`.md` rename + guards)
- Rename all 11 `content/<section>/sample.md` → `content/<section>/_sample.md`.
- Fix homepage link: in `app/pages/index.vue`, change the "Haoran Tianxia" card
  `link: '/world/sample'` → `link: '/world/haoran-heaven'` (real existing entry;
  not invented). Re-grep `app/` and `content/` for any other `/sample` link.
- `server/api/editor/entries.get.ts`: the file-name guard only skips `sample.md`.
  Add a skip for any `_`-prefixed file (e.g. `if (file.name.startsWith('_')) continue`)
  so renamed `_sample.md` never appears in the editor entries list.
- Keep the existing reserved-slug guards (`sample`, `_meta`, `_templates`, `titles`)
  in `server/utils/editor.ts` and `app/pages/admin.vue` as-is; `_`-prefixed slugs are
  already rejected by `resolveEntryPath`, so editor QA's `/characters/sample` → 400
  assertion still holds.

### 3. Harden the NotebookLM import normalizer (`.ts`)
In `server/api/editor/import-markdown.post.ts` (parse path) and/or a new pure
helper `normalizeImportedBody(body)` in `server/utils/importNormalize.ts`:
- **Outer wrapping fence:** before `splitMarkdown`, if the whole pasted markdown is
  wrapped in a fenced block (opening ` ``` ` or ` ```markdown ` on the first line and
  a closing ` ``` ` on the last line), strip both. Warning:
  `"Removed outer Markdown code fence from pasted NotebookLM output."`
- **Trailing accidental fence:** strip a lone trailing ` ``` ` at the end of the body.
  Same/related warning.
- **Literal placeholder `剑来X`:** detect the literal letter `X` form only (regex
  `剑来X` where the char after `剑来` is a literal `X`, never a digit). Warning:
  `"Reference placeholders found; verify before saving."` Do **not** alter valid
  `剑来<number>` citations.
- **Placeholder tokens:** detect `[Volume Title]`, `[Chapter Number]`,
  `[specific claim]` (and `Volume X`). Same placeholder warning. Never auto-fill.
- **Body headings missing `##`:** if a bare line equals a known section name
  (e.g. `References`, `Overview`, `Notes`) but is not prefixed with `##`, warn
  `"Possible unformatted References section detected."` (safe detection only; no
  rewrite).
- **Unbulleted reference lines:** if a `## References` block contains non-empty
  lines that are not `-`/`*` bullets, warn
  `"Possible unformatted References section detected."`
- Rule: warn, never invent or strip valid citations.

### 4. QA fixtures (optional but recommended, `.mjs`)
Add Stage 21B parse-only fixtures to `scripts/editor-qa.mjs` mirroring the existing
13F/16A pattern, asserting the new warnings fire (outer fence removed, placeholders
flagged, unformatted references flagged) and that a valid `剑来25` citation in the
body is preserved untouched.

### 5. Verify
- `npm run editor:qa`
- ```
  $env:NUXT_PUBLIC_MEDIA_BASE_URL="https://media.jianlai.wiki"
  npm run generate
  ```
- Confirm:
  - new route count (expect ≈ 207 − 11 = ~196; the 11 `_sample` routes gone),
  - no `/section/sample` route in `.output/public`,
  - `/admin` not prerendered, `/titles` not generated,
  - no `public/videos` / `public/fonts` staged,
  - all valid `剑来<number>` references still present (re-grep).

## Guardrails
- Do not create new lore entries or invent citations.
- Do not rewrite valid content; only remove fences + rename samples + repoint one link.
- Do not touch `public/videos` or `public/fonts`.
- Keep Nuxt + Nuxt Content, static generation only.

## Deliverable summary template (fill after Code mode runs)
files inspected · files changed · reference artifacts fixed · code fences removed ·
sample handling strategy · normalizer improvements · route count change · QA/generate
results · Stage 21C go/no-go.
