<script setup lang="ts">
import { ref, computed } from 'vue'
import { timelineArcAnchorId } from '~/utils/timelineAnchors'

const activeCategory = ref('All')

const meta = useSectionMeta('timeline')

const { data: items } = await useAsyncData('timeline-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/timeline/%')
    .order('eraOrder', 'ASC')
    .all()
})

const filteredItems = computed(() =>
  (items.value ?? []).filter((i) => matchesCategory((i as any).category, activeCategory.value)),
)

useSeoMeta({
  title: meta.title,
  description: meta.description,
  ogTitle: meta.title,
  ogDescription: meta.description,
})

definePageMeta({
  pageTransition: {
    name: 'timeline-transition',
    mode: 'out-in'
  }
})
// Group entries by era to form Macro (era/arc) and Micro (events) structure
const eraGroups = computed(() => {
  const groups = new Map<string, any[]>()
  
  // Create an array sorted by eraOrder to preserve chronological order
  const sortedItems = [...(filteredItems.value || [])].sort((a: any, b: any) => {
    return (a.eraOrder || 0) - (b.eraOrder || 0)
  })
  
  sortedItems.forEach((item: any) => {
    const eraName = item.era || item.category || 'Unknown Era'
    if (!groups.has(eraName)) {
      groups.set(eraName, [])
    }
    groups.get(eraName)!.push({
      title: item.title || 'Unknown Event',
      chinese: item.chinese || '',
      era: eraName,
      summary: item.description || 'Event details pending.',
      characters: item.participants || item.related || [],
      link: item.path,
      image: item.image,
      category: item.category,
      status: item.status,
      eraOrder: item.eraOrder
    })
  })

  // Create macro nodes mapping from the groups
  return Array.from(groups.entries()).map(([era, events]) => {
    // Determine the macro entry for this era. Prefer 'Arc' or 'Era' category, otherwise use the first chronologically.
    const macroEntry = events.find(e => e.category === 'Arc' || e.category === 'Era') || events[0]
    
    // Filter out the macro entry itself from the micro-events ledger
    const microEvents = events.filter(e => e.link !== macroEntry.link && e.category !== 'Arc' && e.category !== 'Era')
    
    return {
      era,
      title: macroEntry.title,
      chinese: macroEntry.chinese,
      summary: macroEntry.summary,
      link: macroEntry.link,
      characters: macroEntry.characters,
      category: macroEntry.category,
      status: macroEntry.status,
      image: macroEntry.image,
      eraOrder: macroEntry.eraOrder,
      events: microEvents // only the actual micro-events
    }
  })
})

function archiveOrder(index: number) {
  return String(index + 1).padStart(2, '0')
}

function recordCountLabel(count: number) {
  return `${count} ${count === 1 ? 'record' : 'records'}`
}

const timelineRouteLinks = computed(() => {
  const seen = new Set<string>()

  return (items.value ?? [])
    .map((item: any) => ({
      path: item.path,
      title: item.title || item.path,
    }))
    .filter((item) => {
      if (!item.path || seen.has(item.path)) return false
      seen.add(item.path)
      return true
    })
})
</script>

