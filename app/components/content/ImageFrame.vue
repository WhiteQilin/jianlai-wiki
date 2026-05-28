<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  caption?: string
  source?: string
}>()
</script>

<template>
  <figure class="image-frame hover-lift">
    <div class="frame-inner">
      <img :src="src" :alt="alt || caption" loading="lazy" />
      <div v-if="source" class="source-tag">来源: {{ source }}</div>
    </div>
    <figcaption v-if="caption" class="frame-caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.image-frame {
  margin: 2.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.frame-inner {
  position: relative;
  border: 1px solid var(--c-border);
  background: var(--c-bg-soft);
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.frame-inner::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10%;
  bottom: 10%;
  width: 2px;
  background: var(--c-seal-red);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-frame:hover .frame-inner::before {
  opacity: 1;
}

.frame-inner img {
  display: block;
  max-width: 100%;
  height: auto;
  filter: grayscale(100%) contrast(1.1);
  mix-blend-mode: multiply;
  transition: filter 0.3s ease;
}

.dark .frame-inner img {
  mix-blend-mode: screen;
}

.image-frame:hover .frame-inner img {
  filter: grayscale(0%) contrast(1);
}

.source-tag {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: var(--c-bg);
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  opacity: 0.7;
  border: 1px solid var(--c-border);
}

.frame-caption {
  margin-top: 1rem;
  font-family: var(--font-heading);
  font-size: 0.95rem;
  color: var(--c-text-2);
  text-align: center;
  max-width: 80%;
  line-height: 1.6;
}
</style>
