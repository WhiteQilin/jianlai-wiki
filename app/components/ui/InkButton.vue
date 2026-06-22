<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  to?: string
  href?: string
  disabled?: boolean
  ariaLabel?: string
  tone?: 'ink' | 'cinnabar' | 'section'
  type?: 'button' | 'submit' | 'reset'
}>(), {
  disabled: false,
  tone: 'ink',
  type: 'button',
})

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()

const toneClass = computed(() => `tone-${props.tone}`)
</script>

<template>
  <NuxtLink
    v-if="to && !disabled"
    :to="to"
    class="ink-button"
    :class="toneClass"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <span class="ink-button__label"><slot /></span>
  </NuxtLink>

  <a
    v-else-if="href && !disabled"
    :href="href"
    class="ink-button"
    :class="toneClass"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <span class="ink-button__label"><slot /></span>
  </a>

  <button
    v-else
    :type="type"
    class="ink-button"
    :class="[toneClass, { 'is-disabled': disabled }]"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <span class="ink-button__label"><slot /></span>
  </button>
</template>

<style scoped>
.ink-button {
  --ink-button-accent: var(--jl-ink-black);
  --ink-button-underline-base: var(--jl-antique-gold);
  --ink-button-underline-accent: var(--jl-cinnabar);

  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 1.85rem;
  max-width: 100%;
  padding: 0.18rem 0.12rem 0.28rem;
  background: transparent;
  border: 0;
  border-radius: 2px;
  color: var(--ink-button-accent);
  font: inherit;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.2;
  letter-spacing: 0.04em;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  overflow-wrap: anywhere;
  transition: color var(--jl-quiet-motion);
}

.ink-button::before,
.ink-button::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

/* Base ink rule — always present, low opacity */
.ink-button::before {
  left: -0.08rem;
  right: -0.08rem;
  bottom: 0.02rem;
  height: 0.5rem;
  background-image: var(--jl-active-underline);
  opacity: 0.22;
  filter: grayscale(0.55) brightness(1.05);
  transform: scaleX(0.42);
  transform-origin: left center;
  transition:
    opacity var(--jl-quiet-motion),
    transform var(--jl-quiet-motion);
}

/* Accent layer — cinnabar or section-tinted, expands on hover */
.ink-button::after {
  left: -0.08rem;
  right: -0.08rem;
  bottom: 0.02rem;
  height: 0.5rem;
  background-image: var(--jl-active-underline);
  opacity: 0;
  transform: scaleX(0.34);
  transform-origin: left center;
  transition:
    opacity var(--jl-quiet-motion),
    transform var(--jl-quiet-motion);
}

.ink-button:hover::before,
.ink-button:focus-visible::before {
  opacity: 0.38;
  transform: scaleX(1);
}

.ink-button:hover::after,
.ink-button:focus-visible::after {
  opacity: 0.72;
  transform: scaleX(1);
}

.ink-button__label {
  position: relative;
  z-index: 1;
}

/* Tone: ink (default) — black text, cinnabar hover */
.tone-ink {
  --ink-button-accent: var(--jl-ink-black);
  --ink-button-underline-accent: var(--jl-cinnabar);
}

/* Tone: cinnabar — always cinnabar */
.tone-cinnabar {
  --ink-button-accent: var(--jl-cinnabar);
  --ink-button-underline-accent: var(--jl-cinnabar);
}

/* Tone: section — uses section accent */
.tone-section {
  --ink-button-accent: var(--jl-section-accent);
  --ink-button-underline-accent: var(--jl-section-accent);
}

.ink-button:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--jl-cinnabar) 72%, transparent);
  outline-offset: 4px;
  border-radius: 2px;
}

.ink-button.is-disabled {
  color: var(--c-text-3);
  cursor: not-allowed;
  opacity: 0.6;
}

.ink-button.is-disabled::before,
.ink-button.is-disabled::after {
  opacity: 0;
  transform: scaleX(0.3);
}

@media (prefers-reduced-motion: reduce) {
  .ink-button,
  .ink-button::before,
  .ink-button::after {
    transition: none;
  }
}
</style>
