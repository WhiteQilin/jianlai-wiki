<script setup lang="ts">
const props = withDefaults(defineProps<{
  active?: boolean
  disabled?: boolean
  tone?: 'section' | 'bronze' | 'jade' | 'cinnabar'
  count?: number
  variant?: 'ledger' | 'compact'
}>(), {
  active: false,
  disabled: false,
  tone: 'section',
  variant: 'ledger',
})

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()

const toneClass = computed(() => `tone-${props.tone}`)
</script>

<template>
  <button
    type="button"
    class="ledger-tab"
    :class="[toneClass, `variant-${variant}`, { 'is-active': active, 'is-disabled': disabled }]"
    :disabled="disabled"
    :aria-pressed="active ? 'true' : 'false'"
    @click="emit('click', $event)"
  >
    <span class="ledger-tab__label"><slot /></span>
    <span v-if="typeof count !== 'undefined'" class="ledger-tab__count">{{ count }}</span>
  </button>
</template>

<style scoped>
.ledger-tab {
  --ledger-tab-accent: var(--jl-section-accent);
  --ledger-tab-ink: var(--jl-section-ink);
  --ledger-tab-frame: var(--jl-section-frame);
  --ledger-tab-seal: var(--jl-section-seal);
  --ledger-tab-mist: var(--jl-section-mist);

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.48rem;
  min-height: 2.2rem;
  padding: 0.38rem 0.72rem 0.46rem;
  color: color-mix(in srgb, var(--ledger-tab-ink) 58%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--ledger-tab-mist) 22%, transparent), transparent),
    color-mix(in srgb, var(--ledger-tab-paper) 58%, var(--c-bg));
  border: 1px solid var(--ledger-tab-frame);
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.15;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    color 200ms cubic-bezier(0.32, 0.72, 0, 1),
    background 200ms cubic-bezier(0.32, 0.72, 0, 1),
    border-color 200ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 200ms cubic-bezier(0.32, 0.72, 0, 1);
}

.ledger-tab:hover:not(.is-disabled),
.ledger-tab:focus-visible {
  color: var(--ledger-tab-ink);
  border-color: color-mix(in srgb, var(--ledger-tab-accent) 38%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--ledger-tab-mist) 32%, transparent), transparent),
    color-mix(in srgb, var(--ledger-tab-paper) 78%, var(--c-bg));
}

.ledger-tab:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ledger-tab-seal) 72%, transparent);
  outline-offset: 3px;
}

.ledger-tab.is-active {
  color: var(--c-paper);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--ledger-tab-accent) 22%, transparent), transparent),
    var(--ledger-tab-accent);
  border-color: color-mix(in srgb, var(--ledger-tab-accent) 62%, transparent);
  font-weight: 600;
  transform: translateY(-1px);
  box-shadow: 0 3px 10px color-mix(in srgb, var(--ledger-tab-accent) 18%, transparent);
}

.ledger-tab__count {
  padding: 0.06rem 0.42rem;
  background: color-mix(in srgb, currentColor 12%, transparent);
  border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  border-radius: 2px;
  font-size: 0.68rem;
  line-height: 1.2;
}

.ledger-tab.is-active .ledger-tab__count {
  background: color-mix(in srgb, var(--c-paper) 14%, transparent);
  border-color: color-mix(in srgb, var(--c-paper) 24%, transparent);
  color: var(--c-paper);
}

/* Tones */
.tone-section {
  --ledger-tab-accent: var(--jl-section-accent);
  --ledger-tab-ink: var(--jl-section-ink);
  --ledger-tab-frame: var(--jl-section-frame);
  --ledger-tab-seal: var(--jl-section-seal);
  --ledger-tab-mist: var(--jl-section-mist);
}

.tone-bronze {
  --ledger-tab-accent: var(--jl-antique-gold);
  --ledger-tab-ink: var(--jl-lacquer);
  --ledger-tab-frame: rgba(140, 118, 84, 0.22);
  --ledger-tab-seal: var(--jl-cinnabar-red);
  --ledger-tab-mist: var(--jl-aged-paper);
}

.tone-jade {
  --ledger-tab-accent: var(--jl-jade);
  --ledger-tab-ink: var(--jl-lacquer);
  --ledger-tab-frame: rgba(52, 100, 93, 0.22);
  --ledger-tab-seal: var(--jl-cinnabar-red);
  --ledger-tab-mist: #edf2ef;
}

.tone-cinnabar {
  --ledger-tab-accent: var(--jl-cinnabar);
  --ledger-tab-ink: var(--jl-lacquer);
  --ledger-tab-frame: rgba(184, 42, 42, 0.22);
  --ledger-tab-seal: var(--jl-cinnabar);
  --ledger-tab-mist: #fdf0f0;
}

/* Variant: compact — smaller, no border-radius, less padding */
.variant-compact {
  min-height: 1.85rem;
  padding: 0.26rem 0.52rem 0.3rem;
  border-radius: 0;
  font-size: 0.68rem;
  gap: 0.3rem;
}

.ledger-tab.is-disabled {
  color: var(--c-text-3);
  cursor: not-allowed;
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .ledger-tab,
  .ledger-tab.is-active {
    transition: none;
    transform: none;
  }
}
</style>
