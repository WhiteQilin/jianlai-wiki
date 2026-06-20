<script setup lang="ts">
import { ref, computed } from 'vue'

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

const activeCategory = ref('All')
const meta = useSectionMeta('rankings')
const categoryOrder = ['Realm-Ladder', 'Named-List', 'Tier-List']
const filterCategories = ['All', ...categoryOrder]

const { data: items } = await useAsyncData('rankings-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/rankings/%')
    .all()
})

const normalizeText = (value: unknown, fallback = '') => (typeof value === 'string' && value.trim() ? value.trim() : fallback)

function formatValue(value: unknown, fallback = 'Unverified') {
  const text = normalizeText(value, fallback)
  return text
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function categoryWeight(category: string) {
  const index = categoryOrder.indexOf(category)
  return index === -1 ? categoryOrder.length : index
}

function toPreviewEntries(value: unknown): RankingPreviewEntry[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((entry) => entry && typeof entry === 'object' && typeof entry.name === 'string' && entry.name.trim())
    .slice(0, 3)
    .map((entry) => ({
      rank: typeof entry.rank === 'number' || typeof entry.rank === 'string' ? entry.rank : undefined,
      name: entry.name.trim(),
    }))
}

function entryCount(value: unknown) {
  return Array.isArray(value)
    ? value.filter((entry) => entry && typeof entry === 'object' && typeof entry.name === 'string' && entry.name.trim()).length
    : 0
}

const ledgerRecords = computed<RankingLedgerRecord[]>(() =>
  ((items.value ?? []) as any[])
    .map((item) => ({
      path: normalizeText(item.path),
      title: normalizeText(item.title, 'Untitled Ledger'),
      chinese: normalizeText(item.chinese),
      category: normalizeText(item.category, 'Named-List'),
      listType: normalizeText(item.listType || item.subcategory, 'Ranking List'),
      entryCount: entryCount(item.entries),
      verificationStatus: formatValue(item.verificationStatus, 'To Be Verified'),
      lastUpdated: normalizeText(item.lastUpdated),
      description: normalizeText(item.description, 'This ranking ledger is awaiting detailed inscription.'),
      previewEntries: toPreviewEntries(item.entries),
    }))
    .filter((record) => record.path)
    .sort((a, b) => categoryWeight(a.category) - categoryWeight(b.category) || a.title.localeCompare(b.title)),
)

const filteredItems = computed(() => ledgerRecords.value.filter((item) => matchesCategory(item.category, activeCategory.value)))
const totalEntries = computed(() => ledgerRecords.value.reduce((total, item) => total + item.entryCount, 0))

const filterTabs = computed(() => {
  return filterCategories.map((category) => ({
    category,
    count: category === 'All'
      ? ledgerRecords.value.length
      : ledgerRecords.value.filter((item) => matchesCategory(item.category, category)).length,
  }))
})

function selectCategory(category: string) {
  activeCategory.value = category
}

useSeoMeta({
  title: meta.title,
  description: meta.description,
  ogTitle: meta.title,
  ogDescription: meta.description,
})
</script>

<template>
  <div class="rankings-page" data-jl-section="rankings">
    <section class="rankings-hero" aria-labelledby="rankings-title">
      <div class="rankings-hero-mark" aria-hidden="true">榜</div>
      <div class="rankings-hero-frame" aria-hidden="true"></div>

      <div class="rankings-hero-copy">
        <p class="rankings-hero-kicker">Celestial archive ledger</p>
        <h1 id="rankings-title">Rankings & Lists</h1>
        <p class="rankings-hero-zh">榜单</p>
        <p class="rankings-hero-desc">Tier lists, realm ladders, and named rosters entered as formal records of the Jian Lai world.</p>
      </div>

      <dl class="rankings-ledger-summary" aria-label="Rankings ledger summary">
        <div>
          <dt>Ledgers</dt>
          <dd>{{ ledgerRecords.length }}</dd>
        </div>
        <div>
          <dt>Inscribed Entries</dt>
          <dd>{{ totalEntries }}</dd>
        </div>
        <div>
          <dt>Register Types</dt>
          <dd>{{ categoryOrder.length }}</dd>
        </div>
      </dl>
    </section>

    <div class="mdc-content rankings-content">
      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <div class="rankings-filter" aria-label="Filter ranking ledgers by type">
          <span class="rankings-filter-label">Registry Filter</span>
          <div class="rankings-filter-list">
            <button
              v-for="tab in filterTabs"
              :key="tab.category"
              type="button"
              class="rankings-filter-button"
              :class="{ 'is-active': tab.category === activeCategory }"
              :aria-pressed="tab.category === activeCategory"
              @click="selectCategory(tab.category)"
            >
              <span>{{ tab.category }}</span>
              <strong>{{ tab.count }}</strong>
            </button>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal v-if="filteredItems.length > 0" animation="reveal-fade-up" delay="stagger-2">
        <RankingsRankingLedger :records="filteredItems" />
      </ScrollReveal>

      <ScrollReveal v-if="filteredItems.length > 0 && activeCategory === 'All'" animation="reveal-fade-up" delay="stagger-3">
        <p class="rankings-register-count">
          <span class="count-number">{{ totalEntries }}</span> inscribed entries across {{ ledgerRecords.length }} registers
        </p>
      </ScrollReveal>

      <ScrollReveal v-else animation="reveal-fade-up">
        <section class="rankings-empty" aria-live="polite">
          <p class="rankings-empty-seal" aria-hidden="true">榜</p>
          <h2>No ledgers entered under this register yet</h2>
          <p>The {{ activeCategory }} registry is awaiting verified inscriptions. Return to the complete celestial ledger to browse all current rankings.</p>
          <button type="button" class="rankings-empty-action" @click="selectCategory('All')">Show all ledgers</button>
        </section>
      </ScrollReveal>

      <InkDivider type="brush" />

      <ScrollReveal animation="reveal-fade-up">
        <RelatedLinks
          :links="[
            { link: '/characters', titleZh: '人物志', titleEn: 'Characters', bgChar: '人' },
            { link: '/cultivation', titleZh: '山上修行', titleEn: 'Cultivation', bgChar: '修' },
            { link: '/swordsmanship', titleZh: '剑术神通', titleEn: 'Swordsmanship', bgChar: '剑' }
          ]"
        />
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>
.rankings-page {
  --rankings-accent: var(--jl-section-accent, #8a7448);
  --rankings-paper: var(--jl-section-paper, #f6ecd8);
  --rankings-ink: var(--jl-section-ink, #332c22);
  --rankings-mist: var(--jl-section-mist, #e8dfcc);
  --rankings-frame: var(--jl-section-frame, rgba(149, 113, 58, 0.32));
  --rankings-seal: var(--jl-section-seal, #aa352d);
  --rankings-gold: var(--jl-section-gold, #b29555);
  --rankings-title-ink: var(--jl-section-title-ink, #2c251b);
  min-height: 100dvh;
  color: var(--rankings-ink);
  background:
    radial-gradient(circle at 18% 8%, color-mix(in srgb, var(--rankings-gold) 12%, transparent), transparent 28rem),
    radial-gradient(circle at 88% 12%, color-mix(in srgb, var(--rankings-seal) 7%, transparent), transparent 24rem),
    linear-gradient(180deg, color-mix(in srgb, var(--rankings-paper) 84%, white), var(--c-paper) 42%, color-mix(in srgb, var(--rankings-paper) 68%, white));
}

.rankings-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(16rem, 24rem);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: end;
  min-height: clamp(28rem, 58vh, 39rem);
  padding: calc(var(--header-height) + clamp(3rem, 7vw, 5rem)) clamp(1rem, 5vw, 5rem) clamp(3rem, 6vw, 5rem);
  overflow: hidden;
  border-bottom: 1px solid color-mix(in srgb, var(--rankings-frame) 86%, transparent);
}

.rankings-hero::after {
  content: '';
  position: absolute;
  left: clamp(1rem, 5vw, 5rem);
  right: clamp(1rem, 5vw, 5rem);
  bottom: 1.35rem;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--rankings-gold) 56%, transparent), transparent);
}

.rankings-hero-mark {
  position: absolute;
  right: clamp(0.5rem, 5vw, 4rem);
  bottom: -0.22em;
  color: var(--rankings-title-ink);
  font-family: var(--font-zh-display);
  font-size: clamp(11rem, 24vw, 22rem);
  line-height: 1;
  opacity: 0.09;
  pointer-events: none;
}

.rankings-hero-frame {
  position: absolute;
  inset: calc(var(--header-height) + 1.4rem) clamp(1rem, 5vw, 5rem) 1.25rem;
  border: 1px solid color-mix(in srgb, var(--rankings-frame) 42%, transparent);
  border-left-width: 2px;
  border-left-color: color-mix(in srgb, var(--rankings-frame) 58%, transparent);
  pointer-events: none;
}

.rankings-hero-copy,
.rankings-ledger-summary {
  position: relative;
  z-index: 1;
}

.rankings-hero-kicker {
  margin: 0 0 1rem;
  color: color-mix(in srgb, var(--rankings-accent) 86%, var(--rankings-ink));
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  line-height: 1.25;
  text-transform: uppercase;
}

.rankings-hero h1 {
  max-width: 11ch;
  margin: 0;
  color: var(--rankings-title-ink);
  font-family: var(--font-heading);
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.rankings-hero-zh {
  margin: 1rem 0 0;
  color: var(--rankings-seal);
  font-family: var(--font-zh-display);
  font-size: clamp(1.55rem, 3.2vw, 2.35rem);
  line-height: 1.2;
  letter-spacing: 0.18em;
}

.rankings-hero-desc {
  max-width: 62ch;
  margin: clamp(1.25rem, 3vw, 1.75rem) 0 0;
  color: color-mix(in srgb, var(--rankings-ink) 78%, transparent);
  font-size: clamp(1.02rem, 1.5vw, 1.18rem);
  line-height: 1.8;
  text-wrap: pretty;
}

.rankings-ledger-summary {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
  border: 1px solid color-mix(in srgb, var(--rankings-frame) 52%, transparent);
  border-left: 2px solid color-mix(in srgb, var(--rankings-frame) 68%, transparent);
  background: color-mix(in srgb, var(--rankings-paper) 52%, transparent);
}

.rankings-ledger-summary div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: baseline;
  padding: 0.78rem 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--rankings-frame) 38%, transparent);
}

.rankings-ledger-summary div:last-child {
  border-bottom: none;
}

.rankings-ledger-summary dt {
  color: color-mix(in srgb, var(--rankings-accent) 82%, var(--rankings-ink));
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  line-height: 1.2;
  text-transform: uppercase;
}

.rankings-ledger-summary dd {
  margin: 0;
  color: var(--rankings-title-ink);
  font-family: var(--font-heading);
  font-size: clamp(1.35rem, 3vw, 1.9rem);
  line-height: 1;
}

.rankings-content {
  padding-top: clamp(2.25rem, 5vw, 4rem);
}

.rankings-filter {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: clamp(1.5rem, 3vw, 2.25rem);
  padding-bottom: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--rankings-frame) 72%, transparent);
}

