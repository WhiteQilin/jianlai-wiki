<script setup lang="ts">
const props = withDefaults(defineProps<{
  tone?: 'cinnabar' | 'jade' | 'bronze' | 'section' | 'ghost'
  size?: 'sm' | 'md'
  dot?: boolean
}>(), {
  tone: 'cinnabar',
  size: 'md',
  dot: false,
})
</script>

<template>
  <span
    class="cinnabar-tag"
    :class="[`tone-${tone}`, `size-${size}`, { 'has-dot': dot }]"
  >
    <span v-if="dot" class="cinnabar-tag__dot" aria-hidden="true"></span>
    <slot />
  </span>
</template>

<style scoped>
.cinnabar-tag {
  --tag-accent: var(--jl-section-seal);
  --tag-bg: transparent;
  --tag-border: transparent;

  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  line-height: 1.2;
  white-space: nowrap;
  background: var(--tag-bg);
  border: 1px solid var(--tag-border);
  border-radius: 2px 4px 3px 2px;
  padding: 0.2rem 0.52rem 0.22rem;
  user-select: none;
}

.size-sm {
  font-size: 0.6rem;
  padding: 0.14rem 0.38rem 0.16rem;
  gap: 0.22rem;
}

/* Tones */
.tone-cinnabar {
  --tag-accent: var(--jl-cinnabar);
  --tag-bg: color-mix(in srgb, var(--jl-cinnabar) 8%, transparent);
  --tag-border: color-mix(in srgb, var(--jl-cinnabar) 32%, transparent);
  color: var(--jl-cinnabar);
}

.tone-jade {
  --tag-accent: var(--jl-jade);
  --tag-bg: color-mix(in srgb, var(--jl-jade) 9%, transparent);
  --tag-border: color-mix(in srgb, var(--jl-jade) 30%, transparent);
  color: var(--jl-jade);
}

.tone-bronze {
  --tag-accent: var(--jl-antique-gold);
  --tag-bg: color-mix(in srgb, var(--jl-antique-gold) 9%, transparent);
  --tag-border: color-mix(in srgb, var(--jl-antique-gold) 32%, transparent);
  color: color-mix(in srgb, var(--jl-antique-gold) 90%, var(--jl-lacquer));
}

.tone-section {
  --tag-accent: var(--jl-section-accent);
  --tag-bg: color-mix(in srgb, var(--jl-section-accent) 8%, transparent);
  --tag-border: color-mix(in srgb, var(--jl-section-accent) 28%, transparent);
  color: color-mix(in srgb, var(--jl-section-accent) 90%, var(--jl-section-ink));
}

.tone-ghost {
  --tag-accent: var(--c-text-3);
  --tag-bg: transparent;
  --tag-border: color-mix(in srgb, var(--c-text-3) 20%, transparent);
  color: var(--c-text-3);
}

/* Dot indicator */
.cinnabar-tag__dot {
  display: inline-block;
  width: 0.38rem;
  height: 0.38rem;
  background: var(--tag-accent);
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
