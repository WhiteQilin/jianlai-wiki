<script setup lang="ts">
defineProps<{
  titleEn: string
  titleZh: string
  desc: string
  bannerImage?: string
  credit?: string
  isOfficial?: boolean
}>()
</script>

<template>
  <div class="section-hero animate-fade-in-up">
    <div v-if="bannerImage" class="hero-banner">
      <img :src="bannerImage" alt="" class="banner-img" />
      <div class="banner-overlay"></div>
    </div>
    <div v-else class="hero-bg"></div>
    
    <div v-if="bannerImage && (credit || isOfficial)" class="banner-attribution">
      <span v-if="isOfficial" class="official-badge">Official Promotional Image</span>
      <span v-if="credit" class="credit-text">Credit: {{ credit }}</span>
    </div>

    <div class="hero-content">
      <h1 class="title-en">{{ titleEn }}</h1>
      <h2 class="title-zh">{{ titleZh }}</h2>
      <p class="desc">{{ desc }}</p>
    </div>
  </div>
</template>

<style scoped>
.section-hero {
  position: relative;
  padding: 5rem 2rem;
  text-align: center;
  border-bottom: 2px solid var(--c-ink);
  margin-bottom: 3rem;
  background: var(--c-bg-soft);
  overflow: hidden;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-banner {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(80%) contrast(1.2);
  opacity: 0.25;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, var(--c-bg-soft) 0%, transparent 50%, var(--c-bg-soft) 100%);
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
  background-image: repeating-linear-gradient(45deg, var(--c-divider) 0, var(--c-divider) 1px, transparent 1px, transparent 10px);
  opacity: 0.3;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.title-en {
  font-family: var(--font-heading);
  font-size: 3rem;
  color: var(--c-ink);
  margin: 0 0 0.5rem 0;
  font-weight: 400;
  letter-spacing: 0.05em;
}

.title-zh {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--c-text-3);
  margin: 0 0 1.5rem 0;
  font-weight: 400;
  letter-spacing: 0.2em;
}

.desc {
  font-size: 1.1rem;
  color: var(--c-text-2);
  line-height: 1.6;
  margin: 0;
}
</style>
