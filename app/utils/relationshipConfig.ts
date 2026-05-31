/**
 * relationshipConfig — declarative map of frontmatter relationship fields and
 * their inverse labels, plus the routed-section allow-list (Stage 5).
 *
 * Pure data + pure helpers. No Nuxt context, no queryCollection. Auto-imported
 * from `app/utils`.
 *
 * Mental model (mirrors IA plan §5): a relationship is stored as a path string
 * on ONE side (the "owner"). The owning page lists it as an OUTGOING relation;
 * every page it points at computes the INVERSE relation at build time.
 *
 *   character.affiliations: ['/factions/x']   (outgoing on the character)
 *     -> faction /factions/x shows "Notable Members" (inverse) listing the character
 */

/** Sections that have a real public route. Used to drop links that would 404. */
export const ROUTED_SECTIONS = [
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

export type RoutedSection = (typeof ROUTED_SECTIONS)[number]

/**
 * isRoutedPath — true only for `/section/slug` paths whose section has a public
 * route. Rejects `_`-prefixed partials (`/_meta`, `/_templates`) and currently
 * internal sections like `/titles` (no route yet), so related grids never link
 * to a 404.
 */
export function isRoutedPath(path: unknown): path is string {
  if (typeof path !== 'string' || !path.startsWith('/')) return false
  if (path.includes('/_')) return false
  const seg = path.split('/').filter(Boolean)[0]
  return !!seg && (ROUTED_SECTIONS as readonly string[]).includes(seg)
}

/**
 * A relationship field definition. `field` is the frontmatter key holding an
 * array of path strings (or, for `entries`, objects with a `.link`).
 *
 * - `outgoingLabel`: heading shown on the OWNER page (the page that declares the
 *   field) for its own outgoing links.
 * - `inverseLabel`: heading shown on a TARGET page for the computed inverse.
 * - `shape`: how the field stores paths — a plain `string[]`, a single `string`,
 *   or an array of objects exposing a `.link` (e.g. ranking `entries`).
 */
export interface RelationshipField {
  field: string
  outgoingLabel: string
  inverseLabel: string
  shape: 'pathArray' | 'pathString' | 'linkObjectArray'
}

/**
 * Stage 5 starter set (incremental). Only the relationships proven against
 * existing sample data are enabled here; more can be appended later without
 * touching the composable.
 */
export const RELATIONSHIP_FIELDS: RelationshipField[] = [
  {
    field: 'affiliations',
    outgoingLabel: 'Affiliations',
    inverseLabel: 'Notable Members',
    shape: 'pathArray',
  },
  {
    field: 'entries',
    outgoingLabel: 'Listed Entries',
    inverseLabel: 'Appears in Rankings',
    shape: 'linkObjectArray',
  },
]

/** Extract the path strings a record stores for a given relationship field. */
export function extractPaths(record: Record<string, unknown>, def: RelationshipField): string[] {
  const raw = record[def.field]
  if (raw == null) return []

  if (def.shape === 'pathString') {
    return typeof raw === 'string' ? [raw] : []
  }

  if (def.shape === 'pathArray') {
    return Array.isArray(raw) ? raw.filter((v): v is string => typeof v === 'string') : []
  }

  // linkObjectArray: [{ link?: string, ... }]
  if (def.shape === 'linkObjectArray') {
    if (!Array.isArray(raw)) return []
    return raw
      .map((item) =>
        item && typeof item === 'object' && typeof (item as any).link === 'string'
          ? ((item as any).link as string)
          : null,
      )
      .filter((v): v is string => typeof v === 'string')
  }

  return []
}
