<script setup lang="ts">
import { computed } from 'vue'
import { getAssetById } from '~/utils/assetManifest'

const props = withDefaults(defineProps<{
  motif?: 'ink' | 'seal' | 'ledger' | 'blade' | 'atlas' | 'doctrine' | 'blank'
  label?: string
  ariaHidden?: boolean
  /** Manifest asset IDs to override individual motif textures.
   *  Default: '' (empty) — the global --jl-* CSS variables apply
   *  unchanged (Hybrid D: CSS var-first). Set a prop to a manifest
   *  ID to swap that motif's texture for dev/prototype use.
   *  Invalid IDs fall back gracefully to the CSS variable.
   *  bladeTextureId consumed by motif="blade"; inkTextureId by
   *  motif="ink". Other motifs ignore them. */
  bladeTextureId?: string
  inkTextureId?: string
}>(), {
  motif: 'ink',
  ariaHidden: true,
  bladeTextureId: '',
  inkTextureId: '',
})

/** Resolve a texture URL from the manifest, or '' if no valid override. */
function resolveTextureUrl(id: string): string {
  if (!id) return ''
  return getAssetById(id)?.filePath ?? ''
}

/** Inline CSS custom properties injected only when a manifest override is
 *  active. Empty object otherwise — no inline style, the global --jl-*
 *  variables apply unchanged. */
const textureVars = computed<Record<string, string>>(() => {
  const vars: Record<string, string> = {}
  const bladeUrl = resolveTextureUrl(props.bladeTextureId)
  const inkUrl = resolveTextureUrl(props.inkTextureId)
  if (bladeUrl) vars['--ink-section-blade'] = `url('${bladeUrl}')`
  if (inkUrl) vars['--ink-section-ink'] = `url('${inkUrl}')`
  return vars
})
</script>

<template>
  <div
    class="section-divider"
    :class="`motif-${motif}`"
    :style="textureVars"
    :role="ariaHidden ? undefined : 'separator'"
    :aria-hidden="ariaHidden ? 'true' : undefined"
    :aria-orientation="ariaHidden ? undefined : 'horizontal'"
  >
    <span class="section-divider__rule section-divider__rule--left" aria-hidden="true"></span>

    <span v-if="label" class="section-divider__label">{{ label }}</span>

    <span class="section-divider__motif" aria-hidden="true">
      <!-- ink: brush stroke -->
      <span v-if="motif === 'ink'" class="motif-glyph motif-ink"></span>
      <!-- seal: cinnabar square -->
      <span v-else-if="motif === 'seal'" class="motif-glyph motif-seal">印</span>
      <!-- ledger: vertical bracket pair -->
      <span v-else-if="motif === 'ledger'" class="motif-glyph motif-ledger">册</span>
      <!-- blade: swordsmanship slash texture over CSS line segments
           (segments + texture rendered via ::before/::after pseudo-elements) -->
      <span v-else-if="motif === 'blade'" class="motif-glyph motif-blade"></span>
      <!-- atlas: mountain silhouette -->
      <span v-else-if="motif === 'atlas'" class="motif-glyph motif-atlas">
        <svg viewBox="0 0 24 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1 11 L6 5 L9 8 L13 3 L17 7 L20 5 L23 11 Z" fill="currentColor" />
        </svg>
      </span>
      <!-- doctrine: rice-paper circle -->
      <span v-else-if="motif === 'doctrine'" class="motif-glyph motif-doctrine">
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1" />
          <circle cx="8" cy="8" r="1.2" fill="currentColor" />
        </svg>
      </span>
      <!-- blank: simple hairline -->
      <span v-else class="motif-glyph motif-blank"></span>
    </span>

    <span v-if="!label" class="section-divider__rule section-divider__rule--right" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
