<script setup lang="ts">
import { ref } from 'vue'
import { jianLaiSectionThemes } from '~/utils/sectionThemes'
import BrushTitle from './BrushTitle.vue'
import InkActiveTab from './InkActiveTab.vue'
import InkDivider from './InkDivider.vue'
import InkHoverLink from './InkHoverLink.vue'
import InkTextButton from './InkTextButton.vue'

const activeTab = ref('Manuals')
const tabs = ['Manuals', 'Sword Intent', 'Records']
</script>

<template>
  <section class="primitive-preview" aria-labelledby="jianlai-primitive-preview-title">
    <BrushTitle id="jianlai-primitive-preview-title" kicker="Stage 30E-1B">
      Jian Lai Interaction Primitives
    </BrushTitle>

    <div class="primitive-preview__row" aria-label="Ink hover links">
      <InkHoverLink to="/swordsmanship" current>Swordsmanship</InkHoverLink>
      <InkHoverLink to="/characters">Character archive</InkHoverLink>
      <InkHoverLink active active-mark="seal">Selected route</InkHoverLink>
    </div>

    <div class="primitive-preview__row" aria-label="Ink text buttons">
      <InkTextButton>Trace Manual</InkTextButton>
      <InkTextButton active>Active Filter</InkTextButton>
      <InkTextButton active active-mark="seal">Seal State</InkTextButton>
    </div>

    <div class="primitive-preview__tabs" role="tablist" aria-label="Primitive preview tabs">
      <InkActiveTab
        v-for="tab in tabs"
        :key="tab"
        :active="activeTab === tab"
        @click="activeTab = tab"
      >
        {{ tab }}
      </InkActiveTab>
    </div>

    <InkDivider label="Archive divider" />
    <InkDivider variant="generated" label="Generated mark" />

    <BrushTitle as="h3" variant="pale" align="center" kicker="Pale Variant">
      Quiet Manual Heading
    </BrushTitle>

    <section class="section-theme-board" aria-labelledby="section-theme-blueprint-title">
      <div class="section-theme-board__header">
        <div>
          <p class="section-theme-board__kicker">Stage 30E-2A</p>
          <h3 id="section-theme-blueprint-title" class="section-theme-board__title">
            Section Theme Blueprint
          </h3>
        </div>
        <p class="section-theme-board__note">
          Token preview only. Real pages are not themed here.
        </p>
      </div>

      <div class="section-theme-board__grid" aria-label="Jian Lai section theme swatches">
        <article
          v-for="theme in jianLaiSectionThemes"
          :key="theme.id"
          class="section-theme-card"
          :data-jl-section="theme.id"
        >
          <div class="section-theme-card__topline">
            <span class="section-theme-card__name">{{ theme.label }}</span>
            <span class="section-theme-card__level">{{ theme.intensityLevel }}</span>
          </div>

          <div class="section-theme-card__swatches" aria-hidden="true">
            <span class="section-theme-card__swatch section-theme-card__swatch--paper"></span>
            <span class="section-theme-card__swatch section-theme-card__swatch--mist"></span>
            <span class="section-theme-card__swatch section-theme-card__swatch--accent"></span>
            <span class="section-theme-card__swatch section-theme-card__swatch--seal"></span>
            <span class="section-theme-card__swatch section-theme-card__swatch--gold"></span>
            <span class="section-theme-card__swatch section-theme-card__swatch--ink"></span>
          </div>

          <p class="section-theme-card__metaphor">{{ theme.documentMetaphor }}</p>
          <p class="section-theme-card__mood">{{ theme.mood }}</p>

          <div class="section-theme-card__sample">
            <InkHoverLink active active-mark="underline">{{ theme.accentName }}</InkHoverLink>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
.primitive-preview {
  display: grid;
  gap: 1.45rem;
  max-width: 72rem;
  padding: clamp(1.2rem, 3vw, 2rem);
  color: var(--c-ink);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-paper-alt) 82%, transparent), color-mix(in srgb, var(--c-bg-soft) 58%, transparent)),
    var(--c-paper);
  border: 1px solid color-mix(in srgb, var(--jl-antique-gold) 24%, var(--c-divider));
  border-radius: 4px;
}

.primitive-preview__row,
.primitive-preview__tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.74rem 1rem;
}

.section-theme-board {
  display: grid;
  gap: 1rem;
  padding-top: 0.25rem;
}

.section-theme-board__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid color-mix(in srgb, var(--c-divider) 82%, transparent);
}

.section-theme-board__kicker,
.section-theme-board__note,
.section-theme-card__level {
  margin: 0;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.3;
}

.section-theme-board__title {
  margin: 0.18rem 0 0;
  color: var(--c-charcoal);
  font-family: var(--font-heading);
  font-size: clamp(1.1rem, 2vw, 1.45rem);
  font-weight: 500;
  line-height: 1.1;
}

.section-theme-board__note {
  max-width: 18rem;
  text-align: right;
}

.section-theme-board__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.section-theme-card {
  display: grid;
  gap: 0.58rem;
  min-width: 0;
  padding: 0.82rem;
  color: var(--jl-section-ink);
  background:
    var(--jl-section-bg-wash),
    linear-gradient(180deg, color-mix(in srgb, var(--jl-section-paper) 90%, transparent), color-mix(in srgb, var(--c-paper) 76%, transparent));
  border: 1px solid var(--jl-section-frame);
  border-radius: 4px;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--c-paper-alt) 58%, transparent);
}

.section-theme-card__topline {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 0.6rem;
}

.section-theme-card__name {
  color: var(--jl-section-title-ink);
  font-family: var(--font-heading);
  font-size: 1.02rem;
  line-height: 1.1;
}

.section-theme-card__level {
  padding-top: 0.08rem;
  color: color-mix(in srgb, var(--jl-section-seal) 72%, var(--c-text-3));
}

.section-theme-card__swatches {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 0.8fr 0.8fr 0.8fr;
  height: 0.48rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--jl-section-frame) 70%, transparent);
  border-radius: 999px;
}

.section-theme-card__swatch--paper {
  background: var(--jl-section-paper);
}

.section-theme-card__swatch--mist {
  background: var(--jl-section-mist);
}

.section-theme-card__swatch--accent {
  background: var(--jl-section-accent);
}

.section-theme-card__swatch--seal {
  background: var(--jl-section-seal);
}

.section-theme-card__swatch--gold {
  background: var(--jl-section-gold);
}

.section-theme-card__swatch--ink {
  background: var(--jl-section-ink);
}

.section-theme-card__metaphor,
.section-theme-card__mood {
  margin: 0;
  overflow-wrap: anywhere;
}

.section-theme-card__metaphor {
  color: var(--jl-section-title-ink);
  font-size: 0.78rem;
  line-height: 1.35;
}

.section-theme-card__mood {
  color: color-mix(in srgb, var(--jl-section-ink) 76%, var(--c-text-3));
  font-size: 0.72rem;
  line-height: 1.35;
}

.section-theme-card__sample {
  display: flex;
  align-items: center;
  min-height: 1.9rem;
  padding-top: 0.12rem;
}

@media (max-width: 900px) {
  .section-theme-board__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .section-theme-board__header {
    display: grid;
    align-items: start;
  }

  .section-theme-board__note {
    max-width: none;
    text-align: left;
  }

  .section-theme-board__grid {
    grid-template-columns: 1fr;
  }
}
</style>
