<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  image?: string
  video?: string
  alt?: string
  caption?: string
  credit?: string
  isOfficial?: boolean
}>()
const emit = defineEmits<{
  'video-error': []
}>()

const hasVideoError = ref(false)

watch(() => props.video, () => {
  hasVideoError.value = false
})

const handleVideoError = () => {
  hasVideoError.value = true
  emit('video-error')
}

// True only when a real video is playing (not errored).
const videoActive = computed(() => Boolean(props.video) && !hasVideoError.value)
</script>

<template>
  <div class="hero-media">
    <div class="hero-background">
      <!-- Expose video-active state so atmosphere layers (e.g. ink mist) can hide behind a playing video -->
      <slot name="background" :videoActive="videoActive" />
      <div class="bg-media-wrapper" :class="{ 'animate-ken-burns': !videoActive }">
        <!-- Ken Burns slow-zoom is reserved for static posters/fallbacks; videos already carry their own motion. -->
        <video
          v-if="videoActive"
          :key="props.video"
          :src="props.video"
          autoplay
          loop
          muted
          playsinline
          controlslist="nodownload"
          oncontextmenu="return false;"
          :poster="props.image"
          class="bg-video"
          @error="handleVideoError"
        />
        <img v-if="props.image" :src="props.image" :alt="props.alt || ''" class="bg-image" :class="{ 'fallback-only': videoActive }" />
        <div v-else-if="!props.video" class="bg-fallback animate-fade-in-up"></div>
      </div>
      <div class="bg-overlay"></div>
    </div>

    <div v-if="props.credit || props.caption || props.isOfficial" class="media-attribution animate-fade-in-up" style="animation-delay: 1.2s;">
      <span v-if="props.isOfficial" class="official-badge">Official Promotional Media</span>
      <p v-if="props.caption" class="media-caption">{{ props.caption }}</p>
      <p v-if="props.credit" class="media-credit">Credit: {{ props.credit }}</p>
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

.bg-media-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.bg-video,
.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(55%) contrast(1.08);
  opacity: 0;
  animation: fadeIn 2s ease-out forwards;
  position: absolute;
  top: 0;
  left: 0;
}

.fallback-only {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .animate-ken-burns {
    animation: none !important;
  }
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
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 0%, var(--c-bg) 82%);
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 0.62; }
}
</style>
