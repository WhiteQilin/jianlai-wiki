<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <section class="media-gallery-placeholder">
    <div class="gallery-header">
      <div class="gallery-title-group">
        <SealBadge text="影" variant="outline" shape="square" />
        <h3 class="gallery-title">{{ title || 'Media Archives' }}</h3>
      </div>
      <span class="gallery-status">Pending Processing</span>
    </div>
    
    <div class="gallery-grid">
      <div class="gallery-slot" v-for="i in 4" :key="i">
        <div class="slot-cloud" aria-hidden="true"></div>
        <div class="slot-icon" aria-hidden="true">画</div>
      </div>
    </div>
    
    <div class="gallery-footer">
      <OrnamentalDivider motif="ruyi" color="ink" />
      <p>Images are being authenticated before they are mounted in the archive.</p>
    </div>
  </section>
</template>

<style scoped>
.media-gallery-placeholder {
  border: 1px solid color-mix(in srgb, var(--c-bronze) 28%, var(--c-border));
  background: linear-gradient(180deg, var(--c-bg), var(--c-bg-soft));
  border-radius: 6px;
  overflow: hidden;
  margin: 3rem 0;
  box-shadow: 0 18px 46px rgba(20, 20, 20, 0.04);
}

.gallery-header {
  padding: 1.35rem 1.6rem;
  border-bottom: 1px solid var(--c-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: color-mix(in srgb, var(--c-bg) 90%, var(--c-teal-accent) 10%);
}

.gallery-title-group {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.gallery-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--c-ink);
  margin: 0;
  font-weight: 400;
}

.gallery-status {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--c-bronze);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid color-mix(in srgb, var(--c-bronze) 75%, transparent);
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--c-bronze-soft);
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
  overflow: hidden;
}

.gallery-slot::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  opacity: 0.055;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.slot-cloud {
  position: absolute;
  width: 5.5rem;
  height: 2.5rem;
  border-top: 1px solid color-mix(in srgb, var(--c-teal-accent) 50%, transparent);
  border-radius: 999px 999px 0 0;
  opacity: 0.5;
}

.slot-cloud::after {
  content: '';
  position: absolute;
  top: 0.8rem;
  left: 1.1rem;
  width: 3rem;
  height: 1.2rem;
  border-top: 1px solid currentColor;
  border-radius: 999px 999px 0 0;
  color: var(--c-teal-accent);
  opacity: 0.45;
}

.dark .gallery-slot::before {
  mix-blend-mode: screen;
}

.slot-icon {
  position: relative;
  z-index: 1;
  font-family: var(--font-heading);
  font-size: 2.6rem;
  color: var(--c-ink);
  opacity: 0.11;
}

.gallery-footer {
  padding: 1.25rem 1.5rem 1.5rem;
  text-align: center;
  border-top: 1px solid var(--c-border);
  background: var(--c-bg);
}

.gallery-footer :deep(.ornamental-divider) {
  max-width: 260px;
  margin: 0 auto 0.8rem;
}

.gallery-footer p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--c-text-3);
  line-height: 1.6;
}

@media (max-width: 640px) {
  .gallery-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