<template>
  <div class="timeline-page">
    <TimelineCinematicHero
      titleEn="Chronicle"
      titleZh="年表"
      desc="The chronological history of Jian Lai, from the ancient era to the present day. Witness the unfolding of the Great Dao."
    >
      <TimelineChronicleRail v-if="eraGroups.length > 0" :eraGroups="eraGroups" />
      <!-- Static prerender route seeds: macro arc links and single-event era links can be hidden behind client interaction, so keep every timeline detail route discoverable during `nuxt generate`. -->
      <nav v-if="timelineRouteLinks.length" class="timeline-prerender-links" aria-hidden="true">
        <NuxtLink
          v-for="link in timelineRouteLinks"
          :key="link.path"
          :to="link.path"
          tabindex="-1"
        >
          {{ link.title }}
        </NuxtLink>
      </nav>
      <div v-else class="empty-timeline-hero">
        <p class="empty-hero-text">Chronicle awaiting inscription</p>
      </div>
    </TimelineCinematicHero>

    <div class="timeline-archive-section">
      <div class="page-container">
        <div class="mdc-content">
          <ScrollReveal animation="reveal-fade-up">
            <CategoryTabs
              :categories="meta.categories"
              v-model:active="activeCategory"
              style="justify-content: center; margin-bottom: 4rem;"
            />
          </ScrollReveal>

          <template v-if="eraGroups.length > 0">
            <div
              v-for="(group, groupIndex) in eraGroups"
              :id="timelineArcAnchorId(group.era)"
              :key="group.era"
              class="era-archive-group"
            >
              <ScrollReveal animation="reveal-fade-up">
                <div class="era-group-header">
                  <div class="era-title-block">
                    <span class="era-group-index">Archive {{ archiveOrder(groupIndex) }}</span>
                    <h2 class="era-group-title">{{ group.era }}</h2>
                  </div>
                  <div class="era-group-divider"></div>
                  <span class="era-group-count">{{ recordCountLabel(group.events.length) }}</span>
                </div>
              </ScrollReveal>

              <div class="era-archive-layout">
                <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
                  <NuxtLink :to="group.link" class="era-parent-card">
                    <div class="parent-card-rule" aria-hidden="true"></div>
                    <div class="parent-card-copy">
                      <div class="parent-card-meta">
                        <span>{{ group.category || 'Arc' }}</span>
                        <span v-if="group.eraOrder">Order {{ group.eraOrder }}</span>
                      </div>
                      <h3>{{ group.title }}</h3>
                      <p v-if="group.chinese" class="parent-card-chinese">{{ group.chinese }}</p>
                      <p class="parent-card-summary">{{ group.summary }}</p>
                    </div>
                    <div class="parent-card-stat">
                      <span class="stat-value">{{ group.events.length }}</span>
                      <span class="stat-label">records</span>
                    </div>
                  </NuxtLink>
                </ScrollReveal>

                <DossierGrid v-if="group.events.length" class="timeline-event-grid">
                  <ScrollReveal
                    v-for="(item, index) in group.events"
                    :key="item.link"
                    class="timeline-event-card-frame"
                    animation="reveal-fade-up"
                    :delay="(`stagger-${(index % 5) + 1}` as any)"
                  >
                    <DossierCard
                      :link="item.link"
                      :nameEn="item.title"
                      :nameZh="item.chinese"
                      :desc="item.summary"
                      :category="item.category || 'Event'"
                      :status="item.status || 'To be verified'"
                      :image="item.image"
                    />
                  </ScrollReveal>
                </DossierGrid>
              </div>
            </div>
          </template>

          <ScrollReveal v-else animation="reveal-fade-up">
            <EmptyArchiveState
              variant="dark-chronicle"
              title="Chronicle Awaiting Inscription"
              text="The timeline records for this era are currently being compiled and verified by the scribes."
            />
          </ScrollReveal>
          
          <div class="timeline-end-mark" aria-hidden="true">
            <span class="end-mark-line"></span>
            <span class="end-mark-dot"></span>
            <span class="end-mark-line"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-page {
  background-color: #050505;
  color: #fff;
  min-height: 100vh;
}

/* Override MDC-content for the dark timeline page */
:deep(.mdc-content) {
  --c-bg: #050505;
  --c-text-1: #ffffff;
  --c-text-2: rgba(255, 255, 255, 0.8);
  --c-text-3: rgba(255, 255, 255, 0.6);
  --c-border: rgba(255, 255, 255, 0.1);
  --c-bg-elevated: #111111;
  --c-bg-soft: rgba(255, 255, 255, 0.05);
}

:deep(.category-tabs) {
  background-color: transparent;
  border-color: rgba(212, 175, 55, 0.2);
}

:deep(.category-tabs .tab-label) {
  color: rgba(212, 175, 55, 0.6);
}

