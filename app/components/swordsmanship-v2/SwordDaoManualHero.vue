<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  chinese?: string
  description?: string
  totalCount: number
  categoryCount: number
  verificationCount: number
  featuredTitle?: string
  featuredChinese?: string
  lastUpdated?: string
  representativeSeals?: string[]
  variant?: 'classic' | 'bladepath'
}>(), {
  variant: 'classic'
})
</script>

<template>
  <header class="manual-hero" :class="{ 'manual-hero--bladepath': props.variant === 'bladepath' }" aria-labelledby="sword-manual-title">
    <div class="hero-bg" aria-hidden="true">
      <div class="hero-bg__wash"></div>
      <div class="hero-bg__ink"></div>
      <div class="hero-bg__mountain"></div>
    </div>

    <div class="hero-blade" aria-hidden="true">
      <span class="hero-blade__core"></span>
      <span class="hero-blade__wake"></span>
    </div>

    <div class="manual-hero__inner">
      <section class="hero-copy" aria-label="Sword Dao Manual introduction">
        <p class="hero-kicker">
          <span>Jian Lai archive</span>
          <span>Sword Dao manual</span>
        </p>

        <h1 id="sword-manual-title" class="hero-title">
          <span v-if="chinese" class="title-zh">{{ chinese }}</span>
          <span class="title-en">{{ title }}</span>
        </h1>

        <p v-if="description" class="hero-description">{{ description }}</p>

        <div class="hero-record-strip" aria-label="Manual record summary">
          <div class="record-strip__item">
            <span class="record-strip__label">Recorded arts</span>
            <strong>{{ totalCount }}</strong>
          </div>
          <div class="record-strip__item">
            <span class="record-strip__label">Families</span>
            <strong>{{ categoryCount }}</strong>
          </div>
          <div class="record-strip__item record-strip__item--seal">
            <span class="record-strip__label">Review marks</span>
            <strong>{{ verificationCount }}</strong>
          </div>
        </div>
      </section>

      <aside class="hero-manual-plate" aria-label="Featured manual cover record">
        <div class="plate-art" aria-hidden="true">
          <span class="plate-art__figure"></span>
          <span class="plate-art__slash"></span>
        </div>

        <div class="plate-copy">
          <div class="plate-rule" aria-hidden="true"></div>
          <p class="plate-eyebrow">Featured slip</p>
          <p class="plate-title">{{ featuredTitle || 'Caged Sparrow' }}</p>
          <p v-if="featuredChinese" class="plate-chinese">{{ featuredChinese }}</p>
          <p v-if="lastUpdated" class="plate-date">Last updated {{ lastUpdated }}</p>
        </div>

        <div class="cinnabar-seal" aria-label="Controlled cinnabar seal">
          <span>{{ featuredChinese || 'å‰‘å½•' }}</span>
        </div>
      </aside>
    </div>

    <div v-if="representativeSeals?.length" class="hero-seal-ledger" aria-label="Representative manual seals">
      <span
        v-for="seal in representativeSeals"
        :key="seal"
        class="seal-ledger__mark"
      >
        {{ seal }}
      </span>
    </div>

    <!-- Bladepath variant: zone mark at hero/body seam -->
    <div v-if="props.variant === 'bladepath'" class="hero-seam-mark" aria-hidden="true">
      <span class="hero-seam-mark__diamond"></span>
    </div>
  </header>
</template>

<style scoped>
.manual-hero {
  position: relative;
  min-height: min(920px, 100dvh);
  overflow: hidden;
  isolation: isolate;
  color: #eef7f7;
  background:
    radial-gradient(circle at 74% 24%, rgba(125, 166, 179, 0.34), transparent 19rem),
    radial-gradient(circle at 18% 72%, rgba(111, 160, 151, 0.16), transparent 22rem),
    linear-gradient(125deg, #061019 0%, #0a1a25 38%, #101d26 58%, #e8f1ef 100%);
}

.manual-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(4, 13, 19, 0.88) 0%, rgba(4, 13, 19, 0.56) 38%, rgba(9, 23, 31, 0.32) 66%, rgba(226, 237, 235, 0.1) 100%),
    linear-gradient(to bottom, rgba(5, 14, 20, 0.04), rgba(5, 14, 20, 0.2) 58%, rgba(5, 14, 20, 0.82) 100%);
  pointer-events: none;
}

