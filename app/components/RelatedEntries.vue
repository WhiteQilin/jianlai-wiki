<script setup lang="ts">
import type { RelatedGroup } from '~/composables/useRelatedEntries'

defineProps<{
  groups: RelatedGroup[]
}>()
</script>

<template>
  <div v-if="groups.length" class="related-entries">
    <section v-for="group in groups" :key="`${group.direction}-${group.label}`" class="related-group">
      <div class="related-group-heading">
        <SealBadge text="联" variant="outline" shape="square" />
        <h3 class="related-group-title">{{ group.label }}</h3>
      </div>

      <DossierGrid>
        <DossierCard
          v-for="entry in group.entries"
          :key="entry.path"
          :link="entry.path"
          :nameEn="entry.title"
          :nameZh="entry.chinese"
          :desc="entry.description"
          :category="entry.category"
          :status="entry.status"
          :image="entry.image"
        />
      </DossierGrid>
    </section>
  </div>
</template>

<style scoped>
.related-entries {
  margin-top: 3rem;
}

.related-group + .related-group {
  margin-top: 2.5rem;
}

.related-group-heading {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.related-group-title {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  color: var(--c-ink);
  margin: 0;
  font-weight: 400;
}
</style>
