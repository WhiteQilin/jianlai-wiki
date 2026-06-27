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
      <UiBrushTitle as="h2" kicker="Recorded Associations" class="board-title">
        Named relationships
      </UiBrushTitle>
      <span class="board-count">{{ associationTotal }}</span>
    </div>

    <div v-if="visibleRecords.length" class="association-list">
      <article v-for="record in visibleRecords" :key="record.faction.path" class="association-card">
        <!-- Card header — faction identity -->
        <header class="association-header">
          <NuxtLink v-if="canOpen(record.faction.path)" :to="record.faction.path" class="faction-seal-link">
            <UiSealStamp :text="fallbackSeal(record.faction)" variant="outline" size="sm" writing="horizontal" :decorative="true" />
          </NuxtLink>
          <UiSealStamp v-else :text="fallbackSeal(record.faction)" variant="ghost" size="sm" writing="horizontal" :decorative="true" class="faction-seal" />

          <div class="faction-title">
            <NuxtLink v-if="canOpen(record.faction.path)" :to="record.faction.path">{{ record.faction.title }}</NuxtLink>
            <span v-else>{{ record.faction.title }}</span>
            <small v-if="record.faction.chinese">{{ record.faction.chinese }}</small>
          </div>

          <span class="association-number">{{ record.associationCount }}</span>
        </header>

        <!-- Three-column relationship board -->
        <div class="association-columns">
          <!-- Column 1: Declared leader — authoritative, top-down -->
          <div class="association-column col-leader">
            <span class="column-label">
              <span class="column-icon" aria-hidden="true">&#x2191;</span>
              Declared leader
            </span>
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

          <!-- Column 2: Declared members — organizational roster -->
          <div class="association-column col-members">
            <span class="column-label">
              <span class="column-icon" aria-hidden="true">&#x2192;</span>
              Declared members
            </span>
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

          <!-- Column 3: Character affiliations — bottom-up, organic -->
          <div class="association-column col-affiliations">
            <span class="column-label">
              <span class="column-icon" aria-hidden="true">&#x2198;</span>
              Character affiliations
            </span>
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

.board-title {
  max-width: none;
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
  gap: 0.7rem;
}

/* ============================================================
   ASSOCIATION CARD — relationship dossier
   ============================================================ */
.association-card {
  min-width: 0;
  padding: 0.85rem;
  border: 1px solid color-mix(in srgb, var(--c-ink) 14%, var(--c-border));
  border-radius: 6px;
  background:
    linear-gradient(140deg, color-mix(in srgb, var(--c-bg) 84%, transparent), color-mix(in srgb, var(--c-bg-soft) 86%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
}

/* ============================================================
   CARD HEADER
   ============================================================ */
.association-header {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.6rem;
  align-items: center;
  padding-bottom: 0.65rem;
  margin-bottom: 0.65rem;
  border-bottom: 1px solid color-mix(in srgb, var(--c-ink) 12%, transparent);
}

.faction-seal-link {
  display: grid;
  place-items: center;
  text-decoration: none;
  transition: transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.faction-seal-link:hover {
  transform: translateY(-1px);
}

.faction-seal-link:focus-visible,
.faction-title a:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.faction-seal {
  display: grid;
  place-items: center;
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
  font-size: 1.08rem;
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
  font-size: 0.96rem;
  line-height: 1.1;
  letter-spacing: 0;
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

/* ============================================================
   THREE-COLUMN RELATIONSHIP BOARD
   ============================================================ */
.association-columns {
  display: grid;
  gap: 0.5rem;
}

.association-column {
  min-width: 0;
  display: grid;
  gap: 0.4rem;
  padding: 0.55rem 0.6rem;
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-bg) 72%, transparent);
}

/* Column 1: Declared leader — authoritative cinnabar accent */
.col-leader {
  border-left: 2px solid color-mix(in srgb, var(--c-seal-red) 50%, transparent);
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-seal-red) 3%, transparent), transparent 50%),
    color-mix(in srgb, var(--c-bg) 72%, transparent);
}

/* Column 2: Declared members — organizational jade accent */
.col-members {
  border-left: 2px solid color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 50%, transparent);
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 3%, transparent), transparent 50%),
    color-mix(in srgb, var(--c-bg) 72%, transparent);
}

/* Column 3: Character affiliations — organic bronze accent */
.col-affiliations {
  border-left: 2px solid color-mix(in srgb, var(--c-bronze) 48%, transparent);
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-bronze) 3%, transparent), transparent 50%),
    color-mix(in srgb, var(--c-bg) 72%, transparent);
}

.column-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  line-height: 1.35;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.column-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.15rem;
  height: 1.15rem;
  font-size: 0.68rem;
  line-height: 1;
  border-radius: 2px;
}

.col-leader .column-icon {
  color: var(--c-seal-red);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 28%, transparent);
  background: color-mix(in srgb, var(--c-seal-red) 6%, transparent);
}

.col-members .column-icon {
  color: var(--faction-jade, var(--c-teal-accent));
  border: 1px solid color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 28%, transparent);
  background: color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 6%, transparent);
}

.col-affiliations .column-icon {
  color: var(--c-bronze);
  border: 1px solid color-mix(in srgb, var(--c-bronze) 28%, transparent);
  background: color-mix(in srgb, var(--c-bronze) 6%, transparent);
}

.chip-set {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.more-chip,
.empty-note {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
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
    padding: 0.75rem;
  }

  .association-header {
    align-items: start;
  }
}
</style>
