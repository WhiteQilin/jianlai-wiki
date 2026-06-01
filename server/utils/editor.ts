import { resolve, join, sep } from 'node:path'

import { SECTION_META } from '../../app/data/sectionMeta'

/**
 * Shared helpers for the dev-only local editor API routes.
 *
 * Safety model:
 * - All routes are dev-only (callers must check `import.meta.dev`).
 * - Route paths are validated to `/section/slug` shape, rejecting traversal,
 *   `_`-prefixed partials, sample files, and the internal `titles` section.
 * - File paths are resolved and re-checked to remain inside `content/`.
 */

/** Sections that are routed/public-editable. Mirrors ROUTED_SECTIONS minus titles. */
export const EDITOR_SECTIONS = [
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

export type EditorSection = (typeof EDITOR_SECTIONS)[number]

export const IMPORTANCE_VALUES = ['primary', 'major', 'minor', 'background'] as const
export const VERIFICATION_VALUES = ['verified', 'to-be-verified', 'disputed', 'speculative'] as const

/** Valid category list for a section, from the static section metadata mirror. */
export function categoriesForSection(section: string): string[] {
  return SECTION_META[section]?.categories ?? []
}

export interface ResolvedEntryPath {
  routePath: string
  section: string
  slug: string
  fileAbsPath: string
  fileRelPath: string // posix-style, relative to content/, e.g. characters/chen-pingan.md
}

/**
 * Validate a `/section/slug` route path and resolve it to a content file path.
 * Throws an H3 error (via the provided thrower) on any invalid/unsafe input.
 */
export function resolveEntryPath(rawPath: unknown): ResolvedEntryPath | { error: string } {
  if (!rawPath || typeof rawPath !== 'string') {
    return { error: 'Path is required' }
  }

  const path = rawPath.trim()

  // Reject traversal / null bytes / backslashes outright.
  if (path.includes('..') || path.includes('\0') || path.includes('\\')) {
    return { error: 'Invalid path' }
  }

  if (!path.startsWith('/')) {
    return { error: 'Path must start with /' }
  }

  // Reject partials and the internal titles section.
  if (path.includes('/_')) {
    return { error: 'Partial paths are not editable' }
  }

  const segments = path.split('/').filter(Boolean)
  if (segments.length !== 2) {
    return { error: 'Path must be /section/slug' }
  }

  const section = segments[0] as string
  const slug = segments[1] as string

  if (section === 'titles') {
    return { error: 'The titles section is internal and not editable' }
  }

  if (!(EDITOR_SECTIONS as readonly string[]).includes(section)) {
    return { error: `Unknown or non-routed section: ${section}` }
  }

  // Slug must be a simple lowercase-ish token (defense-in-depth).
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) {
    return { error: 'Invalid slug' }
  }

  if (slug === 'sample') {
    return { error: 'Sample scaffold files are not editable' }
  }

  const contentDir = resolve(process.cwd(), 'content')
  const fileRelPath = `${section}/${slug}.md`
  const fileAbsPath = resolve(contentDir, section, `${slug}.md`)

  // Re-confirm the resolved path is still inside content/.
  if (fileAbsPath !== join(contentDir, section, `${slug}.md`)) {
    return { error: 'Path traversal detected' }
  }
  if (!fileAbsPath.startsWith(contentDir + sep)) {
    return { error: 'Path traversal detected' }
  }

  return { routePath: path, section, slug, fileAbsPath, fileRelPath }
}

export function slugifyTitle(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function validateCreateSlug(slug: string): string | null {
  if (!slug || typeof slug !== 'string') return 'slug is required'
  const s = slug.trim()
  if (!s) return 'slug is required'
  if (s.includes('..') || s.includes('\0') || s.includes('/') || s.includes('\\')) return 'slug contains invalid characters'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) return 'slug must be lowercase ASCII and hyphenated'

  const reserved = new Set(['sample', '_meta', '_templates', 'titles'])
  if (reserved.has(s)) return `slug "${s}" is reserved`

  return null
}

export interface CreateEntrySeedInput {
  title: string
  chinese: string
  pinyin?: string
  section: EditorSection
  category: string
  description: string
  importance: (typeof IMPORTANCE_VALUES)[number]
  verificationStatus: (typeof VERIFICATION_VALUES)[number]
  status?: string
  seal?: string
}

