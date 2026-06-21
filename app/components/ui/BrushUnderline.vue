<script setup lang="ts">
const props = withDefaults(defineProps<{
  tone?: 'auto' | 'cinnabar' | 'section' | 'gold' | 'ink'
  weight?: 'light' | 'regular' | 'bold'
  width?: 'short' | 'medium' | 'long' | 'full'
}>(), {
  tone: 'auto',
  weight: 'regular',
  width: 'medium',
})
</script>

<template>
  <span
    class="brush-underline"
    :class="[`tone-${tone}`, `weight-${weight}`, `width-${width}`]"
    aria-hidden="true"
  ></span>
</template>

<style scoped>
.brush-underline {
  --underline-accent: var(--jl-section-seal);
  --underline-strength: 0.32;
  --underline-width: 4.2rem;
  --underline-height: 0.42rem;

  display: inline-block;
  width: var(--underline-width);
  height: var(--underline-height);
  background-image: var(--jl-active-underline);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  opacity: var(--underline-strength);
  filter: grayscale(0.4) brightness(1.05);
  vertical-align: baseline;
  position: relative;
  top: 0.12em;
}

/* Width */
.width-short { --underline-width: 2.2rem; }
.width-medium { --underline-width: 4.2rem; }
.width-long { --underline-width: 7.5rem; }
.width-full { --underline-width: 100%; display: block; height: 0.62rem; }

/* Weight */
.weight-light { --underline-strength: 0.18; }
.weight-regular { --underline-strength: 0.32; }
.weight-bold { --underline-strength: 0.55; }

/* Tone */
.tone-auto {
  --underline-accent: var(--jl-section-seal);
}

.tone-cinnabar {
  filter: hue-rotate(0deg) saturate(1.4) brightness(0.92);
  --underline-accent: var(--jl-cinnabar);
}

.tone-section {
  --underline-accent: var(--jl-section-accent);
}

.tone-gold {
  filter: hue-rotate(-12deg) saturate(1.1) brightness(1.04);
  --underline-accent: var(--jl-antique-gold);
}

.tone-ink {
  filter: grayscale(1) brightness(0.6);
  --underline-accent: var(--jl-lacquer);
}
</style>
