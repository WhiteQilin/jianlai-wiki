<script setup lang="ts">
import { computed } from 'vue'
import type { ResolvedEntryLink } from '~/utils/entryLinkResolver'

const props = defineProps<{
  knownUsers: ResolvedEntryLink[]
  relatedRecords: ResolvedEntryLink[]
  referencedBy: ResolvedEntryLink[]
}>()

const annotationGroups = computed(() => [
  {
    eyebrow: 'Red-ink margin 01',
    title: 'Known Users',
    note: 'Owner recorded against the manual slip.',
    empty: 'No user inscription found.',
    items: props.knownUsers,
  },
  {
    eyebrow: 'Red-ink margin 02',
    title: 'Related Records',
    note: 'Records used to read the technique correctly.',
    empty: 'No related record inscription found.',
    items: props.relatedRecords,
  },
  {
    eyebrow: 'Red-ink margin 03',
    title: 'Referenced By',
    note: 'Other archive leaves that cite this sword art.',
    empty: 'No reverse citation inscribed yet.',
    items: props.referencedBy,
  },
])
</script>

<template>
  <aside class="manual-annotation-panel" aria-label="Manual marginal notes">
    <header class="annotation-intro">
      <p>Annotated margin</p>
      <h2>Marginal Commentary</h2>
    </header>

    <div class="annotation-groups-row">
      <section
        v-for="group in annotationGroups"
        :key="group.title"
        class="annotation-group"
        :class="{ 'annotation-group--empty': group.items.length === 0 }"
      >
        <div class="annotation-stamp" aria-hidden="true">注</div>
        <div class="annotation-copy">
          <p class="annotation-eyebrow">{{ group.eyebrow }}</p>
          <h3>{{ group.title }}</h3>
          <p class="annotation-note">{{ group.note }}</p>

          <ul v-if="group.items.length" class="annotation-list">
            <li v-for="item in group.items" :key="item.raw" class="annotation-item">
              <NuxtLink v-if="item.shouldLink" :to="item.path" class="annotation-link">
                <span>{{ item.label }}</span>
                <small v-if="item.chinese">{{ item.chinese }}</small>
              </NuxtLink>

              <span v-else class="annotation-link annotation-link--ghost">
                <span>{{ item.label }}</span>
                <small v-if="item.chinese">{{ item.chinese }}</small>
                <em v-if="item.isMissingRoute">pending route</em>
              </span>
            </li>
          </ul>

          <p v-else class="annotation-empty">{{ group.empty }}</p>
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.manual-annotation-panel {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1rem, 2vw, 1.25rem);
}

.manual-annotation-panel::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -1.5rem;
  height: 1.5rem;
  background: linear-gradient(to bottom,
    transparent,
    rgba(145, 49, 43, 0.1)
  );
  pointer-events: none;
}

.annotation-groups-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.25rem);
}

.annotation-intro,
.annotation-group {
  position: relative;
  min-width: 0;
  border: 1px solid rgba(30, 61, 74, 0.14);
  background:
    linear-gradient(180deg, rgba(236, 243, 238, 0.74), rgba(216, 230, 227, 0.58));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.44);
}

.annotation-intro {
  padding: clamp(1rem, 2vw, 1.5rem) clamp(1.2rem, 2.4vw, 1.8rem);
  display: flex;
  flex-direction: column;
  justify-content: end;
  overflow: hidden;
}

.annotation-intro::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(145, 49, 43, 0.2),
    transparent
  );
}

.annotation-intro p,
.annotation-eyebrow {
  margin: 0;
  color: rgba(145, 49, 43, 0.76);
  font-family: var(--font-mono);
  font-size: 0.63rem;
  letter-spacing: 0.15em;
  line-height: 1.45;
  text-transform: uppercase;
}

.annotation-intro h2 {
  position: relative;
  z-index: 1;
  margin: 0.62rem 0 0;
  color: #0b2735;
  font-family: var(--font-heading);
  font-size: clamp(1.45rem, 2.4vw, 2.25rem);
  font-weight: 400;
  letter-spacing: -0.055em;
  line-height: 0.98;
  text-wrap: balance;
}

