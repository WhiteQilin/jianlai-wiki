<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('All')

const meta = useSectionMeta('cultivation')

type CultivationEntry = {
  title?: string
  chinese?: string
  description?: string
  category?: string
  status?: string
  verificationStatus?: string
  pathType?: string
  realmRange?: string
  tags?: string[]
  path?: string
  image?: string
}

const { data: items } = await useAsyncData('cultivation-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/cultivation/%')
    .order('title', 'ASC')
    .all()
})

const cultivationEntries = computed<CultivationEntry[]>(() => (items.value ?? []) as CultivationEntry[])

const titleOrder = ['Qi Refiner', 'Sword Cultivator', 'Pure Martial Artist']
const categoryOrder = ['Path', 'Realm']

const pathEntries = computed(() =>
  cultivationEntries.value
    .filter((entry) => entry.category === 'Path')
    .sort((a, b) => {
      const aIndex = titleOrder.indexOf(a.title || '')
      const bIndex = titleOrder.indexOf(b.title || '')
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex)
    }),
)

const rangeStart = (range?: string) => {
  const match = `${range || ''}`.match(/\d+/)
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER
}

const realmGroupEntries = computed(() =>
  cultivationEntries.value
    .filter((entry) => entry.category === 'Realm')
    .sort((a, b) => rangeStart(a.realmRange) - rangeStart(b.realmRange)),
)

const archiveEntries = computed(() => cultivationEntries.value)

const archiveCategories = computed(() => {
  const categories = Array.from(
    new Set(archiveEntries.value.map((entry) => entry.category).filter((category): category is string => Boolean(category))),
  )

  return [
    'All',
    ...categories.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a)
      const bIndex = categoryOrder.indexOf(b)
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex) || a.localeCompare(b)
    }),
  ]
})

const filteredItems = computed(() =>
  archiveEntries.value.filter((entry) => matchesCategory(entry.category, activeCategory.value)),
)

const cardStatus = (entry: CultivationEntry) => entry.verificationStatus || entry.status || 'to-be-verified'

useSeoMeta({
  title: 'Cultivation System',
  description: meta.description,
  ogTitle: 'Cultivation System',
  ogDescription: meta.description,
})
</script>

<template>
  <div class="page-container cultivation-page">
    <ScrollReveal animation="reveal-fade-up">
      <section class="cultivation-hero" aria-labelledby="cultivation-system-title">
        <div class="hero-ink-field" aria-hidden="true">
          <span class="hero-mark hero-mark-left"></span>
          <span class="hero-mark hero-mark-right"></span>
        </div>

        <div class="hero-inner">
          <div class="hero-kicker">
            <span>Dao map</span>
            <span>{{ archiveEntries.length }} entries</span>
          </div>
          <h1 id="cultivation-system-title">Cultivation System</h1>
          <p v-if="meta.chinese" class="hero-zh">{{ meta.chinese }}</p>
          <p class="hero-copy">
            Paths are compared first, then the Qi Refiner realm groupings are shown as their own ladder. Martial cultivation remains separate from that numeric ladder.
          </p>
          <div class="hero-ledger" aria-label="Cultivation entry counts">
            <span><strong>{{ pathEntries.length }}</strong> paths</span>
            <span><strong>{{ realmGroupEntries.length }}</strong> realm groups</span>
            <span><strong>{{ archiveEntries.length }}</strong> archive records</span>
          </div>
        </div>
      </section>
    </ScrollReveal>

    <main class="mdc-content cultivation-content">
      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <CultivationPathComparison :paths="pathEntries" />
      </ScrollReveal>

      <ScrollReveal animation="reveal-fade-up">
        <RealmLadder :realms="realmGroupEntries" />
      </ScrollReveal>

      <section class="archive-section" aria-labelledby="cultivation-archive-title">
        <ScrollReveal animation="reveal-fade-up">
          <div class="archive-heading">
            <span class="archive-kicker">Reference shelf</span>
            <h2 id="cultivation-archive-title">Cultivation archive</h2>
            <UiBrushUnderline tone="section" weight="bold" width="long" />
            <p>All current cultivation entries remain available here without overtaking the system map above.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
          <CategoryTabs
            :categories="archiveCategories"
            v-model:active="activeCategory"
          />
        </ScrollReveal>

        <div v-if="filteredItems.length > 0" class="archive-list">
          <ScrollReveal
            v-for="(item, index) in filteredItems"
            :key="item.path"
            animation="reveal-fade-up"
            :delay="(`stagger-${(index % 5) + 1}` as any)"
          >
            <NuxtLink :to="item.path || '/cultivation'" class="archive-card">
              <span class="archive-card-category">{{ item.category || 'Cultivation' }}</span>
              <span class="archive-card-status">{{ cardStatus(item) }}</span>
              <h3>{{ item.title || 'Unknown' }}</h3>
              <span v-if="item.chinese" class="archive-card-chinese">{{ item.chinese }}</span>
              <p>{{ item.description || 'Entry pending detailed documentation.' }}</p>
            </NuxtLink>
          </ScrollReveal>
        </div>

        <ScrollReveal v-else animation="reveal-fade-up">
          <EmptyArchiveState />
        </ScrollReveal>
      </section>

      <UiSectionDivider motif="ink" />

      <ScrollReveal animation="reveal-fade-up">
        <RelatedLinks
          :links="[
            { link: '/characters', titleZh: '人物志', titleEn: 'Characters', bgChar: '人' },
            { link: '/swordsmanship', titleZh: '剑术与神通', titleEn: 'Swordsmanship', bgChar: '剑' },
            { link: '/factions', titleZh: '宗门势力', titleEn: 'Factions', bgChar: '宗' }
          ]"
        />
      </ScrollReveal>
    </main>
  </div>
