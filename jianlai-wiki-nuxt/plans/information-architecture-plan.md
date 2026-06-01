# Jian Lai Wiki — Long-Term Information Architecture Plan

> Status: Living document. Stages 1–6A are implemented. Sections below marked
> **(as-built)** record how the implementation diverged from the original plan;
> the surrounding planning text is preserved for historical context.
>
> Stack constraints honored: Nuxt + Nuxt Content, static generation only, no new dependencies, no UI redesign, future-compatible with a custom wiki/editor engine.

---

## Implementation Status (as-built through Stage 6A)

This section is the source of truth for what currently ships. Where it conflicts
with later planning prose, this section wins.

**Section metadata moved out of in-folder partials.**
- Section metadata (intro copy + valid `category` values for filter tabs) now
  lives in non-routed `content/_meta/<section>.md` files — **not** in-folder
  `_category.md`.
- The original `_category.md`-per-section approach was abandoned: an in-folder
  `_category.md` leaked into the section catch-all routes (`/<section>/_category`)
  and was removed.
- Nuxt Content **parses** `content/_meta/*.md` into the collection DB but does
  **not** return `_`-prefixed partials through `queryCollection(...)` at runtime
  (verified: the query yielded null and only the `All` tab rendered).
- Because of that, runtime section metadata is mirrored in a static
  `app/data/sectionMeta.ts` file. `content/_meta/*.md` remains the
  human-editable editorial source of truth (and the future-CMS seed); the two
  must be kept in sync.
- `app/composables/useSectionMeta.ts` reads the static mirror (synchronous,
  pure — never touches `queryCollection`), prepends `All`, and returns
  `{ title, chinese, description, categories }` to section index pages.

**Stage 4 shipped in four sub-stages:**
- **4A — metadata-driven tabs.** Section index pages render `CategoryTabs` from
  `useSectionMeta(section).categories` instead of hardcoded chips.
- **4B — active category filtering.** A pure `app/utils/filterByCategory.ts`
  (`matchesCategory`) filters the dossier grid by the active tab across all 8
  original section indexes.
- **4C — public secondary section routes.** Added public index + detail routes
  for `/rankings`, `/teachings`, and `/pantheon` (each: `index.vue` +
  `[...slug].vue`), reusing `SectionHero`, `CategoryTabs`, `DossierGrid`,
  `DossierCard`, `EmptyArchiveState`. `rankings`/`teachings`/`pantheon` entries
  were added to `sectionMeta.ts`.
- **4D — discoverability without header bloat.** Added a `更多 / More` dropdown
  at the end of the desktop header (Rankings, Teachings, Pantheon, Glossary),
  appended the same secondary items under a `更多 · More` divider in the mobile
  overlay, and added a new footer **Records** group (Rankings, Teachings,
  Pantheon). The primary 7 header links are unchanged.

**`/titles` remains internal.** Its content (`content/titles/sample.md`) and
`_meta` exist, but it is deliberately omitted from `sectionMeta.ts` and has no
`app/pages/titles/` route, so no `/titles` page is generated and it appears in
no nav surface.

**Stage 5 — related-entry system (static, build-time).** Detail pages now
surface both directions of a relationship, computed at generate time with no
backend and no new dependencies:
- `app/utils/relationshipConfig.ts` — declarative map of relationship frontmatter
  fields → inverse labels (`affiliations` → "Notable Members"; ranking
  `entries[].link` → "Appears in Rankings"), plus the `ROUTED_SECTIONS`
  allow-list and an `isRoutedPath` guard.
- `app/composables/useRelatedEntries.ts` — loads all entries once via
  `queryCollection('content').all()`, builds a `path → entry` map, then computes
  OUTGOING relations (this page's own fields) and INVERSE relations (other pages
  pointing at this page), grouped by label and resolved to a display shape.
- `app/components/RelatedEntries.vue` — renders each group as a **DossierCard
  grid** (reusing `DossierGrid` + `DossierCard`), so there is no new UI.

