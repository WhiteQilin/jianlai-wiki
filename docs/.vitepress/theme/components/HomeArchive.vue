<template>
  <div class="home-archive">
    <div class="hero-section">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <h1 class="hero-title-zh">剑来</h1>
        <h2 class="hero-title-en">Sword, Come! Encyclopedia</h2>
        <p class="hero-tagline">
          A fan-made archive of characters, realms, swordsmanship, locations, factions, artifacts, and chronology from Jian Lai.
        </p>
      </div>
    </div>

    <div class="main-content">
      <div class="portal-grid">
        <a href="/characters/" class="portal-card">
          <div class="portal-icon">🗡️</div>
          <div class="portal-text">
            <h3>人物志</h3>
            <span>Characters</span>
          </div>
        </a>
        <a href="/locations/" class="portal-card">
          <div class="portal-icon">🏔️</div>
          <div class="portal-text">
            <h3>天下图志</h3>
            <span>World</span>
          </div>
        </a>
        <a href="/cultivation/" class="portal-card">
          <div class="portal-icon">🌀</div>
          <div class="portal-text">
            <h3>山上修行</h3>
            <span>Cultivation</span>
          </div>
        </a>
        <a href="/sword-techniques/" class="portal-card">
          <div class="portal-icon">💫</div>
          <div class="portal-text">
            <h3>剑术与神通</h3>
            <span>Swordsmanship</span>
          </div>
        </a>
        <a href="/factions/" class="portal-card">
          <div class="portal-icon">🏛️</div>
          <div class="portal-text">
            <h3>宗门势力</h3>
            <span>Factions</span>
          </div>
        </a>
        <a href="/artifacts/" class="portal-card">
          <div class="portal-icon">🏺</div>
          <div class="portal-text">
            <h3>法宝器物</h3>
            <span>Artifacts</span>
          </div>
        </a>
        <a href="/timeline/" class="portal-card">
          <div class="portal-icon">📜</div>
          <div class="portal-text">
            <h3>年表</h3>
            <span>Timeline</span>
          </div>
        </a>
        <a href="/glossary/" class="portal-card">
          <div class="portal-icon">📖</div>
          <div class="portal-text">
            <h3>术语典籍</h3>
            <span>Glossary</span>
          </div>
        </a>
      </div>

      <div class="featured-section">
        <h3 class="section-title">Featured Articles</h3>
        <div class="featured-grid">
          <a href="/characters/chen-pingan" class="featured-card">
            <span class="status-badge">待完善</span>
            <h4>Chen Ping'an</h4>
            <p>The protagonist from Lizhu Blessed Land.</p>
          </a>
          <a href="/characters/" class="featured-card">
            <span class="status-badge">待完善</span>
            <h4>Ning Yao</h4>
            <p>The peerless sword immortal of the Sword Qi Great Wall.</p>
          </a>
          <a href="/characters/" class="featured-card">
            <span class="status-badge">待完善</span>
            <h4>Qi Jingchun</h4>
            <p>The Spring Breeze, a scholar of the highest order.</p>
          </a>
        </div>
      </div>

      <div class="notice-section">
        <LoreCard title="Archive Notice" type="warning">
          This wiki is currently under construction. Lore entries and character profiles are continuously being updated. Information that has not yet been fully verified against the novel is marked as <strong>待验证</strong> (To be verified).
        </LoreCard>
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

.hero-section {
  width: 100%;
  position: relative;
  padding: 8rem 2rem 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--jl-c-gold-dim);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: 
    linear-gradient(rgba(45, 90, 63, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(45, 90, 63, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
}

.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, var(--vp-c-bg-alt) 80%);
}

.dark .hero-bg {
  opacity: 0.1;
  background-image: 
    linear-gradient(rgba(201, 168, 76, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201, 168, 76, 0.05) 1px, transparent 1px);
}

.dark .hero-bg::after {
  background: radial-gradient(circle at center, transparent 0%, var(--vp-c-bg-alt) 80%);
}

.hero-content {
  position: relative;
  text-align: center;
  max-width: 800px;
  z-index: 1;
}

.hero-title-zh {
  font-family: var(--jl-font-heading);
  font-size: 6rem;
  font-weight: 700;
  color: var(--jl-c-jade);
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.15em;
  text-shadow: 2px 4px 10px rgba(0,0,0,0.1);
  border: none;
  padding: 0;
  line-height: 1.2;
}

.dark .hero-title-zh {
  color: var(--jl-c-jade-light);
  text-shadow: 2px 4px 15px rgba(0,0,0,0.4);
}

.hero-title-en {
  font-family: var(--jl-font-heading);
  font-size: 2rem;
  color: var(--vp-c-text-1);
  margin: 0 0 1.5rem 0;
  font-weight: 600;
  border: none;
  padding: 0;
  letter-spacing: 0.05em;
}

.hero-tagline {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.main-content {
  max-width: 1100px;
  width: 100%;
  padding: 4rem 2rem;
}

.portal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 5rem;
}

.portal-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  position: relative;
}

.portal-card::before {
  content: '';
  position: absolute;
  left: -1px;
  top: -1px;
  bottom: -1px;
  width: 4px;
  background: var(--jl-c-gold-dim);
  border-radius: 6px 0 0 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.portal-card:hover {
  transform: translateY(-3px);
  border-color: var(--jl-c-gold);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  background: var(--vp-c-bg-alt);
}

.dark .portal-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.portal-card:hover::before {
  opacity: 1;
}

.portal-icon {
  font-size: 2.5rem;
  margin-right: 1.25rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.portal-text h3 {
  margin: 0 0 0.25rem 0;
  font-family: var(--jl-font-heading);
  font-size: 1.2rem;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
  font-weight: 600;
}

.portal-text span {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.section-title {
  font-family: var(--jl-font-heading);
  font-size: 1.8rem;
  color: var(--vp-c-text-1);
  margin: 0 0 2.5rem 0;
  text-align: center;
  border-bottom: none;
  position: relative;
  font-weight: 600;
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: var(--jl-c-gold-dim);
  margin: 1rem auto 0;
  border-radius: 2px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 5rem;
}

.featured-card {
  position: relative;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  padding: 2rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.featured-card:hover {
  border-color: var(--jl-c-jade);
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
}

.dark .featured-card:hover {
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.status-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: var(--vp-c-warning-3);
  color: #fff;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid var(--jl-c-gold);
}

.dark .status-badge {
  background: var(--vp-c-bg-soft);
  color: var(--jl-c-gold);
}

.featured-card h4 {
  font-family: var(--jl-font-heading);
  font-size: 1.4rem;
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
}

.featured-card p {
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.notice-section {
  max-width: 800px;
  margin: 0 auto;
}
</style>
