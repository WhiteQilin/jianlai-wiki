<script setup lang="ts">
import { ref, computed } from 'vue'

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

function selectGroup(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <div class="chronicle-rail-container">
    <!-- Active Event Preview (Macro/Arc view + Micro events list) -->
    <div class="event-preview-area" v-if="activeGroup">
      <div class="preview-content">
        <span class="preview-era">{{ activeGroup.era }}</span>
        <h3 class="preview-title">{{ activeGroup.title }}</h3>
        <p class="preview-summary">{{ activeGroup.summary }}</p>
        <div class="preview-characters" v-if="activeGroup.characters && activeGroup.characters.length">
          <span class="char-tag" v-for="char in activeGroup.characters" :key="char">{{ char }}</span>
        </div>
        <NuxtLink v-if="activeGroup.link" :to="activeGroup.link" class="preview-link">
          Explore Era Record <span class="arrow">→</span>
        </NuxtLink>
      </div>

      <!-- Micro-chronicle sub-rail/ledger for the active macro arc -->
      <div class="micro-events-ledger" v-if="activeGroup.events.length > 1">
        <h4 class="ledger-title">Arc Records</h4>
        <div class="ledger-list">
          <NuxtLink 
            v-for="event in activeGroup.events" 
            :key="event.link" 
            :to="event.link" 
            class="ledger-item"
          >
            <span class="ledger-marker"></span>
            <div class="ledger-details">
              <span class="ledger-event-title">{{ event.title }}</span>
              <span class="ledger-event-chinese" v-if="event.chinese">{{ event.chinese }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Horizontal Macro Rail -->
    <div class="rail-wrapper">
      <div class="rail-track"></div>
      <div class="rail-nodes">
        <button 
          v-for="(group, index) in eraGroups" 
          :key="index"
          class="rail-node"
          :class="{ 'is-active': activeIndex === index }"
          @click="selectGroup(index)"
          @mouseenter="selectGroup(index)"
          :aria-label="`View era: ${group.era}`"
          :aria-current="activeIndex === index ? 'step' : undefined"
        >
          <span class="node-dot"></span>
          <span class="node-label">{{ group.era }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chronicle-rail-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  position: relative;
  z-index: 10; /* Above ambient layers */
}

/* Preview Area */
.event-preview-area {
  min-height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 4rem;
  padding: 0 2rem;
}

.preview-content {
  flex: 1;
  max-width: 600px;
  animation: fadeIn 0.4s ease-out;
}

/* Micro Ledger */
.micro-events-ledger {
  flex: 0 0 350px;
  background: linear-gradient(180deg, rgba(10,10,10,0.8) 0%, rgba(5,5,5,0.6) 100%);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-left: 2px solid rgba(212, 175, 55, 0.5);
  padding: 1.5rem;
  animation: fadeIn 0.5s ease-out;
  max-height: 280px;
  overflow-y: auto;
  
  /* Scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(212, 175, 55, 0.3) transparent;
}

.micro-events-ledger::-webkit-scrollbar {
  width: 4px;
}
.micro-events-ledger::-webkit-scrollbar-track {
  background: transparent;
}
.micro-events-ledger::-webkit-scrollbar-thumb {
  background-color: rgba(212, 175, 55, 0.3);
}

.ledger-title {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0 0 1.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 0.5rem;
}

.ledger-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ledger-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-decoration: none;
  group: ledger-hover;
}

.ledger-marker {
  width: 6px;
  height: 6px;
  margin-top: 6px;
  background: rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.ledger-item:hover .ledger-marker {
  background: #d4af37;
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
}

.ledger-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ledger-event-title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.ledger-item:hover .ledger-event-title {
  color: #fff;
}

.ledger-event-chinese {
  color: rgba(212, 175, 55, 0.6);
  font-size: 0.8rem;
}

.preview-era {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--c-gold, #d4af37);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  display: block;
  margin-bottom: 0.75rem;
  opacity: 0.9;
}

.preview-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: #ffffff; /* Explicit white for dark cinematic background */
  margin: 0 0 1rem 0;
  line-height: 1.1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.preview-summary {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.preview-characters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.char-tag {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}

.preview-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--c-seal-red, #ba2626);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
}

.preview-link:hover {
  color: #ff4d4d;
}

.preview-link .arrow {
  transition: transform 0.3s ease;
}

.preview-link:hover .arrow {
  transform: translateX(4px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Horizontal Rail */
.rail-wrapper {
  position: relative;
  padding: 3rem 0;
  overflow-x: auto;
  /* Hide scrollbar for cleaner look */
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* Add subtle fade at edges to indicate scroll */
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}
.rail-wrapper::-webkit-scrollbar {
  display: none;
}

.rail-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4) 10%, rgba(212, 175, 55, 0.4) 90%, transparent);
  transform: translateY(-50%);
  pointer-events: none;
}

.rail-nodes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: max-content;
  padding: 0 4rem;
  gap: 4rem; /* Ensure nodes don't bunch up too much */
}

.rail-node {
  background: none;
  border: none;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

/* Add vertical tick marks to the rail line at node positions */
.rail-node::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1px;
  height: 24px;
  background: rgba(212, 175, 55, 0.2);
  z-index: -1;
  transition: background 0.3s ease, height 0.3s ease;
}

.rail-node:hover::before {
  background: rgba(212, 175, 55, 0.5);
  height: 32px;
}

.rail-node.is-active::before {
  background: rgba(212, 175, 55, 0.8);
  height: 40px;
}

.rail-node:hover {
  transform: translateY(-2px);
}

.node-dot {
  width: 10px;
  height: 10px;
  background: #111;
  border: 2px solid rgba(212, 175, 55, 0.5); /* Dim gold */
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 0 0 rgba(212, 175, 55, 0);
}

.rail-node:hover .node-dot {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.2);
}

.rail-node.is-active .node-dot {
  width: 14px;
  height: 14px;
  background: #d4af37;
  border-color: #d4af37;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
}

.node-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.rail-node:hover .node-label {
  color: rgba(255, 255, 255, 0.7);
}

.rail-node.is-active .node-label {
  color: #d4af37;
  font-weight: 500;
}

@media (max-width: 768px) {
  .event-preview-area {
    flex-direction: column;
    align-items: flex-start;
  }
  .micro-events-ledger {
    flex: none;
    width: 100%;
  }
  .preview-title {
    font-size: 2rem;
  }
  .rail-nodes {
    padding: 0 2rem;
    gap: 2.5rem;
  }
}
</style>
