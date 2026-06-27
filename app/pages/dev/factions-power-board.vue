<script setup lang="ts">
/**
 * Stage 35E-1X-C — 天下势力盘 / Sect Power Board
 * ----------------------------------------------------------------------------
 * DEV-ONLY (still on /dev/factions-power-board). Production swap is a
 * separate follow-up stage.
 *
 * Refactored from the single-file A prototype into five factions-power/*
 * components. The page owns data querying + transformation and passes
 * computed props down. Components never call queryCollection themselves.
 */
import { computed } from 'vue'
import { createEntryResolver, humanizePath, humanizePlainValue, type ResolvedEntryLink } from '~/utils/entryLinkResolver'
import { isRoutedPath } from '~/utils/relationshipConfig'
import { sealGlyph, type FactionSummary, type SeatGroup, type RelationLane, type RegistryStats } from '~/components/factions-power/types'
import FactionsPowerHero from '~/components/factions-power/FactionsPowerHero.vue'
import GreatPowersBoard from '~/components/factions-power/GreatPowersBoard.vue'
import AllianceWeb from '~/components/factions-power/AllianceWeb.vue'
import MountainGateTerritories from '~/components/factions-power/MountainGateTerritories.vue'
import CompactFactionRegister from '~/components/factions-power/CompactFactionRegister.vue'

/* ------------------------------------------------------------------ DATA -- */
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

const { data: contentRecords } = await useAsyncData('dev-factions-power-board-content', () => {
  return queryCollection('content').order('title', 'ASC').all()
})

const allRecords = computed<ContentRecord[]>(() => (contentRecords.value ?? []) as ContentRecord[])

/* -------------------------------------------------------- UTILITIES (same exact logic as productions /factions) -- */
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
const importanceWeight = (value: unknown) => {
  const index = importanceOrder.indexOf(normalizeKey(value))
  return index === -1 ? 0 : importanceOrder.length - index
}
const toArray = (value: unknown) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return [value]
  return []
}

const factionPathSet = computed(() => {
  const set = new Set<string>()
  for (const record of allRecords.value) {
    const p = normalizePath(record.path)
    if (p.startsWith('/factions/')) set.add(p)
  }
  return set
})

const resolver = computed(() => createEntryResolver(allRecords.value))

