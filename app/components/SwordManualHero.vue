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

const primarySeal = computed(() => sealMarks.value[0] || props.chinese?.charAt(0) || '剑')
</script>

<template>
  <section class="sword-manual-hero" aria-labelledby="sword-manual-title">
    <div class="hero-paper" aria-hidden="true"></div>
    <div class="hero-wash" aria-hidden="true"></div>
    <div class="hero-blade" aria-hidden="true"></div>
    <div class="hero-ghost-seal zh-display" aria-hidden="true">{{ primarySeal }}</div>

    <div class="hero-inner">
      <div class="hero-vertical-label" aria-hidden="true">
        <span>Sword Dao Manual</span>
      </div>

      <div class="hero-copy">
        <p class="hero-kicker">Sword Dao Manual</p>
        <h1 id="sword-manual-title" class="hero-title">
          <span>{{ title }}</span>
          <span v-if="chinese" class="hero-title-zh zh-display">{{ chinese }}</span>
        </h1>
        <p v-if="description" class="hero-description">{{ description }}</p>
        <span class="hero-brush-rule" aria-hidden="true"></span>
      </div>

      <aside class="manual-register" aria-label="Sword Dao Manual summary">
        <div class="register-heading">
          <span class="register-title">Manual register</span>
          <span class="register-rule"></span>
        </div>
        <SealStatBlock
          v-for="stat in manualStats"
          :key="stat.label"
          :value="stat.value"
          :label="stat.label"
        />
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
  min-height: clamp(500px, 68vh, 710px);
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid var(--c-divider);
  background:
    linear-gradient(112deg, color-mix(in srgb, var(--c-paper-alt) 90%, transparent), color-mix(in srgb, var(--c-bg-soft) 86%, transparent)),
    var(--c-bg);
}

.hero-paper,
.hero-wash,
.hero-blade,
.hero-ghost-seal {
  position: absolute;
  pointer-events: none;
}

.hero-paper,
.hero-wash {
  inset: 0;
}

.hero-paper {
  z-index: -4;
  background:
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--c-ink) 2.2%, transparent) 0 1px, transparent 1px 2.7rem),
    repeating-linear-gradient(0deg, color-mix(in srgb, var(--c-ink) 1.5%, transparent) 0 1px, transparent 1px 2.35rem);
  opacity: 0.42;
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

.hero-blade {
  left: 0;
  right: 0;
  bottom: -1px;
  z-index: -1;
  height: clamp(7rem, 19vw, 15rem);
  background:
    linear-gradient(180deg, transparent, color-mix(in srgb, var(--c-bg) 94%, transparent)),
    radial-gradient(ellipse at 18% 100%, color-mix(in srgb, var(--sword-celadon, #315f59) 16%, transparent) 0 24%, transparent 54%),
    radial-gradient(ellipse at 52% 104%, color-mix(in srgb, var(--c-ink) 12%, transparent) 0 22%, transparent 58%),
    radial-gradient(ellipse at 80% 100%, color-mix(in srgb, var(--c-bronze) 16%, transparent) 0 20%, transparent 52%);
  opacity: 0.76;
}

.hero-blade::after {
  content: '';
  position: absolute;
  left: 12%;
  right: 8%;
  bottom: 36%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--sword-silver, #aeb8b4), var(--c-seal-red), transparent);
  transform: skewX(-18deg);
  opacity: 0.72;
}

.hero-ghost-seal {
  right: max(1rem, calc((100% - 1200px) / 2 + 6rem));
  bottom: 3.8rem;
  z-index: -1;
  color: var(--c-seal-red);
  font-size: clamp(8rem, 22vw, 17rem);
  line-height: 1;
  opacity: 0.045;
  transform: rotate(-8deg);
}

.hero-inner {
  width: min(1200px, calc(100% - 4rem));
  min-height: inherit;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(250px, 350px);
  gap: clamp(1.25rem, 4.2vw, 4rem);
  align-items: center;
  padding: calc(var(--header-height) + 2.8rem) 0 4.25rem;
}

.hero-vertical-label {
  align-self: stretch;
  display: grid;
  place-items: center;
  min-width: 2.6rem;
  padding: 1rem 0.25rem;
  color: color-mix(in srgb, var(--c-seal-red) 78%, var(--c-ink));
  border-left: 1px solid color-mix(in srgb, var(--c-seal-red) 24%, transparent);
  border-right: 1px solid color-mix(in srgb, var(--c-seal-red) 16%, transparent);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  line-height: 1.3;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.hero-copy {
  max-width: 780px;
}

.hero-kicker {
  display: inline-flex;
  margin: 0;
  padding-bottom: 0.45rem;
  color: var(--c-seal-red);
  border-bottom: 1px solid color-mix(in srgb, var(--c-seal-red) 34%, transparent);
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

.hero-brush-rule {
  display: block;
  width: min(28rem, 72vw);
  height: 0.7rem;
  margin-top: 1.35rem;
  background: linear-gradient(90deg, color-mix(in srgb, var(--c-ink) 22%, transparent), color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 34%, transparent), transparent);
  mask-image: linear-gradient(90deg, black, transparent 92%);
  -webkit-mask-image: linear-gradient(90deg, black, transparent 92%);
  transform: skewX(-14deg);
  opacity: 0.65;
}

.manual-register {
  position: relative;
  align-self: end;
  min-width: 0;
  display: grid;
  gap: 0.7rem;
  padding: 0.8rem;
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 18%, var(--c-border));
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-paper-alt) 42%, transparent);
  box-shadow: 0 18px 42px color-mix(in srgb, var(--sword-celadon, #315f59) 7%, transparent);
}

.register-heading {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.1rem 0.15rem 0.35rem;
}

.register-title {
  color: var(--c-ink);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.2;
  text-transform: uppercase;
}

.register-rule {
  min-width: 2rem;
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, var(--c-seal-red), transparent);
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

  .hero-vertical-label {
    display: none;
  }

  .manual-register {
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

  .manual-register {
    padding: 0.9rem;
  }

  .seal-stack {
    opacity: 0.1;
  }

  .hero-ghost-seal {
    display: none;
  }
}
</style>
