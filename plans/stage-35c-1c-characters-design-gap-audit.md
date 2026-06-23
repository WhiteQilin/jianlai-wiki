# Stage 35C-1C-0 — Characters Section Production Trace + Design Gap Audit

**Status:** Audit complete. No files edited, staged, or committed.
**Routes inspected:** `/characters` (1440px + 390px), `/characters/chen-pingan` (1440px).
**Sources:** `PRODUCT.md`, `DESIGN.md`, `plans/jianlai-frontend-design-engine.md`, `plans/stage-35c-0-ui-primitive-foundation-audit.md`.

---

## 1. Live Characters Component Trace

### 1.1 Production Routes Inspected

| Route | Page file | Notes |
|---|---|---|
| `/characters` | `app/pages/characters/index.vue` | 5 bespoke Components*, all character-scoped |
| `/characters/[...slug]` | `app/pages/characters/[...slug].vue` | Thin data-binding wrapper; delegates rendering to shared `EntryDetail` |

### 1.2 Live Components Used by `/characters`

| Component | File | Role |
|---|---|---|
| Section hero (chapter cover) | `app/components/CharactersAtlasHero.vue:1` | Title, 5-stat ledger, Chinese subtitle, 人物志 watermark |
| Central Records strip | `app/components/CharactersDossierStrip.vue:1` | Top-6 dossier cards in horizontal scroll, hand-rolled `dossier-sheet` card |
| Relationship web | `app/components/CharactersRelationshipPreview.vue:1` | SVG node graph (central node + 8 satellites) + 2-col relationship ledger + mobile cluster fallback |
| Affiliation Clusters | `app/components/CharactersAffiliationClusters.vue:1` | 8 faction clusters, up to 6 member chips per cluster, cluster header with count + faction name link |
| All-records archive | `app/components/CharactersArchiveList.vue:1` | Filterable list (Category × Importance), 35 entries, Falls back to `EmptyArchiveState` |
| Section theme | `app/utils/sectionThemes.ts` | `characters` chapter palette applied via `data-jl-section` attribute |
| Section meta | `app/composables/useSectionMeta.ts` | Hero copy (title, description, Chinese label) |

The page **does not** use any `app/components/ui/*` primitive for its primary surfaces. The hero, cards, clusters, and archive list are all custom components with inline CSS.

### 1.3 Live Components Used by `/characters/[slug]`

| Component | File | Role |
|---|---|---|
| Page wrapper | `app/pages/characters/[...slug].vue:1` | Fetch entry by route path, call `useRelatedEntries`, pass to `EntryDetail` |
| Layout shell | `app/components/EntryDetail.vue:1` | Shared reader for ALL entry types; `section="characters"` activates `CharacterHero`, `MediaGalleryPlaceholder`, and character-specific section nav |
| Cinematic hero | `app/components/CharacterHero.vue:1` | Full-width autoplay muted looping video, Ken Burns slow zoom, watermark character, mute toggle; rendered only when `page.video` exists |
| Image banner fallback | `app/components/MediaBanner.vue` | Used when `page.banner` exists but no video |
| Name block | `app/components/NameBlock.vue` | English name + Chinese (calligraphy font) + pinyin + seal stamp character |
| Infobox (right rail, sticky) | `app/components/EntryInfobox.vue:1` | Section-profile driven; reads `app/data/entryInfoboxProfiles.ts` for characters (lines 37–56): portrait image mode, 14 fields including status, origin, realm, affiliations, key relationships |
| Infobox heading seal | `app/components/ui/SealStamp.vue:1` | **Only `ui/*` primitive** used on the Characters detail page — `variant="carved" size="sm"` for the heading seal character |
| Infobox link resolver | `app/components/RouteDisplayLink.vue` | Resolves entry links to routes; `text`/`chip`/`row` variants |
| Infobox data config | `app/data/entryInfoboxProfiles.ts` | Drives which frontmatter fields render in which style (text / badge / chip / route-link / list / relationship-row / ranking-list) |
| Markdown prose | `<ContentRenderer>` (Nuxt Content) | Long-form entry body; no per-section CSS |
| Table of contents | `app/components/EntrySectionNav.vue` | Auto-generated from page headings; groups by section label |
| Section dividers | `app/components/OrnamentalDivider.vue` | `jade` + `diamond` motifs between `ContentRenderer` sections |
| Relationship panel | `app/components/EntryRelationshipPanel.vue:1` | Structured `relationships[]` frontmatter rows + `RelatedEntries` for computed inverse links |
| Relationship seal | `app/components/SealBadge.vue:1` (**legacy root, NOT `ui/`**) | 联 character mark as section heading seal |
| Related entries | `app/components/RelatedEntries.vue:1` | `DossierGrid` + `DossierCard` for computed related entries grouped by direction |
| Grid wrapper | `app/components/DossierGrid.vue:1` | CSS `auto-fill, minmax(280px, 1fr)` |
| Related card | `app/components/DossierCard.vue:1` | **Hand-rolled ad-hoc card** — 1px border, hover lift, 200px fixed-height image block |
| Media gallery placeholder | `app/components/MediaGalleryPlaceholder.vue` | Characters-only section; currently a placeholder |
| Source notes | `app/components/EntryReferenceBlock.vue` | Verification status, first appearance, last updated |
| Scroll reveal | `app/components/ScrollReveal.vue` | Staggered entrance per section block |
| Related lookup | `app/composables/useRelatedEntries.ts` | Builds `RelatedGroup[]` from outgoing (`relationships[].link`) and inverse (`related[]` cross-references) |

