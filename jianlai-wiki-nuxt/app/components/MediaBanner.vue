<script setup lang="ts">
defineProps<{
  image: string
  alt?: string
  caption?: string
  credit?: string
  isOfficial?: boolean
}>()
</script>

<template>
  <div class="media-banner">
    <img :src="image" :alt="alt || ''" class="banner-image" />
    
    <div v-if="credit || caption || isOfficial" class="media-attribution">
      <span v-if="isOfficial" class="official-badge">Official Promotional Image</span>
      <p v-if="caption" class="media-caption">{{ caption }}</p>
      <p v-if="credit" class="media-credit">Credit: {{ credit }}</p>
    </div>
  </div>
</template>

<style scoped>
.media-banner {
  position: relative;
  width: 100%;
  margin: 2rem 0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.banner-image {
  width: 100%;
  height: auto;
  display: block;
}

.media-attribution {
  position: absolute;
  bottom: 1rem;
  right: 1.5rem;
  z-index: 2;
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  pointer-events: none;
}

.official-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.9);
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  backdrop-filter: blur(4px);
}

.media-caption {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.media-credit {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}
</style>