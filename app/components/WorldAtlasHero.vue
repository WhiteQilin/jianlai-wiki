<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  chinese?: string
  bannerImage?: string
  totalCount: number
  heavenCount: number
  verifiedCount: number
  associatedLinkCount: number
}>()

const sealMarks = computed(() => {
  const source = props.chinese || props.title || 'Atlas'
  return [...source].filter((char) => char.trim()).slice(0, 4)
})

const ledgerStats = computed(() => [
  {
    value: props.heavenCount,
    label: 'Heavens',
  },
  {
    value: props.verifiedCount,
    label: 'Verified',
  },
  {
    value: props.associatedLinkCount,
    label: 'Associated links',
  },
])
</script>

<template>
  <section class="world-atlas-hero" aria-labelledby="world-atlas-title">
    <div
      v-if="bannerImage"
      class="hero-banner"
      :style="{ backgroundImage: `url(${bannerImage})` }"
      aria-hidden="true"
    ></div>
    <div class="hero-wash" aria-hidden="true"></div>
    <div class="hero-ink-ridge" aria-hidden="true"></div>

    <div class="hero-inner">
      <div class="hero-copy">
        <p class="hero-kicker">Mountain-River Atlas / Gazetteer</p>
        <h1 id="world-atlas-title" class="hero-title">
          <span>{{ title }}</span>
          <span v-if="chinese" class="hero-title-zh zh-display">{{ chinese }}</span>
        </h1>
        <p class="hero-description">
          A compact record of known heavens, continents, cities, walls, grotto-heavens, and named places.
        </p>
      </div>

      <aside class="hero-ledger" aria-label="World atlas summary">
        <div class="ledger-total">
          <span class="ledger-number">{{ totalCount }}</span>
          <span class="ledger-label">Mountain-river records</span>
        </div>
        <div class="ledger-grid">
          <div v-for="stat in ledgerStats" :key="stat.label" class="ledger-stat">
            <span>{{ stat.value }}</span>
            <small>{{ stat.label }}</small>
          </div>
        </div>
      </aside>
    </div>

    <div class="seal-drift" aria-hidden="true">
      <span v-for="mark in sealMarks" :key="mark" class="seal-mark">{{ mark }}</span>
    </div>
  </section>
</template>

<style scoped>
.world-atlas-hero {
  position: relative;
  min-height: clamp(440px, 62vh, 660px);
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid var(--c-divider);
  background:
    linear-gradient(115deg, color-mix(in srgb, var(--c-paper-alt) 88%, transparent), color-mix(in srgb, var(--c-bg-soft) 84%, transparent)),
    var(--c-bg);
}

.hero-banner {
  position: absolute;
  inset: 0;
  z-index: -4;
  background-size: cover;
  background-position: center;
  opacity: 0.22;
  filter: saturate(0.78) contrast(1.04);
  transform: scale(1.03);
}

.hero-wash {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    linear-gradient(90deg, var(--c-bg) 0%, color-mix(in srgb, var(--c-bg) 78%, transparent) 45%, transparent 100%),
    linear-gradient(180deg, transparent 0%, var(--c-bg) 100%),
    url('/images/textures/ink-wash-01.webp');
  background-size: auto, auto, cover;
  background-blend-mode: normal, normal, multiply;
  opacity: 0.84;
}