### 1.4 Dev-Only / Old Components

| File | Status | Notes |
|---|---|---|
| `app/components/FeaturedDossier.vue:1` | **Orphan — delete** | Zero `import` or template references in the codebase. Superseded by `CharactersDossierStrip` on index and `DossierCard` on detail. |
| `app/components/CharacterInfobox.vue:1` | **Orphan — delete** | Only referenced by a comment in `EntryMetaPanel.vue:5`. Replaced by the section-aware `EntryInfobox` reading from `entryInfoboxProfiles.ts`. |
| `app/components/SealBadge.vue:1` | **Legacy root — keep but migrate** | Root-level sibling of `ui/SealStamp.vue`. Used by `EntryRelationshipPanel` and `RelatedEntries` for the 联 seal. Design differs from the § 7.11 primitive. |
| `app/components/FeaturedSection.vue`, `FeaturedSpotlight.vue`, `FeaturedTheatre.vue` | **Home page only** | Not in the Characters component tree. Confirmed out of scope. |
| `app/components/EntryMetaPanel.vue` | **Non-character generic** | Used by non-character entry types; not on the Characters path. |

---

## 2. Component Status Summary

| File | Status |
|---|---|
| `app/pages/characters/index.vue` | Live |
| `app/pages/characters/[...slug].vue` | Live |
| `app/components/CharactersAtlasHero.vue` | Live |
| `app/components/CharactersDossierStrip.vue` | Live |
| `app/components/CharactersRelationshipPreview.vue` | Live |
| `app/components/CharactersAffiliationClusters.vue` | Live |
| `app/components/CharactersArchiveList.vue` | Live |
| `app/components/EntryDetail.vue` | Live (shared shell) |
| `app/components/CharacterHero.vue` | Live (characters only) |
| `app/components/NameBlock.vue` | Live (shared) |
| `app/components/EntryInfobox.vue` | Live (shared) |
| `app/components/EntryRelationshipPanel.vue` | Live (shared) |
| `app/components/RelatedEntries.vue` | Live (shared) |
| `app/components/DossierGrid.vue` | Live (shared) |
| `app/components/DossierCard.vue` | Live — **target for primitive migration** |
| `app/components/EntrySectionNav.vue` | Live (shared) |
| `app/components/OrnamentalDivider.vue` | Live (shared) |
| `app/components/MediaGalleryPlaceholder.vue` | Live (characters only) |
| `app/components/EntryReferenceBlock.vue` | Live (shared) |
| `app/components/ScrollReveal.vue` | Live (shared) |
| `app/components/MediaBanner.vue` | Live (shared) |
| `app/components/RouteDisplayLink.vue` | Live (shared) |
| `app/components/ui/SealStamp.vue` | Live primitive — used in `EntryInfobox` only |
| `app/components/SealBadge.vue` | Live legacy — used in `EntryRelationshipPanel`, `RelatedEntries` |
| `app/components/CharacterInfobox.vue` | Old / orphan |
| `app/components/FeaturedDossier.vue` | Old / orphan |
| `app/components/FeaturedSection.vue` | Dev / home page only |
| `app/components/FeaturedSpotlight.vue` | Dev / home page only |
| `app/components/FeaturedTheatre.vue` | Dev / home page only |
| `app/data/entryInfoboxProfiles.ts` | Live (data) |
| `app/utils/sectionThemes.ts` | Live (data) |
| `app/utils/entryLinkResolver.ts` | Live (data) |
| `app/utils/publicMedia.ts` | Live (data) |
| `app/composables/useRelatedEntries.ts` | Live |
| `app/composables/useSectionMeta.ts` | Live |

