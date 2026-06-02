<script setup lang="ts">
/**
 * Media Library — Stage 12C
 *
 * A dev-only slide-in panel for the local editor. It unions the curated R2
 * manifest (app/data/mediaLibrary.ts) with the local scan from
 * `/api/editor/media`, groups by type, and offers copy + insert actions.
 *
 * Safety / scope:
 *  - Dev-only. Rendered only behind `import.meta.dev` by the parent.
 *  - No uploads, no Cloudflare API keys, no file writes.
 *  - Previews and "Copy public URL" resolve through `getMediaUrl`, so the R2
 *    base (NUXT_PUBLIC_MEDIA_BASE_URL) is honored exactly as on the live site.
 *  - Fonts are copy-only: never inserted into body or frontmatter.
 *  - Frontmatter insertion only targets known media fields (image/banner/video).
 */
import { computed, ref } from 'vue'
import { getMediaUrl } from '~/constants/homeHeroVideos'
import {
  MEDIA_LIBRARY,
  mergeWithScan,
  type MediaLibType,
  type MediaScanItem,
  type ResolvedMediaEntry,
} from '~/data/mediaLibrary'

const props = defineProps<{
  open: boolean
  /** Frontmatter media field keys for the current section (image/banner/video). */
  mediaFieldKeys?: string[]
}>()

const emit = defineEmits<{
  close: []
  /** Insert a Markdown media snippet into the body editor. */
  'insert-body': [payload: { path: string; type: 'image' | 'video'; alt?: string }]
  /** Set a frontmatter media field to a path. */
  'set-field': [payload: { key: string; path: string }]
}>()

const { data, pending, error, refresh } = await useFetch<{ success: boolean; media: MediaScanItem[] }>(
  '/api/editor/media',
  { default: () => ({ success: true, media: [] }) },
)

const activeTab = ref<MediaLibType>('image')
const query = ref('')
const groupFilter = ref('')

/** Union manifest + local scan, deduped by path. */
const allEntries = computed<ResolvedMediaEntry[]>(() =>
  mergeWithScan(MEDIA_LIBRARY, data.value?.media || []),
)

const tabCounts = computed(() => {
  const counts: Record<MediaLibType, number> = { image: 0, video: 0, font: 0 }
  for (const entry of allEntries.value) counts[entry.type] += 1
  return counts
})

const groupsForActiveTab = computed(() => {
  const set = new Set<string>()
  for (const entry of allEntries.value) {
    if (entry.type !== activeTab.value) continue
    if (entry.group) set.add(entry.group)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const grp = groupFilter.value
  return allEntries.value.filter((entry) => {
    if (entry.type !== activeTab.value) return false
    if (grp && entry.group !== grp) return false
    if (!q) return true
    const hay = `${entry.path} ${entry.fileName} ${entry.label || ''} ${entry.group || ''}`.toLowerCase()
    return hay.includes(q)
  })
})

function setTab(tab: MediaLibType) {
  activeTab.value = tab
  groupFilter.value = ''
}

const canInsertField = computed(() => (props.mediaFieldKeys?.length || 0) > 0)

// Per-item "which frontmatter field" selection (defaults to first field key).
const fieldChoice = ref<Record<string, string>>({})
function fieldFor(path: string): string {
  return fieldChoice.value[path] || props.mediaFieldKeys?.[0] || ''
}

const copiedPath = ref('')
let copiedTimer: ReturnType<typeof setTimeout> | null = null

async function copyText(text: string, markPath: string, kind: 'url' | 'path') {
  try {
    if (import.meta.client && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    }
    copiedPath.value = `${markPath}:${kind}`
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => { copiedPath.value = '' }, 1400)
  } catch {
    // Clipboard can fail without a user gesture / permissions; ignore silently.
  }
}

function copyUrl(entry: ResolvedMediaEntry) {
  copyText(getMediaUrl(entry.path), entry.path, 'url')
}

function copyPath(entry: ResolvedMediaEntry) {
  copyText(entry.path, entry.path, 'path')
}

function insertBody(entry: ResolvedMediaEntry) {
  if (entry.type === 'font') return
  emit('insert-body', {
    path: entry.path,
    type: entry.type,
    alt: entry.label || entry.fileName,
  })
}

function setField(entry: ResolvedMediaEntry) {
  if (entry.type === 'font') return
  const key = fieldFor(entry.path)
  if (!key) return
  emit('set-field', { key, path: entry.path })
}

function isCopied(path: string, kind: 'url' | 'path') {
  return copiedPath.value === `${path}:${kind}`
}
</script>

