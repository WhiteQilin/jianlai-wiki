# Stage 35C-2 — Full Primitive Adoption Audit

**Status:** Audit complete. No files edited, staged, or committed.
**Date:** 2026-06-23
**Scope:** Full Nuxt frontend audit for remaining generic UI patterns, ad-hoc duplicate components, old primitive candidates, and section surfaces that still violate the Jian Lai Frontend Design Engine.

**Sources of truth:**
- `PRODUCT.md`
- `DESIGN.md`
- `plans/jianlai-frontend-design-engine.md`
- `plans/stage-35c-0-ui-primitive-foundation-audit.md`
- `plans/stage-35c-1c-characters-design-gap-audit.md`

---

## Executive Summary

The Jian Lai Wiki frontend has **9 verified production-ready primitives** in `app/components/ui/` (per Stage 35C-0). However, only **3 of 12 section pages** reach any primitive directly. The remaining 9 pages and the homepage are built entirely on legacy hand-rolled components. The Characters section received targeted primitive adoption in Stage 35C-1C (DossierCard → PaperSlipCard + ImageWashFrame + CinnabarTag; SealBadge → UiSealStamp in relationship panels). But the other 10 sections, the homepage, and shared components (EntryDetail, EntryInfobox, EntryRelationshipPanel, CategoryTabs) remain largely untouched.

**Overall adoption rate:** ~18% of surfaces use primitives directly. The remaining 82% rely on hand-rolled CSS that duplicates primitive behavior with ad-hoc borders, custom pills, raw img tags, and generic button styles.

**Two orphan components** (Counter.vue, Alert.vue) exist and should be deleted. **Two legacy components** (SealBadge, InkDivider-root) have active consumers and need cross-section migration before retirement.

---

## High-Priority Generic UI Remaining

### P0 — Thin-border cards (Failure Mode #1 of the design engine)

| Surface | Current | Target |
|---------|---------|--------|
| `CharactersDossierStrip.vue` `.dossier-sheet` | 1px border + hover lift + border-color transition | `PaperSlipCard accent sealCorner lift` |
| `CharactersArchiveList.vue` `.archive-row` | 1px `var(--c-divider)` border + translateX hover | `PaperSlipCard` (override hover to translateX) |
| `CharactersAffiliationClusters.vue` `.cluster-card` | 1px border + left accent bar | `PaperSlipCard` with custom left-accent slot |
| `FactionSeatLedger.vue` `.seat-group` | 1px border + left accent bar | Same as above |
| `WorldLocationClusters.vue` `.cluster-card` | 1px border + left accent bar | Same as above |
| `WorldHeavenLedger.vue` `.heaven-sheet` | 1px border + left-border accent + ambient shadow | `PaperSlipCard` |
| `cultivation/index.vue` `.archive-card` | 1px solid border + hand-rolled status span | `PaperSlipCard` + `CinnabarTag` |
| `timeline/index.vue` `.era-parent-card` | Thin border card | `PaperSlipCard` |
| `rankings/index.vue` `.rankings-hero` | Custom frame/mark card | `PaperSlipCard` |

### P0 — Naked image frames

| Surface | Current | Target |
|---------|---------|--------|
| `FeaturedSpotlight.vue` | Raw `<img>` + `height: 200px` + manual gradient overlay | `ImageWashFrame aspect="16:9" wash="mist"` |
| `FeaturedSection.vue` | Raw `<img>` + `min-height: 400px` + manual gradient overlay | `ImageWashFrame aspect="16:9" wash="ink"` |
| `EntryMetaPanel.vue` | Raw `<img>` + `aspect-ratio: 4/3` + manual border overlay | `ImageWashFrame` (needs 4:3 aspect added) |
| `swordsmanship/index.vue` `.tang-plate` | Raw `<img>` + hand-rolled wash/frame/vignette | `ImageWashFrame aspect="4:5" wash="cloth"` |
| `swordsmanship-v2/SwordRecordSlip.vue` | Raw `<img>` + hand-rolled wash/frame/vignette | `ImageWashFrame aspect="4:5" wash="cloth"` |
| `admin/EntryCardPreview.vue` | Raw `<img>` + 3:4/16:9 aspect + object-fit | `ImageWashFrame` |
| `SectionHero.vue` (used by 5 pages) | Raw `<img>` for hero background | `ImageWashFrame` (hero atmosphere role) |

