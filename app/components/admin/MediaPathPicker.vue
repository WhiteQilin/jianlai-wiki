<script setup lang="ts">
import { computed, ref } from 'vue'

interface MediaItem {
  publicPath: string
  fileName: string
  folder: string
  extension: string
  type: 'image' | 'video'
  size: number
}

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

const { data, pending, error, refresh } = await useFetch<{ success: boolean; media: MediaItem[] }>('/api/editor/media')

function refreshMediaList() {
  refresh()
}

const selected = computed({
  get: () => props.modelValue || '',
  set: (v: string) => emit('update:modelValue', v),
})

const folders = computed(() => {
  const set = new Set<string>()
  for (const item of data.value?.media || []) {
    if (item.folder) set.add(item.folder)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const effectiveType = computed(() => {
  if (typeFilter.value !== 'all') return typeFilter.value
  return props.preferredType || 'all'
})

const filtered = computed(() => {
  const all = data.value?.media || []
  const q = query.value.trim().toLowerCase()
  const folder = folderFilter.value
  const type = effectiveType.value

  return all.filter((item) => {
    if (type !== 'all' && item.type !== type) return false
    if (folder && item.folder !== folder) return false
    if (!q) return true
    const hay = `${item.publicPath} ${item.fileName} ${item.folder}`.toLowerCase()
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
      <div v-for="item in filtered" :key="item.publicPath" class="item" :class="{ active: selected === item.publicPath }" @click="selectPath(item.publicPath)">
        <div class="thumb" v-if="item.type === 'image'">
          <img :src="item.publicPath" :alt="item.fileName" loading="lazy" />
        </div>
        <div class="thumb video" v-else>🎬</div>
        <div class="meta">
          <div class="name">{{ item.fileName }}</div>
          <div class="path">{{ item.publicPath }}</div>
          <div class="small">{{ item.folder || '/' }} · {{ item.extension }} · {{ item.size }} bytes</div>
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
