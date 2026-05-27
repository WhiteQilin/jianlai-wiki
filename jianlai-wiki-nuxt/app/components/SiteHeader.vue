<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="header-container">
      <NuxtLink to="/" class="site-logo">
        <div class="logo-text">
          <span class="logo-zh">剑来</span>
          <span class="logo-seal">印</span>
        </div>
        <span class="logo-en">JIAN LAI<br>WIKI</span>
      </NuxtLink>
      
      <div class="desktop-nav">
        <nav class="site-nav">
          <NuxtLink to="/characters"><span class="nav-zh">人物</span><span class="nav-en">Characters</span></NuxtLink>
          <NuxtLink to="/world"><span class="nav-zh">天下</span><span class="nav-en">World</span></NuxtLink>
          <NuxtLink to="/cultivation"><span class="nav-zh">修行</span><span class="nav-en">Cultivation</span></NuxtLink>
          <NuxtLink to="/swordsmanship"><span class="nav-zh">剑术</span><span class="nav-en">Swordsmanship</span></NuxtLink>
          <NuxtLink to="/factions"><span class="nav-zh">势力</span><span class="nav-en">Factions</span></NuxtLink>
          <NuxtLink to="/artifacts"><span class="nav-zh">法宝</span><span class="nav-en">Artifacts</span></NuxtLink>
          <NuxtLink to="/timeline"><span class="nav-zh">年表</span><span class="nav-en">Timeline</span></NuxtLink>
        </nav>
        
        <div class="search-placeholder">
          <span class="search-icon">🔍</span>
          <span class="search-text">Search lore...</span>
        </div>
      </div>

      <button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="Toggle menu">
        <span class="hamburger" :class="{ 'is-active': isMobileMenuOpen }"></span>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div class="mobile-nav-wrapper" :class="{ 'is-open': isMobileMenuOpen }">
      <nav class="mobile-nav" @click="isMobileMenuOpen = false">
        <NuxtLink to="/characters">人物 Characters</NuxtLink>
        <NuxtLink to="/world">天下 World</NuxtLink>
        <NuxtLink to="/cultivation">修行 Cultivation</NuxtLink>
        <NuxtLink to="/swordsmanship">剑术 Swordsmanship</NuxtLink>
        <NuxtLink to="/factions">势力 Factions</NuxtLink>
        <NuxtLink to="/artifacts">法宝 Artifacts</NuxtLink>
        <NuxtLink to="/timeline">年表 Timeline</NuxtLink>
        <NuxtLink to="/glossary">术语 Glossary</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  z-index: 1000;
  background-color: transparent;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  border-bottom: 1px solid transparent;
}

.site-header.is-scrolled {
  background-color: rgba(249, 248, 246, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--c-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.dark .site-header.is-scrolled {
  background-color: rgba(15, 16, 17, 0.85);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 2.5rem;
}

.site-logo {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  text-decoration: none;
  position: relative;
}

.logo-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-zh {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 500;
  color: var(--c-charcoal);
  letter-spacing: 0.05em;
  line-height: 1;
  transition: color 0.3s ease;
}

.site-logo:hover .logo-zh {
  color: var(--c-seal-red);
}

.logo-seal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--c-seal-red);
  color: var(--c-seal-red);
  font-family: var(--font-heading);
  font-size: 0.8rem;
  border-radius: 2px;
  line-height: 1;
  transition: all 0.3s ease;
}

.site-logo:hover .logo-seal {
  background-color: var(--c-seal-red);
  color: var(--c-paper);
}

.logo-en {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--c-text-2);
  line-height: 1.4;
  border-left: 1px solid var(--c-divider);
  padding-left: 1.2rem;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 3.5rem;
}

.site-nav {
  display: flex;
  gap: 2.5rem;
}

.site-nav a {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.nav-zh {
  font-family: var(--font-heading);
  font-size: 1rem;
  color: var(--c-ink);
  font-weight: 500;
  line-height: 1.2;
  transition: color 0.3s ease;
}

.nav-en {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
  transition: color 0.3s ease;
}

.site-nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--c-seal-red);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.site-nav a:hover .nav-zh, .site-nav a.router-link-active .nav-zh {
  color: var(--c-seal-red);
}

.site-nav a:hover .nav-en, .site-nav a.router-link-active .nav-en {
  color: var(--c-ink);
}

.site-nav a:hover::after, .site-nav a.router-link-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.search-placeholder {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1.2rem;
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  border-radius: 20px;
  color: var(--c-text-3);
  font-size: 0.85rem;
  cursor: text;
  transition: all 0.3s ease;
}

.search-placeholder:hover {
  border-color: var(--c-charcoal);
  color: var(--c-text-2);
  background: var(--c-bg-alt);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--c-charcoal);
  position: relative;
  transition: background 0.3s;
}
.hamburger::before, .hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: var(--c-charcoal);
  left: 0;
  transition: all 0.3s;
}
.hamburger::before { top: -6px; }
.hamburger::after { bottom: -6px; }

.hamburger.is-active { background: transparent; }
.hamburger.is-active::before { transform: rotate(45deg); top: 0; }
.hamburger.is-active::after { transform: rotate(-45deg); bottom: 0; }

.mobile-nav-wrapper {
  display: none;
}

@media (max-width: 1100px) {
  .desktop-nav { display: none; }
  .mobile-menu-btn { display: block; }
  
  .mobile-nav-wrapper {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: var(--c-paper);
    padding-top: var(--header-height);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    z-index: 999;
  }

  .mobile-nav-wrapper.is-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    padding: 2rem 3rem;
  }

  .mobile-nav a {
    padding: 1.2rem 0;
    font-size: 1.2rem;
    font-family: var(--font-heading);
    color: var(--c-charcoal);
    text-decoration: none;
    border-bottom: 1px solid var(--c-divider);
    display: flex;
    justify-content: space-between;
  }
}
</style>
