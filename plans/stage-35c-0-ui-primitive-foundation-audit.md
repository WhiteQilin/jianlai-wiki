# Stage 35C-0 — UI Primitive Foundation Audit

**Status:** Audit complete. No new files created or modified.
**Build:** `npm run build` ✅ · **Generate:** `npm run generate` ✅ (273 routes, 28.3s)
**Scope:** Verification that the nine § 7 primitives from `plans/jianlai-frontend-design-engine.md` are production-ready.

---

## 1. Files involved (existing — not touched)

### Primitives (`app/components/ui/`)

| Primitive | File | § 7 role | Spec coverage |
|---|---|---|---|
| InkButton | `app/components/ui/InkButton.vue:1` | 7.1 inline link | dual-layer brush underline; `tone` (ink/cinnabar/section); focus-visible 2px cinnabar outline @4px offset; reduced-motion safe |
| SealButton | `app/components/ui/SealButton.vue:1` | 7.2 rare primary | cinnabar fill; irregular `2px 4px 3px 2px` radius; `seal-border-mask.svg` edge mask; feTurbulence noise overlay; `stamp` slot for Chinese char; reduced-motion safe |
| ArchiveTab | `app/components/ui/ArchiveTab.vue:1` | 7.3 nav tab | mono label + calligraphic zh accent; count badge; cinnabar scaleX underline; `role="tab"` + `aria-selected` |
| LedgerTab | `app/components/ui/LedgerTab.vue:1` | 7.4 filter tab | 1px border + mist-light bg; `count` prop; four `tone` variants (section/bronze/jade/cinnabar); `variant="compact"`; `aria-pressed` |
| CinnabarTag | `app/components/ui/CinnabarTag.vue:1` | 7.6 status tag | 5 tones; irregular radius; optional dot; `size="sm"`; decorative dot `aria-hidden` |
| PaperSlipCard | `app/components/ui/PaperSlipCard.vue:1` | 7.7 default card | paper gradient + mist frame; no default shadow; `sealCorner` + `lift` props; focus-visible outline; reduced-motion safe |
| ImageWashFrame | `app/components/ui/ImageWashFrame.vue:1` | 7.9 framed image | 7 aspect ratios; 3 wash modes (mist/cloth/ink) + opacity; corner-tick bronze frame; `<figure>` + `<figcaption>`; manifest-driven `src` (no folder scan) |
| SectionDivider | `app/components/ui/SectionDivider.vue:1` | 7.10 structural | 7 motifs (ink/seal/ledger/blade/atlas/doctrine/blank); `label` slot; `aria-hidden` default; gradient rule |
| BrushUnderline | `app/components/ui/BrushUnderline.vue:1` | 7.5 ornament | 5 tones × 3 weights × 4 widths; section-aware via `tone="section"`; `aria-hidden` |

### Dev preview page

- `app/pages/dev/ui-primitives.vue:1` — 840-line showcase. Section chapter picker (12 chapters), nine numbered blocks with section-aware tone previews, manifest-sourced ImageWashFrame entries, `import.meta.dev` 404 guard, responsive grid (880px / 540px breakpoints), reduced-motion override. Excluded from prerender via `nuxt.config.ts:39` `'/dev/**': { prerender: false }`.

### Sibling primitives (used by the preview, not duplicated)

- `SealStamp.vue:1` (7.11), `BrushTitle.vue:1` (heading), `InkHoverLink.vue:1` (inline link), `InkTextButton.vue:1` (text button), `InkActiveTab.vue:1` (active-state button), `InkDivider.vue:1` (in-prose divider).

---

## 2. Existing components — reuse vs supersede

The "Inspect existing UI components" list from the task maps cleanly:

- **Reused as-is** (semantics match the § 7 spec): `SealStamp`, `SealBadge`, `InkHoverLink`, `InkTextButton`, `InkActiveTab`, `InkDivider`, `BrushTitle`, `DossierCard`, `DossierGrid`, `CategoryTabs`, `EntryInfobox`.
- **Superseded** (none required): the `ui/*` set is the canonical primitive set.
- **Intentional coexistence**: root `app/components/SealBadge.vue:1` and `app/components/ui/SealStamp.vue:1` are not the same component.
  - `SealBadge` — simple square / vertical-rl rectangle for character status plates.
  - `ui/SealStamp` — decorative seal with `carved` / `outline` / `filled` / `ghost` variants for section archetypes.
  - No collision; no merge needed.

