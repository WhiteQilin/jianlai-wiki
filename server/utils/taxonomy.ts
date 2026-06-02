import { SECTION_META } from '../../app/data/sectionMeta'

export const SECTION_CANON_TYPE_FIELD: Record<string, string> = {
  world: 'locationType',
  factions: 'factionType',
  artifacts: 'artifactType',
  cultivation: 'pathType',
  swordsmanship: 'abilityType',
  teachings: 'teachingType',
  pantheon: 'beingType',
  glossary: 'termType',
}

export const TAXONOMY_ALIAS_MAP: Record<string, Record<string, string>> = {
  world: {
    heaven: 'World',
    world: 'World',
    天下: 'World',
    'major world': 'World',
    realm: 'World',
    macrocosm: 'World',
  },
  factions: {},
  artifacts: {},
  cultivation: {},
  swordsmanship: {},
  teachings: {},
  pantheon: {},
  glossary: {},
}

export interface TaxonomyNormalizationReview {
  section: string
  originalCategory: string
  normalizedCategory: string
  typeField: string
  preservedTypeValue: string
  mapped: boolean
  reviewNeeded: boolean
  message: string
}

export interface TaxonomyNormalizationResult {
  frontmatter: Record<string, any>
  warnings: string[]
  review: TaxonomyNormalizationReview | null
}

export function validSiteCategoriesForSection(section: string): string[] {
  return SECTION_META[section]?.categories ?? []
}

function normalizeKey(value: string): string {
  const trimmed = value.trim()
  if (/[^\x00-\x7F]/.test(trimmed)) return trimmed
  return trimmed.toLowerCase().replace(/[\s_-]+/g, ' ')
}

function preserveCanonType(frontmatter: Record<string, any>, section: string, originalCategory: string): {
  typeField: string
  preservedTypeValue: string
} {
  const typeField = SECTION_CANON_TYPE_FIELD[section] || 'subcategory'

  if (typeField && !frontmatter[typeField]) {
    frontmatter[typeField] = originalCategory
    return { typeField, preservedTypeValue: originalCategory }
  }

  if (!frontmatter.subcategory) {
    frontmatter.subcategory = originalCategory
    return { typeField: 'subcategory', preservedTypeValue: originalCategory }
  }

  return { typeField, preservedTypeValue: String(frontmatter[typeField] || frontmatter.subcategory || '') }
}

export function normalizeImportedTaxonomy(frontmatter: Record<string, any>): TaxonomyNormalizationResult {
  const warnings: string[] = []
  const section = typeof frontmatter.section === 'string' ? frontmatter.section.trim() : ''
  const originalCategory = typeof frontmatter.category === 'string' ? frontmatter.category.trim() : ''

  if (!section || !originalCategory) {
    return { frontmatter, warnings, review: null }
  }

  const validCategories = validSiteCategoriesForSection(section)
  if (!validCategories.length) {
    return { frontmatter, warnings, review: null }
  }

  const exactValidCategory = validCategories.find((cat) => cat === originalCategory)
  if (exactValidCategory) {
    frontmatter.category = exactValidCategory
    return { frontmatter, warnings, review: null }
  }

  const caseInsensitiveValidCategory = validCategories.find((cat) => cat.toLowerCase() === originalCategory.toLowerCase())
  if (caseInsensitiveValidCategory) {
    frontmatter.category = caseInsensitiveValidCategory
    return { frontmatter, warnings, review: null }
  }

  const aliasMap = TAXONOMY_ALIAS_MAP[section] || {}
  const aliasCategory = aliasMap[normalizeKey(originalCategory)]

  if (aliasCategory && validCategories.includes(aliasCategory)) {
    const { typeField, preservedTypeValue } = preserveCanonType(frontmatter, section, originalCategory)
    frontmatter.category = aliasCategory

    const message = `Mapped imported category "${originalCategory}" to site category "${aliasCategory}" and preserved it as ${typeField}.`
    warnings.push(message)

    return {
      frontmatter,
      warnings,
      review: {
        section,
        originalCategory,
        normalizedCategory: aliasCategory,
        typeField,
        preservedTypeValue,
        mapped: true,
        reviewNeeded: false,
        message,
      },
    }
  }

  const { typeField, preservedTypeValue } = preserveCanonType(frontmatter, section, originalCategory)
  frontmatter.category = ''

  const message = `Taxonomy review needed: imported category "${originalCategory}" is not a valid site category for section "${section}". Choose a valid site category manually; preserved imported category as ${typeField}.`
  warnings.push(message)

  return {
    frontmatter,
    warnings,
    review: {
      section,
      originalCategory,
      normalizedCategory: '',
      typeField,
      preservedTypeValue,
      mapped: false,
      reviewNeeded: true,
      message,
    },
  }
}
