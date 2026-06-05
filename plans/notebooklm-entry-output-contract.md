# NotebookLM Entry Output Contract

Permanent output contract for NotebookLM-generated entries for the Jian Lai / Sword, Come! wiki. This contract turns the implemented Nuxt Content schema and current clean imported entries into a stable, repeatable entry format so future NotebookLM output does not rely on chat history.

## Mandatory sources of truth

Future generation prompts should say this exact sentence:

> Use `notebooklm-taxonomy-guideV2.md` and `notebooklm-entry-output-contract.md` as mandatory sources of truth.

Source hierarchy:

1. `content.config.ts` is the implemented Nuxt Content / Zod schema and wins over all generated suggestions.
2. `app/data/fieldRegistry.ts` is the editor field registry and wins for field grouping, valid public sections, valid category options, and required / recommended editor behavior.
3. `plans/notebooklm-taxonomy-guideV2.md` is the taxonomy and classification guide.
4. Existing clean entries provide formatting examples, especially `content/characters/mao-xiaodong.md`, `content/factions/wen-sheng-lineage.md`, `content/world/qingming-heaven.md`, `content/cultivation/middle-five-realms.md`, `content/teachings/confucianism.md`, and `content/artifacts/moon-in-the-well.md`.

Filename note: the current repository source is `plans/notebooklm-taxonomy-guideV2.md`. If NotebookLM still contains a legacy source named `notebooklm-taxonomy-guide.md`, replace or supersede it with `notebooklm-taxonomy-guideV2.md`.

## Universal output shape

Every generated entry must be a complete Markdown document with this shape:

1. YAML frontmatter.
2. One blank line.
3. Body sections beginning with `## Overview` or another second-level heading.
4. No top-level `# Title` after frontmatter.
5. A final `## References` section as the last section in the file.

Do not create or modify lore/content entries from this contract. Use it only as an output specification for future generation.

## Universal required frontmatter skeleton

Every future NotebookLM-generated entry must include all fields below. Replace descriptive sample values with real values, or use the required empty default where specified.

```yaml
---
title: Entry Title
chinese: 中文名
pinyin: Pin Yin
section: characters
category: Character
subcategory: Scholar
status: published
importance: major
verificationStatus: to-be-verified
image: ""
banner: ""
video: ""
seal: 字
description: One sentence summary used by cards, detail pages, search, and SEO.
tags:
  - lowercase-hyphen-tag
related: []
affiliations: []
relationships:
  - name: Display Name
    relation: concise relationship label
    link: /section/slug
sourceNotes: |
  Concise source-confidence summary with volume and chapter notes. Use "Chapter reference needed" if the exact chapter is uncertain.
firstAppearance: ""
lastUpdated: 2026-06-04
---
```

Universal field rules:

- Use `chinese`, not `name`, for the Chinese title / name.
- Do not use `titleZh` in NotebookLM output. It exists only as a future-compatible schema alias and is not the active field.
- `description` is required and must be a real, useful sentence.
- `sourceNotes` is required and must summarize source confidence or explain what needs verification.
- `status` must be `published` for generated wiki entries.
- `verificationStatus` must be `to-be-verified` unless the entry is fully chapter-verified.
- Use `verificationStatus: verified` only when the body contains a real `## References` section with specific volume / chapter evidence.
- `image`, `banner`, and `video` default to empty strings: `""`.
- `seal` should be one to three meaningful Chinese characters when possible; otherwise use `""`.
- `tags` must be lowercase, hyphenated keywords.
- `related` defaults to `[]` if no routed related pages are known.
- `affiliations` defaults to `[]` for non-character entries or when no routed affiliation pages are known.
- `relationships` defaults to `[]` when no structured relationships are useful.
- `firstAppearance` defaults to `""` if unknown.
- `lastUpdated` must be an ISO-style date: `YYYY-MM-DD`.
- Do not output `NaN` anywhere. Omit unknown numeric optional fields or leave them out entirely.
- Do not invent unsupported schema fields.
- Do not create `/titles/*` relationship paths. If an honorific or office is only a title, use the character `titles` array as plain strings or discuss it in the body.

