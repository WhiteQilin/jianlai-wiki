<script setup lang="ts">
// Dev-route wrapper for Swordsmanship V2 prototype
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

import { computed } from 'vue'
import { createEntryResolver, humanizePath, type ResolvedEntryLink } from '~/utils/entryLinkResolver'
import { RELATIONSHIP_FIELDS, extractPaths, isRoutedPath } from '~/utils/relationshipConfig'
import SwordDaoManualHero from '~/components/swordsmanship-v2/SwordDaoManualHero.vue'
import BladePathRail from '~/components/swordsmanship-v2/BladePathRail.vue'
import SwordRecordSlip from '~/components/swordsmanship-v2/SwordRecordSlip.vue'
import ManualAnnotationPanel from '~/components/swordsmanship-v2/ManualAnnotationPanel.vue'
import SwordArtRegister from '~/components/swordsmanship-v2/SwordArtRegister.vue'
import SwordManualRelatedExits from '~/components/swordsmanship-v2/SwordManualRelatedExits.vue'

type ContentRecord = Record<string, any> & {
  path?: string
  title?: string
  chinese?: string
  description?: string
  category?: string
  status?: string
  importance?: string
  verificationStatus?: string
  image?: string
  seal?: string
  tags?: string[]
  users?: string[]
  related?: string[]
  sourceNotes?: string
  lastUpdated?: string
}

type SwordManualEntry = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  status?: string
  importance?: string
  verificationStatus?: string
  image?: string
  seal?: string
  tags: string[]
  sourceNotes?: string
  lastUpdated?: string
  knownUserLinks: ResolvedEntryLink[]
  relatedLinks: ResolvedEntryLink[]
}

const meta = useSectionMeta('swordsmanship')
const charactersMeta = useSectionMeta('characters')
const cultivationMeta = useSectionMeta('cultivation')
const artifactsMeta = useSectionMeta('artifacts')

const { data: contentRecords } = await useAsyncData('sword-manual-content', () => {
  return queryCollection('content').order('title', 'ASC').all()
})

const allRecords = computed<ContentRecord[]>(() => (contentRecords.value ?? []) as ContentRecord[])

const normalizePath = (value: unknown) => {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed.startsWith('/')) return ''
  return trimmed.replace(/\/+$/g, '') || '/'
}

const normalizeLabel = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const normalizeKey = (value: unknown) => normalizeLabel(value).toLowerCase()

const titleSort = (a: ContentRecord | SwordManualEntry, b: ContentRecord | SwordManualEntry) =>
  (a.title || humanizePath(a.path || '')).localeCompare(b.title || humanizePath(b.path || ''))

const importanceWeight = (value: unknown) => {
  if (normalizeKey(value) === 'primary') return 4
  if (normalizeKey(value) === 'major') return 3
  if (normalizeKey(value) === 'minor') return 2
  if (normalizeKey(value) === 'background') return 1
  return 0
}

const toStringArray = (value: unknown) =>
  (Array.isArray(value) ? value : typeof value === 'string' ? [value] : [])
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)

const existingPaths = computed(() =>
  allRecords.value
    .map((record) => normalizePath(record.path))
    .filter((path): path is string => Boolean(path && isRoutedPath(path))),
)

const existingPathSet = computed(() => new Set(existingPaths.value))

const recordByPath = computed(() => {
  const map = new Map<string, ContentRecord>()
  for (const record of allRecords.value) {
    const path = normalizePath(record.path)
    if (path && isRoutedPath(path)) map.set(path, record)
  }
  return map
})

const resolver = computed(() => createEntryResolver(allRecords.value))

const swordRecords = computed<ContentRecord[]>(() =>
  allRecords.value
    .filter((record) => normalizePath(record.path).startsWith('/swordsmanship/'))
    .sort(titleSort),
)

const categoryFilters = computed(() => {
  const actualCategories = new Set(
    swordRecords.value
      .map((record) => normalizeLabel(record.category))
      .filter((category): category is string => Boolean(category)),
  )

  const ordered = meta.categories.filter((category) => actualCategories.has(category))
  const extras = [...actualCategories].filter((category) => !meta.categories.includes(category)).sort()

  return ['All', ...ordered, ...extras]
})

const verificationCount = computed(
  () => swordRecords.value.filter((record) => Boolean(normalizeLabel(record.verificationStatus))).length,
)

