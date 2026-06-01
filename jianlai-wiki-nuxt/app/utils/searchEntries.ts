/**
 * searchEntries — pure match + weighted scoring + grouping for static search (Stage 6A).
 *
 * No Nuxt context, no queryCollection — auto-imported from `app/utils`.
 * Case-insensitive substring matching across the six indexed fields, with
 * field-weighted scoring and a prefix/exact bonus so the strongest matches
 * rank first. Lightweight on purpose: no fuzzy-search dependency.
 */

export interface SearchableEntry {
  path: string
  title: string
  chinese?: string
  pinyin?: string
  description?: string
  category?: string
  tags?: string[]
  section: string
}

export interface SearchResult extends SearchableEntry {
  score: number
}

export interface SearchGroup {
  section: string
  results: SearchResult[]
}

/** Per-field base weights (higher = stronger signal). */
const FIELD_WEIGHTS = {
  title: 10,
  chinese: 10,
  pinyin: 6,
  category: 5,
  tags: 4,
  description: 2,
} as const

/**
 * Score a single field value against the normalized query.
 * Returns 0 for no match; adds a bonus for exact or prefix matches.
 */
function scoreField(value: string | undefined, q: string, weight: number): number {
  if (!value) return 0
  const v = value.toLowerCase()
  const idx = v.indexOf(q)
  if (idx === -1) return 0

  let score = weight
  if (v === q) score += weight * 2 // exact match
  else if (idx === 0) score += weight // prefix match
  return score
}

function scoreEntry(entry: SearchableEntry, q: string): number {
  let score = 0
  score += scoreField(entry.title, q, FIELD_WEIGHTS.title)
  score += scoreField(entry.chinese, q, FIELD_WEIGHTS.chinese)
  score += scoreField(entry.pinyin, q, FIELD_WEIGHTS.pinyin)
  score += scoreField(entry.category, q, FIELD_WEIGHTS.category)
  score += scoreField(entry.description, q, FIELD_WEIGHTS.description)
  if (Array.isArray(entry.tags)) {
    for (const tag of entry.tags) {
      score += scoreField(tag, q, FIELD_WEIGHTS.tags)
    }
  }
  return score
}

/**
 * searchEntries — returns a flat, score-sorted result list for a query.
 * Empty/whitespace query returns []. Pure and synchronous.
 */
export function searchEntries(entries: SearchableEntry[], query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results: SearchResult[] = []
  for (const entry of entries) {
    const score = scoreEntry(entry, q)
    if (score > 0) results.push({ ...entry, score })
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.title.localeCompare(b.title)
  })

  return results
}

/** Group score-sorted results by section, preserving rank order within each group. */
export function groupResultsBySection(results: SearchResult[]): SearchGroup[] {
  const order: string[] = []
  const map = new Map<string, SearchResult[]>()

  for (const r of results) {
    if (!map.has(r.section)) {
      map.set(r.section, [])
      order.push(r.section)
    }
    map.get(r.section)!.push(r)
  }

  return order.map((section) => ({ section, results: map.get(section)! }))
}
