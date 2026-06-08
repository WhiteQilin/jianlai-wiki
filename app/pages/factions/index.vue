<script setup lang="ts">
import { computed } from 'vue'
import { createEntryResolver, humanizePath, humanizePlainValue, type ResolvedEntryLink } from '~/utils/entryLinkResolver'
import { isRoutedPath } from '~/utils/relationshipConfig'

type ContentRecord = Record<string, any> & {
  path?: string
  title?: string
  chinese?: string
  description?: string
  category?: string
  factionType?: string
  importance?: string
  verificationStatus?: string
  status?: string
  seal?: string
  headquarters?: string
  region?: string
  leader?: string | string[]
  members?: string[]
  affiliations?: string[]
}

type FactionSummary = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  factionType?: string
  importance?: string
  verificationStatus?: string
  status?: string
  seal?: string
  headquarters?: string
  region?: string
  headquartersLink?: ResolvedEntryLink | null
  leaderLinks: ResolvedEntryLink[]
  memberLinks: ResolvedEntryLink[]
  inverseAffiliationLinks: ResolvedEntryLink[]
}

type ProminenceGroup = {
  value: string
  label: string
  count: number
  entries: FactionSummary[]
}

type SeatGroup = {
  raw: string
  label: string
  chinese?: string
  path?: string
  link?: ResolvedEntryLink | null
  count: number
  entries: FactionSummary[]
  isUnplaced?: boolean
}

type AffiliationRecord = {
  faction: FactionSummary
  declaredLeaders: ResolvedEntryLink[]
  declaredMembers: ResolvedEntryLink[]
  inverseAffiliations: ResolvedEntryLink[]
  associationCount: number
}

const meta = useSectionMeta('factions')
const charactersMeta = useSectionMeta('characters')
const worldMeta = useSectionMeta('world')
const cultivationMeta = useSectionMeta('cultivation')

