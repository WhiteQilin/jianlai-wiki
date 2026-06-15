<script setup lang="ts">
import { computed, ref } from 'vue'
import { createEntryResolver, humanizePath, type ResolvedEntryLink } from '~/utils/entryLinkResolver'
import { RELATIONSHIP_FIELDS, extractPaths, isRoutedPath } from '~/utils/relationshipConfig'
import SwordDaoManualHero from '~/components/swordsmanship-v2/SwordDaoManualHero.vue'
import { useSpineDraw } from '~/composables/useSpineDraw'

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

const { data: contentRecords } = await useAsyncData('sword-v3-bladepath-content', () => {
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

// Blade-core spine draw — GSAP ScrollTrigger experiment
const spineRef = ref<HTMLElement | null>(null)
const descentRef = ref<HTMLElement | null>(null)
useSpineDraw(spineRef, descentRef)

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

const verificationLabel = (entry: SwordManualEntry) => {
  const v = entry.verificationStatus?.trim()
  if (!v) return 'Review pending'
  if (v.toLowerCase() === 'to-be-verified') return 'To Be Verified'
  return v
}

const cleanSourceNotes = (entry: SwordManualEntry) => {
  const notes = entry.sourceNotes?.trim()
  if (!notes) return ''
  return notes
    .replace(/NotebookLM\s+draft\s+with\s+/i, '')
    .replace(/;\s*still\s+pending\s+/i, ' pending ')
    .replace(/^chapter-level references/i, 'Chapter-level references')
}

const normalizeVerification = (value?: string) => {
  if (!value) return 'Review pending'
  if (value.toLowerCase() === 'to-be-verified') return 'To Be Verified'
  return value
}

const recordNumber = (index: number) => String(index + 1).padStart(2, '0')

const exitLabels: Record<string, string> = {
  '/characters': 'Owner dossiers',
  '/cultivation': 'Realm method',
  '/artifacts': 'Paired objects',
}

useSeoMeta({
  title: meta.title,
  description: meta.description,
  ogTitle: meta.title,
  ogDescription: meta.description,
})
</script>

<template>
  <div class="blade-path" data-jl-section="swordsmanship-v3">
    <a href="#tang-zone" class="bp-skip-link">Skip to sword manual</a>

    <SwordDaoManualHero
      variant="bladepath"
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

    <div ref="descentRef" class="bp-descent" aria-label="Sword Dao Manual — Blade Path">
      <div ref="spineRef" class="bp-spine" aria-hidden="true"></div>

      <!-- TANG ZONE: Caged Sparrow core -->
      <section id="tang-zone" class="bp-zone bp-zone--tang" aria-label="Featured Caged Sparrow technique">
        <div class="bp-zone__mist bp-zone__mist--tang" aria-hidden="true"></div>
        <div class="bp-zone__mark" aria-hidden="true"><span></span></div>

        <ScrollReveal animation="reveal-blur-clear">
          <div class="tang-header">
            <span class="bp-eyebrow">Blade tang — technique core</span>
            <h2 class="bp-zone-title">Primary Manual Slip</h2>
          </div>
        </ScrollReveal>

        <ScrollReveal v-if="featuredEntry" animation="reveal-fade-up" delay="stagger-1">
          <article class="tang-plate">
            <div class="tang-plate__art" aria-hidden="true">
              <img
                class="tang-plate__image"
                src="/images/ui/generated/swordsmanship-v2/swordsmanship-caged-sparrow-slip-art-960.webp"
                alt=""
                width="960"
                height="1200"
                loading="lazy"
                decoding="async"
              />
              <span class="tang-plate__wash"></span>
              <span class="tang-plate__frame"></span>
              <span class="tang-plate__vignette"></span>
            </div>

            <div class="tang-plate__copy">
              <div class="tang-plate__seal" aria-label="Cinnabar seal">
                <span aria-hidden="true">{{ featuredEntry.chinese || '剝錄' }}</span>
              </div>

              <p class="tang-plate__label">Primary manual slip</p>

              <h3 class="tang-plate__title">{{ featuredEntry.title }}</h3>
              <p v-if="featuredEntry.chinese" class="tang-plate__zh">{{ featuredEntry.chinese }}</p>

              <div class="tang-plate__meta">
                <span v-if="featuredEntry.category" class="bp-tag">{{ featuredEntry.category }}</span>
                <span v-if="featuredEntry.status" class="bp-tag">{{ featuredEntry.status }}</span>
                <span class="bp-tag bp-tag--cinnabar">{{ verificationLabel(featuredEntry) }}</span>
                <span v-if="featuredEntry.lastUpdated" class="bp-tag">{{ featuredEntry.lastUpdated }}</span>
              </div>

              <p v-if="featuredEntry.description" class="tang-plate__desc">{{ featuredEntry.description }}</p>

              <div class="tang-plate__marks">
                <div class="tang-mark">
                  <span class="tang-mark__label">User</span>
                  <strong>{{ knownUserLinks[0]?.label || 'Chen Ping\'an' }}</strong>
                  <span class="tang-mark__zh">{{ knownUserLinks[0]?.chinese || '陈平安' }}</span>
                </div>
                <div class="tang-mark">
                  <span class="tang-mark__label">Pairing</span>
                  <strong>{{ relatedRecordLinks.find(r => r.label === 'Moon in the Well')?.label || 'Moon in the Well' }}</strong>
                  <span class="tang-mark__zh">{{ relatedRecordLinks.find(r => r.label === 'Moon in the Well')?.chinese || '井中月 / 井底月' }}</span>
                </div>
                <div class="tang-mark tang-mark--ghost">
                  <span class="tang-mark__label">Refinement</span>
                  <strong>Dragon Slaying Stone</strong>
                  <span class="tang-mark__state">Pending ghost record</span>
                </div>
              </div>

              <div v-if="featuredEntry.tags.length" class="tang-plate__tags">
                <span v-for="tag in featuredEntry.tags" :key="tag" class="bp-hashtag">{{ tag }}</span>
              </div>

              <div class="tang-plate__footer">
                <p v-if="cleanSourceNotes(featuredEntry)" class="tang-plate__source">{{ cleanSourceNotes(featuredEntry) }}</p>
                <NuxtLink v-if="existingPaths.includes(featuredEntry.path)" class="bp-cta" :to="featuredEntry.path">
                  Open canonical record
                </NuxtLink>
                <span v-else class="bp-cta bp-cta--disabled">Canonical route pending</span>
              </div>
            </div>
          </article>
        </ScrollReveal>

        <div v-else class="bp-empty">
          <p>Caged Sparrow slip awaiting inscription.</p>
        </div>
      </section>

      <!-- HAMON DIVIDER 1 -->
      <div class="bp-hamon" aria-hidden="true">
        <span class="bp-hamon__line"></span>
        <span class="bp-hamon__glow"></span>
        <span class="bp-hamon__notch"></span>
      </div>

      <!-- SHOULDER ZONE: Marginal Commentary -->
      <section class="bp-zone bp-zone--shoulder" aria-label="Sword manual marginal notes">
        <div class="bp-zone__mist bp-zone__mist--shoulder" aria-hidden="true"></div>
        <div class="bp-zone__mark" aria-hidden="true"><span></span></div>

        <ScrollReveal animation="reveal-fade-up">
          <div class="shoulder-header">
            <span class="bp-eyebrow">Blade shoulder — side inscriptions</span>
            <h2 class="bp-zone-title">Marginal Commentary</h2>
          </div>
        </ScrollReveal>

        <div class="shoulder-notes">
          <ScrollReveal
            v-for="(group, gi) in [
              { eyebrow: 'Red-ink margin 01', title: 'Known Users', note: 'Owner recorded against the manual slip.', empty: 'No user inscription found.', items: knownUserLinks },
              { eyebrow: 'Red-ink margin 02', title: 'Related Records', note: 'Records used to read the technique correctly.', empty: 'No related record inscription found.', items: relatedRecordLinks },
              { eyebrow: 'Red-ink margin 03', title: 'Referenced By', note: 'Other archive leaves that cite this sword art.', empty: 'No reverse citation inscribed yet.', items: inverseReferenceLinks },
            ]"
            :key="group.title"
            animation="reveal-fade-up"
            :delay="(`stagger-${gi + 1}` as any)"
            tag="section"
            class="shoulder-note"
            :class="{ 'shoulder-note--empty': group.items.length === 0 }"
            :aria-label="group.title"
          >
            <div class="shoulder-note__stamp" aria-hidden="true">注</div>
            <div class="shoulder-note__copy">
              <p class="shoulder-note__eyebrow">{{ group.eyebrow }}</p>
              <h3>{{ group.title }}</h3>
              <p class="shoulder-note__desc">{{ group.note }}</p>

              <ul v-if="group.items.length" class="shoulder-note__list">
                <li v-for="item in group.items" :key="item.raw" class="shoulder-note__item">
                  <NuxtLink v-if="item.shouldLink" :to="item.path" class="shoulder-link">
                    <span>{{ item.label }}</span>
                    <small v-if="item.chinese">{{ item.chinese }}</small>
                  </NuxtLink>
                  <span v-else class="shoulder-link shoulder-link--ghost">
                    <span>{{ item.label }}</span>
                    <small v-if="item.chinese">{{ item.chinese }}</small>
                    <em v-if="item.isMissingRoute">pending route</em>
                  </span>
                </li>
              </ul>

              <p v-else class="shoulder-note__empty">{{ group.empty }}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <!-- HAMON DIVIDER 2 -->
      <div class="bp-hamon" aria-hidden="true">
        <span class="bp-hamon__line"></span>
        <span class="bp-hamon__glow"></span>
        <span class="bp-hamon__notch"></span>
      </div>

      <!-- EDGE ZONE: Recorded Arts Register -->
      <section class="bp-zone bp-zone--edge" aria-label="Sword art register">
        <div class="bp-zone__mist bp-zone__mist--edge" aria-hidden="true"></div>
        <div class="bp-zone__mark" aria-hidden="true"><span></span></div>

        <ScrollReveal animation="reveal-fade-up">
          <div class="edge-header">
            <div class="edge-header__copy">
              <span class="bp-eyebrow">Blade edge — sharp index</span>
              <h2 class="bp-zone-title">Recorded Arts Register</h2>
              <p class="edge-header__desc">Compact archive index for sword arts currently inscribed in the wiki records.</p>
            </div>
            <div class="edge-header__count" aria-label="Record count">
              <strong>{{ archiveEntries.length }}</strong>
              <span>{{ archiveEntries.length === 1 ? 'record' : 'records' }}</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal v-if="categoryFilters.length > 1" animation="reveal-fade-up" delay="stagger-1">
          <div class="edge-filters" role="list" aria-label="Categories present in this archive">
            <span
              v-for="cat in categoryFilters"
              :key="cat"
              class="edge-filter"
              role="listitem"
            >{{ cat }}</span>
          </div>
        </ScrollReveal>

        <div class="edge-ledger" role="list" aria-label="Sword art ledger">
          <ScrollReveal
            v-for="(entry, ei) in archiveEntries"
            :key="entry.path"
            animation="reveal-fade-up"
            :delay="(`stagger-${(ei % 5) + 1}` as any)"
            tag="div"
            class="edge-row"
            :class="{ 'edge-row--ghosted': !existingPaths.includes(entry.path) }"
            role="listitem"
          >
            <span class="edge-row__index" aria-hidden="true">{{ recordNumber(ei) }}</span>
            <div class="edge-row__name">
              <NuxtLink v-if="existingPaths.includes(entry.path)" :to="entry.path" class="edge-link">
                <span>{{ entry.title }}</span>
                <small v-if="entry.chinese">{{ entry.chinese }}</small>
              </NuxtLink>
              <span v-else class="edge-link edge-link--ghost">
                <span>{{ entry.title }}</span>
                <small v-if="entry.chinese">{{ entry.chinese }}</small>
              </span>
            </div>
            <div class="edge-row__cat">
              <span>{{ entry.category || 'Unsorted art' }}</span>
              <small>{{ entry.importance || 'background' }}</small>
            </div>
            <div class="edge-row__status">
              <span>{{ normalizeVerification(entry.verificationStatus) }}</span>
              <small>{{ entry.lastUpdated || 'date pending' }}</small>
            </div>
            <div class="edge-row__tags">
              <span v-for="tag in entry.tags.slice(0, 3)" :key="tag" class="bp-hashtag">{{ tag }}</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <!-- HAMON DIVIDER 3 -->
      <div class="bp-hamon" aria-hidden="true">
        <span class="bp-hamon__line"></span>
        <span class="bp-hamon__glow"></span>
        <span class="bp-hamon__notch"></span>
      </div>

      <!-- POINT ZONE: Related Archives -->
      <section class="bp-zone bp-zone--point" aria-label="Related section links">
        <div class="bp-zone__mist bp-zone__mist--point" aria-hidden="true"></div>
        <div class="bp-zone__mark" aria-hidden="true"><span></span></div>

        <ScrollReveal animation="reveal-fade-up">
          <div class="point-header">
            <span class="bp-eyebrow">Blade point — leaving the manual</span>
            <h2 class="bp-zone-title">Related Archives</h2>
          </div>
        </ScrollReveal>

        <div class="point-exits">
          <ScrollReveal
            v-for="(item, index) in relatedLinks"
            :key="item.link"
            animation="reveal-fade-up"
            :delay="(`stagger-${index + 1}` as any)"
            tag="div"
            class="point-exit-wrap"
          >
            <NuxtLink :to="item.link" class="point-exit" :class="`point-exit--${index + 1}`">
              <span class="point-exit__art" aria-hidden="true">
                <span class="point-exit__char">{{ item.bgChar }}</span>
                <span class="point-exit__slash"></span>
              </span>
              <span class="point-exit__frame" aria-hidden="true"></span>
              <span class="point-exit__copy">
                <span class="point-exit__label">{{ exitLabels[item.link] || 'Archive path' }}</span>
                <strong>{{ item.titleEn }}</strong>
                <small>{{ item.titleZh }}</small>
              </span>
            </NuxtLink>
          </ScrollReveal>
        </div>
      </section>

      <!-- BLADE TIP CLOSE -->
      <div class="bp-tip-close" aria-hidden="true">
        <span class="bp-tip-close__line"></span>
        <span class="bp-tip-close__blade"></span>
        <span class="bp-tip-close__line"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===========================
   BLADE PATH DESCENT — V3
   =========================== */

.blade-path {
  --bp-bg: #080f16;
  --bp-bg-deep: #050a10;
  --bp-mist: #0e1e2a;
  --bp-mist-mid: #132a38;
  --bp-ink: #c8dce6;
  --bp-ink-soft: #9ab8c8;
  --bp-ink-muted: #8fb3c4;
  --bp-steel: #4a7284;
  --bp-jade: #7ab4a4;
  --bp-jade-soft: rgba(122, 180, 164, 0.15);
  --bp-cinnabar: #cc5248;
  --bp-cinnabar-soft: rgba(204, 82, 72, 0.22);
  --bp-blade-light: rgba(190, 225, 230, 0.16);
  --bp-border: rgba(140, 180, 195, 0.14);
  --bp-border-strong: rgba(140, 180, 195, 0.24);

  min-height: 100dvh;
  width: 100%;
  overflow-x: hidden;
  color: var(--bp-ink);
  background: var(--bp-bg);
  scroll-behavior: smooth;
}

.blade-path::selection {
  color: #f0f8ff;
  background: rgba(204, 82, 72, 0.7);
}

/* Skip link */
.bp-skip-link {
  position: fixed;
  left: 1rem;
  top: 1rem;
  z-index: 50;
  padding: 0.7rem 1rem;
  min-height: 44px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(204, 82, 72, 0.5);
  color: var(--bp-ink);
  background: rgba(8, 15, 22, 0.95);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-decoration: none;
  text-transform: uppercase;
  transform: translateY(-150%);
  transition: transform 0.2s ease;
}

.bp-skip-link:focus-visible {
  outline: 2px solid var(--bp-cinnabar);
  outline-offset: 0.2rem;
  transform: translateY(0);
}

/* ===========================
   DESCENT BODY
   =========================== */

.bp-descent {
  position: relative;
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  isolation: isolate;
}

/* Vertical blade-core spine */
.bp-spine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: clamp(2rem, 5vw, 5rem);
  width: 3px;
  z-index: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(122, 180, 164, 0.4) 4%,
    rgba(204, 82, 72, 0.6) 25%,
    rgba(122, 180, 164, 0.4) 50%,
    rgba(204, 82, 72, 0.5) 75%,
    rgba(122, 180, 164, 0.25) 90%,
    transparent 100%
  );
  pointer-events: none;
}

