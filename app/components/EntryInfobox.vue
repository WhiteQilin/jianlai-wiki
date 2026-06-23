<script setup lang="ts">
import { profileForSection, type InfoboxFieldProfile } from '~/data/entryInfoboxProfiles'
import { createEntryResolver, humanizePlainValue, type EntryRecordLike, type ResolvedEntryLink } from '~/utils/entryLinkResolver'
import { resolvePublicImage } from '~/utils/publicMedia'
import ImageWashFrame from '~/components/ui/ImageWashFrame.vue'
import CinnabarTag from '~/components/ui/CinnabarTag.vue'

interface DisplayField {
  key: string
  label: string
  kind: InfoboxFieldProfile['kind']
  subtle?: boolean
  value?: string
  valueLink?: ResolvedEntryLink
  values?: ResolvedEntryLink[]
  relationships?: Array<{ name: string; relation: string; link: ResolvedEntryLink | null }>
  rankings?: Array<{ rank?: string | number; name: string; note?: string; link: ResolvedEntryLink | null }>
}

const props = defineProps<{
  page: Record<string, any>
  section: string
  entries?: EntryRecordLike[]
}>()

const profile = computed(() => profileForSection(props.section))
const resolver = computed(() => createEntryResolver(props.entries || []))

const fallbackChar = computed(() => {
  const p = props.page || {}
  return p.seal || p.chinese?.charAt(0) || p.title?.charAt(0) || '鉴'
})

const heroMode = computed(() => profile.value.imageMode)
const resolvedImage = computed(() => resolvePublicImage(props.page?.image))

const PUBLIC_VALUE_LABELS: Record<string, Record<string, string>> = {
  verificationStatus: {
    verified: 'Verified',
    'to-be-verified': 'To Be Verified',
    disputed: 'Disputed',
    speculative: 'Speculative',
  },
  importance: {
    primary: 'Primary',
    major: 'Major',
    minor: 'Minor',
    background: 'Background',
  },
}

const STATUS_TONE_MAP: Record<string, 'jade' | 'cinnabar' | 'bronze' | 'ghost'> = {
  alive: 'jade',
  '存世': 'jade',
  active: 'jade',
  deceased: 'ghost',
  dead: 'ghost',
  '已故': 'ghost',
  'destroyed': 'ghost',
  'destroyed / merged': 'ghost',
  lost: 'ghost',
  missing: 'ghost',
  '下落不明': 'ghost',
  unknown: 'ghost',
  '未详': 'ghost',
  'to be verified': 'bronze',
  '待考证': 'bronze',
  verified: 'cinnabar',
  '已校验': 'cinnabar',
  disputed: 'bronze',
  speculative: 'ghost',
}

const VERIFICATION_TONE_MAP: Record<string, 'cinnabar' | 'bronze' | 'ghost'> = {
  verified: 'cinnabar',
  'to be verified': 'bronze',
  disputed: 'bronze',
  speculative: 'ghost',
  unknown: 'ghost',
}

function isEmptyValue(value: unknown, field?: InfoboxFieldProfile): boolean {
  if (value == null) return true
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return true
    const hidden = field?.hideValues || ['', 'unknown', 'n/a', 'none', 'null', 'undefined']
    if (field?.key === 'status' && ['published', 'draft'].includes(trimmed.toLowerCase())) return true
    return hidden.some((candidate) => candidate.toLowerCase() === trimmed.toLowerCase())
  }
  if (Array.isArray(value)) {
    return value.every((item) => {
      if (item == null) return true
      if (typeof item === 'string') return isEmptyValue(item, field)
      if (typeof item === 'object') {
        const record = item as Record<string, unknown>
        return Object.values(record).every((child) => isEmptyValue(child, field))
      }
      return false
    })
  }
  return false
}

function toValueArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' || typeof value === 'number') return [value]
  return []
}

function resolveTextValue(value: unknown, field?: InfoboxFieldProfile): string {
  if (typeof value === 'number') return `${value}`
  if (typeof value === 'string') {
    const raw = value.trim()
    const mapped = field?.key ? PUBLIC_VALUE_LABELS[field.key]?.[raw] : undefined
    return mapped || humanizePlainValue(raw)
  }
  return ''
}

function normalizeStatusKey(value: string): string {
  return value.trim().toLowerCase()
}

