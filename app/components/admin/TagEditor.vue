<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: string[]
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const inputVal = ref('')

const tags = computed({
  get: () => props.modelValue || [],
  set: (val) => emit('update:modelValue', val)
})

function addTag() {
  let val = inputVal.value.trim()
  if (!val) return

  // Convert spaces to hyphens and lowercase
  val = val.toLowerCase().replace(/\s+/g, '-')

  if (!tags.value.includes(val)) {
    tags.value = [...tags.value, val]
  }
  inputVal.value = ''
}

function removeTag(index: number) {
  const newTags = [...tags.value]
  newTags.splice(index, 1)
  tags.value = newTags
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  } else if (e.key === 'Backspace' && inputVal.value === '' && tags.value.length > 0) {
    removeTag(tags.value.length - 1)
  }
}
</script>

<template>
  <div class="tag-editor">
    <div class="tags-container">
      <span v-for="(tag, index) in tags" :key="tag" class="tag-chip">
        {{ tag }}
        <button type="button" class="remove-btn" @click="removeTag(index)" aria-label="Remove tag">&times;</button>
      </span>
      <input
        v-model="inputVal"
        type="text"
        class="tag-input"
        :placeholder="tags.length === 0 ? (placeholder || 'Add tags...') : ''"
        @keydown="handleKeydown"
        @blur="addTag"
      />
    </div>
    <div class="tag-hint">Press Enter or comma to add. Spaces are converted to hyphens.</div>
  </div>
</template>

<style scoped>
.tag-editor {
  width: 100%;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: var(--c-bg);
  min-height: 42px;
  align-items: center;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: var(--font-mono);
  color: var(--c-ink);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--c-text-3);
  cursor: pointer;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  color: var(--c-seal-red);
}

.tag-input {
  flex: 1;
  min-width: 120px;
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--c-ink);
  padding: 0.2rem;
}

.tag-hint {
  font-size: 0.75rem;
  color: var(--c-text-3);
  margin-top: 0.4rem;
}
</style>
