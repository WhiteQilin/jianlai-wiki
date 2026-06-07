<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  eraGroups: Array<{
    era: string
    title: string
    summary: string
    characters?: string[]
    link?: string
    events: Array<{
      title: string
      chinese?: string
      summary: string
      link?: string
      eraOrder: number
    }>
  }>
}>()

const activeIndex = ref(0)
const activeGroup = computed(() => props.eraGroups[activeIndex.value] || null)

const RAIL_LABELS: Record<string, string> = {
  'Ancient Era': 'Ancient Era',
  'Middle Era': 'Middle Era',
  'Lizhu Grotto-Heaven Arc': 'Lizhu Arc',
  'Sword Qi Great Wall Defense Arc': 'Sword Qi Wall',
  'Sword Qi Great Wall Arc': 'Sword Qi Wall',
  'Wild World Invasion Arc': 'Wild Invasion',
  'Counter-Offensive & New Heaven Arc': 'Counter-Offensive',
  'Counter-Offensive and New Heaven Arc': 'Counter-Offensive',
}

function railLabel(era: string) {
  return RAIL_LABELS[era] || era.replace(/\s+Arc$/i, '')
}

function recordOrder(index: number) {
  return String(index + 1).padStart(2, '0')
}

function selectGroup(index: number) {
  if (index < 0 || index >= props.eraGroups.length) return
  activeIndex.value = index
}

watch(() => props.eraGroups.length, (length) => {
  if (activeIndex.value >= length) {
    activeIndex.value = Math.max(0, length - 1)
  }
})
</script>

<template>
  <div class="chronicle-rail-container">
    <div v-if="activeGroup" class="event-preview-area">
      <div class="preview-content">
        <span class="preview-era">{{ activeGroup.era }}</span>
        <h3 class="preview-title">{{ activeGroup.title }}</h3>
        <p class="preview-summary">{{ activeGroup.summary }}</p>
        <div v-if="activeGroup.characters && activeGroup.characters.length" class="preview-characters">
          <span v-for="char in activeGroup.characters" :key="char" class="char-tag">{{ char }}</span>
        </div>
        <NuxtLink v-if="activeGroup.link" :to="activeGroup.link" class="preview-link">
          Explore Era Record <span class="arrow">&rarr;</span>
        </NuxtLink>
      </div>

      <div v-if="activeGroup.events.length" class="micro-events-ledger">
        <div class="ledger-heading">
          <h4 class="ledger-title">Arc Records</h4>
          <span class="ledger-count">{{ activeGroup.events.length }} entries</span>
        </div>
        <div class="ledger-list" :aria-label="`${activeGroup.era} event records`">
          <NuxtLink
            v-for="(event, eventIndex) in activeGroup.events"
            :key="event.link || event.title"
            :to="event.link"
            class="ledger-item"
            :title="event.title"
          >
            <span class="ledger-index">{{ recordOrder(eventIndex) }}</span>
            <div class="ledger-details">
              <span class="ledger-event-title">{{ event.title }}</span>
              <span v-if="event.chinese" class="ledger-event-chinese">{{ event.chinese }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="rail-wrapper">
      <div class="rail-track"></div>
      <div class="rail-nodes" role="tablist" aria-label="Timeline macro arcs">
        <button
          v-for="(group, index) in eraGroups"
          :key="group.era"
          class="rail-node"
          :class="{ 'is-active': activeIndex === index }"
          :aria-label="`View era: ${group.era}`"
          :aria-current="activeIndex === index ? 'step' : undefined"
          :aria-selected="activeIndex === index"
          :title="group.era"
          role="tab"
          type="button"
          @click="selectGroup(index)"
          @mouseenter="selectGroup(index)"
        >
          <span class="node-dot"></span>
          <span class="node-label">{{ railLabel(group.era) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chronicle-rail-container {
  --rail-gold: #d4af37;
  --rail-gold-soft: rgba(212, 175, 55, 0.18);
  width: 100%;
  min-width: 0;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(1.75rem, 4vh, 3.25rem);
  position: relative;
  z-index: 10;
}

.event-preview-area {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 410px);
  align-items: end;
  gap: clamp(2rem, 5vw, 4.5rem);
  padding: 0 clamp(0.75rem, 2vw, 2rem);
}

.preview-content {
  min-width: 0;
  max-width: 660px;
  animation: fadeIn 0.4s ease-out;
}

.preview-era {
  display: block;
  margin-bottom: 0.7rem;
  color: var(--rail-gold);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.preview-title {
  margin: 0 0 0.9rem;
  color: #fff;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 3vw, 2.85rem);
  line-height: 1.08;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.72);
  text-wrap: balance;
}

.preview-summary {
  max-width: 62ch;
  margin: 0 0 1.35rem;
  color: rgba(255, 255, 255, 0.78);
  font-size: clamp(0.98rem, 1vw, 1.08rem);
  line-height: 1.68;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.72);
  text-wrap: pretty;
}

.preview-characters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.35rem;
}

