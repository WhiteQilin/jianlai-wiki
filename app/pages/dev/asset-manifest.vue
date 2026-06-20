<script setup lang="ts">
import {
  ASSET_MANIFEST_VERSION,
  ASSET_COUNT,
  getAssetsByRole,
  getAssetsForSection,
  getPortraitAssets,
  getAssetsByPriority,
  getAssetById,
  getDistinctMoods,
  getRolesInManifest,
  type AssetEntry,
  type AssetRole,
  type SectionFit,
  type Priority,
} from '~/utils/assetManifest'

if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useSeoMeta({
  title: `Asset Manifest | Jian Lai Wiki`,
})

const allAssets = [
  ...getAssetsByPriority('p0'),
  ...getAssetsByPriority('p1'),
  ...getAssetsByPriority('p2'),
  ...getAssetsByPriority('p3'),
]

const roles = getRolesInManifest()
const moods = getDistinctMoods()
const sections: SectionFit[] = [
  'home', 'characters', 'world', 'cultivation', 'swordsmanship',
  'factions', 'artifacts', 'timeline', 'rankings', 'teachings', 'glossary', 'pantheon',
]

const selectedRole = ref<AssetRole | 'all'>('all')
const selectedSection = ref<SectionFit | 'all'>('all')
const selectedPriority = ref<Priority | 'all'>('all')
const searchQuery = ref('')

const filteredAssets = computed(() => {
  let result = allAssets

  if (selectedRole.value !== 'all') {
    result = result.filter((a) => a.role === selectedRole.value)
  }
  if (selectedSection.value !== 'all') {
    result = result.filter(
      (a) => a.sectionFit.includes(selectedSection.value as SectionFit) || a.sectionFit.includes('global'),
    )
  }
  if (selectedPriority.value !== 'all') {
    result = result.filter((a) => a.priority === selectedPriority.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.subject.toLowerCase().includes(q) ||
        a.filePath.toLowerCase().includes(q) ||
        a.recommendedUse.toLowerCase().includes(q),
    )
  }
  return result
})

const groupByRole = computed(() => {
  const groups: Record<string, AssetEntry[]> = {}
  for (const asset of filteredAssets.value) {
    if (!groups[asset.role]) groups[asset.role] = []
    groups[asset.role].push(asset)
  }
  return groups
})

const priorityOrder: Priority[] = ['p0', 'p1', 'p2', 'p3']
const priorityLabel: Record<Priority, string> = {
  p0: 'Required',
  p1: 'High',
  p2: 'Medium',
  p3: 'Nice-to-have',
}

const roleLabel: Record<AssetRole, string> = {
  'hero-atmosphere': 'Hero Atmosphere',
  'dossier-portrait': 'Dossier Portrait',
  'card-art': 'Card Art',
  'background-wash': 'Background Wash',
  'watermark': 'Watermark',
  'section-divider': 'Section Divider',
  'hover-ornament': 'Hover Ornament',
  'button-ornament': 'Button Ornament',
  'seal-stamp': 'Seal Stamp',
  'texture': 'Texture',
  'unusable': 'Unusable',
}

function resolveImageUrl(filePath: string): string {
  // Only show images that exist in public/
  const knownPublicFolders = [
    '/images/textures/', '/images/banners/', '/images/characters/',
    '/images/portalcard/', '/images/timeline/', '/images/ui/generated/',
  ]
  const isKnownPublic = knownPublicFolders.some((f) => filePath.startsWith(f))
  if (!isKnownPublic) return ''
  return filePath
}

const showPreview = (asset: AssetEntry) => {
  const url = resolveImageUrl(asset.filePath)
  return url && !asset.notes?.includes('PROVISIONAL') === false
}
</script>

