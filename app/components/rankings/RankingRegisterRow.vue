<script setup lang="ts">
export type RankingEntry = {
  rank?: string | number
  name: string
  link?: string
  note?: string
}

const props = defineProps<{
  entry: RankingEntry
  category: string
  listType: string
  index: number
}>()

function hasLink(entry: RankingEntry): boolean {
  return Boolean(entry.link && entry.link.trim() !== '')
}

function hasNote(entry: RankingEntry): boolean {
  return Boolean(entry.note && entry.note.trim() !== '')
}

const isRealmLadder = computed(() => props.category === 'Realm-Ladder')
const isTierList = computed(() => props.category === 'Tier-List')

const rankTier = computed(() => {
  if (!isTierList.value) return null
  const r = String(props.entry.rank || '').toLowerCase()
  if (r.includes('ss') || r === 'ss') return 'tier-ss'
  if (r.includes('s') && !r.includes('ss')) return 'tier-s'
  if (r === 'a') return 'tier-a'
  if (r === 'b') return 'tier-b'
  if (r === 'c') return 'tier-c'
  if (r === 'd') return 'tier-d'
  if (r === 'f') return 'tier-f'
  return 'tier-default'
})

const isOdd = computed(() => props.index % 2 === 1)

const rankRaw = computed(() => props.entry.rank)
const rankStr = computed(() => String(rankRaw.value ?? '').trim())

const isNumericRank = computed(() => {
  const r = rankStr.value
  return r.length > 0 && !isNaN(Number(r)) && r.match(/^\d+$/)
})

const isTied = computed(() => {
  return false
})

const editorialStatus = computed(() => {
  const raw = rankStr.value.toLowerCase()
  if (raw === 'unranked') {
    return { label: 'Member', tone: 'ghost' as const, glyph: '\u25C6' }
  }
  if (raw === 'listed / candidate' || raw === 'candidate' || raw === 'listed') {
    return { label: 'Awaiting Confirmation', tone: 'bronze' as const, glyph: '\u2014' }
  }
  if (raw.startsWith('removed')) {
    const match = raw.match(/removed\s*\(?\s*former\s*(\d+)/i)
    const num = match ? match[1] : null
    if (num) {
      return {
        label: `Former ${num}${ordinalSuffix(Number(num))} \u2014 Struck from Record`,
        tone: 'cinnabar' as const,
        glyph: '\u2425',
      }
    }
    return { label: 'Struck from Record', tone: 'cinnabar' as const, glyph: '\u2425' }
  }
  return null
})

function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return (s[(v - 20) % 10] || s[v] || s[0]) as string
}

const displayRank = computed(() => {
  if (editorialStatus.value) return null
  const r = rankStr.value
  if (!r) return null
  if (isNumericRank.value) return r
  return r
})

const rankMark = computed(() => {
  if (displayRank.value && isNumericRank.value) {
    return displayRank.value
  }
  return null
})

const rankVariant = computed(() => {
  if (editorialStatus.value) return editorialStatus.value.tone
  if (displayRank.value) return 'ranked'
  return 'unmarked'
})
</script>

<template>
  <li
    class="register-row"
    :class="[
      { 'is-odd': isOdd },
      { 'has-note': hasNote(entry) },
      { 'no-link': !hasLink(entry) },
      `variant-${rankVariant}`
    ]"
  >
    <div class="row-rank-cell" aria-label="Rank">
      <template v-if="rankMark && isNumericRank">
        <span class="rank-numeral" aria-hidden="true">{{ rankMark }}</span>
      </template>
      <template v-else-if="rankVariant === 'ghost'">
        <span class="rank-glyph member-glyph" aria-hidden="true">{{ editorialStatus!.glyph }}</span>
        <UiCinnabarTag tone="ghost" size="sm" class="status-tag">{{ editorialStatus!.label }}</UiCinnabarTag>
      </template>
      <template v-else-if="rankVariant === 'bronze'">
        <span class="rank-glyph candidate-glyph" aria-hidden="true">{{ editorialStatus!.glyph }}</span>
        <UiCinnabarTag tone="bronze" size="sm" class="status-tag">{{ editorialStatus!.label }}</UiCinnabarTag>
      </template>
      <template v-else-if="rankVariant === 'cinnabar'">
        <span class="rank-glyph removed-glyph" aria-hidden="true">{{ editorialStatus!.glyph }}</span>
        <UiCinnabarTag tone="cinnabar" size="sm" class="status-tag">{{ editorialStatus!.label }}</UiCinnabarTag>
      </template>
      <template v-else>
        <span class="rank-glyph unmarked-glyph" aria-hidden="true">&#8212;</span>
      </template>
    </div>

    <div class="row-content">
      <div class="row-name-line">
        <template v-if="hasLink(entry)">
          <NuxtLink :to="entry.link!" class="row-name is-linked">
            {{ entry.name }}
          </NuxtLink>
        </template>
        <template v-else>
          <span class="row-name is-plain">{{ entry.name }}</span>
        </template>
        <template v-if="hasNote(entry)">
          <span class="row-annotation">&#8212; {{ entry.note }}</span>
        </template>
      </div>
    </div>
  </li>
</template>

