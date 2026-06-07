<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

type PreviewCharacter = {
  path: string
  title: string
  chinese?: string
  description?: string
  importance?: string
  verificationStatus?: string
  seal?: string
  inboundCount: number
  relationshipCount: number
  relatedCount: number
}

type PreviewNode = PreviewCharacter & {
  x: number
  y: number
  relation?: string
  weight: number
}

type PreviewEdge = {
  key: string
  fromKey: string
  toKey: string
  relation?: string
  x1: number
  y1: number
  x2: number
  y2: number
}

type RelationshipPreview = {
  central: PreviewCharacter | null
  nodes: PreviewNode[]
  edges: PreviewEdge[]
  unresolved: string[]
  relationshipCount: number
}

const props = defineProps<{
  preview: RelationshipPreview
  existingPaths: string[]
}>()

const NuxtLinkComponent = resolveComponent('NuxtLink')

const existingPathSet = computed(() => new Set(props.existingPaths))
const canLink = (path: string) => existingPathSet.value.has(path)

const fallbackSeal = (entry: PreviewCharacter) => entry.seal || entry.chinese?.charAt(0) || entry.title.charAt(0)

const formatRelation = (value?: string) => value || 'Referenced'
</script>

<template>
  <section v-if="preview.central" class="relationship-preview" aria-labelledby="relationship-preview-title">
    <div class="section-heading">
      <p class="section-kicker">Relationship Atlas</p>
      <h2 id="relationship-preview-title">Preview Web</h2>
    </div>

    <div class="web-stage" aria-hidden="true">
      <svg class="web-lines" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
        <line
          v-for="edge in preview.edges"
          :key="edge.key"
          :x1="edge.x1"
          :y1="edge.y1"
          :x2="edge.x2"
          :y2="edge.y2"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <component
        :is="canLink(preview.central.path) ? NuxtLinkComponent : 'div'"
        class="web-node web-node-central"
        :to="canLink(preview.central.path) ? preview.central.path : undefined"
        :style="{ left: '50%', top: '50%' }"
      >
        <span class="node-seal">{{ fallbackSeal(preview.central) }}</span>
        <span class="node-name">{{ preview.central.title }}</span>
      </component>

      <component
        :is="canLink(node.path) ? NuxtLinkComponent : 'div'"
        v-for="node in preview.nodes"
        :key="node.path"
        class="web-node"
        :to="canLink(node.path) ? node.path : undefined"
        :style="{ left: `${node.x}%`, top: `${node.y}%` }"
      >
        <span class="node-seal">{{ fallbackSeal(node) }}</span>
        <span class="node-name">{{ node.title }}</span>
      </component>
    </div>

    <div class="mobile-cluster">
      <component
        :is="canLink(preview.central.path) ? NuxtLinkComponent : 'div'"
        class="cluster-central"
        :to="canLink(preview.central.path) ? preview.central.path : undefined"
      >
        <span class="node-seal">{{ fallbackSeal(preview.central) }}</span>
        <span>
          <strong>{{ preview.central.title }}</strong>
          <small v-if="preview.central.chinese">{{ preview.central.chinese }}</small>
        </span>
      </component>
      <div class="cluster-list">
        <component
          :is="canLink(node.path) ? NuxtLinkComponent : 'div'"
          v-for="node in preview.nodes"
          :key="`mobile-${node.path}`"
          class="cluster-row"
          :to="canLink(node.path) ? node.path : undefined"
        >
          <span>{{ node.title }}</span>
          <small>{{ formatRelation(node.relation) }}</small>
        </component>
      </div>
    </div>

    <div class="relationship-ledger">
      <article
        v-for="node in preview.nodes"
        :key="`ledger-${node.path}`"
        class="relationship-row"
      >
        <span class="row-mark">{{ fallbackSeal(node) }}</span>
        <span class="row-copy">
          <component
            :is="canLink(node.path) ? NuxtLinkComponent : 'span'"
            class="row-title"
            :to="canLink(node.path) ? node.path : undefined"
          >
            {{ node.title }}
          </component>
          <small>{{ formatRelation(node.relation) }}</small>
        </span>
      </article>
    </div>

    <div v-if="preview.unresolved.length" class="unresolved-note">
      <span>Plain-text references:</span>
      <span>{{ preview.unresolved.join(', ') }}</span>
    </div>
  </section>
</template>

