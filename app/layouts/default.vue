<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isTimeline = computed(() => route.path === '/timeline' || route.path.startsWith('/timeline/'))
const isSwordsmanship = computed(() => route.path === '/swordsmanship' || route.path.startsWith('/swordsmanship/'))
</script>

<template>
  <div class="site-shell" :class="{ 'is-timeline-shell': isTimeline, 'is-swordsmanship-shell': isSwordsmanship }">
    <IntroSequence />
    <SiteHeader />
    <main class="site-main" :class="{ 'no-top-margin': isTimeline }">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.site-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-shell.is-timeline-shell {
  background-color: #050505; /* Seamless dark background for timeline */
}

.site-shell.is-swordsmanship-shell {
  background-color: #080f16; /* Seamless dark steel-blue for swordsmanship */
}

.site-main {
  flex-grow: 1;
  /* Push content down to avoid clipping under fixed header */
  margin-top: var(--header-height);
}

.site-main.no-top-margin {
  margin-top: 0;
}
</style>
