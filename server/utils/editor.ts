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
