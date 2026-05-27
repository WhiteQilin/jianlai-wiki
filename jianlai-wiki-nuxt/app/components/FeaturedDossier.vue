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
}

.dossier-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--c-seal-red);
  transform: scaleY(0);
  transform-origin: center;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dossier-item:hover {
  background: var(--c-bg-soft);
  z-index: 1;
}

.dossier-item:hover::before {
  transform: scaleY(1);
}

.dossier-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 120px;
  flex-shrink: 0;
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
}

.dossier-name span {
  font-size: 1.2rem;
  color: var(--c-text-3);
  font-weight: 400;
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
  transition: all 0.3s ease;
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
