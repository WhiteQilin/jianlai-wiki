<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

type AtlasLink = {
  raw: string
  label: string
  path: string
  exists: boolean
  shouldLink: boolean
  chinese?: string
}

type HeavenEntry = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  importance?: string
  verificationStatus?: string
  seal?: string
  locationType?: string
  leaderLinks: AtlasLink[]
  governingFactionLink?: AtlasLink | null
  relatedLinks: AtlasLink[]
}

const props = defineProps<{
  entries: HeavenEntry[]
  existingPaths: string[]
}>()

const NuxtLinkComponent = resolveComponent('NuxtLink')
const existingPathSet = computed(() => new Set(props.existingPaths))

const canLink = (link?: AtlasLink | null) => Boolean(link?.shouldLink && existingPathSet.value.has(link.path))

const formatToken = (value?: string) => {
  if (!value) return 'Unmarked'
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

const fallbackSeal = (entry: HeavenEntry) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0)
</script>

<template>
  <section v-if="entries.length" class="heaven-ledger" aria-labelledby="heaven-ledger-title">
    <div class="ledger-heading">
      <p class="ledger-kicker">Heavens</p>
      <div>
        <h2 id="heaven-ledger-title">Macro-Worlds (天下)</h2>
        <p>Symbolic cosmological containers recorded from current entries.</p>
      </div>
    </div>

    <div class="heaven-sheets">
      <article v-for="entry in entries" :key="entry.path" class="heaven-sheet">
        <div class="sheet-seal-block">
          <span class="sheet-seal" aria-hidden="true">{{ fallbackSeal(entry) }}</span>
          <span class="sheet-status">{{ formatToken(entry.verificationStatus) }}</span>
        </div>

        <div class="sheet-main">
          <header class="sheet-header">
            <NuxtLink :to="entry.path" class="sheet-title">
              <span>{{ entry.title }}</span>
              <small v-if="entry.chinese">{{ entry.chinese }}</small>
            </NuxtLink>
            <span class="sheet-category">{{ entry.locationType || entry.category || 'Heaven' }}</span>
          </header>

          <p v-if="entry.description" class="sheet-description">{{ entry.description }}</p>

          <div class="sheet-facts">
            <div v-if="entry.governingFactionLink" class="fact-row">
              <span class="fact-label">Governing faction</span>
              <component
                :is="canLink(entry.governingFactionLink) ? NuxtLinkComponent : 'span'"
                class="fact-link"
                :to="canLink(entry.governingFactionLink) ? entry.governingFactionLink.path : undefined"
              >
                {{ entry.governingFactionLink.label }}
              </component>
            </div>

            <div v-if="entry.leaderLinks.length" class="fact-row">
              <span class="fact-label">Leadership</span>
              <span class="fact-links">
                <component
                  :is="canLink(link) ? NuxtLinkComponent : 'span'"
                  v-for="link in entry.leaderLinks"
                  :key="link.raw"
                  class="fact-chip"
                  :to="canLink(link) ? link.path : undefined"
                >
                  {{ link.label }}
                </component>
              </span>
            </div>
          </div>

          <div v-if="entry.relatedLinks.length" class="related-row" aria-label="Safe related links">
            <component
              :is="canLink(link) ? NuxtLinkComponent : 'span'"
              v-for="link in entry.relatedLinks.slice(0, 6)"
              :key="link.raw"
              class="related-chip"
              :to="canLink(link) ? link.path : undefined"
            >
              {{ link.label }}
            </component>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.heaven-ledger {
  position: relative;
  margin-bottom: clamp(2.5rem, 6vw, 4.5rem);
  padding: clamp(1.4rem, 3vw, 2rem);
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--world-pine, var(--c-ink)) 18%, var(--c-border));
  border-radius: 8px;
  background:
    linear-gradient(120deg, color-mix(in srgb, var(--c-paper-alt) 82%, transparent), color-mix(in srgb, var(--c-bg-soft) 90%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
}

.heaven-ledger::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--world-pine, #2f5b50) 9%, transparent), transparent 34%),
    radial-gradient(ellipse at 85% 10%, color-mix(in srgb, var(--c-bronze) 12%, transparent), transparent 32rem);
  pointer-events: none;
}