.rankings-filter-label {
  padding-top: 0.58rem;
  color: color-mix(in srgb, var(--rankings-accent) 82%, var(--rankings-ink));
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  line-height: 1.25;
  text-transform: uppercase;
  white-space: nowrap;
}

.rankings-filter-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}

.rankings-filter-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0.5rem 0.72rem;
  color: var(--rankings-ink);
  border: 1px solid color-mix(in srgb, var(--rankings-frame) 54%, transparent);
  background: color-mix(in srgb, var(--rankings-paper) 58%, transparent);
  cursor: pointer;
  font: inherit;
  transition:
    border-color 0.24s ease,
    background-color 0.24s ease,
    color 0.24s ease;
}

.rankings-filter-button span {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.rankings-filter-button strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.45rem;
  min-height: 1.45rem;
  color: var(--rankings-seal);
  border: 1px solid color-mix(in srgb, var(--rankings-seal) 34%, transparent);
  font-family: var(--font-heading);
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1;
}

.rankings-filter-button:hover,
.rankings-filter-button:focus-visible {
  border-color: color-mix(in srgb, var(--rankings-gold) 70%, var(--rankings-frame));
  background: color-mix(in srgb, var(--rankings-gold) 9%, var(--rankings-paper));
  outline: none;
}

.rankings-filter-button.is-active {
  color: var(--rankings-paper);
  border-color: var(--rankings-ink);
  background: var(--rankings-ink);
}

