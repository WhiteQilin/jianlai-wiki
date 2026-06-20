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

interface TimelineNavigationRecord {
  path: string
  title: string
  era?: string
  eraOrder?: number
}

interface TimelineNavigation {
  era?: string
  eraHref?: string
  previous?: TimelineNavigationRecord | null
  next?: TimelineNavigationRecord | null
}

const props = defineProps<{
  page: any
  section: string
  sectionTitle: string
  relatedGroups?: RelatedGroup[]
  timelineNavigation?: TimelineNavigation
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
const isTimelineDetail = computed(() => props.section === 'timeline')
const timelineDetailNavigation = computed<TimelineNavigation | null>(() => {
  if (!isTimelineDetail.value) return null

  return props.timelineNavigation ?? {
    era: props.page?.era,
    eraHref: '/timeline',
    previous: null,
    next: null,
  }
})
const timelineEraLabel = computed(() => timelineDetailNavigation.value?.era || 'Timeline Record')
const timelineEraHref = computed(() => timelineDetailNavigation.value?.eraHref || '/timeline')
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

function timelineRecordMeta(record?: TimelineNavigationRecord | null) {
  const meta = []
  if (record?.era) meta.push(record.era)
  if (typeof record?.eraOrder === 'number') meta.push(`Order ${record.eraOrder}`)

  return meta.join(' / ')
}
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

      <ScrollReveal v-if="section === 'swordsmanship'" animation="reveal-fade-up" delay="stagger-1">
        <nav class="sword-context-bar" aria-label="Swordsmanship context navigation">
          <div class="sword-context-copy">
            <span class="sword-context-kicker">Sword Art Record</span>
            <span class="sword-context-label">{{ page?.category || 'Flying-Sword Art' }}</span>
          </div>
          <NuxtLink class="sword-context-return" to="/swordsmanship">
            Return to Swordsmanship
          </NuxtLink>
        </nav>
      </ScrollReveal>

      <ScrollReveal v-if="isTimelineDetail" animation="reveal-fade-up" delay="stagger-1">
        <nav class="timeline-context-bar" aria-label="Timeline context navigation">
          <div class="timeline-context-copy">
            <span class="timeline-context-kicker">Arc Record</span>
            <NuxtLink
              v-if="timelineDetailNavigation?.era"
              :to="timelineEraHref"
              class="timeline-era-link"
            >
              {{ timelineEraLabel }}
            </NuxtLink>
            <span v-else class="timeline-era-link is-static">{{ timelineEraLabel }}</span>
          </div>
          <NuxtLink class="timeline-return-link" :to="timelineEraHref">
            Return to Timeline
          </NuxtLink>
        </nav>
      </ScrollReveal>

      <ScrollReveal v-if="section === 'rankings'" animation="reveal-fade-up" delay="stagger-1">
        <RankingsRankingContextBar :page="page" />
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

      <ScrollReveal
        v-if="section === 'rankings' && page?.entries?.length"
        animation="reveal-fade-up"
        delay="stagger-2"
      >
        <div data-rankings-register="true">
          <RankingsRankingRegister
            :entries="page.entries"
            :category="page.category || 'Named-List'"
            :list-type="page.listType || page.subcategory || 'Ranking List'"
            :verification-status="page.verificationStatus"
          />
        </div>
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

          <template v-if="isTimelineDetail">
            <OrnamentalDivider motif="jade" />
            <ScrollReveal animation="reveal-fade-up">
              <nav class="timeline-reader-nav" aria-label="Timeline reader navigation">
                <NuxtLink
                  v-if="timelineDetailNavigation?.previous"
                  :to="timelineDetailNavigation.previous.path"
                  class="timeline-reader-card is-previous"
                >
                  <span class="timeline-reader-label">Previous Record</span>
                  <span class="timeline-reader-title">{{ timelineDetailNavigation.previous.title }}</span>
                  <span
                    v-if="timelineRecordMeta(timelineDetailNavigation.previous)"
                    class="timeline-reader-meta"
                  >
                    {{ timelineRecordMeta(timelineDetailNavigation.previous) }}
                  </span>
                </NuxtLink>

                <NuxtLink class="timeline-reader-return" :to="timelineEraHref">
                  Return to Timeline
                </NuxtLink>

                <NuxtLink
                  v-if="timelineDetailNavigation?.next"
                  :to="timelineDetailNavigation.next.path"
                  class="timeline-reader-card is-next"
                >
                  <span class="timeline-reader-label">Next Record</span>
                  <span class="timeline-reader-title">{{ timelineDetailNavigation.next.title }}</span>
                  <span
                    v-if="timelineRecordMeta(timelineDetailNavigation.next)"
                    class="timeline-reader-meta"
                  >
                    {{ timelineRecordMeta(timelineDetailNavigation.next) }}
                  </span>
                </NuxtLink>
              </nav>
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
  align-self: flex-start;
  position: sticky;
  top: calc(var(--header-height) + 1rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.infobox-sticky-frame {
  position: static;
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
  margin-bottom: 1.15rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.14);
}

.section-timeline .breadcrumb a:hover {
  color: #f0d27a;
}

.section-timeline .current {
  color: rgba(240, 210, 122, 0.86);
}

.section-timeline .timeline-context-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(212, 175, 55, 0.22);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(18, 15, 9, 0.82), rgba(7, 7, 7, 0.86)),
    radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.09), transparent 16rem);
  box-shadow: inset 0 1px 0 rgba(255, 244, 194, 0.06);
}

