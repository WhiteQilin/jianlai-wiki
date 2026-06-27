<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { sealGlyph, verificationGlyph, type FactionSummary } from './types'

/**
 * Compact Faction Register — appendix table with category filter.
 * Migrates the activeCategory / filteredEntries pattern from the old
 * FactionCompactArchive component.
 */
const props = defineProps<{
  entries: FactionSummary[]
  categoryFilters: string[]
  existingPaths: string[]
}>()

const activeCategory = ref('All')

const canOpen = (path: string) => props.existingPaths.includes(path)

const normalize = (value?: string) => (value || '').trim().toLowerCase()

const filteredEntries = computed(() =>
  props.entries.filter(
    (entry) =>
      activeCategory.value === 'All' ||
      normalize(entry.category || entry.factionType) === normalize(activeCategory.value),
  ),
)

const categoryCounts = computed(() => {
  const counts = new Map<string, number>()
  for (const entry of props.entries) {
    const cat = normalize(entry.category || entry.factionType)
    if (cat) counts.set(cat, (counts.get(cat) ?? 0) + 1)
  }
  return counts
})

watch(
  () => props.categoryFilters,
  (filters) => {
    if (!filters.includes(activeCategory.value)) activeCategory.value = 'All'
  },
)
</script>

<template>
  <section class="compact-register" aria-labelledby="register-title">
    <header class="board-header board-header--alt">
      <p class="board-eyebrow">肆 · COMPACT REGISTER</p>
      <h2 id="register-title" class="board-title zh-display">总册</h2>
      <p class="board-blurb">
        The appendix — a dense, complete registry of every recorded force, ordered by standing.
        Filter by category below.
      </p>
    </header>

    <!-- category filter rail -->
    <nav class="filter-rail" aria-label="Filter by category">
      <button
        v-for="cat in categoryFilters"
        :key="cat"
        class="filter-chip"
        :class="{ 'is-active': activeCategory === cat }"
        @click="activeCategory = cat"
      >
        <span class="filter-label">{{ cat }}</span>
        <span v-if="cat === 'All'" class="filter-count">{{ entries.length }}</span>
        <span v-else class="filter-count">{{ categoryCounts.get(normalize(cat)) ?? 0 }}</span>
      </button>
    </nav>

    <ol class="register-table">
      <li
        v-for="(entry, i) in filteredEntries"
        :key="entry.path"
        class="register-row"
        :class="[`is-${entry.importance || 'unranked'}`]"
      >
        <span class="reg-index">{{ String(i + 1).padStart(3, '0') }}</span>
        <span class="reg-seal zh-display">{{ sealGlyph(entry) }}</span>
        <div class="reg-name">
          <NuxtLink
            v-if="canOpen(entry.path)"
            :to="entry.path"
            class="reg-name-zh zh-display"
          >{{ entry.chinese || entry.title }}</NuxtLink>
          <span v-else class="reg-name-zh zh-display">{{ entry.chinese || entry.title }}</span>
          <span class="reg-name-en">{{ entry.title }}</span>
        </div>
        <span class="reg-type">{{ entry.factionType || entry.category || '—' }}</span>
        <span v-if="entry.headquarters" class="reg-seat">{{ entry.headquartersLink?.label || entry.headquarters }}</span>
        <span class="reg-rank">{{ entry.importance }}</span>
        <span
          class="reg-verify"
          :class="`verify-${verificationGlyph(entry.verificationStatus).tone}`"
          :title="verificationGlyph(entry.verificationStatus).label"
          :aria-label="verificationGlyph(entry.verificationStatus).label"
        >{{ verificationGlyph(entry.verificationStatus).char }}</span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.compact-register { width: 100%; margin-top: clamp(4rem, 8vw, 7rem); }

.board-header { margin-bottom: clamp(2rem, 4vw, 3rem); max-width: 60ch; }
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
.board-blurb { font-size: 0.98rem; line-height: 1.7; color: var(--pb-ink-wash); margin: 0; }

/* ----------------------------------------------------- FILTER RAIL ----- */
.filter-rail {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
}
.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.32rem 0.7rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--pb-ink-dim);
  background: transparent;
  border: 1px solid var(--pb-line-soft);
  cursor: pointer;
  transition: color 0.22s ease, border-color 0.22s ease, background 0.22s ease;
}
.filter-chip:hover {
  color: var(--pb-gold-bright);
  border-color: var(--pb-line);
}
.filter-chip.is-active {
  color: var(--pb-ink);
  border-color: var(--pb-cinnabar);
  background: color-mix(in srgb, var(--pb-cinnabar) 10%, transparent);
}
.filter-chip:focus-visible { outline: 2px solid var(--pb-cinnabar); outline-offset: 3px; }
.filter-count {
  font-size: 0.58rem;
  color: var(--pb-gold);
}

/* ----------------------------------------------------- REGISTER TABLE -- */
.register-table {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--pb-line);
}
.register-row {
  display: grid;
  grid-template-columns: 44px 40px 1fr 160px 160px 80px 28px;
  align-items: center;
  gap: 0.6rem;
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
.reg-name-zh {
  font-size: 1.02rem;
  color: var(--pb-ink);
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: color 0.24s ease;
}
.reg-name-zh:hover { color: var(--pb-cinnabar); }
.reg-name-zh:focus-visible { outline: 2px solid var(--pb-cinnabar); outline-offset: 3px; }
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
.reg-verify {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-align: center;
}
.reg-verify.verify-verified { color: var(--pb-jade); }
.reg-verify.verify-disputed { color: var(--pb-cinnabar); }
.reg-verify.verify-speculative { color: var(--pb-gold-bright); }
.reg-verify.verify-unknown { color: var(--pb-ink-dim); }

@media (max-width: 1024px) {
  .register-row { grid-template-columns: 36px 36px 1fr 90px 28px; }
  .reg-seat { display: none; }
}
@media (max-width: 860px) {
  .board-header--alt { text-align: left; margin-left: 0; }
}
@media (max-width: 640px) {
  .register-row { grid-template-columns: 30px 32px 1fr 24px; gap: 0.5rem; }
  .reg-type, .reg-seat, .reg-rank { display: none; }
  .reg-name-zh { font-size: 1rem; }
}
</style>
