<script setup lang="ts">
defineProps<{
  titleEn?: string
  titleZh?: string
  desc?: string
  bannerImage?: string
  video?: string
  credit?: string
  isOfficial?: boolean
}>()
</script>

<template>
  <div class="section-hero animate-fade-in-up">
    <div v-if="video || bannerImage" class="hero-banner animate-ken-burns">
      <video v-if="video" autoplay loop muted playsinline controlslist="nodownload" oncontextmenu="return false;" class="banner-video">
        <source :src="video" type="video/mp4" />
      </video>
      <img v-else-if="bannerImage" :src="bannerImage" alt="" class="banner-img" />
      <div class="banner-overlay"></div>
    </div>
    <div v-else class="hero-bg"></div>

    <div class="hero-watermark" aria-hidden="true">{{ titleZh?.charAt(0) || titleEn?.charAt(0) || '卷' }}</div>
    <div class="hero-corner hero-corner-left" aria-hidden="true"></div>
    <div class="hero-corner hero-corner-right" aria-hidden="true"></div>
    
    <div v-if="bannerImage && (credit || isOfficial)" class="banner-attribution">
      <span v-if="isOfficial" class="official-badge">Official Promotional Image</span>
      <span v-if="credit" class="credit-text">Credit: {{ credit }}</span>
    </div>

    <div class="hero-content">
      <SealBadge v-if="titleZh" :text="titleZh.charAt(0)" variant="outline" shape="square" />
      <h1 class="title-en">{{ titleEn }}</h1>
      <h2 class="title-zh">{{ titleZh }}</h2>
      <OrnamentalDivider motif="jade" color="celadon" />
      <p class="desc">{{ desc }}</p>
    </div>
  </div>
</template>

<style scoped>
.section-hero {
  position: relative;
  padding: clamp(4rem, 8vw, 6rem) 2rem;
  text-align: center;
  border-bottom: 1px solid color-mix(in srgb, var(--c-ink) 62%, transparent);
  margin-bottom: 3rem;
  background:
    linear-gradient(180deg, var(--c-bg-soft), color-mix(in srgb, var(--c-paper) 82%, var(--c-mist))),
    var(--c-bg-soft);
  overflow: hidden;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-hero::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -1px;
  width: min(420px, 72vw);
  height: 2px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent, var(--c-seal-red), transparent);
  opacity: 0.48;
  pointer-events: none;
}

.hero-banner {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.banner-img,
.banner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(80%) contrast(1.2);
  opacity: 0.25;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 38%, transparent 0%, var(--c-bg-soft) 78%),
    linear-gradient(to bottom, var(--c-bg-soft) 0%, transparent 50%, var(--c-bg-soft) 100%);
}

.banner-attribution {
  position: absolute;
  bottom: 1rem;
  right: 1.5rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}

.official-badge {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
}

.credit-text {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--c-text-3);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image:
    url('/images/textures/ink-wash-02.webp'),
    repeating-linear-gradient(45deg, var(--c-divider) 0, var(--c-divider) 1px, transparent 1px, transparent 10px);
  background-size: cover, auto;
  opacity: 0.16;
  pointer-events: none;
}

.hero-watermark {
  position: absolute;
  inset: auto 3vw -0.2em auto;
  z-index: 0;
  font-family: var(--font-zh-display);
  font-size: clamp(8rem, 24vw, 18rem);
  line-height: 1;
  color: var(--c-ink);
  opacity: 0.04;
  pointer-events: none;
}

.hero-corner {
  position: absolute;
  top: 2rem;
  width: clamp(5rem, 12vw, 9rem);
  height: clamp(2rem, 5vw, 3.5rem);
  color: var(--c-teal-accent);
  opacity: 0.28;
  pointer-events: none;
}

.hero-corner::before,
.hero-corner::after {
  content: '';
  position: absolute;
  inset: 0;
  border-top: 1px solid currentColor;
  border-radius: 999px 999px 0 0;
}

.hero-corner::after {
  top: 0.9rem;
  left: 1.4rem;
  width: 58%;
  opacity: 0.75;
}

.hero-corner-left {
  left: 2rem;
}

.hero-corner-right {
  right: 2rem;
  transform: scaleX(-1);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-content :deep(.seal-badge) {
  margin-bottom: 1rem;
}

.hero-content :deep(.ornamental-divider) {
  max-width: 320px;
  margin: 1rem auto 1.35rem;
}

.title-en {
  font-family: var(--font-heading);
  font-size: clamp(2.4rem, 6vw, 3.4rem);
  color: var(--c-ink);
  margin: 0 0 0.5rem 0;
  font-weight: 400;
  letter-spacing: 0.05em;
}

.title-zh {
  font-family: var(--font-zh-display);
  font-size: clamp(1.5rem, 4vw, 2.1rem);
  color: var(--c-text-2);
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.18em;
}

.desc {
  font-size: 1.1rem;
  color: var(--c-text-2);
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 640px) {
  .banner-attribution {
    right: 1rem;
    left: 1rem;
    align-items: center;
  }

  .hero-corner {
    display: none;
  }
}
</style>
