<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="media-gallery-placeholder">
    <div class="gallery-header">
      <h3 class="gallery-title">{{ title || 'Media Archives' }}</h3>
      <span class="gallery-status">Pending Processing</span>
    </div>
    
    <div class="gallery-grid">
      <div class="gallery-slot" v-for="i in 4" :key="i">
        <div class="slot-icon">🖼️</div>
      </div>
    </div>
    
    <div class="gallery-footer">
      <p>Visual assets are being authenticated from official sources.</p>
    </div>
  </div>
</template>

<style scoped>
.media-gallery-placeholder {
  border: 1px solid var(--c-border);
  background: var(--c-bg-soft);
  border-radius: 4px;
  overflow: hidden;
  margin: 3rem 0;
}

.gallery-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--c-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--c-bg);
}

.gallery-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--c-ink);
  margin: 0;
}

.gallery-status {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--c-bronze);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid var(--c-bronze);
  padding: 2px 8px;
  border-radius: 20px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1px;
  background: var(--c-border);
}

.gallery-slot {
  aspect-ratio: 16/9;
  background: var(--c-bg-soft);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.gallery-slot::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  opacity: 0.05;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.dark .gallery-slot::before {
  mix-blend-mode: screen;
}

.slot-icon {
  font-size: 2.5rem;
  opacity: 0.2;
  filter: grayscale(100%);
}

.gallery-footer {
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid var(--c-border);
  background: var(--c-bg);
}

.gallery-footer p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--c-text-3);
}

@media (max-width: 640px) {
  .gallery-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
