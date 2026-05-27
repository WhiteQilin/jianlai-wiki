<script setup lang="ts">
import { ref } from 'vue'

const activeCategory = ref('All')

const { data: items } = await useAsyncData('cultivation-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/cultivation/%')
    .order('title', 'ASC')
    .all()
})

useSeoMeta({
  title: 'Cultivation | Jian Lai Wiki'
})
</script>

<template>
  <div class="section-index">
    <SectionHero 
      titleEn="Cultivation" 
      titleZh="山上修行" 
      desc="Overview of the cultivation systems in Jian Lai. From Qi Refiners to Martial Artists, explore the paths to the apex." 
    />
    
    <div class="mdc-content" style="padding-top: 0">
      <CategoryTabs 
        :categories="['All', 'Qi Refiners', 'Martial Artists', 'Sword Cultivators']" 
        v-model:active="activeCategory" 
      />

      <div class="dossier-list">
        <FeaturedDossier 
          v-for="item in items" 
          :key="item.path"
          :link="item.path"
          :nameEn="item.title || 'Unknown'"
          :nameZh="item.chinese || ''"
          :desc="item.description || 'Entry pending detailed documentation.'"
          :category="item.category || 'Cultivation'"
          :status="item.status || 'To be verified'"
        />
      </div>

      <div v-if="items?.length === 0" class="empty-state">
        <span class="empty-icon">🈳</span>
        <p>No entries found for this category yet.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dossier-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--c-border);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--c-text-3);
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.2;
  display: block;
  margin-bottom: 1rem;
}
</style>
