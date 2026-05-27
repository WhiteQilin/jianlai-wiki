<script setup lang="ts">
defineProps<{
  name: string
  image?: string
  titles?: string
  affiliation?: string
  realm?: string
  weapon?: string
}>()
</script>

<template>
  <aside class="dossier-box" role="complementary" :aria-label="`${name} dossier`">
    <div class="dossier-header">
      <h3 class="dossier-name">{{ name }}</h3>
    </div>

    <div v-if="image" class="dossier-image">
      <img :src="image" :alt="name" loading="lazy" />
    </div>

    <div class="dossier-body">
      <div v-if="titles" class="dossier-row">
        <span class="dossier-label">Titles</span>
        <div class="dossier-values">
          <span class="dossier-tag">{{ titles }}</span>
        </div>
      </div>
      <div v-if="affiliation" class="dossier-row">
        <span class="dossier-label">Faction</span>
        <span class="dossier-value">{{ affiliation }}</span>
      </div>
      <div v-if="realm" class="dossier-row">
        <span class="dossier-label">Realm</span>
        <span class="dossier-value realm">{{ realm }}</span>
      </div>
      <div v-if="weapon" class="dossier-row">
        <span class="dossier-label">Weapon</span>
        <span class="dossier-value">{{ weapon }}</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.dossier-box {
  float: right;
  width: 320px;
  max-width: 100%;
  margin: 0 0 2rem 2.5rem;
  border: 1px solid var(--c-border);
  background: var(--c-bg);
  box-shadow: 12px 12px 0 var(--c-bg-soft);
  font-size: 0.95rem;
  position: relative;
  clear: right;
}

.dossier-box::after {
  content: '';
  position: absolute;
  top: -1px;
  right: -1px;
  width: 20px;
  height: 20px;
  border-top: 2px solid var(--c-seal-red);
  border-right: 2px solid var(--c-seal-red);
}

@media (max-width: 768px) {
  .dossier-box {
    float: none;
    width: 100%;
    margin: 2rem 0;
    box-shadow: 8px 8px 0 var(--c-bg-soft);
  }
}

.dossier-header {
  border-bottom: 1px solid var(--c-border);
  padding: 1.5rem 1.5rem 1rem;
  position: relative;
}

.dossier-name {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.dossier-image {
  padding: 1.5rem;
  border-bottom: 1px solid var(--c-divider);
  background: var(--c-bg-alt);
}

.dossier-image img {
  width: 100%;
  height: auto;
  filter: grayscale(100%) contrast(1.1);
  mix-blend-mode: multiply;
}

.dark .dossier-image img {
  mix-blend-mode: screen;
}

.dossier-body {
  padding: 0.5rem 1.5rem 1.5rem;
}

.dossier-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.85rem 0;
  border-bottom: 1px dotted var(--c-border);
}

.dossier-row:last-child {
  border-bottom: none;
}

.dossier-label {
  font-weight: 600;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  width: 80px;
  flex-shrink: 0;
}

.dossier-value {
  color: var(--c-text-1);
  text-align: right;
  font-weight: 500;
  font-size: 0.9rem;
}

.dossier-value.realm {
  font-family: var(--font-heading);
  color: var(--c-seal-red);
}

.dossier-values {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.dossier-tag {
  font-family: var(--font-heading);
  color: var(--c-ink);
  font-size: 1rem;
}
</style>