.section-timeline .timeline-context-copy {
  min-width: 0;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem 0.85rem;
}

.section-timeline .timeline-context-kicker,
.section-timeline .timeline-return-link,
.section-timeline .timeline-reader-label,
.section-timeline .timeline-reader-meta,
.section-timeline .timeline-reader-return {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  line-height: 1.35;
  text-transform: uppercase;
}

.section-timeline .timeline-context-kicker {
  color: rgba(212, 175, 55, 0.56);
}

.section-timeline .timeline-era-link,
.section-timeline .timeline-return-link,
.section-timeline .timeline-reader-card,
.section-timeline .timeline-reader-return {
  text-decoration: none;
  transition:
    border-color 0.24s ease,
    background-color 0.24s ease,
    color 0.24s ease,
    transform 0.24s ease,
    box-shadow 0.24s ease;
}

.section-timeline .timeline-era-link {
  min-width: 0;
  color: #fff4d6;
  border-bottom: 1px solid rgba(212, 175, 55, 0.28);
  font-family: var(--font-heading);
  font-size: 1.02rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.section-timeline .timeline-era-link:not(.is-static):hover,
.section-timeline .timeline-era-link:not(.is-static):focus-visible {
  color: #f0d27a;
  border-bottom-color: rgba(240, 210, 122, 0.72);
  outline: none;
}

.section-timeline .timeline-return-link,
.section-timeline .timeline-reader-return {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.45rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid rgba(212, 175, 55, 0.24);
  border-radius: 6px;
  color: rgba(240, 210, 122, 0.88);
  background: rgba(212, 175, 55, 0.06);
  white-space: nowrap;
}

.section-timeline .timeline-return-link:hover,
.section-timeline .timeline-return-link:focus-visible,
.section-timeline .timeline-reader-return:hover,
.section-timeline .timeline-reader-return:focus-visible {
  color: #fff8e4;
  border-color: rgba(240, 210, 122, 0.58);
  background: rgba(212, 175, 55, 0.12);
  box-shadow: 0 0 18px rgba(212, 175, 55, 0.1);
  outline: none;
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
  font-size: clamp(2.55rem, 6vw, 4rem);
  line-height: 1.05;
  letter-spacing: 0;
  overflow-wrap: anywhere;
  text-wrap: balance;
  color: #fff8e4;
  text-shadow: 0 0 28px rgba(212, 175, 55, 0.12);
}

.section-timeline :deep(.name-zh),
.section-timeline :deep(.name-pinyin) {
  color: rgba(212, 175, 55, 0.68);
}

.section-timeline :deep(.name-seal),
.section-timeline :deep(.seal-variant-outline),
.section-timeline :deep(.seal-stamp) {
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

.section-timeline .timeline-reader-nav {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 1rem;
  margin-top: clamp(1rem, 2vw, 1.5rem);
}

.section-timeline .timeline-reader-card,
.section-timeline .timeline-reader-return {
  min-width: 0;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  background:
    linear-gradient(145deg, rgba(18, 15, 9, 0.88), rgba(7, 7, 7, 0.9)),
    radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.1), transparent 14rem);
  box-shadow:
    inset 0 1px 0 rgba(255, 244, 194, 0.06),
    0 16px 36px rgba(0, 0, 0, 0.18);
}

.section-timeline .timeline-reader-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.45rem;
  min-height: 8rem;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.72);
}

