<script setup lang="ts">
import TimelineAmbientLayer from './TimelineAmbientLayer.vue'

defineProps<{
  titleEn: string
  titleZh: string
  desc: string
}>()
</script>

<template>
  <section class="timeline-cinematic-hero">
    <!-- Cinematic Background with explicit mask -->
    <div class="hero-bg-container">
      <img src="/images/timeline/chen-pingan-black-gold-timeline.webp" alt="Jian Lai Chronicle" class="hero-bg-image" />
      <div class="hero-bg-mask"></div>
    </div>

    <!-- Ambient Animation Layer -->
    <TimelineAmbientLayer />

    <!-- Content Layer -->
    <div class="hero-content">
      <!-- Title Area -->
      <div class="hero-header hero-entrance">
        <h1 class="hero-title">
          <span class="title-zh hero-entrance-stagger-1">{{ titleZh }}</span>
          <span class="title-en hero-entrance-stagger-2">{{ titleEn }}</span>
        </h1>
        <p class="hero-desc hero-entrance-stagger-3">{{ desc }}</p>
      </div>

      <!-- Slot for the Rail Component -->
      <div class="hero-interactive-zone hero-entrance-stagger-4">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline-cinematic-hero {
  position: relative;
  min-height: 100dvh;
  width: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at 22% 28%, rgba(212, 175, 55, 0.08), transparent 26rem),
    #050505;
}

/* Background Image & Mask */
.hero-bg-container {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  opacity: 0.64;
}

.hero-bg-mask {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(5, 5, 5, 0.94) 0%, rgba(5, 5, 5, 0.45) 42%, rgba(5, 5, 5, 0.88) 100%),
    linear-gradient(to bottom, rgba(5, 5, 5, 0.28) 0%, rgba(5, 5, 5, 0.2) 34%, rgba(5, 5, 5, 0.8) 73%, #050505 100%),
    radial-gradient(ellipse at 42% 20%, rgba(255, 238, 174, 0.12), transparent 28rem),
    radial-gradient(ellipse at center, transparent 0%, rgba(5, 5, 5, 0.52) 100%);
}

/* Foreground Content */
.hero-content {
  position: relative;
  z-index: 10;
  width: 100%;
  min-width: 0;
  max-width: 1480px;
  margin: 0 auto;
  padding: clamp(6rem, 9vh, 7.5rem) clamp(1.25rem, 4vw, 4.5rem) clamp(1.5rem, 4vh, 3rem);
  display: grid;
  grid-template-rows: minmax(15rem, 35dvh) minmax(0, auto);
  gap: clamp(1.75rem, 4.4vh, 3.5rem);
  align-content: space-between;
  min-height: 100dvh;
}

.hero-header {
  position: relative;
  align-self: center;
  width: 100%;
  min-width: 0;
  max-width: min(660px, 62vw);
  padding-left: clamp(1rem, 2vw, 1.5rem);
  isolation: isolate;
}

.hero-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.25rem;
  bottom: 0.35rem;
  width: 2px;
  background: linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.82), rgba(184, 42, 42, 0.5), transparent);
  box-shadow: 0 0 24px rgba(212, 175, 55, 0.26);
}

.hero-header::after {
  content: '';
  position: absolute;
  inset: -1.5rem -2rem -1.25rem 0;
  z-index: -1;
  background: linear-gradient(90deg, rgba(5, 5, 5, 0.5), transparent 76%);
  pointer-events: none;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
}

.title-zh {
  font-family: var(--font-zh-display, "FZWeibei-S03S", serif);
  font-size: clamp(3.3rem, 7.2vw, 6.4rem);
  line-height: 1;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #fff; /* fallback */
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.title-en {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #d9bd68;
  opacity: 0.88;
}

.hero-desc {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.68);
  max-width: 48ch;
  margin: 0;
  text-wrap: pretty;
}

.hero-interactive-zone {
  width: 100%;
  min-width: 0;
  align-self: end;
  padding-bottom: clamp(0.5rem, 1.8vh, 1.5rem);
}

@media (max-width: 768px) {
  .hero-content {
    min-height: auto;
    padding: 5.75rem 1rem 1.5rem;
    grid-template-rows: auto auto;
    gap: 2.25rem;
  }

  .hero-bg-image {
    object-position: 58% top;
    opacity: 0.5;
  }

  .hero-bg-mask {
    background:
      linear-gradient(90deg, rgba(5, 5, 5, 0.94) 0%, rgba(5, 5, 5, 0.58) 62%, rgba(5, 5, 5, 0.9) 100%),
      linear-gradient(to bottom, rgba(5, 5, 5, 0.36) 0%, rgba(5, 5, 5, 0.36) 32%, #050505 100%);
  }

  .hero-header {
    max-width: 100%;
    padding-left: 1rem;
  }
  
  .hero-interactive-zone {
    padding-bottom: 0;
  }
}

/* Entrance Animations */
.hero-bg-image {
  animation: bgFadeIn 2s ease-out forwards;
}

@keyframes bgFadeIn {
  from { opacity: 0; transform: scale(1.05); }
  to { opacity: 0.64; transform: scale(1); }
}

.hero-entrance-stagger-1 {
  opacity: 0;
  animation: heroRise 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 0.4s;
}

.hero-entrance-stagger-2 {
  opacity: 0;
  animation: heroRise 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 0.6s;
}

.hero-entrance-stagger-3 {
  opacity: 0;
  animation: heroRise 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 0.8s;
}

.hero-entrance-stagger-4 {
  opacity: 0;
  animation: heroFadeIn 1.5s ease-out forwards 1.2s;
}

@keyframes heroRise {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes heroFadeIn {
  from {
    opacity: 0;
    filter: blur(4px);
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-bg-image,
  .hero-entrance-stagger-1,
  .hero-entrance-stagger-2,
  .hero-entrance-stagger-3,
  .hero-entrance-stagger-4 {
    animation: none;
    opacity: 1;
    transform: none;
    filter: none;
  }
  .hero-bg-image {
    opacity: 0.64;
  }
}
</style>
