# Stage 35D-0 — Generated UI Asset Quality Audit

**Stage:** 35D-0 (audit gate before 35D material/texture integration)
**Date:** 2026-06-24
**Branch:** `feat/full-primitive-adoption-audit`
**Mode:** Read-only audit. No files edited, no assets moved, nothing staged or committed.

## Scope

Audit the generated Jian Lai ink / hover / active UI assets and decide which are
production-worthy, which need cleanup, which should be used only in dev/prototypes,
and which should be rejected.

**Source-of-truth files consulted:**

- `PRODUCT.md`
- `DESIGN.md`
- `plans/jianlai-frontend-design-engine.md` (Stage 35A design engine)
- `app/utils/assetManifest.ts`
- `app/assets/css/main.css` (CSS variable bindings)
- Primitives: `app/components/ui/{BrushUnderline,InkButton,InkTextButton,SectionDivider,SealButton,PaperSlipCard,BrushTitle,InkHoverLink,InkActiveTab,InkDivider}.vue`

**Asset pools inspected:**

- `public/images/ui/generated/hover-marks/` — 19 WebP marks (4 bound to global CSS vars)
- `public/images/ui/generated/swordsmanship-v2/` — 5 slash dividers + 2 slip/hero art variants
- `public/images/ui/purchased/ink/` — 32 ink strokes (2 bound to global vars; rest consumed directly)