## Valid sections, categories, and importance values

Use only these public sections:

- `characters`
- `world`
- `cultivation`
- `swordsmanship`
- `factions`
- `artifacts`
- `timeline`
- `glossary`
- `rankings`
- `teachings`
- `pantheon`

Valid categories by section:

| Section | Valid category values |
| --- | --- |
| `characters` | `Character`, `Major`, `Minor`, `Gods` |
| `world` | `World`, `Heaven`, `Continent`, `Grotto-Heaven`, `Blessed Land`, `City`, `Landmark`, `Sword-Qi-Great-Wall` |
| `cultivation` | `Realm`, `Path`, `Method`, `Concept` |
| `swordsmanship` | `Technique`, `Flying-Sword-Art`, `Ability`, `Sword-Style` |
| `factions` | `Sect`, `Dynasty`, `Academy`, `Clan`, `Alliance`, `Lineage` |
| `artifacts` | `Weapon`, `Flying-Sword`, `Sword-Nurturing-Gourd`, `Treasure`, `Material`, `Talisman` |
| `timeline` | `Era`, `Event`, `Arc` |
| `glossary` | `Term`, `Concept`, `Phrase` |
| `rankings` | `Tier-List`, `Realm-Ladder`, `Named-List` |
| `teachings` | `Teaching`, `School` |
| `pantheon` | `God`, `Demon`, `Spirit`, `Mountain-Water-Deity` |

Valid `importance` values:

- `primary`
- `major`
- `minor`
- `background`

Valid `verificationStatus` values:

- `verified`
- `to-be-verified`
- `disputed`
- `speculative`

## Relationship formatting contract

### Route-path arrays

`related` and `affiliations` must be arrays of routed paths only.

Correct:

```yaml
related:
  - /characters/chen-pingan
  - /factions/wen-sheng-lineage
affiliations:
  - /factions/shanya-academy
  - /factions/confucian-temple
```

Incorrect:

```yaml
related:
  - Chen Ping'an
affiliations:
  - Shanya Academy
```

Rules:

- Route paths use `/section/slug`.
- Do not use bare display names in route-path arrays.
- Do not use `/titles/*` paths.
- If a related target probably does not exist yet, do not invent a route path. Use a structured `relationships` object with `link: ""`, or mention the entity in the body.

### Structured relationships

`relationships` must be an array of objects only. Each object uses:

- `name`
- `relation`
- `link`

Correct:

```yaml
relationships:
  - name: Chen Ping'an
    relation: junior brother / protected student
    link: /characters/chen-pingan
  - name: Ruan Xiu
    relation: daughter
    link: ""
```

Incorrect:

```yaml
relationships:
  - Chen Ping'an
  - Ruan Xiu (daughter)
```

Rules:

- `name` is the human-readable display name.
- `relation` is concise and lower-friction, for example `teacher`, `disciple`, `governing institution`, `dao companion`, `owner`, or `member`.
- `link` is a routed path only when the target page probably exists.
- Use `link: ""` when the target page probably does not exist.
- Never use bare strings such as `Ruan Xiu (daughter)`.

### Other relationship-like fields

Use route paths when a field represents routed wiki pages and the target probably exists:

- `leader`
- `members`
- `teachings`
- `relatedFactions`
- `owners`
- `users`
- `practitioners`
- `inhabitants`
- `holders`
- `participants`
- `headquarters`
- `governingFaction`
- `parentLocation`
- `location`

If the target probably does not exist, prefer `""`, `[]`, or a structured `relationships` item with `link: ""` instead of inventing a route.

## Section-specific optional field profiles

Universal fields are always present. Add the section-specific fields below only when useful and known. Do not invent fields outside the implemented schema.

### characters

Recommended optional fields:

```yaml
origin: Lizhu Grotto-Heaven / 骊珠洞天
realm: 14th Realm Pure Sword Cultivator / 十四境纯粹剑修
titles:
  - Hidden Official
abilities:
  - sword domain
affiliations:
  - /factions/feisheng-city
location: /world/five-colored-heaven
```

