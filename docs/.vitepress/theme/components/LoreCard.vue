<script setup lang="ts">
defineProps<{
  title?: string
  type?: 'info' | 'warning' | 'legend'
}>()
</script>

<template>
  <div class="lore-card" :class="`lore-card--${type || 'info'}`" role="note">
    <div v-if="title" class="lore-card-title">{{ title }}</div>
    <div class="lore-card-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.lore-card {
  margin: 1em 0;
  padding: 1em 1.25em;
  border-radius: 6px;
  border-left: 4px solid var(--jl-c-jade);
  background: var(--vp-c-bg-soft);
}

.lore-card--info {
  border-left-color: var(--jl-c-jade);
}

.lore-card--warning {
  border-left-color: var(--jl-c-gold);
  background: var(--vp-c-warning-soft);
}

.lore-card--legend {
  border-left-color: var(--jl-c-gold-dim);
  background: linear-gradient(
    135deg,
    var(--vp-c-bg-soft) 0%,
    var(--vp-c-warning-soft) 100%
  );
}

.lore-card-title {
  font-family: var(--jl-font-heading);
  font-weight: 600;
  font-size: 1.05em;
  margin-bottom: 0.5em;
  color: var(--vp-c-text-1);
}

.lore-card--legend .lore-card-title {
  color: var(--jl-c-gold-dim);
}

.dark .lore-card--legend .lore-card-title {
  color: var(--jl-c-gold);
}

.lore-card-content {
  color: var(--vp-c-text-2);
  line-height: 1.7;
}
</style>
