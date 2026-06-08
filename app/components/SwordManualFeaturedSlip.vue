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
  if (!entry) return '剑'
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

const pendingReason = (link: ResolvedEntryLink): 'missing' | 'internal' | 'plain' => {
  if (link.isInternalOnly) return 'internal'
  if (link.isMissingRoute) return 'missing'
  return 'plain'
}
</script>

<template>
  <ManualSlip
    v-if="entry"
    featured
    tone="sword"
    class="featured-manual-slip"
    aria-labelledby="featured-manual-title"
  >
    <template #margin>
      <span>剑术手录</span>
    </template>

    <div class="manual-feature">
      <aside class="manual-seal-plate" aria-label="Manual seal">
        <img v-if="resolvedImage" :src="resolvedImage" :alt="entry.title" loading="lazy">
        <div v-else class="seal-fallback">
          <span class="seal-mark zh-display">{{ fallbackSeal }}</span>
          <small>Featured Manual Slip</small>
        </div>
      </aside>

      <article class="manual-copy">
        <p class="manual-kicker">Current authored manual record</p>

        <header class="manual-title-block">
          <h2 id="featured-manual-title">{{ entry.title }}</h2>
          <span v-if="entry.chinese" class="manual-title-zh zh-display">{{ entry.chinese }}</span>
        </header>

        <p v-if="entry.description" class="manual-description">{{ entry.description }}</p>

        <div class="annotation-grid" aria-label="Manual record annotations">
          <div class="annotation-pair">
            <span>Category</span>
            <strong>{{ entry.category || 'Swordsmanship' }}</strong>
          </div>
          <div class="annotation-pair">
            <span>Editorial mark</span>
            <strong>{{ formatToken(entry.importance) }}</strong>
          </div>
          <div class="annotation-pair">
            <span>Verification</span>
            <strong>{{ formatToken(entry.verificationStatus) }}</strong>
          </div>
          <div v-if="entry.lastUpdated" class="annotation-pair">
            <span>Last updated</span>
            <strong>{{ entry.lastUpdated }}</strong>
          </div>
        </div>

        <div v-if="entry.tags.length" class="manual-tags" aria-label="Recorded tags">
          <JadeChip v-for="tag in entry.tags" :key="tag">{{ tag }}</JadeChip>
        </div>

        <div class="manual-link-panels">
          <div v-if="entry.knownUserLinks.length" class="manual-link-group">
            <span class="link-label">Known User</span>
            <div class="link-wrap">
              <template v-for="user in entry.knownUserLinks" :key="user.raw">
                <JadeChip v-if="user.shouldLink" :to="user.path">
                  {{ user.label }}
                  <span v-if="user.chinese" class="chip-chinese">{{ user.chinese }}</span>
                </JadeChip>
                <PendingRouteChip
                  v-else
                  :label="user.label"
                  :chinese="user.chinese"
                  :reason="pendingReason(user)"
                />
              </template>
            </div>
          </div>

          <div v-if="entry.relatedLinks.length" class="manual-link-group">
            <span class="link-label">Related Records</span>
            <div class="link-wrap">
              <template v-for="related in entry.relatedLinks" :key="related.raw">
                <JadeChip v-if="related.shouldLink" :to="related.path">
                  {{ related.label }}
                  <span v-if="related.chinese" class="chip-chinese">{{ related.chinese }}</span>
                </JadeChip>
                <PendingRouteChip
                  v-else
                  :label="related.label"
                  :chinese="related.chinese"
                  :reason="pendingReason(related)"
                />
              </template>
            </div>
          </div>
        </div>

        <p v-if="entry.sourceNotes" class="source-note">{{ entry.sourceNotes }}</p>

        <div class="manual-actions">
          <SealButton v-if="canOpen" :to="entry.path" aria-label="Open manual record">
            Open manual record
          </SealButton>
          <InkButton v-if="entry.relatedLinks.length" to="/artifacts">
            Trace related artifacts
          </InkButton>
        </div>
      </article>
    </div>
  </ManualSlip>

  <section v-else class="featured-manual-empty">
    <EmptyArchiveState />
  </section>
</template>

<style scoped>
.featured-manual-slip {
  margin-bottom: clamp(1.4rem, 3vw, 2rem);
}

