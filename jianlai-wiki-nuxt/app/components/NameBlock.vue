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
  font-size: 4.5rem;
  color: var(--c-ink);
  margin: 0;
  line-height: 1.1;
  letter-spacing: 0.02em;
}

.name-seal {
  font-family: var(--font-zh-display);
  color: var(--c-seal-red);
  border: 2px solid var(--c-seal-red-soft);
  background: rgba(184, 42, 42, 0.05);
  padding: 6px 8px;
  font-size: 1.4rem;
  border-radius: 2px;
  line-height: 1;
  writing-mode: vertical-rl;
  text-orientation: upright;
  transform: rotate(-3deg);
  box-shadow: 2px 2px 0 rgba(184, 42, 42, 0.1);
}

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
  .name-en { font-size: 3.2rem; }
  .name-zh { font-size: 2.2rem; letter-spacing: 0.1em; }
  .name-primary { gap: 1rem; }
  .name-seal { font-size: 1.2rem; padding: 4px 6px; }
  .name-secondary { gap: 1rem; flex-wrap: wrap; }
}
</style>
