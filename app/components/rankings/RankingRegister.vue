<script setup lang="ts">
import type { RankingEntry } from './RankingRegisterRow.vue'

const props = defineProps<{
  entries: RankingEntry[]
  category: string
  listType: string
  verificationStatus?: string
}>()

const isRealmLadder = computed(() => props.category === 'Realm-Ladder')
const isNamedList = computed(() => props.category === 'Named-List')
const isTierList = computed(() => props.category === 'Tier-List')

const validEntries = computed(() =>
  props.entries.filter((e) => e && typeof e === 'object' && typeof e.name === 'string' && e.name.trim()),
)

const categoryLabel = computed(() => {
  const cat = props.category || ''
  if (cat === 'Realm-Ladder') return 'Realm Ladder'
  if (cat === 'Named-List') return 'Named Register'
  if (cat === 'Tier-List') return 'Tier Register'
  return cat
})

const documentKicker = computed(() => {
  if (isRealmLadder.value) return 'Ascension Register'
  if (isNamedList.value) return 'Gazetted Roster'
  if (isTierList.value) return 'Tier Inventory'
  return 'Celestial Registry'
})
</script>

<template>
  <section v-if="validEntries.length > 0" class="ranking-register" aria-label="Ranking register">
    <header class="register-header">
      <div class="register-header-left">
        <span class="register-kicker">{{ documentKicker }}</span>
        <span class="register-category">{{ categoryLabel }}</span>
        <UiBrushUnderline tone="section" weight="regular" width="medium" class="register-header-underline" />
      </div>
      <span class="register-seal" aria-hidden="true">榜</span>
    </header>

    <div class="register-body">
      <ol class="register-list" :aria-label="`${validEntries.length} entries in the register`">
        <RankingsRankingRegisterRow
          v-for="(entry, index) in validEntries"
          :key="`${entry.rank || 'n'}-${entry.name}-${index}`"
          :entry="entry"
          :category="category"
          :list-type="listType"
          :index="index"
        />
      </ol>
    </div>

    <footer class="register-footer" aria-hidden="true">
      <span class="footer-rule"></span>
      <span class="footer-ornament">&#10022;</span>
      <span class="footer-rule"></span>
    </footer>
  </section>
</template>

<style scoped>
.ranking-register {
  position: relative;
  margin: 0 0 3rem;
  border: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 72%, transparent);
  border-top-width: 3px;
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--rankings-paper, #f6ecd8) 92%, white), color-mix(in srgb, var(--rankings-mist, #e8dfcc) 72%, white)),
    radial-gradient(ellipse at 100% 0%, color-mix(in srgb, var(--rankings-gold, #b29555) 12%, transparent), transparent 20rem);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.04);
}

.register-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.28)) 52%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--rankings-mist, #e8dfcc) 32%, var(--rankings-paper, #f6ecd8)), transparent);
}

.register-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  min-width: 0;
}

.register-header-underline {
  margin-top: 0.32rem;
  pointer-events: none;
}

.register-kicker {
  display: block;
  color: color-mix(in srgb, var(--rankings-accent, #8a7448) 72%, var(--rankings-ink, #332c22));
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  line-height: 1.2;
  text-transform: uppercase;
}

.register-category {
  display: block;
  color: color-mix(in srgb, var(--rankings-seal, #aa352d) 84%, var(--rankings-ink, #332c22));
  font-family: var(--font-heading);
  font-size: 1.08rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.register-seal {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  color: color-mix(in srgb, var(--rankings-seal, #aa352d) 38%, var(--rankings-accent, #8a7448));
  border: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 52%, transparent);
  background: color-mix(in srgb, var(--rankings-paper, #f6ecd8) 48%, transparent);
  font-family: var(--font-zh-display);
  font-size: 1.35rem;
  line-height: 1;
  opacity: 0.72;
}

.register-body {
  position: relative;
  z-index: 1;
}

.register-list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.24)) 38%, transparent);
}

.register-footer {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.72rem 1.25rem;
  border-top: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.28)) 52%, transparent);
  background: linear-gradient(0deg, color-mix(in srgb, var(--rankings-mist, #e8dfcc) 28%, var(--rankings-paper, #f6ecd8)), transparent);
}

.footer-rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 42%, transparent), transparent);
}

.footer-ornament {
  color: color-mix(in srgb, var(--rankings-seal, #aa352d) 28%, var(--rankings-frame, rgba(149, 113, 58, 0.28)));
  font-size: 0.68rem;
  line-height: 1;
}

@media (max-width: 680px) {
  .register-header {
    padding: 0.85rem 1rem;
  }

  .register-category {
    font-size: 1rem;
  }

  .register-seal {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1.1rem;
  }

  .register-footer {
    padding: 0.6rem 1rem;
  }
}

@media (max-width: 440px) {
  .register-header {
    padding: 0.75rem 0.85rem;
  }

  .register-kicker {
    font-size: 0.56rem;
  }

  .register-category {
    font-size: 0.94rem;
  }

  .register-footer {
    padding: 0.55rem 0.85rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ranking-register {
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.04);
  }
}
</style>