const featuredRecord = computed(() => {
  // Try to find Caged Sparrow
  const cagedSparrow = swordRecords.value.find(r => r.title === 'Caged Sparrow' || r.chinese === '笼中雀')
  if (cagedSparrow) return cagedSparrow

  const records = [...swordRecords.value].sort(
    (a, b) => importanceWeight(b.importance) - importanceWeight(a.importance) || titleSort(a, b),
  )

  return records[0] ?? null
})

const inverseReferenceLinks = computed<ResolvedEntryLink[]>(() => {
  const targetPath = normalizePath(featuredRecord.value?.path)
  if (!targetPath) return []

  const links: ResolvedEntryLink[] = []
  const seen = new Set<string>()

  for (const record of allRecords.value) {
    const sourcePath = normalizePath(record.path)
    if (!sourcePath || sourcePath === targetPath || !isRoutedPath(sourcePath) || !existingPathSet.value.has(sourcePath)) continue

    let referencesTarget = false
    for (const field of RELATIONSHIP_FIELDS) {
      if (extractPaths(record, field).some((path) => normalizePath(path) === targetPath)) {
        referencesTarget = true
        break
      }
    }

    if (!referencesTarget || seen.has(sourcePath)) continue

    const link = resolver.value.resolveEntryLink(sourcePath)
    if (!link) continue

    links.push(link)
    seen.add(sourcePath)
  }

  return links.sort((a, b) => {
    const aRecord = recordByPath.value.get(a.path)
    const bRecord = recordByPath.value.get(b.path)

    return (
      importanceWeight(bRecord?.importance) - importanceWeight(aRecord?.importance) ||
      a.label.localeCompare(b.label)
    )
  })
})

const toSwordManualEntry = (record: ContentRecord): SwordManualEntry => {
  const path = normalizePath(record.path)

  return {
    path,
    title: record.title || humanizePath(path) || 'Untitled sword record',
    chinese: record.chinese,
    description: record.description,
    category: record.category,
    status: record.status,
    importance: record.importance,
    verificationStatus: record.verificationStatus,
    image: record.image,
    seal: record.seal,
    tags: toStringArray(record.tags),
    sourceNotes: record.sourceNotes,
    lastUpdated: record.lastUpdated,
    knownUserLinks: resolver.value.resolveMany(record.users),
    relatedLinks: resolver.value.resolveMany(record.related),
  }
}

const featuredEntry = computed(() => (featuredRecord.value ? toSwordManualEntry(featuredRecord.value) : null))

const archiveEntries = computed(() =>
  swordRecords.value
    .map((record) => toSwordManualEntry(record))
    .sort((a, b) => importanceWeight(b.importance) - importanceWeight(a.importance) || titleSort(a, b)),
)

const manualStats = computed(() => ({
  totalCount: archiveEntries.value.length,
  categoryCount: categoryFilters.value.filter((category) => category !== 'All').length,
  verificationCount: verificationCount.value,
}))

const representativeSeals = computed(() =>
  archiveEntries.value
    .map((entry) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0))
    .filter((seal): seal is string => Boolean(seal))
    .slice(0, 8),
)

const knownUserLinks = computed(() => featuredEntry.value?.knownUserLinks ?? [])
const relatedRecordLinks = computed(() => featuredEntry.value?.relatedLinks ?? [])

const relatedLinks = computed(() => [
  {
    link: '/characters',
    titleZh: charactersMeta.chinese || charactersMeta.title,
    titleEn: charactersMeta.title,
    bgChar: (charactersMeta.chinese || charactersMeta.title).charAt(0),
  },
  {
    link: '/cultivation',
    titleZh: cultivationMeta.chinese || cultivationMeta.title,
    titleEn: cultivationMeta.title,
    bgChar: (cultivationMeta.chinese || cultivationMeta.title).charAt(0),
  },
  {
    link: '/artifacts',
    titleZh: artifactsMeta.chinese || artifactsMeta.title,
    titleEn: artifactsMeta.title,
    bgChar: (artifactsMeta.chinese || artifactsMeta.title).charAt(0),
  },
])

useSeoMeta({
  title: 'Sword Dao Manual | Jian Lai Wiki',
  description: 'Sword Dao Manual — the blade-scroll archive of sword arts, techniques, and martial records.',
})
</script>

