<script setup lang="ts">
import { computed } from 'vue'
import { getAssetById } from '~/utils/assetManifest'

const props = withDefaults(defineProps<{
  to?: string
  href?: string
  active?: boolean
  current?: boolean
  disabled?: boolean
  ariaLabel?: string
  activeMark?: 'underline' | 'seal' | 'none'
  /** Manifest asset IDs to override individual texture layers.
   *  Default: '' (empty) — each layer falls back to its --jl-*
   *  counterpart (Hybrid D: CSS var-first). Set a prop to a manifest
   *  ID to swap that layer for dev/QA/prototype use. Invalid IDs
   *  fall back gracefully to the CSS variable. */
  brushTextureId?: string
  underlineTextureId?: string
  sealTextureId?: string
}>(), {
  active: false,
  current: false,
  disabled: false,
  activeMark: 'underline',
  brushTextureId: '',
  underlineTextureId: '',
  sealTextureId: '',
})

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()

const isCurrent = computed(() => props.active || props.current)
const currentValue = computed(() => (isCurrent.value ? 'page' : undefined))
const markClass = computed(() => `mark-${props.activeMark}`)

/** Resolve a texture URL from the manifest, or '' if no valid override.
 *  Returns '' for empty/invalid IDs so the CSS variable takes over. */
function resolveTextureUrl(id: string): string {
  if (!id) return ''
  return getAssetById(id)?.filePath ?? ''
}

/** Inline CSS custom properties injected only when a manifest override is
 *  active for a given layer. Empty object otherwise — no inline style,
 *  the stylesheet's --jl-* variables apply unchanged. */
const textureVars = computed<Record<string, string>>(() => {
  const vars: Record<string, string> = {}
  const brushUrl = resolveTextureUrl(props.brushTextureId)
  const underlineUrl = resolveTextureUrl(props.underlineTextureId)
  const sealUrl = resolveTextureUrl(props.sealTextureId)
  if (brushUrl) vars['--ink-link-brush'] = `url('${brushUrl}')`
  if (underlineUrl) vars['--ink-link-underline'] = `url('${underlineUrl}')`
  if (sealUrl) vars['--ink-link-seal'] = `url('${sealUrl}')`
  return vars
})
</script>

<template>
  <NuxtLink
    v-if="to && !disabled"
    :to="to"
    class="ink-hover-link"
    :class="[markClass, { 'is-current': isCurrent }]"
    :style="textureVars"
    :aria-current="currentValue"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <span class="ink-hover-link__label"><slot /></span>
  </NuxtLink>

  <a
    v-else-if="href && !disabled"
    :href="href"
    class="ink-hover-link"
    :class="[markClass, { 'is-current': isCurrent }]"
    :style="textureVars"
    :aria-current="currentValue"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <span class="ink-hover-link__label"><slot /></span>
  </a>

  <button
    v-else
    type="button"
    class="ink-hover-link"
    :class="[markClass, { 'is-current': isCurrent, 'is-disabled': disabled }]"
    :style="textureVars"
    :disabled="disabled"
    :aria-pressed="isCurrent ? 'true' : 'false'"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <span class="ink-hover-link__label"><slot /></span>
  </button>
</template>

<style scoped>
.ink-hover-link {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  min-height: 1.85rem;
  max-width: 100%;
  padding: 0.12rem 0.08rem 0.22rem;
  color: var(--jl-ink-black);
  background: transparent;
  border: 0;
  border-radius: 2px;
  font: inherit;
  line-height: 1.25;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  overflow-wrap: anywhere;
}

.ink-hover-link::before,
.ink-hover-link::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.ink-hover-link::before {
  left: -0.55em;
  right: -0.55em;
  top: 50%;
  height: 1.72em;
  /* --ink-link-brush overrides the manifest texture; falls back to the
     global CSS variable when the brushTextureId prop is empty. */
  background-image: var(--ink-link-brush, var(--jl-hover-brush));
  opacity: 0;
  transform: translateY(-50%) scale(0.88, 0.74);
  transform-origin: center;
  transition:
    opacity 0.24s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.ink-hover-link.mark-underline::after {
  left: -0.16em;
  right: -0.16em;
  bottom: -0.08rem;
  height: 0.64rem;
  /* --ink-link-underline overrides the manifest texture; falls back to
     the global CSS variable when the underlineTextureId prop is empty. */
  background-image: var(--ink-link-underline, var(--jl-active-underline));
  opacity: 0;
  transform: scaleX(0.62) translateY(0.1rem);
  transform-origin: center;
  transition:
    opacity 0.22s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.22s cubic-bezier(0.32, 0.72, 0, 1);
}

.ink-hover-link.mark-seal::after {
  width: 0.82rem;
  height: 0.82rem;
  right: -0.54rem;
  top: 0.04rem;
  /* --ink-link-seal overrides the manifest texture; falls back to the
     global CSS variable when the sealTextureId prop is empty. */
  background-image: var(--ink-link-seal, var(--jl-active-seal));
  opacity: 0;
  transform: scale(0.82) rotate(-4deg);
  transition:
    opacity 0.22s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.22s cubic-bezier(0.32, 0.72, 0, 1);
}

.ink-hover-link.mark-none::after {
  display: none;
}

.ink-hover-link:hover::before,
.ink-hover-link:focus-visible::before {
  opacity: 0.34;
  transform: translateY(-50%) scale(1, 0.92);
}

.ink-hover-link.is-current::after {
  opacity: 0.72;
  transform: scaleX(1) translateY(0);
}

.ink-hover-link.mark-seal.is-current::after {
  opacity: 0.82;
  transform: scale(1) rotate(-4deg);
}

.ink-hover-link__label {
  position: relative;
  z-index: 1;
}

.ink-hover-link:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--jl-cinnabar) 72%, transparent);
  outline-offset: 4px;
}

.ink-hover-link.is-disabled {
  color: var(--c-text-3);
  cursor: not-allowed;
  opacity: 0.62;
}

@media (prefers-reduced-motion: reduce) {
  .ink-hover-link::before,
  .ink-hover-link::after,
  .ink-hover-link.mark-underline::after,
  .ink-hover-link.mark-seal::after {
    transition: none;
  }
}
</style>
