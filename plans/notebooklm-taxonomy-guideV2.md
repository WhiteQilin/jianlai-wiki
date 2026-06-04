# NotebookLM Taxonomy Guide

Source-of-truth documentation for future NotebookLM generation for the Jian Lai / Sword, Come! wiki.

This guide aligns NotebookLM prompts and outputs to the implemented Nuxt Content schema. The implemented schema wins over any NotebookLM proposal. If NotebookLM suggests a category, field, or relationship that is not implemented, treat that suggestion as Future / deferred and keep the generated entry inside the current schema.

Primary source-of-truth files:

- `app/data/sectionMeta.ts` (`SECTION_META`): valid public sections and valid categories per section.
- `content.config.ts`: Nuxt Content / Zod frontmatter schema. Fields are optional/additive.
- `server/utils/taxonomy.ts`: importer normalization, alias maps, canonical type-field mapping, review warnings.

## Public Sections

Use only these 11 public sections:

1. `characters`
2. `world`
3. `cultivation`
4. `swordsmanship`
5. `factions`
6. `artifacts`
7. `timeline`
8. `glossary`
9. `rankings`
10. `teachings`
11. `pantheon`

## STRICT SCHEMA RULES

### Valid Categories per Section

These category values must match `SECTION_META` exactly. If NotebookLM outputs an invalid category, the importer may map a known alias, preserve the original value into the section's canonical type field, and/or blank the category with a review-needed warning.

- `characters`: Character, Major, Minor, Gods
- `world`: World, Heaven, Continent, Grotto-Heaven, Blessed Land, City, Landmark, Sword-Qi-Great-Wall
- `cultivation`: Realm, Path, Method, Concept
- `swordsmanship`: Technique, Flying-Sword-Art, Ability, Sword-Style
- `factions`: Sect, Dynasty, Academy, Clan, Alliance, Lineage
- `artifacts`: Weapon, Flying-Sword, Sword-Nurturing-Gourd, Treasure, Material, Talisman
- `timeline`: Era, Event, Arc
- `glossary`: Term, Concept, Phrase
- `rankings`: Tier-List, Realm-Ladder, Named-List
- `teachings`: Teaching, School
- `pantheon`: God, Demon, Spirit, Mountain-Water-Deity

### Canonical Per-Section Type Fields

Use the canonical type field to store the more descriptive subtype when a section supports one:

| Section | Canonical type field |
| --- | --- |
| `world` | `locationType` |
| `factions` | `factionType` |
| `artifacts` | `artifactType` |
| `cultivation` | `pathType` |
| `swordsmanship` | `abilityType` |
| `teachings` | `teachingType` |
| `pantheon` | `beingType` |
| `glossary` | `termType` |
| `characters` | none; importer falls back to `subcategory` |
| `timeline` | none; importer falls back to `subcategory` |
| `rankings` | none; importer falls back to `subcategory` |

### Canonical Lineage Rule

Use this rule verbatim for Confucian / Daoist / other governing lineages:

```yaml
section: factions
category: Lineage
subcategory: Teaching
factionType: Confucian lineage
```

Do not mirror `factionType` as `Lineage`; `category` already conveys that. Use `factionType` as the more descriptive subtype: `Confucian lineage`, `Daoist lineage`, `Sword cultivator alliance`, etc.

Correction to older NotebookLM guidance: Inquiry2 once described `Lineage` as a subcategory. That is now outdated. `Lineage` is now a first-class category under `factions`.

### Numeric Field Rules

- `realmLevel` is numeric only. Use a single number, for example `realmLevel: 9`. Never use a range or string in `realmLevel`.
- `realmRange` is a string for grouped realms, for example `realmRange: "6–10"`.
- `eraOrder` is numeric only, for example `eraOrder: 3`.

### Relationship Path Rules

- Cross-links use route paths in the format `/section/slug`.
- Examples: `/world/five-colored-heaven`, `/characters/ning-yao`, `/factions/bai-yujing`.
- Relationship arrays should contain route paths, not bare names.
- Structured relationships may store display names plus optional relation labels and links.

Array relationship fields currently used by the schema / editor:

- `related`
- `affiliations`
- `members`
- `teachings`
- `relatedFactions`
- `owners`
- `users`
- `practitioners`
- `inhabitants`
- `holders`
- `participants`
- `relatedTerms`
- `denominations`
- `contains`
- `storedItems`

Structured relationship form:

```yaml
relationships:
  - name: Ning Yao
    relation: City Lord / leading sword cultivator
    link: /characters/ning-yao
```

`leader` can be a string or an array:

```yaml
leader: /characters/ning-yao
```

```yaml
leader:
  - /characters/ning-yao
  - /characters/qi-tingji
```

