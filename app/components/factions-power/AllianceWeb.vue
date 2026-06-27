<script setup lang="ts">
import { sealGlyph, type RelationLane } from './types'

/**
 * Alliance Web — relationship lanes.
 * HEADS / RANKS / AFFILIATED ties render as RouteDisplayLink nodes (route-guarded),
 * so unreachable entries degrade to ghost text automatically.
 */
defineProps<{
  lanes: RelationLane[]
  existingPaths: string[]
}>()
</script>

<template>
  <section class="relations" aria-labelledby="relations-title">
    <header class="board-header board-header--alt">
      <p class="board-eyebrow">贰 · ALLIANCE WEB</p>
      <h2 id="relations-title" class="board-title zh-display">势力连络</h2>
      <p class="board-blurb">
        Leader ties, member ranks and character affiliations woven as political lanes — the loyalties
        that bind each power to its people.
      </p>
    </header>

    <div class="relation-lanes">
      <article
        v-for="(lane, i) in lanes"
        :key="lane.faction.path"
        class="relation-lane"
        :style="{ '--lane-i': i }"
      >
        <div class="lane-head">
          <span class="lane-seal zh-display">{{ sealGlyph(lane.faction) }}</span>
          <div class="lane-head-text">
            <h3 class="lane-title zh-display">{{ lane.faction.chinese || lane.faction.title }}</h3>
            <p class="lane-sub">{{ lane.faction.title }}</p>
          </div>
          <span class="lane-count">{{ lane.total }}</span>
        </div>

        <div class="lane-web">
          <div v-if="lane.leaders.length" class="web-tie web-tie--leader">
            <span class="tie-label">HEADS</span>
            <div class="tie-roster">
              <RouteDisplayLink
                v-for="link in lane.leaders"
                :key="link.path"
                :item="link"
                variant="text"
                class="tie-node tie-node--lead"
              />
            </div>
          </div>
          <div v-if="lane.members.length" class="web-tie web-tie--member">
            <span class="tie-label">RANKS</span>
            <div class="tie-roster">
              <RouteDisplayLink
                v-for="link in lane.members.slice(0, 6)"
                :key="link.path"
                :item="link"
                variant="text"
                class="tie-node"
              />
              <span v-if="lane.members.length > 6" class="tie-node tie-node--more">
                +{{ lane.members.length - 6 }}
              </span>
            </div>
          </div>
          <div v-if="lane.affiliated.length" class="web-tie web-tie--affil">
            <span class="tie-label">AFFILIATED</span>
            <div class="tie-roster">
              <RouteDisplayLink
                v-for="link in lane.affiliated.slice(0, 5)"
                :key="link.path"
                :item="link"
                variant="text"
                class="tie-node tie-node--ghost"
              />
              <span v-if="lane.affiliated.length > 5" class="tie-node tie-node--more">
                +{{ lane.affiliated.length - 5 }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.relations { width: 100%; margin-top: clamp(4rem, 8vw, 7rem); }

.board-header { margin-bottom: clamp(2rem, 4vw, 3rem); max-width: 60ch; }
.board-header--alt { margin-left: auto; margin-right: 0; text-align: right; }
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

.relation-lanes { display: grid; gap: clamp(0.8rem, 1.6vw, 1.4rem); }
.relation-lane {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: clamp(1rem, 2vw, 1.8rem);
  padding: clamp(1.1rem, 2vw, 1.6rem);
  background: linear-gradient(90deg, rgba(34, 29, 24, 0.85), rgba(21, 18, 14, 0.7));
  border-left: 3px solid var(--pb-jade);
  animation: lane-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--lane-i) * 90ms);
  transition: background 0.32s ease, border-left-color 0.32s ease;
}
.relation-lane:hover {
  background: linear-gradient(90deg, rgba(44, 38, 30, 0.9), rgba(31, 26, 20, 0.8));
  border-left-color: var(--pb-gold-bright);
}
@keyframes lane-rise {
  from { opacity: 0; transform: translateX(-14px); }
  to   { opacity: 1; transform: translateX(0); }
}

.lane-head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  border-right: 1px solid var(--pb-line-soft);
  padding-right: 1rem;
}
.lane-seal {
  display: inline-grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  flex-shrink: 0;
  font-size: 1.4rem;
  color: var(--pb-ink);
  background: color-mix(in srgb, var(--pb-cinnabar-deep) 80%, black);
  border: 1px solid var(--pb-line);
}
.lane-head-text { flex: 1; min-width: 0; }
.lane-title { font-size: 1.3rem; font-weight: 700; margin: 0; letter-spacing: 0.03em; color: var(--pb-ink); }
.lane-sub {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 0.76rem;
  color: var(--pb-ink-wash);
  margin: 0.1rem 0 0;
}
.lane-count {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--pb-gold-bright);
}

.lane-web { display: flex; flex-direction: column; gap: 0.8rem; min-width: 0; }
.web-tie { display: grid; grid-template-columns: 86px 1fr; gap: 0.8rem; align-items: start; }
.tie-label {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--pb-ink-dim);
  padding-top: 0.35rem;
}
.tie-roster { display: flex; flex-wrap: wrap; gap: 0.4rem; }
/* tie-node styling lives here because RouteDisplayLink renders our class on its own element */
.tie-node {
  font-size: 0.78rem;
  padding: 0.28rem 0.6rem;
  color: var(--pb-ink);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--pb-line-soft);
  line-height: 1.2;
  text-decoration: none;
  transition: border-color 0.24s ease, color 0.24s ease;
}
.tie-node:focus-visible { outline: 2px solid var(--pb-cinnabar); outline-offset: 3px; }
.tie-node--lead {
  color: var(--pb-gold-bright);
  border-color: color-mix(in srgb, var(--pb-gold) 50%, transparent);
  background: color-mix(in srgb, var(--pb-gold) 8%, transparent);
}
.tie-node--lead:hover {
  color: var(--pb-ink);
  border-color: var(--pb-cinnabar);
}
.tie-node--ghost { color: var(--pb-ink-dim); border-style: dashed; }
.tie-node--more {
  color: var(--pb-ink-dim);
  background: transparent;
  border-style: dotted;
}

@media (max-width: 860px) {
  .relation-lane { grid-template-columns: 1fr; }
  .lane-head { border-right: 0; border-bottom: 1px solid var(--pb-line-soft); padding-right: 0; padding-bottom: 0.9rem; }
  .board-header--alt { text-align: left; margin-left: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .relation-lane { animation: none; transition: none; }
}
</style>
