# Stage 4B Plan — Activate Category Filtering on Section Indexes

> Planning only. No files edited in this stage. Scope: make the already-rendered category tabs actually filter the cards by each item's frontmatter `category`. 8 existing sections only. No new routes, no nav changes, no UI redesign, no homepage edits, no new deps.

---

## 1. How each section index currently renders items

All 8 indexes share one shape (verified on characters, cultivation; identical pattern in world/swordsmanship/factions/artifacts/timeline/glossary):

```ts
const activeCategory = ref('All')
const meta = useSectionMeta('<section>')               // Stage 4A: tab list
const { data: items } = await useAsyncData('<section>-list', () =>
  queryCollection('content').where('path','LIKE','/<section>/%').order('title','ASC').all()
)
```
```vue
<CategoryTabs :categories="meta.categories" v-model:active="activeCategory" />
<DossierGrid v-if="items && items.length > 0">
  <ScrollReveal v-for="(item, index) in items" :key="item.path" …>
    <DossierCard :category="(item as any).category || '<Fallback>'" … />
  </ScrollReveal>
</DossierGrid>
<ScrollReveal v-else><EmptyArchiveState /></ScrollReveal>
```

Key facts:
- The `v-for` iterates `items` directly — **no filtering applied** (`activeCategory` is decorative).
- Each item's classifying field is frontmatter **`category`** (string), surfaced to [`DossierCard`](jianlai-wiki-nuxt/app/components/DossierCard.vue) as `:category`.
- `timeline/index.vue` is special: it has a `TimelineRail` (hardcoded eras) AND a `DossierGrid`. Filtering should apply only to the `DossierGrid` items, not the rail.
- `cultivation/index.vue` also has a `RealmLadder` above the grid — same: filter only the grid.

**Critical data reality (drives the design):** existing sample content categories do NOT match the new `_meta` tab labels.
- `characters/*` → `category: Character` ✓ matches the "Character" tab.
- `world/sample.md` → `category: World` ✗ (tabs are Continent/Grotto-Heaven/…).
- `cultivation/sample.md` → `category: Cultivation` ✗ (tabs are Realm/Path/…).
- Same mismatch for factions/artifacts/glossary/swordsmanship/timeline samples.

So if filtering is naive, clicking any specific tab on most sections shows **zero cards** (only "All" shows anything). The plan must make this acceptable and non-confusing.

---

## 2. Reusable filtering pattern

Add a tiny pure helper + a computed per page. Centralize the match rule so all 8 pages behave identically.

New helper `app/utils/filterByCategory.ts`:
```ts
export function matchesCategory(itemCategory: unknown, active: string): boolean {
  if (!active || active === 'All') return true          // All shows everything
  if (typeof itemCategory !== 'string' || !itemCategory) return false  // uncategorized -> only under All
  return itemCategory.trim().toLowerCase() === active.trim().toLowerCase()  // case/space-safe
}
```

Per-page computed (the only added logic in each index):
```ts
import { computed } from 'vue'
const filteredItems = computed(() =>
  (items.value ?? []).filter(i => matchesCategory((i as any).category, activeCategory.value))
)
```
Template swaps the loop source and the empty guard:
```vue
<DossierGrid v-if="filteredItems.length > 0">
  <ScrollReveal v-for="(item, index) in filteredItems" :key="item.path" …>
```
```vue
<ScrollReveal v-else><EmptyArchiveState /></ScrollReveal>
```

Why a plain util (not a composable): filtering is synchronous, pure, and needs no Nuxt context. `app/utils/*` is auto-imported by Nuxt, same ergonomics as a composable, but clearly "pure logic."

---

## 3. "All" shows all valid items
- `matchesCategory(..., 'All')` returns `true` for every item. `meta.categories` always has `'All'` prepended (Stage 4A), and `activeCategory` defaults to `'All'`, so initial render is unchanged from today. ✓

## 4. Stable, case-safe matching
- Compare `trim().toLowerCase()` on both sides → tolerant of casing/whitespace drift between frontmatter and `_meta` labels.
- Note this does NOT bridge different *words* (e.g. `World` vs `Continent`). That's a content-authoring concern, addressed in §6, not a matching bug.

## 5. Missing category values do not crash
- `matchesCategory` guards non-string/empty `category` → returns `false` for specific tabs, `true` only under "All". No null deref. `items.value ?? []` guards the async-null window. ✓

## 6. Should uncategorized items appear only under "All"? — YES
Decision: items whose `category` is missing or doesn't match the active tab appear **only under "All"**. Rationale: tabs are a precise filter; putting unmatched items everywhere would defeat filtering.

Consequence to flag clearly: with current sample data, most non-character sections will show an empty grid on specific tabs (only "All" populated). This is correct behavior, not a bug. Two mitigations (both optional, your call at implementation time):

