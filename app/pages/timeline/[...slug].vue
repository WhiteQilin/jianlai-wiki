<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(`page-${route.path}`, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

const { groups: relatedGroups } = await useRelatedEntries(route.path)

useSeoMeta({
  title: `${page.value?.title} | Jian Lai Wiki`
})
</script>

<template>
  <EntryDetail
    :page="page"
    section="timeline"
    section-title="Timeline"
    :related-groups="relatedGroups"
  />
</template>
