# Stage 26A: Characters Specialized Page Audit

## Status

Stage 26A is an audit-only pass for `/characters`.

Timeline is frontend-complete as a dark chronicle experience. Cultivation is frontend-complete as a cultivation system map. Characters should become a third specialized surface: a dossier wall and relationship atlas, not another timeline rail, cultivation ladder, or generic card archive.

No lore, entries, schema, public videos, or public fonts were changed during this audit.

## Current Characters Page Status

The current route is `app/pages/characters/index.vue`.

It is currently a generic archive grid:

- queries all content where `path LIKE /characters/%`
- sorts alphabetically by `title`
- filters by `category` through `CategoryTabs`
- renders a shared `SectionHero`
- renders `DossierGrid` plus one `DossierCard` per entry
- renders `EmptyArchiveState` when filtered results are empty
- renders `RelatedLinks` to World, Factions, and Cultivation

Related components inspected:

- `app/components/SectionHero.vue`
- `app/components/CategoryTabs.vue`
- `app/components/DossierGrid.vue`
- `app/components/DossierCard.vue`
- `app/components/EmptyArchiveState.vue`
- `app/components/RelatedLinks.vue`
- `app/components/ArchivePortal.vue`
- `app/components/EntryDetail.vue`
- `app/components/EntryRelationshipPanel.vue`
- `app/components/CharacterHero.vue`
- `app/components/CharacterInfobox.vue`
- `app/components/FeaturedDossier.vue`
- `app/components/FeaturedSpotlight.vue`

The route has no specialized character-index logic yet. Specialized character treatment exists mostly on detail pages via `EntryDetail`, `CharacterHero`, `EntryInfobox`, and `EntryRelationshipPanel`.

## Current Filter Issue

`content/_meta/characters.md` and `app/data/sectionMeta.ts` list:

- `Character`
- `Major`
- `Minor`
- `Gods`

Actual character files use:

- `category: Character` on 33 entries
- `category: Gods` on 2 entries
- `importance: primary / major / minor` for prominence

Because `matchesCategory()` checks only `category`, the `Major` and `Minor` tabs currently return empty results. Stage 26B should not preserve that behavior. The safest fix is to separate archive filters from prominence grouping:

- archive filters: derive from real `category` values or use `All`, `Character`, `Gods`
- prominence sections: derive from `importance`

No schema change is needed for that.

## Character Content Inventory

Current character entries under `content/characters/`: 35.

Entries:

- A Liang
- Cao Qinglang
- Chen Ping'an
- Chen Qingdu
- Cui Chan
- Cui Dongshan
- Dao Ancestor
- Dong Gu
- Gu Can
- Li Baoping
- Li Liu
- Liu Shiliu
- Liu Xianyang
- Lu Chen
- Mao Xiaodong
- Most Holy Teacher
- Ning Yao
- Old Scholar
- Pei Qian
- Qi Jingchun
- Ritual Sage
- Ruan Qiong
- Ruan Xiu
- She Yue
- Song Jixin
- Sub-Sage
- Wei Bo
- Wei Jin
- Xie Ling
- Xu Xiaoqiao
- Yao Laotou
- Yu Dou
- Zheng Juzhong
- Zhou Mili
- Zuo You

## Frontmatter Readiness

Field coverage from the current 35 files:

| Field | Present | Usable | Notes |
| --- | ---: | ---: | --- |
| `category` | 35 | 35 | Mostly `Character`, plus 2 `Gods`. |
| `subcategory` | 22 | 22 | Useful for compact role badges, but inconsistent. |
| `role` | 0 | 0 | Not currently available and not in schema. |
| `faction` | 0 | 0 | Not currently available and not in schema. Use `affiliations`. |
| `affiliations` | 35 | 35 | Strongest grouping field. |
| `relationships` | 32 | 32 | Strong relationship-preview field. |
| `related` | 34 | 34 | Strong graph-adjacent field, but some missing targets. |
| `importance` | 35 | 35 | Good for protagonist/major/minor prominence, but `primary` is broad. |
| `verificationStatus` | 35 | 35 | Good for archive trust badges. |
| `image` | 34 | 3 | Most are empty strings. Do not design around portraits. |
| `banner` | 32 | 0 | Present but empty. Do not depend on banners. |
| `video` | 32 | 2 | Detail-page enhancement only. |
| `seal` | 35 | 35 | Best visual anchor for a dossier wall. |
| `realm` | 15 | 12 | Partial. Useful as optional detail. |
| `titles` | 12 | 11 | Partial. Useful as optional detail. |
| `origin` | 17 | 16 | Partial. Useful as optional detail. |
| `abilities` | 12 | 9 | Partial. Not enough for primary grouping. |
| `firstAppearance` | 32 | 1 | Not enough for era/arc grouping. |
| `lastUpdated` | 32 | 32 | Useful for freshness metadata only. |

