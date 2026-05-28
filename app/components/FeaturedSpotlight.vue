<script setup lang="ts">
interface SpotlightItem {
  id: string
  nameEn: string
  nameZh: string
  desc: string
  category: string
  status: string
  link: string
  image?: string
}

defineProps<{
  items: SpotlightItem[]
  title?: string
}>()
</script>

<template>
  <div class="featured-spotlight">
    <div v-if="title" class="spotlight-header">
      <h3 class="section-title">{{ title }}</h3>
      <div class="title-line"></div>
    </div>

    <div class="spotlight-scroller">
      <div class="spotlight-track">
        <ScrollReveal
          v-for="(item, index) in items"
          :key="item.id"
          tag="article"
          animation="reveal-fade-up"
          :delay="(`stagger-${(index % 5) + 1}` as any)"
          class="spotlight-card"
        >
          <NuxtLink :to="item.link" class="card-inner hover-lift">
            <div class="card-media">
              <img v-if="item.image" :src="item.image" :alt="item.nameEn" class="card-image" />
              <div v-else class="card-fallback">
                <span>{{ item.nameZh.charAt(0) || '无' }}</span>
              </div>
              <div class="media-overlay"></div>
            </div>

            <div class="card-content">
              <div class="card-meta">
                <span class="category">{{ item.category }}</span>
                <span class="status">{{ item.status }}</span>
              </div>
              <h4 class="card-title">
                {{ item.nameEn }}
                <span class="card-title-zh">{{ item.nameZh }}</span>
              </h4>
              <p class="card-desc">{{ item.desc }}</p>
              <div class="card-action">
                <span>Explore</span>
                <span class="arrow">→</span>
              </div>
            </div>
          </NuxtLink>
        </ScrollReveal>
      </div>
    </div>
  </div>
</template>

<style scoped>
.featured-spotlight {
  width: 100%;
  margin: 4rem 0;
}

.spotlight-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 0 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: var(--c-ink);
  font-weight: 400;
  margin: 0;
  white-space: nowrap;
}

.title-line {
  flex-grow: 1;
  height: 1px;
  background: var(--c-border);
}

.spotlight-scroller {
  width: 100%;
  overflow-x: auto;
  padding: 2rem;
  /* Hide scrollbar */
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
}

.spotlight-scroller::-webkit-scrollbar {
  display: none;
}

.spotlight-track {
  display: flex;
  gap: 2rem;
  width: max-content;
  margin: 0 auto;
}

.spotlight-card {
  width: 350px;
  flex-shrink: 0;
  scroll-snap-align: start;
}

.card-inner {
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  text-decoration: none;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.card-media {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg-soft);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  filter: grayscale(80%) contrast(1.1);
}

.card-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  background-position: center;
  font-family: var(--font-heading);
  font-size: 5rem;
  color: var(--c-text-3);
  opacity: 0.8;
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--c-bg) 0%, transparent 60%);
}

.card-inner:hover .card-image {
  transform: scale(1.05);
  filter: grayscale(0%) contrast(1.1);
}

.card-inner:hover {
  box-shadow: 0 20px 40px var(--c-seal-red-soft);
  border-color: var(--c-seal-red);
}

.card-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.category {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.status {
  font-size: 0.7rem;
  color: var(--c-seal-red);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--c-ink);
  margin: 0 0 1rem 0;
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  transition: color 0.3s ease;
}

.card-title-zh {
  font-size: 1.1rem;
  color: var(--c-text-3);
  font-weight: 400;
}

.card-desc {
  font-size: 0.95rem;
  color: var(--c-text-2);
  line-height: 1.6;
  margin: 0 0 2rem 0;
  flex-grow: 1;
}

.card-action {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--c-divider);
  padding-top: 1rem;
  transition: color 0.3s ease;
}

.arrow {
  transition: transform 0.3s ease;
}

.card-inner:hover .card-title {
  color: var(--c-seal-red);
}

.card-inner:hover .card-action {
  color: var(--c-ink);
}

.card-inner:hover .arrow {
  transform: translateX(5px);
  color: var(--c-seal-red);
}

@media (max-width: 768px) {
  .spotlight-track {
    padding-right: 2rem;
  }
  .spotlight-card {
    width: 280px;
  }
}
</style>