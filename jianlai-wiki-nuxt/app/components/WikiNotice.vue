<script setup lang="ts">
defineProps<{
  type?: 'info' | 'warning' | 'verification'
}>()
</script>

<template>
  <aside class="wiki-notice" :class="`notice-${type || 'info'}`">
    <div class="notice-icon">
      <span v-if="type === 'warning'">!</span>
      <SealBadge v-else-if="type === 'verification'" text="印" variant="outline" shape="square" />
      <span v-else>i</span>
    </div>
    <div class="notice-content">
      <slot />
    </div>
  </aside>
</template>

<style scoped>
.wiki-notice {
  display: flex;
  gap: 1.2rem;
  padding: 1.5rem;
  border-radius: 6px;
  background:
    linear-gradient(90deg, var(--c-seal-red-soft), transparent 36%),
    var(--c-bg-soft);
  border: 1px solid var(--c-border);
  border-left: 3px solid var(--c-border);
  margin: 2rem 0;
  position: relative;
  overflow: hidden;
}

.wiki-notice::after {
  content: '';
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  width: 5rem;
  height: 2.2rem;
  border-top: 1px solid color-mix(in srgb, var(--c-teal-accent) 45%, transparent);
  border-radius: 999px 999px 0 0;
  opacity: 0.35;
  pointer-events: none;
}

.notice-verification {
  border-left-color: var(--c-seal-red);
  background:
    linear-gradient(90deg, var(--c-seal-red-soft), transparent 38%),
    var(--c-bg-soft);
}

.notice-warning {
  border-left-color: var(--c-bronze);
}

.notice-info {
  border-left-color: var(--c-ink);
}

.notice-icon {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  display: flex;
  align-items: flex-start;
  color: var(--c-seal-red);
  line-height: 1;
  position: relative;
  z-index: 1;
}

.notice-content {
  flex-grow: 1;
  font-size: 0.95rem;
  color: var(--c-text-2);
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.notice-content :deep(p:first-child) {
  margin-top: 0;
}

.notice-content :deep(p:last-child) {
  margin-bottom: 0;
}

.notice-content :deep(strong) {
  color: var(--c-ink);
}
</style>
