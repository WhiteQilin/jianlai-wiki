/**
 * Media Library Manifest — Stage 12C
 *
 * A curated, PATHS-ONLY index of media hosted on the Cloudflare R2 bucket
 * (resolved at runtime through `getMediaUrl` + NUXT_PUBLIC_MEDIA_BASE_URL).
 *
 * IMPORTANT — this file is metadata only:
 *  - It contains relative public paths and human labels. NO binary assets.
 *  - It does NOT add files to `public/videos`, `public/fonts`, or anywhere else.
 *  - It does NOT require Cloudflare API keys and performs NO uploads.
 *  - It is consumed by the dev-only `/admin` Media Library panel.
 *
 * Why a manifest at all?
 *  - The dev-only `/api/editor/media` route can only "see" files physically
 *    present under `public/`. The full R2 set (e.g. home-hero 01–25, fonts,
 *    showcase PVs) lives on R2 and is not checked into the repo.
 *  - This manifest lets the editor list and reference those R2-only assets,
 *    while `mergeWithScan` unions it with whatever the local scan finds.
 *
 * Path convention: always a leading-slash relative path (e.g.
 * `/videos/curated/home-hero-01.mp4`). `getMediaUrl` prepends the R2 base.
 */

export type MediaLibType = 'image' | 'video' | 'font'

export interface MediaLibEntry {
  /** Leading-slash relative public path, e.g. `/videos/curated/home-hero-01.mp4`. */
  path: string
  type: MediaLibType
  /** Human-friendly display name. Falls back to the file name when omitted. */
  label?: string
  /** Logical grouping for the panel (e.g. "Home Hero", "Banners"). */
  group?: string
  /** Optional credit/caption note for official media. */
  note?: string
}

/** A manifest entry resolved against the local scan, with display helpers. */
export interface ResolvedMediaEntry extends MediaLibEntry {
  fileName: string
  folder: string
  /** Where the entry came from: curated manifest, local scan, or both. */
  source: 'manifest' | 'scan' | 'both'
  /** True when the asset is physically present under `public/` (local scan). */
  local: boolean
  /** Byte size when known from the local scan. */
  size?: number
}