---

## 3. Current Design Gaps

### Gap 1 — `DossierCard` is the "thin-border generic" the engine bans

`app/components/DossierCard.vue:40-56` renders a 1px `var(--c-border)` solid card with `translateY(-4px)` hover + a soft `rgba(0,0,0,0.05)` box-shadow — the § 1.4 "Failure Mode #1" (the "thin-border generic") exactly. The `PaperSlipCard` primitive (§ 7.7) already exists: paper gradient + mist frame + corner seal mark + opt-in `lift`, with proper a11y (`<article>`, focus ring, reduced-motion safe).

### Gap 2 — `DossierCard` image is a fixed-height block, not the spec's 4:5 card art

`DossierCard.vue:79-85` hard-codes `height: 200px` (≈ 4:3 on a 280px column). The design engine § 5.1.3 specifies 4:5 for `Card Art` with a `0%→80%` gradient fade at 60% of card height. The hand-rolled `linear-gradient(to top, var(--c-bg) 0%, transparent 50%)` overlay at `DossierCard.vue:98-102` is exactly what `ImageWashFrame wash="cloth"` produces automatically.

### Gap 3 — `DossierCard` re-implements `CinnabarTag` for status and category

`DossierCard.vue:161-169` rolls a 0.65rem cinnabar text + `cinnabar-soft` border + `2px` border-radius pill by hand. `CinnabarTag tone="cinnabar" size="sm"` at `app/components/ui/CinnabarTag.vue:1` already covers all five tones with proper a11y (`title` on truncation, `aria-hidden` on the decorative dot, focus ring). The `category` mono text at `DossierCard.vue:153-159` should be `CinnabarTag tone="section" size="sm"`.

### Gap 4 — Two seal components for the same visual job

`app/components/SealBadge.vue:1` (legacy root) and `app/components/ui/SealStamp.vue:1` (modern primitive, § 7.11) are different components serving the same role on the Characters surface. `SealBadge` lacks the § 7.11 `carved`/`outline`/`filled`/`ghost` variants, the full size scale, and writing-mode support. The 联 character mark in `EntryRelationshipPanel.vue:48` and `RelatedEntries.vue:13` should be `UiSealStamp variant="carved" size="sm"`.

### Gap 5 — Filter chips on `CharactersArchiveList` are not `LedgerTab`

`CharactersArchiveList.vue:80-95` renders plain `<button>` elements for Category (All/Character/Gods) and Importance (All/Primary/Major/Minor). These are § 7.4 `LedgerTab` filter affordances. The engine's Stage 35C-0 § 8.2 adoption plan already targets Swordsmanship's filter strip for this primitive — Characters' archive filter is the same pattern and should adopt it too.

### Gap 6 — Section H2s have no `BrushUnderline`

`CharactersAtlasHero.vue`, `CharactersDossierStrip.vue:48`, `CharactersRelationshipPreview.vue`, `CharactersAffiliationClusters.vue`, and `CharactersArchiveList.vue:75` all render raw `<h2>` elements without the § 7.5 `BrushUnderline tone="section" weight="bold" width="long"` accent. Stage 35C-0 § 8.5 already targets this adoption globally; Characters is among the highest-visibility surfaces.