Currently wired detail pages (the related block renders only when relations
resolve):
- `/characters/chen-pingan` — "Affiliations" (outgoing → `/factions/sample`) and
  "Appears in Rankings" (inverse of ranking `entries[].link`).
- `/factions/sample` — "Notable Members" (inverse of character `affiliations`).

**`/titles` links are filtered out** of related grids by `ROUTED_SECTIONS` /
`isRoutedPath` until `/titles` gets a public route, so no related card can 404.
The same guard also blocks `_meta` / `_templates` partials.

The system is incremental: more relationship pairs (owners, practitioners,
participants, holders, …) can be enabled later by appending to
`RELATIONSHIP_FIELDS` — no composable or component changes needed.

**Stage 6A — static client-side search.** The header's search box is now a real
wiki-wide search, computed in-browser from build-time data with no backend, no
new dependencies, and no `/search` route:
- `app/composables/useSearch.ts` — loads all entries once via
  `queryCollection('content').all()` and filters them through the shared
  `isRoutedPath` guard, so `_meta`, `_templates`, and the internal `/titles`
  section are excluded from the index. Each record is projected to a minimal
  search shape (the client payload stays small).
- `app/utils/searchEntries.ts` — pure, case-insensitive substring matching with
  field-weighted scoring across **title, chinese, pinyin, category, tags, and
  description**, plus grouping of results by section.
- `app/composables/useSearchState.ts` — a shared `useState('search-open')` flag
  (open/close/toggle) so the header trigger, the mobile button, and the keyboard
  shortcuts all drive one modal.
- `app/components/SearchModal.vue` — a Teleport-to-body overlay with an
  autofocused input, section-grouped/ranked results, ↑/↓/Enter keyboard
  navigation, click-or-Enter `navigateTo` + close, body-scroll lock, and a
  reduced-motion fallback. Reuses the Shuimo visual system; no UI redesign.
- `app/components/SiteHeader.vue` — the desktop search placeholder is now a real
  button (with a ⌘K hint) that opens the modal; a mobile search button sits
  beside the hamburger below 1100px; `<SearchModal>` is mounted; and the global
  keydown handler opens search on `/` (when not typing in a field), toggles on
  Cmd/Ctrl-K, and closes on Escape, all within the existing listener lifecycle.

**Current clean prerender route count: 55** (`npm run generate`, exit 0).
Unchanged since Stage 4C; Stages 4D, 5, and 6A added no routes (search is a
client-side modal, not a `/search` page).

---

## 0. Guiding Principles

1. **Folder = section, frontmatter = classification.** The `content/` directory mirrors the URL and the top-level sections. Sub-categorization (e.g. "Grotto-Heaven" vs "Blessed Land") is expressed via frontmatter `category` / `subcategory`, not via deep folders. This keeps routing stable and makes future migration to a database trivial (each file becomes one row; frontmatter becomes columns).
2. **Flat where possible, nested only when it aids routing.** Avoid `content/world/locations/grotto-heavens/...` deep trees. Prefer `content/world/<slug>.md` + `category: Grotto-Heaven`. Index pages filter by category.
3. **Stable slugs are permanent IDs.** A page's path (e.g. `/characters/chen-pingan`) is treated as its canonical ID for cross-linking. Never rename casually — a future editor engine will use these as primary keys.
4. **Every relationship is a path reference.** Cross-links store the target page path (`/factions/zhengyang-mountain`), never a duplicated display name only. This makes the graph machine-traversable later.
5. **Schema is additive and optional.** All new frontmatter fields are optional in Zod so existing pages never break during rollout.

---

## 1. Top-Level Sections

### 1.1 Keep (existing)
| Section | Route | Nav? | Notes |
|---|---|---|---|
| Characters | `/characters` | Yes | Largest section; primary entry point. |
| World | `/world` | Yes | Umbrella for all places. Locations, Grotto-Heavens, Blessed Lands live here via `category`. |
| Cultivation | `/cultivation` | Yes | Realms, paths, methods. |
| Swordsmanship | `/swordsmanship` | Yes | Techniques, flying-sword arts, abilities. |
| Factions | `/factions` | Yes | Sects, dynasties, academies via `category`. |
| Artifacts | `/artifacts` | Yes | Weapons, flying swords, gourds via `category`. |
| Timeline | `/timeline` | Yes | Chronological events. |
| Glossary | `/glossary` | Secondary | Move into footer / "More" menu, not primary header. |

