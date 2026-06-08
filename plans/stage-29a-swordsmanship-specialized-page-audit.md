# Stage 29A: Swordsmanship Specialized Page Audit

Date: 2026-06-08

Scope: audit only. No implementation, no schema changes, no new lore, no new swordsmanship entries, no content edits, no edits to `public/videos` or `public/fonts`, no Playwright, no screenshots, and no staging.

Design guidance used as audit lenses only:

- `gpt-taste`
- `high-end-visual-design`
- `redesign-existing-projects`

## QA commands run

- `git status --short`
- `git diff --name-only`

Working tree note: the repo was already dirty before this audit. Existing unrelated changes include deleted/modified prior files, untracked `.agents/`, `.playwright-mcp/`, artifacts, videos under `public/videos/curated/`, scripts, and other local files. This audit does not stage files and does not use `git add -A`.

## Current Swordsmanship page status

`app/pages/swordsmanship/index.vue` is currently a generic archive grid, not a specialized swordsmanship experience.

Current index structure:

- Uses `useSectionMeta('swordsmanship')` for title, description, and category filters.
- Queries `queryCollection('content')` where `path LIKE /swordsmanship/%`, ordered by title.
- Tracks `activeCategory` and filters through shared `matchesCategory`.
- Renders shared `SectionHero` with `/images/banners/swordsmanship-banner.webp`.
- Renders shared `CategoryTabs`.
- Renders shared `DossierGrid` and `DossierCard` for each filtered item.
- Falls back to shared `EmptyArchiveState`.
- Ends with shared `InkDivider` and `RelatedLinks` to Characters, Cultivation, and Artifacts.

`app/pages/swordsmanship/[...slug].vue` exists and is generic by design:

- Resolves one content page by `route.path`.
- Throws a 404 when no content page exists.
- Uses `useRelatedEntries(route.path)`.
- Renders shared `EntryDetail` with `section="swordsmanship"` and `section-title="Swordsmanship"`.
- Sets SEO from entry title, description, and image/banner.

Conclusion: `/swordsmanship` is currently a generic section archive. The detail route has a section-aware dossier shell through shared `EntryDetail`, but the landing/index route does not yet express sword-specific structure.

## Components currently used

- `SectionHero.vue`: shared section hero with banner/video support, watermark, seal, ornamental divider, and attribution.
- `CategoryTabs.vue`: shared filter controls.
- `DossierGrid.vue`: generic responsive card grid.
- `DossierCard.vue`: generic archive card with image/placeholder, category, status, title, Chinese name, and description.
- `EmptyArchiveState.vue`: shared empty state.
- `InkDivider.vue`: shared separator.
- `RelatedLinks.vue`: shared related section portals.
- `EntryDetail.vue`: shared detail-page reader shell.
- `EntryInfobox.vue`: shared infobox renderer. Swordsmanship profile already exists as "Sword Art Dossier".
- `EntryRelationshipPanel.vue`, `RouteDisplayLink.vue`, and `entryLinkResolver.ts`: important safety layer for related entries and missing route display.

Existing Swordsmanship specialization outside the index:

- `content.config.ts` supports `abilityType`, `users`, and `lineage`.
- `app/data/fieldRegistry.ts` exposes swordsmanship editor fields: `abilityType`, `lineage`, and `users`.
- `app/data/entryInfoboxProfiles.ts` has a swordsmanship infobox profile with category, subcategory, `abilityType`, `lineage`, `users`, `related`, and source footer fields.
- `app/utils/relationshipConfig.ts` includes `users`, so detail pages can show outgoing Known Users and inverse Techniques & Arts.

## Current swordsmanship content

Public entries under `content/swordsmanship/`, excluding `_sample.md`:

1. `/swordsmanship/caged-sparrow`

Internal scaffold:

- `content/swordsmanship/_sample.md` exists but is excluded from public collection queries by `content.config.ts`.

Template:

- `content/_templates/swordsmanship.md` includes template fields such as `subcategory`, `importance`, `verificationStatus`, `image`, `banner`, `seal`, `abilityType`, `tier`, `users`, `lineage`, `tags`, `related`, `firstAppearance`, `sourceNotes`, and `lastUpdated`.

## Frontmatter readiness

Field presence across the one public swordsmanship entry:

| Field | Present | Non-empty | Current value notes |
| --- | ---: | ---: | --- |
| `title` | 1 | 1 | `Caged Sparrow` |
| `chinese` | 1 | 1 | Present. |
| `pinyin` | 1 | 1 | Present. |
| `section` | 1 | 1 | `swordsmanship` |
| `category` | 1 | 1 | `Flying-Sword-Art` |
| `subcategory` | 0 | 0 | Not present. |
| `status` | 1 | 1 | `Active` |
| `importance` | 1 | 1 | `primary` |
| `verificationStatus` | 1 | 1 | `to-be-verified` |
| `seal` | 1 | 1 | Present. |
| `image` | 1 | 1 | `/images/swordsmanship/caged-sparrow.webp` |
| `banner` | 1 | 0 | Empty string. |
| `description` | 1 | 1 | Present. |
| `tags` | 1 | 1 | `natal-flying-sword`, `small-heaven-and-earth`, `chen-pingan` |
| `users` | 1 | 1 | `/characters/chen-pingan` |
| `related` | 1 | 1 | `/artifacts/moon-in-the-well`, `/artifacts/dragon-slaying-stone` |
| `sourceNotes` | 1 | 1 | Present. |
| `lastUpdated` | 1 | 1 | `2026-05-31` |
| `firstAppearance` | 0 | 0 | Not present. |
| `practitioner` | 0 | 0 | Not present. |
| `practitioners` | 0 | 0 | Not present on swordsmanship entry. |
| `creator` | 0 | 0 | Not present. |
| `origin` | 0 | 0 | Not present. |
| `relationships` | 0 | 0 | Not present. |
| `weapon` | 0 | 0 | Not present. |
| `techniqueType` | 0 | 0 | Not present. |
| `abilityType` | 0 | 0 | Supported by schema/template but not used by current public entry. |
| `school` | 0 | 0 | Not present. |
| `affiliatedFaction` | 0 | 0 | Not present. |
| `lineage` | 0 | 0 | Supported by schema/template but not used by current public entry. |

Category distribution:

- `Flying-Sword-Art`: 1

Verification distribution:

- `to-be-verified`: 1

Importance distribution:

- `primary`: 1

Media readiness:

- The section banner `/images/banners/swordsmanship-banner.webp` exists in the media library.
- The portal card `/images/portalcard/swordsmanship-portalcard.png` exists in the media library.
- The entry image path `/images/swordsmanship/caged-sparrow.webp` is authored in frontmatter but is not currently present in the media library or `public/images` inventory found during this audit. Existing `resolvePublicImage` behavior will return an empty string for uncurated image paths, so the frontend should render a seal/text fallback instead of a broken image.

## Possible grouping logic

Supported now:

- Single-entry featured record: `Caged Sparrow` can be treated as the current authored manual record.
- Category grouping: technically supported, but currently only one category exists: `Flying-Sword-Art`.
- Known user grouping: supported through `users`, currently only `/characters/chen-pingan`.
- Related artifact/entry grouping: supported through `related`, with link safety required because one related path is missing.
- Verification grouping: supported, currently all public swordsmanship content is `to-be-verified`.
- Importance spotlight: supported, currently one `primary` entry.
- Tag grouping: possible as a light "recorded motifs" treatment using existing tags only.
- Inverse relationship preview: possible from artifacts that point to `/swordsmanship/caged-sparrow`, but should be labelled as recorded references rather than a complete network.

Weak or unsupported without content/schema work:

- Sword techniques as a broad taxonomy: not enough public entries and current category distribution has only one populated bucket.
- Sword cultivators: only one `users` relation exists on swordsmanship content. Character records may mention sword cultivation elsewhere, but the Swordsmanship page should not infer a complete practitioner index from prose.
- Sword intent / Sword Dao concepts: no dedicated frontmatter fields. Tags can hint at concepts, but they are not a formal concept system.
- Schools or lineages: `lineage` is supported but empty; `school` is absent.
- Famous swords: some artifacts are flying swords, but these live under `/artifacts`; pulling them into Swordsmanship should remain cross-reference support, not a new sword registry.
- Battle techniques, defensive methods, and offensive methods: no structured `techniqueType`, `offense/defense`, or combat-role fields exist.
- Associated factions: no `affiliatedFaction`, `school`, or populated `lineage` field exists on public swordsmanship content.
- Power ranking or hierarchy: `importance` is editorial prominence only. It should not be rendered as technique strength, grade, or martial rank.

## Link and data safety

Existing safety layer:

- `entryLinkResolver.ts` can resolve existing routed entries, display missing routed paths as pending values, and avoid dead `NuxtLink` output.
- `RouteDisplayLink.vue` renders non-link ghost/pending states for unresolved routes.
- `useRelatedEntries.ts` filters related detail-page groups through routed path and existing record checks.
- `resolvePublicImage` prevents uncurated image paths from rendering as broken images.

