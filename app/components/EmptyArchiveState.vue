<script setup lang="ts">
defineProps<{
  title?: string
  text?: string
  icon?: string
}>()
</script>

<template>
  <div class="empty-archive-state">
    <div class="empty-icon">{{ icon || '卷' }}</div>
    <h3 class="empty-title">{{ title || 'Records pending compilation' }}</h3>
    <p class="empty-text">{{ text || 'The lore keepers have not yet inscribed entries for this category.' }}</p>
  </div>
</template>

<style scoped>
.empty-archive-state {
  text-align: center;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  background: var(--c-bg-soft);
  border: 1px dashed var(--c-border);
  border-radius: 4px;
  margin: 2rem 0;
  position: relative;
  overflow: hidden;
}

.empty-archive-state::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.05;
  pointer-events: none;
}

.dark .empty-archive-state::before {
  opacity: 0.02;
}

.empty-icon {
  font-family: var(--font-heading);
  font-size: 4rem;
  color: var(--c-seal-red);
  opacity: 0.15;
  line-height: 1;
}

.empty-title {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: var(--c-ink);
  margin: 0;
  font-weight: 400;
  position: relative;
}

.empty-text {
  font-size: 1.1rem;
  color: var(--c-text-2);
  margin: 0;
  max-width: 500px;
  position: relative;
}
</style>
