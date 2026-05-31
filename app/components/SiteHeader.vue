<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const isMoreOpen = ref(false)
const moreWrapper = ref<HTMLElement | null>(null)
const route = useRoute()

// Secondary sections surfaced via the "More" dropdown (titles intentionally excluded).
const moreLinks = [
  { to: '/rankings', zh: '榜单', en: 'Rankings' },
  { to: '/teachings', zh: '三教', en: 'Teachings' },
  { to: '/pantheon', zh: '神灵', en: 'Pantheon' },
  { to: '/glossary', zh: '术语', en: 'Glossary' },
]

const isMoreActive = computed(() =>
  moreLinks.some((l) => route.path === l.to || route.path.startsWith(`${l.to}/`)),
)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleMore = () => {
  isMoreOpen.value = !isMoreOpen.value
}

const closeMore = () => {
  isMoreOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleClickOutside = (e: MouseEvent) => {
  if (!isMoreOpen.value) return
  if (moreWrapper.value && !moreWrapper.value.contains(e.target as Node)) {
    isMoreOpen.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') isMoreOpen.value = false
}

// Close the dropdown whenever navigation occurs.
watch(() => route.path, () => {
  isMoreOpen.value = false
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="header-bg-texture"></div>
    <div class="header-container">
      <NuxtLink to="/" class="site-logo">
        <img src="/images/logos/JianLaiLogo.png" alt="Jian Lai" class="logo-mark" />
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

          <div
            ref="moreWrapper"
            class="nav-more"
            :class="{ 'is-open': isMoreOpen }"
          >
            <button
              type="button"
              class="nav-more-trigger"
              :class="{ 'is-active': isMoreActive }"
              :aria-expanded="isMoreOpen"
              aria-haspopup="true"
              @click="toggleMore"
            >
              <span class="nav-zh">更多</span><span class="nav-en">More</span>
            </button>

            <div class="nav-more-panel" :class="{ 'is-open': isMoreOpen }">
              <NuxtLink
                v-for="link in moreLinks"
                :key="link.to"
                :to="link.to"
                class="nav-more-item"
                @click="closeMore"
              >
                <span class="more-zh">{{ link.zh }}</span>
                <span class="more-en">{{ link.en }}</span>
              </NuxtLink>
            </div>
          </div>
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

        <div class="mobile-nav-divider" style="--delay: 0.45s">
          <span class="divider-zh">更多</span><span class="divider-en">More</span>
        </div>

        <NuxtLink to="/rankings" class="mobile-nav-item" style="--delay: 0.5s">
          <span class="m-zh">榜单</span><span class="m-en">Rankings</span>
        </NuxtLink>
        <NuxtLink to="/teachings" class="mobile-nav-item" style="--delay: 0.55s">
          <span class="m-zh">三教</span><span class="m-en">Teachings</span>
        </NuxtLink>
        <NuxtLink to="/pantheon" class="mobile-nav-item" style="--delay: 0.6s">
          <span class="m-zh">神灵</span><span class="m-en">Pantheon</span>
        </NuxtLink>
        <NuxtLink to="/glossary" class="mobile-nav-item" style="--delay: 0.65s">
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

.header-bg-texture {
  position: absolute;
  inset: 0;
  background-image: url('/images/header/site-header.jpeg');
  background-size: cover;
  background-position: center 25%;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: -1;
  pointer-events: none;
  filter: grayscale(80%) brightness(1.2) contrast(0.8);
}

.dark .header-bg-texture {
  filter: grayscale(80%) brightness(0.4) contrast(0.9);
}

.site-header.is-scrolled {
  background-color: rgba(249, 248, 246, 0.90);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--c-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.site-header.is-scrolled .header-bg-texture {
  opacity: 0.15;
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

.logo-mark {
  height: 44px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.18));
}

.site-logo:hover .logo-mark {
  transform: translateY(-1px);
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.24));
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

@media (max-width: 640px) {
  .site-logo {
    gap: 0.8rem;
  }

  .logo-mark {
    height: 36px;
  }

  .logo-en {
    font-size: 0.65rem;
    padding-left: 0.8rem;
  }
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
  font-family: var(--font-zh-display);
  font-size: 1.15rem;
  color: var(--c-ink);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0.08em;
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

/* --- "More" dropdown (desktop) --- */
.nav-more {
  position: relative;
  display: flex;
  align-items: stretch;
}

.nav-more-trigger {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  background: none;
  border: none;
  margin: 0;
  padding: 0.5rem 0;
  cursor: pointer;
  position: relative;
  font: inherit;
  transition: all 0.3s ease;
}

.nav-more-trigger::after {
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

.nav-more:hover .nav-more-trigger .nav-zh,
.nav-more-trigger.is-active .nav-zh {
  color: var(--c-seal-red);
}

.nav-more:hover .nav-more-trigger .nav-en,
.nav-more-trigger.is-active .nav-en {
  color: var(--c-ink);
}

.nav-more.is-open .nav-more-trigger::after,
.nav-more-trigger.is-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* Hover-open on devices with a hover-capable pointer (desktop) */
@media (hover: hover) {
  .nav-more:hover .nav-more-trigger::after {
    transform: scaleX(1);
    transform-origin: left;
  }
}

.nav-more-panel {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  padding: 0.6rem;
  background: rgba(249, 248, 246, 0.97);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.10);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), visibility 0.3s;
  z-index: 1001;
}

.nav-more-panel::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  height: 0.75rem;
}

.dark .nav-more-panel {
  background: rgba(20, 21, 22, 0.97);
}

.nav-more-panel.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

@media (hover: hover) {
  .nav-more:hover .nav-more-panel {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.nav-more-item {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  padding: 0.6rem 0.8rem;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s ease, padding 0.3s ease;
}

.nav-more-item:hover {
  background: var(--c-seal-red-soft);
}

.more-zh {
  font-family: var(--font-zh-display);
  font-size: 1rem;
  color: var(--c-ink);
  letter-spacing: 0.06em;
  transition: color 0.3s ease;
}

.more-en {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.nav-more-item:hover .more-zh,
.nav-more-item.router-link-active .more-zh {
  color: var(--c-seal-red);
}

.nav-more-item.router-link-active .more-en {
  color: var(--c-ink);
}

@media (prefers-reduced-motion: reduce) {
  .nav-more-panel {
    transition: opacity 0.15s ease, visibility 0.15s;
    transform: none;
  }
  .nav-more-panel.is-open {
    transform: none;
  }
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

  .mobile-nav-divider {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    padding: 1.5rem 0 0.4rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .mobile-nav-wrapper.is-open .mobile-nav-divider {
    opacity: 1;
    transform: translateY(0);
    transition-delay: var(--delay);
  }

  .divider-zh {
    font-family: var(--font-zh-display);
    font-size: 1rem;
    color: var(--c-seal-red);
    letter-spacing: 0.1em;
  }

  .divider-en {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--c-text-3);
    text-transform: uppercase;
    letter-spacing: 0.15em;
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