<template>
  <div class="sword-dao-manual" data-jl-section="swordsmanship-v2">
    <a href="#featured-slip" class="manual-skip-link">Skip to sword manual</a>

    <SwordDaoManualHero
      :title="meta.title"
      :chinese="meta.chinese"
      :description="meta.description"
      :total-count="manualStats.totalCount"
      :category-count="manualStats.categoryCount"
      :verification-count="manualStats.verificationCount"
      :featured-title="featuredEntry?.title"
      :featured-chinese="featuredEntry?.chinese"
      :last-updated="featuredEntry?.lastUpdated"
      :representative-seals="representativeSeals"
    />

    <div class="manual-fold" aria-hidden="true">
      <span class="manual-fold__mist"></span>
      <span class="manual-fold__blade"></span>
    </div>

    <section class="manual-spine-shell mdc-content" aria-label="Sword Dao Manual">
      <div class="manual-spine-layout">
        <BladePathRail />

        <div class="manual-pages">
          <section id="featured-slip" class="manual-section manual-section--feature" aria-label="Featured Caged Sparrow record">
            <div class="section-heading">
              <p>Manual leaf 01</p>
              <h2>Primary Manual Slip</h2>
            </div>

            <SwordRecordSlip
              v-if="featuredEntry"
              :entry="featuredEntry"
              :existing-paths="existingPaths"
            />

            <div v-else class="empty-featured-slip">
              <p>Caged Sparrow slip awaiting inscription.</p>
            </div>
          </section>

          <div class="blade-cut-divider" aria-hidden="true">
            <img class="blade-cut-divider__img" src="/images/ui/generated/swordsmanship-v2/swordsmanship-divider-slash-01.webp" alt="" loading="lazy" />
          </div>

          <section id="marginal-notes" class="manual-section manual-section--notes" aria-label="Sword manual marginal notes">
            <ManualAnnotationPanel
              :known-users="knownUserLinks"
              :related-records="relatedRecordLinks"
              :referenced-by="inverseReferenceLinks"
            />
          </section>

          <div class="blade-cut-divider blade-cut-divider--short" aria-hidden="true">
            <img class="blade-cut-divider__img" src="/images/ui/generated/swordsmanship-v2/swordsmanship-divider-slash-03.webp" alt="" loading="lazy" />
          </div>

          <section id="recorded-arts" class="manual-section manual-section--register" aria-label="Sword art register">
            <SwordArtRegister
              :entries="archiveEntries"
              :category-filters="categoryFilters"
              :existing-paths="existingPaths"
            />
          </section>

          <div class="blade-cut-divider" aria-hidden="true">
            <img class="blade-cut-divider__img" src="/images/ui/generated/swordsmanship-v2/swordsmanship-divider-slash-04.webp" alt="" loading="lazy" />
          </div>

          <section id="related-exits" class="manual-section manual-section--exits" aria-label="Related section links">
            <SwordManualRelatedExits :links="relatedLinks" />
          </section>

          <div class="manual-end-mark" aria-hidden="true">
            <span class="end-mark__line"></span>
            <span class="end-mark__seal">完</span>
            <span class="end-mark__line"></span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sword-dao-manual {
  --c-paper: #edf3ee;
  --c-paper-deep: #d7e3e1;
  --c-mist: #cbdde0;
  --c-ink: #0b2331;
  --c-ink-soft: #315161;
  --c-steel: #7f9ca6;
  --c-jade: #8eb4aa;
  --c-cinnabar: #a5372f;
  --c-cinnabar-soft: rgba(165, 55, 47, 0.13);
  --c-bg: #d5e3e4;
  --c-border: rgba(29, 61, 75, 0.16);

  min-height: 100dvh;
  width: 100%;
  overflow-x: hidden;
  color: var(--c-ink);
  background: var(--c-bg);
  scroll-behavior: smooth;
}

.sword-dao-manual::selection {
  color: #f8ffff;
  background: rgba(165, 55, 47, 0.72);
}

:deep(.mdc-content) {
  --c-bg: var(--c-bg);
  --c-text-1: var(--c-ink);
  --c-text-2: var(--c-ink-soft);
  --c-text-3: rgba(49, 81, 97, 0.66);
  --c-border: var(--c-border);
  --c-bg-elevated: var(--c-paper);
  --c-bg-soft: rgba(237, 243, 238, 0.52);
}