:deep(.category-tabs .tab-btn) {
  background: rgba(20, 20, 20, 0.8);
  border-color: rgba(212, 175, 55, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

:deep(.category-tabs .tab-btn:hover) {
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.5);
  color: #fff;
}

:deep(.category-tabs .tab-btn.active) {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  color: #d4af37;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
}

:deep(.dossier-card) {
  background:
    linear-gradient(180deg, rgba(15, 13, 9, 0.92), rgba(7, 7, 7, 0.92)),
    url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-blend-mode: normal, screen;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(212, 175, 55, 0.16);
  border-radius: 8px;
  box-shadow: inset 0 1px 0 rgba(255, 244, 194, 0.04);
  transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
}

:deep(.dossier-card:hover) {
  border-color: var(--c-gold, #d4af37);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.5), 0 0 22px rgba(212, 175, 55, 0.1);
  transform: translateY(-4px);
}

:deep(.dossier-card .card-name-zh),
:deep(.dossier-card .card-name-en) {
  color: #fff;
}

:deep(.dossier-card .card-desc) {
  color: rgba(255, 255, 255, 0.7);
}

:deep(.dossier-card .card-image-wrap),
:deep(.dossier-card .card-image-placeholder) {
  height: 160px;
  border-bottom-color: rgba(212, 175, 55, 0.14);
}

:deep(.dossier-card .card-content) {
  padding: 1.15rem;
}

:deep(.dossier-card .card-meta) {
  align-items: flex-start;
  gap: 0.8rem;
}

:deep(.dossier-card .category) {
  color: rgba(212, 175, 55, 0.68);
}

:deep(.dossier-card .status) {
  color: rgba(255, 234, 169, 0.78);
  border-color: rgba(212, 175, 55, 0.24);
  background: rgba(212, 175, 55, 0.06);
}

:deep(.dossier-card .card-name) {
  font-size: 1.18rem;
  line-height: 1.2;
}

:deep(.dossier-card:hover .card-name) {
  color: #f0d27a;
}

:deep(.dossier-card .zh-name) {
  color: rgba(212, 175, 55, 0.62);
  font-size: 0.95rem;
}

.timeline-prerender-links {
  display: none;
}

.empty-timeline-hero {
  text-align: center;
  padding: 4rem 0;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  margin-top: 2rem;
}

.empty-hero-text {
  color: rgba(212, 175, 55, 0.6);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.85rem;
}

.timeline-archive-section {
  padding-top: clamp(3rem, 6vw, 5rem);
  padding-bottom: 1rem;
  background-color: #050505;
  background-image:
    radial-gradient(circle at 18% 0%, rgba(212, 175, 55, 0.08), transparent 25rem),
    linear-gradient(to bottom, rgba(5, 5, 5, 0.2), rgba(10, 10, 10, 0.88) 100%),
    url('/images/textures/ink-wash-01.webp'); /* Faint texture for body */
  background-size: 100% 100%, 100% 100%, cover;
  background-position: center, center, center;
  background-blend-mode: normal, normal, multiply;
  position: relative;
}

.timeline-archive-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
}

.era-archive-group {
  position: relative;
  margin-bottom: clamp(4.5rem, 8vw, 7rem);
  scroll-margin-top: calc(var(--header-height) + 1.5rem);
}

.era-archive-group::before {
  content: '';
  position: absolute;
  top: 4.25rem;
  bottom: -2.5rem;
  left: 0.38rem;
  width: 1px;
  background: linear-gradient(to bottom, rgba(212, 175, 55, 0.38), rgba(212, 175, 55, 0.08), transparent);
  pointer-events: none;
}

.era-group-header {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  margin-bottom: 1.35rem;
  padding-left: 1.5rem;
}

.era-title-block {
  min-width: min(100%, 22rem);
}

.era-group-index,
.era-group-count {
  color: rgba(255, 255, 255, 0.42);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  line-height: 1.3;
  text-transform: uppercase;
}

.era-group-index {
  display: block;
  margin-bottom: 0.4rem;
}

.era-group-title {
  font-family: var(--font-mono);
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  color: #e4c96f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.35;
  margin: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  text-shadow: 0 0 18px rgba(212, 175, 55, 0.18);
}

.era-group-divider {
  flex: 1 1 80px;
  height: 2px;
  min-width: 120px;
  margin-bottom: 0.35rem;
  background:
    linear-gradient(90deg, rgba(212, 175, 55, 0.62), rgba(212, 175, 55, 0.08), transparent),
    linear-gradient(90deg, rgba(255, 244, 194, 0.34), transparent);
  box-shadow: 0 0 16px rgba(212, 175, 55, 0.14);
}

.era-group-count {
  margin-bottom: 0.2rem;
  color: rgba(212, 175, 55, 0.62);
}

.era-archive-layout {
  position: relative;
  padding-left: 1.5rem;
}

.era-parent-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: clamp(1.25rem, 3vw, 2.5rem);
  align-items: center;
  margin-bottom: 1.3rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  color: inherit;
  border: 1px solid rgba(212, 175, 55, 0.22);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(24, 18, 9, 0.9), rgba(7, 7, 7, 0.92) 68%),
    radial-gradient(circle at 8% 0%, rgba(212, 175, 55, 0.14), transparent 16rem);
  box-shadow:
    inset 0 1px 0 rgba(255, 244, 194, 0.08),
    0 22px 54px rgba(0, 0, 0, 0.26);
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
}

