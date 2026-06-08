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
</script>

<template>
  <section class="seat-ledger" aria-labelledby="seat-ledger-title">
    <div class="seat-heading">
      <div>
        <p class="seat-kicker">Registered Seats</p>
        <h2 id="seat-ledger-title">Mountain gate seats</h2>
      </div>
      <p>
        Grouped by authored headquarters fields as seats or registered locations only. Region text is shown as supporting copy where present.
      </p>
    </div>

    <div v-if="groups.length" class="seat-groups">
      <article
        v-for="group in groups"
        :key="group.raw"
        class="seat-group"
        :class="{ 'is-unplaced': group.isUnplaced }"
      >
        <header class="group-header">
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
            <small>{{ group.isUnplaced ? 'No headquarters field recorded' : 'Seat / registered location' }}</small>
          </div>
          <span class="group-count">{{ group.count }}</span>
        </header>

        <div class="seat-members">
          <NuxtLink
            v-for="entry in group.entries.slice(0, 6)"
            :key="entry.path"
            :to="entry.path"
            class="seat-member"
          >
            <span class="member-seal" aria-hidden="true">{{ fallbackSeal(entry) }}</span>
            <span class="member-main">
              <span class="member-title">
                <strong>{{ entry.title }}</strong>
                <small v-if="entry.chinese">{{ entry.chinese }}</small>
              </span>
              <span class="member-meta">
                <span>{{ entry.category || 'Faction' }}</span>
                <span>{{ formatToken(entry.importance) }}</span>
                <span v-if="entry.region">{{ entry.region }}</span>
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

.seat-kicker {
  margin: 0 0 0.35rem;
  color: var(--faction-jade, var(--c-teal-accent));
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.35;
  letter-spacing: 0;
}

.seat-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 2.72rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
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
  gap: 0.8rem;
}

.seat-group {
  position: relative;
  min-width: 0;
  overflow: hidden;
  padding: 0.95rem;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background:
    linear-gradient(150deg, color-mix(in srgb, var(--c-paper-alt) 76%, transparent), color-mix(in srgb, var(--c-bg-soft) 88%, transparent)),
    url('/images/textures/ink-wash-01.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
}

.seat-group::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: linear-gradient(180deg, var(--faction-jade, var(--c-teal-accent)), color-mix(in srgb, var(--c-seal-red) 62%, transparent));
  opacity: 0.78;
}

.seat-group.is-unplaced::before {
  background: color-mix(in srgb, var(--c-bronze) 64%, transparent);
}

.group-header {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: start;
  margin-bottom: 0.85rem;
}

.group-title {
  min-width: 0;
  display: grid;
  gap: 0.24rem;
}

.group-label {
  min-width: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.16rem;
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
  font-size: 0.68rem;
  line-height: 1.35;
}

.group-title small:first-of-type {
  color: var(--c-text-2);
  font-family: var(--font-zh-display);
  font-size: 1.08rem;
  line-height: 1.1;
  letter-spacing: 0;
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

.seat-members {
  position: relative;
  display: grid;
  gap: 0.45rem;
}

.seat-member {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.55rem;
  align-items: center;
  padding: 0.55rem;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--c-divider);
  border-radius: 5px;
  background: color-mix(in srgb, var(--c-bg) 76%, transparent);
  transition: border-color 0.24s cubic-bezier(0.32, 0.72, 0, 1), background 0.24s cubic-bezier(0.32, 0.72, 0, 1), transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.seat-member:hover {
  transform: translateX(3px);
  border-color: color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 34%, var(--c-divider));
  background: color-mix(in srgb, var(--faction-jade-soft, var(--c-bronze-soft)) 42%, var(--c-bg));
}

.seat-member:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.member-seal {
  width: 2rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 58%, transparent);
  border-radius: 3px;
  font-family: var(--font-zh-display);
  font-size: 0.95rem;
  line-height: 1;
}

.member-main {
  min-width: 0;
  display: grid;
  gap: 0.25rem;
}

.member-title {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.55rem;
  align-items: baseline;
}

.member-title strong {
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.18;
  overflow-wrap: anywhere;
}

.member-title small {
  color: var(--c-text-3);
  font-size: 0.82rem;
  line-height: 1.2;
}

.member-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  line-height: 1.3;
}

.member-meta span {
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .seat-heading {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }
}

@media (max-width: 480px) {
  .seat-group {
    padding: 0.85rem;
  }

  .seat-member {
    align-items: start;
  }

  .seat-member:hover {
    transform: none;
  }
}
</style>
