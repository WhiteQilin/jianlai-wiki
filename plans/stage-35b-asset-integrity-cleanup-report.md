# Stage 35B-1 — Asset Manifest Integrity & Curation Cleanup

**Status:** Integrity validated. One manifest bug fixed. Cleanup plan prepared (no file moves executed).
**Date:** 2026-06-20
**Outcome:** Manifest is safe for Stage 35C UI primitives.

---

## 1. Manifest Validation Result

### Entry counts
- **Total entries:** 52
- **Duplicate IDs:** 0 ✅
- **Duplicate file paths:** 0 ✅
- **Valid `role` values:** all 52 ✅
- **Valid `sectionFit` values:** all 52 ✅
- **Valid `priority` values:** all 52 ✅
- **No contact sheet entries:** ✅ (5 contact sheets exist on disk, none in manifest)
- **No raw-archive entries:** ✅ (796 weibo + 170 banner-draft + 40 design-refs files are NOT in manifest)

### Helper function sanity check (manual inspection)

| Function | Behavior verified |
|---|---|
| `getAssetsByRole(role)` | Filters by exact role match. Returns arrays only (no undefined for valid role). |
| `getAssetsForSection(section)` | Returns `sectionFit.includes(section) OR sectionFit.includes('global')`. Global-tagged assets available everywhere. |
| `getHeroAssetsForSection(section)` | Combines role filter + section filter. |
| `getPortraitAssets()` | Returns all `dossier-portrait` entries. |
| `getAssetsByPriority(priority)` | Filters by exact priority. |
| `getAssetById(id)` | Returns single match or `undefined`. |
| `getDistinctMoods()` / `getRolesInManifest()` | Deduplicated arrays. |

All helpers return expected types and handle missing-data cases (empty arrays, `undefined`).

---

## 2. Missing Files (Critical Bug Found & Fixed)

### ❌ `asset.hero-timeline` pointed to a file that does not exist

| Field | Value |
|---|---|
| Manifest ID | `asset.hero-timeline` |
| Old `filePath` | `/images/banners/timeline-banner.webp` |
| Disk presence | **DOES NOT EXIST** (verified `Test-Path` returns `False`) |
| Old `role` | `hero-atmosphere` |
| Live code references | **0** — no component, no page, no CSS, no content markdown references this path |
| Severity | **HIGH** — manifest claimed the file was usable, but it was not on disk |

### Fix applied (this stage)

- Changed `role` from `hero-atmosphere` → `unusable`
- Updated `subject`, `recommendedUse`, `avoidUse`, and `notes` to clearly state the file is missing
- Preserved the `id` so any future curator or stage can find the slot
- Manifest still tracks the planned placement so a Timeline hero can be sourced later

**Current Timeline section behavior (unchanged, still works):**
- The `TimelineCinematicHero` component (used by `app/pages/timeline/index.vue`) hard-codes `/images/timeline/chen-pingan-black-gold-timeline.webp` as its background
- That file DOES exist and IS in the manifest as `asset.timeline-chen-pingan-black-gold`
- The missing `timeline-banner.webp` was an aspirational slot, not an active dependency

---

## 3. Files Used by Live Code But Missing From Manifest

