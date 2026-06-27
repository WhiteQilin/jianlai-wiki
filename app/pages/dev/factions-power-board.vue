<script setup lang="ts">
/**
 * Stage 35E-1X-A — Concept A: 天下势力盘 / Sect Power Board
 * ----------------------------------------------------------------------------
 * DEV-ONLY PROTOTYPE. Not production. Do not modify /factions.
 *
 * Reuses the exact content query + data transform approach from
 * app/pages/factions/index.vue (no fabricated content). Only the presentation
 * layer is rewritten as a cinematic political power-board composition.
 */
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

/* ------------------------------------------------------------------ data -- */
const { data: contentRecords } = await useAsyncData('dev-factions-power-board-content', () => {
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

const importanceRank = (e: FactionSummary) => ({
  weight: importanceWeight(e.importance),
  verified: normalizeKey(e.verificationStatus) === 'verified' ? 1 : 0,
})

/* ---------------------------------------------------------- board layers -- */
// Top 3 primary powers dominate the board; next tier orbits.
const rankSorted = computed(() =>
  [...factionEntries.value].sort(
    (a, b) => {
      const ra = importanceRank(a)
      const rb = importanceRank(b)
      return rb.weight - ra.weight || rb.verified - ra.verified || titleSort(a, b)
    },
  ),
)

const greatPowers = computed(() => rankSorted.value.filter((e) => normalizeKey(e.importance) === 'primary'))
const orbitPowers = computed(() =>
  rankSorted.value
    .filter((e) => normalizeKey(e.importance) === 'major')
    .slice(0, 6),
)

// Centre triad = the three highest-weight powers, anchored.
const centreTriad = computed(() => greatPowers.value.slice(0, 3))
// The remaining primary powers become satellite plates in the board field.
const satellitePowers = computed(() => greatPowers.value.slice(3))

/* ----------------------------------------------------------- territories -- */
type SeatGroup = {
  raw: string
  label: string
  chinese?: string
  region?: string
  count: number
  entries: FactionSummary[]
  isUnplaced?: boolean
}

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
      label: 'Unplaced Records',
      count: unplaced.length,
      entries: unplaced.sort(
        (a, b) => importanceWeight(b.importance) - importanceWeight(a.importance) || titleSort(a, b),
      ),
      isUnplaced: true,
    })
  }
  return placed
})

/* ----------------------------------------------------------- relations --- */
type RelationRecord = {
  faction: FactionSummary
  leaders: ResolvedEntryLink[]
  members: ResolvedEntryLink[]
  affiliated: ResolvedEntryLink[]
  total: number
}

