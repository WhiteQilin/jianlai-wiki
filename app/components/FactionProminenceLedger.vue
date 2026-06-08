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

</script>

<template>
  <section class="prominence-ledger" aria-labelledby="prominence-ledger-title">
    <div class="ledger-heading">
      <p class="ledger-kicker">Prominence Ledger</p>
      <div>
        <h2 id="prominence-ledger-title">Primary and major institutions</h2>
        <p>
          Editorial rows for records marked primary or major in frontmatter, preserving authored categories and verification states.
        </p>
      </div>
      <div v-if="prominenceGroups.length" class="prominence-counts" aria-label="Prominence group counts">
        <span v-for="group in prominenceGroups" :key="group.value">
          {{ group.label }} <strong>{{ group.count }}</strong>
        </span>
      </div>
    </div>

    <div v-if="entries.length" class="ledger-table" role="list">
      <article
        v-for="entry in entries"
        :key="entry.path"
        class="ledger-row"
        role="listitem"
      >
        <NuxtLink v-if="canOpen(entry.path)" :to="entry.path" class="row-seal" :aria-label="entry.title">
          {{ fallbackSeal(entry) }}
        </NuxtLink>
        <span v-else class="row-seal">{{ fallbackSeal(entry) }}</span>

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
            <span class="row-kind">{{ entry.factionType || entry.category || 'Faction' }}</span>
          </header>

          <p v-if="entry.description" class="row-description">{{ entry.description }}</p>

          <div class="row-fields">
            <div class="field-pair">
              <span>Importance</span>
              <strong>{{ formatToken(entry.importance) }}</strong>
            </div>
            <div class="field-pair">
              <span>Verification</span>
              <strong>{{ formatToken(entry.verificationStatus) }}</strong>
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
  grid-template-columns: minmax(9rem, 0.34fr) minmax(0, 1fr) auto;
  gap: clamp(1rem, 3vw, 2rem);
  align-items: end;
  margin-bottom: 1.25rem;
}

.ledger-kicker {
  align-self: start;
  margin: 0;
  color: var(--faction-jade, var(--c-teal-accent));
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
  max-width: 52rem;
  margin: 0.72rem 0 0;
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

.row-seal {
  width: 3.15rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  text-decoration: none;
  border: 1.5px solid currentColor;
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-seal-red) 4%, transparent);
  font-family: var(--font-zh-display);
  font-size: 1.5rem;
  line-height: 1;
  transition: transform 0.24s cubic-bezier(0.32, 0.72, 0, 1), background 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

a.row-seal:hover {
  transform: translateY(-2px);
  background: color-mix(in srgb, var(--c-seal-red) 8%, transparent);
}

.row-seal:focus-visible,
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

.row-kind {
  justify-self: end;
  max-width: 13rem;
  padding: 0.22rem 0.45rem;
  color: var(--c-text-3);
  border: 1px solid var(--c-divider);
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-bg) 70%, transparent);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.35;
  text-align: right;
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

.field-pair strong {
  color: var(--c-ink);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.35;
  overflow-wrap: anywhere;
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
  .ledger-heading {
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

  .row-seal {
    width: 2.75rem;
    font-size: 1.25rem;
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
