<script setup lang="ts">
/**
 * EntryDetail — shared public reader-facing layout for all wiki entries.
 *
 * Stage 18A locks this as the public presentation shell: polished header,
 * section-aware infobox, heading-derived contents, Markdown prose, relationship
 * panels, and subtle source notes. The data contract remains the existing Nuxt
 * Content frontmatter shape; all improvements happen in the render layer.
 */
import type { RelatedGroup } from '~/composables/useRelatedEntries'
import type { EntryRecordLike } from '~/utils/entryLinkResolver'
import { resolvePublicImage } from '~/utils/publicMedia'

const props = defineProps<{
  page: any
  section: string
  sectionTitle: string
  relatedGroups?: RelatedGroup[]
}>()

const { data: allEntries } = await useAsyncData('entry-detail-link-graph', () =>
  queryCollection('content').all(),
)

const entries = computed<EntryRecordLike[]>(() => (allEntries.value || []) as EntryRecordLike[])
const groups = computed<RelatedGroup[]>(() => props.relatedGroups ?? [])
const resolvedHeroPoster = computed(() => resolvePublicImage(props.page?.image))
const resolvedBanner = computed(() => resolvePublicImage(props.page?.banner))
const showVideoHero = computed(() => props.section === 'characters' && Boolean(props.page?.video))
const showBanner = computed(() => Boolean(resolvedBanner.value) && !showVideoHero.value)
const hasReferenceContent = computed(() => Boolean(
  props.page?.sourceNotes ||
  props.page?.verificationStatus ||
  props.page?.firstAppearance ||
  props.page?.lastUpdated,
))

const importanceLabel = computed(() => {
  const value = props.page?.importance
  const labels: Record<string, string> = {
    primary: 'Primary',
    major: 'Major',
    minor: 'Minor',
    background: 'Background',
  }
  return value ? labels[value] || value : ''
})
</script>

<template>
  <div class="article-page entry-detail-shell">
    <CharacterHero
      v-if="showVideoHero"
      :video="page.video"
      :poster="resolvedHeroPoster || undefined"
      :titleEn="page?.title"
      :titleZh="page?.chinese"
      :pinyin="page?.pinyin"
      :seal="page?.seal"
      :isOfficial="true"
    />

    <MediaBanner
      v-else-if="showBanner"
      :image="resolvedBanner"
      :alt="page?.title"
      :is-official="true"
    />

    <div class="mdc-content">
      <ScrollReveal animation="reveal-fade-up">
        <div class="breadcrumb">
          <NuxtLink to="/">Home</NuxtLink> <span>/</span>
          <NuxtLink :to="`/${section}`">{{ sectionTitle }}</NuxtLink> <span>/</span>
          <span class="current">{{ page?.title }}</span>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <header class="entry-header">
          <div class="header-copy">
            <NameBlock
              :nameEn="page?.title || 'Unknown'"
              :nameZh="page?.chinese || ''"
              :pinyin="page?.pinyin"
              :seal="page?.seal"
            />
            <p v-if="page?.description" class="entry-lead">{{ page.description }}</p>
          </div>
          <div class="header-badges" aria-label="Entry classification">
            <span v-if="page?.category" class="entry-badge">{{ page.category }}</span>
            <span v-if="page?.subcategory" class="entry-chip">{{ page.subcategory }}</span>
            <span v-if="importanceLabel" class="entry-chip is-importance">{{ importanceLabel }}</span>
          </div>
        </header>
      </ScrollReveal>

      <div class="article-layout">
        <aside class="article-sidebar">
          <ScrollReveal class="infobox-sticky-frame" animation="reveal-fade-up" delay="stagger-2">
            <EntryInfobox
              :page="page"
              :section="section"
              :entries="entries"
            />
          </ScrollReveal>
        </aside>

        <main class="article-main">
          <ScrollReveal animation="reveal-fade-up" delay="stagger-2">
            <EntrySectionNav :page="page" />
            <ContentRenderer v-if="page" :value="page" class="mdc-prose entry-prose" />
          </ScrollReveal>

          <template v-if="groups.length || (page?.relationships?.length ?? 0) > 0">
            <OrnamentalDivider motif="jade" />
            <ScrollReveal animation="reveal-fade-up">
              <EntryRelationshipPanel
                :page="page"
                :groups="groups"
                :entries="entries"
              />
            </ScrollReveal>
          </template>

          <template v-if="section === 'characters'">
            <OrnamentalDivider motif="diamond" />
            <ScrollReveal animation="reveal-fade-up">
              <MediaGalleryPlaceholder :title="`${page?.title} Media`" />
            </ScrollReveal>
          </template>

          <template v-if="hasReferenceContent">
            <OrnamentalDivider motif="diamond" />
            <ScrollReveal animation="reveal-fade-up">
              <EntryReferenceBlock :page="page" />
            </ScrollReveal>
          </template>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entry-header {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2rem;
  align-items: end;
  margin-bottom: 3rem;
  padding-bottom: 2.4rem;
  border-bottom: 1px solid color-mix(in srgb, var(--c-divider) 78%, transparent);
}

.entry-lead {
  max-width: 850px;
  margin: 1.1rem 0 0;
  color: var(--c-text-2);
  font-size: 1.18rem;
  line-height: 1.8;
}

.header-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.55rem;
  max-width: 320px;
}

.entry-badge,
.entry-chip {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.35rem 0.72rem;
  color: var(--c-seal-red);
  border: 1px solid var(--c-seal-red-soft);
  background: color-mix(in srgb, var(--c-seal-red) 5%, transparent);
  font-family: var(--font-heading);
  font-size: 0.86rem;
  line-height: 1.2;
}

.entry-badge {
  transform: rotate(-1deg);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.entry-chip {
  color: var(--c-text-2);
  border-color: color-mix(in srgb, var(--c-border) 75%, transparent);
  background: color-mix(in srgb, var(--c-bg-soft) 80%, transparent);
}

.entry-chip.is-importance {
  text-transform: capitalize;
}

.article-layout {
  display: flex;
  flex-direction: row-reverse;
  gap: clamp(2.5rem, 5vw, 5rem);
  position: relative;
}

.article-main {
  flex-grow: 1;
  min-width: 0;
}

.entry-prose {
  max-width: 75ch;
}

.article-sidebar {
  width: min(320px, 29vw);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.infobox-sticky-frame {
  position: sticky;
  top: calc(var(--header-height) + 1rem);
  max-height: calc(100dvh - var(--header-height) - 2rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--c-seal-red) 32%, transparent) transparent;
  transform: none !important;
}

.infobox-sticky-frame::-webkit-scrollbar {
  width: 6px;
}

.infobox-sticky-frame::-webkit-scrollbar-track {
  background: transparent;
}

.infobox-sticky-frame::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--c-seal-red) 28%, transparent);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
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
  .entry-header {
    grid-template-columns: 1fr;
    gap: 1.4rem;
  }

  .header-badges {
    justify-content: flex-start;
    max-width: none;
  }

  .article-layout {
    flex-direction: column;
    gap: 2.5rem;
  }

  .article-sidebar {
    width: 100%;
  }

  .infobox-sticky-frame {
    position: static;
    max-height: none;
    overflow: visible;
  }
}

@media (max-width: 640px) {
  .entry-lead {
    font-size: 1.04rem;
  }
}
</style>
