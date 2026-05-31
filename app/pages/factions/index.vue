<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('All')

const meta = useSectionMeta('factions')

const { data: items } = await useAsyncData('factions-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/factions/%')
    .order('title', 'ASC')
    .all()
})

const filteredItems = computed(() =>
  (items.value ?? []).filter((i) => matchesCategory((i as any).category, activeCategory.value)),
)

useSeoMeta({
  title: 'Factions | Jian Lai Wiki'
})
</script>

<template>
  <div class="page-container">
    <ScrollReveal animation="reveal-fade-up">
      <SectionHero 
        titleEn="Factions" 
        titleZh="宗门势力" 
        desc="The academies, sects, empires, and organizations of the world."
        bannerImage="/images/banners/factions-banner.webp"
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
            :category="(item as any).category || 'Factions'"
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
            { link: '/cultivation', titleZh: '山上修行', titleEn: 'Cultivation', bgChar: '修' },
            { link: '/artifacts', titleZh: '法宝器物', titleEn: 'Artifacts', bgChar: '宝' }
          ]"
        />
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>

</style>
