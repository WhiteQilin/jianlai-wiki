<script setup lang="ts">
defineProps<{
  link: string
  nameEn: string
  nameZh: string
  desc: string
  category: string
  status: string
}>()
</script>

<template>
  <NuxtLink :to="link" class="dossier-item">
    <div class="dossier-texture"></div>
    <div class="dossier-meta">
      <span class="category">{{ category }}</span>
      <span class="status">{{ status }}</span>
    </div>
    <div class="dossier-content">
      <h4 class="dossier-name">{{ nameEn }} <span>{{ nameZh }}</span></h4>
      <p class="dossier-desc">{{ desc }}</p>
    </div>
    <div class="dossier-arrow">→</div>
  </NuxtLink>
</template>

<style scoped>
.dossier-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5rem;
  border: 1px solid var(--c-border);
  background: var(--c-bg);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  margin-bottom: -1px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dossier-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, var(--c-seal-red-soft) 100%);
  transform: translateX(-100%);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}

.dossier-item:hover {
  background: var(--c-bg-soft);
  z-index: 1;
  padding-left: 3rem;
  border-color: var(--c-seal-red);
}

.dossier-item:hover::before {
  transform: translateX(0);
}

.dossier-texture {
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-position: center;
  opacity: 0;
  mix-blend-mode: multiply;
  transition: opacity 0.5s ease;
  z-index: 0;
  pointer-events: none;
}

.dark .dossier-texture {
  mix-blend-mode: screen;
}

.dossier-item:hover .dossier-texture {
  opacity: 0.03;
}

.dossier-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 120px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.category {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.status {
  font-size: 0.7rem;
  color: var(--c-seal-red);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dossier-content {
  flex-grow: 1;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.dossier-name {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  color: var(--c-ink);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  transition: color 0.4s ease;
}

.dossier-item:hover .dossier-name {
  color: var(--c-seal-red);
}

.dossier-name span {
  font-size: 1.2rem;
  color: var(--c-text-3);
  font-weight: 400;
  transition: color 0.4s ease;
}

.dossier-item:hover .dossier-name span {
  color: var(--c-text-2);
}

.dossier-desc {
  color: var(--c-text-2);
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

.dossier-arrow {
  font-size: 1.5rem;
  color: var(--c-text-3);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateX(-10px);
  opacity: 0;
}

.dossier-item:hover .dossier-arrow {
  color: var(--c-seal-red);
  transform: translateX(0);
  opacity: 1;
}

@media (max-width: 768px) {
  .dossier-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  .dossier-content { padding: 0; }
  .dossier-arrow { display: none; }
  .dossier-meta { width: auto; flex-direction: row; align-items: center; }
}
</style>
