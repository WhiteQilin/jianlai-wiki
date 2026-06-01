# Jian Lai Wiki — Entry Field Registry

**Status:** Canonical reference as of Stage 7C.
**Purpose:** Defines the canonical frontmatter fields/variables for every wiki entry type. This is the single source of truth for NotebookLM prompts, future content batches, and the future editor engine. It mirrors Fandom/MediaWiki template documentation.

**Scope:** This document describes fields only. It does not change code, content, UI, or routes.

**Authoritative sources this registry is derived from:**
- [`content.config.ts`](../jianlai-wiki-nuxt/content.config.ts) — the Zod schema (all fields optional/additive).
- [`sectionMeta.ts`](../jianlai-wiki-nuxt/app/data/sectionMeta.ts) — valid category values per section.
- [`relationshipConfig.ts`](../jianlai-wiki-nuxt/app/utils/relationshipConfig.ts) — wired relationship fields + labels.
- [`searchEntries.ts`](../jianlai-wiki-nuxt/app/utils/searchEntries.ts) — search-indexed fields + weights.
- [`EntryDetail.vue`](../jianlai-wiki-nuxt/app/components/EntryDetail.vue), [`EntryMetaPanel.vue`](../jianlai-wiki-nuxt/app/components/EntryMetaPanel.vue), [`RelatedEntries.vue`](../jianlai-wiki-nuxt/app/components/RelatedEntries.vue) — UI consumption.
- The 15 real seed entries under `content/`.

---

## 1. Global Fields (used by all entry types)

These fields apply to every section. Every field in the schema is optional and additive — nothing breaks if omitted — but the table below marks the practical authoring expectation.