.section-timeline .timeline-reader-card.is-previous {
  grid-column: 1;
}

.section-timeline .timeline-reader-card.is-next {
  grid-column: 3;
  text-align: right;
}

.section-timeline .timeline-reader-label {
  color: rgba(212, 175, 55, 0.66);
}

.section-timeline .timeline-reader-title {
  color: #fff4d6;
  font-family: var(--font-heading);
  font-size: clamp(1.1rem, 1.5vw, 1.35rem);
  line-height: 1.18;
  overflow-wrap: anywhere;
  text-wrap: pretty;
}

.section-timeline .timeline-reader-meta {
  color: rgba(255, 255, 255, 0.42);
}

.section-timeline .timeline-reader-card:hover,
.section-timeline .timeline-reader-card:focus-visible {
  color: #fff8e4;
  border-color: rgba(240, 210, 122, 0.6);
  box-shadow:
    inset 0 1px 0 rgba(255, 244, 194, 0.1),
    0 18px 42px rgba(0, 0, 0, 0.24),
    0 0 20px rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
  outline: none;
}

.section-timeline .timeline-reader-card:hover .timeline-reader-title,
.section-timeline .timeline-reader-card:focus-visible .timeline-reader-title {
  color: #f0d27a;
}

.section-timeline .timeline-reader-return {
  grid-column: 2;
  align-self: stretch;
  min-width: 10rem;
  padding-inline: 1rem;
  text-align: center;
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
    position: static;
  }

  .infobox-sticky-frame {
    position: static;
    max-height: none;
    overflow: visible;
  }

  .section-timeline .article-layout {
    gap: 2rem;
  }
}

@media (max-width: 760px) {
  .section-timeline .timeline-context-bar,
  .section-timeline .timeline-reader-nav {
    grid-template-columns: 1fr;
  }

  .section-timeline .timeline-context-bar {
    align-items: stretch;
    flex-direction: column;
    margin-bottom: 2rem;
  }

  .section-timeline .timeline-return-link,
  .section-timeline .timeline-reader-return {
    width: 100%;
    white-space: normal;
  }

  .section-timeline .timeline-reader-card,
  .section-timeline .timeline-reader-card.is-next {
    grid-column: auto;
    min-height: 0;
    text-align: left;
  }

  .section-timeline .timeline-reader-return {
    grid-column: auto;
  }
}

@media (max-width: 640px) {
  .section-timeline .mdc-content {
    padding-top: calc(var(--header-height) + 1.5rem);
  }

  .section-timeline :deep(.name-en) {
    font-size: clamp(2.05rem, 11vw, 3rem);
    line-height: 1.08;
  }

  .entry-lead {
    font-size: 1.04rem;
  }
  .entry-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }

  .section-timeline .article-layout {
    gap: 1.65rem;
  }

  .section-timeline .timeline-context-bar,
  .section-timeline .timeline-reader-card {
    padding: 0.85rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-timeline .timeline-era-link,
  .section-timeline .timeline-return-link,
  .section-timeline .timeline-reader-card,
  .section-timeline .timeline-reader-return {
    transition: none;
  }

  .section-timeline .timeline-reader-card:hover,
  .section-timeline .timeline-reader-card:focus-visible {
    transform: none;
  }
}

.entry-detail-shell.section-rankings {
  --rankings-accent: #8a7448;
  --rankings-paper: #f6ecd8;
  --rankings-ink: #332c22;
  --rankings-mist: #e8dfcc;
  --rankings-frame: rgba(149, 113, 58, 0.32);
  --rankings-seal: #aa352d;
  --rankings-gold: #b29555;
  --rankings-title-ink: #2c251b;
  min-height: 100dvh;
  background:
    radial-gradient(circle at 16% 6%, rgba(178, 149, 85, 0.1), transparent 26rem),
    radial-gradient(circle at 88% 16%, rgba(170, 53, 45, 0.055), transparent 24rem),
    linear-gradient(180deg, color-mix(in srgb, var(--rankings-paper) 56%, var(--c-paper)), var(--c-paper) 46%);
}

.section-rankings .breadcrumb {
  margin-bottom: 1.15rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--rankings-frame) 54%, transparent);
}

.section-rankings .breadcrumb a:hover {
  color: var(--rankings-seal);
}

.section-rankings .current {
  color: var(--rankings-title-ink);
}

.section-rankings .entry-header {
  border-bottom-color: color-mix(in srgb, var(--rankings-frame) 72%, transparent);
}

