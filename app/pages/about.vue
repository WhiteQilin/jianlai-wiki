<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description:
    'Jian Lai Wiki is an unofficial, fan-made compendium dedicated to the lore, characters, and history of the xianxia web novel Sword, Come! (剑来).',
  ogTitle: 'About',
  ogDescription:
    'Jian Lai Wiki is an unofficial, fan-made compendium dedicated to the lore, characters, and history of the xianxia web novel Sword, Come! (剑来).',
})
</script>

<template>
  <div class="article-page mdc-content animate-fade-in-up">
    <h1>About <span class="zh">关于</span></h1>
    <div class="about-content">
      <p>Jian Lai Wiki is an unofficial, fan-made compendium dedicated to organizing the vast lore, characters, and history of the xianxia web novel <em>Sword, Come! (剑来)</em> by Feng Huo Xi Zhu Hou.</p>
      
      <p>This project is open-source and built by the community. All rights to original characters, artwork, and story belong to their respective creators.</p>
      
      <h3>Status</h3>
      <p>The wiki is currently <strong>Under Construction</strong>. Information marked as "To be verified" is pending confirmation against the text.</p>
      
      <h3>Help Expand the Archive</h3>
      <p>Notice a missing entry, incorrect lore, or a typo? We welcome contributions from the community.</p>
      <p>
        <NuxtLink to="/contribute" class="contribute-link">Learn how to contribute &rarr;</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}
.zh {
  font-size: 0.6em;
  color: var(--c-text-3);
  margin-left: 0.5rem;
}
.contribute-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--c-seal-red);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}
.contribute-link:hover {
  color: var(--c-seal-red-dark);
  text-decoration: underline;
}
</style>
