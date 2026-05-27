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
          <td class="cell-character">
            <a v-if="item.link" :href="item.link" class="rel-link">
              <span class="rel-name">{{ item.name }}</span>
              <span class="rel-arrow">→</span>
            </a>
            <span v-else class="rel-name">{{ item.name }}</span>
          </td>
          <td class="rel-type">{{ item.relation }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.relationship-list {
  margin: 2.5rem 0;
  overflow-x: auto;
}

.relationship-list table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}

.relationship-list th {
  text-align: left;
  padding: 1rem 1rem 1rem 0;
  border-bottom: 2px solid var(--jl-c-ink);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.relationship-list td {
  padding: 1.5rem 1rem 1.5rem 0;
  border-bottom: 1px dotted var(--vp-c-divider);
  vertical-align: middle;
  transition: background 0.3s ease;
}

.relationship-list tr:hover td {
  background: var(--vp-c-bg-soft);
}

.cell-character {
  width: 40%;
}

.rel-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.rel-name {
  font-family: var(--jl-font-heading);
  color: var(--jl-c-ink);
  font-size: 1.25rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.rel-link:hover .rel-name {
  color: var(--jl-c-seal-red);
}

.rel-arrow {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}

.rel-link:hover .rel-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--jl-c-seal-red);
}

.rel-type {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>
