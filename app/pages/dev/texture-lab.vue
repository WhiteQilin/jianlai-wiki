<script setup lang="ts">
import {
  getAssetsByRole,
  getAssetById,
  type AssetEntry,
} from '~/utils/assetManifest'

if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useSeoMeta({
  title: 'UI Texture Lab | Jian Lai Wiki',
})

// ── Background palette ──────────────────────────────────────────────
const backgrounds = [
  { id: 'checker', label: 'Checkerboard', css: 'bg-checker' },
  { id: 'parchment', label: 'Parchment', css: 'bg-parchment' },
  { id: 'dark', label: 'Dark Ink', css: 'bg-dark' },
  { id: 'steel', label: 'Steel-Blue', css: 'bg-steel' },
  { id: 'accent', label: 'Section Accent', css: 'bg-accent' },
] as const

const selectedBg = ref<string>('checker')

// ── Asset groups from manifest ──────────────────────────────────────
// Hover brush: hover-ornament with 'brush' in id
const hoverBrushes = computed(() =>
  getAssetsByRole('hover-ornament').filter((a) => a.id.includes('brush')),
)

// Underline: hover-ornament with 'underline' in id
const underlines = computed(() =>
  getAssetsByRole('hover-ornament').filter((a) => a.id.includes('underline')),
)

// Active rings: button-ornament role
const activeRings = computed(() => getAssetsByRole('button-ornament'))

// Cinnabar seals: seal-stamp role
const sealStamps = computed(() => getAssetsByRole('seal-stamp'))

// Slash dividers: section-divider role
const slashDividers = computed(() => getAssetsByRole('section-divider'))

// Hero + card art: hero-atmosphere + card-art, swordsmanship section
const heroCardAssets = computed(() => {
  const hero = getAssetsByRole('hero-atmosphere').filter((a) => a.id.includes('swordsmanship'))
  const card = getAssetsByRole('card-art').filter((a) => a.id.includes('swordsmanship'))
  return [...hero, ...card]
})

// ── Sizing presets ──────────────────────────────────────────────────
const brushSizes = [
  { w: 180, h: 48, label: '180×48 (sm button)' },
  { w: 240, h: 64, label: '240×64 (md button)' },
  { w: 320, h: 80, label: '320×80 (lg button)' },
]

const underlineSizes = [
  { w: 120, h: 8, label: '120×8' },
  { w: 220, h: 12, label: '220×12' },
  { w: 360, h: 14, label: '360×14' },
]

const ringSizes = [
  { s: 40, label: '40×40' },
  { s: 64, label: '64×64' },
]

const sealSizes = [
  { s: 24, label: '24×24' },
  { s: 40, label: '40×40' },
  { s: 64, label: '64×64' },
]

const dividerWidths = [
  { w: 960, h: 40, label: '960×40 (full)' },
  { w: 640, h: 32, label: '640×32 (medium)' },
  { w: 320, h: 24, label: '320×24 (compact)' },
]

// ── Helpers ─────────────────────────────────────────────────────────
function bgStyle(bgId: string): Record<string, string> {
  switch (bgId) {
    case 'checker':
      return {
        backgroundImage:
          'conic-gradient(#d0d0d0 25%,#e8e8e8 0,#e8e8e8 50%,#d0d0d0 0,#d0d0d0 75%,#e8e8e8 0)',
        backgroundSize: '16px 16px',
      }
    case 'parchment':
      return { backgroundColor: '#f7f1e4' }
    case 'dark':
      return { backgroundColor: '#0f1011' }
    case 'steel':
      return { backgroundColor: '#1a202c' }
    case 'accent':
      return { backgroundColor: 'var(--jl-section-accent,#b8472e)' }
    default:
      return {}
  }
}

function priorityBadge(p: string): string {
  return p === 'p0' ? '🔴 P0' : p === 'p1' ? '🟡 P1' : p === 'p2' ? '🟢 P2' : '⚪ P3'
}

function darkSafe(entry: AssetEntry): boolean {
  return !entry.avoidUse.toLowerCase().includes('dark') && !entry.notes?.toLowerCase().includes('matte')
}