.era-parent-card::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.54), transparent);
}

.era-parent-card:hover,
.era-parent-card:focus-visible {
  border-color: rgba(240, 210, 122, 0.62);
  box-shadow:
    inset 0 1px 0 rgba(255, 244, 194, 0.12),
    0 24px 58px rgba(0, 0, 0, 0.34),
    0 0 24px rgba(212, 175, 55, 0.12);
  transform: translateY(-2px);
  outline: none;
}

.parent-card-rule {
  position: absolute;
  top: 1.25rem;
  bottom: 1.25rem;
  left: 0;
  width: 3px;
  background: linear-gradient(to bottom, transparent, #d4af37, rgba(184, 42, 42, 0.52), transparent);
  box-shadow: 0 0 18px rgba(212, 175, 55, 0.28);
}

.parent-card-copy {
  min-width: 0;
}

.parent-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem 1rem;
  margin-bottom: 0.75rem;
  color: rgba(212, 175, 55, 0.66);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.parent-card-copy h3 {
  margin: 0;
  color: #fff;
  font-family: var(--font-heading);
  font-size: clamp(1.55rem, 2.5vw, 2.35rem);
  font-weight: 500;
  line-height: 1.12;
  text-wrap: balance;
}

.parent-card-chinese {
  margin: 0.35rem 0 0;
  color: rgba(212, 175, 55, 0.62);
  font-family: var(--font-heading);
  font-size: 1rem;
}

.parent-card-summary {
  max-width: 74ch;
  margin: 0.9rem 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.98rem;
  line-height: 1.7;
  text-wrap: pretty;
}

.parent-card-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 6.75rem;
  min-height: 6.75rem;
  border: 1px solid rgba(212, 175, 55, 0.24);
  border-radius: 8px;
  background: rgba(5, 5, 5, 0.4);
  box-shadow: inset 0 0 24px rgba(212, 175, 55, 0.06);
}

.stat-value {
  color: #f0d27a;
  font-family: var(--font-mono);
  font-size: 2rem;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  margin-top: 0.35rem;
  color: rgba(255, 255, 255, 0.48);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

:deep(.timeline-event-grid.dossier-grid) {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.1rem;
  margin: 1.1rem 0 0;
}

:deep(.timeline-event-card-frame .dossier-card) {
  min-height: 100%;
}

.timeline-end-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 6rem;
  margin-bottom: 4rem;
  opacity: 0.3;
}

.end-mark-line {
  height: 1px;
  width: 60px;
  background: var(--c-gold, #d4af37);
}

.end-mark-dot {
  width: 6px;
  height: 6px;
  background: var(--c-seal-red, #ba2626);
  border-radius: 50%;
  transform: rotate(45deg);
}

@media (max-width: 760px) {
  .timeline-archive-section {
    padding-top: 2.5rem;
  }

  .era-archive-group::before {
    left: 0;
  }

  .era-group-header,
  .era-archive-layout {
    padding-left: 0.85rem;
  }

  .era-group-divider {
    flex-basis: 100%;
    min-width: 100%;
  }

  .era-parent-card {
    grid-template-columns: 1fr;
  }

  .parent-card-stat {
    align-items: flex-start;
    min-width: 0;
    min-height: auto;
    padding: 0.8rem;
  }

  .stat-value {
    font-size: 1.45rem;
  }

  :deep(.timeline-event-grid.dossier-grid) {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .era-parent-card,
  :deep(.dossier-card) {
    transition: none;
  }

  .era-parent-card:hover,
  .era-parent-card:focus-visible,
  :deep(.dossier-card:hover) {
    transform: none;
  }
}
</style>
