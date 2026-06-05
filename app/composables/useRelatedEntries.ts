import { MEDIA_LIBRARY } from '~/data/mediaLibrary'
import {
  RELATIONSHIP_FIELDS,
  extractPaths,
  isRoutedPath,
  type RelationshipField,
} from '~/utils/relationshipConfig'

/**
 * useRelatedEntries — build-time, static related-entry resolver (Stage 5).
 *
 * Given the current page path, returns grouped, display-ready related entries:
 * - OUTGOING: relationships declared on THIS page's own frontmatter
 *   (e.g. a character's `affiliations`).
 * - INVERSE: relationships declared on OTHER pages that point AT this page
 *   (e.g. rankings whose `entries[].link` includes this character).
 *
 * Static-generation friendly: one `queryCollection('content').all()` per page,
 * resolved purely in memory and baked into the prerendered HTML. No runtime DB,
 * no backend, no new dependencies.
 *
 * Safety: results are filtered through `isRoutedPath`, so `_meta`/`_templates`
 * partials and currently-internal sections (e.g. `/titles`) can never surface
 * as broken links.
 */

export interface RelatedEntry {
  path: string
  title: string
  chinese: string
  description: string
  category: string
  status: string
  image?: string
}

export interface RelatedGroup {
  /** Heading for this group (e.g. "Notable Members", "Affiliations"). */
  label: string
  /** Distinguishes computed inverse groups from the page's own outgoing ones. */
  direction: 'outgoing' | 'inverse'
  entries: RelatedEntry[]
}

const PUBLIC_IMAGE_PATHS = new Set(
  MEDIA_LIBRARY
    .filter((item) => item.type === 'image')
    .map((item) => item.path),
)

function publicImagePath(record: Record<string, any>): string | undefined {
  const image = typeof record.image === 'string' ? record.image.trim() : ''
  if (!image) return undefined
  return PUBLIC_IMAGE_PATHS.has(image) ? image : undefined
}

function publicStatusLabel(record: Record<string, any>): string {
  const status = typeof record.status === 'string' ? record.status.trim() : ''
  const verification = typeof record.verificationStatus === 'string' ? record.verificationStatus.trim() : ''

  if (status && !['published', 'draft'].includes(status.toLowerCase())) return status

  const verificationLabels: Record<string, string> = {
    verified: 'Verified',
    'to-be-verified': 'To Be Verified',
    disputed: 'Disputed',
    speculative: 'Speculative',
  }

  return verificationLabels[verification] || 'To Be Verified'
}

function toRelatedEntry(record: Record<string, any>): RelatedEntry | null {
  const path = record.path
  if (!isRoutedPath(path)) return null
  return {
    path,
    title: record.title || 'Unknown',
    chinese: record.chinese || '',
    description: record.description || 'Entry pending detailed documentation.',
    category: record.category || 'Entry',
    status: publicStatusLabel(record),
    image: publicImagePath(record),
  }
}

export async function useRelatedEntries(currentPath: string) {
  const { data: all } = await useAsyncData('all-entries-graph', () =>
    queryCollection('content').all(),
  )

  const groups = computed<RelatedGroup[]>(() => {
    const entries = (all.value ?? []) as Array<Record<string, any>>
    if (!entries.length || !currentPath) return []

    // path -> record, routed pages only (defensive against partial leakage).
    const byPath = new Map<string, Record<string, any>>()
    for (const e of entries) {
      if (isRoutedPath(e.path)) byPath.set(e.path, e)
    }

    const current = byPath.get(currentPath)
    const result: RelatedGroup[] = []

    // Page-level dedupe: with symmetric fields (e.g. `related`) the same entity
    // can satisfy both an OUTGOING and an INVERSE relation. Render each target
    // only once, prioritising the OUTGOING (authored-on-this-page) appearance,
    // then earlier-defined fields. Prevents the same card showing twice.
    const shown = new Set<string>()

    // --- OUTGOING: this page's own relationship fields ---
    if (current) {
      for (const def of RELATIONSHIP_FIELDS) {
        const resolved: RelatedEntry[] = []
        for (const targetPath of extractPaths(current, def)) {
          if (targetPath === currentPath || shown.has(targetPath)) continue
          const target = byPath.get(targetPath)
          if (!target) continue
          const re = toRelatedEntry(target)
          if (re) {
            resolved.push(re)
            shown.add(targetPath)
          }
        }
        if (resolved.length) {
          result.push({ label: def.outgoingLabel, direction: 'outgoing', entries: resolved })
        }
      }
    }

    // --- INVERSE: other pages whose relationship fields point at this page ---
    for (const def of RELATIONSHIP_FIELDS) {
      const resolved: RelatedEntry[] = []
      for (const e of entries) {
        if (e.path === currentPath || shown.has(e.path)) continue
        const paths = extractPaths(e, def)
        if (paths.includes(currentPath)) {
          const re = toRelatedEntry(e)
          if (re) {
            resolved.push(re)
            shown.add(e.path)
          }
        }
      }
      if (resolved.length) {
        result.push({ label: def.inverseLabel, direction: 'inverse', entries: resolved })
      }
    }

    return result
  })

  return { groups }
}
