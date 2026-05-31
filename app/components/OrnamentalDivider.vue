<template>
  <div class="ornamental-divider" :class="`color-${color}`">
    <div class="divider-line left"></div>
    <div class="divider-motif" v-if="motif !== 'none'">
      <!-- Jade Motif -->
      <svg v-if="motif === 'jade'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="motif-jade">
        <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
      <!-- Lotus Motif -->
      <svg v-else-if="motif === 'lotus'" width="32" height="16" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="motif-lotus">
        <path d="M16 14C12 14 8 10 8 10C8 10 12 12 16 12C20 12 24 10 24 10C24 10 20 14 16 14Z" fill="currentColor"/>
        <path d="M16 2C13 8 10 10 10 10C12 10 14.5 8.5 16 7C17.5 8.5 20 10 22 10C22 10 19 8 16 2Z" fill="currentColor"/>
      </svg>
      <!-- Ruyi Motif -->
      <svg v-else-if="motif === 'ruyi'" width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="motif-ruyi">
        <path d="M14 12C10 12 7 9 7 6C7 4.34315 8.34315 3 10 3C11.6569 3 13 4.34315 13 6C13 7.65685 14 8 14 8C14 8 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6C21 9 18 12 14 12Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      </svg>
      <!-- Diamond (Default fallback) -->
      <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="motif-diamond">
        <path d="M6 2L10 6L6 10L2 6L6 2Z" fill="currentColor"/>
      </svg>
    </div>
    <div class="divider-line right"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  motif: {
    type: String,
    default: 'jade', // 'jade', 'lotus', 'ruyi', 'diamond', 'none'
  },
  color: {
    type: String,
    default: 'ink', // 'ink', 'celadon'
  }
});
</script>

<style scoped>
.ornamental-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4rem 0;
  width: 100%;
}

.divider-line {
  flex-grow: 1;
  height: 1px;
  background-color: currentColor;
  opacity: 0.2;
}

.divider-motif {
  margin: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

/* Colors */
.color-ink {
  color: var(--c-ink-wash);
}
.color-celadon {
  color: var(--c-teal-accent);
}

.dark .color-ink {
  color: var(--c-ink);
}
</style>