.bp-spine::before {
  content: '';
  position: absolute;
  top: 0;
  left: -4px;
  width: 11px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(190, 225, 230, 0.14) 10%,
    rgba(190, 225, 230, 0.08) 80%,
    transparent
  );
  filter: blur(2px);
  animation: bpSpineGlow 8s ease-in-out infinite alternate;
}

.bp-spine::after {
  content: '';
  position: absolute;
  top: 0;
  left: -10px;
  width: 23px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(204, 82, 72, 0.06) 8%,
    rgba(190, 225, 230, 0.05) 45%,
    rgba(204, 82, 72, 0.06) 82%,
    transparent 100%
  );
  filter: blur(6px);
}

/* ===========================
   ZONES (shared)
   =========================== */

.bp-zone {
  position: relative;
  padding: clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 4vw, 5rem);
  padding-left: max(clamp(1.5rem, 4vw, 5rem), clamp(4rem, 8vw, 8rem));
}

.bp-zone::before {
  content: '';
  position: absolute;
  left: max(clamp(1.5rem, 4vw, 5rem), clamp(4rem, 8vw, 8rem));
  top: 0;
  width: min(52rem, 75%);
  height: 1px;
  background: linear-gradient(90deg,
    rgba(122, 180, 164, 0.35),
    rgba(190, 225, 230, 0.12),
    transparent
  );
  pointer-events: none;
}