### P0 — Raw status/tag chips

| Surface | Current | Target |
|---------|---------|--------|
| `EntryInfobox.vue` `.public-badge` / `.public-chip` / `.verification-badge` | Fallback spans when `statusToneFor()` returns null | `CinnabarTag tone="ghost"` |
| `EntryDetail.vue` `.entry-badge` / `.entry-chip` | Hand-rolled pills with rotation | `CinnabarTag` (rotation via wrapper span) |
| `swordsmanship-v3-bladepath.vue` `.bp-tag` | Hand-rolled cinnabar spans | `CinnabarTag` |
| `SwordArtRegister.vue` `.ledger-tags span` | Mono tag labels | `CinnabarTag tone="ghost" size="sm"` |
| `SwordRecordSlip.vue` `.tag-strip span` | Mono tag labels with `#` prefix | `CinnabarTag tone="ghost" size="sm"` |
| `WorldHeavenLedger.vue` `.sheet-status` | Text status label | `CinnabarTag tone="ghost" size="sm"` |
| `cultivation/index.vue` `.archive-card-status` | Hand-rolled status span | `CinnabarTag` |

### P0 — Generic filter/tab buttons

| Surface | Current | Target |
|---------|---------|--------|
| `CategoryTabs.vue` (used by 5+ pages) | Hand-rolled `.tab-btn` with solid fill active state | `LedgerTab variant="compact" tone="section"` |
| `rankings/index.vue` `.rankings-filter-button` | Hand-rolled filter with count badge | `LedgerTab tone="section"` with `count` prop |
| `WorldGazetteerArchive.vue` `.category-tab` | Hand-rolled category buttons | `LedgerTab variant="compact" tone="section"` |
| `FactionCompactArchive.vue` `.category-tab` | Same pattern | `LedgerTab variant="compact" tone="section"` |
| `SwordArtRegister.vue` `.filter-btn` | Hand-rolled filter with custom underline | `ArchiveTab` or `LedgerTab` |

### P0 — CTA buttons

| Surface | Current | Target |
|---------|---------|--------|
| `contribute.vue` `.cta-button` (3×) | Seal-red filled buttons | `SealButton` |
| `EmptyArchiveState.vue` `.contribute-link` | Bordered CTA | `InkButton tone="cinnabar"` |
| `EntryReferenceBlock.vue` `.contribute-link` | Inline text link | `InkTextButton` |
| `rankings/index.vue` `.rankings-empty-action` | Solid fill button | `SealButton size="sm"` |
| `SwordRecordSlip.vue` `.open-record` | Monospace CTA | `InkButton tone="section"` |

### P0 — Section dividers

| Surface | Current | Target |
|---------|---------|--------|
| 8 section index pages | `InkDivider type="brush"` (legacy root component) | `SectionDivider` with section-appropriate motif |
| `EntryDetail.vue` (4×) | `OrnamentalDivider motif="jade"/"diamond"` | `SectionDivider motif="ink"/"seal"` (per section) |
| `swordsmanship/index.vue` (3×) | `.bp-hamon` hand-rolled dividers | `SectionDivider motif="blade"` |
| `timeline/index.vue` | `.era-group-divider` + `.timeline-end-mark` | `SectionDivider` |

---

## Medium-Priority Primitive Adoption Targets

### P1 — Section headings without BrushUnderline

| Surface | Heading |
|---------|---------|
| `EntryRelationshipPanel.vue:51` | `<h2>Relationships & Related Entries</h2>` |
| `EntryReferenceBlock.vue:34` | `<h2>Verification Notes</h2>` |
| `RealmLadder.vue:37` | `<h2>Qi Refiner Realm Ladder</h2>` |
| `CultivationPathComparison.vue:41` | `<h2>Path comparison</h2>` |
| `swordsmanship/index.vue` (4×) | `.bp-zone-title` h2 elements |
| `cultivation/index.vue:127` | `<h2>Cultivation archive</h2>` |
| `timeline/index.vue:155` | Era group h2 titles |

