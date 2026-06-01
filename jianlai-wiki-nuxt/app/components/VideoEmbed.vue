<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  video: string
  poster?: string
  caption?: string
  credit?: string
  isOfficial?: boolean
  ratio?: '9/16' | '16/9'
  fit?: 'cover' | 'contain'
  background?: string
  controlsVariant?: 'hero' | 'rail'
  fallbackVideo?: string
}>(), {
  ratio: '9/16',
  fit: 'cover',
  background: 'var(--c-charcoal)',
  controlsVariant: 'rail',
})

const videoRef = ref<HTMLVideoElement | null>(null)
const activeVideoSrc = ref(props.video)
const isPlaying = ref(false)
const isMuted = ref(false)
const hasStarted = ref(false)
const showControls = ref(true)
const currentTime = ref(0)
const duration = ref(0)
const isSeeking = ref(false)
const hasFallbackApplied = ref(false)

let controlsTimer: ReturnType<typeof setTimeout> | undefined
let visualCheckTimer: ReturnType<typeof setTimeout> | undefined

const canShowControls = computed(() => hasStarted.value && (showControls.value || !isPlaying.value))
const progressPercent = computed(() => duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0)

const formatTime = (timeValue: number) => {
  if (!Number.isFinite(timeValue)) return '0:00'
  const totalSeconds = Math.floor(timeValue)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

const clearControlsTimer = () => {
  if (controlsTimer) {
    clearTimeout(controlsTimer)
    controlsTimer = undefined
  }
}

const clearVisualCheckTimer = () => {
  if (visualCheckTimer) {
    clearTimeout(visualCheckTimer)
    visualCheckTimer = undefined
  }
}

const applyFallbackSource = async () => {
  if (!props.fallbackVideo || hasFallbackApplied.value || activeVideoSrc.value === props.fallbackVideo) return

  const previousTime = currentTime.value
  const shouldResume = isPlaying.value
  hasFallbackApplied.value = true
  activeVideoSrc.value = props.fallbackVideo

  await nextTick()

  if (!videoRef.value) return

  const restorePlayback = () => {
    if (!videoRef.value) return
    if (Number.isFinite(videoRef.value.duration) && previousTime > 0) {
      videoRef.value.currentTime = Math.min(previousTime, videoRef.value.duration || previousTime)
      currentTime.value = videoRef.value.currentTime
    }
    if (shouldResume) {
      void videoRef.value.play()
    }
    videoRef.value.removeEventListener('loadedmetadata', restorePlayback)
  }

  videoRef.value.addEventListener('loadedmetadata', restorePlayback)
  videoRef.value.load()
}

const scheduleControlsHide = () => {
  clearControlsTimer()
  if (!isPlaying.value) return
  controlsTimer = setTimeout(() => {
    showControls.value = false
  }, 1900)
}

const revealControls = () => {
  showControls.value = true
  scheduleControlsHide()
}

const togglePlay = async () => {
  if (!videoRef.value) return

  if (videoRef.value.paused) {
    try {
      await videoRef.value.play()
    } catch {
      return
    }
  } else {
    videoRef.value.pause()
  }
}

const seekBy = (seconds: number) => {
  if (!videoRef.value || !duration.value) return
  const nextTime = Math.max(0, Math.min(duration.value, videoRef.value.currentTime + seconds))
  videoRef.value.currentTime = nextTime
  currentTime.value = nextTime
}

const handlePlay = () => {
  isPlaying.value = true
  hasStarted.value = true
  revealControls()
}

const handlePause = () => {
  isPlaying.value = false
  showControls.value = true
  clearControlsTimer()
}

const handleLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = Number.isFinite(videoRef.value.duration) ? videoRef.value.duration : 0
  if (duration.value > 0 && videoRef.value.videoWidth === 0) {
    void applyFallbackSource()
  }
}

const handleTimeUpdate = () => {
  if (!videoRef.value || isSeeking.value) return
  currentTime.value = videoRef.value.currentTime
}

const handleSeek = (value: string) => {
  if (!videoRef.value) return
  const nextTime = Number(value)
  if (!Number.isFinite(nextTime)) return
  videoRef.value.currentTime = nextTime
  currentTime.value = nextTime
}

const toggleMute = () => {
  if (!videoRef.value) return
  videoRef.value.muted = !videoRef.value.muted
  isMuted.value = videoRef.value.muted
}

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case ' ':
    case 'Enter':
      event.preventDefault()
      void togglePlay()
      revealControls()
      break
    case 'ArrowRight':
      event.preventDefault()
      seekBy(5)
      revealControls()
      break
    case 'ArrowLeft':
      event.preventDefault()
      seekBy(-5)
      revealControls()
      break
    case 'm':
    case 'M':
      event.preventDefault()
      toggleMute()
      revealControls()
      break
  }
}

const handleVideoError = () => {
  void applyFallbackSource()
}

const scheduleVisualCheck = () => {
  clearVisualCheckTimer()
  visualCheckTimer = setTimeout(() => {
    if (!videoRef.value) return
    if (!videoRef.value.paused && videoRef.value.videoWidth === 0) {
      void applyFallbackSource()
    }
  }, 800)
}

watch(() => props.video, (newSource) => {
  activeVideoSrc.value = newSource
  hasFallbackApplied.value = false
})

onBeforeUnmount(() => {
  clearControlsTimer()
  clearVisualCheckTimer()
})
</script>

