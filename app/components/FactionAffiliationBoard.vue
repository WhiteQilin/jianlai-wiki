<script setup lang="ts">
import { computed } from 'vue'
import type { ResolvedEntryLink } from '~/utils/entryLinkResolver'

type FactionSummary = {
  path: string
  title: string
  chinese?: string
  category?: string
  importance?: string
  verificationStatus?: string
  seal?: string
}

type AffiliationRecord = {
  faction: FactionSummary
  declaredLeaders: ResolvedEntryLink[]
  declaredMembers: ResolvedEntryLink[]
  inverseAffiliations: ResolvedEntryLink[]
  associationCount: number
}

const props = defineProps<{
  records: AffiliationRecord[]
  associationTotal: number
  existingPaths: string[]
}>()

const existingPathSet = computed(() => new Set(props.existingPaths))

const visibleRecords = computed(() => props.records.slice(0, 7))

const canOpen = (path: string) => existingPathSet.value.has(path)

const fallbackSeal = (faction: FactionSummary) => faction.seal || faction.chinese?.charAt(0) || faction.title.charAt(0)
</script>

<template>
  <section class="affiliation-board" aria-labelledby="affiliation-board-title">
    <div class="board-heading">
      <div>
        <p class="board-kicker">Recorded Associations</p>
        <h2 id="affiliation-board-title">Named relationships</h2>
      </div>
      <span class="board-count">{{ associationTotal }}</span>
    </div>

    <div v-if="visibleRecords.length" class="association-list">
      <article v-for="record in visibleRecords" :key="record.faction.path" class="association-card">
        <header class="association-header">
          <NuxtLink v-if="canOpen(record.faction.path)" :to="record.faction.path" class="faction-seal">
            {{ fallbackSeal(record.faction) }}
          </NuxtLink>
          <span v-else class="faction-seal">{{ fallbackSeal(record.faction) }}</span>

          <div class="faction-title">
            <NuxtLink v-if="canOpen(record.faction.path)" :to="record.faction.path">{{ record.faction.title }}</NuxtLink>
            <span v-else>{{ record.faction.title }}</span>
            <small v-if="record.faction.chinese">{{ record.faction.chinese }}</small>
          </div>

          <span class="association-number">{{ record.associationCount }}</span>
        </header>

        <div class="association-columns">
          <div class="association-column declared">
            <span class="column-label">Declared leader</span>
            <div v-if="record.declaredLeaders.length" class="chip-set">
              <RouteDisplayLink
                v-for="leader in record.declaredLeaders.slice(0, 3)"
                :key="leader.raw"
                :item="leader"
                variant="chip"
              />
            </div>
            <span v-else class="empty-note">None recorded</span>
          </div>

          <div class="association-column declared">
            <span class="column-label">Declared members</span>
            <div v-if="record.declaredMembers.length" class="chip-set">
              <RouteDisplayLink
                v-for="member in record.declaredMembers.slice(0, 5)"
                :key="member.raw"
                :item="member"
                variant="chip"
              />
              <span v-if="record.declaredMembers.length > 5" class="more-chip">
                +{{ record.declaredMembers.length - 5 }}
              </span>
            </div>
            <span v-else class="empty-note">None recorded</span>
          </div>

          <div class="association-column inverse">
            <span class="column-label">Character affiliations</span>
            <div v-if="record.inverseAffiliations.length" class="chip-set">
              <RouteDisplayLink
                v-for="affiliation in record.inverseAffiliations.slice(0, 6)"
                :key="affiliation.raw"
                :item="affiliation"
                variant="chip"
              />
              <span v-if="record.inverseAffiliations.length > 6" class="more-chip">
                +{{ record.inverseAffiliations.length - 6 }}
              </span>
            </div>
            <span v-else class="empty-note">None recorded</span>
          </div>
        </div>
      </article>
    </div>

    <EmptyArchiveState v-else />
  </section>
</template>

<style scoped>
.affiliation-board {
  min-width: 0;
}

.board-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.board-kicker {
  margin: 0 0 0.35rem;
  color: var(--c-seal-red);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.35;
  letter-spacing: 0;
}

.board-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 2.72rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
}

.board-count {
  min-width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 42%, transparent);
  border-radius: 5px;
  background: color-mix(in srgb, var(--c-bg) 70%, transparent);
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-variant-numeric: tabular-nums;
}

.association-list {
  display: grid;
  gap: 0.75rem;
}

.association-card {
  min-width: 0;
  padding: 0.9rem;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--c-bg) 86%, transparent), color-mix(in srgb, var(--c-bg-soft) 88%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
}

.association-header {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.65rem;
  align-items: center;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--c-divider);
}

.faction-seal {
  width: 2.35rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  text-decoration: none;
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 60%, transparent);
  border-radius: 3px;
  font-family: var(--font-zh-display);
  font-size: 1.05rem;
  line-height: 1;
}

.faction-title {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.6rem;
  align-items: baseline;
}

.faction-title a,
.faction-title span {
  min-width: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.12rem;
  font-weight: 500;
  line-height: 1.16;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.faction-title a:hover {
  color: var(--c-seal-red);
}

.faction-title small {
  color: var(--c-text-3);
  font-family: var(--font-zh-display);
  font-size: 1rem;
  line-height: 1.1;
  letter-spacing: 0;
}

.faction-seal:focus-visible,
.faction-title a:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.association-number {
  min-width: 2rem;
  color: var(--c-seal-red);
  font-family: var(--font-mono);
  font-size: 0.88rem;
  line-height: 1;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.association-columns {
  display: grid;
  gap: 0.55rem;
}

.association-column {
  min-width: 0;
  display: grid;
  gap: 0.45rem;
  padding: 0.65rem;
  border: 1px solid var(--c-divider);
  border-radius: 5px;
  background: color-mix(in srgb, var(--c-bg) 76%, transparent);
}

.association-column.inverse {
  border-left: 2px solid color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 50%, transparent);
}

.association-column.declared {
  border-left: 2px solid color-mix(in srgb, var(--c-seal-red) 42%, transparent);
}

.column-label {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.35;
}

.chip-set {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.38rem;
}

.more-chip,
.empty-note {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  line-height: 1.35;
}

.more-chip {
  min-height: 1.8rem;
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.5rem;
  border: 1px dashed var(--c-divider);
  border-radius: 999px;
  background: color-mix(in srgb, var(--c-bg-soft) 48%, transparent);
}

@media (max-width: 560px) {
  .board-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .association-card {
    padding: 0.78rem;
  }

  .association-header {
    align-items: start;
  }
}
</style>
