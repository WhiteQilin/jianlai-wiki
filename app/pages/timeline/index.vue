<script setup lang="ts">
import { ref, computed } from 'vue'

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
      summary: macroEntry.summary,
      link: macroEntry.link,
      characters: macroEntry.characters,
      events: microEvents // only the actual micro-events
    }
  })
})

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
            <div v-for="(group, groupIndex) in eraGroups" :key="group.era" class="era-archive-group">
              <ScrollReveal animation="reveal-fade-up">
                <div class="era-group-header">
                  <h2 class="era-group-title">{{ group.era }}</h2>
                  <div class="era-group-divider"></div>
                </div>
              </ScrollReveal>
              
              <DossierGrid>
                <ScrollReveal
                  v-for="(item, index) in group.events"
                  :key="item.link"
                  animation="reveal-fade-up"
                  :delay="(`stagger-${(index % 5) + 1}` as any)"
                >
                  <DossierCard
                    :link="item.link"
                    :nameEn="item.title"
                    :nameZh="item.chinese"
                    :desc="item.summary"
                    :category="item.category || 'Timeline'"
                    :status="item.status || 'To be verified'"
                    :image="item.image"
                  />
                </ScrollReveal>
              </DossierGrid>
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
  /* Ensure the tabs look good on dark background */
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
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(212, 175, 55, 0.15);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

:deep(.dossier-card:hover) {
  border-color: var(--c-gold, #d4af37);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.1);
  transform: translateY(-4px);
}

:deep(.dossier-card .card-name-zh),
:deep(.dossier-card .card-name-en) {
  color: #fff;
}

:deep(.dossier-card .card-desc) {
  color: rgba(255, 255, 255, 0.7);
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
  padding-top: 4rem;
  background-color: #050505;
  background-image:
    linear-gradient(to bottom, transparent, rgba(10, 10, 10, 0.8) 100%),
    url('/images/textures/ink-wash-01.webp'); /* Faint texture for body */
  background-size: 100% 100%, cover;
  background-position: center, center;
  background-blend-mode: normal, multiply;
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
  margin-bottom: 5rem;
}

.era-group-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.era-group-title {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  color: var(--c-gold, #d4af37);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  white-space: nowrap;
}

.era-group-divider {
  flex-grow: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.3), transparent);
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
</style>