### P1 — SealBadge → UiSealStamp migration (10 remaining sites)

All 10 SealBadge consumers use `variant="outline"` or `variant="filled"` with `shape="square"` — these map directly to `UiSealStamp variant="outline"/"filled"`. The migration is mechanical:

| File | Line | Current | Target |
|------|------|---------|--------|
| `app/pages/index.vue` | 149 | `SealBadge text="卷" variant="filled" shape="square"` | `UiSealStamp variant="filled"` |
| `app/components/WikiNotice.vue` | 11 | `SealBadge text="印" variant="outline" shape="square"` | `UiSealStamp variant="outline"` |
| `app/components/SectionHero.vue` | 36 | `SealBadge variant="outline" shape="square"` | `UiSealStamp variant="outline"` |
| `app/components/RelatedLinks.vue` | 31 | `SealBadge text="引" variant="outline" shape="square"` | `UiSealStamp variant="outline"` |
| `app/components/MediaGalleryPlaceholder.vue` | 11 | `SealBadge text="影" variant="outline" shape="square"` | `UiSealStamp variant="outline"` |
| `app/components/FeaturedTheatre.vue` | 47 | `SealBadge text="影" variant="outline" shape="square"` | `UiSealStamp variant="outline"` |
| `app/components/FeaturedSpotlight.vue` | 49 | `SealBadge` | `UiSealStamp variant="outline"` |
| `app/components/EntryReferenceBlock.vue` | 31 | `SealBadge text="证" variant="outline" shape="square"` | `UiSealStamp variant="outline"` |
| `app/components/EntryMetaPanel.vue` | 75 | `SealBadge` | `UiSealStamp variant="outline"` |
| `app/components/EmptyArchiveState.vue` | 20 | `SealBadge variant="outline" shape="square"` | `UiSealStamp variant="outline"` |

### P1 — Ad-hoc seal blocks in hero components

Three components render CSS-only seal marks that should use `UiSealStamp`:

| File | Lines | Current | Target |
|------|-------|---------|--------|
| `CharactersAtlasHero.vue` | 75-77 | `.seal-wall` with 4 `<span class="seal-mark">` | `UiSealStamp` decorative |
| `FactionRegistryHero.vue` | 67-68 | `.seal-rack` with up to 8 `<span class="seal-mark">` | `UiSealStamp` decorative |
| `WorldAtlasHero.vue` | 72-73 | `.seal-drift` with 4 `<span class="seal-mark">` | `UiSealStamp` decorative |

---

## Components To Keep Custom

These components are intentionally different from primitives and should not be replaced:

| Component | Reason |
|-----------|--------|
| `CharactersRelationshipPreview.vue` | SVG node web visualization — no primitive equivalent. Only needs `BrushUnderline` on H2. |
| `CharactersAffiliationClusters.vue` `.member-chip` | Compound link-chip with seal prefix — richer than `CinnabarTag`. |
| `CharacterHero.vue` | Full-viewport cinematic video hero with Ken Burns — no primitive equivalent. |
| `NameBlock.vue` | English + Chinese + pinyin + seal stamp — well-built composite. |
| `SectionHero.vue` | Full-bleed hero with video/image fallback — keep but adopt `ImageWashFrame` for the image layer. |
| `TimelineCinematicHero.vue` | Full-viewport hero with 4-layer gradient mask — intentionally different. |
| `HeroMedia.vue` | Homepage hero with video/image switching — intentionally different. |
| `EntryInfobox.vue` | Structurally complex aside widget — keep but adopt `CinnabarTag` for status fields. |
| `EntryDetail.vue` | Shared shell abstraction — architecturally correct. Only swap dividers and tag spans. |
| `OrnamentalDivider.vue` | Decorative divider with jade/lotus/ruyi/diamond motifs — different purpose from `SectionDivider`. |
| `content/LoreCard.vue` | Semantically distinct prose callout — not a generic card. |
| `content/ImageFrame.vue` | Content body image frame with grayscale-to-color hover — different purpose from `ImageWashFrame`. |
| `MediaCreditFrame.vue` / `MediaBanner.vue` | Attribution-focused media components — different purpose. |
| `swordsmanship-v2/*` (all 6 components) | Custom design system with hardcoded rgba colors — keep as-is for the dev prototype. |
| `rankings/*` (all components) | Rankings-specific CSS variable system — keep but adopt primitives where they fit. |
| `admin/*` (all components) | Admin-only CRUD widgets — out of scope for public primitive adoption. |