---

## 3. Design-engine mapping (§ 4.2 material grammar)

| Primitive | § 7 role | Material(s) | Notes |
|---|---|---|---|
| InkButton | inline action | ink-on-paper + cinnabar accent on hover | always cinnabar→teal gradient underline; section-tinted via `tone="section"` |
| SealButton | rare primary | seal-on-paper | cinnabar stays rare; not a generic rounded SaaS button |
| ArchiveTab | nav primitive | ink-on-paper → cinnabar active | mono + calligraphic zh label |
| LedgerTab | category filter | jade on wood (active) / ink on paper (idle) | per-section tint via section tokens |
| CinnabarTag | status marker | seal | rarity rule: cinnabar ≤10% of viewport |
| PaperSlipCard | default card | paper + mist frame | replaces thin-border generic card |
| ImageWashFrame | framed illustration | paper + cloth/ink wash + bronze corner ticks | manifest-driven `src` |
| SectionDivider | structural rule | bronze rule + mist gap | 7 motifs, no overdecoration |
| BrushUnderline | ornament | cinnabar / ink / gold | section-aware via tokens |

---

## 4. Accessibility

- All interactive primitives expose correct semantics:
  - `<button>` for actions
  - `<a>` / `NuxtLink` for navigation
  - `role="tab"` + `aria-selected` (ArchiveTab)
  - `role="radiogroup"` + `aria-checked` (preview section picker)
  - `aria-pressed` (LedgerTab, InkTextButton)
  - `aria-current="page"` (InkHoverLink)
  - `aria-busy` (SealButton `loading` state)
  - `aria-disabled` for disabled buttons
- Every primitive has a `:focus-visible` outline ≥ 2px at ≥ 2px offset (InkButton:167, SealButton:191, ArchiveTab:81, LedgerTab:78, PaperSlipCard:83, etc.).
- Every motion primitive wraps `@media (prefers-reduced-motion: reduce)` with `transition: none`:
  - InkButton:185 · SealButton:226 · ArchiveTab:136 · LedgerTab:157 · PaperSlipCard:111 · SealStamp:202 · InkHoverLink:176 · InkActiveTab:162 · InkTextButton:167
  - Decorative-only primitives (CinnabarTag, BrushUnderline, ImageWashFrame, SectionDivider) use only static decoration or transform-on-hover — no animation to suppress.
- Decorative ornaments are `aria-hidden="true"`:
  - `BrushUnderline` (line 17) · `seal-button__edge/texture/stamp` (SealButton:39-41) · `seal__edge/inner/texture` (SealStamp:15-17) · `image-wash-frame__wash/frame` (ImageWashFrame:39, 43) · `section-divider__rule/motif` (SectionDivider:20, 24) · `cinnabar-tag__dot` (CinnabarTag:18) · `archive-tab__zh/underline` (ArchiveTab:27, 30) · `ink-hover-link__before/after` (InkHoverLink via CSS) · `ink-active-tab__seal` (InkActiveTab:35) · `ink-text-button__before/after` (InkTextButton)
