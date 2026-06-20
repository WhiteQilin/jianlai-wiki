import type { PublicSection } from './fieldRegistry'

export type InfoboxFieldKind =
  | 'text'
  | 'chip'
  | 'badge'
  | 'route-link'
  | 'relationship-row'
  | 'list'
  | 'ranking-list'

export interface InfoboxFieldProfile {
  key: string
  label: string
  kind: InfoboxFieldKind
  subtle?: boolean
  maxItems?: number
  /** Values that should be treated as intentionally empty for public display. */
  hideValues?: string[]
}

export interface EntryInfoboxProfile {
  section: PublicSection
  title: string
  imageMode: 'portrait' | 'landscape' | 'seal'
  fields: InfoboxFieldProfile[]
  footerFields?: InfoboxFieldProfile[]
}

const SOURCE_FOOTER: InfoboxFieldProfile[] = [
  { key: 'verificationStatus', label: 'Verification', kind: 'badge', subtle: true },
  { key: 'firstAppearance', label: 'First Appearance', kind: 'text', subtle: true },
  { key: 'lastUpdated', label: 'Last Updated', kind: 'text', subtle: true },
]

export const ENTRY_INFOBOX_PROFILES: Record<PublicSection, EntryInfoboxProfile> = {
  characters: {
    section: 'characters',
    title: 'Character Dossier',
    imageMode: 'portrait',
    fields: [
      { key: 'chinese', label: 'Chinese', kind: 'text' },
      { key: 'pinyin', label: 'Pinyin', kind: 'text' },
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'subcategory', label: 'Role', kind: 'chip' },
      { key: 'status', label: 'Status', kind: 'badge' },
      { key: 'origin', label: 'Origin', kind: 'route-link' },
      { key: 'location', label: 'Location', kind: 'route-link' },
      { key: 'realm', label: 'Realm', kind: 'text' },
      { key: 'titles', label: 'Titles', kind: 'list' },
      { key: 'abilities', label: 'Abilities', kind: 'list' },
      { key: 'affiliations', label: 'Affiliations', kind: 'list', maxItems: 8 },
      { key: 'relationships', label: 'Key Relationships', kind: 'relationship-row', maxItems: 6 },
    ],
    footerFields: SOURCE_FOOTER,
  },
  factions: {
    section: 'factions',
    title: 'Faction Dossier',
    imageMode: 'landscape',
    fields: [
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'subcategory', label: 'Classification', kind: 'chip' },
      { key: 'factionType', label: 'Faction Type', kind: 'text' },
      { key: 'headquarters', label: 'Headquarters', kind: 'route-link' },
      { key: 'region', label: 'Region', kind: 'route-link' },
      { key: 'leader', label: 'Leadership', kind: 'list', maxItems: 6 },
      { key: 'members', label: 'Members', kind: 'list', maxItems: 10 },
      { key: 'teachings', label: 'Teachings', kind: 'list', maxItems: 6 },
      { key: 'relatedFactions', label: 'Related Factions', kind: 'list', maxItems: 6 },
      { key: 'related', label: 'Related Entries', kind: 'list', maxItems: 6 },
    ],
    footerFields: SOURCE_FOOTER,
  },
  world: {
    section: 'world',
    title: 'Location Dossier',
    imageMode: 'landscape',
    fields: [
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'subcategory', label: 'Scale', kind: 'chip' },
      { key: 'locationType', label: 'Location Type', kind: 'text' },
      { key: 'parentLocation', label: 'Parent Location', kind: 'route-link' },
      { key: 'governingFaction', label: 'Governing Faction', kind: 'route-link' },
      { key: 'region', label: 'Region', kind: 'route-link' },
      { key: 'leader', label: 'Leadership', kind: 'list', maxItems: 6 },
      { key: 'inhabitants', label: 'Inhabitants', kind: 'list', maxItems: 8 },
      { key: 'contains', label: 'Contains', kind: 'list', maxItems: 8 },
      { key: 'related', label: 'Related Entries', kind: 'list', maxItems: 6 },
    ],
    footerFields: SOURCE_FOOTER,
  },
  artifacts: {
    section: 'artifacts',
    title: 'Artifact Dossier',
    imageMode: 'landscape',
    fields: [
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'subcategory', label: 'Form', kind: 'chip' },
      { key: 'artifactType', label: 'Artifact Type', kind: 'text' },
      { key: 'tier', label: 'Tier', kind: 'badge' },
      { key: 'origin', label: 'Origin', kind: 'route-link' },
      { key: 'owners', label: 'Owners', kind: 'list', maxItems: 8 },
      { key: 'users', label: 'Users', kind: 'list', maxItems: 8 },
      { key: 'contains', label: 'Contains', kind: 'list', maxItems: 8 },
      { key: 'storedItems', label: 'Stored Items', kind: 'list', maxItems: 8 },
      { key: 'related', label: 'Related Abilities / Entries', kind: 'list', maxItems: 8 },
    ],
    footerFields: SOURCE_FOOTER,
  },
  cultivation: {
    section: 'cultivation',
    title: 'Cultivation Dossier',
    imageMode: 'seal',
    fields: [
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'subcategory', label: 'Classification', kind: 'chip' },
      { key: 'pathType', label: 'Path Type', kind: 'text' },
      { key: 'realmLevel', label: 'Realm Level', kind: 'badge' },
      { key: 'realmRange', label: 'Realm Range', kind: 'text' },
      { key: 'practitioners', label: 'Practitioners', kind: 'list', maxItems: 10 },
      { key: 'related', label: 'Related Concepts', kind: 'list', maxItems: 8 },
    ],
    footerFields: SOURCE_FOOTER,
  },
  swordsmanship: {
    section: 'swordsmanship',
    title: 'Sword Art Dossier',
    imageMode: 'seal',
    fields: [
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'subcategory', label: 'Classification', kind: 'chip' },
      { key: 'abilityType', label: 'Ability Type', kind: 'text' },
      { key: 'lineage', label: 'Lineage', kind: 'route-link' },
      { key: 'users', label: 'Users', kind: 'list', maxItems: 10 },
      { key: 'related', label: 'Related Entries', kind: 'list', maxItems: 8 },
    ],
    footerFields: SOURCE_FOOTER,
  },
  teachings: {
    section: 'teachings',
    title: 'Teaching Dossier',
    imageMode: 'seal',
    fields: [
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'subcategory', label: 'School', kind: 'chip' },
      { key: 'teachingType', label: 'Teaching Type', kind: 'text' },
      { key: 'keyFigures', label: 'Key Figures', kind: 'list', maxItems: 8 },
      { key: 'relatedFactions', label: 'Related Factions', kind: 'list', maxItems: 8 },
      { key: 'related', label: 'Related Entries', kind: 'list', maxItems: 8 },
    ],
    footerFields: SOURCE_FOOTER,
  },
  glossary: {
    section: 'glossary',
    title: 'Term Dossier',
    imageMode: 'seal',
    fields: [
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'subcategory', label: 'Classification', kind: 'chip' },
      { key: 'termType', label: 'Term Type', kind: 'text' },
      { key: 'relatedTerms', label: 'Related Terms', kind: 'list', maxItems: 10 },
      { key: 'denominations', label: 'Denominations', kind: 'list', maxItems: 10 },
      { key: 'related', label: 'Related Entries', kind: 'list', maxItems: 8 },
    ],
    footerFields: SOURCE_FOOTER,
  },
  rankings: {
    section: 'rankings',
    title: 'Ranking Dossier',
    imageMode: 'seal',
    fields: [
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'subcategory', label: 'Classification', kind: 'chip' },
      { key: 'listType', label: 'List Type', kind: 'text' },
      { key: 'related', label: 'Related Entries', kind: 'list', maxItems: 8 },
    ],
    footerFields: SOURCE_FOOTER,
  },
  timeline: {
    section: 'timeline',
    title: 'Timeline Dossier',
    imageMode: 'seal',
    fields: [
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'subcategory', label: 'Event Type', kind: 'chip' },
      { key: 'date', label: 'Date', kind: 'text' },
      { key: 'era', label: 'Era', kind: 'text' },
      { key: 'location', label: 'Location', kind: 'route-link' },
      { key: 'participants', label: 'Participants', kind: 'list', maxItems: 10 },
      { key: 'related', label: 'Related Entries', kind: 'list', maxItems: 8 },
    ],
    footerFields: SOURCE_FOOTER,
  },
  pantheon: {
    section: 'pantheon',
    title: 'Pantheon Dossier',
    imageMode: 'seal',
    fields: [
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'subcategory', label: 'Classification', kind: 'chip' },
      { key: 'beingType', label: 'Being Type', kind: 'text' },
      { key: 'domain', label: 'Domain', kind: 'text' },
      { key: 'territory', label: 'Territory', kind: 'route-link' },
      { key: 'holders', label: 'Holders', kind: 'list', maxItems: 8 },
      { key: 'related', label: 'Related Entries', kind: 'list', maxItems: 8 },
    ],
    footerFields: SOURCE_FOOTER,
  },
}

export function profileForSection(section: string): EntryInfoboxProfile {
  return ENTRY_INFOBOX_PROFILES[section as PublicSection] || ENTRY_INFOBOX_PROFILES.glossary
}
