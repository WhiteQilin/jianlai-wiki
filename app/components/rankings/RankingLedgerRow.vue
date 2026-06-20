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
  if (rank === undefined || rank === null || rank === '') return null
  return String(rank)
}

function isNumericRank(rank?: string | number) {
  const r = rankLabel(rank)
  if (!r) return false
  return r.match(/^\d+$/) !== null
}

const CIRCLES = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']
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

      <div v-if="record.previewEntries.length" class="ledger-preview" aria-label="Preview entries">
        <template v-for="(entry, i) in record.previewEntries" :key="`${entry.rank || 'listed'}-${entry.name}`">
          <span class="preview-marker" aria-hidden="true">{{ CIRCLES[i] || '' }}</span>
          <span class="preview-rank" v-if="isNumericRank(entry.rank)">{{ rankLabel(entry.rank) }}</span>
          <span class="preview-name">{{ entry.name }}</span>
          <span v-if="i < record.previewEntries.length - 1" class="preview-sep" aria-hidden="true">;</span>
        </template>
      </div>
      <p v-else class="ledger-preview-empty">Roster awaiting inscription.</p>
    </div>

    <dl class="ledger-row-facts" aria-label="Register notes">
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
  padding-left: 1.05rem;
  color: var(--rankings-ink, #332c22);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--rankings-paper, #f6ecd8) 92%, white), color-mix(in srgb, var(--rankings-mist, #e8dfcc) 72%, white)),
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--rankings-gold, #b29555) 10%, transparent), transparent 18rem);
  border: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 78%, transparent);
  border-left-width: 2px;
  border-left-color: color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.42)) 82%, transparent);
  transition:
    border-left-color 0.24s ease,
    background-color 0.24s ease,
    transform 0.24s ease;
}

.ranking-ledger-row:hover {
  border-left-color: color-mix(in srgb, var(--rankings-gold, #b29555) 72%, var(--rankings-frame, rgba(149, 113, 58, 0.32)));
  transform: translateY(-1px);
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
  align-items: baseline;
  gap: 0.28rem;
  margin: 0.95rem 0 0;
}

.ledger-preview .preview-marker {
  color: var(--rankings-seal, #aa352d);
  font-size: 0.75rem;
  line-height: 1.4;
  flex-shrink: 0;
}

.ledger-preview .preview-rank {
  color: color-mix(in srgb, var(--rankings-seal, #aa352d) 68%, var(--rankings-ink, #332c22));
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  line-height: 1.4;
  text-transform: uppercase;
  flex-shrink: 0;
}

.ledger-preview .preview-name {
  color: color-mix(in srgb, var(--rankings-ink, #332c22) 88%, transparent);
  font-size: 0.9rem;
  line-height: 1.4;
  flex-shrink: 0;
}

.ledger-preview .preview-sep {
  color: color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.28)) 52%, transparent);
  font-size: 0.8rem;
  line-height: 1.4;
  margin-left: 0.1rem;
  flex-shrink: 0;
}

.ledger-preview-empty {
  margin: 0.95rem 0 0;
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
    padding-left: 0.95rem;
  }

  .ledger-row-facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .ranking-ledger-row {
    padding: 1rem;
    padding-left: 0.9rem;
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

  .ledger-preview {
    gap: 0.2rem;
  }

  .ledger-preview .preview-name {
    font-size: 0.86rem;
  }
}

@media (max-width: 480px) {
  .ledger-preview .preview-sep {
    display: none;
  }

  .ledger-preview {
    flex-direction: column;
    gap: 0.2rem;
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
