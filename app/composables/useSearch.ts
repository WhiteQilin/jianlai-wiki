import { isRoutedPath } from '~/utils/relationshipConfig'
import type { SearchableEntry } from '~/utils/searchEntries'

/**
 * useSearch — static, build-time search dataset (Stage 6A).
 *
 * Loads every content entry once via `queryCollection('content').all()` (the
 * same SSG-friendly mechanism as `useRelatedEntries`), filters to public routed
 * pages with `isRoutedPath` (which excludes `_meta`, `_templates`, and the
 * internal `/titles` section), and projects each record to a minimal
 * `SearchableEntry` so the client payload stays small.
 *
 * The Nuxt `useAsyncData` key is shared, so repeated calls reuse one fetch.
 */
export async function useSearch() {
  const { data: all } = await useAsyncData('search-index', () =>
    queryCollection('content').all(),
  )

  const entries = computed<SearchableEntry[]>(() => {
    const records = (all.value ?? []) as Array<Record<string, any>>
    const out: SearchableEntry[] = []

    for (const r of records) {
      if (!isRoutedPath(r.path)) continue
      const section = r.path.split('/').filter(Boolean)[0] ?? ''
      out.push({
        path: r.path,
        title: r.title || 'Untitled',
        chinese: r.chinese || undefined,
        pinyin: r.pinyin || undefined,
        description: r.description || undefined,
        category: r.category || undefined,
        tags: Array.isArray(r.tags) ? r.tags : undefined,
        section,
      })
    }

    return out
  })

  return { entries }
}