const relationLanes = computed<RelationRecord[]>(() =>
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

/* --------------------------------------------------------- register ------ */
const register = computed(() =>
  [...factionEntries.value].sort(
    (a, b) => {
      const ra = importanceRank(a)
      const rb = importanceRank(b)
      return rb.weight - ra.weight || rb.verified - ra.verified || titleSort(a, b)
    },
  ),
)

const registryStats = computed(() => ({
  total: factionEntries.value.length,
  primary: factionEntries.value.filter((e) => normalizeKey(e.importance) === 'primary').length,
  verified: factionEntries.value.filter((e) => normalizeKey(e.verificationStatus) === 'verified').length,
  seats: seatGroups.value.filter((g) => !g.isUnplaced).length,
}))

/* ----------------------------------------------------------- seal glyph -- */
const sealGlyph = (entry: FactionSummary) =>
  entry.seal || (entry.chinese ? entry.chinese.charAt(0) : entry.title.charAt(0))

/* ------------------------------------------------------- asset decision -- *
 * Production factions-banner.webp is a soft pink-lotus tunnel (mystical, not
 * political). For a SECT POWER BOARD we need architecture / power / assembly
 * atmosphere. The /images/banner-draft/* stills are 4096x1720 cinematic donghua
 * frames with strong contrast. Used here as a DEV-ONLY placeholder atmosphere.
 * No production asset is changed.
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
    <!-- ============================================================= HERO -->
    <section class="cinema-hero" aria-labelledby="power-board-title">
      <div class="hero-atmosphere" aria-hidden="true" :style="{ backgroundImage: `url('${HERO_ATMOSPHERE}')` }"></div>
      <div class="hero-veil" aria-hidden="true"></div>
      <div class="hero-ink-frame" aria-hidden="true"></div>

      <div class="hero-content">
        <p class="hero-super">天下势力盘 · SECT POWER BOARD</p>
        <h1 id="power-board-title" class="hero-title">
          <span class="hero-title-zh zh-display">天下势力盘</span>
          <span class="hero-title-en">Factions <span class="title-slash">/</span> 宗门势力</span>
        </h1>
        <p class="hero-deck">
          A living political constellation of the known world — sects, dynasties, academies and lineages
          arrayed across the great board, their seats, heads and alliances mapped as forces in motion.
        </p>

        <dl class="registry-plaque" aria-label="Registry of forces">
          <div class="plaque-cell plaque-cell--lead">
            <dt>Registered forces</dt>
            <dd class="plaque-number">{{ registryStats.total }}</dd>
          </div>
          <div class="plaque-cell">
            <dt>Primary powers</dt>
            <dd>{{ registryStats.primary }}</dd>
          </div>
          <div class="plaque-cell">
            <dt>Verified records</dt>
            <dd>{{ registryStats.verified }}</dd>
          </div>
          <div class="plaque-cell">
            <dt>Registered seats</dt>
            <dd>{{ registryStats.seats }}</dd>
          </div>
        </dl>
      </div>

      <div class="hero-scroll-cue" aria-hidden="true">
        <span>BOARD</span>
        <span class="cue-rule"></span>
      </div>
    </section>

    <main class="board-mass">
      <!-- ============================================== GREAT POWERS BOARD -->
      <section class="great-powers" aria-labelledby="great-powers-title">
        <header class="board-header">
          <p class="board-eyebrow">壹 · THE GREAT POWERS</p>
          <h2 id="great-powers-title" class="board-title zh-display">大势力盘</h2>
          <p class="board-blurb">
            The dominant forces of the world, anchored as political plates. Seats of authority radiate
            outward; lesser powers orbit the centre.
          </p>
        </header>

        <!-- central triad: the three highest-weight powers dominate -->
        <div class="triad-field">
          <div class="triad-trace" aria-hidden="true">
            <svg viewBox="0 0 1200 360" preserveAspectRatio="none" class="triad-svg">
              <path d="M 200 180 Q 600 60 1000 180" class="trace-path" />
              <path d="M 200 180 Q 600 300 1000 180" class="trace-path trace-path--alt" />
              <line x1="200" y1="180" x2="1000" y2="180" class="trace-axis" />
            </svg>
          </div>

          <article
            v-for="(power, i) in centreTriad"
            :key="power.path"
            class="power-plate"
            :class="[`plate-rank-${i + 1}`, power.importance ? `is-${power.importance}` : '']"
          >
            <div class="plate-seal zh-display">{{ sealGlyph(power) }}</div>
            <div class="plate-body">
              <p class="plate-rank">No. {{ String(i + 1).padStart(2, '0') }}</p>
              <h3 class="plate-title-zh zh-display">{{ power.chinese || power.title }}</h3>
              <p v-if="power.chinese" class="plate-title-en">{{ power.title }}</p>
              <div class="plate-meta">
                <span v-if="power.factionType || power.category" class="meta-tag">
                  {{ power.factionType || power.category }}
                </span>
                <span v-if="power.status" class="meta-tag meta-tag--ghost">{{ power.status }}</span>
              </div>
              <p v-if="power.description" class="plate-influence">{{ power.description }}</p>
              <dl class="plate-ledger">
                <div v-if="power.headquarters" class="ledger-row">
                  <dt>Seat</dt>
                  <dd>{{ power.headquartersLink?.label || power.headquarters }}</dd>
                </div>
                <div v-if="power.leaderLinks.length" class="ledger-row">
                  <dt>Head</dt>
                  <dd>{{ power.leaderLinks.map((l) => l.label).join(' · ') }}</dd>
                </div>
              </dl>
            </div>
          </article>
        </div>

        <!-- orbiting powers around the centre -->
        <div v-if="orbitPowers.length" class="orbit-field">
          <div class="orbit-thread" aria-hidden="true"></div>
          <article
            v-for="(power, i) in orbitPowers"
            :key="power.path"
            class="orbit-plate"
            :style="{ '--i': i, '--n': orbitPowers.length }"
          >
            <span class="orbit-seal zh-display">{{ sealGlyph(power) }}</span>
            <h4 class="orbit-title-zh zh-display">{{ power.chinese || power.title }}</h4>
            <p class="orbit-title-en">{{ power.title }}</p>
            <p v-if="power.factionType || power.category" class="orbit-type">
              {{ power.factionType || power.category }}
            </p>
          </article>
        </div>

        <!-- satellite plates (remaining primary powers) -->
        <div v-if="satellitePowers.length" class="satellite-band">
          <p class="satellite-label">SATELLITE SEATS</p>
          <div class="satellite-row">
            <div v-for="power in satellitePowers" :key="power.path" class="satellite-plate">
              <span class="satellite-seal zh-display">{{ sealGlyph(power) }}</span>
              <span class="satellite-name zh-display">{{ power.chinese || power.title }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================== ALLIANCE / RELATIONS WEB -->
      <section class="relations" aria-labelledby="relations-title">
        <header class="board-header board-header--alt">
          <p class="board-eyebrow">贰 · ALLIANCE WEB</p>
          <h2 id="relations-title" class="board-title zh-display">势力连络</h2>
          <p class="board-blurb">
            Leader ties, member ranks and character affiliations woven as political lanes — the loyalties
            that bind each power to its people.
          </p>
        </header>

        <div class="relation-lanes">
          <article
            v-for="(lane, i) in relationTop"
            :key="lane.faction.path"
            class="relation-lane"
            :style="{ '--lane-i': i }"
          >
            <div class="lane-head">
              <span class="lane-seal zh-display">{{ sealGlyph(lane.faction) }}</span>
              <div class="lane-head-text">
                <h3 class="lane-title zh-display">{{ lane.faction.chinese || lane.faction.title }}</h3>
                <p class="lane-sub">{{ lane.faction.title }}</p>
              </div>
              <span class="lane-count">{{ lane.total }}</span>
            </div>

            <div class="lane-web">
              <div v-if="lane.leaders.length" class="web-tie web-tie--leader">
                <span class="tie-label">HEADS</span>
                <div class="tie-roster">
                  <span v-for="link in lane.leaders" :key="link.path" class="tie-node tie-node--lead">
                    {{ link.label }}
                  </span>
                </div>
              </div>
              <div v-if="lane.members.length" class="web-tie web-tie--member">
                <span class="tie-label">RANKS</span>
                <div class="tie-roster">
                  <span v-for="link in lane.members.slice(0, 6)" :key="link.path" class="tie-node">
                    {{ link.label }}
                  </span>
                  <span v-if="lane.members.length > 6" class="tie-node tie-node--more">
                    +{{ lane.members.length - 6 }}
                  </span>
                </div>
              </div>
              <div v-if="lane.affiliated.length" class="web-tie web-tie--affil">
                <span class="tie-label">AFFILIATED</span>
                <div class="tie-roster">
                  <span v-for="link in lane.affiliated.slice(0, 5)" :key="link.path" class="tie-node tie-node--ghost">
                    {{ link.label }}
                  </span>
                  <span v-if="lane.affiliated.length > 5" class="tie-node tie-node--more">
                    +{{ lane.affiliated.length - 5 }}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- ===================================== MOUNTAIN GATE TERRITORIES -->
      <section class="territories" aria-labelledby="territories-title">
        <header class="board-header">
          <p class="board-eyebrow">叁 · MOUNTAIN GATE TERRITORIES</p>
          <h2 id="territories-title" class="board-title zh-display">山门疆域</h2>
          <p class="board-blurb">
            Seats of power registered as territory plates, grouped by their mountain-gate and heaven. Each
            plate is a registered domain, not a list entry.
          </p>
        </header>

        <div class="territory-grid">
          <article
            v-for="group in seatGroups"
            :key="group.raw"
            class="territory-plate"
            :class="{ 'is-unplaced': group.isUnplaced }"
          >
            <div class="territory-mark" aria-hidden="true">
              <span class="territory-count">{{ group.count }}</span>
            </div>
            <div class="territory-body">
              <h3 class="territory-name zh-display">{{ group.chinese || group.label }}</h3>
              <p class="territory-name-en">{{ group.label }}<span v-if="group.region"> · {{ group.region }}</span></p>
              <ul class="territory-seats">
                <li v-for="entry in group.entries" :key="entry.path" class="territory-seat">
                  <span class="seat-glyph zh-display">{{ sealGlyph(entry) }}</span>
                  <span class="seat-name">{{ entry.chinese || entry.title }}</span>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <!-- =============================================== COMPACT REGISTER -->
      <section class="compact-register" aria-labelledby="register-title">
        <header class="board-header board-header--alt">
          <p class="board-eyebrow">肆 · COMPACT REGISTER</p>
          <h2 id="register-title" class="board-title zh-display">总册</h2>
          <p class="board-blurb">
            The appendix — a dense, complete registry of every recorded force, ordered by standing.
          </p>
        </header>

        <ol class="register-table">
          <li
            v-for="(entry, i) in register"
            :key="entry.path"
            class="register-row"
            :class="[`is-${entry.importance || 'unranked'}`]"
          >
            <span class="reg-index">{{ String(i + 1).padStart(3, '0') }}</span>
            <span class="reg-seal zh-display">{{ sealGlyph(entry) }}</span>
            <div class="reg-name">
              <span class="reg-name-zh zh-display">{{ entry.chinese || entry.title }}</span>
              <span class="reg-name-en">{{ entry.title }}</span>
            </div>
            <span class="reg-type">{{ entry.factionType || entry.category || '—' }}</span>
            <span v-if="entry.headquarters" class="reg-seat">{{ entry.headquartersLink?.label || entry.headquarters }}</span>
            <span class="reg-rank">{{ entry.importance }}</span>
          </li>
        </ol>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* ===================================================================== */
/*  Concept A — Sect Power Board · dev prototype                         */
/*  Dark "war table" register: ink-black field, cinnabar authority,     */
/*  jade/celadon spatial accents, antique-gold ruling. NOT paper list.  */
/* ===================================================================== */

.power-board-page {
  /* a deliberately darker, cinematic field than production /factions */
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

.zh-display {
  font-family: var(--font-zh-display);
}

/* ----------------------------------------------------------------- HERO */
.cinema-hero {
  position: relative;
  min-height: clamp(520px, 86vh, 820px);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid var(--pb-line);
}

.hero-atmosphere {
  position: absolute;
  inset: -6% -4%;
  background-size: cover;
  background-position: center 32%;
  filter: saturate(0.82) contrast(1.06) brightness(0.74);
  z-index: -3;
  animation: hero-drift 38s ease-in-out infinite alternate;
}

@keyframes hero-drift {
  from { transform: scale(1.04) translate3d(-1.2%, 0, 0); }
  to   { transform: scale(1.1)  translate3d(1.2%, -1.4%, 0); }
}

.hero-veil {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(180deg, rgba(14, 13, 11, 0.55) 0%, rgba(14, 13, 11, 0.2) 38%, rgba(14, 13, 11, 0.92) 100%),
    linear-gradient(90deg, rgba(14, 13, 11, 0.86) 0%, transparent 42%);
}

.hero-ink-frame {
  position: absolute;
  inset: clamp(1rem, 2.4vw, 2rem);
  border: 1px solid var(--pb-line);
  pointer-events: none;
  z-index: -1;
}
.hero-ink-frame::before,
.hero-ink-frame::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1px solid var(--pb-gold);
}
.hero-ink-frame::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.hero-ink-frame::after  { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

.hero-content {
  position: relative;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(2rem, 6vw, 5.5rem) clamp(1.25rem, 4vw, 3rem) clamp(2.5rem, 5vw, 4rem);
}

.hero-super {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.34em;
  color: var(--pb-gold);
  margin: 0 0 1.1rem;
  text-transform: uppercase;
}

.hero-title {
  margin: 0 0 1.6rem;
  line-height: 0.95;
}
.hero-title-zh {
  display: block;
  font-size: clamp(3.4rem, 10vw, 7.6rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--pb-ink);
  text-shadow: 0 6px 40px rgba(0, 0, 0, 0.55);
  margin-bottom: 0.4rem;
}
.hero-title-en {
  display: block;
  font-family: var(--font-heading);
  font-size: clamp(1.1rem, 2.6vw, 1.9rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--pb-ink-wash);
  font-style: italic;
}
.title-slash { color: var(--pb-cinnabar); font-style: normal; padding: 0 0.2em; }

.hero-deck {
  max-width: 46ch;
  font-size: clamp(0.95rem, 1.4vw, 1.08rem);
  line-height: 1.65;
  color: var(--pb-ink-wash);
  margin: 0 0 2.4rem;
}

/* registry plaque — political registry, not a floating SaaS card */
.registry-plaque {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  max-width: 720px;
  margin: 0;
  padding: 0;
  background: linear-gradient(180deg, rgba(26, 23, 20, 0.82), rgba(21, 18, 14, 0.92));
  border: 1px solid var(--pb-line);
  border-left: 3px solid var(--pb-cinnabar);
}
.plaque-cell {
  flex: 1 1 140px;
  min-width: 130px;
  padding: 0.9rem 1.1rem;
  border-right: 1px solid var(--pb-line-soft);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.plaque-cell:last-child { border-right: 0; }
.plaque-cell dt {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--pb-ink-dim);
  order: 2;
}
.plaque-cell dd {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--pb-gold-bright);
  order: 1;
}
.plaque-cell--lead dd {
  font-size: 2.6rem;
  line-height: 1;
  color: var(--pb-ink);
}

.hero-scroll-cue {
  position: absolute;
  right: clamp(1.5rem, 3vw, 2.6rem);
  bottom: clamp(1.5rem, 3vw, 2.4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.3em;
  color: var(--pb-gold);
}
.cue-rule {
  width: 1px;
  height: 44px;
  background: linear-gradient(180deg, var(--pb-gold), transparent);
  animation: cue-pulse 2.4s ease-in-out infinite;
}
@keyframes cue-pulse {
  0%, 100% { opacity: 0.35; transform: scaleY(0.7); transform-origin: top; }
  50%      { opacity: 1;    transform: scaleY(1); }
}

/* ------------------------------------------------------------ BOARD MASS */
.board-mass {
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 4vw, 3rem) clamp(4rem, 8vw, 7rem);
}

.board-header {
  margin-bottom: clamp(2rem, 4vw, 3rem);
  max-width: 60ch;
}
.board-header--alt { margin-left: auto; margin-right: 0; text-align: right; }
.board-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.3em;
  color: var(--pb-cinnabar);
  margin: 0 0 0.8rem;
}
.board-title {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0 0 0.8rem;
  color: var(--pb-ink);
}
.board-blurb {
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--pb-ink-wash);
  margin: 0;
}