### 1.2 Add (new top-level sections)
| Section | Route | Nav? | Rationale |
|---|---|---|---|
| Rankings & Lists | `/rankings` | Secondary | Tier lists, realm ladders, "Ten Great…" lists. High fan value. |
| Three Teachings & Hundred Schools | `/teachings` | Secondary | 儒释道 + 百家. Conceptually distinct from sect Factions. |
| Pantheon (Gods / Demons / Spirits) | `/pantheon` | Secondary | 神祇/精怪/山水神. Distinct from mortal Characters. |
| Titles & Offices | `/titles` | Internal/nested | 头衔/官职/封号. Mostly referenced from other pages. |

### 1.3 Navigation strategy (avoid header bloat)
- **Primary header (max 6–7):** Characters, World, Cultivation, Swordsmanship, Factions, Artifacts, Timeline.
- **Secondary "More" dropdown (or footer columns):** Rankings, Teachings, Pantheon, Glossary, About.
- **Internal-only (no nav, reached via cross-links / search):** Titles & Offices. Surfaced contextually inside character/faction pages.

> Header currently has 7 desktop links. Adding 4 new sections to the header would bloat it. The "More" dropdown / footer pattern keeps the cinematic header clean while remaining discoverable.

**(as-built, Stage 4D)** This strategy shipped as planned:
- The desktop header keeps its 7 primary links unchanged and adds a `更多 / More`
  dropdown containing Rankings, Teachings, Pantheon, and Glossary.
- The mobile overlay lists the 7 primary links, then a `更多 · More` divider,
  then Rankings, Teachings, Pantheon, Glossary.
- A footer **Records** group holds Rankings, Teachings, Pantheon (Glossary stays
  in the footer **Lore** group; About stays in **Meta**).
- Titles & Offices is exposed in no nav surface and has no public route.

---

## 2. Content Folder Structure

> **(as-built)** The original plan placed an in-folder `_category.md` in every
> section. That approach was **abandoned**: an in-folder `_category.md` leaked
> into the section catch-all routes (`/<section>/_category`). Section metadata
> now lives in a single non-routed `content/_meta/` folder, and the runtime copy
> is mirrored in `app/data/sectionMeta.ts`. The tree below shows the as-built
> layout.

```
content/
  index.md                      # homepage content (existing)
  about.md                      # existing

  _meta/                        # NON-ROUTED section metadata (editorial source of truth)
    characters.md               # intro copy + valid `category` values for filter tabs
    world.md
    cultivation.md
    swordsmanship.md
    factions.md
    artifacts.md
    rankings.md
    teachings.md
    pantheon.md
    titles.md
    timeline.md
    glossary.md

  _templates/                   # NON-ROUTED entry templates (leading underscore = unpublished)
    character.md
    faction.md
    ...                         # one per entry type

  characters/                   # NO in-folder _category.md (it leaked into routes)
    chen-pingan.md
    ning-yao.md
    qi-jingchun.md

  world/                        # all places; differentiated by frontmatter `category`
    <slug>.md                   # category: Continent | Grotto-Heaven | Blessed Land | City | Landmark | Sword-Qi-Great-Wall

  cultivation/
    <slug>.md                   # category: Realm | Path | Method | Concept

  swordsmanship/
    <slug>.md                   # category: Technique | Flying-Sword-Art | Ability | Sword-Style

  factions/
    <slug>.md                   # category: Sect | Dynasty | Academy | Clan | Alliance

  artifacts/
    <slug>.md                   # category: Weapon | Flying-Sword | Sword-Nurturing-Gourd | Treasure | Material | Talisman

  rankings/                     # NEW (public, Stage 4C)
    <slug>.md                   # category: Tier-List | Realm-Ladder | Named-List

  teachings/                    # NEW (public, Stage 4C — Three Teachings & Hundred Schools)
    <slug>.md                   # category: Teaching | School   (儒/释/道 + 百家)

  pantheon/                     # NEW (public, Stage 4C — Gods / Demons / Spirits)
    <slug>.md                   # category: God | Demon | Spirit | Mountain-Water-Deity

  titles/                       # NEW (internal — content exists, NO public route)
    <slug>.md                   # category: Title | Office | Rank | Bestowed-Name

  timeline/
    <slug>.md                   # category: Era | Event | Arc

  glossary/
    <slug>.md                   # category: Term | Concept | Phrase
```

