<template>
  <div class="dossier-grid">
    <slot />
  </div>
</template>

<style scoped>
.dossier-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

@media (max-width: 640px) {
  .dossier-grid {
    grid-template-columns: 1fr;
  }
}
</style>
