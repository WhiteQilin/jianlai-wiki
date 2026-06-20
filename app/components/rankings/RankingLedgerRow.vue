<script setup lang="ts">
type RankingPreviewEntry = {
  rank?: string | number
  name: string
}

type RankingLedgerRecord = {
  path: string
  title: string
  chinese?: string
  category: string
  listType: string
  entryCount: number
  verificationStatus: string
  lastUpdated?: string
  description: string
  previewEntries: RankingPreviewEntry[]
}

defineProps<{
  record: RankingLedgerRecord
}>()

function rankLabel(rank?: string | number) {
  if (rank === undefined || rank === null || rank === '') return 'Listed'
  return String(rank)
}
</script>

<template>
  <article class="ranking-ledger-row">
    <div class="ledger-row-main">
      <div class="ledger-row-heading">
        <div class="ledger-row-title-block">
          <NuxtLink :to="record.path" class="ledger-row-title">
            {{ record.title }}
          </NuxtLink>
          <p v-if="record.chinese" class="ledger-row-chinese">{{ record.chinese }}</p>
        </div>

        <div class="ledger-row-meta" aria-label="Ranking classification">
          <span>{{ record.category }}</span>
          <span>{{ record.listType }}</span>
        </div>
      </div>

      <p class="ledger-row-description">{{ record.description }}</p>

      <ol v-if="record.previewEntries.length" class="ledger-preview" aria-label="Preview entries">
        <li v-for="entry in record.previewEntries" :key="`${entry.rank || 'listed'}-${entry.name}`">
          <span class="preview-rank">{{ rankLabel(entry.rank) }}</span>
          <span class="preview-name">{{ entry.name }}</span>
        </li>
      </ol>
      <p v-else class="ledger-preview-empty">Roster awaiting inscription.</p>
    </div>

    <dl class="ledger-row-facts" aria-label="Ledger facts">
      <div>
        <dt>Entries</dt>
        <dd>{{ record.entryCount }}</dd>
      </div>
      <div>
        <dt>Verification</dt>
        <dd>{{ record.verificationStatus }}</dd>
      </div>
      <div v-if="record.lastUpdated">
        <dt>Updated</dt>
        <dd>{{ record.lastUpdated }}</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.ranking-ledger-row {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(11rem, 15rem);
  gap: clamp(1.1rem, 3vw, 2rem);
  padding: clamp(1.15rem, 2.4vw, 1.6rem);
  color: var(--rankings-ink, #332c22);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--rankings-paper, #f6ecd8) 92%, white), color-mix(in srgb, var(--rankings-mist, #e8dfcc) 72%, white)),
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--rankings-gold, #b29555) 10%, transparent), transparent 18rem);
  border: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 78%, transparent);
  transition:
    border-color 0.24s ease,
    background-color 0.24s ease,
    transform 0.24s ease;
}

.ranking-ledger-row::before,
.ranking-ledger-row::after {
  content: '';
  position: absolute;
  pointer-events: none;
}

.ranking-ledger-row::before {
  inset: 0.45rem;
  border: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 34%, transparent);
}

.ranking-ledger-row::after {
  width: 3.2rem;
  height: 0.18rem;
  top: 0.88rem;
  right: 0.95rem;
  background: color-mix(in srgb, var(--rankings-seal, #aa352d) 58%, transparent);
}

.ranking-ledger-row:hover {
  border-color: color-mix(in srgb, var(--rankings-gold, #b29555) 72%, var(--rankings-frame, rgba(149, 113, 58, 0.32)));
  transform: translateY(-2px);
}

.ledger-row-main,
.ledger-row-facts {
  position: relative;
  z-index: 1;
}

.ledger-row-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.ledger-row-title-block {
  min-width: 0;
}

.ledger-row-title {
  color: var(--rankings-title-ink, #2c251b);
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 2vw, 1.55rem);
  line-height: 1.18;
  text-decoration: none;
  text-wrap: balance;
}

.ledger-row-title:hover,
.ledger-row-title:focus-visible {
  color: var(--rankings-seal, #aa352d);
  outline: none;
}

.ledger-row-chinese {
  margin: 0.28rem 0 0;
  color: color-mix(in srgb, var(--rankings-accent, #8a7448) 82%, var(--rankings-ink, #332c22));
  font-family: var(--font-zh-display);
  font-size: 1rem;
  line-height: 1.3;
  letter-spacing: 0.08em;
}

.ledger-row-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.38rem;
  max-width: 18rem;
}

.ledger-row-meta span {
  display: inline-flex;
  align-items: center;
  min-height: 1.72rem;
  padding: 0.28rem 0.55rem;
  color: var(--rankings-ink, #332c22);
  border: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 62%, transparent);
  background: color-mix(in srgb, var(--rankings-paper, #f6ecd8) 72%, transparent);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  line-height: 1.15;
  text-transform: uppercase;
}

.ledger-row-description {
  max-width: 72ch;
  margin: 0.8rem 0 0;
  color: color-mix(in srgb, var(--rankings-ink, #332c22) 78%, transparent);
  font-size: 0.98rem;
  line-height: 1.7;
  text-wrap: pretty;
}

.ledger-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.46rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.ledger-preview li {
  display: inline-flex;
  align-items: baseline;
  max-width: 100%;
  min-height: 2rem;
  color: var(--rankings-ink, #332c22);
  border: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 52%, transparent);
  background: color-mix(in srgb, white 42%, var(--rankings-paper, #f6ecd8));
}

.preview-rank {
  align-self: stretch;
  display: inline-flex;
  align-items: center;
  padding: 0.32rem 0.45rem;
  color: var(--rankings-seal, #aa352d);
  border-right: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 46%, transparent);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.06em;
  line-height: 1.1;
  text-transform: uppercase;
}

.preview-name {
  min-width: 0;
  padding: 0.32rem 0.52rem;
  font-size: 0.84rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.ledger-preview-empty {
  margin: 1rem 0 0;
  color: color-mix(in srgb, var(--rankings-ink, #332c22) 58%, transparent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ledger-row-facts {
  display: grid;
  align-content: start;
  gap: 0.65rem;
  margin: 0;
}

.ledger-row-facts div {
  display: grid;
  gap: 0.16rem;
  padding: 0.62rem 0.72rem;
  border: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 48%, transparent);
  background: color-mix(in srgb, var(--rankings-paper, #f6ecd8) 62%, transparent);
}

.ledger-row-facts dt {
  color: color-mix(in srgb, var(--rankings-accent, #8a7448) 78%, var(--rankings-ink, #332c22));
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  line-height: 1.1;
  text-transform: uppercase;
}

.ledger-row-facts dd {
  margin: 0;
  color: var(--rankings-title-ink, #2c251b);
  font-family: var(--font-heading);
  font-size: 1rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

@media (max-width: 860px) {
  .ranking-ledger-row {
    grid-template-columns: 1fr;
  }

  .ledger-row-facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .ranking-ledger-row {
    padding: 1rem;
  }

  .ranking-ledger-row::before {
    inset: 0.32rem;
  }

  .ledger-row-heading {
    flex-direction: column;
  }

  .ledger-row-meta {
    justify-content: flex-start;
  }

  .ledger-row-facts {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ranking-ledger-row {
    transition: none;
  }

  .ranking-ledger-row:hover {
    transform: none;
  }
}
</style>
