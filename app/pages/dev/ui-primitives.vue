<script setup lang="ts">
import { ref } from 'vue'
import {
  ASSET_COUNT,
  getAssetsByRole,
  type SectionFit,
} from '~/utils/assetManifest'

if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useSeoMeta({
  title: 'UI Primitives | Jian Lai Wiki',
})

type SectionKey = SectionFit

const sectionChoices: { id: SectionKey; label: string; zh: string }[] = [
  { id: 'home', label: 'Home', zh: '首页' },
  { id: 'characters', label: 'Characters', zh: '人物' },
  { id: 'world', label: 'World', zh: '天下' },
  { id: 'cultivation', label: 'Cultivation', zh: '修行' },
  { id: 'swordsmanship', label: 'Swordsmanship', zh: '剑术' },
  { id: 'factions', label: 'Factions', zh: '宗门' },
  { id: 'artifacts', label: 'Artifacts', zh: '器物' },
  { id: 'timeline', label: 'Timeline', zh: '编年' },
  { id: 'rankings', label: 'Rankings', zh: '榜文' },
  { id: 'teachings', label: 'Teachings', zh: '学说' },
  { id: 'glossary', label: 'Glossary', zh: '辞书' },
  { id: 'pantheon', label: 'Pantheon', zh: '神祇' },
]

const sectionId = ref<SectionKey>('swordsmanship')

// InkButton tone samples
const inkTones = ['ink', 'cinnabar', 'section'] as const

// SealButton samples
const sealSizes = ['sm', 'md', 'lg'] as const

// ArchiveTab samples
const archiveTabs = [
  { id: 'overview', label: 'Overview', zh: '总览', count: 12 },
  { id: 'forms', label: 'Forms', zh: '剑式', count: 28 },
  { id: 'annotations', label: 'Annotations', zh: '注', count: 7 },
]
const activeArchive = ref('forms')

// LedgerTab samples
const ledgerTabs = [
  { id: 'all', label: 'All Arts', count: 41 },
  { id: 'sword-art', label: 'Sword Art', count: 22 },
  { id: 'sword-domain', label: 'Sword Domain', count: 8 },
  { id: 'sword-intent', label: 'Sword Intent', count: 11 },
]
const activeLedger = ref('sword-art')

// CinnabarTag tones
const cinnabarTones = ['cinnabar', 'jade', 'bronze', 'section', 'ghost'] as const

// SectionDivider motifs
const dividerMotifs = ['ink', 'seal', 'ledger', 'blade', 'atlas', 'doctrine', 'blank'] as const

// Manifest preview — first hero atmosphere and first portrait from current section
const heroAssets = computed(() => getAssetsByRole('hero-atmosphere').filter((a) => a.sectionFit.includes(sectionId.value)).slice(0, 1))
const portraitAssets = computed(() => getAssetsByRole('dossier-portrait').filter((a) => a.sectionFit.includes(sectionId.value)).slice(0, 1))
const washAssets = computed(() => getAssetsByRole('background-wash').filter((a) => a.sectionFit.includes(sectionId.value) || a.sectionFit.includes('global')).slice(0, 1))
</script>