.hero-ink-ridge {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  z-index: -1;
  height: clamp(6rem, 17vw, 14rem);
  background:
    linear-gradient(180deg, transparent, color-mix(in srgb, var(--c-bg) 94%, transparent)),
    radial-gradient(ellipse at 18% 100%, color-mix(in srgb, var(--world-pine, #2f5b50) 17%, transparent) 0 24%, transparent 54%),
    radial-gradient(ellipse at 48% 104%, color-mix(in srgb, var(--c-ink) 12%, transparent) 0 26%, transparent 58%),
    radial-gradient(ellipse at 78% 100%, color-mix(in srgb, var(--c-bronze) 17%, transparent) 0 20%, transparent 50%);
  opacity: 0.76;
  pointer-events: none;
}

.hero-inner {
  width: min(1200px, calc(100% - 4rem));
  min-height: inherit;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 360px);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  padding: calc(var(--header-height) + 2.8rem) 0 4.25rem;
}

.hero-copy {
  max-width: 720px;
}

.hero-kicker {
  display: inline-flex;
  margin: 0;
  padding-bottom: 0.45rem;
  color: var(--world-pine, var(--c-teal-accent));
  border-bottom: 1px solid color-mix(in srgb, var(--world-pine, var(--c-teal-accent)) 42%, transparent);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  line-height: 1.25;
  letter-spacing: 0;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin: 1.2rem 0 1rem;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: clamp(4rem, 8vw, 6.8rem);
  font-weight: 500;
  line-height: 0.94;
  letter-spacing: 0;
  text-wrap: balance;
}

.hero-title-zh {
  color: color-mix(in srgb, var(--c-ink) 72%, var(--c-seal-red));
  font-size: clamp(3rem, 6.7vw, 5.4rem);
  line-height: 1;
  letter-spacing: 0;
}

.hero-description {
  max-width: 52ch;
  margin: 0;
  color: var(--c-text-2);
  font-size: 1.06rem;
  line-height: 1.72;
  text-wrap: pretty;
}

.hero-ledger {
  position: relative;
  align-self: end;
  padding: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--world-pine, var(--c-ink)) 22%, var(--c-border));
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-paper-alt) 82%, transparent), color-mix(in srgb, var(--c-bg-soft) 88%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
  box-shadow: 0 24px 48px color-mix(in srgb, var(--world-pine, #2f5b50) 10%, transparent);
}

.hero-ledger::before {
  content: '';
  position: absolute;
  inset: 0.55rem;
  border: 1px solid color-mix(in srgb, var(--c-border) 62%, transparent);
  border-radius: 5px;
  pointer-events: none;
}

.ledger-total,
.ledger-grid {
  position: relative;
  z-index: 1;
}

.ledger-total {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0.8rem 1.05rem;
  border-bottom: 1px solid var(--c-divider);
}

.ledger-number {
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 5rem;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
}

.ledger-label {
  max-width: 9rem;
  color: var(--c-text-2);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.35;
  text-align: right;
}

.ledger-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  padding: 1px;
  margin-top: 1rem;
  background: var(--c-divider);
}

.ledger-stat {
  min-height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem;
  background: color-mix(in srgb, var(--c-bg) 84%, var(--c-bg-soft));
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
  font-size: 0.72rem;
  line-height: 1.35;
  text-align: right;
}

.seal-drift {
  position: absolute;
  right: max(1rem, calc((100% - 1200px) / 2));
  top: calc(var(--header-height) + 1rem);
  display: grid;
  grid-template-columns: repeat(2, 4rem);
  gap: 0.65rem;
  opacity: 0.16;
  transform: rotate(-5deg);
  pointer-events: none;
}

.seal-mark {
  width: 4rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 2px solid currentColor;
  border-radius: 4px;
  font-family: var(--font-zh-display);
  font-size: 2.25rem;
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

  .seal-drift {
    right: 1rem;
    top: calc(var(--header-height) + 0.75rem);
    grid-template-columns: repeat(2, 3rem);
  }

  .seal-mark {
    width: 3rem;
    font-size: 1.65rem;
  }
}

@media (max-width: 520px) {
  .world-atlas-hero {
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
    font-size: 2.75rem;
  }

  .hero-ledger {
    padding: 0.9rem;
  }

  .ledger-total {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.4rem;
  }

  .ledger-number {
    font-size: 3.7rem;
  }

  .ledger-label {
    max-width: none;
    text-align: left;
  }

  .ledger-stat {
    min-height: 4rem;
    padding: 0.75rem;
  }

  .seal-drift {
    opacity: 0.1;
  }
}
</style>
