<script setup lang="ts">
import { computed, ref, resolveComponent, watch } from 'vue'

type GazetteerEntry = {
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

const props = defineProps<{
  entries: GazetteerEntry[]
  categoryFilters: string[]
  existingPaths: string[]
}>()

const NuxtLinkComponent = resolveComponent('NuxtLink')
const activeCategory = ref('All')

const existingPathSet = computed(() => new Set(props.existingPaths))

const canLink = (path: string) => existingPathSet.value.has(path)

const normalize = (value?: string) => (value || '').trim().toLowerCase()

const filteredEntries = computed(() =>
  props.entries.filter(
    (entry) => activeCategory.value === 'All' || normalize(entry.category) === normalize(activeCategory.value),
  ),
)

const fallbackSeal = (entry: GazetteerEntry) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0)

const formatToken = (value?: string) => {
  if (!value) return 'Unmarked'
  return value
    .split('-')
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
  <section class="gazetteer-archive" aria-labelledby="gazetteer-archive-title">
    <div class="archive-heading">
      <div>
        <p class="archive-kicker">Gazetteer Archive</p>
        <h2 id="gazetteer-archive-title">Mountain-River Records</h2>
      </div>
      <span class="archive-count">{{ filteredEntries.length }} / {{ entries.length }}</span>
    </div>

    <div class="category-rule" aria-label="Gazetteer category filters">
      <button
        v-for="category in categoryFilters"
        :key="category"
        type="button"
        class="category-tab"
        :class="{ active: category === activeCategory }"
        @click="activeCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div v-if="filteredEntries.length" class="archive-table" role="list">
      <component
        :is="canLink(entry.path) ? NuxtLinkComponent : 'article'"
        v-for="entry in filteredEntries"
        :key="entry.path"
        class="archive-row"
        role="listitem"
        :to="canLink(entry.path) ? entry.path : undefined"
      >
        <span class="row-seal" aria-hidden="true">{{ fallbackSeal(entry) }}</span>

        <span class="row-main">
          <span class="row-title-line">
            <strong>{{ entry.title }}</strong>
            <small v-if="entry.chinese">{{ entry.chinese }}</small>
          </span>
          <span v-if="entry.description" class="row-description">{{ entry.description }}</span>
        </span>

        <span class="row-category">{{ entry.category || 'World' }}</span>
        <span class="row-meta">
          <span>{{ formatToken(entry.importance) }}</span>
          <span>{{ formatToken(entry.verificationStatus) }}</span>
        </span>
        <span class="row-cue">Open</span>
      </component>
    </div>

    <EmptyArchiveState v-else />
  </section>
</template>

<style scoped>
.gazetteer-archive {
  margin-top: clamp(2.5rem, 6vw, 4.5rem);
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
  color: var(--world-pine, var(--c-teal-accent));
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

.category-tab {
  min-height: 2rem;
  padding: 0.35rem 0.65rem;
  color: var(--c-text-2);
  background: color-mix(in srgb, var(--c-bg) 72%, transparent);
  border: 1px solid var(--c-divider);
  border-radius: 4px;
  font: inherit;
  font-size: 0.82rem;
  line-height: 1.2;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.category-tab:hover {
  color: var(--c-ink);
  border-color: color-mix(in srgb, var(--world-pine, var(--c-teal-accent)) 36%, var(--c-border));
}

.category-tab.active {
  color: var(--c-bg);
  background: var(--world-pine, var(--c-ink));
  border-color: var(--world-pine, var(--c-ink));
}

.category-tab:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.archive-table {
  display: grid;
  gap: 0.45rem;
}

.archive-row {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(8rem, 0.18fr) minmax(12rem, 0.28fr) auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.72rem 0.85rem;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--c-divider);
  border-left: 2px solid color-mix(in srgb, var(--world-pine, var(--c-teal-accent)) 46%, transparent);
  border-radius: 6px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-paper-alt) 66%, transparent), color-mix(in srgb, var(--c-bg-soft) 78%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

a.archive-row:hover {
  transform: translateX(4px);
  border-color: color-mix(in srgb, var(--world-pine, var(--c-teal-accent)) 36%, var(--c-border));
  border-left-color: var(--c-seal-red);
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-paper-alt) 80%, transparent), color-mix(in srgb, var(--world-pine-soft, var(--c-bronze-soft)) 54%, var(--c-bg-soft))),
    url('/images/textures/ink-wash-02.webp');
}

.archive-row:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
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
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.12rem;
  font-weight: 500;
  line-height: 1.15;
  overflow-wrap: anywhere;
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
.row-meta,
.row-cue {
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

.row-cue {
  color: var(--world-pine, var(--c-teal-accent));
  white-space: nowrap;
}

article.archive-row .row-cue {
  display: none;
}

@media (max-width: 900px) {
  .archive-row {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .row-category {
    grid-column: 2;
  }

  .row-meta {
    grid-column: 2 / -1;
    justify-content: flex-start;
  }

  .row-cue {
    grid-column: 3;
    grid-row: 1;
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
  .row-meta,
  .row-cue {
    grid-column: 2;
  }

  .row-cue {
    grid-row: auto;
  }

  a.archive-row:hover {
    transform: none;
  }
}
</style>
