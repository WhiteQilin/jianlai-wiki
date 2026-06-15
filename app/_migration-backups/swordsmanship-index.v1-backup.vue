<script setup lang="ts">
import { computed } from 'vue'
import JianLaiInkDivider from '~/components/ui/InkDivider.vue'
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
  <div class="page-container sword-manual-page" data-jl-section="swordsmanship">
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
      <div class="manual-spine" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="manual-scroll-field">
        <section class="manual-node manual-node--featured" aria-label="Featured sword manual record">
          <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
            <SwordManualFeaturedSlip
              :entry="featuredEntry"
              :existing-paths="existingPaths"
            />
          </ScrollReveal>
        </section>

        <SwordSlashDivider label="blade register" />

        <section class="manual-node manual-node--notes" aria-label="Sword manual marginal notes">
          <ScrollReveal animation="reveal-fade-up" delay="stagger-2">
            <SwordAssociationStrip
              :known-users="knownUserLinks"
              :related-records="relatedRecordLinks"
              :referenced-by="inverseReferenceLinks"
            />
          </ScrollReveal>
        </section>

        <SwordSlashDivider label="recorded arts" />

        <section class="manual-node manual-node--archive" aria-label="Sword art register">
          <ScrollReveal animation="reveal-fade-up" delay="stagger-3">
            <SwordCompactArchive
              :entries="archiveEntries"
              :category-filters="categoryFilters"
              :existing-paths="existingPaths"
            />
          </ScrollReveal>
        </section>

        <div class="sword-lower-transition" aria-hidden="true">
          <span></span>
        </div>

        <JianLaiInkDivider variant="line" />

        <section class="manual-node manual-node--related" aria-label="Related section links">
          <ScrollReveal animation="reveal-fade-up">
            <RelatedLinks :links="relatedLinks" />
          </ScrollReveal>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.sword-manual-page {
  --sword-paper: var(--jl-section-paper);
  --sword-paper-alt: color-mix(in srgb, var(--jl-section-paper) 88%, white);
  --sword-mist: var(--jl-section-mist);
  --sword-mist-light: color-mix(in srgb, var(--jl-section-mist) 54%, var(--jl-section-paper));
  --sword-ink: var(--jl-section-ink);
  --sword-ink-wash: color-mix(in srgb, var(--jl-section-ink) 82%, var(--jl-section-mist));
  --sword-celadon: var(--jl-section-accent);
  --sword-celadon-soft: var(--jl-section-accent-soft);
  --sword-bronze: color-mix(in srgb, var(--jl-section-accent) 72%, var(--jl-section-ink));
  --sword-seal: var(--jl-section-seal);
  --sword-silver: color-mix(in srgb, #edf7fa 58%, var(--jl-section-accent));
  --c-paper: var(--sword-paper);
  --c-paper-alt: var(--sword-paper-alt);
  --c-bg: var(--sword-paper);
  --c-bg-soft: var(--sword-mist-light);
  --c-bg-alt: var(--sword-mist);
  --c-ink: var(--sword-ink);
  --c-ink-wash: var(--sword-ink-wash);
  --c-text-1: var(--sword-ink);
  --c-text-2: var(--sword-ink-wash);
  --c-text-3: #647981;
  --c-border: rgba(24, 38, 45, 0.14);
  --c-divider: rgba(24, 38, 45, 0.08);
  --c-bronze: var(--sword-bronze);
  --c-bronze-soft: rgba(88, 121, 136, 0.12);
  --c-seal-red: var(--sword-seal);
  --c-seal-red-soft: rgba(169, 46, 40, 0.085);
  min-height: 100dvh;
  max-width: 100%;
  overflow-x: clip;
  color: var(--sword-ink);
  background:
    var(--jl-section-bg-wash),
    linear-gradient(180deg, color-mix(in srgb, var(--sword-mist-light) 88%, transparent), transparent 38rem),
    radial-gradient(ellipse at 8% 10%, color-mix(in srgb, var(--sword-celadon) 17%, transparent), transparent 31rem),
    radial-gradient(ellipse at 92% 18%, color-mix(in srgb, var(--sword-ink) 7%, transparent), transparent 29rem),
    radial-gradient(ellipse at 64% 48%, color-mix(in srgb, var(--sword-silver) 18%, transparent), transparent 35rem),
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--sword-ink) 2.2%, transparent) 0 1px, transparent 1px 4.8rem),
    var(--sword-paper);
}

.sword-manual {
  position: relative;
  padding-top: clamp(2rem, 4.5vw, 3.75rem);
  padding-bottom: clamp(4rem, 7vw, 6rem);
}

.sword-manual::before {
  content: '';
  position: absolute;
  top: clamp(-2.4rem, -3vw, -1rem);
  bottom: clamp(7rem, 12vw, 10rem);
  left: clamp(0.45rem, 1.25vw, 0.9rem);
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent,
    color-mix(in srgb, var(--sword-silver) 58%, transparent) 8%,
    color-mix(in srgb, var(--sword-ink) 22%, transparent) 42%,
    color-mix(in srgb, var(--c-seal-red) 26%, transparent) 68%,
    transparent
  );
  transform: skewX(-10deg);
  pointer-events: none;
}

.manual-scroll-field {
  position: relative;
  min-width: 0;
  padding-left: clamp(1.2rem, 2.4vw, 2rem);
}