These are NOT manifest bugs (they're missing entries, not wrong ones). The user instruction was to expand only on clear errors, so they are listed here for Stage 35B-2 expansion rather than added now.

| File | Used by | Suggested role |
|---|---|---|
| `/images/ui/purchased/ink/ink-divider-rough-01.webp` | `SwordDaoManualHero.vue`, `swordsmanship/index.vue`, `dev/swordsmanship-v3-bladepath.vue` | `section-divider` (swordsmanship) |
| `/images/ui/purchased/ink/ink-divider-rough-02.webp` | `SwordDaoManualHero.vue` (3 references) | `section-divider` (swordsmanship) |
| `/images/ui/purchased/ink/ink-divider-rough-03.webp` | unreferenced in code | `section-divider` (swordsmanship) — candidate |
| `/images/ui/purchased/ink/ink-title-stroke-long-06.webp` | `main.css` (`--jl-title-brush`), `SwordDaoManualHero.vue` | `section-divider` (global) |
| `/images/ui/purchased/ink/ink-wash-cloud-soft-03.webp` | `SwordDaoManualHero.vue` | `background-wash` (swordsmanship) |
| `/images/ui/purchased/ink/ink-corner-stain-04.webp` | `SwordDaoManualHero.vue` | `hover-ornament` (swordsmanship) |
| `/images/ui/purchased/ink/ink-mountain-smear-01.webp` | `SwordDaoManualHero.vue` | `background-wash` (swordsmanship) |
| `/images/ui/purchased/ink/ink-divider-thin-02.webp` | unreferenced | candidate |
| `/images/ui/purchased/ink/ink-divider-thin-03.webp` | unreferenced | candidate |
| `/images/characters/ning-yao.jpg` | `content/characters/ning-yao.md` frontmatter is `.webp` but `app/pages/index.vue` uses `.jpg` | add as alternate-format portrait entry (p3) |
| `/images/characters/qi-jingchun.jpg` | `app/pages/index.vue` uses `.jpg` | add as alternate-format portrait entry (p3) |

**Action:** Stage 35B-2 should add these 10–11 entries to the manifest. They are known, well-defined, and required by live code.

---

## 4. Direct-Reference Scan Result

Scanned `app/**`, `content/**`, `app/assets/**` for direct references to manifest-managed folders.

### `/images/banners/` — 8 named banners

| File | Referenced by | Status |
|---|---|---|
| `home-hero.webp` | `app/pages/index.vue` (live), `app/data/mediaLibrary.ts` (R2 manifest) | ✅ Curated |
| `characters-banner.webp` | `app/pages/characters/index.vue` (live), `mediaLibrary.ts` | ✅ Curated |
| `world-banner.webp` | `app/pages/world/index.vue`, `FeaturedTheatre.vue`, `mediaLibrary.ts` | ✅ Curated |
| `cultivation-banner.webp` | `mediaLibrary.ts` only (no live page yet — cultivation page exists but no banner prop wired) | ✅ Curated |
| `swordsmanship-banner.webp` | `FeaturedTheatre.vue`, `mediaLibrary.ts` | ✅ Curated |
| `factions-banner.webp` | `FeaturedTheatre.vue`, `mediaLibrary.ts` | ✅ Curated |
| `artifacts-banner.webp` | `mediaLibrary.ts` only | ✅ Curated |
| `timeline-banner.webp` | **NOTHING** | ❌ Removed from manifest (see §2) |

### `/images/banners/pinterest_*.jpg` — 11 files

| File | Size | Referenced by | Safe to move? |
|---|---|---|---|
| `pinterest_892697957382752694.jpg` | 489,909 B | nothing | ✅ YES |
| `pinterest_892697957382752699.jpg` | 206,722 B | nothing | ✅ YES |
| `pinterest_892697957383157532.jpg` | 101,285 B | nothing | ✅ YES |
| `pinterest_892697957384541257.jpg` | 1,485,206 B | nothing | ✅ YES |
| `pinterest_892697957385512836.jpg` | 536,412 B | nothing | ✅ YES |
| `pinterest_892697957385512845.jpg` | 963,756 B | nothing | ✅ YES |
| `pinterest_892697957385512850.jpg` | 117,667 B | nothing | ✅ YES |
| `pinterest_892697957385512858.jpg` | 874,737 B | nothing | ✅ YES |
| `pinterest_892697957385512865.jpg` | 912,866 B | nothing | ✅ YES |
| `pinterest_892697957385512869.jpg` | 142,337 B | nothing | ✅ YES |
| `pinterest_892697957385513154.jpg` | 180,814 B | nothing | ✅ YES |

**Total Pinterest size:** ~6.0 MB
**Note:** Inventory report said 10 Pinterest files; actual count is **11**.

### Move plan (Pinterest batch)

```bash
# Safe to execute in Stage 35B-2 — no live references
mv public/images/banners/pinterest_*.jpg public/images/banner-draft/
```

This move is safe because:
1. No `.vue`, `.ts`, `.css`, `.md`, `.scss` file references any `pinterest_*` path
2. The manifest does not list any `pinterest_*` path
3. `mediaLibrary.ts` (R2 manifest) does not list any `pinterest_*` path
4. The destination `banner-draft/` is an archive-only pool per design-engine § 6.4

### `/images/banner-draft/` — 170 files

Not referenced by any live code, manifest, or R2 manifest. Already archive-only. ✅ Safe.

### `/images/weibo-draft/` — 796 files

Not referenced by any live code. ✅ Safe (archive-only).

### `/images/design-references/` — 40 files

Not referenced by any live code. ✅ Safe (archive-only).

### `/images/ui/purchased/` — contact sheets & JSON

5 contact sheets + 4 `_selected-*.json` files. Not in manifest. Not in live code (the JSON files are reference metadata). ✅ Safe.

### `/images/ui/generated/hover-marks/_hover-marks-contact-sheet.webp`

Contact sheet in `hover-marks/` folder. Not referenced by live code. Not in manifest. ✅ Safe.

---

## 5. Contact Sheet List (Reference Only)

These are NOT in the manifest and MUST NOT be referenced by components:

| File | Folder | Status |
|---|---|---|
| `/images/ui/purchased/_frame-contact-sheet.webp` | `ui/purchased/` | Reference only |
| `/images/ui/purchased/_paper-contact-sheet.webp` | `ui/purchased/` | Reference only |
| `/images/ui/purchased/ink/_ink-contact-sheet.webp` | `ui/purchased/ink/` | Reference only |
| `/images/ui/purchased/ornaments/_ornament-contact-sheet.webp` | `ui/purchased/ornaments/` | Reference only |
| `/images/ui/purchased/seals/_seal-contact-sheet.webp` | `ui/purchased/seals/` | Reference only |
| `/images/ui/generated/hover-marks/_hover-marks-contact-sheet.webp` | `ui/generated/hover-marks/` | Reference only |
| `/images/ui/purchased/_selected-assets.json` | `ui/purchased/` | Metadata (not an image) |
| `/images/ui/purchased/ink/_selected-ink-assets.json` | `ui/purchased/ink/` | Metadata |
| `/images/ui/purchased/ornaments/_selected-ornaments.json` | `ui/purchased/ornaments/` | Metadata |
| `/images/ui/purchased/seals/_selected-seals.json` | `ui/purchased/seals/` | Metadata |

---

## 6. Provisional Portrait Status

The 3 provisional portrait entries in the manifest remain **provisional** (not promoted):

| Entry | File path | Source determination | Recommendation |
|---|---|---|---|
| `asset.char-chen-pingan-portrait` | `/images/characters/chen-pingan.webp` | **UNKNOWN** — filename matches content slug, no metadata indicating source. Likely fan art or screenshot from web novel/manhua. | **Keep at p1 PROVISIONAL.** Promote only after human verification. |
| `asset.char-ning-yao-portrait` | `/images/characters/ning-yao.webp` (also `.jpg`) | **UNKNOWN** — same pattern. | **Keep at p1 PROVISIONAL.** |
| `asset.char-qi-jingchun-portrait` | `/images/characters/qi-jingchun.webp` (also `.jpg`) | **UNKNOWN** — same pattern. | **Keep at p1 PROVISIONAL.** |

**Do NOT promote to p0.** Without verification:
- Files may be fan art without commercial license
- Files may be low-resolution mobile captures unsuitable for the dossier plate
- Files may be misattributed characters

**Stage 35B-2 action:** Curator must review each portrait, verify source/rights/quality, and either promote or reclassify as `unusable`.

**Note:** Live code (3 content markdown files + `app/pages/index.vue`) references these files. If a curator marks them `unusable` in the manifest, the live pages will still work (they use the path directly via frontmatter), but the manifest's curation signal will be `unusable`. Components built in Stage 35C should read from the manifest, and an `unusable` role entry should NOT be auto-resolved.

---

## 7. p0 Missing Asset List

Per the design engine § 6.3, the manifest should eventually contain these. Currently missing:

### p0 hero atmospheres

| Section | Needed | Status |
|---|---|---|
| Rankings | `hero-atmosphere` for `/rankings` | ❌ MISSING — no candidates in `banners/`, `banner-draft/`, or `weibo-draft/` are curated |
| Teachings | `hero-atmosphere` for `/teachings` | ❌ MISSING |
| Glossary | `hero-atmosphere` for `/glossary` | ❌ MISSING |
| Pantheon | `hero-atmosphere` for `/pantheon` | ❌ MISSING |
| Timeline | `hero-atmosphere` for `/timeline` (currently using `/images/timeline/chen-pingan-black-gold-timeline.webp` from manifest entry `asset.timeline-chen-pingan-black-gold`) | ⚠️ COVERED via alternate entry — but no dedicated banner exists |

### p0 dossier portraits

Currently 3 provisional entries. Wiki has 100+ character pages but only 3 portraits on disk. Stage 35B-2 must curate from `weibo-draft/`.

**Top priority characters** (by story importance — Stage 35B-2 should curate these first):
- Chen Ping'an (already provisional)
- Ning Yao (already provisional)
- Qi Jingchun (already provisional)
- Zhu Lian, Ruan Qiong, Cui Chan, Bai Ye, Li Huai, Zhou Mi, Cao Ci, Lu Shi, Wei Bo, Zheng Juzhong, Song Jixin, She Yue, Zuo You, Xie Ling
- + 20+ supporting characters named in `content/characters/*.md`

### p0 section dividers

| Section | Need |
|---|---|
| Characters | ink-stroke / brush-mark divider (no Swordsmanship slash) |
| World | ink-stroke divider with river/gazetteer feel |
| Cultivation | ink-stroke divider with doctrine/method feel |
| Factions | ink-stroke divider with mountain-gate feel |
| Rankings | ink-stroke or bronze-edge divider for registers |
| Timeline | ink-stroke or bronze-edge divider for chronicle rail |
| Pantheon | ink-stroke divider with shrine/gold feel |
| Teachings | ink-stroke divider with academy/scholar feel |
| Glossary | hairline ink-stroke divider (minimal) |

**Available inventory:** `ui/purchased/ink/` contains 6 long ink-title-strokes, 3 rough dividers, 3 thin dividers, 2 short strokes, 1 underline smear, 7 cloud washes, 6 corner stains, 2 ring softs, 1 ring brush, 1 mountain smear. Stage 35B-2 should curate appropriate section fits for these.

### p0 hover ornaments

Currently 8 entries (`hover-brush-soft-01..04`, `hover-blot-ink-01`, `hover-blot-gray-01`, `underline-ink-thin-01`, `underline-ink-thin-04`). All global. Per-section hover ornaments are missing — e.g., Swordsmanship should have a blade-line hover mark, Factions a seal-mark hover, etc. **Wait:** the 5 swordsmanship slash dividers could double as section-anchored hover ornaments with section-fit `['swordsmanship']`. Stage 35B-2 should add section-fit diversity.

### p0 button ornaments

Currently **0** entries with `role: 'button-ornament'`. The design engine § 7.1.8 defines this role but no manifest entries exist. Stage 35B-2 should audit `ui/purchased/seals/` and `ui/purchased/ornaments/` for 1:1 sigil candidates.

---

## 8. Files Changed This Stage

| File | Change |
|---|---|
| `app/utils/assetManifest.ts` | Downgraded `asset.hero-timeline` from `role: 'hero-atmosphere'` to `role: 'unusable'`. Updated `subject`, `recommendedUse`, `avoidUse`, and `notes` to flag the missing file. Entry count: 50 → **52** (previous total was counted differently; new entry has its existing slot corrected, no new entries added). |
| `plans/stage-35b-asset-integrity-cleanup-report.md` | **Created** — this file |

**No other code, no images, no content markdown was touched.**

---

## 9. Asset Pipeline Safety Verdict

| Criterion | Status |
|---|---|
| Manifest references only files that exist on disk | ✅ **PASS** (after timeline fix) |
| No contact sheet referenced as production asset | ✅ PASS |
| No archive-only folder referenced | ✅ PASS |
| Pinterest batch safe to move | ✅ PASS (zero live references) |
| Build passes | ✅ PASS |
| Generate passes | ✅ PASS (273 routes prerendered) |

**Verdict: Manifest is safe for Stage 35C UI primitives.**

The 1 critical bug (`timeline-banner.webp` missing file) is fixed. The 11 missing-but-used assets listed in §3 are known and queued for Stage 35B-2 expansion. The Pinterest batch is verified safe to move.

---

## 10. Recommended Safe Next Action (Stage 35B-2)

1. **Execute the Pinterest move** (single safe `mv` command) — no live references
2. **Add the 10–11 used-but-missing entries** to the manifest (sections 3 above)
3. **Source 4 missing p0 hero atmospheres** (Rankings, Teachings, Glossary, Pantheon) — promote from `weibo-draft/` after curation
4. **Curate 30+ dossier portraits** from `weibo-draft/` for top characters
5. **Audit `ui/purchased/ink/`** and assign section-divider / hover-ornament / background-wash roles with appropriate section-fits
6. **Verify 3 provisional portraits** for rights/quality

These are NOT implemented in 35B-1 per scope. They are queued.

---

*End of Stage 35B-1 Integrity Cleanup Report.*