**Method.** Alpha-channel statistics were computed programmatically for every asset
(PIL + numpy): min/max alpha, opaque %, fully-transparent %, semitransparent-fringe %,
fringe RGB, core RGB, and composited luminance on dark (#0f1011) vs parchment (#f7f1e4).
This produces objective halo/matte signals that small contact-sheet thumbnails cannot.

> These assets must not be pasted randomly into pages. They should eventually be
> consumed by primitives such as `BrushUnderline`, `InkButton`, `InkTextButton`,
> `SectionDivider`, `SealButton`, `PaperSlipCard`, and `ArchiveTab`.

---

## Executive Summary

**Headline finding — the dominant defect is white-matte alpha, not silhouette quality.**
15 of 19 generated hover-marks carry a **white-matte fringe**: semitransparent edge
pixels are near-neutral RGB (~190–210) and brighter than the ink core. These assets
were almost certainly rendered by an image model on a white/light background and then
had alpha extracted via luminance keying, which leaves white in the feathered edge.

**Why this passed Stage 30E-1 but is a real problem now.** The white-matte fringe is
**invisible on light parchment** (the fringe reads as natural ink feathering against
cream paper — the only surface 30E-1 judged). But the four affected CSS variables are
declared **once in `:root`** with **no `.dark` override and no per-section override**,
so every one of the 11 section themes and dark mode consumes the *same* matted asset.
On dark backgrounds the white fringe becomes a visible halo: the underline/brush
fringes composite to luminance **86–134 against a background of 16** — a 70–118-point
glow.

The **cinnabar** assets, by contrast, have *colored* (cinnabar-tinted) fringes that
composite cleanly everywhere — proof that the generation pipeline can produce clean
alpha when the source key is colored rather than luminance-based.

**Tally:**
- **MATTE (15/19):** `active-ring-black-01`, `active-ring-black-02`, `active-ring-gray-01`,
  `hover-blot-gray-01`, `hover-blot-ink-01`, `hover-brush-soft-01/02/03/04`,
  `underline-ink-thin-01/02/03/04/05/06`
- **CLEAN (4/19):** `active-ring-cinnabar-01`, `active-seal-cinnabar-01/02/03`

**Net disposition:**
- **4 production-ready** generated marks (all cinnabar — clean colored fringes).
- **6 needing cleanup** before production (the high-value matte assets currently in
  live CSS vars + the 2 hard-coded in `SwordArtRegister.vue`).
- **3 prototype-only** (remaining matte candidates not yet wired).
- **6 rejected** (weak silhouettes or redundant after cleanup).
- The **swordsmanship-v2 slash dividers and slip/hero art are clean** and production-grade.
- The **purchased-ink pool is the alpha-quality reference standard** the generated pool failed to meet.

No WebGL/TresJS is warranted. Recommended path is CSS/SVG/mask + alpha cleanup.

---

## Production-Ready Assets

All four are **cinnabar** marks. Their semitransparent edge is cinnabar-tinted
(RGB ~209/116/114), not white — it composites correctly on both parchment and dark.
These are the only generated hover-marks that should be promoted into
`assetManifest.ts` and the only ones safe behind the global CSS vars.

| Asset | Why it passes | Fringe RGB | On dark |
|---|---|---|---|
| `generated-active-seal-cinnabar-02.webp` | Already bound to `--jl-active-seal`. Colored fringe. 244×242. | (209,116,115) | clean |
| `generated-active-seal-cinnabar-01.webp` | Candidate for `--jl-active-seal` rotation / corner stamp. 244×255. | (214,125,125) | clean |
| `generated-active-seal-cinnabar-03.webp` | Quietest cinnabar stamp; good for muted active accents. 244×247. | (211,123,122) | clean |
| `generated-active-ring-cinnabar-01.webp` | Only clean *ring*; ideal cinnabar active halo for seal-flavored states. 316×328. | (218,136,135) | clean |

From the swordsmanship-v2 group, also production-ready (all clean alpha,
ink-colored/steel-blue fringes):

| Asset | Role |
|---|---|
| `swordsmanship-divider-slash-01/02/03.webp` | `SectionDivider` `motif=blade` — clean steel-blue fringe; glow-on-dark is the *intended* blade light, not matte. |
| `swordsmanship-caged-sparrow-slip-art-960.webp` | `ManualSlip` hero illustration (opaque, cropped not matted). |
| `swordsmanship-hero-mist-bg.webp` | Opaque hero atmosphere wash (DESIGN §5.1.1, not an alpha asset). |

---

## Assets Requiring Cleanup

These are the **six white-matte assets currently wired into live code.** They must be
alpha-cleaned (premultiplied / de-matted) before any dark-surface or dark-mode exposure
is acceptable. On parchment they're fine *today*; that is a fragile accident of the
palette, not a property of the asset.

| Asset (in use) | Wired via | Fringe RGB | Cleanup |
|---|---|---|---|
| `generated-hover-brush-soft-02.webp` | `--jl-hover-brush` (global; InkTextButton, InkHoverLink, InkActiveTab) | (191,191,191) | **de-matte** + trim noisy bbox (empty% only 41) |
| `generated-underline-ink-thin-03.webp` | `--jl-active-underline` (global; BrushUnderline, InkButton, InkHoverLink, InkActiveTab, InkDivider) | (194,194,195) | **de-matte** |
| `generated-active-ring-gray-01.webp` | `--jl-active-ring` (global; InkTextButton mark-ring) | (203,204,204) | **de-matte** |
| `generated-active-seal-cinnabar-02.webp` | `--jl-active-seal` (global) | clean — **no cleanup** | — *(listed for context; actually production-ready)* |
| `generated-underline-ink-thin-04.webp` | hard-coded in `SwordArtRegister.vue:228` | (193,193,194) | **de-matte** or replace with thin-03 |
| `generated-hover-brush-soft-01.webp` | hard-coded in `SwordArtRegister.vue:279` | (191,191,191) | **de-matte** |

**De-matte procedure (for 35D-1, not now):** premultiply RGB by alpha against a
*transparent* (not white) key, or re-key on black for the gray/ink marks so the fringe
inherits the ink color. Cinnabar marks already behave correctly and need no change.
Equivalent: replace each with a clean SVG stroke filtered through `feTurbulence`+
`feDisplacementMap` (the `BrushUnderline` spec in DESIGN §7.5 already calls for
"generated SVG" — the raster fallback is what drifted).

**Three further cleanup-eligible candidates** (matte but not yet wired, good silhouettes
worth salvaging rather than rejecting): `generated-hover-brush-soft-03`,
`generated-hover-brush-soft-04` (densest brush, strongest silhouette),
`generated-active-ring-black-01` (best ring silhouette after the gray).

---

## Prototype-Only Assets

Matte, but lower-value silhouettes. Keep in the dev/prototype pool (`/dev/` pages
already use some); do not promote to manifest without de-matte. Useful as
**reference shape language** for the eventual SVG regeneration.

- `generated-underline-ink-thin-01/02/05/06` — variant underline weights, all matte. Keep one as a shape reference.
- `generated-hover-blot-gray-01`, `generated-hover-blot-ink-01` — matte compact blots; usable only as empty-state watermarks on parchment at ≤0.06 opacity (DESIGN §5.1.10), never on dark.
- `generated-active-ring-black-02` — weaker ring silhouette than `black-01`.

---

## Rejected Assets

None of these are wired or worth salvaging — redundant, weak, or wrong-material per
DESIGN §4:

- **All remaining matte rings/blots not named above** — duplicate silhouettes of cleaner candidates.
- **`hover-blot-*` as hover ornament** — violates DESIGN §5.1.7 "hover ornament is decorative, not informational" only if used as primary feedback; as discrete hover marks they read as smudges. Reject from the hover-marks role; demote to texture/empty-state only.
- The 30E-1 rejection log already correctly dropped 6 sprites (duplicate-like, weak) — those decisions stand.

> **No purchased-ink assets are rejected.** Every one sampled (`title-stroke-long-06`,
> `divider-thin-01`, `title-long-01`, `divider-rough-01/02`, `wash-cloud-soft-03`,
> `mountain-smear-01`, `corner-stain-04`) has a clean ink-colored fringe (glow-on-dark
> 27–40, fringe RGB 114–151 dark). The purchased pool is the alpha-quality reference
> standard the generated pool failed to meet.

---

## Per-Asset Quality Detail (objective alpha data)

**Generated hover-marks** — `semi%` = semitransparent-fringe pixel %; `edgeRingA` =
mean alpha along 2px ring inside content bbox; `MATTE` flag = neutral-and-bright
fringe brighter than core.

| asset | W×H | α min/max | opaque% | empty% | semi% | edgeRingA | fringe RGB | core RGB | verdict |
|---|---|---|---|---|---|---|---|---|---|
| active-ring-black-01 | 338×342 | 0/255 | 20.3 | 69.8 | 9.9 | 14 | (199,200,200) | (71,72,73) | MATTE |
| active-ring-black-02 | 324×340 | 0/255 | 22.4 | 69.4 | 8.2 | 10 | (197,197,198) | (72,73,74) | MATTE |
| active-ring-cinnabar-01 | 316×328 | 0/255 | 21.1 | 68.9 | 9.9 | 14 | (218,136,135) | (194,65,60) | clean |
| active-ring-gray-01 | 344×346 | 0/255 | 16.7 | 68.7 | 14.6 | 12 | (203,204,204) | (153,154,154) | MATTE |
| active-seal-cinnabar-01 | 244×255 | 0/255 | 41.2 | 41.4 | 17.4 | 72 | (214,125,125) | (188,47,45) | clean |
| active-seal-cinnabar-02 | 244×242 | 0/255 | 33.4 | 51.7 | 14.9 | 93 | (209,116,115) | (187,52,49) | clean |
| active-seal-cinnabar-03 | 244×247 | 0/255 | 27.6 | 56.6 | 15.9 | 26 | (211,123,122) | (188,54,51) | clean |
| hover-blot-gray-01 | 222×224 | 0/255 | 36.4 | 48.6 | 15.0 | 17 | (205,205,205) | (126,127,126) | MATTE |
| hover-blot-ink-01 | 235×235 | 0/255 | 52.5 | 43.7 | 3.9 | 11 | (213,214,213) | (102,102,102) | MATTE |
| hover-brush-soft-01 | 419×204 | 0/255 | 25.1 | 42.4 | 32.5 | 4 | (191,191,191) | (154,154,154) | MATTE |
| hover-brush-soft-02 | 396×199 | 0/255 | 39.8 | 41.0 | 19.1 | 5 | (191,191,191) | (125,125,125) | MATTE |
| hover-brush-soft-03 | 392×187 | 0/255 | 36.5 | 42.8 | 20.7 | 7 | (199,199,199) | (138,138,138) | MATTE |
| hover-brush-soft-04 | 414×168 | 0/255 | 42.4 | 49.1 | 8.6 | 6 | (208,208,208) | (92,92,92) | MATTE |
| underline-ink-thin-01 | 396×199 | 0/255 | 51.6 | 39.8 | 8.6 | 5 | (202,202,201) | (125,125,125) | MATTE |
| underline-ink-thin-02 | 369×166 | 0/255 | 10.1 | 46.8 | 43.1 | 3 | (194,194,194) | (161,162,161) | MATTE |
| underline-ink-thin-03 | 384×49 | 0/255 | 28.2 | 57.4 | 14.4 | 30 | (194,194,195) | (69,68,69) | MATTE |
| underline-ink-thin-04 | 394×45 | 0/255 | 25.8 | 59.8 | 14.4 | 10 | (193,193,194) | (50,49,50) | MATTE |
| underline-ink-thin-05 | 386×44 | 0/255 | 25.1 | 59.8 | 15.1 | 29 | (193,193,194) | (63,63,64) | MATTE |
| underline-ink-thin-06 | 345×45 | 0/255 | 20.4 | 59.9 | 19.8 | 24 | (201,201,202) | (92,91,92) | MATTE |

**Purchased ink + swordsmanship-v2** (spot-checked reference assets) — all clean
ink-colored/steel-blue fringes:

| asset | W×H | α min/max | fringe RGB | core RGB | glowOnDark | verdict |
|---|---|---|---|---|---|---|
| ink-title-stroke-long-06 (`--jl-title-brush`) | 1600×585 | 0/255 | (151,151,151) | (29,30,33) | 40 | ink-ok |
| ink-divider-thin-01 (`--jl-divider-ink`) | 1100×403 | 0/255 | (147,147,147) | (29,30,33) | 39 | ink-ok |
| ink-title-stroke-long-01 | 1800×1002 | 0/255 | (140,132,137) | (22,18,23) | 27 | ink-ok |
| ink-divider-rough-01 | 1000×465 | 0/255 | (114,111,112) | (23,23,27) | 29 | ink-ok |
| swordsmanship-divider-slash-01 | 1885×103 | 0/255 | (135,165,187) | (114,148,176) | 75 | ink-ok (blade light) |
| swordsmanship-divider-slash-02 | 1885×74 | 0/255 | (164,189,205) | (153,180,199) | 79 | ink-ok (blade light) |
| swordsmanship-divider-slash-03 | 1885×70 | 0/255 | (128,160,183) | (107,145,176) | 62 | ink-ok (blade light) |
| swordsmanship-caged-sparrow-slip-art | 2244×2804 | — | — | — | — | NO-ALPHA (opaque, cropped not matted) |
| swordsmanship-hero-mist-bg | 2400×1200 | — | — | — | — | NO-ALPHA (opaque, DESIGN §5.1.1) |

---

## Consumption Map (where each wired asset lands)

The four interaction CSS vars are defined **once in `:root`** with **no `.dark` override
and no per-section override** — so the matte halos fire across all 11 section themes and
dark mode.

| CSS variable (`:root`, global) | Bound asset | Consumed by |
|---|---|---|
| `--jl-hover-brush` | `generated-hover-brush-soft-02.webp` (MATTE) | InkTextButton `::before`, InkHoverLink `::before`, InkActiveTab `::before` |
| `--jl-active-underline` | `generated-underline-ink-thin-03.webp` (MATTE) | BrushUnderline, InkButton `::before/::after`, InkHoverLink `::after`, InkActiveTab `::after`, InkDivider |
| `--jl-active-ring` | `generated-active-ring-gray-01.webp` (MATTE) | InkTextButton `mark-ring::after` |
| `--jl-active-seal` | `generated-active-seal-cinnabar-02.webp` (clean) | InkTextButton `mark-seal::after`, InkHoverLink `mark-seal::after`, InkActiveTab `__seal`, PaperSlipCard `has-seal::after` |
| `--jl-title-brush` | `purchased/ink-title-stroke-long-06.webp` (clean) | BrushTitle, SectionDivider `motif=ink` |
| `--jl-divider-ink` | `purchased/ink-divider-thin-01.webp` (clean) | InkDivider |

Additionally hard-coded (bypassing vars) in `SwordArtRegister.vue`:
`generated-underline-ink-thin-04.webp` (line 228), `generated-hover-brush-soft-01.webp`
(line 279) — both MATTE.

---

## Primitive Mapping Table

| Asset | → Primitive | Notes |
|---|---|---|
| `active-seal-cinnabar-02` | **InkHoverLink** (`mark-seal`), **InkActiveTab** (`__seal`), **PaperSlipCard** (`has-seal` corner) | Already consumed; keep. |
| `active-seal-cinnabar-01` | **SealButton** accent / corner stamp | Rotate with 02 for variety. |
| `active-seal-cinnabar-03` | **InkTextButton** (`mark-seal`), **ArchiveTab** active marker | Quietest; good for dense UI. |
| `active-ring-cinnabar-01` | **InkTextButton** (`mark-ring`), active ArchiveTab | Replace gray-ring here once cleaned. |
| `active-ring-gray-01` *(after de-matte)* | **InkTextButton** (`mark-ring`) on parchment-only sections | Or replace with cinnabar ring globally. |
| `hover-brush-soft-02` *(after de-matte)* | **InkTextButton**, **InkHoverLink**, **InkActiveTab** (`::before`) | Global hover wash. |
| `underline-ink-thin-03` *(after de-matte)* | **BrushUnderline**, **InkButton**, **InkHoverLink**, **InkActiveTab**, **InkDivider** | Most-wired asset; highest cleanup priority. |
| `swordsmanship-divider-slash-01/02/03` | **SectionDivider** (`motif=blade`) | Ready. |
| `swordsmanship-caged-sparrow-slip-art-960` | **ManualSlip** (swordsmanship detail) | Ready. |
| `swordsmanship-hero-mist-bg` | **SwordDaoManualHero** atmosphere | Ready (opaque, DESIGN §5.1.1). |
| purchased `title-stroke-long-06` | **BrushTitle**, **SectionDivider** (`motif=ink`) | Already consumed; clean. |
| purchased `divider-thin-01` | **InkDivider** | Already consumed; clean. |

---

## Motion / Interaction Recommendations

Per DESIGN §10 and §5.1.7 (hover ornament: opacity 0.0→0.85, 220–280ms):

- **Brush hover marks** (`--jl-hover-brush`): **opacity fade only.** `scaleX`/`scaleY`
  already used in the components is correct. No drift. Do *not* add ink-wipe mask reveal
  to raster marks — the white matte makes any masked reveal worse, not better.
- **Underline marks** (`--jl-active-underline`): **opacity fade + scaleX expand**
  (already implemented). Correct motion; survives de-matte.
- **Active rings**: **opacity fade only** — these are halos, not wipe reveals. `scale`
  settle is acceptable (already in InkTextButton).
- **Cinnabar seal accents**: **opacity fade + slight scale/rotate** (already implemented)
  — this motion is *earned* per DESIGN §10.1 (seal-stamp family). Keep.
- **Slash dividers**: **`scaleX` blade-line draw** (DESIGN §10.1 "blade line draw") —
  correct as implemented on `/dev/swordsmanship-v2.vue`.
- **Slip art / hero bg**: **static only** (DESIGN §5.1.1 / §7.13 — "slow fade-in on
  enter, no hover").

> The primitives already implement the right motion grammar. The asset problem is
> **alpha quality**, not motion. Fixing motion will not help; de-matting will.

---

## WebGL / TresJS Recommendation

**Not warranted. Recommend CSS/SVG/mask first.**

Reasons, grounded in the source-of-truth files:

1. **PRODUCT.md anti-reference:** "Canvas/WebGL replacing content — the wiki is
   text-first. Visual effects enhance; they never replace readable prose."
2. **DESIGN §10.2 forbids** "Heavy WebGL without purpose (no shader-only hero, no
   canvas-only decoration)" and "Neon effects (glow, blur shadows in saturated colors)."
3. **Design engine §10.5** states GSAP/WebGL is "reserved for future ScrollTrigger-based
   scroll narratives on the home page, **if and only if** the home page redesign calls
   for it. It is not introduced preemptively." Current planned uses: **zero**.
4. **The actual defects are alpha-channel problems on 2D raster marks.** WebGL cannot
   fix a white-matte fringe — it would composite the same bad alpha faster. The fix is a
   2D-image operation (premultiply/de-matte) or SVG regeneration.
5. **The primitives already express all needed motion in CSS** (opacity/scale/scaleX
   transitions with `prefers-reduced-motion` guards). TresJS would add a 3D engine to
   render brush strokes — a category error against the "Sword Manual Folio" material
   grammar (DESIGN §1.3), which is *flat-by-default, depth-by-tone*.

The strongest *legitimate* WebGL candidate would be a single ink-wipe page transition on
the home hero — but DESIGN §10.1 already specifies that as a CSS `opacity+translateY`
ink-reveal. Defer WebGL until a concrete, content-driven need appears (e.g., an
interactive swordsmanship path diagram in `SwordArtRegister`), and even then scope it to
one component, not a global texture system.

---

## Recommended Stage 35D-1 Implementation Plan

Small, reversible passes. **De-matte first, texture-lab second, primitive wiring last** —
do not wire new texture variants until the alpha problem is solved, or 35D ships the same
halos in more colors.

### 35D-1A — Alpha cleanup pass (highest priority, unblocks everything)
- De-matte the 5 wired assets (`brush-soft-02`, `underline-thin-03`, `ring-gray-01`,
  `underline-thin-04`, `brush-soft-01`) + 3 salvage candidates (`brush-soft-03/04`,
  `ring-black-01`).
- Method: premultiply RGB against transparent key, *or* re-key on black for gray/ink
  marks. Re-export as WebP. Keep originals in an `_archive/` subfolder for diff.
- Add an objective alpha-quality gate to the pipeline: reject any asset whose
  semitransparent-fringe RGB is neutral-and-brighter-than-core (>+25, abs >175). This is
  the test that would have caught all 15 matte assets automatically.
- Output: 8 clean WebPs replacing the matte ones in place (same filenames → no
  CSS/primitive changes needed).

### 35D-1B — Asset manifest expansion
- Promote the 4 cinnabar marks + the clean swordsmanship-v2 slash/slip/hero assets into
  `assetManifest.ts` as typed `AssetEntry` records with correct `role`
  (`hover-ornament`, `section-divider`, `seal-stamp`, `hero-atmosphere`, `card-art`).
  The manifest currently has **zero** entries for these UI-texture roles — they're all
  hard-coded URL strings, which is exactly the "scan a folder and pray" anti-pattern
  DESIGN §6 was written to end.

### 35D-1C — Texture lab page
- A `/dev/texture-lab` route that renders every manifest UI-texture asset on 3 surfaces
  (checkerboard, parchment `#f7f1e4`, dark `#0f1011`) at the *actual rendered sizes* the
  primitives use (e.g., underline at 0.64rem height, seal at 2rem). This is the
  regression-test surface that 30E-1 lacked — it judged on a contact sheet, not
  in-component on dark.

### 35D-1D — Primitive texture prototype
- Wire the de-matted variants into one reference primitive (suggest `BrushUnderline`,
  since `--jl-active-underline` is the most-wired var) behind the texture lab, verify
  zero halo on dark + parchment + reduced-motion.

### 35D-1E — Global var governance
- Decide whether `--jl-hover-brush / active-underline / active-ring / active-seal` stay
  **global** (one asset, all sections — current) or become **per-section** (11 variants
  tinted to each section seal/accent per DESIGN §2). The design engine §7.5 says
  `BrushUnderline` "tints to section accent," which the CSS currently achieves via
  `filter: hue-rotate` *on top of* a global gray asset — a fragile substitute for
  per-section tinted source assets. This is a Stage 35D decision, not 35D-0.

---

## Final Recommendation

**Do not implement yet — this is the audit gate.** When 35D-1 begins:

1. **Fix alpha first (35D-1A).** Single highest-leverage action: 8 de-matte operations
   unblock every primitive that uses these vars, eliminate the dark-mode halo, and cost
   no design rework. Until this is done, the generated hover-marks are functionally
   parchment-only.
2. **Treat the 4 cinnabar marks as the only fully-trustworthy generated assets.** They
   are the proof that the generation pipeline *can* produce clean alpha when the source
   key is colored rather than luminance-based — use them as the quality bar for all
   future generation.
3. **Promote into the manifest (35D-1B), not into raw CSS.** Stop hard-coding
   `url('/images/ui/generated/...')` in component files (`SwordArtRegister.vue` does this
   twice); route through the manifest so a future cleanup doesn't require grepping `.vue`
   files.
4. **No WebGL.** CSS/SVG/mask is the correct and sufficient layer. Revisit only if a
   specific component (e.g., an interactive sword-path diagram) earns it.
5. **Add the alpha-quality gate** so the next generation batch (35B targets call for 8+
   section dividers, 12+ textures) cannot reintroduce white-matte assets.

The purchased-ink pool and the swordsmanship-v2 group demonstrate the target quality; the
hover-marks group is ~21% there (4/19 clean) and needs the de-matte pass before Stage 35D
material/texture integration can responsibly proceed.
