<script setup lang="ts">
defineProps<{
  image?: string
  video?: string
  alt?: string
  caption?: string
  credit?: string
  isOfficial?: boolean
}>()
</script>

<template>
  <div class="hero-media">
    <div class="hero-background">
      <slot name="background" />
      <video v-if="video" autoplay loop muted playsinline class="bg-video">
        <source :src="video" type="video/mp4" />
      </video>
      <img v-else-if="image" :src="image" :alt="alt || ''" class="bg-image" />
      <div v-else class="bg-fallback animate-fade-in-up"></div>
      
      <div class="bg-overlay"></div>
    </div>

    <div v-if="credit || caption || isOfficial" class="media-attribution animate-fade-in-up" style="animation-delay: 1.2s;">
      <span v-if="isOfficial" class="official-badge">Official Promotional Image</span>
      <p v-if="caption" class="media-caption">{{ caption }}</p>
      <p v-if="credit" class="media-credit">Credit: {{ credit }}</p>
    </div>

    <div class="hero-content">
      <slot />
    </div>

    <div class="hero-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.hero-media {
  position: relative;
  width: 100%;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-bottom: 1px solid var(--c-border);
  padding: 4rem 2rem;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bg-video,
.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.1);
  opacity: 0.15;
}

.bg-fallback {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, var(--c-bg) 20%, var(--c-bg-soft) 100%);
  opacity: 0.7;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, var(--c-bg) 90%);
}

.media-attribution {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  z-index: 2;
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  pointer-events: none;
}

.official-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.2rem;
  backdrop-filter: blur(4px);
}

.media-caption {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.media-credit {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.dark .media-attribution p {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
}

.hero-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

@media (max-width: 768px) {
  .hero-media {
    min-height: 70vh;
  }
}
</style>