.manual-skip-link {
  position: fixed;
  left: 1rem;
  top: 1rem;
  z-index: 40;
  padding: 0.7rem 0.9rem;
  border: 1px solid rgba(165, 55, 47, 0.52);
  color: var(--c-ink);
  background: rgba(244, 246, 238, 0.95);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-decoration: none;
  text-transform: uppercase;
  transform: translateY(-150%);
  transition: transform 0.2s ease;
}

.manual-skip-link:focus-visible {
  outline: 2px solid var(--c-cinnabar);
  outline-offset: 0.2rem;
  transform: translateY(0);
}

.manual-fold {
  position: relative;
  height: clamp(3rem, 6vw, 5rem);
  background: var(--c-bg);
  overflow: hidden;
}

.manual-fold__mist {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom,
    rgba(6, 16, 25, 0.4) 0%,
    rgba(10, 26, 37, 0.15) 40%,
    transparent 100%
  );
}

.manual-fold__blade {
  position: absolute;
  top: 50%;
  left: 5%;
  right: 5%;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(174, 221, 229, 0.2) 20%,
    rgba(224, 243, 243, 0.35) 50%,
    rgba(174, 221, 229, 0.2) 80%,
    transparent 100%
  );
  box-shadow: 0 0 20px rgba(174, 221, 229, 0.12);
  transform: translateY(-50%);
}

.manual-spine-shell {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 0 0 clamp(5rem, 10vw, 8rem);
  background: var(--c-bg);
}

.manual-spine-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(90deg,
      transparent 0,
      transparent clamp(3.5rem, 5vw, 5.5rem),
      rgba(165, 55, 47, 0.06) clamp(3.5rem, 5vw, 5.5rem),
      rgba(165, 55, 47, 0.06) calc(clamp(3.5rem, 5vw, 5.5rem) + 1px),
      transparent calc(clamp(3.5rem, 5vw, 5.5rem) + 1px)
    ),
    linear-gradient(90deg,
      transparent 0,
      transparent calc(100% - clamp(3.5rem, 5vw, 5.5rem) - 1px),
      rgba(165, 55, 47, 0.06) calc(100% - clamp(3.5rem, 5vw, 5.5rem) - 1px),
      rgba(165, 55, 47, 0.06) calc(100% - clamp(3.5rem, 5vw, 5.5rem)),
      transparent calc(100% - clamp(3.5rem, 5vw, 5.5rem))
    ),
    repeating-linear-gradient(0deg,
      rgba(32, 63, 77, 0.03) 0 1px,
      transparent 1px 3.25rem
    ),
    radial-gradient(ellipse at 72% 18%,
      rgba(136, 181, 182, 0.14), transparent 30rem
    ),
    radial-gradient(ellipse at 22% 60%,
      rgba(165, 55, 47, 0.04), transparent 26rem
    ),
    linear-gradient(105deg,
      transparent 0%,
      transparent 44%,
      rgba(224, 243, 243, 0.04) 48%,
      rgba(174, 221, 229, 0.03) 52%,
      transparent 56%,
      transparent 100%
    );
  background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 300% 100%;
  animation: bladeLightDrift 40s linear infinite;
}

.manual-spine-shell::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  height: clamp(14rem, 22vw, 22rem);
  background: linear-gradient(to bottom,
    rgba(6, 16, 25, 0.92) 0%,
    rgba(6, 16, 25, 0.6) 30%,
    rgba(10, 26, 37, 0.3) 55%,
    rgba(16, 29, 38, 0.1) 75%,
    transparent 100%
  );
  pointer-events: none;
}

