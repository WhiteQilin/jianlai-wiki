<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: string | string[] | undefined
  entries: any[] // The full list of entries from /api/editor/entries
  multiple?: boolean
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
}>()

const searchQuery = ref('')
const isFocused = ref(false)
const showDropdown = computed(() => isFocused.value && searchQuery.value.length > 0)

// Normalize modelValue to an array for internal handling
const selectedPaths = computed<string[]>({
  get: () => {
    if (!props.modelValue) return []
    return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
  },
  set: (val) => {
    if (props.multiple) {
      emit('update:modelValue', val.length > 0 ? val : undefined)
    } else {
      emit('update:modelValue', val.length > 0 ? val[0] : undefined)
    }
  }
})

// Filter entries based on search query
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  const q = searchQuery.value.toLowerCase()
  
  return props.entries.filter(e => {
    // Exclude internal/meta paths
    if (e.routePath.startsWith('/titles') || e.routePath.startsWith('/_')) return false
    
    // Exclude already selected
    if (selectedPaths.value.includes(e.routePath)) return false

    return e.title.toLowerCase().includes(q) || 
           e.chinese.toLowerCase().includes(q) || 
           (e.pinyin && e.pinyin.toLowerCase().includes(q)) ||
           e.routePath.toLowerCase().includes(q)
  }).slice(0, 10) // Limit results
})

function selectEntry(path: string) {
  if (props.multiple) {
    if (!selectedPaths.value.includes(path)) {
      selectedPaths.value = [...selectedPaths.value, path]
    }
  } else {
    selectedPaths.value = [path]
  }
  searchQuery.value = ''
  // Keep focus on input if multiple, else blur
  if (!props.multiple) {
    isFocused.value = false
  }
}

function removeEntry(index: number) {
  const newPaths = [...selectedPaths.value]
  newPaths.splice(index, 1)
  selectedPaths.value = newPaths
}

// Allow adding unresolved paths (ghost links)
function addGhostLink() {
  let path = searchQuery.value.trim()
  if (!path) return
  
  if (!path.startsWith('/')) {
    path = '/' + path
  }

  if (props.multiple) {
    if (!selectedPaths.value.includes(path)) {
      selectedPaths.value = [...selectedPaths.value, path]
    }
  } else {
    selectedPaths.value = [path]
  }
  searchQuery.value = ''
}

// Helper to get display info for a selected path
function getEntryInfo(path: string) {
  const entry = props.entries.find(e => e.routePath === path)
  if (entry) {
    return { title: entry.title, chinese: entry.chinese, section: entry.section, exists: true }
  }
  return { title: path, chinese: 'Unresolved', section: 'unknown', exists: false }
}

// Handle blur with a slight delay to allow click events on dropdown to fire
function handleBlur() {
  setTimeout(() => {
    isFocused.value = false
  }, 200)
}
</script>

<template>
  <div class="relationship-picker">
    <label v-if="label" class="picker-label">{{ label }}</label>
    
    <div class="selected-items" v-if="selectedPaths.length > 0">
      <div v-for="(path, index) in selectedPaths" :key="path" class="selected-chip" :class="{ 'is-ghost': !getEntryInfo(path).exists }">
        <div class="chip-info">
          <span class="chip-title">{{ getEntryInfo(path).title }}</span>
          <span class="chip-zh">{{ getEntryInfo(path).chinese }}</span>
          <span class="chip-section">{{ getEntryInfo(path).section }}</span>
        </div>
        <button type="button" class="remove-btn" @click="removeEntry(index)" aria-label="Remove">&times;</button>
      </div>
    </div>

    <div class="search-container" v-if="multiple || selectedPaths.length === 0">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Search entries to link..."
        @focus="isFocused = true"
        @blur="handleBlur"
        @keydown.enter.prevent="addGhostLink"
      />
      
      <div v-if="showDropdown" class="dropdown">
        <div v-if="searchResults.length === 0" class="dropdown-empty">
          No matches found. Press Enter to add as unresolved path.
        </div>
        <div 
          v-for="result in searchResults" 
          :key="result.routePath" 
          class="dropdown-item"
          @click="selectEntry(result.routePath)"
        >
          <div class="item-main">
            <span class="item-title">{{ result.title }}</span>
            <span class="item-zh">{{ result.chinese }}</span>
          </div>
          <div class="item-meta">
            <span class="item-section">{{ result.section }}</span>
            <span class="item-category">{{ result.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.relationship-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.picker-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--c-ink);
}

.selected-items {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.selected-chip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
}

.selected-chip.is-ghost {
  border-color: #ffb8b8;
  background: #fff5f5;
}

.chip-info {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.chip-title {
  font-weight: 500;
  color: var(--c-ink);
}

.chip-zh {
  font-size: 0.85rem;
  color: var(--c-text-2);
}

.chip-section {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--c-text-3);
  background: var(--c-bg);
  padding: 0.1rem 0.3rem;
  border-radius: 2px;
  border: 1px solid var(--c-divider);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--c-text-3);
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0 0.2rem;
}

.remove-btn:hover {
  color: var(--c-seal-red);
}

.search-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9rem;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 10;
  max-height: 250px;
  overflow-y: auto;
  margin-top: 0.2rem;
}

.dropdown-empty {
  padding: 0.8rem;
  color: var(--c-text-3);
  font-size: 0.85rem;
  text-align: center;
}

.dropdown-item {
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  border-bottom: 1px solid var(--c-divider);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: var(--c-bg-soft);
}

.item-main {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.item-title {
  font-weight: 500;
  color: var(--c-ink);
}

.item-zh {
  font-size: 0.85rem;
  color: var(--c-text-2);
}

.item-meta {
  display: flex;
  gap: 0.4rem;
}

.item-section, .item-category {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--c-text-3);
  background: var(--c-bg-soft);
  padding: 0.1rem 0.3rem;
  border-radius: 2px;
  border: 1px solid var(--c-divider);
}
</style>