- (a) **Recommended, content-only:** update the sample pages' `category` to a real `_meta` value (e.g. `world/sample.md` → `category: Continent`) so at least one tab demonstrates a non-empty filter. Low risk, no code.
- (b) **UX safety net:** when a specific tab yields zero items, the existing [`EmptyArchiveState`](jianlai-wiki-nuxt/app/components/EmptyArchiveState.vue) already renders via the `v-else`. Optionally pass a context message like "No entries in this category yet." Keeps the page from looking broken.

I recommend (a) for the four/eight sample pages + (b)'s existing empty state (no new prop needed) so the feature is demonstrably working without inventing lore.

---

## 7. Exact files to edit

New (1):
- `app/utils/filterByCategory.ts` — the `matchesCategory` helper.

Edit (8 index pages — add `computed` import if missing, add `filteredItems`, point the `v-for` + `v-if` at it):
- [`characters/index.vue`](jianlai-wiki-nuxt/app/pages/characters/index.vue)
- [`world/index.vue`](jianlai-wiki-nuxt/app/pages/world/index.vue)
- [`cultivation/index.vue`](jianlai-wiki-nuxt/app/pages/cultivation/index.vue) (filter only the DossierGrid; leave RealmLadder)
- [`swordsmanship/index.vue`](jianlai-wiki-nuxt/app/pages/swordsmanship/index.vue)
- [`factions/index.vue`](jianlai-wiki-nuxt/app/pages/factions/index.vue)
- [`artifacts/index.vue`](jianlai-wiki-nuxt/app/pages/artifacts/index.vue)
- [`timeline/index.vue`](jianlai-wiki-nuxt/app/pages/timeline/index.vue) (filter only the DossierGrid; leave TimelineRail)
- [`glossary/index.vue`](jianlai-wiki-nuxt/app/pages/glossary/index.vue)

Optional content edits (recommended, §6a) — set a real `_meta` category on the sample pages:
- `content/world/sample.md`, `content/cultivation/sample.md`, `content/swordsmanship/sample.md`, `content/factions/sample.md`, `content/artifacts/sample.md`, `content/glossary/sample.md`, `content/timeline/sample.md`.

Not edited: schema, `_meta`/`_templates`, `CategoryTabs.vue`, `DossierCard.vue`, header/nav, homepage, new-section pages.

---

## 8. Test routes

After implementation, `npm run generate` (expect unchanged **43 routes**), then at a fresh `npx serve` port:
- `/characters` — click "Character" → 3 character cards remain; click "Major"/"Gods" → empty state; "All" → all 3. (Best functional proof, since character categories match.)
- `/world` — "All" shows the sample; a specific tab shows the sample only if §6a applied, else empty state.
- `/timeline` — confirm `TimelineRail` still renders on every tab; only the grid filters.
- `/cultivation` — confirm `RealmLadder` still renders on every tab; only the grid filters.
- `/glossary` — simple grid filter sanity check.

Interaction is client-side; verify via Playwright by clicking a tab and asserting card count changes (not just initial SSG HTML).

---

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Specific tabs look "broken" (empty) due to category/label mismatch in sample data | Expected per §6. Apply §6a to sample pages so ≥1 tab is non-empty; existing `EmptyArchiveState` covers the rest. Document as data, not code. |
| SSG renders only the default ("All") state; filtering is client-only | Acceptable and expected for static + client interactivity. Initial HTML = full list (good for SEO/no-JS); clicks filter reactively. No prerender impact. |
| `items.value` null during async/SSR window | `(items.value ?? [])` guard in the computed. |
| Case/whitespace drift between frontmatter and tabs | `trim().toLowerCase()` comparison. |
| Accidentally filtering RealmLadder/TimelineRail | Only swap the `DossierGrid` loop source to `filteredItems`; leave rail/ladder bound to their own hardcoded arrays. |
| Empty-state flScroll/animation quirks when toggling tabs | `ScrollReveal` wraps each card; re-render on filter is fine. If reveal "sticks" hidden, spot-check during Playwright; worst case the empty-state `v-else` is static. |
| Route count drift / leaks | Pure client logic + one util; no new routes. Gate on `npm run generate` = 43 routes. |
| Tab labels with hyphens (e.g. `Sword-Qi-Great-Wall`) never match content | Only relevant if such content exists; matching is exact (case-insensitive). Authors must use the same token in frontmatter. Documented expectation. |

---

## Summary
One pure auto-imported util (`matchesCategory`) + a `filteredItems` computed wired into each of the 8 index grids. "All" = unchanged full list; specific tabs = exact, case-insensitive `category` match; uncategorized/mismatched items surface only under "All" and fall back to the existing empty state. Recommend a small content pass to give sample pages real `_meta` categories so filtering is visibly demonstrable. No UI redesign, no new routes, no deps; verify with `npm run generate` (43 routes) + Playwright tab-click assertions.
