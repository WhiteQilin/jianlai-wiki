<script setup lang="ts">
// Homepage components
</script>

<template>
  <div class="home-archive">
    <HeroMedia>
      <template #background>
        <div class="hero-calligraphy-wrapper">
          <div class="hero-calligraphy">剑</div>
        </div>
      </template>

      <div class="hero-title-group animate-fade-in-up" style="animation-delay: 0.2s;">
        <h1 class="hero-title-zh">剑来</h1>
        <div class="hero-seal animate-stamp" style="animation-delay: 0.8s;">剑来</div>
      </div>
      
      <h2 class="hero-title-en animate-fade-in-up" style="animation-delay: 0.4s;">Sword, Come! Encyclopedia</h2>
      <p class="hero-tagline animate-fade-in-up" style="animation-delay: 0.6s;">
        A premium fandom archive of characters, realms, locations, and legends.
      </p>

      <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.8s;">
        <a href="#archive" class="btn-primary hover-lift">Enter the Archive</a>
        <NuxtLink to="/characters" class="btn-secondary hover-lift">Browse Characters</NuxtLink>
      </div>

      <template #footer>
        <div class="hero-meta-row animate-fade-in-up" style="animation-delay: 1s;">
          <div class="meta-item"><span>Characters</span> Hundreds</div>
          <div class="meta-item"><span>Worlds</span> Boundless</div>
          <div class="meta-item"><span>Cultivation</span> 14 Realms</div>
          <div class="meta-item"><span>Status</span> In Progress</div>
        </div>
      </template>
    </HeroMedia>

    <div class="dashboard-section animate-fade-in-up" style="animation-delay: 1.2s;">
      <div class="dashboard-grid">
        <NuxtLink to="/characters" class="dashboard-card hover-lift">
          <h4>Characters</h4>
          <span class="stat">Profiles</span>
        </NuxtLink>
        <NuxtLink to="/world" class="dashboard-card hover-lift">
          <h4>Worlds</h4>
          <span class="stat">Atlas</span>
        </NuxtLink>
        <NuxtLink to="/cultivation" class="dashboard-card hover-lift">
          <h4>Cultivation</h4>
          <span class="stat">Realms</span>
        </NuxtLink>
        <NuxtLink to="/factions" class="dashboard-card hover-lift">
          <h4>Factions</h4>
          <span class="stat">Sects</span>
        </NuxtLink>
      </div>
    </div>

    <div class="main-content" id="archive">
      <div class="portal-grid">
        <ArchivePortal link="/characters" titleZh="人物志" titleEn="Characters" bgChar="人" />
        <ArchivePortal link="/world" titleZh="天下图志" titleEn="World" bgChar="地" />
        <ArchivePortal link="/cultivation" titleZh="山上修行" titleEn="Cultivation" bgChar="修" />
        <ArchivePortal link="/swordsmanship" titleZh="剑术与神通" titleEn="Swordsmanship" bgChar="剑" />
        <ArchivePortal link="/factions" titleZh="宗门势力" titleEn="Factions" bgChar="宗" />
        <ArchivePortal link="/artifacts" titleZh="法宝器物" titleEn="Artifacts" bgChar="宝" />
        <ArchivePortal link="/timeline" titleZh="年表" titleEn="Timeline" bgChar="史" />
        <ArchivePortal link="/glossary" titleZh="术语典籍" titleEn="Glossary" bgChar="典" />
      </div>

      <div class="editorial-section">
        <div class="editorial-header">
          <h3 class="section-title">Featured Characters</h3>
          <div class="title-line"></div>
        </div>

        <div class="dossier-list">
          <FeaturedDossier 
            link="/characters/chen-pingan" 
            nameEn="Chen Ping'an" 
            nameZh="陈平安" 
            desc="The protagonist from Lizhu Blessed Land. A young man who walks his own path with a sword." 
            category="Character" 
            status="To be verified" 
          />
          <FeaturedDossier 
            link="/characters/ning-yao" 
            nameEn="Ning Yao" 
            nameZh="宁姚" 
            desc="The peerless sword immortal of the Sword Qi Great Wall." 
            category="Character" 
            status="To be verified" 
          />
          <FeaturedDossier 
            link="/characters/qi-jingchun" 
            nameEn="Qi Jingchun" 
            nameZh="齐静春" 
            desc="The Spring Breeze, a scholar of the highest order." 
            category="Character" 
            status="To be verified" 
          />
        </div>

        <div class="editorial-header" style="margin-top: 6rem;">
          <h3 class="section-title">Featured Lore</h3>
          <div class="title-line"></div>
        </div>

        <div class="dossier-list">
          <FeaturedDossier 
            link="/world/sample" 
            nameEn="Haoran Tianxia" 
            nameZh="浩然天下" 
            desc="The Great World of Haoran, home to Confucian scholars and mortal dynasties." 
            category="World" 
            status="To be verified" 
          />
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
  font-family: var(--font-heading);
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

.hero-title-zh {
  font-family: var(--font-heading);
  font-size: 6rem;
  font-weight: 400;
  color: var(--c-ink);
  margin: 0;
  line-height: 1;
  letter-spacing: 0.1em;
  text-align: center;
  white-space: nowrap;
}
.hero-title-zh::after {
  display: none;
}

.hero-seal {
  position: absolute;
  top: 10%;
  right: -2.5rem;
  width: 32px;
  height: auto;
  padding: 6px 4px;
  background: transparent;
  border: 2px solid var(--c-seal-red);
  color: var(--c-seal-red);
  font-family: var(--font-heading);
  font-size: 1rem;
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 2px;
  border-radius: 2px;
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

.hero-meta-row {
  display: flex;
  justify-content: center;
  gap: 4rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--c-border);
  background: var(--c-bg);
  width: 100%;
}

.meta-item {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--c-text-1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.meta-item span {
  color: var(--c-text-3);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.dashboard-section {
  width: 100%;
  background: var(--c-bg-soft);
  border-bottom: 1px solid var(--c-border);
  padding: 2rem;
}

.dashboard-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  text-align: center;
  padding: 2rem 1.5rem;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  text-decoration: none;
  display: block;
}

.dashboard-card h4 {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 0.5rem 0;
}

.dashboard-card .stat {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: var(--c-ink);
}

.main-content {
  max-width: 1200px;
  width: 100%;
  padding: 4rem 2rem 6rem;
}

.portal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1px;
  background: var(--c-border);
  border: 1px solid var(--c-border);
  margin-bottom: 6rem;
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

.dossier-list {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .hero-title-zh { font-size: 5rem; }
  .hero-seal { right: -1.5rem; }
  .hero-actions { flex-direction: column; }
  .hero-meta-row { flex-wrap: wrap; gap: 1.5rem; padding: 1.5rem; }
  .hero-calligraphy { font-size: 60vw; }
}
</style>