Notes:

- `titles` is an array of plain title strings, not `/titles/*` links.
- `affiliations` must be route paths only.
- Put nuanced interpersonal links in `relationships` objects.

### world

Recommended optional fields:

```yaml
locationType: Heaven
governingFaction: /factions/bai-yujing
parentLocation: ""
inhabitants:
  - /characters/dao-ancestor
leader:
  - /characters/dao-ancestor
```

Notes:

- Use `locationType` for the specific place type, such as `Heaven`, `Continent`, `Grotto-Heaven`, `City`, `Landmark`, or `Battlefield`.
- `leader` is schema-supported and used by clean macro-world entries when a heaven has governing figures, but use it sparingly.
- Use `parentLocation` for nesting, not unsupported fields like `parentFaction`.

### factions

Recommended optional fields:

```yaml
factionType: Confucian lineage
headquarters: /world/haoran-heaven
region: Eastern Aquarius Continent
leader:
  - /characters/old-scholar
members:
  - /characters/chen-pingan
teachings:
  - /teachings/confucianism
```

Notes:

- For Confucian / Daoist / ideological lineages, use the canonical lineage pattern:

```yaml
section: factions
category: Lineage
subcategory: Teaching
factionType: Confucian lineage
```

- Do not duplicate `Lineage` into `factionType`; `category` already says `Lineage`.

### cultivation

Recommended optional fields:

```yaml
pathType: Qi Refining
realmLevel: 9
realmRange: "6–10"
practitioners:
  - /characters/chen-pingan
```

Notes:

- `realmLevel` is numeric only and only for one exact realm.
- `realmRange` is a string for grouped realms, such as `"1–5"`, `"6–10"`, or `"11–15"`.
- For realm-group pages such as Middle Five Realms, omit `realmLevel` and use `realmRange`.
- Never output `realmLevel: "6–10"`, `realmLevel: 6-10`, or `realmLevel: NaN`.

### swordsmanship

Recommended optional fields:

```yaml
abilityType: Sword Domain
lineage: Sword Qi Great Wall
users:
  - /characters/chen-pingan
```

Notes:

- Use `swordsmanship` for techniques, abilities, sword domains, flying-sword arts, and sword styles.
- A natal flying sword as an object belongs in `artifacts`; its standalone ability can be linked as a `swordsmanship` entry if needed.

### artifacts

Recommended optional fields:

```yaml
artifactType: Natal Flying Sword
tier: ""
origin: ""
owners:
  - /characters/chen-pingan
contains: []
storedItems: []
```

Notes:

- Use `owners` for known owners or masters.
- Use `contains` and `storedItems` for vessel / storage artifacts such as sword-nurturing gourds.
- Keep `contains` and `storedItems` empty unless the item or contents are known.
- If a sword has a separate ability page, link it through `related`.

### teachings

Recommended optional fields:

```yaml
teachingType: Philosophical Doctrine
keyFigures:
  - Most Holy Teacher
relatedFactions:
  - /factions/confucian-temple
```

Notes:

- `teachings` entries are abstract doctrines, schools, and philosophical principles.
- Concrete institutions belong in `factions`, then link back with `relatedFactions`.
- `keyFigures` may use display names because the editor treats it as tags; use `relationships` or `related` for routed character links.

### pantheon

Recommended optional fields:

```yaml
beingType: Divine office
domain: Mountain and water authority
territory: Northern Yue
holders:
  - /characters/wei-bo
```

Notes:

- Active recurring deities can be `characters` with `subcategory: Active Deity` or `category: Gods`.
- `pantheon` is for gods, demons, spirits, mountain-water deity records, ancient entities, and divine offices.
- Use `holders` only for office-like records where known; do not link to `/titles/*`.

### glossary

Recommended optional fields:

```yaml
termType: Currency
relatedTerms:
  - immortal-money
denominations:
  - snowflake-coin
  - grain-rain-coin
```

