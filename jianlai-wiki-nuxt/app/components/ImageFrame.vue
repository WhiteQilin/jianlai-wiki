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
  <figure class="image-frame">
    <div class="image-wrapper">
      <img :src="image" :alt="alt || ''" class="frame-image" />
      
      <div v-if="credit || isOfficial" class="media-attribution">
        <span v-if="isOfficial" class="official-badge">Official Promotional Image</span>
        <span v-if="credit" class="media-credit">Credit: {{ credit }}</span>
      </div>
    </div>
    
    <figcaption v-if="caption" class="frame-caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.image-frame {
  margin: 2rem auto;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-wrapper {
  position: relative;
  border: 1px solid var(--c-border);
  padding: 0.5rem;
  background: var(--c-bg-soft);
  display: inline-block;
}

.frame-image {
  display: block;
  max-width: 100%;
  height: auto;
}

.media-attribution {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
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
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.9);
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
  backdrop-filter: blur(4px);
}

.media-credit {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.frame-caption {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--c-text-2);
  text-align: center;
  font-family: var(--font-heading);
  font-style: italic;
}
</style>