.char-tag {
  padding: 0.26rem 0.65rem;
  color: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(212, 175, 55, 0.18);
  background: rgba(5, 5, 5, 0.46);
  border-radius: 999px;
  backdrop-filter: blur(6px);
  font-size: 0.73rem;
}

.preview-link {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: #e0c46d;
  border-bottom: 1px solid rgba(212, 175, 55, 0.32);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.24s ease, border-color 0.24s ease;
}

.preview-link:hover,
.preview-link:focus-visible {
  color: #fff1b3;
  border-color: rgba(255, 241, 179, 0.7);
}

.preview-link .arrow {
  transition: transform 0.24s ease;
}

.preview-link:hover .arrow,
.preview-link:focus-visible .arrow {
  transform: translateX(4px);
}

.micro-events-ledger {
  position: relative;
  overflow-y: auto;
  max-height: min(300px, 34dvh);
  padding: 1rem;
  border: 1px solid rgba(212, 175, 55, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(22, 18, 10, 0.86), rgba(5, 5, 5, 0.74)),
    radial-gradient(circle at 18% 0%, rgba(212, 175, 55, 0.12), transparent 15rem);
  box-shadow:
    inset 0 1px 0 rgba(255, 242, 184, 0.08),
    inset 0 0 36px rgba(212, 175, 55, 0.06),
    0 16px 42px rgba(0, 0, 0, 0.36);
  scrollbar-width: thin;
  scrollbar-color: rgba(212, 175, 55, 0.42) rgba(255, 255, 255, 0.04);
  animation: fadeIn 0.5s ease-out;
}

.micro-events-ledger::before {
  content: '';
  position: sticky;
  top: -1rem;
  display: block;
  height: 1px;
  margin: -1rem -1rem 0.8rem;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.62), transparent);
}

.micro-events-ledger::-webkit-scrollbar {
  width: 5px;
}

.micro-events-ledger::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.04);
}

.micro-events-ledger::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.42);
  border-radius: 999px;
}

.ledger-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.ledger-title,
.ledger-count {
  font-family: var(--font-mono);
  text-transform: uppercase;
}

.ledger-title {
  margin: 0;
  color: rgba(255, 241, 179, 0.88);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
}

.ledger-count {
  color: rgba(255, 255, 255, 0.46);
  font-size: 0.64rem;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.ledger-list {
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
}

.ledger-item {
  display: grid;
  grid-template-columns: 2.4rem minmax(0, 1fr);
  gap: 0.85rem;
  align-items: start;
  min-height: 3.1rem;
  padding: 0.62rem 0.68rem;
  color: inherit;
  border: 1px solid transparent;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.22s ease, border-color 0.22s ease, transform 0.22s ease;
}

.ledger-item:hover,
.ledger-item:focus-visible {
  border-color: rgba(212, 175, 55, 0.28);
  background: rgba(212, 175, 55, 0.09);
  transform: translateX(2px);
  outline: none;
}

.ledger-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.5rem;
  color: rgba(212, 175, 55, 0.72);
  border-right: 1px solid rgba(212, 175, 55, 0.22);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
}

.ledger-details {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.16rem;
}

.ledger-event-title {
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.9rem;
  line-height: 1.32;
  transition: color 0.22s ease;
}

.ledger-item:hover .ledger-event-title,
.ledger-item:focus-visible .ledger-event-title {
  color: #fff;
}

.ledger-event-chinese {
  color: rgba(212, 175, 55, 0.64);
  font-family: var(--font-heading);
  font-size: 0.78rem;
  line-height: 1.25;
}

.rail-wrapper {
  position: relative;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  padding: 0.35rem 0 1rem;
  mask-image: linear-gradient(to right, transparent, black 3.5rem, black calc(100% - 3.5rem), transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 3.5rem, black calc(100% - 3.5rem), transparent);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.rail-wrapper::-webkit-scrollbar {
  display: none;
}

.rail-track {
  position: absolute;
  top: 0.83rem;
  left: 3.75rem;
  right: 3.75rem;
  height: 14px;
  pointer-events: none;
  border-radius: 999px;
  background:
    linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.22) 6%, rgba(212, 175, 55, 0.42) 50%, rgba(212, 175, 55, 0.22) 94%, transparent),
    linear-gradient(180deg, transparent 0 39%, rgba(255, 238, 166, 0.74) 40% 58%, transparent 59% 100%);
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.18));
}

.rail-track::before,
.rail-track::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
}

.rail-track::before {
  top: 6px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 244, 194, 0.52), rgba(212, 175, 55, 0.86), rgba(255, 244, 194, 0.52), transparent);
}

