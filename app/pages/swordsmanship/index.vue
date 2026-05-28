<script setup lang="ts">
import { ref } from 'vue'

const activeCategory = ref('All')

const { data: items } = await useAsyncData('swordsmanship-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/swordsmanship/%')
    .order('title', 'ASC')
    .all()
})

useSeoMeta({
  title: 'Swordsmanship | Jian Lai Wiki'
})
</script>

<template>
  <div class="page-container">
    <ScrollReveal animation="reveal-fade-up">
      <SectionHero 
        titleEn="Swordsmanship" 
        titleZh="剑术与神通" 
        desc="The peerless techniques of sword immortals and martial artists."
        bannerImage="/images/banners/swordsmanship-banner.webp"
        credit="Tencent Video / Jian Lai Animation"
        :isOfficial="true"
      />
    </ScrollReveal>
    
    <div class="mdc-content" style="padding-top: 0">
      <ScrollReveal animation="reveal-fade-up" delay="stagger-1">
        <CategoryTabs 
          :categories="['All', 'Flying Swords', 'Techniques']" 
          v-model:active="activeCategory" 
        />
      </ScrollReveal>

      <div class="dossier-list">
        <ScrollReveal 
          v-for="(item, index) in items" 
          :key="item.path"
          animation="reveal-fade-up"
          :delay="(`stagger-${(index % 5) + 1}` as any)"
        >
          <FeaturedDossier 
            :link="item.path"
            :nameEn="item.title || 'Unknown'"
            :nameZh="(item as any).chinese || ''"
            :desc="item.description || 'Entry pending detailed documentation.'"
            :category="(item as any).category || 'Swordsmanship'"
            :status="(item as any).status || 'To be verified'"
          />
        </ScrollReveal>
      </div>

      <ScrollReveal v-if="items?.length === 0" animation="reveal-fade-up" class="wip-notice">
        <div class="wip-icon">卷</div>
        <h3 class="wip-title">Records pending compilation</h3>
        <p class="wip-text">The lore keepers have not yet inscribed entries for this category.</p>
      </ScrollReveal>

      <InkDivider type="brush" />

      <ScrollReveal animation="reveal-fade-up">
        <div class="related-sections">
          <h3 class="related-title">Explore More</h3>
          <div class="portal-grid">
            <ArchivePortal link="/characters" titleZh="人物志" titleEn="Characters" bgChar="人" />
            <ArchivePortal link="/cultivation" titleZh="山上修行" titleEn="Cultivation" bgChar="修" />
            <ArchivePortal link="/artifacts" titleZh="法宝器物" titleEn="Artifacts" bgChar="宝" />
          </div>
        </div>
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>
.dossier-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--c-border);
}

.wip-notice {
  text-align: center;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.wip-icon {
  font-family: var(--font-heading);
  font-size: 4rem;
  color: var(--c-seal-red);
  opacity: 0.15;
  line-height: 1;
}

.wip-title {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: var(--c-ink);
  margin: 0;
  font-weight: 400;
}

.wip-text {
  font-size: 1.1rem;
  color: var(--c-text-2);
  margin: 0;
}

.related-sections {
  margin-top: 4rem;
}

.related-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--c-ink);
  margin-bottom: 2rem;
  text-align: center;
}

.portal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1px;
  background: var(--c-border);
  border: 1px solid var(--c-border);
}
</style>
