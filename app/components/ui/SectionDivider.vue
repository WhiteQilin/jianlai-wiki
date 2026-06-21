<script setup lang="ts">
const props = withDefaults(defineProps<{
  motif?: 'ink' | 'seal' | 'ledger' | 'blade' | 'atlas' | 'doctrine' | 'blank'
  label?: string
  ariaHidden?: boolean
}>(), {
  motif: 'ink',
  ariaHidden: true,
})
</script>

<template>
  <div
    class="section-divider"
    :class="`motif-${motif}`"
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
      <!-- blade: thin horizontal line + slight angles -->
      <span v-else-if="motif === 'blade'" class="motif-glyph motif-blade">
        <span class="blade-segment"></span>
        <span class="blade-segment blade-segment--mid"></span>
        <span class="blade-segment"></span>
      </span>
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

/* Motif: ink — soft brush */
.motif-ink {
  width: 5.5rem;
  height: 0.9rem;
  background-image: var(--jl-title-brush);
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

/* Motif: blade — three thin segments */
.motif-blade {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.18rem;
  width: 6.4rem;
  height: 0.4rem;
}

.blade-segment {
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.65;
}

.blade-segment--mid {
  flex: 0.5;
  height: 1.5px;
  background: var(--divider-seal);
  opacity: 0.85;
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
