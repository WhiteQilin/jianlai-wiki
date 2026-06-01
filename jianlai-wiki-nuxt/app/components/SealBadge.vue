<template>
  <span 
    class="seal-badge" 
    :class="[
      `seal-variant-${variant}`,
      `seal-shape-${shape}`
    ]"
  >
    <span class="seal-text">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'filled',
    validator: (value: string) => ['filled', 'outline'].includes(value)
  },
  shape: {
    type: String,
    default: 'square',
    validator: (value: string) => ['square', 'rectangle'].includes(value)
  }
});
</script>

<style scoped>
.seal-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.1;
  text-align: center;
  /* Irregular border to simulate stamp */
  border-radius: 2px 4px 3px 2px;
  position: relative;
  overflow: hidden;
  user-select: none;
}

/* Add a very subtle noise/texture inside the seal to mimic ink */
.seal-badge::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.3"/></svg>');
  opacity: 0.15;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.seal-text {
  position: relative;
  z-index: 1;
}

.seal-shape-square {
  padding: 0.3em;
  width: 2.2em;
  height: 2.2em;
}
.seal-shape-square .seal-text {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  word-break: break-all;
  font-size: 0.8em;
  letter-spacing: 0.05em;
}

.seal-shape-rectangle {
  padding: 0.4em 0.25em;
  writing-mode: vertical-rl;
  text-orientation: upright;
  min-height: 3em;
  font-size: 0.9em;
  letter-spacing: 0.1em;
}

.seal-variant-filled {
  background-color: var(--c-seal-red);
  color: var(--c-paper);
}

.seal-variant-outline {
  background-color: transparent;
  color: var(--c-seal-red);
  border: 1.5px solid var(--c-seal-red);
}

.dark .seal-variant-filled {
  color: #fff;
}
</style>
