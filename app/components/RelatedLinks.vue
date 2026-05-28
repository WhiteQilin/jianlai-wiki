<script setup lang="ts">
defineProps<{
  links: Array<{
    titleEn: string
    titleZh: string
    link: string
    bgChar: string
  }>
}>()
</script>

<template>
  <div class="related-sections">
    <h3 class="related-title">Explore More</h3>
    <div class="bento-grid">
      <ArchivePortal 
        v-for="item in links" 
        :key="item.link"
        :link="item.link" 
        :titleZh="item.titleZh" 
        :titleEn="item.titleEn" 
        :bgChar="item.bgChar" 
        class="bento-item" 
      />
    </div>
  </div>
</template>

<style scoped>
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

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.bento-item {
  border-radius: 4px;
}

@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}
</style>