For world/faction nesting, use the implemented fields:

- `parentLocation`
- `governingFaction`
- `headquarters`
- `region`

NotebookLM sometimes suggests `parentFaction`. That field is not in the schema. Treat it as Future / deferred. Today, use `headquarters`, `leader`, `related`, or `relationships` instead.

## FLEXIBLE SUBCATEGORY GUIDANCE

`subcategory` is free text. It absorbs lore nuance without changing strict route/category behavior. Use it to clarify identity, institution type, cosmological scale, narrative role, or doctrine family.

Suggested patterns by section:

### `characters`

Strict categories available: Character, Major, Minor, Gods.

Recommended flexible `subcategory` values:

- Sword Cultivator
- Pure Martial Artist
- Scholar
- Active Deity
- Ghost/Spirit
- Demon (Yao)
- Young Prodigy
- Senior Cultivator
- Mortal Official
- Mountain/Water Official

### `world`

Strict categories available: World, Heaven, Continent, Grotto-Heaven, Blessed Land, City, Landmark, Sword-Qi-Great-Wall.

Recommended flexible `subcategory` values:

- Macro-World
- Pocket Dimension
- Capital
- Relocated City
- County
- Mountain
- River
- Battlefield
- Ruin
- Borderland

### `cultivation`

Strict categories available: Realm, Path, Method, Concept.

Recommended flexible `subcategory` values:

- Realm Grouping
- Qi Refining
- Martial Arts
- Sword Cultivation
- Dao Integration
- Body Tempering
- Breakthrough State
- Foundation Method

### `swordsmanship`

Strict categories available: Technique, Flying-Sword-Art, Ability, Sword-Style.

Recommended flexible `subcategory` values:

- Natal Flying Sword Ability
- Sword Domain
- Sword Formation
- Sword Intent
- Sword Technique
- Flying Sword Control
- Defensive Ability
- Offensive Ability

### `factions`

Strict categories available: Sect, Dynasty, Academy, Clan, Alliance, Lineage.

Recommended flexible `subcategory` values:

- Super-Faction
- Sword Sect
- Mortal Court
- Mountain Academy
- Confucian Institution
- Daoist Institution
- Buddhist Institution
- City-State
- Military Alliance
- Noble Clan
- Teaching

### `artifacts`

Strict categories available: Weapon, Flying-Sword, Sword-Nurturing-Gourd, Treasure, Material, Talisman.

Recommended flexible `subcategory` values:

- Natal Flying Sword
- Sword
- Gourd
- Currency Material
- Formation Tool
- Protective Treasure
- Ancient Relic
- Refined Material
- Daoist Talisman

### `timeline`

Strict categories available: Era, Event, Arc.

Recommended flexible `subcategory` values:

- Ancient Era
- Major War
- Journey Arc
- Sect Conflict
- Realm Breakthrough
- Founding Event
- Migration Event
- Political Turning Point

### `glossary`

Strict categories available: Term, Concept, Phrase.

Recommended flexible `subcategory` values:

- Currency
- Cultivation Slang
- Administrative Title
- Daoist Term
- Confucian Term
- Buddhist Term
- Place Epithet
- Idiom

### `rankings`

Strict categories available: Tier-List, Realm-Ladder, Named-List.

Recommended flexible `subcategory` values:

- Cultivation Ladder
- Martial Ranking
- Sword Ranking
- Faction Ranking
- Divine Office Ranking
- Canonical Named List

### `teachings`

Strict categories available: Teaching, School.

Recommended flexible `subcategory` values:

- The Three Teachings
- Hundred Schools
- Philosophical Doctrine
- Confucian Doctrine
- Daoist Doctrine
- Buddhist Doctrine
- Moral Principle
- Practice School

### `pantheon`

Strict categories available: God, Demon, Spirit, Mountain-Water-Deity.

Recommended flexible `subcategory` values:

- Divine Office
- Ancient High God
- Mountain Office
- Water Office
- Dormant God
- Old Heaven Entity
- Bureaucratic Deity Role

`Divine Office` is fine as flexible subcategory text. A full restructuring of the `pantheon` section is Future / deferred.

## Frontmatter Field Rules

The Zod schema is optional/additive. Use fields only when useful and known. Do not invent new schema fields to solve lore ambiguity.

Common frontmatter fields:

```yaml
title: Entry Title
chinese: 中文名
pinyin: Pin Yin
section: world
category: Heaven
subcategory: Macro-World
status: published
importance: primary
verificationStatus: verified
image: ""
banner: ""
video: ""
seal: 天
description: Short summary for cards and index pages.
tags:
  - qingming-heaven
related:
  - /world/haoran-heaven
relationships:
  - name: Bai Yujing
    relation: governing Daoist institution
    link: /factions/bai-yujing
```

