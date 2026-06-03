<script setup lang="ts">
import { getMediaUrl } from '~/constants/homeHeroVideos'

const route = useRoute()
const section = 'characters'
const sectionTitle = 'Characters'

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
  <div class="article-page">
    <CharacterHero
      v-if="(page as any)?.video"
      :video="(page as any).video"
      :poster="(page as any)?.image"
      :titleEn="page?.title"
      :titleZh="(page as any)?.chinese"
      :pinyin="(page as any)?.pinyin"
      :seal="(page as any)?.seal"
      :isOfficial="true"
    />
    <div class="mdc-content">
      <ScrollReveal animation="reveal-fade-up">
        <div class="breadcrumb">
          <NuxtLink to="/">Home</NuxtLink> <span>/</span>
          <NuxtLink :to="`/${section}`">{{ sectionTitle }}</NuxtLink> <span>/</span>
          <span class="current">{{ page?.title }}</span>
        </div>
      </ScrollReveal>

      <ScrollReveal v-if="page" animation="reveal-fade-up" delay="stagger-1">
        <NameBlock 
          :nameEn="page.title || 'Unknown'" 
          :nameZh="(page as any).chinese || ''" 
          :pinyin="(page as any).pinyin"
          :seal="(page as any).seal"
        />
        <p v-if="page.description" class="character-desc-lead">{{ page.description }}</p>
      </ScrollReveal>

      <div class="article-layout">
        <aside class="article-sidebar">
          <ScrollReveal animation="reveal-fade-up" delay="stagger-2">
            <CharacterInfobox 
              :image="(page as any).image"
              :alt="page?.title"
              :fallbackChar="(page as any).chinese?.charAt(0)"
              :stats="[
                { label: 'Category', value: (page as any).category || 'Unknown' },
                { label: 'Status', value: (page as any).status || 'Unknown' },
                { label: 'Origin', value: (page as any).origin || 'Unknown' },
                { label: 'Realm', value: (page as any).realm || 'Unknown' }
              ]"
            />
          </ScrollReveal>
        </aside>

        <div class="article-main">
          <ScrollReveal animation="reveal-fade-up" delay="stagger-2">
            <ContentRenderer v-if="page" :value="page" class="mdc-prose" />
          </ScrollReveal>

          <template v-if="relatedGroups.length">
            <InkDivider type="brush" />
            <ScrollReveal animation="reveal-fade-up">
              <RelatedEntries :groups="relatedGroups" />
            </ScrollReveal>
          </template>

          <InkDivider type="mist" />

          <ScrollReveal animation="reveal-fade-up">
            <MediaGalleryPlaceholder :title="`${page?.title} Media`" />
          </ScrollReveal>

          <InkDivider type="brush" />

          <ScrollReveal animation="reveal-fade-up">
            <WikiNotice type="verification">
              <p><strong>Source Verification:</strong> This entry is currently being cross-referenced with the original text. Details may be subject to change.</p>
            </WikiNotice>
          </ScrollReveal>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-desc-lead {
  font-size: 1.2rem;
  color: var(--c-text-2);
  line-height: 1.8;
  max-width: 800px;
  margin-bottom: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--c-divider);
}

.article-layout {
  display: flex;
  flex-direction: row-reverse;
  gap: 5rem;
  position: relative;
}

.article-main {
  flex-grow: 1;
  min-width: 0;
}

.article-sidebar {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

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

@media (max-width: 1024px) {
  .article-layout {
    flex-direction: column;
  }
  .article-sidebar {
    width: 100%;
    flex-direction: row;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .article-sidebar {
    flex-direction: column;
  }
}
</style>
