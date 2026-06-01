<script setup lang="ts">
defineProps<{
  realms: Array<{
    level: string | number
    name: string
    chinese: string
    desc: string
    highlight?: boolean
  }>
}>()
</script>

<template>
  <div class="realm-ladder">
    <div class="ladder-spine"></div>
    <div v-for="(realm, index) in realms" :key="index" class="realm-step" :class="{ 'is-highlight': realm.highlight }">
      <div class="realm-number">{{ realm.level }}</div>
      <div class="realm-card">
        <div class="realm-header">
          <h4 class="realm-name">{{ realm.name }}</h4>
          <span class="realm-zh">{{ realm.chinese }}</span>
        </div>
        <p class="realm-desc">{{ realm.desc }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.realm-ladder {
  display: flex;
  flex-direction: column-reverse; /* Bottom to top progression */
  gap: 1rem;
  position: relative;
  padding: 2rem 0;
  max-width: 800px;
  margin: 0 auto;
}

.ladder-spine {
  position: absolute;
  top: 2rem;
  bottom: 2rem;
  left: 30px;
  width: 2px;
  background: var(--c-border);
  z-index: 0;
}

.realm-step {
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.realm-step:hover {
  transform: translateX(10px);
}

.realm-number {
  width: 60px;
  height: 60px;
  background: var(--c-bg);
  border: 2px solid var(--c-border);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--c-text-3);
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
}

.realm-step:hover .realm-number,
.realm-step.is-highlight .realm-number {
  border-color: var(--c-seal-red);
  color: var(--c-seal-red);
  background: var(--c-bg-soft);
}

.realm-card {
  flex-grow: 1;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  padding: 1.5rem 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.01);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.realm-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  opacity: 0;
  mix-blend-mode: multiply;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.dark .realm-card::before {
  mix-blend-mode: screen;
}

.realm-step:hover .realm-card {
  border-color: var(--c-seal-red-soft);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.realm-step.is-highlight .realm-card {
  border-left: 4px solid var(--c-seal-red);
}

.realm-step:hover .realm-card::before {
  opacity: 0.03;
}

.realm-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.realm-name {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  color: var(--c-ink);
  margin: 0;
}

.realm-step:hover .realm-name {
  color: var(--c-seal-red);
}

.realm-zh {
  font-size: 1.1rem;
  color: var(--c-text-3);
}

.realm-desc {
  margin: 0;
  font-size: 0.95rem;
  color: var(--c-text-2);
  line-height: 1.6;
}

@media (max-width: 640px) {
  .realm-step { gap: 1rem; }
  .realm-number { width: 40px; height: 40px; font-size: 1.2rem; }
  .ladder-spine { left: 20px; }
  .realm-card { padding: 1rem 1.2rem; }
}
</style>