### Gap 7 — Hero stats ledger violates the "hero + grid + stats" ban

`CharactersAtlasHero.vue:49-79` renders 5 hero metrics (35 Dossiers / 18 Verified / 161 Named ties / 8 Largest cluster / 21 Primary) in a small grid. The engine § 1.4 "Failure Mode #2" explicitly bans the "hero + grid + stats" SaaS scaffold. The chapter cover per § 3.1 should be: title + 人物志 watermark + atmospheric wash + a single contextual line. The 5-stat ledger is currently the visual centerpiece; it should be demoted or removed.

### Gap 8 — Infobox portrait uses raw `<img>`, not `ImageWashFrame`

`EntryInfobox.vue` renders the character portrait via raw markup without the 1px ink frame, 4px inner frame at 30% opacity, bronze corner ticks, or cloth wash specified in § 5.1.2. The image is naked against the paper background.

### Gap 9 — Mobile affiliation clusters are dense and compressed

`CharactersAffiliationClusters.vue` renders 6 member chips per cluster × 8 clusters in a single column at 390px. Chips wrap into multi-line clusters; seal marks are too small to read; horizontal spacing collapses. The engine § 3.1 "Ideal index structure" permits a horizontal-scroll strip for the Affiliation Cluster area on mobile.

### Gap 10 — No relationship register; only the relationship web

The engine § 3.1 "Ideal detail structure" calls for relationships as a "hand-drawn margin list" using `RegistryRow`. The current detail page renders `relationships[]` frontmatter as raw text rows inside `EntryRelationshipPanel`, with the inverse/related entries as a `DossierGrid` below. The § 7.12 `RegistryRow` primitive is entirely absent from the Characters surface. (Deferred to 35D+ — requires a new layout component.)

### Gap 11 — Verification and status text are raw, not `CinnabarTag`

`EntryInfobox.vue` footer rows render "Verification: To Be Verified" and "Status: Alive" as plain text. Both are exactly the `CinnabarTag tone="cinnabar"|"jade"|"bronze"` cases described in § 7.6. The Status field in relationship rows (`EntryRelationshipPanel.vue`) has the same gap.

### Gap 12 — `FeaturedDossier.vue` and `CharacterInfobox.vue` are orphans that must be deleted

`FeaturedDossier.vue` is referenced nowhere in the codebase. `CharacterInfobox.vue` is referenced only by a comment (`EntryMetaPanel.vue:5`). Both exist in `app/components/` and risk accidental re-introduction or confusion about which infobox is canonical.

---

## 4. Safe Primitive Adoption Targets

| Surface | Current implementation | Target primitive | File(s) to change |
|---|---|---|---|
| `DossierCard` card shell | Ad-hoc 1px border + hover lift | `PaperSlipCard accent="section" sealCorner lift` | `app/components/DossierCard.vue:1` |
| `DossierCard` image block | Raw `<img>`, `height: 200px`, hand-rolled gradient overlay | `ImageWashFrame aspect="4:5" wash="cloth"` | `app/components/DossierCard.vue:79-102` |
| `DossierCard` status pill | Hand-rolled cinnabar border pill | `CinnabarTag tone="cinnabar" size="sm"` | `app/components/DossierCard.vue:161-169` |
| `DossierCard` category label | Raw mono uppercase text | `CinnabarTag tone="section" size="sm"` | `app/components/DossierCard.vue:153-159` |
| `EntryRelationshipPanel` 联 seal | `SealBadge` (legacy root) | `UiSealStamp variant="carved" size="sm" text="联"` | `app/components/EntryRelationshipPanel.vue:48` |
| `RelatedEntries` 联 seal | `SealBadge` (legacy root) | `UiSealStamp variant="carved" size="sm"` | `app/components/RelatedEntries.vue:13` |
| Infobox portrait frame | Raw `<img>` | `ImageWashFrame aspect="3:4" wash="cloth" :wash-opacity="0.12"` | `app/components/EntryInfobox.vue` (image rendering block) |
| Infobox verification / status | Raw text footer rows | `CinnabarTag` with matching tone | `app/components/EntryInfobox.vue` (footer field render) |
| Archive filter buttons | Plain `<button>` | `LedgerTab tone="section" variant="compact"` | `app/components/CharactersArchiveList.vue:80-95` |
| Section H2 underlines (5 locations) | Raw `<h2>` | `BrushUnderline tone="section" weight="bold" width="long"` | `CharactersAtlasHero.vue`, `CharactersDossierStrip.vue:48`, `CharactersRelationshipPreview.vue`, `CharactersAffiliationClusters.vue`, `CharactersArchiveList.vue:75` |
| Section dividers in `EntryDetail` | `OrnamentalDivider` `jade`/`diamond` | `SectionDivider motif="ink"` for Characters | `app/components/EntryDetail.vue` (dividers block) — cross-section; defer if scoped |
| "Submit Verification" CTA | Not present on Characters | `SealButton stamp="审" size="lg"` | Deferred to 35D+ (needs data plumbing) |

