<script setup lang="ts">
const props = defineProps<{
  page: Record<string, any>
}>()

const entryCount = computed(() => {
  const entries = props.page?.entries
  if (!Array.isArray(entries)) return 0
  return entries.filter((entry) => entry && typeof entry === 'object' && typeof entry.name === 'string' && entry.name.trim()).length
})

const verificationLabel = computed(() => {
  const value = props.page?.verificationStatus
  if (typeof value !== 'string' || !value.trim()) return 'To Be Verified'
  return value
    .trim()
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
})
</script>

<template>
  <nav class="ranking-context-bar" aria-label="Rankings context navigation">
    <dl class="ranking-context-facts">
      <div>
        <dt>List Type</dt>
        <dd>{{ page?.listType || page?.subcategory || 'Ranking List' }}</dd>
      </div>
      <div>
        <dt>Archetype</dt>
        <dd>{{ page?.category || 'Named-List' }}</dd>
      </div>
      <div>
        <dt>Entries</dt>
        <dd>{{ entryCount }}</dd>
      </div>
      <div>
        <dt>Verification</dt>
        <dd>{{ verificationLabel }}</dd>
      </div>
    </dl>

    <UiInkButton to="/rankings" tone="cinnabar" class="ranking-context-return">
      Return to Register
    </UiInkButton>
  </nav>
</template>

<style scoped>
.ranking-context-bar {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding: 0.85rem 1rem;
  color: var(--rankings-ink, #332c22);
  border: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 72%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--rankings-paper, #f6ecd8) 74%, white), color-mix(in srgb, var(--rankings-mist, #e8dfcc) 72%, white)),
    radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--rankings-gold, #b29555) 10%, transparent), transparent 16rem);
}

.ranking-context-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.72rem;
  align-items: stretch;
  margin: 0;
}

.ranking-context-facts div {
  display: grid;
  gap: 0.18rem;
  min-width: min(11rem, 100%);
  padding: 0.48rem 0.62rem;
  border: 1px solid color-mix(in srgb, var(--rankings-frame, rgba(149, 113, 58, 0.32)) 44%, transparent);
  background: color-mix(in srgb, var(--rankings-paper, #f6ecd8) 58%, transparent);
}

.ranking-context-facts dt {
  color: color-mix(in srgb, var(--rankings-accent, #8a7448) 82%, var(--rankings-ink, #332c22));
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  line-height: 1.1;
  text-transform: uppercase;
}

.ranking-context-facts dd {
  margin: 0;
  color: var(--rankings-title-ink, #2c251b);
  font-family: var(--font-heading);
  font-size: 0.98rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.ranking-context-return {
  align-self: center;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
}

@media (max-width: 760px) {
  .ranking-context-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .ranking-context-return {
    align-self: flex-start;
  }
}
</style>
