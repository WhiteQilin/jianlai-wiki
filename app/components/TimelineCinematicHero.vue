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
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #050505; /* Near black base */
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
  opacity: 0.6; /* Increased opacity as this asset is designed for dark mode */
}

.hero-bg-mask {
  position: absolute;
  inset: 0;
  /* Complex gradient mask to fade to black at edges and bottom for readability */
  background:
    linear-gradient(to bottom, rgba(5, 5, 5, 0) 0%, rgba(5, 5, 5, 0.6) 60%, rgba(5, 5, 5, 1) 100%),
    radial-gradient(ellipse at center, transparent 0%, rgba(5, 5, 5, 0.5) 100%);
}

/* Foreground Content */
.hero-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: var(--layout-max-width, 1400px);
  margin: 0 auto;
  padding: 6rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100dvh;
}

.hero-header {
  max-width: 600px;
  margin-top: 4rem;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
}

.title-zh {
  font-family: var(--font-zh-display, "FZWeibei-S03S", serif);
  font-size: clamp(3rem, 8vw, 6rem);
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
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--c-gold, #d4af37);
  opacity: 0.8;
}

.hero-desc {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  max-width: 45ch;
  margin: 0;
}

.hero-interactive-zone {
  width: 100%;
  margin-top: auto;
  padding-bottom: 4rem;
}

@media (max-width: 768px) {
  .hero-content {
    padding-top: 4rem;
    justify-content: flex-start;
    gap: 4rem;
  }
  
  .hero-interactive-zone {
    margin-top: 0;
    padding-bottom: 2rem;
  }
}

/* Entrance Animations */
.hero-bg-image {
  animation: bgFadeIn 2s ease-out forwards;
}

@keyframes bgFadeIn {
  from { opacity: 0; transform: scale(1.05); }
  to { opacity: 0.6; transform: scale(1); }
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
    opacity: 0.6;
  }
}
</style>
