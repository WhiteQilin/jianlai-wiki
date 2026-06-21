<script setup lang="ts">
withDefaults(defineProps<{
  to?: string
  href?: string
  accent?: boolean
  sealCorner?: boolean
  lift?: boolean
}>(), {
  accent: false,
  sealCorner: false,
  lift: false,
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="paper-slip-card"
    :class="{ 'has-accent': accent, 'has-seal': sealCorner, 'is-lift': lift }"
  >
    <slot />
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    class="paper-slip-card"
    :class="{ 'has-accent': accent, 'has-seal': sealCorner, 'is-lift': lift }"
  >
    <slot />
  </a>

  <article
    v-else
    class="paper-slip-card"
    :class="{ 'has-accent': accent, 'has-seal': sealCorner, 'is-lift': lift }"
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

/* Seal corner — small seal mark at top-right, decorative */
.paper-slip-card.has-seal::after {
  content: '';
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 2rem;
  height: 2rem;
  background-image: var(--jl-active-seal);
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
