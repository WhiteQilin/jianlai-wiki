<script setup lang="ts">
const route = useRoute()
const section = 'world'
const sectionTitle = 'World'

const { data: page } = await useAsyncData(`page-${route.path}`, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useSeoMeta({
  title: `${page.value?.title} | Jian Lai Wiki`
})
</script>

<template>
  <div class="article-page mdc-content animate-fade-up">
    <div class="breadcrumb">
      <NuxtLink to="/">Home</NuxtLink> <span>/</span>
      <NuxtLink :to="`/${section}`">{{ sectionTitle }}</NuxtLink> <span>/</span>
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
