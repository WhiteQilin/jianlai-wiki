<script setup lang="ts">
import { computed } from 'vue'
import type { ResolvedEntryLink } from '~/utils/entryLinkResolver'
import { resolvePublicImage } from '~/utils/publicMedia'

type SwordManualEntry = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  status?: string
  importance?: string
  verificationStatus?: string
  image?: string
  seal?: string
  tags: string[]
  sourceNotes?: string
  lastUpdated?: string
  knownUserLinks: ResolvedEntryLink[]
  relatedLinks: ResolvedEntryLink[]
}

const props = defineProps<{
  entry: SwordManualEntry | null
  existingPaths: string[]
}>()

const existingPathSet = computed(() => new Set(props.existingPaths))

const canOpen = computed(() => Boolean(props.entry?.path && existingPathSet.value.has(props.entry.path)))

const resolvedImage = computed(() => (props.entry ? resolvePublicImage(props.entry.image) : ''))

const fallbackSeal = computed(() => {
  const entry = props.entry
  if (!entry) return 'S'
  return entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0)
})

const formatToken = (value?: string, fallback = 'Unmarked') => {
  if (!value) return fallback
  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}
</script>

<template>
  <section class="featured-slip" aria-labelledby="featured-manual-title">
    <template v-if="entry">
      <div class="slip-media" aria-label="Manual seal">
        <img v-if="resolvedImage" :src="resolvedImage" :alt="entry.title" loading="lazy">
        <div v-else class="seal-fallback">
          <span class="seal-mark zh-display">{{ fallbackSeal }}</span>
          <small>Recorded Art</small>
        </div>
      </div>

      <div class="slip-copy">
        <p class="slip-kicker">Current authored manual record</p>

        <header class="slip-title-block">
          <h2 id="featured-manual-title">{{ entry.title }}</h2>
          <span v-if="entry.chinese" class="title-zh zh-display">{{ entry.chinese }}</span>
        </header>

        <p v-if="entry.description" class="slip-description">{{ entry.description }}</p>

        <div class="field-grid" aria-label="Manual record metadata">
          <div class="field-pair">
            <span>Category</span>
            <strong>{{ entry.category || 'Swordsmanship' }}</strong>
          </div>
          <div class="field-pair">
            <span>Editorial prominence</span>
            <strong>{{ formatToken(entry.importance) }}</strong>
          </div>
          <div class="field-pair">
            <span>Verification</span>
            <strong>{{ formatToken(entry.verificationStatus) }}</strong>
          </div>
          <div v-if="entry.lastUpdated" class="field-pair">
            <span>Last updated</span>
            <strong>{{ entry.lastUpdated }}</strong>
          </div>
        </div>

        <div v-if="entry.tags.length" class="tag-row" aria-label="Recorded tags">
          <span v-for="tag in entry.tags" :key="tag" class="manual-tag">{{ tag }}</span>
        </div>

        <div class="link-panels">
          <div v-if="entry.knownUserLinks.length" class="link-group">
            <span class="link-label">Known users</span>
            <div class="link-wrap">
              <RouteDisplayLink
                v-for="user in entry.knownUserLinks"
                :key="user.raw"
                :item="user"
                variant="chip"
              />
            </div>
          </div>

          <div v-if="entry.relatedLinks.length" class="link-group">
            <span class="link-label">Related records</span>
            <div class="link-wrap">
              <RouteDisplayLink
                v-for="related in entry.relatedLinks"
                :key="related.raw"
                :item="related"
                variant="chip"
              />
            </div>
          </div>
        </div>

        <p v-if="entry.sourceNotes" class="source-note">{{ entry.sourceNotes }}</p>

        <NuxtLink v-if="canOpen" :to="entry.path" class="detail-link">
          <span>Open manual record</span>
          <span class="detail-mark" aria-hidden="true">/</span>
        </NuxtLink>
      </div>
    </template>

    <EmptyArchiveState v-else />
  </section>
</template>

<style scoped>
.featured-slip {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(220px, 0.38fr) minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
  padding: clamp(1rem, 3vw, 1.55rem);
  border: 1px solid color-mix(in srgb, var(--sword-celadon, var(--c-ink)) 22%, var(--c-border));
  border-radius: 8px;
  background:
    linear-gradient(120deg, color-mix(in srgb, var(--c-paper-alt) 82%, transparent), color-mix(in srgb, var(--c-bg-soft) 90%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
  box-shadow: 0 22px 48px color-mix(in srgb, var(--sword-celadon, #315f59) 8%, transparent);
}

.featured-slip::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--sword-celadon, #315f59) 8%, transparent), transparent 34%),
    radial-gradient(ellipse at 90% 8%, color-mix(in srgb, var(--c-bronze) 14%, transparent), transparent 30rem);
  pointer-events: none;
}

.slip-media,
.slip-copy {
  position: relative;
  z-index: 1;
}

.slip-media {
  min-height: 22rem;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--c-ink) 12%, transparent);
  border-radius: 6px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-paper-alt) 72%, transparent), color-mix(in srgb, var(--c-bg) 84%, transparent)),
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--c-ink) 3%, transparent) 0 1px, transparent 1px 1.6rem);
  overflow: hidden;
}

