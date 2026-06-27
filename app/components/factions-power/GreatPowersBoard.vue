<script setup lang="ts">
import { computed } from 'vue'
import { sealGlyph, verificationGlyph, type FactionSummary } from './types'

/**
 * Great Powers Board — the visual core of 天下势力盘.
 * Re-tiered against the real distribution (8 primary / 4 major):
 *   - triad: top 3 primary powers (paramount)
 *   - inner orbit: primary ranks 4–6 (promoted from the old flat satellite band)
 *   - major lane: the 4 major powers (distinct "regional powers" tier)
 *   - satellite: only minor/background powers (currently empty → band disappears)
 *
 * Each tier is split into routed (linkable) + static arrays so the template
 * can use explicit <NuxtLink>/<article> pairs instead of dynamic `:is`,
 * which Nuxt's SSR custom-element handling does not resolve to an <a>.
 */
const props = defineProps<{
  triad: FactionSummary[]
  innerOrbit: FactionSummary[]
  majorPowers: FactionSummary[]
  satellites: FactionSummary[]
  existingPaths: string[]
}>()

const canOpen = (path: string) => props.existingPaths.includes(path)

type TriadItem = FactionSummary & { index: number; linked: boolean }
const split = (list: FactionSummary[]): TriadItem[] =>
  list.map((e, index) => ({ ...e, index, linked: canOpen(e.path) }))

const triadItems = computed(() => split(props.triad))
const innerOrbitItems = computed(() => split(props.innerOrbit))
const majorItems = computed(() => split(props.majorPowers))
const satelliteItems = computed(() => props.satellites.map((e) => ({ ...e, linked: canOpen(e.path) })))

const hasInnerOrbit = computed(() => props.innerOrbit.length > 0)
const hasMajors = computed(() => props.majorPowers.length > 0)
const hasSatellites = computed(() => props.satellites.length > 0)
</script>

