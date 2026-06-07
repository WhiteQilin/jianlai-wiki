<script setup lang="ts">
import { computed } from 'vue'
import { humanizePath } from '~/utils/entryLinkResolver'
import { isRoutedPath } from '~/utils/relationshipConfig'

type RelationshipRecord = {
  name?: string
  relation?: string
  link?: string
}

type ContentRecord = Record<string, any> & {
  path?: string
  title?: string
  chinese?: string
  description?: string
  category?: string
  importance?: string
  verificationStatus?: string
  seal?: string
  tags?: string[]
  related?: string[]
  relationships?: RelationshipRecord[]
  affiliations?: string[]
}

type CharacterSummary = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  importance?: string
  verificationStatus?: string
  seal?: string
  tags?: string[]
  relatedCount: number
  relationshipCount: number
  inboundCount: number
}

type RelationshipPreviewNode = CharacterSummary & {
  x: number
  y: number
  relation?: string
  weight: number
}

type RelationshipPreviewEdge = {
  key: string
  fromKey: string
  toKey: string
  relation?: string
  x1: number
  y1: number
  x2: number
  y2: number
}

const meta = useSectionMeta('characters')
const worldMeta = useSectionMeta('world')
const factionsMeta = useSectionMeta('factions')
const cultivationMeta = useSectionMeta('cultivation')

const { data: contentRecords } = await useAsyncData('characters-atlas-content', () => {
  return queryCollection('content').order('title', 'ASC').all()
})

const allRecords = computed<ContentRecord[]>(() => ((contentRecords.value ?? []) as ContentRecord[]))

const normalizePath = (value: unknown) => {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed.startsWith('/')) return ''
  return trimmed.replace(/\/+$/g, '') || '/'
}

const normalizeLabel = (value: unknown) => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

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

const characterRecords = computed<ContentRecord[]>(() =>
  allRecords.value
    .filter((record) => {
      const path = normalizePath(record.path)
      return path.startsWith('/characters/')
    })
    .sort(titleSort),
)

const characterPathSet = computed(() => new Set(characterRecords.value.map((record) => normalizePath(record.path))))

const characterByPath = computed(() => {
  const map = new Map<string, ContentRecord>()
  for (const record of characterRecords.value) {
    const path = normalizePath(record.path)
    if (path) map.set(path, record)
  }
  return map
})

const categoryFilters = computed(() => {
  const counts = new Map<string, number>()
  for (const record of characterRecords.value) {
    const category = normalizeLabel(record.category)
    if (category) counts.set(category, (counts.get(category) ?? 0) + 1)
  }
  const categories = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([category]) => category)
  return ['All', ...categories]
})

const importanceOrder = ['primary', 'major', 'minor', 'background']

