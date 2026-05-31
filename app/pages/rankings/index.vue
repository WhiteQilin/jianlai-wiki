<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('All')

const meta = useSectionMeta('rankings')

const { data: items } = await useAsyncData('rankings-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/rankings/%')
    .order('title', 'ASC')
    .all()
})

const filteredItems = computed(() =>
  (items.value ?? []).filter((i) => matchesCategory((i as any).category, activeCategory.value)),
)

useSeoMeta({
  title: 'Rankings & Lists | Jian Lai Wiki'
})
</script>

<template>
  <div class="page-container">
    <SectionHero 
      titleEn="Rankings & Lists" 
      titleZh="榜单" 
      desc="Tier lists, realm ladders, and the great named lists of the Jian Lai world." 
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
            :category="(item as any).category || 'Rankings'"
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
            { link: '/characters', titleZh: '人物志', titleEn: 'Characters', bgChar: '人' },
            { link: '/cultivation', titleZh: '山上修行', titleEn: 'Cultivation', bgChar: '修' },
            { link: '/swordsmanship', titleZh: '剑术神通', titleEn: 'Swordsmanship', bgChar: '剑' }
          ]"
        />
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>

</style>
