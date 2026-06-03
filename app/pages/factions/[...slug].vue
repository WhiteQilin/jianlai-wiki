<script setup lang="ts">
import { getMediaUrl } from '~/constants/homeHeroVideos'

const route = useRoute()

const { data: page } = await useAsyncData(`page-${route.path}`, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

const { groups: relatedGroups } = await useRelatedEntries(route.path)

const ogImageSrc = (page.value as any)?.banner || (page.value as any)?.image
const ogImage = ogImageSrc
  ? (() => {
      const resolved = getMediaUrl(ogImageSrc)
      return resolved.startsWith('/') ? new URL(resolved, 'https://jianlai.wiki').href : resolved
    })()
  : undefined

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.description,
  ogImage,
})
</script>

<template>
  <EntryDetail
    :page="page"
    section="factions"
    section-title="Factions"
    :related-groups="relatedGroups"
  />
</template>