<template>
  <main class="asset-manifest-page">
    <header class="manifest-header">
      <div class="manifest-header-inner">
        <div>
          <p class="manifest-kicker">Stage 35B — Design Engine</p>
          <h1 class="manifest-title">Asset Manifest</h1>
          <p class="manifest-desc">
            Curated index of <strong>{{ ASSET_COUNT }}</strong> assets across
            <strong>{{ roles.length }}</strong> roles. Source of truth for design-engine image placement.
          </p>
        </div>
        <div class="manifest-meta">
          <span class="meta-badge">v{{ ASSET_MANIFEST_VERSION }}</span>
          <span class="meta-note">Read-only — edits via curation pass</span>
        </div>
      </div>
    </header>

    <!-- Filters -->
    <div class="manifest-filters" role="search" aria-label="Filter manifest assets">
      <div class="filter-group">
        <label class="filter-label" for="role-filter">Role</label>
        <select id="role-filter" v-model="selectedRole" class="filter-select">
          <option value="all">All roles ({{ roles.length }})</option>
          <option v-for="role in roles" :key="role" :value="role">
            {{ roleLabel[role] }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label" for="section-filter">Section</label>
        <select id="section-filter" v-model="selectedSection" class="filter-select">
          <option value="all">All sections</option>
          <option v-for="section in sections" :key="section" :value="section">
            {{ section.charAt(0).toUpperCase() + section.slice(1) }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label" for="priority-filter">Priority</label>
        <select id="priority-filter" v-model="selectedPriority" class="filter-select">
          <option value="all">All priorities</option>
          <option v-for="p in priorityOrder" :key="p" :value="p">
            {{ priorityLabel[p] }}
          </option>
        </select>
      </div>

      <div class="filter-group filter-search">
        <label class="filter-label" for="search-filter">Search</label>
        <input
          id="search-filter"
          v-model="searchQuery"
          type="search"
          placeholder="ID, subject, path..."
          class="filter-input"
        />
      </div>

      <div class="filter-count">
        <strong>{{ filteredAssets.length }}</strong> / {{ ASSET_COUNT }} assets
      </div>
    </div>

    <!-- Grouped asset list -->
    <div v-if="filteredAssets.length > 0" class="manifest-body">
      <section
        v-for="(assets, role) in groupByRole"
        :key="role"
        class="role-group"
        :aria-labelledby="`role-${role}`"
      >
        <header class="role-group-header">
          <h2 :id="`role-${role}`" class="role-group-title">
            {{ roleLabel[role as AssetRole] || role }}
          </h2>
          <span class="role-group-count">{{ assets.length }} assets</span>
        </header>

        <div class="asset-grid">
          <article
            v-for="asset in assets"
            :key="asset.id"
            class="asset-card"
            :class="`priority-${asset.priority}`"
          >
            <!-- Preview (only for known public paths) -->
            <div class="asset-preview">
              <img
                v-if="resolveImageUrl(asset.filePath)"
                :src="resolveImageUrl(asset.filePath)"
                :alt="asset.subject"
                class="asset-preview-img"
                loading="lazy"
              />
              <div v-else class="asset-preview-empty" aria-hidden="true">
                <span>{{ asset.role.charAt(0).toUpperCase() }}</span>
              </div>
            </div>

            <!-- Info -->
            <div class="asset-info">
              <div class="asset-id-row">
                <code class="asset-id">{{ asset.id }}</code>
                <span class="priority-tag" :class="`priority-${asset.priority}`">
                  {{ priorityLabel[asset.priority] }}
                </span>
              </div>

              <p class="asset-subject">{{ asset.subject }}</p>

              <p class="asset-path">
                <code>{{ asset.filePath }}</code>
              </p>

              <div class="asset-meta">
                <span class="meta-item">
                  <span class="meta-key">Mood</span>
                  <span class="meta-val">{{ asset.mood }}</span>
                </span>
                <span class="meta-item">
                  <span class="meta-key">Aspect</span>
                  <span class="meta-val">{{ asset.aspectRatio }}</span>
                </span>
                <span class="meta-item">
                  <span class="meta-key">Crop</span>
                  <span class="meta-val">{{ asset.cropType }}</span>
                </span>
              </div>

              <div class="asset-sections">
                <span
                  v-for="section in asset.sectionFit"
                  :key="section"
                  class="section-tag"
                >{{ section }}</span>
              </div>

              <p class="asset-use"><strong>Use:</strong> {{ asset.recommendedUse }}</p>

              <p v-if="asset.avoidUse" class="asset-avoid">
                <strong>Avoid:</strong> {{ asset.avoidUse }}
              </p>

              <p v-if="asset.notes" class="asset-notes">
                <em>{{ asset.notes }}</em>
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- Empty state -->
    <div v-else class="manifest-empty">
      <p>No assets match the current filters.</p>
      <button class="clear-btn" @click="selectedRole = 'all'; selectedSection = 'all'; selectedPriority = 'all'; searchQuery = ''">
        Clear filters
      </button>
    </div>

    <!-- Archive note -->
    <aside class="archive-note">
      <p>
        <strong>Archive-only pools</strong> (not in manifest — do not reference in components):
      </p>
      <ul>
        <li><code>public/images/weibo-draft/</code> — 796 unreviewed fan-sourced files</li>
        <li><code>public/images/banner-draft/</code> — 170 unreviewed draft banners</li>
        <li><code>public/images/design-references/</code> — 40 design reference screenshots</li>
      </ul>
      <p>These require curation before promotion to the manifest.</p>
    </aside>
  </main>
</template>

<style scoped>
.asset-manifest-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 82% 8%, color-mix(in srgb, var(--c-seal-red) 4%, transparent), transparent 28rem),
    linear-gradient(180deg, var(--c-paper), var(--c-bg-soft));
  padding-bottom: 4rem;
}