<template>
  <main
    class="ui-primitives-page"
    :data-jl-section="sectionId"
  >
    <header class="ui-primitives-header">
      <div class="ui-primitives-header-inner">
        <div>
          <p class="ui-primitives-kicker">Stage 35C-0 · Design Engine Primitives</p>
          <h1 class="ui-primitives-title">UI Primitives Foundation</h1>
          <p class="ui-primitives-desc">
            Nine new primitives wired to the section chapter system. Switch sections to see the
            primitives take on that chapter's palette, paper, and ink.
          </p>
        </div>

        <div class="section-picker" role="radiogroup" aria-label="Section chapter">
          <span class="section-picker-label">Chapter</span>
          <div class="section-picker-grid">
            <button
              v-for="s in sectionChoices"
              :key="s.id"
              type="button"
              role="radio"
              :aria-checked="sectionId === s.id"
              class="section-picker-btn"
              :class="{ 'is-active': sectionId === s.id }"
              @click="sectionId = s.id"
            >
              <span class="section-picker-zh" aria-hidden="true">{{ s.zh }}</span>
              <span class="section-picker-en">{{ s.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="ui-primitives-body">
      <!-- 1. InkButton -->
      <section class="primitive-block" aria-labelledby="prim-ink-button">
        <header class="primitive-block__header">
          <span class="primitive-block__index">01</span>
          <h2 id="prim-ink-button" class="primitive-block__title">InkButton</h2>
          <p class="primitive-block__desc">
            Inline link or compact action. Dual-layer brush underline (ink base + cinnabar accent) expands on hover.
          </p>
        </header>
        <div class="primitive-block__stage">
          <div class="ink-button-row">
            <div v-for="tone in inkTones" :key="tone" class="ink-button-cell">
              <span class="tone-label">tone={{ tone }}</span>
              <UiInkButton :tone="tone" to="/swordsmanship">Trace Manual</UiInkButton>
              <UiInkButton :tone="tone" to="/characters">Browse Archive</UiInkButton>
              <UiInkButton :tone="tone" disabled>Struck from Record</UiInkButton>
            </div>
          </div>

          <!-- Dev-only: InkButton underline texture override (Stage 35D-2A).
               No production usage — exercises the textureId prop against the
               manifest, plus an invalid-id fallback case. -->
          <div class="ink-button-override">
            <p class="tone-label">textureId override · dev-only</p>
            <div class="ink-button-override-row">
              <div class="ink-button-cell">
                <span class="tone-label">default (CSS var)</span>
                <UiInkButton to="/swordsmanship">Default Underline</UiInkButton>
              </div>
              <div class="ink-button-cell">
                <span class="tone-label">thin-03</span>
                <UiInkButton to="/swordsmanship" texture-id="asset.ui.underline.ink.thin-03">Thin 03 Override</UiInkButton>
              </div>
              <div class="ink-button-cell">
                <span class="tone-label">thin-04</span>
                <UiInkButton to="/swordsmanship" texture-id="asset.ui.underline.ink.thin-04">Thin 04 Override</UiInkButton>
              </div>
              <div class="ink-button-cell">
                <span class="tone-label">invalid id → fallback</span>
                <UiInkButton to="/swordsmanship" texture-id="asset.ui.underline.ink.does-not-exist">Fallback (bad id)</UiInkButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UiSectionDivider motif="ink" label="02 · SealButton" />

      <!-- 2. SealButton -->
      <section class="primitive-block" aria-labelledby="prim-seal-button">
        <header class="primitive-block__header">
          <span class="primitive-block__index">02</span>
          <h2 id="prim-seal-button" class="primitive-block__title">SealButton</h2>
          <p class="primitive-block__desc">
            Rare primary action. Cinnabar stamp with irregular edge mask, ink-paper texture, calligraphic stamp.
          </p>
        </header>
        <div class="primitive-block__stage">
          <div class="seal-button-row">
            <div v-for="size in sealSizes" :key="size" class="seal-button-cell">
              <span class="tone-label">size={{ size }}</span>
              <UiSealButton :size="size" stamp="审" to="/rankings">Submit Verification</UiSealButton>
            </div>
            <div class="seal-button-cell">
              <span class="tone-label">no stamp</span>
              <UiSealButton :size="'md'" to="/swordsmanship">Add to Register</UiSealButton>
            </div>
            <div class="seal-button-cell">
              <span class="tone-label">disabled</span>
              <UiSealButton :size="'md'" disabled>Locked</UiSealButton>
            </div>
          </div>
        </div>
      </section>

      <UiSectionDivider motif="seal" label="03 · ArchiveTab" />

      <!-- 3. ArchiveTab -->
      <section class="primitive-block" aria-labelledby="prim-archive-tab">
        <header class="primitive-block__header">
          <span class="primitive-block__index">03</span>
          <h2 id="prim-archive-tab" class="primitive-block__title">ArchiveTab</h2>
          <p class="primitive-block__desc">
            Top-level navigation tab. Mono label with optional calligraphic zh accent, count badge, cinnabar underline.
          </p>
        </header>
        <div class="primitive-block__stage">
          <div role="tablist" class="archive-tab-row" aria-label="Archive tabs sample">
            <UiArchiveTab
              v-for="t in archiveTabs"
              :key="t.id"
              :active="activeArchive === t.id"
              :zh-label="t.zh"
              :count="t.count"
              @click="activeArchive = t.id"
            >{{ t.label }}</UiArchiveTab>
          </div>
          <p class="stage-note">Active: {{ activeArchive }}</p>
        </div>
      </section>

      <UiSectionDivider motif="ledger" label="04 · LedgerTab" />

      <!-- 4. LedgerTab -->
      <section class="primitive-block" aria-labelledby="prim-ledger-tab">
        <header class="primitive-block__header">
          <span class="primitive-block__index">04</span>
          <h2 id="prim-ledger-tab" class="primitive-block__title">LedgerTab</h2>
          <p class="primitive-block__desc">
            Category filter for ledger sections. Count badge, multiple tones (section, bronze, jade, cinnabar).
          </p>
        </header>
        <div class="primitive-block__stage">
          <div class="ledger-tab-stack">
            <div>
              <p class="tone-label">tone=section · variant=ledger</p>
              <div class="ledger-tab-row">
                <UiLedgerTab
                  v-for="t in ledgerTabs"
                  :key="t.id"
                  :active="activeLedger === t.id"
                  tone="section"
                  :count="t.count"
                  @click="activeLedger = t.id"
                >{{ t.label }}</UiLedgerTab>
              </div>
            </div>

            <div>
              <p class="tone-label">tone=bronze · variant=ledger</p>
              <div class="ledger-tab-row">
                <UiLedgerTab tone="bronze" :count="6">Verified</UiLedgerTab>
                <UiLedgerTab tone="bronze" :count="3">Awaiting</UiLedgerTab>
                <UiLedgerTab tone="bronze" :count="1">Struck</UiLedgerTab>
              </div>
            </div>

            <div>
              <p class="tone-label">variant=compact</p>
              <div class="ledger-tab-row">
                <UiLedgerTab tone="jade" variant="compact" :count="12">Sword Art</UiLedgerTab>
                <UiLedgerTab tone="jade" variant="compact" :count="8" :active="true">Sword Domain</UiLedgerTab>
                <UiLedgerTab tone="jade" variant="compact" :count="5">Sword Intent</UiLedgerTab>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UiSectionDivider motif="blade" label="05 · CinnabarTag" />

      <!-- 5. CinnabarTag -->
      <section class="primitive-block" aria-labelledby="prim-cinnabar-tag">
        <header class="primitive-block__header">
          <span class="primitive-block__index">05</span>
          <h2 id="prim-cinnabar-tag" class="primitive-block__title">CinnabarTag</h2>
          <p class="primitive-block__desc">
            Small status or category marker. Rare cinnabar by default, section-tinted when overridden.
          </p>
        </header>
        <div class="primitive-block__stage">
          <div class="cinnabar-tag-stack">
            <div v-for="tone in cinnabarTones" :key="tone" class="cinnabar-tag-row">
              <span class="tone-label">tone={{ tone }}</span>
              <UiCinnabarTag :tone="tone" dot>Status · Active</UiCinnabarTag>
              <UiCinnabarTag :tone="tone">Verifying</UiCinnabarTag>
              <UiCinnabarTag :tone="tone" dot>Heavely Verified</UiCinnabarTag>
              <UiCinnabarTag :tone="tone" size="sm">Minor</UiCinnabarTag>
            </div>
          </div>
        </div>
      </section>

      <UiSectionDivider motif="atlas" label="06 · PaperSlipCard" />

      <!-- 6. PaperSlipCard -->
      <section class="primitive-block" aria-labelledby="prim-paper-slip-card">
        <header class="primitive-block__header">
          <span class="primitive-block__index">06</span>
          <h2 id="prim-paper-slip-card" class="primitive-block__title">PaperSlipCard</h2>
          <p class="primitive-block__desc">
            Non-generic card primitive. Paper surface, mist/bronze frame, optional seal corner, no default shadow.
          </p>
        </header>
        <div class="primitive-block__stage">
          <div class="paper-slip-card-grid">
            <UiPaperSlipCard accent>
              <h3 class="card-headline">Dossier Plate</h3>
              <p class="card-body">A leaf pulled from a scholar's filing box. The default for any entry that needs a non-generic card surface.</p>
              <div class="card-foot">
                <UiCinnabarTag tone="section" dot>Active</UiCinnabarTag>
                <UiBrushUnderline weight="regular" width="short" tone="section" />
              </div>
            </UiPaperSlipCard>

            <UiPaperSlipCard seal-corner lift to="/swordsmanship">
              <h3 class="card-headline">Manual Slip</h3>
              <p class="card-body">A sword-art entry's anchor card. Sealed corner, hover lift, links to the detail page.</p>
              <div class="card-foot">
                <UiCinnabarTag tone="cinnabar" dot>Sword Art</UiCinnabarTag>
                <UiBrushUnderline weight="regular" width="short" tone="cinnabar" />
              </div>
            </UiPaperSlipCard>

            <UiPaperSlipCard href="#sample">
              <h3 class="card-headline">Inscription Panel</h3>
              <p class="card-body">For an entry that needs a card surface but isn't a navigation target. Hover-lift off; clean and calm.</p>
              <div class="card-foot">
                <UiCinnabarTag tone="bronze" dot>Background</UiCinnabarTag>
                <UiBrushUnderline weight="regular" width="short" tone="gold" />
              </div>
            </UiPaperSlipCard>
          </div>
        </div>
      </section>

      <UiSectionDivider motif="doctrine" label="07 · ImageWashFrame" />

      <!-- 7. ImageWashFrame -->
      <section class="primitive-block" aria-labelledby="prim-image-wash-frame">
        <header class="primitive-block__header">
          <span class="primitive-block__index">07</span>
          <h2 id="prim-image-wash-frame" class="primitive-block__title">ImageWashFrame</h2>
          <p class="primitive-block__desc">
            Framed image with aspect ratio, optional atmospheric wash, and corner-tick frame. Pulls from manifest entries.
          </p>
        </header>
        <div class="primitive-block__stage">
          <div class="image-wash-frame-grid">
            <UiImageWashFrame
              v-if="heroAssets[0]"
              :src="heroAssets[0].filePath"
              :alt="heroAssets[0].subject"
              aspect="16:9"
              wash="mist"
              :wash-opacity="0.18"
            >
              <template #caption>{{ heroAssets[0].id }} · hero atmosphere</template>
            </UiImageWashFrame>

            <UiImageWashFrame
              v-if="portraitAssets[0]"
              :src="portraitAssets[0].filePath"
              :alt="portraitAssets[0].subject"
              aspect="3:4"
              wash="cloth"
              :wash-opacity="0.12"
            >
              <template #caption>{{ portraitAssets[0].id }} · dossier portrait</template>
            </UiImageWashFrame>

            <UiImageWashFrame
              v-if="washAssets[0]"
              :src="washAssets[0].filePath"
              :alt="washAssets[0].subject"
              aspect="4:5"
              wash="ink"
              :wash-opacity="0.22"
            >
              <template #caption>{{ washAssets[0].id }} · background wash</template>
            </UiImageWashFrame>

            <UiImageWashFrame
              src="/images/textures/ink-wash-01.webp"
              alt="Ink wash texture 1"
              aspect="1:1"
              wash="mist"
              :wash-opacity="0.06"
            >
              <template #caption>texture/ink-wash-01</template>
            </UiImageWashFrame>
          </div>
        </div>
      </section>

      <UiSectionDivider motif="ink" label="08 · SectionDivider" />

      <!-- 8. SectionDivider -->
      <section class="primitive-block" aria-labelledby="prim-section-divider">
        <header class="primitive-block__header">
          <span class="primitive-block__index">08</span>
          <h2 id="prim-section-divider" class="primitive-block__title">SectionDivider</h2>
          <p class="primitive-block__desc">
            Structural divider with section-aware motif variants. The motif is the section's voice.
          </p>
        </header>
        <div class="primitive-block__stage section-divider-stack">
          <div v-for="motif in dividerMotifs" :key="motif" class="section-divider-row">
            <span class="tone-label">motif={{ motif }}</span>
            <UiSectionDivider :motif="motif" />
          </div>
          <div class="section-divider-row">
            <span class="tone-label">motif=seal · label</span>
            <UiSectionDivider motif="seal" label="End of Register" />
          </div>
        </div>
      </section>

      <UiSectionDivider motif="blank" label="09 · BrushUnderline" />

      <!-- 9. BrushUnderline -->
      <section class="primitive-block" aria-labelledby="prim-brush-underline">
        <header class="primitive-block__header">
          <span class="primitive-block__index">09</span>
          <h2 id="prim-brush-underline" class="primitive-block__title">BrushUnderline</h2>
          <p class="primitive-block__desc">
            Reusable underline ornament. Tones, weights, and widths. Pairs with headings and labels.
          </p>
        </header>
        <div class="primitive-block__stage">
          <div class="brush-underline-stack">
            <div>
              <p class="brush-underline-headline">
                Cinematic pacing<UiBrushUnderline tone="cinnabar" weight="regular" width="medium" /> scholarly restraint.
              </p>
              <p class="brush-underline-headline">
                Section chapter<UiBrushUnderline tone="section" weight="bold" width="long" /> identity.
              </p>
              <p class="brush-underline-headline">
                Earned motion<UiBrushUnderline tone="gold" weight="light" width="short" /> only.
              </p>
            </div>

            <div class="brush-underline-widths">
              <div><UiBrushUnderline width="short" /> <span class="tone-label">short</span></div>
              <div><UiBrushUnderline width="medium" /> <span class="tone-label">medium</span></div>
              <div><UiBrushUnderline width="long" /> <span class="tone-label">long</span></div>
              <div><UiBrushUnderline width="full" /> <span class="tone-label">full (block)</span></div>
            </div>

            <div class="brush-underline-weights">
              <div><UiBrushUnderline weight="light" width="long" /> <span class="tone-label">light</span></div>
              <div><UiBrushUnderline weight="regular" width="long" /> <span class="tone-label">regular</span></div>
              <div><UiBrushUnderline weight="bold" width="long" /> <span class="tone-label">bold</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <footer class="ui-primitives-footer">
      <p>
        <strong>Manifest total:</strong> {{ ASSET_COUNT }} entries ·
        <span class="tone-label">auto-refreshes as the manifest evolves</span>
      </p>
    </footer>
  </main>
</template>

<style scoped>
.ui-primitives-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 78% 4%, color-mix(in srgb, var(--jl-section-accent) 6%, transparent), transparent 30rem),
    linear-gradient(180deg, var(--jl-section-paper) 0%, color-mix(in srgb, var(--jl-section-mist) 22%, var(--jl-section-paper)) 100%);
  color: var(--jl-section-ink);
  padding-bottom: 5rem;
  transition:
    background 280ms cubic-bezier(0.32, 0.72, 0, 1),
    color 280ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Header */
.ui-primitives-header {
  border-bottom: 1px solid var(--jl-section-frame);
  background: linear-gradient(180deg, color-mix(in srgb, var(--c-paper-alt) 64%, transparent), transparent);
}

.ui-primitives-header-inner {
  max-width: 78rem;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem) clamp(1.4rem, 3vw, 2.4rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 460px);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
}