/* ----------------------------------------------- GREAT POWERS · TRIAD --- */
.triad-field {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(0.75rem, 1.6vw, 1.4rem);
  margin-bottom: clamp(2rem, 4vw, 3rem);
}

.triad-trace {
  position: absolute;
  inset: -8% -4%;
  pointer-events: none;
  z-index: 0;
}
.triad-svg { width: 100%; height: 100%; overflow: visible; }
.trace-path {
  fill: none;
  stroke: var(--pb-gold);
  stroke-width: 1;
  stroke-dasharray: 2 6;
  opacity: 0.4;
}
.trace-path--alt { stroke: var(--pb-jade); opacity: 0.3; }
.trace-axis {
  stroke: var(--pb-line-soft);
  stroke-width: 1;
}

.power-plate {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.2rem, 2vw, 1.8rem);
  background:
    linear-gradient(180deg, rgba(34, 29, 24, 0.96), rgba(21, 18, 14, 0.98));
  border: 1px solid var(--pb-line);
  min-height: 280px;
  animation: plate-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes plate-rise {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
.plate-rank-1 { animation-delay: 0.05s; }
.plate-rank-2 { animation-delay: 0.16s; }
.plate-rank-3 { animation-delay: 0.27s; }

.plate-seal {
  width: clamp(3.4rem, 5vw, 4.4rem);
  height: clamp(3.4rem, 5vw, 4.4rem);
  display: grid;
  place-items: center;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 700;
  color: var(--pb-ink);
  background:
    radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--pb-cinnabar) 86%, white 6%), var(--pb-cinnabar-deep));
  border: 2px solid color-mix(in srgb, var(--pb-gold) 60%, transparent);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 8px 30px rgba(0,0,0,0.45);
  letter-spacing: 0;
}
.plate-rank-1 .plate-seal { animation: seal-pulse 3.6s ease-in-out infinite; }
@keyframes seal-pulse {
  0%, 100% { box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 8px 30px rgba(0,0,0,0.45), 0 0 0 0 rgba(198,68,52,0); }
  50%      { box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 10px 36px rgba(0,0,0,0.5), 0 0 26px 2px rgba(198,68,52,0.28); }
}