.manual-scroll-field::before {
  content: '';
  position: absolute;
  inset: clamp(0.4rem, 2vw, 1.2rem) 0 auto clamp(0.75rem, 1.35vw, 1rem);
  height: min(64rem, 72%);
  background:
    radial-gradient(ellipse at 0% 18%, color-mix(in srgb, var(--sword-celadon) 13%, transparent), transparent 18rem),
    radial-gradient(ellipse at 36% 42%, color-mix(in srgb, var(--sword-silver) 13%, transparent), transparent 28rem),
    linear-gradient(90deg, color-mix(in srgb, var(--sword-mist) 35%, transparent), transparent 48%);
  opacity: 0.72;
  pointer-events: none;
}

.manual-spine {
  position: absolute;
  top: clamp(1.2rem, 4vw, 2.8rem);
  bottom: clamp(8rem, 12vw, 12rem);
  left: clamp(0.18rem, 0.8vw, 0.52rem);
  z-index: 1;
  display: grid;
  align-content: space-between;
  pointer-events: none;
}

.manual-spine span,
.manual-node::before {
  width: 0.58rem;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--sword-celadon) 50%, var(--c-seal-red));
  background: color-mix(in srgb, var(--sword-paper-alt) 84%, transparent);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--sword-paper) 82%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--c-seal-red) 12%, transparent);
  transform: rotate(45deg);
}

.manual-spine span:nth-child(even) {
  border-color: color-mix(in srgb, var(--c-seal-red) 42%, var(--sword-celadon));
}

.manual-node {
  position: relative;
  min-width: 0;
}

.manual-node::before {
  content: '';
  position: absolute;
  left: calc(-1 * clamp(1.3rem, 2.5vw, 2.1rem));
  top: clamp(1.15rem, 3vw, 1.8rem);
  z-index: 2;
  pointer-events: none;
}

.manual-node--archive::before {
  top: clamp(5.2rem, 10vw, 7.4rem);
}

.manual-node--related::before {
  top: clamp(4rem, 8vw, 6rem);
}

.sword-lower-transition {
  position: relative;
  height: clamp(3.25rem, 7vw, 5.4rem);
  margin: clamp(2.2rem, 5vw, 3.8rem) 0 -0.5rem;
  pointer-events: none;
}

.sword-lower-transition::before,
.sword-lower-transition::after,
.sword-lower-transition span {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%) skewX(-17deg);
}

.sword-lower-transition::before {
  top: 50%;
  width: min(58rem, 92%);
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--sword-silver) 76%, transparent), color-mix(in srgb, var(--c-seal-red) 28%, transparent), transparent);
}

.sword-lower-transition::after {
  top: 34%;
  width: min(28rem, 58%);
  height: 0.8rem;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--sword-celadon) 16%, transparent), transparent);
  filter: blur(2px);
}

.sword-lower-transition span {
  top: 50%;
  width: 0.62rem;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 46%, var(--sword-celadon));
  background: var(--sword-paper-alt);
}

.sword-manual :deep(.related-sections) {
  position: relative;
  margin-top: clamp(3.5rem, 7vw, 5.25rem);
  padding: clamp(1.45rem, 3.4vw, 2.25rem) clamp(1rem, 3vw, 1.65rem) 0;
  border-top: 1px solid color-mix(in srgb, var(--sword-celadon) 18%, var(--c-divider));
  background:
    radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--sword-silver) 14%, transparent), transparent 24rem),
    linear-gradient(180deg, color-mix(in srgb, var(--sword-mist) 24%, transparent), transparent 58%);
}

.sword-manual :deep(.related-sections::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: min(40rem, 100%);
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--sword-silver) 56%, transparent), color-mix(in srgb, var(--c-seal-red) 22%, transparent), transparent);
  transform: translateX(-50%) skewX(-16deg);
  pointer-events: none;
}

.sword-manual :deep(.related-sections::after) {
  content: '';
  position: absolute;
  top: clamp(0.75rem, 2vw, 1.2rem);
  left: 50%;
  width: min(18rem, 54%);
  height: 0.58rem;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--sword-ink) 10%, transparent), transparent);
  transform: translateX(-50%) skewX(-20deg);
  opacity: 0.42;
  pointer-events: none;
}

.sword-manual :deep(.related-title) {
  color: var(--jl-section-title-ink, var(--c-ink));
  letter-spacing: -0.01em;
}

.sword-manual :deep(.heading-rule) {
  color: color-mix(in srgb, var(--sword-celadon) 78%, var(--sword-ink));
}

.sword-manual :deep(.jade-dot) {
  border-radius: 3px;
  color: color-mix(in srgb, var(--c-seal-red) 64%, var(--sword-celadon));
  transform: rotate(45deg);
}

@media (max-width: 640px) {
  .sword-manual-page {
    overflow-x: hidden;
  }

  .sword-manual::before,
  .manual-spine {
    left: 0.18rem;
  }

  .sword-manual {
    padding-top: 1.35rem;
  }

  .manual-scroll-field {
    padding-left: 0.92rem;
  }

  .manual-node::before {
    left: -1rem;
    width: 0.48rem;
  }

  .sword-manual :deep(.related-sections) {
    margin-top: 3rem;
    padding-inline: 0.75rem;
  }
}
</style>
