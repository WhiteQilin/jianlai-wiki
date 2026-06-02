<script setup lang="ts">
import { computed } from 'vue'

interface LegacyRelRow {
  name: string
  relation?: string
  link?: string
}

const props = defineProps<{
  modelValue: LegacyRelRow[] | undefined
  entries: any[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LegacyRelRow[]]
}>()

const rows = computed<LegacyRelRow[]>({
  get: () => Array.isArray(props.modelValue) ? props.modelValue : [],
  set: (v) => emit('update:modelValue', v)
})

function addRow() {
  rows.value = [...rows.value, { name: '', relation: '', link: '' }]
}

function removeRow(index: number) {
  const next = [...rows.value]
  next.splice(index, 1)
  rows.value = next
}

function moveUp(index: number) {
  if (index <= 0) return
  const next = [...rows.value]
  const cur = next[index]
  const prev = next[index - 1]
  if (!cur || !prev) return
  next[index - 1] = cur
  next[index] = prev
  rows.value = next
}

function moveDown(index: number) {
  if (index >= rows.value.length - 1) return
  const next = [...rows.value]
  const cur = next[index]
  const after = next[index + 1]
  if (!cur || !after) return
  next[index + 1] = cur
  next[index] = after
  rows.value = next
}

function updateRow(index: number, patch: Partial<LegacyRelRow>) {
  const next = [...rows.value]
  const current = next[index] || { name: '', relation: '', link: '' }
  next[index] = {
    name: patch.name ?? current.name ?? '',
    relation: patch.relation ?? current.relation ?? '',
    link: patch.link ?? current.link ?? '',
  }
  rows.value = next
}

function isGhostLink(link?: string) {
  if (!link) return false
  return !props.entries.some(e => e.routePath === link)
}
</script>

<template>
  <div class="legacy-editor">
    <div class="head">
      <h4>Legacy Relationships</h4>
      <button type="button" class="add-btn" @click="addRow">+ Add Row</button>
    </div>

    <div v-if="rows.length === 0" class="empty">No legacy relationship rows.</div>

    <div v-for="(row, idx) in rows" :key="idx" class="row">
      <div class="row-actions">
        <button type="button" @click="moveUp(idx)" :disabled="idx===0">↑</button>
        <button type="button" @click="moveDown(idx)" :disabled="idx===rows.length-1">↓</button>
        <button type="button" class="danger" @click="removeRow(idx)">✕</button>
      </div>

      <div class="grid">
        <div class="field">
          <label>Name</label>
          <input :value="row.name" @input="updateRow(idx, { name: ($event.target as HTMLInputElement).value })" type="text" />
        </div>

        <div class="field">
          <label>Relation</label>
          <input :value="row.relation || ''" @input="updateRow(idx, { relation: ($event.target as HTMLInputElement).value })" type="text" />
        </div>

        <div class="field full">
          <label>Link</label>
          <AdminRelationshipPicker
            :model-value="row.link || ''"
            :entries="entries"
            :multiple="false"
            @update:model-value="(v) => updateRow(idx, { link: (v as string) || '' })"
          />
          <small v-if="row.link && isGhostLink(row.link)">Unresolved link (allowed): {{ row.link }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legacy-editor { margin-top: 1rem; display: flex; flex-direction: column; gap: .75rem; }
.head { display: flex; justify-content: space-between; align-items: center; }
.row { border: 1px solid var(--c-border); border-radius: 6px; padding: .75rem; display: flex; gap: .75rem; background: var(--c-bg-soft); }
.row-actions { display: flex; flex-direction: column; gap: .4rem; }
.row-actions button { border: 1px solid var(--c-border); background: var(--c-bg); border-radius: 4px; }
.row-actions .danger { color: #b3261e; }
.grid { flex: 1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .6rem .8rem; }
.field { display: flex; flex-direction: column; gap: .25rem; }
.field.full { grid-column: 1 / -1; }
.empty { color: var(--c-text-3); font-size: .9rem; }
.add-btn { border: 1px solid var(--c-border); border-radius: 4px; padding: .35rem .6rem; background: var(--c-bg); }
</style>