const inverseAffiliationsByFactionPath = computed(() => {
  const map = new Map<string, ResolvedEntryLink[]>()
  for (const character of allRecords.value) {
    const characterPath = normalizePath(character.path)
    if (!characterPath.startsWith('/characters/')) continue
    for (const affiliation of toArray(character.affiliations)) {
      const affiliationPath = normalizePath(affiliation)
      if (!affiliationPath || !factionPathSet.value.has(affiliationPath)) continue
      const resolved = resolver.value.resolveEntryLink(characterPath)
      if (!resolved) continue
      const list = map.get(affiliationPath) ?? []
      if (!list.some((item) => item.path === resolved.path)) list.push(resolved)
      map.set(affiliationPath, list)
    }
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

const factionEntries = computed(() =>
  allRecords.value
    .filter((record) => normalizePath(record.path).startsWith('/factions/'))
    .sort(titleSort)
    .map(toFactionSummary),
)

const existingPaths = computed(() =>
  allRecords.value
    .map((record) => normalizePath(record.path))
    .filter((path): path is string => Boolean(path && isRoutedPath(path))),
)

const importanceRank = (e: FactionSummary) => ({
  weight: importanceWeight(e.importance),
  verified: normalizeKey(e.verificationStatus) === 'verified' ? 1 : 0,
})

/* ------------------------------------------------------------------ BOARD LAYERS (re-tiered) -- */
const rankSorted = computed(() =>
  [...factionEntries.value].sort(
    (a, b) => {
      const ra = importanceRank(a)
      const rb = importanceRank(b)
      return rb.weight - ra.weight || rb.verified - ra.verified || titleSort(a, b)
    },
  ),
)

// 12 factions: 8 primary, 4 major, 0 minor/background.
// Triad: top 3 primary powers (paramount).
// Inner orbit: primary ranks 4–6 (promoted from the old flat satellite band).
// Major lane: the 4 major powers (distinct "regional powers" tier).
// Satellite: only if minor/background powers exist (currently empty → band disappears).

const primaryPowers = computed(() => rankSorted.value.filter((e) => normalizeKey(e.importance) === 'primary'))
const centreTriad = computed(() => primaryPowers.value.slice(0, 3))
const innerOrbitPowers = computed(() => primaryPowers.value.slice(3, 6))
const majorPowers = computed(() => rankSorted.value.filter((e) => normalizeKey(e.importance) === 'major'))
const satellitePowers = computed(() => primaryPowers.value.slice(6))

/* --------------------------------------------------------------- TERRITORIES -- */
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
  const placed = [...groups.entries()]
    .map(([raw, entries]) => {
      const link = resolver.value.resolveEntryLink(raw)
      const path = normalizePath(raw)
      return {
        raw,
        label: link?.label || (path ? humanizePath(path) : humanizePlainValue(raw)),
        chinese: link?.chinese,
        region: entries.find((e) => normalizeLabel(e.region))?.region,
        seatPath: link?.shouldLink ? link.path : undefined,
        count: entries.length,
        entries: entries.sort(
          (a, b) => importanceWeight(b.importance) - importanceWeight(a.importance) || titleSort(a, b),
        ),
      }
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  if (unplaced.length) {
    placed.push({
      raw: 'unplaced',
      label: 'Seat Uncatalogued',
      count: unplaced.length,
      entries: unplaced.sort(
        (a, b) => importanceWeight(b.importance) - importanceWeight(a.importance) || titleSort(a, b),
      ),
      isUnplaced: true,
    })
  }
  return placed
})

/* -------------------------------------------------------------- RELATIONS -- */
const relationLanes = computed<RelationLane[]>(() =>
  factionEntries.value
    .map((faction) => {
      const leaders = faction.leaderLinks
      const members = faction.memberLinks.filter((m) => !leaders.some((l) => l.path === m.path))
      const affiliated = faction.inverseAffiliationLinks.filter(
        (l) => !leaders.some((x) => x.path === l.path) && !members.some((x) => x.path === l.path),
      )
      return { faction, leaders, members, affiliated, total: leaders.length + members.length + affiliated.length }
    })
    .filter((r) => r.total > 0)
    .sort(
      (a, b) =>
        b.total - a.total ||
        importanceWeight(b.faction.importance) - importanceWeight(a.faction.importance) ||
        titleSort(a.faction, b.faction),
    ),
)

const relationTop = computed(() => relationLanes.value.slice(0, 5))

/* ------------------------------------------------------------ REGISTER & FILTERS -- */
const register = computed(() =>
  [...factionEntries.value].sort(
    (a, b) => {
      const ra = importanceRank(a)
      const rb = importanceRank(b)
      return rb.weight - ra.weight || rb.verified - ra.verified || titleSort(a, b)
    },
  ),
)

const categoryFilters = computed(() => {
  const counts = new Map<string, number>()
  for (const record of factionEntries.value) {
    const category = normalizeLabel(record.category || record.factionType)
    if (category) counts.set(category, (counts.get(category) ?? 0) + 1)
  }
  const categories = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([category]) => category)
  return ['All', ...categories]
})

const registryStats = computed<RegistryStats>(() => ({
  total: factionEntries.value.length,
  primary: factionEntries.value.filter((e) => normalizeKey(e.importance) === 'primary').length,
  verified: factionEntries.value.filter((e) => normalizeKey(e.verificationStatus) === 'verified').length,
  seats: seatGroups.value.filter((g) => !g.isUnplaced).length,
}))

/* ----------------------------------------------- ASSET — dev placeholder -- *
 * The entire banner-draft pool is heroic-figure-in-landscape art.
 * No architectural / court / assembly / city image exists in the asset
 * library. Production migration remains blocked on a new commissioned or
 * sourced hero image that fits the political war-table concept.
 * Do NOT register this dev-only image in assetManifest.
 */
const HERO_ATMOSPHERE = '/images/banner-draft/2024-09-19_14-00-00_15.jpg'

useSeoMeta({
  title: '[DEV] 天下势力盘 · Sect Power Board',
  description: 'Dev-only Concept A prototype for the Factions section.',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="power-board-page">
    <FactionsPowerHero :registry-stats="registryStats" :hero-image="HERO_ATMOSPHERE" />

    <main class="board-mass">
      <GreatPowersBoard
        :triad="centreTriad"
        :inner-orbit="innerOrbitPowers"
        :major-powers="majorPowers"
        :satellites="satellitePowers"
        :existing-paths="existingPaths"
      />

      <AllianceWeb :lanes="relationTop" :existing-paths="existingPaths" />

      <MountainGateTerritories :groups="seatGroups" :existing-paths="existingPaths" />

      <CompactFactionRegister
        :entries="register"
        :category-filters="categoryFilters"
        :existing-paths="existingPaths"
      />
    </main>
  </div>
</template>

<style scoped>
/* ===================================================================== */
/*  Concept A — Sect Power Board · dev prototype (refactored)            */
/*  All shared power-board tokens are defined on the page root;          */
/*  components inherit them via --pb-* custom properties.                */
/* ===================================================================== */
.power-board-page {
  --pb-field: #0e0d0b;
  --pb-field-2: #15120e;
  --pb-panel: #1a1714;
  --pb-panel-2: #221d18;
  --pb-line: rgba(212, 184, 124, 0.18);
  --pb-line-soft: rgba(212, 184, 124, 0.08);
  --pb-ink: #f3ead7;
  --pb-ink-wash: #c9bda3;
  --pb-ink-dim: #8a8071;
  --pb-gold: #c9a85a;
  --pb-gold-bright: #e3c578;
  --pb-jade: #5fa394;
  --pb-jade-deep: #2f5c53;
  --pb-cinnabar: #c64434;
  --pb-cinnabar-deep: #8f2b22;

  min-height: 100dvh;
  max-width: 100%;
  overflow-x: clip;
  color: var(--pb-ink);
  background:
    radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--pb-jade-deep) 42%, transparent), transparent 60%),
    radial-gradient(80% 60% at 88% 8%, color-mix(in srgb, var(--pb-cinnabar-deep) 30%, transparent), transparent 55%),
    linear-gradient(180deg, var(--pb-field) 0%, var(--pb-field-2) 100%);
  font-family: var(--font-base);
}

.zh-display { font-family: var(--font-zh-display); }

.board-mass {
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 4vw, 3rem) clamp(4rem, 8vw, 7rem);
}

@media (max-width: 640px) {
  .power-board-page { overflow-x: hidden; }
  .board-mass { padding-left: 1.1rem; padding-right: 1.1rem; }
}
</style>
