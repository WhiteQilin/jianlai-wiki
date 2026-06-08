<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  chinese?: string
  description?: string
  totalCount: number
  categoryCount: number
  verificationCount: number
  representativeSeals: string[]
}>()

const manualStats = computed(() => [
  {
    value: props.totalCount,
    label: 'Current Records',
  },
  {
    value: props.categoryCount,
    label: 'Populated Categories',
  },
  {
    value: props.verificationCount,
    label: 'Verification Marked',
  },
])

const sealMarks = computed(() => {
  const marks = props.representativeSeals.filter((seal) => seal.trim()).slice(0, 8)
  if (marks.length) return marks
  return [...(props.chinese || props.title || 'Sword')].filter((char) => char.trim()).slice(0, 4)
})
</script>

<template>
  <section class="sword-manual-hero" aria-labelledby="sword-manual-title">
    <div class="hero-paper" aria-hidden="true"></div>
    <div class="hero-wash" aria-hidden="true"></div>
    <div class="hero-brush" aria-hidden="true"></div>

    <div class="hero-inner">
      <div class="hero-copy">
        <p class="hero-kicker">Sword Dao Manual / Recorded Arts</p>
        <h1 id="sword-manual-title" class="hero-title">
          <span>{{ title }}</span>
          <span v-if="chinese" class="hero-title-zh zh-display">{{ chinese }}</span>
        </h1>
        <p v-if="description" class="hero-description">{{ description }}</p>
      </div>

      <aside class="manual-slip" aria-label="Sword Dao Manual summary">
        <div class="slip-heading">
          <span class="slip-label">Sword Dao Manual</span>
          <span class="slip-rule"></span>
        </div>

        <div class="slip-stats">
          <div v-for="stat in manualStats" :key="stat.label" class="slip-stat">
            <span>{{ stat.value }}</span>
            <small>{{ stat.label }}</small>
          </div>
        </div>
      </aside>
    </div>

    <div class="seal-stack" aria-hidden="true">
      <span v-for="(seal, index) in sealMarks" :key="`${seal}-${index}`" class="seal-mark">{{ seal }}</span>
    </div>
  </section>
</template>

<style scoped>
.sword-manual-hero {
  position: relative;
  min-height: clamp(450px, 64vh, 680px);
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid var(--c-divider);
  background:
    linear-gradient(112deg, color-mix(in srgb, var(--c-paper-alt) 88%, transparent), color-mix(in srgb, var(--c-bg-soft) 88%, transparent)),
    var(--c-bg);
}

.hero-paper,
.hero-wash,
.hero-brush {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-paper {
  z-index: -4;
  background:
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--c-ink) 2.6%, transparent) 0 1px, transparent 1px 2.7rem),
    repeating-linear-gradient(0deg, color-mix(in srgb, var(--c-ink) 1.8%, transparent) 0 1px, transparent 1px 2.35rem);
  opacity: 0.45;
}

