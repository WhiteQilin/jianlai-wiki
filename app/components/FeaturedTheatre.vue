<script setup lang="ts">
import VideoEmbed from './VideoEmbed.vue'

const videos = [
  {
    id: 'ink-wash',
    url: '/videos/ink-wash-pv.mp4',
    poster: '/images/banners/world-banner.webp',
    title: 'Ink-Wash Aesthetic',
    caption: 'Experience the unique Donghua ink-wash style.',
  },
  {
    id: 'fight-scene',
    url: '/videos/fight-scene.mp4',
    poster: '/images/banners/characters-banner.webp',
    title: 'Epic Confrontations',
    caption: 'Fluid combat sequences and breathtaking swordsmanship.',
  },
  {
    id: 'lore-secret',
    url: '/videos/lore-secret.mp4',
    poster: '/images/banners/factions-banner.webp',
    title: 'Secrets of Lizhu',
    caption: 'Uncovering the truth behind the hidden realm.',
  }
]
</script>

<template>
  <div class="featured-theatre">
    <div class="theatre-header">
      <h3 class="section-title">Cinematic Archives</h3>
      <div class="title-line"></div>
    </div>

    <div class="theatre-grid">
      <ScrollReveal
        v-for="(video, index) in videos"
        :key="video.id"
        animation="reveal-fade-up"
        :delay="(`stagger-${index + 1}` as any)"
        class="theatre-item"
      >
        <div class="video-container hover-lift">
          <VideoEmbed 
            :video="video.url" 
            :poster="video.poster"
            :caption="video.caption" 
            :isOfficial="true" 
          />
          <h4 class="video-title">{{ video.title }}</h4>
        </div>
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>
.featured-theatre {
  width: 100%;
  margin: 4rem 0;
  padding: 0 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.theatre-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: var(--c-ink);
  font-weight: 400;
  margin: 0;
  white-space: nowrap;
}

.title-line {
  flex-grow: 1;
  height: 1px;
  background: var(--c-border);
}

.theatre-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.theatre-item {
  display: flex;
  flex-direction: column;
}

.video-container {
  background: var(--c-paper-alt);
  border: 1px solid var(--c-border);
  padding: 1rem;
  border-radius: 4px;
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.video-container:hover {
  border-color: var(--c-seal-red);
  box-shadow: 0 20px 40px var(--c-seal-red-soft);
  transform: translateY(-8px);
}

.video-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--c-ink);
  margin: 1rem 0 0.5rem;
  text-align: center;
}

/* Fix inner VideoEmbed spacing */
:deep(.video-embed) {
  margin: 0 !important;
  flex-grow: 1;
}

:deep(.video-wrapper) {
  width: 100%;
  height: 100%;
  display: flex;
  background: black;
}

:deep(.embed-video) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.video-caption) {
  font-size: 0.85rem;
  color: var(--c-text-3);
  margin-top: 0.5rem;
}
</style>