.annotation-group {
  padding: clamp(1rem, 2.3vw, 1.45rem);
  display: grid;
  grid-template-columns: 2.3rem minmax(0, 1fr);
  gap: 0.85rem;
  min-height: 15rem;
  border-left: 2px solid rgba(145, 49, 43, 0.18);
  transition: border-color 0.24s ease;
}

.annotation-group:hover {
  border-left-color: rgba(145, 49, 43, 0.4);
}

.annotation-stamp {
  width: 2.1rem;
  height: 2.1rem;
  display: grid;
  place-items: center;
  border: 1px solid rgba(145, 49, 43, 0.72);
  color: rgba(145, 49, 43, 0.82);
  background: rgba(241, 235, 223, 0.58);
  font-family: var(--font-zh-display);
  font-size: 1rem;
  line-height: 1;
  transform: rotate(-8deg);
}

.annotation-copy {
  min-width: 0;
}

.annotation-copy h3 {
  margin: 0.45rem 0 0;
  color: #0b2735;
  font-family: var(--font-heading);
  font-size: 1.32rem;
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.05;
}

.annotation-note,
.annotation-empty {
  margin: 0.65rem 0 0;
  color: rgba(12, 40, 53, 0.72);
  font-size: 0.86rem;
  line-height: 1.55;
}

.annotation-list {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

.annotation-item {
  min-width: 0;
}

.annotation-link {
  position: relative;
  min-width: 0;
  padding: 0.72rem 0.8rem 0.72rem 1rem;
  display: grid;
  gap: 0.18rem;
  border-left: 2px solid rgba(145, 49, 43, 0.46);
  color: #102d3b;
  background: linear-gradient(90deg, rgba(242, 246, 240, 0.78), rgba(242, 246, 240, 0.28));
  text-decoration: none;
  transition: border-color 0.22s ease, color 0.22s ease, transform 0.22s ease, background-color 0.22s ease;
}

.annotation-link span {
  min-width: 0;
  overflow-wrap: break-word;
  word-break: normal;
  font-family: var(--font-heading);
  font-size: 1rem;
  line-height: 1.15;
}

.annotation-link small {
  color: rgba(16, 45, 59, 0.55);
  font-family: var(--font-zh-display);
  font-size: 0.9rem;
  line-height: 1;
}

.annotation-link em {
  color: rgba(145, 49, 43, 0.62);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  font-style: normal;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.annotation-link:hover,
.annotation-link:focus-visible {
  border-color: rgba(145, 49, 43, 0.88);
  color: #7d251e;
  background-color: rgba(247, 244, 235, 0.78);
  outline: none;
  transform: translateX(3px);
}

.annotation-link:focus-visible {
  outline: 2px solid rgba(145, 49, 43, 0.72);
  outline-offset: 0.18rem;
}

.annotation-link--ghost {
  color: rgba(16, 45, 59, 0.48);
}

.annotation-group--empty {
  opacity: 0.78;
}

@media (max-width: 1080px) {
  .annotation-groups-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .annotation-intro {
    min-height: auto;
  }
}

@media (max-width: 680px) {
  .annotation-groups-row {
    grid-template-columns: 1fr;
  }

  .manual-annotation-panel::before {
    top: 0;
    bottom: 0;
    left: 1rem;
    right: auto;
    width: 1px;
    height: auto;
    background: linear-gradient(to bottom, rgba(145, 49, 43, 0.38), rgba(28, 58, 70, 0.1), transparent);
    transform: none;
  }

  .annotation-intro,
  .annotation-group {
    margin-left: 1.35rem;
  }

  .annotation-group {
    min-height: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .annotation-link,
  .annotation-group {
    transition: none;
  }

  .annotation-link:hover,
  .annotation-link:focus-visible,
  .annotation-group:hover {
    transform: none;
  }
}
</style>