function stretchRule(entry: AssetEntry): string {
  const u = (entry.recommendedUse + ' ' + entry.avoidUse).toLowerCase()
  if (u.includes('no vertical stretch') || u.includes('scaleX only')) return 'scaleX only'
  if (u.includes('no free vertical stretch') || u.includes('no stretch')) return 'contain-fit'
  return 'safe'
}
</script>

<template>
  <div class="texture-lab">
    <!-- Header -->
    <header class="lab-header">
      <h1 class="lab-title">UI Texture Lab</h1>
      <p class="lab-subtitle">
        Dev-only QA surface — renders manifest UI texture assets on multiple backgrounds
        at realistic UI sizes. Stage 35D-1C.
      </p>
      <nav class="bg-picker" aria-label="Background selector">
        <button
          v-for="bg in backgrounds"
          :key="bg.id"
          :class="['bg-btn', { active: selectedBg === bg.id }]"
          @click="selectedBg = bg.id"
        >
          {{ bg.label }}
        </button>
      </nav>
    </header>

    <!-- ============================================================ -->
    <!--  1. Hover Brush Marks                                          -->
    <!-- ============================================================ -->
    <section class="group">
      <h2 class="group-title">
        <span class="group-num">01</span> Hover Brush Marks
        <span class="group-role">role: hover-ornament</span>
      </h2>
      <p class="group-desc">Render at realistic button sizes. Check opacity-fade suitability and dark-background safety.</p>

      <div v-if="hoverBrushes.length === 0" class="empty">No hover brush marks in manifest.</div>

      <div v-for="asset in hoverBrushes" :key="asset.id" class="asset-card">
        <div class="asset-meta">
          <code class="asset-id">{{ asset.id }}</code>
          <span class="asset-priority">{{ priorityBadge(asset.priority) }}</span>
          <span v-if="!darkSafe(asset)" class="warn-tag">⚠ parchment-only</span>
          <span v-else class="ok-tag">✓ dark-safe</span>
          <span class="stretch-tag">{{ stretchRule(asset) }}</span>
        </div>
        <p class="asset-use">{{ asset.recommendedUse }}</p>
        <p class="asset-avoid">{{ asset.avoidUse }}</p>

        <div class="sizes-row">
          <div v-for="sz in brushSizes" :key="sz.label" class="size-cell">
            <div
              class="asset-render"
              :style="{ ...bgStyle(selectedBg), width: sz.w + 'px', height: sz.h + 'px' }"
            >
              <img
                :src="asset.filePath"
                :alt="asset.subject"
                class="brush-img"
                :style="{ width: sz.w + 'px', height: sz.h + 'px' }"
                loading="lazy"
              />
            </div>
            <span class="size-label">{{ sz.label }}</span>
          </div>
        </div>

        <details class="meta-detail">
          <summary>full metadata</summary>
          <ul>
            <li><strong>path:</strong> {{ asset.filePath }}</li>
            <li><strong>subject:</strong> {{ asset.subject }}</li>
            <li><strong>aspectRatio:</strong> {{ asset.aspectRatio }}</li>
            <li><strong>sectionFit:</strong> {{ asset.sectionFit.join(', ') }}</li>
            <li><strong>mood:</strong> {{ asset.mood }}</li>
            <li v-if="asset.notes"><strong>notes:</strong> {{ asset.notes }}</li>
          </ul>
        </details>
      </div>
    </section>

    <!-- ============================================================ -->
    <!--  2. Underline Marks                                            -->
    <!-- ============================================================ -->
    <section class="group">
      <h2 class="group-title">
        <span class="group-num">02</span> Underline Marks
        <span class="group-role">role: hover-ornament</span>
      </h2>
      <p class="group-desc">Render at realistic heading underline sizes. scaleX only; never stretch vertically.</p>

      <div v-if="underlines.length === 0" class="empty">No underline marks in manifest.</div>

      <div v-for="asset in underlines" :key="asset.id" class="asset-card">
        <div class="asset-meta">
          <code class="asset-id">{{ asset.id }}</code>
          <span class="asset-priority">{{ priorityBadge(asset.priority) }}</span>
          <span v-if="!darkSafe(asset)" class="warn-tag">⚠ parchment-only</span>
          <span v-else class="ok-tag">✓ dark-safe</span>
        </div>
        <p class="asset-use">{{ asset.recommendedUse }}</p>
        <p class="asset-avoid">{{ asset.avoidUse }}</p>

        <div class="sizes-row">
          <div v-for="sz in underlineSizes" :key="sz.label" class="size-cell">
            <div
              class="asset-render"
              :style="{ ...bgStyle(selectedBg), width: sz.w + 'px', height: sz.h + 'px' }"
            >
              <img
                :src="asset.filePath"
                :alt="asset.subject"
                class="underline-img"
                :style="{ width: sz.w + 'px', height: sz.h + 'px' }"
                loading="lazy"
              />
            </div>
            <span class="size-label">{{ sz.label }}</span>
          </div>
        </div>

        <details class="meta-detail">
          <summary>full metadata</summary>
          <ul>
            <li><strong>path:</strong> {{ asset.filePath }}</li>
            <li><strong>subject:</strong> {{ asset.subject }}</li>
            <li><strong>aspectRatio:</strong> {{ asset.aspectRatio }}</li>
            <li><strong>sectionFit:</strong> {{ asset.sectionFit.join(', ') }}</li>
          </ul>
        </details>
      </div>
    </section>

    <!-- ============================================================ -->
    <!--  3. Active Rings                                               -->
    <!-- ============================================================ -->
    <section class="group">
      <h2 class="group-title">
        <span class="group-num">03</span> Active Rings
        <span class="group-role">role: button-ornament</span>
      </h2>
      <p class="group-desc">Render around 40×40 and 64×64 targets. Check ring readability at small UI sizes.</p>

      <div v-if="activeRings.length === 0" class="empty">No active rings in manifest.</div>

      <div v-for="asset in activeRings" :key="asset.id" class="asset-card">
        <div class="asset-meta">
          <code class="asset-id">{{ asset.id }}</code>
          <span class="asset-priority">{{ priorityBadge(asset.priority) }}</span>
          <span v-if="!darkSafe(asset)" class="warn-tag">⚠ parchment-only</span>
          <span v-else class="ok-tag">✓ dark-safe</span>
        </div>
        <p class="asset-use">{{ asset.recommendedUse }}</p>
        <p class="asset-avoid">{{ asset.avoidUse }}</p>

        <div class="sizes-row">
          <div v-for="sz in ringSizes" :key="sz.label" class="size-cell">
            <div
              class="asset-render ring-render"
              :style="{ ...bgStyle(selectedBg), width: sz.s + 'px', height: sz.s + 'px' }"
            >
              <!-- Dummy target square -->
              <div class="ring-target" :style="{ width: (sz.s * 0.6) + 'px', height: (sz.s * 0.6) + 'px' }" />
              <img
                :src="asset.filePath"
                :alt="asset.subject"
                class="ring-img"
                :style="{ width: sz.s + 'px', height: sz.s + 'px' }"
                loading="lazy"
              />
            </div>
            <span class="size-label">{{ sz.label }}</span>
          </div>
        </div>

        <details class="meta-detail">
          <summary>full metadata</summary>
          <ul>
            <li><strong>path:</strong> {{ asset.filePath }}</li>
            <li><strong>subject:</strong> {{ asset.subject }}</li>
            <li><strong>aspectRatio:</strong> {{ asset.aspectRatio }}</li>
          </ul>
        </details>
      </div>
    </section>

    <!-- ============================================================ -->
    <!--  4. Cinnabar Seal Marks                                        -->
    <!-- ============================================================ -->
    <section class="group">
      <h2 class="group-title">
        <span class="group-num">04</span> Cinnabar Seal Marks
        <span class="group-role">role: seal-stamp</span>
      </h2>
      <p class="group-desc">Render at archival seal sizes. Must remain readable at 24×24 for dense UI.</p>

      <div v-if="sealStamps.length === 0" class="empty">No seal stamps in manifest.</div>

      <div v-for="asset in sealStamps" :key="asset.id" class="asset-card">
        <div class="asset-meta">
          <code class="asset-id">{{ asset.id }}</code>
          <span class="asset-priority">{{ priorityBadge(asset.priority) }}</span>
          <span v-if="!darkSafe(asset)" class="warn-tag">⚠ parchment-only</span>
          <span v-else class="ok-tag">✓ dark-safe</span>
        </div>
        <p class="asset-use">{{ asset.recommendedUse }}</p>
        <p class="asset-avoid">{{ asset.avoidUse }}</p>

        <div class="sizes-row">
          <div v-for="sz in sealSizes" :key="sz.label" class="size-cell">
            <div
              class="asset-render"
              :style="{ ...bgStyle(selectedBg), width: sz.s + 'px', height: sz.s + 'px' }"
            >
              <img
                :src="asset.filePath"
                :alt="asset.subject"
                class="seal-img"
                :style="{ width: sz.s + 'px', height: sz.s + 'px' }"
                loading="lazy"
              />
            </div>
            <span class="size-label">{{ sz.label }}</span>
          </div>
        </div>

        <details class="meta-detail">
          <summary>full metadata</summary>
          <ul>
            <li><strong>path:</strong> {{ asset.filePath }}</li>
            <li><strong>subject:</strong> {{ asset.subject }}</li>
            <li><strong>aspectRatio:</strong> {{ asset.aspectRatio }}</li>
            <li><strong>sectionFit:</strong> {{ asset.sectionFit.join(', ') }}</li>
            <li v-if="asset.notes"><strong>notes:</strong> {{ asset.notes }}</li>
          </ul>
        </details>
      </div>
    </section>

    <!-- ============================================================ -->
    <!--  5. Swordsmanship Slash Dividers                               -->
    <!-- ============================================================ -->
    <section class="group group-steel">
      <h2 class="group-title">
        <span class="group-num">05</span> Swordsmanship Slash Dividers
        <span class="group-role">role: section-divider</span>
      </h2>
      <p class="group-desc">Render full-width, medium, and compact. Always on steel-blue background — this is their natural surface.</p>

      <div v-if="slashDividers.length === 0" class="empty">No slash dividers in manifest.</div>

      <div v-for="asset in slashDividers" :key="asset.id" class="asset-card">
        <div class="asset-meta">
          <code class="asset-id">{{ asset.id }}</code>
          <span class="asset-priority">{{ priorityBadge(asset.priority) }}</span>
          <span class="ok-tag">✓ dark-safe (steel native)</span>
        </div>
        <p class="asset-use">{{ asset.recommendedUse }}</p>
        <p class="asset-avoid">{{ asset.avoidUse }}</p>

        <div class="sizes-col">
          <div v-for="sz in dividerWidths" :key="sz.label" class="size-cell wide">
            <div
              class="asset-render"
              :style="{ backgroundColor: '#1a202c', width: '100%', maxWidth: sz.w + 'px', height: sz.h + 'px' }"
            >
              <img
                :src="asset.filePath"
                :alt="asset.subject"
                class="divider-img"
                :style="{ width: '100%', height: sz.h + 'px' }"
                loading="lazy"
              />
            </div>
            <span class="size-label">{{ sz.label }}</span>
          </div>
        </div>

        <details class="meta-detail">
          <summary>full metadata</summary>
          <ul>
            <li><strong>path:</strong> {{ asset.filePath }}</li>
            <li><strong>subject:</strong> {{ asset.subject }}</li>
            <li><strong>aspectRatio:</strong> {{ asset.aspectRatio }}</li>
          </ul>
        </details>
      </div>
    </section>

    <!-- ============================================================ -->
    <!--  6. Hero / Card Art                                            -->
    <!-- ============================================================ -->
    <section class="group">
      <h2 class="group-title">
        <span class="group-num">06</span> Hero / Card Art
        <span class="group-role">role: hero-atmosphere + card-art</span>
      </h2>
      <p class="group-desc">Large-format assets for hero atmosphere and slip-art card previews.</p>

      <div v-if="heroCardAssets.length === 0" class="empty">No hero/card art in manifest.</div>

      <div v-for="asset in heroCardAssets" :key="asset.id" class="asset-card">
        <div class="asset-meta">
          <code class="asset-id">{{ asset.id }}</code>
          <span class="asset-priority">{{ priorityBadge(asset.priority) }}</span>
          <span class="role-tag">{{ asset.role }}</span>
        </div>
        <p class="asset-use">{{ asset.recommendedUse }}</p>
        <p class="asset-avoid">{{ asset.avoidUse }}</p>

        <div
          class="hero-preview"
          :style="{
            ...bgStyle(selectedBg),
            aspectRatio: asset.role === 'hero-atmosphere' ? '2 / 1' : '4 / 5',
            maxWidth: asset.role === 'hero-atmosphere' ? '960px' : '360px',
          }"
        >
          <img
            :src="asset.filePath"
            :alt="asset.subject"
            class="hero-img"
            loading="lazy"
          />
        </div>

        <details class="meta-detail">
          <summary>full metadata</summary>
          <ul>
            <li><strong>path:</strong> {{ asset.filePath }}</li>
            <li><strong>subject:</strong> {{ asset.subject }}</li>
            <li><strong>aspectRatio:</strong> {{ asset.aspectRatio }}</li>
            <li><strong>sectionFit:</strong> {{ asset.sectionFit.join(', ') }}</li>
            <li><strong>mood:</strong> {{ asset.mood }}</li>
          </ul>
        </details>
      </div>
    </section>

    <!-- Footer -->
    <footer class="lab-footer">
      <p>
        <strong>Stage 35D-1C</strong> — UI Texture Lab. This page is dev-only and excluded from prerender.
        Background: <strong>{{ backgrounds.find(b => b.id === selectedBg)?.label }}</strong>.
      </p>
    </footer>
  </div>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────── */
