<script setup lang="ts">
withDefaults(defineProps<{
  featured?: boolean
  tone?: 'sword' | 'neutral'
}>(), {
  featured: false,
  tone: 'neutral',
})
</script>

<template>
  <section class="manual-slip-shell" :class="[`tone-${tone}`, { featured }]">
    <div class="manual-slip-shell__margin" aria-hidden="true">
      <slot name="margin">
        <span>剑</span>
      </slot>
    </div>
    <div class="manual-slip-shell__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.manual-slip-shell {
  position: relative;
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(2.4rem, 0.08fr) minmax(0, 1fr);
  gap: 0;
  color: var(--c-ink);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--c-paper-alt) 72%, transparent), color-mix(in srgb, var(--c-bg-soft) 82%, transparent)),
    var(--c-bg);
  border: 1px solid color-mix(in srgb, var(--sword-celadon, var(--c-ink)) 20%, var(--c-border));
  border-radius: 5px;
  box-shadow:
    0 22px 48px color-mix(in srgb, var(--sword-celadon, #315f59) 8%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--c-paper-alt) 64%, transparent);
  overflow: hidden;
}

.manual-slip-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 7%, transparent), transparent 32%),
    radial-gradient(ellipse at 92% 4%, color-mix(in srgb, var(--c-bronze) 12%, transparent), transparent 28rem),
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--c-ink) 2.4%, transparent) 0 1px, transparent 1px 2.4rem);
  opacity: 0.72;
  pointer-events: none;
}

.manual-slip-shell::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--sword-silver, #aeb8b4) 86%, var(--c-paper)), var(--c-seal-red), transparent);
  opacity: 0.58;
  pointer-events: none;
}

.manual-slip-shell.featured {
  grid-template-columns: minmax(2.7rem, 0.07fr) minmax(0, 1fr);
}

.manual-slip-shell__margin,
.manual-slip-shell__body {
  position: relative;
  z-index: 1;
}

.manual-slip-shell__margin {
  display: grid;
  place-items: start center;
  padding: clamp(1rem, 2.6vw, 1.45rem) 0.45rem;
  border-right: 1px solid color-mix(in srgb, var(--c-seal-red) 22%, var(--c-divider));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--c-seal-red) 5%, transparent), transparent 44%),
    color-mix(in srgb, var(--c-paper-alt) 50%, transparent);
  color: color-mix(in srgb, var(--c-seal-red) 76%, var(--c-ink));
  font-family: var(--font-zh-display);
  font-size: clamp(1.45rem, 3vw, 2.1rem);
  line-height: 1;
  writing-mode: vertical-rl;
  text-orientation: upright;
}

.manual-slip-shell__body {
  min-width: 0;
  padding: clamp(1rem, 3vw, 1.55rem);
}

.tone-sword {
  border-color: color-mix(in srgb, var(--sword-celadon, var(--c-teal-accent)) 26%, var(--c-border));
}

@media (max-width: 760px) {
  .manual-slip-shell,
  .manual-slip-shell.featured {
    grid-template-columns: 1fr;
  }

  .manual-slip-shell__margin {
    min-height: 2.45rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0.7rem 1rem;
    border-right: 0;
    border-bottom: 1px solid color-mix(in srgb, var(--c-seal-red) 22%, var(--c-divider));
    writing-mode: horizontal-tb;
  }

  .manual-slip-shell__body {
    padding: 1rem;
  }
}
</style>
