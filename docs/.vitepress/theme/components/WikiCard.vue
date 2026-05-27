<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  link: string
  badge?: string
  icon?: string
}>()
</script>

<template>
  <a :href="link" class="wiki-card">
    <div class="card-main">
      <h4 class="card-title">{{ title }}</h4>
      <p v-if="description" class="card-desc">{{ description }}</p>
    </div>
    <div class="card-meta">
      <span v-if="badge" class="status-badge">{{ badge }}</span>
      <span class="arrow">→</span>
    </div>
  </a>
</template>

<style scoped>
.wiki-card {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border: 1px solid var(--vp-c-border);
  text-decoration: none !important;
  transition: all 0.3s ease;
  position: relative;
  background: var(--vp-c-bg);
  overflow: hidden;
}

.wiki-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--jl-c-seal-red);
  transform: scaleY(0);
  transform-origin: center;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.wiki-card:hover {
  background: var(--vp-c-bg-soft);
}

.wiki-card:hover::before {
  transform: scaleY(1);
}

.card-main {
  flex-grow: 1;
}

.card-title {
  font-family: var(--jl-font-heading);
  font-size: 1.6rem;
  margin: 0 0 0.75rem 0;
  color: var(--jl-c-ink);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-icon {
  font-size: 1.2rem;
  opacity: 0.5;
}

.card-desc {
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
  font-size: 1rem;
  max-width: 800px;
}

.card-meta {
  position: absolute;
  top: 2.2rem;
  right: 0;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.wiki-card:hover .card-meta {
  right: 20px;
}

.status-badge {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--jl-c-seal-red);
  border: 1px solid var(--jl-c-seal-red-soft);
  padding: 0.2rem 0.5rem;
}

.arrow {
  font-size: 1.2rem;
  color: var(--vp-c-text-3);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-10px);
}

.wiki-card:hover .arrow {
  color: var(--jl-c-seal-red);
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 768px) {
  .card-meta {
    position: relative;
    top: 0;
    justify-content: flex-start;
    margin-bottom: 1rem;
  }
  .arrow { display: none; }
}
</style>
