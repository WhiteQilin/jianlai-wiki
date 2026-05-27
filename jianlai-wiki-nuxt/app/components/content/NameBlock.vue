<script setup lang="ts">
defineProps<{
  chinese: string
  pinyin?: string
  english?: string
}>()
</script>

<template>
  <div class="name-dossier" role="group" aria-label="Name information">
    <div class="name-seal-bg">印</div>
    <div class="name-content">
      <div class="name-zh">{{ chinese }}</div>
      <div class="name-meta">
        <span v-if="pinyin" class="name-pinyin">{{ pinyin }}</span>
        <span v-if="pinyin && english" class="name-separator">|</span>
        <span v-if="english" class="name-en">{{ english }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.name-dossier {
  margin: 3rem 0;
  padding: 1.5rem 0 1.5rem 2rem;
  border-left: 3px solid var(--c-seal-red);
  position: relative;
  overflow: hidden;
}

.name-seal-bg {
  position: absolute;
  top: -20px;
  right: 10%;
  font-size: 8rem;
  font-family: var(--font-heading);
  color: var(--c-seal-red-soft);
  opacity: 0.3;
  pointer-events: none;
  user-select: none;
  transform: rotate(-15deg);
}

.name-content {
  position: relative;
  z-index: 1;
}

.name-zh {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 400;
  color: var(--c-ink);
  line-height: 1.1;
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;
}

.name-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.name-separator {
  color: var(--c-divider);
}
</style>
