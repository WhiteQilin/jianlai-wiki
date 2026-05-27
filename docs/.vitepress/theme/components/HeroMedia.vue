<script setup lang="ts">
defineProps<{
  image?: string
  video?: string
}>()
</script>

<template>
  <div class="hero-media">
    <div class="hero-background">
      <video v-if="video" autoplay loop muted playsinline class="bg-video">
        <source :src="video" type="video/mp4" />
      </video>
      <img v-else-if="image" :src="image" alt="" class="bg-image" />
      <div v-else class="bg-fallback animate-fade-up"></div>
      
      <!-- Subtle ink gradient overlay to ensure text readability -->
      <div class="bg-overlay"></div>
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
  border-bottom: 1px solid var(--vp-c-border);
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

.dark .bg-video,
.dark .bg-image {
  opacity: 0.3;
}

.bg-fallback {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, var(--vp-c-bg) 20%, var(--vp-c-bg-soft) 100%);
  opacity: 0.7;
}

.bg-fallback::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  opacity: 0.03;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.dark .bg-fallback::after {
  opacity: 0.02;
  mix-blend-mode: overlay;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, var(--vp-c-bg) 90%);
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
  padding: 0 2rem;
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
