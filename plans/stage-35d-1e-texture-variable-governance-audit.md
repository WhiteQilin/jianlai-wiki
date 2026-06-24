# Stage 35D-1E — Texture Variable Governance Audit

**Stage:** 35D-1E (governance audit before further texture-backed work)
**Date:** 2026-06-24
**Branch:** `feat/full-primitive-adoption-audit`
**Mode:** Read-only audit. No files edited, no files staged, no commits.

---

## Executive Summary

The Jian Lai design system currently delivers UI texture assets through **four different mechanisms** with no governing rule: global CSS variables, hard-coded URLs in components, manifest lookups, and CSS variable fallback inside primitives. This creates a consistency risk as Stage 35D adds more texture-backed primitives.

**Recommendation: Hybrid D — manifest as source of truth + CSS variables as the delivery runtime + optional `textureId` prop override for dev/prototype use.** This preserves the section chapter rule (every page is exactly one chapter's palette), keeps dark-mode overriding possible, gives the dev texture lab a single override path, and avoids importing `assetManifest` into every primitive.

The BrushUnderline prototype (35D-1D) should be **revised** to use this hybrid pattern — CSS variable default with optional `textureId` override — rather than the current manifest-first default. The prototype was useful as a proof of concept; it intentionally skipped the CSS variable fallback to validate manifest resolution. Now the governance rule corrects that imbalance.

---

## Current Texture Delivery Map

### Mechanism 1 — Global CSS Variables (`:root` in `main.css`)

| Variable | Asset | Type | Consumed by |
|---|---|---|---|
| `--jl-hover-brush` | `generated-hover-brush-soft-02.webp` | 💚 cleaned (35D-1A) | InkTextButton `::before`, InkHoverLink `::before`, InkActiveTab `::before` |
| `--jl-active-underline` | `generated-underline-ink-thin-03.webp` | 💚 cleaned (35D-1A) | BrushUnderline, InkButton `::before/::after`, InkHoverLink `::after`, InkActiveTab `::after`, InkDivider |
| `--jl-active-ring` | `generated-active-ring-gray-01.webp` | 💚 cleaned (35D-1A) | InkTextButton `mark-ring::after` |
| `--jl-active-seal` | `generated-active-seal-cinnabar-02.webp` | 💚 native-clean | InkTextButton `mark-seal::after`, InkHoverLink `mark-seal::after`, InkActiveTab `__seal`, PaperSlipCard `has-seal::after` |
| `--jl-title-brush` | `ink-title-stroke-long-06.webp` (purchased) | 💚 native-clean | BrushTitle, SectionDivider `motif=ink` |
| `--jl-divider-ink` | `ink-divider-thin-01.webp` (purchased) | 💚 native-clean | InkDivider |

**Scope:** All declared once in `:root`. No `.dark` overrides. No per-section overrides. No manifest awareness.

### Mechanism 2 — Hard-Coded URLs in Components

| Component | Line | URL | Status |
|---|---|---|---|
| `SwordArtRegister.vue` | 228 | `generated-underline-ink-thin-04.webp` | 💚 cleaned (35D-1A), not manifest-backed |
| `SwordArtRegister.vue` | 279 | `generated-hover-brush-soft-01.webp` | 💚 cleaned (35D-1A), not manifest-backed |

### Mechanism 3 — Manifest Lookup + Inline Style (35D-1D prototype)

| Component | Method | Default | Status |
|---|---|---|---|
| `BrushUnderline.vue` | `getAssetById('asset.ui.underline.ink.thin-03')` → inline `style.backgroundImage` | manifest-first, CSS-var-fallback | **prototype** |

### Mechanism 4 — CSS Variable Fallback (also in 35D-1D prototype)

| Component | Condition | Behavior |
|---|---|---|
| `BrushUnderline.vue` | `textureId === ''` | Falls through to `var(--jl-active-underline)` in CSS |

### Additional Sources of Texture URLs

| Location | Content | Risk |
|---|---|---|
| `_selected-hover-marks.json` | 19 entries with `assetUrl` fields | ✅ dev-only metadata, not consumed at runtime |
| `assetManifest.ts` (35D-1B) | 17 UI texture entries with `filePath`, `role`, `recommendedUse`, `avoidUse` | ✅ source of truth, not yet consumed by most primitives |
| Direct `<img>` in hero/card components | Purchased ink PNGs via `:src` bindings | 💚 OK — opaques/large art, not interaction textures |

---

## Architecture Comparison

### A. CSS Variables Only

How it works: `main.css :root` declares 6–20 `url('...')` variables. All primitives reference them via `background-image: var(--jl-...)`. Section theming is done by CSS `filter: hue-rotate()`. Dark mode is done by `.dark` block overriding the variable URLs.

**Pros:**
- Single point of change — update one URL in one CSS file and every primitive gets the new asset.
- No JavaScript import overhead in primitives.
- Theme switching (`.dark` class) is a CSS cascade event, zero JS.
- Section tinting via `filter` is purely CSS — no per-section manifest queries.

**Cons:**
- Zero metadata awareness — the CSS variable is a blind URL. `recommendedUse`, `avoidUse`, `stretchRule`, `sectionFit` live in the manifest and are invisible to the CSS runtime.
- No dev-tool discoverability — a developer browsing CSS variables cannot see what role an asset plays, whether it's dark-safe, or what primitive should consume it.
- The existing `filter: hue-rotate()` approach for section tinting is fragile: a "gray" asset hue-rotated into cinnabar still has the gray asset's tonal structure. A true section-cinnabar underline would have red-ink feathering, not grayscale-rotated feathering.
- No protection against the 35D-0 white-matte problem — a bad asset gets pasted into `:root` and every page and every dark surface consumes it.
- `.dark` overrides were never written. The current 6 interaction vars have **no dark-mode counterpart**, meaning the same (now-de-matted) assets serve both light and dark — which works for de-matted ink, but leaves no escape hatch if a future asset needs different contrast on dark.

### B. Direct Manifest Lookup Inside Primitives

How it works: Every primitive imports `getAssetById`, resolves its default texture URL at runtime, and injects it as an inline `style`. CSS variables are bypassed.

**Pros:**
- Type-safe — `getAssetById` returns `AssetEntry | undefined`, and TypeScript catches typos.
- Metadata-rich — the primitive can read `asset.avoidUse`, `asset.sectionFit`, `asset.recommendedUse` and self-document or self-validate.
- Dev override is a single prop (`textureId`).
- The manifest is the single source of truth — an asset that isn't in the manifest cannot be consumed.

**Cons:**
- Manifest is imported into every primitive → 17 imports across 17 primitives. Bundler tree-shaking will deduplicate, but it's a code-smell pattern.
- Section theming becomes complex: a primitive would need to detect `[data-jl-section]`, resolve `sectionFit`, and pick from multiple manifest entries. This is JS logic, not CSS cascade — and it breaks the "section chapter rule is a CSS concern" pattern in DESIGN.md.
- Dark mode requires the primitive to detect `.dark` and resolve a different entry. Again: JS logic for what should be a CSS cascade.
- Runtime style duplication — `background-image` is set via inline `style`, which overrides any CSS `var()`. The CSS variable system becomes dead code in the primitives that adopt this pattern.
- The 35D-1D prototype demonstrates this: `BrushUnderline` now resolves its URL via `getAssetById`, and the `var(--jl-active-underline)` line in CSS is a fallback only when `textureId` is empty. This means two sources of truth for the same URL — the manifest entry and the CSS variable point to the same file, but one can drift.

### C. Section-Scoped CSS Variables

How it works: Instead of `:root { --jl-active-underline: url('thin-03.webp') }`, each section's `[data-jl-section="..."]` block declares its own underline. For example:
```css
[data-jl-section="characters"] { --jl-active-underline: url('underline-cinnabar.webp'); }
[data-jl-section="swordsmanship"] { --jl-active-underline: url('underline-steel.webp'); }
[data-jl-section="glossary"] { --jl-active-underline: url('underline-ink.webp'); }
```

**Pros:**
- The "section chapter rule" (DESIGN §2) propagates naturally — each section's CSS block is the authority for that section's textures.
- Dark mode `.dark [data-jl-section="..."]` covers dark surfaces for each section in one cascade step.
- No JavaScript imports into primitives.
- The CSS cascade is the section-resolver — no JS section-detection logic needed.

**Cons:**
- Requires **11 section-specific assets per texture role** (underline, brush, ring, seal, etc.) — 44+ assets for 4 interaction textures alone. The current asset pool has 4 underline variants total.
- Asset generation pipeline would need to produce section-tinted variants (e.g., cinnabar-tinted underline for Characters, celadon-tinted underline for Swordsmanship). This is a Stage 35B concern, not a 35D concern.
- Increases CSS file size by ~11× for each variable — not yet a problem at 6 variables, but scales linearly.
- Still no metadata awareness in the CSS — same blind-URL problem as Architecture A.

### D. Hybrid: Manifest Source of Truth + CSS Var Delivery + Prop Override

How it works:
1. **The manifest** (`assetManifest.ts`) defines every UI texture asset with `filePath`, `role`, `recommendedUse`, `avoidUse`, `stretchRule`, `sectionFit`.
2. **CSS variables** in `main.css` deliver the **default** URL for each texture role. These are the runtime delivery mechanism. When a manifest entry changes its `filePath`, the CSS variable is updated to match. The manifest is authority; the CSS variable is the delivery pipe.
3. **Primitives** consume CSS variables by default (`background-image: var(--jl-active-underline)`). They accept an optional `textureId` prop that, when set, injects an inline style override — for dev/prototype/QA use only.
4. **Section chapter rule** is enforced by CSS: `[data-jl-section="..."]` overrides the texture variables when section-tinted assets exist. Until those assets are generated (35B), the global default serves all sections.
5. **Dark mode** is enforced by CSS: `.dark [data-jl-section="..."]` overrides when dark-specific assets exist. Until then, the de-matted global assets serve (confirmed safe in 35D-1C texture lab).

**Pros:**
- Single source of truth (manifest), single delivery pipe (CSS variables), single override path (`textureId` prop).
- No manifest imports in primitives except for the override resolution (and only in primitives that offer the `textureId` prop — not all need it).
- Section theming and dark mode stay in CSS where the DESIGN.md expects them.
- The dev texture lab (35D-1C) can test any asset by passing `textureId` to any primitive that supports it.
- Gradual adoption — primitives add the `textureId` prop as the texture lab proves them ready, not all at once.

**Cons:**
- Requires discipline: the CSS variable URL and the manifest `filePath` for the same asset must stay in sync. A CI/lint check can enforce this.
- The "governance" problem shifts to "who keeps CSS vars and manifest in sync" — which is a human process or a build-time generator.

---

## Recommended Governance Model

**Choose Architecture D — hybrid registry + delivery.**

The rule:

1. **The manifest is the source of truth.** Every UI texture asset has exactly one `AssetEntry` in `assetManifest.ts`. An asset not in the manifest cannot be referenced by a CSS variable, a component, or a page. The 35D-0 quality gate (fringe-RGB check) is applied at manifest entry time.

2. **CSS variables are the delivery runtime.** `main.css :root` declares one variable per **texture role** (not per asset), pointing to the default asset's manifest `filePath`. Currently that's 6 variables for 6 roles. Future section-specific variables extend this in `[data-jl-section]` blocks. The text of the comments maps directly to the manifest `id`.

3. **Primitives use CSS variables by default.** `background-image: var(--jl-active-underline)` is the standard pattern. No manifest import in the default render path. This keeps the CSS cascade as the section/dark resolver.

4. **An optional `textureId` prop enables dev override.** Any primitive that accepts a texture background may also accept `textureId: string`. When set, the primitive imports `getAssetById`, resolves the URL, and injects it as an inline style. When empty/default, the CSS variable takes over. This is the exact pattern the 35D-1D BrushUnderline prototype arrived at — but the default must be **CSS variable first, manifest override second**.

5. **Section theming stays in CSS.** When section-tinted assets are generated (35B target), `[data-jl-section="characters"]` blocks override the interaction texture variables. Until then, the global default + CSS `filter` is the accepted interim.

6. **Dark mode stays in CSS.** `.dark [data-jl-section="..."]` blocks override texture URLs when dark-specific assets are needed. Until then, de-matted global assets serve (validated in 35D-1C lab).

---

## Primitive-by-Primitive Rule

| Primitive | Consumes (CSS var) | Role | Should add `textureId` prop? | When |
|---|---|---|---|---|
| **BrushUnderline** | `--jl-active-underline` | underline | ✅ already has it (35D-1D) | **revise**: default to CSS var, override via prop |
| **InkButton** | `--jl-active-underline` | underline | ✅ yes | 35D-2 (after BrushUnderline is finalized) |
| **InkTextButton** | `--jl-hover-brush`, `--jl-active-ring`, `--jl-active-seal` | brush + ring + seal | ✅ yes (3 texture props) | 35D-2 |
| **InkHoverLink** | `--jl-hover-brush`, `--jl-active-underline`, `--jl-active-seal` | brush + underline + seal | ✅ yes | 35D-2 |
| **InkActiveTab** | `--jl-hover-brush`, `--jl-active-underline`, `--jl-active-seal` | brush + underline + seal | ✅ yes | 35D-2 |
| **InkDivider** | `--jl-divider-ink`, `--jl-active-underline` | divider + underline | ⬜ optional | 35D-3 |
| **SectionDivider** | `--jl-title-brush` | title-brush (ink motif) | ⬜ optional | 35D-3 |
| **BrushTitle** | `--jl-title-brush` | title-brush | ⬜ already has `titleBrushSrc` prop | keep as-is |
| **SealButton** | `--jl-active-seal` | seal | ✅ yes | 35D-2 |
| **PaperSlipCard** | `--jl-active-seal` | seal (corner) | ⬜ optional | 35D-3 |
| **ArchiveTab** | (not yet implemented) | seal + underline | ✅ yes (when implemented) | 35D-4 |

**Priority rule:** The 5 primitives that consume interaction textures (hover-brush, active-underline, active-ring, active-seal) should get the `textureId` override prop in Stage 35D-2. The 3 primitives that consume structural textures (divider-ink, title-brush, seal-corner) can get it optionally in 35D-3.

---

## BrushUnderline Prototype Verdict

### Current State (35D-1D)

```vue
<script setup>
import { getAssetById } from '~/utils/assetManifest'
// Default: manifest-first, CSS-var fallback when textureId=''
const textureUrl = computed(() => {
  if (!props.textureId) return ''
  return getAssetById(props.textureId)?.filePath ?? ''
})
</script>
```

**Assessment:** The prototype validated manifest resolution works in a primitive, the `textureId` prop is the right override API, and the inline style injection doesn't break SSR. But the **default direction is wrong**: the default path (`textureId === 'asset.ui.underline.ink.thin-03'`) resolves the manifest entry, which returns the same URL that `--jl-active-underline` already points to. This creates a redundant resolution path and means the CSS variable is dead code in the default case.

### Recommendation: REVISE

Change the default from manifest-first to CSS-var-first:

```
Default behavior: textureId defaults to '' → CSS var takes over
Override behavior: textureId set to a manifest ID → manifest resolves → inline style
```

The prop signature becomes:

```ts
textureId?: string  // default: '' (use CSS var)
```

The computed becomes:

```ts
const textureUrl = computed(() => {
  if (!props.textureId) return ''  // CSS var fallback
  return getAssetById(props.textureId)?.filePath ?? ''  // manifest override
})
```

This is a **2-line change** from the current prototype. All existing consumers work identically (they pass zero props → CSS var takes over → identical visual result). The texture lab or a future section prototype can pass `textureId="asset.ui.underline.ink.thin-04"` to test the alternate.

### Stage for revision: 35D-1F (small follow-up pass before 35D-2)

---

## Section Theme Strategy

### Current State

The 6 interaction CSS variables are declared once in `:root`. All 11 sections consume the same assets, tinted via CSS `filter`:

- `--jl-active-underline` (gray ink underline) → `filter: hue-rotate(-12deg) saturate(1.1) brightness(1.04)` for section accent
- `--jl-active-ring` (gray ring) → `filter: hue-rotate()` for accent
- `--jl-hover-brush` (gray brush) → same

This works but is a stopgap: a hue-rotated gray asset is not the same as a cinnabar-rendered asset. A real cinnabar underline would have red-ink feathering (like the cinnabar seal marks do). The hue-rotate approach treats all textures as grayscale + tint, which is correct for ink marks but incorrect for cinnabar marks.

### Recommended Path

**Stage 35D (this stage):** Keep global defaults + CSS `filter` for all 6 vars. The de-matte pass (35D-1A) made this safe on all backgrounds. Do not add per-section texture variables yet — the asset pool doesn't support them.

**Stage 35B (future asset generation):** When the generation pipeline produces section-tinted variants (11 × underline, 11 × brush, 11 × ring = 33 assets), add `[data-jl-section]` overrides:
```css
[data-jl-section="characters"] {
  --jl-active-underline: url('/images/ui/generated/hover-marks/section-characters-underline.webp');
}
[data-jl-section="swordsmanship"] {
  --jl-active-underline: url('/images/ui/generated/hover-marks/section-swordsmanship-underline.webp');
}
```

The cinnabar vars (`--jl-active-seal`) should **not** get per-section variants — cinnabar is universal per DESIGN §4 (Cinnabar Material: "Seal paste is cinnabar. It does not vary by section. A seal is a seal."). The 4 cinnabar marks in the manifest already serve this role.

### What `data-jl-section` already controls

The existing `main.css` already uses `[data-jl-section="..."]` for 11 section blocks controlling: accent, paper, ink, mist, seal, gold, frame, bg-wash, title-ink, ornament-opacity, and brush-opacity. The interaction texture variables are the **only** design tokens not yet section-scoped. Adding them follows the existing pattern exactly.

---

## Dark Surface Strategy

### Current State

The `.dark` block in `main.css` (line 282–309) overrides the palette tokens (paper, ink, mist, accent) but does **not** override the 6 interaction texture variables. Those are inherited from `:root`. After the 35D-1A de-matte pass, this is **safe**: the cleaned gray/ink assets composite without white halos on `#0f1011` (confirmed in 35D-1C texture lab).

### Recommendations

**Immediate (35D):** No action needed. The de-matted assets are dark-safe. The texture lab (35D-1C) is the ongoing regression-test surface.

**When section-tinted assets exist (35B):** Add `.dark [data-jl-section="..."]` blocks that reference dark-specific or dark-safe texture variants if any section's tinted asset produces insufficient contrast or a visible tint halo on dark.

**Prevent reintroduction of halos:**
1. Every new asset is run through the 35D-0 quality gate (fringe-RGB neutral + brighter-than-core → reject).
2. Every asset is QA'd in the texture lab (35D-1C) on both parchment and dark before being bound to a CSS variable.
3. No asset is bound to `--jl-*` without a corresponding manifest entry documenting `avoidUse` and dark-surface behavior.

**CSS filter limits for dark mode:**
- `brightness()` above 1.4 on dark backgrounds may amplify residual matte fringes → cap at 1.2 for dark-mode filter chains.
- `hue-rotate()` is safe on dark (it preserves the de-matted ink color's relative luminance).
- `saturate()` above 1.5 may reveal chroma noise in semitransparent fringes → cap at 1.3.

---

## Hardcoded Texture URLs To Remove Later

| Location | Line | URL | Replacement |
|---|---|---|---|
| `SwordArtRegister.vue` | 228 | `generated-underline-ink-thin-04.webp` | Use `BrushUnderline` primitive with `textureId="asset.ui.underline.ink.thin-04"` |
| `SwordArtRegister.vue` | 279 | `generated-hover-brush-soft-01.webp` | Use `InkHoverLink` primitive with `textureId="asset.ui.hover.brush.soft-01"` |

Both are swordsmanship-specific component code that predates the primitive set. They should be refactored in Stage 35D-4 (Swordsmanship texture audit), not this stage.

Additionally, the 6 CSS variables themselves contain hardcoded URLs — but those are the **intended** hardcoded URLs (the delivery pipe). They stay. What changes is the governance: when a manifest entry's `filePath` changes, the CSS variable must be updated to match.

---

## Recommended Implementation Plan

### 35D-1F — Revise BrushUnderline to CSS-var-first default

- Change `textureId` default from `'asset.ui.underline.ink.thin-03'` to `''` (empty → CSS var fallback).
- Verify all 12 existing consumers still render correctly.
- Verify `textureId` override still works in the texture lab.
- **Scope:** ~2-line change in `BrushUnderline.vue`. No other files.

### 35D-1G — Add CSS-var ↔ manifest sync comments

- In `main.css`, annotate each of the 6 `--jl-*` texture variables with the corresponding manifest `id`:
  ```css
  /* manifest: asset.ui.underline.ink.thin-03 */
  --jl-active-underline: url('/images/ui/generated/hover-marks/generated-underline-ink-thin-03.webp');
  ```
- This is a one-way sync pointer — the comment documents which manifest entry the CSS var binds to. A future CI lint can verify the `filePath` matches.
- **Scope:** `main.css` only, comments only.

### 35D-2 — Add `textureId` prop to 5 interaction primitives

- `InkButton`, `InkTextButton`, `InkHoverLink`, `InkActiveTab`, `SealButton`.
- Each gets the same pattern: optional `textureId` prop, `getAssetById` resolution, inline style when set, CSS var when empty.
- Each gets one or more role-specific props (`underlineId`, `brushId`, `ringId`, `sealId`) matching the CSS variables it already consumes.
- **Not a design change** — the visual output is identical in the default case. Only the texture lab can exercise the overrides.

### 35D-3 — Add `textureId` prop to 3 structural primitives (optional)

- `InkDivider`, `SectionDivider`, `PaperSlipCard`.
- Lower priority — these consume purchased assets that are already manifest-backed and unlikely to change.

### 35D-4 — Refactor Swordsmanship hardcoded URLs

- Replace `SwordArtRegister.vue` direct `url()` references with primitive invocations.
- **Stage gate:** only after `InkHoverLink` and `BrushUnderline` support `textureId` (35D-2).

### 35B (future) — Generate section-tinted texture variants

- When the asset generation pipeline produces section-tinted underline/brush/ring variants, add `[data-jl-section]` blocks for the 6 interaction CSS variables.
- This is a **CSS-only** change — no primitive changes needed (the CSS-variable-first architecture absorbs it).

---

## Final Recommendation

1. **Adopt Architecture D** — manifest as source of truth, CSS variables as delivery runtime, `textureId` prop as dev override.
2. **Revise BrushUnderline** (35D-1F) to CSS-var-first default — a 2-line change from the current prototype.
3. **Do not add manifest imports to the remaining 7 primitives yet.** That's Stage 35D-2, and it should follow the revised pattern (CSS var default, manifest override).
4. **Keep the 6 global CSS variables as-is for now.** They are the correct delivery mechanism. When section-tinted assets arrive (35B), add `[data-jl-section]` blocks — the architecture is ready for that.
5. **Keep the texture lab as the regression-test surface** for all texture variable changes. Any asset bound to `--jl-*` must render cleanly in the lab on parchment and dark before the binding is committed.
6. **No dark-mode overrides needed** for the current interaction texture variables — the de-matted assets are dark-safe.
7. **No per-section overrides needed** for the cinnabar variables (`--jl-active-seal`) — cinnabar is universal per DESIGN §4.

The current system has 6 CSS variables, 17 manifest entries, and 7 primitives consuming textures. Adopting the hybrid governance model now ensures the next 30+ assets (35B targets) and 10 additional section-tinted variants don't create a fragmented delivery architecture.