.manual-spine-layout {
  position: relative;
  width: min(1500px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(7rem, 10rem) minmax(0, 1fr);
  gap: clamp(1rem, 2.5vw, 2.4rem);
  padding: 0 clamp(1.5rem, 4vw, 5rem);
}

.manual-pages {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(3rem, 7vw, 6rem);
}

.manual-section {
  position: relative;
  min-width: 0;
  scroll-margin-top: calc(var(--header-height, 4rem) + 1.25rem);
}

.manual-section::before {
  content: '';
  position: absolute;
  inset: -1.2rem -0.8rem auto;
  z-index: -1;
  height: 3.5rem;
  background: linear-gradient(90deg, rgba(240, 246, 241, 0), rgba(240, 246, 241, 0.6), rgba(240, 246, 241, 0));
  opacity: 0;
  transform: skewY(-1.2deg) translateY(0.6rem);
  animation: slashReveal 0.7s cubic-bezier(0.22, 0.8, 0.2, 1) both;
  animation-timeline: view();
  animation-range: entry 0% cover 22%;
}

.section-heading {
  position: relative;
  width: min(42rem, 100%);
  margin-bottom: clamp(1.2rem, 3vw, 2rem);
}

.section-heading p {
  margin: 0 0 0.52rem;
  color: rgba(143, 49, 43, 0.78);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.16em;
  line-height: 1.4;
  text-transform: uppercase;
}

.section-heading h2 {
  margin: 0;
  color: #0b2735;
  font-family: var(--font-heading);
  font-size: clamp(2.1rem, 4.2vw, 4.35rem);
  font-weight: 400;
  letter-spacing: -0.07em;
  line-height: 0.96;
  text-wrap: balance;
}

.empty-featured-slip {
  padding: 2rem;
  border: 1px dashed rgba(143, 49, 43, 0.32);
  color: rgba(13, 42, 56, 0.68);
  background: rgba(238, 244, 238, 0.62);
}

.blade-cut-divider {
  position: relative;
  height: clamp(4rem, 7vw, 6.5rem);
  margin: clamp(-1.2rem, -1vw, -0.5rem) 0;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.blade-cut-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(174, 221, 229, 0.15),
    transparent
  );
  transform: translateY(-50%);
  pointer-events: none;
}

.blade-cut-divider__img {
  width: 100%;
  max-width: 56rem;
  height: auto;
  object-fit: contain;
  opacity: 0.6;
  filter: saturate(0.4) brightness(0.75) contrast(1.15) hue-rotate(190deg);
  mix-blend-mode: multiply;
  pointer-events: none;
}

.blade-cut-divider--short {
  width: min(52rem, 88%);
  margin-left: auto;
  margin-right: auto;
}

.blade-cut-divider--short .blade-cut-divider__img {
  max-width: 100%;
  opacity: 0.45;
}

.manual-end-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-top: clamp(4rem, 8vw, 7rem);
  padding-bottom: 2rem;
}

.end-mark__line {
  width: clamp(3rem, 8vw, 5rem);
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(165, 55, 47, 0.3),
    transparent
  );
}

.end-mark__seal {
  color: rgba(165, 55, 47, 0.4);
  font-family: var(--font-zh-display);
  font-size: 1.1rem;
  line-height: 1;
}

@keyframes slashReveal {
  from {
    opacity: 0;
    transform: skewY(-1.2deg) translateY(0.8rem) scaleX(0.85);
  }
  to {
    opacity: 1;
    transform: skewY(-1.2deg) translateY(0) scaleX(1);
  }
}

@keyframes bladeLightDrift {
  from { background-position: center, center, center, center, center, 0% center; }
  to { background-position: center, center, center, center, center, 100% center; }
}

@media (max-width: 980px) {
  .manual-spine-layout {
    grid-template-columns: 2rem minmax(0, 1fr);
    gap: 1rem;
    padding: 0 clamp(0.8rem, 3vw, 2rem);
  }
}

@media (max-width: 560px) {
  .manual-spine-shell {
    padding-top: 3rem;
  }

  .manual-spine-layout {
    grid-template-columns: 1.4rem minmax(0, 1fr);
    gap: 0.75rem;
    padding: 0 0.75rem 0 0.45rem;
  }

  .manual-pages {
    gap: 3rem;
  }

  .blade-cut-divider {
    height: 3.5rem;
  }

  .blade-cut-divider__img {
    opacity: 0.45;
  }
}

@supports not (animation-timeline: view()) {
  .manual-section::before {
    animation: none;
    opacity: 0.5;
    transform: skewY(-1.2deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .manual-skip-link,
  .manual-section::before {
    animation: none;
    transition: none;
  }

  .manual-spine-shell::before {
    animation: none;
  }

  .manual-section::before {
    opacity: 0.42;
    transform: skewY(-1.2deg);
  }
}
</style>
