<script setup lang="ts">
import { getMediaUrl } from '~/constants/homeHeroVideos'
import { timelineArcHref } from '~/utils/timelineAnchors'

const route = useRoute()

const { data: page } = await useAsyncData(`page-${route.path}`, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

const { groups: relatedGroups } = await useRelatedEntries(route.path)

const { data: timelineEntries } = await useAsyncData('timeline-detail-navigation', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/timeline/%')
    .all()
})

type TimelineEntryLike = {
  path?: string
  title?: string
  era?: string
  eraOrder?: number
}

function sortableEraOrder(entry: TimelineEntryLike) {
  const order = Number(entry.eraOrder)
  return Number.isFinite(order) ? order : Number.POSITIVE_INFINITY
}

function normalizePath(path?: string) {
  return path ? path.replace(/\/$/, '') : ''
}

function normalizeTimelineRecord(entry?: TimelineEntryLike | null) {
  if (!entry?.path) return null

  const order = Number(entry.eraOrder)

  return {
    path: entry.path,
    title: entry.title || entry.path,
    era: entry.era,
    eraOrder: Number.isFinite(order) ? order : undefined,
  }
}

const sortedTimelineEntries = computed(() => {
  return [...((timelineEntries.value || []) as TimelineEntryLike[])]
    .filter((entry) => Boolean(entry.path))
    .sort((a, b) => {
      const aOrder = sortableEraOrder(a)
      const bOrder = sortableEraOrder(b)
      if (aOrder !== bOrder) return aOrder - bOrder

      const titleDelta = String(a.title || '').localeCompare(String(b.title || ''))
      if (titleDelta !== 0) return titleDelta

      return String(a.path || '').localeCompare(String(b.path || ''))
    })
})

const timelineNavigation = computed(() => {
  const currentPath = normalizePath(route.path)
  const currentIndex = sortedTimelineEntries.value.findIndex((entry) => normalizePath(entry.path) === currentPath)
  const currentPage = page.value as TimelineEntryLike | null

  return {
    era: currentPage?.era,
    eraHref: timelineArcHref(currentPage?.era),
    previous: currentIndex > 0 ? normalizeTimelineRecord(sortedTimelineEntries.value[currentIndex - 1]) : null,
    next: currentIndex >= 0 && currentIndex < sortedTimelineEntries.value.length - 1
      ? normalizeTimelineRecord(sortedTimelineEntries.value[currentIndex + 1])
      : null,
  }
})

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
    section="timeline"
    section-title="Timeline"
    :related-groups="relatedGroups"
    :timeline-navigation="timelineNavigation"
  />
</template>