<template>
  <section class="great-powers" aria-labelledby="great-powers-title">
    <header class="board-header">
      <p class="board-eyebrow">壹 · THE GREAT POWERS</p>
      <h2 id="great-powers-title" class="board-title zh-display">大势力盘</h2>
      <p class="board-blurb">
        The dominant forces of the world, anchored as political plates. Paramount powers hold the centre;
        primary seats orbit them; regional powers hold the lower field.
      </p>
    </header>

    <!-- central triad: the three paramount primary powers dominate -->
    <div class="triad-field">
      <div class="triad-trace" aria-hidden="true">
        <svg viewBox="0 0 1200 360" preserveAspectRatio="none" class="triad-svg">
          <path d="M 200 180 Q 600 60 1000 180" class="trace-path" />
          <path d="M 200 180 Q 600 300 1000 180" class="trace-path trace-path--alt" />
          <line x1="200" y1="180" x2="1000" y2="180" class="trace-axis" />
        </svg>
      </div>

      <template v-for="power in triadItems" :key="power.path">
        <NuxtLink
          v-if="power.linked"
          :to="power.path"
          class="power-plate is-linked"
          :class="[`plate-rank-${power.index + 1}`, power.importance ? `is-${power.importance}` : '']"
          :aria-label="power.title"
        >
          <div class="plate-seal zh-display">{{ sealGlyph(power) }}</div>
          <div class="plate-body">
            <div class="plate-rankline">
              <p class="plate-rank">No. {{ String(power.index + 1).padStart(2, '0') }}</p>
              <span
                v-if="power.verificationStatus"
                class="verify-glyph"
                :class="`verify-${verificationGlyph(power.verificationStatus).tone}`"
                :title="verificationGlyph(power.verificationStatus).label"
                :aria-label="verificationGlyph(power.verificationStatus).label"
              >{{ verificationGlyph(power.verificationStatus).char }}</span>
            </div>
            <h3 class="plate-title-zh zh-display">{{ power.chinese || power.title }}</h3>
            <p v-if="power.chinese" class="plate-title-en">{{ power.title }}</p>
            <div class="plate-meta">
              <span v-if="power.factionType || power.category" class="meta-tag">
                {{ power.factionType || power.category }}
              </span>
              <span v-if="power.status" class="meta-tag meta-tag--ghost">{{ power.status }}</span>
            </div>
            <p v-if="power.description" class="plate-influence">{{ power.description }}</p>
            <dl class="plate-ledger">
              <div v-if="power.headquarters" class="ledger-row">
                <dt>Seat</dt>
                <dd>{{ power.headquartersLink?.label || power.headquarters }}</dd>
              </div>
              <div v-if="power.leaderLinks.length" class="ledger-row">
                <dt>Head</dt>
                <dd>{{ power.leaderLinks.map((l) => l.label).join(' · ') }}</dd>
              </div>
            </dl>
          </div>
        </NuxtLink>
        <article
          v-else
          class="power-plate"
          :class="[`plate-rank-${power.index + 1}`, power.importance ? `is-${power.importance}` : '']"
        >
          <div class="plate-seal zh-display">{{ sealGlyph(power) }}</div>
          <div class="plate-body">
            <div class="plate-rankline">
              <p class="plate-rank">No. {{ String(power.index + 1).padStart(2, '0') }}</p>
              <span
                v-if="power.verificationStatus"
                class="verify-glyph"
                :class="`verify-${verificationGlyph(power.verificationStatus).tone}`"
                :title="verificationGlyph(power.verificationStatus).label"
                :aria-label="verificationGlyph(power.verificationStatus).label"
              >{{ verificationGlyph(power.verificationStatus).char }}</span>
            </div>
            <h3 class="plate-title-zh zh-display">{{ power.chinese || power.title }}</h3>
            <p v-if="power.chinese" class="plate-title-en">{{ power.title }}</p>
            <div class="plate-meta">
              <span v-if="power.factionType || power.category" class="meta-tag">
                {{ power.factionType || power.category }}
              </span>
              <span v-if="power.status" class="meta-tag meta-tag--ghost">{{ power.status }}</span>
            </div>
            <p v-if="power.description" class="plate-influence">{{ power.description }}</p>
            <dl class="plate-ledger">
              <div v-if="power.headquarters" class="ledger-row">
                <dt>Seat</dt>
                <dd>{{ power.headquartersLink?.label || power.headquarters }}</dd>
              </div>
              <div v-if="power.leaderLinks.length" class="ledger-row">
                <dt>Head</dt>
                <dd>{{ power.leaderLinks.map((l) => l.label).join(' · ') }}</dd>
              </div>
            </dl>
          </div>
        </article>
      </template>
    </div>

    <!-- inner orbit: primary powers ranks 4–6 — promoted to plate status -->
    <div v-if="hasInnerOrbit" class="orbit-field orbit-field--inner">
      <div class="orbit-thread" aria-hidden="true"></div>
      <p class="field-label">PRIMARY SEATS · INNER ORBIT</p>
      <div class="orbit-grid">
        <template v-for="power in innerOrbitItems" :key="power.path">
          <NuxtLink
            v-if="power.linked"
            :to="power.path"
            class="orbit-plate is-linked"
            :style="{ '--i': power.index }"
            :aria-label="power.title"
          >
            <span class="orbit-seal zh-display">{{ sealGlyph(power) }}</span>
            <h4 class="orbit-title-zh zh-display">{{ power.chinese || power.title }}</h4>
            <p class="orbit-title-en">{{ power.title }}</p>
            <p v-if="power.factionType || power.category" class="orbit-type">
              {{ power.factionType || power.category }}
            </p>
          </NuxtLink>
          <article v-else class="orbit-plate" :style="{ '--i': power.index }">
            <span class="orbit-seal zh-display">{{ sealGlyph(power) }}</span>
            <h4 class="orbit-title-zh zh-display">{{ power.chinese || power.title }}</h4>
            <p class="orbit-title-en">{{ power.title }}</p>
            <p v-if="power.factionType || power.category" class="orbit-type">
              {{ power.factionType || power.category }}
            </p>
          </article>
        </template>
      </div>
    </div>

    <!-- major lane: the 4 major powers — a distinct "regional powers" tier -->
    <div v-if="hasMajors" class="orbit-field orbit-field--major">
      <p class="field-label">REGIONAL POWERS · MAJOR SEATS</p>
      <div class="orbit-grid">
        <template v-for="power in majorItems" :key="power.path">
          <NuxtLink
            v-if="power.linked"
            :to="power.path"
            class="orbit-plate orbit-plate--major is-linked"
            :style="{ '--i': power.index }"
            :aria-label="power.title"
          >
            <span class="orbit-seal zh-display">{{ sealGlyph(power) }}</span>
            <h4 class="orbit-title-zh zh-display">{{ power.chinese || power.title }}</h4>
            <p class="orbit-title-en">{{ power.title }}</p>
            <p v-if="power.factionType || power.category" class="orbit-type">
              {{ power.factionType || power.category }}
            </p>
          </NuxtLink>
          <article v-else class="orbit-plate orbit-plate--major" :style="{ '--i': power.index }">
            <span class="orbit-seal zh-display">{{ sealGlyph(power) }}</span>
            <h4 class="orbit-title-zh zh-display">{{ power.chinese || power.title }}</h4>
            <p class="orbit-title-en">{{ power.title }}</p>
            <p v-if="power.factionType || power.category" class="orbit-type">
              {{ power.factionType || power.category }}
            </p>
          </article>
        </template>
      </div>
    </div>

    <!-- satellite band: only minor/background powers (disappears if none exist) -->
    <div v-if="hasSatellites" class="satellite-band">
      <p class="satellite-label">LESSER SEATS</p>
      <div class="satellite-row">
        <template v-for="power in satelliteItems" :key="power.path">
          <NuxtLink v-if="power.linked" :to="power.path" class="satellite-plate is-linked">
            <span class="satellite-seal zh-display">{{ sealGlyph(power) }}</span>
            <span class="satellite-name zh-display">{{ power.chinese || power.title }}</span>
          </NuxtLink>
          <span v-else class="satellite-plate">
            <span class="satellite-seal zh-display">{{ sealGlyph(power) }}</span>
            <span class="satellite-name zh-display">{{ power.chinese || power.title }}</span>
          </span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.great-powers { width: 100%; }

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