---

## Remaining Legacy / Duplicate Components

| File | Issue | Action |
|------|-------|--------|
| `app/components/Counter.vue` | Orphan — zero references | **DELETE** |
| `app/components/Alert.vue` | Orphan — zero references | **DELETE** |
| `app/components/InkDivider.vue` (root) | Legacy divider — 8 page consumers | **MIGRATE** consumers to `ui/SectionDivider`, then delete |
| `app/components/ui/InkDivider.vue` | Design-system divider — 1 consumer (preview) | **KEEP** — part of the primitive set |
| `app/components/SealBadge.vue` | Legacy seal — 10 consumers | **MIGRATE** to `ui/SealStamp`, then delete |
| `app/components/CategoryTabs.vue` | Hand-rolled tab strip — 5+ page consumers | **MIGRATE** to `LedgerTab`, then delete |
| `app/components/FeaturedDossier.vue` | Already deleted | **CONFIRMED CLEAN** |
| `app/components/CharacterInfobox.vue` | Already deleted | **CONFIRMED CLEAN** |

---

## Section-by-Section Findings

### Homepage (`index.vue`)
- **Primitives used:** None directly. `OrnamentalDivider` (legacy), `SealBadge` (legacy), `OrnamentalButton` (legacy).
- **Gaps:** No `BrushUnderline`, no `PaperSlipCard`, no `ImageWashFrame`, no `SectionDivider`, no `CinnabarTag`. Raw `<img>` for logo. Hand-rolled `.btn-primary`/`.btn-secondary` CSS (dead code).
- **Child components:** `HeroMedia`, `ArchivePortal`, `FeaturedSpotlight`, `FeaturedTheatre`, `FeaturedSection` — all legacy, zero primitives.

