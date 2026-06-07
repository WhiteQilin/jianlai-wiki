export function timelineArcAnchorId(era?: string | null) {
  const slug = String(era || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `timeline-arc-${slug || 'unknown'}`
}

export function timelineArcHref(era?: string | null) {
  if (!era) return '/timeline'

  return `/timeline#${timelineArcAnchorId(era)}`
}
