<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

type ClusterMember = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  importance?: string
  verificationStatus?: string
  seal?: string
  locationType?: string
}

type LocationCluster = {
  raw: string
  label: string
  chinese?: string
  path?: string
  fields: string[]
  count: number
  members: ClusterMember[]
}

const props = defineProps<{
  clusters: LocationCluster[]
  existingPaths: string[]
}>()

const NuxtLinkComponent = resolveComponent('NuxtLink')
const existingPathSet = computed(() => new Set(props.existingPaths))
const visibleClusters = computed(() => props.clusters.slice(0, 8))

const canLink = (path?: string) => Boolean(path && existingPathSet.value.has(path))

const fallbackSeal = (member: ClusterMember) => member.seal || member.chinese?.charAt(0) || member.title.charAt(0)

const fieldLabel = (fields: string[]) => {
  const hasParent = fields.includes('parentLocation')
  const hasLocation = fields.includes('location')
  if (hasParent && hasLocation) return 'Authored place references'
  if (hasParent) return 'Authored parentLocation reference'
  return 'Authored location reference'
}

const formatToken = (value?: string) => {
  if (!value) return 'Unmarked'
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}
</script>

<template>
  <section v-if="visibleClusters.length" class="location-clusters" aria-labelledby="location-clusters-title">
    <div class="clusters-heading">
      <div>
        <p class="clusters-kicker">Location Clusters</p>
        <h2 id="location-clusters-title">Associated Places</h2>
      </div>
      <p>
        Grouped only by authored location references; entries shown here are associated records, not route lines or measured geography.
      </p>
    </div>

    <div class="cluster-board">
      <article v-for="cluster in visibleClusters" :key="cluster.raw" class="cluster-card">
        <header class="cluster-header">
          <div class="cluster-title-group">
            <component
              :is="canLink(cluster.path) ? NuxtLinkComponent : 'span'"
              class="cluster-title"
              :to="canLink(cluster.path) ? cluster.path : undefined"
            >
              {{ cluster.label }}
            </component>
            <small v-if="cluster.chinese" class="cluster-chinese">{{ cluster.chinese }}</small>
            <small class="cluster-field">{{ fieldLabel(cluster.fields) }}</small>
          </div>
          <span class="cluster-count">{{ cluster.count }}</span>
        </header>

        <div class="member-list">
          <component
            :is="canLink(member.path) ? NuxtLinkComponent : 'article'"
            v-for="member in cluster.members.slice(0, 5)"
            :key="member.path"
            class="member-row"
            :to="canLink(member.path) ? member.path : undefined"
          >
            <span class="member-seal" aria-hidden="true">{{ fallbackSeal(member) }}</span>
            <span class="member-main">
              <span class="member-title">
                <strong>{{ member.title }}</strong>
                <small v-if="member.chinese">{{ member.chinese }}</small>
              </span>
              <span class="member-meta">
                <span>{{ member.category || member.locationType || 'World' }}</span>
                <span>{{ formatToken(member.verificationStatus) }}</span>
              </span>
            </span>
          </component>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.location-clusters {
  margin-bottom: clamp(2.5rem, 6vw, 4.75rem);
}

.clusters-heading {
  display: grid;
  grid-template-columns: minmax(0, 0.72fr) minmax(18rem, 1.28fr);
  gap: clamp(1rem, 3vw, 2rem);
  align-items: end;
  margin-bottom: 1.25rem;
  padding-top: 0.5rem;
}

.clusters-kicker {
  margin: 0 0 0.35rem;
  color: var(--world-pine, var(--c-teal-accent));
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.35;
  letter-spacing: 0;
}

.clusters-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
}

.clusters-heading p {
  margin: 0;
  max-width: 44rem;
  color: var(--c-text-2);
  font-size: 0.96rem;
  line-height: 1.7;
}

.cluster-board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.cluster-card {
  position: relative;
  min-width: 0;
  overflow: hidden;
  padding: 1rem;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background:
    linear-gradient(150deg, color-mix(in srgb, var(--c-paper-alt) 76%, transparent), color-mix(in srgb, var(--c-bg-soft) 88%, transparent)),
    url('/images/textures/ink-wash-01.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
}

.cluster-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: linear-gradient(180deg, var(--world-pine, var(--c-teal-accent)), color-mix(in srgb, var(--c-seal-red) 62%, transparent));
  opacity: 0.78;
}

.cluster-header {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: start;
  margin-bottom: 0.9rem;
}

.cluster-title-group {
  min-width: 0;
  display: grid;
  gap: 0.25rem;
}

.cluster-title {
  min-width: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.18;
  text-decoration: none;
  overflow-wrap: anywhere;
}

a.cluster-title:hover {
  color: var(--c-seal-red);
}

.cluster-title:focus-visible,
.member-row:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.cluster-chinese {
  color: var(--c-text-2);
  font-family: var(--font-zh-display);
  font-size: 1.12rem;
  line-height: 1.1;
  letter-spacing: 0;
}

.cluster-field {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.35;
}

.cluster-count {
  min-width: 2.15rem;
  height: 2.15rem;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 46%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-bg) 64%, transparent);
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-variant-numeric: tabular-nums;
}

.member-list {
  position: relative;
  display: grid;
  gap: 0.45rem;
}

.member-row {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.55rem;
  align-items: center;
  padding: 0.55rem;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--c-divider);
  border-radius: 5px;
  background: color-mix(in srgb, var(--c-bg) 76%, transparent);
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

a.member-row:hover {
  transform: translateX(3px);
  border-color: color-mix(in srgb, var(--world-pine, var(--c-teal-accent)) 34%, var(--c-divider));
  background: color-mix(in srgb, var(--world-pine-soft, var(--c-bronze-soft)) 42%, var(--c-bg));
}

.member-seal {
  width: 2rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 58%, transparent);
  border-radius: 3px;
  font-family: var(--font-zh-display);
  font-size: 0.95rem;
  line-height: 1;
}

.member-main {
  min-width: 0;
  display: grid;
  gap: 0.25rem;
}

.member-title {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.55rem;
  align-items: baseline;
}

.member-title strong {
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.18;
  overflow-wrap: anywhere;
}

.member-title small {
  color: var(--c-text-3);
  font-size: 0.82rem;
  line-height: 1.2;
}

.member-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  line-height: 1.3;
}

.member-meta span {
  overflow-wrap: anywhere;
}

@media (max-width: 1060px) {
  .cluster-board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .clusters-heading {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }

  .cluster-board {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .cluster-card {
    padding: 0.85rem;
  }

  .member-row {
    align-items: start;
  }

  a.member-row:hover {
    transform: none;
  }
}
</style>