.hero-bg,
.hero-bg__wash,
.hero-bg__ink,
.hero-bg__mountain {
  position: absolute;
  inset: 0;
  z-index: -2;
}

.hero-bg__wash {
  background:
    linear-gradient(100deg, rgba(3, 12, 18, 0.48), rgba(3, 12, 18, 0.16) 48%, rgba(224, 240, 238, 0.08)),
    linear-gradient(to bottom, rgba(5, 15, 22, 0.08), rgba(5, 15, 22, 0.34)),
    url('/images/ui/generated/swordsmanship-v2/swordsmanship-hero-mist-bg.webp'),
    url('/images/ui/purchased/ink/ink-wash-cloud-soft-03.webp'),
    url('/images/textures/ink-wash-01.webp');
  background-size: cover, cover, cover, min(70rem, 110vw) auto, cover;
  background-position: center, center, center, 78% 16%, center;
  background-repeat: no-repeat;
  opacity: 0.96;
  filter: saturate(0.96) contrast(1.06);
  transform: scale(1.03);
  animation: heroMistDrift 18s ease-in-out infinite alternate;
}

.hero-bg__ink {
  inset: -11% -8% auto 22%;
  height: 72%;
  background:
    url('/images/ui/purchased/ink/ink-title-stroke-long-06.webp'),
    radial-gradient(ellipse at center, rgba(3, 10, 16, 0.78), transparent 62%);
  background-size: min(64rem, 100vw) auto, 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  mix-blend-mode: multiply;
  opacity: 0.36;
  transform: rotate(-6deg);
}

.hero-bg__mountain {
  top: auto;
  height: 42%;
  background:
    linear-gradient(to bottom, transparent, rgba(222, 238, 237, 0.24)),
    url('/images/ui/purchased/ink/ink-mountain-smear-01.webp');
  background-repeat: no-repeat;
  background-size: 76rem auto;
  background-position: 57% bottom;
  opacity: 0.2;
  filter: hue-rotate(170deg) saturate(0.65);
}

.hero-blade {
  position: absolute;
  inset: 56% -9% auto 34%;
  z-index: 0;
  height: 5rem;
  opacity: 0.64;
  transform: rotate(-13deg);
  pointer-events: none;
}

.hero-blade__core,
.hero-blade__wake {
  position: absolute;
  inset: 50% 0 auto 0;
  transform: translateY(-50%);
  transform-origin: left center;
}

.hero-blade__core {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(242, 250, 250, 0.28) 10%, #f7ffff 42%, rgba(159, 191, 198, 0.52) 72%, transparent);
  box-shadow: 0 0 34px rgba(174, 221, 229, 0.38);
  animation: bladeDraw 1.25s cubic-bezier(0.22, 0.8, 0.2, 1) both 0.3s;
}

.hero-blade__wake {
  height: 5rem;
  background:
    linear-gradient(90deg, transparent 0%, rgba(224, 243, 243, 0.18) 34%, rgba(18, 39, 52, 0.28) 62%, transparent 100%),
    url('/images/ui/purchased/ink/ink-divider-rough-01.webp');
  background-size: 100% 100%, 100% auto;
  background-repeat: no-repeat;
  opacity: 0.8;
  filter: hue-rotate(172deg) saturate(0.7);
}

