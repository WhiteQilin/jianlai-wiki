<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { HOME_HERO_VIDEOS } from '~/constants/homeHeroVideos'
import { pickRandomHeroVideo } from '~/composables/useRandomHeroVideo'

const defaultHeroVideo = '/videos/curated/home-hero-04.mp4'
const heroVideo = ref(defaultHeroVideo)
const heroCandidates = [...HOME_HERO_VIDEOS]
const activeCandidates = ref<string[]>([])

const rotateHeroVideo = () => {
  const next = pickRandomHeroVideo(activeCandidates.value, defaultHeroVideo)
  heroVideo.value = next
  if (next !== defaultHeroVideo) {
    activeCandidates.value = activeCandidates.value.filter((video) => video !== next)
  }
}

onMounted(() => {
  activeCandidates.value = [...heroCandidates]
  rotateHeroVideo()
})

const spotlightItems = [
  {
    id: 'chen-pingan',
    nameEn: "Chen Ping'an",
    nameZh: '陈平安',
    desc: 'A young man from Lizhu Blessed Land who walks his own path with a sword, seeking truths and delivering punches.',
    category: 'Character',
    status: 'Main Protagonist',
    link: '/characters/chen-pingan',
    image: '/images/characters/chen-pingan.webp' // Placeholder, will fallback if missing
  },
  {
    id: 'ning-yao',
    nameEn: 'Ning Yao',
    nameZh: '宁姚',
    desc: 'The peerless sword immortal from the Sword Qi Great Wall. She only believes in the sword in her hand.',
    category: 'Character',
    status: 'Main Heroine',
    link: '/characters/ning-yao',
    image: '/images/characters/ning-yao.jpg',
    imagePosition: 'center 15%'
  },
  {
    id: 'qi-jingchun',
    nameEn: 'Qi Jingchun',
    nameZh: '齐静春',
    desc: 'The Spring Breeze. A Confucian scholar who chose to hold up the falling sky for the common people.',
    category: 'Lore',
    status: 'Legend',
    link: '/characters/qi-jingchun',
    image: '/images/characters/qi-jingchun.jpg',
    imagePosition: 'center 20%'
  },
  {
    id: 'haoran',
    nameEn: 'Haoran Tianxia',
    nameZh: '浩然天下',
    desc: 'The Vast and Mighty World, where Confucianism holds sway and scholars guide the mortal dynasties.',
    category: 'World',
    status: 'Continent',
    link: '/world/sample'
  }
]
</script>

