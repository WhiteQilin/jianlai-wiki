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
  <div class="article-page entry-detail-shell" :class="`section-${section}`">
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

.entry-detail-shell.section-timeline {
  --timeline-gold: #d4af37;
  --c-paper: #060606;
  --c-bg: #060606;
  --c-bg-soft: rgba(255, 255, 255, 0.055);
  --c-bg-alt: #11100d;
  --c-ink: #f5efe0;
  --c-charcoal: #fff7dc;
  --c-ink-wash: rgba(255, 255, 255, 0.76);
  --c-text-1: #f5efe0;
  --c-text-2: rgba(255, 255, 255, 0.72);
  --c-text-3: rgba(255, 255, 255, 0.48);
  --c-border: rgba(212, 175, 55, 0.2);
  --c-divider: rgba(212, 175, 55, 0.16);
  --c-seal-red: #d4af37;
  --c-seal-red-soft: rgba(212, 175, 55, 0.16);
  min-height: 100dvh;
  color: var(--c-text-1);
  background:
    radial-gradient(circle at 18% 8%, rgba(212, 175, 55, 0.1), transparent 24rem),
    radial-gradient(circle at 88% 18%, rgba(184, 42, 42, 0.08), transparent 22rem),
    linear-gradient(180deg, #050505, #090806 42%, #050505);
}

.section-timeline .mdc-content {
  padding-top: calc(var(--header-height) + clamp(2rem, 4vw, 3.5rem));
  padding-bottom: clamp(4rem, 7vw, 6rem);
}

.section-timeline .breadcrumb {
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.14);
}

.section-timeline .breadcrumb a:hover {
  color: #f0d27a;
}

.section-timeline .current {
  color: rgba(240, 210, 122, 0.86);
}

.section-timeline .entry-header {
  margin-bottom: clamp(2.25rem, 4vw, 3.75rem);
  border-bottom-color: rgba(212, 175, 55, 0.2);
}

.section-timeline .entry-header::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: min(11rem, 40vw);
  height: 2px;
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.82), transparent);
  box-shadow: 0 0 18px rgba(212, 175, 55, 0.18);
}

.section-timeline .entry-lead {
  color: rgba(255, 255, 255, 0.72);
}

.section-timeline .entry-badge,
.section-timeline .entry-chip {
  border-color: rgba(212, 175, 55, 0.26);
  background: rgba(212, 175, 55, 0.07);
  color: rgba(240, 210, 122, 0.9);
}

.section-timeline .entry-chip {
  color: rgba(255, 255, 255, 0.68);
}

.section-timeline :deep(.name-en) {
  color: #fff8e4;
  text-shadow: 0 0 28px rgba(212, 175, 55, 0.12);
}

.section-timeline :deep(.name-zh),
.section-timeline :deep(.name-pinyin) {
  color: rgba(212, 175, 55, 0.68);
}

.section-timeline :deep(.name-seal),
.section-timeline :deep(.seal-variant-outline) {
  color: #d4af37;
  border-color: rgba(212, 175, 55, 0.54);
  background: rgba(212, 175, 55, 0.06);
  box-shadow: 0 0 18px rgba(212, 175, 55, 0.12);
}

.section-timeline :deep(.entry-section-nav) {
  border-block-color: rgba(212, 175, 55, 0.16);
}

.section-timeline :deep(.contents-link) {
  color: rgba(255, 255, 255, 0.68);
  border-color: rgba(212, 175, 55, 0.18);
  background: rgba(10, 9, 7, 0.78);
}

.section-timeline :deep(.contents-link:hover) {
  color: #f0d27a;
  border-color: rgba(212, 175, 55, 0.5);
  background: rgba(212, 175, 55, 0.08);
}

.section-timeline :deep(.mdc-prose) {
  color: rgba(255, 255, 255, 0.74);
}

.section-timeline :deep(.mdc-prose h2),
.section-timeline :deep(.mdc-prose h3),
.section-timeline :deep(.mdc-prose h4) {
  color: #fff6dd;
}

.section-timeline :deep(.mdc-prose h2) {
  border-bottom-color: rgba(212, 175, 55, 0.18);
}

.section-timeline :deep(.mdc-prose h2::after) {
  background: linear-gradient(90deg, #d4af37, transparent);
}

.section-timeline :deep(.mdc-prose a) {
  color: #f0d27a;
  border-bottom-color: rgba(212, 175, 55, 0.28);
}

.section-timeline :deep(.mdc-prose blockquote) {
  border-left-color: rgba(212, 175, 55, 0.72);
  background: rgba(212, 175, 55, 0.06);
  color: rgba(255, 255, 255, 0.82);
}

.section-timeline :deep(.entry-infobox),
.section-timeline :deep(.entry-reference-block) {
  border-color: rgba(212, 175, 55, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(18, 15, 9, 0.92), rgba(7, 7, 7, 0.92)),
    url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-blend-mode: normal, screen;
  box-shadow:
    inset 0 1px 0 rgba(255, 244, 194, 0.07),
    0 20px 44px rgba(0, 0, 0, 0.36);
}

.section-timeline :deep(.infobox-heading),
.section-timeline :deep(.infobox-image-wrapper) {
  border-color: rgba(212, 175, 55, 0.18);
}

.section-timeline :deep(.infobox-heading h2),
.section-timeline :deep(.reference-heading h2),
.section-timeline :deep(.row-value),
.section-timeline :deep(.relationship-name),
.section-timeline :deep(.ranking-name),
.section-timeline :deep(.source-fact dd) {
  color: #fff4d6;
}

.section-timeline :deep(.eyebrow),
.section-timeline :deep(.row-label),
.section-timeline :deep(.footer-label),
.section-timeline :deep(.source-fact dt) {
  color: rgba(212, 175, 55, 0.62);
}

.section-timeline :deep(.infobox-row) {
  border-bottom-color: rgba(212, 175, 55, 0.13);
}

.section-timeline :deep(.public-badge),
.section-timeline :deep(.public-chip),
.section-timeline :deep(.verification-badge) {
  color: rgba(240, 210, 122, 0.92);
  border-color: rgba(212, 175, 55, 0.28);
  background: rgba(212, 175, 55, 0.07);
}

.section-timeline :deep(.route-display-link) {
  color: rgba(255, 246, 220, 0.88);
}

.section-timeline :deep(.route-display-link:hover) {
  color: #f0d27a;
}

.section-timeline :deep(.route-display-link.is-chip),
.section-timeline :deep(.relationship-item),
.section-timeline :deep(.ranking-item) {
  border-color: rgba(212, 175, 55, 0.18);
  background: rgba(255, 255, 255, 0.045);
}

.section-timeline :deep(.infobox-placeholder) {
  background:
    radial-gradient(circle at 50% 38%, rgba(212, 175, 55, 0.14), transparent 62%),
    url('/images/textures/ink-wash-01.webp');
  background-size: cover;
}

.section-timeline :deep(.placeholder-char) {
  color: rgba(212, 175, 55, 0.68);
  border-color: rgba(212, 175, 55, 0.36);
  background: rgba(5, 5, 5, 0.42);
}

.section-timeline :deep(.image-overlay) {
  border-color: rgba(212, 175, 55, 0.18);
}

.section-timeline :deep(.source-notes),
.section-timeline :deep(.reference-cta) {
  color: rgba(255, 255, 255, 0.72);
}

.section-timeline :deep(.reference-cta) {
  border-top-color: rgba(212, 175, 55, 0.18);
}

.section-timeline :deep(.contribute-link) {
  color: #f0d27a;
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
  .entry-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }
}
</style>