.rail-track::after {
  top: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(90deg, transparent 0 5.9rem, rgba(212, 175, 55, 0.26) 5.9rem 5.96rem);
  opacity: 0.5;
}

.rail-nodes {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-width: max-content;
  padding: 0 3.25rem;
  gap: clamp(1.5rem, 4.8vw, 4.5rem);
}

.rail-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: clamp(6.5rem, 8vw, 8.75rem);
  padding: 0;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
  transition: transform 0.24s ease;
}

.rail-node::before {
  content: '';
  position: absolute;
  top: 0.06rem;
  left: 50%;
  z-index: -1;
  width: 1px;
  height: 1.65rem;
  background: linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.32), transparent);
  transform: translateX(-50%);
  transition: height 0.24s ease, background 0.24s ease;
}

.rail-node:hover,
.rail-node:focus-visible {
  transform: translateY(-2px);
  outline: none;
}

.rail-node:focus-visible .node-label {
  outline: 1px solid rgba(212, 175, 55, 0.58);
  outline-offset: 0.35rem;
}

.rail-node:hover::before,
.rail-node:focus-visible::before {
  height: 2.2rem;
  background: linear-gradient(to bottom, transparent, rgba(255, 235, 163, 0.72), transparent);
}

.rail-node.is-active::before {
  height: 2.55rem;
  background: linear-gradient(to bottom, transparent, rgba(255, 235, 163, 0.9), rgba(184, 42, 42, 0.42), transparent);
}

.node-dot {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(212, 175, 55, 0.55);
  border-radius: 50%;
  background: #080807;
  box-shadow:
    0 0 0 4px rgba(5, 5, 5, 0.8),
    0 0 0 0 rgba(212, 175, 55, 0);
  transition: background 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease, transform 0.24s ease;
}

.rail-node:hover .node-dot,
.rail-node:focus-visible .node-dot {
  border-color: #f1d47b;
  background: rgba(212, 175, 55, 0.24);
  box-shadow:
    0 0 0 4px rgba(5, 5, 5, 0.82),
    0 0 18px rgba(212, 175, 55, 0.42);
}

.rail-node.is-active .node-dot {
  border-color: #fff1b3;
  background: var(--rail-gold);
  transform: scale(1.28);
  box-shadow:
    0 0 0 5px rgba(5, 5, 5, 0.86),
    0 0 0 8px rgba(212, 175, 55, 0.13),
    0 0 28px rgba(212, 175, 55, 0.66);
}

.node-label {
  max-width: 9.25rem;
  color: rgba(255, 255, 255, 0.52);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.09em;
  line-height: 1.3;
  text-align: center;
  text-transform: uppercase;
  text-wrap: balance;
  transition: color 0.24s ease, text-shadow 0.24s ease;
}

.rail-node:hover .node-label,
.rail-node:focus-visible .node-label {
  color: rgba(255, 255, 255, 0.82);
}

.rail-node.is-active .node-label {
  color: #f0d27a;
  text-shadow: 0 0 16px rgba(212, 175, 55, 0.36);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .event-preview-area {
    grid-template-columns: 1fr;
    align-items: start;
    gap: 1.25rem;
  }

  .micro-events-ledger {
    width: 100%;
    max-height: min(260px, 32dvh);
  }
}

@media (max-width: 768px) {
  .chronicle-rail-container {
    gap: 1.55rem;
  }

  .event-preview-area {
    padding: 0 0.2rem;
  }

  .preview-title {
    font-size: clamp(1.75rem, 8vw, 2.2rem);
  }

  .preview-content {
    max-width: 100%;
  }

  .preview-summary {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  }

  .rail-wrapper {
    margin-inline: -1rem;
    padding-bottom: 0.75rem;
    mask-image: linear-gradient(to right, transparent, black 1.25rem, black calc(100% - 1.25rem), transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 1.25rem, black calc(100% - 1.25rem), transparent);
    scrollbar-width: thin;
    scrollbar-color: rgba(212, 175, 55, 0.36) transparent;
  }

  .rail-wrapper::-webkit-scrollbar {
    display: block;
    height: 4px;
  }

  .rail-wrapper::-webkit-scrollbar-thumb {
    background: rgba(212, 175, 55, 0.36);
    border-radius: 999px;
  }

  .rail-track {
    left: 1.6rem;
    right: 1.6rem;
  }

  .rail-nodes {
    justify-content: flex-start;
    padding: 0 1.45rem;
    gap: 1rem;
  }

  .rail-node {
    width: 6.6rem;
  }

  .node-label {
    font-size: 0.64rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .preview-content,
  .micro-events-ledger {
    animation: none;
  }

  .preview-link,
  .preview-link .arrow,
  .ledger-item,
  .rail-node,
  .rail-node::before,
  .node-dot,
  .node-label {
    transition: none;
  }
}
</style>