.plate-rank {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.26em;
  color: var(--pb-gold);
  margin: 0;
}
.plate-title-zh {
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  margin: 0;
  color: var(--pb-ink);
  line-height: 1.05;
}
.plate-title-en {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 0.96rem;
  color: var(--pb-ink-wash);
  margin: 0.2rem 0 0;
}
.plate-meta { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.6rem 0 0; }
.meta-tag {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  color: var(--pb-gold-bright);
  border: 1px solid var(--pb-line);
}
.meta-tag--ghost { color: var(--pb-ink-dim); border-color: var(--pb-line-soft); }

.plate-influence {
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--pb-ink-wash);
  margin: 0.4rem 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.plate-ledger { margin: auto 0 0; display: flex; flex-direction: column; gap: 0.35rem; }
.ledger-row {
  display: flex;
  gap: 0.6rem;
  font-size: 0.78rem;
  padding-top: 0.35rem;
  border-top: 1px solid var(--pb-line-soft);
}
.ledger-row dt {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--pb-ink-dim);
  width: 3.4rem;
  flex-shrink: 0;
  padding-top: 0.05rem;
}
.ledger-row dd { margin: 0; color: var(--pb-ink); }

/* ------------------------------------------------------ ORBIT FIELD ----- */
.orbit-field {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: clamp(0.6rem, 1.4vw, 1.1rem);
  margin-bottom: clamp(2rem, 4vw, 3rem);
  padding: clamp(1.4rem, 3vw, 2.2rem);
  background:
    radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--pb-jade-deep) 40%, transparent), transparent 70%),
    rgba(21, 18, 14, 0.6);
  border: 1px solid var(--pb-line-soft);
}
.orbit-thread {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, var(--pb-line) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity: 0.4;
  mask-image: radial-gradient(80% 60% at 50% 40%, black, transparent 75%);
}
.orbit-plate {
  position: relative;
  z-index: 1;
  padding: 1rem 0.9rem;
  background: linear-gradient(180deg, rgba(34, 29, 24, 0.7), rgba(26, 23, 20, 0.85));
  border-top: 2px solid var(--pb-jade);
  text-align: left;
  animation: orbit-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i) * 70ms);
}
@keyframes orbit-rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.orbit-seal {
  display: inline-grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.2rem;
  color: var(--pb-ink);
  background: color-mix(in srgb, var(--pb-jade-deep) 70%, black);
  border: 1px solid var(--pb-line);
  margin-bottom: 0.5rem;
}
.orbit-title-zh {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.03em;
  color: var(--pb-ink);
}
.orbit-title-en {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 0.78rem;
  color: var(--pb-ink-wash);
  margin: 0.1rem 0 0;
}
.orbit-type {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--pb-gold);
  margin: 0.5rem 0 0;
}

