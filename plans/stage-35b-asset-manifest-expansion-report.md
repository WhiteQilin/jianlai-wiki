# Stage 35B-2B — Manifest Expansion Report

**Status:** Complete. 11 entries added. Manifest now covers all live-used purchased ink assets.
**Date:** 2026-06-21
**Before / after:** 52 entries → **63 entries**

---

## 1. Files Verified on Disk (All 11 Confirmed)

| File | Verified |
|---|---|
| `/images/ui/purchased/ink/ink-divider-rough-01.webp` | ✅ |
| `/images/ui/purchased/ink/ink-divider-rough-02.webp` | ✅ |
| `/images/ui/purchased/ink/ink-divider-rough-03.webp` | ✅ |
| `/images/ui/purchased/ink/ink-title-stroke-long-06.webp` | ✅ |
| `/images/ui/purchased/ink/ink-wash-cloud-soft-03.webp` | ✅ |
| `/images/ui/purchased/ink/ink-corner-stain-04.webp` | ✅ |
| `/images/ui/purchased/ink/ink-mountain-smear-01.webp` | ✅ |
| `/images/ui/purchased/ink/ink-divider-thin-02.webp` | ✅ |
| `/images/ui/purchased/ink/ink-divider-thin-03.webp` | ✅ |
| `/images/characters/ning-yao.jpg` | ✅ |
| `/images/characters/qi-jingchun.jpg` | ✅ |

---

## 2. Entries Added

### Live-used purchased ink assets (9 entries)

| ID | File | Role | sectionFit | Priority | Notes |
|---|---|---|---|---|---|
| `asset.ink-divider-rough-01` | `/images/ui/purchased/ink/ink-divider-rough-01.webp` | `section-divider` | `['swordsmanship']` | p1 | Live-used: `SwordDaoManualHero.vue` (3 refs), `swordsmanship/index.vue` |
| `asset.ink-divider-rough-02` | `/images/ui/purchased/ink/ink-divider-rough-02.webp` | `section-divider` | `['swordsmanship']` | p1 | Live-used: `SwordDaoManualHero.vue` (3 refs) |
| `asset.ink-divider-rough-03` | `/images/ui/purchased/ink/ink-divider-rough-03.webp` | `section-divider` | `['swordsmanship']` | p2 | Candidate — not yet in live code |
| `asset.ink-title-stroke-long-06` | `/images/ui/purchased/ink/ink-title-stroke-long-06.webp` | `section-divider` | `['swordsmanship']` | p1 | Live-used: `main.css` (`--jl-title-brush`), `SwordDaoManualHero.vue` |
| `asset.ink-wash-cloud-soft-03` | `/images/ui/purchased/ink/ink-wash-cloud-soft-03.webp` | `background-wash` | `['swordsmanship']` | p1 | Live-used: `SwordDaoManualHero.vue` |
| `asset.ink-corner-stain-04` | `/images/ui/purchased/ink/ink-corner-stain-04.webp` | `hover-ornament` | `['swordsmanship']` | p1 | Live-used: `SwordDaoManualHero.vue` |
| `asset.ink-mountain-smear-01` | `/images/ui/purchased/ink/ink-mountain-smear-01.webp` | `background-wash` | `['swordsmanship']` | p1 | Live-used: `SwordDaoManualHero.vue` |
| `asset.ink-divider-thin-02` | `/images/ui/purchased/ink/ink-divider-thin-02.webp` | `section-divider` | `['swordsmanship']` | p2 | Candidate — not yet in live code |
| `asset.ink-divider-thin-03` | `/images/ui/purchased/ink/ink-divider-thin-03.webp` | `section-divider` | `['swordsmanship']` | p2 | Candidate — not yet in live code |

**Design decisions:**

- **`sectionFit: ['swordsmanship']` for all ink assets.** All 7 live-used assets are consumed exclusively by `SwordDaoManualHero.vue` and `swordsmanship/index.vue`. The CSS variable `--jl-title-brush` is also swordsmanship-specific (it decorates sword manual titles). No ink asset is used globally; global tokens in `main.css` still scope to specific swordsmanship pages. This prevents swordsmanship's blade aesthetic from bleeding into Characters, Glossary, or other sections.

- **`p1` for live-used assets** (7 entries) — they are referenced by production components and must remain valid.

