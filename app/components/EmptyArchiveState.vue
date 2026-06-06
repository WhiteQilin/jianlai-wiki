<script setup lang="ts">
defineProps<{
  title?: string
  text?: string
  icon?: string
  variant?: 'default' | 'dark-chronicle'
}>()
</script>

<template>
  <section
    class="empty-archive-state"
    :class="{ 'empty-archive-state--dark-chronicle': variant === 'dark-chronicle' }"
    aria-live="polite"
  >
    <div class="corner corner-tl" aria-hidden="true"></div>
    <div class="corner corner-br" aria-hidden="true"></div>
    <div class="watermark" aria-hidden="true">{{ icon || '卷' }}</div>

    <SealBadge :text="icon || '卷'" variant="outline" shape="square" />
    <OrnamentalDivider motif="ruyi" color="celadon" />

    <h3 class="empty-title">{{ title || 'Records awaiting inscription' }}</h3>
    <p class="empty-text">
      {{ text || 'The archive table is set, the ink is drying, and these records will be entered after verification.' }}
    </p>
    <div class="empty-cta">
      <NuxtLink to="/contribute" class="contribute-link">Help expand the archive &rarr;</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.empty-archive-state {
  text-align: center;
  padding: clamp(3rem, 7vw, 5rem) clamp(1.25rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background:
    linear-gradient(135deg, rgba(44, 89, 92, 0.06), transparent 34%),
    linear-gradient(180deg, var(--c-paper-alt), var(--c-bg-soft));
  border: 1px solid color-mix(in srgb, var(--c-bronze) 35%, var(--c-border));
  border-radius: 6px;
  margin: 2.5rem 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(20, 20, 20, 0.05);
}

.empty-archive-state::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    url('/images/textures/ink-wash-02.webp'),
    radial-gradient(circle at 50% 0%, rgba(184, 42, 42, 0.06), transparent 32%);
  background-size: cover, 100% 100%;
  background-position: center;
  opacity: 0.08;
  pointer-events: none;
}

.empty-archive-state::after {
  content: '';
  position: absolute;
  inset: 12px;
  border: 1px solid color-mix(in srgb, var(--c-teal-accent) 22%, transparent);
  border-radius: 4px;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 5.5rem;
  height: 5.5rem;
  color: color-mix(in srgb, var(--c-teal-accent) 55%, transparent);
  opacity: 0.42;
  pointer-events: none;
}

.corner::before,
.corner::after {
  content: '';
  position: absolute;
  border-color: currentColor;
  border-style: solid;
}

.corner::before {
  width: 3rem;
  height: 3rem;
  border-width: 1px 0 0 1px;
}

.corner::after {
  width: 2.1rem;
  height: 1.1rem;
  border-width: 1px 0 0;
  border-radius: 999px 999px 0 0;
}

.corner-tl {
  top: 1.25rem;
  left: 1.25rem;
}

.corner-tl::before {
  top: 0;
  left: 0;
}

.corner-tl::after {
  top: 1.25rem;
  left: 1.25rem;
}

.corner-br {
  right: 1.25rem;
  bottom: 1.25rem;
  transform: rotate(180deg);
}

.corner-br::before {
  top: 0;
  left: 0;
}

.corner-br::after {
  top: 1.25rem;
  left: 1.25rem;
}

.watermark {
  position: absolute;
  inset: auto 1.25rem -0.65rem auto;
  font-family: var(--font-heading);
  font-size: clamp(5rem, 14vw, 10rem);
  line-height: 1;
  color: var(--c-ink);
  opacity: 0.035;
  pointer-events: none;
}

.empty-title,
.empty-text,
.empty-archive-state :deep(.seal-badge),
.empty-archive-state :deep(.ornamental-divider) {
  position: relative;
  z-index: 1;
}

.empty-archive-state :deep(.ornamental-divider) {
  max-width: 360px;
  margin: 0.25rem 0 0.5rem;
}

.empty-title {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: var(--c-ink);
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.04em;
}

.empty-text {
  font-size: 1rem;
  color: var(--c-text-2);
  line-height: 1.75;
  margin: 0;
  max-width: 560px;
}

.empty-cta {
  margin-top: 1.5rem;
  position: relative;
  z-index: 1;
}

.contribute-link {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border: 1px solid var(--c-seal-red);
  color: var(--c-seal-red);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.contribute-link:hover {
  background: var(--c-seal-red);
  color: white;
}

.dark .empty-archive-state {
  background:
    linear-gradient(135deg, rgba(73, 138, 142, 0.08), transparent 34%),
    linear-gradient(180deg, var(--c-bg), var(--c-bg-soft));
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
}

.dark .empty-archive-state::before {
  opacity: 0.04;
}

/* Dark Chronicle Variant (Timeline Redesign) */
.empty-archive-state--dark-chronicle {
  background: #0a0a0a;
  border: 1px solid rgba(212, 175, 55, 0.2); /* Muted gold border */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.empty-archive-state--dark-chronicle::before {
  opacity: 0.05;
  background-image: none; /* Remove bright ink wash */
}

.empty-archive-state--dark-chronicle::after {
  border-color: rgba(212, 175, 55, 0.1);
}

.empty-archive-state--dark-chronicle .corner {
  color: rgba(212, 175, 55, 0.3);
}

.empty-archive-state--dark-chronicle .watermark {
  color: #fff;
  opacity: 0.02;
}

.empty-archive-state--dark-chronicle .empty-title {
  color: #ffffff;
  font-family: var(--font-zh-display, "FZWeibei-S03S", serif);
  letter-spacing: 0.1em;
}

.empty-archive-state--dark-chronicle .empty-text {
  color: rgba(255, 255, 255, 0.7);
}

.empty-archive-state--dark-chronicle .contribute-link {
  border-color: rgba(212, 175, 55, 0.5);
  color: var(--c-gold, #d4af37);
  background: rgba(0, 0, 0, 0.4);
}

.empty-archive-state--dark-chronicle .contribute-link:hover {
  background: rgba(212, 175, 55, 0.15);
  color: #fff;
  border-color: var(--c-gold, #d4af37);
}
</style>
