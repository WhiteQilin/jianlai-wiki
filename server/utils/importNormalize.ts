/**
 * importNormalize — Stage 13F NotebookLM Import Coercion
 *
 * Normalizes NotebookLM-imported frontmatter before validation:
 * 1. Coerces YAML null optional fields to safe empties (string→"", array→[]).
 * 2. Normalizes legacy string-array relationships to schema-correct { name, relation, link } objects.
 *
 * Only touches RECOGNIZED fields from the content.config.ts schema. Unknown/custom fields
 * are preserved untouched to respect the additive-only schema philosophy.
 */

/**
 * Known optional string-like fields (null → "").
 * Derived from content.config.ts: all `.string().optional()` except `category`/`section`
 * (which are required/validated separately).
 */
const STRING_OPTIONAL_FIELDS = new Set([
  // Base
  'pinyin',
  'subcategory',
  'status',
  'image',
  'banner',
  'video',
  'seal',
  'description',
  'sourceNotes',
  'firstAppearance',
  'lastUpdated',
  'chinese',
  'titleZh',
  // Character
  'realm',
  'origin',
  // Faction
  'factionType',
  'headquarters',
  'region',
  // Artifact
  'artifactType',
  'tier',
  // World
  'locationType',
  'governingFaction',
  'parentLocation',
  // Cultivation
  'pathType',
  // Swordsmanship
  'abilityType',
  'lineage',
  // Ranking
  'listType',
  // Teaching
  'teachingType',
  // Pantheon
  'beingType',
  'domain',
  'territory',
  // Title
  'titleType',
  'grantedBy',
  // Timeline
  'date',
  'era',
  'location', // scalar timeline.location vs relationship location (both exist in schema)
])

/**
 * Known optional array-like fields (null → []).
 * Derived from content.config.ts: all `.array(...).optional()`.
 */
const ARRAY_OPTIONAL_FIELDS = new Set([
  // Base
  'tags',
  'related',
  // Character
  'affiliations',
  'titles',
  'abilities',
  // Faction
  'members',
  'teachings',
  // Artifact
  'owners',
  'contains',
  'storedItems',
  // World
  'inhabitants',
  // Cultivation
  'practitioners',
  // Swordsmanship
  'users',
  // Teaching
  'keyFigures',
  'relatedFactions',
  // Title
  'holders',
  // Timeline
  'participants',
  // Glossary
  'relatedTerms',
  'denominations',
  // Object arrays (also null→[], but element structure is schema-driven)
  'relationships',
  'entries',
])

/**
 * Known optional number fields (null → delete key, don't fabricate 0).
 */
const NUMBER_OPTIONAL_FIELDS = new Set(['realmLevel', 'eraOrder'])

/**
 * `leader` is special: `z.union([z.string(), z.array(z.string())])`.
 * NotebookLM may emit null; coerce to "" (treating as scalar default).
 */
const UNION_STRING_OR_ARRAY_FIELDS = new Set(['leader'])

export interface ImportFieldNormalizationReview {
  frontmatter: Record<string, any>
  warnings: string[]
  normalizedNullFields: string[]
  normalizedRelationships: boolean
  relationshipsConvertedCount: number
}

/**
 * Infer a display name from a slug or path.
 * E.g. `/characters/ning-yao` → "Ning Yao", `cui-chan` → "Cui Chan".
 */
function inferNameFromSlug(pathOrSlug: string): string {
  const slug = pathOrSlug.split('/').filter(Boolean).pop() || pathOrSlug
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Check if a string looks like a routed path (`/section/slug`).
 * Simplified from app/utils/relationshipConfig.ts isRoutedPath (no section allow-list check).
 */
function looksLikeRoutedPath(value: string): boolean {
  if (!value.startsWith('/')) return false
  if (value.includes('/_')) return false
  const segments = value.split('/').filter(Boolean)
  return segments.length === 2
}

/**
 * Normalize a `relationships` field value from a legacy string array to schema-correct objects.
 * Returns the normalized value, whether conversion occurred, and the count of converted items.
 */
function normalizeRelationshipsField(value: unknown): {
  value: any
  converted: boolean
  count: number
} {
  if (!Array.isArray(value)) {
    return { value, converted: false, count: 0 }
  }

  let converted = false
  let count = 0
  const normalized = value.map((item) => {
    // Already an object with name? Leave it (may be partial, but keep the structure).
    if (item && typeof item === 'object' && typeof (item as any).name === 'string') {
      return item
    }

    // String item: convert to { name, relation, link }.
    if (typeof item === 'string') {
      converted = true
      count += 1

      if (looksLikeRoutedPath(item)) {
        return {
          name: inferNameFromSlug(item),
          relation: '',
          link: item,
        }
      } else {
        return {
          name: item,
          relation: '',
          link: '',
        }
      }
    }

    // Unknown shape: preserve.
    return item
  })

  return { value: normalized, converted, count }
}

/**
 * Normalize imported frontmatter fields:
 * - Coerce null optional fields to safe empties (string→"", array→[]).
 * - Normalize legacy string-array `relationships` to { name, relation, link } objects.
 * - Preserve unknown/custom fields untouched.
 *
 * Returns the normalized frontmatter + warnings + normalization review data.
 */
export function normalizeImportedFields(frontmatter: Record<string, any>): ImportFieldNormalizationReview {
  const normalized = { ...frontmatter }
  const nullFieldsCoerced: string[] = []
  const warnings: string[] = []
  let relationshipsConverted = false
  let relationshipsConvertedCount = 0

  // 1. Coerce null optional fields to safe empties (only recognized keys).
  for (const key of Object.keys(normalized)) {
    const val = normalized[key]

    // Only coerce null/undefined; leave existing empties/zeros/false alone.
    if (val !== null && val !== undefined) continue

    if (STRING_OPTIONAL_FIELDS.has(key)) {
      normalized[key] = ''
      nullFieldsCoerced.push(key)
    } else if (ARRAY_OPTIONAL_FIELDS.has(key)) {
      normalized[key] = []
      nullFieldsCoerced.push(key)
    } else if (NUMBER_OPTIONAL_FIELDS.has(key)) {
      delete normalized[key] // Don't fabricate 0; leave undefined.
      nullFieldsCoerced.push(key)
    } else if (UNION_STRING_OR_ARRAY_FIELDS.has(key)) {
      normalized[key] = '' // Default to scalar string.
      nullFieldsCoerced.push(key)
    }
    // Unknown fields with null: untouched (preserve custom fields).
  }

  // 2. Normalize relationships field if it's a string array.
  if (normalized.relationships !== null && normalized.relationships !== undefined) {
    const result = normalizeRelationshipsField(normalized.relationships)
    normalized.relationships = result.value
    if (result.converted) {
      relationshipsConverted = true
      relationshipsConvertedCount = result.count
    }
  }

  // 3. Build warnings.
  if (nullFieldsCoerced.length > 0) {
    warnings.push(
      `Converted null optional fields to safe empties: ${nullFieldsCoerced.join(', ')} (string→"", array→[], number→omitted).`,
    )
  }

  if (relationshipsConverted) {
    warnings.push(
      `Converted relationship string array to structured relationships: ${relationshipsConvertedCount} item(s) normalized to { name, relation, link } objects.`,
    )
  }

  return {
    frontmatter: normalized,
    warnings,
    normalizedNullFields: nullFieldsCoerced,
    normalizedRelationships: relationshipsConverted,
    relationshipsConvertedCount,
  }
}
