<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getMediaUrl } from '~/constants/homeHeroVideos'

const isPlaying = ref(true)
const videoUrl = computed(() => getMediaUrl('/videos/curated/intro-logo.mp4'))

const closeIntro = () => {
  isPlaying.value = false
  sessionStorage.setItem('jianlai_intro_played', 'true')
  document.body.style.overflow = 'auto'
}

onMounted(() => {
  const hasPlayed = sessionStorage.getItem('jianlai_intro_played')
  
  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  if (hasPlayed || prefersReducedMotion) {
    isPlaying.value = false
  } else {
    // Lock scroll while intro is playing
    document.body.style.overflow = 'hidden'
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isPlaying" class="intro-sequence">
      <video 
        class="intro-video"
        autoplay 
        muted 
        playsinline
        controlslist="nodownload"
        oncontextmenu="return false;"
        @ended="closeIntro"
      >
        <source :src="videoUrl" type="video/mp4" />
      </video>
      
      <div class="intro-overlay"></div>
      
      <button class="skip-btn" @click="closeIntro">
        <span class="skip-text">Skip Intro</span>
        <span class="skip-arrow">→</span>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.intro-sequence {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.intro-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.intro-overlay {
  position: absolute;
  inset: 0;
  /* Add a subtle vignette so the skip button is visible */
  background: radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%);
  pointer-events: none;
}

.skip-btn {
  position: absolute;
  bottom: 3rem;
  right: 3rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  z-index: 10;
}

.skip-text {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.skip-arrow {
  transition: transform 0.3s ease;
}

.skip-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.skip-btn:hover .skip-arrow {
  transform: translateX(4px);
}

/* Vue Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .skip-btn {
    bottom: 2rem;
    right: 1.5rem;
  }
}
</style>
