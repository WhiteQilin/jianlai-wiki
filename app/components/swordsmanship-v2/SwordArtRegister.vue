<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  entries: Array<{
    path: string
    title: string
    chinese?: string
    category?: string
    status?: string
    importance?: string
    verificationStatus?: string
    lastUpdated?: string
    tags: string[]
  }>
  categoryFilters: string[]
  existingPaths: string[]
}>()

const activeCategory = ref('All')

const filteredEntries = computed(() => {
  if (activeCategory.value === 'All') return props.entries
  return props.entries.filter((entry) => entry.category === activeCategory.value)
})

const normalizeVerification = (value?: string) => {
  if (!value) return 'Review pending'
  if (value.toLowerCase() === 'to-be-verified') return 'To Be Verified'
  return value
}

const recordNumber = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section class="sword-art-register" aria-labelledby="sword-register-title">
    <header class="register-header">
      <div class="register-title-block">
        <p class="register-kicker">Blade ledger</p>
        <h2 id="sword-register-title">Recorded Arts Register</h2>
        <p>Compact archive index for sword arts currently inscribed in the wiki records.</p>
      </div>

      <div class="register-count" aria-label="Filtered sword art count">
        <strong>{{ filteredEntries.length }}</strong>
        <span>{{ filteredEntries.length === 1 ? 'record' : 'records' }}</span>
      </div>
    </header>

    <div v-if="categoryFilters.length > 1" class="register-filters" aria-label="Sword art category filters">
      <button
        v-for="cat in categoryFilters"
        :key="cat"
        type="button"
        class="filter-btn"
        :class="{ 'is-active': activeCategory === cat }"
        :aria-pressed="activeCategory === cat"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div class="register-scroll" role="region" aria-label="Sword art ledger entries">
      <ol class="ledger-list">
        <li
          v-for="(entry, index) in filteredEntries"
          :key="entry.path"
          class="ledger-row"
          :class="{ 'is-ghosted': !existingPaths.includes(entry.path) }"
        >
          <span class="ledger-index" aria-hidden="true">{{ recordNumber(index) }}</span>

          <div class="ledger-name">
            <NuxtLink v-if="existingPaths.includes(entry.path)" :to="entry.path" class="ledger-link">
              <span>{{ entry.title }}</span>
              <small v-if="entry.chinese">{{ entry.chinese }}</small>
            </NuxtLink>

            <span v-else class="ledger-link ledger-link--ghost">
              <span>{{ entry.title }}</span>
              <small v-if="entry.chinese">{{ entry.chinese }}</small>
            </span>
          </div>

          <div class="ledger-taxonomy">
            <span>{{ entry.category || 'Unsorted art' }}</span>
            <small>{{ entry.importance || 'background' }}</small>
          </div>

          <div class="ledger-status">
            <span>{{ normalizeVerification(entry.verificationStatus) }}</span>
            <small>{{ entry.lastUpdated || 'date pending' }}</small>
          </div>

          <div class="ledger-tags" aria-label="Record tags">
            <span v-for="tag in entry.tags.slice(0, 3)" :key="tag">{{ tag }}</span>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.sword-art-register {
  position: relative;
  padding: clamp(1rem, 2vw, 1.4rem);
  border: 1px solid rgba(32, 63, 77, 0.18);
  border-top: 2px solid rgba(143, 49, 43, 0.2);
  background:
    linear-gradient(180deg, rgba(232, 242, 238, 0.85), rgba(212, 228, 225, 0.75));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.42), 0 24px 62px rgba(4, 20, 28, 0.12);
  overflow: hidden;
}

.sword-art-register::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, rgba(32, 63, 77, 0.05) 0 1px, transparent 1px 3.25rem),
    linear-gradient(90deg, rgba(143, 49, 43, 0.08), transparent 16rem);
  pointer-events: none;
}

.register-header,
.register-filters,
.register-scroll {
  position: relative;
}

.register-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.5rem;
  align-items: end;
  padding: clamp(1rem, 2.5vw, 2rem);
  border: 1px solid rgba(32, 63, 77, 0.11);
  background: rgba(239, 246, 241, 0.54);
}

.register-kicker {
  margin: 0 0 0.55rem;
  color: rgba(143, 49, 43, 0.76);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.16em;
  line-height: 1.4;
  text-transform: uppercase;
}

.register-title-block h2 {
  margin: 0;
  color: #0a2634;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 4.1rem);
  font-weight: 400;
  letter-spacing: -0.065em;
  line-height: 0.96;
  text-wrap: balance;
}

.register-title-block p:not(.register-kicker) {
  max-width: 54ch;
  margin: 0.85rem 0 0;
  color: rgba(12, 40, 53, 0.62);
  font-size: 0.96rem;
  line-height: 1.65;
}

.register-count {
  width: 7.2rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  align-content: center;
  border: 1px solid rgba(143, 49, 43, 0.34);
  color: rgba(143, 49, 43, 0.86);
  background: rgba(246, 240, 229, 0.62);
  transform: rotate(3deg);
}

