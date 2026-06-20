# Stage 35B — Asset Inventory Report

**Status:** Foundation complete. Manifest typed, helpers wired, starter entries populated.
**Date:** 2026-06-20
**Next step:** Stage 35B-1 — Curation pass on raw pools, portrait verification, missing hero audit.

---

## 1. Current Asset Folder Map

| Folder | Files | Role in design engine | Status | Consume from manifest? |
|---|---|---|---|---|
| `public/images/banners/` | 18 | Hero atmosphere (named), raw pinterest (unknown) | Mixed — 8 named section banners curated; 10 pinterest images uncurated | **Yes** (8 named only; pinterest batch needs curation) |
| `public/images/characters/` | 5 | Dossier portrait | Provisional — 3 characters (chen-pingan, ning-yao, qi-jingchun) in webp + jpg duplicates | **Yes** (provisional, verify official art before p0) |
| `public/images/textures/` | 2 | Texture | Curated — ink-wash-01, ink-wash-02 | **Yes** |
| `public/images/portalcard/` | 8 | Card art (section portal cards) | Curated — one per section | **Yes** |
| `public/images/timeline/` | 1 | Background wash | Curated — chen-pingan-black-gold-timeline.webp | **Yes** |
| `public/images/header/` | 1 | Header texture | Utility — site-header.jpeg | **No** (UI utility, not design-engine role) |
| `public/images/logos/` | 1 | Logo | Utility — JianLaiLogo.png | **No** (brand utility) |
| `public/images/ui/generated/hover-marks/` | 19 | Hover ornament | Curated — brush softs, blots, underlines, active rings | **Yes** |
| `public/images/ui/generated/swordsmanship-v2/` | 9 | Hero atmosphere, card art, section divider | Curated — caged sparrow art + 5 slash dividers + mist bg | **Yes** |
| `public/images/ui/purchased/` | ~100 | Mixed: texture, background-wash, seal-stamp, section-divider, hover-ornament, watermark | Partial — `_selected-assets.json` tracks selections; contact sheets present | **Yes** (individual assets, not contact sheets) |
| `public/images/ui/seals/` | 1 | Seal stamp | Utility — seal-border-mask.svg (SVG utility) | **No** (not a design-engine image asset) |
| `public/images/weibo-draft/` | 796 | **Archive only** | Raw pool — unreviewed fan-sourced screenshots | **No** — `unusable` until curated |
| `public/images/banner-draft/` | 170 | **Archive only** | Raw pool — draft banners | **No** — `unusable` until curated |
| `public/images/design-references/` | 40 | **Archive only** | Raw pool — design reference collection | **No** — `unusable` until curated |
| `public/images/generated/` | 0 | — | Empty placeholder folder | N/A |
| `public/videos/` | N/A | Video | Separate domain (R2, handled by `mediaLibrary.ts`) | **No** (different pipeline) |

**Summary:**
- **Consumable live folders:** 8 (`banners/`, `characters/`, `textures/`, `portalcard/`, `timeline/`, `ui/generated/hover-marks/`, `ui/generated/swordsmanship-v2/`, `ui/purchased/`)
- **Archive-only folders:** 3 (`weibo-draft/`, `banner-draft/`, `design-references/`)
- **Utility folders:** 3 (`header/`, `logos/`, `ui/seals/`)

---

## 2. What Is Curated

### Already in the manifest (this stage):

| Role | Count | Examples |
|---|---|---|
| hero-atmosphere | 9 | home-hero, 7 section banners, swordsmanship-hero-mist-bg |
| dossier-portrait | 3 | chen-pingan, ning-yao, qi-jingchun (all provisional) |
| card-art | 9 | 8 portal cards + caged-sparrow slip art |
| section-divider | 6 | 5 swordsmanship slashes + 2 purchased ink title strokes |
| hover-ornament | 8 | 4 brush softs, 2 blots, 2 underline variants |
| background-wash | 6 | purchased panels/scrolls + timeline chen-pingan |
| texture | 4 | ink-wash-01/02, cinnabar-speckle, jade-pattern paper |
| seal-stamp | 3 | purchased seal raster options |
| watermark | 2 | purchased ornament corner variants |
| **Total** | **50 entries** | |