Notes:

- `glossary` covers terms, concepts, phrases, currencies, idioms, and lore vocabulary.
- `relatedTerms` and `denominations` are plain string arrays unless a routed glossary path is already established by the current entry pattern.
- Do not force every term into a relationship path.

### rankings

Recommended optional fields:

```yaml
listType: Realm-Ladder
entries:
  - rank: 1
    name: Lower Five Realms
    link: /cultivation/lower-five-realms
    note: Foundation tier
relationships: []
```

Notes:

- `entries` is an ordered array of ranking objects.
- `rank` can be a number or a string.
- `name` is required inside each ranking entry.
- Use `link: ""` if the ranked target probably does not exist.

### timeline

Recommended optional fields:

```yaml
date: ""
era: Ancient Era
eraOrder: 1
participants:
  - /characters/chen-pingan
location: /world/lizhu-grotto-heaven
```

Notes:

- `eraOrder` is numeric only.
- Never output `eraOrder: NaN`.
- Use `participants` and `location` route paths only when targets probably exist.

## Example frontmatter blocks

These examples demonstrate the contract shape. Generated entries should include full body content after frontmatter and must end with `## References`.

### Character example

```yaml
---
title: Mao Xiaodong
chinese: 茅小冬
pinyin: Mao Xiaodong
section: characters
category: Character
subcategory: Scholar
status: published
importance: major
verificationStatus: verified
image: ""
banner: ""
video: ""
seal: 茅
description: A steadfast Confucian scholar and former Vice Mountain Chief of Shanya Academy, later serving in the Liji Academy under the Ritual Sage lineage.
tags:
  - confucian-scholar
  - shanya-academy
  - liji-academy
related:
  - /factions/shanya-academy
  - /factions/wen-sheng-lineage
  - /teachings/confucianism
affiliations:
  - /factions/shanya-academy
  - /factions/wen-sheng-lineage
  - /factions/confucian-temple
relationships:
  - name: Old Scholar
    relation: former lineage patriarch
    link: /characters/old-scholar
  - name: Qi Jingchun
    relation: junior martial brother / academy colleague
    link: /characters/qi-jingchun
  - name: Chen Ping'an
    relation: protected junior brother
    link: /characters/chen-pingan
sourceNotes: |
  Protection of Chen Ping'an while refining the golden text gallbladder is verified in Volume 11, Chapter 8. Zuo You's commentary on Mao Xiaodong's dedication to teaching is verified in Volume 24, Chapter 7. His later Liji Academy role is verified in Volume 34, Chapter 8 and Volume 36, Chapter 7.
firstAppearance: ""
lastUpdated: 2026-06-04
origin: ""
realm: ""
titles:
  - Vice Mountain Chief
  - Siye
abilities: []
location: ""
---
```

### Faction / Lineage example

```yaml
---
title: Wen Sheng Lineage
chinese: 文圣一脉
pinyin: Wen Sheng Yi Mai
section: factions
category: Lineage
subcategory: Teaching
status: published
importance: primary
verificationStatus: verified
image: ""
banner: ""
video: ""
seal: 文
description: A profoundly influential and historically controversial Confucian lineage founded by the Old Scholar, known for pragmatic merit-and-action scholarship.
tags:
  - confucian-temple
  - wen-sheng-lineage
  - haoran-heaven
related:
  - /characters/old-scholar
  - /characters/chen-pingan
  - /characters/mao-xiaodong
  - /factions/confucian-temple
  - /teachings/confucianism
affiliations: []
relationships:
  - name: Confucian Temple
    relation: parent orthodoxy
    link: /factions/confucian-temple
  - name: Shanya Academy
    relation: influenced academy
    link: /factions/shanya-academy
sourceNotes: |
  The lineage philosophy and Three-Four Dispute are verified across Volume 3, Chapter 10; Volume 25, Chapter 8; Volume 27, Chapter 3; and Volume 29, Chapters 6-7.
firstAppearance: ""
lastUpdated: 2026-06-04
factionType: Confucian lineage
headquarters: /world/haoran-heaven
region: Haoran Heaven
leader:
  - /characters/old-scholar
members:
  - /characters/cui-chan
  - /characters/zuo-you
  - /characters/qi-jingchun
  - /characters/liu-shiliu
  - /characters/chen-pingan
  - /characters/mao-xiaodong
teachings:
  - /teachings/confucianism
---
```

