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

const themeClass = computed(() => {
  const label = props.label.toLowerCase()
  if (label.includes('identity') || label.includes('classification')) return 'theme-identity'
  if (label.includes('media')) return 'theme-media'
  if (label.includes('relationship')) return 'theme-relationships'
  if (label.includes('sourcing') || label.includes('verification')) return 'theme-sourcing'
  return 'theme-default'
})
</script>

<template>
  <section class="field-group" :class="[themeClass, { open }]">
    <button type="button" class="group-header" @click="emit('toggle')">
      <span class="group-accent" aria-hidden="true"></span>
      <span class="chevron" :class="{ open }">▸</span>
      <span class="group-label">{{ label }}</span>
      <span v-if="hasMissing" class="missing-badge" :title="`${missingRequired} required field(s) missing`">
        {{ missingRequired }} missing
      </span>
      <span v-else class="complete-badge">Template ok</span>
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
  border-radius: 10px;
  overflow: hidden;
  background: var(--c-bg);
  box-shadow: 0 10px 28px rgba(20, 18, 16, 0.05);
}

.group-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  position: relative;
  padding: 0.78rem 0.95rem;
  border: none;
  background: linear-gradient(90deg, color-mix(in srgb, var(--c-bg-soft) 88%, #fff), var(--c-bg-soft));
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--c-ink);
  text-align: left;
}

.group-header:hover {
  background: color-mix(in srgb, var(--c-seal-red) 5%, var(--c-bg-soft));
}

.group-accent {
  width: 0.22rem;
  align-self: stretch;
  border-radius: 999px;
  background: var(--group-accent, var(--c-border));
}

.theme-identity { --group-accent: var(--c-seal-red); }
.theme-media { --group-accent: #2d5f8b; }
.theme-relationships { --group-accent: #6d5f2d; }
.theme-sourcing { --group-accent: #8a5f1f; }

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

.missing-badge,
.complete-badge {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 7px;
  border-radius: 999px;
}

.missing-badge {
  color: #8f1d18;
  background: #fdecec;
  border: 1px solid #f2b8b5;
}

.complete-badge {
  color: #1b5e20;
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
}

.count {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--c-text-3);
}

.group-body {
  padding: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  border-top: 1px solid color-mix(in srgb, var(--c-border) 70%, transparent);
}
</style>
