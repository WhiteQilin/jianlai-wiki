<script setup lang="ts">
import { computed, ref, resolveComponent, watch } from 'vue'

type ArchiveEntry = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  importance?: string
  verificationStatus?: string
  seal?: string
  inboundCount: number
  relationshipCount: number
  relatedCount: number
}

const props = defineProps<{
  entries: ArchiveEntry[]
  categoryFilters: string[]
  importanceFilters: string[]
  existingPaths: string[]
}>()

const NuxtLinkComponent = resolveComponent('NuxtLink')

const activeCategory = ref('All')
const activeImportance = ref('All')

const existingPathSet = computed(() => new Set(props.existingPaths))

const canLink = (path: string) => existingPathSet.value.has(path)

const formatToken = (value?: string) => {
  if (!value) return 'Unmarked'
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

const normalize = (value?: string) => (value || '').trim().toLowerCase()

const matchesCategory = (entry: ArchiveEntry) =>
  activeCategory.value === 'All' || normalize(entry.category) === normalize(activeCategory.value)

const matchesImportance = (entry: ArchiveEntry) =>
  activeImportance.value === 'All' || normalize(entry.importance) === normalize(activeImportance.value)

const filteredEntries = computed(() => props.entries.filter((entry) => matchesCategory(entry) && matchesImportance(entry)))

const fallbackSeal = (entry: ArchiveEntry) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0)

watch(
  () => props.categoryFilters,
  (filters) => {
    if (!filters.includes(activeCategory.value)) activeCategory.value = 'All'
  },
)

watch(
  () => props.importanceFilters,
  (filters) => {
    if (!filters.includes(activeImportance.value)) activeImportance.value = 'All'
  },
)
</script>

<template>
  <section class="characters-archive" aria-labelledby="characters-archive-title">
    <div class="archive-heading">
      <div>
        <p class="archive-kicker">Archive</p>
        <h2 id="characters-archive-title">All Character Records</h2>
      </div>
      <span class="archive-count">{{ filteredEntries.length }} / {{ entries.length }}</span>
    </div>

    <div class="archive-controls" aria-label="Character archive filters">
      <div class="filter-group">
        <span class="filter-label">Category</span>
        <div class="filter-buttons">
          <button
            v-for="category in categoryFilters"
            :key="category"
            type="button"
            class="filter-button"
            :class="{ active: category === activeCategory }"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div class="filter-group">
        <span class="filter-label">Importance</span>
        <div class="filter-buttons">
          <button
            v-for="importance in importanceFilters"
            :key="importance"
            type="button"
            class="filter-button"
            :class="{ active: importance === activeImportance }"
            @click="activeImportance = importance"
          >
            {{ importance }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredEntries.length" class="archive-list">
      <component
        :is="canLink(entry.path) ? NuxtLinkComponent : 'article'"
        v-for="entry in filteredEntries"
        :key="entry.path"
        class="archive-row"
        :to="canLink(entry.path) ? entry.path : undefined"
      >
        <span class="archive-seal" aria-hidden="true">{{ fallbackSeal(entry) }}</span>
        <span class="archive-main">
          <span class="archive-title-line">
            <strong>{{ entry.title }}</strong>
            <small v-if="entry.chinese">{{ entry.chinese }}</small>
          </span>
          <span v-if="entry.description" class="archive-description">{{ entry.description }}</span>
        </span>
        <span class="archive-meta">
          <span>{{ entry.category || 'Uncategorized' }}</span>
          <span>{{ formatToken(entry.importance) }}</span>
          <span>{{ formatToken(entry.verificationStatus) }}</span>
        </span>
      </component>
    </div>

    <EmptyArchiveState v-else />
  </section>
</template>

<style scoped>
.characters-archive {
  margin-top: clamp(2.5rem, 6vw, 4.5rem);
}

.archive-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.archive-kicker {
  margin: 0 0 0.3rem;
  color: var(--c-seal-red);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  letter-spacing: 0;
}

.archive-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 2.7rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
}

.archive-count {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  white-space: nowrap;
}

.archive-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.filter-group {
  min-width: 0;
  padding: 0.9rem;
  background: color-mix(in srgb, var(--c-bg-soft) 72%, transparent);
  border: 1px solid var(--c-divider);
  border-radius: 8px;
}

.filter-label {
  display: block;
  margin-bottom: 0.6rem;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.72rem;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.filter-button {
  min-height: 2rem;
  padding: 0.36rem 0.7rem;
  color: var(--c-text-2);
  background: var(--c-bg);
  border: 1px solid var(--c-divider);
  border-radius: 5px;
  font: inherit;
  font-size: 0.86rem;
  line-height: 1.2;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.filter-button:hover {
  color: var(--c-ink);
  border-color: color-mix(in srgb, var(--c-seal-red) 28%, var(--c-border));
}

.filter-button.active {
  color: var(--c-bg);
  background: var(--c-ink);
  border-color: var(--c-ink);
}

.filter-button:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.archive-list {
  display: grid;
  gap: 0.55rem;
}

.archive-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(210px, 0.35fr);
  gap: 0.9rem;
  align-items: center;
  min-width: 0;
  padding: 0.85rem;
  color: inherit;
  text-decoration: none;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-bg) 92%, transparent), color-mix(in srgb, var(--c-bg-soft) 80%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
  border: 1px solid var(--c-divider);
  border-radius: 8px;
  transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease;
}

.archive-row:hover {
  transform: translateX(4px);
  border-color: color-mix(in srgb, var(--c-seal-red) 34%, var(--c-border));
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-bg) 84%, var(--c-seal-red-soft)), color-mix(in srgb, var(--c-bg-soft) 80%, transparent)),
    url('/images/textures/ink-wash-02.webp');
}

.archive-row:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.archive-seal {
  width: 2.7rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1.5px solid currentColor;
  border-radius: 4px;
  font-family: var(--font-zh-display);
  font-size: 1.2rem;
  line-height: 1;
}

.archive-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.archive-title-line {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.75rem;
  align-items: baseline;
  min-width: 0;
}

.archive-title-line strong {
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.18rem;
  font-weight: 500;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.archive-title-line small {
  color: var(--c-text-2);
  font-family: var(--font-zh-display);
  font-size: 1.2rem;
  line-height: 1;
  letter-spacing: 0;
}

.archive-description {
  color: var(--c-text-2);
  font-size: 0.88rem;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.archive-meta {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.35rem;
}

.archive-meta span {
  max-width: 100%;
  padding: 0.24rem 0.45rem;
  color: var(--c-text-3);
  background: color-mix(in srgb, var(--c-bg) 78%, transparent);
  border: 1px solid var(--c-divider);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

@media (max-width: 820px) {
  .archive-controls {
    grid-template-columns: 1fr;
  }

  .archive-row {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .archive-meta {
    grid-column: 2;
    justify-content: flex-start;
  }
}

@media (max-width: 560px) {
  .archive-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .archive-heading h2 {
    font-size: 2.15rem;
  }

  .archive-row {
    align-items: start;
    gap: 0.75rem;
    padding: 0.8rem;
  }

  .archive-meta {
    grid-column: 1 / -1;
  }

  .archive-row:hover {
    transform: none;
  }
}
</style>
