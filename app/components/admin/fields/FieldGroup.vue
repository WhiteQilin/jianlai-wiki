<script setup lang="ts">
/**
 * FieldGroup — Stage 12A
 *
 * Collapsible section grouping. Shows a header with the group label, a count of
 * filled/total fields, and a "missing required" badge. Slots its field rows.
 */
import { computed } from 'vue'

const props = defineProps<{
  label: string
  total: number
  filled: number
  missingRequired?: number
  open: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const hasMissing = computed(() => (props.missingRequired ?? 0) > 0)
</script>

<template>
  <section class="field-group" :class="{ open }">
    <button type="button" class="group-header" @click="emit('toggle')">
      <span class="chevron" :class="{ open }">▸</span>
      <span class="group-label">{{ label }}</span>
      <span v-if="hasMissing" class="missing-badge" :title="`${missingRequired} required field(s) missing`">
        {{ missingRequired }} required
      </span>
      <span class="count">{{ filled }}/{{ total }}</span>
    </button>

    <div v-show="open" class="group-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.field-group {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--c-bg);
}

.group-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  border: none;
  background: var(--c-bg-soft);
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--c-ink);
  text-align: left;
}

.group-header:hover {
  background: color-mix(in srgb, var(--c-seal-red) 5%, var(--c-bg-soft));
}

.chevron {
  display: inline-block;
  transition: transform 0.2s ease;
  color: var(--c-text-3);
}

.chevron.open {
  transform: rotate(90deg);
}

.group-label {
  letter-spacing: 0.01em;
}

.missing-badge {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8f1d18;
  background: #fdecec;
  border: 1px solid #f2b8b5;
  padding: 2px 7px;
  border-radius: 999px;
}

.count {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--c-text-3);
}

.group-body {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
</style>
