/**
 * Field Registry — Stage 12A
 *
 * Single source of truth for the admin editor's Fandom-like field layout.
 * This is ADDITIVE EDITOR METADATA ONLY. It does NOT change the content schema
 * (content.config.ts), does NOT rename frontmatter fields, and does NOT remove
 * unknown/custom fields. It simply describes how known fields are grouped,
 * labelled, and rendered in the editor.
 *
 * Derived from:
 *  - content.config.ts (the Zod schema - all fields optional/additive)
 *  - plans/entry-field-registry.md (canonical field reference)
 *  - the previous hardcoded maps in admin.vue (now consolidated here)
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'number'
  | 'toggle'
  | 'tags'
  | 'relationship'
  | 'relationship-multi'
  | 'media'
  | 'ranking-entries'
  | 'legacy-relationships'

export type FieldGroupId =
  | 'identity'
  | 'classification'
  | 'media'
  | 'section'
  | 'relationships'
  | 'sourcing'

export interface FieldDef {
  key: string
  label: string
  type: FieldType
  group: FieldGroupId
  required?: boolean
  recommended?: boolean
  /** Static options (dynamic category options resolved via optionsForField). */
  options?: string[]
  /** For media fields: bias the picker. */
  mediaType?: 'image' | 'video'
  placeholder?: string
  help?: string
  /** Read-only display (e.g. section). */
  readonly?: boolean
}

export interface FieldGroupDef {
  id: FieldGroupId
  label: string
  /** Lower sorts first. */
  order: number
}

// ---------------------------------------------------------------------------
// Taxonomy (mirrors admin.vue CATEGORY_MAP + sectionMeta.ts)
// ---------------------------------------------------------------------------

export const PUBLIC_SECTIONS = [
  'characters',
  'world',
  'cultivation',
  'swordsmanship',
  'factions',
  'artifacts',
  'timeline',
  'glossary',
  'rankings',
  'teachings',
  'pantheon',
] as const

export type PublicSection = (typeof PUBLIC_SECTIONS)[number]

export const IMPORTANCE_VALUES = ['primary', 'major', 'minor', 'background'] as const
export const VERIFICATION_VALUES = ['verified', 'to-be-verified', 'disputed', 'speculative'] as const

export const CATEGORY_MAP: Record<string, string[]> = {
  characters: ['Character', 'Major', 'Minor', 'Gods'],
  world: ['World', 'Continent', 'Grotto-Heaven', 'Blessed Land', 'City', 'Landmark', 'Sword-Qi-Great-Wall'],
  cultivation: ['Realm', 'Path', 'Method', 'Concept'],
  swordsmanship: ['Technique', 'Flying-Sword-Art', 'Ability', 'Sword-Style'],
  factions: ['Sect', 'Dynasty', 'Academy', 'Clan', 'Alliance'],
  artifacts: ['Weapon', 'Flying-Sword', 'Sword-Nurturing-Gourd', 'Treasure', 'Material', 'Talisman'],
  timeline: ['Era', 'Event', 'Arc'],
  rankings: ['Tier-List', 'Realm-Ladder', 'Named-List'],
  teachings: ['Teaching', 'School'],
  pantheon: ['God', 'Demon', 'Spirit', 'Mountain-Water-Deity'],
  glossary: ['Term', 'Concept', 'Phrase'],
}

export function categoriesForSection(section: string): string[] {
  return CATEGORY_MAP[section] || []
}

// ---------------------------------------------------------------------------
// Group definitions
// ---------------------------------------------------------------------------

export const FIELD_GROUPS: FieldGroupDef[] = [
  { id: 'identity', label: 'Identity', order: 1 },
  { id: 'classification', label: 'Classification', order: 2 },
  { id: 'section', label: 'Section Fields', order: 3 },
  { id: 'relationships', label: 'Relationships', order: 4 },
  { id: 'media', label: 'Media', order: 5 },
  { id: 'sourcing', label: 'Sourcing & Verification', order: 6 },
]

// ---------------------------------------------------------------------------
// Global fields (apply to every section)
// ---------------------------------------------------------------------------

