<script setup lang="ts">
defineProps<{
  value: string | number
  label: string
}>()
</script>

<template>
  <div class="seal-stat-block">
    <span class="seal-stat-block__value">{{ value }}</span>
    <span class="seal-stat-block__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.seal-stat-block {
  position: relative;
  min-width: 0;
  min-height: 5.2rem;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.72rem;
  align-items: center;
  padding: 0.82rem 0.95rem;
  color: var(--c-ink);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--c-paper-alt) 72%, transparent), color-mix(in srgb, var(--c-bg-soft) 76%, transparent)),
    var(--c-bg);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 20%, var(--c-divider));
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c-paper-alt) 52%, transparent);
  overflow: hidden;
}

.seal-stat-block::before {
  content: '';
  position: absolute;
  inset: 0.32rem;
  border: 1px solid color-mix(in srgb, var(--c-border) 54%, transparent);
  pointer-events: none;
}

.seal-stat-block::after {
  content: '记';
  position: absolute;
  right: 0.42rem;
  bottom: -0.16rem;
  color: var(--c-seal-red);
  font-family: var(--font-zh-display);
  font-size: 3.5rem;
  line-height: 1;
  opacity: 0.07;
  pointer-events: none;
}

.seal-stat-block__value {
  position: relative;
  z-index: 1;
  width: 2.75rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1.5px solid color-mix(in srgb, var(--c-seal-red) 76%, transparent);
  border-radius: 2px;
  background: color-mix(in srgb, var(--c-seal-red) 5%, transparent);
  font-family: var(--font-heading);
  font-size: 1.45rem;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.seal-stat-block__label {
  position: relative;
  z-index: 1;
  min-width: 0;
  color: var(--c-text-2);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

@media (max-width: 520px) {
  .seal-stat-block {
    min-height: 4.4rem;
    padding: 0.72rem;
  }

  .seal-stat-block__value {
    width: 2.35rem;
    font-size: 1.2rem;
  }
}
</style>
