<script setup lang="ts">
const props = defineProps<{
  realm: string
}>()

// Color mapping for known cultivation realms
const realmColors: Record<string, string> = {
  'Qi Refining': '#5b8c5a',
  'Foundation Establishment': '#4a7c59',
  'Golden Core': '#c9a84c',
  'Nascent Soul': '#b8943f',
  'Jade Pu': '#8b5cf6',
  'Immortal': '#e0c068',
  'Ascension': '#f59e0b',
  'Return to Truth': '#6fcf97',
  'Tenth Realm': '#ef4444',
  'Fourteenth Realm': '#dc2626',
  // Chinese names also supported
  '炼气': '#5b8c5a',
  '筑基': '#4a7c59',
  '金丹': '#c9a84c',
  '元婴': '#b8943f',
  '玉璞': '#8b5cf6',
  '仙人': '#e0c068',
  '飞升': '#f59e0b',
  '归真': '#6fcf97',
  '止境': '#ef4444',
  '十四境': '#dc2626',
}

const badgeColor = realmColors[props.realm] || '#6b7280'
</script>

<template>
  <span
    class="realm-badge"
    :style="{ '--badge-color': badgeColor }"
    :title="`Cultivation Realm: ${realm}`"
  >
    {{ realm }}
  </span>
</template>

<style scoped>
.realm-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15em 0.6em;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 600;
  line-height: 1.4;
  color: var(--badge-color);
  background: color-mix(in srgb, var(--badge-color) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--badge-color) 30%, transparent);
  white-space: nowrap;
}
</style>
