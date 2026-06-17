<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  variant?: 'purchased' | 'generated' | 'line'
}>(), {
  variant: 'purchased',
})
</script>

<template>
  <div class="ui-ink-divider" :class="`variant-${variant}`" :aria-hidden="label ? undefined : 'true'">
    <span class="ui-ink-divider__line" aria-hidden="true"></span>
    <span v-if="label" class="ui-ink-divider__label">{{ label }}</span>
    <span class="ui-ink-divider__line" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
.ui-ink-divider {
  width: min(46rem, 100%);
  min-height: 2.2rem;
  display: flex;
  align-items: center;
  gap: 0.82rem;
  margin: clamp(1.4rem, 4vw, 2.8rem) auto;
  color: color-mix(in srgb, var(--jl-antique-gold) 72%, var(--jl-ink-black));
}

.ui-ink-divider__line {
  position: relative;
  flex: 1 1 auto;
  min-width: 2.4rem;
  height: 1.25rem;
  background-image: var(--jl-divider-ink);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  opacity: 0.2;
  filter: grayscale(1);
  pointer-events: none;
}

.variant-generated .ui-ink-divider__line {
  height: 0.8rem;
  background-image: var(--jl-active-underline);
  opacity: 0.38;
}

.variant-line .ui-ink-divider__line {
  height: 1px;
  background-image: none;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  opacity: 0.34;
}

.ui-ink-divider__label {
  flex: 0 1 auto;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.2;
  white-space: nowrap;
}

@media (max-width: 520px) {
  .ui-ink-divider {
    gap: 0.54rem;
  }

  .ui-ink-divider__label {
    white-space: normal;
    text-align: center;
  }
}
</style>
