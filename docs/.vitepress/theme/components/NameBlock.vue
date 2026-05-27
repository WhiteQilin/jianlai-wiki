<script setup lang="ts">
defineProps<{
  chinese: string
  pinyin?: string
  english?: string
}>()
</script>

<template>
  <div class="name-block" role="group" aria-label="Name information">
    <span class="name-chinese">{{ chinese }}</span>
    <span v-if="pinyin" class="name-pinyin">{{ pinyin }}</span>
    <span v-if="english" class="name-english">{{ english }}</span>
  </div>
</template>

<style scoped>
.name-block {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.75em;
  padding: 0.6em 1em;
  margin: 0.75em 0;
  border-left: 3px solid var(--jl-c-gold);
  background: var(--vp-c-bg-soft);
  border-radius: 0 6px 6px 0;
}

.name-chinese {
  font-family: var(--jl-font-heading);
  font-size: 1.4em;
  font-weight: 700;
  color: var(--jl-c-ink);
}

.dark .name-chinese {
  color: var(--jl-c-ink);
}

.name-pinyin {
  font-size: 1em;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.name-english {
  font-size: 0.95em;
  color: var(--vp-c-text-3);
}
</style>
