<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('All')

const meta = useSectionMeta('teachings')

const { data: items } = await useAsyncData('teachings-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/teachings/%')
    .order('title', 'ASC')
    .all()
})

const filteredItems = computed(() =>
  (items.value ?? []).filter((i) => matchesCategory((i as any).category, activeCategory.value)),
)

useSeoMeta({
  title: 'Three Teachings & Hundred Schools | Jian Lai Wiki'
})
</script>

<template>
  <div class="page-container">
    <SectionHero 
      titleEn="Three Teachings & Hundred Schools" 
      titleZh="三教百家" 
      desc="The Confucian, Buddhist, and Daoist teachings alongside the Hundred Schools of thought." 
    />
    
    <div class="mdc-content" style="padding-top: 0">
      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <CategoryTabs 
          :categories="meta.categories"
          v-model:active="activeCategory" 
        />
      </ScrollReveal>

      <DossierGrid v-if="filteredItems.length > 0">
        <ScrollReveal
          v-for="(item, index) in filteredItems"
          :key="item.path"
          animation="reveal-fade-up"
          :delay="(`stagger-${(index % 5) + 1}` as any)"
        >
          <DossierCard 
            :link="item.path"
            :nameEn="item.title || 'Unknown'"
            :nameZh="(item as any).chinese || ''"
            :desc="item.description || 'Entry pending detailed documentation.'"
            :category="(item as any).category || 'Teachings'"
            :status="(item as any).status || 'To be verified'"
            :image="(item as any).image"
          />
        </ScrollReveal>
      </DossierGrid>

      <ScrollReveal v-else animation="reveal-fade-up">
        <EmptyArchiveState />
      </ScrollReveal>

      <InkDivider type="brush" />

      <ScrollReveal animation="reveal-fade-up">
        <RelatedLinks 
          :links="[
            { link: '/factions', titleZh: '宗门势力', titleEn: 'Factions', bgChar: '宗' },
            { link: '/cultivation', titleZh: '山上修行', titleEn: 'Cultivation', bgChar: '修' },
            { link: '/characters', titleZh: '人物志', titleEn: 'Characters', bgChar: '人' }
          ]"
        />
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>

</style>