### Already in the codebase (not re-duplicated):

- `site-header.jpeg` — used by SiteHeader as a scroll-triggered texture. Utility role, not a design-engine image.
- `JianLaiLogo.png` — brand utility, not a design-engine image.
- `seal-border-mask.svg` — SVG mask utility for seal components, not a raster image asset.

---

## 3. What Is Raw (Archive Only)

### `public/images/weibo-draft/` — 796 files

**Risk: HIGH if used directly.**

This is the largest pool and the most mixed. Files are named `YYYY-MM-DD_HH-MM-SS_N.jpg` — datestamped Weibo/fan social media exports. Likely includes:
- Official donghua stills and key visuals
- Fan art and同人
- Screenshots from the novel/manhua/donghua
- Social media chat screenshots
- Low-resolution mobile captures

**Action required:** Full curation pass in Stage 35B-1. Do NOT reference these files in components. They exist as the candidate pool.

### `public/images/banner-draft/` — 170 files

**Risk: MEDIUM.**

Named and datestamped. Some may be intended section banners that were started but not finalized. Others are clearly fan screenshots.

**Action required:** Stage 35B-1 curation. Identify any that could become `hero-atmosphere` for their section.

### `public/images/design-references/` — 40 files

**Risk: LOW for production use, HIGH for confusion.**

Likely reference screenshots, mood boards, or design comps collected during planning. These are reference material, not production assets.

**Action required:** Confirm contents. Mark all as `unusable` or `reference-only` in the manifest.

---

## 4. Risks

### Risk 1: Portrait images may not be official art

The 3 character portraits in `characters/` (chen-pingan.webp, ning-yao.webp, qi-jingchun.webp) are included in the manifest as `p1` with a `PROVISIONAL` note. Before they can be promoted to `p0`, someone must verify they are:
- Official donghua stills, OR
- Commissioned art, OR
- Fan art cleared for use

If unverified, they should remain `unusable` until curation confirms.

### Risk 2: 10 Pinterest images in `banners/`

The `banners/` folder contains 10 files named `pinterest_892697957*.jpg` alongside the 8 named section banners. These look like fan-sourced images and are not included in the manifest. They should be moved to `banner-draft/` or `weibo-draft/` during Stage 35B-1 cleanup.

### Risk 3: `weibo-draft/` is huge (796 files)

Scanning this folder at runtime would be expensive and produce false positives. The manifest approach (curated only) is correct. Do NOT add a dynamic scanner that reads the filesystem.

### Risk 4: Purchased assets need per-use review

The `ui/purchased/` assets are included at `p2`/`p3` because they require a human to verify that:
- The specific asset fits the intended role
- The aspect ratio is appropriate for the use
- The opacity guidelines are followed

The manifest entry does not auto-approve every use — it provides the starting point for the curation decision.

---

## 5. p0 Asset Needs (Required for Launch)

These assets are `p0` in the manifest and need to exist for launch:

| Asset | Role | Status |
|---|---|---|
| `ink-wash-01.webp` | texture | **Exists — manifest entry ready** |
| `ink-wash-02.webp` | texture | **Exists — manifest entry ready** |
| `home-hero.webp` | hero-atmosphere | **Exists — manifest entry ready** |
| Characters section banner | hero-atmosphere | **Exists in banners/** |
| World section banner | hero-atmosphere | **Exists in banners/** |
| Cultivation section banner | hero-atmosphere | **Exists in banners/** |
| Swordsmanship section banner | hero-atmosphere | **Exists in banners/** |
| Factions section banner | hero-atmosphere | **Exists in banners/** |
| Artifacts section banner | hero-atmosphere | **Exists in banners/** |
| Timeline section banner | hero-atmosphere | **Exists in banners/** |
| Chen Ping'an portrait | dossier-portrait | **Exists — PROVISIONAL, needs verification** |
| Ning Yao portrait | dossier-portrait | **Exists — PROVISIONAL, needs verification** |
| Qi Jingchun portrait | dossier-portrait | **Exists — PROVISIONAL, needs verification** |
| Rankings section banner | hero-atmosphere | **MISSING — no file found in banners/** |
| Teachings section banner | hero-atmosphere | **MISSING — no file found in banners/** |
| Glossary section banner | hero-atmosphere | **MISSING — no file found in banners/** |
| Pantheon section banner | hero-atmosphere | **MISSING — no file found in banners/** |
| Swordsmanship dividers | section-divider | **5 exist in swordsmanship-v2/** |
| Non-swordsmanship section dividers | section-divider | **MISSING — no ink-stroke dividers found for characters/world/cultivation/factions** |
| Characters hover ornaments | hover-ornament | **MISSING — no character-specific hover marks** |
| Atlas panel ornaments | hover-ornament | **MISSING — no atlas/gazetteer-specific ornaments** |
| Dossier plate frames | card-art | **MISSING — no dossier-specific portrait frames** |
| Sect seal sigils | seal-stamp | **MISSING — no faction sigil images** |

---

## 6. Missing Section Hero Assets

Current hero atmosphere coverage:

| Section | Banner file | Manifest entry | Status |
|---|---|---|---|
| home | home-hero.webp | asset.hero-home | ✅ Ready |
| characters | characters-banner.webp | asset.hero-characters | ✅ Ready |
| world | world-banner.webp | asset.hero-world | ✅ Ready |
| cultivation | cultivation-banner.webp | asset.hero-cultivation | ✅ Ready |
| swordsmanship | swordsmanship-banner.webp | asset.hero-swordsmanship | ✅ Ready |
| factions | factions-banner.webp | asset.hero-factions | ✅ Ready |
| artifacts | artifacts-banner.webp | asset.hero-artifacts | ✅ Ready |
| timeline | (unnamed banner) | MISSING | ❌ Move from banner-draft |
| **rankings** | **MISSING** | **MISSING** | ❌ Need to source |
| **teachings** | **MISSING** | **MISSING** | ❌ Need to source |
| **glossary** | **MISSING** | **MISSING** | ❌ Need to source |
| **pantheon** | **MISSING** | **MISSING** | ❌ Need to source |

**Action:** Stage 35B-1 must audit `banner-draft/` for the Timeline banner, then source Rankings/Teachings/Glossary/Pantheon banners from official or commissioned art.

---

## 7. Missing Portrait Assets

Current dossier portrait coverage: **3 provisional entries** (chen-pingan, ning-yao, qi-jingchun).

The `characters/` folder has only these 3. With hundreds of characters in the wiki, this is a significant gap.

**Action:** Stage 35B-1 curation pass on `weibo-draft/` should identify candidate portraits. Priority characters (protagonists, major antagonists, key sect leaders) should be curated first.

---

## 8. Missing Divider / Ornament Assets

Current section-divider coverage:
- Swordsmanship: **5 slash variants ✅**
- Characters: **MISSING** (no ink-stroke or brush dividers)
- World: **MISSING**
- Cultivation: **MISSING**
- Factions: **MISSING**
- Rankings: **MISSING** (no gold/ochre dividers)
- Timeline: **MISSING** (no ochre/bronze dividers)
- Pantheon: **MISSING** (no gold shrine dividers)

The `ui/purchased/ink/` folder has `ink-title-stroke-long-01` through `-06` and `ink-divider-thin-01` through `-03` — these should be added to the manifest in Stage 35B-1 as section-divider entries for non-swordsmanship sections.

---

## 9. Next Recommended Actions (Stage 35B-1)

1. **Portrait verification.** Review 3 provisional character portraits for official/commissioned status. Promote to p0 or reclassify as unusable.
2. **Pinterest batch.** Move 10 unnamed pinterest images from `banners/` to `banner-draft/`.
3. **Banner-draft audit.** Scan `banner-draft/` for a potential Timeline banner. Source Rankings/Teachings/Glossary/Pantheon banners.
4. **Expand purchased assets.** Add remaining `ui/purchased/` ink dividers, purchased panels, and purchased seals to the manifest.
5. **Characters folder gap.** Begin curation pass on `weibo-draft/` for character portraits — focus on top 20 characters by importance.
6. **Divider expansion.** Add all 9 purchased ink divider/thin-stroke files to the manifest with appropriate section-fit values.
7. **Contact sheet cleanup.** Contact sheets (`_*-contact-sheet.webp`) should be marked `unusable` — they are reference images, not production assets.

---

*End of Stage 35B Asset Inventory Report.*
