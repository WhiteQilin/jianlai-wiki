<script setup lang="ts">
defineProps<{
  to?: string
}>()
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="ledger-row-shell">
    <slot />
  </NuxtLink>
  <article v-else class="ledger-row-shell">
    <slot />
  </article>
</template>

<style scoped>
.ledger-row-shell {
  position: relative;
  min-width: 0;
  display: grid;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--c-divider);
  border-left: 2px solid color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 48%, transparent);
  border-radius: 4px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-paper-alt) 72%, transparent), color-mix(in srgb, var(--c-bg-soft) 78%, transparent)),
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--c-ink) 2%, transparent) 0 1px, transparent 1px 2rem);
  overflow: hidden;
  transition:
    transform 0.24s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.24s cubic-bezier(0.32, 0.72, 0, 1),
    background 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}

.ledger-row-shell::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--sword-silver, #aeb8b4) 76%, transparent), transparent);
  opacity: 0;
  transition: opacity 0.24s cubic-bezier(0.32, 0.72, 0, 1);
  pointer-events: none;
}

a.ledger-row-shell:hover {
  transform: translateX(4px);
  border-color: color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 38%, var(--c-border));
  border-left-color: var(--c-seal-red);
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-paper-alt) 84%, transparent), color-mix(in srgb, var(--sword-celadon-soft, var(--c-bronze-soft)) 46%, var(--c-bg-soft))),
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--c-ink) 2%, transparent) 0 1px, transparent 1px 2rem);
}

a.ledger-row-shell:hover::after {
  opacity: 1;
}

.ledger-row-shell:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .ledger-row-shell,
  .ledger-row-shell::after {
    transition: none;
  }

  a.ledger-row-shell:hover {
    transform: none;
  }
}
</style>