.bp-zone::after {
  content: '';
  position: absolute;
  left: max(clamp(1.5rem, 4vw, 5rem), clamp(4rem, 8vw, 8rem));
  bottom: 0;
  width: min(34rem, 50%);
  height: 1px;
  background: linear-gradient(90deg,
    rgba(122, 180, 164, 0.2),
    transparent
  );
  pointer-events: none;
}

.bp-zone__mist {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.bp-zone__mark {
  position: absolute;
  left: clamp(2rem, 5vw, 5rem);
  top: 0;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}

.bp-zone__mark span {
  display: block;
  width: 0.85rem;
  aspect-ratio: 1;
  border: 2px solid rgba(122, 180, 164, 0.6);
  background: var(--bp-bg);
  box-shadow: 0 0 14px rgba(122, 180, 164, 0.2), 0 0 0 3px rgba(8, 15, 22, 0.85);
  transform: rotate(45deg);
  animation: bpMarkPulse 5s ease-in-out infinite alternate;
}

.bp-eyebrow {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--bp-jade);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  line-height: 1.4;
  text-transform: uppercase;
}

.bp-zone-title {
  margin: 0;
  color: var(--bp-ink);
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4.2vw, 4.2rem);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 0.95;
  text-wrap: balance;
}

.bp-empty {
  padding: 2rem;
  border: 1px dashed rgba(122, 180, 164, 0.3);
  color: var(--bp-ink-muted);
  background: rgba(14, 30, 42, 0.5);
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

/* Tags */
.bp-tag {
  display: inline-block;
  padding: 0.32rem 0.52rem;
  border: 1px solid var(--bp-border);
  color: var(--bp-ink-soft);
  background: rgba(14, 30, 42, 0.6);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
}

.bp-tag--cinnabar {
  border-color: var(--bp-cinnabar-soft);
  color: #e07a72;
  background: rgba(204, 82, 72, 0.06);
  opacity: 1;
}

.bp-hashtag {
  color: var(--bp-ink-muted);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.06em;
}

.bp-hashtag::before {
  content: '#';
  color: rgba(122, 180, 164, 0.5);
}

/* CTA */
.bp-cta {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0.75rem 1.1rem;
  border: 1px solid rgba(122, 180, 164, 0.35);
  color: var(--bp-jade);
  background: rgba(14, 30, 42, 0.65);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.12em;
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.22s ease, border-color 0.22s ease, background-color 0.22s ease, transform 0.22s ease;
}

.bp-cta:hover,
.bp-cta:focus-visible {
  border-color: rgba(122, 180, 164, 0.5);
  color: #a8dccb;
  background: rgba(14, 30, 42, 0.85);
  outline: none;
  transform: translateY(-1px);
}

.bp-cta:focus-visible {
  outline: 2px solid var(--bp-cinnabar);
  outline-offset: 0.2rem;
}

.bp-cta--disabled {
  opacity: 0.5;
  cursor: default;
}

/* ===========================
   TANG ZONE
   =========================== */

.bp-zone--tang {
  padding-top: clamp(4rem, 8vw, 7rem);
  background:
    linear-gradient(to bottom,
      rgba(4, 12, 20, 1) 0%,
      rgba(6, 14, 22, 0.98) 40%,
      var(--bp-bg) 100%
    );
}

.bp-zone__mist--tang {
  background:
    radial-gradient(ellipse at 50% 20%, rgba(122, 180, 164, 0.1), transparent 45rem),
    radial-gradient(ellipse at 15% 60%, rgba(204, 82, 72, 0.05), transparent 30rem),
    radial-gradient(ellipse at 85% 75%, rgba(190, 225, 230, 0.05), transparent 28rem),
    linear-gradient(105deg, transparent 0%, transparent 38%, rgba(190, 225, 230, 0.03) 46%, transparent 54%, transparent 100%);
  will-change: transform;
  animation: bpBladeLightDrift 20s ease-in-out infinite alternate;
}

.tang-header {
  margin-bottom: clamp(2rem, 4vw, 3.5rem);
  max-width: 42rem;
}

/* Caged Sparrow plate */
.tang-plate {
  position: relative;
  display: grid;
  grid-template-columns: minmax(16rem, 0.62fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3.5rem);
  overflow: hidden;
  isolation: isolate;
}

.tang-plate__art {
  position: relative;
  min-height: clamp(26rem, 42vw, 38rem);
  border: 1px solid rgba(122, 180, 164, 0.2);
  box-shadow: 0 0 8px rgba(6, 16, 25, 0.5);
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 36%, rgba(190, 225, 230, 0.08), transparent 13rem),
    linear-gradient(160deg, rgba(6, 16, 25, 0.98), rgba(14, 30, 42, 0.9) 48%, rgba(30, 60, 72, 0.5));
}

