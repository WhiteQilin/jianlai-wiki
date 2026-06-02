<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getMediaUrl } from '~/constants/homeHeroVideos'

const props = withDefaults(defineProps<{
  video: string
  poster?: string
  titleEn?: string
  titleZh?: string
  pinyin?: string
  seal?: string
  credit?: string
  isOfficial?: boolean
}>(), {
  isOfficial: true,
})

const videoRef = ref<HTMLVideoElement | null>(null)
const isMuted = ref(true)
const hasFailed = ref(false)

const resolvedVideo = computed(() => getMediaUrl(props.video))
const resolvedPoster = computed(() => (props.poster ? getMediaUrl(props.poster) : undefined))
const watermarkChar = computed(() => props.seal || props.titleZh?.charAt(0) || props.titleEn?.charAt(0) || '')

const toggleMute = () => {
  const el = videoRef.value
  if (!el) return
  el.muted = !el.muted
  isMuted.value = el.muted
  // A user gesture; if it was paused for any reason, resume.
  if (el.paused) void el.play().catch(() => {})
}

const handleError = () => {
  hasFailed.value = true
}

onMounted(() => {
  const el = videoRef.value
  if (!el) return
  el.muted = true
  isMuted.value = true
  // Autoplay must be muted to be allowed; ignore rejection silently.
  void el.play().catch(() => {})
})

onBeforeUnmount(() => {
  const el = videoRef.value
  if (el) {
    el.pause()
  }
})
</script>

<template>
  <section class="character-hero" :aria-label="titleEn ? `${titleEn} feature video` : 'Feature video'">
    <div class="hero-media">
      <video
        v-if="!hasFailed"
        ref="videoRef"
        class="hero-video"
        :src="resolvedVideo"
        :poster="resolvedPoster"
        autoplay
        loop
        muted
        playsinline
        preload="metadata"
        controlslist="nodownload"
        oncontextmenu="return false;"
        @error="handleError"
      ></video>
      <div v-else class="hero-fallback" aria-hidden="true"></div>

      <!-- Cinematic ink-wash treatment -->
      <div class="hero-vignette" aria-hidden="true"></div>
      <div class="hero-fade" aria-hidden="true"></div>
      <div v-if="watermarkChar" class="hero-watermark" aria-hidden="true">{{ watermarkChar }}</div>
    </div>

    <div v-if="isOfficial || credit" class="hero-attribution">
      <span v-if="isOfficial" class="official-tag">Official Promotional Video</span>
      <span v-if="credit" class="credit-tag">Credit: {{ credit }}</span>
    </div>

    <button
      v-if="!hasFailed"
      type="button"
      class="mute-toggle"
      :aria-label="isMuted ? 'Unmute video' : 'Mute video'"
      @click="toggleMute"
    >
      <span aria-hidden="true">{{ isMuted ? '🔇' : '🔊' }}</span>
    </button>
  </section>
</template>

<style scoped>
.character-hero {
  position: relative;
  width: 100%;
  /* Cinematic but restrained; fades into the page below. */
  height: clamp(320px, 52vh, 560px);
  overflow: hidden;
  background: #0a0a0a;
  /* Soft fade-in entrance */
  animation: hero-fade-in 1.1s ease-out both;
}

@keyframes hero-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.hero-media {
  position: absolute;
  inset: 0;
}

.hero-video,
.hero-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  /* Subtle slow zoom for a living, cinematic feel */
  animation: hero-ken-burns 24s ease-in-out infinite alternate;
}

.hero-fallback {
  background:
    radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--c-charcoal) 60%, #000) 0%, #050505 80%),
    url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  animation: none;
}

@keyframes hero-ken-burns {
  from { transform: scale(1.04); }
  to { transform: scale(1.12); }
}

/* Edge vignette to focus the frame */
.hero-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 42%,
    transparent 48%,
    rgba(0, 0, 0, 0.42) 100%
  );
  pointer-events: none;
}

/* Bottom gradient so the video melts into the page background */
.hero-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.18) 0%,
    transparent 28%,
    transparent 62%,
    var(--c-bg) 100%
  );
  pointer-events: none;
}

.hero-watermark {
  position: absolute;
  right: 3vw;
  bottom: -0.16em;
  z-index: 1;
  font-family: var(--font-zh-display);
  font-size: clamp(9rem, 26vw, 22rem);
  line-height: 1;
  color: #fff;
  opacity: 0.06;
  pointer-events: none;
  user-select: none;
  writing-mode: vertical-rl;
  text-orientation: upright;
}

.hero-attribution {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
  pointer-events: none;
}

.official-tag {
  background: rgba(184, 42, 42, 0.88);
  backdrop-filter: blur(4px);
  color: #fff;
  padding: 4px 9px;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border-radius: 2px;
}

.credit-tag {
  background: rgba(15, 15, 15, 0.6);
  backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.85);
  padding: 3px 8px;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  border-radius: 2px;
}

.mute-toggle {
  position: absolute;
  bottom: 1.1rem;
  right: 1.1rem;
  z-index: 3;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(10, 10, 10, 0.55);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease;
}

.mute-toggle:hover {
  background: rgba(184, 42, 42, 0.85);
  transform: scale(1.08);
}

@media (prefers-reduced-motion: reduce) {
  .character-hero,
  .hero-video,
  .hero-fallback {
    animation: none;
  }
}

@media (max-width: 640px) {
  .character-hero {
    height: clamp(240px, 40vh, 360px);
  }
  .mute-toggle {
    bottom: 0.8rem;
    right: 0.8rem;
    width: 34px;
    height: 34px;
  }
}
</style>