### World / Heaven example

```yaml
---
title: Qingming Heaven
chinese: 青冥天下
pinyin: Qing Ming Tian Xia
section: world
category: Heaven
subcategory: Heaven
status: published
importance: primary
verificationStatus: verified
image: ""
banner: ""
video: ""
seal: 冥
description: One of the primary worlds, governed by the Daoist faction from Bai Yujing and known for its fourteen states and defense against Extraterrestrial Demons.
tags:
  - qingming-heaven
  - bai-yujing
  - daoism
  - fourteen-states
related:
  - /world/haoran-heaven
  - /world/manhuang-heaven
  - /world/five-colored-heaven
  - /factions/bai-yujing
affiliations: []
relationships:
  - name: Bai Yujing
    relation: governing Daoist institution
    link: /factions/bai-yujing
sourceNotes: |
  Bai Yujing's governance and the fourteen states are verified in Volume 34, Chapter 6 and Volume 43, Chapter 8. Defense against Extraterrestrial Demons is verified in Volume 26, Chapter 5 and Volume 34, Chapter 6.
firstAppearance: ""
lastUpdated: 2026-06-04
locationType: Heaven
governingFaction: /factions/bai-yujing
parentLocation: ""
inhabitants: []
leader:
  - /characters/dao-ancestor
  - /characters/yu-dou
  - /characters/lu-chen
---
```

### Cultivation realm group example

```yaml
---
title: Middle Five Realms
chinese: 中五境
pinyin: Zhong Wu Jing
section: cultivation
category: Realm
subcategory: Realm Grouping
status: published
importance: primary
verificationStatus: verified
image: ""
banner: ""
video: ""
seal: 境
description: The intermediate tier of Qi Refining cultivation, spanning the 6th to 10th realms and marking the rise into Earth Immortal status.
tags:
  - realm
  - qi-refiner
  - middle-five-realms
  - earth-immortal
related:
  - /cultivation/lower-five-realms
  - /cultivation/upper-five-realms
affiliations: []
relationships: []
sourceNotes: |
  The Dongfu, Guanhai, Longmen, Jindan, and Yuanying realms and their traits are verified in Volume 4, Chapter 4 and Volume 5, Chapter 5. Their impact on the mortal world is verified in Volume 17, Chapter 8.
firstAppearance: ""
lastUpdated: 2026-06-04
pathType: Qi Refining
realmRange: "6–10"
practitioners: []
---
```

### Teaching example

```yaml
---
title: Confucianism
chinese: 儒家
pinyin: Rújiā
section: teachings
category: Teaching
subcategory: The Three Teachings
status: published
importance: primary
verificationStatus: verified
image: ""
banner: ""
video: ""
seal: 儒
description: One of the Three Teachings and the supreme ruling doctrine of Haoran Heaven, emphasizing moral education, human relationships, and practical governance.
tags:
  - three-teachings
  - haoran-heaven
  - confucian-temple
related:
  - /characters/most-holy-teacher
  - /characters/ritual-sage
  - /characters/sub-sage
  - /characters/old-scholar
affiliations: []
relationships:
  - name: Confucian Temple
    relation: governing institution of the doctrine
    link: /factions/confucian-temple
sourceNotes: |
  Confucianism's principles and institutional role are verified across Volume 9, Chapter 2; Volume 11, Chapter 6; Volume 17, Chapter 1; Volume 25, Chapter 3; Volume 27, Chapter 3; Volume 32, Chapter 4; and Volume 46, Chapter 6.
firstAppearance: ""
lastUpdated: 2026-06-04
teachingType: Philosophical Doctrine
keyFigures:
  - Most Holy Teacher
  - Ritual Sage
  - Sub-Sage
  - Old Scholar
relatedFactions:
  - /factions/confucian-temple
  - /factions/sub-sage-lineage
  - /factions/wen-sheng-lineage
---
```