/* ----------------------------------------------------- SATELLITE BAND -- */
.satellite-band {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 1.4rem;
  border: 1px solid var(--pb-line-soft);
  background: rgba(26, 23, 20, 0.4);
}
.satellite-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  color: var(--pb-ink-dim);
  margin: 0;
}
.satellite-row { display: flex; flex-wrap: wrap; gap: 0.6rem 1.2rem; }
.satellite-plate {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.satellite-seal {
  display: inline-grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  font-size: 1rem;
  color: var(--pb-gold-bright);
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--pb-line);
}
.satellite-name { font-size: 1.02rem; color: var(--pb-ink); letter-spacing: 0.03em; }

/* --------------------------------------------------------- RELATIONS ---- */
.relations { margin-top: clamp(4rem, 8vw, 7rem); }

.relation-lanes {
  display: grid;
  gap: clamp(0.8rem, 1.6vw, 1.4rem);
}
.relation-lane {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: clamp(1rem, 2vw, 1.8rem);
  padding: clamp(1.1rem, 2vw, 1.6rem);
  background: linear-gradient(90deg, rgba(34, 29, 24, 0.85), rgba(21, 18, 14, 0.7));
  border-left: 3px solid var(--pb-jade);
  animation: lane-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--lane-i) * 90ms);
}
@keyframes lane-rise {
  from { opacity: 0; transform: translateX(-14px); }
  to   { opacity: 1; transform: translateX(0); }
}

