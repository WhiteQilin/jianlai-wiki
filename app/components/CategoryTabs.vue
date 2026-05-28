<script setup lang="ts">
defineProps<{
  categories: string[]
  active: string
}>()

defineEmits<{
  (e: 'update:active', category: string): void
}>()
</script>

<template>
  <div class="category-tabs">
    <div class="tab-label">Filter:</div>
    <div class="tab-list">
      <button 
        v-for="cat in categories" 
        :key="cat"
        class="tab-btn"
        :class="{ active: cat === active }"
        @click="$emit('update:active', cat)"
      >
        {{ cat }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.category-tabs {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--c-divider);
}

.tab-label {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.tab-list {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  background: none;
  border: none;
  font-size: 0.95rem;
  color: var(--c-text-2);
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: color 0.3s ease;
  font-family: inherit;
}

.tab-btn:hover {
  color: var(--c-ink);
}

.tab-btn.active {
  color: var(--c-ink);
  font-weight: 600;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--c-seal-red);
}
</style>
