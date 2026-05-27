<script setup lang="ts">
import LoreCard from './LoreCard.vue'
</script>

<template>
  <div class="home-archive">
    <HeroMedia>
      <div class="hero-calligraphy-wrapper animate-fade-up">
        <div class="hero-calligraphy">剑</div>
      </div>
      <div class="hero-title-group animate-fade-up" style="animation-delay: 0.2s;">
        <h1 class="hero-title-zh">剑来</h1>
        <div class="hero-seal animate-pop-in" style="animation-delay: 0.8s;">剑来</div>
      </div>
      
      <h2 class="hero-title-en animate-fade-up" style="animation-delay: 0.4s;">Sword, Come! Encyclopedia</h2>
      <p class="hero-tagline animate-fade-up" style="animation-delay: 0.6s;">
        An elegant compendium of characters, realms, locations, and legends.
      </p>

      <div class="hero-actions animate-fade-up" style="animation-delay: 0.8s;">
        <a href="#archive" class="btn-primary hover-lift">Enter the Archive</a>
        <a href="/characters/" class="btn-secondary hover-lift">Browse Characters</a>
      </div>

      <template #footer>
        <div class="hero-meta-row animate-fade-up" style="animation-delay: 1s;">
          <div class="meta-item"><span>Characters</span> Hundreds</div>
          <div class="meta-item"><span>Worlds</span> Boundless</div>
          <div class="meta-item"><span>Cultivation</span> Fourteen Realms</div>
          <div class="meta-item"><span>Status</span> In Progress</div>
        </div>
      </template>
    </HeroMedia>

    <div class="main-content" id="archive">
      <div class="portal-grid">
        <a href="/characters/" class="portal-card hover-lift" data-zh="人">
          <span class="portal-zh">人物志</span>
          <div class="portal-bottom">
            <span class="portal-en">Characters</span>
            <span class="arrow animate-reveal-line"></span>
          </div>
        </a>
        <a href="/locations/" class="portal-card hover-lift" data-zh="地">
          <span class="portal-zh">天下图志</span>
          <div class="portal-bottom">
            <span class="portal-en">Locations</span>
            <span class="arrow animate-reveal-line"></span>
          </div>
        </a>
        <a href="/cultivation/" class="portal-card hover-lift" data-zh="修">
          <span class="portal-zh">山上修行</span>
          <div class="portal-bottom">
            <span class="portal-en">Cultivation</span>
            <span class="arrow animate-reveal-line"></span>
          </div>
        </a>
        <a href="/sword-techniques/" class="portal-card hover-lift" data-zh="剑">
          <span class="portal-zh">剑术与神通</span>
          <div class="portal-bottom">
            <span class="portal-en">Swordsmanship</span>
            <span class="arrow animate-reveal-line"></span>
          </div>
        </a>
        <a href="/factions/" class="portal-card hover-lift" data-zh="宗">
          <span class="portal-zh">宗门势力</span>
          <div class="portal-bottom">
            <span class="portal-en">Factions</span>
            <span class="arrow animate-reveal-line"></span>
          </div>
        </a>
        <a href="/artifacts/" class="portal-card hover-lift" data-zh="宝">
          <span class="portal-zh">法宝器物</span>
          <div class="portal-bottom">
            <span class="portal-en">Artifacts</span>
            <span class="arrow animate-reveal-line"></span>
          </div>
        </a>
      </div>

      <div class="editorial-section">
        <div class="editorial-header">
          <h3 class="section-title">Featured Dossiers</h3>
          <div class="title-line"></div>
        </div>

        <div class="dossier-list">
          <a href="/characters/chen-pingan" class="dossier-item">
            <div class="dossier-meta">
              <span class="category">Character</span>
              <span class="status">To be improved</span>
            </div>
            <div class="dossier-content">
              <h4 class="dossier-name">Chen Ping'an</h4>
              <p class="dossier-desc">The protagonist from Lizhu Blessed Land. A young man who walks his own path with a sword.</p>
            </div>
            <div class="dossier-zh">陈平安</div>
          </a>

          <a href="/characters/" class="dossier-item">
            <div class="dossier-meta">
              <span class="category">Character</span>
              <span class="status">To be improved</span>
            </div>
            <div class="dossier-content">
              <h4 class="dossier-name">Ning Yao</h4>
              <p class="dossier-desc">The peerless sword immortal of the Sword Qi Great Wall.</p>
            </div>
            <div class="dossier-zh">宁姚</div>
          </a>

          <a href="/characters/" class="dossier-item">
            <div class="dossier-meta">
              <span class="category">Character</span>
              <span class="status">To be improved</span>
            </div>
            <div class="dossier-content">
              <h4 class="dossier-name">Qi Jingchun</h4>
              <p class="dossier-desc">The Spring Breeze, a scholar of the highest order.</p>
            </div>
            <div class="dossier-zh">齐静春</div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-archive {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--vp-c-bg);
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
  font-family: var(--jl-font-heading);
  font-size: 45vw;
  color: var(--vp-c-text-1);
  opacity: 0.03;
  pointer-events: none;
  user-select: none;
  line-height: 1;
}

.dark .hero-calligraphy {
  opacity: 0.02;
}