<template>
  <div class="home-archive">
    <HeroMedia
      :video="heroVideo"
      image="/images/banners/home-hero.webp"
      alt="Jian Lai Official Animation Key Visual"
      credit="Tencent Video / Jian Lai Animation"
      :isOfficial="true"
      @video-error="rotateHeroVideo"
    >
      <template #background="{ videoActive }">
        <div v-if="!videoActive" class="hero-mist animate-drift"></div>
        <div class="hero-calligraphy-wrapper">
          <div class="hero-calligraphy">剑</div>
        </div>
      </template>

      <div class="hero-title-group animate-fade-in-up" style="animation-delay: 0.3s;">
        <img src="/images/logos/JianLaiLogo.png" alt="Jian Lai" class="hero-logo-mark" />
      </div>
      
      <h2 class="hero-title-en animate-fade-in-up" style="animation-delay: 0.9s;">Sword, Come! Encyclopedia</h2>
      <p class="hero-tagline animate-fade-in-up" style="animation-delay: 0.9s;">
        A premium fandom archive of characters, realms, locations, and legends.
      </p>

      <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.9s;">
        <OrnamentalButton to="/characters" variant="primary" class="hover-lift">Browse Characters</OrnamentalButton>
        <OrnamentalButton to="/world" variant="secondary" class="hover-lift">Explore World</OrnamentalButton>
        <OrnamentalButton to="/timeline" variant="secondary" class="hover-lift">View Timeline</OrnamentalButton>
      </div>

    </HeroMedia>

    <div class="stats-band animate-fade-in-up" style="animation-delay: 1.2s;">
      <div class="stats-inner">
        <div class="stat-item">
          <span class="stat-num">14</span>
          <span class="stat-label">Realms</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">100+</span>
          <span class="stat-label">Characters</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">∞</span>
          <span class="stat-label">Worlds</span>
        </div>
      </div>
    </div>

    <div class="main-content" id="archive">
      <ScrollReveal animation="reveal-fade-up">
        <div class="bento-grid">
          <ArchivePortal link="/characters" titleZh="人物志" titleEn="Characters" bgChar="人" bgImage="/images/portalcard/Character-portalcard.webp" class="bento-item featured-wide" />
          <ArchivePortal link="/world" titleZh="天下图志" titleEn="World" bgChar="地" bgImage="/images/portalcard/world-portalcard.jpg" class="bento-item featured-wide" />
          <ArchivePortal link="/cultivation" titleZh="山上修行" titleEn="Cultivation" bgChar="修" bgImage="/images/portalcard/cultivation-portalcard.jpg" class="bento-item" />
          <ArchivePortal link="/swordsmanship" titleZh="剑术神通" titleEn="Swordsmanship" bgChar="剑" bgImage="/images/portalcard/swordsmanship-portalcard.png" class="bento-item" />
          <ArchivePortal link="/factions" titleZh="宗门势力" titleEn="Factions" bgChar="宗" bgImage="/images/portalcard/factions-portalcard.jpg" class="bento-item" />
          <ArchivePortal link="/artifacts" titleZh="法宝器物" titleEn="Artifacts" bgChar="宝" bgImage="/images/portalcard/artifacts-portalcard.jpg" class="bento-item" />
          <ArchivePortal link="/timeline" titleZh="年表" titleEn="Timeline" bgChar="史" bgImage="/images/portalcard/timeline-portalcard.jpg" class="bento-item" />
          <ArchivePortal link="/glossary" titleZh="术语典籍" titleEn="Glossary" bgChar="典" bgImage="/images/portalcard/glossary-portalcard.jpg" class="bento-item" />
        </div>
      </ScrollReveal>

      <OrnamentalDivider motif="ruyi" color="ink" />

      <FeaturedSpotlight 
        title="Featured Lore"
        :items="spotlightItems" 
      />
      
      <OrnamentalDivider motif="jade" color="celadon" />
      
      <section class="theatre-stage">
        <FeaturedTheatre />
      </section>

      <ScrollReveal animation="reveal-fade-up" class="wip-notice">
        <div class="wip-icon"><SealBadge text="卷" variant="filled" shape="square" /></div>
        <h3 class="wip-title">The Archives are Expanding</h3>
        <p class="wip-text">Records of the Jian Lai universe are still being compiled. Many legends remain untold.</p>
        <OrnamentalButton to="https://github.com/WhiteQilin/jianlai-wiki" variant="secondary" class="hover-lift">Contribute on GitHub</OrnamentalButton>
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>
.home-archive {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-mist {
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.08;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 0;
}

.hero-calligraphy-wrapper {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.hero-calligraphy {
  font-family: var(--font-zh-display);
  font-size: 45vw;
  color: rgba(20, 20, 20, 0.03);
  pointer-events: none;
  user-select: none;
  line-height: 1;
  white-space: nowrap;
}

.dark .hero-calligraphy {
  color: rgba(255, 255, 255, 0.02);
}

.hero-title-group {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.hero-logo-mark {
  width: min(300px, 62vw);
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25));
}

.hero-title-en {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  color: var(--c-text-2);
  margin: 0 0 1.5rem 0;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border: none;
  padding: 0;
}

.hero-tagline {
  font-size: 1.1rem;
  color: var(--c-text-3);
  line-height: 1.8;
  max-width: 500px;
  margin: 0 auto 3rem;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 0.8rem 2rem;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  border-radius: 2px;
  border-bottom: none;
}

.btn-primary {
  background-color: var(--c-ink);
  color: #ffffff;
  border: 1px solid var(--c-ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: transparent;
  color: var(--c-ink);
}

.btn-secondary {
  background-color: transparent;
  color: var(--c-ink);
  border: 1px solid var(--c-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: var(--c-ink);
  background-color: var(--c-bg-soft);
}

.stats-band {
  width: 100%;
  background-color: var(--c-charcoal);
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--c-border);
  margin-top: -3rem; /* Overlap with hero */
  z-index: 10;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
}

.stats-band::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-01.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  mix-blend-mode: screen;
  pointer-events: none;
}

.stats-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: space-around;
  position: relative;
  z-index: 1;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--c-paper);
}

.stat-num {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  line-height: 1;
  color: var(--c-paper);
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.stat-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.6);
}

.main-content {
  max-width: 1200px;
  width: 100%;
  padding: 5rem 2rem 6rem;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.bento-item {
  border-radius: 4px;
}

.featured-wide {
  grid-column: span 2;
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
  .featured-wide {
    grid-column: span 1;
  }
}

.wip-notice {
  text-align: center;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.theatre-stage {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
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
  margin: 0 0 1rem 0;
  max-width: 500px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-logo-mark { width: min(240px, 70vw); }
  .hero-actions { flex-direction: column; }
  .hero-meta-row { flex-wrap: wrap; gap: 1.5rem; padding: 1.5rem; }
  .hero-calligraphy { font-size: 60vw; }
}
</style>
