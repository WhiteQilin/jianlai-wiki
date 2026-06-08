<script setup lang="ts">
defineProps<{
  to?: string
  disabled?: boolean
}>()
</script>

<template>
  <NuxtLink v-if="to && !disabled" :to="to" class="ink-button">
    <span><slot /></span>
  </NuxtLink>
  <button v-else type="button" class="ink-button" :class="{ 'is-disabled': disabled }" :disabled="disabled">
    <span><slot /></span>
  </button>
</template>

<style scoped>
.ink-button {
  position: relative;
  width: fit-content;
  min-height: 2rem;
  display: inline-flex;
  align-items: center;
  padding: 0.12rem 0 0.32rem;
  color: var(--c-ink);
  background: transparent;
  border: 0;
  font: inherit;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  line-height: 1.3;
  text-decoration: none;
  cursor: pointer;
  overflow-wrap: anywhere;
}

.ink-button::before,
.ink-button::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  pointer-events: none;
}

.ink-button::before {
  background: color-mix(in srgb, var(--c-ink) 26%, transparent);
}

.ink-button::after {
  background: linear-gradient(90deg, var(--c-seal-red), color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 74%, transparent), transparent);
  transform: scaleX(0.34);
  transform-origin: left;
  transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
}

.ink-button:hover::after,
.ink-button:focus-visible::after {
  transform: scaleX(1);
}

.ink-button:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 4px;
}

.ink-button.is-disabled {
  cursor: not-allowed;
  color: var(--c-text-3);
}

.ink-button.is-disabled::after {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .ink-button::after {
    transition: none;
  }
}
</style>
