<script setup lang="ts">
import { computed } from 'vue'
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
  leaderLinks: ResolvedEntryLink[]
}

type ProminenceGroup = {
  value: string
  label: string
  count: number
}

const props = defineProps<{
  entries: FactionEntry[]
  prominenceGroups: ProminenceGroup[]
  existingPaths: string[]
}>()

const existingPathSet = computed(() => new Set(props.existingPaths))

const canOpen = (path: string) => existingPathSet.value.has(path)

const fallbackSeal = (entry: FactionEntry) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0)

const formatToken = (value?: string) => {
  if (!value) return 'Unmarked'
  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

// Tone mapping for importance / verification chips.
// Primary → jade (the section's own accent), major → section, minor/background → ghost.
type Tone = 'section' | 'jade' | 'bronze' | 'ghost' | 'cinnabar'
const importanceTone = (value?: string): Tone => {
  switch (normalizeKey(value)) {
    case 'primary':
      return 'jade'
    case 'major':
      return 'section'
    case 'minor':
      return 'ghost'
    case 'background':
      return 'ghost'
    default:
      return 'ghost'
  }
}

// Verified → jade (settled), to-be-verified → ghost (neutral), disputed → cinnabar (rare), speculative → bronze.
const verificationTone = (value?: string): Tone => {
  switch (normalizeKey(value)) {
    case 'verified':
      return 'jade'
    case 'disputed':
      return 'cinnabar'
    case 'speculative':
      return 'bronze'
    case 'to-be-verified':
    default:
      return 'ghost'
  }
}

function normalizeKey(value?: string) {
  return (value || '').trim().toLowerCase()
}

</script>

<template>
  <section class="prominence-ledger" aria-labelledby="prominence-ledger-title">
    <div class="ledger-heading">
      <UiBrushTitle as="h2" kicker="Prominence Ledger" class="prominence-title">
        Primary and major institutions
      </UiBrushTitle>
      <div class="prominence-sub">
        <p>
          Editorial rows for records marked primary or major in frontmatter, preserving authored categories and verification states.
        </p>
        <div v-if="prominenceGroups.length" class="prominence-counts" aria-label="Prominence group counts">
          <span v-for="group in prominenceGroups" :key="group.value">
            {{ group.label }} <strong>{{ group.count }}</strong>
          </span>
        </div>
      </div>
    </div>

    <div v-if="entries.length" class="ledger-table" role="list">
      <article
        v-for="entry in entries"
        :key="entry.path"
        class="ledger-row"
        role="listitem"
      >
        <NuxtLink v-if="canOpen(entry.path)" :to="entry.path" class="row-seal-link" :aria-label="entry.title">
          <UiSealStamp :text="fallbackSeal(entry)" variant="outline" size="sm" writing="horizontal" :decorative="true" />
        </NuxtLink>
        <UiSealStamp v-else :text="fallbackSeal(entry)" variant="ghost" size="sm" writing="horizontal" :decorative="true" class="row-seal" />

        <div class="row-main">
          <header class="row-header">
            <NuxtLink v-if="canOpen(entry.path)" :to="entry.path" class="row-title">
              <strong>{{ entry.title }}</strong>
              <small v-if="entry.chinese">{{ entry.chinese }}</small>
            </NuxtLink>
            <span v-else class="row-title">
              <strong>{{ entry.title }}</strong>
              <small v-if="entry.chinese">{{ entry.chinese }}</small>
            </span>
            <UiCinnabarTag tone="ghost" size="sm" class="row-kind-tag">{{ entry.factionType || entry.category || 'Faction' }}</UiCinnabarTag>
          </header>

          <p v-if="entry.description" class="row-description">{{ entry.description }}</p>

          <div class="row-fields">
            <div class="field-pair">
              <span>Importance</span>
              <UiCinnabarTag :tone="importanceTone(entry.importance)" size="sm">{{ formatToken(entry.importance) }}</UiCinnabarTag>
            </div>
            <div class="field-pair">
              <span>Verification</span>
              <UiCinnabarTag :tone="verificationTone(entry.verificationStatus)" size="sm">{{ formatToken(entry.verificationStatus) }}</UiCinnabarTag>
            </div>
            <div v-if="entry.headquartersLink" class="field-pair field-link">
              <span>Registered seat</span>
              <RouteDisplayLink :item="entry.headquartersLink" variant="text" />
            </div>
            <div v-if="entry.leaderLinks.length" class="field-pair field-link">
              <span>Declared leader</span>
              <span class="link-stack">
                <RouteDisplayLink
                  v-for="leader in entry.leaderLinks.slice(0, 2)"
                  :key="leader.raw"
                  :item="leader"
                  variant="text"
                />
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <EmptyArchiveState v-else />
  </section>
</template>

<style scoped>
.prominence-ledger {
  position: relative;
  overflow: hidden;
  padding: clamp(1.2rem, 3vw, 1.75rem);
  border: 1px solid color-mix(in srgb, var(--faction-jade, var(--c-ink)) 20%, var(--c-border));
  border-radius: 8px;
  background:
    linear-gradient(120deg, color-mix(in srgb, var(--c-paper-alt) 80%, transparent), color-mix(in srgb, var(--c-bg-soft) 90%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
}

.prominence-ledger::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--faction-jade, #2f5c53) 8%, transparent), transparent 34%),
    radial-gradient(ellipse at 86% 0%, color-mix(in srgb, var(--c-bronze) 13%, transparent), transparent 30rem);
  pointer-events: none;
}

.ledger-heading,
.ledger-table {
  position: relative;
  z-index: 1;
}

.ledger-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
  align-items: start;
  margin-bottom: 1.25rem;
}

.prominence-title {
  max-width: none;
}

.prominence-sub {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: clamp(1rem, 3vw, 2rem);
  align-items: end;
}

.prominence-sub p {
  max-width: 52rem;
  margin: 0;
  color: var(--c-text-2);
  font-size: 0.98rem;
  line-height: 1.65;
}

.prominence-counts {
  display: grid;
  gap: 0.4rem;
  justify-items: end;
}

.prominence-counts span {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 1.85rem;
  padding: 0.25rem 0.52rem;
  color: var(--c-text-3);
  border: 1px solid var(--c-divider);
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-bg) 72%, transparent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  line-height: 1.2;
}

