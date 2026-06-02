<script setup lang="ts">
import VideoEmbed from './VideoEmbed.vue'

const featuredVideo = {
  id: 'fight-scene',
  url: '/videos/curated/home-hero-02.mp4',
  poster: '/images/banners/swordsmanship-banner.webp',
  title: 'Epic Confrontations',
  caption: 'Fluid combat sequences and breathtaking swordsmanship.',
  ratio: '16/9' as const,
  fit: 'cover' as const,
  bg: '#111',
  eyebrow: 'Featured Duel',
}

const supportingVideos = [
  {
    id: 'ink-wash',
    url: '/videos/curated/home-hero-03.mp4',
    poster: '/images/banners/world-banner.webp',
    title: 'Ink-Wash Aesthetic',
    caption: 'Experience the unique Donghua ink-wash style.',
    ratio: '16/9' as const,
    fit: 'cover' as const,
    bg: '#111',
    eyebrow: 'Visual Craft',
  },
  {
    id: 'lore-secret',
    url: '/videos/curated/home-hero-04.mp4',
    poster: '/images/banners/factions-banner.webp',
    title: 'Secrets of Lizhu',
    caption: 'Uncovering the truth behind the hidden realm.',
    ratio: '16/9' as const,
    fit: 'cover' as const,
    bg: '#111',
    eyebrow: 'Mystic Lore',
  }
]
</script>

<template>
  <div class="featured-theatre">
    <div class="theatre-header">
      <SealBadge text="影" variant="outline" shape="square" />
      <h3 class="section-title">Cinematic Archives</h3>
      <OrnamentalDivider motif="ruyi" color="ink" />
    </div>

    <div class="theatre-layout">
      <ScrollReveal
        :key="featuredVideo.id"
        animation="reveal-fade-up"
        delay="stagger-1"
        class="theatre-item featured-item"
      >
        <article class="video-card featured-card hover-lift">
          <VideoEmbed
            :video="featuredVideo.url"
            :poster="featuredVideo.poster"
            :isOfficial="true"
            :ratio="featuredVideo.ratio"
            :fit="featuredVideo.fit"
            :background="featuredVideo.bg"
            controlsVariant="hero"
            fallbackVideo="/videos/curated/home-hero-01.mp4"
          />
          <div class="card-content">
            <span class="card-eyebrow">{{ featuredVideo.eyebrow }}</span>
            <h4 class="video-title">{{ featuredVideo.title }}</h4>
            <p class="video-caption">{{ featuredVideo.caption }}</p>
          </div>
        </article>
      </ScrollReveal>

      <div class="supporting-rail">
        <ScrollReveal
          v-for="(video, index) in supportingVideos"
          :key="video.id"
          animation="reveal-fade-up"
          :delay="(`stagger-${index + 2}` as any)"
          class="theatre-item supporting-item"
        >
          <article class="video-card supporting-card hover-lift">
            <VideoEmbed
              :video="video.url"
              :poster="video.poster"
              :isOfficial="true"
              :ratio="video.ratio"
              :fit="video.fit"
              :background="video.bg"
              controlsVariant="rail"
              fallbackVideo="/videos/curated/home-hero-01.mp4"
            />
            <div class="card-content">
              <span class="card-eyebrow">{{ video.eyebrow }}</span>
              <h4 class="video-title">{{ video.title }}</h4>
              <p class="video-caption">{{ video.caption }}</p>
            </div>
          </article>
        </ScrollReveal>
      </div>
    </div>
  </div>
</template>

<style scoped>
.featured-theatre {
  width: 100%;
  margin: 4.5rem 0;
  padding: 0 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.theatre-header {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  margin-bottom: 2.5rem;
}

.theatre-header :deep(.ornamental-divider) {
  flex: 1;
  margin: 0;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: var(--c-ink);
  font-weight: 400;
  margin: 0;
  white-space: nowrap;
}

.theatre-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.supporting-rail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .supporting-rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 640px) {
  .theatre-layout {
    gap: 1.5rem;
  }
  .supporting-rail {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .featured-theatre {
    padding: 0 1rem;
  }
  .theatre-header {
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }
  .section-title {
    font-size: 1.55rem;
  }
}

.theatre-item {
  display: flex;
  flex-direction: column;
}

.video-card {
  border: 1px solid var(--c-border);
  border-radius: 10px;
  overflow: hidden;
  background: color-mix(in srgb, var(--c-bg) 88%, var(--c-charcoal) 12%);
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.featured-card {
  width: 100%;
}

.supporting-card {
  display: flex;
  flex-direction: column;
  min-height: auto;
}

.video-card:hover {
  border-color: color-mix(in srgb, var(--c-seal-red) 45%, var(--c-border) 55%);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.11);
}

.dark .video-card:hover {
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.42);
}

.card-content {
  padding: 1.1rem 1.2rem 1.35rem;
  border-top: 1px solid color-mix(in srgb, var(--c-border) 85%, transparent);
}

.card-eyebrow {
  display: inline-block;
  margin-bottom: 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-text-3);
}

.video-title {
  font-family: var(--font-heading);
  font-size: 1.32rem;
  color: var(--c-ink);
  margin: 0 0 0.45rem;
  text-align: left;
  line-height: 1.2;
  transition: color 0.3s ease;
}

.featured-card .video-title {
  font-size: 1.55rem;
}

.featured-card .card-content {
  padding: 1.25rem 1.35rem 1.5rem;
}

.video-card:hover .video-title {
  color: var(--c-seal-red);
}

.video-caption {
  font-size: 0.93rem;
  color: var(--c-text-2);
  margin: 0;
  line-height: 1.55;
  font-style: italic;
  text-align: left;
  max-width: 44ch;
}

:deep(.video-embed) {
  margin: 0;
}

:deep(.video-wrapper) {
  width: 100%;
  border-radius: 0;
  box-shadow: none;
}

.video-card:hover :deep(.video-wrapper) {
  transform: none;
  box-shadow: none;
}

:deep(.embed-video) {
  width: 100%;
  height: 100%;
}
</style>
