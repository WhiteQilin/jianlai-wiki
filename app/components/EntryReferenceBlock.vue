<script setup lang="ts">
const props = defineProps<{
  page: Record<string, any>
}>()

const verificationLabel = computed(() => {
  const value = props.page?.verificationStatus
  const map: Record<string, string> = {
    verified: 'Verified',
    'to-be-verified': 'To Be Verified',
    disputed: 'Disputed',
    speculative: 'Speculative',
  }
  return value ? map[value] || value : ''
})

const sourceText = computed(() => {
  const raw = props.page?.sourceNotes || 'This entry is currently being cross-referenced with the original text. Details may be subject to change.'
  return `${raw}`
    .replace(/\bto-be-verified\b/gi, 'To Be Verified')
    .replace(/\bspeculative\b/gi, 'Speculative')
    .replace(/\bdisputed\b/gi, 'Disputed')
})

const hasContent = computed(() => Boolean(props.page?.sourceNotes || props.page?.verificationStatus || props.page?.firstAppearance || props.page?.lastUpdated))
</script>

<template>
  <section v-if="hasContent" class="entry-reference-block">
    <div class="reference-heading">
      <UiSealStamp text="证" variant="outline" size="sm" writing="horizontal" :decorative="true" />
      <div>
        <p class="eyebrow">Source Status</p>
        <h2>Verification Notes</h2>
        <UiBrushUnderline tone="section" weight="bold" width="long" />
      </div>
    </div>

    <div class="reference-body">
      <p class="source-notes">{{ sourceText }}</p>
      <dl class="source-facts">
        <div v-if="verificationLabel" class="source-fact">
          <dt>Verification</dt>
          <dd>{{ verificationLabel }}</dd>
        </div>
        <div v-if="page?.firstAppearance" class="source-fact">
          <dt>First Appearance</dt>
          <dd>{{ page.firstAppearance }}</dd>
        </div>
        <div v-if="page?.lastUpdated" class="source-fact">
          <dt>Last Updated</dt>
          <dd>{{ page.lastUpdated }}</dd>
        </div>
      </dl>
      <div class="reference-cta">
        <p>Notice an error or have more details to add?</p>
        <UiInkTextButton to="/contribute" active-mark="none">Suggest an Edit &rarr;</UiInkTextButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.entry-reference-block {
  margin-top: 3rem;
  padding: 1.2rem;
  border: 1px solid color-mix(in srgb, var(--c-divider) 74%, transparent);
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--c-bg-soft) 90%, transparent), color-mix(in srgb, var(--c-paper) 80%, transparent)),
    url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  background-blend-mode: normal, multiply;
}

.reference-heading {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1rem;
}

.eyebrow {
  margin: 0 0 0.15rem;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.reference-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 500;
}

.reference-heading :deep(.brush-underline) {
  display: block;
  width: 7.5rem;
  height: 0.5rem;
  margin-top: 0.5rem;
}

.source-notes {
  margin: 0;
  color: var(--c-text-2);
  font-size: 0.95rem;
  line-height: 1.7;
}

.source-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1.2rem;
  margin: 1rem 0 0;
}

.source-fact {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.source-fact dt {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.source-fact dd {
  margin: 0;
  color: var(--c-ink);
  font-size: 0.85rem;
}

.reference-cta {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--c-divider);
  font-size: 0.85rem;
  color: var(--c-text-3);
}

.reference-cta p {
  margin: 0 0 0.5rem 0;
}
</style>
