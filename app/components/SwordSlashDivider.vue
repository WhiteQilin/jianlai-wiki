<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="sword-slash-divider" aria-hidden="true">
    <span class="slash-line"></span>
    <span v-if="label" class="slash-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.sword-slash-divider {
  position: relative;
  width: min(44rem, 100%);
  height: 2.6rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin: clamp(1.6rem, 4vw, 2.7rem) auto;
  color: var(--sword-silver, #aeb8b4);
  pointer-events: none;
}

.slash-line {
  position: relative;
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, currentColor 78%, transparent), var(--c-seal-red), transparent);
  transform: skewX(-18deg) scaleX(0.96);
  transform-origin: center;
}

.slash-line::before {
  content: '';
  position: absolute;
  inset: -0.28rem 12% auto auto;
  width: 24%;
  height: 0.52rem;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, currentColor 48%, transparent), transparent);
  opacity: 0.5;
  transform: translateX(0);
  animation: swordSlashGlint 4.8s cubic-bezier(0.32, 0.72, 0, 1) infinite;
}

.slash-label {
  flex: 0 0 auto;
  color: color-mix(in srgb, var(--c-text-3) 82%, var(--c-seal-red));
  font-family: var(--font-mono);
  font-size: 0.66rem;
  line-height: 1;
}

@keyframes swordSlashGlint {
  0%, 68%, 100% {
    opacity: 0;
    transform: translateX(-120%);
  }
  78% {
    opacity: 0.68;
  }
  90% {
    opacity: 0;
    transform: translateX(160%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .slash-line::before {
    animation: none;
  }
}
</style>