</template>

<style scoped>
.cultivation-page {
  --cultivation-paper: #f8f5ee;
  --cultivation-paper-alt: #fffdf8;
  --cultivation-mist: #ece4d5;
  --cultivation-mist-light: #f3eee4;
  --cultivation-ink: #20201d;
  --cultivation-ink-wash: #4e4a42;
  --cultivation-bronze: #8b7352;
  --cultivation-seal: #a92d28;
  --c-paper: var(--cultivation-paper);
  --c-paper-alt: var(--cultivation-paper-alt);
  --c-bg: var(--cultivation-paper);
  --c-bg-soft: var(--cultivation-mist-light);
  --c-bg-alt: var(--cultivation-mist);
  --c-ink: var(--cultivation-ink);
  --c-ink-wash: var(--cultivation-ink-wash);
  --c-text-1: var(--cultivation-ink);
  --c-text-2: var(--cultivation-ink-wash);
  --c-text-3: #746f66;
  --c-border: rgba(32, 32, 29, 0.13);
  --c-divider: rgba(32, 32, 29, 0.08);
  --c-bronze: var(--cultivation-bronze);
  --c-bronze-soft: rgba(139, 115, 82, 0.1);
  --c-seal-red: var(--cultivation-seal);
  --c-seal-red-soft: rgba(169, 45, 40, 0.08);
  background:
    linear-gradient(180deg, var(--cultivation-paper-alt), var(--cultivation-paper) 38rem),
    var(--cultivation-paper);
  color: var(--cultivation-ink);
}

.cultivation-hero {
  position: relative;
  min-height: 26rem;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: 4.5rem 2rem 5rem;
  border-bottom: 1px solid rgba(32, 32, 29, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 253, 248, 0.96), rgba(248, 245, 238, 0.92)),
    var(--cultivation-paper);
}

.cultivation-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    url('/images/textures/ink-wash-02.webp'),
    linear-gradient(90deg, rgba(32, 32, 29, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(32, 32, 29, 0.025) 1px, transparent 1px);
  background-size: cover, 64px 64px, 64px 64px;
  background-position: center;
  opacity: 0.34;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.cultivation-hero::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: min(42rem, 78vw);
  height: 2px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent, var(--cultivation-seal), var(--cultivation-bronze), transparent);
  opacity: 0.62;
}

.hero-ink-field {
  position: absolute;
  inset: 2rem;
  pointer-events: none;
}

.hero-mark {
  position: absolute;
  width: 12rem;
  height: 12rem;
  border: 1px solid rgba(139, 115, 82, 0.26);
  opacity: 0.45;
  transform: rotate(45deg);
}

.hero-mark-left {
  left: 5%;
  top: 18%;
}

.hero-mark-right {
  right: 8%;
  bottom: 8%;
}

.hero-inner {
  position: relative;
  z-index: 1;
  width: min(58rem, 100%);
  margin: 0 auto;
  text-align: center;
}

