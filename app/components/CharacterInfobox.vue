<script setup lang="ts">
defineProps<{
  image?: string
  alt?: string
  fallbackChar?: string
  stats: Array<{ label: string; value: string }>
}>()
</script>

<template>
  <aside class="character-infobox">
    <div class="infobox-image-wrapper">
      <img v-if="image" :src="image" :alt="alt || 'Character Portrait'" class="infobox-image" />
      <div v-else class="infobox-placeholder">
        <span class="placeholder-char">{{ fallbackChar || '无' }}</span>
      </div>
      <div class="image-overlay"></div>
    </div>
    
    <div class="infobox-content">
      <div v-for="stat in stats" :key="stat.label" class="infobox-stat">
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value">{{ stat.value }}</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.character-infobox {
  width: 100%;
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  overflow: hidden;
}

.infobox-image-wrapper {
  width: 100%;
  aspect-ratio: 3/4;
  position: relative;
  background: var(--c-bg);
  border-bottom: 1px solid var(--c-border);
}

.infobox-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.infobox-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  opacity: 0.8;
}

.dark .infobox-placeholder {
  background-blend-mode: screen;
}

.placeholder-char {
  font-family: var(--font-heading);
  font-size: 8rem;
  color: var(--c-border);
  opacity: 0.5;
}

.image-overlay {
  position: absolute;
  inset: 0;
  border: 4px solid var(--c-border);
  opacity: 0.3;
  pointer-events: none;
}

.infobox-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.infobox-stat {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--c-divider);
}

.infobox-stat:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.stat-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stat-value {
  font-size: 0.95rem;
  color: var(--c-ink);
  font-weight: 500;
  line-height: 1.4;
}
</style>
