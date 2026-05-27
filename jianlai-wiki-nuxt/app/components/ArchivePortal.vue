<script setup lang="ts">
defineProps<{
  link: string
  titleZh: string
  titleEn: string
  bgChar: string
}>()
</script>

<template>
  <NuxtLink :to="link" class="portal-card hover-lift" :data-zh="bgChar">
    <span class="portal-zh">{{ titleZh }}</span>
    <div class="portal-bottom">
      <span class="portal-en">{{ titleEn }}</span>
      <span class="arrow animate-reveal-line"></span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.portal-card {
  background: var(--c-bg);
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  min-height: 200px;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  border-bottom: none;
}

.portal-card::after {
  content: attr(data-zh);
  position: absolute;
  bottom: -20px;
  right: -10px;
  font-family: var(--font-heading);
  font-size: 8rem;
  color: var(--c-text-1);
  opacity: 0.02;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}

.portal-card:hover {
  background: var(--c-bg-soft);
}

.portal-card:hover::after {
  transform: scale(1.1) translate(-10px, -10px);
  color: var(--c-seal-red);
  opacity: 0.05;
}

.portal-zh {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  color: var(--c-ink);
  font-weight: 400;
  letter-spacing: 0.05em;
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