.ui-primitives-kicker {
  margin: 0 0 0.6rem;
  color: var(--jl-section-seal);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  line-height: 1.2;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ui-primitives-title {
  margin: 0 0 0.5rem;
  color: var(--jl-charcoal);
  font-family: var(--font-heading);
  font-size: clamp(2.4rem, 5vw, 4.4rem);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.025em;
}

.ui-primitives-desc {
  margin: 0;
  max-width: 52ch;
  color: color-mix(in srgb, var(--jl-section-ink) 78%, transparent);
  font-size: 1rem;
  line-height: 1.7;
}

/* Section picker */
.section-picker {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.section-picker-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-text-3);
}

.section-picker-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.4rem;
}

.section-picker-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.12rem;
  padding: 0.55rem 0.4rem 0.6rem;
  color: var(--jl-section-ink);
  background: color-mix(in srgb, var(--jl-section-paper) 84%, transparent);
  border: 1px solid var(--jl-section-frame);
  border-radius: 2px;
  cursor: pointer;
  transition:
    background 200ms cubic-bezier(0.32, 0.72, 0, 1),
    color 200ms cubic-bezier(0.32, 0.72, 0, 1),
    border-color 200ms cubic-bezier(0.32, 0.72, 0, 1);
}

.section-picker-btn:hover,
.section-picker-btn:focus-visible {
  border-color: color-mix(in srgb, var(--jl-section-accent) 42%, var(--jl-section-frame));
  color: var(--jl-charcoal);
}

