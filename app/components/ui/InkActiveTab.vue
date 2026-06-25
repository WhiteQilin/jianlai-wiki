<script setup lang="ts">
import { computed } from 'vue'
import { getAssetById } from '~/utils/assetManifest'

const props = withDefaults(defineProps<{
  active?: boolean
  disabled?: boolean
  role?: 'tab' | 'button'
  ariaControls?: string
  showSeal?: boolean
  type?: 'button' | 'submit' | 'reset'
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
  disabled: false,
  role: 'tab',
  showSeal: true,
  type: 'button',
  brushTextureId: '',
  underlineTextureId: '',
  sealTextureId: '',
})

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()

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
  if (brushUrl) vars['--ink-tab-brush'] = `url('${brushUrl}')`
  if (underlineUrl) vars['--ink-tab-underline'] = `url('${underlineUrl}')`
  if (sealUrl) vars['--ink-tab-seal'] = `url('${sealUrl}')`
  return vars
})
</script>

<template>
  <button
    :type="type"
    class="ink-active-tab"
    :class="{ 'is-active': props.active, 'is-disabled': props.disabled, 'has-seal': props.showSeal }"
    :style="textureVars"
    :disabled="props.disabled"
    :role="props.role"
    :aria-selected="props.role === 'tab' ? (props.active ? 'true' : 'false') : undefined"
    :aria-pressed="props.role === 'button' ? (props.active ? 'true' : 'false') : undefined"
    :aria-controls="ariaControls"
    @click="emit('click', $event)"
  >
    <span class="ink-active-tab__label"><slot /></span>
    <span v-if="props.showSeal" class="ink-active-tab__seal" aria-hidden="true"></span>
  </button>
</template>

<style scoped>
.ink-active-tab {
  position: relative;
  isolation: isolate;
  min-height: 2.35rem;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.38rem;
  padding: 0.42rem 0.78rem 0.58rem;
  color: var(--c-text-2);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--jl-parchment) 78%, transparent), color-mix(in srgb, var(--jl-mist-gray) 18%, transparent));
  border: 1px solid color-mix(in srgb, var(--jl-antique-gold) 22%, transparent);
  border-radius: 3px;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--c-paper-alt) 58%, transparent);
  font: inherit;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.15;
  text-decoration: none;
  cursor: pointer;
  overflow-wrap: anywhere;
}

.ink-active-tab::before,
.ink-active-tab::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.ink-active-tab::before {
  inset: 0.12rem -0.22rem 0.18rem;
  /* --ink-tab-brush overrides the manifest texture; falls back to the
     global CSS variable when the brushTextureId prop is empty. */
  background-image: var(--ink-tab-brush, var(--jl-hover-brush));
  opacity: 0;
  transform: scale(0.88, 0.72);
  transition:
    opacity 0.24s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.ink-active-tab::after {
  left: 0.38rem;
  right: 0.38rem;
  bottom: 0.12rem;
  height: 0.55rem;
  /* --ink-tab-underline overrides the manifest texture; falls back to
     the global CSS variable when the underlineTextureId prop is empty. */
  background-image: var(--ink-tab-underline, var(--jl-active-underline));
  opacity: 0;
  transform: scaleX(0.58) translateY(0.08rem);
  transform-origin: center;
  transition:
    opacity 0.2s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.ink-active-tab:hover,
.ink-active-tab:focus-visible {
  color: var(--jl-ink-black);
  border-color: color-mix(in srgb, var(--jl-antique-gold) 42%, var(--c-border));
}

.ink-active-tab:hover::before,
.ink-active-tab:focus-visible::before {
  opacity: 0.22;
  transform: scale(1, 0.92);
}

.ink-active-tab.is-active {
  color: var(--jl-charcoal);
  border-color: color-mix(in srgb, var(--jl-celadon) 42%, var(--jl-antique-gold));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--jl-parchment) 88%, transparent), color-mix(in srgb, var(--jl-celadon) 9%, var(--jl-parchment)));
}

.ink-active-tab.is-active::after {
  opacity: 0.82;
  transform: scaleX(1) translateY(0);
}

.ink-active-tab__label {
  position: relative;
  z-index: 1;
}

.ink-active-tab__seal {
  position: relative;
  z-index: 1;
  width: 0.72rem;
  height: 0.72rem;
  flex: 0 0 auto;
  /* --ink-tab-seal overrides the manifest texture; falls back to the
     global CSS variable when the sealTextureId prop is empty. */
  background-image: var(--ink-tab-seal, var(--jl-active-seal));
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0;
  transform: scale(0.78) rotate(-6deg);
  transition:
    opacity 0.2s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.ink-active-tab.is-active .ink-active-tab__seal {
  opacity: 0.82;
  transform: scale(1) rotate(-6deg);
}

.ink-active-tab:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--jl-cinnabar) 70%, transparent);
  outline-offset: 4px;
}

.ink-active-tab.is-disabled {
  color: var(--c-text-3);
  cursor: not-allowed;
  opacity: 0.58;
}

@media (prefers-reduced-motion: reduce) {
  .ink-active-tab::before,
  .ink-active-tab::after,
  .ink-active-tab__seal {
    transition: none;
  }
}
</style>