| Field | Type | Expected | Notes |
|---|---|---|---|
| `title` | string | Required | English display name. Drives the detail title block, cards, search (weight 10), SEO `<title>`. |
| `chinese` | string | Required | Chinese name (e.g. 陈平安). Drives the title block, cards, search (weight 10). |
| `pinyin` | string | Recommended | Romanization (e.g. Chén Píng'ān). Rendered in the title block; search (weight 6). |
| `section` | enum-like string | Required | One of the valid section values (§2). Must match the file's folder. |
| `category` | enum-like string | Required | Must be one of the section's category values (§3) or the entry only appears under "All". |
| `subcategory` | string | Optional | Free-form finer grouping. Not used by filters yet. |
| `status` | enum-like string | Optional | In-universe state (Alive, Active, Destroyed, Deceased, …). Drives the status stamp. Distinct from `verificationStatus` (§10). |
| `importance` | enum-like string | Recommended | One of `primary` \| `major` \| `minor` \| `background`. Shown in the meta panel. |
| `image` | path string | Optional | Portrait/card image path (e.g. `/images/characters/<slug>.webp`). Placeholders allowed (§10). |
| `banner` | path string | Optional | Wide hero/banner image path. Renders a `MediaBanner` at the top of the detail page. |
| `seal` | string | Recommended | 1–3 Chinese characters used as a seal/stamp motif in the title block and card placeholders. |
| `description` | string | Required | One-sentence summary. Used on cards, the detail lead paragraph, SEO, search (weight 2). |
| `tags` | string[] | Recommended | Lowercase hyphenated keywords. Shown in meta panel; search (weight 4). |
| `related` | path string[] | Recommended | Cross-links to any routed entry. Wired relationship field (§5). |
| `verificationStatus` | enum-like string | Recommended | One of `verified` \| `to-be-verified` \| `disputed` \| `speculative`. Sourcing confidence (§10). |
| `sourceNotes` | string | Recommended | Free text / volume-chapter notes. Powers the Source Verification notice. |
| `firstAppearance` | string | Optional | Volume/chapter of first appearance. |
| `lastUpdated` | string | Optional | ISO date (e.g. `2026-05-31`). Editorial housekeeping. |

> **Note — `video`:** an additional optional `path string` field exists in the schema (used by some character entries for a PV). Not in the core global list but available everywhere.
>
> **Note — `titleZh`:** a future-compatible optional alias for `chinese`. **Do not use yet.** Keep using `chinese`.

---

## 2. Valid Section Values

`section` must be exactly one of:

| Section | Routed? | Folder |
|---|---|---|
| `characters` | Yes | `content/characters/` |
| `world` | Yes | `content/world/` |
| `cultivation` | Yes | `content/cultivation/` |
| `swordsmanship` | Yes | `content/swordsmanship/` |
| `factions` | Yes | `content/factions/` |
| `artifacts` | Yes | `content/artifacts/` |
| `timeline` | Yes | `content/timeline/` |
| `rankings` | Yes | `content/rankings/` |
| `teachings` | Yes | `content/teachings/` |
| `pantheon` | Yes | `content/pantheon/` |
| `glossary` | Yes | `content/glossary/` |
| `titles` | **Internal only** | `content/titles/` — not routed, never surfaced in related grids or nav. Use for offices/ranks referenced by other entries' prose, not as standalone public pages. |

---

## 3. Valid Category Values per Section

Verbatim from [`sectionMeta.ts`](../jianlai-wiki-nuxt/app/data/sectionMeta.ts). Category matching is **case-insensitive but otherwise exact** (see [`matchesCategory`](../jianlai-wiki-nuxt/app/utils/filterByCategory.ts)). A non-matching category means the entry only appears under the "All" tab.

| Section | Valid `category` values |
|---|---|
| characters | `Character`, `Major`, `Minor`, `Gods` |
| world | `Continent`, `Grotto-Heaven`, `Blessed Land`, `City`, `Landmark`, `Sword-Qi-Great-Wall` |
| cultivation | `Realm`, `Path`, `Method`, `Concept` |
| swordsmanship | `Technique`, `Flying-Sword-Art`, `Ability`, `Sword-Style` |
| factions | `Sect`, `Dynasty`, `Academy`, `Clan`, `Alliance` |
| artifacts | `Weapon`, `Flying-Sword`, `Sword-Nurturing-Gourd`, `Treasure`, `Material`, `Talisman` |
| timeline | `Era`, `Event`, `Arc` |
| rankings | `Tier-List`, `Realm-Ladder`, `Named-List` |
| teachings | `Teaching`, `School` |
| pantheon | `God`, `Demon`, `Spirit`, `Mountain-Water-Deity` |
| glossary | `Term`, `Concept`, `Phrase` |
| titles *(internal)* | `Title`, `Office`, `Rank`, `Bestowed-Name` |

> **Reminder:** if you add a new category value, it must be added to BOTH `sectionMeta.ts` (runtime mirror) AND `content/_meta/<section>.md` (editorial source) to appear as a filter tab.

---

## 4. Field Type Reference

Complete type vocabulary for every field in the schema. Types are: `string`, `number`, `boolean`, `string[]`, `path string`, `path string[]`, `path string | path string[]`, `object[]`, `enum-like string`.

### Shared / base
| Field | Type |
|---|---|
| `title` | string |
| `chinese` | string |
| `titleZh` | string *(future alias, unused)* |
| `pinyin` | string |
| `section` | enum-like string |
| `category` | enum-like string |
| `subcategory` | string |
| `status` | enum-like string |
| `importance` | enum-like string (`primary`/`major`/`minor`/`background`) |
| `image` | path string |
| `banner` | path string |
| `video` | path string |
| `seal` | string |
| `description` | string |
| `tags` | string[] |
| `related` | path string[] |
| `verificationStatus` | enum-like string (`verified`/`to-be-verified`/`disputed`/`speculative`) |
| `sourceNotes` | string |
| `firstAppearance` | string |
| `lastUpdated` | string |
| `relationships` | object[] (`{ name, relation?, link? }`) |

### Character
| Field | Type |
|---|---|
| `affiliations` | path string[] |
| `realm` | string |
| `titles` | string[] |
| `origin` | string |
| `abilities` | string[] |

### Faction / Sect
| Field | Type |
|---|---|
| `factionType` | string |
| `headquarters` | path string |
| `leader` | path string \| path string[] |
| `members` | path string[] |
| `teachings` | string[] |

### Artifact / Weapon
| Field | Type |
|---|---|
| `artifactType` | string |
| `tier` | string |
| `owners` | path string[] |

### World / Location
| Field | Type |
|---|---|
| `locationType` | string |
| `governingFaction` | string |
| `parentLocation` | string |
| `inhabitants` | path string[] |

### Cultivation
| Field | Type |
|---|---|
| `realmLevel` | number |
| `pathType` | string |
| `practitioners` | path string[] |

### Swordsmanship / Ability
| Field | Type |
|---|---|
| `abilityType` | string |
| `users` | path string[] |
| `lineage` | string |

### Ranking / List
| Field | Type |
|---|---|
| `listType` | string |
| `entries` | object[] (`{ rank?, name, link?, note? }`) |

### Teaching / School
| Field | Type |
|---|---|
| `teachingType` | string |
| `keyFigures` | string[] |
| `relatedFactions` | path string[] |

### Pantheon
| Field | Type |
|---|---|
| `beingType` | string |
| `domain` | string |
| `territory` | string |

### Title / Office *(internal)*
| Field | Type |
|---|---|
| `titleType` | string |
| `holders` | path string[] |
| `grantedBy` | string |

### Timeline Event
| Field | Type |
|---|---|
| `date` | string |
| `era` | string |
| `eraOrder` | number |
| `participants` | path string[] |
| `location` | path string |

### Glossary
| Field | Type |
|---|---|
| `termType` | string |
| `relatedTerms` | path string[] |

---

## 5. Wired Relationship Fields

These ten fields are resolved into the related-entry graph by [`relationshipConfig.ts`](../jianlai-wiki-nuxt/app/utils/relationshipConfig.ts) + [`useRelatedEntries`](../jianlai-wiki-nuxt/app/composables/useRelatedEntries.ts). Each renders an **outgoing** group on the page that declares it, and an **inverse** group on the target page. Unresolved/non-routed targets are silently dropped (never a broken link). Page-level dedupe ensures each target appears once (outgoing wins over inverse).

Shapes: `pathArray` (array of paths), `pathString` (single path), `pathStringOrArray` (either), `linkObjectArray` (array of `{ link }` objects).

| Field | Shape | Outgoing label | Inverse label | Best section usage |
|---|---|---|---|---|
| `affiliations` | pathArray | Affiliations | Notable Members | Characters → factions/world they belong to |
| `members` | pathArray | Members | Member Of | Factions → member characters |
| `leader` | pathStringOrArray | Leadership | Leadership Of | Factions/world → leader character(s); single or multiple |
| `headquarters` | pathString | Headquarters | Seat Of | Factions → world location |
| `location` | pathString | Location | Located Here | World/character/event → parent world location |
| `owners` | pathArray | Owners | Artifacts & Items | Artifacts → owner characters |
| `users` | pathArray | Known Users | Techniques & Arts | Swordsmanship/abilities → user characters |
| `practitioners` | pathArray | Practitioners | Cultivation Paths | Cultivation paths → practitioner characters |
| `related` | pathArray | Related Entries | Referenced By | Any → any routed entry (general cross-link) |
| `entries` | linkObjectArray | Listed Entries | Appears in Rankings | Rankings → listed characters/items |

### Examples

```yaml
# Character: affiliations (array of faction/world paths)
affiliations:
  - /factions/luopo-mountain
  - /world/sword-qi-great-wall

# Faction: members (array) + leader (single OR array)
members:
  - /characters/zhu-lian
  - /characters/jiang-shangzhen
leader: /characters/chen-pingan          # single form
leader:                                    # array form (dynasties, the Wall)
  - /characters/song-he
  - /characters/cui-chan

# Faction: headquarters (single path)
headquarters: /world/longquan-county

# World/character: location (single path)
location: /world/eastern-aquarius-continent

# Artifact: owners (array)
owners:
  - /characters/chen-pingan

# Swordsmanship: users (array)
users:
  - /characters/chen-pingan

# Cultivation: practitioners (array)
practitioners:
  - /characters/ning-yao
  - /characters/chen-qingdu

# Any entry: related (array of any routed paths)
related:
  - /characters/ning-yao
  - /world/lizhu-grotto-heaven

# Ranking: entries (array of link objects)
entries:
  - rank: 1
    name: Chen Ping'an
    link: /characters/chen-pingan
    note: Last Hidden Official
```

> **Path rule:** all relationship paths must be `/section/slug` where `section` is a routed section (§2). Paths to `/titles/*`, `/_meta/*`, `/_templates/*`, or non-existent pages are dropped from the graph automatically — no crash, just no card.

---

## 6. Per-Section Recommended Frontmatter Templates

Canonical starting frontmatter for each section. Global fields first, then section-specific fields. Replace `<slug>` and placeholder values. Derived from `content/_templates/` and the normalized real entries.

### Character
```yaml
---
title: Character Name
chinese: 角色中文名
pinyin: Pinyin Romanization
section: characters
category: Character        # Character | Major | Minor | Gods
subcategory: ""
status: Alive              # Alive | Deceased | Unknown
importance: primary        # primary | major | minor | background
verificationStatus: to-be-verified
image: /images/characters/<slug>.webp
banner: ""
seal: ""
description: One-sentence summary used on cards and meta tags.
origin: ""
realm: ""
affiliations: []           # path string[] -> factions/world
titles: []                 # string[] (office names)
abilities: []              # string[]
tags: []
related: []                # path string[]
sourceNotes: ""
firstAppearance: ""
lastUpdated: ""
---
```

### World / Location
```yaml
---
title: Location Name
chinese: 地点中文名
pinyin: Pinyin Romanization
section: world
category: Landmark         # Continent | Grotto-Heaven | Blessed Land | City | Landmark | Sword-Qi-Great-Wall
subcategory: ""
status: Unknown
importance: minor
verificationStatus: to-be-verified
image: /images/world/<slug>.webp
banner: ""
seal: ""
description: One-sentence summary of the location.
locationType: Landmark
location: ""               # path string -> parent world location
leader: ""                 # path string | path string[] (if presided over)
governingFaction: ""
parentLocation: ""
inhabitants: []            # path string[]
tags: []
related: []
sourceNotes: ""
firstAppearance: ""
lastUpdated: ""
---
```

### Cultivation
```yaml
---
title: Cultivation Path / Realm Name
chinese: 修行中文名
pinyin: Pinyin Romanization
section: cultivation
category: Path             # Realm | Path | Method | Concept
subcategory: ""
status: Active
importance: primary
verificationStatus: to-be-verified
image: ""
banner: ""
seal: ""
description: One-sentence summary of the path or realm.
pathType: ""
realmLevel: 0              # number
practitioners: []          # path string[]
tags: []
related: []
sourceNotes: ""
firstAppearance: ""
lastUpdated: ""
---
```

### Swordsmanship
```yaml
---
title: Technique Name
chinese: 剑术中文名
pinyin: Pinyin Romanization
section: swordsmanship
category: Flying-Sword-Art  # Technique | Flying-Sword-Art | Ability | Sword-Style
subcategory: ""
status: Active
importance: primary
verificationStatus: to-be-verified
image: /images/swordsmanship/<slug>.webp
banner: ""
seal: ""
description: One-sentence summary of the technique.
abilityType: ""
users: []                  # path string[] -> characters
lineage: ""
tags: []
related: []                # path string[]
sourceNotes: ""
firstAppearance: ""
lastUpdated: ""
---
```

### Faction
```yaml
---
title: Faction Name
chinese: 势力中文名
pinyin: Pinyin Romanization
section: factions
category: Sect             # Sect | Dynasty | Academy | Clan | Alliance
subcategory: ""
status: Active             # Active | Destroyed | Disbanded
importance: primary
verificationStatus: to-be-verified
image: /images/factions/<slug>.webp
banner: ""
seal: ""
description: One-sentence summary of the faction.
factionType: ""
headquarters: ""           # path string -> world
leader: ""                 # path string | path string[]
members: []                # path string[]
teachings: []              # string[]
tags: []
related: []
sourceNotes: ""
firstAppearance: ""
lastUpdated: ""
---
```

### Artifact
```yaml
---
title: Artifact Name
chinese: 法宝中文名
pinyin: Pinyin Romanization
section: artifacts
category: Treasure         # Weapon | Flying-Sword | Sword-Nurturing-Gourd | Treasure | Material | Talisman
subcategory: ""
status: Unknown
importance: major
verificationStatus: to-be-verified
image: /images/artifacts/<slug>.webp
banner: ""
seal: ""
description: One-sentence summary of the artifact.
artifactType: ""
tier: ""
owners: []                 # path string[] -> characters
origin: ""
tags: []
related: []
sourceNotes: ""
firstAppearance: ""
lastUpdated: ""
---
```

### Timeline
```yaml
---
title: Event Name
chinese: 事件中文名
pinyin: Pinyin Romanization
section: timeline
category: Event            # Era | Event | Arc
subcategory: ""
status: Unknown
importance: minor
verificationStatus: to-be-verified
image: ""
banner: ""
seal: ""
description: One-sentence summary of the event.
date: ""
era: ""
eraOrder: 0                # number (sort key)
participants: []           # path string[] -> characters
location: ""               # path string -> world
tags: []
related: []
sourceNotes: ""
firstAppearance: ""
lastUpdated: ""
---
```

### Ranking
```yaml
---
title: List Name
chinese: 榜单中文名
pinyin: Pinyin Romanization
section: rankings
category: Named-List       # Tier-List | Realm-Ladder | Named-List
subcategory: ""
status: Draft
importance: minor
verificationStatus: to-be-verified
image: ""
banner: ""
seal: ""
description: One-sentence summary of the list.
listType: ""
entries:                   # object[]
  - rank: 1
    name: Entry Name
    link: /characters/<slug>
    note: ""
tags: []
related: []
sourceNotes: ""
firstAppearance: ""
lastUpdated: ""
---
```

### Teaching
```yaml
---
title: Teaching / School Name
chinese: 学派中文名
pinyin: Pinyin Romanization
section: teachings
category: School           # Teaching | School
subcategory: ""
status: Active
importance: minor
verificationStatus: to-be-verified
image: ""
banner: ""
seal: ""
description: One-sentence summary of the teaching.
teachingType: ""
keyFigures: []             # string[]
relatedFactions: []        # path string[] -> factions
tags: []
related: []
sourceNotes: ""
firstAppearance: ""
lastUpdated: ""
---
```

### Pantheon
```yaml
---
title: Deity Name
chinese: 神灵中文名
pinyin: Pinyin Romanization
section: pantheon
category: God              # God | Demon | Spirit | Mountain-Water-Deity
subcategory: ""
status: Unknown
importance: minor
verificationStatus: to-be-verified
image: ""
banner: ""
seal: ""
description: One-sentence summary of the deity.
beingType: ""
domain: ""
territory: ""
tags: []
related: []
sourceNotes: ""
firstAppearance: ""
lastUpdated: ""
---
```

### Glossary
```yaml
---
title: Term Name
chinese: 术语中文名
pinyin: Pinyin Romanization
section: glossary
category: Term             # Term | Concept | Phrase
subcategory: ""
status: Unknown
importance: major
verificationStatus: to-be-verified
image: ""
banner: ""
seal: ""
description: One-sentence summary of the term.
termType: ""
relatedTerms: []           # path string[] -> glossary
tags: []
related: []
sourceNotes: ""
firstAppearance: ""
lastUpdated: ""
---
```

### Title / Office *(internal only — not a public route)*
```yaml
---
title: Office / Title Name
chinese: 头衔中文名
pinyin: Pinyin Romanization
section: titles
category: Office           # Title | Office | Rank | Bestowed-Name
subcategory: ""
status: Unknown
importance: background
verificationStatus: to-be-verified
seal: ""
description: One-sentence summary of the office/title.
titleType: ""
holders: []                # path string[] -> characters
grantedBy: ""
tags: []
related: []
sourceNotes: ""
lastUpdated: ""
---
```
> `/titles` is internal. These entries exist to anchor terminology but are not surfaced as public pages or in related grids. Do not link to `/titles/*` from relationship fields expecting a card to render.

---

## 7. Search-Indexed Fields

Static search ([`searchEntries.ts`](../jianlai-wiki-nuxt/app/utils/searchEntries.ts)) indexes exactly six fields, with weighted scoring (higher = stronger). Everything else is invisible to search.

| Field | Weight | Bonus |
|---|---|---|
| `title` | 10 | +exact / +prefix |
| `chinese` | 10 | +exact / +prefix |
| `pinyin` | 6 | +exact / +prefix |
| `category` | 5 | +exact / +prefix |
| `tags` | 4 (per matching tag) | +exact / +prefix |
| `description` | 2 | +exact / +prefix |

**Authoring implication:** to make an entry findable, populate `title`, `chinese`, `pinyin`, a correct `category`, meaningful `tags`, and a `description`. Body prose is **not** indexed.

---

## 8. UI-Used Fields (what renders where)

| UI surface | Fields consumed |
|---|---|
| **Cards** (`DossierCard` in related grids / section indexes) | `title`, `chinese`, `description`, `category`, `status`, `image` (falls back to a `seal`-style placeholder char when no image) |
| **Detail title block** (`NameBlock`) | `title`, `chinese`, `pinyin`, `seal` |
| **Detail banner** | `banner` (renders `MediaBanner` only if present) |
| **Detail lead** | `description` |
| **Meta panel** (`EntryMetaPanel`, non-character pages) | `image`, `category`, `status`, `importance`, `verificationStatus`, `tags` |
| **Character infobox** (character pages) | `image`, `category`, `status`, `origin`, `realm` (bespoke character layout) |
| **Status stamp** | `status` (rendered as a stamped badge) |
| **Search** | `title`, `chinese`, `pinyin`, `category`, `tags`, `description` (§7) |
| **Category filters** | `category` (must match §3 exactly) |
| **Related entries** | the ten wired relationship fields (§5), resolved to cards |
| **References / source notes** | `sourceNotes` (Source Verification notice); falls back to a default message when absent but `verificationStatus`/`status` present |

> The `## References` body section is authored Markdown prose, not a frontmatter field. `sourceNotes` is the structured companion that powers the verification notice.

---

## 9. Editor MVP — Recommended Input Types

Mapping each field to a future editor control. Grouped by widget for clarity.

| Field(s) | Editor input |
|---|---|
| `title`, `chinese`, `pinyin`, `seal`, `subcategory`, `origin`, `realm`, `factionType`, `artifactType`, `tier`, `pathType`, `abilityType`, `lineage`, `listType`, `teachingType`, `beingType`, `domain`, `territory`, `titleType`, `date`, `era`, `firstAppearance` | **text input** |
| `description`, `sourceNotes` | **textarea** (short, plain text) |
| `section`, `category`, `status`, `importance`, `verificationStatus` | **select dropdown** (section drives the available category options; importance & verificationStatus are fixed enums) |
| `tags`, `titles`, `abilities`, `teachings`, `keyFigures` | **multiselect** (free-tag chips) |
| `related`, `affiliations`, `members`, `owners`, `users`, `practitioners`, `inhabitants`, `participants`, `relatedFactions`, `relatedTerms`, `holders`, `leader` (multi) | **relationship picker** (entry search → path), multi-select |
| `headquarters`, `location`, `parentLocation`, `governingFaction`, `grantedBy`, `leader` (single) | **relationship picker**, single-select |
| `image`, `banner`, `video` | **image/media picker** |
| `realmLevel`, `eraOrder` | **number input** |
| `lastUpdated` | **date picker** |
| `entries` | **reference editor** (repeatable rows: rank/number, name, link picker, note) |
| `relationships` | **reference editor** (repeatable rows: name, relation, link picker) |
| Article body (`## Overview`, `## References`, etc.) | **markdown editor** (MDC-aware) |

> The `leader` field is dual-shaped: the editor should offer a single-or-multi relationship picker and serialize to a string when one value is chosen, an array when several are chosen.

---

## 10. Current Schema Decisions (locked)

These decisions are canonical as of Stage 7C and should be honored by all future content and tooling:

1. **Sword Qi Great Wall** canonical route is **`/world/sword-qi-great-wall`**. Do not use `/factions/great-wall-of-sword-qi` (retired).
2. **Moon in the Well** canonical route is **`/artifacts/moon-in-the-well`** (artifacts, not swordsmanship).
3. **`/titles` remains internal** — never routed, never surfaced in nav or related grids.
4. **Image/banner placeholders may remain.** A missing or placeholder `image` is acceptable; cards fall back to a seal-character placeholder.
5. **`status` and `verificationStatus` are separate fields.** Do not merge them.
   - **`status`** tracks **in-universe state** — e.g. `Alive`, `Deceased`, `Active`, `Destroyed`, `Destroyed / Merged`, `Disbanded`, `Unknown`. Drives the status stamp.
   - **`verificationStatus`** tracks **sourcing confidence** — `verified` \| `to-be-verified` \| `disputed` \| `speculative`. Drives the verification notice tone.
6. **`leader` accepts a single path string OR an array of path strings** (widened in Stage 7C for multi-leader dynasties and the Wall).
7. **Category values are case-insensitive but otherwise exact.** A typo or unlisted value silently strands the entry under "All" only.
8. **Relationship paths must point at routed sections.** Links to internal/non-existent targets are dropped from the graph without error.
9. **`titleZh` is reserved** as a future alias for `chinese` and must not be used yet.
10. **Search only sees** `title`, `chinese`, `pinyin`, `category`, `tags`, `description`. Body prose is not indexed.

---

## Appendix — Field Naming Conventions

- **Slugs:** lowercase, hyphenated, ASCII (e.g. `sword-qi-great-wall`). File name = slug = route segment.
- **Tags:** lowercase, hyphenated (e.g. `sword-cultivator`, `fourteen-realm`).
- **Category values:** Title-Case with hyphens for multiword (e.g. `Flying-Sword`, `Mountain-Water-Deity`).
- **Paths:** always absolute from root, `/section/slug`, no trailing slash.
- **Pinyin:** tone marks included (e.g. `Jiànqì Chángchéng`).
- **Bilingual prose:** include the Chinese term in parentheses on first mention in the body (e.g. "Iron Cavalry (大骊铁骑)").
