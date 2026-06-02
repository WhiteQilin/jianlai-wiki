<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { getMediaUrl } from '~/constants/homeHeroVideos'

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
const trackRef = ref<HTMLElement | null>(null)

const activeVideoSrc = ref(getMediaUrl(props.video))
const isPlaying = ref(false)
const isMuted = ref(false)
const hasStarted = ref(false)
const showControls = ref(true)
const currentTime = ref(0)
const duration = ref(0)
const bufferedEnd = ref(0)
const isScrubbing = ref(false)
const hasFallbackApplied = ref(false)
// Once a real video frame has decoded we know the codec is supported and must
// never fall back for visual reasons (prevents false positives mid-playback).
const hasHealthyVideo = ref(false)

let controlsTimer: ReturnType<typeof setTimeout> | undefined
let visualCheckTimer: ReturnType<typeof setTimeout> | undefined

// The visual-health check retries within a grace window instead of swapping to
// the fallback the instant videoWidth reads 0 (which can happen transiently
// before the first frame is decoded on a perfectly valid video).
const VISUAL_CHECK_INTERVAL = 400
const VISUAL_CHECK_MAX_ATTEMPTS = 6

const hasDuration = computed(() => duration.value > 0 && Number.isFinite(duration.value))
const canShowControls = computed(() => hasStarted.value && (showControls.value || !isPlaying.value))
const progressPercent = computed(() => hasDuration.value ? Math.min(100, (currentTime.value / duration.value) * 100) : 0)
const bufferedPercent = computed(() => hasDuration.value ? Math.min(100, (bufferedEnd.value / duration.value) * 100) : 0)