.register-count strong {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.register-count span {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.register-filters {
  margin: 1.1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  position: relative;
  padding: 0.58rem 0.74rem;
  border: 1px solid rgba(32, 63, 77, 0.14);
  color: rgba(17, 45, 58, 0.68);
  background: rgba(235, 243, 238, 0.56);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
  transition: border-color 0.22s ease, color 0.22s ease, background-color 0.22s ease, transform 0.22s ease;
}

.filter-btn::after {
  content: '';
  position: absolute;
  left: 0.5rem;
  right: 0.5rem;
  bottom: -0.18rem;
  height: 0.45rem;
  background: url('/images/ui/generated/hover-marks/generated-underline-ink-thin-04.webp') no-repeat center / 100% auto;
  opacity: 0;
  filter: hue-rotate(172deg) saturate(0.5);
  transition: opacity 0.22s ease;
}

.filter-btn:hover,
.filter-btn:focus-visible,
.filter-btn.is-active {
  border-color: rgba(143, 49, 43, 0.42);
  color: #7d251e;
  background: rgba(246, 241, 231, 0.78);
  outline: none;
  transform: translateY(-1px);
}

.filter-btn:focus-visible {
  outline: 2px solid rgba(143, 49, 43, 0.72);
  outline-offset: 0.18rem;
}

.filter-btn.is-active::after {
  opacity: 0.8;
}

.register-scroll {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(143, 49, 43, 0.24) transparent;
}

.ledger-list {
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid rgba(32, 63, 77, 0.14);
  border-bottom: 1px solid rgba(32, 63, 77, 0.12);
}

.ledger-row {
  position: relative;
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1.4fr) minmax(0, 0.85fr) minmax(0, 0.85fr) minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
  min-height: 6rem;
  padding: 1rem 1rem 1rem 0;
  border-bottom: 1px solid rgba(32, 63, 77, 0.09);
  background:
    linear-gradient(90deg, rgba(239, 246, 241, 0.74), rgba(239, 246, 241, 0.34)),
    var(--jl-hover-brush-soft-01);
  background-repeat: no-repeat;
  background-size: 100% 100%, 0 100%;
  background-position: center, left center;
  transition: background-size 0.28s ease, transform 0.24s ease;
}

.ledger-row:last-child {
  border-bottom: 0;
}

.ledger-row:hover {
  background-size: 100% 100%, 18rem 100%;
  transform: translateX(2px);
}

.ledger-row::before {
  content: '';
  position: absolute;
  left: 3rem;
  top: 1rem;
  bottom: 1rem;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(143, 49, 43, 0.35), transparent);
}

.ledger-index {
  justify-self: center;
  color: rgba(143, 49, 43, 0.72);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
}

.ledger-name,
.ledger-taxonomy,
.ledger-status,
.ledger-tags {
  min-width: 0;
}

.ledger-link {
  min-width: 0;
  display: grid;
  gap: 0.18rem;
  color: #0b2735;
  text-decoration: none;
}

.ledger-link span {
  overflow-wrap: anywhere;
  font-family: var(--font-heading);
  font-size: 1.18rem;
  font-weight: 500;
  line-height: 1.08;
}

.ledger-link small {
  color: rgba(17, 45, 58, 0.54);
  font-family: var(--font-zh-display);
  font-size: 0.95rem;
  line-height: 1;
}

.ledger-link:hover,
.ledger-link:focus-visible {
  color: #7d251e;
  outline: none;
}

.ledger-link:focus-visible {
  outline: 2px solid rgba(143, 49, 43, 0.72);
  outline-offset: 0.2rem;
}

.ledger-link--ghost {
  color: rgba(17, 45, 58, 0.46);
}

.ledger-taxonomy,
.ledger-status {
  display: grid;
  gap: 0.28rem;
}

.ledger-taxonomy span,
.ledger-status span {
  color: rgba(17, 45, 58, 0.72);
  font-size: 0.88rem;
  line-height: 1.3;
}

.ledger-taxonomy small,
.ledger-status small {
  color: rgba(17, 45, 58, 0.44);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  line-height: 1.2;
  text-transform: uppercase;
}

.ledger-status span {
  color: rgba(143, 49, 43, 0.82);
}

.ledger-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.ledger-tags span {
  max-width: 100%;
  overflow: hidden;
  padding: 0.26rem 0.42rem;
  border: 1px solid rgba(32, 63, 77, 0.1);
  color: rgba(17, 45, 58, 0.48);
  background: rgba(235, 243, 238, 0.46);
  font-family: var(--font-mono);
  font-size: 0.56rem;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ledger-row.is-ghosted {
  opacity: 0.62;
}

@media (max-width: 760px) {
  .sword-art-register {
    padding: 0.8rem;
  }

  .register-header {
    grid-template-columns: 1fr;
  }

  .register-count {
    width: 5.8rem;
  }

  .register-scroll {
    overflow: visible;
  }

  .ledger-list {
    min-width: 0;
  }

  .ledger-row {
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: 0.75rem 0.9rem;
    align-items: start;
    padding: 1rem 0.9rem 1rem 0;
  }

  .ledger-row::before {
    left: 2.25rem;
  }

  .ledger-name,
  .ledger-taxonomy,
  .ledger-status,
  .ledger-tags {
    grid-column: 2;
  }
}

@media (prefers-reduced-motion: reduce) {
  .filter-btn,
  .filter-btn::after,
  .ledger-row {
    transition: none;
  }

  .filter-btn:hover,
  .filter-btn:focus-visible,
  .filter-btn.is-active,
  .ledger-row:hover {
    transform: none;
  }
}
</style>
