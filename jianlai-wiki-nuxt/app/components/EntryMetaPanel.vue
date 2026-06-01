<script setup lang="ts">
/**
 * EntryMetaPanel — generic, non-character info panel for wiki entries.
 *
 * Deliberately NOT CharacterInfobox: that component is portrait-semantic
 * (3/4 aspect frame, 无 fallback, character-only naming). This sibling reuses
 * the same design tokens + SealBadge but renders only the meta a generic
 * entry actually has, and shows the image block only when an image exists.
 */
const props = defineProps<{
  image?: string
  alt?: string
  category?: string
  status?: string
  importance?: string
  verificationStatus?: string
  tags?: string[]
}>()

const VERIFICATION_LABELS: Record<string, string> = {
  verified: 'Verified',
  'to-be-verified': 'To Be Verified',
  disputed: 'Disputed',
  speculative: 'Speculative',
}

interface Fact {
  label: string
  value: string
  kind?: 'status' | 'verification'
}

const facts = computed<Fact[]>(() => {
  const list: Fact[] = []
  if (props.category) list.push({ label: 'Category', value: props.category })
  if (props.status) list.push({ label: 'Status', value: props.status, kind: 'status' })
  if (props.importance) list.push({ label: 'Importance', value: props.importance })
  if (props.verificationStatus) {
    list.push({
      label: 'Verification',
      value: VERIFICATION_LABELS[props.verificationStatus] || props.verificationStatus,
      kind: 'verification',
    })
  }
  return list
})

const hasContent = computed(() => Boolean(props.image) || facts.value.length > 0 || (props.tags?.length ?? 0) > 0)
</script>

<template>
  <aside v-if="hasContent" class="entry-meta-panel">
    <div v-if="image" class="meta-image-wrapper">
      <img :src="image" :alt="alt || 'Entry image'" class="meta-image" />
      <div class="image-overlay"></div>
    </div>

    <div class="meta-content">
      <div class="meta-texture"></div>

      <div v-for="fact in facts" :key="fact.label" class="meta-fact">
        <span class="fact-label">{{ fact.label }}</span>
        <span
          class="fact-value"
          :class="{
            'stamp-effect': fact.kind === 'status',
            'is-importance': fact.label === 'Importance',
          }"
        >{{ fact.value }}</span>
      </div>

      <div v-if="tags && tags.length" class="meta-tags">
        <span class="fact-label">Tags</span>
        <div class="tag-list">
          <SealBadge
            v-for="tag in tags"
            :key="tag"
            :text="tag"
            variant="outline"
            shape="rectangle"
            class="tag-chip"
          />
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.entry-meta-panel {
  width: 100%;
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.meta-image-wrapper {
  width: 100%;
  aspect-ratio: 4 / 3;
  position: relative;
  background: var(--c-bg);
  border-bottom: 1px solid var(--c-border);
}

.meta-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  inset: 0;
  border: 4px solid var(--c-border);
  opacity: 0.3;
  pointer-events: none;
}

.meta-content {
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
}

.meta-texture {
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.05;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 0;
}

.dark .meta-texture {
  mix-blend-mode: screen;
  opacity: 0.03;
}

.meta-fact {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid var(--c-divider);
  position: relative;
  z-index: 1;
}

.meta-fact:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.fact-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.fact-value {
  font-size: 1rem;
  color: var(--c-ink);
  font-weight: 500;
  line-height: 1.4;
}

.fact-value.is-importance {
  text-transform: capitalize;
}

.stamp-effect {
  font-family: var(--font-heading);
  color: var(--c-seal-red);
  border: 1px solid var(--c-seal-red-soft);
  padding: 0.2rem 0.6rem;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(184, 42, 42, 0.03);
  transform: rotate(-2deg);
  display: inline-block;
  margin-top: 0.2rem;
  align-self: flex-start;
}

.meta-tags {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
  z-index: 1;
  padding-top: 1.2rem;
  border-top: 1px solid var(--c-divider);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-chip {
  font-size: 0.7rem;
}

/* Override the vertical writing-mode of rectangle seals for horizontal tag chips */
.tag-chip :deep(.seal-text) {
  writing-mode: horizontal-tb;
}

.tag-chip.seal-shape-rectangle {
  writing-mode: horizontal-tb;
  min-height: 0;
  padding: 0.25em 0.6em;
  letter-spacing: 0.04em;
}
</style>
