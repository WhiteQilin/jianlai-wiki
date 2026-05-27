const fs = require('fs');
const path = require('path');

const sections = [
  { id: 'characters', title: 'Characters', titleZh: '人物志', desc: 'Welcome to the character archive. Jian Lai features hundreds of characters across multiple worlds, from ordinary mortals to the gods of the Upper Five Realms.', filter: "['All', 'Major', 'Minor', 'Gods']" },
  { id: 'world', title: 'World', titleZh: '天下图志', desc: 'Explore the vast geography of Jian Lai, spanning multiple worlds, continents, and hidden grotto-heavens.', filter: "['All', 'Continents', 'Grotto-Heavens', 'Blessed Lands']" },
  { id: 'cultivation', title: 'Cultivation', titleZh: '山上修行', desc: 'Overview of the cultivation systems in Jian Lai. From Qi Refiners to Martial Artists, explore the paths to the apex.', filter: "['All', 'Qi Refiners', 'Martial Artists', 'Sword Cultivators']" },
  { id: 'swordsmanship', title: 'Swordsmanship', titleZh: '剑术与神通', desc: 'The way of the sword cultivator—the most lethal path of cultivation. Explore flying swords, sword intents, and legendary techniques.', filter: "['All', 'Flying Swords', 'Techniques']" },
  { id: 'factions', title: 'Factions', titleZh: '宗门势力', desc: 'The major powers, sects, and organizations that shape the balance of the worlds.', filter: "['All', 'Orthodox', 'Demonic', 'Mortal Empires']" },
  { id: 'artifacts', title: 'Artifacts', titleZh: '法宝器物', desc: 'An archive of the myriad treasures, immortal weapons, and natural materials found throughout the worlds.', filter: "['All', 'Immortal Weapons', 'Magical Treasures', 'Natural Materials']" },
  { id: 'timeline', title: 'Timeline', titleZh: '年表', desc: 'The chronological history of Jian Lai, from the ancient era to the present day.', filter: "['All', 'Ancient Era', 'Modern Era']" },
  { id: 'glossary', title: 'Glossary', titleZh: '术语典籍', desc: 'A comprehensive reference for xianxia terminology, specific concepts, and proper nouns used in Jian Lai.', filter: "['All', 'Concepts', 'Titles']" }
];

sections.forEach(s => {
  const indexContent = `<script setup lang="ts">
import { ref } from 'vue'

const activeCategory = ref('All')

const { data: items } = await useAsyncData('${s.id}-list', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/${s.id}/%')
    .order('title', 'ASC')
    .all()
})

useSeoMeta({
  title: '${s.title} | Jian Lai Wiki'
})
</script>

<template>
  <div class="section-index">
    <SectionHero 
      titleEn="${s.title}" 
      titleZh="${s.titleZh}" 
      desc="${s.desc}" 
    />
    
    <div class="mdc-content" style="padding-top: 0">
      <CategoryTabs 
        :categories="${s.filter}" 
        v-model:active="activeCategory" 
      />

      <div class="dossier-list">
        <FeaturedDossier 
          v-for="item in items" 
          :key="item.path"
          :link="item.path"
          :nameEn="item.title || 'Unknown'"
          :nameZh="item.chinese || ''"
          :desc="item.description || 'Entry pending detailed documentation.'"
          :category="item.category || '${s.title}'"
          :status="item.status || 'To be verified'"
        />
      </div>

      <div v-if="items?.length === 0" class="empty-state">
        <span class="empty-icon">🈳</span>
        <p>No entries found for this category yet.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dossier-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--c-border);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--c-text-3);
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.2;
  display: block;
  margin-bottom: 1rem;
}
</style>
`;

  fs.writeFileSync(`jianlai-wiki-nuxt/app/pages/${s.id}/index.vue`, indexContent);
});