<style scoped>
.register-row {
  display: grid;
  grid-template-columns: auto 1fr;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.24)) 48%, transparent);
  background: color-mix(in srgb, var(--rankings-paper, #f6ecd8) 88%, transparent);
  transition: background-color 0.2s ease;
}

.register-row:last-child {
  border-bottom: none;
}

.register-row.is-odd {
  background: color-mix(in srgb, var(--rankings-paper, #f6ecd8) 68%, transparent);
}

.register-row:hover {
  background: color-mix(in srgb, var(--rankings-mist, #e8dfcc) 36%, var(--rankings-paper, #f6ecd8));
}

.register-row.variant-cinnabar {
  background: color-mix(in srgb, var(--rankings-paper, #f6ecd8) 72%, transparent);
}

.register-row.variant-cinnabar.is-odd {
  background: color-mix(in srgb, var(--rankings-paper, #f6ecd8) 56%, transparent);
}

.register-row.variant-cinnabar .row-name,
.register-row.variant-cinnabar .row-annotation {
  text-decoration: line-through;
  text-decoration-color: color-mix(in srgb, var(--rankings-seal, #aa352d) 42%, transparent);
  opacity: 0.72;
}

.register-row.variant-bronze .row-name {
  font-style: italic;
  color: color-mix(in srgb, var(--rankings-ink, #332c22) 72%, transparent);
}

.register-row.variant-bronze .row-annotation {
  font-style: italic;
}

.row-rank-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.32rem;
  min-width: 6.4rem;
  max-width: 6.6rem;
  padding: 0.82rem 0.55rem 0.82rem 0.9rem;
  border-right: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.24)) 38%, transparent);
  background: color-mix(in srgb, var(--rankings-paper, #f6ecd8) 48%, transparent);
}

.rank-numeral {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  color: var(--rankings-seal, #aa352d);
  border: 1px solid color-mix(in srgb, var(--rankings-seal, #aa352d) 28%, transparent);
  background: color-mix(in srgb, var(--rankings-seal, #aa352d) 8%, transparent);
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1;
  text-align: center;
}

.rank-glyph {
  display: block;
  font-size: 0.66rem;
  line-height: 1;
  letter-spacing: 0.06em;
  text-align: center;
}

.member-glyph {
  color: color-mix(in srgb, var(--rankings-seal, #aa352d) 52%, transparent);
}

.candidate-glyph {
  color: color-mix(in srgb, var(--rankings-accent, #8a7448) 64%, transparent);
}

.removed-glyph {
  color: color-mix(in srgb, var(--rankings-seal, #aa352d) 64%, transparent);
}

.unmarked-glyph {
  color: color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.28)) 48%, transparent);
}

.status-tag {
  text-align: center;
  text-transform: none;
  letter-spacing: 0.02em;
  line-height: 1.2;
  max-width: 4.6rem;
  white-space: normal;
  word-break: break-word;
  hyphens: auto;
}

.row-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 0.82rem 1rem;
}

.row-name-line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem;
  min-width: 0;
}

.row-name {
  min-width: 0;
  font-family: var(--font-heading);
  font-size: 1.02rem;
  line-height: 1.4;
  text-wrap: balance;
  overflow-wrap: break-word;
  word-break: break-word;
}

.row-name.is-linked {
  color: color-mix(in srgb, var(--rankings-ink, #332c22) 92%, transparent);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 52%, transparent);
  transition:
    color 0.2s ease,
    border-bottom-color 0.2s ease;
}

.row-name.is-linked:hover,
.row-name.is-linked:focus-visible {
  color: var(--rankings-seal, #aa352d);
  border-bottom-color: color-mix(in srgb, var(--rankings-seal, #aa352d) 52%, transparent);
  outline: none;
}

.row-name.is-plain {
  color: color-mix(in srgb, var(--rankings-ink, #332c22) 88%, transparent);
}

.row-annotation {
  min-width: 0;
  color: color-mix(in srgb, var(--rankings-ink, #332c22) 58%, transparent);
  font-size: 0.9rem;
  line-height: 1.5;
  text-wrap: pretty;
  overflow-wrap: break-word;
  word-break: break-word;
}

@media (max-width: 620px) {
  .row-rank-cell {
    min-width: 5.6rem;
    max-width: 5.8rem;
    padding: 0.72rem 0.4rem 0.72rem 0.7rem;
    gap: 0.28rem;
  }

  .rank-numeral {
    width: 1.7rem;
    height: 1.7rem;
    font-size: 0.8rem;
  }

  .status-tag {
    font-size: 0.55rem;
    padding: 0.1rem 0.32rem 0.12rem;
    max-width: 4.2rem;
  }
}

@media (max-width: 390px) {
  .row-rank-cell {
    min-width: 4.8rem;
    max-width: 5rem;
    padding: 0.6rem 0.3rem 0.6rem 0.55rem;
  }

  .rank-numeral {
    width: 1.55rem;
    height: 1.55rem;
    font-size: 0.74rem;
  }

  .rank-glyph {
    font-size: 0.6rem;
  }

  .status-tag {
    font-size: 0.5rem;
    padding: 0.08rem 0.26rem 0.1rem;
    max-width: 3.8rem;
    letter-spacing: 0.01em;
  }

  .row-content {
    padding: 0.6rem 0.6rem 0.55rem;
  }

  .row-name {
    font-size: 0.92rem;
  }

  .row-annotation {
    font-size: 0.82rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .register-row {
    transition: none;
  }

  .row-name.is-linked {
    transition: none;
  }

  .register-row:hover {
    background: color-mix(in srgb, var(--rankings-paper, #f6ecd8) 88%, transparent);
  }

  .register-row.is-odd:hover {
    background: color-mix(in srgb, var(--rankings-paper, #f6ecd8) 68%, transparent);
  }
}
</style>