.manual-feature {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(210px, 0.36fr) minmax(0, 1fr);
  gap: clamp(1rem, 3.5vw, 2.1rem);
}

.manual-seal-plate {
  min-height: 24rem;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--c-ink) 12%, transparent);
  border-radius: 3px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-paper-alt) 74%, transparent), color-mix(in srgb, var(--c-bg) 86%, transparent)),
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--c-ink) 3%, transparent) 0 1px, transparent 1px 1.7rem);
  overflow: hidden;
}

.manual-seal-plate img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.86) contrast(1.04);
}

.seal-fallback {
  display: grid;
  justify-items: center;
  gap: 1rem;
  padding: 1rem;
}

.seal-mark {
  width: min(12rem, 58vw);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  padding: 0.8rem;
  color: var(--c-seal-red);
  border: 3px double currentColor;
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-seal-red) 4%, transparent);
  font-size: clamp(2.45rem, 6vw, 4.8rem);
  line-height: 1;
  text-align: center;
  overflow-wrap: anywhere;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c-seal-red) 18%, transparent);
}

.seal-fallback small {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  line-height: 1.25;
}

.manual-copy {
  min-width: 0;
  display: grid;
  gap: 1rem;
  align-content: center;
}

.manual-kicker {
  width: fit-content;
  margin: 0;
  padding-bottom: 0.38rem;
  color: var(--c-seal-red);
  border-bottom: 1px solid color-mix(in srgb, var(--c-seal-red) 38%, transparent);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.3;
}

.manual-title-block {
  min-width: 0;
  display: grid;
  gap: 0.45rem;
}

.manual-title-block h2 {
  min-width: 0;
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: clamp(2.45rem, 5.2vw, 4.45rem);
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: 0;
  text-wrap: balance;
  overflow-wrap: anywhere;
}

.manual-title-zh {
  color: color-mix(in srgb, var(--c-ink) 66%, var(--c-seal-red));
  font-size: clamp(1.8rem, 4vw, 3.05rem);
  line-height: 1;
}

.manual-description {
  max-width: 64ch;
  margin: 0;
  color: var(--c-text-2);
  font-size: 1rem;
  line-height: 1.72;
  text-wrap: pretty;
}

.annotation-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  padding: 1px;
  background: var(--c-divider);
  border: 1px solid var(--c-divider);
  border-radius: 4px;
  overflow: hidden;
}

.annotation-pair {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 0.34rem;
  padding: 0.75rem;
  background: color-mix(in srgb, var(--c-bg) 84%, transparent);
}

.annotation-pair span {
  color: var(--sword-celadon, var(--c-teal-accent));
  font-family: var(--font-mono);
  font-size: 0.66rem;
  line-height: 1.3;
}

.annotation-pair strong {
  color: var(--c-ink);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.manual-tags,
.link-wrap,
.manual-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.manual-link-panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.manual-link-group {
  min-width: 0;
  display: grid;
  gap: 0.55rem;
  align-content: start;
  padding: 0.75rem;
  border: 1px solid var(--c-divider);
  border-radius: 4px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--c-bg) 70%, transparent), color-mix(in srgb, var(--c-bg-soft) 68%, transparent)),
    var(--c-bg);
}

.link-label {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.3;
}

.chip-chinese {
  color: color-mix(in srgb, var(--c-text-3) 82%, var(--c-seal-red));
  font-size: 0.9em;
}

.source-note {
  margin: 0;
  padding-left: 0.8rem;
  color: var(--c-text-3);
  border-left: 2px solid color-mix(in srgb, var(--c-seal-red) 48%, transparent);
  font-size: 0.84rem;
  line-height: 1.55;
}

.manual-actions {
  align-items: center;
  margin-top: 0.2rem;
}

.featured-manual-empty {
  border: 1px dashed var(--c-divider);
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-bg-soft) 54%, transparent);
}

@media (max-width: 980px) {
  .manual-feature {
    grid-template-columns: 1fr;
  }

  .manual-seal-plate {
    min-height: 16rem;
  }
}

@media (max-width: 760px) {
  .annotation-grid,
  .manual-link-panels {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 540px) {
  .manual-seal-plate {
    min-height: 13rem;
  }

  .annotation-grid,
  .manual-link-panels {
    grid-template-columns: 1fr;
  }
}
</style>