.prominence-counts strong {
  color: var(--c-seal-red);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
}

.ledger-table {
  display: grid;
  gap: 0.6rem;
}

.ledger-row {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
  padding: 0.95rem;
  border: 1px solid color-mix(in srgb, var(--c-ink) 11%, transparent);
  border-left: 2px solid color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 54%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--c-paper-alt) 64%, var(--c-bg));
  box-shadow: 0 16px 36px color-mix(in srgb, var(--faction-jade, #2f5c53) 7%, transparent);
}

.row-seal-link {
  display: grid;
  place-items: center;
  text-decoration: none;
  transition: transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.row-seal-link:hover {
  transform: translateY(-2px);
}

.row-seal-link:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.row-seal {
  display: grid;
  place-items: center;
}

.row-seal-link:focus-visible,
.row-title:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.row-main {
  min-width: 0;
  display: grid;
  gap: 0.75rem;
}

.row-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.7rem;
  align-items: start;
}

.row-title {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.28rem 0.7rem;
  align-items: baseline;
  color: var(--c-ink);
  text-decoration: none;
}

a.row-title:hover {
  color: var(--c-seal-red);
}

.row-title strong {
  font-family: var(--font-heading);
  font-size: 1.28rem;
  font-weight: 500;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.row-title small {
  color: var(--c-text-2);
  font-family: var(--font-zh-display);
  font-size: 1.2rem;
  line-height: 1.1;
  letter-spacing: 0;
}

.row-kind-tag {
  justify-self: end;
  max-width: 13rem;
  overflow-wrap: anywhere;
}

.row-description {
  margin: 0;
  color: var(--c-text-2);
  font-size: 0.92rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.row-fields {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  background: var(--c-divider);
  border: 1px solid var(--c-divider);
  border-radius: 5px;
  overflow: hidden;
}

.field-pair {
  min-width: 0;
  display: grid;
  gap: 0.32rem;
  align-content: start;
  padding: 0.65rem;
  background: color-mix(in srgb, var(--c-bg) 82%, transparent);
}

.field-pair span:first-child {
  color: var(--faction-jade, var(--c-teal-accent));
  font-family: var(--font-mono);
  font-size: 0.66rem;
  line-height: 1.3;
}

.field-link {
  font-size: 0.84rem;
}

.link-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
}

@media (max-width: 1100px) {
  .prominence-sub {
    grid-template-columns: 1fr;
    gap: 0.55rem;
  }

  .prominence-counts {
    justify-items: start;
    display: flex;
    flex-wrap: wrap;
  }

  .row-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .prominence-ledger {
    padding: 1rem;
  }

  .ledger-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .row-seal-link,
  .row-seal {
    place-items: start;
  }

  .row-header,
  .row-fields {
    grid-template-columns: 1fr;
  }

  .row-kind {
    justify-self: start;
    text-align: left;
  }
}
</style>
