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
</script>

<template>
  <aside class="field-nav">
    <div class="nav-search-row">
      <input v-model="query" type="text" class="nav-search" placeholder="Search fields..." />
    </div>

    <div class="nav-actions">
      <button type="button" @click="emit('expandAll')">Expand all</button>
      <button type="button" @click="emit('collapseAll')">Collapse all</button>
    </div>

    <div class="nav-scroll">
      <div v-for="g in filteredGroups" :key="g.id" class="nav-group">
        <div class="nav-group-label">{{ g.label }}</div>
        <button
          v-for="f in g.fields"
          :key="f.key"
          type="button"
          class="nav-field"
          @click="emit('jump', f.key)"
        >
          <span class="dot" :class="{ filled: isFilled(f.key) }"></span>
          <span class="nav-field-label">{{ f.label }}</span>
          <span v-if="f.required" class="req">*</span>
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

.nav-actions {
  display: flex;
  gap: 0.4rem;
}

.nav-actions button {
  flex: 1;
  padding: 0.3rem;
  font-size: 0.7rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: var(--c-bg-soft);
  cursor: pointer;
  color: var(--c-text-2);
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

.nav-field:hover {
  background: var(--c-bg-soft);
  color: var(--c-ink);
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

.req {
  margin-left: auto;
  color: #b3261e;
  font-weight: 700;
}
</style>
