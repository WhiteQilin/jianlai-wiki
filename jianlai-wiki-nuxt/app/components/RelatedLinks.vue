<script setup lang="ts">
type RelatedLink = {
  titleEn: string
  titleZh: string
  link: string
  bgChar: string
  bgImage?: string
}

defineProps<{
  links: RelatedLink[]
}>()

const portalImages: Record<string, string> = {
  '/characters': '/images/portalcard/Character-portalcard.webp',
  '/world': '/images/portalcard/world-portalcard.jpg',
  '/cultivation': '/images/portalcard/cultivation-portalcard.jpg',
  '/swordsmanship': '/images/portalcard/swordsmanship-portalcard.png',
  '/factions': '/images/portalcard/factions-portalcard.jpg',
  '/artifacts': '/images/portalcard/artifacts-portalcard.jpg',
  '/timeline': '/images/portalcard/timeline-portalcard.jpg',
  '/glossary': '/images/portalcard/glossary-portalcard.jpg'
}

const getPortalImage = (item: RelatedLink) => item.bgImage || portalImages[item.link]
</script>

<template>
  <div class="related-sections">
    <div class="related-heading">
      <SealBadge text="引" variant="outline" shape="square" />
      <h3 class="related-title">Explore More</h3>
    </div>
    <span class="heading-rule" aria-hidden="true">
      <span class="rule-line"></span>
      <span class="jade-dot"></span>
      <span class="rule-line"></span>
    </span>
    <div class="bento-grid">
      <ArchivePortal 
        v-for="item in links" 
        :key="item.link"
        :link="item.link" 
        :titleZh="item.titleZh" 
        :titleEn="item.titleEn" 
        :bgChar="item.bgChar"
        :bgImage="getPortalImage(item)"
        class="bento-item" 
      />
    </div>
  </div>
</template>

<style scoped>
.related-sections {
  margin-top: 4rem;
}

.related-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.related-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--c-ink);
  margin: 0;
  text-align: center;
  font-weight: 400;
  white-space: nowrap;
}

.heading-rule {
  width: min(320px, 48vw);
  display: flex;
  align-items: center;
  gap: 1.1rem;
  margin: 0 auto 2.2rem;
  color: var(--c-teal-accent);
}

.rule-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  opacity: 0.35;
}

.jade-dot {
  width: 0.55rem;
  height: 0.55rem;
  border: 1px solid currentColor;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px var(--c-bg), 0 0 0 1px color-mix(in srgb, var(--c-teal-accent) 18%, transparent);
  opacity: 0.78;
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
  .related-heading {
    gap: 0.75rem;
  }

  .heading-rule {
    width: min(220px, 64vw);
    gap: 0.65rem;
    margin-bottom: 1.5rem;
  }

  .bento-grid {
    grid-template-columns: 1fr;
  }
}
</style>
