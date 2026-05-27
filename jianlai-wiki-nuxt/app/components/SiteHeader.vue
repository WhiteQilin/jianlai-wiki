<template>
  <header class="site-header">
    <div class="header-container">
      <NuxtLink to="/" class="site-logo">
        <span class="logo-zh">剑来</span>
        <span class="logo-en">Jian Lai Wiki</span>
      </NuxtLink>
      
      <nav class="site-nav">
        <NuxtLink to="/characters">人物 Characters</NuxtLink>
        <NuxtLink to="/world">天下 World</NuxtLink>
        <NuxtLink to="/cultivation">修行 Cultivation</NuxtLink>
        <NuxtLink to="/swordsmanship">剑术 Swordsmanship</NuxtLink>
        <NuxtLink to="/factions">势力 Factions</NuxtLink>
        <NuxtLink to="/artifacts">法宝 Artifacts</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--c-bg);
  border-bottom: 1px solid var(--c-border);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
}

.site-logo {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  text-decoration: none;
  border-bottom: none;
}

.logo-zh {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--c-ink);
}

.logo-en {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--c-text-2);
}

.site-nav {
  display: flex;
  gap: 1.5rem;
}

.site-nav a {
  font-size: 0.9rem;
  color: var(--c-text-1);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  padding-bottom: 0.2rem;
  transition: all 0.3s ease;
}

.site-nav a:hover, .site-nav a.router-link-active {
  color: var(--c-seal-red);
  border-bottom-color: var(--c-seal-red);
}

@media (max-width: 768px) {
  .site-nav {
    display: none; /* In a real app we'd add a hamburger menu */
  }
}
</style>