- **`p2` for candidate assets** (2 entries: rough-03, thin-02) — they exist on disk and are appropriate for swordsmanship but not yet referenced. Safe to use when a designer needs them.

### Alternate-format portrait entries (2 entries)

| ID | File | Role | Priority | Notes |
|---|---|---|---|---|
| `asset.char-ning-yao-portrait-jpg` | `/images/characters/ning-yao.jpg` | `dossier-portrait` | p3 | Alternate format only. Same PROVISIONAL status as `.webp`. |
| `asset.char-qi-jingchun-portrait-jpg` | `/images/characters/qi-jingchun.jpg` | `dossier-portrait` | p3 | Alternate format only. Same PROVISIONAL status as `.webp`. |

**Design decisions:**

- `p3` — these are fallbacks, not preferred sources. The webp versions are preferred.
- Both inherit the `PROVISIONAL` provenance status from their webp counterparts. Do not promote to p1 without verifying rights for both formats.
- `app/pages/index.vue` uses `.jpg` variants directly; the manifest now tracks them so future components can reason about which format they prefer.

---

## 3. Assets Intentionally Skipped

The following unreferenced purchased ink assets were NOT added this stage (out of scope per the task):

| File | Reason not added |
|---|---|
| `ink-corner-stain-02.webp` | Candidate (unreferenced in live code), not in task list |
| `ink-corner-stain-03.webp` | Candidate, not in task list |
| `ink-corner-stain-05.webp` | Candidate, not in task list |
| `ink-corner-stain-06.webp` | Candidate, not in task list |
| `ink-ring-brush-01.webp` | Candidate, not in task list |
| `ink-ring-soft-01.webp` | Candidate, not in task list |
| `ink-ring-soft-02.webp` | Candidate, not in task list |
| `ink-title-stroke-short-01.webp` | Candidate, not in task list |
| `ink-title-stroke-short-02.webp` | Candidate, not in task list |
| `ink-underline-smear-01.webp` | Candidate, not in task list |
| `ink-wash-cloud-soft-02.webp` | Candidate, not in task list |
| `ink-wash-cloud-soft-04.webp` | Candidate, not in task list |
| `ink-wash-cloud-soft-05.webp` | Candidate, not in task list |
| `ink-wash-cloud-soft-06.webp` | Candidate, not in task list |
| `ink-wash-cloud-soft-07.webp` | Candidate, not in task list |

All candidates (p2/p3) for future expansion. Task scope was limited to 11 known files.

---

## 4. Remaining Missing p0 Assets (Post-Expansion)

These p0 gaps remain in the manifest and are NOT addressed in this stage (require curation or commissioning):

| Asset type | Section | Status |
|---|---|---|
| Hero atmosphere | Rankings | ❌ Missing — no candidates in `weibo-draft/` curated |
| Hero atmosphere | Teachings | ❌ Missing |
| Hero atmosphere | Glossary | ❌ Missing |
| Hero atmosphere | Pantheon | ❌ Missing |
| Dossier portraits | Characters | ❌ ~30+ portraits needed; 3 provisional exist |
| Section divider | Characters | ❌ No brush/ink divider in manifest |
| Section divider | World | ❌ Missing |
| Section divider | Rankings | ❌ Missing |
| Section divider | Timeline | ❌ Missing |
| Button ornament | Global | ❌ No `button-ornament` entries |
| Seal stamp | Global | ❌ Only raster fallback seal entries exist |

These require Stage 35C or later curation passes.

---

## 5. Manifest Safety Assessment

| Criterion | Status |
|---|---|
| All entries point to verified on-disk files | ✅ |
| No contact sheets, Pinterest images, or raw pool files in manifest | ✅ |
| All live-used assets now covered | ✅ |
| No duplicate IDs | ✅ |
| Build passes | ✅ |
| Generate passes (273 routes) | ✅ |

**Verdict: Manifest is safer for Stage 35C UI primitives.**

---

## 6. Files Changed

| File | Change |
|---|---|
| `app/utils/assetManifest.ts` | 11 new entries added (9 purchased ink, 2 alternate-format portraits). Manifest version unchanged (`1.0.0`). |
| `plans/stage-35b-asset-manifest-expansion-report.md` | Created |

**Manifest entry count: 52 → 63**

---

## 7. Build / Generate

- `npm run build` — **✅ Build complete**
- `npm run generate` — **✅ 273 routes prerendered**

---

*End of Stage 35B-2B Expansion Report.*