Importance distribution:

- `primary`: 21
- `major`: 13
- `minor`: 1

Verification distribution:

- `verified`: 18
- `to-be-verified`: 17

Category distribution:

- `Character`: 33
- `Gods`: 2

Media-ready entries:

- Chen Ping'an: image
- Ning Yao: image and video
- Qi Jingchun: image and video

Available image assets:

- `public/images/characters/chen-pingan.webp`
- `public/images/characters/ning-yao.webp`
- `public/images/characters/ning-yao.jpg`
- `public/images/characters/qi-jingchun.webp`
- `public/images/characters/qi-jingchun.jpg`
- `public/images/banners/characters-banner.webp`
- `public/images/portalcard/Character-portalcard.webp`

## Grouping Readiness

### Protagonists / Main Cast

Partially supported.

`importance` can highlight primary records, but `primary` has 21 entries, so it is too broad for a tight "main cast" carousel. `tags` includes `protagonist` for Chen Ping'an, but that is not broad enough to create a full main-cast taxonomy.

Recommendation: do not label a section "main cast" unless using softer language such as "Start Here" or "Central Records" and selecting by current data:

- `importance === primary`
- strongest relationship centrality
- verified or highly connected records

### Major Supporting Characters

Supported by `importance: major`, with 13 entries.

This can power a secondary strip or archive filter, but should not be tied to the current `category` tabs.

### Factions / Affiliations

Strongly supported by `affiliations`.

Top affiliation clusters:

- `/factions/confucian-temple`: 8
- `/factions/luopo-mountain`: 7
- `/factions/wen-sheng-lineage`: 7
- `/factions/dragon-springs-sword-sect`: 6
- `/factions/great-li-dynasty`: 4
- `/world/sword-qi-great-wall`: 4
- `/factions/bai-yujing`: 3
- `/factions/shanya-academy`: 3

This is the best candidate for a specialized character-index grouping module.

### Relationship Clusters

Strongly supported, with caution.

The graph has enough data for a preview:

- 32 entries have structured `relationships`
- 34 entries have `related`
- Chen Ping'an appears in `related` 25 times
- Qi Jingchun appears 8 times
- Cui Chan, Liu Xianyang, and Old Scholar appear 6 times each

Most relationship-rich records by available data:

- Gu Can
- Wei Jin
- Old Scholar
- Li Liu
- Pei Qian
- Ruan Xiu
- Ruan Qiong
- Xie Ling
- Zhou Mili
- A Liang
- Li Baoping
- Liu Shiliu

Some referenced paths are missing from the current content set, so Stage 26B should filter graph links to existing records or render unresolved names as plain text. Do not create missing entries as part of the frontend pass.

### Cultivation / Path Roles

Partially supported.

`subcategory`, `realm`, `titles`, `abilities`, and tags contain useful role/path signals, but coverage is inconsistent. They are good as supporting metadata inside dossier cards, not as the main page architecture.

### Era / Arc Relevance

Not ready.

`firstAppearance` is only usable on one entry, and character records do not carry timeline/arc fields. Do not build an era/arc character map in Stage 26B.

## Missing / Risky Reference Paths

A local cross-check found 30 missing character reference occurrences across 27 unique paths, mostly from `related`, `affiliations`, and relationship links.

Common examples:

- `/factions/baidi-city`
- `/characters/zhou-mi`
- `/characters/lu-zhi`
- `/world/shujian-lake`
- `/characters/li-xisheng`
- `/characters/li-er`
- `/characters/li-huai`
- `/characters/yang-laotou`
- `/artifacts/tianzhen`
- `/swordsmanship/zhan-xian`

Stage 26B graph previews should use the existing entry resolver pattern or an explicit existing-path set before rendering links. Missing targets can still appear as plain labels only when the current frontmatter already names them.

## Specialized Page Direction

Recommended direction: Character Dossier Wall + Relationship Atlas.

This should feel like an archive table covered in seals, dossier strips, thread lines, and faction clusters. The page should preserve the Shuimo identity, but become more investigative and relational than the current grid.

Core principles:

- Use `seal`, names, `importance`, `verificationStatus`, `subcategory`, and `affiliations` as the primary visual material.
- Treat portraits as optional enhancements only.
- Make relationships visible without pretending the graph is complete.
- Keep a compact archive below the specialized modules.
- Avoid dark Timeline styling and avoid Cultivation's system-map/ladders.
- Avoid generic equal card grids as the first impression.

## Proposed Modules

### 1. Dossier Atlas Hero

Replace the generic `SectionHero` with a Characters-specific hero that reads like an archive desk:

- title and Chinese title from `useSectionMeta('characters')`
- count ledger: total characters, verified records, affiliation clusters
- seal field background using a few existing `seal` values
- optional use of `/images/banners/characters-banner.webp`
- no new lore or claims

Current content is enough.

Schema changes are not needed.

Mobile risk: dense ledger and seal background can crowd the title. Keep hero copy short and stack the counts.

Visual risk: do not make it look like Timeline's cinematic black hero or Cultivation's centered system hero.

### 2. Start Here Dossier Strip

A horizontal or wrapped strip of central records derived from current data:

- prefer Chen Ping'an when `tags` includes `protagonist`
- include high-connectivity `primary` records using `related` / `relationships` counts
- show seal, English name, Chinese name, importance, verification status, and a short description

No hardcoded lore labels like "main cast" unless supported by fields.

Current content is enough.

Schema changes are not needed.

Mobile risk: horizontal scrollers can hide content. Use snap cards plus a stacked fallback or a two-column-to-one-column grid.

Visual risk: portraits are scarce, so use seal/name typographic treatment as the default.

### 3. Relationship Web Preview

A compact, non-canvas relationship preview centered around the strongest current graph nodes:

- render a small constellation using CSS grid/absolute connectors or a simple SVG overlay generated from data
- central node can be the most referenced current character path, currently Chen Ping'an
- surrounding nodes should be existing `/characters/*` records only
- unresolved relationship labels should not link

Current content is enough for a preview.

Schema changes are not needed.

Mobile risk: connector lines can overlap labels. On mobile, collapse to a relationship list or radial-free cluster rows.

Visual risk: a graph can become noisy fast. Limit to 6-9 nodes and link to the full archive below.

### 4. Affiliation Cluster Board

Group characters by `affiliations`:

- show the top 5-8 affiliation clusters with current member counts
- use existing path labels resolved from available entries when possible
- list representative character chips under each cluster
- include a fallback label derived from slug only when the target entry is missing

Current content is enough.

Schema changes are not needed.

Mobile risk: multi-cluster boards can become too tall. Limit initial clusters and keep character chips compact.

Visual risk: missing faction pages should not look like broken routes. If a faction path is missing, render as text, not as a link.

### 5. Compact Archive Below

Keep the full archive, but replace or restyle the generic grid:

- derive real category filters from actual `category` values
- add optional prominence filter or segmented control for `importance`
- use compact dossier rows/cards that fit many records
- keep `DossierCard` available if reused elsewhere, but Characters can use a specialized `CharacterArchiveCard`

Current content is enough.

Schema changes are not needed.

Mobile risk: dual filters can overwhelm small screens. Consider one filter row plus a simple count line.

Visual risk: if the archive remains a large portrait-card grid, the specialized top modules may feel bolted on.

## Files Likely Affected In Stage 26B

Primary file:

- `app/pages/characters/index.vue`

Likely new components:

- `app/components/CharactersAtlasHero.vue`
- `app/components/CharactersDossierStrip.vue`
- `app/components/CharactersRelationshipPreview.vue`
- `app/components/CharactersAffiliationClusters.vue`
- `app/components/CharactersArchiveList.vue` or `app/components/CharacterArchiveCard.vue`

Likely reused components/utilities:

- `CategoryTabs`
- `EmptyArchiveState`
- `RelatedLinks`
- `ScrollReveal`
- `SealBadge`
- `RouteDisplayLink`
- `createEntryResolver`
- `resolvePublicImage`
- `matchesCategory`

Possible small helper:

- `app/utils/characterArchive.ts` for pure grouping/sorting helpers, if keeping the page component lean is worth it.

Files that should not change in Stage 26B:

- `content.config.ts`, unless a later schema pass is explicitly approved
- `content/characters/*.md`, unless separately approved
- `public/videos/*`
- `public/fonts/*`

## Schema Recommendation

No schema change is needed for Stage 26B.

Current data can support:

- dossier strip
- relationship preview
- affiliation clusters
- compact archive
- verification/importance badges

Do not add `role`, `faction`, `arc`, or `mainCast` fields yet. If a later content pass wants cleaner editorial control, the likely future candidates are:

- `role`
- `displayGroup`
- `arcRelevance`

Those should be deferred until after the specialized page proves which labels the frontend actually needs.

## Recommended Stage 26B Plan

1. Refactor `app/pages/characters/index.vue` into a typed Characters index.
   - Query character items once.
   - Compute total, verified count, category options, importance groups, affiliation clusters, and safe relationship graph data.
   - Keep SEO metadata from `useSectionMeta('characters')`.

2. Build `CharactersAtlasHero`.
   - Use current section metadata and computed counts.
   - Use seal typography and the existing characters banner as optional atmosphere.
   - Avoid video dependency.

3. Build `CharactersDossierStrip`.
   - Use current data to show a small "Start Here" group.
   - Select by `tags.includes('protagonist')`, `importance`, and graph centrality.
   - Do not invent role labels.

4. Build `CharactersRelationshipPreview`.
   - Render a small safe graph from existing character paths only.
   - Link only to existing pages.
   - Collapse to a list on mobile.

5. Build `CharactersAffiliationClusters`.
   - Group by `affiliations`.
   - Resolve target entries when they exist.
   - Render missing affiliation targets as text labels derived from the path, not links.

6. Replace the current archive grid with a compact archive section.
   - Use actual `category` values for category filtering.
   - Add a simple prominence filter only if it remains clear on mobile.
   - Preserve all entries and existing detail routes.

7. Run lightweight validation.
   - `git diff --name-only`
   - project typecheck/lint/generate only if Stage 26B implementation touches enough code to justify it
   - Chrome DevTools MCP visual inspection is allowed if needed, but Playwright should remain unused per the Stage 26 request.

## Risks And Constraints

- Do not generate new lore or new entries.
- Do not create missing character/faction/world/artifact pages during frontend work.
- Do not change schema in Stage 26B unless explicitly approved.
- Do not touch `public/videos` or `public/fonts`.
- Do not rely on portraits; only 3 character entries have usable image paths.
- Do not rely on banners; current character banners are empty.
- Do not use `category: Major/Minor`; use `importance` for prominence.
- Relationship previews must filter or gracefully handle missing paths.
- Mobile graph rendering is the main UX risk.
- The page should not borrow Timeline's black/gold chronicle treatment.
- The page should not borrow Cultivation's ladder/system-map structure.
- The page should remain SSG-friendly and avoid browser-only graph logic in the main render path.

## Stage 26A Verdict

Characters is ready for a specialized frontend pass without schema changes.

The best Stage 26B direction is a Character Dossier Wall + Relationship Atlas:

- specialized hero
- start-here dossier strip
- small relationship preview
- affiliation cluster board
- compact full archive

The existing data is strongest for relationships, affiliations, importance, verification status, seals, names, and descriptions. The design should lean into those strengths and treat media as optional.