.section-rankings .entry-header::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: min(11rem, 40vw);
  height: 2px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--rankings-gold) 78%, transparent), transparent);
}

.section-rankings .entry-badge {
  color: var(--rankings-seal);
  border-color: color-mix(in srgb, var(--rankings-seal) 36%, transparent);
  background: color-mix(in srgb, var(--rankings-seal) 6%, transparent);
}

.section-rankings .entry-chip {
  color: color-mix(in srgb, var(--rankings-ink) 74%, transparent);
  border-color: color-mix(in srgb, var(--rankings-frame) 54%, transparent);
  background: color-mix(in srgb, var(--rankings-paper) 56%, transparent);
}

.section-rankings :where(a, button):focus-visible,
.section-rankings :deep(a:focus-visible),
.section-rankings :deep(button:focus-visible) {
  outline: 2px solid var(--rankings-seal);
  outline-offset: 3px;
}

.section-rankings :deep(.mdc-prose table) {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 1.5rem 0 2.5rem;
  overflow-x: auto;
  border: 1px solid color-mix(in srgb, var(--rankings-frame) 70%, transparent);
  border-collapse: collapse;
  background: color-mix(in srgb, var(--rankings-paper) 72%, white);
}

.section-rankings :deep(.mdc-prose thead),
.section-rankings :deep(.mdc-prose tbody) {
  display: table;
  width: 100%;
  min-width: 44rem;
  border-collapse: collapse;
}

.section-rankings :deep(.mdc-prose th) {
  padding: 0.72rem 0.82rem;
  color: color-mix(in srgb, var(--rankings-accent) 84%, var(--rankings-ink));
  border: 1px solid color-mix(in srgb, var(--rankings-frame) 62%, transparent);
  background: color-mix(in srgb, var(--rankings-mist) 72%, white);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  line-height: 1.2;
  text-align: left;
  text-transform: uppercase;
}

.section-rankings :deep(.mdc-prose td) {
  padding: 0.78rem 0.82rem;
  color: color-mix(in srgb, var(--rankings-ink) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--rankings-frame) 46%, transparent);
  font-size: 0.98rem;
  line-height: 1.55;
  vertical-align: top;
}

.section-rankings :deep(.mdc-prose tbody tr:nth-child(even) td) {
  background: color-mix(in srgb, var(--rankings-paper) 54%, transparent);
}

.section-rankings :deep(.mdc-prose td:first-child) {
  width: 7.5rem;
  color: var(--rankings-seal);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.entry-detail-shell.section-rankings :deep(.entry-infobox) {
  border-color: color-mix(in srgb, var(--rankings-frame) 74%, transparent);
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--rankings-paper) 78%, white), color-mix(in srgb, var(--rankings-mist) 58%, white)),
    url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-blend-mode: normal, multiply;
}

.entry-detail-shell.section-rankings :deep(.ranking-item) {
  border: 1px solid color-mix(in srgb, var(--rankings-frame) 58%, transparent);
  border-left-width: 1px;
  background: color-mix(in srgb, var(--rankings-paper) 64%, transparent);
}

.section-rankings :deep(.ranking-rank) {
  color: var(--rankings-seal);
}

.section-rankings :deep(.ranking-note) {
  color: color-mix(in srgb, var(--rankings-ink) 62%, transparent);
}

/* Suppress Markdown ## The List table when data-driven RankingRegister is rendered.
   Use ~ (general sibling) not + (adjacent) because a paragraph precedes the table
   in the rendered Markdown. */
.section-rankings:has([data-rankings-register="true"]) :deep(.mdc-prose h2[id="the-list"]),
.section-rankings:has([data-rankings-register="true"]) :deep(.mdc-prose h2[id="the-list-1"]),
.section-rankings:has([data-rankings-register="true"]) :deep(.mdc-prose h2[id="the-list-2"]) {
  display: none;
}

.section-rankings:has([data-rankings-register="true"]) :deep(.mdc-prose h2[id="the-list"] ~ table),
.section-rankings:has([data-rankings-register="true"]) :deep(.mdc-prose h2[id="the-list-1"] ~ table),
.section-rankings:has([data-rankings-register="true"]) :deep(.mdc-prose h2[id="the-list-2"] ~ table) {
  display: none;
}

