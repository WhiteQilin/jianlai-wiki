<script setup lang="ts">
defineProps<{
  name: string
  image?: string
  titles?: string[]
  affiliation?: string
  realm?: string
  weapon?: string
}>()
</script>

<template>
  <aside class="character-infobox" role="complementary" :aria-label="`${name} infobox`">
    <div class="infobox-header">
      <h3 class="infobox-name">{{ name }}</h3>
    </div>

    <div v-if="image" class="infobox-image">
      <img :src="image" :alt="name" loading="lazy" />
    </div>

    <table class="infobox-table">
      <tbody>
        <tr v-if="titles && titles.length">
          <th>Titles</th>
          <td>
            <span v-for="(title, i) in titles" :key="i" class="infobox-tag">{{ title }}</span>
          </td>
        </tr>
        <tr v-if="affiliation">
          <th>Faction</th>
          <td>{{ affiliation }}</td>
        </tr>
        <tr v-if="realm">
          <th>Realm</th>
          <td><span class="realm-value">{{ realm }}</span></td>
        </tr>
        <tr v-if="weapon">
          <th>Weapon</th>
          <td>{{ weapon }}</td>
        </tr>
      </tbody>
    </table>
  </aside>
</template>

<style scoped>
.character-infobox {
  float: right;
  width: 300px;
  max-width: 100%;
  margin: 0 0 1.5em 1.5em;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
  overflow: hidden;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .character-infobox {
    float: none;
    width: 100%;
    margin: 1em 0;
  }
}

.infobox-header {
  background: var(--vp-c-brand-3);
  padding: 0.75em 1em;
  text-align: center;
}

.infobox-name {
  margin: 0;
  color: #ffffff;
  font-family: var(--jl-font-heading);
  font-size: 1.2em;
  font-weight: 600;
}

.infobox-image {
  text-align: center;
  padding: 1em;
  background: var(--vp-c-bg-soft);
}

.infobox-image img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.infobox-table {
  width: 100%;
  border-collapse: collapse;
}

.infobox-table th,
.infobox-table td {
  padding: 0.5em 0.75em;
  border-top: 1px solid var(--vp-c-divider);
  text-align: left;
  vertical-align: top;
}

.infobox-table th {
  width: 5em;
  font-weight: 600;
  color: var(--jl-c-jade);
  white-space: nowrap;
}

.dark .infobox-table th {
  color: var(--jl-c-jade-light);
}

.infobox-tag {
  display: inline-block;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 0.1em 0.5em;
  border-radius: 3px;
  margin: 0.1em 0.25em 0.1em 0;
  font-size: 0.85em;
}

.realm-value {
  color: var(--jl-c-gold-dim);
  font-weight: 600;
}

.dark .realm-value {
  color: var(--jl-c-gold);
}
</style>