.lane-head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  border-right: 1px solid var(--pb-line-soft);
  padding-right: 1rem;
}
.lane-seal {
  display: inline-grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  flex-shrink: 0;
  font-size: 1.4rem;
  color: var(--pb-ink);
  background: color-mix(in srgb, var(--pb-cinnabar-deep) 80%, black);
  border: 1px solid var(--pb-line);
}
.lane-head-text { flex: 1; min-width: 0; }
.lane-title { font-size: 1.3rem; font-weight: 700; margin: 0; letter-spacing: 0.03em; color: var(--pb-ink); }
.lane-sub {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 0.76rem;
  color: var(--pb-ink-wash);
  margin: 0.1rem 0 0;
}
.lane-count {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--pb-gold-bright);
}

.lane-web { display: flex; flex-direction: column; gap: 0.8rem; min-width: 0; }
.web-tie { display: grid; grid-template-columns: 86px 1fr; gap: 0.8rem; align-items: start; }
.tie-label {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--pb-ink-dim);
  padding-top: 0.35rem;
}
.tie-roster { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.tie-node {
  font-size: 0.78rem;
  padding: 0.28rem 0.6rem;
  color: var(--pb-ink);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--pb-line-soft);
  line-height: 1.2;
}
.tie-node--lead {
  color: var(--pb-gold-bright);
  border-color: color-mix(in srgb, var(--pb-gold) 50%, transparent);
  background: color-mix(in srgb, var(--pb-gold) 8%, transparent);
}
.tie-node--ghost { color: var(--pb-ink-dim); border-style: dashed; }
.tie-node--more {
  color: var(--pb-ink-dim);
  background: transparent;
  border-style: dotted;
}

