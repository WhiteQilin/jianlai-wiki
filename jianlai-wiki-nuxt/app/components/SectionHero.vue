<script setup lang="ts">
defineProps<{
  titleEn: string
  titleZh: string
  desc: string
}>()
</script>

<template>
  <div class="section-hero animate-fade-in-up">
    <div class="hero-bg"></div>
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