/* ----------------------------------------------- GREAT POWERS · TRIAD --- */
.triad-field {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(0.75rem, 1.6vw, 1.4rem);
  margin-bottom: clamp(1.6rem, 3vw, 2.4rem);
}
.triad-trace { position: absolute; inset: -8% -4%; pointer-events: none; z-index: 0; }
.triad-svg { width: 100%; height: 100%; overflow: visible; }
.trace-path {
  fill: none;
  stroke: var(--pb-gold);
  stroke-width: 1;
  stroke-dasharray: 2 6;
  opacity: 0.4;
}
.trace-path--alt { stroke: var(--pb-jade); opacity: 0.3; }
.trace-axis { stroke: var(--pb-line-soft); stroke-width: 1; }

.power-plate {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.2rem, 2vw, 1.8rem);
  background: linear-gradient(180deg, rgba(34, 29, 24, 0.96), rgba(21, 18, 14, 0.98));
  border: 1px solid var(--pb-line);
  min-height: 280px;
  text-decoration: none;
  color: inherit;
  animation: plate-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.32s ease, box-shadow 0.32s ease;
}
@keyframes plate-rise {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
.plate-rank-1 { animation-delay: 0.05s; }
.plate-rank-2 { animation-delay: 0.16s; }
.plate-rank-3 { animation-delay: 0.27s; }

.power-plate.is-linked { cursor: pointer; }
.power-plate.is-linked:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--pb-gold) 60%, var(--pb-line));
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.5);
}
.power-plate.is-linked:focus-visible {
  outline: 2px solid var(--pb-cinnabar);
  outline-offset: 3px;
}

.plate-seal {
  width: clamp(3.4rem, 5vw, 4.4rem);
  height: clamp(3.4rem, 5vw, 4.4rem);
  display: grid;
  place-items: center;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 700;
  color: var(--pb-ink);
  background: radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--pb-cinnabar) 86%, white 6%), var(--pb-cinnabar-deep));
  border: 2px solid color-mix(in srgb, var(--pb-gold) 60%, transparent);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 8px 30px rgba(0,0,0,0.45);
  transition: box-shadow 0.32s ease;
}
.power-plate.is-linked:hover .plate-seal {
  box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 10px 36px rgba(0,0,0,0.5), 0 0 28px 3px rgba(198,68,52,0.4);
}
.plate-rank-1 .plate-seal { animation: seal-pulse 3.6s ease-in-out infinite; }
@keyframes seal-pulse {
  0%, 100% { box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 8px 30px rgba(0,0,0,0.45), 0 0 0 0 rgba(198,68,52,0); }
  50%      { box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 10px 36px rgba(0,0,0,0.5), 0 0 26px 2px rgba(198,68,52,0.28); }
}

.plate-rankline { display: flex; align-items: center; gap: 0.6rem; }
.plate-rank {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.26em;
  color: var(--pb-gold);
  margin: 0;
}
.verify-glyph {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1;
  width: 1.1rem;
  height: 1.1rem;
  display: inline-grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid currentColor;
}
.verify-verified { color: var(--pb-jade); }
.verify-disputed { color: var(--pb-cinnabar); }
.verify-speculative { color: var(--pb-gold-bright); }
.verify-unknown { color: var(--pb-ink-dim); border-style: dashed; }

.plate-title-zh {
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  margin: 0;
  color: var(--pb-ink);
  line-height: 1.05;
}
.plate-title-en {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 0.96rem;
  color: var(--pb-ink-wash);
  margin: 0.2rem 0 0;
}
.plate-meta { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.6rem 0 0; }
.meta-tag {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  color: var(--pb-gold-bright);
  border: 1px solid var(--pb-line);
}
.meta-tag--ghost { color: var(--pb-ink-dim); border-color: var(--pb-line-soft); }