function statusToneFor(field: DisplayField): 'jade' | 'cinnabar' | 'bronze' | 'ghost' | null {
  if (field.kind !== 'badge' || !field.value) return null
  if (field.key === 'status') {
    return STATUS_TONE_MAP[normalizeStatusKey(field.value)] || 'ghost'
  }
  if (field.key === 'verificationStatus') {
    return VERIFICATION_TONE_MAP[normalizeStatusKey(field.value)] || 'ghost'
  }
  return null
}

function resolveList(value: unknown, field: InfoboxFieldProfile): ResolvedEntryLink[] {
  const values = toValueArray(value)
  const max = field.maxItems || values.length
  return values
    .map((item) => {
      if (typeof item === 'number') return resolver.value.resolveEntryLink(`${item}`)
      if (typeof item !== 'string' || isEmptyValue(item, field)) return null
      return resolver.value.resolveEntryLink(item)
    })
    .filter((item): item is ResolvedEntryLink => Boolean(item?.label && !item.isInternalOnly))
    .slice(0, max)
}

function resolveRelationships(value: unknown, field: InfoboxFieldProfile): DisplayField['relationships'] {
  if (!Array.isArray(value)) return []
  const max = field.maxItems || value.length
  return value
    .filter((item) => item && typeof item === 'object' && typeof item.name === 'string' && item.name.trim())
    .map((item) => {
      const name = item.name.trim()
      const explicitLink = typeof item.link === 'string' && item.link.trim() ? item.link.trim() : ''
      const linked = explicitLink ? resolver.value.resolveEntryLink(explicitLink) : null
      return {
        name,
        relation: typeof item.relation === 'string' ? item.relation.trim() : '',
        link: linked && !linked.isInternalOnly ? linked : null,
      }
    })
    .filter((item) => item.name || item.link)
    .slice(0, max)
}

function resolveRankings(value: unknown, field: InfoboxFieldProfile): DisplayField['rankings'] {
  if (!Array.isArray(value)) return []
  const max = field.maxItems || value.length
  return value
    .filter((item) => item && typeof item === 'object' && typeof item.name === 'string' && item.name.trim())
    .map((item) => {
      const link = typeof item.link === 'string' && item.link.trim()
        ? resolver.value.resolveEntryLink(item.link)
        : null
      return {
        rank: typeof item.rank === 'string' || typeof item.rank === 'number' ? item.rank : undefined,
        name: item.name.trim(),
        note: typeof item.note === 'string' ? item.note.trim() : '',
        link: link && !link.isInternalOnly ? link : null,
      }
    })
    .slice(0, max)
}

function buildField(field: InfoboxFieldProfile): DisplayField | null {
  const raw = props.page?.[field.key]
  if (isEmptyValue(raw, field)) return null

  if (field.kind === 'relationship-row') {
    const relationships = resolveRelationships(raw, field)
    if (!relationships?.length) return null
    return { key: field.key, label: field.label, kind: field.kind, subtle: field.subtle, relationships }
  }

  if (field.kind === 'ranking-list') {
    const rankings = resolveRankings(raw, field)
    if (!rankings?.length) return null
    return { key: field.key, label: field.label, kind: field.kind, subtle: field.subtle, rankings }
  }

  if (field.kind === 'list') {
    const values = resolveList(raw, field)
    if (!values.length) return null
    return { key: field.key, label: field.label, kind: field.kind, subtle: field.subtle, values }
  }

  if (field.kind === 'route-link') {
    const value = resolver.value.resolveEntryLink(typeof raw === 'string' ? raw : resolveTextValue(raw, field))
    if (!value || value.isInternalOnly) return null
    return { key: field.key, label: field.label, kind: field.kind, subtle: field.subtle, valueLink: value }
  }

  const value = resolveTextValue(raw, field)
  if (!value) return null
  return { key: field.key, label: field.label, kind: field.kind, subtle: field.subtle, value }
}

const mainFields = computed(() => profile.value.fields.map(buildField).filter((field): field is DisplayField => Boolean(field)))
const footerFields = computed(() => (profile.value.footerFields || []).map(buildField).filter((field): field is DisplayField => Boolean(field)))
const hasContent = computed(() => Boolean(resolvedImage.value) || mainFields.value.length > 0 || footerFields.value.length > 0)
</script>