.section-divider {
  --divider-accent: var(--jl-section-accent);
  --divider-ink: var(--jl-section-ink);
  --divider-seal: var(--jl-section-seal);
  --divider-frame: var(--jl-section-frame);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  width: 100%;
  min-height: 2.4rem;
  margin: clamp(1.4rem, 4vw, 2.6rem) 0;
  color: var(--divider-accent);
}

.section-divider__rule {
  flex: 1 1 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--divider-frame) 32%, var(--divider-frame) 68%, transparent 100%);
  opacity: 0.5;
}

.section-divider__label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  line-height: 1.2;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-text-3);
  white-space: nowrap;
  flex: 0 0 auto;
}

.section-divider__motif {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.4rem;
  min-width: 1.4rem;
  color: var(--divider-accent);
}

.motif-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: auto;
}

/* Motif: ink — soft brush.
   --ink-section-ink overrides the default title brush with a manifest
   asset when the inkTextureId prop is set; falls back to the global
   CSS variable otherwise. */
.motif-ink {
  width: 5.5rem;
  height: 0.9rem;
  background-image: var(--ink-section-ink, var(--jl-title-brush));
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  opacity: 0.32;
  filter: grayscale(0.4);
}

/* Motif: seal — cinnabar stamp */
.motif-seal {
  width: 1.5rem;
  height: 1.5rem;
  font-family: var(--font-zh-display);
  font-size: 1.1rem;
  color: var(--divider-seal);
  border: 1.5px solid currentColor;
  border-radius: 2px 4px 3px 2px;
  background: color-mix(in srgb, var(--divider-seal) 6%, transparent);
  transform: rotate(-3deg);
  opacity: 0.7;
}

/* Motif: ledger — calligraphic ledger character */
.motif-ledger {
  width: 1.5rem;
  height: 1.5rem;
  font-family: var(--font-zh-display);
  font-size: 1.1rem;
  color: var(--divider-accent);
  border: 1px solid currentColor;
  border-radius: 1px;
  background: color-mix(in srgb, var(--divider-accent) 6%, transparent);
  opacity: 0.65;
}

/* Motif: blade — swordsmanship slash texture over CSS line segments.
   --ink-section-blade overrides the default slash with a manifest
   asset when the bladeTextureId prop is set; falls back to the
   global --jl-blade-divider CSS variable (slash-01). The thin CSS
   line segments serve as a base layer behind the texture. */
.motif-blade {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.18rem;
  width: 8rem;
  height: 0.64rem;
}

/* Base layer: CSS blade-line segments behind the texture */
.motif-blade::before {
  content: '';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  gap: 0.18rem;
  background:
    linear-gradient(currentColor, currentColor) 0 50% / calc((100% - 0.36rem) / 3) 1px no-repeat,
    linear-gradient(var(--divider-seal), var(--divider-seal)) calc((100% - 0.36rem) / 3 + 0.18rem) 50% / calc((100% - 0.36rem) / 6) 1.5px no-repeat,
    linear-gradient(currentColor, currentColor) calc((100% - 0.36rem) / 3 + 0.18rem + (100% - 0.36rem) / 6 + 0.18rem) 50% / calc((100% - 0.36rem) / 3) 1px no-repeat;
  opacity: 0.65;
}

/* Texture layer: manifest blade slash over the base line */
.motif-blade::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--ink-section-blade, var(--jl-blade-divider));
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  /* Use multiply blend on the texture so it sits atop the line
     segments without completely obscuring them */
  mix-blend-mode: multiply;
  opacity: 0.38;
}

/* Motif: atlas — mountain silhouette */
.motif-atlas {
  width: 4rem;
  height: 1rem;
  color: currentColor;
  opacity: 0.6;
}

.motif-atlas svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Motif: doctrine — circle within circle */
.motif-doctrine {
  width: 1rem;
  height: 1rem;
  color: currentColor;
  opacity: 0.62;
}

.motif-doctrine svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Motif: blank — simple hairline dot */
.motif-blank {
  width: 0.32rem;
  height: 0.32rem;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.6;
}
</style>
