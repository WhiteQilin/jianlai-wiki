<script setup lang="ts">
import { computed } from 'vue'
import { getAssetById } from '~/utils/assetManifest'

const props = defineProps<{
  title: string
  chinese?: string
  description?: string
  totalCount: number
  categoryCount: number
  verifiedCount: number
  primaryCount: number
  representativeSeals: string[]
}>()

// Resolve the curated hero-atmosphere asset for Factions from the manifest.
// Used as a subtle atmosphere layer, never a loud poster (DESIGN §5.1.1).
const heroAtmosphereUrl = computed(() => {
  const asset = getAssetById('asset.banner-factions-hero')
  return asset?.filePath ?? ''
})

const ledgerStats = computed(() => [
  {
    value: props.categoryCount,
    label: 'Recorded categories',
  },
  {
    value: props.verifiedCount,
    label: 'Verified records',
  },
  {
    value: props.primaryCount,
    label: 'Primary entries',
  },
])

const sealMarks = computed(() => {
  const marks = props.representativeSeals.filter((seal) => seal.trim()).slice(0, 8)
  if (marks.length) return marks
  return [...(props.chinese || props.title || 'Factions')].filter((char) => char.trim()).slice(0, 4)
})
</script>

<template>
  <section class="faction-registry-hero" aria-labelledby="faction-registry-title">
    <div class="hero-paper-grain" aria-hidden="true"></div>
    <div class="hero-ink-wash" aria-hidden="true"></div>
    <div
      v-if="heroAtmosphereUrl"
      class="hero-atmosphere"
      aria-hidden="true"
      :style="{ backgroundImage: `url('${heroAtmosphereUrl}')` }"
    ></div>

    <div class="hero-inner">
      <div class="hero-copy">
        <p class="hero-kicker">Mountain Gate Ledger / Institution Registry</p>
        <h1 id="faction-registry-title" class="hero-title">
          <span>{{ title }}</span>
          <span v-if="chinese" class="hero-title-zh zh-display">{{ chinese }}</span>
        </h1>
        <p v-if="description" class="hero-description">{{ description }}</p>
      </div>

      <aside class="registry-slip" aria-label="Faction registry summary">
        <div class="slip-total">
          <span class="slip-number">{{ totalCount }}</span>
          <span class="slip-label">Current public faction records</span>
        </div>

        <div class="slip-stats">
          <div v-for="stat in ledgerStats" :key="stat.label" class="slip-stat">
            <span>{{ stat.value }}</span>
            <small>{{ stat.label }}</small>
          </div>
        </div>
      </aside>
    </div>

    <div class="seal-rack" aria-label="Representative seals">
      <UiSealStamp
        v-for="(seal, index) in sealMarks"
        :key="`${seal}-${index}`"
        :text="seal"
        variant="outline"
        size="sm"
        writing="horizontal"
        :decorative="true"
        class="seal-mark"
      />
    </div>
  </section>
</template>

<style scoped>
.faction-registry-hero {
  position: relative;
  min-height: clamp(440px, 62vh, 650px);
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid var(--c-divider);
  background:
    linear-gradient(118deg, color-mix(in srgb, var(--c-paper-alt) 86%, transparent), color-mix(in srgb, var(--c-bg-soft) 88%, transparent)),
    var(--c-bg);
}

.hero-paper-grain,
.hero-ink-wash {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-paper-grain {
  z-index: -3;
  background:
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--c-ink) 2.8%, transparent) 0 1px, transparent 1px 2.8rem),
    repeating-linear-gradient(0deg, color-mix(in srgb, var(--c-ink) 2%, transparent) 0 1px, transparent 1px 2.4rem);
  opacity: 0.46;
}