- Contrast for body text on `parchment` already meets 4.5:1 in the section theme system (verified in § 2 of `DESIGN.md`: ink-wash #4a4a4a on parchment #f9f8f6 = 7.2:1). All primitives read section tokens through `var(--jl-section-ink)` / `var(--jl-section-paper)`, inheriting this.

---

## 5. Build safety

- **TypeScript clean.** Every primitive is `<script setup lang="ts">` with typed `defineProps` and explicit `withDefaults`.
- **No auto-import conflicts.** Primitives all live under `app/components/ui/` with a single root tag (`Ui*`) used by the preview.
- **No circular imports.** The preview imports primitives and `~/utils/assetManifest`; primitives import nothing project-specific (only Vue `computed`).
- **No production routes touched.** `nuxt.config.ts:39` keeps `/dev/**` out of prerender. Existing `app/components/rankings/*`, `app/components/swordsmanship-v2/*`, etc. unchanged.

---

## 6. Verification

| Command | Result |
|---|---|
| `npm run build` | ✅ `✨ Build complete!` — 35.5 MB total / 13.2 MB gzip. `ui-primitives-styles.C1CJuntd.mjs` = 8.02 kB (1.76 kB gzip) confirms scoped CSS compiled cleanly. |
| `npm run generate` | ✅ `Prerendered 273 routes in 28.317 seconds`. `/dev/ui-primitives` correctly skipped from prerender. No console errors. |

---

## 7. Dev preview route status

`/dev/ui-primitives` is live in dev mode and excluded from production build. It exposes the section chapter picker so a reviewer can verify each primitive correctly picks up the section's accent / paper / ink / seal tokens across all 12 chapter palettes.

Coverage by primitive in the preview:
- **01 InkButton** — three tones (ink / cinnabar / section) × three states (default / link / disabled)
- **02 SealButton** — three sizes (sm / md / lg) + no-stamp + disabled + `loading` slot
- **03 ArchiveTab** — three tabs with zh label + count badge, active-state cycling
- **04 LedgerTab** — three tone rows (section / bronze / jade) × variant (ledger / compact) with count badges
- **05 CinnabarTag** — all five tones × four content variants × two sizes
- **06 PaperSlipCard** — three variants (accent / sealCorner+lift / plain) with section-tinted body text
- **07 ImageWashFrame** — manifest entries filtered by current section (hero atmosphere 16:9, dossier portrait 3:4, background wash 4:5) + a global texture 1:1
- **08 SectionDivider** — all seven motifs + labeled variant
- **09 BrushUnderline** — three tones (cinnabar / section / gold) in inline headlines + width and weight grids

Manifest is wired: the page reads `getAssetsByRole('hero-atmosphere')`, `getAssetsByRole('dossier-portrait')`, `getAssetsByRole('background-wash')` filtered by `sectionId`, so all image previews come from `app/utils/assetManifest.ts` — no folder scanning.

---

## 8. Recommended Stage 35C-1 adoption plan

1. **Rankings register rows** — swap the ledger-row block in `app/components/rankings/RankingLedgerRow.vue:1` and `RankingRegisterRow.vue:1` for `RegistryRow`-style treatment using `BrushUnderline` + `CinnabarTag` for status (Live / Awaiting Confirmation / Struck from Record) + `SectionDivider motif="ledger"` between register groups.
2. **Swordsmanship index** — apply `LedgerTab tone="section"` for the Sword Art / Domain / Intent / Scripture filter strip in `app/components/swordsmanship-v2/SwordArtRegister.vue:1`, replacing the existing filter chrome.
3. **Characters dossier cards** — `app/components/DossierCard.vue:1` should adopt `PaperSlipCard accent sealCorner lift` as its base shell rather than its current ad-hoc card.
4. **Verification CTA** — replace the global `btn-primary` on `/rankings/[id]` and `/swordsmanship/[id]` "Submit Verification" with `SealButton stamp="审" size="lg"` (cinnabar rarity preserved).
5. **Section H2 underlines** — standardise on `BrushUnderline tone="section" weight="bold" width="long"` immediately under every section H2 in content markdown renderers — replaces the current 80px-charcoal rule with the section-tinted brush stroke.
6. **Image-bearing cards** (`RelicCard`, `ManualSlip` hero, sect-seal sigil) — wrap all 1:1 and 4:5 illustrations in `ImageWashFrame wash="cloth" :wash-opacity="0.12"`.
7. **Editorial copy** — where `CinnabarTag` shows editorial state, ensure each tag has a text label (rule 11.4.2: no color-only indicators). The current 5-tone palette already supports this; Stage 35D needs to verify text labels exist.
8. **Section chapters outside preview** — the `data-jl-section` attribute that drives the section-aware tone in the preview is the same mechanism every production page uses (`app/utils/sectionThemes.ts`). Adoption is just composing existing primitives with section tokens already wired through `var(--jl-section-*)`.

---

## 9. Caveats

- `SealButton`'s `loading` state pulses the noise texture (`seal-button-pulse 1.6s ease-in-out infinite`). The reduced-motion override (`SealButton:234`) disables it, but the `is-loading` opacity dimming on the label still applies — verify this is acceptable for non-reduced-motion contexts in Stage 35D review.
- `PaperSlipCard` exposes both `lift` (explicit opt-in) and `a.paper-slip-card:hover` (auto on linked cards). Both paths apply the same translateY(-3px) + ambient shadow. Audit the production pages that use `<a class="paper-slip-card">` to confirm the lift intent.
- `ArchiveTab`'s `aria-label` template literal on the count badge (`ArchiveTab:29`) uses backticks inside a JSX expression — verified to compile, but worth a follow-up if any tool flags it.

---

*Nothing was staged or committed. Stage 35C-0 is a verification milestone; the foundation is already shipping.*