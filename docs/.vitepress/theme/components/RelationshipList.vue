<script setup lang="ts">
defineProps<{
  items: Array<{
    name: string
    relation: string
    link?: string
  }>
}>()
</script>

<template>
  <div class="relationship-list">
    <table role="table" aria-label="Character relationships">
      <thead>
        <tr>
          <th>Character</th>
          <th>Relationship</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in items" :key="i">
          <td>
            <a v-if="item.link" :href="item.link" class="rel-link">{{ item.name }}</a>
            <span v-else>{{ item.name }}</span>
          </td>
          <td class="rel-type">{{ item.relation }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.relationship-list {
  margin: 1em 0;
  overflow-x: auto;
}

.relationship-list table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92em;
}

.relationship-list th {
  text-align: left;
  padding: 0.6em 0.75em;
  border-bottom: 2px solid var(--jl-c-jade);
  font-family: var(--jl-font-heading);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.dark .relationship-list th {
  border-bottom-color: var(--jl-c-jade-light);
}

.relationship-list td {
  padding: 0.5em 0.75em;
  border-bottom: 1px solid var(--vp-c-divider);
  vertical-align: top;
}

.rel-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
}

.rel-link:hover {
  color: var(--jl-c-gold);
  text-decoration: underline;
}

.rel-type {
  color: var(--vp-c-text-2);
}
</style>
