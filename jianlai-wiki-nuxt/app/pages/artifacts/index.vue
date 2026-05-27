<script setup lang="ts">
const { data: items } = await useAsyncData('artifacts-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/artifacts/%')
    .order('title', 'ASC')
    .all()
})

useSeoMeta({
  title: 'Artifacts | Jian Lai Wiki'
})
</script>

<template>
  <div class="section-index mdc-content animate-fade-up">
    <h1>Artifacts <span class="zh">法宝器物</span></h1>
    <p class="section-desc">An archive of the myriad treasures.</p>

    <div class="archive-grid">
      <NuxtLink v-for="item in items" :key="item.path" :to="item.path" class="archive-card hover-lift">
        <h3 class="card-title">{{ item.title }} <span v-if="item.chinese" class="card-zh">{{ item.chinese }}</span></h3>
        <p class="card-status" v-if="item.status">{{ item.status }}</p>
        <div class="card-arrow">→</div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.zh {
  font-size: 0.6em;
  color: var(--c-text-3);
  margin-left: 0.5rem;
}

.section-desc {
  text-align: center;
  margin-bottom: 4rem;
  font-size: 1.2rem;
}

.archive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.archive-card {
  padding: 2rem;
  border: 1px solid var(--c-border);
  background: var(--c-bg);
  text-decoration: none !important;
  border-bottom: 1px solid var(--c-border) !important;
  position: relative;
  overflow: hidden;
}

.archive-card::before {
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

.archive-card:hover {
  background: var(--c-bg-soft);
}

.archive-card:hover::before {
  transform: scaleY(1);
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  margin: 0 0 0.5rem 0;
  color: var(--c-ink);
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.card-zh {
  font-size: 1.1rem;
  color: var(--c-text-3);
}

.card-status {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--c-seal-red);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.card-arrow {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-text-3);
  transition: all 0.3s ease;
}

.archive-card:hover .card-arrow {
  color: var(--c-seal-red);
  transform: translate(5px, -50%);
}
</style>
