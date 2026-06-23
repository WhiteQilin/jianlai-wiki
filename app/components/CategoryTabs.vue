<script setup lang="ts">
import LedgerTab from '~/components/ui/LedgerTab.vue'

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
      <LedgerTab
        v-for="cat in categories"
        :key="cat"
        :active="cat === active"
        variant="compact"
        tone="section"
        @click="$emit('update:active', cat)"
      >
        {{ cat }}
      </LedgerTab>
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

@media (max-width: 640px) {
  .category-tabs {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
