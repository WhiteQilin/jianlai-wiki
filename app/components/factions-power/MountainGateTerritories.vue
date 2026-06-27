<script setup lang="ts">
import { sealGlyph, type SeatGroup, type FactionSummary } from './types'

/**
 * Mountain Gate Territories — seats of power as registered territory plates.
 * Grouped at the page level (by headquarters path). Territory names link to
 * their /world/* seat when routed; seat entries link to their faction route.
 */
const props = defineProps<{
  groups: SeatGroup[]
  existingPaths: string[]
}>()

const canOpen = (path: string) => props.existingPaths.includes(path)
</script>

<template>
  <section class="territories" aria-labelledby="territories-title">
    <header class="board-header">
      <p class="board-eyebrow">叁 · MOUNTAIN GATE TERRITORIES</p>
      <h2 id="territories-title" class="board-title zh-display">山门疆域</h2>
      <p class="board-blurb">
        Seats of power registered as territory plates, grouped by their mountain-gate and heaven. Each
        plate is a registered domain, not a list entry.
      </p>
    </header>

    <div class="territory-grid">
      <article
        v-for="group in groups"
        :key="group.raw"
        class="territory-plate"
        :class="{ 'is-unplaced': group.isUnplaced }"
      >
        <div class="territory-mark" aria-hidden="true">
          <span class="territory-count">{{ group.count }}</span>
        </div>
        <div class="territory-body">
          <div class="territory-nameline">
            <h3 class="territory-name zh-display">{{ group.chinese || group.label }}</h3>
            <NuxtLink
              v-if="group.seatPath"
              :to="group.seatPath"
              class="territory-link"
              :aria-label="`Open ${group.label} seat`"
            >{{ group.label }}</NuxtLink>
            <span v-else class="territory-link territory-link--ghost">{{ group.label }}</span>
          </div>
          <p class="territory-region" v-if="group.region && !group.isUnplaced">{{ group.region }}</p>

          <ul class="territory-seats">
            <li v-for="entry in group.entries" :key="entry.path" class="territory-seat">
              <span class="seat-glyph zh-display">{{ sealGlyph(entry as FactionSummary) }}</span>
              <NuxtLink
                v-if="canOpen(entry.path)"
                :to="entry.path"
                class="seat-name"
              >{{ entry.chinese || entry.title }}</NuxtLink>
              <span v-else class="seat-name seat-name--ghost">{{ entry.chinese || entry.title }}</span>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.territories { width: 100%; margin-top: clamp(4rem, 8vw, 7rem); }

.board-header { margin-bottom: clamp(2rem, 4vw, 3rem); max-width: 60ch; }
.board-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.3em;
  color: var(--pb-cinnabar);
  margin: 0 0 0.8rem;
}
.board-title {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0 0 0.8rem;
  color: var(--pb-ink);
}
.board-blurb { font-size: 0.98rem; line-height: 1.7; color: var(--pb-ink-wash); margin: 0; }

.territory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(0.8rem, 1.8vw, 1.4rem);
}
.territory-plate {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 1rem;
  padding: 1.2rem;
  background: linear-gradient(160deg, rgba(34, 29, 24, 0.85), rgba(21, 18, 14, 0.92));
  border: 1px solid var(--pb-line);
  transition: border-color 0.32s ease, box-shadow 0.32s ease;
}
.territory-plate:hover {
  border-color: color-mix(in srgb, var(--pb-jade) 50%, var(--pb-line));
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}
.territory-plate.is-unplaced { border-style: dashed; opacity: 0.7; }
.territory-plate.is-unplaced:hover { border-color: var(--pb-line); box-shadow: none; }

.territory-mark {
  position: relative;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--pb-jade) 70%, black 20%), var(--pb-jade-deep));
  border: 1px solid var(--pb-line);
}
.territory-plate.is-unplaced .territory-mark {
  background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--pb-ink-dim) 50%, black 30%), #2a2620);
}
.territory-mark::after {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid color-mix(in srgb, var(--pb-gold) 40%, transparent);
}
.territory-count {
  position: relative;
  z-index: 1;
  font-family: var(--font-heading);
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--pb-ink);
}

.territory-nameline {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.3rem 0.7rem;
}
.territory-name { font-size: 1.4rem; font-weight: 700; margin: 0; letter-spacing: 0.03em; color: var(--pb-ink); }
.territory-link {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 0.82rem;
  color: var(--pb-gold-bright);
  text-decoration: none;
  transition: color 0.24s ease;
}
.territory-link:hover { color: var(--pb-cinnabar); }
.territory-link--ghost { color: var(--pb-ink-dim); font-style: italic; }
.territory-link:focus-visible { outline: 2px solid var(--pb-cinnabar); outline-offset: 3px; }
.territory-region {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--pb-ink-dim);
  margin: 0.1rem 0 0.8rem;
}

.territory-seats { list-style: none; margin: 0.6rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.4rem; }
.territory-seat { display: flex; align-items: center; gap: 0.5rem; }
.seat-glyph {
  display: inline-grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.9rem;
  flex-shrink: 0;
  color: var(--pb-gold-bright);
  background: rgba(0,0,0,0.35);
  border: 1px solid var(--pb-line-soft);
}
.seat-name {
  font-size: 0.86rem;
  color: var(--pb-ink);
  line-height: 1.3;
  text-decoration: none;
  transition: color 0.24s ease;
}
.seat-name:hover { color: var(--pb-cinnabar); }
.seat-name--ghost { color: var(--pb-ink-dim); }
.seat-name:focus-visible { outline: 2px solid var(--pb-cinnabar); outline-offset: 3px; }

@media (max-width: 640px) {
  .territory-plate { grid-template-columns: 52px 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .territory-plate { transition: none; }
  .territory-plate:hover { box-shadow: none; }
}
</style>
