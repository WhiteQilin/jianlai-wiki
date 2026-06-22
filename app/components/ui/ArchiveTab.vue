<script setup lang="ts">
const props = withDefaults(defineProps<{
  active?: boolean
  disabled?: boolean
  zhLabel?: string
  count?: number
}>(), {
  active: false,
  disabled: false,
})

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()
</script>

<template>
  <button
    type="button"
    class="archive-tab"
    :class="{ 'is-active': active, 'is-disabled': disabled }"
    :disabled="disabled"
    role="tab"
    :aria-selected="active ? 'true' : 'false'"
    @click="emit('click', $event)"
  >
    <span v-if="zhLabel" class="archive-tab__zh" aria-hidden="true">{{ zhLabel }}</span>
    <span class="archive-tab__label"><slot /></span>
    <span v-if="typeof count !== 'undefined'" class="archive-tab__count" aria-label="`${count} items`">{{ count }}</span>
    <span v-if="active" class="archive-tab__underline" aria-hidden="true"></span>
  </button>
</template>

<style scoped>
.archive-tab {
  --archive-tab-accent: var(--jl-section-accent);
  --archive-tab-ink: var(--jl-section-ink);
  --archive-tab-frame: var(--jl-section-frame);
  --archive-tab-paper: var(--jl-section-paper);
  --archive-tab-seal: var(--jl-section-seal);

  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: baseline;
  gap: 0.38rem;
  min-height: 2.4rem;
  padding: 0.42rem 0.82rem 0.56rem;
  color: color-mix(in srgb, var(--archive-tab-ink) 62%, transparent);
  background: transparent;
  border: 0;
  border-bottom: 1px solid transparent;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  line-height: 1.2;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition:
    color 200ms cubic-bezier(0.32, 0.72, 0, 1),
    border-color 200ms cubic-bezier(0.32, 0.72, 0, 1);
}

.archive-tab::after {
  content: '';
  position: absolute;
  left: 0.12rem;
  right: 0.12rem;
  bottom: -1px;
  height: 1px;
  background: var(--archive-tab-seal);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 220ms cubic-bezier(0.32, 0.72, 0, 1);
}

.archive-tab:hover:not(.is-disabled),
.archive-tab:focus-visible {
  color: var(--archive-tab-ink);
}

.archive-tab:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--jl-cinnabar) 72%, transparent);
  outline-offset: 3px;
  border-radius: 2px;
}

.archive-tab.is-active {
  color: var(--archive-tab-ink);
  font-weight: 600;
}

.archive-tab.is-active::after {
  transform: scaleX(1);
}

/* Chinese label — calligraphic accent, right-aligned, smaller */
.archive-tab__zh {
  font-family: var(--font-zh-display);
  font-size: 0.95em;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, var(--archive-tab-seal) 82%, var(--archive-tab-accent));
  opacity: 0.82;
}

.archive-tab__label {
  white-space: nowrap;
}

.archive-tab__count {
  margin-left: 0.18rem;
  padding: 0.05rem 0.38rem;
  background: color-mix(in srgb, var(--archive-tab-accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--archive-tab-accent) 22%, transparent);
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.2;
  color: color-mix(in srgb, var(--archive-tab-accent) 88%, var(--archive-tab-ink));
}

.archive-tab.is-active .archive-tab__count {
  background: color-mix(in srgb, var(--archive-tab-accent) 18%, transparent);
  border-color: color-mix(in srgb, var(--archive-tab-seal) 38%, transparent);
}

.archive-tab__underline {
  display: none;
}

.archive-tab.is-disabled {
  color: var(--c-text-3);
  cursor: not-allowed;
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .archive-tab,
  .archive-tab::after {
    transition: none;
  }
}
</style>