Missing or unresolved references found:

| Source | Field/location | Target | Status |
| --- | --- | --- | --- |
| `/swordsmanship/caged-sparrow` | `related[1]` | `/artifacts/dragon-slaying-stone` | Missing route. A related artifact exists as `/artifacts/dragon-slaying-cliff`, but this audit does not rename or edit content. |
| `/characters/ning-yao` | `related[3]` | `/swordsmanship/zhan-xian` | Missing route. Do not create it during Stage 29B unless separately authorized as content work. |
| `/swordsmanship/caged-sparrow` | `image` | `/images/swordsmanship/caged-sparrow.webp` | Not a routed content path; also not found in current curated image inventory. Treat as unavailable media. |

Resolved references:

- `/swordsmanship/caged-sparrow` -> `/characters/chen-pingan`
- `/swordsmanship/caged-sparrow` -> `/artifacts/moon-in-the-well`
- `/artifacts/moon-in-the-well` -> `/swordsmanship/caged-sparrow`
- `/artifacts/sword-nurturing-gourd` -> `/swordsmanship/caged-sparrow`

Stage 29B should reuse `createEntryResolver` and `RouteDisplayLink` for all user, related, and inverse-reference displays. Do not build raw links from authored frontmatter unless the target exists.

## Specialized page concepts considered

### 1. Sword Dao Manual

Direction: a focused manual/scroll experience for authored swordsmanship records. The page opens as a refined manual frontispiece, then presents the current primary record as a technique slip with seal, category, verification, user, and related-entry chips. A compact archive remains below.

Data fit:

- Strongest fit for one public entry.
- Can use `category`, `importance`, `verificationStatus`, `seal`, `description`, `tags`, `users`, `related`, and `lastUpdated`.
- Does not require schema changes.
- Does not imply a complete martial hierarchy.

Visual direction:

- Premium Shuimo identity: parchment, ink wash texture, red seal, thin rulework, restrained brush-line accents.
- Distinct from Timeline: no chronological rail or era mechanics.
- Distinct from Cultivation: no ladder or path comparison.
- Distinct from Characters: no relationship graph or character atlas.
- Distinct from World: no atlas/map clusters.
- Distinct from Factions: no institution registry, seat ledger, or membership board.

Risks:

- With only one entry, the page can feel sparse if overbuilt.
- The copy must call the data "current records" or "recorded arts", not a complete Sword Dao system.
- Mobile layout should avoid horizontal scroll wall patterns unless they collapse into a single-column reader.

### 2. Technique Scroll Wall

Direction: entries become vertical slips or scroll strips grouped by category/status, with a compact shelf below.

Data fit:

- Works structurally but currently renders only one slip.
- Can scale later as more entries arrive.
- No schema changes needed.

Risks:

- A wall with one item may look like an empty feature.
- If categories are shown too prominently, empty categories from meta may imply missing content rather than unavailable content.
- Needs careful empty states for Technique, Ability, and Sword-Style because no public records currently use those categories.

### 3. Practitioner-to-Technique Index

Direction: group swordsmanship records by `users`, showing Chen Ping'an as a practitioner node with linked technique records.

Data fit:

- Uses the single existing `users` field.
- Can safely resolve `/characters/chen-pingan`.

Risks:

- Too character-centric for the Swordsmanship landing page.
- With one practitioner and one technique, it may feel like a character-page excerpt.
- Could imply a complete practitioner catalogue that current data does not support.

### 4. Blade Registry

Direction: treat the page as a registry of flying swords, related artifacts, and sword arts.

Data fit:

- The current record is category `Flying-Sword-Art`, and artifact references point to related flying-sword content.

Risks:

- It blurs `/swordsmanship` with `/artifacts`.
- "Blade registry" may imply famous swords as objects, while current Swordsmanship schema records techniques/arts/abilities.
- Would need clearer content strategy before implementation.

## Recommendation for Stage 29B

Implement the Sword Dao Manual concept as a specialized, index-only experience.

Recommended page structure:

1. Manual frontispiece hero
   - Replace the generic `SectionHero` on `/swordsmanship`.
   - Show title, Chinese title from section meta, description, total record count, current populated category count, verification count, and a seal/brush motif.
   - Avoid video and avoid relying on the missing `caged-sparrow.webp`.

2. Featured manual slip
   - Highlight the primary/current authored record, currently `Caged Sparrow`.
   - Show title, Chinese, seal, category, importance, verification status, description, tags, known users, related entries, and last updated when present.
   - Use `RouteDisplayLink` for users and related paths so `/artifacts/dragon-slaying-stone` displays as pending instead of a dead link.
   - Use fallback seal or Chinese typography when an image is unavailable.