---

## 5. Files To Avoid — Already Strong

These components are correctly built and should not be replaced or re-architected in Stage 35C-1C:

- **`CharactersAtlasHero.vue`** — the chapter cover concept is correct; only soften the stats ledger (Gap 7). Do not redesign the hero structure.
- **`CharactersRelationshipPreview.vue`** — the SVG node web is a signature dossier feature with no engine equivalent. It earns its place. Only add `BrushUnderline` to the H2.
- **`CharactersAffiliationClusters.vue`** — the cluster concept matches the engine's "Affiliation Clusters board" exactly. Only refine mobile chip density (Gap 9).
- **`CharactersDossierStrip.vue`** — the strip layout and scroll behavior are fine. The `BrushUnderline` addition and the `DossierCard` primitive swap (#1 above) propagate correctly into it.
- **`CharacterHero.vue`** — the cinematic video hero with Ken Burns, watermark character, and mute toggle is high-craft and matches the engine's "atmospheric wash" intent for hero. No change.
- **`NameBlock.vue`** — English + Chinese + pinyin + seal stamp is well-built. No change.
- **`EntryDetail.vue`** — the shared shell abstraction is architecturally correct. Only change its divider and infobox children per the adoption table above.
- **`EntryInfobox.vue`** — the section-profile driven layout is the right abstraction. Only swap its raw status/verification text and naked image for primitives.
- **`RelatedEntries.vue` + `DossierGrid.vue`** — the grouped related-entries grid layout is correct; only replace `DossierCard` body and `SealBadge` per the adoption table.
- **`EntrySectionNav.vue`** — table of contents is fine. No change.
- **`useRelatedEntries.ts`** — the outgoing + inverse link-graph builder is correct. No change.

---

## 6. Recommended Stage 35C-1C Implementation Scope

**Strategy:** Conservative primitive adoption only — swap components, don't redesign layouts. No new sections, no IA changes, no copy changes. 8 production files + 2 orphan deletions.

| # | File | Change | Severity | Notes |
|---|---|---|---|---|
| 1 | `app/components/DossierCard.vue:1` | Replace ad-hoc card shell with `PaperSlipCard` slot; replace status/category spans with `CinnabarTag`; wrap image in `ImageWashFrame aspect="4:5" wash="cloth"` | **P1** | Primary wins: kills "thin-border generic" failure, fixes 4:3→4:5 aspect, removes hand-rolled status pill |
| 2 | `app/components/EntryRelationshipPanel.vue:1` | Swap `SealBadge` (line 48) for `UiSealStamp`; replace verification/status text with `CinnabarTag` | **P1** | Unifies seal primitive; resolves raw status text |
| 3 | `app/components/RelatedEntries.vue:1` | Swap `SealBadge` (line 13) for `UiSealStamp` | **P1** | Same seal unification |
| 4 | `app/components/EntryInfobox.vue:1` | Wrap portrait image in `ImageWashFrame aspect="3:4" wash="cloth" :wash-opacity="0.12"`; replace verification / status footer text with `CinnabarTag` | **P1** | Addresses Gap 8 and Gap 11 |
| 5 | `app/components/CharactersArchiveList.vue:1` | Replace filter `<button>` elements with `LedgerTab tone="section" variant="compact"`; add `BrushUnderline tone="section" weight="bold" width="long"` under `<h2>` | **P1** | Addresses Gaps 5 and 6 |
| 6 | `app/components/CharactersAtlasHero.vue:1` | Add `BrushUnderline` under `<h1>`; demote 5-stat ledger to 2 stats (Dossiers + Primary) visible on desktop, hide on mobile | **P2** | Addresses Gap 6 and Gap 7 |
| 7 | `app/components/CharactersDossierStrip.vue:1` | Add `BrushUnderline` under `<h2>` | **P2** | Addresses Gap 6 |
| 8 | `app/components/CharactersRelationshipPreview.vue:1` + `CharactersAffiliationClusters.vue:1` | Add `BrushUnderline` under `<h2>`; tighten mobile chip spacing in `CharactersAffiliationClusters` | **P2** | Addresses Gap 6 and Gap 9 |

**Orphan cleanup (low-risk, ships in the same commit):**

| File | Action |
|---|---|
| `app/components/FeaturedDossier.vue:1` | Delete |
| `app/components/CharacterInfobox.vue:1` | Delete |

**Out of scope for 35C-1C (deferred to 35D+):**

- `SealBadge.vue` global retirement — still used by Factions, Rankings, Pantheon detail pages; needs cross-section audit
- `RegistryRow` adoption for the relationship register (Gap 10) — requires a new layout component
- `SectionDivider motif="ink"` in `EntryDetail.vue` — cross-section change, not Characters-specific
- New "Recent Inscriptions Strip" on the index — engine § 8.1 ideal layout, needs data model
- "Submit Verification" `SealButton` CTA on character detail — needs data plumbing for verification submission flow
- `CharactersAffiliationClusters.vue` mobile horizontal-scroll (Gap 9) — separate implementation pass after card swap

**Verification gate:**

| Check | Method |
|---|---|
| Build | `npm run build` |
| Generate | `npm run generate` (expect 273 routes unchanged) |
| Visual regression | Screenshot `/characters` and `/characters/chen-pingan` at 1440px and 390px |
| Contrast | Any new `CinnabarTag tone="cinnabar"` on `var(--jl-section-paper)` must hit ≥4.5:1 |
| Orphan deletion | Confirm `FeaturedDossier.vue` and `CharacterInfobox.vue` are not imported anywhere |

---

## 7. Final Recommendation

**Proceed to Stage 35C-1C implementation with the 8-file scope above.**

The Characters section's layout, IA, and component decomposition are already architecturally sound. The work is **selective primitive adoption** — the design engine primitives (§ 7) exist and are verified production-ready (per `plans/stage-35c-0-ui-primitive-foundation-audit.md`). The highest-value changes are:

1. **`DossierCard.vue`** — replacing the ad-hoc 1px border card with `PaperSlipCard` + `ImageWashFrame` + `CinnabarTag` eliminates the engine's "Failure Mode #1" (the "thin-border generic") and aligns the card with § 5.1.3 card art spec. This is the single biggest design quality win in the entire scope.

2. **Seal unification** — `SealBadge` (legacy root) → `UiSealStamp` in `EntryRelationshipPanel` and `RelatedEntries` resolves the two-seal-component inconsistency and aligns the Characters surface with the § 7.11 primitive standard.

3. **`BrushUnderline` on all section H2s** — addresses Stage 35C-0 § 8.5's planned global adoption, and brings the Characters index into material grammar compliance.

4. **Infobox portrait → `ImageWashFrame`** — brings the character portrait frame into § 5.1.2 compliance (ink frame, inner frame, bronze ticks, cloth wash).

The orphan deletions (`FeaturedDossier.vue`, `CharacterInfobox.vue`) are a free, zero-risk cleanup that should ship in the same commit.

**Affiliation cluster mobile density (Gap 9) and the missing Relationship Register (Gap 10) are deferred to 35D** — both require either a data-model change or a new layout component, and the 35C-1C scope should stay disciplined around primitive adoption only.

> **Awaiting confirmation to proceed to Stage 35C-1C implementation.**
> No files were modified, staged, or committed.