Canonical type-field usage:

```yaml
# world
locationType: Heaven
parentLocation: /world/haoran-heaven
governingFaction: /factions/confucian-temple
region: Eastern Aquarius Continent
inhabitants:
  - /characters/chen-pingan
contains:
  - /world/lizhu-grotto-heaven

# factions
factionType: Confucian lineage
headquarters: /world/haoran-heaven
leader:
  - /characters/wen-sheng
members:
  - /characters/chen-pingan
teachings:
  - /teachings/confucianism

# artifacts
artifactType: Natal Flying Sword
owners:
  - /characters/chen-pingan
users:
  - /characters/chen-pingan
storedItems:
  - /artifacts/moon-in-the-well

# cultivation
pathType: Qi Refining
realmLevel: 9
realmRange: "6–10"
practitioners:
  - /characters/chen-pingan

# swordsmanship
abilityType: Sword Domain
users:
  - /characters/chen-pingan
related:
  - /artifacts/cage-sparrow

# teachings
teachingType: Confucian doctrine
relatedFactions:
  - /factions/confucian-temple

# pantheon
beingType: Divine office
holders:
  - /characters/wei-bo

# glossary
termType: Currency
denominations:
  - /glossary/snowflake-coin
  - /glossary/grain-rain-coin
```

## Realm Level vs Realm Range

Use `realmLevel` only for one exact numeric level. Use `realmRange` for grouped tiers.

Correct grouped-realm pattern, mirroring the real Middle Five Realms file:

```yaml
title: Middle Five Realms
section: cultivation
category: Realm
pathType: Qi Refining
realmRange: "6–10"
# realmLevel intentionally omitted because this is a grouped range.
```

Incorrect:

```yaml
realmLevel: "6–10"
```

Incorrect:

```yaml
realmLevel: 6-10
```

## PROMPT GUIDANCE ONLY

Use this section to guide NotebookLM classification. These rules do not add new schema fields and do not implement deferred restructuring.

### Teaching vs Faction

Strict rule: `teachings` are abstract doctrines; `factions` are physical, political, militarized, or institutional organizations.

Lore reasoning: Confucianism, Daoism, Buddhism, and Hundred Schools doctrines can govern the world, but the Confucian Temple and Bai Yujing are concrete institutions that exercise power. Bridge them with `teachings` on faction pages and `relatedFactions` on teaching pages.

### Lineage vs Sect vs Academy

Strict rule: `Lineage` is a first-class `factions` category; `Sect` and `Academy` are subordinate or more localized institution types.

Lore reasoning: A lineage in Jian Lai can function as a governing super-faction that dictates ideology and controls academies, dynasties, or branches. Use the canonical Lineage rule for Wen Sheng Lineage and similar entities.

### Heaven vs Continent vs Grotto-Heaven

Strict rule: `Heaven` is a macro-world / Tianxia; `Continent` is a major landmass within a Heaven; `Grotto-Heaven` and `Blessed Land` are pocket dimensions.

Lore reasoning: Haoran Heaven, Qingming Heaven, Manhuang Heaven, and Five-Colored Heaven are macro-worlds. Baoping / Eastern Aquarius Continent is a continent within a larger Heaven. Lizhu Grotto-Heaven is a localized pocket dimension. Nest with `parentLocation` when the parent is known.

### Artifact vs Ability

Strict rule: A natal flying sword belongs in `artifacts` with `category: Flying-Sword`; a standalone magical effect belongs in `swordsmanship` with `category: Ability`; link them via `related`.

Lore reasoning: Natal flying swords are physical or ethereal weapons, but they may produce distinct innate divine abilities. Do not force both meanings into one strict category if a separate ability page is warranted.

Splitting every sword into both an artifact page and an ability page is Deferred / future. Today, split only when the ability is major enough to need its own page; otherwise describe the ability on the artifact page and use `related` when needed.

### Active Deity vs Pantheon Office

Strict rule: active narrative deities belong in `characters` with `subcategory: Active Deity` or `category: Gods`; `pantheon` is for offices, ancient dormant gods, mythological entities, spirits, demons, and Mountain-Water-Deity records.

Lore reasoning: Wei Bo acts as a recurring character and office-holder, while a Mountain Lord office can be documented as a divine/bureaucratic pantheon concept. Keep active characters discoverable in the character index.

## Worked Examples

### 1. Wen Sheng Lineage