/* Header */
.manifest-header {
  border-bottom: 1px solid var(--c-divider);
  background: linear-gradient(180deg, var(--c-bg-soft), transparent);
}

.manifest-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
}

.manifest-kicker {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0 0 0.5rem;
}

.manifest-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 500;
  color: var(--c-ink);
  line-height: 1.1;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

.manifest-desc {
  color: var(--c-text-2);
  font-size: 1rem;
  max-width: 52ch;
  margin: 0;
}

.manifest-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
  flex-shrink: 0;
}

.meta-badge {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  background: var(--c-ink);
  color: var(--c-paper);
  padding: 0.3rem 0.6rem;
  border-radius: 2px;
}

.meta-note {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--c-text-3);
  text-align: right;
}

/* Filters */
.manifest-filters {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem clamp(1rem, 3vw, 2rem);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  border-bottom: 1px solid var(--c-divider);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.filter-search {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--c-text-3);
}

.filter-select,
.filter-input {
  appearance: none;
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  border-radius: 2px;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--c-ink);
  min-width: 160px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:hover,
.filter-input:hover {
  border-color: var(--c-text-3);
}

.filter-input[type="search"] {
  width: 100%;
}

.filter-count {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--c-text-3);
  margin-left: auto;
  align-self: flex-end;
  padding-bottom: 0.5rem;
}

/* Asset groups */
.manifest-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 2rem);
}

.role-group {
  margin: 3rem 0;
}

.role-group-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--c-divider);
}

.role-group-title {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--c-ink);
  margin: 0;
}

.role-group-count {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--c-text-3);
}

/* Asset grid */
.asset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
}

