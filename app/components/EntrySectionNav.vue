<script setup lang="ts">
interface TocLink {
  id?: string
  text?: string
  children?: TocLink[]
}

interface NavItem {
  label: string
  href: string
  source: string
}

const props = defineProps<{
  page: Record<string, any>
}>()

const GROUPS: Array<{ label: string; patterns: RegExp[] }> = [
  { label: 'Overview', patterns: [/overview/i, /summary/i] },
  { label: 'Appearance / Personality', patterns: [/appearance/i, /personality/i, /temperament/i] },
  { label: 'History', patterns: [/history/i, /major events?/i, /timeline/i, /origin story/i, /fall from grace/i] },
  { label: 'Cultivation / Abilities', patterns: [/cultivation/i, /abilities/i, /techniques?/i, /function/i, /powers?/i, /realm/i, /practice/i] },
  { label: 'Relationships', patterns: [/relationships?/i, /key figures?/i, /members?/i, /known owners?/i, /practitioners?/i, /affiliations?/i] },
  { label: 'Items / Artifacts', patterns: [/items?/i, /artifacts?/i, /treasures?/i, /weapons?/i, /stored items?/i] },
  { label: 'Notes', patterns: [/notes?/i, /trivia/i, /analysis/i] },
  { label: 'References', patterns: [/references?/i, /sources?/i, /citations?/i] },
]

function flattenLinks(links: TocLink[] = []): TocLink[] {
  const result: TocLink[] = []
  for (const link of links) {
    result.push(link)
    if (link.children?.length) result.push(...flattenLinks(link.children))
  }
  return result
}

function groupLabel(text = ''): string {
  const normalized = text.trim()
  for (const group of GROUPS) {
    if (group.patterns.some((pattern) => pattern.test(normalized))) return group.label
  }
  return normalized || 'Section'
}

const navItems = computed<NavItem[]>(() => {
  const links = flattenLinks(props.page?.body?.toc?.links || [])
  const seen = new Set<string>()
  const items: NavItem[] = []

  for (const link of links) {
    if (!link.id || !link.text) continue
    const label = groupLabel(link.text)
    const key = `${label}-${link.id}`
    if (seen.has(label) || seen.has(key)) continue
    seen.add(label)
    seen.add(key)
    items.push({ label, href: `#${link.id}`, source: link.text })
  }

  return items
})
</script>

<template>
  <nav v-if="navItems.length" class="entry-section-nav" aria-label="Entry contents">
    <span class="contents-label">Contents</span>
    <div class="contents-list">
      <a
        v-for="item in navItems"
        :key="item.href"
        :href="item.href"
        class="contents-link"
        :title="item.source"
      >
        {{ item.label }}
      </a>
    </div>
  </nav>
</template>

<style scoped>
.entry-section-nav {
  position: relative;
  margin: 0 0 2rem;
  padding: 0.8rem 0;
  border-block: 1px solid color-mix(in srgb, var(--c-divider) 76%, transparent);
}

.contents-label {
  display: block;
  margin-bottom: 0.65rem;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.contents-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.contents-link {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.35rem 0.7rem;
  color: var(--c-text-2);
  text-decoration: none;
  border: 1px solid color-mix(in srgb, var(--c-border) 70%, transparent);
  background: color-mix(in srgb, var(--c-paper) 74%, transparent);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color var(--transition-base), border-color var(--transition-base), background var(--transition-base);
}

.contents-link:hover {
  color: var(--c-seal-red);
  border-color: var(--c-seal-red-soft);
  background: color-mix(in srgb, var(--c-seal-red) 6%, transparent);
}

@media (max-width: 760px) {
  .entry-section-nav {
    position: relative;
  }

  .entry-section-nav::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2.5rem;
    background: linear-gradient(to right, transparent, var(--c-bg));
    pointer-events: none;
  }

  .contents-list {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    padding-right: 2.5rem;
    scrollbar-width: none; /* Firefox */
  }
  
  .contents-list::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }

  .contents-link {
    white-space: nowrap;
    flex-shrink: 0;
  }
}
</style>
