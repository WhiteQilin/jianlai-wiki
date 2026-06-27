<script setup lang="ts">
import type { ResolvedEntryLink } from '~/utils/entryLinkResolver'

type FactionEntry = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  importance?: string
  verificationStatus?: string
  seal?: string
  region?: string
}

type SeatGroup = {
  raw: string
  label: string
  chinese?: string
  path?: string
  link?: ResolvedEntryLink | null
  count: number
  entries: FactionEntry[]
  isUnplaced?: boolean
}

defineProps<{
  groups: SeatGroup[]
  existingPaths: string[]
}>()

const fallbackSeal = (entry: FactionEntry) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0)

const formatToken = (value?: string) => {
  if (!value) return 'Unmarked'
  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

// Tone for importance chip — Primary → jade, Major → section, others → ghost.
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
</script>

<template>
  <section class="seat-ledger" aria-labelledby="seat-ledger-title">
    <div class="seat-heading">
      <UiBrushTitle as="h2" kicker="Registered Seats" class="seat-title">
        Mountain gate seats
      </UiBrushTitle>
      <p>
        Grouped by authored headquarters fields as seats or registered locations. Region text is shown as supporting copy where present.
      </p>
    </div>

    <div v-if="groups.length" class="seat-groups">
      <article
        v-for="group in groups"
        :key="group.raw"
        class="seat-group"
        :class="{ 'is-unplaced': group.isUnplaced }"
      >
        <!-- Gazetteer-style location header -->
        <header class="group-header">
          <div class="group-jurisdiction-mark" aria-hidden="true">
            <span class="jurisdiction-icon">&#x2316;</span>
          </div>
          <div class="group-title">
            <span class="group-label" :class="{ pending: group.link?.isMissingRoute || group.isUnplaced }">
              <RouteDisplayLink
                v-if="group.link && !group.isUnplaced"
                :item="group.link"
                variant="text"
              />
              <span v-else>{{ group.label }}</span>
            </span>
            <small v-if="group.chinese">{{ group.chinese }}</small>
            <small>
              {{ group.isUnplaced ? 'No headquarters field recorded' : 'Gazetted seat — registered jurisdiction' }}
            </small>
          </div>
          <span class="group-count">{{ group.count }}</span>
        </header>

        <!-- Member rows — compact, gazetteer-styled -->
        <div class="seat-members">
          <NuxtLink
            v-for="entry in group.entries.slice(0, 6)"
            :key="entry.path"
            :to="entry.path"
            class="seat-member"
          >
            <span class="member-seal" aria-hidden="true">
              <UiSealStamp :text="fallbackSeal(entry)" variant="outline" size="xs" writing="horizontal" :decorative="true" />
            </span>
            <span class="member-main">
              <span class="member-title">
                <strong>{{ entry.title }}</strong>
                <small v-if="entry.chinese">{{ entry.chinese }}</small>
              </span>
              <span class="member-meta">
                <UiCinnabarTag tone="ghost" size="sm">{{ entry.category || 'Faction' }}</UiCinnabarTag>
                <UiCinnabarTag :tone="importanceChipTone(entry.importance)" size="sm">{{ formatToken(entry.importance) }}</UiCinnabarTag>
                <UiCinnabarTag v-if="entry.region" tone="bronze" size="sm">{{ entry.region }}</UiCinnabarTag>
              </span>
            </span>
          </NuxtLink>
        </div>
      </article>
    </div>

    <EmptyArchiveState v-else />
  </section>
</template>

<style scoped>
.seat-ledger {
  min-width: 0;
}

.seat-heading {
  display: grid;
  grid-template-columns: minmax(0, 0.72fr) minmax(16rem, 1.28fr);
  gap: clamp(1rem, 3vw, 2rem);
  align-items: end;
  margin-bottom: 1.1rem;
}

.seat-title {
  max-width: none;
}

.seat-heading p {
  max-width: 42rem;
  margin: 0;
  color: var(--c-text-2);
  font-size: 0.95rem;
  line-height: 1.68;
}

.seat-groups {
  display: grid;
  gap: 0.7rem;
}

/* ============================================================
   SEAT GROUP — gazetteer jurisdiction card
   ============================================================ */
.seat-group {
  position: relative;
  min-width: 0;
  overflow: hidden;
  padding: 0.85rem 0.85rem 0.85rem 1.05rem;
  border: 1px solid color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 18%, var(--c-border));
  border-radius: 6px;
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--c-paper-alt) 72%, transparent), color-mix(in srgb, var(--c-bg-soft) 86%, transparent)),
    url('/images/textures/ink-wash-01.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
}