/* ----------------------------------------------------- TERRITORIES ----- */
.territories { margin-top: clamp(4rem, 8vw, 7rem); }

.territory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(0.8rem, 1.8vw, 1.4rem);
}
.territory-plate {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 1rem;
  padding: 1.2rem;
  background:
    linear-gradient(160deg, rgba(34, 29, 24, 0.85), rgba(21, 18, 14, 0.92));
  border: 1px solid var(--pb-line);
}
.territory-plate.is-unplaced { border-style: dashed; opacity: 0.7; }

.territory-mark {
  position: relative;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--pb-jade) 70%, black 20%), var(--pb-jade-deep));
  border: 1px solid var(--pb-line);
}
.territory-mark::after {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid color-mix(in srgb, var(--pb-gold) 40%, transparent);
}
.territory-count {
  position: relative;
  z-index: 1;
  font-family: var(--font-heading);
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--pb-ink);
}
.territory-name { font-size: 1.4rem; font-weight: 700; margin: 0; letter-spacing: 0.03em; color: var(--pb-ink); }
.territory-name-en {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 0.78rem;
  color: var(--pb-ink-wash);
  margin: 0.15rem 0 0.8rem;
}
.territory-seats { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.4rem; }
.territory-seat { display: flex; align-items: center; gap: 0.5rem; }
.seat-glyph {
  display: inline-grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.9rem;
  flex-shrink: 0;
  color: var(--pb-gold-bright);
  background: rgba(0,0,0,0.35);
  border: 1px solid var(--pb-line-soft);
}
.seat-name { font-size: 0.86rem; color: var(--pb-ink); line-height: 1.3; }