.hero-kicker {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  color: var(--cultivation-bronze);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero-kicker span {
  padding: 0.28rem 0.5rem;
  border: 1px solid rgba(139, 115, 82, 0.24);
  background: rgba(255, 253, 248, 0.54);
}

.cultivation-hero h1 {
  margin: 0;
  color: var(--cultivation-ink);
  font-family: var(--font-heading);
  font-size: 3.1rem;
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: 0;
  text-wrap: balance;
}

.hero-zh {
  margin: 0.8rem 0 0;
  color: var(--cultivation-seal);
  font-family: var(--font-zh-display);
  font-size: 1.55rem;
  line-height: 1.3;
  letter-spacing: 0;
}

.hero-copy {
  max-width: 42rem;
  margin: 1.3rem auto 0;
  color: var(--cultivation-ink-wash);
  font-size: 1.05rem;
  line-height: 1.75;
}

.hero-ledger {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  max-width: 42rem;
  margin: 2rem auto 0;
}

.hero-ledger span {
  min-width: 0;
  padding: 0.8rem;
  border: 1px solid rgba(32, 32, 29, 0.12);
  background: rgba(255, 253, 248, 0.6);
  color: var(--cultivation-ink-wash);
  font-size: 0.88rem;
  line-height: 1.35;
}

.hero-ledger strong {
  display: block;
  color: var(--cultivation-ink);
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.1;
}

.cultivation-content {
  padding-top: 4rem;
}

.archive-section {
  margin: 0 0 4rem;
  padding-top: 0.5rem;
}

.archive-heading {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(18rem, 1.3fr);
  gap: 1.5rem;
  align-items: end;
  margin-bottom: 1.4rem;
  border-top: 1px solid var(--c-divider);
  padding-top: 2rem;
}

.archive-kicker {
  align-self: start;
  color: var(--c-bronze);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

.archive-heading h2 {
  grid-column: 1;
  margin: 1.6rem 0 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.65rem;
  font-weight: 500;
  letter-spacing: 0;
}

.archive-heading :deep(.brush-underline) {
  grid-column: 1;
  display: block;
  width: 7.5rem;
  height: 0.5rem;
  margin-top: 0.5rem;
}

.archive-heading p {
  grid-column: 2;
  margin: 0;
  max-width: 42rem;
  color: var(--c-text-2);
  font-size: 0.96rem;
  line-height: 1.72;
}

.archive-section :deep(.category-tabs) {
  margin-bottom: 1.25rem;
  padding-bottom: 0.8rem;
}

.archive-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.archive-card {
  min-width: 0;
  min-height: 11.2rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.3rem 0.85rem;
  padding: 1rem;
  border: 1px solid rgba(32, 32, 29, 0.1);
  border-left: 2px solid rgba(139, 115, 82, 0.42);
  border-radius: 4px;
  background: rgba(255, 253, 248, 0.58);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.25s ease, transform 0.25s ease, background-color 0.25s ease;
}

.archive-card:hover {
  transform: translateY(-0.12rem);
  border-color: rgba(169, 45, 40, 0.38);
  border-left-color: var(--c-seal-red);
  background: rgba(255, 253, 248, 0.82);
}

.archive-card:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.archive-card-category,
.archive-card-status {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0;
  line-height: 1.4;
  text-transform: uppercase;
}

.archive-card-status {
  justify-self: end;
  text-align: right;
}

.archive-card h3 {
  grid-column: 1 / -1;
  margin: 0.35rem 0 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: 0;
  overflow-wrap: anywhere;
}

.archive-card-chinese {
  grid-column: 1 / -1;
  color: var(--c-seal-red);
  font-size: 0.9rem;
  overflow-wrap: anywhere;
}

.archive-card p {
  grid-column: 1 / -1;
  margin: 0.25rem 0 0;
  color: var(--c-text-2);
  font-size: 0.88rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 820px) {
  .cultivation-hero {
    min-height: 0;
    padding: 3.5rem 1rem 4rem;
  }

  .cultivation-hero h1 {
    font-size: 2.25rem;
  }

  .hero-zh {
    font-size: 1.3rem;
  }

  .hero-ledger,
  .archive-list {
    grid-template-columns: 1fr;
  }

  .archive-heading {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }

  .archive-heading h2,
  .archive-heading p,
  .archive-heading :deep(.brush-underline) {
    grid-column: auto;
  }
}

@media (max-width: 560px) {
  .hero-mark {
    display: none;
  }

  .hero-ledger span {
    padding: 0.7rem;
  }

  .archive-card {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .archive-card-status {
    justify-self: start;
    text-align: left;
  }
}
</style>