3. Recorded associations strip
   - Show safe, small association groups from existing data only:
     - Known users from `users`.
     - Related entries from `related`.
     - Referenced-by entries from inverse references if computed from all content.
   - Label this as recorded associations, not a complete dependency graph.

4. Compact archive
   - Keep an archive below the specialized area.
   - Prefer a dense list/table/slip layout over generic cards.
   - Filters should be generated from actual populated categories, not all section-meta categories, to avoid empty tabs.
   - Preserve `EmptyArchiveState` for future safety.

5. Related portals
   - Keep related links to Characters, Cultivation, and Artifacts, but visually quieter than the manual content.

Files likely to change in Stage 29B:

- `app/pages/swordsmanship/index.vue`
- New likely components:
  - `app/components/SwordManualHero.vue`
  - `app/components/SwordManualFeaturedSlip.vue`
  - `app/components/SwordAssociationStrip.vue`
  - `app/components/SwordCompactArchive.vue`

Shared utilities likely to reuse:

- `app/utils/entryLinkResolver.ts`
- `app/utils/relationshipConfig.ts`
- `app/utils/publicMedia.ts`
- `app/components/RouteDisplayLink.vue`
- `app/components/EmptyArchiveState.vue`
- `app/components/RelatedLinks.vue`
- `app/components/ScrollReveal.vue`
- `app/components/InkDivider.vue`

Schema changes needed:

- None for Stage 29B.

Current content enough?

- Enough for a restrained specialized manual landing page.
- Not enough for a full Sword Dao taxonomy, technique hierarchy, lineage map, famous-sword registry, or combat-method system.

## Frontend feasibility notes

Implementation can query all content, not just swordsmanship, so the page can safely resolve users, related entries, and inverse references.

Recommended data derivations:

- `swordRecords`: all records whose normalized path starts with `/swordsmanship/`.
- `recordByPath` and `existingPathSet`: all routed content records.
- `resolver`: `createEntryResolver(allRecords)`.
- `categoryFilters`: generated only from categories present in `swordRecords`.
- `featuredEntry`: primary entry first, then major, then title sort.
- `knownUserLinks`: `resolver.resolveMany(entry.users)`.
- `relatedLinks`: `resolver.resolveMany(entry.related)`.
- `referencedBy`: content records whose relationship fields include a swordsmanship path, filtered to existing records.

Mobile risks:

- A horizontal scroll wall could feel decorative but cramped with Chinese seals and long English titles.
- Compact archive rows need a single-column fallback with no fixed multi-column assumptions.
- Chips for related entries must wrap cleanly and preserve tap targets.
- Large seal typography should use stable dimensions so it does not push content unexpectedly.

Visual risks:

- Avoid copying Factions' ledger/registry visual language.
- Avoid copying Cultivation's ladder/comparison logic.
- Avoid copying Timeline's rail or cinematic chapter flow.
- Avoid making one entry look like a complete discipline map.
- Avoid one-note beige/paper styling by balancing paper, ink, seal red, muted bronze/celadon, and negative space.
- Avoid decorative cards inside cards; use slips, rulework, and unframed bands.

Data/lore risks:

- Do not treat `importance: primary` as strength or rank.
- Do not infer creator, origin, lineage, school, weapon, affiliated faction, offense/defense role, or technique type.
- Do not promote body prose into frontmatter-derived grouping unless the page clearly labels it as article text, not structured data.
- Do not create `/swordsmanship/zhan-xian` or `/artifacts/dragon-slaying-stone` during Stage 29B.
- Do not rename `/artifacts/dragon-slaying-stone` to `/artifacts/dragon-slaying-cliff` during Stage 29B without an editorial/content task.

## Stage 29B implementation plan

1. Replace `/swordsmanship` generic archive logic with an index-specific data model based on current fields only.
2. Add a `SwordManualHero` that gives the section its own Shuimo identity and honest record counts.
3. Add a `SwordManualFeaturedSlip` for the current primary record, with safe user and related-entry chips.
4. Add a small `SwordAssociationStrip` only if there are safe associations to display.
5. Add `SwordCompactArchive` as the durable archive below the specialized area, using actual populated categories.
6. Preserve SEO metadata from section meta.
7. Keep the detail route unchanged.
8. Run lightweight verification appropriate for implementation, likely `git status --short`, `git diff --name-only`, and a Nuxt build/type check if Stage 29B permits it.