.manual-hero__inner {
  position: relative;
  z-index: 2;
  width: min(1500px, 100%);
  min-height: min(920px, 100dvh);
  margin: 0 auto;
  padding: clamp(6.25rem, 9vh, 8rem) clamp(1.1rem, 5vw, 5.5rem) clamp(4.5rem, 8vh, 7rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(21rem, 0.62fr);
  align-items: end;
  gap: clamp(2rem, 5vw, 6rem);
}

.hero-copy {
  max-width: 50rem;
  padding: clamp(1rem, 3vw, 1.8rem) 0 0 clamp(0.75rem, 2vw, 1.5rem);
  border-left: 1px solid rgba(195, 225, 226, 0.26);
}

.hero-kicker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1rem;
  margin: 0 0 clamp(1.1rem, 2vw, 1.65rem);
  color: rgba(194, 222, 223, 0.78);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  line-height: 1.4;
  text-transform: uppercase;
}

.hero-kicker span {
  position: relative;
}

.hero-kicker span + span::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -0.55rem;
  width: 3px;
  height: 3px;
  background: var(--c-cinnabar, #b43d35);
  transform: translateY(-50%) rotate(45deg);
}

.hero-title {
  display: grid;
  gap: clamp(0.6rem, 1.3vw, 1rem);
  margin: 0;
}

.title-zh {
  color: #f4fbfb;
  font-family: var(--font-zh-display);
  font-size: clamp(5.2rem, 14vw, 11.5rem);
  line-height: 0.82;
  letter-spacing: -0.04em;
  text-shadow: 0 0 32px rgba(165, 208, 216, 0.22), 0 12px 42px rgba(0, 0, 0, 0.44);
}

.title-en {
  width: min-content;
  min-width: min(100%, 36rem);
  color: rgba(222, 241, 241, 0.92);
  font-family: var(--font-heading);
  font-size: clamp(2.8rem, 7vw, 7.2rem);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 0.9;
  text-wrap: balance;
}

.hero-description {
  max-width: 54ch;
  margin: clamp(1.35rem, 2.7vw, 2rem) 0 0;
  color: rgba(226, 242, 242, 0.82);
  font-size: clamp(1rem, 1.35vw, 1.17rem);
  line-height: 1.75;
  text-wrap: pretty;
}

.hero-record-strip {
  width: min(100%, 43rem);
  margin-top: clamp(1.8rem, 3.8vw, 3.2rem);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid rgba(195, 225, 226, 0.24);
  border-bottom: 1px solid rgba(195, 225, 226, 0.18);
  background: linear-gradient(90deg, rgba(6, 18, 25, 0.46), rgba(13, 30, 40, 0.2), transparent);
  backdrop-filter: blur(8px);
}

.record-strip__item {
  min-width: 0;
  padding: 0.9rem clamp(0.75rem, 1.6vw, 1.25rem);
  display: grid;
  gap: 0.22rem;
  border-right: 1px solid rgba(195, 225, 226, 0.14);
}

.record-strip__item:last-child {
  border-right: 0;
}