.texture-lab {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  color: var(--jl-ink,#1a1a1a);
  background: var(--jl-parchment,#f7f1e4);
  font-family: var(--jl-font-body, system-ui, sans-serif);
  /* Fixed-pixel QA samples should never cause page-level horizontal scroll;
     they scroll within their own containers instead. */
  overflow-x: hidden;
}

.lab-header {
  border-bottom: 2px solid var(--jl-ink-light,#c8b89a);
  padding-bottom: 1.25rem;
  margin-bottom: 2rem;
}

.lab-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: var(--jl-ink,#1a1a1a);
}

.lab-subtitle {
  font-size: 0.875rem;
  color: var(--jl-ink-muted,#7a6e5e);
  margin: 0 0 1rem;
}

/* ── Background picker ───────────────────────────────────────── */
.bg-picker {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bg-btn {
  padding: 0.35rem 0.85rem;
  border: 1px solid var(--jl-ink-light,#c8b89a);
  border-radius: 6px;
  background: var(--jl-parchment,#f7f1e4);
  color: var(--jl-ink,#1a1a1a);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}

.bg-btn:hover {
  background: var(--jl-ink-light,#c8b89a);
}

.bg-btn.active {
  background: var(--jl-ink,#1a1a1a);
  color: var(--jl-parchment,#f7f1e4);
  border-color: var(--jl-ink,#1a1a1a);
}

/* ── Groups ──────────────────────────────────────────────────── */
.group {
  margin-bottom: 3rem;
  padding: 1.5rem;
  border: 1px solid var(--jl-ink-light,#c8b89a);
  border-radius: 8px;
  background: rgba(247,241,228,0.4);
}

.group-steel {
  border-color: #4a627a;
  background: rgba(26,32,44,0.06);
}

.group-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.35rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.group-num {
  font-size: 0.8rem;
  color: var(--jl-cinnabar,#b8472e);
  font-weight: 900;
}

.group-role {
  font-size: 0.7rem;
  color: var(--jl-ink-muted,#7a6e5e);
  font-weight: 400;
}

.group-desc {
  font-size: 0.8rem;
  color: var(--jl-ink-muted,#7a6e5e);
  margin: 0 0 1.25rem;
}

.empty {
  padding: 2rem;
  text-align: center;
  color: var(--jl-ink-muted,#7a6e5e);
  font-style: italic;
}

/* ── Asset card ──────────────────────────────────────────────── */
.asset-card {
  margin-bottom: 2rem;
  padding: 1rem;
  border-left: 3px solid var(--jl-cinnabar,#b8472e);
  background: rgba(255,255,255,0.5);
  border-radius: 0 6px 6px 0;
}

.asset-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.35rem;
}

.asset-id {
  font-size: 0.75rem;
  background: var(--jl-ink,#1a1a1a);
  color: var(--jl-parchment,#f7f1e4);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-family: var(--jl-font-mono, 'Consolas', monospace);
}

.asset-priority {
  font-size: 0.7rem;
  font-weight: 700;
}

.warn-tag {
  font-size: 0.7rem;
  background: #fff3cd;
  color: #856404;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
}

.ok-tag {
  font-size: 0.7rem;
  background: #d4edda;
  color: #155724;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
}

.stretch-tag {
  font-size: 0.7rem;
  background: var(--jl-ink-light,#c8b89a);
  color: var(--jl-ink,#1a1a1a);
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
}

.role-tag {
  font-size: 0.7rem;
  background: var(--jl-ink-light,#c8b89a);
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
}

.asset-use {
  font-size: 0.8rem;
  color: var(--jl-ink,#1a1a1a);
  margin: 0.25rem 0;
}

.asset-avoid {
  font-size: 0.75rem;
  color: var(--jl-cinnabar,#b8472e);
  margin: 0 0 1rem;
}

/* ── Size rows ───────────────────────────────────────────────── */
.sizes-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
  /* Fixed-pixel QA samples (e.g. 360px underline) may exceed narrow
     viewports — scroll within the group instead of overflowing the page. */
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.25rem;
}

.sizes-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.size-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.size-cell.wide {
  align-items: flex-start;
  width: 100%;
}

.size-label {
  font-size: 0.65rem;
  color: var(--jl-ink-muted,#7a6e5e);
}

/* ── Asset renders ───────────────────────────────────────────── */
.asset-render {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(128,128,128,0.25);
  border-radius: 4px;
  overflow: hidden;
}

.brush-img,
.underline-img,
.seal-img {
  object-fit: fill;
  display: block;
}

.ring-render {
  position: relative;
}

.ring-target {
  position: absolute;
  border: 1px dashed rgba(128,128,128,0.4);
  border-radius: 4px;
  pointer-events: none;
}

.ring-img {
  position: absolute;
  inset: 0;
  object-fit: contain;
  display: block;
}

.divider-img {
  object-fit: fill;
  display: block;
}

/* ── Hero preview ────────────────────────────────────────────── */
.hero-preview {
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid rgba(128,128,128,0.25);
  margin-bottom: 0.75rem;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Meta detail ─────────────────────────────────────────────── */
.meta-detail {
  font-size: 0.75rem;
  color: var(--jl-ink-muted,#7a6e5e);
  margin-top: 0.5rem;
}

.meta-detail summary {
  cursor: pointer;
  font-size: 0.7rem;
  color: var(--jl-ink-light,#c8b89a);
}

.meta-detail ul {
  margin: 0.35rem 0 0 1.25rem;
  padding: 0;
}

.meta-detail li {
  margin-bottom: 0.15rem;
}

/* ── Footer ──────────────────────────────────────────────────── */
.lab-footer {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid var(--jl-ink-light,#c8b89a);
  font-size: 0.7rem;
  color: var(--jl-ink-muted,#7a6e5e);
  text-align: center;
}

/* ── Mobile ──────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .texture-lab {
    padding: 1rem 0.75rem 2rem;
  }

  .lab-title {
    font-size: 1.3rem;
  }

  .group {
    padding: 1rem;
  }

  .sizes-row {
    gap: 0.5rem;
  }
}
</style>
