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
  align-items: center;
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
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  background: var(--c-bg-soft);
  border: 1px solid transparent;
  font-size: 0.9rem;
  color: var(--c-text-2);
  cursor: pointer;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: inherit;
}

.tab-btn:hover {
  color: var(--c-ink);
  background: var(--c-mist-light);
  border-color: var(--c-border);
}

.tab-btn.active {
  color: #fff;
  background: var(--c-ink);
  border-color: var(--c-ink);
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
