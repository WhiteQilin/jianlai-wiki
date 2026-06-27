<script setup lang="ts">
import type { RegistryStats } from './types'

defineProps<{
  registryStats: RegistryStats
  /** Dev-only atmosphere image path. Production migration is blocked on a better asset. */
  heroImage: string
}>()
</script>

<template>
  <section class="cinema-hero" aria-labelledby="power-board-title">
    <div class="hero-atmosphere" aria-hidden="true" :style="{ backgroundImage: `url('${heroImage}')` }"></div>
    <div class="hero-veil" aria-hidden="true"></div>
    <div class="hero-ink-frame" aria-hidden="true"></div>

    <div class="hero-content">
      <p class="hero-super">天下势力盘 · SECT POWER BOARD</p>
      <h1 id="power-board-title" class="hero-title">
        <span class="hero-title-zh zh-display">天下势力盘</span>
        <span class="hero-title-en">Factions <span class="title-slash">/</span> 宗门势力</span>
      </h1>
      <p class="hero-deck">
        A living political constellation of the known world — sects, dynasties, academies and lineages
        arrayed across the great board, their seats, heads and alliances mapped as forces in motion.
      </p>

      <dl class="registry-plaque" aria-label="Registry of forces">
        <div class="plaque-cell plaque-cell--lead">
          <dt>Registered forces</dt>
          <dd class="plaque-number">{{ registryStats.total }}</dd>
        </div>
        <div class="plaque-cell">
          <dt>Primary powers</dt>
          <dd>{{ registryStats.primary }}</dd>
        </div>
        <div class="plaque-cell">
          <dt>Verified records</dt>
          <dd>{{ registryStats.verified }}</dd>
        </div>
        <div class="plaque-cell">
          <dt>Registered seats</dt>
          <dd>{{ registryStats.seats }}</dd>
        </div>
      </dl>
    </div>

    <div class="hero-scroll-cue" aria-hidden="true">
      <span>BOARD</span>
      <span class="cue-rule"></span>
    </div>
  </section>
</template>

<style scoped>
/* ----------------------------------------------------------------- HERO */
.cinema-hero {
  position: relative;
  min-height: clamp(520px, 86vh, 820px);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid var(--pb-line);
}

.hero-atmosphere {
  position: absolute;
  inset: -6% -4%;
  background-size: cover;
  background-position: center 32%;
  filter: saturate(0.82) contrast(1.06) brightness(0.74);
  z-index: -3;
  animation: hero-drift 38s ease-in-out infinite alternate;
}

@keyframes hero-drift {
  from { transform: scale(1.04) translate3d(-1.2%, 0, 0); }
  to   { transform: scale(1.1)  translate3d(1.2%, -1.4%, 0); }
}

.hero-veil {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(180deg, rgba(14, 13, 11, 0.55) 0%, rgba(14, 13, 11, 0.2) 38%, rgba(14, 13, 11, 0.92) 100%),
    linear-gradient(90deg, rgba(14, 13, 11, 0.86) 0%, transparent 42%);
}

.hero-ink-frame {
  position: absolute;
  inset: clamp(1rem, 2.4vw, 2rem);
  border: 1px solid var(--pb-line);
  pointer-events: none;
  z-index: -1;
}
.hero-ink-frame::before,
.hero-ink-frame::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1px solid var(--pb-gold);
}
.hero-ink-frame::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.hero-ink-frame::after  { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

.hero-content {
  position: relative;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(2rem, 6vw, 5.5rem) clamp(1.25rem, 4vw, 3rem) clamp(2.5rem, 5vw, 4rem);
}

.hero-super {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.34em;
  color: var(--pb-gold);
  margin: 0 0 1.1rem;
  text-transform: uppercase;
}

.hero-title { margin: 0 0 1.6rem; line-height: 0.95; }
.hero-title-zh {
  display: block;
  font-size: clamp(3.4rem, 10vw, 7.6rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--pb-ink);
  text-shadow: 0 6px 40px rgba(0, 0, 0, 0.55);
  margin-bottom: 0.4rem;
}
.hero-title-en {
  display: block;
  font-family: var(--font-heading);
  font-size: clamp(1.1rem, 2.6vw, 1.9rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--pb-ink-wash);
  font-style: italic;
}
.title-slash { color: var(--pb-cinnabar); font-style: normal; padding: 0 0.2em; }

.hero-deck {
  max-width: 46ch;
  font-size: clamp(0.95rem, 1.4vw, 1.08rem);
  line-height: 1.65;
  color: var(--pb-ink-wash);
  margin: 0 0 2.4rem;
}

/* registry plaque — political registry, not a floating SaaS card */
.registry-plaque {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  max-width: 720px;
  margin: 0;
  padding: 0;
  background: linear-gradient(180deg, rgba(26, 23, 20, 0.82), rgba(21, 18, 14, 0.92));
  border: 1px solid var(--pb-line);
  border-left: 3px solid var(--pb-cinnabar);
}
.plaque-cell {
  flex: 1 1 140px;
  min-width: 130px;
  padding: 0.9rem 1.1rem;
  border-right: 1px solid var(--pb-line-soft);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.plaque-cell:last-child { border-right: 0; }
.plaque-cell dt {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--pb-ink-dim);
  order: 2;
}
.plaque-cell dd {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--pb-gold-bright);
  order: 1;
}
.plaque-cell--lead dd {
  font-size: 2.6rem;
  line-height: 1;
  color: var(--pb-ink);
}

.hero-scroll-cue {
  position: absolute;
  right: clamp(1.5rem, 3vw, 2.6rem);
  bottom: clamp(1.5rem, 3vw, 2.4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.3em;
  color: var(--pb-gold);
}
.cue-rule {
  width: 1px;
  height: 44px;
  background: linear-gradient(180deg, var(--pb-gold), transparent);
  animation: cue-pulse 2.4s ease-in-out infinite;
}
@keyframes cue-pulse {
  0%, 100% { opacity: 0.35; transform: scaleY(0.7); transform-origin: top; }
  50%      { opacity: 1;    transform: scaleY(1); }
}

@media (max-width: 860px) {
  .hero-scroll-cue { display: none; }
}
@media (max-width: 640px) {
  .hero-title-zh { font-size: clamp(2.8rem, 16vw, 4.4rem); }
  .plaque-cell { flex: 1 1 50%; min-width: 0; }
  .plaque-cell:nth-child(odd) { border-right: 1px solid var(--pb-line-soft); }
  .registry-plaque { border-left-width: 3px; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-atmosphere { animation: none; }
  .cue-rule { animation: none; opacity: 0.6; }
}
</style>
