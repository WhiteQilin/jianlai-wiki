<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  chinese?: string
  reason?: 'missing' | 'internal' | 'plain'
}>(), {
  reason: 'missing',
})

const marker = computed(() => {
  if (props.reason === 'internal') return 'title'
  if (props.reason === 'plain') return 'plain'
  return 'pending'
})
</script>

<template>
  <span class="pending-route-chip" :class="`reason-${props.reason}`">
    <span class="pending-route-chip__label">{{ props.label }}</span>
    <span v-if="props.chinese" class="pending-route-chip__chinese">{{ props.chinese }}</span>
    <span class="pending-route-chip__marker">{{ marker }}</span>
  </span>
</template>

<style scoped>
.pending-route-chip {
  max-width: 100%;
  min-height: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.36rem;
  padding: 0.34rem 0.56rem;
  color: var(--c-text-3);
  background:
    repeating-linear-gradient(135deg, color-mix(in srgb, var(--c-bronze) 7%, transparent) 0 1px, transparent 1px 0.42rem),
    color-mix(in srgb, var(--c-bg-soft) 68%, var(--c-paper));
  border: 1px dashed color-mix(in srgb, var(--c-bronze) 34%, var(--c-divider));
  border-radius: 3px;
  font-size: 0.82rem;
  line-height: 1.2;
  cursor: help;
  overflow-wrap: anywhere;
}

.pending-route-chip__label,
.pending-route-chip__chinese {
  min-width: 0;
  overflow-wrap: anywhere;
}

.pending-route-chip__chinese {
  color: color-mix(in srgb, var(--c-text-3) 72%, var(--c-seal-red));
  font-family: var(--font-heading);
  font-size: 0.92em;
}

.pending-route-chip__marker {
  flex: 0 0 auto;
  color: color-mix(in srgb, var(--c-bronze) 80%, var(--c-text-3));
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.06em;
  line-height: 1;
}

.reason-internal .pending-route-chip__marker {
  color: var(--sword-celadon, var(--c-teal-accent));
}
</style>
