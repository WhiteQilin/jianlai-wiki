<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

type CultivationPath = {
  title?: string
  chinese?: string
  description?: string
  pathType?: string
  tags?: string[]
  verificationStatus?: string
  path?: string
  link?: string
}

const props = defineProps<{
  paths: CultivationPath[]
}>()

const nuxtLink = resolveComponent('NuxtLink')
const pathOrder = ['Qi Refiner', 'Sword Cultivator', 'Pure Martial Artist']

const orderedPaths = computed(() =>
  [...props.paths].sort((a, b) => {
    const aIndex = pathOrder.indexOf(a.title || '')
    const bIndex = pathOrder.indexOf(b.title || '')
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex)
  }),
)

const entryLink = (path: CultivationPath) => path.path || path.link || ''
const visibleTags = (path: CultivationPath) => (path.tags || []).slice(0, 3)
const sealText = (path: CultivationPath) => (path.chinese || path.title || '?').slice(0, 1)
const formatStatus = (status?: string) => status?.replace(/-/g, ' ') || ''
const cardClass = (title?: string) => `path-card--${(title || 'path').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
</script>

<template>
  <section class="path-comparison" aria-labelledby="cultivation-path-comparison">
    <div class="comparison-heading">
      <span class="section-kicker">System map</span>
      <h2 id="cultivation-path-comparison">Path comparison</h2>
      <p>
        The available path entries are shown before the realm ladder so each approach keeps its own frame.
      </p>
    </div>

    <div class="path-map" role="list">
      <article
        v-for="path in orderedPaths"
        :key="path.path || path.title"
        class="path-card-shell"
        role="listitem"
      >
        <component
          :is="entryLink(path) ? nuxtLink : 'div'"
          :to="entryLink(path) || undefined"
          class="path-card"
          :class="cardClass(path.title)"
        >
          <span class="path-thread" aria-hidden="true"></span>

          <div class="path-card-top">
            <span class="path-seal" aria-hidden="true">{{ sealText(path) }}</span>
            <div class="path-title-group">
              <span v-if="path.pathType" class="path-type">{{ path.pathType }}</span>
              <h3>{{ path.title }}</h3>
              <span v-if="path.chinese" class="path-chinese">{{ path.chinese }}</span>
            </div>
          </div>

          <p v-if="path.description" class="path-description">{{ path.description }}</p>

          <div v-if="visibleTags(path).length" class="tag-row" aria-label="Tags">
            <span v-for="tag in visibleTags(path)" :key="tag" class="tag-chip">{{ tag }}</span>
          </div>

          <div class="path-card-footer">
            <span v-if="path.verificationStatus" class="verification-badge">
              {{ formatStatus(path.verificationStatus) }}
            </span>
            <span v-if="entryLink(path)" class="entry-cue">Open entry</span>
          </div>
        </component>
      </article>
    </div>

    <p class="comparison-note">
      The ladder below is the Qi Refiner realm grouping. It is not the Pure Martial Artist ladder; Sword Cultivator remains represented by its Qi Refining sword-cultivation path metadata.
    </p>
  </section>
</template>

<style scoped>
.path-comparison {
  position: relative;
  margin: 0 0 5rem;
  padding: 2.25rem;
  border: 1px solid color-mix(in srgb, var(--c-bronze) 28%, transparent);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-paper-alt) 78%, transparent), color-mix(in srgb, var(--c-mist-light) 88%, transparent)),
    var(--c-paper);
  overflow: hidden;
}

.path-comparison::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(90deg, color-mix(in srgb, var(--c-ink) 4%, transparent) 1px, transparent 1px),
    linear-gradient(180deg, color-mix(in srgb, var(--c-ink) 3%, transparent) 1px, transparent 1px);
  background-size: 44px 44px;
  opacity: 0.42;
  pointer-events: none;
}

.comparison-heading {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.75fr) minmax(18rem, 1.25fr);
  gap: 1.5rem;
  align-items: end;
  margin-bottom: 2rem;
}

.section-kicker {
  align-self: start;
  color: var(--c-seal-red);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

.comparison-heading h2 {
  grid-column: 1;
  margin: 1.7rem 0 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 0;
}

.comparison-heading p {
  grid-column: 2;
  margin: 0;
  max-width: 46rem;
  color: var(--c-text-2);
  font-size: 1rem;
  line-height: 1.75;
}

.path-map {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  align-items: start;
  padding-top: 1.2rem;
}

.path-map::before {
  content: '';
  position: absolute;
  top: 0.35rem;
  left: 12%;
  right: 12%;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--c-bronze) 64%, transparent), transparent);
}

.path-card-shell {
  position: relative;
  min-width: 0;
}

.path-card {
  position: relative;
  min-height: 24rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: 1.35rem;
  color: inherit;
  text-decoration: none;
  border: 1px solid color-mix(in srgb, var(--c-ink) 12%, transparent);
  border-radius: 6px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-paper-alt) 88%, transparent), color-mix(in srgb, var(--c-paper) 96%, transparent)),
    var(--c-paper);
  box-shadow: 0 16px 34px color-mix(in srgb, var(--c-bronze) 9%, transparent);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.path-card-shell:nth-child(2) {
  margin-top: 1.35rem;
}

.path-card-shell:nth-child(3) {
  margin-top: 0.45rem;
}

.path-card:hover {
  transform: translateY(-0.25rem);
  border-color: color-mix(in srgb, var(--c-seal-red) 52%, var(--c-border));
  box-shadow: 0 20px 44px color-mix(in srgb, var(--c-bronze) 16%, transparent);
}

.path-card:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 4px;
}

.path-thread {
  position: absolute;
  top: -1.2rem;
  left: 1.8rem;
  width: 1px;
  height: 1.2rem;
  background: color-mix(in srgb, var(--c-bronze) 64%, transparent);
}

.path-card-top {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.path-seal {
  width: 3.1rem;
  height: 3.1rem;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 72%, transparent);
  color: var(--c-seal-red);
  background: color-mix(in srgb, var(--c-seal-red) 5%, transparent);
  font-family: var(--font-zh-display);
  font-size: 1.45rem;
  line-height: 1;
}

.path-title-group {
  min-width: 0;
}

.path-type {
  display: block;
  color: var(--c-bronze);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0;
  line-height: 1.45;
}

.path-title-group h3 {
  margin: 0.2rem 0 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.45rem;
  font-weight: 500;
  line-height: 1.22;
  letter-spacing: 0;
  overflow-wrap: anywhere;
}

.path-chinese {
  display: block;
  margin-top: 0.35rem;
  color: var(--c-text-3);
  font-size: 0.95rem;
  overflow-wrap: anywhere;
}

.path-description {
  margin: 0;
  color: var(--c-text-2);
  font-size: 0.96rem;
  line-height: 1.72;
  overflow-wrap: anywhere;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: auto;
}

.tag-chip {
  max-width: 100%;
  padding: 0.22rem 0.45rem;
  border: 1px solid color-mix(in srgb, var(--c-bronze) 28%, transparent);
  border-radius: 2px;
  color: var(--c-text-2);
  background: color-mix(in srgb, var(--c-bronze) 5%, transparent);
  font-size: 0.78rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.path-card-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding-top: 0.9rem;
  border-top: 1px solid color-mix(in srgb, var(--c-ink) 8%, transparent);
}

.verification-badge,
.entry-cue {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

.entry-cue {
  color: var(--c-seal-red);
  white-space: nowrap;
}

.comparison-note {
  position: relative;
  z-index: 1;
  margin: 1.5rem 0 0;
  padding: 0.9rem 1rem;
  border-left: 2px solid color-mix(in srgb, var(--c-seal-red) 56%, transparent);
  color: var(--c-text-2);
  background: color-mix(in srgb, var(--c-seal-red) 5%, transparent);
  font-size: 0.92rem;
  line-height: 1.7;
}

@media (max-width: 980px) {
  .comparison-heading {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .comparison-heading h2,
  .comparison-heading p {
    grid-column: auto;
  }

  .path-map {
    grid-template-columns: 1fr;
  }

  .path-map::before,
  .path-thread {
    display: none;
  }

  .path-card {
    min-height: 0;
  }

  .path-card-shell,
  .path-card-shell:nth-child(2),
  .path-card-shell:nth-child(3) {
    margin-top: 0;
  }
}

@media (max-width: 640px) {
  .path-comparison {
    padding: 1.2rem;
    margin-bottom: 3.5rem;
  }

  .comparison-heading h2 {
    font-size: 1.55rem;
  }

  .path-card {
    padding: 1rem;
  }

  .path-card-top {
    gap: 0.8rem;
  }

  .path-seal {
    width: 2.55rem;
    height: 2.55rem;
    font-size: 1.15rem;
  }

  .path-title-group h3 {
    font-size: 1.25rem;
  }

  .path-card-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.35rem;
  }
}
</style>