.slip-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.86) contrast(1.04);
}

.seal-fallback {
  display: grid;
  justify-items: center;
  gap: 0.9rem;
}

.seal-mark {
  width: min(12rem, 58vw);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  padding: 0.7rem;
  color: var(--c-seal-red);
  border: 3px double currentColor;
  border-radius: 6px;
  background: color-mix(in srgb, var(--c-seal-red) 4%, transparent);
  font-size: clamp(2.35rem, 6vw, 4.5rem);
  line-height: 1;
  text-align: center;
  overflow-wrap: anywhere;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c-seal-red) 18%, transparent);
}

.seal-fallback small {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.25;
}

.slip-copy {
  min-width: 0;
  display: grid;
  gap: 1rem;
  align-content: center;
}

.slip-kicker {
  width: fit-content;
  margin: 0;
  padding-bottom: 0.38rem;
  color: var(--sword-celadon, var(--c-teal-accent));
  border-bottom: 1px solid color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 42%, transparent);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.3;
  letter-spacing: 0;
}

.slip-title-block {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 1rem;
  align-items: baseline;
}

.slip-title-block h2 {
  min-width: 0;
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: clamp(2.35rem, 5vw, 4.3rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: 0;
  text-wrap: balance;
  overflow-wrap: anywhere;
}

.title-zh {
  color: color-mix(in srgb, var(--c-ink) 68%, var(--c-seal-red));
  font-size: clamp(1.75rem, 4vw, 3rem);
  line-height: 1;
}

.slip-description {
  max-width: 64ch;
  margin: 0;
  color: var(--c-text-2);
  font-size: 1rem;
  line-height: 1.7;
  text-wrap: pretty;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  padding: 1px;
  background: var(--c-divider);
  border: 1px solid var(--c-divider);
  border-radius: 6px;
  overflow: hidden;
}

.field-pair {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 0.34rem;
  padding: 0.72rem;
  background: color-mix(in srgb, var(--c-bg) 84%, transparent);
}

.field-pair span {
  color: var(--sword-celadon, var(--c-teal-accent));
  font-family: var(--font-mono);
  font-size: 0.66rem;
  line-height: 1.3;
}

.field-pair strong {
  color: var(--c-ink);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.tag-row,
.link-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.manual-tag {
  min-height: 1.75rem;
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.52rem;
  color: var(--c-text-2);
  border: 1px solid var(--c-divider);
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-bg) 72%, transparent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.link-panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.link-group {
  min-width: 0;
  display: grid;
  gap: 0.55rem;
  align-content: start;
  padding: 0.75rem;
  border: 1px solid var(--c-divider);
  border-radius: 6px;
  background: color-mix(in srgb, var(--c-bg) 64%, transparent);
}

.link-label {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.3;
}

.source-note {
  margin: 0;
  padding-left: 0.8rem;
  color: var(--c-text-3);
  border-left: 2px solid color-mix(in srgb, var(--c-seal-red) 48%, transparent);
  font-size: 0.84rem;
  line-height: 1.55;
}

.detail-link {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.5rem;
  padding: 0.32rem 0.38rem 0.32rem 0.85rem;
  color: var(--c-bg);
  background: var(--c-ink);
  border: 1px solid var(--c-ink);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.2;
  text-decoration: none;
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1), background 0.28s cubic-bezier(0.32, 0.72, 0, 1), border-color 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}

.detail-link:hover {
  transform: translateY(-1px);
  background: var(--c-seal-red);
  border-color: var(--c-seal-red);
}

.detail-link:active {
  transform: translateY(0) scale(0.98);
}

.detail-link:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.detail-mark {
  width: 1.72rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-ink);
  background: color-mix(in srgb, var(--c-bg) 88%, transparent);
  border-radius: 999px;
}

@media (max-width: 980px) {
  .featured-slip {
    grid-template-columns: 1fr;
  }

  .slip-media {
    min-height: 16rem;
  }
}

@media (max-width: 760px) {
  .field-grid,
  .link-panels {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 540px) {
  .featured-slip {
    padding: 1rem;
  }

  .slip-media {
    min-height: 13rem;
  }

  .field-grid,
  .link-panels {
    grid-template-columns: 1fr;
  }

  .detail-link {
    max-width: 100%;
  }
}
</style>
