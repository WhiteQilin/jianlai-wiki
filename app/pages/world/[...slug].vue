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

// Resolve eagerly in setup: `page` is already awaited, and getMediaUrl uses
// useRuntimeConfig() which must run inside setup (not in the deferred head
// resolver that useSeoMeta getters run in).
const ogImageSrc = (page.value as any)?.banner || (page.value as any)?.image
const ogImage = ogImageSrc
  ? (() => {
      const resolved = getMediaUrl(ogImageSrc)
      // getMediaUrl leaves relative `/images/...` paths untouched when no R2
      // base is set; OG tags require an absolute URL, so prefix the site origin.
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
    section="world"
    section-title="World"
    :related-groups="relatedGroups"
  />
</template>
