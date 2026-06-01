import { SECTION_META, type RawSectionMeta } from '~/data/sectionMeta'

/**
 * useSectionMeta — single integration point for section index metadata.
 *
 * Returns section intro copy + a category list (with 'All' prepended) for a
 * given section key.
 *
 * Source of truth:
 * - Editorial / future-CMS source: `content/_meta/<section>.md` (human-editable).
 * - Runtime source: `app/data/sectionMeta.ts` static mirror.
 *
 * Why static at runtime: Nuxt Content v3 parses `content/_meta/*` into the
 * collection DB but does NOT return `_`-prefixed partials from query results
 * (verified at runtime — querying `/_meta/timeline` yielded null and only the
 * 'All' tab rendered). The static mirror guarantees SSG-safe values with zero
 * route-leak risk. Keep `sectionMeta.ts` in sync with the `_meta` frontmatter.
 *
 * This is synchronous and pure — no `queryCollection`, no `.all()`, so it can
 * never surface `_meta` / `_templates` into any section listing.
 */
export interface SectionMeta {
  title: string
  chinese?: string
  description?: string
  categories: string[]
}

export function useSectionMeta(section: string): SectionMeta {
  const raw: RawSectionMeta | undefined = SECTION_META[section]
  const cats = raw?.categories ?? []

  return {
    title: raw?.title ?? section,
    chinese: raw?.chinese,
    description: raw?.description,
    categories: ['All', ...cats],
  }
}