.section-picker-btn:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--jl-section-seal) 72%, transparent);
  outline-offset: 2px;
}

.section-picker-btn.is-active {
  background: var(--jl-section-accent);
  color: var(--c-paper);
  border-color: var(--jl-section-accent);
}

.section-picker-zh {
  font-family: var(--font-zh-display);
  font-size: 1.05rem;
  line-height: 1;
  letter-spacing: 0.04em;
}

.section-picker-en {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.78;
}

/* Body */
.ui-primitives-body {
  max-width: 78rem;
  margin: 0 auto;
  padding: clamp(1.4rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 5vw, 4rem);
}

.primitive-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-margin-top: 5rem;
}

.primitive-block__header {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 0.2rem 1.2rem;
  align-items: baseline;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--jl-section-frame);
}

.primitive-block__index {
  grid-row: 1;
  grid-column: 1;
  color: var(--jl-section-seal);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.primitive-block__title {
  grid-row: 1;
  grid-column: 2;
  margin: 0;
  color: var(--jl-charcoal);
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 2.4vw, 1.9rem);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.015em;
}

.primitive-block__desc {
  grid-row: 2;
  grid-column: 2;
  margin: 0;
  color: color-mix(in srgb, var(--jl-section-ink) 78%, transparent);
  font-size: 0.92rem;
  line-height: 1.6;
  max-width: 64ch;
}

