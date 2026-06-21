<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  to?: string
  href?: string
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  size?: 'sm' | 'md' | 'lg'
  stamp?: string
  type?: 'button' | 'submit' | 'reset'
}>(), {
  disabled: false,
  loading: false,
  size: 'md',
  stamp: '',
  type: 'button',
})

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()

const sizeClass = computed(() => `seal-button--${props.size}`)
const hasStamp = computed(() => Boolean(props.stamp))
</script>

<template>
  <NuxtLink
    v-if="to && !disabled"
    :to="to"
    class="seal-button"
    :class="[sizeClass, { 'has-stamp': hasStamp, 'is-loading': loading }]"
    :aria-label="ariaLabel"
    :aria-busy="loading ? 'true' : undefined"
    @click="emit('click', $event)"
  >
    <span class="seal-button__edge" aria-hidden="true"></span>
    <span class="seal-button__texture" aria-hidden="true"></span>
    <span v-if="hasStamp" class="seal-button__stamp" aria-hidden="true">{{ stamp }}</span>
    <span class="seal-button__label">
      <slot />
    </span>
  </NuxtLink>

  <a
    v-else-if="href && !disabled"
    :href="href"
    class="seal-button"
    :class="[sizeClass, { 'has-stamp': hasStamp, 'is-loading': loading }]"
    :aria-label="ariaLabel"
    :aria-busy="loading ? 'true' : undefined"
    @click="emit('click', $event)"
  >
    <span class="seal-button__edge" aria-hidden="true"></span>
    <span class="seal-button__texture" aria-hidden="true"></span>
    <span v-if="hasStamp" class="seal-button__stamp" aria-hidden="true">{{ stamp }}</span>
    <span class="seal-button__label">
      <slot />
    </span>
  </a>

  <button
    v-else
    :type="type"
    class="seal-button"
    :class="[sizeClass, { 'has-stamp': hasStamp, 'is-loading': loading, 'is-disabled': disabled }]"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-busy="loading ? 'true' : undefined"
    @click="emit('click', $event)"
  >
    <span class="seal-button__edge" aria-hidden="true"></span>
    <span class="seal-button__texture" aria-hidden="true"></span>
    <span v-if="hasStamp" class="seal-button__stamp" aria-hidden="true">{{ stamp }}</span>
    <span class="seal-button__label">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.seal-button {
  --seal-button-color: var(--jl-cinnabar);

  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  color: var(--c-paper);
  background: var(--seal-button-color);
  border: 1.5px solid var(--seal-button-color);
  border-radius: 2px 4px 3px 2px;
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: 0.02em;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition:
    transform 220ms cubic-bezier(0.32, 0.72, 0, 1),
    box-shadow 220ms cubic-bezier(0.32, 0.72, 0, 1),
    background-color 220ms cubic-bezier(0.32, 0.72, 0, 1);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--seal-button-color) 14%, transparent),
    1px 1px 0 color-mix(in srgb, var(--seal-button-color) 18%, transparent),
    2px 2px 4px color-mix(in srgb, var(--seal-button-color) 16%, transparent);
}

.seal-button__edge,
.seal-button__texture {
  position: absolute;
  pointer-events: none;
}

/* Irregular edge — same mask as SealStamp */
.seal-button__edge {
  inset: -3%;
  width: 106%;
  height: 106%;
  background: color-mix(in srgb, var(--jl-lacquer) 42%, transparent);
  mask-image: url('/images/ui/seals/seal-border-mask.svg');
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-image: url('/images/ui/seals/seal-border-mask.svg');
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  opacity: 0.16;
  z-index: 0;
}

/* Ink texture overlay */
.seal-button__texture {
  inset: 0;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%%25" height="100%%25" filter="url(%23n)" opacity="0.22"/></svg>');
  background-size: 128px 128px;
  opacity: 0.2;
  mix-blend-mode: multiply;
  z-index: 1;
}

.seal-button__label,
.seal-button__stamp {
  position: relative;
  z-index: 2;
}

.seal-button__stamp {
  font-family: var(--font-zh-display);
  font-size: 1.15em;
  line-height: 1;
  letter-spacing: 0.04em;
  opacity: 0.92;
}

/* Sizes */
.seal-button--sm {
  font-size: 0.84rem;
  padding: 0.42rem 1.1rem 0.5rem;
  min-height: 2.05rem;
}

.seal-button--md {
  font-size: 0.98rem;
  padding: 0.6rem 1.6rem 0.68rem;
  min-height: 2.55rem;
}

.seal-button--lg {
  font-size: 1.1rem;
  padding: 0.78rem 2.1rem 0.88rem;
  min-height: 3.05rem;
}

/* Hover / focus */
.seal-button:hover,
.seal-button:focus-visible {
  background: color-mix(in srgb, var(--jl-charcoal) 60%, var(--seal-button-color));
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--seal-button-color) 24%, transparent),
    1px 1px 0 color-mix(in srgb, var(--seal-button-color) 32%, transparent),
    3px 3px 8px color-mix(in srgb, var(--seal-button-color) 22%, transparent),
    0 6px 18px color-mix(in srgb, var(--seal-button-color) 18%, transparent);
}

.seal-button:focus-visible {
  outline: 2px solid var(--jl-paper-ivory);
  outline-offset: 3px;
}

.seal-button:active:not(.is-disabled):not(.is-loading) {
  transform: translateY(0);
}

/* Disabled */
.seal-button.is-disabled,
.seal-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  filter: grayscale(0.4);
}

/* Loading state — hide label, show subtle pulse on the texture */
.seal-button.is-loading {
  cursor: progress;
}

.seal-button.is-loading .seal-button__label {
  opacity: 0.5;
}

.seal-button.is-loading .seal-button__texture {
  animation: seal-button-pulse 1.6s ease-in-out infinite;
}

@keyframes seal-button-pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.36; }
}

@media (prefers-reduced-motion: reduce) {
  .seal-button,
  .seal-button:hover,
  .seal-button:focus-visible {
    transition: none;
    transform: none;
  }

  .seal-button.is-loading .seal-button__texture {
    animation: none;
  }
}
</style>