.tang-plate__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  filter: saturate(0.75) brightness(0.88) contrast(1.08);
}

.tang-plate__wash {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(175deg, rgba(190, 225, 230, 0.1) 0%, transparent 30%),
    linear-gradient(0deg, rgba(6, 16, 25, 0.45) 0%, transparent 40%);
  z-index: 1;
  pointer-events: none;
}

.tang-plate__frame {
  position: absolute;
  inset: 5%;
  border: 1px solid rgba(190, 225, 230, 0.16);
  box-shadow: inset 0 0 0 1px rgba(6, 16, 25, 0.25);
  z-index: 2;
  pointer-events: none;
}

.tang-plate__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 42%, transparent 40%, rgba(6, 16, 25, 0.5) 100%);
  z-index: 3;
  pointer-events: none;
}

.tang-plate__copy {
  position: relative;
  min-width: 0;
  padding: clamp(1rem, 2vw, 1.5rem) 0 clamp(2rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
}

.tang-plate__seal {
  position: absolute;
  top: 0;
  right: 0;
  width: clamp(4.5rem, 8vw, 6rem);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border: 2px solid rgba(204, 82, 72, 0.75);
  color: var(--bp-cinnabar);
  background: rgba(204, 82, 72, 0.06);
  box-shadow: 0 0 15px rgba(204, 82, 72, 0.1);
  transform: rotate(-7deg);
}

.tang-plate__seal span {
  width: min-content;
  font-family: var(--font-zh-display);
  font-size: 0.95rem;
  line-height: 1.05;
  text-align: center;
  writing-mode: vertical-rl;
}

.tang-plate__label {
  margin: 0 0 0.65rem;
  color: var(--bp-jade);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  line-height: 1.3;
  text-transform: uppercase;
}

.tang-plate__title {
  margin: 0;
  color: var(--bp-ink);
  font-family: var(--font-heading);
  font-size: clamp(2.8rem, 5.5vw, 5.8rem);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 0.88;
  text-wrap: balance;
}

.tang-plate__zh {
  margin: 0.4rem 0 0;
  color: #b8d0d8;
  font-family: var(--font-zh-display);
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  line-height: 1;
}

.tang-plate__meta {
  margin-top: clamp(1.2rem, 2.5vw, 1.8rem);
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tang-plate__desc {
  max-width: 54ch;
  margin: clamp(1.1rem, 2.2vw, 1.8rem) 0 0;
  color: var(--bp-ink);
  font-size: clamp(1rem, 1.3vw, 1.1rem);
  line-height: 1.78;
  text-wrap: pretty;
  opacity: 0.92;
}

.tang-plate__marks {
  margin-top: clamp(1.4rem, 3vw, 2.2rem);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--bp-border-strong);
  border-bottom: 1px solid var(--bp-border-strong);
}

.tang-mark {
  padding: 0.9rem 0.85rem;
  display: grid;
  gap: 0.2rem;
  border-right: 1px solid var(--bp-border-strong);
}

.tang-mark:last-child {
  border-right: 0;
}

.tang-mark__label {
  color: var(--bp-jade);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
}

.tang-mark strong {
  color: var(--bp-ink);
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.1;
}

.tang-mark__zh {
  color: var(--bp-ink-muted);
  font-family: var(--font-zh-display);
  font-size: 0.9rem;
  line-height: 1;
}

.tang-mark__state {
  color: #b8d0d8;
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.tang-mark--ghost {
  border: 1px dashed rgba(106, 158, 143, 0.2);
  background: rgba(106, 158, 143, 0.03);
}

.tang-mark--ghost strong {
  color: var(--bp-ink-muted);
}

.tang-plate__tags {
  margin-top: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tang-plate__footer {
  margin-top: auto;
  padding-top: clamp(1.4rem, 3vw, 2.2rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: end;
}

.tang-plate__source {
  max-width: 54ch;
  margin: 0;
  color: var(--bp-ink-soft);
  font-size: 0.84rem;
  font-style: italic;
  line-height: 1.6;
}

/* ===========================
   HAMON DIVIDER
   =========================== */

.bp-hamon {
  position: relative;
  height: clamp(2.5rem, 5vw, 4rem);
  margin: 0 clamp(1.5rem, 4vw, 5rem);
  margin-left: max(clamp(1.5rem, 4vw, 5rem), clamp(4rem, 8vw, 8rem));
  display: flex;
  align-items: center;
}

.bp-hamon__line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(122, 180, 164, 0.3) 5%,
    rgba(204, 82, 72, 0.55) 28%,
    rgba(190, 225, 230, 0.22) 50%,
    rgba(204, 82, 72, 0.4) 72%,
    rgba(122, 180, 164, 0.3) 95%,
    transparent 100%
  );
}

.bp-hamon__glow {
  position: absolute;
  left: 2%;
  right: 2%;
  top: 50%;
  height: 3px;
  background: linear-gradient(90deg,
    transparent,
    rgba(190, 225, 230, 0.16) 18%,
    rgba(190, 225, 230, 0.25) 50%,
    rgba(190, 225, 230, 0.16) 82%,
    transparent
  );
  transform: translateY(-50%);
  filter: blur(4px);
  pointer-events: none;
  animation: bpHamonPulse 6s ease-in-out infinite alternate;
}

.bp-hamon__notch {
  width: 0.8rem;
  aspect-ratio: 1;
  border: 2px solid rgba(204, 82, 72, 0.65);
  background: rgba(14, 30, 42, 0.92);
  box-shadow: 0 0 12px rgba(204, 82, 72, 0.2);
  transform: rotate(45deg);
  flex-shrink: 0;
}

/* ===========================
   SHOULDER ZONE
   =========================== */

.bp-zone--shoulder {
  background:
    linear-gradient(to bottom,
      var(--bp-bg) 0%,
      rgba(12, 22, 34, 0.98) 30%,
      rgba(10, 20, 30, 0.98) 70%,
      var(--bp-bg) 100%
    );
}

.bp-zone__mist--shoulder {
  background:
    radial-gradient(ellipse at 25% 20%, rgba(122, 180, 164, 0.10), transparent 38rem),
    radial-gradient(ellipse at 80% 70%, rgba(204, 82, 72, 0.05), transparent 30rem),
    radial-gradient(ellipse at 50% 45%, rgba(190, 225, 230, 0.04), transparent 32rem),
    radial-gradient(ellipse at 15% 85%, rgba(150, 200, 215, 0.05), transparent 36rem);
}

.shoulder-header {
  margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
  max-width: 42rem;
}

.shoulder-notes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.8rem, 1.8vw, 1.2rem);
}