.primitive-block__stage {
  padding: 1.4rem;
  background: color-mix(in srgb, var(--c-paper-alt) 86%, var(--jl-section-paper));
  border: 1px solid var(--jl-section-frame);
  border-radius: 3px;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--c-paper-alt) 58%, transparent);
}

.tone-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-text-3);
  white-space: nowrap;
}

.stage-note {
  margin: 0.85rem 0 0;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
}

/* 1. InkButton */
.ink-button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 2.4rem;
}

.ink-button-cell {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  align-items: flex-start;
}

/* 1. InkButton — dev-only texture override preview (Stage 35D-2A) */
.ink-button-override {
  margin-top: 1.4rem;
  padding-top: 1.2rem;
  border-top: 1px dashed var(--jl-section-frame);
}

.ink-button-override-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem 2rem;
  margin-top: 0.6rem;
}

/* 2. SealButton */
.seal-button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.4rem 2rem;
  align-items: flex-end;
}

.seal-button-cell {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  align-items: flex-start;
}

/* 3. ArchiveTab */
.archive-tab-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1.4rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid var(--jl-section-frame);
}

/* 4. LedgerTab */
.ledger-tab-stack {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.ledger-tab-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem 0.65rem;
}

/* 5. CinnabarTag */
.cinnabar-tag-stack {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}