<template>
  <figure class="video-embed">
    <div 
      class="video-wrapper"
      :class="[
        `controls-${props.controlsVariant}`,
        { 'is-playing': isPlaying, 'has-started': hasStarted }
      ]"
      :style="{ aspectRatio: props.ratio, background: props.background }"
      tabindex="0"
      @mousemove="revealControls"
      @focusin="revealControls"
      @mouseleave="scheduleControlsHide"
      @keydown="handleKeydown"
    >
      <video 
        ref="videoRef"
        :src="activeVideoSrc"
        :poster="props.poster"
        playsinline
        preload="metadata"
        class="embed-video"
        :style="{ objectFit: props.fit }"
        @click="togglePlay"
        @play="handlePlay"
        @pause="handlePause"
        @ended="handlePause"
        @loadedmetadata="handleLoadedMetadata"
        @timeupdate="handleTimeUpdate"
        @playing="scheduleVisualCheck"
        @error="handleVideoError"
      ></video>

      <div class="custom-play-overlay" v-if="!isPlaying" @click="togglePlay">
        <button class="play-button" type="button" aria-label="Play video">
          <span class="play-icon">></span>
        </button>
      </div>

      <div v-if="props.credit || props.isOfficial" class="media-attribution">
        <span v-if="props.isOfficial" class="official-badge">Official Promotional Video</span>
        <span v-if="props.credit" class="media-credit">Credit: {{ props.credit }}</span>
      </div>

      <div v-show="canShowControls" class="controls-bar" @click.stop>
        <button
          type="button"
          class="control-btn"
          :aria-label="isPlaying ? 'Pause video' : 'Play video'"
          @click="togglePlay"
        >
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>
        <div class="timeline-wrap">
          <input
            class="timeline"
            type="range"
            min="0"
            :max="duration || 0"
            step="0.1"
            :value="currentTime"
            :style="{ '--progress': `${progressPercent}%` }"
            @pointerdown="isSeeking = true"
            @pointerup="isSeeking = false"
            @input="handleSeek(($event.target as HTMLInputElement).value)"
          />
          <span class="timecode">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
        </div>
        <button
          type="button"
          class="control-btn"
          :aria-label="isMuted ? 'Unmute video' : 'Mute video'"
          @click="toggleMute"
        >
          {{ isMuted ? 'Unmute' : 'Mute' }}
        </button>
      </div>
    </div>
    
    <figcaption v-if="props.caption" class="video-caption">{{ props.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.video-embed {
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: auto;
}

.video-wrapper {
  position: relative;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  outline: none;
}

.embed-video {
  width: 100%;
  height: 100%;
  display: block;
  transition: opacity 0.3s ease;
}

.video-wrapper:not(.is-playing):hover .embed-video {
  opacity: 0.9;
}

.custom-play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.2));
  transition: opacity 0.3s ease;
  z-index: 5;
  cursor: pointer;
}

.video-wrapper:hover .custom-play-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.24));
}

.play-button {
  width: 60px;
  height: 60px;
  background: rgba(184, 42, 42, 0.9);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease;
  border: none;
  cursor: pointer;
}

.video-wrapper:hover .play-button {
  transform: scale(1.1);
  background: rgba(204, 58, 58, 1);
}

.play-icon {
  color: white;
  font-size: 1.5rem;
  margin-left: 4px;
}

.media-attribution {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  pointer-events: none;
  z-index: 10;
}

.official-badge {
  background: rgba(184, 42, 42, 0.85);
  backdrop-filter: blur(4px);
  color: #fff;
  padding: 4px 8px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 2px;
}

.media-credit {
  background: rgba(20, 20, 20, 0.6);
  color: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  font-size: 0.7rem;
  border-radius: 2px;
  backdrop-filter: blur(4px);
}

.controls-bar {
  position: absolute;
  left: 0.65rem;
  right: 0.65rem;
  bottom: 0.65rem;
  z-index: 11;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.55rem;
  border-radius: 8px;
  background: rgba(10, 10, 10, 0.62);
  backdrop-filter: blur(10px);
}

.control-btn {
  border: none;
  border-radius: 6px;
  height: 30px;
  padding: 0 0.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: 0.66rem;
  font-family: var(--font-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.24);
}

.timeline-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.timeline {
  width: 100%;
  appearance: none;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    var(--c-seal-red) 0%,
    var(--c-seal-red) var(--progress, 0%),
    rgba(255, 255, 255, 0.28) var(--progress, 0%),
    rgba(255, 255, 255, 0.28) 100%
  );
  cursor: pointer;
}

.timeline::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #fff;
}

.timeline::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #fff;
}

.timecode {
  font-family: var(--font-mono);
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.62rem;
  letter-spacing: 0.03em;
}

.controls-hero .controls-bar {
  left: 0.85rem;
  right: 0.85rem;
}

.controls-hero .official-badge {
  font-size: 0.62rem;
}

.controls-rail .controls-bar {
  left: 0.55rem;
  right: 0.55rem;
  bottom: 0.55rem;
  padding: 0.33rem 0.42rem;
  gap: 0.35rem;
  justify-content: initial;
}

.controls-rail .control-btn {
  height: 24px;
  padding: 0 0.45rem;
  font-size: 0.56rem;
}

.controls-rail .timeline-wrap {
  display: flex;
}

.controls-rail .timecode {
  font-size: 0.52rem;
}

.video-caption {
  margin-top: 1.2rem;
  font-size: 0.9rem;
  color: var(--c-text-2);
  font-style: italic;
  text-align: center;
  padding: 0 1rem;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .media-attribution {
    top: 0.6rem;
    right: 0.6rem;
  }

  .official-badge {
    font-size: 0.58rem;
    padding: 3px 6px;
  }

  .controls-bar {
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
  }
}
</style>