<template>
  <transition name="ml-fade">
    <div v-if="open" class="ml-overlay" @click.self="emit('close')">
      <aside class="ml-drawer" role="dialog" aria-label="Media Library">
        <header class="ml-header">
          <div class="ml-title">
            <span class="ml-seal">媒</span>
            <div>
              <h3>Media Library</h3>
              <p class="ml-sub">Curated R2 assets · dev-only · no uploads</p>
            </div>
          </div>
          <button type="button" class="ml-close" aria-label="Close" @click="emit('close')">✕</button>
        </header>

        <div class="ml-tabs" role="tablist">
          <button
            type="button"
            class="ml-tab"
            :class="{ active: activeTab === 'image' }"
            @click="setTab('image')"
          >Images <span class="ml-count">{{ tabCounts.image }}</span></button>
          <button
            type="button"
            class="ml-tab"
            :class="{ active: activeTab === 'video' }"
            @click="setTab('video')"
          >Videos <span class="ml-count">{{ tabCounts.video }}</span></button>
          <button
            type="button"
            class="ml-tab"
            :class="{ active: activeTab === 'font' }"
            @click="setTab('font')"
          >Fonts <span class="ml-count">{{ tabCounts.font }}</span></button>
        </div>

        <div class="ml-filters">
          <input v-model="query" type="text" class="ml-search" placeholder="Search by name, path, group..." />
          <select v-model="groupFilter" class="ml-group-select">
            <option value="">All groups</option>
            <option v-for="g in groupsForActiveTab" :key="g" :value="g">{{ g }}</option>
          </select>
          <button type="button" class="ml-refresh" title="Re-scan local media" @click="refresh()">↻</button>
        </div>

        <div class="ml-body">
          <div v-if="pending" class="ml-state">Loading media…</div>
          <div v-else-if="error" class="ml-state error">Local scan failed; showing curated manifest only.</div>

          <div v-if="!filtered.length" class="ml-state">No matching assets in this tab.</div>

          <div class="ml-grid">
            <article v-for="entry in filtered" :key="entry.path" class="ml-card">
              <div class="ml-preview">
                <img
                  v-if="entry.type === 'image'"
                  :src="getMediaUrl(entry.path)"
                  :alt="entry.label || entry.fileName"
                  loading="lazy"
                />
                <video
                  v-else-if="entry.type === 'video'"
                  :src="getMediaUrl(entry.path)"
                  muted
                  loop
                  playsinline
                  preload="metadata"
                  @mouseenter="(e) => (e.target as HTMLVideoElement).play().catch(() => {})"
                  @mouseleave="(e) => (e.target as HTMLVideoElement).pause()"
                />
                <div v-else class="ml-font-glyph">字</div>

                <span class="ml-badge" :class="entry.local ? 'local' : 'r2'">
                  {{ entry.local ? 'local' : 'R2' }}
                </span>
              </div>

              <div class="ml-meta">
                <div class="ml-name" :title="entry.label || entry.fileName">{{ entry.label || entry.fileName }}</div>
                <div class="ml-path" :title="entry.path">{{ entry.path }}</div>
                <div v-if="entry.note" class="ml-note">{{ entry.note }}</div>
              </div>

              <div class="ml-actions">
                <button type="button" class="ml-btn" @click="copyUrl(entry)">
                  {{ isCopied(entry.path, 'url') ? 'Copied ✓' : 'Copy URL' }}
                </button>
                <button type="button" class="ml-btn" @click="copyPath(entry)">
                  {{ isCopied(entry.path, 'path') ? 'Copied ✓' : 'Copy path' }}
                </button>
              </div>

              <div v-if="entry.type !== 'font'" class="ml-insert">
                <button type="button" class="ml-btn primary" @click="insertBody(entry)">Insert in body</button>
                <div class="ml-field-insert">
                  <select
                    v-if="canInsertField"
                    :value="fieldFor(entry.path)"
                    class="ml-field-select"
                    @change="fieldChoice[entry.path] = ($event.target as HTMLSelectElement).value"
                  >
                    <option v-for="key in mediaFieldKeys" :key="key" :value="key">{{ key }}</option>
                  </select>
                  <button
                    type="button"
                    class="ml-btn"
                    :disabled="!canInsertField"
                    :title="canInsertField ? 'Set this frontmatter field' : 'No media fields for this section'"
                    @click="setField(entry)"
                  >Set field</button>
                </div>
              </div>
              <div v-else class="ml-insert font-note">Copy-only — fonts are not inserted into content.</div>
            </article>
          </div>
        </div>
      </aside>
    </div>
  </transition>
</template>

<style scoped>
.ml-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(20, 18, 16, 0.42);
  display: flex;
  justify-content: flex-end;
}

