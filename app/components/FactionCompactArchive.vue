<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ResolvedEntryLink } from '~/utils/entryLinkResolver'

type FactionEntry = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  factionType?: string
  importance?: string
  verificationStatus?: string
  seal?: string
  headquartersLink?: ResolvedEntryLink | null
}

const props = defineProps<{
  entries: FactionEntry[]
  categoryFilters: string[]
  existingPaths: string[]
}>()

const activeCategory = ref('All')

const existingPathSet = computed(() => new Set(props.existingPaths))

const canOpen = (path: string) => existingPathSet.value.has(path)

const normalize = (value?: string) => (value || '').trim().toLowerCase()

const filteredEntries = computed(() =>
  props.entries.filter(
    (entry) => activeCategory.value === 'All' || normalize(entry.category || entry.factionType) === normalize(activeCategory.value),
  ),
)

const fallbackSeal = (entry: FactionEntry) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0)

const formatToken = (value?: string) => {
  if (!value) return 'Unmarked'
  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

// Tone helpers for importance / verification chips.
type Tone = 'section' | 'jade' | 'bronze' | 'ghost' | 'cinnabar'
function importanceChipTone(value?: string): Tone {
  switch ((value || '').trim().toLowerCase()) {
    case 'primary':
      return 'jade'
    case 'major':
      return 'section'
    default:
      return 'ghost'
  }
}

function verificationChipTone(value?: string): Tone {
  switch ((value || '').trim().toLowerCase()) {
    case 'verified':
      return 'jade'
    case 'disputed':
      return 'cinnabar'
    case 'speculative':
      return 'bronze'
    default:
      return 'ghost'
  }
}

watch(
  () => props.categoryFilters,
  (filters) => {
    if (!filters.includes(activeCategory.value)) activeCategory.value = 'All'
  },
)
</script>

<template>
  <section class="compact-archive" aria-labelledby="compact-archive-title">
    <div class="archive-heading">
      <UiBrushTitle as="h2" kicker="Compact Archive" class="archive-title">
        All registered institutions
      </UiBrushTitle>
      <span class="archive-count">{{ filteredEntries.length }} / {{ entries.length }}</span>
    </div>

    <div class="category-rule" aria-label="Faction category filters">
      <UiLedgerTab
        v-for="category in categoryFilters"
        :key="category"
        :active="category === activeCategory"
        :tone="category === activeCategory ? 'jade' : 'section'"
        variant="compact"
        @click="activeCategory = category"
      >
        {{ category }}
      </UiLedgerTab>
    </div>

    <div v-if="filteredEntries.length" class="archive-table" role="list">
      <article
        v-for="entry in filteredEntries"
        :key="entry.path"
        class="archive-row"
        role="listitem"
      >
        <NuxtLink v-if="canOpen(entry.path)" :to="entry.path" class="row-seal-link" :aria-label="entry.title">
          <UiSealStamp :text="fallbackSeal(entry)" variant="outline" size="xs" writing="horizontal" :decorative="true" />
        </NuxtLink>
        <UiSealStamp v-else :text="fallbackSeal(entry)" variant="ghost" size="xs" writing="horizontal" :decorative="true" class="row-seal" />

        <span class="row-main">
          <span class="row-title-line">
            <NuxtLink v-if="canOpen(entry.path)" :to="entry.path">{{ entry.title }}</NuxtLink>
            <strong v-else>{{ entry.title }}</strong>
            <small v-if="entry.chinese">{{ entry.chinese }}</small>
          </span>
          <span v-if="entry.description" class="row-description">{{ entry.description }}</span>
        </span>

        <UiCinnabarTag tone="ghost" size="sm" class="row-category-tag">{{ entry.category || entry.factionType || 'Faction' }}</UiCinnabarTag>

        <span class="row-meta">
          <UiCinnabarTag :tone="importanceChipTone(entry.importance)" size="sm">{{ formatToken(entry.importance) }}</UiCinnabarTag>
          <UiCinnabarTag :tone="verificationChipTone(entry.verificationStatus)" size="sm">{{ formatToken(entry.verificationStatus) }}</UiCinnabarTag>
        </span>

        <span class="row-seat">
          <RouteDisplayLink
            v-if="entry.headquartersLink"
            :item="entry.headquartersLink"
            variant="text"
          />
          <span v-else>Unplaced</span>
        </span>
      </article>
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

.archive-title {
  max-width: none;
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

.archive-table {
  display: grid;
  gap: 0.45rem;
}

.archive-row {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(7rem, 0.15fr) minmax(10rem, 0.2fr) minmax(12rem, 0.25fr);
  gap: 0.75rem;
  align-items: center;
  padding: 0.72rem 0.85rem;
  color: inherit;
  border: 1px solid var(--c-divider);
  border-left: 2px solid color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 46%, transparent);
  border-radius: 6px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-paper-alt) 66%, transparent), color-mix(in srgb, var(--c-bg-soft) 78%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
}

.row-seal-link {
  display: grid;
  place-items: center;
  text-decoration: none;
  transition: transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.row-seal-link:hover {
  transform: translateY(-1px);
}

.row-seal-link:focus-visible,
.row-title-line a:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.row-seal {
  display: grid;
  place-items: center;
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

.row-title-line a,
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

.row-title-line a:hover {
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

.row-category-tag {
  overflow-wrap: anywhere;
}

.row-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.3rem;
}

.row-seat {
  min-width: 0;
  justify-self: end;
  text-align: right;
  overflow-wrap: anywhere;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.35;
}

.archive-empty {
  border: 1px dashed var(--c-divider);
  border-radius: 8px;
  background: color-mix(in srgb, var(--c-bg-soft) 54%, transparent);
}

@media (max-width: 980px) {
  .archive-row {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .row-category,
  .row-meta,
  .row-seat {
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
  .row-meta,
  .row-seat {
    grid-column: 2;
  }
}
</style>
