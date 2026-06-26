<script setup lang="ts">
import { computed } from 'vue'
import { getAssetById } from '~/utils/assetManifest'

const props = withDefaults(defineProps<{
  to?: string
  href?: string
  accent?: boolean
  sealCorner?: boolean
  lift?: boolean
  /** Manifest asset ID to override the seal-corner texture.
   *  Default: '' (empty) — the global --jl-active-seal CSS
   *  variable applies unchanged (Hybrid D: CSS var-first).
   *  Set to a manifest ID to swap the seal for dev/prototype
   *  use. Invalid IDs fall back to the CSS variable.
   *  Has no effect when sealCorner is false. */
  sealTextureId?: string
}>(), {
  accent: false,
  sealCorner: false,
  lift: false,
  sealTextureId: '',
})

/** Resolve a texture URL from the manifest, or '' if no valid override. */
function resolveTextureUrl(id: string): string {
  if (!id) return ''
  return getAssetById(id)?.filePath ?? ''
}

/** Inline CSS custom property injected only when a manifest override is
 *  active. Empty object otherwise — no inline style, the global
 *  --jl-active-seal variable applies unchanged. */
const textureVars = computed<Record<string, string>>(() => {
  const sealUrl = resolveTextureUrl(props.sealTextureId)
  if (!sealUrl) return {}
  return { '--paper-slip-seal': `url('${sealUrl}')` }
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="paper-slip-card"
    :class="{ 'has-accent': accent, 'has-seal': sealCorner, 'is-lift': lift }"
    :style="textureVars"
  >
    <slot />
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    class="paper-slip-card"
    :class="{ 'has-accent': accent, 'has-seal': sealCorner, 'is-lift': lift }"
    :style="textureVars"
  >
    <slot />
  </a>

  <article
    v-else
    class="paper-slip-card"
    :class="{ 'has-accent': accent, 'has-seal': sealCorner, 'is-lift': lift }"
    :style="textureVars"
  >
    <slot />
  </article>
</template>

<style scoped>
.paper-slip-card {
  --ps-frame: var(--jl-section-frame);
  --ps-accent: var(--jl-section-accent);
  --ps-seal: var(--jl-section-seal);

  display: flex;
  flex-direction: column;
  position: relative;
  padding: 1.25rem 1.35rem 1.35rem;
  background:
    linear-gradient(145deg, var(--jl-section-paper) 0%, color-mix(in srgb, var(--jl-section-mist) 28%, var(--jl-section-paper)) 100%),
    var(--c-bg);
  background-blend-mode: normal, normal;
  border: 1px solid var(--ps-frame);
  border-radius: 2px;
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--c-paper-alt) 58%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--jl-section-frame) 38%, transparent);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition:
    box-shadow 240ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 240ms cubic-bezier(0.32, 0.72, 0, 1),
    border-color 240ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Hover lift — ambient, not default */
.paper-slip-card.is-lift:hover,
a.paper-slip-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--ps-accent) 38%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--c-paper-alt) 58%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--ps-accent) 28%, transparent),
    0 8px 24px color-mix(in srgb, var(--ps-accent) 8%, transparent),
    0 2px 6px color-mix(in srgb, var(--ps-accent) 5%, transparent);
}

a.paper-slip-card:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--jl-cinnabar) 72%, transparent);
  outline-offset: 3px;
}

/* Accent variant — stronger top border */
.paper-slip-card.has-accent {
  border-top-width: 2px;
  border-top-color: color-mix(in srgb, var(--ps-accent) 55%, var(--ps-frame));
}

/* Seal corner — small seal mark at top-right, decorative.
   --paper-slip-seal overrides the default seal with a manifest asset
   when the sealTextureId prop is set; falls back to the global
   --jl-active-seal CSS variable otherwise. */
.paper-slip-card.has-seal::after {
  content: '';
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 2rem;
  height: 2rem;
  background-image: var(--paper-slip-seal, var(--jl-active-seal));
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  opacity: 0.14;
  pointer-events: none;
  transform: rotate(-6deg) scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .paper-slip-card.is-lift:hover,
  a.paper-slip-card:hover {
    transition: none;
    transform: none;
  }
}
</style>