const formatImportance = (value: string) => {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return ''
  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`
}

const prominenceGroups = computed(() =>
  importanceOrder
    .map((importance) => {
      const entries = characterRecords.value.filter((record) => record.importance === importance)
      return {
        value: importance,
        label: formatImportance(importance),
        count: entries.length,
      }
    })
    .filter((group) => group.count > 0),
)

const importanceFilters = computed(() => ['All', ...prominenceGroups.value.map((group) => group.label)])

const verifiedCount = computed(
  () => characterRecords.value.filter((record) => record.verificationStatus === 'verified').length,
)

const existingCharacterLinksFor = (record: ContentRecord) => {
  const links = new Set<string>()

  for (const relationship of Array.isArray(record.relationships) ? record.relationships : []) {
    const path = normalizePath(relationship?.link)
    if (path && characterPathSet.value.has(path)) links.add(path)
  }

  for (const related of Array.isArray(record.related) ? record.related : []) {
    const path = normalizePath(related)
    if (path && characterPathSet.value.has(path)) links.add(path)
  }

  return [...links]
}

const inboundReferenceCounts = computed(() => {
  const counts = new Map<string, number>()
  for (const record of characterRecords.value) {
    for (const path of existingCharacterLinksFor(record)) {
      counts.set(path, (counts.get(path) ?? 0) + 1)
    }
  }
  return counts
})

const toCharacterSummary = (record: ContentRecord): CharacterSummary => {
  const path = normalizePath(record.path)
  const relationships = Array.isArray(record.relationships) ? record.relationships : []
  const related = Array.isArray(record.related) ? record.related : []

  return {
    path,
    title: record.title || humanizePath(path),
    chinese: record.chinese,
    description: record.description,
    category: record.category,
    importance: record.importance,
    verificationStatus: record.verificationStatus,
    seal: record.seal,
    tags: Array.isArray(record.tags) ? record.tags : [],
    relatedCount: related.length,
    relationshipCount: relationships.length,
    inboundCount: inboundReferenceCounts.value.get(path) ?? 0,
  }
}

const importanceWeight = (importance: unknown) => {
  if (importance === 'primary') return 16
  if (importance === 'major') return 10
  if (importance === 'minor') return 4
  return 1
}

const connectionScore = (record: ContentRecord) => {
  const path = normalizePath(record.path)
  const tags = Array.isArray(record.tags) ? record.tags : []
  const protagonistBoost = tags.includes('protagonist') ? 1000 : 0
  const relationships = Array.isArray(record.relationships) ? record.relationships.length : 0
  const related = Array.isArray(record.related) ? record.related.length : 0
  const inbound = inboundReferenceCounts.value.get(path) ?? 0

  return protagonistBoost + inbound * 8 + relationships * 3 + related * 2 + importanceWeight(record.importance)
}

const dossierEntries = computed(() =>
  characterRecords.value
    .map((record) => ({ record, score: connectionScore(record) }))
    .sort((a, b) => b.score - a.score || titleSort(a.record, b.record))
    .slice(0, 6)
    .map(({ record }) => toCharacterSummary(record)),
)

const relationshipPreview = computed(() => {
  const centralRecord =
    characterRecords.value
      .map((record) => ({ record, score: connectionScore(record) }))
      .sort((a, b) => b.score - a.score || titleSort(a.record, b.record))[0]?.record ?? null

  if (!centralRecord) {
    return {
      central: null,
      nodes: [] as RelationshipPreviewNode[],
      edges: [] as RelationshipPreviewEdge[],
      unresolved: [] as string[],
      relationshipCount: 0,
    }
  }

  const central = toCharacterSummary(centralRecord)
  const centralPath = central.path
  const candidates = new Map<string, RelationshipPreviewNode>()
  const unresolved = new Set<string>()

  const addCandidate = (path: string, relation: string | undefined, weight: number) => {
    if (!path || path === centralPath || !characterPathSet.value.has(path)) return
    const record = characterByPath.value.get(path)
    if (!record) return
    const existing = candidates.get(path)
    const nextWeight = (existing?.weight ?? 0) + weight
    candidates.set(path, {
      ...toCharacterSummary(record),
      x: 50,
      y: 50,
      relation: existing?.relation || relation,
      weight: nextWeight,
    })
  }

  for (const relationship of Array.isArray(centralRecord.relationships) ? centralRecord.relationships : []) {
    const path = normalizePath(relationship?.link)
    if (path && characterPathSet.value.has(path)) {
      addCandidate(path, normalizeLabel(relationship?.relation) || undefined, 36)
    } else if (normalizeLabel(relationship?.name)) {
      unresolved.add(normalizeLabel(relationship?.name))
    }
  }

  for (const related of Array.isArray(centralRecord.related) ? centralRecord.related : []) {
    const path = normalizePath(related)
    if (path && characterPathSet.value.has(path)) addCandidate(path, 'Related', 22)
  }

  for (const record of characterRecords.value) {
    const path = normalizePath(record.path)
    if (!path || path === centralPath) continue

    const relatedLinks = existingCharacterLinksFor(record)
    if (relatedLinks.includes(centralPath)) {
      const relationship = (Array.isArray(record.relationships) ? record.relationships : []).find(
        (item) => normalizePath(item?.link) === centralPath,
      )
      addCandidate(path, normalizeLabel(relationship?.relation) || 'References', 12)
    }
  }

  const slots = [
    [50, 13],
    [77, 22],
    [88, 50],
    [77, 78],
    [50, 87],
    [23, 78],
    [12, 50],
    [23, 22],
  ]

  const nodes = [...candidates.values()]
    .sort((a, b) => b.weight - a.weight || b.inboundCount - a.inboundCount || a.title.localeCompare(b.title))
    .slice(0, slots.length)
    .map((node, index) => ({
      ...node,
      x: slots[index][0],
      y: slots[index][1],
    }))

  const edges = nodes.map((node) => ({
    key: `${centralPath}-${node.path}`,
    fromKey: centralPath,
    toKey: node.path,
    relation: node.relation,
    x1: 50,
    y1: 50,
    x2: node.x,
    y2: node.y,
  }))

  const relationshipCount = characterRecords.value.reduce((total, record) => {
    const relationships = Array.isArray(record.relationships) ? record.relationships : []
    return total + relationships.filter((item) => normalizeLabel(item?.name) || normalizePath(item?.link)).length
  }, 0)

  return {
    central,
    nodes,
    edges,
    unresolved: [...unresolved].slice(0, 4),
    relationshipCount,
  }
})

const affiliationClusters = computed(() => {
  const clusters = new Map<string, { raw: string; members: CharacterSummary[] }>()

  for (const record of characterRecords.value) {
    for (const affiliation of Array.isArray(record.affiliations) ? record.affiliations : []) {
      const raw = normalizePath(affiliation) || normalizeLabel(affiliation)
      if (!raw) continue
      const cluster = clusters.get(raw) ?? { raw, members: [] }
      cluster.members.push(toCharacterSummary(record))
      clusters.set(raw, cluster)
    }
  }

  return [...clusters.values()]
    .map((cluster) => {
      const targetRecord = recordByPath.value.get(cluster.raw)
      const exists = existingPathSet.value.has(cluster.raw) && isRoutedPath(cluster.raw)
      const members = cluster.members.sort(
        (a, b) =>
          importanceWeight(b.importance) - importanceWeight(a.importance) ||
          b.inboundCount - a.inboundCount ||
          a.title.localeCompare(b.title),
      )

      return {
        raw: cluster.raw,
        label: targetRecord?.title || humanizePath(cluster.raw) || cluster.raw,
        chinese: targetRecord?.chinese,
        path: exists ? cluster.raw : undefined,
        count: members.length,
        members,
      }
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 8)
})

const archiveEntries = computed(() => characterRecords.value.map((record) => toCharacterSummary(record)))

const atlasStats = computed(() => ({
  totalCount: characterRecords.value.length,
  verifiedCount: verifiedCount.value,
  topClusterCount: affiliationClusters.value[0]?.count ?? 0,
  relationshipCount: relationshipPreview.value.relationshipCount,
}))

const relatedLinks = [
  {
    link: '/world',
    titleZh: worldMeta.chinese || worldMeta.title,
    titleEn: worldMeta.title,
    bgChar: (worldMeta.chinese || worldMeta.title).charAt(0),
  },
  {
    link: '/factions',
    titleZh: factionsMeta.chinese || factionsMeta.title,
    titleEn: factionsMeta.title,
    bgChar: (factionsMeta.chinese || factionsMeta.title).charAt(0),
  },
  {
    link: '/cultivation',
    titleZh: cultivationMeta.chinese || cultivationMeta.title,
    titleEn: cultivationMeta.title,
    bgChar: (cultivationMeta.chinese || cultivationMeta.title).charAt(0),
  },
]

useSeoMeta({
  title: meta.title,
  description: meta.description,
  ogTitle: meta.title,
  ogDescription: meta.description,
})
</script>

<template>
  <div class="page-container characters-page">
    <ScrollReveal animation="reveal-blur-clear">
      <CharactersAtlasHero
        :title="meta.title"
        :chinese="meta.chinese"
        :description="meta.description"
        banner-image="/images/banners/characters-banner.webp"
        :total-count="atlasStats.totalCount"
        :verified-count="atlasStats.verifiedCount"
        :top-cluster-count="atlasStats.topClusterCount"
        :relationship-count="atlasStats.relationshipCount"
        :prominence-groups="prominenceGroups"
      />
    </ScrollReveal>

    <main class="characters-atlas mdc-content">
      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <CharactersDossierStrip :entries="dossierEntries" :existing-paths="existingPaths" />
      </ScrollReveal>

      <div class="atlas-grid">
        <ScrollReveal animation="reveal-fade-up" delay="stagger-2">
          <CharactersRelationshipPreview :preview="relationshipPreview" :existing-paths="existingPaths" />
        </ScrollReveal>

        <ScrollReveal animation="reveal-fade-up" delay="stagger-3">
          <CharactersAffiliationClusters :clusters="affiliationClusters" :existing-paths="existingPaths" />
        </ScrollReveal>
      </div>

      <ScrollReveal animation="reveal-fade-up" delay="stagger-4">
        <CharactersArchiveList
          :entries="archiveEntries"
          :category-filters="categoryFilters"
          :importance-filters="importanceFilters"
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
.characters-page {
  min-height: 100dvh;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-bg-soft) 56%, transparent), transparent 42rem),
    var(--c-bg);
}

.characters-atlas {
  padding-top: clamp(2rem, 4vw, 3.5rem);
  padding-bottom: clamp(4rem, 7vw, 6rem);
}

.atlas-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: start;
  margin-top: clamp(2.2rem, 5vw, 4rem);
}

@media (max-width: 980px) {
  .atlas-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .characters-atlas {
    padding-top: 1.4rem;
  }
}
</style>
