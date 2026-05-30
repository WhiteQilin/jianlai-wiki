<script setup lang="ts">
import { ref } from 'vue'

const activeCategory = ref('All')

const meta = useSectionMeta('cultivation')

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
  <div class="page-container">
    <ScrollReveal animation="reveal-fade-up">
      <SectionHero 
        titleEn="Cultivation" 
        titleZh="山上修行" 
        desc="The paths to immortality, realms of power, and methods of practice."
        bannerImage="/images/banners/cultivation-banner.webp"
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

      <ScrollReveal animation="reveal-fade-up">
        <RealmLadder :realms="[
          { level: 14, name: 'Fourteenth Realm', chinese: '十四境', desc: 'The realm of absolute convergence, practically a god on earth.' },
          { level: 13, name: 'Ascendant Realm', chinese: '飞升境', desc: 'Can ascend to the heavens; the pinnacle of orthodox cultivation.' },
          { level: 12, name: 'Immortal Realm', chinese: '仙人境', desc: 'True immortals free from mortal constraints and fate.', highlight: true },
          { level: 11, name: 'Jade Pu Realm', chinese: '玉璞境', desc: 'Flawless foundation, jade-like constitution.' },
          { level: 10, name: 'Nascent Soul Realm', chinese: '元婴境', desc: 'The soul can exist outside the body, mastering profound arts.' }
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
            :category="(item as any).category || 'Cultivation'"
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
            { link: '/swordsmanship', titleZh: '剑术与神通', titleEn: 'Swordsmanship', bgChar: '剑' },
            { link: '/factions', titleZh: '宗门势力', titleEn: 'Factions', bgChar: '宗' }
          ]"
        />
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>

</style>