### Characters (`characters/index.vue` + `[...slug].vue`)
- **Primitives used:** `BrushUnderline` (via children), `LedgerTab` (ArchiveList), `UiSealStamp` (Infobox, RelationshipPanel, RelatedEntries), `PaperSlipCard` + `ImageWashFrame` + `CinnabarTag` (via DossierCard).
- **Gaps:** `InkDivider` instead of `SectionDivider`. `CharactersAtlasHero` uses no primitives (hero stats ledger violates Failure Mode #2). `CharactersDossierStrip` `.dossier-sheet` is a thin-border card.
- **Status:** Best-adopted section. Stage 35C-1C completed P1 items.

### World (`world/index.vue`)
- **Primitives used:** None. `InkDivider type="brush"` (legacy).
- **Gaps:** All `World*` child components use zero primitives. `WorldAtlasHero` has ad-hoc `.seal-drift` CSS seals. `WorldLocationClusters` has thin-border `.cluster-card`. `WorldHeavenLedger` has thin-border `.heaven-sheet` + hand-rolled chips. `WorldGazetteerArchive` has hand-rolled `.category-tab` filters.
- **Status:** Completely unadopted.

### Cultivation (`cultivation/index.vue`)
- **Primitives used:** None. `InkDivider type="brush"` (legacy).
- **Gaps:** Hand-rolled hero. `CategoryTabs` (thin-border). Hand-rolled `.archive-card` with `border: 1px solid`. Raw `<span class="archive-card-status">`. `CultivationPathComparison` and `RealmLadder` use no primitives. No `BrushUnderline` on section H2s.
- **Status:** Completely unadopted.

### Swordsmanship (`swordsmanship/index.vue`)
- **Primitives used:** `CinnabarTag` (4×), `InkButton` (1×). `LedgerTab` imported but unused.
- **Gaps:** Raw `<img>` in `.tang-plate` (not `ImageWashFrame`). Hand-rolled `.bp-hamon` dividers (3×). Hand-rolled `.edge-filter` spans. Hand-rolled `.bp-hashtag` spans. No `BrushUnderline` on headings. `LedgerTab` imported but not wired.
- **Status:** Partially adopted. Mixes primitives with hand-rolled equivalents.

### Factions (`factions/index.vue`)
- **Primitives used:** None. `InkDivider type="brush"` (legacy).
- **Gaps:** All `Faction*` child components use zero primitives. `FactionRegistryHero` has ad-hoc `.seal-rack` CSS seals. `FactionSeatLedger` has thin-border `.seat-group`. `FactionCompactArchive` has hand-rolled `.category-tab` filters.
- **Status:** Completely unadopted.

### Artifacts (`artifacts/index.vue`)
- **Primitives used:** `PaperSlipCard` + `ImageWashFrame` + `CinnabarTag` (indirectly via `DossierCard`). `InkDivider type="brush"` (legacy).
- **Gaps:** `SectionHero` uses raw `<img>` + `OrnamentalDivider` + `SealBadge`. `CategoryTabs` (thin-border). No `BrushUnderline`.
- **Status:** Partially adopted via DossierCard only.

### Timeline (`timeline/index.vue`)
- **Primitives used:** `PaperSlipCard` + `ImageWashFrame` + `CinnabarTag` (indirectly via `DossierCard`).
- **Gaps:** Hand-rolled `.era-parent-card` (thin border). Hand-rolled `.era-group-divider` + `.timeline-end-mark`. `CategoryTabs` (thin-border). `TimelineCinematicHero`/`TimelineChronicleRail` use no primitives.
- **Status:** Partially adopted via DossierCard only.

### Rankings (`rankings/index.vue`)
- **Primitives used:** `SectionDivider`, `BrushUnderline`, `CinnabarTag` (indirectly via `RankingLedger`/`RankingRegister`). `InkDivider type="brush"` (legacy — inconsistent).
- **Gaps:** Hand-rolled `.rankings-hero`. Hand-rolled `.rankings-filter-button`. Hand-rolled `.rankings-empty-action` button. Mixed `InkDivider` + `SectionDivider`.
- **Status:** Best-adopted section after Characters. Primitives reach through child components.

### Teachings, Pantheon, Glossary
- **Primitives used:** `PaperSlipCard` + `ImageWashFrame` + `CinnabarTag` (indirectly via `DossierCard`). `InkDivider type="brush"` (legacy).
- **Gaps:** Near-identical generic templates: `SectionHero` (raw `<img>` + `SealBadge`), `CategoryTabs` (thin-border), no `BrushUnderline`.
- **Status:** Byte-for-byte structural clones. Prime candidates for a shared primitive-backed layout.

### Shared EntryDetail pages
- **Primitives used:** `UiSealStamp` (Infobox, RelationshipPanel, RelatedEntries), `PaperSlipCard` + `ImageWashFrame` + `CinnabarTag` (via DossierCard).
- **Gaps:** `OrnamentalDivider` (4×) instead of `SectionDivider`. `EntryDetail.vue:162-164` hand-rolled `.entry-badge`/`.entry-chip`. `EntryInfobox.vue:268-269,322` fallback `.public-badge`/`.public-chip`/`.verification-badge` spans.
- **Status:** Partially adopted. EntryDetail shell needs divider + tag migration.

---

## Recommended Stage 35C-3 Implementation Plan

Each pass is small, reversible, and targets one pattern across all surfaces.

### 35C-3A — Orphan Cleanup + Divider Migration

**Exact files to change:**
- DELETE `app/components/Counter.vue`
- DELETE `app/components/Alert.vue`
- CHANGE `app/pages/characters/index.vue:458` — `InkDivider type="brush"` → `SectionDivider motif="ink"`
- CHANGE `app/pages/world/index.vue:318` — `InkDivider type="brush"` → `SectionDivider motif="atlas"`
- CHANGE `app/pages/factions/index.vue:446` — `InkDivider type="brush"` → `SectionDivider motif="ledger"`
- CHANGE `app/pages/rankings/index.vue:176` — `InkDivider type="brush"` → `SectionDivider motif="ledger"`
- CHANGE `app/pages/cultivation/index.vue:161` — `InkDivider type="brush"` → `SectionDivider motif="ink"`
- CHANGE `app/pages/teachings/index.vue:66` — `InkDivider type="brush"` → `SectionDivider motif="doctrine"`
- CHANGE `app/pages/pantheon/index.vue:66` — `InkDivider type="brush"` → `SectionDivider motif="doctrine"`
- CHANGE `app/pages/glossary/index.vue:66` — `InkDivider type="brush"` → `SectionDivider motif="ink"`
- CHANGE `app/pages/artifacts/index.vue` — `InkDivider type="brush"` → `SectionDivider motif="seal"`
- CHANGE `app/pages/timeline/index.vue` — `InkDivider type="brush"` → `SectionDivider motif="ink"`

**Files to avoid:** `app/components/ui/InkDivider.vue` (keep), `app/components/OrnamentalDivider.vue` (keep), `app/components/InkDivider.vue` (keep until all consumers migrated)

### 35C-3B — SealBadge → UiSealStamp Migration

**Exact files to change:**
- CHANGE `app/pages/index.vue:149` — `SealBadge` → `UiSealStamp variant="filled"`
- CHANGE `app/components/WikiNotice.vue:11` — `SealBadge` → `UiSealStamp variant="outline"`
- CHANGE `app/components/SectionHero.vue:36` — `SealBadge` → `UiSealStamp variant="outline"`
- CHANGE `app/components/RelatedLinks.vue:31` — `SealBadge` → `UiSealStamp variant="outline"`
- CHANGE `app/components/MediaGalleryPlaceholder.vue:11` — `SealBadge` → `UiSealStamp variant="outline"`
- CHANGE `app/components/FeaturedTheatre.vue:47` — `SealBadge` → `UiSealStamp variant="outline"`
- CHANGE `app/components/FeaturedSpotlight.vue:49` — `SealBadge` → `UiSealStamp variant="outline"`
- CHANGE `app/components/EntryReferenceBlock.vue:31` — `SealBadge` → `UiSealStamp variant="outline"`
- CHANGE `app/components/EntryMetaPanel.vue:75` — `SealBadge` → `UiSealStamp variant="outline"`
- CHANGE `app/components/EmptyArchiveState.vue:20` — `SealBadge` → `UiSealStamp variant="outline"`

**Files to avoid:** `app/components/SealBadge.vue` (keep until all consumers migrated, then delete in 35C-3J)

### 35C-3C — CategoryTabs → LedgerTab Migration

**Exact files to change:**
- CHANGE `app/components/CategoryTabs.vue` — Replace entire component internals with `LedgerTab variant="compact" tone="section"` loop

(This single change propagates to all 5+ consumer pages: artifacts, timeline, teachings, pantheon, glossary, cultivation)

**Files to avoid:** None — `CategoryTabs.vue` is the single source

### 35C-3D — CinnabarTag Adoption (EntryDetail + EntryInfobox fallbacks)

**Exact files to change:**
- CHANGE `app/components/EntryDetail.vue:162-164` — `.entry-badge`/`.entry-chip` → `CinnabarTag`
- CHANGE `app/components/EntryInfobox.vue:268-269,322` — `.public-badge`/`.public-chip`/`.verification-badge` → `CinnabarTag tone="ghost"`

**Files to avoid:** `app/components/EntryInfobox.vue` lines 262-266 (already using CinnabarTag correctly)

### 35C-3E — CTA Button Migration

**Exact files to change:**
- CHANGE `app/pages/contribute.vue:27,33,39` — `.cta-button` → `SealButton`
- CHANGE `app/components/EmptyArchiveState.vue:28` — `.contribute-link` → `InkButton tone="cinnabar"`
- CHANGE `app/components/EntryReferenceBlock.vue:56` — `.contribute-link` → `InkTextButton`
- CHANGE `app/pages/rankings/index.vue:172` — `.rankings-empty-action` → `SealButton size="sm"`

**Files to avoid:** `app/components/OrnamentalButton.vue` (keep for homepage hero CTAs)

### 35C-3F — ImageWashFrame Adoption (Featured + EntryMetaPanel)

**Exact files to change:**
- CHANGE `app/components/FeaturedSpotlight.vue:39,146,152-155,176-180` — raw img + overlay → `ImageWashFrame aspect="16:9" wash="mist"`
- CHANGE `app/components/FeaturedSection.vue:22,58,65,75-79` — raw img + overlay → `ImageWashFrame aspect="16:9" wash="ink"`
- CHANGE `app/components/EntryMetaPanel.vue:54,102,111,115-121` — raw img + overlay → `ImageWashFrame` (add 4:3 aspect if needed)

**Files to avoid:** `SectionHero.vue`, `TimelineCinematicHero.vue`, `HeroMedia.vue`, `CharacterHero.vue` (intentionally different hero treatments)

### 35C-3G — BrushUnderline on Section H2s

**Exact files to change:**
- CHANGE `app/components/EntryRelationshipPanel.vue:51` — add `BrushUnderline tone="section" weight="bold" width="long"`
- CHANGE `app/components/EntryReferenceBlock.vue:34` — add `BrushUnderline tone="section" weight="bold" width="long"`
- CHANGE `app/components/RealmLadder.vue:37` — add `BrushUnderline tone="section" weight="bold" width="long"`
- CHANGE `app/components/CultivationPathComparison.vue:41` — add `BrushUnderline tone="section" weight="bold" width="long"`
- CHANGE `app/pages/swordsmanship/index.vue` (4× `.bp-zone-title`) — add `BrushUnderline`
- CHANGE `app/pages/cultivation/index.vue:127` — add `BrushUnderline`

**Files to avoid:** Hero `<h1>` tags, infobox headings, admin pages

### 35C-3H — Swordsmanship Page Primitive Cleanup

**Exact files to change:**
- CHANGE `app/pages/swordsmanship/index.vue` — `.tang-plate` raw img → `ImageWashFrame`, `.bp-hamon` dividers → `SectionDivider motif="blade"`, `.edge-filter` spans → `LedgerTab`, `.bp-hashtag` spans → `CinnabarTag`

**Files to avoid:** `swordsmanship-v2/*` (dev prototype), `dev/swordsmanship-v3-bladepath.vue` (dev prototype)

### 35C-3I — CharactersDossierStrip PaperSlipCard Adoption

**Exact files to change:**
- CHANGE `app/components/CharactersDossierStrip.vue:175-184` — `.dossier-sheet` → `PaperSlipCard accent sealCorner lift` wrapping the inner content

**Files to avoid:** `DossierCard.vue` (already adopted), `CharactersRelationshipPreview.vue` (intentionally different)

### 35C-3J — Legacy Component Retirement

**Exact files to change:**
- DELETE `app/components/SealBadge.vue` (all 10 consumers migrated in 35C-3B)
- DELETE `app/components/InkDivider.vue` (all 11 consumers migrated in 35C-3A)
- DELETE `app/components/CategoryTabs.vue` (all consumers migrated in 35C-3C)

**Files to avoid:** `app/components/ui/InkDivider.vue` (keep), `app/components/OrnamentalDivider.vue` (keep)

---

## Final Recommendation

**Proceed to Stage 35C-3 implementation in the order above (3A → 3J).** Each pass is independently buildable and reversible. The highest-ROI passes are:

1. **35C-3A** (divider migration) — eliminates the most widespread legacy pattern (11 pages), zero visual risk.
2. **35C-3C** (CategoryTabs → LedgerTab) — single-file change that propagates to 5+ pages.
3. **35C-3B** (SealBadge → UiSealStamp) — resolves the longest-standing component duplication.
4. **35C-3D** (CinnabarTag fallbacks) — fixes the most visible status/tag inconsistency in EntryDetail/EntryInfobox.

The Characters section (35C-1C) and Rankings section are the adoption leaders. World, Factions, and Cultivation are the most unadopted sections and will require dedicated passes in 35C-4+ for their bespoke child components. The swordsmanship-v2 dev prototype should remain untouched — it's an active design exploration, not a production surface.

**Do not implement yet.** Awaiting confirmation to proceed.
