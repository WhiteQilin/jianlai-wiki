<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  to?: string
  active?: boolean
  pressed?: boolean
  disabled?: boolean
  ariaLabel?: string
  activeMark?: 'ring' | 'seal' | 'none'
  type?: 'button' | 'submit' | 'reset'
}>(), {
  active: false,
  pressed: false,
  disabled: false,
  activeMark: 'ring',
  type: 'button',
})

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()

const isPressed = computed(() => props.active || props.pressed)
const markClass = computed(() => `mark-${props.activeMark}`)
</script>

<template>
  <NuxtLink
    v-if="to && !disabled"
    :to="to"
    class="ink-text-button"
    :class="[markClass, { 'is-active': isPressed }]"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <span class="ink-text-button__label"><slot /></span>
  </NuxtLink>

  <button
    v-else
    :type="type"
    class="ink-text-button"
    :class="[markClass, { 'is-active': isPressed, 'is-disabled': disabled }]"
    :disabled="disabled"
    :aria-pressed="isPressed ? 'true' : 'false'"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <span class="ink-text-button__label"><slot /></span>
  </button>
</template>

<style scoped>
.ink-text-button {
  position: relative;
  isolation: isolate;
  min-height: 2.25rem;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.34rem 0.58rem;
  color: var(--jl-ink-black);
  background: transparent;
  border: 0;
  border-radius: 3px;
  font: inherit;
  font-family: var(--font-heading);
  line-height: 1.15;
  text-decoration: none;
  cursor: pointer;
  overflow-wrap: anywhere;
}

.ink-text-button::before,
.ink-text-button::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.ink-text-button::before {
  inset: 0.08rem -0.5rem;
  background-image: var(--jl-hover-brush);
  opacity: 0;
  transform: scale(0.88, 0.74);
  transition:
    opacity 0.24s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.ink-text-button.mark-ring::after {
  width: 2.35rem;
  height: 2.35rem;
  left: -0.34rem;
  top: 50%;
  background-image: var(--jl-active-ring);
  opacity: 0;
  transform: translateY(-50%) scale(0.82) rotate(-5deg);
  transition:
    opacity 0.24s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.ink-text-button.mark-seal::after {
  width: 1.05rem;
  height: 1.05rem;
  right: -0.34rem;
  top: 0.04rem;
  background-image: var(--jl-active-seal);
  opacity: 0;
  transform: scale(0.84) rotate(4deg);
  transition:
    opacity 0.24s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.ink-text-button.mark-none::after {
  display: none;
}

.ink-text-button:hover::before,
.ink-text-button:focus-visible::before {
  opacity: 0.32;
  transform: scale(1, 0.92);
}

.ink-text-button.is-active {
  color: var(--jl-charcoal);
}

.ink-text-button.is-active::after {
  opacity: 0.62;
  transform: translateY(-50%) scale(1) rotate(-5deg);
}

.ink-text-button.mark-seal.is-active::after {
  opacity: 0.84;
  transform: scale(1) rotate(4deg);
}

.ink-text-button__label {
  position: relative;
  z-index: 1;
}

.ink-text-button:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--jl-cinnabar) 72%, transparent);
  outline-offset: 4px;
}

.ink-text-button:active:not(.is-disabled) {
  transform: translateY(1px);
}

.ink-text-button.is-disabled {
  color: var(--c-text-3);
  cursor: not-allowed;
  opacity: 0.58;
}

@media (prefers-reduced-motion: reduce) {
  .ink-text-button,
  .ink-text-button::before,
  .ink-text-button::after,
  .ink-text-button.mark-ring::after,
  .ink-text-button.mark-seal::after {
    transition: none;
  }

  .ink-text-button:active:not(.is-disabled) {
    transform: none;
  }
}
</style>
