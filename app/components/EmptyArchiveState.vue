<script setup lang="ts">
defineProps<{
  title?: string
  text?: string
  icon?: string
}>()
</script>

<template>
  <section class="empty-archive-state" aria-live="polite">
    <div class="corner corner-tl" aria-hidden="true"></div>
    <div class="corner corner-br" aria-hidden="true"></div>
    <div class="watermark" aria-hidden="true">{{ icon || '卷' }}</div>

    <SealBadge :text="icon || '卷'" variant="outline" shape="square" />
    <OrnamentalDivider motif="ruyi" color="celadon" />

    <h3 class="empty-title">{{ title || 'Records awaiting inscription' }}</h3>
    <p class="empty-text">
      {{ text || 'The archive table is set, the ink is drying, and these records will be entered after verification.' }}
    </p>
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

.dark .empty-archive-state {
  background:
    linear-gradient(135deg, rgba(73, 138, 142, 0.08), transparent 34%),
    linear-gradient(180deg, var(--c-bg), var(--c-bg-soft));
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
}

.dark .empty-archive-state::before {
  opacity: 0.04;
}
</style>