.record-strip__label {
  color: rgba(194, 222, 223, 0.72);
  font-family: var(--font-mono);
  font-size: 0.61rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.record-strip__item strong {
  color: #f5ffff;
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.record-strip__item--seal strong {
  color: #d77768;
}

.hero-manual-plate {
  position: relative;
  min-height: clamp(28rem, 58vh, 42rem);
  border: 1px solid rgba(224, 240, 238, 0.18);
  background:
    linear-gradient(180deg, rgba(232, 243, 240, 0.78), rgba(195, 214, 214, 0.54)),
    radial-gradient(circle at 30% 24%, rgba(16, 41, 55, 0.24), transparent 13rem),
    rgba(224, 237, 235, 0.7);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.34), 0 36px 80px rgba(1, 8, 13, 0.38);
  overflow: hidden;
  transform: translateY(1rem) rotate(1.2deg);
}

.hero-manual-plate::before {
  content: '';
  position: absolute;
  inset: 1rem;
  border: 1px solid rgba(13, 37, 50, 0.12);
  pointer-events: none;
}

.hero-manual-plate::after {
  content: '';
  position: absolute;
  inset: auto -5% -7% 14%;
  height: 40%;
  background: url('/images/ui/purchased/ink/ink-corner-stain-04.webp') no-repeat center / contain;
  filter: hue-rotate(172deg) saturate(0.55);
  opacity: 0.42;
  pointer-events: none;
}

.plate-art {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.plate-art__figure {
  position: absolute;
  right: 10%;
  bottom: 12%;
  width: min(15rem, 42vw);
  aspect-ratio: 0.55;
  background:
    linear-gradient(140deg, transparent 0 26%, rgba(3, 17, 27, 0.64) 27% 42%, transparent 43% 100%),
    radial-gradient(ellipse at center, rgba(3, 17, 27, 0.38), transparent 65%);
  clip-path: polygon(42% 0, 60% 7%, 70% 28%, 86% 100%, 18% 100%, 28% 28%);
  opacity: 0.54;
}

.plate-art__slash {
  position: absolute;
  top: 36%;
  left: -16%;
  width: 136%;
  height: 6rem;
  background:
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.72) 48%, rgba(17, 44, 58, 0.35) 58%, transparent),
    url('/images/ui/purchased/ink/ink-divider-rough-02.webp');
  background-size: 100% 100%, cover;
  background-repeat: no-repeat;
  transform: rotate(-19deg);
  filter: hue-rotate(172deg) saturate(0.58);
  opacity: 0.72;
}

.plate-copy {
  position: absolute;
  left: clamp(1.25rem, 3vw, 2.2rem);
  right: clamp(1.25rem, 3vw, 2.2rem);
  bottom: clamp(1.45rem, 4vw, 2.7rem);
  z-index: 2;
  color: #102836;
}

.plate-rule {
  width: min(14rem, 70%);
  height: 2px;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #122c38, rgba(169, 52, 44, 0.82), transparent);
}

.plate-eyebrow,
.plate-date {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  line-height: 1.5;
  text-transform: uppercase;
}

.plate-eyebrow {
  color: rgba(16, 40, 54, 0.72);
}

.plate-title {
  margin: 0.4rem 0 0;
  color: #071b27;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3.5rem);
  letter-spacing: -0.03em;
  line-height: 0.95;
}

.plate-chinese {
  margin: 0.3rem 0 0;
  color: rgba(7, 27, 39, 0.66);
  font-family: var(--font-zh-display);
  font-size: clamp(1.4rem, 3vw, 2.4rem);
  line-height: 1;
}

.plate-date {
  margin-top: 1rem;
  color: rgba(16, 40, 54, 0.54);
}

.cinnabar-seal {
  position: absolute;
  top: clamp(1.4rem, 3vw, 2.2rem);
  right: clamp(1.3rem, 3vw, 2.1rem);
  z-index: 3;
  width: clamp(4.7rem, 8vw, 6.2rem);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border: 2px solid rgba(172, 49, 42, 0.84);
  color: #e8f0f2;
  background: rgba(172, 49, 42, 0.85);
  box-shadow: inset 0 0 0 6px rgba(172, 49, 42, 0.06);
  transform: rotate(-8deg);
}

.cinnabar-seal span {
  width: min-content;
  font-family: var(--font-zh-display);
  font-size: clamp(1rem, 2vw, 1.35rem);
  line-height: 1.05;
  text-align: center;
  writing-mode: vertical-rl;
}

.hero-seal-ledger {
  position: absolute;
  left: clamp(1rem, 4vw, 4.5rem);
  right: clamp(1rem, 4vw, 4.5rem);
  bottom: clamp(1rem, 3vh, 2rem);
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  opacity: 0.62;
}

