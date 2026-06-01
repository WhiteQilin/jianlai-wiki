# Stage 4A Plan — Metadata-Driven Section Indexes

> Planning only. No files edited in this stage. Scope: make the 8 existing section index pages source their intro copy + category/filter tabs from `content/_meta/<section>.md` instead of hardcoded arrays. No new public routes, no nav changes, no UI redesign.

---

## 1. How index pages currently define category tabs

Every section index (`app/pages/<section>/index.vue`) follows the same shape:

```ts
const activeCategory = ref('All')
const { data: items } = await useAsyncData('<section>-list', () =>
  queryCollection('content').where('path', 'LIKE', '/<section>/%').order('title','ASC').all()
)
```
```vue
<SectionHero titleEn="…" titleZh="…" desc="…" … />
<CategoryTabs :categories="['All', 'X', 'Y', 'Z']" v-model:active="activeCategory" />
<DossierGrid v-if="items?.length"> … v-for items … </DossierGrid>
```

Observations:
- Category arrays are **hardcoded inline** per page (e.g. timeline: `['All','Ancient Era','Modern Era']`; glossary: `['All','Concepts','Titles','Weapons','Places']`).
- [`CategoryTabs.vue`](jianlai-wiki-nuxt/app/components/CategoryTabs.vue:2) takes `categories: string[]` + `active`, and expects `'All'` to be the first element.
- **`activeCategory` is currently decorative** — the `v-for` renders all items regardless of the active tab. No filtering logic exists yet. (Important: Stage 4A only sources the tab list from metadata; actual filtering is deferred to Stage 4B.)
- Section hero copy (titleEn/titleZh/desc) is also hardcoded inline.

---

## 2. Can `content/_meta/*` be queried safely?

**Yes — with one verification probe required at code time.**

Evidence from the Stage 3 build log:
- `Processed 2 collections and 40 files … (28 cached, 12 parsed)` — the 12 `_meta` files were parsed into the collection DB.
- Final build = **43 routes**, with zero `/_meta/*` routes. They are queryable content but produce no pages, because routing is driven by Vue pages and **no route matches `/_meta/*`**.
- Contrast: the removed in-folder `_category.md` files DID leak, because `app/pages/<section>/[...slug].vue` is a catch-all that matched `/<section>/_category`. `_meta` sits outside every section path, so the catch-alls never see it.

Path mapping: `content/_meta/characters.md` → content path `/_meta/characters`.

**Why it won't pollute existing listings:** index queries are path-scoped to `/<section>/%`. `_meta` lives at `/_meta/%`, so it can never appear in a section's item list.

**Residual uncertainty (must probe):** Nuxt Content has historically treated `_`-prefixed files as "partials" in some versions. The build *parsed* them, but we must confirm at code time that `queryCollection('content').path('/_meta/characters').first()` actually *returns* the document at runtime (parsed-into-DB ≠ guaranteed-returned-by-query if partial-exclusion is active). This is a 5-minute probe, not a redesign.

---

## 3. Recommended loading pattern (if `_meta` is queryable)

A single reusable composable as the **one integration point**:

`app/composables/useSectionMeta.ts`
```ts
export interface SectionMeta {
  title: string
  chinese?: string
  description?: string
  categories: string[]   // already includes 'All' prepended
}

export async function useSectionMeta(section: string) {
  const { data } = await useAsyncData(`meta-${section}`, () =>
    queryCollection('content').path(`/_meta/${section}`).first()
  )
  const raw = (data.value as any) || {}
  const cats: string[] = Array.isArray(raw.categories) ? raw.categories : []
  return {
    title: raw.title ?? section,
    chinese: raw.chinese,
    description: raw.description,
    categories: ['All', ...cats],
  } as SectionMeta
}
```

Index page change (minimal, e.g. timeline):
```ts
const meta = await useSectionMeta('timeline')
```
```vue
<CategoryTabs :categories="meta.categories" v-model:active="activeCategory" />
```
SectionHero copy may optionally be fed from `meta` too, but to stay low-risk, leave existing hero props as-is in 4A (hero copy migration can be a tiny follow-up).

---

## 4. Fallback if `_meta` is NOT cleanly queryable

If the probe shows the query returns null (Content v3 excludes `_`-prefixed from results), keep the **same composable signature** but swap its internals to read a hand-authored static map. The 8 index pages do not change again.

