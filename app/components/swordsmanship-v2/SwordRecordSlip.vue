<script setup lang="ts">
import { computed } from 'vue'
import type { ResolvedEntryLink } from '~/utils/entryLinkResolver'

const props = defineProps<{
  entry: {
    path: string
    title: string
    chinese?: string
    description?: string
    category?: string
    status?: string
    importance?: string
    verificationStatus?: string
    tags: string[]
    sourceNotes?: string
    lastUpdated?: string
    knownUserLinks: ResolvedEntryLink[]
    relatedLinks: ResolvedEntryLink[]
  }
  existingPaths: string[]
}>()

const isGhosted = computed(() => !props.existingPaths.includes(props.entry.path))

const cleanSourceNotes = computed(() => {
  const notes = props.entry.sourceNotes?.trim()
  if (!notes) return ''
  return notes
    .replace(/NotebookLM\s+draft\s+with\s+/i, '')
    .replace(/;\s*still\s+pending\s+/i, ' pending ')
    .replace(/^chapter-level references/i, 'Chapter-level references')
})

const verificationLabel = computed(() => {
  const value = props.entry.verificationStatus?.trim()
  if (!value) return 'Review pending'
  if (value.toLowerCase() === 'to-be-verified') return 'To Be Verified'
  return value
})

const knownUserLabel = computed(() => props.entry.knownUserLinks[0]?.label || "Chen Ping'an")
const knownUserChinese = computed(() => props.entry.knownUserLinks[0]?.chinese || '陈平安')

const moonRecord = computed(() =>
  props.entry.relatedLinks.find((item) => item.label === 'Moon in the Well') || {
    raw: '/artifacts/moon-in-the-well',
    label: 'Moon in the Well',
    path: '/artifacts/moon-in-the-well',
    exists: true,
    isRoute: true,
    shouldLink: true,
    isInternalOnly: false,
    isMissingRoute: false,
    chinese: '井中月',
  },
)

const dragonStoneRecord = computed(() =>
  props.entry.relatedLinks.find((item) => item.label === 'Dragon Slaying Stone') || {
    raw: '/artifacts/dragon-slaying-stone',
    label: 'Dragon Slaying Stone',
    path: '/artifacts/dragon-slaying-stone',
    exists: false,
    isRoute: true,
    shouldLink: false,
    isInternalOnly: false,
    isMissingRoute: true,
  },
)

const tacticalMarks = computed(() => [
  { label: 'User', value: knownUserLabel.value, chinese: knownUserChinese.value },
  { label: 'Pairing', value: moonRecord.value.label, chinese: moonRecord.value.chinese || '井中月' },
  { label: 'Refinement', value: dragonStoneRecord.value.label, state: 'Pending ghost record' },
])
</script>

<template>
  <article class="sword-record-slip" :class="{ 'is-ghosted': isGhosted }">
    <div class="slip-art" aria-hidden="true">
      <div class="slip-art__field">
        <img
          class="slip-art__image"
          src="/images/ui/generated/swordsmanship-v2/swordsmanship-caged-sparrow-slip-art.webp"
          alt=""
          loading="lazy"
        />
        <span class="slip-art__paper-wash"></span>
        <span class="slip-art__inner-frame"></span>
        <span class="slip-art__vignette"></span>
      </div>
    </div>

    <div class="slip-body">
      <header class="slip-header">
        <p class="slip-eyebrow">Primary manual slip</p>

        <div class="slip-title-row">
          <div class="slip-title-block">
            <h3>{{ entry.title }}</h3>
            <p v-if="entry.chinese" class="slip-chinese">{{ entry.chinese }}</p>
          </div>

          <div v-if="entry.chinese" class="slip-seal" aria-label="Cinnabar slip seal">
            <span>{{ entry.chinese }}</span>
          </div>
        </div>
      </header>

      <div class="slip-meta" aria-label="Caged Sparrow metadata">
        <span v-if="entry.category">{{ entry.category }}</span>
        <span v-if="entry.status">{{ entry.status }}</span>
        <span>{{ verificationLabel }}</span>
        <span v-if="entry.lastUpdated">{{ entry.lastUpdated }}</span>
      </div>

      <p v-if="entry.description" class="slip-description">{{ entry.description }}</p>

      <section class="technique-map" aria-label="Technique map">
        <div
          v-for="mark in tacticalMarks"
          :key="mark.label"
          class="technique-mark"
          :class="{ 'technique-mark--ghost': mark.state }"
        >
          <span class="technique-mark__label">{{ mark.label }}</span>
          <strong>{{ mark.value }}</strong>
          <span v-if="mark.chinese" class="technique-mark__chinese">{{ mark.chinese }}</span>
          <span v-if="mark.state" class="technique-mark__state">{{ mark.state }}</span>
        </div>
      </section>

      <div v-if="entry.tags.length" class="tag-strip" aria-label="Manual tags">
        <span v-for="tag in entry.tags" :key="tag">{{ tag }}</span>
      </div>

      <footer class="slip-footer">
        <p v-if="cleanSourceNotes" class="source-note">{{ cleanSourceNotes }}</p>

        <NuxtLink v-if="!isGhosted" class="open-record" :to="entry.path">
          Open canonical record
        </NuxtLink>
        <span v-else class="open-record open-record--disabled">Canonical route pending</span>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.sword-record-slip {
  position: relative;
  display: grid;
  grid-template-columns: minmax(17rem, 0.68fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3.5rem);
  padding: clamp(1rem, 2vw, 1.5rem);
  border: 1px solid rgba(33, 64, 78, 0.2);
  background:
    linear-gradient(135deg, rgba(240, 246, 241, 0.94), rgba(213, 229, 226, 0.86)),
    radial-gradient(circle at 92% 88%, rgba(165, 55, 47, 0.08), transparent 10rem),
    radial-gradient(circle at 15% 25%, rgba(142, 180, 170, 0.12), transparent 14rem);
  box-shadow:
    0 30px 70px rgba(4, 20, 28, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 0 0 1px rgba(165, 55, 47, 0.04);
  isolation: isolate;
  overflow: hidden;
  transition: transform 0.32s ease, box-shadow 0.32s ease, border-color 0.32s ease;
}

.sword-record-slip::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 1;
  background: linear-gradient(90deg,
    transparent 5%,
    rgba(165, 55, 47, 0.3) 30%,
    rgba(165, 55, 47, 0.5) 50%,
    rgba(165, 55, 47, 0.3) 70%,
    transparent 95%
  );
  pointer-events: none;
}

