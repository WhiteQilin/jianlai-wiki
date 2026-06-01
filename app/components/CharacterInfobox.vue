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
      <div class="infobox-texture"></div>
      <div v-for="stat in stats" :key="stat.label" class="infobox-stat" :class="{ 'is-status': stat.label.toLowerCase() === 'status' }">
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value" :class="{ 'stamp-effect': stat.label.toLowerCase() === 'status' }">{{ stat.value }}</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.character-infobox {
  width: 100%;
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
}

.infobox-texture {
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.05;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 0;
}

.dark .infobox-texture {
  mix-blend-mode: screen;
  opacity: 0.03;
}

.infobox-stat {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid var(--c-divider);
  position: relative;
  z-index: 1;
}

.infobox-stat.is-status {
  align-items: flex-start;
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
  font-size: 1rem;
  color: var(--c-ink);
  font-weight: 500;
  line-height: 1.4;
}

.stamp-effect {
  font-family: var(--font-heading);
  color: var(--c-seal-red);
  border: 1px solid var(--c-seal-red-soft);
  padding: 0.2rem 0.6rem;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(184, 42, 42, 0.03);
  transform: rotate(-2deg);
  display: inline-block;
  margin-top: 0.2rem;
}
</style>
