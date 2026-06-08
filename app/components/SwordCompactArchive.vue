<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type SwordArchiveEntry = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  importance?: string
  verificationStatus?: string
  seal?: string
}

const props = defineProps<{
  entries: SwordArchiveEntry[]
  categoryFilters: string[]
  existingPaths: string[]
}>()

const activeCategory = ref('All')

const existingPathSet = computed(() => new Set(props.existingPaths))

const normalize = (value?: string) => (value || '').trim().toLowerCase()

const filteredEntries = computed(() =>
  props.entries.filter((entry) => activeCategory.value === 'All' || normalize(entry.category) === normalize(activeCategory.value)),
)

const canOpen = (path: string) => existingPathSet.value.has(path)

const fallbackSeal = (entry: SwordArchiveEntry) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0)

const formatToken = (value?: string, fallback = 'Unmarked') => {
  if (!value) return fallback
  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

watch(
  () => props.categoryFilters,
  (filters) => {
    if (!filters.includes(activeCategory.value)) activeCategory.value = 'All'
  },
)
</script>

<template>
  <section class="compact-archive" aria-labelledby="sword-archive-title">
    <div class="archive-heading">
      <div>
        <p class="archive-kicker">Compact Archive</p>
        <h2 id="sword-archive-title">Recorded arts</h2>
      </div>
      <span class="archive-count">{{ filteredEntries.length }} / {{ entries.length }}</span>
    </div>

    <div class="category-rule" aria-label="Sword manual category filters">
      <JadeChip
        v-for="category in categoryFilters"
        :key="category"
        button
        :active="category === activeCategory"
        @click="activeCategory = category"
      >
        {{ category }}
      </JadeChip>
    </div>

    <div v-if="filteredEntries.length" class="archive-list" role="list">
      <LedgerRow
        v-for="entry in filteredEntries"
        :key="entry.path"
        :to="canOpen(entry.path) ? entry.path : undefined"
        class="archive-row"
        role="listitem"
        :aria-label="canOpen(entry.path) ? `Open ${entry.title}` : undefined"
      >
        <span class="row-seal">{{ fallbackSeal(entry) }}</span>

        <span class="row-main">
          <span class="row-title-line">
            <strong>{{ entry.title }}</strong>
            <small v-if="entry.chinese">{{ entry.chinese }}</small>
          </span>
          <span v-if="entry.description" class="row-description">{{ entry.description }}</span>
        </span>

        <span class="row-category">{{ entry.category || 'Swordsmanship' }}</span>

        <span class="row-meta">
          <span>{{ formatToken(entry.importance) }}</span>
          <span>{{ formatToken(entry.verificationStatus) }}</span>
        </span>
      </LedgerRow>
    </div>

    <div v-else class="archive-empty">
      <EmptyArchiveState />
    </div>
  </section>
</template>

<style scoped>
.compact-archive {
  margin-top: clamp(2.7rem, 6vw, 4.75rem);
}

.archive-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--c-divider);
}

.archive-kicker {
  margin: 0 0 0.32rem;
  color: var(--sword-celadon, var(--c-teal-accent));
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.35;
  letter-spacing: 0;
}

.archive-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
  text-wrap: balance;
}

.archive-count {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.35;
  white-space: nowrap;
}

.category-rule {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--c-divider);
  border-bottom: 1px solid var(--c-divider);
}

.archive-list {
  display: grid;
  gap: 0.45rem;
}

.archive-row {
  min-width: 0;
  grid-template-columns: auto minmax(0, 1fr) minmax(8rem, 0.18fr) minmax(10rem, 0.22fr);
  gap: 0.75rem;
  align-items: center;
  padding: 0.72rem 0.85rem;
}

.row-seal {
  width: 2.35rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 64%, transparent);
  border-radius: 3px;
  background: color-mix(in srgb, var(--c-bg) 72%, transparent);
  font-family: var(--font-zh-display);
  font-size: 1rem;
  line-height: 1;
}

.row-main {
  min-width: 0;
  display: grid;
  gap: 0.25rem;
}

.row-title-line {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0.65rem;
  align-items: baseline;
}

.row-title-line strong {
  min-width: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.12rem;
  font-weight: 500;
  line-height: 1.15;
  text-decoration: none;
  overflow-wrap: anywhere;
}

a.archive-row:hover .row-title-line strong {
  color: var(--c-seal-red);
}

.row-title-line small {
  color: var(--c-text-2);
  font-family: var(--font-zh-display);
  font-size: 1.08rem;
  line-height: 1.1;
  letter-spacing: 0;
}

.row-description {
  color: var(--c-text-2);
  font-size: 0.84rem;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.row-category,
.row-meta {
  min-width: 0;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.35;
}

.row-category {
  overflow-wrap: anywhere;
}

.row-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.3rem;
}

.row-meta span {
  max-width: 100%;
  padding: 0.2rem 0.4rem;
  border: 1px solid var(--c-divider);
  border-radius: 3px;
  background: color-mix(in srgb, var(--c-bg) 72%, transparent);
  overflow-wrap: anywhere;
}

.archive-empty {
  border: 1px dashed var(--c-divider);
  border-radius: 8px;
  background: color-mix(in srgb, var(--c-bg-soft) 54%, transparent);
}

@media (max-width: 900px) {
  .archive-row {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .row-category,
  .row-meta {
    grid-column: 2 / -1;
    justify-self: start;
    text-align: left;
  }

  .row-meta {
    justify-content: flex-start;
  }
}

@media (max-width: 560px) {
  .archive-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .archive-row {
    align-items: start;
    grid-template-columns: auto minmax(0, 1fr);
    padding: 0.75rem;
  }

  .row-category,
  .row-meta {
    grid-column: 2;
  }
}
</style>
