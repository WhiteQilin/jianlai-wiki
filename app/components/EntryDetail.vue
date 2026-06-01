<script setup lang="ts">
/**
 * EntryDetail — shared detail-page layout for all NON-character wiki entries.
 *
 * The character page (characters/[...slug].vue) is intentionally NOT routed
 * through this component; it keeps its bespoke rich layout. This component
 * gives every other section a premium, consistent article shell:
 *   banner -> breadcrumb -> NameBlock header -> lead -> [meta sidebar + prose]
 *   -> OrnamentalDivider -> RelatedEntries -> verification notice.
 *
 * Markdown is rendered with the existing `mdc-prose` class so it inherits the
 * project's styled typography (no default blue underlined headings).
 */
import type { RelatedGroup } from '~/composables/useRelatedEntries'

const props = defineProps<{
  page: any
  section: string
  sectionTitle: string
  relatedGroups?: RelatedGroup[]
}>()

const groups = computed<RelatedGroup[]>(() => props.relatedGroups ?? [])

const hasMeta = computed(() => {
  const p = props.page
  if (!p) return false
  return Boolean(
    p.image || p.category || p.status || p.importance || p.verificationStatus || (p.tags?.length),
  )
})

const verificationText = computed(() => {
  const p = props.page
  if (p?.sourceNotes) return p.sourceNotes
  return 'This entry is currently being cross-referenced with the original text. Details may be subject to change.'
})

const showVerificationNotice = computed(() => {
  const p = props.page
  return Boolean(p?.sourceNotes || p?.verificationStatus || p?.status)
})
</script>

<template>
  <div class="article-page">
    <MediaBanner
      v-if="page?.banner"
      :image="page.banner"
      :alt="page?.title"
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
        <NameBlock
          :nameEn="page?.title || 'Unknown'"
          :nameZh="page?.chinese || ''"
          :pinyin="page?.pinyin"
          :seal="page?.seal"
        />
        <p v-if="page?.description" class="entry-lead">{{ page.description }}</p>
      </ScrollReveal>

      <div class="article-layout" :class="{ 'no-sidebar': !hasMeta }">
        <aside v-if="hasMeta" class="article-sidebar">
          <ScrollReveal animation="reveal-fade-up" delay="stagger-2">
            <EntryMetaPanel
              :image="page?.image"
              :alt="page?.title"
              :category="page?.category"
              :status="page?.status"
              :importance="page?.importance"
              :verification-status="page?.verificationStatus"
              :tags="page?.tags"
            />
          </ScrollReveal>
        </aside>

        <div class="article-main">
          <ScrollReveal animation="reveal-fade-up" delay="stagger-2">
            <ContentRenderer v-if="page" :value="page" class="mdc-prose entry-prose" />
          </ScrollReveal>

          <template v-if="groups.length">
            <OrnamentalDivider motif="jade" />
            <ScrollReveal animation="reveal-fade-up">
              <RelatedEntries :groups="groups" />
            </ScrollReveal>
          </template>

          <template v-if="showVerificationNotice">
            <OrnamentalDivider motif="diamond" />
            <ScrollReveal animation="reveal-fade-up">
              <WikiNotice type="verification">
                <p><strong>Source Verification:</strong> {{ verificationText }}</p>
              </WikiNotice>
            </ScrollReveal>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entry-lead {
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

/* Constrain prose to a comfortable reading measure */
.entry-prose {
  max-width: 75ch;
}

.article-sidebar {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.article-sidebar > :deep(*) {
  position: sticky;
  top: calc(var(--header-height) + 2rem);
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
    gap: 2.5rem;
  }
  .article-sidebar {
    width: 100%;
  }
  .article-sidebar > :deep(*) {
    position: static;
  }
}
</style>
