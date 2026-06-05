<script setup lang="ts">
import type { ResolvedEntryLink } from '~/utils/entryLinkResolver'

const props = withDefaults(defineProps<{
  item: ResolvedEntryLink
  variant?: 'text' | 'chip' | 'row'
}>(), {
  variant: 'text',
})

const className = computed(() => ({
  'route-display-link': true,
  [`is-${props.variant}`]: true,
  'is-ghost': !props.item.shouldLink,
  'is-missing-route': props.item.isMissingRoute,
  'is-internal-only': props.item.isInternalOnly,
}))

const titleText = computed(() => {
  if (props.item.shouldLink) return props.item.label
  if (props.item.isInternalOnly) return `${props.item.label} is internal-only and not linked.`
  if (props.item.isMissingRoute) return `${props.item.label} does not have a published entry yet.`
  return props.item.label
})
</script>

<template>
  <NuxtLink
    v-if="item.shouldLink"
    :to="item.path"
    :class="className"
    :title="titleText"
  >
    <span class="entry-label">{{ item.label }}</span>
    <span v-if="item.chinese" class="entry-chinese">{{ item.chinese }}</span>
  </NuxtLink>
  <span v-else :class="className" :title="titleText">
    <span class="entry-label">{{ item.label }}</span>
    <span v-if="item.chinese" class="entry-chinese">{{ item.chinese }}</span>
  </span>
</template>

<style scoped>
.route-display-link {
  color: var(--c-ink);
  text-decoration: none;
  border: 0;
  transition: color var(--transition-base), border-color var(--transition-base), background var(--transition-base);
}

.route-display-link:hover {
  color: var(--c-seal-red);
}

.route-display-link.is-text,
.route-display-link.is-row {
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;
  line-height: 1.45;
}

.route-display-link.is-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 1.8rem;
  padding: 0.28rem 0.56rem;
  border: 1px solid color-mix(in srgb, var(--c-border) 75%, transparent);
  background: color-mix(in srgb, var(--c-paper) 84%, transparent);
  border-radius: 999px;
  font-size: 0.84rem;
  line-height: 1.2;
}

.route-display-link.is-chip:hover {
  border-color: var(--c-seal-red-soft);
  background: color-mix(in srgb, var(--c-seal-red) 7%, transparent);
}

.route-display-link.is-ghost {
  color: var(--c-text-3);
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: color-mix(in srgb, var(--c-border) 80%, transparent);
  text-underline-offset: 0.2em;
}

.route-display-link.is-missing-route,
.route-display-link.is-internal-only {
  cursor: help;
}

.route-display-link.is-ghost.is-chip {
  border-style: dashed;
  background: color-mix(in srgb, var(--c-bg-soft) 40%, transparent);
  text-decoration: none;
}

.route-display-link.is-missing-route.is-chip::after,
.route-display-link.is-internal-only.is-chip::after {
  content: 'pending';
  margin-left: 0.25rem;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.route-display-link.is-internal-only.is-chip::after {
  content: 'title';
}

.entry-chinese {
  color: var(--c-text-3);
  font-family: var(--font-heading);
  font-size: 0.9em;
}

</style>