.ledger-heading {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(9rem, 0.35fr) minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
  align-items: end;
  margin-bottom: 1.35rem;
}

.ledger-kicker {
  align-self: start;
  margin: 0;
  color: var(--world-pine, var(--c-teal-accent));
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.35;
  letter-spacing: 0;
}

.ledger-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
  text-wrap: balance;
}

.ledger-heading p {
  max-width: 48rem;
  margin: 0.75rem 0 0;
  color: var(--c-text-2);
  font-size: 0.98rem;
  line-height: 1.65;
}

.heaven-sheets {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.heaven-sheet {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--c-ink) 11%, transparent);
  border-left: 2px solid color-mix(in srgb, var(--world-pine, var(--c-teal-accent)) 54%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--c-paper-alt) 64%, var(--c-bg));
  box-shadow: 0 16px 36px color-mix(in srgb, var(--world-pine, #2f5b50) 8%, transparent);
}

.sheet-seal-block {
  display: grid;
  gap: 0.55rem;
  justify-items: center;
}

.sheet-seal {
  width: 3.25rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1.5px solid currentColor;
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-seal-red) 4%, transparent);
  font-family: var(--font-zh-display);
  font-size: 1.55rem;
  line-height: 1;
}

.sheet-status,
.sheet-category,
.fact-label {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.35;
}

.sheet-status {
  max-width: 4.2rem;
  text-align: center;
  overflow-wrap: anywhere;
}

.sheet-main {
  min-width: 0;
  display: grid;
  gap: 0.8rem;
}

.sheet-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.65rem;
  align-items: start;
}

.sheet-title {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  color: var(--c-ink);
  text-decoration: none;
}

.sheet-title:hover {
  color: var(--c-seal-red);
}

.sheet-title:focus-visible,
.fact-link:focus-visible,
.fact-chip:focus-visible,
.related-chip:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.sheet-title span {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 500;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.sheet-title small {
  color: var(--c-text-2);
  font-family: var(--font-zh-display);
  font-size: 1.25rem;
  line-height: 1.1;
  letter-spacing: 0;
}

.sheet-category {
  justify-self: end;
  padding: 0.22rem 0.45rem;
  border: 1px solid var(--c-divider);
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-bg) 70%, transparent);
  text-align: right;
  white-space: nowrap;
}

.sheet-description {
  margin: 0;
  color: var(--c-text-2);
  font-size: 0.92rem;
  line-height: 1.62;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sheet-facts {
  display: grid;
  gap: 0.55rem;
}

.fact-row {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(7rem, 0.35fr) minmax(0, 1fr);
  gap: 0.65rem;
  align-items: baseline;
}

.fact-label {
  color: var(--world-pine, var(--c-teal-accent));
}

.fact-link,
.fact-chip,
.related-chip {
  color: var(--c-text-2);
  text-decoration: none;
  overflow-wrap: anywhere;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

a.fact-link:hover,
a.fact-chip:hover,
a.related-chip:hover {
  color: var(--c-ink);
}

.fact-links,
.related-row {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.fact-chip,
.related-chip {
  max-width: 100%;
  min-height: 1.85rem;
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.5rem;
  border: 1px solid var(--c-divider);
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-bg) 76%, transparent);
  font-size: 0.8rem;
  line-height: 1.25;
}

a.fact-chip:hover,
a.related-chip:hover {
  border-color: color-mix(in srgb, var(--world-pine, var(--c-teal-accent)) 38%, var(--c-divider));
  background: color-mix(in srgb, var(--world-pine-soft, var(--c-bronze-soft)) 54%, var(--c-bg));
}

.related-row {
  padding-top: 0.7rem;
  border-top: 1px solid var(--c-divider);
}

.related-chip {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.7rem;
}

@media (max-width: 980px) {
  .ledger-heading {
    grid-template-columns: 1fr;
    gap: 0.55rem;
  }

  .heaven-sheets {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .heaven-ledger {
    padding: 1rem;
  }

  .heaven-sheet {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .sheet-seal-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    justify-items: stretch;
  }

  .sheet-status {
    max-width: none;
    text-align: right;
  }

  .sheet-header,
  .fact-row {
    grid-template-columns: 1fr;
  }

  .sheet-category {
    justify-self: start;
    text-align: left;
  }
}
</style>
