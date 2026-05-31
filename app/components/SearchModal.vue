<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import {
  searchEntries,
  groupResultsBySection,
  type SearchResult,
} from '~/utils/searchEntries'

const { isOpen, close } = useSearchState()
const { entries } = await useSearch()

const query = ref('')
const activeIndex = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

// Display labels per section (English + Chinese), matching the nav vocabulary.
const SECTION_LABELS: Record<string, { en: string; zh: string }> = {
  characters: { en: 'Characters', zh: '人物' },
  world: { en: 'World', zh: '天下' },
  cultivation: { en: 'Cultivation', zh: '修行' },
  swordsmanship: { en: 'Swordsmanship', zh: '剑术' },
  factions: { en: 'Factions', zh: '势力' },
  artifacts: { en: 'Artifacts', zh: '法宝' },
  timeline: { en: 'Timeline', zh: '年表' },
  glossary: { en: 'Glossary', zh: '术语' },
  rankings: { en: 'Rankings', zh: '榜单' },
  teachings: { en: 'Teachings', zh: '三教' },
  pantheon: { en: 'Pantheon', zh: '神灵' },
}

const sectionLabel = (section: string) =>
  SECTION_LABELS[section] || { en: section, zh: '' }

const results = computed<SearchResult[]>(() =>
  searchEntries(entries.value, query.value),
)

const groups = computed(() => groupResultsBySection(results.value))

// Flat ordered list mirrors visual order, for keyboard navigation.
const flatResults = computed<SearchResult[]>(() =>
  groups.value.flatMap((g) => g.results),
)

const hasQuery = computed(() => query.value.trim().length > 0)

watch(results, () => {
  activeIndex.value = 0
})

function move(delta: number) {
  const len = flatResults.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value + delta + len) % len
}

function go(result: SearchResult | undefined) {
  if (!result) return
  close()
  navigateTo(result.path)
}

function onModalKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    move(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    move(-1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    go(flatResults.value[activeIndex.value])
  }
}

// Reset + focus on open; lock body scroll while open.
watch(isOpen, async (open) => {
  if (open) {
    query.value = ''
    activeIndex.value = 0
    if (import.meta.client) document.body.style.overflow = 'hidden'
    await nextTick()
    inputEl.value?.focus()
  } else if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div
        v-if="isOpen"
        class="search-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Search the archive"
        @click.self="close"
        @keydown="onModalKeydown"
      >
        <div class="search-panel">
          <div class="search-input-row">
            <span class="search-input-icon" aria-hidden="true">🔍</span>
            <input
              ref="inputEl"
              v-model="query"
              type="text"
              class="search-input"
              placeholder="Search characters, realms, lore..."
              autocomplete="off"
              spellcheck="false"
              aria-label="Search query"
            />
            <button type="button" class="search-close" aria-label="Close search" @click="close">
              ESC
            </button>
          </div>

          <div class="search-results">
            <template v-if="hasQuery && flatResults.length">
              <div v-for="group in groups" :key="group.section" class="search-group">
                <div class="search-group-heading">
                  <span class="group-zh">{{ sectionLabel(group.section).zh }}</span>
                  <span class="group-en">{{ sectionLabel(group.section).en }}</span>
                </div>
                <NuxtLink
                  v-for="result in group.results"
                  :key="result.path"
                  :to="result.path"
                  class="search-result"
                  :class="{ 'is-active': flatResults[activeIndex]?.path === result.path }"
                  @click="close"
                  @mouseenter="activeIndex = flatResults.findIndex((r) => r.path === result.path)"
                >
                  <span class="result-titles">
                    <span class="result-en">{{ result.title }}</span>
                    <span v-if="result.chinese" class="result-zh">{{ result.chinese }}</span>
                  </span>
                  <span v-if="result.category" class="result-category">{{ result.category }}</span>
                </NuxtLink>
              </div>
            </template>

            <p v-else-if="hasQuery" class="search-empty">
              No records match “{{ query }}”.
            </p>

            <p v-else class="search-hint">
              Type to search the archive. Use ↑ ↓ to navigate, Enter to open.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: clamp(3rem, 12vh, 9rem) 1.25rem 2rem;
  background: color-mix(in srgb, var(--c-ink) 38%, transparent);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.search-panel {
  width: min(640px, 100%);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.search-input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg-soft);
}

.search-input-icon {
  font-size: 1rem;
  opacity: 0.7;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: var(--font-body, inherit);
  font-size: 1.1rem;
  color: var(--c-ink);
  outline: none;
}

.search-input::placeholder {
  color: var(--c-text-3);
}

.search-close {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--c-text-3);
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-close:hover {
  color: var(--c-seal-red);
  border-color: var(--c-seal-red);
}

.search-results {
  overflow-y: auto;
  padding: 0.5rem;
}

.search-group + .search-group {
  margin-top: 0.5rem;
}

.search-group-heading {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  padding: 0.6rem 0.85rem 0.3rem;
}

.group-zh {
  font-family: var(--font-zh-display);
  font-size: 0.95rem;
  color: var(--c-seal-red);
  letter-spacing: 0.08em;
}

.group-en {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--c-text-3);
}

.search-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0.85rem;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.2s ease;
}

.search-result.is-active,
.search-result:hover {
  background: var(--c-seal-red-soft);
}

.result-titles {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  min-width: 0;
}

.result-en {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  color: var(--c-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result.is-active .result-en {
  color: var(--c-seal-red);
}

.result-zh {
  font-size: 0.85rem;
  color: var(--c-text-3);
  white-space: nowrap;
}

.result-category {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--c-text-3);
  flex-shrink: 0;
}

.search-empty,
.search-hint {
  text-align: center;
  color: var(--c-text-3);
  font-size: 0.9rem;
  padding: 2.5rem 1rem;
  margin: 0;
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.25s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

.search-fade-enter-active .search-panel,
.search-fade-leave-active .search-panel {
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.search-fade-enter-from .search-panel,
.search-fade-leave-to .search-panel {
  transform: translateY(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .search-fade-enter-active,
  .search-fade-leave-active,
  .search-fade-enter-active .search-panel,
  .search-fade-leave-active .search-panel {
    transition: opacity 0.12s ease;
  }
  .search-fade-enter-from .search-panel,
  .search-fade-leave-to .search-panel {
    transform: none;
  }
}
</style>
