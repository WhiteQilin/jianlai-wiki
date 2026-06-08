<script setup lang="ts">
defineProps<{
  to?: string
  disabled?: boolean
  ariaLabel?: string
}>()
</script>

<template>
  <NuxtLink
    v-if="to && !disabled"
    :to="to"
    class="seal-button"
    :aria-label="ariaLabel"
  >
    <span class="seal-button__text"><slot /></span>
    <span class="seal-button__mark" aria-hidden="true">印</span>
  </NuxtLink>
  <button
    v-else
    type="button"
    class="seal-button"
    :class="{ 'is-disabled': disabled }"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <span class="seal-button__text"><slot /></span>
    <span class="seal-button__mark" aria-hidden="true">印</span>
  </button>
</template>

<style scoped>
.seal-button {
  position: relative;
  min-height: 2.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 0.58rem 0.58rem 0.58rem 1rem;
  color: var(--c-paper);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--c-seal-red) 92%, #4a0f0d), var(--c-seal-red)),
    var(--c-seal-red);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 86%, var(--c-ink));
  border-radius: 3px 5px 4px 3px;
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--c-paper) 18%, transparent),
    0 12px 28px color-mix(in srgb, var(--c-seal-red) 20%, transparent);
  font: inherit;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    filter 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}

.seal-button::before {
  content: '';
  position: absolute;
  inset: 0.18rem;
  border: 1px solid color-mix(in srgb, var(--c-paper) 26%, transparent);
  pointer-events: none;
}

.seal-button::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--c-paper) 22%, transparent) 0 1px, transparent 1.5px);
  background-size: 0.72rem 0.72rem;
  opacity: 0.16;
  mix-blend-mode: screen;
  pointer-events: none;
}

.seal-button:hover {
  transform: translateY(-2px);
  filter: saturate(1.04);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--c-paper) 20%, transparent),
    0 16px 34px color-mix(in srgb, var(--c-seal-red) 26%, transparent);
}

.seal-button:active {
  transform: translateY(0) scale(0.985);
}

.seal-button:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 4px;
}

.seal-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.56;
  filter: grayscale(0.25);
}

.seal-button__text,
.seal-button__mark {
  position: relative;
  z-index: 1;
}

.seal-button__text {
  overflow-wrap: anywhere;
}

.seal-button__mark {
  width: 1.7rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  background: color-mix(in srgb, var(--c-paper) 92%, transparent);
  border-radius: 2px;
  font-family: var(--font-zh-display);
  font-size: 0.9rem;
  line-height: 1;
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}

.seal-button:hover .seal-button__mark {
  transform: rotate(-5deg) translateX(1px);
}

@media (prefers-reduced-motion: reduce) {
  .seal-button,
  .seal-button__mark {
    transition: none;
  }

  .seal-button:hover,
  .seal-button:active {
    transform: none;
  }
}
</style>