export const GLOBAL_FIELDS: FieldDef[] = [
  // Identity
  { key: 'title', label: 'Title (English)', type: 'text', group: 'identity', required: true, placeholder: 'e.g. Chen Ping-an' },
  { key: 'chinese', label: 'Chinese Name', type: 'text', group: 'identity', required: true, placeholder: 'e.g. 陈平安' },
  { key: 'pinyin', label: 'Pinyin', type: 'text', group: 'identity', recommended: true, placeholder: 'e.g. Chen Ping-an' },
  { key: 'seal', label: 'Seal (1-3 chars)', type: 'text', group: 'identity', recommended: true, help: 'Chinese character(s) used as a seal/stamp motif.' },
  { key: 'description', label: 'Description', type: 'textarea', group: 'identity', required: true, help: 'One-sentence summary. Used on cards, the detail lead, search & SEO.' },

  // Classification
  { key: 'section', label: 'Section', type: 'text', group: 'classification', readonly: true, help: 'Determined by the folder. Read-only.' },
  { key: 'category', label: 'Category', type: 'select', group: 'classification', required: true, help: 'Must be valid for the section to appear under a filter tab.' },
  { key: 'subcategory', label: 'Subcategory', type: 'text', group: 'classification', help: 'Free-form finer grouping.' },
  { key: 'status', label: 'Status', type: 'text', group: 'classification', placeholder: 'e.g. Alive, Active, Deceased', help: 'In-universe state. Drives the status stamp.' },
  { key: 'importance', label: 'Importance', type: 'select', group: 'classification', recommended: true, options: [...IMPORTANCE_VALUES] },
  { key: 'tags', label: 'Tags', type: 'tags', group: 'classification', recommended: true, help: 'Lowercase, hyphenated keywords.' },

  // Media
  { key: 'image', label: 'Image Path', type: 'media', group: 'media', mediaType: 'image', placeholder: '/images/...' },
  { key: 'banner', label: 'Banner Path', type: 'media', group: 'media', mediaType: 'image', placeholder: '/images/...' },
  { key: 'video', label: 'Video Path', type: 'media', group: 'media', mediaType: 'video', placeholder: '/videos/...', help: 'Optional PV. Renders a cinematic hero on character pages.' },

  // Relationships (global)
  { key: 'related', label: 'Related Entries', type: 'relationship-multi', group: 'relationships', recommended: true, help: 'Cross-links to any routed entry.' },

  // Sourcing & Verification
  { key: 'verificationStatus', label: 'Verification Status', type: 'select', group: 'sourcing', recommended: true, options: [...VERIFICATION_VALUES] },
  { key: 'sourceNotes', label: 'Source Notes', type: 'textarea', group: 'sourcing', recommended: true, help: 'Volume/chapter notes. Powers the Source Verification notice.' },
  { key: 'firstAppearance', label: 'First Appearance', type: 'text', group: 'sourcing', placeholder: 'e.g. Volume 1, Chapter 1' },
  { key: 'lastUpdated', label: 'Last Updated', type: 'text', group: 'sourcing', placeholder: 'YYYY-MM-DD' },
]

// ---------------------------------------------------------------------------
// Section-specific fields
// ---------------------------------------------------------------------------

