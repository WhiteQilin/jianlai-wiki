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
  <div class="page-container">
    <ScrollReveal animation="reveal-fade-up">
      <SectionHero 
        titleEn="Characters" 
        titleZh="人物志" 
        desc="The heroes, villains, and legends of the Jian Lai universe."
        video="/videos/fight-scene.mp4"
        bannerImage="/images/banners/characters-banner.webp"
        credit="Tencent Video / Jian Lai Animation"
        :isOfficial="true"
      />
    </ScrollReveal>
    
    <div class="mdc-content" style="padding-top: 0">
      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <CategoryTabs 
          :categories="['All', 'Major', 'Minor', 'Gods']" 
          v-model:active="activeCategory" 
        />
      </ScrollReveal>

      <DossierGrid v-if="items && items.length > 0">
        <ScrollReveal 
          v-for="(item, index) in items" 
          :key="item.path"
          animation="reveal-fade-up"
          :delay="(`stagger-${(index % 5) + 1}` as any)"
        >
          <DossierCard 
            :link="item.path"
            :nameEn="item.title || 'Unknown'"
            :nameZh="(item as any).chinese || ''"
            :desc="item.description || 'Entry pending detailed documentation.'"
            :category="(item as any).category || 'Characters'"
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
            { link: '/world', titleZh: '天下图志', titleEn: 'World', bgChar: '地' },
            { link: '/factions', titleZh: '宗门势力', titleEn: 'Factions', bgChar: '宗' },
            { link: '/cultivation', titleZh: '山上修行', titleEn: 'Cultivation', bgChar: '修' }
          ]"
        />
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>

</style>