.sword-record-slip::after {
  content: '';
  position: absolute;
  left: 1.5rem;
  right: 1.5rem;
  bottom: 1.2rem;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(165, 55, 47, 0.25),
    transparent
  );
  pointer-events: none;
}

.sword-record-slip:hover {
  border-color: rgba(167, 55, 47, 0.28);
  box-shadow: 0 38px 84px rgba(4, 20, 28, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.58);
  transform: translateY(-3px) rotate(-0.2deg);
}

.sword-record-slip:hover .slip-art__image {
  filter: saturate(0.78) brightness(0.95) contrast(1.08);
}

.is-ghosted {
  opacity: 0.68;
  filter: grayscale(0.3);
}

.slip-art {
  min-height: clamp(29rem, 48vw, 42rem);
  border: 1px solid rgba(16, 44, 57, 0.2);
  background:
    radial-gradient(circle at 50% 36%, rgba(241, 249, 247, 0.82), transparent 13rem),
    linear-gradient(160deg, rgba(7, 27, 39, 0.95), rgba(24, 58, 71, 0.82) 48%, rgba(207, 225, 222, 0.42));
  overflow: hidden;
  box-shadow: inset 0 0 40px rgba(7, 27, 39, 0.15);
}

.slip-art__field {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
  overflow: hidden;
}

.slip-art__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  filter: saturate(0.72) brightness(0.92) contrast(1.06);
  mix-blend-mode: normal;
}

.slip-art__paper-wash {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(175deg, rgba(240, 246, 241, 0.18) 0%, transparent 35%),
    linear-gradient(0deg, rgba(7, 27, 39, 0.3) 0%, transparent 40%);
  pointer-events: none;
  z-index: 1;
}

.slip-art__inner-frame {
  position: absolute;
  inset: 6%;
  border: 1px solid rgba(224, 243, 243, 0.2);
  box-shadow: inset 0 0 0 1px rgba(15, 43, 57, 0.1);
  pointer-events: none;
  z-index: 2;
}

.slip-art__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(7, 27, 39, 0.35) 100%);
  pointer-events: none;
  z-index: 3;
}

.slip-body {
  min-width: 0;
  padding: clamp(1.25rem, 3.2vw, 2.8rem) clamp(0.5rem, 1vw, 0.85rem) clamp(2rem, 4vw, 3rem) 0;
  display: flex;
  flex-direction: column;
}

.slip-header {
  position: relative;
}

.slip-eyebrow {
  margin: 0 0 0.7rem;
  color: rgba(139, 50, 43, 0.78);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.17em;
  line-height: 1.3;
  text-transform: uppercase;
}

.slip-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
}

.slip-title-block {
  min-width: 0;
}

.slip-title-block h3 {
  margin: 0;
  color: #081d29;
  font-family: var(--font-heading);
  font-size: clamp(2.7rem, 5.3vw, 5.6rem);
  font-weight: 400;
  letter-spacing: -0.08em;
  line-height: 0.9;
  text-wrap: balance;
}

.slip-chinese {
  margin: 0.45rem 0 0;
  color: rgba(8, 29, 41, 0.58);
  font-family: var(--font-zh-display);
  font-size: clamp(1.6rem, 3vw, 2.6rem);
  line-height: 1;
}

.slip-seal {
  flex: 0 0 auto;
  width: clamp(3.8rem, 7vw, 5.2rem);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border: 2px solid rgba(169, 52, 44, 0.75);
  color: rgba(169, 52, 44, 0.88);
  background: rgba(244, 237, 224, 0.58);
  transform: rotate(7deg);
}