.asset-card {
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.asset-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.asset-card.priority-p0 {
  border-top: 2px solid var(--c-seal-red);
}

.asset-card.priority-p1 {
  border-top: 2px solid color-mix(in srgb, var(--c-seal-red) 60%, transparent);
}

.asset-card.priority-p2 {
  border-top: 2px solid var(--c-bronze);
}

.asset-card.priority-p3 {
  border-top: 1px solid var(--c-border);
}

/* Preview */
.asset-preview {
  width: 100%;
  height: 140px;
  background: var(--c-bg-soft);
  overflow: hidden;
  border-bottom: 1px solid var(--c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
}

.asset-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.asset-preview-empty {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: var(--c-bg-soft);
}

.asset-preview-empty span {
  font-family: var(--font-heading);
  font-size: 3rem;
  color: var(--c-border);
  opacity: 0.5;
}

/* Info */
.asset-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.asset-id-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.asset-id {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--c-teal-accent);
  background: color-mix(in srgb, var(--c-teal-accent) 8%, transparent);
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
  word-break: break-all;
}

.priority-tag {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
  flex-shrink: 0;
}

.priority-tag.priority-p0 {
  background: color-mix(in srgb, var(--c-seal-red) 12%, transparent);
  color: var(--c-seal-red);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 30%, transparent);
}

.priority-tag.priority-p1 {
  background: color-mix(in srgb, var(--c-seal-red) 6%, transparent);
  color: color-mix(in srgb, var(--c-seal-red) 80%, var(--c-ink));
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 20%, transparent);
}

.priority-tag.priority-p2 {
  background: color-mix(in srgb, var(--c-bronze) 10%, transparent);
  color: var(--c-bronze);
  border: 1px solid color-mix(in srgb, var(--c-bronze) 25%, transparent);
}

.priority-tag.priority-p3 {
  background: var(--c-bg-soft);
  color: var(--c-text-3);
  border: 1px solid var(--c-border);
}

.asset-subject {
  font-size: 0.92rem;
  color: var(--c-ink);
  margin: 0;
  font-weight: 500;
}

.asset-path {
  margin: 0;
}

.asset-path code {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--c-text-3);
  word-break: break-all;
}

.asset-meta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.meta-key {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--c-text-3);
}

.meta-val {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--c-ink);
}

.asset-sections {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.section-tag {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  padding: 0.15rem 0.4rem;
  background: color-mix(in srgb, var(--c-ink) 6%, transparent);
  color: var(--c-text-2);
  border-radius: 2px;
}

.asset-use,
.asset-avoid {
  font-size: 0.8rem;
  color: var(--c-text-2);
  margin: 0;
  line-height: 1.5;
}

.asset-avoid {
  color: color-mix(in srgb, var(--c-seal-red) 80%, var(--c-text-2));
}

.asset-notes {
  font-size: 0.78rem;
  color: var(--c-text-3);
  margin: 0;
  font-style: italic;
}

/* Empty */
.manifest-empty {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 clamp(1rem, 3vw, 2rem);
  text-align: center;
  color: var(--c-text-3);
}

.clear-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: transparent;
  border: 1px solid var(--c-border);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--c-ink);
  cursor: pointer;
  border-radius: 2px;
  transition: border-color 0.2s, background 0.2s;
}

.clear-btn:hover {
  border-color: var(--c-ink);
  background: var(--c-bg-soft);
}

/* Archive note */
.archive-note {
  max-width: 1200px;
  margin: 3rem auto 0;
  padding: 1.5rem clamp(1rem, 3vw, 2rem);
  border: 1px dashed var(--c-border);
  border-radius: 2px;
  background: color-mix(in srgb, var(--c-bg-soft) 50%, transparent);
}

.archive-note p {
  font-size: 0.88rem;
  color: var(--c-text-2);
  margin: 0 0 0.5rem;
}

.archive-note p:first-child {
  margin-bottom: 0.75rem;
}

.archive-note ul {
  margin: 0 0 0.75rem;
  padding-left: 1.5rem;
}

.archive-note li {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--c-text-3);
  margin-bottom: 0.25rem;
}

/* Responsive */
@media (max-width: 760px) {
  .manifest-header-inner {
    flex-direction: column;
  }

  .manifest-meta {
    align-items: flex-start;
  }

  .asset-grid {
    grid-template-columns: 1fr;
  }
}
</style>
