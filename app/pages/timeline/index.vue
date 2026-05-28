<script setup lang="ts">
import { ref } from 'vue'

const activeCategory = ref('All')

const { data: items } = await useAsyncData('timeline-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/timeline/%')
    .order('title', 'ASC')
    .all()
})

useSeoMeta({
  title: 'Timeline | Jian Lai Wiki'
})
</script>

<template>
  <div class="section-index">
    <SectionHero 
      titleEn="Timeline" 
      titleZh="年表" 
      desc="The chronological history of Jian Lai, from the ancient era to the present day." 
    />
    
    <div class="mdc-content" style="padding-top: 0">
      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <CategoryTabs 
          :categories="['All', 'Ancient Era', 'Modern Era']" 
          v-model:active="activeCategory" 
        />
      </ScrollReveal>

      <ScrollReveal animation="reveal-fade-up">
        <TimelineRail :events="[
          { era: 'Ancient Era', title: 'The Old Heavenly Court', summary: 'The divine beings ruled over the myriad worlds, until the great rebellion.' },
          { era: 'Transition', title: 'Shattering of Lizhu Blessed Land', summary: 'The porcelain town falls. Chen Ping\'an begins his journey.', characters: ['Chen Ping\'an', 'Qi Jingchun'] },
          { era: 'Modern Era', title: 'Sword Qi Great Wall Defense', summary: 'The demon race attacks the great wall. A legendary defense ensues.', characters: ['Ning Yao', 'Chen Ping\'an'] }
        ]" />
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
            :category="(item as any).category || 'Timeline'"
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
            { link: '/world', titleZh: '天下图志', titleEn: 'World', bgChar: '地' },
            { link: '/factions', titleZh: '宗门势力', titleEn: 'Factions', bgChar: '宗' }
          ]"
        />
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>

</style>