### 2.1 Section metadata: `content/_meta/` + static mirror (as-built)

> **(as-built)** The heading below originally read "Why `_category.md` instead of
> deep folders." In-folder `_category.md` was removed; the as-built mechanism is:

- Section metadata (intro copy + the list of valid `category` values for filter
  tabs + banner metadata) lives in **non-routed `content/_meta/<section>.md`**,
  not an in-folder `_category.md`. The leading-underscore folder keeps it from
  generating routes; an in-folder `_category.md` did **not** stay out of the
  catch-all routes and leaked as `/<section>/_category`, so it was removed.
- Nuxt Content **parses** `content/_meta/*.md` into the collection DB but does
  **not** return `_`-prefixed partials through `queryCollection(...)` at runtime.
  So the values cannot be read live by section index pages.
- Therefore runtime section metadata is **mirrored** in a static
  `app/data/sectionMeta.ts`. `content/_meta/*.md` stays the human-editable
  editorial source of truth (and future-CMS seed); `sectionMeta.ts` is the
  guaranteed SSG-safe runtime copy. The two must be kept in sync by hand.
- `app/composables/useSectionMeta.ts` reads the **static mirror** (synchronous,
  pure — it never calls `queryCollection`), prepends `All`, and returns
  `{ title, chinese, description, categories }` to the section index pages.
- Sub-grouping (Grotto-Heavens, Blessed Lands, Sects, Dynasties) is still a
  `category` filter, not a folder. A page can be re-categorized by editing one
  frontmatter line — exactly what a future editor UI will do.

### 2.2 Media co-location convention
Keep media in `public/` (current convention), mirrored by section:
```
public/images/characters/<slug>.webp
public/images/world/<slug>.webp
public/images/factions/<slug>.webp
public/images/banners/<section>-banner.webp
```
This keeps content files portable and DB-migration-friendly (image is just a path string).

---

## 3. Entry Templates

Each template = standard frontmatter block + a recommended heading skeleton using existing MDC components (`::quote-block`, `::realm-badge`, `::relationship-list`, `::lore-card`, `::image-frame`). Templates live in a non-routed location so they don't generate pages.

> Recommended template location: `content/_templates/<type>.md` (the leading underscore keeps Nuxt Content from publishing them) OR a `docs/templates/` mirror. Prefer `content/_templates/` so the schema/components are validated identically to real pages.

### 3.1 Character
```
## Overview        (::quote-block + lead paragraph)
## Appearance
## Personality
## Cultivation      (::realm-badge + path links)
## Abilities        (links to /swordsmanship, /cultivation)
## Relationships    (::relationship-list)
## Affiliations     (links to /factions, /titles)
## Story / Arc
## Trivia
## Notes (verification)
```

### 3.2 Faction / Sect
```
## Overview
## History / Founding
## Hierarchy & Structure   (links to /titles)
## Notable Members         (::relationship-list → /characters)
## Location                (link to /world)
## Teachings / Lineage     (link to /teachings, /cultivation)
## Treasures               (links to /artifacts)
## Notes
```

### 3.3 Artifact / Weapon
```
## Overview
## Appearance
## Abilities / Properties
## Wielders / Owners       (::relationship-list → /characters)
## Origin / Forging        (links to /factions, /world)
## Rank / Tier             (link to /rankings)
## Notes
```

### 3.4 World / Location
```
## Overview
## Geography
## Governing Power         (links to /factions, /titles)
## Notable Inhabitants     (→ /characters, /pantheon)
## Significance / Events   (→ /timeline)
## Sub-Locations           (→ /world)
## Notes
```