@media (max-width: 640px) {
  .section-rankings .mdc-content {
    padding-top: calc(var(--header-height) + 1.5rem);
  }

  .section-rankings :deep(.name-en) {
    font-size: clamp(2rem, 10vw, 2.9rem);
    line-height: 1.08;
  }

  .section-rankings :deep(.mdc-prose table) {
    font-size: 0.92rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-rankings .entry-header::after {
    box-shadow: none;
  }
}

/* Swordsmanship / Blade Path — dark steel-blue dossier theme.
   Mirrors the timeline pattern: remap shared --c-* tokens onto a
   nighttime palette, then deep-override child components so the
   infobox, TOC, prose, and relationship surfaces all read as one
   manual slip rather than a bright card pasted on a dark page. */

.entry-detail-shell.section-swordsmanship {
  --sword-jade: #7ab4a4;
  --sword-jade-bright: #9dd0c0;
  --sword-cinnabar: #d85a52;
  --sword-steel: #4a7284;
  --c-paper: #080f16;
  --c-bg: #080f16;
  --c-bg-soft: #0e1e2a;
  --c-bg-alt: #132a38;
  --c-ink: #c8dce6;
  --c-charcoal: #dce8ef;
  --c-ink-wash: #9ab8c8;
  --c-text-1: #c8dce6;
  --c-text-2: #9ab8c8;
  --c-text-3: #8fb3c4;
  --c-border: rgba(74, 114, 132, 0.28);
  --c-divider: rgba(74, 114, 132, 0.18);
  --c-seal-red: #7ab4a4;
  --c-seal-red-soft: rgba(122, 180, 164, 0.14);
  min-height: 100dvh;
  color: var(--c-text-1);
  background:
    radial-gradient(circle at 15% 8%, rgba(122, 180, 164, 0.07), transparent 24rem),
    radial-gradient(circle at 88% 22%, rgba(204, 82, 72, 0.04), transparent 22rem),
    linear-gradient(180deg, #060a10, #080f16 42%, #060a10);
}

.section-swordsmanship .mdc-content {
  padding-top: calc(var(--header-height) + clamp(2rem, 4vw, 3.5rem));
  padding-bottom: clamp(4rem, 7vw, 6rem);
}

.section-swordsmanship .breadcrumb {
  margin-bottom: 1.15rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(74, 114, 132, 0.16);
}

.section-swordsmanship .breadcrumb a:hover {
  color: var(--sword-jade);
}

.section-swordsmanship .sword-context-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(74, 114, 132, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(14, 30, 42, 0.82), rgba(8, 15, 22, 0.86)),
    radial-gradient(circle at 0% 0%, rgba(122, 180, 164, 0.08), transparent 16rem);
  box-shadow: inset 0 1px 0 rgba(200, 220, 230, 0.05);
}

.section-swordsmanship .sword-context-copy {
  min-width: 0;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem 0.85rem;
}

.section-swordsmanship .sword-context-kicker {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  line-height: 1.35;
  text-transform: uppercase;
  color: rgba(122, 180, 164, 0.56);
}

.section-swordsmanship .sword-context-label {
  min-width: 0;
  color: var(--sword-jade-bright);
  font-family: var(--font-heading);
  font-size: 1.02rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.section-swordsmanship .sword-context-return {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.45rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid rgba(74, 114, 132, 0.26);
  border-radius: 6px;
  color: rgba(157, 208, 192, 0.88);
  background: rgba(122, 180, 164, 0.06);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  line-height: 1.35;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  transition:
    border-color 0.24s ease,
    background-color 0.24s ease,
    color 0.24s ease,
    box-shadow 0.24s ease;
}

.section-swordsmanship .sword-context-return:hover,
.section-swordsmanship .sword-context-return:focus-visible {
  color: #dce8ef;
  border-color: rgba(122, 180, 164, 0.58);
  background: rgba(122, 180, 164, 0.12);
  box-shadow: 0 0 18px rgba(122, 180, 164, 0.1);
  outline: none;
}

.section-swordsmanship :where(a, button):focus-visible,
.section-swordsmanship :deep(a:focus-visible),
.section-swordsmanship :deep(button:focus-visible) {
  outline: 2px solid var(--sword-jade);
  outline-offset: 3px;
}

.section-swordsmanship .current {
  color: #dce8ef;
}

.section-swordsmanship .entry-header {
  margin-bottom: clamp(2.25rem, 4vw, 3.75rem);
  border-bottom-color: rgba(74, 114, 132, 0.24);
}

.section-swordsmanship .entry-header::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: min(11rem, 40vw);
  height: 2px;
  background: linear-gradient(90deg, rgba(122, 180, 164, 0.7), transparent);
  box-shadow: 0 0 16px rgba(122, 180, 164, 0.18);
}

.section-swordsmanship .entry-lead {
  color: var(--c-text-2);
}

.section-swordsmanship .entry-badge {
  color: var(--sword-cinnabar);
  border-color: var(--sword-cinnabar);
  background: rgba(216, 90, 82, 0.1);
}

.section-swordsmanship .entry-chip {
  color: var(--c-text-2);
  border-color: rgba(74, 114, 132, 0.26);
  background: rgba(14, 30, 42, 0.6);
}

.section-swordsmanship .entry-chip.is-importance {
  color: #c8dce6;
}

.section-swordsmanship :deep(.name-en) {
  color: #dce8ef;
  text-shadow: 0 0 24px rgba(122, 180, 164, 0.12);
}

.section-swordsmanship :deep(.name-zh),
.section-swordsmanship :deep(.name-pinyin) {
  color: #9ab8c8;
}

.section-swordsmanship :deep(.name-seal),
.section-swordsmanship :deep(.seal-variant-outline),
.section-swordsmanship :deep(.seal-stamp) {
  color: var(--sword-cinnabar);
  border-color: var(--sword-cinnabar);
  background: rgba(216, 90, 82, 0.08);
  box-shadow: 0 0 14px rgba(216, 90, 82, 0.12);
}

.section-swordsmanship :deep(.entry-section-nav) {
  border-block-color: rgba(74, 114, 132, 0.2);
}

.section-swordsmanship :deep(.contents-label) {
  color: var(--c-text-3);
}

.section-swordsmanship :deep(.contents-link) {
  color: var(--c-text-2);
  border-color: rgba(74, 114, 132, 0.24);
  background: rgba(14, 30, 42, 0.7);
}

.section-swordsmanship :deep(.contents-link:hover) {
  color: var(--sword-jade);
  border-color: rgba(122, 180, 164, 0.5);
  background: rgba(122, 180, 164, 0.08);
}

.section-swordsmanship :deep(.entry-section-nav)::after {
  background: linear-gradient(to right, transparent, #080f16);
}

.section-swordsmanship :deep(.mdc-prose) {
  color: var(--c-text-2);
}

.section-swordsmanship :deep(.mdc-prose h2),
.section-swordsmanship :deep(.mdc-prose h3),
.section-swordsmanship :deep(.mdc-prose h4) {
  color: #dce8ef;
}

.section-swordsmanship :deep(.mdc-prose h2) {
  border-bottom-color: rgba(74, 114, 132, 0.22);
}

.section-swordsmanship :deep(.mdc-prose h2::after) {
  background: linear-gradient(90deg, var(--sword-jade), transparent);
}

.section-swordsmanship :deep(.mdc-prose a) {
  color: var(--sword-jade);
  border-bottom-color: rgba(122, 180, 164, 0.32);
}

.section-swordsmanship :deep(.mdc-prose a:hover) {
  color: var(--sword-jade-bright);
  border-bottom-color: rgba(157, 208, 192, 0.6);
}

.section-swordsmanship :deep(.mdc-prose blockquote) {
  border-left-color: rgba(122, 180, 164, 0.65);
  background: linear-gradient(to right, rgba(122, 180, 164, 0.07), transparent);
  color: var(--c-text-1);
}

.section-swordsmanship :deep(.mdc-prose li::before) {
  color: rgba(122, 180, 164, 0.52);
}

.section-swordsmanship :deep(.mdc-prose hr) {
  background: rgba(74, 114, 132, 0.22);
}

.section-swordsmanship :deep(.mdc-prose hr::after) {
  background: #080f16;
  color: rgba(122, 180, 164, 0.42);
}

.section-swordsmanship :deep(.mdc-prose code) {
  background: rgba(14, 30, 42, 0.7);
  color: var(--c-text-1);
  border: 1px solid rgba(74, 114, 132, 0.22);
  border-radius: 3px;
  padding: 0.1em 0.35em;
}

.section-swordsmanship :deep(.mdc-prose pre) {
  background: rgba(8, 18, 26, 0.85);
  border: 1px solid rgba(74, 114, 132, 0.2);
  border-radius: 4px;
  color: var(--c-text-1);
}

.section-swordsmanship :deep(.mdc-prose pre code) {
  background: transparent;
  border: 0;
  padding: 0;
}

.section-swordsmanship :deep(.mdc-prose table) {
  border-color: rgba(74, 114, 132, 0.22);
}

.section-swordsmanship :deep(.mdc-prose th) {
  background: rgba(14, 30, 42, 0.55);
  color: var(--c-text-1);
  border-color: rgba(74, 114, 132, 0.2);
}

.section-swordsmanship :deep(.mdc-prose td) {
  border-color: rgba(74, 114, 132, 0.16);
}

.section-swordsmanship :deep(.entry-infobox) {
  border-color: rgba(74, 114, 132, 0.28);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(19, 42, 56, 0.92), rgba(14, 30, 42, 0.94)),
    url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-blend-mode: normal, screen;
  box-shadow:
    inset 0 1px 0 rgba(200, 220, 230, 0.06),
    0 18px 45px rgba(0, 0, 0, 0.32);
}

.section-swordsmanship :deep(.infobox-heading) {
  border-bottom-color: rgba(74, 114, 132, 0.22);
}

.section-swordsmanship :deep(.infobox-heading h2) {
  color: #dce8ef;
}

.section-swordsmanship :deep(.infobox-image-wrapper) {
  border-bottom-color: rgba(74, 114, 132, 0.2);
  background: rgba(8, 15, 22, 0.6);
}

.section-swordsmanship :deep(.image-overlay) {
  border-color: rgba(74, 114, 132, 0.22);
}

.section-swordsmanship :deep(.infobox-row) {
  border-bottom-color: rgba(74, 114, 132, 0.14);
}

.section-swordsmanship :deep(.row-label),
.section-swordsmanship :deep(.footer-label),
.section-swordsmanship :deep(.eyebrow) {
  color: #7ab4a4;
}

.section-swordsmanship :deep(.row-value) {
  color: #dce8ef;
}

.section-swordsmanship :deep(.public-badge) {
  color: var(--sword-cinnabar);
  border-color: var(--sword-cinnabar);
  background: rgba(216, 90, 82, 0.1);
}

.section-swordsmanship :deep(.public-chip) {
  color: var(--c-text-1);
  border-color: rgba(74, 114, 132, 0.26);
  background: rgba(19, 42, 56, 0.55);
}

.section-swordsmanship :deep(.verification-badge) {
  color: var(--sword-cinnabar);
  border-color: var(--sword-cinnabar);
  background: rgba(216, 90, 82, 0.08);
}

.section-swordsmanship :deep(.route-display-link) {
  color: #c8dce6;
}

.section-swordsmanship :deep(.route-display-link:hover) {
  color: var(--sword-jade);
}

.section-swordsmanship :deep(.route-display-link.is-chip) {
  border-color: rgba(74, 114, 132, 0.24);
  background: rgba(14, 30, 42, 0.55);
}

.entry-detail-shell.section-swordsmanship :deep(.relationship-item),
.entry-detail-shell.section-swordsmanship :deep(.ranking-item) {
  border: 1px solid rgba(74, 114, 132, 0.24);
  background: rgba(19, 42, 56, 0.4);
  padding: 0.5rem 0.6rem;
}

.section-swordsmanship :deep(.relationship-name),
.section-swordsmanship :deep(.ranking-name) {
  color: #dce8ef;
}

.section-swordsmanship :deep(.relationship-relation),
.section-swordsmanship :deep(.ranking-note) {
  color: var(--c-text-3);
}

.section-swordsmanship :deep(.ranking-rank) {
  color: var(--sword-jade);
}

.section-swordsmanship :deep(.infobox-placeholder) {
  background:
    radial-gradient(circle at 50% 38%, rgba(122, 180, 164, 0.12), transparent 62%),
    url('/images/textures/ink-wash-01.webp');
  background-size: cover;
}

.section-swordsmanship :deep(.placeholder-char) {
  color: #7ab4a4;
  border-color: rgba(122, 180, 164, 0.42);
  background: rgba(8, 15, 22, 0.5);
}

.section-swordsmanship :deep(.infobox-footer) {
  border-top-color: rgba(74, 114, 132, 0.2);
}

.section-swordsmanship :deep(.footer-value) {
  color: var(--c-text-2);
}

.entry-detail-shell.section-swordsmanship :deep(.relationship-card) {
  border: 1px solid rgba(74, 114, 132, 0.28);
  border-radius: 6px;
  background:
    linear-gradient(180deg, rgba(19, 42, 56, 0.65), rgba(14, 30, 42, 0.85)),
    url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-blend-mode: normal, screen;
  box-shadow:
    inset 0 1px 0 rgba(200, 220, 230, 0.05),
    0 12px 30px rgba(0, 0, 0, 0.22);
}

.entry-detail-shell.section-swordsmanship :deep(.relationship-card)::after {
  background: linear-gradient(180deg, rgba(122, 180, 164, 0.05), transparent 60%);
  opacity: 1;
}

.section-swordsmanship :deep(.relationship-card .relationship-name) {
  color: #dce8ef;
}

.section-swordsmanship :deep(.relationship-label) {
  color: var(--c-text-3);
}

.section-swordsmanship :deep(.panel-heading h2) {
  color: #dce8ef;
}

.section-swordsmanship :deep(.expand-button) {
  border-color: rgba(74, 114, 132, 0.28);
  color: var(--c-text-2);
  background: rgba(14, 30, 42, 0.45);
}

.section-swordsmanship :deep(.expand-button:hover) {
  color: var(--sword-jade);
  border-color: rgba(122, 180, 164, 0.45);
  background: rgba(122, 180, 164, 0.08);
}

.section-swordsmanship :deep(.entry-reference-block) {
  border-color: rgba(74, 114, 132, 0.26);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(19, 42, 56, 0.88), rgba(14, 30, 42, 0.9)),
    url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  background-blend-mode: normal, screen;
  box-shadow:
    inset 0 1px 0 rgba(200, 220, 230, 0.05),
    0 16px 38px rgba(0, 0, 0, 0.28);
}

