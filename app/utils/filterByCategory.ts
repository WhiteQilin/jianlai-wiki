/**
 * matchesCategory — pure helper for section index category filtering (Stage 4B).
 *
 * Rules:
 * - active 'All' (or empty) → matches every item (full list).
 * - missing/non-string item category → only appears under 'All'.
 * - otherwise → case- and whitespace-insensitive exact match against the tab.
 *
 * Pure and synchronous; auto-imported from `app/utils`. No Nuxt context needed.
 */
export function matchesCategory(itemCategory: unknown, active: string): boolean {
  if (!active || active === 'All') return true
  if (typeof itemCategory !== 'string' || !itemCategory) return false
  return itemCategory.trim().toLowerCase() === active.trim().toLowerCase()
}
