<template>
  <div class="wiki-grid">
    <slot />
  </div>
</template>

<style scoped>
.wiki-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 2.5rem 0;
  border-top: 1px solid var(--vp-c-border);
}
</style>
