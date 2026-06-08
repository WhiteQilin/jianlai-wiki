<script setup lang="ts">
import { computed } from 'vue'
import { createEntryResolver, humanizePath, type ResolvedEntryLink } from '~/utils/entryLinkResolver'
import { RELATIONSHIP_FIELDS, extractPaths, isRoutedPath } from '~/utils/relationshipConfig'

type ContentRecord = Record<string, any> & {
  path?: string
  title?: string
  chinese?: string
  description?: string
  category?: string
  status?: string
  importance?: string
  verificationStatus?: string
  image?: string
  seal?: string
  tags?: string[]
  users?: string[]
  related?: string[]
  sourceNotes?: string
  lastUpdated?: string
}

type SwordManualEntry = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  status?: string
  importance?: string
  verificationStatus?: string
  image?: string
  seal?: string
  tags: string[]
  sourceNotes?: string
  lastUpdated?: string
  knownUserLinks: ResolvedEntryLink[]
  relatedLinks: ResolvedEntryLink[]
}

const meta = useSectionMeta('swordsmanship')
const charactersMeta = useSectionMeta('characters')
const cultivationMeta = useSectionMeta('cultivation')
const artifactsMeta = useSectionMeta('artifacts')

const { data: contentRecords } = await useAsyncData('sword-manual-content', () => {
  return queryCollection('content').order('title', 'ASC').all()
})

const allRecords = computed<ContentRecord[]>(() => (contentRecords.value ?? []) as ContentRecord[])

const normalizePath = (value: unknown) => {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed.startsWith('/')) return ''
  return trimmed.replace(/\/+$/g, '') || '/'
}

const normalizeLabel = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const normalizeKey = (value: unknown) => normalizeLabel(value).toLowerCase()

const titleSort = (a: ContentRecord | SwordManualEntry, b: ContentRecord | SwordManualEntry) =>
  (a.title || humanizePath(a.path || '')).localeCompare(b.title || humanizePath(b.path || ''))

const importanceWeight = (value: unknown) => {
  if (normalizeKey(value) === 'primary') return 4
  if (normalizeKey(value) === 'major') return 3
  if (normalizeKey(value) === 'minor') return 2
  if (normalizeKey(value) === 'background') return 1
  return 0
}

const toStringArray = (value: unknown) =>
  (Array.isArray(value) ? value : typeof value === 'string' ? [value] : [])
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)

const existingPaths = computed(() =>
  allRecords.value
    .map((record) => normalizePath(record.path))
    .filter((path): path is string => Boolean(path && isRoutedPath(path))),
)

const existingPathSet = computed(() => new Set(existingPaths.value))

const recordByPath = computed(() => {
  const map = new Map<string, ContentRecord>()
  for (const record of allRecords.value) {
    const path = normalizePath(record.path)
    if (path && isRoutedPath(path)) map.set(path, record)
  }
  return map
})

const resolver = computed(() => createEntryResolver(allRecords.value))

const swordRecords = computed<ContentRecord[]>(() =>
  allRecords.value
    .filter((record) => normalizePath(record.path).startsWith('/swordsmanship/'))
    .sort(titleSort),
)

const categoryFilters = computed(() => {
  const actualCategories = new Set(
    swordRecords.value
      .map((record) => normalizeLabel(record.category))
      .filter((category): category is string => Boolean(category)),
  )

  const ordered = meta.categories.filter((category) => actualCategories.has(category))
  const extras = [...actualCategories].filter((category) => !meta.categories.includes(category)).sort()

  return ['All', ...ordered, ...extras]
})

const verificationCount = computed(
  () => swordRecords.value.filter((record) => Boolean(normalizeLabel(record.verificationStatus))).length,
)

const featuredRecord = computed(() => {
  const records = [...swordRecords.value].sort(
    (a, b) => importanceWeight(b.importance) - importanceWeight(a.importance) || titleSort(a, b),
  )

  return records[0] ?? null
})

const inverseReferenceLinks = computed<ResolvedEntryLink[]>(() => {
  const targetPath = normalizePath(featuredRecord.value?.path)
  if (!targetPath) return []

  const links: ResolvedEntryLink[] = []
  const seen = new Set<string>()

  for (const record of allRecords.value) {
    const sourcePath = normalizePath(record.path)
    if (!sourcePath || sourcePath === targetPath || !isRoutedPath(sourcePath) || !existingPathSet.value.has(sourcePath)) continue

    let referencesTarget = false
    for (const field of RELATIONSHIP_FIELDS) {
      if (extractPaths(record, field).some((path) => normalizePath(path) === targetPath)) {
        referencesTarget = true
        break
      }
    }

    if (!referencesTarget || seen.has(sourcePath)) continue

    const link = resolver.value.resolveEntryLink(sourcePath)
    if (!link) continue

    links.push(link)
    seen.add(sourcePath)
  }

  return links.sort((a, b) => {
    const aRecord = recordByPath.value.get(a.path)
    const bRecord = recordByPath.value.get(b.path)

    return (
      importanceWeight(bRecord?.importance) - importanceWeight(aRecord?.importance) ||
      a.label.localeCompare(b.label)
    )
  })
})

const toSwordManualEntry = (record: ContentRecord): SwordManualEntry => {
  const path = normalizePath(record.path)

  return {
    path,
    title: record.title || humanizePath(path) || 'Untitled sword record',
    chinese: record.chinese,
    description: record.description,
    category: record.category,
    status: record.status,
    importance: record.importance,
    verificationStatus: record.verificationStatus,
    image: record.image,
    seal: record.seal,
    tags: toStringArray(record.tags),
    sourceNotes: record.sourceNotes,
    lastUpdated: record.lastUpdated,
    knownUserLinks: resolver.value.resolveMany(record.users),
    relatedLinks: resolver.value.resolveMany(record.related),
  }
}