.ml-drawer {
  width: min(560px, 96vw);
  height: 100%;
  background: var(--c-bg, #fff);
  border-left: 1px solid var(--c-border, #ddd);
  box-shadow: -16px 0 48px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
}

/* --- Header --- */
.ml-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid var(--c-border, #ddd);
}

.ml-title {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.ml-seal {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border: 1.5px solid var(--c-seal-red, #8a1f1f);
  color: var(--c-seal-red, #8a1f1f);
  border-radius: 4px;
  font-family: var(--font-zh-display, serif);
  font-size: 1.3rem;
}

.ml-header h3 {
  margin: 0;
  font-family: var(--font-heading, serif);
  font-size: 1.15rem;
}

.ml-sub {
  margin: 0.1rem 0 0;
  font-family: var(--font-mono, monospace);
  font-size: 0.66rem;
  color: var(--c-text-3, #888);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ml-close {
  border: 1px solid var(--c-border, #ddd);
  background: var(--c-bg-soft, #f5f5f5);
  border-radius: 4px;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.ml-close:hover { border-color: var(--c-seal-red, #8a1f1f); color: var(--c-seal-red, #8a1f1f); }

/* --- Tabs --- */
.ml-tabs {
  display: flex;
  gap: 0.4rem;
  padding: 0.7rem 1.1rem 0;
}

.ml-tab {
  flex: 1;
  padding: 0.5rem 0.6rem;
  border: 1px solid var(--c-border, #ddd);
  border-radius: 6px 6px 0 0;
  background: var(--c-bg-soft, #f5f5f5);
  color: var(--c-text-2, #555);
  font-size: 0.85rem;
  cursor: pointer;
}

.ml-tab.active {
  background: var(--c-seal-red, #8a1f1f);
  color: #fff;
  border-color: var(--c-seal-red, #8a1f1f);
}

.ml-count {
  display: inline-block;
  margin-left: 0.3rem;
  font-family: var(--font-mono, monospace);
  font-size: 0.68rem;
  opacity: 0.8;
}

/* --- Filters --- */
.ml-filters {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.5rem;
  padding: 0.75rem 1.1rem;
  border-bottom: 1px solid var(--c-border, #ddd);
}

.ml-search,
.ml-group-select {
  padding: 0.45rem 0.55rem;
  border: 1px solid var(--c-border, #ddd);
  border-radius: 4px;
  background: var(--c-bg, #fff);
  font-size: 0.85rem;
}

.ml-refresh {
  border: 1px solid var(--c-border, #ddd);
  background: var(--c-bg-soft, #f5f5f5);
  border-radius: 4px;
  width: 2.3rem;
  cursor: pointer;
  font-size: 1rem;
}

/* --- Body / grid --- */
.ml-body {
  flex: 1;
  overflow: auto;
  padding: 0.9rem 1.1rem 1.4rem;
}

.ml-state {
  padding: 0.8rem;
  color: var(--c-text-3, #888);
  font-size: 0.9rem;
}

.ml-state.error { color: #b3261e; }

.ml-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.9rem;
}

.ml-card {
  border: 1px solid var(--c-border, #ddd);
  border-radius: 8px;
  overflow: hidden;
  background: var(--c-bg, #fff);
  display: flex;
  flex-direction: column;
}

.ml-preview {
  position: relative;
  aspect-ratio: 16 / 10;
  background: #111;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.ml-preview img,
.ml-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ml-font-glyph {
  font-family: var(--font-zh-display, serif);
  color: #e8e2d6;
  font-size: 3.4rem;
}

.ml-badge {
  position: absolute;
  top: 0.45rem;
  right: 0.45rem;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-family: var(--font-mono, monospace);
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #fff;
}

.ml-badge.local { background: rgba(40, 110, 70, 0.92); }
.ml-badge.r2 { background: rgba(40, 70, 130, 0.92); }

.ml-meta {
  padding: 0.55rem 0.6rem 0.3rem;
  min-width: 0;
}

.ml-name {
  font-weight: 600;
  font-size: 0.86rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ml-path {
  font-family: var(--font-mono, monospace);
  font-size: 0.68rem;
  color: var(--c-text-3, #888);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ml-note {
  margin-top: 0.25rem;
  font-size: 0.68rem;
  color: var(--c-text-3, #888);
  line-height: 1.35;
}

.ml-actions {
  display: flex;
  gap: 0.4rem;
  padding: 0.4rem 0.6rem;
}

.ml-insert {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0 0.6rem 0.6rem;
}

.ml-insert.font-note {
  font-size: 0.68rem;
  color: var(--c-text-3, #888);
  font-style: italic;
}

.ml-field-insert {
  display: flex;
  gap: 0.4rem;
}

.ml-field-select {
  flex: 1;
  min-width: 0;
  padding: 0.35rem 0.4rem;
  border: 1px solid var(--c-border, #ddd);
  border-radius: 4px;
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  background: var(--c-bg, #fff);
}

.ml-btn {
  flex: 1;
  padding: 0.38rem 0.5rem;
  border: 1px solid var(--c-border, #ddd);
  border-radius: 4px;
  background: var(--c-bg-soft, #f5f5f5);
  color: var(--c-ink, #222);
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
}

.ml-btn:hover:not(:disabled) {
  border-color: var(--c-seal-red, #8a1f1f);
  color: var(--c-seal-red, #8a1f1f);
}

.ml-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ml-btn.primary {
  background: var(--c-ink, #222);
  color: #fff;
  border-color: var(--c-ink, #222);
}

.ml-btn.primary:hover {
  background: var(--c-seal-red, #8a1f1f);
  border-color: var(--c-seal-red, #8a1f1f);
  color: #fff;
}

/* --- Transition --- */
.ml-fade-enter-active,
.ml-fade-leave-active { transition: opacity 0.2s ease; }
.ml-fade-enter-from,
.ml-fade-leave-to { opacity: 0; }
.ml-fade-enter-active .ml-drawer,
.ml-fade-leave-active .ml-drawer { transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1); }
.ml-fade-enter-from .ml-drawer,
.ml-fade-leave-to .ml-drawer { transform: translateX(100%); }
</style>
