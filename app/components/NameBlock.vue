<script setup lang="ts">
defineProps<{
  nameEn: string
  nameZh: string
  pinyin?: string
  seal?: string
}>()
</script>

<template>
  <div class="name-block">
    <div class="name-primary">
      <h1 class="name-en">{{ nameEn }}</h1>
      <UiSealStamp
        v-if="seal"
        :text="seal"
        variant="carved"
        size="md"
        writing="vertical"
        :decorative="true"
      />
    </div>
    <div class="name-secondary">
      <span class="name-zh">{{ nameZh }}</span>
      <span v-if="pinyin" class="name-pinyin">{{ pinyin }}</span>
    </div>
  </div>
</template>

<style scoped>
.name-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.name-primary {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-width: 0;
}

.name-en {
  min-width: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.8rem, 8vw, 4.5rem);
  color: var(--c-ink);
  margin: 0;
  line-height: 1.1;
  letter-spacing: 0.02em;
  overflow-wrap: anywhere;
}

/* SealStamp replaces inline .name-seal — sizing handled by component props */

.name-secondary {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  padding-left: 0.2rem;
}

.name-zh {
  font-family: var(--font-zh-display);
  font-size: 3.1rem;
  color: var(--c-text-2);
  line-height: 1;
  letter-spacing: 0.16em;
}

.name-pinyin {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

@media (max-width: 768px) {
  .name-block {
    margin-bottom: 1.5rem;
  }
  .name-en { font-size: clamp(2.35rem, 13vw, 3.2rem); }
  .name-zh { font-size: 2.2rem; letter-spacing: 0.1em; }
  .name-primary { gap: 0.8rem; flex-wrap: wrap; }
  :deep(.seal-stamp) { font-size: 0.88rem; }
  .name-secondary { gap: 1rem; flex-wrap: wrap; min-width: 0; }
}
</style>
