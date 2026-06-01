<script setup lang="ts">
defineProps<{
  link: string
  titleZh: string
  titleEn: string
  bgChar: string
  bgImage?: string
}>()
</script>

<template>
  <NuxtLink :to="link" class="portal-card hover-lift" :data-zh="bgChar">
    <div v-if="bgImage" class="portal-bg-image" :style="{ backgroundImage: `url(${bgImage})` }"></div>
    <div v-else class="portal-texture"></div>
    <span class="portal-zh">{{ titleZh }}</span>
    <div class="portal-bottom">
      <span class="portal-en">{{ titleEn }}</span>
      <span class="arrow animate-reveal-line"></span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.portal-bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  filter: grayscale(80%) sepia(20%) hue-rotate(330deg);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
  pointer-events: none;
}

.portal-card:hover .portal-bg-image {
  opacity: 0.3;
  transform: scale(1.05);
  filter: grayscale(30%) sepia(20%) hue-rotate(330deg);
}

.portal-texture {
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  background-position: center;
  opacity: 0;
  mix-blend-mode: multiply;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
  pointer-events: none;
}

.dark .portal-texture {
  mix-blend-mode: screen;
}

.portal-card:hover .portal-texture {
  opacity: 0.12;
}

.portal-card {
  background: var(--c-paper);
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  min-height: 200px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--c-border);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.portal-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, var(--c-seal-red-soft) 100%);
  opacity: 0;
  transition: opacity 0.6s ease;
  z-index: 0;
}

.portal-card::after {
  content: attr(data-zh);
  position: absolute;
  bottom: -20px;
  right: -10px;
  font-family: var(--font-zh-display);
  font-size: 8rem;
  color: var(--c-text-1);
  opacity: 0.02;
  pointer-events: none;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 0;
}

.portal-card:hover {
  background: var(--c-mist-light);
  border-color: var(--c-seal-red);
}

.portal-card:hover::before {
  opacity: 1;
}

.portal-card:hover::after {
  transform: scale(1.3) translate(-10px, -10px) rotate(-5deg);
  color: var(--c-seal-red);
  opacity: 0.08;
}

.portal-zh {
  font-family: var(--font-zh-display);
  font-size: 2.6rem;
  color: var(--c-ink);
  font-weight: 400;
  letter-spacing: 0.08em;
  position: relative;
  z-index: 1;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.portal-card:hover .portal-zh {
  transform: translateX(10px);
}

.portal-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.portal-en {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--c-text-3);
  transition: color 0.3s ease;
}

.arrow {
  position: relative;
  width: 40px;
  height: 1px;
  background: var(--c-divider);
}

.portal-card:hover .portal-en {
  color: var(--c-ink);
}

.portal-card:hover .arrow {
  background: var(--c-seal-red);
}
</style>
