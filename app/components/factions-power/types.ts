import type { ResolvedEntryLink } from '~/utils/entryLinkResolver'

/**
 * Shared types for the factions-power (天下势力盘) component family.
 * Data is queried + transformed at the page level (factions-power-board.vue)
 * and passed down as props; components never call queryCollection themselves.
 */

export type FactionSummary = {
  path: string
  title: string
  chinese?: string
  description?: string
  category?: string
  factionType?: string
  importance?: string
  verificationStatus?: string
  status?: string
  seal?: string
  headquarters?: string
  region?: string
  headquartersLink?: ResolvedEntryLink | null
  leaderLinks: ResolvedEntryLink[]
  memberLinks: ResolvedEntryLink[]
  inverseAffiliationLinks: ResolvedEntryLink[]
}

export type SeatGroup = {
  raw: string
  label: string
  chinese?: string
  region?: string
  /** Resolved route path for the seat's world location, when routed. */
  seatPath?: string
  count: number
  entries: FactionSummary[]
  isUnplaced?: boolean
}

export type RelationLane = {
  faction: FactionSummary
  leaders: ResolvedEntryLink[]
  members: ResolvedEntryLink[]
  affiliated: ResolvedEntryLink[]
  total: number
}

export type RegistryStats = {
  total: number
  primary: number
  verified: number
  seats: number
}

/** Seal glyph for an entry — frontmatter seal, else first Chinese char, else title char. */
export function sealGlyph(entry: Pick<FactionSummary, 'seal' | 'chinese' | 'title'>): string {
  return entry.seal || (entry.chinese ? entry.chinese.charAt(0) : entry.title.charAt(0))
}

/**
 * Verification glyph — a single small mark, NOT a chip.
 * ✓ verified · ⚠ disputed · ? speculative · · unknown / to-be-verified
 */
export function verificationGlyph(value?: string): { char: string; tone: 'verified' | 'disputed' | 'speculative' | 'unknown'; label: string } {
  switch ((value || '').trim().toLowerCase()) {
    case 'verified':
      return { char: '✓', tone: 'verified', label: 'Verified' }
    case 'disputed':
      return { char: '⚠', tone: 'disputed', label: 'Disputed' }
    case 'speculative':
      return { char: '?', tone: 'speculative', label: 'Speculative' }
    default:
      return { char: '·', tone: 'unknown', label: 'To be verified' }
  }
}
