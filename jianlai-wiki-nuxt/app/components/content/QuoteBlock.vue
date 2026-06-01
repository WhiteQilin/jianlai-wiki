<script setup lang="ts">
defineProps<{
  author?: string
  source?: string
}>()
</script>

<template>
  <blockquote class="quote-block">
    <div class="quote-icon">“</div>
    <div class="quote-content">
      <slot />
    </div>
    <footer v-if="author || source" class="quote-footer">
      <span v-if="author" class="quote-author">—— {{ author }}</span>
      <span v-if="source" class="quote-source"><cite>{{ source }}</cite></span>
    </footer>
  </blockquote>
</template>

<style scoped>
.quote-block {
  margin: 3rem 0;
  padding: 2rem 2.5rem 2rem 4rem;
  position: relative;
  background: linear-gradient(to right, var(--c-seal-red-soft), transparent 80%);
  border-left: 2px solid var(--c-seal-red);
  border-radius: 0 4px 4px 0;
}

.quote-icon {
  position: absolute;
  top: -1rem;
  left: 0.5rem;
  font-family: var(--font-heading);
  font-size: 6rem;
  color: var(--c-seal-red);
  opacity: 0.15;
  line-height: 1;
  user-select: none;
}

.quote-content {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--c-charcoal);
  font-style: italic;
  line-height: 1.8;
  position: relative;
  z-index: 1;
}

.quote-content :deep(p) {
  margin-bottom: 0;
}

.quote-content :deep(p + p) {
  margin-top: 1rem;
}

.quote-footer {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-style: normal;
  position: relative;
  z-index: 1;
}

.quote-author {
  font-weight: 500;
  color: var(--c-ink);
  font-size: 1.05rem;
}

.quote-source {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quote-source cite {
  font-style: normal;
}

.dark .quote-content {
  color: var(--c-ink);
}

@media (max-width: 768px) {
  .quote-block {
    padding: 1.5rem 1.5rem 1.5rem 3rem;
  }
  .quote-icon {
    font-size: 4rem;
    left: 0.25rem;
    top: -0.5rem;
  }
  .quote-content {
    font-size: 1.15rem;
  }
}
</style>