### 3.5 Cultivation Path / Realm
```
## Overview
## Realm Position          (::realm-badge / RealmLadder)
## Requirements
## Characteristics
## Notable Practitioners    (→ /characters)
## Associated Schools       (→ /teachings, /factions)
## Notes
```

### 3.6 Swordsmanship / Ability
```
## Overview
## Mechanics
## Origin / Lineage         (→ /factions, /teachings)
## Known Users              (→ /characters)
## Related Artifacts        (→ /artifacts)
## Tier / Ranking           (→ /rankings)
## Notes
```

### 3.7 Ranking / List
```
## Overview / Criteria
## The List                 (ordered entries → /characters, /artifacts, /factions)
## Disputed / Unverified
## Source                   (sourceNotes)
## Notes
```

### 3.8 Teaching / School (Three Teachings & Hundred Schools)
```
## Overview
## Core Philosophy
## Key Figures              (→ /characters)
## Associated Factions      (→ /factions)
## Influence on Cultivation (→ /cultivation)
## Notes
```

### 3.9 God / Demon / Spirit (Pantheon)
```
## Overview
## Nature & Domain
## Appearance
## Powers
## Worship / Territory       (→ /world)
## Relationships            (::relationship-list → /characters, /pantheon)
## Notes
```

### 3.10 Title / Office
```
## Overview
## Meaning & Significance
## Holders (current & historical)  (→ /characters)
## Granting Authority              (→ /factions, /world)
## Notes
```

### 3.11 Timeline Event
```
## Summary
## Participants             (→ /characters, /factions)
## Location                 (→ /world)
## Outcome / Consequences
## Related Events           (→ /timeline)
## Notes
```

### 3.12 Glossary
```
## Definition
## Context / Usage
## Related Terms            (→ /glossary, /cultivation)
## Notes
```

---

## 4. Frontmatter Schema

### 4.1 Shared base fields (all entry types)
| Field | Type | Purpose |
|---|---|---|
| `title` | string (required) | English display title. |
| `titleZh` | string | Chinese title. *(Migrate existing `chinese` → `titleZh`; keep `chinese` as alias during transition.)* |
| `pinyin` | string | Romanization. |
| `section` | string | Top-level section key (characters, world, …). Redundant with folder but explicit for future DB. |
| `category` | string | Sub-type within section (Grotto-Heaven, Sect, Flying-Sword…). Drives filter tabs. |
| `subcategory` | string | Optional finer grouping. |
| `status` | string | In-universe status (Alive, Deceased, Active, Ruined…). |
| `importance` | enum: `primary` \| `major` \| `minor` \| `background` | Sort weight + spotlight eligibility. |
| `image` | string (path) | Portrait/thumbnail. |
| `banner` | string (path) | Wide hero banner. |
| `seal` | string | 1-char seal accent (existing). |
| `description` | string | Short summary (cards, meta). |
| `tags` | string[] | Free-form cross-cutting labels. |
| `related` | string[] (paths) | Generic related entries. |
| `verificationStatus` | enum: `verified` \| `to-be-verified` \| `disputed` \| `speculative` | Replaces ad-hoc "To be verified" in `status`. |
| `sourceNotes` | string | Citation / chapter reference. |
| `firstAppearance` | string | Chapter / volume of first appearance. |
| `lastUpdated` | string (ISO date) | Maintenance signal. |

