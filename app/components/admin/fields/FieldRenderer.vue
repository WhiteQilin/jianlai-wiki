<script setup lang="ts">
/**
 * FieldRenderer — Stage 12A
 *
 * Dispatches a single FieldDef to the appropriate control. Simple scalar types
 * are rendered inline; complex types delegate to the existing, unchanged admin
 * field components (TagEditor, RelationshipPicker, MediaPathPicker,
 * RankingEntriesEditor, LegacyRelationshipsEditor).
 *
 * The control is wrapped in a labelled, anchorable row so the FieldNavigator
 * can scroll/jump to it. Required (*) and recommended markers come from the
 * registry. This component never mutates the frontmatter object directly — it
 * emits `update` with the new value and lets the parent assign in place
 * (preserving unknown fields).
 */
import { computed } from 'vue'
import type { FieldDef } from '~/data/fieldRegistry'
import { optionsForField } from '~/data/fieldRegistry'

const props = defineProps<{
  field: FieldDef
  modelValue: any
  section: string
  entries: any[]
}>()

const emit = defineEmits<{
  update: [key: string, value: any]
}>()

const anchorId = computed(() => `field-${props.field.key}`)
const selectOptions = computed(() => optionsForField(props.field, props.section))

function set(value: any) {
  emit('update', props.field.key, value)
}

function setText(raw: string) {
  // Keep empty strings out of the saved frontmatter to avoid writing blank keys.
  set(raw === '' ? undefined : raw)
}

function setSelect(raw: string) {
  // Empty option => clear the field (important for enum fields validated server-side).
  set(raw === '' ? undefined : raw)
}

function setNumber(raw: string) {
  if (raw === '') {
    set(undefined)
    return
  }
  const n = Number(raw)
  set(Number.isNaN(n) ? raw : n)
}

const asArray = computed<string[]>(() =>
  Array.isArray(props.modelValue) ? props.modelValue : [],
)

const isMissingRequired = computed(() => {
  if (!props.field.required) return false
  const v = props.modelValue
  if (Array.isArray(v)) return v.length === 0
  return v == null || `${v}`.trim() === ''
})
</script>

<template>
  <div :id="anchorId" class="field-row" :class="{ 'is-missing': isMissingRequired }">
    <label class="field-label">
      <span class="field-name">{{ field.label }}</span>
      <span v-if="field.required" class="req" title="Required">*</span>
      <span v-else-if="field.recommended" class="rec" title="Recommended">rec</span>
      <code class="field-key">{{ field.key }}</code>
    </label>

    <!-- text -->
    <input
      v-if="field.type === 'text'"
      :value="modelValue ?? ''"
      type="text"
      :readonly="field.readonly"
      :disabled="field.readonly"
      :placeholder="field.placeholder"
      @input="setText(($event.target as HTMLInputElement).value)"
    />

    <!-- textarea -->
    <textarea
      v-else-if="field.type === 'textarea'"
      :value="modelValue ?? ''"
      rows="3"
      :placeholder="field.placeholder"
      @input="setText(($event.target as HTMLTextAreaElement).value)"
    ></textarea>

    <!-- number -->
    <input
      v-else-if="field.type === 'number'"
      :value="modelValue ?? ''"
      type="number"
      :placeholder="field.placeholder"
      @input="setNumber(($event.target as HTMLInputElement).value)"
    />

    <!-- select -->
    <select
      v-else-if="field.type === 'select'"
      :value="modelValue ?? ''"
      @change="setSelect(($event.target as HTMLSelectElement).value)"
    >
      <option value="">(none)</option>
      <option v-for="opt in selectOptions" :key="opt" :value="opt">{{ opt }}</option>
    </select>

    <!-- toggle -->
    <label v-else-if="field.type === 'toggle'" class="toggle">
      <input
        type="checkbox"
        :checked="!!modelValue"
        @change="set(($event.target as HTMLInputElement).checked)"
      />
      <span>{{ modelValue ? 'On' : 'Off' }}</span>
    </label>

    <!-- tags / string array -->
    <AdminTagEditor
      v-else-if="field.type === 'tags'"
      :model-value="asArray"
      :placeholder="`Add ${field.label.toLowerCase()}...`"
      @update:model-value="(v: string[]) => set(v && v.length ? v : undefined)"
    />

    <!-- single relationship -->
    <AdminRelationshipPicker
      v-else-if="field.type === 'relationship'"
      :model-value="typeof modelValue === 'string' ? modelValue : (Array.isArray(modelValue) ? modelValue[0] : '')"
      :entries="entries"
      :multiple="false"
      @update:model-value="(v: any) => set(typeof v === 'string' ? v : (Array.isArray(v) ? v[0] : undefined))"
    />

    <!-- multi relationship -->
    <AdminRelationshipPicker
      v-else-if="field.type === 'relationship-multi'"
      :model-value="asArray"
      :entries="entries"
      :multiple="true"
      @update:model-value="(v: any) => set(Array.isArray(v) ? (v.length ? v : undefined) : (v ? [v] : undefined))"
    />

    <!-- media path -->
    <AdminMediaPathPicker
      v-else-if="field.type === 'media'"
      :model-value="modelValue || ''"
      :preferred-type="field.mediaType || 'image'"
      label=""
      @update:model-value="(v: string) => set(v || undefined)"
    />

    <!-- ranking entries -->
    <AdminRankingEntriesEditor
      v-else-if="field.type === 'ranking-entries'"
      :model-value="Array.isArray(modelValue) ? modelValue : []"
      :entries="entries"
      @update:model-value="(v: any) => set(v)"
    />

    <!-- legacy relationships -->
    <AdminLegacyRelationshipsEditor
      v-else-if="field.type === 'legacy-relationships'"
      :model-value="Array.isArray(modelValue) ? modelValue : []"
      :entries="entries"
      @update:model-value="(v: any) => set(v)"
    />

    <p v-if="field.help" class="field-help">{{ field.help }}</p>
  </div>
</template>

<style scoped>
.field-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.6rem 0.7rem;
  border: 1px solid transparent;
  border-radius: 6px;
  scroll-margin-top: calc(var(--header-height, 64px) + 1rem);
}

.field-row.is-missing {
  border-color: #f2b8b5;
  background: #fdecec55;
}

.field-row:target {
  border-color: var(--c-seal-red);
  background: color-mix(in srgb, var(--c-seal-red) 6%, transparent);
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-ink);
}

.field-name {
  letter-spacing: 0.01em;
}

.req {
  color: #b3261e;
  font-weight: 700;
}

.rec {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a6d00;
  background: #fff6d6;
  border: 1px solid #ecd98a;
  padding: 1px 5px;
  border-radius: 999px;
}

.field-key {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: var(--c-text-3);
  opacity: 0.7;
}

.field-row input[type='text'],
.field-row input[type='number'],
.field-row textarea,
.field-row select {
  padding: 0.45rem 0.55rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9rem;
  background: var(--c-bg);
  color: var(--c-ink);
  width: 100%;
}

.field-row textarea {
  resize: vertical;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.field-help {
  margin: 0;
  font-size: 0.75rem;
  color: var(--c-text-3);
  line-height: 1.4;
}
</style>
