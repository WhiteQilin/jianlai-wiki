<script setup lang="ts">
defineProps<{
  events: Array<{
    title: string
    era: string
    summary: string
    characters?: string[]
  }>
}>()
</script>

<template>
  <div class="timeline-rail">
    <div v-for="(event, index) in events" :key="index" class="timeline-event">
      <div class="timeline-marker">
        <div class="marker-dot"></div>
        <div class="marker-line" v-if="index !== events.length - 1"></div>
      </div>
      <div class="timeline-content">
        <span class="event-era">{{ event.era }}</span>
        <h4 class="event-title">{{ event.title }}</h4>
        <p class="event-summary">{{ event.summary }}</p>
        <div class="event-characters" v-if="event.characters && event.characters.length">
          <span class="char-tag" v-for="char in event.characters" :key="char">{{ char }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-rail {
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  position: relative;
}

.timeline-event {
  display: flex;
  gap: 2rem;
  position: relative;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
  flex-shrink: 0;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background-color: var(--c-bg);
  border: 2px solid var(--c-seal-red);
  border-radius: 50%;
  margin-top: 6px;
  z-index: 2;
  transition: all 0.3s ease;
}

.timeline-event:hover .marker-dot {
  background-color: var(--c-seal-red);
  box-shadow: 0 0 10px rgba(186, 38, 38, 0.4);
}

.marker-line {
  width: 2px;
  flex-grow: 1;
  background: linear-gradient(to bottom, var(--c-seal-red-soft), var(--c-border));
  margin-top: 4px;
  margin-bottom: -10px;
}

.timeline-content {
  flex-grow: 1;
  padding-bottom: 3rem;
  background: transparent;
  transition: transform 0.3s ease;
}

.timeline-event:hover .timeline-content {
  transform: translateX(5px);
}

.event-era {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 0.5rem;
}

.event-title {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  color: var(--c-ink);
  margin: 0 0 1rem 0;
}

.event-summary {
  font-size: 1rem;
  color: var(--c-text-2);
  line-height: 1.6;
  margin: 0 0 1rem 0;
  max-width: 700px;
}

.event-characters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.char-tag {
  font-size: 0.75rem;
  color: var(--c-text-3);
  border: 1px solid var(--c-divider);
  padding: 2px 8px;
  border-radius: 20px;
  background: var(--c-bg-soft);
}

@media (max-width: 640px) {
  .timeline-event {
    gap: 1rem;
  }
}
</style>