<template>
  <aside v-if="hasContent" class="entry-infobox" :class="`mode-${heroMode}`">
    <div class="infobox-heading">
      <UiSealStamp :text="fallbackChar" variant="carved" size="sm" writing="vertical" :decorative="true" />
      <div>
        <p class="eyebrow">{{ profile.title }}</p>
        <h2>{{ page?.title }}</h2>
      </div>
    </div>

    <div class="infobox-image-wrapper" :class="`image-${heroMode}`">
      <ImageWashFrame
        v-if="resolvedImage"
        :src="resolvedImage"
        :alt="page?.title || 'Entry portrait'"
        :aspect="heroMode === 'portrait' ? '3:4' : heroMode === 'landscape' ? '16:9' : '3:2'"
        :wash="heroMode === 'portrait' ? 'cloth' : 'mist'"
        :wash-opacity="heroMode === 'portrait' ? 0.12 : 0.08"
        :frame="true"
        scale="cover"
      />
      <div v-else class="infobox-placeholder" aria-hidden="true">
        <span class="placeholder-char">{{ fallbackChar }}</span>
      </div>
    </div>

    <div class="infobox-content">
      <div class="infobox-texture"></div>

      <div
        v-for="field in mainFields"
        :key="field.key"
        class="infobox-row"
        :class="[`kind-${field.kind}`, { 'is-subtle': field.subtle }]"
      >
        <span class="row-label">{{ field.label }}</span>

        <CinnabarTag
          v-if="field.value && field.kind === 'badge' && statusToneFor(field)"
          :tone="statusToneFor(field)!"
          size="sm"
          :dot="field.key === 'status' || field.key === 'verificationStatus'"
        >{{ field.value }}</CinnabarTag>
        <CinnabarTag v-else-if="field.value && field.kind === 'badge'" tone="section" size="sm">{{ field.value }}</CinnabarTag>
        <CinnabarTag v-else-if="field.value && field.kind === 'chip'" tone="ghost" size="sm">{{ field.value }}</CinnabarTag>
        <span v-else-if="field.value" class="row-value">{{ field.value }}</span>

        <RouteDisplayLink
          v-else-if="field.valueLink"
          :item="field.valueLink"
          variant="text"
        />

        <div v-else-if="field.values?.length" class="chip-list">
          <RouteDisplayLink
            v-for="item in field.values"
            :key="`${field.key}-${item.raw}`"
            :item="item"
            variant="chip"
          />
        </div>

        <div v-else-if="field.relationships?.length" class="relationship-list">
          <div v-for="relationship in field.relationships" :key="`${relationship.name}-${relationship.relation}`" class="relationship-item">
            <RouteDisplayLink
              v-if="relationship.link"
              :item="{ ...relationship.link, label: relationship.name }"
              variant="row"
            />
            <span v-else class="relationship-name">{{ relationship.name }}</span>
            <span v-if="relationship.relation" class="relationship-relation">{{ relationship.relation }}</span>
          </div>
        </div>

        <div v-else-if="field.rankings?.length" class="ranking-list">
          <div v-for="entry in field.rankings" :key="`${entry.rank || ''}-${entry.name}`" class="ranking-item">
            <span v-if="entry.rank" class="ranking-rank">{{ entry.rank }}</span>
            <RouteDisplayLink
              v-if="entry.link"
              :item="{ ...entry.link, label: entry.name }"
              variant="row"
            />
            <span v-else class="ranking-name">{{ entry.name }}</span>
            <span v-if="entry.note" class="ranking-note">{{ entry.note }}</span>
          </div>
        </div>
      </div>

      <div v-if="footerFields.length" class="infobox-footer">
        <div v-for="field in footerFields" :key="field.key" class="footer-row">
          <span class="footer-label">{{ field.label }}</span>
          <CinnabarTag
            v-if="field.value && field.key === 'verificationStatus' && statusToneFor(field)"
            :tone="statusToneFor(field)!"
            size="sm"
            dot
          >{{ field.value }}</CinnabarTag>
          <CinnabarTag v-else-if="field.value && field.kind === 'badge'" tone="section" size="sm">{{ field.value }}</CinnabarTag>
          <span v-else-if="field.value" class="footer-value">{{ field.value }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.entry-infobox {
  width: 100%;
  overflow: hidden;
  position: relative;
  border: 1px solid color-mix(in srgb, var(--c-border) 70%, transparent);
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--c-paper) 88%, transparent), color-mix(in srgb, var(--c-bg-soft) 96%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-blend-mode: normal, multiply;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.07);
}

