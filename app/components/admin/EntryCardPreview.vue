<script setup lang="ts">
/**
 * EntryCardPreview — Stage 12A
 *
 * Editor-only infobox/card preview driven by the current frontmatter. Helps the
 * editor see whether fields look correct before saving. Not the public design —
 * a compact approximation. Reactive to the live edit form.
 *
 * Two variants:
 *  - 'character' : portrait + seal + name block + status/origin/realm chips + tags + video badge
 *  - generic     : image/seal + name + section-appropriate type chips + description
 *
 * Media paths are resolved through the shared getMediaUrl helper so R2 routing
 * behaves exactly as on the public site.
 */
import { computed } from 'vue'
import { getMediaUrl } from '~/constants/homeHeroVideos'

const props = defineProps<{
  frontmatter: Record<string, any>
}>()

const fm = computed(() => props.frontmatter || {})
const section = computed(() => fm.value.section || '')
const isCharacter = computed(() => section.value === 'characters')

const resolvedImage = computed(() => {
  const img = fm.value.image
  return typeof img === 'string' && img.trim() ? getMediaUrl(img) : ''
})

const sealChar = computed(() => {
  if (fm.value.seal) return String(fm.value.seal)
  const zh = fm.value.chinese
  return typeof zh === 'string' && zh ? zh.charAt(0) : '无'
})

const tagList = computed<string[]>(() => (Array.isArray(fm.value.tags) ? fm.value.tags : []))

/** Section-appropriate stat chips: [label, value] pairs that are present. */
const statChips = computed<Array<{ label: string; value: string }>>(() => {
  const f = fm.value
  const pick = (label: string, key: string) => {
    const v = f[key]
    if (v == null || `${v}`.trim() === '') return null
    return { label, value: String(v) }
  }
  const out: Array<{ label: string; value: string } | null> = []

  out.push(pick('Category', 'category'))
  out.push(pick('Status', 'status'))

  switch (section.value) {
    case 'characters':
      out.push(pick('Origin', 'origin'))
      out.push(pick('Realm', 'realm'))
      break
    case 'factions':
      out.push(pick('Type', 'factionType'))
      out.push(pick('HQ', 'headquarters'))
      break
    case 'world':
      out.push(pick('Type', 'locationType'))
      out.push(pick('Governing', 'governingFaction'))
      break
    case 'cultivation':
      out.push(pick('Path', 'pathType'))
      out.push(pick('Realm Lv', 'realmLevel'))
      break
    case 'swordsmanship':
      out.push(pick('Type', 'abilityType'))
      out.push(pick('Lineage', 'lineage'))
      break
    case 'artifacts':
      out.push(pick('Type', 'artifactType'))
      out.push(pick('Tier', 'tier'))
      break
    case 'timeline':
      out.push(pick('Date', 'date'))
      out.push(pick('Era', 'era'))
      break
    case 'teachings':
      out.push(pick('Type', 'teachingType'))
      break
    case 'pantheon':
      out.push(pick('Being', 'beingType'))
      out.push(pick('Domain', 'domain'))
      break
    case 'glossary':
      out.push(pick('Type', 'termType'))
      break
    case 'rankings':
      out.push(pick('List', 'listType'))
      break
  }

  out.push(pick('Importance', 'importance'))
  return out.filter((x): x is { label: string; value: string } => x !== null)
})

const rankingCount = computed(() =>
  Array.isArray(fm.value.entries) ? fm.value.entries.length : 0,
)
</script>

<template>
  <div class="card-preview" :class="{ character: isCharacter }">
    <div class="preview-tag">Editor Preview</div>

    <!-- Portrait / image -->
    <div class="card-image">
      <img v-if="resolvedImage" :src="resolvedImage" :alt="fm.title || 'preview'" />
      <div v-else class="card-image-placeholder">
        <span>{{ sealChar }}</span>
      </div>
      <span v-if="fm.video" class="video-badge" title="Has PV video">▶ PV</span>
    </div>

    <div class="card-body">
      <div class="name-row">
        <h4 class="card-title">{{ fm.title || 'Untitled' }}</h4>
        <span v-if="fm.seal" class="card-seal">{{ fm.seal }}</span>
      </div>
      <div class="zh-row">
        <span class="card-zh">{{ fm.chinese || '—' }}</span>
        <span v-if="fm.pinyin" class="card-pinyin">{{ fm.pinyin }}</span>
      </div>

      <p v-if="fm.description" class="card-desc">{{ fm.description }}</p>
      <p v-else class="card-desc muted">No description yet.</p>

      <div v-if="statChips.length" class="chips">
        <div v-for="chip in statChips" :key="chip.label" class="chip">
          <span class="chip-label">{{ chip.label }}</span>
          <span class="chip-value">{{ chip.value }}</span>
        </div>
      </div>

      <div v-if="rankingCount" class="ranking-note">
        {{ rankingCount }} ranking entr{{ rankingCount === 1 ? 'y' : 'ies' }}
      </div>

      <div v-if="tagList.length" class="tags">
        <span v-for="t in tagList" :key="t" class="tag">{{ t }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-preview {
  position: sticky;
  top: calc(var(--header-height, 64px) + 1rem);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--c-bg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.preview-tag {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--c-text-3);
  background: var(--c-bg-soft);
  padding: 0.4rem 0.7rem;
  border-bottom: 1px solid var(--c-border);
}

.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: var(--c-bg-soft);
}

.card-preview:not(.character) .card-image {
  aspect-ratio: 16 / 9;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  background-position: center;
}

.card-image-placeholder span {
  font-family: var(--font-zh-display, serif);
  font-size: 4rem;
  color: var(--c-border);
}

.video-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(184, 42, 42, 0.9);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  padding: 2px 7px;
  border-radius: 3px;
}

.card-body {
  padding: 0.85rem 0.95rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
}

.card-title {
  margin: 0;
  font-family: var(--font-heading, serif);
  font-size: 1.25rem;
  color: var(--c-ink);
  line-height: 1.2;
}

.card-seal {
  font-family: var(--font-zh-display, serif);
  color: var(--c-seal-red);
  border: 1px solid var(--c-seal-red);
  background: rgba(184, 42, 42, 0.05);
  padding: 2px 5px;
  font-size: 0.85rem;
  border-radius: 2px;
  flex-shrink: 0;
}

.zh-row {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.card-zh {
  font-family: var(--font-zh-display, serif);
  font-size: 1.1rem;
  color: var(--c-text-2);
}

.card-pinyin {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--c-text-3);
}

.card-desc {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--c-text-2);
}

.card-desc.muted {
  font-style: italic;
  color: var(--c-text-3);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.chip {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 0.2rem 0.45rem;
  min-width: 0;
}

.chip-label {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--c-text-3);
}

.chip-value {
  font-size: 0.78rem;
  color: var(--c-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

.ranking-note {
  font-size: 0.75rem;
  color: var(--c-text-3);
  font-style: italic;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--c-text-2);
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  padding: 1px 6px;
  border-radius: 999px;
}
</style>
