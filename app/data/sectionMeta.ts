/**
 * Static section metadata mirror.
 *
 * Why static: Nuxt Content v3 parses `content/_meta/*.md` into the collection DB
 * but does NOT return `_`-prefixed partials from `queryCollection(...)` results
 * (verified at runtime — the query yielded null and only the 'All' tab rendered).
 *
 * Therefore `content/_meta/*.md` remains the human-editable editorial source of
 * truth (and the future CMS seed), while this file is the guaranteed
 * SSG-safe runtime mirror consumed by `useSectionMeta`.
 *
 * Values here are copied verbatim from the `_meta` frontmatter `categories`
 * arrays. Keep the two in sync when editing.
 */
export interface RawSectionMeta {
  title: string
  chinese?: string
  description?: string
  categories: string[]
}

export const SECTION_META: Record<string, RawSectionMeta> = {
  characters: {
    title: 'Characters',
    chinese: '人物志',
    description: 'The heroes, villains, and legends of the Jian Lai universe.',
    categories: ['Character', 'Major', 'Minor', 'Gods'],
  },
  world: {
    title: 'World',
    chinese: '天下图志',
    description: 'Explore the vast realms, continents, and secret realms of Jian Lai.',
    categories: ['Continent', 'Grotto-Heaven', 'Blessed Land', 'City', 'Landmark', 'Sword-Qi-Great-Wall'],
  },
  cultivation: {
    title: 'Cultivation',
    chinese: '山上修行',
    description: 'The paths to immortality, realms of power, and methods of practice.',
    categories: ['Realm', 'Path', 'Method', 'Concept'],
  },
  swordsmanship: {
    title: 'Swordsmanship',
    chinese: '剑术神通',
    description: 'The peerless techniques of sword immortals and martial artists.',
    categories: ['Technique', 'Flying-Sword-Art', 'Ability', 'Sword-Style'],
  },
  factions: {
    title: 'Factions',
    chinese: '宗门势力',
    description: 'The sects, dynasties, academies, and clans that shape the mortal and immortal worlds.',
    categories: ['Sect', 'Dynasty', 'Academy', 'Clan', 'Alliance'],
  },
  artifacts: {
    title: 'Artifacts',
    chinese: '法宝器物',
    description: 'Magical treasures, flying swords, and items of legend.',
    categories: ['Weapon', 'Flying-Sword', 'Sword-Nurturing-Gourd', 'Treasure', 'Material', 'Talisman'],
  },
  timeline: {
    title: 'Timeline',
    chinese: '年表',
    description: 'A chronological record of the eras, events, and arcs of Jian Lai.',
    categories: ['Era', 'Event', 'Arc'],
  },
  glossary: {
    title: 'Glossary',
    chinese: '术语典籍',
    description: 'Key terms, concepts, and phrases from the world of Jian Lai.',
    categories: ['Term', 'Concept', 'Phrase'],
  },
  rankings: {
    title: 'Rankings & Lists',
    chinese: '榜单',
    description: 'Tier lists, realm ladders, and the great named lists of the Jian Lai world.',
    categories: ['Tier-List', 'Realm-Ladder', 'Named-List'],
  },
  teachings: {
    title: 'Three Teachings & Hundred Schools',
    chinese: '三教百家',
    description: 'The Confucian, Buddhist, and Daoist teachings alongside the Hundred Schools of thought.',
    categories: ['Teaching', 'School'],
  },
  pantheon: {
    title: 'Pantheon',
    chinese: '神灵谱',
    description: 'The gods, demons, spirits, and mountain-water deities of the Jian Lai world.',
    categories: ['God', 'Demon', 'Spirit', 'Mountain-Water-Deity'],
  },
}