.slip-seal span {
  width: min-content;
  font-family: var(--font-zh-display);
  font-size: 1rem;
  line-height: 1.05;
  text-align: center;
  writing-mode: vertical-rl;
}

.slip-meta {
  margin-top: clamp(1.3rem, 2.5vw, 2rem);
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.slip-meta span {
  padding: 0.36rem 0.56rem;
  border: 1px solid rgba(33, 64, 78, 0.18);
  color: rgba(20, 48, 61, 0.82);
  background: rgba(235, 242, 237, 0.54);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
}

.slip-meta span:nth-child(3) {
  border-color: rgba(169, 52, 44, 0.32);
  color: rgba(169, 52, 44, 0.88);
}

.slip-description {
  max-width: 55ch;
  margin: clamp(1.2rem, 2.6vw, 2rem) 0 0;
  color: rgba(12, 38, 51, 0.76);
  font-size: clamp(1.02rem, 1.3vw, 1.14rem);
  line-height: 1.82;
  text-wrap: pretty;
}

.technique-map {
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid rgba(33, 64, 78, 0.14);
  border-bottom: 1px solid rgba(33, 64, 78, 0.1);
}

.technique-mark {
  min-width: 0;
  padding: 1rem 0.95rem 1rem 0;
  display: grid;
  gap: 0.25rem;
  border-right: 1px solid rgba(33, 64, 78, 0.1);
}

.technique-mark + .technique-mark {
  padding-left: 0.95rem;
}

.technique-mark:last-child {
  border-right: 0;
}

.technique-mark__label,
.technique-mark__state {
  color: rgba(139, 50, 43, 0.68);
  font-family: var(--font-mono);
  font-size: 0.61rem;
  letter-spacing: 0.13em;
  line-height: 1.3;
  text-transform: uppercase;
}

.technique-mark strong {
  min-width: 0;
  overflow-wrap: anywhere;
  color: #0d2a38;
  font-family: var(--font-heading);
  font-size: 1.12rem;
  font-weight: 500;
  line-height: 1.12;
}

.technique-mark__chinese {
  color: rgba(13, 42, 56, 0.54);
  font-family: var(--font-zh-display);
  font-size: 1rem;
  line-height: 1;
}

.technique-mark--ghost strong {
  color: rgba(13, 42, 56, 0.38);
}

.technique-mark--ghost {
  background: repeating-linear-gradient(-45deg, rgba(33, 64, 78, 0.04) 0 1px, transparent 1px 8px);
}

.tag-strip {
  margin-top: 1.3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tag-strip span {
  color: rgba(13, 42, 56, 0.52);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  line-height: 1;
}

.tag-strip span::before {
  content: '#';
  color: rgba(169, 52, 44, 0.62);
}

.slip-footer {
  margin-top: auto;
  padding-top: clamp(1.4rem, 3vw, 2.4rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: end;
}

.source-note {
  max-width: 56ch;
  margin: 0;
  color: rgba(13, 42, 56, 0.54);
  font-size: 0.86rem;
  font-style: italic;
  line-height: 1.65;
}

.open-record {
  justify-self: end;
  padding: 0.72rem 0.9rem;
  border: 1px solid rgba(33, 64, 78, 0.22);
  color: #092331;
  background: rgba(238, 244, 240, 0.62);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.13em;
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.22s ease, background-color 0.22s ease, border-color 0.22s ease, transform 0.22s ease;
}

.open-record:hover,
.open-record:focus-visible {
  border-color: rgba(169, 52, 44, 0.48);
  color: #7d251e;
  background: rgba(246, 242, 233, 0.9);
  outline: none;
  transform: translateY(-1px);
}

.open-record:focus-visible {
  outline: 2px solid rgba(169, 52, 44, 0.74);
  outline-offset: 0.18rem;
}

.open-record--disabled {
  opacity: 0.62;
}

@media (max-width: 960px) {
  .sword-record-slip {
    grid-template-columns: 1fr;
  }

  .slip-art {
    min-height: 24rem;
  }

  .slip-body {
    padding: 0.25rem clamp(0.35rem, 1vw, 0.75rem) clamp(1.4rem, 4vw, 2rem);
  }
}

@media (max-width: 620px) {
  .sword-record-slip {
    padding: 0.75rem;
  }

  .slip-art {
    min-height: 19rem;
  }

  .slip-title-row {
    display: grid;
  }

  .slip-seal {
    justify-self: start;
    width: 4rem;
  }

  .technique-map {
    grid-template-columns: 1fr;
  }

  .technique-mark,
  .technique-mark + .technique-mark {
    padding: 0.85rem 0;
    border-right: 0;
    border-bottom: 1px solid rgba(33, 64, 78, 0.1);
  }

  .technique-mark:last-child {
    border-bottom: 0;
  }

  .slip-footer {
    grid-template-columns: 1fr;
  }

  .open-record {
    justify-self: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sword-record-slip,
  .slip-art__image,
  .open-record {
    transition: none;
  }

  .sword-record-slip:hover,
  .open-record:hover,
  .open-record:focus-visible {
    transform: none;
  }
}
</style>