.hero-ink-wash {
  z-index: -2;
  background:
    linear-gradient(90deg, var(--c-bg) 0%, color-mix(in srgb, var(--c-bg) 78%, transparent) 48%, transparent 100%),
    linear-gradient(180deg, transparent 0%, var(--c-bg) 100%),
    radial-gradient(ellipse at 12% 82%, color-mix(in srgb, var(--faction-jade, #2f5c53) 14%, transparent), transparent 32rem),
    radial-gradient(ellipse at 80% 20%, color-mix(in srgb, var(--c-bronze) 13%, transparent), transparent 30rem),
    url('/images/textures/ink-wash-01.webp');
  background-size: auto, auto, auto, auto, cover;
  background-blend-mode: normal, normal, normal, normal, multiply;
  opacity: 0.88;
}

/* Curated hero atmosphere asset from the manifest — subtle wash, never a loud poster.
   Opacity kept at 0.16–0.24 per DESIGN §5.1.1. */
.hero-atmosphere {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-size: cover;
  background-position: center 30%;
  background-repeat: no-repeat;
  opacity: 0.2;
  pointer-events: none;
  filter: saturate(0.85) contrast(0.95);
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
  max-width: 760px;
}

.hero-kicker {
  display: inline-flex;
  margin: 0;
  padding-bottom: 0.45rem;
  color: var(--faction-jade, var(--c-teal-accent));
  border-bottom: 1px solid color-mix(in srgb, var(--faction-jade, var(--c-teal-accent)) 42%, transparent);
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
  font-size: clamp(4rem, 8vw, 6.7rem);
  font-weight: 500;
  line-height: 0.94;
  letter-spacing: 0;
  text-wrap: balance;
}

.hero-title-zh {
  color: color-mix(in srgb, var(--c-ink) 72%, var(--c-seal-red));
  font-size: clamp(3rem, 6.7vw, 5.25rem);
  line-height: 1;
  letter-spacing: 0;
}

.hero-description {
  max-width: 54ch;
  margin: 0;
  color: var(--c-text-2);
  font-size: 1.06rem;
  line-height: 1.72;
  text-wrap: pretty;
}

.registry-slip {
  position: relative;
  align-self: end;
  padding: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--faction-jade, var(--c-ink)) 24%, var(--c-border));
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-paper-alt) 82%, transparent), color-mix(in srgb, var(--c-bg-soft) 90%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
  box-shadow: 0 24px 48px color-mix(in srgb, var(--faction-jade, #2f5c53) 10%, transparent);
}

.registry-slip::before {
  content: '';
  position: absolute;
  inset: 0.55rem;
  border: 1px solid color-mix(in srgb, var(--c-border) 62%, transparent);
  border-radius: 5px;
  pointer-events: none;
}

.slip-total,
.slip-stats {
  position: relative;
  z-index: 1;
}

.slip-total {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0.8rem 1.05rem;
  border-bottom: 1px solid var(--c-divider);
}

.slip-number {
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 5rem;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
}

.slip-label {
  max-width: 10rem;
  color: var(--c-text-2);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.35;
  text-align: right;
}

.slip-stats {
  display: grid;
  gap: 1px;
  padding: 1px;
  margin-top: 1rem;
  background: var(--c-divider);
}

.slip-stat {
  min-height: 4.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.88rem;
  background: color-mix(in srgb, var(--c-bg) 84%, var(--c-bg-soft));
}

.slip-stat span {
  color: var(--c-seal-red);
  font-family: var(--font-heading);
  font-size: 2rem;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.slip-stat small {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.35;
  text-align: right;
}

.seal-rack {
  position: absolute;
  right: max(1rem, calc((100% - 1200px) / 2));
  top: calc(var(--header-height) + 1rem);
  display: grid;
  grid-template-columns: repeat(4, 3.7rem);
  gap: 0.55rem;
  opacity: 0.42;
  transform: rotate(-4deg);
  pointer-events: none;
}

.seal-mark :deep(.seal-stamp) {
  width: 3.7rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}

@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    width: min(100% - 2rem, 720px);
    gap: 2rem;
    padding-bottom: 3rem;
  }

  .registry-slip {
    align-self: auto;
  }

  .seal-rack {
    right: 1rem;
    top: calc(var(--header-height) + 0.75rem);
    grid-template-columns: repeat(4, 2.7rem);
    opacity: 0.32;
  }

  .seal-mark :deep(.seal-stamp) {
    width: 2.7rem;
  }
}

@media (max-width: 520px) {
  .faction-registry-hero {
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
    font-size: 2.65rem;
  }

  .registry-slip {
    padding: 0.9rem;
  }

  .slip-total {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.4rem;
  }

  .slip-number {
    font-size: 3.7rem;
  }

  .slip-label {
    max-width: none;
    text-align: left;
  }

  .slip-stat {
    min-height: 4rem;
    padding: 0.75rem;
  }

  .seal-rack {
    grid-template-columns: repeat(4, 2.2rem);
    gap: 0.35rem;
    opacity: 0.18;
  }

  .seal-mark :deep(.seal-stamp) {
    width: 2.2rem;
  }
}
</style>
