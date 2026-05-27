const fs = require('fs');
const path = require('path');

const sections = [
  { id: 'world', title: 'World', titleZh: '天下图志', desc: 'Explore the vast geography of Jian Lai.' },
  { id: 'cultivation', title: 'Cultivation', titleZh: '山上修行', desc: 'Overview of the cultivation systems.' },
  { id: 'swordsmanship', title: 'Swordsmanship', titleZh: '剑术与神通', desc: 'The way of the sword cultivator.' },
  { id: 'factions', title: 'Factions', titleZh: '宗门势力', desc: 'The major powers, sects, and organizations.' },
  { id: 'artifacts', title: 'Artifacts', titleZh: '法宝器物', desc: 'An archive of the myriad treasures.' },
  { id: 'timeline', title: 'Timeline', titleZh: '年表', desc: 'The chronological history of Jian Lai.' },
  { id: 'glossary', title: 'Glossary', titleZh: '术语典籍', desc: 'A comprehensive reference for terminology.' }
];

sections.forEach(s => {
  // Create pages dir
  fs.mkdirSync(`jianlai-wiki-nuxt/app/pages/${s.id}`, { recursive: true });
  
  // Create index.vue
  const indexContent = `<script setup lang="ts">
const { data: items } = await useAsyncData('${s.id}-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/${s.id}/%')
    .order('title', 'ASC')
    .all()
})

useSeoMeta({
  title: '${s.title} | Jian Lai Wiki'
})
</script>

<template>
  <div class="section-index mdc-content animate-fade-up">
    <h1>${s.title} <span class="zh">${s.titleZh}</span></h1>
    <p class="section-desc">${s.desc}</p>

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
`;
  fs.writeFileSync(`jianlai-wiki-nuxt/app/pages/${s.id}/index.vue`, indexContent);

  // Create [...slug].vue
  const slugContent = `<script setup lang="ts">
const route = useRoute()
const section = '${s.id}'
const sectionTitle = '${s.title}'

const { data: page } = await useAsyncData(\`page-\${route.path}\`, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useSeoMeta({
  title: \`\${page.value?.title} | Jian Lai Wiki\`
})
</script>

<template>
  <div class="article-page mdc-content animate-fade-up">
    <div class="breadcrumb">
      <NuxtLink to="/">Home</NuxtLink> <span>/</span>
      <NuxtLink :to="\`/\${section}\`">{{ sectionTitle }}</NuxtLink> <span>/</span>
      <span class="current">{{ page?.title }}</span>
    </div>

    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>

<style scoped>
.breadcrumb {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--c-text-3);
  margin-bottom: 2rem;
  display: flex;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.breadcrumb a {
  color: var(--c-text-2);
  text-decoration: none;
  border: none;
}

.breadcrumb a:hover {
  color: var(--c-seal-red);
}

.current {
  color: var(--c-ink);
  font-weight: 600;
}
</style>
`;
  fs.writeFileSync(`jianlai-wiki-nuxt/app/pages/${s.id}/[...slug].vue`, slugContent);

  // Create content dir and placeholder
  fs.mkdirSync(`jianlai-wiki-nuxt/content/${s.id}`, { recursive: true });
  const mdContent = `---
title: Sample ${s.title} Entry
category: ${s.title}
status: To be verified
---

## Overview

This is a sample entry for ${s.title}.

## Notes

- To be verified: Content pending.
`;
  fs.writeFileSync(`jianlai-wiki-nuxt/content/${s.id}/sample.md`, mdContent);
});

// Also create characters/[...slug].vue to match
fs.writeFileSync(`jianlai-wiki-nuxt/app/pages/characters/[...slug].vue`, `<script setup lang="ts">
const route = useRoute()
const section = 'characters'
const sectionTitle = 'Characters'

const { data: page } = await useAsyncData(\`page-\${route.path}\`, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useSeoMeta({
  title: \`\${page.value?.title} | Jian Lai Wiki\`
})
</script>

<template>
  <div class="article-page mdc-content animate-fade-up">
    <div class="breadcrumb">
      <NuxtLink to="/">Home</NuxtLink> <span>/</span>
      <NuxtLink :to="\`/\${section}\`">{{ sectionTitle }}</NuxtLink> <span>/</span>
      <span class="current">{{ page?.title }}</span>
    </div>

    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>

<style scoped>
.breadcrumb {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--c-text-3);
  margin-bottom: 2rem;
  display: flex;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.breadcrumb a {
  color: var(--c-text-2);
  text-decoration: none;
  border: none;
}

.breadcrumb a:hover {
  color: var(--c-seal-red);
}

.current {
  color: var(--c-ink);
  font-weight: 600;
}
</style>
`);

// Delete root slug if exists
if (fs.existsSync('jianlai-wiki-nuxt/app/pages/[...slug].vue')) {
  fs.unlinkSync('jianlai-wiki-nuxt/app/pages/[...slug].vue');
}

console.log('Pages and content created successfully.');