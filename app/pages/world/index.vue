<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('All')

const meta = useSectionMeta('world')

const { data: items } = await useAsyncData('world-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/world/%')
    .order('title', 'ASC')
    .all()
})

const filteredItems = computed(() =>
  (items.value ?? []).filter((i) => matchesCategory((i as any).category, activeCategory.value)),
)

useSeoMeta({
  title: 'World | Jian Lai Wiki'
})
</script>

<template>
  <div class="page-container">
    <ScrollReveal animation="reveal-fade-up">
      <SectionHero 
        titleEn="The World" 
        titleZh="天下图志" 
        desc="Explore the vast realms, continents, and secret realms of Jian Lai."
        video="/videos/ink-wash-pv.mp4"
        bannerImage="/images/banners/world-banner.webp"
        credit="Tencent Video / Jian Lai Animation"
        :isOfficial="true"
      />
    </ScrollReveal>
    
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
            :category="(item as any).category || 'World'"
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
            { link: '/factions', titleZh: '宗门势力', titleEn: 'Factions', bgChar: '宗' },
            { link: '/timeline', titleZh: '年表', titleEn: 'Timeline', bgChar: '史' }
          ]"
        />
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>

</style>
