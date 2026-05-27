<script setup lang="ts">
defineProps<{
  title?: string
  type?: 'info' | 'warning' | 'legend'
}>()
</script>

<template>
  <div class="lore-card" :class="`lore-card--${type || 'info'}`" role="note">
    <div class="lore-bg"></div>
    <div v-if="title" class="lore-card-title">
      <span class="title-text">{{ title }}</span>
      <span class="title-seal">卷</span>
    </div>
    <div class="lore-card-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.lore-card {
  margin: 2.5rem 0;
  padding: 2rem 2.5rem;
  position: relative;
  font-size: 1.05rem;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-alt);
  overflow: hidden;
}

.lore-bg {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, var(--vp-c-divider) 28px);
  opacity: 0.5;
  pointer-events: none;
}

.lore-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--jl-c-ink);
}

.lore-card--warning::before {
  background: var(--jl-c-seal-red);
}

.lore-card--legend::before {
  background: var(--vp-c-text-3);
}

.lore-card-title {
  font-family: var(--jl-font-heading);
  font-weight: 500;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--jl-c-ink);
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.title-seal {
  font-size: 0.8rem;
  color: var(--jl-c-seal-red);
  border: 1px solid var(--jl-c-seal-red-soft);
  padding: 2px 4px;
  line-height: 1;
}

.lore-card--warning .lore-card-title {
  color: var(--jl-c-seal-red);
}

.lore-card-content {
  color: var(--vp-c-text-2);
  line-height: 1.8;
  position: relative;
  z-index: 1;
}

.lore-card-content :deep(strong) {
  color: var(--jl-c-ink);
  font-weight: 600;
}
</style>