### 4.2 Type-specific fields
| Type | Extra fields |
|---|---|
| Character | `affiliations: string[]` (→/factions), `realm` (→/cultivation), `titles: string[]` (→/titles), `origin` (→/world), `abilities: string[]` (→/swordsmanship), `relationships: {name, relation, link}[]` |
| Faction | `factionType`, `headquarters` (→/world), `leader` (→/characters), `members: string[]`, `teachings: string[]` (→/teachings) |
| Artifact | `artifactType`, `tier` (→/rankings), `owners: string[]` (→/characters), `origin` |
| World | `locationType`, `governingFaction` (→/factions), `parentLocation` (→/world), `inhabitants: string[]` |
| Cultivation | `realmLevel` (number), `pathType`, `practitioners: string[]` |
| Swordsmanship | `abilityType`, `users: string[]`, `lineage` (→/factions or /teachings) |
| Ranking | `listType`, `entries: {rank, name, link, note}[]` |
| Teaching | `teachingType`, `keyFigures: string[]`, `relatedFactions: string[]` |
| Pantheon | `beingType`, `domain`, `territory` (→/world) |
| Title | `titleType`, `holders: string[]`, `grantedBy` (→/factions) |
| Timeline | `date` / `era`, `eraOrder` (number, for sorting), `participants: string[]`, `location` (→/world) |
| Glossary | `termType`, `relatedTerms: string[]` |

### 4.3 Zod migration approach (additive, non-breaking)
- Extend the single `content` collection schema in `content.config.ts` with all fields as `.optional()`.
- Keep `chinese` and `category`/`status` working as-is; introduce `titleZh`/`verificationStatus` alongside, then migrate gradually.
- No page breaks because every new field is optional.

---

## 5. Cross-Linking Strategy

**Principle:** every relationship is stored as a **path string** on at least one side; index/aggregation pages compute the inverse at build time.

| Relationship | Stored on | Field | Inverse computed where |
|---|---|---|---|
| Character → Faction | character | `affiliations[]` | Faction page "Notable Members" |
| Character → Artifact | artifact | `owners[]` | Character page "Abilities/Items" |
| Character → Cultivation path | character | `realm`, `abilities[]` | Cultivation page "Practitioners" |
| Location → Faction | world | `governingFaction` | Faction page "Location" |
| Timeline event → Character | timeline | `participants[]` | Character page "Story/Arc" |
| Ranking → Character/Artifact | ranking | `entries[].link` | Listed entity shows "Appears in ranking" |
| Title/Office → Character & Faction | title | `holders[]`, `grantedBy` | Character "Affiliations", Faction "Hierarchy" |

Implementation notes:
- Use Nuxt Content's `queryCollection` to resolve inverse relationships at build time (static-friendly, no runtime DB).
- A small build-time composable (e.g. `useRelatedEntries(path)`) centralizes graph traversal so the future editor can reuse the same logic.
- Display via existing `RelationshipList` / `RelatedLinks` components — no new UI needed.

**(as-built, Stage 5)** This strategy is now implemented. The build-time composable is `app/composables/useRelatedEntries.ts`; relationship fields and their inverse labels are declared in `app/utils/relationshipConfig.ts`. Display uses **DossierCard grids** via a thin `app/components/RelatedEntries.vue` (which composes the existing `DossierGrid` + `DossierCard`) — `RelatedLinks` was left as section-portal navigation and not repurposed. Live pairs so far: Character → Faction (`affiliations`, inverse "Notable Members") and Ranking → Character (`entries[].link`, inverse "Appears in Rankings"). The remaining rows in the table above (owners, practitioners, participants, holders/grantedBy, governingFaction) are enabled incrementally by appending to `RELATIONSHIP_FIELDS`. Title/Office relationships are deferred until `/titles` has a public route, since `isRoutedPath` drops links to unrouted sections.

---

## 6. Implementation Roadmap