`app/data/sectionMeta.ts`
```ts
export const SECTION_META = {
  characters:   { title: 'Characters',    chinese: '人物志',  categories: ['Character','Major','Minor','Gods'] },
  world:        { title: 'World',          chinese: '天下图志', categories: ['Continent','Grotto-Heaven','Blessed Land','City','Landmark','Sword-Qi-Great-Wall'] },
  cultivation:  { title: 'Cultivation',    chinese: '山上修行', categories: ['Realm','Path','Method','Concept'] },
  swordsmanship:{ title: 'Swordsmanship',  chinese: '剑术神通', categories: ['Technique','Flying-Sword-Art','Ability','Sword-Style'] },
  factions:     { title: 'Factions',       chinese: '宗门势力', categories: ['Sect','Dynasty','Academy','Clan','Alliance'] },
  artifacts:    { title: 'Artifacts',      chinese: '法宝器物', categories: ['Weapon','Flying-Sword','Sword-Nurturing-Gourd','Treasure','Material','Talisman'] },
  timeline:     { title: 'Timeline',       chinese: '年表',    categories: ['Era','Event','Arc'] },
  glossary:     { title: 'Glossary',       chinese: '术语典籍', categories: ['Term','Concept','Phrase'] },
} as const
```
- `content/_meta/*.md` stays as the human-editable editorial source of truth (future CMS reads it); `sectionMeta.ts` is the guaranteed-safe runtime mirror. Values are copied verbatim from the existing `_meta` frontmatter.
- Zero query risk, zero route-leak risk, fully SSG-safe.

**Recommendation:** Implement the composable. Run the probe first. Prefer the content-query internals if it returns data; otherwise use the `sectionMeta.ts` internals. Either way, index pages and `CategoryTabs` are touched identically.

---

## 5. Reusable component / composable

- **New composable:** `useSectionMeta(section)` — the only new abstraction; centralizes loading + `'All'` prepend, so the query-vs-static decision lives in one file.
- **No new component needed.** Reuse existing [`CategoryTabs.vue`](jianlai-wiki-nuxt/app/components/CategoryTabs.vue) and [`SectionHero.vue`](jianlai-wiki-nuxt/app/components/SectionHero.vue) unchanged.

---

## 6. Incremental, low-risk rollout

1. Add composable + (if needed) `sectionMeta.ts`.
2. Convert **one** pilot page first (recommend `timeline` — simplest, no images) and `npm run generate` to confirm route count stays 43 and tabs render from meta.
3. Roll the same one-line change across the remaining 7 sections.
4. Do not wire filtering yet (keeps diff tiny and behavior identical aside from tab labels).

---

## 7. Exact files to edit

New:
- `app/composables/useSectionMeta.ts`
- `app/data/sectionMeta.ts` (only if probe fails; otherwise omit)

Edit (8 index pages — swap hardcoded `:categories` for `meta.categories`, add the `useSectionMeta` call):
- [`app/pages/characters/index.vue`](jianlai-wiki-nuxt/app/pages/characters/index.vue)
- [`app/pages/world/index.vue`](jianlai-wiki-nuxt/app/pages/world/index.vue)
- [`app/pages/cultivation/index.vue`](jianlai-wiki-nuxt/app/pages/cultivation/index.vue)
- [`app/pages/swordsmanship/index.vue`](jianlai-wiki-nuxt/app/pages/swordsmanship/index.vue)
- [`app/pages/factions/index.vue`](jianlai-wiki-nuxt/app/pages/factions/index.vue)
- [`app/pages/artifacts/index.vue`](jianlai-wiki-nuxt/app/pages/artifacts/index.vue)
- [`app/pages/timeline/index.vue`](jianlai-wiki-nuxt/app/pages/timeline/index.vue)
- [`app/pages/glossary/index.vue`](jianlai-wiki-nuxt/app/pages/glossary/index.vue)

Not edited: `content.config.ts`, header/nav, new-section pages, homepage, visual components.

---

## 8. Testing routes

After implementation, `npm run generate` then check at `http://localhost:3000/`:
- `/timeline` (pilot) — tabs come from meta; hero intact.
- `/characters`, `/world`, `/glossary` — representative coverage (images, many categories, simple).
- Spot-check one detail route (`/characters/chen-pingan`) to confirm slug pages untouched.
- Confirm build still reports **43 routes** (no `_meta`/new-section leak).

---

## 9. Risks & how to avoid route leaks

| Risk | Mitigation |
|---|---|
| `_meta` query returns null (partial exclusion) | Probe first; fall back to `sectionMeta.ts` behind the same composable. |
| A broad `queryCollection('content').all()` would surface `_meta`/`_templates` | Do NOT introduce unscoped `.all()`. Keep section lists path-scoped (`/<section>/%`). `useSectionMeta` uses `.path('/_meta/<section>')` (exact match, single doc). |
| Accidentally creating `/_meta` routes | Never add `app/pages/_meta/**` or a catch-all matching `/_meta`. `_meta` must remain content-only. |
| Visible tab labels change (meta categories differ from current hardcoded ones, e.g. `Grotto-Heaven` vs `Grotto-Heavens`) | Expected, since tabs become metadata-driven. Confirm acceptable, or refine labels in `_meta` (+ `sectionMeta.ts`) for display polish. Not a regression — purely the new source of truth. |
| Filtering appears "broken" | It was never wired; tabs are decorative today. Keep that behavior in 4A; implement real filtering in Stage 4B. |
| Route count drift | Gate every step on `npm run generate` reporting 43 routes. |
