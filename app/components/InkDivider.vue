<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'brush' | 'line' | 'mist'
}>(), {
  type: 'line'
})
</script>

<template>
  <div class="ink-divider" :class="`type-${type}`">
    <div v-if="type === 'mist'" class="mist-band"></div>
    <div v-else-if="type === 'brush'" class="brush-stroke"></div>
    <div v-else class="ink-line"></div>
  </div>
</template>

<style scoped>
.ink-divider {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem 0;
  position: relative;
}

.ink-divider.type-mist {
  height: 100px;
  margin: 0;
}

.mist-band {
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
}

.dark .mist-band {
  mix-blend-mode: screen;
  opacity: 0.15;
}

.ink-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--c-border) 20%, var(--c-border) 80%, transparent);
  position: relative;
}

.ink-line::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 6px;
  height: 6px;
  border: 1px solid var(--c-seal-red);
  background: var(--c-bg);
}

.brush-stroke {
  width: 80%;
  max-width: 600px;
  height: 12px;
  background-image: url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.3;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  filter: grayscale(100%) contrast(1.5);
}

.dark .brush-stroke {
  mix-blend-mode: screen;
  opacity: 0.5;
}
</style>
