<script setup lang="ts">
const route = useRoute()
const section = 'characters'
const sectionTitle = 'Characters'

const { data: page } = await useAsyncData(`page-${route.path}`, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useSeoMeta({
  title: `${page.value?.title} | Jian Lai Wiki`
})
</script>

<template>
  <div class="article-page mdc-content">
    <ScrollReveal animation="reveal-fade-up">
      <div class="breadcrumb">
        <NuxtLink to="/">Home</NuxtLink> <span>/</span>
        <NuxtLink :to="`/${section}`">{{ sectionTitle }}</NuxtLink> <span>/</span>
        <span class="current">{{ page?.title }}</span>
      </div>
    </ScrollReveal>

    <ScrollReveal v-if="page" animation="reveal-fade-up" delay="stagger-1" class="character-header">
      <div class="character-portrait">
        <!-- Placeholder for actual portrait -->
        <div class="portrait-placeholder">
          <span>{{ page.chinese?.charAt(0) || '无' }}</span>
        </div>
      </div>
      <div class="character-info">
        <h1 class="character-name">{{ page.title }} <span class="zh-name">{{ (page as any).chinese }}</span></h1>
        <p class="character-desc">{{ page.description }}</p>
      </div>
    </ScrollReveal>

    <div class="article-layout">
      <div class="article-main">
        <ScrollReveal animation="reveal-fade-up" delay="stagger-2">
          <ContentRenderer v-if="page" :value="page" class="mdc-prose" />
        </ScrollReveal>

        <InkDivider type="mist" />

        <ScrollReveal animation="reveal-fade-up">
          <div class="gallery-placeholder">
            <span class="gallery-icon">🖼️</span>
            <p>Media Gallery Pending</p>
          </div>
        </ScrollReveal>

        <InkDivider type="brush" />

        <ScrollReveal animation="reveal-fade-up" class="verification-notice">
          <p><strong>Source Verification:</strong> This entry is currently being cross-referenced with the original text. Details may be subject to change.</p>
        </ScrollReveal>
      </div>

      <aside class="article-sidebar">
        <ScrollReveal animation="reveal-fade-up" delay="stagger-3">
          <div class="sticky-toc">
            <h4>Contents</h4>
            <ul>
              <li><a href="#">Overview</a></li>
              <li><a href="#">History</a></li>
              <li><a href="#">Abilities</a></li>
              <li><a href="#">Relationships</a></li>
            </ul>
          </div>
        </ScrollReveal>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.character-header {
  display: flex;
  gap: 3rem;
  margin-bottom: 4rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--c-divider);
  align-items: center;
}

.character-portrait {
  width: 200px;
  height: 280px;
  flex-shrink: 0;
  border: 1px solid var(--c-border);
  background: var(--c-bg-soft);
  position: relative;
}

.character-portrait::after {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid var(--c-border);
  opacity: 0.5;
}

.portrait-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-heading);
  font-size: 6rem;
  color: var(--c-border);
  background-image: url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  opacity: 0.8;
}

.dark .portrait-placeholder {
  background-blend-mode: screen;
}

.character-info {
  flex-grow: 1;
}

.character-name {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  color: var(--c-ink);
  margin: 0 0 1rem 0;
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
}

.zh-name {
  font-size: 2rem;
  color: var(--c-text-3);
  font-weight: 400;
}

.character-desc {
  font-size: 1.1rem;
  color: var(--c-text-2);
  line-height: 1.8;
  max-width: 600px;
  margin: 0;
}

.article-layout {
  display: flex;
  gap: 4rem;
  position: relative;
}

.article-main {
  flex-grow: 1;
  min-width: 0;
}

.article-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.sticky-toc {
  position: sticky;
  top: calc(var(--header-height) + 2rem);
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  padding: 1.5rem;
  border-radius: 2px;
}

.sticky-toc h4 {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 1rem 0;
  color: var(--c-text-3);
  border-bottom: 1px solid var(--c-divider);
  padding-bottom: 0.5rem;
}

.sticky-toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.sticky-toc a {
  text-decoration: none;
  color: var(--c-text-2);
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.sticky-toc a:hover {
  color: var(--c-seal-red);
}

.gallery-placeholder {
  width: 100%;
  height: 300px;
  background: var(--c-bg-soft);
  border: 1px dashed var(--c-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--c-text-3);
}

.gallery-icon {
  font-size: 2.5rem;
  opacity: 0.5;
}

.verification-notice {
  background: var(--c-bg-soft);
  border-left: 3px solid var(--c-bronze);
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  color: var(--c-text-2);
}

@media (max-width: 1024px) {
  .article-layout {
    flex-direction: column;
  }
  .article-sidebar {
    width: 100%;
    order: -1;
  }
  .sticky-toc {
    position: static;
  }
}

@media (max-width: 768px) {
  .character-header {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  .character-name {
    justify-content: center;
    flex-wrap: wrap;
    font-size: 2.5rem;
  }
}

.breadcrumb {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--c-text-3);
  margin-bottom: 2rem;
  display: flex;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.breadcrumb a {
  color: var(--c-text-2);
  text-decoration: none;
  border: none;
}

.breadcrumb a:hover {
  color: var(--c-seal-red);
}

.current {
  color: var(--c-ink);
  font-weight: 600;
}
</style>
