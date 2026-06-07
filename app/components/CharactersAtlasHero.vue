<script setup lang="ts">
import { computed } from 'vue'

type ProminenceGroup = {
  label: string
  count: number
}

const props = defineProps<{
  title: string
  chinese?: string
  description?: string
  bannerImage?: string
  totalCount: number
  verifiedCount: number
  topClusterCount: number
  relationshipCount: number
  prominenceGroups?: ProminenceGroup[]
}>()

const sealMarks = computed(() => {
  const source = props.chinese || props.title || 'Characters'
  return [...source].filter((char) => char.trim()).slice(0, 4)
})

const primaryCount = computed(() => props.prominenceGroups?.find((group) => group.label === 'Primary')?.count ?? 0)
</script>

<template>
  <section class="characters-hero" aria-labelledby="characters-hero-title">
    <div
      v-if="bannerImage"
      class="hero-banner"
      :style="{ backgroundImage: `url(${bannerImage})` }"
      aria-hidden="true"
    ></div>
    <div class="hero-wash" aria-hidden="true"></div>

    <div class="hero-inner">
      <div class="hero-copy">
        <div class="hero-kicker">Character dossier wall</div>
        <h1 id="characters-hero-title" class="hero-title">
          <span>{{ title }}</span>
          <span v-if="chinese" class="hero-title-zh zh-display">{{ chinese }}</span>
        </h1>
        <p v-if="description" class="hero-description">{{ description }}</p>
      </div>

      <div class="hero-ledger" aria-label="Character archive summary">
        <div class="ledger-row ledger-row-primary">
          <span class="ledger-value">{{ totalCount }}</span>
          <span class="ledger-label">Dossiers</span>
        </div>
        <div class="ledger-grid">
          <div class="ledger-stat">
            <span>{{ verifiedCount }}</span>
            <small>Verified</small>
          </div>
          <div class="ledger-stat">
            <span>{{ relationshipCount }}</span>
            <small>Named ties</small>
          </div>
          <div class="ledger-stat">
            <span>{{ topClusterCount }}</span>
            <small>Largest cluster</small>
          </div>
          <div class="ledger-stat">
            <span>{{ primaryCount }}</span>
            <small>Primary</small>
          </div>
        </div>
      </div>
    </div>

    <div class="seal-wall" aria-hidden="true">
      <span v-for="mark in sealMarks" :key="mark" class="seal-mark">{{ mark }}</span>
    </div>
  </section>
</template>

<style scoped>
.characters-hero {
  position: relative;
  min-height: clamp(460px, 64vh, 680px);
  overflow: hidden;
  isolation: isolate;
  background:
    linear-gradient(115deg, color-mix(in srgb, var(--c-paper) 92%, transparent), color-mix(in srgb, var(--c-mist-light) 82%, transparent)),
    var(--c-bg);
  border-bottom: 1px solid var(--c-divider);
}

.hero-banner {
  position: absolute;
  inset: 0;
  z-index: -3;
  background-size: cover;
  background-position: center;
  opacity: 0.32;
  filter: saturate(0.9) contrast(1.03);
  transform: scale(1.03);
}

.hero-wash {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(90deg, var(--c-bg) 0%, color-mix(in srgb, var(--c-bg) 74%, transparent) 46%, transparent 100%),
    linear-gradient(180deg, transparent 0%, var(--c-bg) 100%),
    url('/images/textures/ink-wash-01.webp');
  background-size: auto, auto, cover;
  background-blend-mode: normal, normal, multiply;
  opacity: 0.88;
}

.hero-inner {
  width: min(1200px, calc(100% - 4rem));
  min-height: inherit;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  padding: calc(var(--header-height) + 3rem) 0 4.5rem;
}

.hero-copy {
  max-width: 720px;
}

.hero-kicker {
  display: inline-flex;
  color: var(--c-seal-red);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.2;
  letter-spacing: 0;
  padding-bottom: 0.45rem;
  border-bottom: 1px solid color-mix(in srgb, var(--c-seal-red) 38%, transparent);
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin: 1.25rem 0 1rem;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 6.6rem;
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: 0;
  text-wrap: balance;
}

.hero-title-zh {
  color: color-mix(in srgb, var(--c-ink) 72%, var(--c-seal-red));
  font-size: 5.5rem;
  line-height: 1;
  letter-spacing: 0;
}

.hero-description {
  max-width: 58ch;
  margin: 0;
  color: var(--c-text-2);
  font-size: 1.12rem;
  line-height: 1.75;
  text-wrap: pretty;
}

.hero-ledger {
  position: relative;
  align-self: end;
  padding: 1.2rem;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-bg) 84%, transparent), color-mix(in srgb, var(--c-bg-soft) 92%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-blend-mode: normal, multiply;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  box-shadow: 0 22px 48px rgba(20, 20, 20, 0.08);
}

.hero-ledger::before {
  content: '';
  position: absolute;
  inset: 0.55rem;
  border: 1px solid color-mix(in srgb, var(--c-border) 60%, transparent);
  border-radius: 5px;
  pointer-events: none;
}

.ledger-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 0.8rem 1rem;
  border-bottom: 1px solid var(--c-divider);
}

.ledger-value {
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 5rem;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
}

.ledger-label {
  color: var(--c-text-2);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.2;
}

.ledger-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  padding: 1px;
  background: var(--c-divider);
  margin-top: 1rem;
}

.ledger-stat {
  min-height: 88px;
  padding: 0.95rem;
  background: color-mix(in srgb, var(--c-bg) 84%, var(--c-bg-soft));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ledger-stat span {
  color: var(--c-seal-red);
  font-family: var(--font-heading);
  font-size: 2rem;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.ledger-stat small {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  line-height: 1.35;
}

.seal-wall {
  position: absolute;
  right: max(1rem, calc((100% - 1200px) / 2));
  top: calc(var(--header-height) + 1rem);
  display: grid;
  grid-template-columns: repeat(2, 4.1rem);
  gap: 0.65rem;
  opacity: 0.2;
  transform: rotate(-4deg);
  pointer-events: none;
}

.seal-mark {
  width: 4.1rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 2px solid currentColor;
  border-radius: 4px;
  font-family: var(--font-zh-display);
  font-size: 2.35rem;
  line-height: 1;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c-seal-red) 18%, transparent);
}

@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    width: min(100% - 2rem, 720px);
    gap: 2rem;
    padding-bottom: 3rem;
  }

  .hero-ledger {
    align-self: auto;
  }

  .hero-title {
    font-size: 5rem;
  }

  .hero-title-zh {
    font-size: 4rem;
  }

  .seal-wall {
    right: 1rem;
    top: calc(var(--header-height) + 0.75rem);
    grid-template-columns: repeat(2, 3.2rem);
  }

  .seal-mark {
    width: 3.2rem;
    font-size: 1.8rem;
  }
}

@media (max-width: 520px) {
  .characters-hero {
    min-height: auto;
  }

  .hero-inner {
    width: calc(100% - 2rem);
    padding-top: calc(var(--header-height) + 2rem);
  }

  .hero-title {
    font-size: 3.35rem;
  }

  .hero-title-zh {
    font-size: 2.8rem;
  }

  .hero-ledger {
    padding: 0.9rem;
  }

  .ledger-value {
    font-size: 3.7rem;
  }

  .ledger-grid {
    grid-template-columns: 1fr 1fr;
  }

  .ledger-stat {
    min-height: 76px;
    padding: 0.75rem;
  }

  .seal-wall {
    opacity: 0.11;
  }
}
</style>
