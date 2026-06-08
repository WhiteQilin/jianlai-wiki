<script setup lang="ts">
import { computed } from 'vue'
import { humanizePath, humanizePlainValue } from '~/utils/entryLinkResolver'
import { isRoutedPath } from '~/utils/relationshipConfig'

type ContentRecord = Record<string, any> & {
  path?: string
  title?: string
  chinese?: string
  description?: string
  category?: string
  importance?: string
  verificationStatus?: string
  seal?: string
  related?: string[]
  location?: string
  parentLocation?: string
  governingFaction?: string
  leader?: string | string[]
  locationType?: string
}

type AtlasLink = {
  raw: string
  label: string
  path: string
  exists: boolean
  shouldLink: boolean
  chinese?: string
}

type WorldSummary = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  importance?: string
  verificationStatus?: string
  seal?: string
  locationType?: string
}

type ClusterSeed = {
  raw: string
  field: 'parentLocation' | 'location'
}

const meta = useSectionMeta('world')
const charactersMeta = useSectionMeta('characters')
const factionsMeta = useSectionMeta('factions')
const timelineMeta = useSectionMeta('timeline')

const { data: contentRecords } = await useAsyncData('world-atlas-content', () => {
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

const titleSort = (a: ContentRecord, b: ContentRecord) =>
  (a.title || humanizePath(a.path || '')).localeCompare(b.title || humanizePath(b.path || ''))

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

const worldRecords = computed<ContentRecord[]>(() =>
  allRecords.value
    .filter((record) => normalizePath(record.path).startsWith('/world/'))
    .sort(titleSort),
)

const toWorldSummary = (record: ContentRecord): WorldSummary => {
  const path = normalizePath(record.path)

  return {
    path,
    title: record.title || humanizePath(path) || 'Unknown',
    chinese: record.chinese,
    description: record.description,
    category: record.category,
    importance: record.importance,
    verificationStatus: record.verificationStatus,
    seal: record.seal,
    locationType: record.locationType,
  }
}

const resolveAtlasLink = (value: unknown): AtlasLink | null => {
  if (typeof value !== 'string') return null

  const raw = value.trim()
  if (!raw) return null

  const path = normalizePath(raw)

  if (path && isRoutedPath(path)) {
    const record = recordByPath.value.get(path)

    return {
      raw,
      label: record?.title || humanizePath(path),
      path,
      exists: Boolean(record),
      shouldLink: Boolean(record && existingPathSet.value.has(path)),
      chinese: record?.chinese,
    }
  }

  return {
    raw,
    label: humanizePlainValue(raw),
    path: raw,
    exists: false,
    shouldLink: false,
  }
}

const resolveMany = (value: unknown) => {
  const rawValues = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []
  return rawValues
    .map((item) => resolveAtlasLink(item))
    .filter((item): item is AtlasLink => Boolean(item && item.label))
}

const categoryOrder = ['Heaven', 'Continent', 'City', 'Landmark', 'Grotto-Heaven', 'Sword-Qi-Great-Wall']

const categoryFilters = computed(() => {
  const actualCategories = new Set(
    worldRecords.value
      .map((record) => normalizeLabel(record.category))
      .filter((category): category is string => Boolean(category)),
  )

  const ordered = categoryOrder.filter((category) => actualCategories.has(category))
  const extras = [...actualCategories].filter((category) => !categoryOrder.includes(category)).sort()

  return ['All', ...ordered, ...extras]
})

const verifiedCount = computed(
  () => worldRecords.value.filter((record) => record.verificationStatus === 'verified').length,
)

const heavenEntries = computed(() =>
  worldRecords.value
    .filter((record) => normalizeLabel(record.category) === 'Heaven')
    .map((record) => ({
      ...toWorldSummary(record),
      leaderLinks: resolveMany(record.leader),
      governingFactionLink: resolveAtlasLink(record.governingFaction),
      relatedLinks: resolveMany(record.related),
    })),
)

const associationTargetsFor = (record: ContentRecord) => {
  const targets: ClusterSeed[] = []
  const seen = new Set<string>()

  for (const field of ['parentLocation', 'location'] as const) {
    const value = normalizePath(record[field]) || normalizeLabel(record[field])
    if (!value || seen.has(value)) continue
    seen.add(value)
    targets.push({ raw: value, field })
  }

  return targets
}

const associatedLinkCount = computed(() =>
  worldRecords.value.reduce((total, record) => {
    const safeTargets = associationTargetsFor(record).filter((target) => {
      const path = normalizePath(target.raw)
      return Boolean(path && isRoutedPath(path) && existingPathSet.value.has(path))
    })

    return total + safeTargets.length
  }, 0),
)

const importanceWeight = (value: unknown) => {
  if (value === 'primary') return 4
  if (value === 'major') return 3
  if (value === 'minor') return 2
  if (value === 'background') return 1
  return 0
}

const locationClusters = computed(() => {
  const clusters = new Map<string, { raw: string; fields: Set<string>; members: WorldSummary[] }>()

  for (const record of worldRecords.value) {
    for (const target of associationTargetsFor(record)) {
      const cluster = clusters.get(target.raw) ?? {
        raw: target.raw,
        fields: new Set<string>(),
        members: [],
      }

      cluster.fields.add(target.field)
      cluster.members.push(toWorldSummary(record))
      clusters.set(target.raw, cluster)
    }
  }

  return [...clusters.values()]
    .map((cluster) => {
      const path = normalizePath(cluster.raw)
      const targetRecord = path ? recordByPath.value.get(path) : undefined
      const canLink = Boolean(path && isRoutedPath(path) && existingPathSet.value.has(path))
      const members = cluster.members.sort(
        (a, b) => importanceWeight(b.importance) - importanceWeight(a.importance) || a.title.localeCompare(b.title),
      )

      return {
        raw: cluster.raw,
        label: targetRecord?.title || (path ? humanizePath(path) : humanizePlainValue(cluster.raw)),
        chinese: targetRecord?.chinese,
        path: canLink ? path : undefined,
        fields: [...cluster.fields],
        count: members.length,
        members,
      }
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
})

const archiveEntries = computed(() => worldRecords.value.map((record) => toWorldSummary(record)))

const relatedLinks = computed(() => [
  {
    link: '/characters',
    titleZh: charactersMeta.chinese || charactersMeta.title,
    titleEn: charactersMeta.title,
    bgChar: (charactersMeta.chinese || charactersMeta.title).charAt(0),
  },
  {
    link: '/factions',
    titleZh: factionsMeta.chinese || factionsMeta.title,
    titleEn: factionsMeta.title,
    bgChar: (factionsMeta.chinese || factionsMeta.title).charAt(0),
  },
  {
    link: '/timeline',
    titleZh: timelineMeta.chinese || timelineMeta.title,
    titleEn: timelineMeta.title,
    bgChar: (timelineMeta.chinese || timelineMeta.title).charAt(0),
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
  <div class="page-container world-atlas-page">
    <ScrollReveal animation="reveal-blur-clear">
      <WorldAtlasHero
        :title="meta.title"
        :chinese="meta.chinese"
        banner-image="/images/banners/world-banner.webp"
        :total-count="archiveEntries.length"
        :heaven-count="heavenEntries.length"
        :verified-count="verifiedCount"
        :associated-link-count="associatedLinkCount"
      />
    </ScrollReveal>

    <main class="world-atlas mdc-content">
      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <WorldHeavenLedger
          :entries="heavenEntries"
          :existing-paths="existingPaths"
        />
      </ScrollReveal>

      <ScrollReveal animation="reveal-fade-up" delay="stagger-2">
        <WorldLocationClusters
          :clusters="locationClusters"
          :existing-paths="existingPaths"
        />
      </ScrollReveal>

      <ScrollReveal animation="reveal-fade-up" delay="stagger-3">
        <WorldGazetteerArchive
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
.world-atlas-page {
  --world-paper: #f8f7f2;
  --world-paper-alt: #fffdf8;
  --world-mist: #e9ece5;
  --world-mist-light: #f1f3ee;
  --world-ink: #202420;
  --world-ink-wash: #4c554e;
  --world-pine: #2f5b50;
  --world-pine-soft: rgba(47, 91, 80, 0.1);
  --world-clay: #8a7057;
  --world-seal: #a9342f;
  --c-paper: var(--world-paper);
  --c-paper-alt: var(--world-paper-alt);
  --c-bg: var(--world-paper);
  --c-bg-soft: var(--world-mist-light);
  --c-bg-alt: var(--world-mist);
  --c-ink: var(--world-ink);
  --c-ink-wash: var(--world-ink-wash);
  --c-text-1: var(--world-ink);
  --c-text-2: var(--world-ink-wash);
  --c-text-3: #747b72;
  --c-border: rgba(32, 36, 32, 0.13);
  --c-divider: rgba(32, 36, 32, 0.075);
  --c-bronze: var(--world-clay);
  --c-bronze-soft: rgba(138, 112, 87, 0.11);
  --c-seal-red: var(--world-seal);
  --c-seal-red-soft: rgba(169, 52, 47, 0.08);
  min-height: 100dvh;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--world-mist-light) 72%, transparent), transparent 36rem),
    var(--world-paper);
  color: var(--world-ink);
}

.world-atlas {
  padding-top: clamp(2rem, 4.5vw, 3.75rem);
  padding-bottom: clamp(4rem, 7vw, 6rem);
}

@media (max-width: 640px) {
  .world-atlas {
    padding-top: 1.35rem;
  }
}
</style>
