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

const pendingReason = (link: ResolvedEntryLink): 'missing' | 'internal' | 'plain' => {
  if (link.isInternalOnly) return 'internal'
  if (link.isMissingRoute) return 'missing'
  return 'plain'
}
</script>

<template>
  <section class="association-strip" aria-labelledby="sword-associations-title">
    <div class="association-margin" aria-hidden="true">
      <span>旁注</span>
    </div>

    <div class="association-body">
      <header class="strip-heading">
        <p class="strip-kicker">Recorded Associations</p>
        <h2 id="sword-associations-title">Marginal notes</h2>
      </header>

      <div v-if="groups.length" class="association-groups">
        <article v-for="group in groups" :key="group.key" class="association-group">
          <span class="group-label">{{ group.label }}</span>
          <div class="group-links">
            <template v-for="entry in group.entries" :key="`${group.key}-${entry.raw}-${entry.path}`">
              <JadeChip v-if="entry.shouldLink" :to="entry.path">
                {{ entry.label }}
                <span v-if="entry.chinese" class="chip-chinese">{{ entry.chinese }}</span>
              </JadeChip>
              <PendingRouteChip
                v-else
                :label="entry.label"
                :chinese="entry.chinese"
                :reason="pendingReason(entry)"
              />
            </template>
          </div>
        </article>
      </div>

      <p v-else class="strip-empty">No recorded associations are published for this manual record yet.</p>
    </div>
  </section>
</template>

<style scoped>
.association-strip {
  position: relative;
  display: grid;
  grid-template-columns: minmax(2.6rem, 0.08fr) minmax(0, 1fr);
  margin-top: clamp(0.7rem, 2vw, 1.15rem);
  color: var(--c-ink);
  border: 1px solid color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 22%, var(--c-border));
  border-radius: 5px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--c-paper-alt) 70%, transparent), color-mix(in srgb, var(--c-bg-soft) 74%, transparent)),
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--c-ink) 2%, transparent) 0 1px, transparent 1px 2.2rem),
    var(--c-bg);
  box-shadow:
    0 16px 36px color-mix(in srgb, var(--sword-celadon, #315f59) 6%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--c-paper-alt) 58%, transparent);
  overflow: hidden;
}

.association-strip::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--sword-silver, #aeb8b4) 74%, transparent), var(--c-seal-red), transparent);
  opacity: 0.52;
  pointer-events: none;
}

.association-margin {
  display: grid;
  place-items: start center;
  padding: clamp(0.95rem, 2.2vw, 1.25rem) 0.4rem;
  color: color-mix(in srgb, var(--c-seal-red) 76%, var(--c-ink));
  border-right: 1px solid color-mix(in srgb, var(--c-seal-red) 20%, var(--c-divider));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-seal-red) 5%, transparent), transparent 48%),
    color-mix(in srgb, var(--c-paper-alt) 48%, transparent);
  font-family: var(--font-zh-display);
  font-size: clamp(1.25rem, 2.8vw, 1.8rem);
  line-height: 1;
  writing-mode: vertical-rl;
  text-orientation: upright;
}

.association-body {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(10rem, 0.28fr) minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 1.8rem);
  align-items: start;
  padding: clamp(0.95rem, 2.8vw, 1.35rem);
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
  gap: 0.55rem;
}

.association-group {
  position: relative;
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(8.6rem, 0.22fr) minmax(0, 1fr);
  gap: 0.75rem 0.9rem;
  align-items: start;
  padding: 0.74rem 0;
  border-top: 1px solid var(--c-divider);
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-seal-red) 7%, transparent) 0 0.18rem, transparent 0.18rem),
    transparent;
}

.group-label {
  padding-left: 0.7rem;
  color: color-mix(in srgb, var(--c-text-3) 82%, var(--c-seal-red));
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

.chip-chinese {
  color: color-mix(in srgb, var(--c-text-3) 82%, var(--c-seal-red));
  font-size: 0.9em;
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
  }

  .association-margin {
    min-height: 2.35rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0.65rem 1rem;
    border-right: 0;
    border-bottom: 1px solid color-mix(in srgb, var(--c-seal-red) 20%, var(--c-divider));
    writing-mode: horizontal-tb;
  }

  .association-body {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    padding: 0.95rem;
  }

  .association-group {
    grid-template-columns: 1fr;
    gap: 0.45rem;
  }
}
</style>
