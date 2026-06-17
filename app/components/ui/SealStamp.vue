<template>
  <span
    class="seal-stamp"
    :class="[
      `seal--${variant}`,
      `seal--${size}`,
      `seal--${writing}`,
      { 'seal--decorative': decorative }
    ]"
    :style="rotationStyle"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : text"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <span class="seal__edge" aria-hidden="true"></span>
    <span class="seal__inner" aria-hidden="true"></span>
    <span class="seal__texture" aria-hidden="true"></span>
    <span class="seal__text">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  variant?: 'carved' | 'outline' | 'filled' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  writing?: 'vertical' | 'horizontal'
  rotate?: number | null
  decorative?: boolean
}>(), {
  variant: 'carved',
  size: 'md',
  writing: 'vertical',
  rotate: null,
  decorative: true,
})

const rotationStyle = computed(() => {
  if (props.rotate !== null) return { '--seal-rotation': `${props.rotate}deg` }
  return {}
})
</script>

<style scoped>
.seal-stamp {
  --seal-color: var(--c-seal-red);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-zh-display);
  line-height: 1;
  text-align: center;
  user-select: none;
  transform: rotate(var(--seal-rotation, -3deg));
  isolation: isolate;
}

/* Inner frame line (carved seal double-border) */
.seal__inner {
  position: absolute;
  inset: 16%;
  border: 1px solid currentColor;
  opacity: 0.32;
  pointer-events: none;
  z-index: 1;
}

/* Irregular edge mask */
.seal__edge {
  position: absolute;
  inset: -3%;
  width: 106%;
  height: 106%;
  background: currentColor;
  mask-image: url('/images/ui/seals/seal-border-mask.svg');
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-image: url('/images/ui/seals/seal-border-mask.svg');
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  opacity: 0.07;
  pointer-events: none;
  z-index: 0;
}

/* Ink texture overlay */
.seal__texture {
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%%25" height="100%%25" filter="url(%23n)" opacity="0.18"/></svg>');
  background-size: 128px 128px;
  opacity: 0.2;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 3;
}

.dark .seal__texture {
  mix-blend-mode: screen;
  opacity: 0.12;
}

/* Text */
.seal__text {
  position: relative;
  z-index: 2;
  color: inherit;
}

/* ===========================
   WRITING MODES
   =========================== */
.seal--vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
}

.seal--horizontal {
  writing-mode: horizontal-tb;
}

/* ===========================
   SIZES
   =========================== */
.seal--xs { font-size: 0.72rem; }
.seal--sm { font-size: 0.88rem; }
.seal--md { font-size: 1.15rem; }
.seal--lg { font-size: 1.5rem; }
.seal--xl { font-size: 2rem; }

.seal--vertical.seal--xs { padding: 0.28em 0.2em; min-height: 2.6em; min-width: 1.5em; }
.seal--vertical.seal--sm { padding: 0.32em 0.22em; min-height: 3em; min-width: 1.7em; }
.seal--vertical.seal--md { padding: 0.38em 0.26em; min-height: 3.4em; min-width: 1.9em; }
.seal--vertical.seal--lg { padding: 0.42em 0.28em; min-height: 3.8em; min-width: 2.1em; }
.seal--vertical.seal--xl { padding: 0.48em 0.32em; min-height: 4.4em; min-width: 2.5em; }

.seal--horizontal.seal--xs { padding: 0.2em 0.28em; min-width: 2.6em; min-height: 1.5em; }
.seal--horizontal.seal--sm { padding: 0.22em 0.32em; min-width: 3em; min-height: 1.7em; }
.seal--horizontal.seal--md { padding: 0.26em 0.38em; min-width: 3.4em; min-height: 1.9em; }
.seal--horizontal.seal--lg { padding: 0.28em 0.42em; min-width: 3.8em; min-height: 2.1em; }
.seal--horizontal.seal--xl { padding: 0.32em 0.48em; min-width: 4.4em; min-height: 2.5em; }

/* ===========================
   VARIANT: CARVED (primary premium)
   =========================== */
.seal--carved {
  color: var(--seal-color);
  border: 1.5px solid var(--seal-color);
  background: color-mix(in srgb, var(--seal-color) 5%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--seal-color) 10%, transparent),
    1px 1px 0 color-mix(in srgb, var(--seal-color) 14%, transparent),
    2px 2px 0 color-mix(in srgb, var(--seal-color) 6%, transparent),
    0 2px 8px color-mix(in srgb, var(--seal-color) 10%, transparent);
}

/* ===========================
   VARIANT: OUTLINE
   =========================== */
.seal--outline {
  color: var(--seal-color);
  border: 1.5px solid color-mix(in srgb, var(--seal-color) 60%, transparent);
  background: transparent;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--seal-color) 8%, transparent),
    0 1px 4px color-mix(in srgb, var(--seal-color) 8%, transparent);
}

/* ===========================
   VARIANT: FILLED
   =========================== */
.seal--filled {
  color: var(--c-paper);
  border: 1.5px solid var(--seal-color);
  background: var(--seal-color);
  box-shadow:
    inset 0 0 0 2px color-mix(in srgb, var(--c-paper) 12%, transparent),
    1px 1px 0 color-mix(in srgb, var(--seal-color) 40%, transparent),
    2px 2px 4px color-mix(in srgb, var(--seal-color) 16%, transparent);
}

.dark .seal--filled {
  color: #fff;
}

/* ===========================
   VARIANT: GHOST
   =========================== */
.seal--ghost {
  color: color-mix(in srgb, var(--seal-color) 42%, transparent);
  border: 1px dashed color-mix(in srgb, var(--seal-color) 32%, transparent);
  background: transparent;
  opacity: 0.7;
}

/* ===========================
   REDUCED MOTION
   =========================== */
@media (prefers-reduced-motion: reduce) {
  .seal-stamp {
    transition: none !important;
  }
}
</style>