.section-swordsmanship :deep(.reference-heading h2) {
  color: #dce8ef;
}

.section-swordsmanship :deep(.source-notes) {
  color: var(--c-text-2);
}

.section-swordsmanship :deep(.source-fact dt) {
  color: #7ab4a4;
}

.section-swordsmanship :deep(.source-fact dd) {
  color: #dce8ef;
}

.section-swordsmanship :deep(.reference-cta) {
  color: var(--c-text-2);
  border-top-color: rgba(74, 114, 132, 0.2);
}

.section-swordsmanship :deep(.contribute-link) {
  color: var(--sword-jade);
}

.section-swordsmanship :deep(.contribute-link:hover) {
  color: var(--sword-jade-bright);
}

.section-swordsmanship :deep(.related-card-groups .related-entry-card),
.section-swordsmanship :deep(.related-card-groups article) {
  border-color: rgba(74, 114, 132, 0.24);
  background:
    linear-gradient(180deg, rgba(19, 42, 56, 0.55), rgba(14, 30, 42, 0.75));
  color: var(--c-text-2);
}

.section-swordsmanship :deep(.related-card-groups a) {
  color: #c8dce6;
}

.section-swordsmanship :deep(.related-card-groups a:hover) {
  color: var(--sword-jade);
}

.section-swordsmanship .infobox-sticky-frame {
  scrollbar-color: rgba(122, 180, 164, 0.32) transparent;
}

