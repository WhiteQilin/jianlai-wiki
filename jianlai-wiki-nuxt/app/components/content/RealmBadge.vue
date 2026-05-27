<script setup lang="ts">
const props = defineProps<{
  realm: string
}>()
</script>

<template>
  <span
    class="realm-badge"
    :title="`Cultivation Realm: ${realm}`"
  >
    {{ realm }}
  </span>
</template>

<style scoped>
.realm-badge {
  display: inline-block;
  padding: 0.2em 0.8em;
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--c-ink);
  border: 1px solid var(--c-border);
  background: var(--c-bg-soft);
  white-space: nowrap;
  letter-spacing: 0.05em;
  border-radius: 2px;
}
</style>
