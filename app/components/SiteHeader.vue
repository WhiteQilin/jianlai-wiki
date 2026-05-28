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
      <div class="mobile-nav-bg"></div>
      <nav class="mobile-nav" @click="isMobileMenuOpen = false">
        <NuxtLink to="/characters" class="mobile-nav-item" style="--delay: 0.1s">
          <span class="m-zh">人物</span><span class="m-en">Characters</span>
        </NuxtLink>
        <NuxtLink to="/world" class="mobile-nav-item" style="--delay: 0.15s">
          <span class="m-zh">天下</span><span class="m-en">World</span>
        </NuxtLink>
        <NuxtLink to="/cultivation" class="mobile-nav-item" style="--delay: 0.2s">
          <span class="m-zh">修行</span><span class="m-en">Cultivation</span>
        </NuxtLink>
        <NuxtLink to="/swordsmanship" class="mobile-nav-item" style="--delay: 0.25s">
          <span class="m-zh">剑术</span><span class="m-en">Swordsmanship</span>
        </NuxtLink>
        <NuxtLink to="/factions" class="mobile-nav-item" style="--delay: 0.3s">
          <span class="m-zh">势力</span><span class="m-en">Factions</span>
        </NuxtLink>
        <NuxtLink to="/artifacts" class="mobile-nav-item" style="--delay: 0.35s">
          <span class="m-zh">法宝</span><span class="m-en">Artifacts</span>
        </NuxtLink>
        <NuxtLink to="/timeline" class="mobile-nav-item" style="--delay: 0.4s">
          <span class="m-zh">年表</span><span class="m-en">Timeline</span>
        </NuxtLink>
        <NuxtLink to="/glossary" class="mobile-nav-item" style="--delay: 0.45s">
          <span class="m-zh">术语</span><span class="m-en">Glossary</span>
        </NuxtLink>
      </nav>
      <div class="mobile-nav-seal" v-if="isMobileMenuOpen">印</div>
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

.site-nav a::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  opacity: 0;
  mix-blend-mode: multiply;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: -1;
  border-radius: 4px;
}

.dark .site-nav a::before {
  mix-blend-mode: screen;
}

.site-nav a:hover::before {
  opacity: 0.05;
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
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 5px rgba(0,0,0,0);
}

.search-placeholder:hover {
  border-color: var(--c-charcoal);
  color: var(--c-text-2);
  background: var(--c-bg-alt);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transform: translateY(-1px);
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding-top: calc(var(--header-height) + 2rem);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    z-index: 999;
    overflow: hidden;
  }

  .mobile-nav-bg {
    position: absolute;
    inset: 0;
    background: rgba(249, 248, 246, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: -1;
  }

  .dark .mobile-nav-bg {
    background: rgba(15, 16, 17, 0.95);
  }

  .mobile-nav-wrapper.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    padding: 0 3rem;
    position: relative;
    z-index: 1;
  }

  .mobile-nav-item {
    padding: 1.2rem 0;
    text-decoration: none;
    border-bottom: 1px solid var(--c-divider);
    display: flex;
    align-items: baseline;
    gap: 1.5rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .mobile-nav-wrapper.is-open .mobile-nav-item {
    opacity: 1;
    transform: translateY(0);
    transition-delay: var(--delay);
  }

  .m-zh {
    font-family: var(--font-heading);
    font-size: 2rem;
    color: var(--c-ink);
  }

  .m-en {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--c-text-3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .mobile-nav-item:active .m-zh {
    color: var(--c-seal-red);
  }

  .mobile-nav-seal {
    position: absolute;
    bottom: 4rem;
    right: 3rem;
    font-family: var(--font-heading);
    font-size: 12rem;
    color: var(--c-seal-red-soft);
    opacity: 0;
    transform: scale(0.8) rotate(-15deg);
    animation: stampIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.5s;
    pointer-events: none;
    z-index: 0;
  }
}
</style>
