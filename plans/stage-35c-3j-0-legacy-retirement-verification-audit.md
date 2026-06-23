# Stage 35C-3J-0 — Legacy Component Retirement Verification Audit

**Status:** Audit complete. No files edited, deleted, staged, or committed.
**Date:** 2026-06-24
**Scope:** Verify which legacy components can safely be retired now, and which must be kept because implementation strategy changed.
**Sources of truth:**
- `PRODUCT.md`
- `DESIGN.md`
- `plans/jianlai-frontend-design-engine.md`
- `plans/stage-35c-0-ui-primitive-foundation-audit.md`
- `plans/stage-35c-2-full-primitive-adoption-audit.md`
- `plans/stage-35c-1c-characters-design-gap-audit.md`

---

## Executive Summary

This audit re-verifies the deletion plan from Stage 35C-3J against the actual current state of the codebase. **The original Stage 35C-3J plan (from `stage-35c-2-full-primitive-adoption-audit.md`) proposed deleting all three legacy components. That plan is now partially stale.**

Two components are confirmed orphans and safe to delete:
- `app/components/SealBadge.vue` — zero live consumers (all migrated to `UiSealStamp` in 35C-3B)
- `app/components/InkDivider.vue` — zero live consumers (all migrated to `UiSectionDivider` in 35C-3A-1)

One component must be **kept** because the implementation strategy diverged from the original plan:
- `app/components/CategoryTabs.vue` — rewritten as a `LedgerTab` wrapper in 35C-3C, now serves 6 live consumers as a valid abstraction layer

---

## SealBadge.vue

**Search terms:**
- `import SealBadge`
- `<SealBadge`
- `resolveComponent('SealBadge')`
- `.seal-badge` class usage

**Live references:** **Zero.**

No `import SealBadge`, no `<SealBadge`, no `resolveComponent('SealBadge')`, no `.seal-badge` class usage anywhere in `app/`. All 10 previous consumers were migrated to `UiSealStamp` in Stage 35C-3B:

| Previous Consumer | Migrated To |
|-------------------|-------------|
| `app/pages/index.vue` | `UiSealStamp` (35C-3B) |
| `app/components/WikiNotice.vue` | `UiSealStamp` (35C-3B) |
| `app/components/SectionHero.vue` | `UiSealStamp` (35C-3B) |
| `app/components/RelatedLinks.vue` | `UiSealStamp` (35C-3B) |
| `app/components/MediaGalleryPlaceholder.vue` | `UiSealStamp` (35C-3B) |
| `app/components/FeaturedTheatre.vue` | `UiSealStamp` (35C-3B) |
| `app/components/FeaturedSpotlight.vue` | `UiSealStamp` (35C-3B) |
| `app/components/EntryReferenceBlock.vue` | `UiSealStamp` (35C-3B) |
| `app/components/EntryMetaPanel.vue` | `UiSealStamp` (35C-3B) |
| `app/components/EmptyArchiveState.vue` | `UiSealStamp` (35C-3B) |

**Non-live references:** 8 planning docs only (`plans/*.md`, `DESIGN.md`). Zero code references.

**Recommendation:** ✅ **Safe to delete `app/components/SealBadge.vue`.** Confirmed orphan — zero live consumers, zero Nuxt auto-import usage, zero CSS class references.

---

## Root InkDivider.vue (`app/components/InkDivider.vue`)

**Search terms:**
- `import InkDivider`
- `<InkDivider`
- `resolveComponent('InkDivider')`
- `<InkDivider type="brush"` (the legacy usage signature)

**Live public references:** **Zero.**

No `import InkDivider` pointing at the root component, no `<InkDivider` with `type="brush"`, no `resolveComponent('InkDivider')`. All 11 page-level consumers were migrated to `UiSectionDivider` in Stage 35C-3A-1:

| Previous Consumer Page | Migrated To |
|------------------------|-------------|
| `app/pages/characters/index.vue` | `<UiSectionDivider motif="ink" />` (35C-3A-1) |
| `app/pages/world/index.vue` | `<UiSectionDivider motif="atlas" />` (35C-3A-1) |
| `app/pages/factions/index.vue` | `<UiSectionDivider motif="ledger" />` (35C-3A-1) |
| `app/pages/rankings/index.vue` | `<UiSectionDivider motif="ledger" />` (35C-3A-1) |
| `app/pages/cultivation/index.vue` | `<UiSectionDivider motif="ink" />` (35C-3A-1) |
| `app/pages/teachings/index.vue` | `<UiSectionDivider motif="doctrine" />` (35C-3A-1) |
| `app/pages/pantheon/index.vue` | `<UiSectionDivider motif="doctrine" />` (35C-3A-1) |
| `app/pages/glossary/index.vue` | `<UiSectionDivider motif="ink" />` (35C-3A-1) |
| `app/pages/artifacts/index.vue` | `<UiSectionDivider motif="seal" />` (35C-3A-1) |
| `app/pages/timeline/index.vue` | `<UiSectionDivider motif="ink" />` (35C-3A-1) |