/* Jurisdiction left rule — jade gradient */
.seat-group::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: linear-gradient(180deg, var(--faction-jade, var(--c-teal-accent)), color-mix(in srgb, var(--c-seal-red) 66%, transparent));
  opacity: 0.72;
}

.seat-group.is-unplaced::before {
  background: linear-gradient(180deg, var(--c-bronze), color-mix(in srgb, var(--c-text-3) 44%, transparent));
  opacity: 0.55;
}

/* ============================================================
   GROUP HEADER — location as gazetted jurisdiction
   ============================================================ */
.group-header {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.6rem;
  align-items: start;
  margin-bottom: 0.7rem;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 20%, transparent);
}

.group-jurisdiction-mark {
  display: grid;
  place-items: center;
  width: 1.65rem;
  height: 1.65rem;
  margin-top: 0.1rem;
  color: var(--faction-jade, var(--c-teal-accent));
  border: 1px solid color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 30%, transparent);
  border-radius: 3px;
  background: color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 5%, transparent);
}

.jurisdiction-icon {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1;
}

.group-count {
  min-width: 2.1rem;
  height: 2.1rem;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 46%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-bg) 64%, transparent);
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-variant-numeric: tabular-nums;
}

.group-title {
  min-width: 0;
  display: grid;
  gap: 0.18rem;
}

.group-label {
  min-width: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.08rem;
  font-weight: 500;
  line-height: 1.18;
  overflow-wrap: anywhere;
}

.group-label.pending {
  color: var(--c-text-2);
}

.group-title small {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  line-height: 1.35;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.group-title small:first-of-type {
  color: var(--c-text-2);
  font-family: var(--font-zh-display);
  font-size: 1.04rem;
  line-height: 1.1;
  letter-spacing: 0;
  text-transform: none;
}

/* ============================================================
   MEMBER ROWS — compact gazetteer entries
   ============================================================ */
.seat-members {
  position: relative;
  display: grid;
  gap: 0.35rem;
}

.seat-member {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.5rem;
  align-items: center;
  padding: 0.4rem 0.5rem;
  color: inherit;
  text-decoration: none;
  border: 1px solid transparent;
  border-left: 2px solid color-mix(in srgb, var(--c-text-3) 18%, transparent);
  border-radius: 3px;
  background: color-mix(in srgb, var(--c-bg) 68%, transparent);
  transition: border-color 0.24s cubic-bezier(0.32, 0.72, 0, 1), background 0.24s cubic-bezier(0.32, 0.72, 0, 1), transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.seat-member:hover {
  transform: translateX(3px);
  border-color: color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 30%, var(--c-divider));
  border-left-color: var(--faction-jade, var(--c-teal-accent));
  background: color-mix(in srgb, var(--faction-jade-soft, var(--c-bronze-soft)) 38%, var(--c-bg));
}

.seat-member:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.member-seal {
  display: grid;
  place-items: center;
}

.member-main {
  min-width: 0;
  display: grid;
  gap: 0.18rem;
}

.member-title {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0.5rem;
  align-items: baseline;
}

.member-title strong {
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.18;
  overflow-wrap: anywhere;
}

.member-title small {
  color: var(--c-text-3);
  font-size: 0.76rem;
  line-height: 1.2;
}

.member-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.28rem;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 760px) {
  .seat-heading {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }
}

@media (max-width: 480px) {
  .seat-group {
    padding: 0.75rem;
  }

  .group-header {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.5rem;
  }

  .group-count {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .seat-member {
    align-items: start;
    padding: 0.35rem 0.45rem;
  }

  .seat-member:hover {
    transform: none;
  }
}
</style>