.rankings-filter-button.is-active strong {
  color: var(--rankings-paper);
  border-color: color-mix(in srgb, var(--rankings-paper) 44%, transparent);
}

.rankings-register-count {
  margin: 1.5rem 0 0;
  padding: 0.85rem 0;
  border-top: 1px solid color-mix(in srgb, var(--rankings-frame) 48%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--rankings-frame) 48%, transparent);
  color: color-mix(in srgb, var(--rankings-ink) 62%, transparent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: center;
}

.rankings-register-count .count-number {
  color: var(--rankings-seal);
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 500;
}

.rankings-empty {
  display: grid;
  justify-items: center;
  gap: 0.8rem;
  padding: clamp(3rem, 8vw, 5rem) 1.25rem;
  text-align: center;
  border: 1px solid color-mix(in srgb, var(--rankings-frame) 62%, transparent);
  background: color-mix(in srgb, var(--rankings-paper) 72%, transparent);
}

.rankings-empty-seal {
  margin: 0;
  color: var(--rankings-seal);
  font-family: var(--font-zh-display);
  font-size: 2.5rem;
  line-height: 1;
}

.rankings-empty h2 {
  margin: 0;
  color: var(--rankings-title-ink);
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 500;
}

.rankings-empty p {
  max-width: 58ch;
  margin: 0;
  color: color-mix(in srgb, var(--rankings-ink) 74%, transparent);
  line-height: 1.7;
}

.rankings-empty-action {
  min-height: 2.6rem;
  margin-top: 0.5rem;
  padding: 0.6rem 1rem;
  color: var(--rankings-paper);
  border: 1px solid var(--rankings-ink);
  background: var(--rankings-ink);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@media (max-width: 860px) {
  .rankings-hero {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .rankings-ledger-summary {
    max-width: 34rem;
  }

  .rankings-filter {
    flex-direction: column;
  }

  .rankings-filter-list {
    justify-content: flex-start;
  }
}

@media (max-width: 620px) {
  .rankings-hero {
    min-height: auto;
    padding-inline: 1rem;
  }

  .rankings-hero-frame {
    inset-inline: 0.75rem;
  }

  .rankings-hero h1 {
    max-width: 9ch;
    font-size: clamp(2.55rem, 16vw, 4rem);
  }

  .rankings-filter-button {
    width: 100%;
    justify-content: space-between;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rankings-filter-button {
    transition: none;
  }
}
</style>