.hero-title-group {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.hero-title-zh {
  font-family: var(--jl-font-heading);
  font-size: 8rem;
  font-weight: 400;
  color: var(--jl-c-ink);
  margin: 0;
  line-height: 1;
  letter-spacing: 0.1em;
}

.hero-seal {
  position: absolute;
  top: 10%;
  right: -2.5rem;
  width: 32px;
  height: auto;
  padding: 6px 4px;
  background: transparent;
  border: 2px solid var(--jl-c-seal-red);
  color: var(--jl-c-seal-red);
  font-family: var(--jl-font-heading);
  font-size: 1rem;
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 2px;
  border-radius: 2px;
}

.hero-title-en {
  font-family: var(--jl-font-heading);
  font-size: 1.4rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1.5rem 0;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero-tagline {
  font-size: 1.1rem;
  color: var(--vp-c-text-3);
  line-height: 1.8;
  max-width: 500px;
  margin: 0 auto 3rem;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
}

.btn-primary, .btn-secondary {
  padding: 0.8rem 2rem;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  border-radius: 2px;
}

.btn-primary {
  background: var(--jl-c-ink);
  color: var(--vp-c-bg);
  border: 1px solid var(--jl-c-ink);
}

.btn-primary:hover {
  background: var(--vp-c-bg);
  color: var(--jl-c-ink);
}

.btn-secondary {
  background: transparent;
  color: var(--jl-c-ink);
  border: 1px solid var(--vp-c-border);
}

.btn-secondary:hover {
  border-color: var(--jl-c-ink);
}

.hero-meta-row {
  display: flex;
  justify-content: center;
  gap: 4rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  width: 100%;
}

.meta-item {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.meta-item span {
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (max-width: 768px) {
  .hero-title-zh { font-size: 5rem; }
  .hero-seal { right: -1.5rem; }
  .hero-actions { flex-direction: column; }
  .hero-meta-row { flex-wrap: wrap; gap: 1.5rem; padding: 1.5rem; }
  .hero-calligraphy { font-size: 60vw; }
}

.main-content {
  max-width: 1200px;
  width: 100%;
  padding: 6rem 2rem;
}

.portal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1px;
  background: var(--vp-c-border);
  border: 1px solid var(--vp-c-border);
  margin-bottom: 6rem;
}

.portal-card {
  background: var(--vp-c-bg);
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  min-height: 200px;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
}

.portal-card::after {
  content: attr(data-zh);
  position: absolute;
  bottom: -20px;
  right: -10px;
  font-family: var(--jl-font-heading);
  font-size: 8rem;
  color: var(--vp-c-text-1);
  opacity: 0.02;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}
.dark .portal-card::after {
  opacity: 0.03;
}

.portal-card:hover {
  background: var(--vp-c-bg-soft);
}

.portal-card:hover::after {
  transform: scale(1.1) translate(-10px, -10px);
  color: var(--jl-c-seal-red);
  opacity: 0.05;
}

.portal-zh {
  font-family: var(--jl-font-heading);
  font-size: 2.2rem;
  color: var(--jl-c-ink);
  font-weight: 400;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 1;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.portal-card:hover .portal-zh {
  transform: translateX(10px);
}

.portal-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.portal-en {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--vp-c-text-3);
  transition: color 0.3s ease;
}

.arrow {
  position: relative;
  width: 40px;
  height: 1px;
  background: var(--vp-c-divider);
}

.portal-card:hover .portal-en {
  color: var(--jl-c-ink);
}

.portal-card:hover .arrow {
  background: var(--jl-c-seal-red);
}

.editorial-section {
  max-width: 900px;
  margin: 0 auto;
}

.editorial-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.section-title {
  font-family: var(--jl-font-heading);
  font-size: 1.8rem;
  color: var(--jl-c-ink);
  font-weight: 400;
  margin: 0;
  white-space: nowrap;
}

.title-line {
  flex-grow: 1;
  height: 1px;
  background: var(--vp-c-border);
}

.dossier-list {
  display: flex;
  flex-direction: column;
}

.dossier-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5rem;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.dossier-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--jl-c-seal-red);
  transform: scaleY(0);
  transform-origin: center;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dossier-item:hover {
  background: var(--vp-c-bg-soft);
}

.dossier-item:hover::before {
  transform: scaleY(1);
}

.dossier-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 120px;
  flex-shrink: 0;
}

.category {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.status {
  font-size: 0.7rem;
  color: var(--jl-c-seal-red);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dossier-content {
  flex-grow: 1;
  padding: 0 2rem;
}

.dossier-name {
  font-family: var(--jl-font-heading);
  font-size: 1.6rem;
  color: var(--jl-c-ink);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.dossier-name span {
  font-size: 1.2rem;
  color: var(--vp-c-text-3);
  font-weight: 400;
}

.dossier-desc {
  color: var(--vp-c-text-2);
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

.dossier-arrow {
  font-size: 1.5rem;
  color: var(--vp-c-text-3);
  transition: all 0.3s ease;
  transform: translateX(-10px);
  opacity: 0;
}

.dossier-item:hover .dossier-arrow {
  color: var(--jl-c-seal-red);
  transform: translateX(0);
  opacity: 1;
}

@media (max-width: 768px) {
  .dossier-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  .dossier-content { padding: 0; }
  .dossier-arrow { display: none; }
  .dossier-meta { width: auto; flex-direction: row; align-items: center; }
}
</style>
