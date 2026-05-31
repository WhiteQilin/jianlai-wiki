<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('All')

const meta = useSectionMeta('glossary')

const { data: items } = await useAsyncData('glossary-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/glossary/%')
    .order('title', 'ASC')
    .all()
})

const filteredItems = computed(() =>
  (items.value ?? []).filter((i) => matchesCategory((i as any).category, activeCategory.value)),
)

useSeoMeta({
  title: 'Glossary | Jian Lai Wiki'
})
</script>

<template>
  <div class="page-container">
    <SectionHero 
      titleEn="Glossary" 
      titleZh="术语典籍" 
      desc="A comprehensive reference for xianxia terminology, specific concepts, and proper nouns used in Jian Lai." 
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
            :category="(item as any).category || 'Glossary'"
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
            { link: '/cultivation', titleZh: '山上修行', titleEn: 'Cultivation', bgChar: '修' },
            { link: '/swordsmanship', titleZh: '剑术与神通', titleEn: 'Swordsmanship', bgChar: '剑' },
            { link: '/world', titleZh: '天下图志', titleEn: 'World', bgChar: '地' }
          ]"
        />
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>

</style>
