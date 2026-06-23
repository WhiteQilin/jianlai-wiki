<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RelatedGroup } from '~/composables/useRelatedEntries'
import { createEntryResolver, type EntryRecordLike } from '~/utils/entryLinkResolver'

const props = defineProps<{
  page: Record<string, any>
  groups?: RelatedGroup[]
  entries?: EntryRecordLike[]
}>()

const resolver = computed(() => createEntryResolver(props.entries || []))

const structuredRelationships = computed(() => {
  const rows = Array.isArray(props.page?.relationships) ? props.page.relationships : []
  return rows
    .filter((item: any) => item && typeof item.name === 'string' && item.name.trim())
    .map((item: any) => {
      const name = item.name.trim()
      const explicitLink = typeof item.link === 'string' && item.link.trim() ? item.link.trim() : ''
      const resolved = explicitLink ? resolver.value.resolveEntryLink(explicitLink) : null
      return {
        name,
        relation: typeof item.relation === 'string' ? item.relation.trim() : '',
        link: resolved && !resolved.isInternalOnly ? resolved : null,
      }
    })
    .filter((item) => item.name || item.link)
})

const relatedGroups = computed(() => props.groups || [])
const hasContent = computed(() => structuredRelationships.value.length > 0 || relatedGroups.value.length > 0)

const isExpanded = ref(false)
const INITIAL_LIMIT = 8

const visibleRelationships = computed(() => {
  if (isExpanded.value) return structuredRelationships.value
  return structuredRelationships.value.slice(0, INITIAL_LIMIT)
})

const hasMoreRelationships = computed(() => structuredRelationships.value.length > INITIAL_LIMIT)
</script>

<template>
  <section v-if="hasContent" class="entry-relationship-panel">
    <div class="panel-heading">
      <UiSealStamp text="联" variant="carved" size="sm" writing="horizontal" decorative />
      <div>
        <p class="eyebrow">Connections</p>
        <h2>Relationships & Related Entries</h2>
        <UiBrushUnderline tone="section" weight="bold" width="long" />
      </div>
    </div>

    <div v-if="structuredRelationships.length" class="structured-relationships">
      <article
        v-for="relationship in visibleRelationships"
        :key="`${relationship.name}-${relationship.relation}`"
        class="relationship-card"
      >
        <RouteDisplayLink
          v-if="relationship.link"
          :item="{ ...relationship.link, label: relationship.name }"
          variant="row"
        />
        <span v-else class="relationship-name">{{ relationship.name }}</span>
        <span v-if="relationship.relation" class="relationship-label">{{ relationship.relation }}</span>
      </article>
    </div>

    <div v-if="hasMoreRelationships" class="expand-action">
      <button class="expand-button" @click="isExpanded = !isExpanded">
        {{ isExpanded ? 'Show Less' : `Show All ${structuredRelationships.length} Relationships` }}
      </button>
    </div>

    <RelatedEntries v-if="relatedGroups.length" :groups="relatedGroups" class="related-card-groups" />
  </section>
</template>

<style scoped>
.entry-relationship-panel {
  margin-top: 3rem;
}

.panel-heading {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1.2rem;
}

.eyebrow {
  margin: 0 0 0.2rem;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.panel-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 500;
}

.panel-heading :deep(.brush-underline) {
  display: block;
  width: 7.5rem;
  height: 0.5rem;
  margin-top: 0.55rem;
}

.structured-relationships {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.relationship-card {
  position: relative;
  overflow: hidden;
  padding: 1rem;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--c-paper) 84%, transparent), color-mix(in srgb, var(--c-bg-soft) 92%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-blend-mode: normal, multiply;
  border-left: 2px solid color-mix(in srgb, var(--c-seal-red) 52%, transparent);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.04);
}

.relationship-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, color-mix(in srgb, var(--c-seal-red) 8%, transparent), transparent 45%);
  opacity: 0.38;
  pointer-events: none;
}

.relationship-name {
  position: relative;
  z-index: 1;
  display: block;
  color: var(--c-ink);
  font-weight: 650;
}

.relationship-card :deep(.route-display-link) {
  position: relative;
  z-index: 1;
  font-weight: 650;
}

.relationship-label {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 0.35rem;
  color: var(--c-text-3);
  font-size: 0.88rem;
  line-height: 1.45;
}

.expand-action {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.expand-button {
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--c-border) 70%, transparent);
  color: var(--c-text-2);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: all var(--transition-base);
  border-radius: 2px;
}

.expand-button:hover {
  color: var(--c-seal-red);
  border-color: var(--c-seal-red-soft);
  background: color-mix(in srgb, var(--c-seal-red) 5%, transparent);
}

.related-card-groups {
  margin-top: 2.25rem;
}
</style>