const featuredEntry = computed(() => (featuredRecord.value ? toSwordManualEntry(featuredRecord.value) : null))

const archiveEntries = computed(() =>
  swordRecords.value
    .map((record) => toSwordManualEntry(record))
    .sort((a, b) => importanceWeight(b.importance) - importanceWeight(a.importance) || titleSort(a, b)),
)

const manualStats = computed(() => ({
  totalCount: archiveEntries.value.length,
  categoryCount: categoryFilters.value.filter((category) => category !== 'All').length,
  verificationCount: verificationCount.value,
}))

const representativeSeals = computed(() =>
  archiveEntries.value
    .map((entry) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0))
    .filter((seal): seal is string => Boolean(seal))
    .slice(0, 8),
)

const knownUserLinks = computed(() => featuredEntry.value?.knownUserLinks ?? [])
const relatedRecordLinks = computed(() => featuredEntry.value?.relatedLinks ?? [])

const relatedLinks = computed(() => [
  {
    link: '/characters',
    titleZh: charactersMeta.chinese || charactersMeta.title,
    titleEn: charactersMeta.title,
    bgChar: (charactersMeta.chinese || charactersMeta.title).charAt(0),
  },
  {
    link: '/cultivation',
    titleZh: cultivationMeta.chinese || cultivationMeta.title,
    titleEn: cultivationMeta.title,
    bgChar: (cultivationMeta.chinese || cultivationMeta.title).charAt(0),
  },
  {
    link: '/artifacts',
    titleZh: artifactsMeta.chinese || artifactsMeta.title,
    titleEn: artifactsMeta.title,
    bgChar: (artifactsMeta.chinese || artifactsMeta.title).charAt(0),
  },
])

useSeoMeta({
  title: meta.title,
  description: meta.description,
  ogTitle: meta.title,
  ogDescription: meta.description,
})
</script>

<template>
  <div class="page-container sword-manual-page">
    <ScrollReveal animation="reveal-blur-clear">
      <SwordManualHero
        :title="meta.title"
        :chinese="meta.chinese"
        :description="meta.description"
        :total-count="manualStats.totalCount"
        :category-count="manualStats.categoryCount"
        :verification-count="manualStats.verificationCount"
        :representative-seals="representativeSeals"
      />
    </ScrollReveal>

    <main class="sword-manual mdc-content">
      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <SwordManualFeaturedSlip
          :entry="featuredEntry"
          :existing-paths="existingPaths"
        />
      </ScrollReveal>

      <ScrollReveal animation="reveal-fade-up" delay="stagger-2">
        <SwordAssociationStrip
          :known-users="knownUserLinks"
          :related-records="relatedRecordLinks"
          :referenced-by="inverseReferenceLinks"
        />
      </ScrollReveal>

      <ScrollReveal animation="reveal-fade-up" delay="stagger-3">
        <SwordCompactArchive
          :entries="archiveEntries"
          :category-filters="categoryFilters"
          :existing-paths="existingPaths"
        />
      </ScrollReveal>

      <InkDivider type="brush" />

      <ScrollReveal animation="reveal-fade-up">
        <RelatedLinks :links="relatedLinks" />
      </ScrollReveal>
    </main>
  </div>
</template>

<style scoped>
.sword-manual-page {
  --sword-paper: #f7f2e8;
  --sword-paper-alt: #fffaf0;
  --sword-mist: #e7e0d2;
  --sword-mist-light: #f0eadf;
  --sword-ink: #211f1b;
  --sword-ink-wash: #555047;
  --sword-celadon: #315f59;
  --sword-celadon-soft: rgba(49, 95, 89, 0.1);
  --sword-bronze: #8f7048;
  --sword-seal: #a92e28;
  --c-paper: var(--sword-paper);
  --c-paper-alt: var(--sword-paper-alt);
  --c-bg: var(--sword-paper);
  --c-bg-soft: var(--sword-mist-light);
  --c-bg-alt: var(--sword-mist);
  --c-ink: var(--sword-ink);
  --c-ink-wash: var(--sword-ink-wash);
  --c-text-1: var(--sword-ink);
  --c-text-2: var(--sword-ink-wash);
  --c-text-3: #766f64;
  --c-border: rgba(33, 31, 27, 0.14);
  --c-divider: rgba(33, 31, 27, 0.075);
  --c-bronze: var(--sword-bronze);
  --c-bronze-soft: rgba(143, 112, 72, 0.12);
  --c-seal-red: var(--sword-seal);
  --c-seal-red-soft: rgba(169, 46, 40, 0.085);
  min-height: 100dvh;
  max-width: 100%;
  overflow-x: clip;
  color: var(--sword-ink);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--sword-mist-light) 80%, transparent), transparent 38rem),
    radial-gradient(ellipse at 10% 12%, color-mix(in srgb, var(--sword-celadon) 11%, transparent), transparent 30rem),
    radial-gradient(ellipse at 88% 22%, color-mix(in srgb, var(--sword-bronze) 12%, transparent), transparent 28rem),
    var(--sword-paper);
}

.sword-manual {
  padding-top: clamp(2rem, 4.5vw, 3.75rem);
  padding-bottom: clamp(4rem, 7vw, 6rem);
}

@media (max-width: 640px) {
  .sword-manual-page {
    overflow-x: hidden;
  }

  .sword-manual {
    padding-top: 1.35rem;
  }
}
</style>