### Artifact example

```yaml
---
title: Moon in the Well
chinese: 井中月 / 井底月
pinyin: Jǐng Zhōng Yuè
section: artifacts
category: Flying-Sword
subcategory: Natal Flying Sword
status: published
importance: major
verificationStatus: verified
image: ""
banner: ""
video: ""
seal: 月
description: Chen Ping'an's natal flying sword, able to divide into vast numbers of blades and help construct the physical framework of his localized domains.
tags:
  - flying-sword
  - natal-flying-sword
  - chen-pingan
related:
  - /characters/chen-pingan
  - /swordsmanship/caged-sparrow
  - /glossary/golden-essence-copper-coin
affiliations: []
relationships:
  - name: Chen Ping'an
    relation: owner and wielder
    link: /characters/chen-pingan
sourceNotes: |
  The original name, shatter-and-restore mechanic, sword multiplication, upgrade path, and domain manifestation are verified in Volume 22, Chapter 7; Volume 36, Chapter 2; Volume 42, Chapter 4; and Volume 47, Chapter 9.
firstAppearance: ""
lastUpdated: 2026-06-04
artifactType: Natal Flying Sword
tier: ""
origin: ""
owners:
  - /characters/chen-pingan
contains: []
storedItems: []
---
```

## Body formatting rules

After frontmatter:

- Do not repeat the title as `# Title`.
- Start with `## Overview` unless another second-level heading is clearly more appropriate.
- Use second-level headings for major sections, such as `## History`, `## Abilities`, `## Relationships`, `## Geography`, `## Core Philosophy`, or `## Known Owners`.
- Use internal Markdown links only when the route probably exists.
- Do not invent route links for uncertain pages.
- Keep the final section as `## References`.
- Do not place any content after the final references section.

## Reference formatting rules

Every final entry must end with `## References`.

Never output literal placeholders such as `剑来X`.

Use this hierarchy:

1. If the real volume number and title are known, use them.
2. If the real volume number is known but the volume title is unknown, use `Volume title needed`.
3. If the exact chapter is uncertain, use `Chapter reference needed`.
4. If the volume number is uncertain, keep `verificationStatus: to-be-verified` and say what source detail is still needed in `sourceNotes` and `## References`.

Preferred fully pinned format:

```markdown
## References

- **剑来11：君从故乡来, 第八章 — 炼制:** Supports Mao Xiaodong acting as protector while Chen Ping'an refines the golden text gallbladder.
```

If the volume number is known but title or exact chapter is incomplete:

```markdown
## References

- **剑来11：Volume title needed, Chapter reference needed:** Supports the general source claim, but the exact title and chapter still need confirmation.
```

If only broad sourcing is known:

```markdown
## References

- Source reference needed: This claim is broadly established in the series but still needs exact volume and chapter confirmation.
```

Broad-source entries must keep:

```yaml
verificationStatus: to-be-verified
```

## Final NotebookLM output checklist

Before accepting generated output, confirm all items below:

- Frontmatter contains every universal required field from this contract.
- `chinese` is used and `name` is not used.
- `description` is present and useful.
- `sourceNotes` is present and useful.
- `status` is `published`.
- `verificationStatus` is `to-be-verified` unless the entry is fully chapter-verified.
- `image`, `banner`, and `video` are empty strings unless a curated media path is intentionally known.
- No top-level `# Title` appears after frontmatter.
- No `NaN` appears anywhere.
- No unsupported schema fields appear.
- No `/titles/*` relationship paths appear.
- `related` and `affiliations` contain only route paths.
- `relationships` contains only structured objects with `name`, `relation`, and `link`.
- Uncreated relationship targets use `link: ""` instead of invented routes.
- References do not contain placeholders like `剑来X`.
- The final section is `## References`, with no content after it.