/* -------------------------------------------------- COMPACT REGISTER -- */
.compact-register { margin-top: clamp(4rem, 8vw, 7rem); }

.register-table {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--pb-line);
}
.register-row {
  display: grid;
  grid-template-columns: 44px 40px 1fr 160px 160px 90px;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 0.4rem;
  border-bottom: 1px solid var(--pb-line-soft);
  font-size: 0.84rem;
  transition: background 220ms ease;
}
.register-row:hover { background: rgba(201, 168, 90, 0.05); }
.reg-index {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--pb-ink-dim);
  letter-spacing: 0.1em;
}
.reg-seal {
  display: inline-grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  font-size: 1rem;
  color: var(--pb-gold-bright);
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--pb-line-soft);
}
.reg-name { display: flex; flex-direction: column; min-width: 0; }
.reg-name-zh { font-size: 1.02rem; color: var(--pb-ink); letter-spacing: 0.02em; }
.reg-name-en {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 0.74rem;
  color: var(--pb-ink-dim);
}
.reg-type, .reg-seat {
  font-size: 0.76rem;
  color: var(--pb-ink-wash);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.reg-rank {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-align: right;
  color: var(--pb-gold);
}
.register-row.is-primary .reg-rank { color: var(--pb-cinnabar); }
.register-row.is-major .reg-rank { color: var(--pb-gold-bright); }

/* ====================================================================== */
/*  RESPONSIVE                                                              */
/* ====================================================================== */
@media (max-width: 1024px) {
  .register-row { grid-template-columns: 36px 36px 1fr 90px; }
  .reg-seat { display: none; }
}

@media (max-width: 860px) {
  .triad-field { grid-template-columns: 1fr; }
  .relation-lane { grid-template-columns: 1fr; }
  .lane-head { border-right: 0; border-bottom: 1px solid var(--pb-line-soft); padding-right: 0; padding-bottom: 0.9rem; }
  .board-header--alt { text-align: left; margin-left: 0; }
  .hero-scroll-cue { display: none; }
}

@media (max-width: 640px) {
  .power-board-page { overflow-x: hidden; }
  .hero-title-zh { font-size: clamp(2.8rem, 16vw, 4.4rem); }
  .plaque-cell { flex: 1 1 50%; min-width: 0; }
  .plaque-cell:nth-child(odd) { border-right: 1px solid var(--pb-line-soft); }
  .registry-plaque { border-left-width: 3px; }
  .register-row {
    grid-template-columns: 30px 32px 1fr;
    gap: 0.5rem;
  }
  .reg-type, .reg-seat, .reg-rank { display: none; }
  .reg-name-zh { font-size: 1rem; }
  .orbit-field { grid-template-columns: repeat(2, 1fr); }
  .territory-plate { grid-template-columns: 52px 1fr; }
  .board-mass { padding-left: 1.1rem; padding-right: 1.1rem; }
}

/* ====================================================================== */
/*  REDUCED MOTION                                                          */
/* ====================================================================== */
@media (prefers-reduced-motion: reduce) {
  .hero-atmosphere { animation: none; }
  .cue-rule { animation: none; opacity: 0.6; }
  .plate-rank-1 .plate-seal { animation: none; }
  .power-plate,
  .orbit-plate,
  .relation-lane { animation: none; }
  .trace-path { stroke-dasharray: none; }
}
</style>