**Dev-only / backup references:** 2 references to `app/components/ui/InkDivider.vue` (the primitive), **not** the root legacy:

| File | Reference Target |
|------|------------------|
| `app/components/ui/JianLaiPrimitivePreview.vue` | `import InkDivider from './InkDivider.vue'` → the UI primitive |
| `app/_migration-backups/swordsmanship-index.v1-backup.vue` | `import JianLaiInkDivider from '~/components/ui/InkDivider.vue'` → the UI primitive (backup, not live) |

Neither references the root legacy `app/components/InkDivider.vue`.

**Critical distinction:** `app/components/InkDivider.vue` (root legacy) is a separate file from `app/components/ui/InkDivider.vue` (design-system primitive). The latter is in active use by the preview page and must be kept.

**Recommendation:** ✅ **Safe to delete `app/components/InkDivider.vue`.** Confirmed orphan — all consumers migrated. The primitive at `app/components/ui/InkDivider.vue` is a separate file and remains in active use.

---

## CategoryTabs.vue

**Search terms:**
- `import CategoryTabs`
- `<CategoryTabs`
- `resolveComponent('CategoryTabs')`

**Live consumers:** **6 pages:**

| Page | Line |
|------|------|
| `app/pages/artifacts/index.vue` | 42 |
| `app/pages/cultivation/index.vue` | 134 |
| `app/pages/glossary/index.vue` | 37 |
| `app/pages/pantheon/index.vue` | 37 |
| `app/pages/teachings/index.vue` | 37 |
| `app/pages/timeline/index.vue` | 137 |

No explicit `import` statements — all 6 consumers rely on Nuxt component auto-import.

**Internal state (post-35C-3C rewrite):**

CategoryTabs.vue was rewritten in Stage 35C-3C. It is **no longer a hand-rolled thin-border tab component**. It now imports and wraps `LedgerTab` internally:

```vue
<script setup lang="ts">
import LedgerTab from '~/components/ui/LedgerTab.vue'

defineProps<{
  categories: string[]
  active: string
}>()

defineEmits<{
  (e: 'update:active', category: string): void
}>()
</script>

<template>
  <div class="category-tabs">
    <div class="tab-label">Filter:</div>
    <div class="tab-list">
      <LedgerTab
        v-for="cat in categories"
        :key="cat"
        :active="cat === active"
        variant="compact"
        tone="section"
        @click="$emit('update:active', cat)"
      >
        {{ cat }}
      </LedgerTab>
    </div>
  </div>
</template>
```

**Why it is a valid kept wrapper (not legacy cruft):**

It is a thin wrapper around `LedgerTab` that provides shared layout for 6 pages:
- A consistent "Filter:" label + tab-list layout
- Bottom divider border (1px `--c-divider`)
- Responsive column layout at mobile (`@media (max-width: 640px)`)
- A clean component API (`categories` + `active` + `update:active` emit) consumed by 6 pages

**Recommendation:** ✅ **Keep `app/components/CategoryTabs.vue`.** It is not a legacy component to retire — it is now a valid `LedgerTab` wrapper with 6 live consumers. Deleting it would require migrating all 6 pages to use `LedgerTab` directly with duplicated layout CSS, which is a regression in abstraction rather than an improvement.

---

## Exact Safe Deletion Plan

| File | Action | Rationale |
|------|--------|-----------|
| `app/components/SealBadge.vue` | **DELETE** | Zero live consumers. All 10 sites migrated to `UiSealStamp` in 35C-3B. |
| `app/components/InkDivider.vue` | **DELETE** | Zero live consumers. All 11 pages migrated to `UiSectionDivider` in 35C-3A-1. |
| `app/components/CategoryTabs.vue` | **KEEP** | 6 live consumers. Now a valid `LedgerTab` wrapper after 35C-3C rewrite. |

**Files to NOT touch:**
- `app/components/ui/InkDivider.vue` — the design-system primitive, still in active use (preview page)
- `app/components/ui/SealStamp.vue` — the replacement primitive, in active use
- `app/components/CategoryTabs.vue` — the valid wrapper, 6 live consumers

---

## Final Recommendation

**Safe to delete both `SealBadge.vue` and `InkDivider.vue`.** Keep `CategoryTabs.vue`.

The original Stage 35C-3J plan (from `stage-35c-2-full-primitive-adoption-audit.md`) proposed deleting all three legacy components. That plan is now **partially stale** — CategoryTabs.vue was rewritten as a `LedgerTab` wrapper in Stage 35C-3C rather than being migrated away from consumers, making it a valid kept component rather than a deletion target. The other two deletions (SealBadge, root InkDivider) are confirmed safe and match the original plan exactly.

**Recommended next stage:** 35C-3J-1 — execute the two confirmed safe deletions (SealBadge.vue + root InkDivider.vue), then re-run `npm run build` and `npm run generate` to confirm no broken references.

**Do not implement this audit.** Awaiting confirmation to proceed with Stage 35C-3J-1.