export function buildCreateEntryFrontmatter(input: CreateEntrySeedInput): Record<string, any> {
  const base: Record<string, any> = {
    title: input.title,
    chinese: input.chinese,
    pinyin: input.pinyin || '',
    section: input.section,
    category: input.category,
    status: input.status || '',
    importance: input.importance,
    verificationStatus: input.verificationStatus,
    image: '',
    banner: '',
    seal: input.seal || '',
    description: input.description,
    tags: [],
    related: [],
    sourceNotes: '',
    firstAppearance: '',
    lastUpdated: new Date().toISOString().slice(0, 10),
  }

  switch (input.section) {
    case 'characters':
      return {
        ...base,
        origin: '',
        realm: '',
        affiliations: [],
        titles: [],
        abilities: [],
      }
    case 'world':
      return {
        ...base,
        locationType: '',
        location: '',
        leader: '',
        governingFaction: '',
        parentLocation: '',
        inhabitants: [],
      }
    case 'cultivation':
      return {
        ...base,
        pathType: '',
        realmLevel: 0,
        practitioners: [],
      }
    case 'swordsmanship':
      return {
        ...base,
        abilityType: '',
        users: [],
        lineage: '',
      }
    case 'factions':
      return {
        ...base,
        factionType: '',
        headquarters: '',
        leader: '',
        members: [],
        teachings: [],
      }
    case 'artifacts':
      return {
        ...base,
        artifactType: '',
        tier: '',
        owners: [],
      }
    case 'timeline':
      return {
        ...base,
        date: '',
        era: '',
        eraOrder: 0,
        participants: [],
        location: '',
      }
    case 'rankings':
      return {
        ...base,
        listType: '',
        entries: [],
      }
    case 'teachings':
      return {
        ...base,
        teachingType: '',
        keyFigures: [],
        relatedFactions: [],
      }
    case 'pantheon':
      return {
        ...base,
        beingType: '',
        domain: '',
        territory: '',
      }
    case 'glossary':
      return {
        ...base,
        termType: '',
        relatedTerms: [],
      }
    default:
      return base
  }
}

export function buildCreateEntryBody(section: EditorSection): string {
  const templates: Record<EditorSection, string> = {
    characters: [
      '## Overview',
      '',
      '## Appearance',
      '',
      '## Personality',
      '',
      '## History',
      '',
      '## Cultivation',
      '',
      '## Abilities',
      '',
      '## Relationships',
      '',
      '## Notes',
      '',
      '## References',
      '',
    ].join('\n'),
    factions: [
      '## Overview',
      '',
      '## History / Founding',
      '',
      '## Territory & Location',
      '',
      '## Hierarchy & Members',
      '',
      '## Teachings / Doctrine',
      '',
      '## Relationships',
      '',
      '## Notes',
      '',
      '## References',
      '',
    ].join('\n'),
    world: [
      '## Overview',
      '',
      '## Geography',
      '',
      '## History & Formation',
      '',
      '## Ruling Factions & Demographics',
      '',
      '## Notable Sites',
      '',
      '## Related Events',
      '',
      '## Notes',
      '',
      '## References',
      '',
    ].join('\n'),
    cultivation: [
      '## Overview',
      '',
      '## Path / Realm Definition',
      '',
      '## Key Principles',
      '',
      '## Notable Practitioners',
      '',
      '## Notes',
      '',
      '## References',
      '',
    ].join('\n'),
    swordsmanship: [
      '## Overview',
      '',
      '## Mechanism',
      '',
      '## Users & Lineage',
      '',
      '## Combat Notes',
      '',
      '## Notes',
      '',
      '## References',
      '',
    ].join('\n'),
    artifacts: [
      '## Overview',
      '',
      '## Origin',
      '',
      '## Abilities / Properties',
      '',
      '## Owners & Transmission',
      '',
      '## Notes',
      '',
      '## References',
      '',
    ].join('\n'),
    timeline: [
      '## Overview',
      '',
      '## Event Details',
      '',
      '## Participants',
      '',
      '## Outcome & Impact',
      '',
      '## Notes',
      '',
      '## References',
      '',
    ].join('\n'),
    rankings: [
      '## Overview',
      '',
      '## Methodology',
      '',
      '## List Notes',
      '',
      '## Notes',
      '',
      '## References',
      '',
    ].join('\n'),
    teachings: [
      '## Overview',
      '',
      '## Core Doctrine',
      '',
      '## Key Figures',
      '',
      '## Influence',
      '',
      '## Notes',
      '',
      '## References',
      '',
    ].join('\n'),
    pantheon: [
      '## Overview',
      '',
      '## Domain & Authority',
      '',
      '## Myths & History',
      '',
      '## Relationships',
      '',
      '## Notes',
      '',
      '## References',
      '',
    ].join('\n'),
    glossary: [
      '## Overview',
      '',
      '## Definition',
      '',
      '## Usage in Context',
      '',
      '## Related Terms',
      '',
      '## Notes',
      '',
      '## References',
      '',
    ].join('\n'),
  }

  return templates[section]
}