.seal-ledger__mark {
  max-width: 9rem;
  padding: 0.28rem 0.52rem;
  overflow: hidden;
  border: 1px solid rgba(218, 238, 238, 0.16);
  color: rgba(229, 244, 244, 0.72);
  background: rgba(4, 15, 22, 0.36);
  font-family: var(--font-zh-display);
  font-size: 0.82rem;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes heroMistDrift {
  from {
    transform: scale(1.03) translate3d(-1.5%, 0, 0);
  }
  to {
    transform: scale(1.06) translate3d(1.5%, -1%, 0);
  }
}

@keyframes bladeDraw {
  from {
    transform: translateY(-50%) scaleX(0);
    opacity: 0;
  }
  to {
    transform: translateY(-50%) scaleX(1);
    opacity: 1;
  }
}

@media (max-width: 980px) {
  .manual-hero,
  .manual-hero__inner {
    min-height: auto;
  }

  .manual-hero__inner {
    grid-template-columns: 1fr;
    align-items: start;
    padding-top: 5.8rem;
  }

  .hero-copy {
    max-width: 100%;
  }

  .hero-manual-plate {
    min-height: 26rem;
    transform: rotate(0.7deg);
  }
}

@media (max-width: 620px) {
  .hero-bg__wash {
    background-position: center, center, 55% center, 70% 18%, center;
  }

  .manual-hero::after {
    background:
      linear-gradient(90deg, rgba(4, 13, 19, 0.84) 0%, rgba(4, 13, 19, 0.42) 58%, rgba(226, 237, 235, 0.08) 100%),
      linear-gradient(to bottom, rgba(5, 14, 20, 0.08), rgba(5, 14, 20, 0.26) 58%, rgba(5, 14, 20, 0.88) 100%);
  }

  .manual-hero__inner {
    padding: 5.1rem 0.95rem 4.4rem;
    gap: 1.8rem;
  }

  .hero-copy {
    padding-left: 0.85rem;
  }

  .title-en {
    min-width: 0;
    width: auto;
    letter-spacing: -0.03em;
  }

  .hero-record-strip {
    grid-template-columns: 1fr;
  }

  .record-strip__item {
    grid-template-columns: 1fr auto;
    align-items: baseline;
    border-right: 0;
    border-bottom: 1px solid rgba(195, 225, 226, 0.12);
  }

  .record-strip__item:last-child {
    border-bottom: 0;
  }

  .hero-manual-plate {
    min-height: 22rem;
  }

  .hero-seal-ledger {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-bg__wash,
  .hero-blade__core {
    animation: none;
  }
}

/* ===========================
   BLADEPATH VARIANT
   V3 Blade Path Descent alignment
   =========================== */

/* 1. Darken hero bottom gradient — blend into body #080f16 */
.manual-hero--bladepath {
  background:
    radial-gradient(circle at 74% 24%, rgba(125, 166, 179, 0.34), transparent 19rem),
    radial-gradient(circle at 18% 72%, rgba(111, 160, 151, 0.16), transparent 22rem),
    linear-gradient(125deg, #061019 0%, #0a1a25 38%, #0e1a24 68%, #0a1520 100%);
}

.manual-hero--bladepath::after {
  background:
    linear-gradient(90deg, rgba(4, 13, 19, 0.92) 0%, rgba(4, 13, 19, 0.62) 38%, rgba(9, 23, 31, 0.38) 66%, rgba(8, 15, 22, 0.18) 100%),
    linear-gradient(to bottom, rgba(5, 14, 20, 0.04), rgba(5, 14, 20, 0.24) 58%, rgba(8, 15, 22, 0.88) 100%);
}

/* 2. Spine hint — faint vertical blade-core line aligned with body spine */
.manual-hero--bladepath .manual-hero__inner::before {
  content: '';
  position: absolute;
  top: 12%;
  bottom: 0;
  left: clamp(2rem, 5vw, 5rem);
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(122, 180, 164, 0.12) 20%,
    rgba(204, 82, 72, 0.18) 60%,
    rgba(122, 180, 164, 0.22) 100%
  );
  z-index: 1;
  pointer-events: none;
}

/* 3. Align hero blade line with body spine vocabulary */
.manual-hero--bladepath .hero-blade {
  top: 52%;
  left: clamp(2rem, 5vw, 5rem);
  right: auto;
  width: 60%;
  transform: rotate(-6deg);
  opacity: 0.5;
}

/* 4. Darken the Caged Sparrow plate */
.manual-hero--bladepath .hero-manual-plate {
  background:
    linear-gradient(180deg, rgba(22, 42, 54, 0.92), rgba(14, 30, 42, 0.88)),
    radial-gradient(circle at 30% 24%, rgba(122, 180, 164, 0.08), transparent 13rem),
    rgba(14, 28, 38, 0.92);
  border-color: rgba(140, 180, 195, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(190, 225, 230, 0.08),
    0 36px 80px rgba(1, 8, 13, 0.5);
}

.manual-hero--bladepath .hero-manual-plate::before {
  border-color: rgba(140, 180, 195, 0.08);
}

.manual-hero--bladepath .hero-manual-plate::after {
  filter: hue-rotate(172deg) saturate(0.4) brightness(0.4);
  opacity: 0.3;
}

.manual-hero--bladepath .plate-art__figure {
  background:
    linear-gradient(140deg, transparent 0 26%, rgba(190, 225, 230, 0.08) 27% 42%, transparent 43% 100%),
    radial-gradient(ellipse at center, rgba(190, 225, 230, 0.06), transparent 65%);
  opacity: 0.4;
}

.manual-hero--bladepath .plate-art__slash {
  background:
    linear-gradient(90deg, transparent, rgba(190, 225, 230, 0.18) 48%, rgba(17, 44, 58, 0.12) 58%, transparent),
    url('/images/ui/purchased/ink/ink-divider-rough-02.webp');
  background-size: 100% 100%, cover;
  background-repeat: no-repeat;
  opacity: 0.5;
}

.manual-hero--bladepath .plate-copy {
  color: rgba(190, 225, 230, 0.92);
}

.manual-hero--bladepath .plate-rule {
  background: linear-gradient(90deg, rgba(190, 225, 230, 0.12), rgba(204, 82, 72, 0.6), transparent);
}

.manual-hero--bladepath .plate-eyebrow {
  color: #f0a59b;
}

.manual-hero--bladepath .plate-title {
  color: rgba(230, 245, 245, 0.95);
}

.manual-hero--bladepath .plate-chinese {
  color: #b8d0d8;
}

.manual-hero--bladepath .plate-date {
  color: #b8d0d8;
}

/* Cinnabar seal — slightly adjusted for dark plate */
.manual-hero--bladepath .cinnabar-seal {
  background: rgba(204, 82, 72, 0.08);
  box-shadow: inset 0 0 0 6px rgba(204, 82, 72, 0.06);
}

/* 5. Zone mark at hero/body seam */
.hero-seam-mark {
  position: absolute;
  bottom: 0;
  left: clamp(2rem, 5vw, 5rem);
  transform: translate(-50%, 50%);
  z-index: 4;
  pointer-events: none;
}

.hero-seam-mark__diamond {
  display: block;
  width: 0.85rem;
  aspect-ratio: 1;
  border: 2px solid rgba(204, 82, 72, 0.55);
  background: #080f16;
  box-shadow: 0 0 14px rgba(204, 82, 72, 0.18), 0 0 0 3px rgba(8, 15, 22, 0.85);
  transform: rotate(45deg);
}

/* 6. Stats strip — tighten for bladepath */
.manual-hero--bladepath .hero-record-strip {
  background: linear-gradient(90deg, rgba(8, 15, 22, 0.56), rgba(14, 30, 42, 0.24), transparent);
  border-color: rgba(140, 180, 195, 0.18);
}

.manual-hero--bladepath .record-strip__item {
  border-right-color: rgba(140, 180, 195, 0.1);
}

/* 7. Reduced motion — suppress bladepath-specific animations */
@media (prefers-reduced-motion: reduce) {
  .manual-hero--bladepath .hero-bg__wash {
    animation: none;
  }
}
</style>






