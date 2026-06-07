<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

type DossierEntry = {
  path: string
  title: string
  chinese?: string
  description?: string
  importance?: string
  verificationStatus?: string
  seal?: string
  relatedCount: number
  relationshipCount: number
  inboundCount: number
}

const props = defineProps<{
  entries: DossierEntry[]
  existingPaths: string[]
}>()

const NuxtLinkComponent = resolveComponent('NuxtLink')

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

const fallbackSeal = (entry: DossierEntry) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0)

const visibleEntries = computed(() => props.entries.slice(0, 6))
</script>

<template>
  <section v-if="visibleEntries.length" class="dossier-strip" aria-labelledby="dossier-strip-title">
    <div class="strip-heading">
      <div>
        <p class="strip-kicker">Start Here</p>
        <h2 id="dossier-strip-title">Central Records</h2>
      </div>
      <span class="strip-count">{{ visibleEntries.length }} dossiers</span>
    </div>

    <div class="strip-list">
      <component
        :is="canLink(entry.path) ? NuxtLinkComponent : 'article'"
        v-for="entry in visibleEntries"
        :key="entry.path"
        class="dossier-sheet"
        :to="canLink(entry.path) ? entry.path : undefined"
      >
        <span class="sheet-seal" aria-hidden="true">{{ fallbackSeal(entry) }}</span>
        <span class="sheet-body">
          <span class="sheet-meta">
            <span>{{ formatToken(entry.importance) }}</span>
            <span>{{ formatToken(entry.verificationStatus) }}</span>
          </span>
          <span class="sheet-title">
            <strong>{{ entry.title }}</strong>
            <small v-if="entry.chinese">{{ entry.chinese }}</small>
          </span>
          <span v-if="entry.description" class="sheet-description">{{ entry.description }}</span>
          <span class="sheet-links">
            {{ entry.inboundCount }} references
            <span aria-hidden="true">/</span>
            {{ entry.relationshipCount + entry.relatedCount }} listed ties
          </span>
        </span>
      </component>
    </div>
  </section>
</template>

<style scoped>
.dossier-strip {
  position: relative;
  padding: clamp(1.25rem, 3vw, 1.8rem) 0;
  border-top: 1px solid var(--c-divider);
  border-bottom: 1px solid var(--c-divider);
}

.dossier-strip::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-seal-red) 7%, transparent), transparent 28%),
    url('/images/textures/ink-wash-01.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
  opacity: 0.2;
  pointer-events: none;
}

.strip-heading {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.strip-kicker {
  margin: 0 0 0.3rem;
  color: var(--c-seal-red);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0;
}

.strip-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 2.7rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
}

.strip-count {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  white-space: nowrap;
}

.strip-list {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(6, minmax(220px, 1fr));
  gap: 0.9rem;
  overflow-x: auto;
  padding-bottom: 0.35rem;
  scrollbar-width: thin;
}

.dossier-sheet {
  min-width: 220px;
  min-height: 230px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.9rem;
  padding: 1rem;
  color: inherit;
  text-decoration: none;
  background: color-mix(in srgb, var(--c-bg) 86%, var(--c-bg-soft));
  border: 1px solid var(--c-border);
  border-radius: 8px;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.dossier-sheet:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--c-seal-red) 42%, var(--c-border));
  background: color-mix(in srgb, var(--c-bg) 78%, var(--c-seal-red-soft));
}

.dossier-sheet:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.sheet-seal {
  width: 3.2rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1.5px solid currentColor;
  border-radius: 4px;
  font-family: var(--font-zh-display);
  font-size: 1.55rem;
  line-height: 1;
}

.sheet-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sheet-meta,
.sheet-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.6rem;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.3;
}

.sheet-title {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.sheet-title strong {
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.28rem;
  font-weight: 500;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.sheet-title small {
  color: var(--c-text-2);
  font-family: var(--font-zh-display);
  font-size: 1.3rem;
  line-height: 1.1;
  letter-spacing: 0;
}

.sheet-description {
  color: var(--c-text-2);
  font-size: 0.88rem;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sheet-links {
  margin-top: auto;
  padding-top: 0.7rem;
  border-top: 1px solid var(--c-divider);
}

@media (max-width: 760px) {
  .strip-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .strip-list {
    grid-template-columns: 1fr;
    overflow-x: visible;
  }

  .strip-heading h2 {
    font-size: 2.2rem;
  }

  .dossier-sheet {
    min-width: 0;
    min-height: 0;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
  }
}
</style>
