<script setup lang="ts">
const props = defineProps<{
  to?: string
  active?: boolean
  pending?: boolean
  button?: boolean
}>()

const emit = defineEmits<{
  (event: 'click'): void
}>()
</script>

<template>
  <NuxtLink
    v-if="props.to && !props.pending"
    :to="props.to"
    class="jade-chip"
    :class="{ active: props.active, pending: props.pending }"
  >
    <slot />
  </NuxtLink>
  <button
    v-else-if="props.button"
    type="button"
    class="jade-chip"
    :class="{ active: props.active, pending: props.pending }"
    :aria-pressed="props.active ? 'true' : 'false'"
    @click="emit('click')"
  >
    <slot />
  </button>
  <span v-else class="jade-chip" :class="{ active: props.active, pending: props.pending }">
    <slot />
  </span>
</template>

<style scoped>
.jade-chip {
  position: relative;
  max-width: 100%;
  min-height: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.36rem;
  padding: 0.34rem 0.62rem;
  color: var(--c-text-2);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 6%, var(--c-paper-alt)), color-mix(in srgb, var(--c-bg) 78%, transparent)),
    var(--c-bg);
  border: 1px solid color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 24%, var(--c-divider));
  border-radius: 3px;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--c-paper-alt) 62%, transparent);
  font: inherit;
  font-size: 0.82rem;
  line-height: 1.2;
  text-decoration: none;
  cursor: default;
  overflow-wrap: anywhere;
  transition:
    color 0.24s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.24s cubic-bezier(0.32, 0.72, 0, 1),
    background 0.24s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.jade-chip::before {
  content: '';
  width: 0.28rem;
  height: 0.28rem;
  flex: 0 0 auto;
  border: 1px solid currentColor;
  border-radius: 50%;
  opacity: 0.48;
}

a.jade-chip,
button.jade-chip {
  cursor: pointer;
}

a.jade-chip:hover,
button.jade-chip:hover {
  color: var(--c-ink);
  border-color: color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 46%, var(--c-border));
  transform: translateY(-1px);
}

.jade-chip.active {
  color: var(--c-paper);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 92%, var(--c-ink)), var(--sword-celadon, var(--c-teal-accent))),
    var(--sword-celadon, var(--c-teal-accent));
  border-color: var(--sword-celadon, var(--c-teal-accent));
}

.jade-chip.pending {
  color: var(--c-text-3);
  border-style: dashed;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--c-bronze) 6%, var(--c-paper)), color-mix(in srgb, var(--c-bg-soft) 60%, transparent)),
    var(--c-bg-soft);
}

.jade-chip:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .jade-chip {
    transition: none;
  }

  a.jade-chip:hover,
  button.jade-chip:hover {
    transform: none;
  }
}
</style>
