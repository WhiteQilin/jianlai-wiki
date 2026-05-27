<script setup lang="ts">
defineProps<{
  categories: string[]
  active?: string
}>()
</script>

<template>
  <div class="category-filter">
    <div class="filter-label">Filter:</div>
    <div class="filter-options">
      <span 
        v-for="cat in categories" 
        :key="cat"
        class="filter-option"
        :class="{ active: cat === active || (!active && cat === 'All') }"
      >
        {{ cat }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 1rem 0;
  border-top: 1px solid var(--vp-c-border);
  border-bottom: 1px solid var(--vp-c-border);
}

.filter-label {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.filter-options {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filter-option {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
}

.filter-option:hover {
  color: var(--jl-c-ink);
}

.filter-option.active {
  color: var(--jl-c-ink);
  font-weight: 600;
}

.filter-option.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--jl-c-seal-red);
}
</style>