```yaml
---
title: Wen Sheng Lineage
section: factions
category: Lineage
subcategory: Teaching
factionType: Confucian lineage
teachings:
  - /teachings/confucianism
related:
  - /factions/confucian-temple
relationships:
  - name: Shanya Academy
    relation: subordinate academy / influenced institution
    link: /factions/shanya-academy
---
```

Rule note: this uses the canonical Lineage rule. Do not use `factionType: Lineage`; use `factionType` for the more descriptive subtype.

### 2. Qingming Heaven

Mirrors the real Qingming Heaven pattern.

```yaml
---
title: Qingming Heaven
chinese: 青冥天下
pinyin: Qing Ming Tian Xia
section: world
category: Heaven
locationType: Heaven
leader:
  - /characters/dao-ancestor
  - /characters/yu-dou
  - /characters/lu-chen
governingFaction: /factions/bai-yujing
related:
  - /world/haoran-heaven
  - /world/manhuang-heaven
  - /world/five-colored-heaven
  - /factions/bai-yujing
---
```

### 3. Middle Five Realms

Mirrors the real Middle Five Realms pattern.

```yaml
---
title: Middle Five Realms
chinese: 中五境
pinyin: Zhong Wu Jing
section: cultivation
category: Realm
pathType: Qi Refining
realmRange: "6–10"
related:
  - /cultivation/lower-five-realms
  - /cultivation/upper-five-realms
practitioners: []
---
```

Rule note: omit `realmLevel` because this is a range/grouping.

### 4. Wei Bo

```yaml
---
title: Wei Bo
section: characters
category: Character
subcategory: Active Deity
description: Active North Yue Mountain Lord and recurring narrative character.
affiliations:
  - /world/piyun-mountain
related:
  - /pantheon/north-yue-mountain-lord
relationships:
  - name: North Yue Mountain Lord
    relation: divine office held by Wei Bo
    link: /pantheon/north-yue-mountain-lord
---
```

Alternative strict category: `category: Gods` is valid under `characters` if the page is primarily organized by divine status. Prefer `category: Character` plus `subcategory: Active Deity` when the entry should behave like a normal active character dossier.

### 5. Cage Sparrow

```yaml
---
title: Cage Sparrow
section: artifacts
category: Flying-Sword
subcategory: Natal Flying Sword
artifactType: Natal Flying Sword
owners:
  - /characters/chen-pingan
users:
  - /characters/chen-pingan
related:
  - /swordsmanship/cage-sparrow-domain
---
```

Rule note: an optional linked `swordsmanship` / `Ability` page can describe the domain/effect if it becomes a standalone entry. Automatic splitting of every sword into artifact + ability pages is Deferred / future.

### 6. Bai Yujing

```yaml
---
title: Bai Yujing
section: factions
category: Sect
subcategory: Daoist Institution
factionType: Daoist institution
headquarters: /world/qingming-heaven
teachings:
  - /teachings/daoism
related:
  - /world/qingming-heaven
relationships:
  - name: Qingming Heaven
    relation: macro-world governed by Bai Yujing
    link: /world/qingming-heaven
---
```

Rule note: Bai Yujing is a `factions` entry because it is the supreme Daoist institution governing Qingming, not merely an abstract teaching.

### 7. Feisheng City

Mirrors the real Feisheng City pattern.

```yaml
---
title: Feisheng City
chinese: 飞升城
pinyin: Fei Sheng Cheng
section: factions
category: Alliance
factionType: Alliance
headquarters: /world/five-colored-heaven
leader:
  - /characters/ning-yao
related:
  - /world/five-colored-heaven
  - /world/sword-qi-great-wall
  - /characters/ning-yao
  - /characters/chen-pingan
---
```

Rule note: even though it is physically a city, the implemented content treats Feisheng City as a factional alliance/city-state in the Five-Colored Heaven.

## DEFERRED / FUTURE TAXONOMY IDEAS

Do not implement these in generated content today unless the schema changes first:

- Full `pantheon` restructuring into a separate divine-office registry model.
- Automatic artifact/ability splitting for every natal flying sword.
- `parentFaction` field. This is not in the schema. Use `headquarters`, `leader`, `related`, or `relationships` today.
- New relationship fields not present in `content.config.ts`.
- Renaming or merging the 11 public sections.
- Replacing strict categories with NotebookLM-proposed categories that are not in `SECTION_META`.

## NotebookLM Upload Note

To update NotebookLM:

1. Upload this file as the canonical taxonomy source: `plans/notebooklm-taxonomy-guide.md`.
2. Remove or disable the superseded `JianLai-Taxonomy-Guide.md` source if it is present in the NotebookLM notebook.
3. Keep one canonical guide in the notebook to avoid conflicts.
4. In future NotebookLM prompts, state that the implemented schema and this guide override older NotebookLM taxonomy proposals.
