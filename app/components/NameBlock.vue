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
      <span v-if="seal" class="name-seal">{{ seal }}</span>
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
}

.name-en {
  font-family: var(--font-heading);
  font-size: 4rem;
  color: var(--c-ink);
  margin: 0;
  line-height: 1;
}

.name-seal {
  font-family: var(--font-heading);
  color: var(--c-seal-red);
  border: 2px solid var(--c-seal-red);
  padding: 4px 6px;
  font-size: 1.2rem;
  border-radius: 2px;
  line-height: 1;
  writing-mode: vertical-rl;
  text-orientation: upright;
}

.name-secondary {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  padding-left: 0.2rem;
}

.name-zh {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--c-text-2);
  line-height: 1;
}

.name-pinyin {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (max-width: 768px) {
  .name-en { font-size: 3rem; }
  .name-zh { font-size: 2rem; }
  .name-primary { gap: 1rem; }
}
</style>
