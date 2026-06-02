<script setup lang="ts">
import { computed, ref } from 'vue'
import { getMediaUrl } from '~/constants/homeHeroVideos'
import {
  MEDIA_LIBRARY,
  mergeWithScan,
  extOf,
  type MediaScanItem,
  type ResolvedMediaEntry,
} from '~/data/mediaLibrary'

const props = defineProps<{
  modelValue: string | undefined
  preferredType?: 'image' | 'video'
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const query = ref('')
const folderFilter = ref('')
const typeFilter = ref<'all' | 'image' | 'video'>('all')

const { data, pending, error, refresh } = await useFetch<{ success: boolean; media: MediaScanItem[] }>(
  '/api/editor/media',
  { default: () => ({ success: true, media: [] }) },
)

function refreshMediaList() {
  refresh()
}

const selected = computed({
  get: () => props.modelValue || '',
  set: (v: string) => emit('update:modelValue', v),
})

/**
 * Union the curated R2 manifest with the local scan so frontmatter media fields
 * can reference R2-only assets. Fonts are excluded — this picker is image/video.
 */
const items = computed<ResolvedMediaEntry[]>(() =>
  mergeWithScan(MEDIA_LIBRARY, data.value?.media || []).filter((entry) => entry.type !== 'font'),
)

const folders = computed(() => {
  const set = new Set<string>()
  for (const item of items.value) {
    if (item.folder) set.add(item.folder)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const effectiveType = computed(() => {
  if (typeFilter.value !== 'all') return typeFilter.value
  return props.preferredType || 'all'
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const folder = folderFilter.value
  const type = effectiveType.value

  return items.value.filter((item) => {
    if (type !== 'all' && item.type !== type) return false
    if (folder && item.folder !== folder) return false
    if (!q) return true
    const hay = `${item.path} ${item.fileName} ${item.folder} ${item.label || ''}`.toLowerCase()
    return hay.includes(q)
  })
})

function selectPath(path: string) {
  selected.value = path
}

function clearPath() {
  selected.value = ''
}
</script>

<template>
  <div class="media-picker">
    <label v-if="label" class="picker-label">{{ label }}</label>

    <div class="top-row">
      <input v-model="selected" type="text" class="manual-input" placeholder="/images/... or /videos/curated/..." />
      <button type="button" class="clear-btn" @click="clearPath">Clear</button>
      <button type="button" class="clear-btn" @click="refreshMediaList">Refresh</button>
    </div>

    <div class="filters">
      <input v-model="query" type="text" placeholder="Search by filename/path..." class="search-input" />
      <select v-model="typeFilter" class="type-select">
        <option value="all">All types</option>
        <option value="image">Images</option>
        <option value="video">Videos</option>
      </select>
      <select v-model="folderFilter" class="folder-select">
        <option value="">All folders</option>
        <option v-for="f in folders" :key="f" :value="f">{{ f }}</option>
      </select>
    </div>

    <div v-if="pending" class="loading">Loading media...</div>
    <div v-else-if="error" class="error">Failed to load media list.</div>

    <div v-else class="results">
      <div v-for="item in filtered" :key="item.path" class="item" :class="{ active: selected === item.path }" @click="selectPath(item.path)">
        <div class="thumb" v-if="item.type === 'image'">
          <img :src="getMediaUrl(item.path)" :alt="item.fileName" loading="lazy" />
        </div>
        <div class="thumb video" v-else>🎬</div>
        <div class="meta">
          <div class="name">{{ item.label || item.fileName }}</div>
          <div class="path">{{ item.path }}</div>
          <div class="small">
            {{ item.folder || '/' }} · {{ extOf(item.path) || '—' }} ·
            <span class="src" :class="item.local ? 'local' : 'r2'">{{ item.local ? 'local' : 'R2' }}</span>
          </div>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="empty">No matching assets.</div>
    </div>
  </div>
</template>

<style scoped>
.media-picker { display: flex; flex-direction: column; gap: .6rem; }
.picker-label { font-weight: 600; }
.top-row { display: flex; gap: .5rem; }
.manual-input { flex: 1; padding: .45rem .55rem; border: 1px solid var(--c-border); border-radius: 4px; }
.clear-btn { border: 1px solid var(--c-border); border-radius: 4px; background: var(--c-bg-soft); padding: .45rem .6rem; cursor: pointer; }
.filters { display: grid; grid-template-columns: 1fr auto auto; gap: .5rem; }
.search-input,.type-select,.folder-select { padding: .45rem .55rem; border: 1px solid var(--c-border); border-radius: 4px; }
.results { border: 1px solid var(--c-border); border-radius: 6px; max-height: 320px; overflow: auto; background: var(--c-bg); }
.item { display: flex; gap: .6rem; align-items: center; padding: .5rem; border-bottom: 1px solid var(--c-divider); cursor: pointer; }
.item:last-child { border-bottom: none; }
.item:hover { background: var(--c-bg-soft); }
.src { font-family: var(--font-mono); font-size: .68rem; padding: 0 .3rem; border-radius: 3px; }
.src.local { color: #1f6a44; }
.src.r2 { color: #2c4d86; }
.item.active { outline: 1px solid var(--c-seal-red); background: rgba(138,31,31,.06); }
.thumb { width: 48px; height: 48px; border: 1px solid var(--c-border); border-radius: 4px; overflow: hidden; display:flex; align-items:center; justify-content:center; background:#fff; }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb.video { font-size: 1.2rem; }
.meta { display: flex; flex-direction: column; gap: .15rem; min-width: 0; }
.name { font-weight: 600; }
.path { font-family: var(--font-mono); font-size: .78rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 640px; }
.small { font-size: .72rem; color: var(--c-text-3); }
.loading,.error,.empty { padding: .6rem; color: var(--c-text-3); }
.error { color: #b3261e; }
</style>