const { data: contentRecords } = await useAsyncData('factions-ledger-content', () => {
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

const titleSort = (a: ContentRecord | FactionSummary, b: ContentRecord | FactionSummary) =>
  (a.title || humanizePath(a.path || '')).localeCompare(b.title || humanizePath(b.path || ''))

const importanceOrder = ['primary', 'major', 'minor', 'background']

const formatToken = (value: unknown, fallback = 'Unmarked') => {
  const raw = normalizeLabel(value)
  if (!raw) return fallback
  return raw
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

const importanceWeight = (value: unknown) => {
  const index = importanceOrder.indexOf(normalizeKey(value))
  return index === -1 ? 0 : importanceOrder.length - index
}

const toArray = (value: unknown) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return [value]
  return []
}

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

const factionRecords = computed<ContentRecord[]>(() =>
  allRecords.value
    .filter((record) => normalizePath(record.path).startsWith('/factions/'))
    .sort(titleSort),
)

const factionPathSet = computed(() => new Set(factionRecords.value.map((record) => normalizePath(record.path))))

const characterRecords = computed<ContentRecord[]>(() =>
  allRecords.value
    .filter((record) => normalizePath(record.path).startsWith('/characters/'))
    .sort(titleSort),
)

const categoryFilters = computed(() => {
  const counts = new Map<string, number>()
  for (const record of factionRecords.value) {
    const category = normalizeLabel(record.category || record.factionType)
    if (category) counts.set(category, (counts.get(category) ?? 0) + 1)
  }

  const categories = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([category]) => category)

  return ['All', ...categories]
})

const verifiedCount = computed(
  () => factionRecords.value.filter((record) => normalizeKey(record.verificationStatus) === 'verified').length,
)

const primaryCount = computed(
  () => factionRecords.value.filter((record) => normalizeKey(record.importance) === 'primary').length,
)

const inverseAffiliationsByFactionPath = computed(() => {
  const map = new Map<string, ResolvedEntryLink[]>()

  for (const character of characterRecords.value) {
    const characterPath = normalizePath(character.path)
    if (!characterPath) continue

    for (const affiliation of Array.isArray(character.affiliations) ? character.affiliations : []) {
      const affiliationPath = normalizePath(affiliation)
      if (!affiliationPath || !factionPathSet.value.has(affiliationPath)) continue

      const resolvedCharacter = resolver.value.resolveEntryLink(characterPath)
      if (!resolvedCharacter) continue

      const list = map.get(affiliationPath) ?? []
      if (!list.some((item) => item.path === resolvedCharacter.path)) list.push(resolvedCharacter)
      map.set(affiliationPath, list)
    }
  }

  for (const [path, links] of map.entries()) {
    map.set(
      path,
      links.sort((a, b) => {
        const aRecord = recordByPath.value.get(a.path)
        const bRecord = recordByPath.value.get(b.path)
        return (
          importanceWeight(bRecord?.importance) - importanceWeight(aRecord?.importance) ||
          a.label.localeCompare(b.label)
        )
      }),
    )
  }

  return map
})

const toFactionSummary = (record: ContentRecord): FactionSummary => {
  const path = normalizePath(record.path)
  const resolveMany = (value: unknown) => resolver.value.resolveMany(value)

  return {
    path,
    title: record.title || humanizePath(path) || 'Unknown faction',
    chinese: record.chinese,
    description: record.description,
    category: record.category,
    factionType: record.factionType,
    importance: record.importance,
    verificationStatus: record.verificationStatus,
    status: record.status,
    seal: record.seal,
    headquarters: record.headquarters,
    region: record.region,
    headquartersLink: normalizeLabel(record.headquarters) ? resolver.value.resolveEntryLink(record.headquarters) : null,
    leaderLinks: resolveMany(record.leader),
    memberLinks: resolveMany(record.members),
    inverseAffiliationLinks: inverseAffiliationsByFactionPath.value.get(path) ?? [],
  }
}

const factionEntries = computed(() => factionRecords.value.map((record) => toFactionSummary(record)))

const prominenceGroups = computed<ProminenceGroup[]>(() =>
  importanceOrder
    .map((importance) => {
      const entries = factionEntries.value
        .filter((entry) => normalizeKey(entry.importance) === importance)
        .sort(titleSort)

      return {
        value: importance,
        label: formatToken(importance),
        count: entries.length,
        entries,
      }
    })
    .filter((group) => group.count > 0),
)

const prominentEntries = computed(() =>
  factionEntries.value
    .filter((entry) => ['primary', 'major'].includes(normalizeKey(entry.importance)))
    .sort(
      (a, b) =>
        importanceWeight(b.importance) - importanceWeight(a.importance) ||
        (normalizeKey(b.verificationStatus) === 'verified' ? 1 : 0) -
          (normalizeKey(a.verificationStatus) === 'verified' ? 1 : 0) ||
        titleSort(a, b),
    ),
)

const seatGroups = computed<SeatGroup[]>(() => {
  const groups = new Map<string, FactionSummary[]>()
  const unplaced: FactionSummary[] = []

  for (const entry of factionEntries.value) {
    const raw = normalizeLabel(entry.headquarters)
    if (!raw) {
      unplaced.push(entry)
      continue
    }

    const key = normalizePath(raw) || raw
    const list = groups.get(key) ?? []
    list.push(entry)
    groups.set(key, list)
  }

  const placedGroups = [...groups.entries()]
    .map(([raw, entries]) => {
      const link = resolver.value.resolveEntryLink(raw)
      const path = normalizePath(raw)
      const record = path ? recordByPath.value.get(path) : undefined

      return {
        raw,
        label: link?.label || (path ? humanizePath(path) : humanizePlainValue(raw)),
        chinese: link?.chinese || record?.chinese,
        path: link?.shouldLink ? link.path : undefined,
        link,
        count: entries.length,
        entries: entries.sort(
          (a, b) => importanceWeight(b.importance) - importanceWeight(a.importance) || titleSort(a, b),
        ),
      }
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  if (unplaced.length) {
    placedGroups.push({
      raw: 'unplaced',
      label: 'Unplaced Records',
      count: unplaced.length,
      entries: unplaced.sort(
        (a, b) => importanceWeight(b.importance) - importanceWeight(a.importance) || titleSort(a, b),
      ),
      isUnplaced: true,
    })
  }

  return placedGroups
})

const affiliationRecords = computed<AffiliationRecord[]>(() =>
  factionEntries.value
    .map((faction) => {
      const declaredLeaders = faction.leaderLinks
      const declaredMembers = faction.memberLinks.filter((member) => !declaredLeaders.some((leader) => leader.path === member.path))
      const inverseAffiliations = faction.inverseAffiliationLinks.filter(
        (link) =>
          !declaredLeaders.some((leader) => leader.path === link.path) &&
          !declaredMembers.some((member) => member.path === link.path),
      )

      return {
        faction,
        declaredLeaders,
        declaredMembers,
        inverseAffiliations,
        associationCount: declaredLeaders.length + declaredMembers.length + inverseAffiliations.length,
      }
    })
    .filter((record) => record.associationCount > 0)
    .sort(
      (a, b) =>
        b.associationCount - a.associationCount ||
        importanceWeight(b.faction.importance) - importanceWeight(a.faction.importance) ||
        titleSort(a.faction, b.faction),
    ),
)

const associationTotal = computed(() =>
  affiliationRecords.value.reduce((total, record) => total + record.associationCount, 0),
)

const archiveEntries = computed(() =>
  factionEntries.value.sort(
    (a, b) => importanceWeight(b.importance) - importanceWeight(a.importance) || titleSort(a, b),
  ),
)

const registryStats = computed(() => ({
  totalCount: factionEntries.value.length,
  categoryCount: categoryFilters.value.filter((category) => category !== 'All').length,
  verifiedCount: verifiedCount.value,
  primaryCount: primaryCount.value,
}))

const representativeSeals = computed(() =>
  archiveEntries.value
    .map((entry) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0))
    .filter((seal): seal is string => Boolean(seal))
    .slice(0, 8),
)

const relatedLinks = computed(() => [
  {
    link: '/characters',
    titleZh: charactersMeta.chinese || charactersMeta.title,
    titleEn: charactersMeta.title,
    bgChar: (charactersMeta.chinese || charactersMeta.title).charAt(0),
  },
  {
    link: '/world',
    titleZh: worldMeta.chinese || worldMeta.title,
    titleEn: worldMeta.title,
    bgChar: (worldMeta.chinese || worldMeta.title).charAt(0),
  },
  {
    link: '/cultivation',
    titleZh: cultivationMeta.chinese || cultivationMeta.title,
    titleEn: cultivationMeta.title,
    bgChar: (cultivationMeta.chinese || cultivationMeta.title).charAt(0),
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
  <div class="page-container factions-ledger-page">
    <ScrollReveal animation="reveal-blur-clear">
      <FactionRegistryHero
        :title="meta.title"
        :chinese="meta.chinese"
        :description="meta.description"
        :total-count="registryStats.totalCount"
        :category-count="registryStats.categoryCount"
        :verified-count="registryStats.verifiedCount"
        :primary-count="registryStats.primaryCount"
        :representative-seals="representativeSeals"
      />
    </ScrollReveal>

    <main class="factions-ledger mdc-content">
      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <FactionProminenceLedger
          :entries="prominentEntries"
          :prominence-groups="prominenceGroups"
          :existing-paths="existingPaths"
        />
      </ScrollReveal>

      <div class="registry-board">
        <ScrollReveal animation="reveal-fade-up" delay="stagger-2">
          <FactionSeatLedger
            :groups="seatGroups"
            :existing-paths="existingPaths"
          />
        </ScrollReveal>

        <ScrollReveal animation="reveal-fade-up" delay="stagger-3">
          <FactionAffiliationBoard
            :records="affiliationRecords"
            :association-total="associationTotal"
            :existing-paths="existingPaths"
          />
        </ScrollReveal>
      </div>

      <ScrollReveal animation="reveal-fade-up" delay="stagger-4">
        <FactionCompactArchive
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
.factions-ledger-page {
  --faction-paper: #f7f3ea;
  --faction-paper-alt: #fffaf1;
  --faction-mist: #e9e2d3;
  --faction-mist-light: #f1eadc;
  --faction-ink: #26231e;
  --faction-ink-wash: #585247;
  --faction-jade: #2f5c53;
  --faction-jade-soft: rgba(47, 92, 83, 0.1);
  --faction-bronze: #8d7150;
  --faction-seal: #ad312a;
  --c-paper: var(--faction-paper);
  --c-paper-alt: var(--faction-paper-alt);
  --c-bg: var(--faction-paper);
  --c-bg-soft: var(--faction-mist-light);
  --c-bg-alt: var(--faction-mist);
  --c-ink: var(--faction-ink);
  --c-ink-wash: var(--faction-ink-wash);
  --c-text-1: var(--faction-ink);
  --c-text-2: var(--faction-ink-wash);
  --c-text-3: #777064;
  --c-border: rgba(38, 35, 30, 0.14);
  --c-divider: rgba(38, 35, 30, 0.075);
  --c-bronze: var(--faction-bronze);
  --c-bronze-soft: rgba(141, 113, 80, 0.12);
  --c-seal-red: var(--faction-seal);
  --c-seal-red-soft: rgba(173, 49, 42, 0.085);
  min-height: 100dvh;
  max-width: 100%;
  overflow-x: clip;
  color: var(--faction-ink);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--faction-mist-light) 78%, transparent), transparent 39rem),
    radial-gradient(ellipse at 11% 11%, color-mix(in srgb, var(--faction-jade) 10%, transparent), transparent 28rem),
    radial-gradient(ellipse at 88% 18%, color-mix(in srgb, var(--faction-bronze) 12%, transparent), transparent 30rem),
    var(--faction-paper);
}

.factions-ledger {
  padding-top: clamp(2rem, 4.5vw, 3.75rem);
  padding-bottom: clamp(4rem, 7vw, 6rem);
}

.registry-board {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(300px, 1.05fr);
  gap: clamp(1.25rem, 3vw, 2rem);
  align-items: start;
  margin-top: clamp(2rem, 5vw, 3.75rem);
}

@media (max-width: 980px) {
  .registry-board {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .factions-ledger-page {
    overflow-x: hidden;
  }

  .factions-ledger {
    padding-top: 1.35rem;
  }
}
</style>