<style scoped>
.relationship-preview {
  min-width: 0;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
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

.web-stage {
  position: relative;
  min-height: 520px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--c-seal-red) 8%, transparent), transparent 34%),
    linear-gradient(135deg, color-mix(in srgb, var(--c-bg) 88%, transparent), color-mix(in srgb, var(--c-bg-soft) 90%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, auto, cover;
  background-blend-mode: normal, normal, multiply;
  border: 1px solid var(--c-border);
  border-radius: 8px;
}

.web-stage::before {
  content: '';
  position: absolute;
  inset: 1rem;
  border: 1px solid var(--c-divider);
  border-radius: 5px;
  pointer-events: none;
}

.web-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.web-lines line {
  stroke: color-mix(in srgb, var(--c-seal-red) 42%, var(--c-border));
  stroke-width: 1.2;
  stroke-dasharray: 3 4;
}

.web-node {
  position: absolute;
  width: 124px;
  min-height: 108px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.9rem;
  color: inherit;
  text-align: center;
  text-decoration: none;
  transform: translate(-50%, -50%);
  background: color-mix(in srgb, var(--c-bg) 90%, transparent);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  box-shadow: 0 16px 34px rgba(20, 20, 20, 0.08);
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.web-node:hover {
  transform: translate(-50%, -52%);
  border-color: color-mix(in srgb, var(--c-seal-red) 46%, var(--c-border));
}

.web-node:focus-visible,
.row-title:focus-visible,
.cluster-row:focus-visible,
.cluster-central:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 3px;
}

.web-node-central {
  width: 152px;
  min-height: 132px;
  z-index: 2;
  background: color-mix(in srgb, var(--c-bg) 80%, var(--c-seal-red-soft));
  border-color: color-mix(in srgb, var(--c-seal-red) 48%, var(--c-border));
}

.node-seal {
  width: 2.75rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1.5px solid currentColor;
  border-radius: 4px;
  font-family: var(--font-zh-display);
  font-size: 1.35rem;
  line-height: 1;
}

.web-node-central .node-seal {
  width: 3.3rem;
  font-size: 1.65rem;
}

.node-name {
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1rem;
  line-height: 1.18;
  overflow-wrap: anywhere;
}

.web-node-central .node-name {
  font-size: 1.2rem;
}

.mobile-cluster {
  display: none;
}

.relationship-ledger {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: 0.9rem;
}

.relationship-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.65rem;
  align-items: center;
  min-width: 0;
  padding: 0.75rem;
  background: color-mix(in srgb, var(--c-bg-soft) 72%, transparent);
  border: 1px solid var(--c-divider);
  border-radius: 6px;
}

.row-mark {
  width: 2rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: var(--c-seal-red);
  border: 1px solid currentColor;
  border-radius: 3px;
  font-family: var(--font-zh-display);
  font-size: 1rem;
}

.row-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.row-title {
  color: var(--c-ink);
  font-weight: 650;
  line-height: 1.2;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.row-title:hover {
  color: var(--c-seal-red);
}

.row-copy small {
  color: var(--c-text-3);
  font-size: 0.78rem;
  line-height: 1.25;
}

.unresolved-note {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.65rem;
  margin-top: 0.9rem;
  color: var(--c-text-3);
  font-size: 0.82rem;
  line-height: 1.45;
}

.unresolved-note span:first-child {
  color: var(--c-text-2);
  font-weight: 650;
}

@media (max-width: 760px) {
  .section-heading h2 {
    font-size: 2.15rem;
  }

  .web-stage {
    display: none;
  }

  .mobile-cluster {
    display: block;
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--c-bg) 88%, transparent), color-mix(in srgb, var(--c-bg-soft) 88%, transparent)),
      url('/images/textures/ink-wash-02.webp');
    background-size: auto, cover;
    background-blend-mode: normal, multiply;
    border: 1px solid var(--c-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .cluster-central {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.75rem;
    align-items: center;
    padding: 1rem;
    color: inherit;
    text-decoration: none;
    background: color-mix(in srgb, var(--c-seal-red-soft) 60%, transparent);
    border-bottom: 1px solid var(--c-divider);
  }

  .cluster-central strong,
  .cluster-central small {
    display: block;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .cluster-central strong {
    color: var(--c-ink);
    font-family: var(--font-heading);
    font-size: 1.35rem;
    font-weight: 500;
  }

  .cluster-central small {
    margin-top: 0.15rem;
    color: var(--c-text-2);
    font-family: var(--font-zh-display);
    font-size: 1.3rem;
    line-height: 1.1;
  }

  .cluster-list {
    display: grid;
  }

  .cluster-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.85rem 1rem;
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid var(--c-divider);
  }

  .cluster-row:last-child {
    border-bottom: 0;
  }

  .cluster-row span {
    min-width: 0;
    color: var(--c-ink);
    font-weight: 650;
    overflow-wrap: anywhere;
  }

  .cluster-row small {
    flex: 0 0 auto;
    max-width: 42%;
    color: var(--c-text-3);
    text-align: right;
    overflow-wrap: anywhere;
  }

  .relationship-ledger {
    display: none;
  }
}
</style>