.shoulder-note {
  position: relative;
  padding: clamp(1.1rem, 2.2vw, 1.5rem) clamp(1rem, 2vw, 1.4rem);
  padding-left: clamp(1.4rem, 2.5vw, 1.8rem);
  border: none;
  border-left: 1px solid rgba(122, 180, 164, 0.25);
  background: linear-gradient(135deg, rgba(14, 30, 42, 0.25), transparent 60%);
  min-height: auto;
  display: grid;
  grid-template-columns: 1.8rem minmax(0, 1fr);
  gap: 0.7rem;
  transition: border-color 0.24s ease;
}

.shoulder-note::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 50%;
  width: clamp(1.2rem, 2.5vw, 2.2rem);
  height: 1px;
  background: rgba(122, 180, 164, 0.25);
  transform: translateX(-100%);
}

.shoulder-note:hover {
  border-left-color: rgba(122, 180, 164, 0.5);
}

.shoulder-note--empty {
  opacity: 0.65;
  border-left-style: dashed;
}

.shoulder-note__stamp {
  width: 1.8rem;
  height: 1.8rem;
  display: grid;
  place-items: center;
  border: 1.5px solid rgba(204, 82, 72, 0.5);
  color: var(--bp-cinnabar);
  background: rgba(204, 82, 72, 0.04);
  font-family: var(--font-zh-display);
  font-size: 0.8rem;
  line-height: 1;
  transform: rotate(-6deg);
  flex-shrink: 0;
  margin-top: 0.15rem;
}

