<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

type ClusterMember = {
  path: string
  title: string
  chinese?: string
  importance?: string
  verificationStatus?: string
  seal?: string
}

type AffiliationCluster = {
  raw: string
  label: string
  chinese?: string
  path?: string
  count: number
  members: ClusterMember[]
}

const props = defineProps<{
  clusters: AffiliationCluster[]
  existingPaths: string[]
}>()

const NuxtLinkComponent = resolveComponent('NuxtLink')

const existingPathSet = computed(() => new Set(props.existingPaths))

const canLink = (path?: string) => Boolean(path && existingPathSet.value.has(path))

const fallbackSeal = (member: ClusterMember) => member.seal || member.chinese?.charAt(0) || member.title.charAt(0)

const visibleClusters = computed(() => props.clusters.slice(0, 8))
</script>

<template>
  <section v-if="visibleClusters.length" class="affiliation-clusters" aria-labelledby="affiliation-clusters-title">
    <div class="section-heading">
      <p class="section-kicker">Affiliation Clusters</p>
      <h2 id="affiliation-clusters-title">Board</h2>
    </div>

    <div class="cluster-board">
      <article
        v-for="cluster in visibleClusters"
        :key="cluster.raw"
        class="cluster-card"
      >
        <header class="cluster-header">
          <component
            :is="canLink(cluster.path) ? NuxtLinkComponent : 'span'"
            class="cluster-title"
            :to="canLink(cluster.path) ? cluster.path : undefined"
          >
            {{ cluster.label }}
          </component>
          <span class="cluster-count">{{ cluster.count }}</span>
          <small v-if="cluster.chinese" class="cluster-chinese">{{ cluster.chinese }}</small>
        </header>

        <div class="member-chips">
          <component
            :is="canLink(member.path) ? NuxtLinkComponent : 'span'"
            v-for="member in cluster.members.slice(0, 6)"
            :key="member.path"
            class="member-chip"
            :to="canLink(member.path) ? member.path : undefined"
          >
            <span class="chip-seal">{{ fallbackSeal(member) }}</span>
            <span>{{ member.title }}</span>
          </component>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.affiliation-clusters {
  min-width: 0;
}

.section-heading {
  margin-bottom: 1rem;
}

.section-kicker {
  margin: 0 0 0.3rem;
  color: var(--c-seal-red);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  letter-spacing: 0;
}

.section-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
}

.cluster-board {
  display: grid;
  gap: 0.85rem;
}

.cluster-card {
  position: relative;
  overflow: hidden;
  padding: 1rem;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--c-bg) 88%, transparent), color-mix(in srgb, var(--c-bg-soft) 90%, transparent)),
    url('/images/textures/ink-wash-01.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
  border: 1px solid var(--c-border);
  border-radius: 8px;
}

.cluster-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: color-mix(in srgb, var(--c-seal-red) 54%, transparent);
}

.cluster-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.35rem 0.8rem;
  align-items: start;
  margin-bottom: 0.9rem;
}

.cluster-title {
  min-width: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.18rem;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.cluster-title:hover {
  color: var(--c-seal-red);
}

.cluster-title:focus-visible,
.member-chip:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.cluster-count {
  min-width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 44%, transparent);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-variant-numeric: tabular-nums;
}

.cluster-chinese {
  grid-column: 1 / -1;
  color: var(--c-text-3);
  font-family: var(--font-zh-display);
  font-size: 1.2rem;
  line-height: 1.1;
}

.member-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.member-chip {
  max-width: 100%;
  min-height: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.32rem 0.55rem 0.32rem 0.38rem;
  color: var(--c-text-2);
  text-decoration: none;
  background: color-mix(in srgb, var(--c-bg) 78%, transparent);
  border: 1px solid var(--c-divider);
  border-radius: 5px;
  font-size: 0.82rem;
  line-height: 1.2;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.member-chip:hover {
  color: var(--c-ink);
  background: color-mix(in srgb, var(--c-seal-red-soft) 42%, var(--c-bg));
  border-color: color-mix(in srgb, var(--c-seal-red) 34%, var(--c-divider));
}

.member-chip span:last-child {
  min-width: 0;
  overflow-wrap: anywhere;
}

.chip-seal {
  flex: 0 0 auto;
  width: 1.4rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1px solid color-mix(in srgb, var(--c-seal-red) 64%, transparent);
  border-radius: 3px;
  font-family: var(--font-zh-display);
  font-size: 0.78rem;
  line-height: 1;
}

@media (max-width: 980px) {
  .cluster-board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .section-heading h2 {
    font-size: 2.15rem;
  }

  .cluster-board {
    grid-template-columns: 1fr;
  }
}
</style>