| Stage | Goal | Scope (safe, incremental) | Mode | Status |
|---|---|---|---|---|
| **1. Architecture planning** | This document approved. | No code. | Architect | ✅ Done |
| **2. Templates + schema** | Extend Zod schema (all optional); create `content/_templates/*.md`. | Edit `content.config.ts`; add template files. Existing pages untouched. | Code | ✅ Done |
| **3. Sample pages + metadata** | One sample page per new section + section metadata. | **(as-built)** Metadata placed in `content/_meta/<section>.md` (not in-folder `_category.md`, which leaked into routes and was removed); added 1 sample each for rankings, teachings, pantheon, titles. | Code | ✅ Done |
| **4A. Metadata-driven tabs** | Index pages render filter tabs from section metadata. | `useSectionMeta` reads the `app/data/sectionMeta.ts` static mirror; index pages render `CategoryTabs` from it. | Code | ✅ Done |
| **4B. Active category filtering** | Tabs actually filter the dossier grid. | Pure `app/utils/filterByCategory.ts` (`matchesCategory`) wired into all 8 original section indexes. | Code | ✅ Done |
| **4C. Public secondary section routes** | Public index + detail for the new sections. | Added `index.vue` + `[...slug].vue` for `/rankings`, `/teachings`, `/pantheon`; added their entries to `sectionMeta.ts`. `/titles` left internal (no route). | Code | ✅ Done |
| **4D. Discoverability (no header bloat)** | Surface secondary sections without crowding the header. | `更多 / More` desktop dropdown + mobile `更多 · More` divider (Rankings, Teachings, Pantheon, Glossary) + footer **Records** group. Primary 7 unchanged. | Code | ✅ Done |
| **5. Related-entry system** | Build-time composable + computed outgoing/inverse links on detail pages. | **(as-built)** Added `app/utils/relationshipConfig.ts`, `app/composables/useRelatedEntries.ts`, and `app/components/RelatedEntries.vue` (DossierCard grids). Wired `/characters/chen-pingan` (Affiliations + Appears in Rankings) and `/factions/sample` (Notable Members). `/titles` links filtered via `ROUTED_SECTIONS`/`isRoutedPath` until titles has a route. Did **not** repurpose `RelatedLinks` (section-portal nav). | Code | ✅ Done |
| **6A. Static client-side search** | Wiki-wide search over public content, no backend. | **(as-built)** Added `app/composables/useSearch.ts` (`queryCollection('content').all()` filtered through `isRoutedPath`), `app/utils/searchEntries.ts` (weighted match over title/chinese/pinyin/category/tags/description + section grouping), `app/composables/useSearchState.ts`, and `app/components/SearchModal.vue` opened from `SiteHeader` (placeholder button + mobile button; `/` and Cmd/Ctrl-K to open, Escape to close). No `/search` route. | Code | ✅ Done |
| **6B. Tag / advanced filtering** | Client-side tag filtering beyond the per-section category tabs. | Build on the Stage 6A index; optional facet UI. | Code | ⏳ Pending |
| **7. Future editor/CMS planning** | Design doc for custom wiki engine (maps frontmatter → DB rows, paths → IDs). | Planning only. | Architect | ⏳ Pending |

Each stage ends with `npm run generate` + Playwright spot-check on `/` and one affected section, per project testing rules. **Current clean prerender route count: 55** (unchanged since Stage 4C; Stages 4D, 5, and 6A added no routes).

---

## 7. What NOT to Implement Yet (explicitly postponed)

- ❌ Custom editor engine / WYSIWYG.
- ❌ User accounts / login.
- ❌ Permissions / roles.
- ❌ Revisions / page history / diffs.
- ❌ Any database (SQLite, Postgres, etc.).
- ❌ MediaWiki-like backend or PHP layer.
- ❌ Heavy search backend (Algolia, Elasticsearch, Meilisearch server).
- ❌ Real-time collaboration.
- ❌ Comments / discussion pages.

The architecture above is intentionally **DB-shaped while staying file-based**: when the editor engine arrives, each markdown file → one record, frontmatter → columns, path → primary key, and the relationship fields → foreign keys/join tables. No restructuring required.

---

## 8. Future-Compatibility Notes (for the eventual editor engine)

1. **Paths are immutable IDs.** Treat `/section/slug` as the canonical key. A redirect map should be introduced before any future rename.
2. **Frontmatter is the record.** Keep all structured data in frontmatter (not prose) so it can be parsed into DB columns losslessly.
3. **Relationships are typed path arrays.** The `affiliations`, `owners`, `participants` shape directly becomes join tables.
4. **`verificationStatus` + `sourceNotes` + `lastUpdated`** are the seeds of an editorial workflow (review queue) without needing accounts yet.
5. **One collection, many categories.** Keeping a single Nuxt Content collection (vs many) mirrors a single `pages` table with a `section` discriminator — simplest migration target.
