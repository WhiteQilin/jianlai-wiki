<script setup lang="ts">
import { getMediaUrl } from '~/constants/homeHeroVideos'

defineProps<{
  titleEn: string
  titleZh: string
  desc: string
  link: string
  linkText?: string
  image?: string
  video?: string
  reverse?: boolean
}>()
</script>

<template>
  <section class="featured-section" :class="{ 'is-reversed': reverse }">
    <div class="featured-media">
      <video v-if="video" autoplay loop muted playsinline class="media-content">
        <source :src="getMediaUrl(video)" type="video/mp4" />
      </video>
      <img v-else-if="image" :src="getMediaUrl(image)" :alt="titleEn" class="media-content" />
      <div class="media-overlay"></div>
    </div>
    
    <div class="featured-content">
      <div class="content-inner">
        <h2 class="title-en">{{ titleEn }}</h2>
        <h3 class="title-zh">{{ titleZh }}</h3>
        <p class="desc">{{ desc }}</p>
        <NuxtLink :to="link" class="btn-primary hover-lift">
          {{ linkText || 'Explore' }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured-section {
  display: flex;
  width: 100%;
  min-height: 60vh;
  background: var(--c-bg);
  border-top: 1px solid var(--c-border);
  border-bottom: 1px solid var(--c-border);
  margin: 4rem 0;
  overflow: hidden;
}

.featured-section.is-reversed {
  flex-direction: row-reverse;
}

.featured-media {
  flex: 1;
  position: relative;
  min-height: 400px;
  overflow: hidden;
}

.media-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(80%) contrast(1.1);
  transition: filter 0.8s ease, transform 1.5s ease;
}

.featured-section:hover .media-content {
  filter: grayscale(20%) contrast(1.1);
  transform: scale(1.05);
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, var(--c-bg) 0%, transparent 20%, transparent 80%, var(--c-bg) 100%);
  pointer-events: none;
}

.featured-section.is-reversed .media-overlay {
  background: linear-gradient(to left, var(--c-bg) 0%, transparent 20%, transparent 80%, var(--c-bg) 100%);
}

.featured-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: var(--c-bg);
  position: relative;
  z-index: 1;
}

.content-inner {
  max-width: 500px;
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
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 0.3em;
}

.desc {
  font-size: 1.1rem;
  color: var(--c-text-2);
  line-height: 1.8;
  margin: 0 0 3rem 0;
}

@media (max-width: 1024px) {
  .featured-section,
  .featured-section.is-reversed {
    flex-direction: column;
  }
  
  .featured-media {
    min-height: 300px;
  }
  
  .media-overlay {
    background: linear-gradient(to bottom, transparent 50%, var(--c-bg) 100%) !important;
  }
  
  .featured-content {
    padding: 3rem 2rem;
  }
}

@media (max-width: 768px) {
  .title-en {
    font-size: 2.5rem;
  }
  .title-zh {
    font-size: 1.2rem;
  }
}
</style>
