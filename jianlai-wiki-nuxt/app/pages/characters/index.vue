<script setup lang="ts">
import { ref } from 'vue'

const activeCategory = ref('All')

const { data: items } = await useAsyncData('characters-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/characters/%')
    .order('title', 'ASC')
    .all()
})

useSeoMeta({
  title: 'Characters | Jian Lai Wiki'
})
</script>

<template>
  <div class="section-index">
    <SectionHero 
      titleEn="Characters" 
      titleZh="人物志" 
      desc="Welcome to the character archive. Jian Lai features hundreds of characters across multiple worlds, from ordinary mortals to the gods of the Upper Five Realms." 
    />
    
    <div class="mdc-content" style="padding-top: 0">
      <CategoryTabs 
        :categories="['All', 'Major', 'Minor', 'Gods']" 
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
          :category="item.category || 'Characters'"
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
