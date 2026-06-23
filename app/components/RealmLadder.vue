<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

type RealmEntry = {
  title?: string
  chinese?: string
  description?: string
  realmRange?: string
  verificationStatus?: string
  path?: string
  link?: string
}

const props = defineProps<{
  realms: RealmEntry[]
}>()

const nuxtLink = resolveComponent('NuxtLink')

const rangeStart = (range?: string) => {
  const match = `${range || ''}`.match(/\d+/)
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER
}

const sortedRealms = computed(() =>
  [...props.realms].sort((a, b) => rangeStart(a.realmRange) - rangeStart(b.realmRange)),
)

const entryLink = (realm: RealmEntry) => realm.path || realm.link || ''
const formatStatus = (status?: string) => status?.replace(/-/g, ' ') || ''
</script>

<template>
  <section class="realm-ladder-section" aria-labelledby="qi-refiner-realm-ladder">
    <div class="ladder-heading">
      <span class="section-kicker">Realm grouping</span>
      <h2 id="qi-refiner-realm-ladder">Qi Refiner Realm Ladder</h2>
      <UiBrushUnderline tone="section" weight="bold" width="long" />
      <p>
        These entries describe the grouped Qi Refiner ladder and should not be read as Pure Martial Artist progression.
      </p>
    </div>

    <div v-if="sortedRealms.length" class="ladder-shell">
      <div class="ascent-label" aria-hidden="true">ascent</div>
      <ol class="realm-ladder">
        <li v-for="(realm, index) in sortedRealms" :key="realm.path || realm.title" class="realm-step">
          <span class="step-marker" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <component
            :is="entryLink(realm) ? nuxtLink : 'article'"
            :to="entryLink(realm) || undefined"
            class="realm-card"
          >
            <div class="realm-meta">
              <span class="realm-range">{{ realm.realmRange ? `Realms ${realm.realmRange}` : 'Realm group' }}</span>
              <span v-if="realm.verificationStatus" class="realm-status">{{ formatStatus(realm.verificationStatus) }}</span>
            </div>
            <div class="realm-header">
              <h3 class="realm-name">{{ realm.title }}</h3>
              <span v-if="realm.chinese" class="realm-zh">{{ realm.chinese }}</span>
            </div>
            <p v-if="realm.description" class="realm-desc">{{ realm.description }}</p>
            <span v-if="entryLink(realm)" class="realm-link-cue">Read grouped entry</span>
          </component>
        </li>
      </ol>
    </div>

    <p v-else class="ladder-empty">No realm grouping entries are available yet.</p>
  </section>
</template>

<style scoped>
.realm-ladder-section {
  margin: 0 0 5rem;
}

.ladder-heading {
  max-width: 48rem;
  margin-bottom: 1.6rem;
}

.section-kicker {
  display: block;
  margin-bottom: 0.55rem;
  color: var(--c-seal-red);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

.ladder-heading h2 {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 0;
}

.ladder-heading :deep(.brush-underline) {
  display: block;
  width: 7.5rem;
  height: 0.5rem;
  margin-top: 0.5rem;
}

.ladder-heading p {
  margin: 0.8rem 0 0;
  color: var(--c-text-2);
  font-size: 1rem;
  line-height: 1.7;
}

.ladder-shell {
  position: relative;
  overflow: hidden;
  padding: 2rem 2rem 2.25rem;
  border: 1px solid color-mix(in srgb, var(--c-bronze) 28%, transparent);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-paper-alt) 82%, transparent), color-mix(in srgb, var(--c-mist-light) 86%, transparent)),
    var(--c-paper);
}

.ladder-shell::before {
  content: '';
  position: absolute;
  top: 3rem;
  bottom: 3rem;
  left: 4.2rem;
  width: 1px;
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--c-bronze) 70%, transparent), transparent);
}

.ladder-shell::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(135deg, transparent 0 48%, color-mix(in srgb, var(--c-bronze) 7%, transparent) 48% 52%, transparent 52% 100%);
  background-size: 42px 42px;
  opacity: 0.35;
  pointer-events: none;
}

.ascent-label {
  position: absolute;
  top: 1.15rem;
  right: 1.4rem;
  color: color-mix(in srgb, var(--c-bronze) 72%, transparent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

.realm-ladder {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1rem;
  max-width: 58rem;
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

.realm-step {
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  min-width: 0;
}

.realm-step:nth-child(2) {
  margin-left: 2.2rem;
}

.realm-step:nth-child(3) {
  margin-left: 4.4rem;
}

.step-marker {
  width: 3.4rem;
  height: 3.4rem;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--c-bronze) 56%, transparent);
  background: color-mix(in srgb, var(--c-paper-alt) 88%, transparent);
  color: var(--c-bronze);
  font-family: var(--font-heading);
  font-size: 1.05rem;
  line-height: 1;
  box-shadow: 0 0 0 0.35rem color-mix(in srgb, var(--c-paper) 78%, transparent);
}

.realm-card {
  min-width: 0;
  display: block;
  padding: 1.25rem 1.35rem;
  border: 1px solid color-mix(in srgb, var(--c-ink) 11%, transparent);
  border-left: 3px solid color-mix(in srgb, var(--c-bronze) 62%, transparent);
  border-radius: 6px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--c-bronze) 5%, transparent), transparent 34%),
    color-mix(in srgb, var(--c-paper-alt) 88%, transparent);
  color: inherit;
  text-decoration: none;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.realm-card:hover {
  transform: translateX(0.25rem);
  border-color: color-mix(in srgb, var(--c-seal-red) 44%, var(--c-border));
  border-left-color: var(--c-seal-red);
  box-shadow: 0 16px 36px color-mix(in srgb, var(--c-bronze) 12%, transparent);
}

.realm-card:focus-visible {
  outline: 2px solid var(--c-seal-red);
  outline-offset: 4px;
}

.realm-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  align-items: center;
  margin-bottom: 0.8rem;
}

.realm-range,
.realm-status {
  color: var(--c-bronze);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

.realm-status {
  color: var(--c-text-3);
}

.realm-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 0.85rem;
  align-items: baseline;
}

.realm-name {
  margin: 0;
  color: var(--c-ink);
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: 0;
  overflow-wrap: anywhere;
}

.realm-zh {
  color: var(--c-text-3);
  font-size: 0.98rem;
  overflow-wrap: anywhere;
}

.realm-desc {
  margin: 0.65rem 0 0;
  color: var(--c-text-2);
  font-size: 0.96rem;
  line-height: 1.72;
  overflow-wrap: anywhere;
}

.realm-link-cue {
  display: inline-block;
  margin-top: 0.9rem;
  color: var(--c-seal-red);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

.ladder-empty {
  margin: 0;
  padding: 1rem;
  border: 1px solid var(--c-border);
  color: var(--c-text-2);
  background: var(--c-bg-soft);
}

@media (max-width: 760px) {
  .realm-ladder-section {
    margin-bottom: 3.5rem;
  }

  .ladder-heading h2 {
    font-size: 1.55rem;
  }

  .ladder-shell {
    padding: 1.2rem;
  }

  .ladder-shell::before {
    left: 2.65rem;
  }

  .ascent-label {
    display: none;
  }

  .realm-step,
  .realm-step:nth-child(2),
  .realm-step:nth-child(3) {
    grid-template-columns: 2.9rem minmax(0, 1fr);
    gap: 0.75rem;
    margin-left: 0;
  }

  .step-marker {
    width: 2.55rem;
    height: 2.55rem;
    font-size: 0.9rem;
  }

  .realm-card {
    padding: 1rem;
  }

  .realm-name {
    font-size: 1.2rem;
  }
}
</style>
