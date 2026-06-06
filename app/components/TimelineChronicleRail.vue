<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  events: Array<{
    title: string
    era: string
    summary: string
    characters?: string[]
    link?: string
    image?: string
  }>
}>()

const activeIndex = ref(0)
const activeEvent = computed(() => props.events[activeIndex.value] || null)

function selectEvent(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <div class="chronicle-rail-container">
    <!-- Active Event Preview -->
    <div class="event-preview-area" v-if="activeEvent">
      <div class="preview-content">
        <span class="preview-era">{{ activeEvent.era }}</span>
        <h3 class="preview-title">{{ activeEvent.title }}</h3>
        <p class="preview-summary">{{ activeEvent.summary }}</p>
        <div class="preview-characters" v-if="activeEvent.characters && activeEvent.characters.length">
          <span class="char-tag" v-for="char in activeEvent.characters" :key="char">{{ char }}</span>
        </div>
        <NuxtLink v-if="activeEvent.link" :to="activeEvent.link" class="preview-link">
          Explore Record <span class="arrow">→</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Horizontal Rail -->
    <div class="rail-wrapper">
      <div class="rail-track"></div>
      <div class="rail-nodes">
        <button 
          v-for="(event, index) in events" 
          :key="index"
          class="rail-node"
          :class="{ 'is-active': activeIndex === index }"
          @click="selectEvent(index)"
          @mouseenter="selectEvent(index)"
          :aria-label="`View event: ${event.title}`"
          :aria-current="activeIndex === index ? 'step' : undefined"
        >
          <span class="node-dot"></span>
          <span class="node-label">{{ event.era }}</span>
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
  padding: 0 2rem;
}

.preview-content {
  max-width: 600px;
  animation: fadeIn 0.4s ease-out;
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

/* Glowing segment connecting active nodes could be added via JS, but we'll use a pseudo-element on the active node for now */

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
  .preview-title {
    font-size: 2rem;
  }
  .rail-nodes {
    padding: 0 2rem;
    gap: 2.5rem;
  }
}
</style>