const formatTime = (timeValue: number) => {
  if (!Number.isFinite(timeValue) || timeValue < 0) return '0:00'
  const totalSeconds = Math.floor(timeValue)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

// --- Duration capture -------------------------------------------------------
// Re-reads the element's duration from any event that might surface it. Some
// re-encoded/faststart MP4s do not expose a finite duration at loadedmetadata,
// so we also listen to durationchange/canplay and re-check on timeupdate.
const syncDuration = () => {
  const el = videoRef.value
  if (!el) return
  if (Number.isFinite(el.duration) && el.duration > 0) {
    duration.value = el.duration
  }
}

const syncBuffered = () => {
  const el = videoRef.value
  if (!el) return
  try {
    if (el.buffered.length > 0) {
      bufferedEnd.value = el.buffered.end(el.buffered.length - 1)
    }
  } catch {
    /* buffered can throw if not ready; ignore */
  }
}

// --- Controls visibility ----------------------------------------------------
const clearControlsTimer = () => {
  if (controlsTimer) {
    clearTimeout(controlsTimer)
    controlsTimer = undefined
  }
}

const scheduleControlsHide = () => {
  clearControlsTimer()
  if (!isPlaying.value || isScrubbing.value) return
  controlsTimer = setTimeout(() => {
    showControls.value = false
  }, 2200)
}

const revealControls = () => {
  showControls.value = true
  scheduleControlsHide()
}

// --- Visual health / codec fallback ----------------------------------------
const clearVisualCheckTimer = () => {
  if (visualCheckTimer) {
    clearTimeout(visualCheckTimer)
    visualCheckTimer = undefined
  }
}

const markHealthyIfVisible = () => {
  if (videoRef.value && videoRef.value.videoWidth > 0) {
    hasHealthyVideo.value = true
    clearVisualCheckTimer()
    return true
  }
  return false
}

const applyFallbackSource = async () => {
  const fallbackUrl = props.fallbackVideo ? getMediaUrl(props.fallbackVideo) : ''
  if (!fallbackUrl || hasFallbackApplied.value || activeVideoSrc.value === fallbackUrl) return

  const shouldResume = isPlaying.value
  hasFallbackApplied.value = true
  hasHealthyVideo.value = false
  clearVisualCheckTimer()
  currentTime.value = 0
  duration.value = 0
  bufferedEnd.value = 0
  activeVideoSrc.value = fallbackUrl

  await nextTick()
  if (!videoRef.value) return

  const onReady = () => {
    if (!videoRef.value) return
    syncDuration()
    if (shouldResume) void videoRef.value.play()
    videoRef.value?.removeEventListener('loadedmetadata', onReady)
  }
  videoRef.value.addEventListener('loadedmetadata', onReady)
  videoRef.value.load()
}

const runVisualCheck = (attempt: number) => {
  clearVisualCheckTimer()
  visualCheckTimer = setTimeout(() => {
    const el = videoRef.value
    if (!el) return
    if (el.videoWidth > 0) {
      hasHealthyVideo.value = true
      return
    }
    if (attempt + 1 < VISUAL_CHECK_MAX_ATTEMPTS) {
      runVisualCheck(attempt + 1)
      return
    }
    if (!el.paused) void applyFallbackSource()
  }, VISUAL_CHECK_INTERVAL)
}

const scheduleVisualCheck = () => {
  if (hasHealthyVideo.value) return
  if (markHealthyIfVisible()) return
  runVisualCheck(0)
}

// --- Media event handlers ---------------------------------------------------
const handleLoadedMetadata = () => {
  syncDuration()
  markHealthyIfVisible()
}

const handleDurationChange = () => {
  syncDuration()
}

const handleCanPlay = () => {
  syncDuration()
  syncBuffered()
  markHealthyIfVisible()
}

const handleLoadedData = () => {
  markHealthyIfVisible()
}

const handleProgress = () => {
  syncBuffered()
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

const handleEnded = () => {
  isPlaying.value = false
  showControls.value = true
  clearControlsTimer()
}

const handleTimeUpdate = () => {
  const el = videoRef.value
  if (!el) return
  if (!isScrubbing.value) currentTime.value = el.currentTime
  // Defensive: capture duration if it only became known after playback started.
  if (!hasDuration.value) syncDuration()
  markHealthyIfVisible()
}

const handleVideoError = () => {
  void applyFallbackSource()
}

// --- Playback controls ------------------------------------------------------
const togglePlay = async () => {
  const el = videoRef.value
  if (!el) return
  if (el.paused) {
    try {
      await el.play()
    } catch {
      /* autoplay/gesture rejection — ignore */
    }
  } else {
    el.pause()
  }
  revealControls()
}

const seekTo = (time: number) => {
  const el = videoRef.value
  if (!el || !hasDuration.value) return
  const clamped = Math.max(0, Math.min(duration.value, time))
  el.currentTime = clamped
  currentTime.value = clamped
}

const seekBy = (seconds: number) => {
  if (!hasDuration.value) return
  seekTo(currentTime.value + seconds)
}

const toggleMute = () => {
  const el = videoRef.value
  if (!el) return
  el.muted = !el.muted
  isMuted.value = el.muted
}

// --- Custom seek bar (pointer driven) --------------------------------------
const timeFromPointer = (clientX: number) => {
  const track = trackRef.value
  if (!track || !hasDuration.value) return 0
  const rect = track.getBoundingClientRect()
  if (rect.width === 0) return 0
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  return ratio * duration.value
}

const onScrubMove = (event: PointerEvent) => {
  if (!isScrubbing.value) return
  currentTime.value = timeFromPointer(event.clientX)
}

const onScrubEnd = (event: PointerEvent) => {
  if (!isScrubbing.value) return
  isScrubbing.value = false
  seekTo(timeFromPointer(event.clientX))
  window.removeEventListener('pointermove', onScrubMove)
  window.removeEventListener('pointerup', onScrubEnd)
  window.removeEventListener('pointercancel', onScrubEnd)
  scheduleControlsHide()
}

const onScrubStart = (event: PointerEvent) => {
  if (!hasDuration.value) return
  event.preventDefault()
  isScrubbing.value = true
  showControls.value = true
  clearControlsTimer()
  currentTime.value = timeFromPointer(event.clientX)
  window.addEventListener('pointermove', onScrubMove)
  window.addEventListener('pointerup', onScrubEnd)
  window.addEventListener('pointercancel', onScrubEnd)
}

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case ' ':
    case 'Enter':
      event.preventDefault()
      void togglePlay()
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

watch(() => props.video, (newSource) => {
  // Route through getMediaUrl so the media base URL is preserved on change.
  activeVideoSrc.value = getMediaUrl(newSource)
  hasFallbackApplied.value = false
  hasHealthyVideo.value = false
  currentTime.value = 0
  duration.value = 0
  bufferedEnd.value = 0
  clearVisualCheckTimer()
})

onBeforeUnmount(() => {
  clearControlsTimer()
  clearVisualCheckTimer()
  window.removeEventListener('pointermove', onScrubMove)
  window.removeEventListener('pointerup', onScrubEnd)
  window.removeEventListener('pointercancel', onScrubEnd)
})
</script>

<template>
  <figure class="video-embed">
    <div 
      class="video-wrapper"
      :class="[
        `controls-${props.controlsVariant}`,
        { 'is-playing': isPlaying, 'has-started': hasStarted, 'is-scrubbing': isScrubbing }
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
        @ended="handleEnded"
        @loadedmetadata="handleLoadedMetadata"
        @durationchange="handleDurationChange"
        @canplay="handleCanPlay"
        @loadeddata="handleLoadedData"
        @progress="handleProgress"
        @timeupdate="handleTimeUpdate"
        @playing="scheduleVisualCheck"
        @error="handleVideoError"
      ></video>

      <div class="custom-play-overlay" v-if="!isPlaying" @click="togglePlay">
        <button class="play-button" type="button" aria-label="Play video">
          <span class="play-icon">▶</span>
        </button>
      </div>

      <div v-if="props.credit || props.isOfficial" class="media-attribution">
        <span v-if="props.isOfficial" class="official-badge">Official Promotional Video</span>
        <span v-if="props.credit" class="media-credit">Credit: {{ props.credit }}</span>
      </div>

      <div v-show="canShowControls" class="controls-bar" @click.stop>
        <button
          type="button"
          class="control-btn icon-btn"
          :aria-label="isPlaying ? 'Pause video' : 'Play video'"
          @click="togglePlay"
        >
          {{ isPlaying ? '❚❚' : '▶' }}
        </button>

        <span class="timecode">{{ formatTime(currentTime) }}</span>

        <div
          ref="trackRef"
          class="seek"
          :class="{ 'is-disabled': !hasDuration }"
          role="slider"
          aria-label="Seek"
          :aria-valuemin="0"
          :aria-valuemax="hasDuration ? Math.floor(duration) : 0"
          :aria-valuenow="Math.floor(currentTime)"
          tabindex="0"
          @pointerdown="onScrubStart"
          @keydown.left.prevent="seekBy(-5)"
          @keydown.right.prevent="seekBy(5)"
        >
          <div class="seek-rail">
            <div class="seek-buffered" :style="{ width: `${bufferedPercent}%` }"></div>
            <div class="seek-progress" :style="{ width: `${progressPercent}%` }"></div>
            <div class="seek-handle" :style="{ left: `${progressPercent}%` }"></div>
          </div>
        </div>

        <span class="timecode timecode-duration">{{ formatTime(duration) }}</span>

        <button
          type="button"
          class="control-btn icon-btn"
          :aria-label="isMuted ? 'Unmute video' : 'Mute video'"
          @click="toggleMute"
        >
          {{ isMuted ? '🔇' : '🔊' }}
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
  font-size: 1.35rem;
  line-height: 1;
  margin-left: 3px;
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
  gap: 0.6rem;
  padding: 0.5rem 0.7rem;
  border-radius: 10px;
  background: rgba(10, 10, 10, 0.62);
  backdrop-filter: blur(10px);
  transition: opacity 0.3s ease;
}

.control-btn {
  border: none;
  border-radius: 6px;
  height: 30px;
  min-width: 30px;
  padding: 0 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: 0.7rem;
  font-family: var(--font-mono);
  letter-spacing: 0.06em;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.26);
}

