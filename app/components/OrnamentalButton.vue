<template>
  <NuxtLink :to="to" class="ornamental-btn" :class="`variant-${variant}`">
    <span class="btn-corners top-left"></span>
    <span class="btn-corners top-right"></span>
    <span class="btn-corners bottom-left"></span>
    <span class="btn-corners bottom-right"></span>
    
    <span class="btn-content">
      <span v-if="icon" class="btn-icon">{{ icon }}</span>
      <slot>{{ text }}</slot>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  to: {
    type: [String, Object],
    default: '#'
  },
  text: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary' // 'primary' (solid background), 'secondary' (outline)
  },
  icon: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.ornamental-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8em 2.5em;
  font-family: var(--font-heading);
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
  user-select: none;
}

.btn-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5em;
  letter-spacing: 0.1em;
}

.variant-primary {
  background-color: var(--c-ink);
  color: var(--c-paper);
}

.variant-secondary {
  background-color: transparent;
  color: var(--c-ink);
  border: 1px solid var(--c-border);
}

/* Corner decorations */
.btn-corners {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: currentColor;
  border-style: solid;
  border-width: 0;
  opacity: 0.5;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Dots at the corners of the borders */
.btn-corners::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: currentColor;
}

.variant-primary .btn-corners {
  border-color: var(--c-paper);
}

.variant-secondary .btn-corners {
  border-color: var(--c-ink);
}

.top-left { top: 4px; left: 4px; border-top-width: 1px; border-left-width: 1px; }
.top-left::after { top: -1px; left: -1px; }

.top-right { top: 4px; right: 4px; border-top-width: 1px; border-right-width: 1px; }
.top-right::after { top: -1px; right: -1px; }

.bottom-left { bottom: 4px; left: 4px; border-bottom-width: 1px; border-left-width: 1px; }
.bottom-left::after { bottom: -1px; left: -1px; }

.bottom-right { bottom: 4px; right: 4px; border-bottom-width: 1px; border-right-width: 1px; }
.bottom-right::after { bottom: -1px; right: -1px; }

.ornamental-btn:hover .btn-corners {
  opacity: 1;
  width: 14px;
  height: 14px;
}

.variant-primary:hover {
  background-color: var(--c-charcoal);
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.variant-secondary:hover {
  background-color: var(--c-bg-soft);
  border-color: var(--c-ink);
}

/* Subtle cloud-like hover effect for primary */
.variant-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 120%, rgba(255,255,255,0.15) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.variant-primary:hover::before {
  opacity: 1;
}

.dark .variant-primary {
  background-color: #2a2a2a;
  color: var(--c-paper);
}

.dark .variant-primary:hover {
  background-color: #333;
}
</style>