.plate-influence {
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--pb-ink-wash);
  margin: 0.4rem 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.plate-ledger { margin: auto 0 0; display: flex; flex-direction: column; gap: 0.35rem; }
.ledger-row {
  display: flex;
  gap: 0.6rem;
  font-size: 0.78rem;
  padding-top: 0.35rem;
  border-top: 1px solid var(--pb-line-soft);
}
.ledger-row dt {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--pb-ink-dim);
  width: 3.4rem;
  flex-shrink: 0;
  padding-top: 0.05rem;
}
.ledger-row dd { margin: 0; color: var(--pb-ink); }

/* -------------------------------------------------- ORBIT FIELDS ------- */
.orbit-field {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(0.7rem, 1.4vw, 1rem);
  padding: clamp(1.2rem, 2.4vw, 1.8rem);
  margin-bottom: clamp(1.2rem, 2.4vw, 1.8rem);
  border: 1px solid var(--pb-line-soft);
}
.orbit-field--inner {
  background:
    radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--pb-jade-deep) 40%, transparent), transparent 70%),
    rgba(21, 18, 14, 0.6);
}
.orbit-field--major {
  background: rgba(15, 13, 11, 0.5);
  border-top: 2px solid color-mix(in srgb, var(--pb-gold) 36%, transparent);
}
.orbit-thread {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, var(--pb-line) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity: 0.4;
  mask-image: radial-gradient(80% 60% at 50% 40%, black, transparent 75%);
}
.field-label {
  position: relative;
  z-index: 1;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.26em;
  color: var(--pb-gold);
  margin: 0;
}
.orbit-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: clamp(0.6rem, 1.4vw, 1.1rem);
}
.orbit-plate {
  padding: 1rem 0.9rem;
  background: linear-gradient(180deg, rgba(34, 29, 24, 0.7), rgba(26, 23, 20, 0.85));
  border-top: 2px solid var(--pb-jade);
  text-align: left;
  text-decoration: none;
  color: inherit;
  animation: orbit-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i) * 70ms);
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.28s ease, background 0.28s ease;
}
.orbit-plate--major { border-top-color: var(--pb-gold); }
@keyframes orbit-rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.orbit-plate.is-linked { cursor: pointer; }
.orbit-plate.is-linked:hover {
  transform: translateY(-3px);
  border-top-color: var(--pb-gold-bright);
  background: linear-gradient(180deg, rgba(44, 38, 30, 0.85), rgba(34, 29, 24, 0.92));
}
.orbit-plate.is-linked:focus-visible {
  outline: 2px solid var(--pb-cinnabar);
  outline-offset: 3px;
}
.orbit-seal {
  display: inline-grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.2rem;
  color: var(--pb-ink);
  background: color-mix(in srgb, var(--pb-jade-deep) 70%, black);
  border: 1px solid var(--pb-line);
  margin-bottom: 0.5rem;
}
.orbit-plate--major .orbit-seal { background: color-mix(in srgb, var(--pb-cinnabar-deep) 60%, black); }
.orbit-title-zh {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.03em;
  color: var(--pb-ink);
}
.orbit-title-en {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 0.78rem;
  color: var(--pb-ink-wash);
  margin: 0.1rem 0 0;
}
.orbit-type {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--pb-gold);
  margin: 0.5rem 0 0;
}

/* ----------------------------------------------------- SATELLITE BAND -- */
.satellite-band {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 1.4rem;
  border: 1px solid var(--pb-line-soft);
  background: rgba(26, 23, 20, 0.4);
}
.satellite-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  color: var(--pb-ink-dim);
  margin: 0;
}
.satellite-row { display: flex; flex-wrap: wrap; gap: 0.6rem 1.2rem; }
.satellite-plate {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.24s ease;
}
.satellite-plate.is-linked:hover { opacity: 1; }
.satellite-plate.is-linked:focus-visible { outline: 2px solid var(--pb-cinnabar); outline-offset: 3px; }
.satellite-seal {
  display: inline-grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  font-size: 1rem;
  color: var(--pb-gold-bright);
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--pb-line);
}
.satellite-name { font-size: 1.02rem; color: var(--pb-ink); letter-spacing: 0.03em; }

@media (max-width: 860px) {
  .triad-field { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .orbit-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (prefers-reduced-motion: reduce) {
  .power-plate, .orbit-plate { animation: none; transition: none; }
  .plate-rank-1 .plate-seal { animation: none; }
  .trace-path { stroke-dasharray: none; }
  .power-plate.is-linked:hover { transform: none; }
  .orbit-plate.is-linked:hover { transform: none; }
}
</style>