.hero-wash {
  z-index: -3;
  background:
    linear-gradient(90deg, var(--c-bg) 0%, color-mix(in srgb, var(--c-bg) 78%, transparent) 46%, transparent 100%),
    linear-gradient(180deg, transparent 0%, var(--c-bg) 100%),
    radial-gradient(ellipse at 12% 80%, color-mix(in srgb, var(--sword-celadon, #315f59) 15%, transparent), transparent 32rem),
    radial-gradient(ellipse at 78% 16%, color-mix(in srgb, var(--c-bronze) 15%, transparent), transparent 28rem),
    url('/images/textures/ink-wash-01.webp');
  background-size: auto, auto, auto, auto, cover;
  background-blend-mode: normal, normal, normal, normal, multiply;
  opacity: 0.88;
}

.hero-brush {
  inset: auto 0 -1px;
  z-index: -1;
  height: clamp(6rem, 17vw, 14rem);
  background:
    linear-gradient(180deg, transparent, color-mix(in srgb, var(--c-bg) 94%, transparent)),
    radial-gradient(ellipse at 18% 100%, color-mix(in srgb, var(--sword-celadon, #315f59) 17%, transparent) 0 24%, transparent 54%),
    radial-gradient(ellipse at 52% 104%, color-mix(in srgb, var(--c-ink) 13%, transparent) 0 22%, transparent 58%),
    radial-gradient(ellipse at 80% 100%, color-mix(in srgb, var(--c-bronze) 18%, transparent) 0 20%, transparent 52%);
  opacity: 0.78;
}

.hero-inner {
  width: min(1200px, calc(100% - 4rem));
  min-height: inherit;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(270px, 370px);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  padding: calc(var(--header-height) + 2.8rem) 0 4.25rem;
}

.hero-copy {
  max-width: 780px;
}

.hero-kicker {
  display: inline-flex;
  margin: 0;
  padding-bottom: 0.45rem;
  color: var(--sword-celadon, var(--c-teal-accent));
  border-bottom: 1px solid color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 42%, transparent);
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
  font-size: clamp(3.7rem, 7.4vw, 6.5rem);
  font-weight: 500;
  line-height: 0.94;
  letter-spacing: 0;
  text-wrap: balance;
}

.hero-title-zh {
  color: color-mix(in srgb, var(--c-ink) 72%, var(--c-seal-red));
  font-size: clamp(2.8rem, 6.2vw, 5.15rem);
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

.manual-slip {
  position: relative;
  align-self: end;
  min-width: 0;
  padding: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--sword-celadon, var(--c-ink)) 24%, var(--c-border));
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-paper-alt) 82%, transparent), color-mix(in srgb, var(--c-bg-soft) 90%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
  box-shadow: 0 24px 48px color-mix(in srgb, var(--sword-celadon, #315f59) 10%, transparent);
}

.manual-slip::before {
  content: '';
  position: absolute;
  inset: 0.55rem;
  border: 1px solid color-mix(in srgb, var(--c-border) 62%, transparent);
  border-radius: 5px;
  pointer-events: none;
}

.slip-heading,
.slip-stats {
  position: relative;
  z-index: 1;
}

.slip-heading {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem 0.8rem 1rem;
  border-bottom: 1px solid var(--c-divider);
}

.slip-label {
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.15rem;
  line-height: 1.15;
}

.slip-rule {
  min-width: 2rem;
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, var(--c-seal-red), transparent);
}

.slip-stats {
  display: grid;
  gap: 1px;
  padding: 1px;
  margin-top: 1rem;
  background: var(--c-divider);
}

.slip-stat {
  min-height: 4.45rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem;
  background: color-mix(in srgb, var(--c-bg) 84%, var(--c-bg-soft));
}

.slip-stat span {
  color: var(--c-seal-red);
  font-family: var(--font-heading);
  font-size: 2.05rem;
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

.seal-stack {
  position: absolute;
  right: max(1rem, calc((100% - 1200px) / 2));
  top: calc(var(--header-height) + 0.9rem);
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
  font-size: 2.1rem;
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

  .manual-slip {
    align-self: auto;
  }

  .seal-stack {
    right: 1rem;
    top: calc(var(--header-height) + 0.75rem);
    grid-template-columns: repeat(2, 3rem);
  }

  .seal-mark {
    width: 3rem;
    font-size: 1.6rem;
  }
}

@media (max-width: 520px) {
  .sword-manual-hero {
    min-height: auto;
  }

  .hero-inner {
    width: calc(100% - 2rem);
    padding-top: calc(var(--header-height) + 2rem);
  }

  .hero-title {
    font-size: 3.1rem;
  }

  .hero-title-zh {
    font-size: 2.55rem;
  }

  .manual-slip {
    padding: 0.9rem;
  }

  .slip-stat {
    min-height: 4rem;
    padding: 0.75rem;
  }

  .seal-stack {
    opacity: 0.1;
  }
}
</style>
