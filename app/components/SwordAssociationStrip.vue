<script setup lang="ts">
import { computed } from 'vue'
import type { ResolvedEntryLink } from '~/utils/entryLinkResolver'

const props = defineProps<{
  knownUsers: ResolvedEntryLink[]
  relatedRecords: ResolvedEntryLink[]
  referencedBy: ResolvedEntryLink[]
}>()

const groups = computed(() =>
  [
    {
      key: 'known-users',
      label: 'Known User',
      entries: props.knownUsers,
    },
    {
      key: 'related-records',
      label: 'Related Records',
      entries: props.relatedRecords,
    },
    {
      key: 'referenced-by',
      label: 'Referenced By',
      entries: props.referencedBy,
    },
  ].filter((group) => group.entries.length > 0),
)
</script>

<template>
  <section class="association-strip" aria-labelledby="sword-associations-title">
    <header class="strip-heading">
      <p class="strip-kicker">Recorded Associations</p>
      <h2 id="sword-associations-title">Current manual links</h2>
    </header>

    <div v-if="groups.length" class="association-groups">
      <div v-for="group in groups" :key="group.key" class="association-group">
        <span class="group-label">{{ group.label }}</span>
        <div class="group-links">
          <RouteDisplayLink
            v-for="entry in group.entries"
            :key="`${group.key}-${entry.raw}`"
            :item="entry"
            variant="chip"
          />
        </div>
      </div>
    </div>

    <p v-else class="strip-empty">No recorded associations are published for this manual record yet.</p>
  </section>
</template>

<style scoped>
.association-strip {
  display: grid;
  grid-template-columns: minmax(11rem, 0.28fr) minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
  align-items: start;
  margin-top: clamp(1.25rem, 3vw, 2rem);
  padding: clamp(1rem, 2.7vw, 1.35rem) 0;
  border-top: 1px solid var(--c-divider);
  border-bottom: 1px solid var(--c-divider);
}

.strip-heading {
  display: grid;
  gap: 0.4rem;
}

.strip-kicker {
  margin: 0;
  color: var(--sword-celadon, var(--c-teal-accent));
  font-family: var(--font-mono);
  font-size: 0.74rem;
  line-height: 1.3;
  letter-spacing: 0;
}

.strip-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: clamp(1.65rem, 3.2vw, 2.4rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
  text-wrap: balance;
}

.association-groups {
  min-width: 0;
  display: grid;
  gap: 0.65rem;
}

.association-group {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(8rem, 0.2fr) minmax(0, 1fr);
  gap: 0.75rem;
  align-items: start;
  padding: 0.72rem;
  border: 1px solid var(--c-divider);
  border-left: 2px solid color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 46%, transparent);
  border-radius: 6px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-paper-alt) 72%, transparent), color-mix(in srgb, var(--c-bg-soft) 72%, transparent)),
    url('/images/textures/ink-wash-02.webp');
  background-size: auto, cover;
  background-blend-mode: normal, multiply;
}

.group-label {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.35;
}

.group-links {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.strip-empty {
  margin: 0;
  color: var(--c-text-3);
  font-size: 0.92rem;
  line-height: 1.55;
}

@media (max-width: 760px) {
  .association-strip {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .association-group {
    grid-template-columns: 1fr;
    gap: 0.45rem;
  }
}
</style>
