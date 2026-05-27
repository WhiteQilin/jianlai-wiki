<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="footer-logo">剑来 <span>Jian Lai Wiki</span></span>
          <p class="footer-desc">A premium, fan-made encyclopedia dedicated to the world of Sword, Come! by Feng Huo Xi Zhu Hou.</p>
        </div>
        
        <div class="footer-links">
          <div class="link-group">
            <h4>Archive</h4>
            <NuxtLink to="/characters">Characters</NuxtLink>
            <NuxtLink to="/world">World</NuxtLink>
            <NuxtLink to="/cultivation">Cultivation</NuxtLink>
            <NuxtLink to="/factions">Factions</NuxtLink>
          </div>
          <div class="link-group">
            <h4>Lore</h4>
            <NuxtLink to="/swordsmanship">Swordsmanship</NuxtLink>
            <NuxtLink to="/artifacts">Artifacts</NuxtLink>
            <NuxtLink to="/timeline">Timeline</NuxtLink>
            <NuxtLink to="/glossary">Glossary</NuxtLink>
          </div>
          <div class="link-group">
            <h4>Meta</h4>
            <NuxtLink to="/about">About Wiki</NuxtLink>
            <a href="https://github.com/WhiteQilin/jianlai-wiki" target="_blank" rel="noopener noreferrer">Contribute on GitHub</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-seal">印</div>
        <p class="disclaimer">This is an unofficial, fan-made lore compendium. All rights to original characters, artwork, and story belong to their respective creators.</p>
        <p class="copyright">&copy; {{ new Date().getFullYear() }} Jian Lai Wiki Contributors.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--c-border);
  background-color: var(--c-mist);
  padding: 5rem 2rem 3rem;
  margin-top: auto;
  position: relative;
  overflow: hidden;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 4rem;
  margin-bottom: 5rem;
}

.footer-brand {
  max-width: 350px;
}

.footer-logo {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  color: var(--c-charcoal);
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1rem;
}

.footer-logo span {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.footer-desc {
  font-size: 1rem;
  color: var(--c-text-2);
  line-height: 1.8;
}

.footer-links {
  display: flex;
  gap: 5rem;
}

.link-group h4 {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--c-charcoal);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0 0 1.5rem 0;
  border-bottom: 1px solid var(--c-divider);
  padding-bottom: 0.5rem;
}

.link-group a {
  display: block;
  color: var(--c-text-2);
  text-decoration: none;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  position: relative;
}

.link-group a:hover {
  color: var(--c-seal-red);
  padding-left: 5px;
}

.footer-bottom {
  border-top: 1px solid var(--c-border);
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  position: relative;
}

.footer-seal {
  font-family: var(--font-heading);
  font-size: 8rem;
  color: var(--c-seal-red-soft);
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -30%);
  z-index: -1;
  pointer-events: none;
  user-select: none;
}

.disclaimer {
  font-size: 0.85rem;
  color: var(--c-text-3);
  margin: 0;
  max-width: 600px;
  line-height: 1.6;
}

.copyright {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--c-text-3);
  margin: 0;
  letter-spacing: 0.05em;
}

@media (max-width: 900px) {
  .footer-top {
    flex-direction: column;
    gap: 4rem;
  }
  .footer-links {
    flex-wrap: wrap;
    gap: 3rem;
  }
}
</style>
