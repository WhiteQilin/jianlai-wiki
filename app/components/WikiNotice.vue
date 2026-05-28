<script setup lang="ts">
defineProps<{
  type?: 'info' | 'warning' | 'verification'
}>()
</script>

<template>
  <div class="wiki-notice" :class="`notice-${type || 'info'}`">
    <div class="notice-icon">
      <span v-if="type === 'warning'">⚠️</span>
      <span v-else-if="type === 'verification'">印</span>
      <span v-else>ℹ️</span>
    </div>
    <div class="notice-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.wiki-notice {
  display: flex;
  gap: 1.2rem;
  padding: 1.5rem;
  border-radius: 4px;
  background: var(--c-bg-soft);
  border-left: 3px solid var(--c-border);
  margin: 2rem 0;
}

.notice-verification {
  border-left-color: var(--c-seal-red);
  background: rgba(186, 38, 38, 0.03);
}

.notice-warning {
  border-left-color: var(--c-bronze);
}

.notice-info {
  border-left-color: var(--c-ink);
}

.notice-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: flex-start;
}

.notice-verification .notice-icon {
  font-family: var(--font-heading);
  color: var(--c-seal-red);
  border: 1px solid var(--c-seal-red);
  padding: 2px 4px;
  font-size: 1.2rem;
  border-radius: 2px;
  line-height: 1;
}

.notice-content {
  flex-grow: 1;
  font-size: 0.95rem;
  color: var(--c-text-2);
  line-height: 1.6;
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
