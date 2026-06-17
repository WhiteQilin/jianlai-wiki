<script setup lang="ts">
withDefaults(defineProps<{
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  kicker?: string
  variant?: 'dark' | 'pale'
  align?: 'start' | 'center'
}>(), {
  as: 'h2',
  variant: 'dark',
  align: 'start',
})
</script>

<template>
  <div class="brush-title-wrap" :class="[`align-${align}`, `variant-${variant}`]">
    <span v-if="kicker" class="brush-title-kicker">{{ kicker }}</span>
    <component :is="as" class="brush-title">
      <span class="brush-title__text"><slot /></span>
    </component>
  </div>
</template>

<style scoped>
.brush-title-wrap {
  position: relative;
  max-width: min(100%, 48rem);
  display: grid;
  gap: 0.34rem;
  justify-items: start;
  color: var(--jl-charcoal);
}

.brush-title-wrap.align-center {
  margin-inline: auto;
  justify-items: center;
  text-align: center;
}

.brush-title-kicker {
  color: var(--jl-cinnabar);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.2;
}

.brush-title {
  position: relative;
  isolation: isolate;
  max-width: 100%;
  margin: 0;
  padding: 0.22rem 0.78rem 0.34rem;
  color: inherit;
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 4vw, 3.25rem);
  font-weight: 500;
  line-height: 1.05;
  overflow-wrap: anywhere;
}

.brush-title::before {
  content: '';
  position: absolute;
  z-index: -1;
  left: -0.7rem;
  right: -0.95rem;
  top: 50%;
  height: 1.42em;
  background-image: var(--jl-title-brush);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  opacity: 0.28;
  transform: translateY(-50%) rotate(-0.4deg);
  pointer-events: none;
}

.variant-pale {
  color: var(--c-text-1);
}

.variant-pale .brush-title::before {
  opacity: 0.16;
  filter: grayscale(1) brightness(1.42);
}

.brush-title__text {
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 0 color-mix(in srgb, var(--jl-parchment) 72%, transparent);
}
</style>