.icon-btn {
  font-size: 0.8rem;
  line-height: 1;
}

.timecode {
  font-family: var(--font-mono);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.64rem;
  letter-spacing: 0.03em;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.timecode-duration {
  color: rgba(255, 255, 255, 0.6);
}

/* Custom seek bar */
.seek {
  flex: 1;
  display: flex;
  align-items: center;
  height: 22px;
  cursor: pointer;
  touch-action: none;
}

.seek.is-disabled {
  cursor: default;
  opacity: 0.5;
}

.seek-rail {
  position: relative;
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  overflow: visible;
}

.seek-buffered {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.32);
  transition: width 0.2s linear;
}

.seek-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 999px;
  background: var(--c-seal-red);
}

.seek:not(.is-scrubbing) .seek-progress {
  transition: width 0.08s linear;
}

.seek-handle {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.15s ease;
  pointer-events: none;
}

.seek:hover .seek-handle,
.is-scrubbing .seek-handle {
  transform: translate(-50%, -50%) scale(1);
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
  padding: 0.4rem 0.5rem;
  gap: 0.45rem;
}

.controls-rail .control-btn {
  height: 26px;
  min-width: 26px;
  padding: 0 0.4rem;
  font-size: 0.62rem;
}

.controls-rail .icon-btn {
  font-size: 0.72rem;
}

.controls-rail .timecode {
  font-size: 0.56rem;
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
    gap: 0.4rem;
  }

  .controls-rail .timecode-duration {
    display: none;
  }
}
</style>