.shoulder-note__copy {
  min-width: 0;
}

.shoulder-note__eyebrow {
  margin: 0;
  color: rgba(122, 180, 164, 0.8);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  line-height: 1.4;
  text-transform: uppercase;
}

.shoulder-note__copy h3 {
  margin: 0.4rem 0 0;
  color: var(--bp-ink);
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.shoulder-note__desc,
.shoulder-note__empty {
  margin: 0.55rem 0 0;
  color: var(--bp-ink-soft);
  font-size: 0.82rem;
  line-height: 1.5;
}

.shoulder-note__list {
  list-style: none;
  margin: 0.85rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}

.shoulder-link {
  position: relative;
  display: grid;
  gap: 0.1rem;
  padding: 0.5rem 0.65rem;
  min-height: 44px;
  border-left: 1px solid rgba(122, 180, 164, 0.2);
  color: var(--bp-ink);
  background: transparent;
  text-decoration: none;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.shoulder-link span {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  line-height: 1.12;
}

.shoulder-link small {
  color: var(--bp-ink-muted);
  font-family: var(--font-zh-display);
  font-size: 0.85rem;
  line-height: 1;
}

.shoulder-link em {
  color: var(--bp-ink-muted);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  font-style: normal;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.shoulder-link:hover,
.shoulder-link:focus-visible {
  border-color: rgba(204, 82, 72, 0.6);
  color: #ddb0ac;
  outline: none;
  transform: translateX(2px);
}

.shoulder-link:focus-visible {
  outline: 2px solid rgba(204, 82, 72, 0.6);
  outline-offset: 0.15rem;
}

.shoulder-link--ghost {
  color: var(--bp-ink-muted);
}

/* ===========================
   EDGE ZONE
   =========================== */

.bp-zone--edge {
  background:
    linear-gradient(to bottom,
      var(--bp-bg) 0%,
      rgba(14, 28, 40, 0.98) 25%,
      rgba(16, 30, 42, 0.97) 75%,
      var(--bp-bg) 100%
    );
}

.bp-zone__mist--edge {
  background:
    radial-gradient(ellipse at 40% 10%, rgba(190, 225, 230, 0.05), transparent 42rem),
    radial-gradient(ellipse at 85% 55%, rgba(122, 180, 164, 0.04), transparent 32rem),
    linear-gradient(90deg, rgba(122, 180, 164, 0.04), transparent 40%);
}

.edge-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.5rem;
  align-items: end;
  margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
}

.edge-header__copy {
  max-width: 42rem;
}

.edge-header__desc {
  margin: 0.7rem 0 0;
  color: var(--bp-ink-muted);
  font-size: 0.92rem;
  line-height: 1.6;
}

.edge-header__count {
  width: 6.5rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  align-content: center;
  border: 1px solid rgba(122, 180, 164, 0.32);
  color: var(--bp-jade);
  background: rgba(122, 180, 164, 0.04);
  transform: rotate(3deg);
  flex-shrink: 0;
}

.edge-header__count strong {
  font-family: var(--font-mono);
  font-size: 1.8rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.edge-header__count span {
  color: #b8d0d8;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.edge-filters {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.edge-filter {
  padding: 0.5rem 0.65rem;
  border: 1px dashed var(--bp-border);
  color: var(--bp-ink-soft);
  background: rgba(14, 30, 42, 0.5);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
  cursor: default;
  user-select: none;
}

.edge-ledger {
  position: relative;
  border-top: 2px solid var(--bp-border-strong);
  border-bottom: 1px solid var(--bp-border);
  border-left: 1px solid rgba(122, 180, 164, 0.15);
  background: linear-gradient(180deg, rgba(14, 28, 38, 0.4), rgba(14, 28, 38, 0.12));
  padding-left: 0.8rem;
}

.edge-row {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1.4fr) minmax(0, 0.8fr) minmax(0, 0.8fr) minmax(0, 1fr);
  gap: 0.65rem;
  align-items: center;
  min-height: 4.5rem;
  padding: 0.75rem 0.85rem 0.75rem 0;
  border-bottom: 1px solid rgba(122, 180, 164, 0.08);
  border-left: 1px solid transparent;
  transition: border-color 0.26s ease, transform 0.22s ease, background 0.26s ease;
}

.edge-row:last-child {
  border-bottom: 0;
}

.edge-row:hover {
  border-left-color: rgba(204, 82, 72, 0.5);
  background: linear-gradient(90deg, rgba(204, 82, 72, 0.03), transparent 60%);
  transform: translateX(3px);
}

.edge-row--ghosted {
  opacity: 0.5;
}

.edge-row__index {
  justify-self: center;
  color: #8fb3c4;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

.edge-row__name,
.edge-row__cat,
.edge-row__status,
.edge-row__tags {
  min-width: 0;
}

.edge-link {
  display: grid;
  gap: 0.15rem;
  min-height: 44px;
  padding: 0.4rem 0;
  color: var(--bp-ink);
  text-decoration: none;
  transition: color 0.2s ease;
}

.edge-link span {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.08;
}

.edge-link small {
  color: var(--bp-ink-muted);
  font-family: var(--font-zh-display);
  font-size: 0.88rem;
  line-height: 1;
}

.edge-link:hover,
.edge-link:focus-visible {
  color: var(--bp-cinnabar);
  outline: none;
}

.edge-link:focus-visible {
  outline: 2px solid rgba(204, 82, 72, 0.6);
  outline-offset: 0.15rem;
}

.edge-link--ghost {
  color: var(--bp-ink-muted);
}

.edge-row__cat,
.edge-row__status {
  display: grid;
  gap: 0.22rem;
}

.edge-row__cat span,
.edge-row__status span {
  color: var(--bp-ink-soft);
  font-size: 0.82rem;
  line-height: 1.25;
}

.edge-row__cat small,
.edge-row__status small {
  color: var(--bp-ink-muted);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.9;
}

.edge-row__status span {
  color: var(--bp-jade);
}

.edge-row__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.edge-row__tags span {
  padding: 0.2rem 0.38rem;
  border: 1px solid var(--bp-border);
  background: rgba(14, 30, 42, 0.4);
}

/* ===========================
   POINT ZONE
   =========================== */

.bp-zone--point {
  padding-bottom: clamp(3rem, 6vw, 5rem);
  background:
    linear-gradient(to bottom,
      var(--bp-bg) 0%,
      rgba(6, 12, 20, 0.98) 40%,
      rgba(4, 8, 14, 1) 100%
    );
}

.bp-zone__mist--point {
  background:
    radial-gradient(ellipse at 50% 0%, rgba(122, 180, 164, 0.06), transparent 40rem),
    radial-gradient(ellipse at 80% 60%, rgba(204, 82, 72, 0.04), transparent 28rem),
    radial-gradient(ellipse at 20% 80%, rgba(190, 225, 230, 0.04), transparent 32rem);
}

.bp-zone--point::before {
  background: linear-gradient(90deg,
    rgba(122, 180, 164, 0.3),
    rgba(204, 82, 72, 0.15),
    transparent
  );
}

.point-header {
  margin-bottom: clamp(2rem, 4vw, 3rem);
  max-width: 42rem;
}

.point-exits {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.8rem, 2vw, 1.2rem);
}

.point-exit {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 44px;
  padding: 1.1rem 1rem;
  border: 1px solid var(--bp-border-strong);
  border-top: 2px solid rgba(204, 82, 72, 0.35);
  background: linear-gradient(180deg, rgba(8, 18, 28, 0.85), rgba(4, 10, 18, 0.95));
  text-decoration: none;
  transition: border-color 0.22s ease, background 0.22s ease, transform 0.22s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.point-exit:hover,
.point-exit:focus-visible {
  border-top-color: var(--bp-cinnabar);
  background: rgba(14, 28, 42, 0.92);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.point-exit:focus-visible {
  outline: 2px solid var(--bp-cinnabar);
  outline-offset: 0.2rem;
}

.point-exit__art {
  position: relative;
  height: 3.5rem;
  margin-bottom: 0.85rem;
  overflow: hidden;
}

.point-exit__char {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--font-zh-display);
  font-size: 3.5rem;
  line-height: 1;
  color: rgba(122, 180, 164, 0.32);
  transition: color 0.22s ease;
}

.point-exit:hover .point-exit__char,
.point-exit:focus-visible .point-exit__char {
  color: rgba(122, 180, 164, 0.5);
}

.point-exit__slash {
  position: absolute;
  top: 0;
  left: -30%;
  width: 160%;
  height: 2px;
  background:
    linear-gradient(90deg, transparent, rgba(204, 82, 72, 0.45) 48%, rgba(190, 225, 230, 0.15) 100%),
    url('/images/ui/purchased/ink/ink-divider-rough-01.webp');
  background-size: 100% 100%, cover;
  transform: rotate(-13deg);
  filter: hue-rotate(172deg) saturate(0.6);
  opacity: 0.6;
  pointer-events: none;
}

.point-exit__frame {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(140, 180, 195, 0.12);
  pointer-events: none;
}

.point-exit__copy {
  display: grid;
  gap: 0.25rem;
}

.point-exit__label {
  color: rgba(122, 180, 164, 0.7);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  line-height: 1;
}

.point-exit strong {
  color: var(--bp-ink);
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.1;
  transition: color 0.22s ease;
}

.point-exit:hover strong,
.point-exit:focus-visible strong {
  color: var(--bp-ink);
}

.point-exit small {
  color: var(--bp-ink-muted);
  font-family: var(--font-zh-display);
  font-size: 0.85rem;
  line-height: 1;
}

/* ===========================
   BLADE TIP CLOSE
   =========================== */

.bp-tip-close {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: clamp(2.5rem, 5vw, 4rem) 0 clamp(1.5rem, 3vw, 2.5rem);
}

.bp-tip-close__line {
  width: 3rem;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(122, 180, 164, 0.2), transparent);
}

.bp-tip-close__blade {
  width: 1px;
  height: 1.5rem;
  background: linear-gradient(to bottom, rgba(204, 82, 72, 0.4), rgba(204, 82, 72, 0.1));
}

/* ===========================
   KEYFRAME ANIMATIONS
   =========================== */

@keyframes bpSpineGlow {
  from { opacity: 0.6; }
  to { opacity: 1; }
}

@keyframes bpMarkPulse {
  from {
    box-shadow: 0 0 10px rgba(122, 180, 164, 0.15), 0 0 0 3px rgba(8, 15, 22, 0.85);
    transform: rotate(45deg) scale(0.92);
  }
  to {
    box-shadow: 0 0 18px rgba(122, 180, 164, 0.28), 0 0 0 3px rgba(8, 15, 22, 0.85);
    transform: rotate(45deg) scale(1.04);
  }
}

@keyframes bpBladeLightDrift {
  from { transform: scale(1.03) translate3d(-1.5%, 0, 0); }
  to { transform: scale(1.06) translate3d(1.5%, -1%, 0); }
}

@keyframes bpHamonPulse {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

/* ===========================
   RESPONSIVE: TABLET
   =========================== */

@media (max-width: 1024px) {
  .tang-plate {
    grid-template-columns: 1fr;
  }

  .tang-plate__art {
    min-height: 20rem;
  }

  .tang-plate__copy {
    padding-right: 0;
  }

  .tang-plate__title {
    font-size: clamp(2.5rem, 8vw, 4.5rem);
  }

  .tang-plate__seal {
    width: 3.8rem;
  }

  .tang-plate__marks {
    grid-template-columns: 1fr;
  }

  .tang-mark {
    border-right: 0;
    border-bottom: 1px solid var(--bp-border-strong);
  }

  .tang-mark:last-child {
    border-bottom: 0;
  }

  .shoulder-note {
    grid-template-columns: 1.8rem 1fr;
  }

  .shoulder-notes {
    grid-template-columns: 1fr;
  }

  .edge-row {
    grid-template-columns: 2.2rem minmax(0, 1fr);
    gap: 0.65rem 0.8rem;
    align-items: start;
    padding: 0.8rem 0.75rem 0.8rem 0;
  }

  .edge-row__cat,
  .edge-row__status,
  .edge-row__tags {
    grid-column: 2;
  }

  .point-exits {
    grid-template-columns: 1fr;
  }
}

/* ===========================
   RESPONSIVE: MOBILE
   =========================== */

@media (max-width: 560px) {
  .bp-zone {
    padding: clamp(2rem, 5vw, 3.5rem) clamp(0.8rem, 3vw, 1.5rem);
    padding-left: clamp(2.5rem, 6vw, 3.5rem);
  }

  .bp-spine {
    left: 1rem;
    width: 2px;
  }

  .bp-hamon {
    margin: 0 clamp(0.8rem, 3vw, 1.5rem);
    margin-left: clamp(2.5rem, 6vw, 3.5rem);
  }

  .tang-plate__art {
    min-height: 18rem;
  }

  .tang-plate__title {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  .tang-plate__seal {
    width: 3.8rem;
  }

  .tang-plate__footer {
    grid-template-columns: 1fr;
  }

  .bp-cta {
    justify-self: start;
  }

  .edge-header__count {
    width: 4.8rem;
  }

  .edge-header__count strong {
    font-size: 1.4rem;
  }
}

/* ===========================
   REDUCED MOTION
   =========================== */

@media (prefers-reduced-motion: reduce) {
  .bp-skip-link {
    transition: none;
  }

  .bp-cta,
  .bp-cta:focus-visible {
    transition: none;
  }

  .shoulder-link,
  .shoulder-link:focus-visible,
  .edge-row,
  .point-exit,
  .point-exit:focus-visible {
    transition: none;
  }

  .point-exit:hover,
  .point-exit:focus-visible {
    transform: none;
  }

  .bp-zone__mark span {
    animation: none;
  }

  .bp-spine::before {
    animation: none;
  }

  .bp-zone__mist--tang,
  .bp-hamon__glow {
    animation: none;
  }
}
</style>
