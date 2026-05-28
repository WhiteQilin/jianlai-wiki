<script setup lang="ts">
defineProps<{
  link: string
  nameEn: string
  nameZh: string
  desc: string
  category: string
  status: string
  image?: string
}>()
</script>

<template>
  <NuxtLink :to="link" class="dossier-card">
    <div class="card-texture"></div>
    <div v-if="image" class="card-image-wrap">
      <img :src="image" :alt="nameEn" class="card-image" loading="lazy" />
      <div class="card-image-overlay"></div>
    </div>
    <div v-else class="card-image-placeholder">
      <span class="placeholder-char">{{ nameZh.charAt(0) || '无' }}</span>
    </div>
    
    <div class="card-content">
      <div class="card-meta">
        <span class="category">{{ category }}</span>
        <span class="status">{{ status }}</span>
      </div>
      <h4 class="card-name">{{ nameEn }} <span class="zh-name">{{ nameZh }}</span></h4>
      <p class="card-desc">{{ desc }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped>
.dossier-card {
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  height: 100%;
}

.dossier-card:hover {
  transform: translateY(-4px);
  border-color: var(--c-seal-red);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.card-texture {
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.02;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.4s ease;
}

.dark .card-texture {
  mix-blend-mode: screen;
}

.dossier-card:hover .card-texture {
  opacity: 0.05;
}

.card-image-wrap {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--c-border);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.dossier-card:hover .card-image {
  transform: scale(1.05);
}

.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--c-bg) 0%, transparent 50%);
}

.card-image-placeholder {
  width: 100%;
  height: 200px;
  background: var(--c-bg-soft);
  border-bottom: 1px solid var(--c-border);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.card-image-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-blend-mode: multiply;
  opacity: 0.2;
}

.dark .card-image-placeholder::before {
  background-blend-mode: screen;
}

.placeholder-char {
  font-family: var(--font-heading);
  font-size: 5rem;
  color: var(--c-border);
  z-index: 1;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  z-index: 1;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.category {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.status {
  font-size: 0.65rem;
  color: var(--c-seal-red);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid var(--c-seal-red-soft);
  padding: 2px 6px;
  border-radius: 2px;
}

.card-name {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  color: var(--c-ink);
  margin: 0 0 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  transition: color 0.3s ease;
}

.dossier-card:hover .card-name {
  color: var(--c-seal-red);
}

.zh-name {
  font-size: 1.1rem;
  color: var(--c-text-3);
  font-weight: 400;
}

.card-desc {
  font-size: 0.9rem;
  color: var(--c-text-2);
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