/** Shape returned by `GET /api/editor/media` items. */
export interface MediaScanItem {
  publicPath: string
  fileName?: string
  folder?: string
  extension?: string
  type?: 'image' | 'video'
  size?: number
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']
const VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.m4v']
const FONT_EXTS = ['.ttf', '.otf', '.woff', '.woff2', '.eot']

// ---------------------------------------------------------------------------
// Seed data — full known R2 set (paths only).
// ---------------------------------------------------------------------------

/** Home hero loop videos: /videos/curated/home-hero-01.mp4 … home-hero-25.mp4 */
const HOME_HERO_VIDEOS: MediaLibEntry[] = Array.from({ length: 25 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return {
    path: `/videos/curated/home-hero-${n}.mp4`,
    type: 'video' as const,
    label: `Home Hero ${n}`,
    group: 'Home Hero',
    note: 'Curated cinematic loop. Official donghua-inspired atmosphere.',
  }
})

const CURATED_VIDEOS: MediaLibEntry[] = [
  ...HOME_HERO_VIDEOS,
  {
    path: '/videos/curated/intro-logo.mp4',
    type: 'video',
    label: 'Intro Logo Sequence',
    group: 'Branding',
    note: 'Used by the site intro sequence.',
  },
]

/**
 * Featured / showcase PVs referenced by the cinematic theatre section.
 * These live at the R2 `/videos/` root (not the curated folder) and are
 * referenced here as known R2 paths only.
 */
const SHOWCASE_VIDEOS: MediaLibEntry[] = [
  {
    path: '/videos/fight-scene.mp4',
    type: 'video',
    label: 'Epic Confrontations',
    group: 'Showcase',
    note: 'Featured duel PV. Official media — credit when used.',
  },
  {
    path: '/videos/ink-wash-pv.mp4',
    type: 'video',
    label: 'Ink-Wash Aesthetic',
    group: 'Showcase',
    note: 'Visual craft PV. Official media — credit when used.',
  },
  {
    path: '/videos/lore-secret.mp4',
    type: 'video',
    label: 'Secrets of Lizhu',
    group: 'Showcase',
    note: 'Mystic lore PV. Official media — credit when used.',
  },
]

/** Fonts hosted on R2 (copy-only in the editor; never inserted into content). */
const FONTS: MediaLibEntry[] = [
  {
    path: '/fonts/production/汉仪迪升英雄体W.TTF',
    type: 'font',
    label: 'HYDiShengHero (汉仪迪升英雄体W)',
    group: 'Display',
    note: 'Decorative Chinese display face (--font-zh-display). Loaded via @font-face.',
  },
]

/** Existing curated images (also present under public/images; merged + deduped). */
const IMAGES: MediaLibEntry[] = [
  // Banners
  { path: '/images/banners/artifacts-banner.webp', type: 'image', label: 'Artifacts Banner', group: 'Banners' },
  { path: '/images/banners/characters-banner.webp', type: 'image', label: 'Characters Banner', group: 'Banners' },
  { path: '/images/banners/cultivation-banner.webp', type: 'image', label: 'Cultivation Banner', group: 'Banners' },
  { path: '/images/banners/factions-banner.webp', type: 'image', label: 'Factions Banner', group: 'Banners' },
  { path: '/images/banners/home-hero.webp', type: 'image', label: 'Home Hero Still', group: 'Banners' },
  { path: '/images/banners/swordsmanship-banner.webp', type: 'image', label: 'Swordsmanship Banner', group: 'Banners' },
  { path: '/images/banners/world-banner.webp', type: 'image', label: 'World Banner', group: 'Banners' },
  // Characters
  { path: '/images/characters/chen-pingan.webp', type: 'image', label: 'Chen Ping-an', group: 'Characters' },
  { path: '/images/characters/ning-yao.webp', type: 'image', label: 'Ning Yao', group: 'Characters' },
  { path: '/images/characters/ning-yao.jpg', type: 'image', label: 'Ning Yao (JPG)', group: 'Characters' },
  { path: '/images/characters/qi-jingchun.webp', type: 'image', label: 'Qi Jingchun', group: 'Characters' },
  { path: '/images/characters/qi-jingchun.jpg', type: 'image', label: 'Qi Jingchun (JPG)', group: 'Characters' },
  // Header / logos
  { path: '/images/header/site-header.jpeg', type: 'image', label: 'Site Header', group: 'Branding' },
  { path: '/images/logos/JianLaiLogo.png', type: 'image', label: 'Jian Lai Logo', group: 'Branding' },
  // Portal cards
  { path: '/images/portalcard/artifacts-portalcard.jpg', type: 'image', label: 'Artifacts Portal Card', group: 'Portal Cards' },
  { path: '/images/portalcard/Character-portalcard.webp', type: 'image', label: 'Characters Portal Card', group: 'Portal Cards' },
  { path: '/images/portalcard/cultivation-portalcard.jpg', type: 'image', label: 'Cultivation Portal Card', group: 'Portal Cards' },
  { path: '/images/portalcard/factions-portalcard.jpg', type: 'image', label: 'Factions Portal Card', group: 'Portal Cards' },
  { path: '/images/portalcard/glossary-portalcard.jpg', type: 'image', label: 'Glossary Portal Card', group: 'Portal Cards' },
  { path: '/images/portalcard/swordsmanship-portalcard.png', type: 'image', label: 'Swordsmanship Portal Card', group: 'Portal Cards' },
  { path: '/images/portalcard/timeline-portalcard.jpg', type: 'image', label: 'Timeline Portal Card', group: 'Portal Cards' },
  { path: '/images/portalcard/world-portalcard.jpg', type: 'image', label: 'World Portal Card', group: 'Portal Cards' },
  // Textures
  { path: '/images/textures/ink-wash-01.webp', type: 'image', label: 'Ink-Wash Texture 01', group: 'Textures' },
  { path: '/images/textures/ink-wash-02.webp', type: 'image', label: 'Ink-Wash Texture 02', group: 'Textures' },
]

/** The curated R2 manifest. Paths/metadata only — no binary assets. */
export const MEDIA_LIBRARY: MediaLibEntry[] = [
  ...IMAGES,
  ...CURATED_VIDEOS,
  ...SHOWCASE_VIDEOS,
  ...FONTS,
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function extOf(path: string): string {
  const clean = path.split(/[?#]/)[0] || path
  const idx = clean.lastIndexOf('.')
  return idx === -1 ? '' : clean.slice(idx).toLowerCase()
}

export function fileNameOf(path: string): string {
  const clean = path.split(/[?#]/)[0] || path
  const idx = clean.lastIndexOf('/')
  return idx === -1 ? clean : clean.slice(idx + 1)
}

export function folderOf(path: string): string {
  const clean = path.split(/[?#]/)[0] || path
  const idx = clean.lastIndexOf('/')
  if (idx <= 0) return ''
  return clean.slice(0, idx)
}

/** Classify a path by extension. Returns null for unknown media kinds. */
export function inferTypeFromPath(path: string): MediaLibType | null {
  const ext = extOf(path)
  if (IMAGE_EXTS.includes(ext)) return 'image'
  if (VIDEO_EXTS.includes(ext)) return 'video'
  if (FONT_EXTS.includes(ext)) return 'font'
  return null
}

/** Group resolved entries by media type, preserving input order within a type. */
export function groupMediaByType<T extends { type: MediaLibType }>(
  entries: T[],
): Record<MediaLibType, T[]> {
  const out: Record<MediaLibType, T[]> = { image: [], video: [], font: [] }
  for (const entry of entries) {
    out[entry.type].push(entry)
  }
  return out
}

function toResolved(entry: MediaLibEntry, source: ResolvedMediaEntry['source'], extra?: Partial<ResolvedMediaEntry>): ResolvedMediaEntry {
  return {
    ...entry,
    fileName: fileNameOf(entry.path),
    folder: folderOf(entry.path),
    source,
    local: source !== 'manifest',
    ...extra,
  }
}

/**
 * Union the curated manifest with the local scan from `/api/editor/media`.
 *
 * Dedupe key is the relative path. Manifest entries provide label/group/note;
 * scan entries provide proof the file is local plus byte size. Entries present
 * in both are flagged `source: 'both'` and `local: true`.
 */
export function mergeWithScan(
  manifest: MediaLibEntry[] = MEDIA_LIBRARY,
  scan: MediaScanItem[] = [],
): ResolvedMediaEntry[] {
  const byPath = new Map<string, ResolvedMediaEntry>()

  // Seed with manifest entries first (R2-only assets become visible here).
  for (const entry of manifest) {
    if (!entry?.path) continue
    byPath.set(entry.path, toResolved(entry, 'manifest'))
  }

  // Fold in local scan items: enrich matches, add scan-only files.
  for (const item of scan) {
    const path = item?.publicPath
    if (!path) continue

    const existing = byPath.get(path)
    if (existing) {
      byPath.set(path, {
        ...existing,
        source: 'both',
        local: true,
        size: item.size ?? existing.size,
      })
      continue
    }

    const type = (item.type as MediaLibType | undefined) || inferTypeFromPath(path)
    if (!type) continue

    byPath.set(path, toResolved(
      { path, type, group: folderOf(path) || undefined },
      'scan',
      { size: item.size },
    ))
  }

  return Array.from(byPath.values()).sort((a, b) => a.path.localeCompare(b.path))
}