.section-swordsmanship .infobox-sticky-frame::-webkit-scrollbar-thumb {
  background: rgba(122, 180, 164, 0.32);
}

@media (max-width: 1024px) {
  .section-swordsmanship .article-layout {
    gap: 2rem;
  }
}

@media (max-width: 640px) {
  .section-swordsmanship .mdc-content {
    padding-top: calc(var(--header-height) + 1.5rem);
  }

  .section-swordsmanship :deep(.name-en) {
    font-size: clamp(2.05rem, 11vw, 3rem);
    line-height: 1.08;
  }

  .section-swordsmanship .article-layout {
    gap: 1.65rem;
  }

  .section-swordsmanship .sword-context-bar {
    align-items: stretch;
    flex-direction: column;
    gap: 0.65rem;
    margin-bottom: 2rem;
    padding: 0.85rem;
  }

  .section-swordsmanship .sword-context-return {
    width: 100%;
    white-space: normal;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-swordsmanship .entry-header::after {
    box-shadow: none;
  }

  .section-swordsmanship :deep(.name-en) {
    text-shadow: none;
  }

  .section-swordsmanship :deep(.name-seal),
  .section-swordsmanship :deep(.seal-variant-outline),
  .section-swordsmanship :deep(.seal-stamp) {
    box-shadow: none;
  }

  .section-swordsmanship .sword-context-return {
    transition: none;
  }
}
</style>
