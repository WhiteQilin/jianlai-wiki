<script setup lang="ts">
import { ref } from 'vue'

const activeCategory = ref('All')

const { data: items } = await useAsyncData('artifacts-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/artifacts/%')
    .order('title', 'ASC')
    .all()
})

useSeoMeta({
  title: 'Artifacts | Jian Lai Wiki'
})
</script>

<template>
  <div class="page-container">
    <ScrollReveal animation="reveal-fade-up">
      <SectionHero 
        titleEn="Artifacts" 
        titleZh="法宝器物" 
        desc="Magical treasures, flying swords, and items of legend."
        bannerImage="/images/banners/artifacts-banner.webp"
        credit="Tencent Video / Jian Lai Animation"
        :isOfficial="true"
      />
    </ScrollReveal>
    
    <div class="mdc-content" style="padding-top: 0">
      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <CategoryTabs 
          :categories="['All', 'Immortal Weapons', 'Magical Treasures', 'Natural Materials']" 
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
            :category="(item as any).category || 'Artifacts'"
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
            { link: '/swordsmanship', titleZh: '剑术与神通', titleEn: 'Swordsmanship', bgChar: '剑' },
            { link: '/factions', titleZh: '宗门势力', titleEn: 'Factions', bgChar: '宗' },
            { link: '/world', titleZh: '天下图志', titleEn: 'World', bgChar: '地' }
          ]"
        />
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>

</style>
