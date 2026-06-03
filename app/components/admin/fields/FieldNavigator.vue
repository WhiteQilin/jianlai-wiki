<script setup lang="ts">
/**
 * FieldNavigator — Stage 12A
 *
 * Left sidebar for the Fandom-like editor. Provides:
 *  - field search (filters by label or key)
 *  - grouped, jump-to-field list (click scrolls + highlights the field row)
 *  - a "filled" dot per field and a required marker
 *  - expand/collapse all
 *  - an Advanced/Custom group entry for unknown fields
 */
import { computed, ref } from 'vue'
import type { FieldDef, FieldGroupDef } from '~/data/fieldRegistry'

const props = defineProps<{
  groups: Array<FieldGroupDef & { fields: FieldDef[] }>
  frontmatter: Record<string, any>
  customKeys: string[]
}>()

const emit = defineEmits<{
  jump: [key: string]
  expandAll: []
  collapseAll: []
}>()

const query = ref('')

function isFilled(key: string): boolean {
  const v = props.frontmatter?.[key]
  if (Array.isArray(v)) return v.length > 0
  return v != null && `${v}`.trim() !== ''
}

const filteredGroups = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.groups
  return props.groups
    .map((g) => ({
      ...g,
      fields: g.fields.filter(
        (f) => f.label.toLowerCase().includes(q) || f.key.toLowerCase().includes(q),
      ),
    }))
    .filter((g) => g.fields.length > 0)
})

const filteredCustomKeys = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.customKeys
  return props.customKeys.filter((k) => k.toLowerCase().includes(q))
})
function jumpToSectionBlock(elementId: string) {
  if (!import.meta.client) return
  const el = document.getElementById(elementId)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <aside class="field-nav">
    <div class="nav-title-block">
      <span class="nav-eyebrow">Template fields</span>
      <strong>Entry Structure</strong>
    </div>

    <div class="nav-search-row">
      <input v-model="query" type="text" class="nav-search" placeholder="Search template fields..." />
    </div>

    <div class="nav-actions">
      <button type="button" @click="emit('expandAll')">Expand all</button>
      <button type="button" @click="emit('collapseAll')">Collapse all</button>
    </div>

    <div class="quick-jump-anchors">
      <button type="button" class="anchor-link-item" @click="jumpToSectionBlock('body-editor-block')">Jump to body editor</button>
      <button type="button" class="anchor-link-item" @click="jumpToSectionBlock('references-editor-block')">Jump to references</button>
    </div>

    <div class="nav-scroll">
      <div v-for="g in filteredGroups" :key="g.id" class="nav-group">
        <div class="nav-group-label">{{ g.label }}</div>
        <button
          v-for="f in g.fields"
          :key="f.key"
          type="button"
          class="nav-field"
          :class="{ filled: isFilled(f.key), optional: !f.required && !f.recommended }"
          @click="emit('jump', f.key)"
        >
          <span class="dot" :class="{ filled: isFilled(f.key) }"></span>
          <span class="nav-field-label">{{ f.label }}</span>
          <span v-if="f.required" class="field-badge required">Required</span>
          <span v-else-if="f.recommended" class="field-badge recommended">Recommended</span>
        </button>
      </div>

      <div v-if="filteredCustomKeys.length" class="nav-group">
        <div class="nav-group-label">Advanced / Custom</div>
        <button
          v-for="k in filteredCustomKeys"
          :key="k"
          type="button"
          class="nav-field"
          @click="emit('jump', `custom-${k}`)"
        >
          <span class="dot filled"></span>
          <span class="nav-field-label">{{ k }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.field-nav {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: sticky;
  top: calc(var(--header-height, 64px) + 1rem);
  max-height: calc(100vh - var(--header-height, 64px) - 2rem);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 0.75rem;
  background: color-mix(in srgb, var(--c-bg) 92%, var(--c-bg-soft));
  box-shadow: 0 10px 28px rgba(20, 18, 16, 0.06);
}

.nav-title-block {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--c-border);
}

.nav-title-block strong {
  font-family: var(--font-heading, serif);
  font-size: 1rem;
}

.nav-eyebrow {
  font-family: var(--font-mono, monospace);
  font-size: 0.62rem;
  color: var(--c-seal-red);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav-search {
  width: 100%;
  padding: 0.45rem 0.55rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  font-size: 0.85rem;
  background: var(--c-bg);
  color: var(--c-ink);
}

.nav-actions,
.quick-jump-anchors {
  display: flex;
  gap: 0.4rem;
}

.quick-jump-anchors {
  flex-direction: column;
}

.nav-actions button,
.anchor-link-item {
  flex: 1;
  padding: 0.3rem;
  font-size: 0.7rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: var(--c-bg-soft);
  cursor: pointer;
  color: var(--c-text-2);
}

.anchor-link-item {
  width: 100%;
  text-align: left;
  background: var(--c-bg);
}

.nav-actions button:hover {
  color: var(--c-seal-red);
}

.nav-scroll {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding-right: 0.2rem;
}

.nav-group-label {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--c-text-3);
  margin-bottom: 0.3rem;
  padding-left: 0.2rem;
}

.nav-field {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.32rem 0.4rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.82rem;
  color: var(--c-text-2);
  text-align: left;
}

.nav-field:hover,
.nav-field.filled {
  background: var(--c-bg-soft);
  color: var(--c-ink);
}

.nav-field.optional {
  opacity: 0.72;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1px solid var(--c-border);
  background: transparent;
  flex-shrink: 0;
}

.dot.filled {
  background: var(--c-seal-red);
  border-color: var(--c-seal-red);
}

.nav-field-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.field-badge,
.req {
  margin-left: auto;
  font-family: var(--font-mono, monospace);
  font-size: 0.56rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.05rem 0.28rem;
  border-radius: 999px;
}

.field-badge.required,
.req {
  color: #b3261e;
  background: #fdecec;
}

.field-badge.recommended {
  color: #5f4300;
  background: #fff8df;
}
</style>
