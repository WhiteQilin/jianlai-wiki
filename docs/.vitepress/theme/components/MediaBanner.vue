<script setup lang="ts">
defineProps<{
  image: string
  title: string
  description?: string
  caption?: string
}>()
</script>

<template>
  <div class="media-banner animate-fade-up">
    <div class="banner-image-wrapper">
      <img :src="image" :alt="title" class="banner-image" loading="lazy" />
      <div class="banner-overlay"></div>
    </div>
    
    <div class="banner-content">
      <h1 class="banner-title">{{ title }}</h1>
      <p v-if="description" class="banner-desc">{{ description }}</p>
    </div>

    <div v-if="caption" class="banner-caption">{{ caption }}</div>
  </div>
</template>

<style scoped>
.media-banner {
  width: 100%;
  position: relative;
  margin: 2rem 0 3rem;
  border-bottom: 2px solid var(--jl-c-ink);
  padding-bottom: 1rem;
}

.banner-image-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  margin-bottom: 2rem;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.1);
  mix-blend-mode: multiply;
}

.dark .banner-image {
  mix-blend-mode: screen;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, var(--vp-c-bg) 100%);
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.banner-title {
  font-family: var(--jl-font-heading);
  font-size: 3rem;
  color: var(--jl-c-ink);
  margin: 0 0 1rem 0;
  font-weight: 400;
  letter-spacing: 0.05em;
  border: none;
  padding: 0;
}

.banner-title::after {
  content: '';
  display: block;
  width: 40px;
  height: 2px;
  background-color: var(--jl-c-seal-red);
  margin: 1.5rem auto 0;
}

.banner-desc {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.banner-caption {
  position: absolute;
  right: 0;
  bottom: 1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (max-width: 768px) {
  .banner-image-wrapper { height: 150px; }
  .banner-title { font-size: 2.2rem; }
  .banner-caption { position: static; text-align: center; margin-top: 1rem; }
}
</style>