.dark .entry-infobox {
  background-blend-mode: normal, screen;
}

.infobox-heading {
  display: flex;
  gap: 0.72rem;
  align-items: center;
  padding: 0.78rem 0.85rem 0.65rem;
  border-bottom: 1px solid color-mix(in srgb, var(--c-divider) 72%, transparent);
}

.eyebrow {
  margin: 0 0 0.16rem;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.infobox-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.02rem;
  font-weight: 500;
  line-height: 1.18;
}

.infobox-image-wrapper {
  position: relative;
  width: 100%;
  border-bottom: 1px solid color-mix(in srgb, var(--c-divider) 72%, transparent);
  background: var(--c-bg);
}

.image-portrait {
  aspect-ratio: 3 / 4;
  max-height: min(34dvh, 320px);
  display: flex;
  align-items: stretch;
}

.image-landscape {
  aspect-ratio: 16 / 9;
  max-height: min(28dvh, 240px);
  display: flex;
  align-items: stretch;
}

.image-seal {
  aspect-ratio: 3 / 2;
  max-height: min(22dvh, 180px);
  display: flex;
  align-items: stretch;
}

.infobox-image-wrapper :deep(.image-wash-frame) {
  width: 100%;
  margin: 0;
}

.infobox-image-wrapper :deep(.image-wash-frame__inner) {
  height: 100%;
  border-color: color-mix(in srgb, var(--jl-section-frame) 70%, var(--c-border));
}

.infobox-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 50% 38%, color-mix(in srgb, var(--c-paper) 68%, transparent), transparent 62%),
    url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.92;
}

.placeholder-char {
  color: color-mix(in srgb, var(--c-seal-red) 65%, transparent);
  font-family: var(--font-heading);
  font-size: clamp(3.25rem, 11vw, 6rem);
  line-height: 1;
  border: 0.08em solid color-mix(in srgb, var(--c-seal-red) 45%, transparent);
  padding: 0.15em 0.25em;
  border-radius: 0.1em;
  transform: rotate(-3deg);
  background: color-mix(in srgb, var(--c-paper) 40%, transparent);
}

.infobox-content {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0.82rem 0.85rem;
}

.infobox-texture {
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.045;
  pointer-events: none;
}

.infobox-row {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.32rem;
  padding: 0.62rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--c-divider) 74%, transparent);
}

.infobox-row:first-of-type {
  padding-top: 0;
}

.infobox-row:last-of-type {
  border-bottom: 0;
}

.row-label,
.footer-label {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.row-value {
  color: var(--c-ink);
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.38;
}

.chip-list,
.relationship-list,
.ranking-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.34rem;
}

.relationship-list,
.ranking-list {
  flex-direction: column;
  align-items: stretch;
}

.relationship-item,
.ranking-item {
  display: flex;
  flex-direction: column;
  gap: 0.16rem;
  padding: 0.42rem 0.52rem;
  background: color-mix(in srgb, var(--c-bg-soft) 70%, transparent);
  border-left: 2px solid color-mix(in srgb, var(--c-seal-red) 45%, transparent);
}

.relationship-name,
.ranking-name {
  color: var(--c-ink);
  font-weight: 600;
}

.relationship-relation,
.ranking-note {
  color: var(--c-text-3);
  font-size: 0.76rem;
  line-height: 1.3;
}

.ranking-rank {
  color: var(--c-seal-red);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.infobox-footer {
  position: relative;
  z-index: 1;
  margin-top: 0.42rem;
  padding-top: 0.58rem;
  border-top: 1px dashed color-mix(in srgb, var(--c-divider) 78%, transparent);
}

.footer-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.24rem 0;
}

.footer-value {
  color: var(--c-text-2);
  font-size: 0.72rem;
  text-align: right;
}

@media (max-width: 1024px) {
  .entry-infobox {
    max-width: none;
  }

  .infobox-image-wrapper {
    max-height: 360px;
  }
}
</style>
