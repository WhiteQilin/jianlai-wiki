# Character Template

> Copy the content below into `docs/characters/` to create a new character page.

---

```markdown
# [Character Name]

<CharacterInfobox
  name="[Name]"
  :titles="['Title 1', 'Title 2']"
  affiliation="[Faction]"
  realm="[Current Realm]"
  weapon="[Weapon/Artifact]"
/>

<NameBlock chinese="[中文名]" pinyin="[Pinyin]" english="[English Name]" />

## Overview

[Brief character introduction, 1-2 paragraphs. Mark unconfirmed info as "To be verified".]

## Cultivation

<RealmBadge realm="[Realm]" />

[Cultivation history and realm breakthroughs.]

## Relationships

<RelationshipList :items="[
  { name: '[Character A]', relation: '[Relationship]', link: '/characters/[slug]' },
  { name: '[Character B]', relation: '[Relationship]' }
]" />

## Story

[Major plot events, in chronological order.]

## Notes

- To be verified: [Unconfirmed information]
```