export const SECTION_FIELDS: Record<string, FieldDef[]> = {
  characters: [
    { key: 'origin', label: 'Origin', type: 'text', group: 'section', placeholder: 'e.g. Lizhu Grotto-Heaven / 骊珠洞天' },
    { key: 'realm', label: 'Realm', type: 'text', group: 'section', placeholder: 'e.g. Immortal Realm Sword Cultivator' },
    { key: 'titles', label: 'Titles', type: 'tags', group: 'section' },
    { key: 'abilities', label: 'Abilities', type: 'tags', group: 'section' },
    { key: 'affiliations', label: 'Affiliations', type: 'relationship-multi', group: 'relationships' },
    { key: 'location', label: 'Location', type: 'relationship', group: 'relationships' },
    { key: 'relationships', label: 'Detailed Relationships', type: 'legacy-relationships', group: 'relationships', help: 'Named relationships with relation + link.' },
  ],
  factions: [
    { key: 'factionType', label: 'Faction Type', type: 'text', group: 'section' },
    { key: 'headquarters', label: 'Headquarters', type: 'relationship', group: 'relationships' },
    { key: 'leader', label: 'Leader', type: 'relationship-multi', group: 'relationships' },
    { key: 'members', label: 'Members', type: 'relationship-multi', group: 'relationships' },
    { key: 'teachings', label: 'Teachings', type: 'tags', group: 'section' },
  ],
  world: [
    { key: 'locationType', label: 'Location Type', type: 'text', group: 'section' },
    { key: 'governingFaction', label: 'Governing Faction', type: 'relationship', group: 'relationships' },
    { key: 'parentLocation', label: 'Parent Location', type: 'relationship', group: 'relationships' },
    { key: 'inhabitants', label: 'Inhabitants', type: 'relationship-multi', group: 'relationships' },
  ],
  cultivation: [
    { key: 'pathType', label: 'Path Type', type: 'text', group: 'section' },
    { key: 'realmLevel', label: 'Realm Level', type: 'number', group: 'section' },
    { key: 'practitioners', label: 'Practitioners', type: 'relationship-multi', group: 'relationships' },
  ],
  swordsmanship: [
    { key: 'abilityType', label: 'Ability Type', type: 'text', group: 'section' },
    { key: 'lineage', label: 'Lineage', type: 'text', group: 'section' },
    { key: 'users', label: 'Users', type: 'relationship-multi', group: 'relationships' },
  ],
  artifacts: [
    { key: 'artifactType', label: 'Artifact Type', type: 'text', group: 'section' },
    { key: 'tier', label: 'Tier', type: 'text', group: 'section' },
    { key: 'origin', label: 'Origin', type: 'text', group: 'section' },
    { key: 'owners', label: 'Owners', type: 'relationship-multi', group: 'relationships' },
  ],
  timeline: [
    { key: 'date', label: 'Date', type: 'text', group: 'section' },
    { key: 'era', label: 'Era', type: 'text', group: 'section' },
    { key: 'eraOrder', label: 'Era Order', type: 'number', group: 'section' },
    { key: 'location', label: 'Location', type: 'relationship', group: 'relationships' },
    { key: 'participants', label: 'Participants', type: 'relationship-multi', group: 'relationships' },
  ],
  rankings: [
    { key: 'listType', label: 'List Type', type: 'text', group: 'section' },
    { key: 'entries', label: 'Ranking Entries', type: 'ranking-entries', group: 'section', help: 'Ordered list of ranked items.' },
    { key: 'relationships', label: 'Detailed Relationships', type: 'legacy-relationships', group: 'relationships' },
  ],
  teachings: [
    { key: 'teachingType', label: 'Teaching Type', type: 'text', group: 'section' },
    { key: 'keyFigures', label: 'Key Figures', type: 'tags', group: 'section' },
    { key: 'relatedFactions', label: 'Related Factions', type: 'relationship-multi', group: 'relationships' },
  ],
  pantheon: [
    { key: 'beingType', label: 'Being Type', type: 'text', group: 'section' },
    { key: 'domain', label: 'Domain', type: 'text', group: 'section' },
    { key: 'territory', label: 'Territory', type: 'text', group: 'section' },
  ],
  glossary: [
    { key: 'termType', label: 'Term Type', type: 'text', group: 'section' },
    { key: 'relatedTerms', label: 'Related Terms', type: 'tags', group: 'section' },
  ],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** All field defs for a section: globals + section-specific, de-duplicated by key. */
export function fieldsForSection(section: string): FieldDef[] {
  const sectionDefs = SECTION_FIELDS[section] || []
  const merged: FieldDef[] = []
  const seen = new Set<string>()
  for (const def of [...GLOBAL_FIELDS, ...sectionDefs]) {
    if (seen.has(def.key)) continue
    seen.add(def.key)
    merged.push(def)
  }
  return merged
}

/** Resolve the select options for a field (handles dynamic category). */
export function optionsForField(def: FieldDef, section: string): string[] {
  if (def.key === 'category') return categoriesForSection(section)
  return def.options || []
}

/** First-seen FieldDef for every known key across globals + all sections. */
export function allFieldDefs(): Record<string, FieldDef> {
  const map: Record<string, FieldDef> = {}
  for (const def of GLOBAL_FIELDS) if (!map[def.key]) map[def.key] = def
  for (const list of Object.values(SECTION_FIELDS)) {
    for (const def of list) if (!map[def.key]) map[def.key] = def
  }
  return map
}

/** Every known frontmatter key across all sections + structural keys. */
export function knownFieldKeys(): Set<string> {
  const keys = new Set<string>()
  for (const def of GLOBAL_FIELDS) keys.add(def.key)
  for (const list of Object.values(SECTION_FIELDS)) {
    for (const def of list) keys.add(def.key)
  }
  // Structural / schema keys that are managed elsewhere or are page-internal.
  keys.add('title')
  keys.add('titleZh')
  return keys
}

/** Keys present in the frontmatter that are not part of the registry. */
export function unknownFieldKeys(frontmatter: Record<string, any>): string[] {
  const known = knownFieldKeys()
  return Object.keys(frontmatter || {}).filter((k) => !known.has(k))
}

/**
 * Group defs sorted by order, filtered to those that actually contain fields.
 * `extraKeys` are known frontmatter keys present on the entry but not part of
 * the section's default field set; they are appended to their natural group so
 * an existing known field is always editable (never silently dropped).
 */
export function groupsForSection(
  section: string,
  extraKeys: string[] = [],
): Array<FieldGroupDef & { fields: FieldDef[] }> {
  const all = [...fieldsForSection(section)]
  const seen = new Set(all.map((f) => f.key))
  const defs = allFieldDefs()
  for (const key of extraKeys) {
    if (seen.has(key)) continue
    const def = defs[key]
    if (def) {
      all.push(def)
      seen.add(key)
    }
  }
  return FIELD_GROUPS
    .map((g) => ({ ...g, fields: all.filter((f) => f.group === g.id) }))
    .filter((g) => g.fields.length > 0)
    .sort((a, b) => a.order - b.order)
}

/** Keys of required fields for a section (globals + section-specific). */
export function requiredFieldKeys(section: string): string[] {
  return fieldsForSection(section)
    .filter((f) => f.required)
    .map((f) => f.key)
}

/** Keys of recommended (non-required) fields for a section. */
export function recommendedFieldKeys(section: string): string[] {
  return fieldsForSection(section)
    .filter((f) => f.recommended && !f.required)
    .map((f) => f.key)
}