.cinnabar-tag-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 0.7rem;
}

/* 6. PaperSlipCard */
.paper-slip-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.2rem;
}

.card-headline {
  margin: 0 0 0.45rem;
  color: var(--jl-charcoal);
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.2;
}

.card-body {
  margin: 0 0 0.85rem;
  color: color-mix(in srgb, var(--jl-section-ink) 78%, transparent);
  font-size: 0.86rem;
  line-height: 1.55;
}

.card-foot {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: auto;
  padding-top: 0.4rem;
}

/* 7. ImageWashFrame */
.image-wash-frame-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.4rem;
}

/* 8. SectionDivider */
.section-divider-stack {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.section-divider-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 9. BrushUnderline */
.brush-underline-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.brush-underline-headline {
  margin: 0 0 0.65rem;
  color: var(--jl-charcoal);
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 2.4vw, 1.9rem);
  font-weight: 500;
  line-height: 1.25;
  text-wrap: balance;
}

.brush-underline-widths,
.brush-underline-weights {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  align-items: flex-start;
}

.brush-underline-widths > div,
.brush-underline-weights > div {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

/* Footer */
.ui-primitives-footer {
  max-width: 78rem;
  margin: 0 auto;
  padding: 1.5rem clamp(1rem, 3vw, 2rem);
  border-top: 1px solid var(--jl-section-frame);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: var(--c-text-3);
}

.ui-primitives-footer p {
  margin: 0;
}

/* Responsive */
@media (max-width: 880px) {
  .ui-primitives-header-inner {
    grid-template-columns: 1fr;
  }

  .section-picker-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 540px) {
  .section-picker-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .seal-button-row,
  .ink-button-row {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ui-primitives-page {
    transition: none;
  }
  .section-picker-btn {
    transition: none;
  }
}
</style>
