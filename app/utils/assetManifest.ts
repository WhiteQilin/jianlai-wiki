export type AssetRole =
  | 'hero-atmosphere'
  | 'dossier-portrait'
  | 'card-art'
  | 'background-wash'
  | 'watermark'
  | 'section-divider'
  | 'hover-ornament'
  | 'button-ornament'
  | 'seal-stamp'
  | 'texture'
  | 'unusable'

export type SectionFit =
  | 'home' | 'characters' | 'world' | 'cultivation' | 'swordsmanship'
  | 'factions' | 'artifacts' | 'timeline' | 'rankings' | 'teachings'
  | 'glossary' | 'pantheon' | 'global'

export type Mood =
  | 'solemn' | 'misty' | 'celestial' | 'martial' | 'pastoral'
  | 'arcane' | 'elegiac' | 'burnished'

export type CropType =
  | 'subject-up' | 'eyes-up' | 'center' | 'lower-third'
  | 'left-third' | 'right-third' | 'full-bleed'

export interface AssetEntry {
  id: string
  filePath: string
  role: AssetRole
  sectionFit: SectionFit[]
  mood: Mood
  subject: string
  aspectRatio: string
  cropType: CropType
  recommendedUse: string
  avoidUse: string
  priority: 'p0' | 'p1' | 'p2' | 'p3'
  curatedAt: string
  curatedBy: string
  notes?: string
}

export interface AssetManifest {
  version: string
  assets: AssetEntry[]
}

const manifest: AssetManifest = {
  version: '1.0.0',
  assets: [
    {
      id: 'asset.char-chen-pingan-portrait',
      filePath: '/images/characters/chen-pingan.webp',
      role: 'dossier-portrait',
      sectionFit: ['characters'],
      mood: 'solemn',
      subject: 'Chen Ping\'an in scholar robes',
      aspectRatio: '3:4',
      cropType: 'eyes-up',
      recommendedUse: 'Dossier plate on /characters/chen-pingan',
      avoidUse: 'Hero atmosphere (too tight a crop)',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
      notes: 'Primary character portrait, high resolution',
    },
    {
      id: 'asset.char-ning-yao-portrait',
      filePath: '/images/characters/ning-yao.webp',
      role: 'dossier-portrait',
      sectionFit: ['characters'],
      mood: 'elegiac',
      subject: 'Ning Yao portrait',
      aspectRatio: '3:4',
      cropType: 'eyes-up',
      recommendedUse: 'Dossier plate on /characters/ning-yao',
      avoidUse: 'Card art (wrong aspect ratio)',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.char-qi-jingchun-portrait',
      filePath: '/images/characters/qi-jingchun.webp',
      role: 'dossier-portrait',
      sectionFit: ['characters'],
      mood: 'martial',
      subject: 'Qi Jingchun portrait',
      aspectRatio: '3:4',
      cropType: 'eyes-up',
      recommendedUse: 'Dossier plate on /characters/qi-jingchun',
      avoidUse: 'Card art',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.banner-characters-hero',
      filePath: '/images/banners/characters-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['characters'],
      mood: 'misty',
      subject: 'Characters section hero atmosphere',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Section hero background wash on /characters',
      avoidUse: 'Card art or portrait overlay',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.banner-swordsmanship-hero',
      filePath: '/images/banners/swordsmanship-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['swordsmanship'],
      mood: 'martial',
      subject: 'Swordsmanship section hero atmosphere',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Section hero background wash on /swordsmanship',
      avoidUse: 'Card art',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.banner-world-hero',
      filePath: '/images/banners/world-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['world'],
      mood: 'celestial',
      subject: 'World section hero atmosphere',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Section hero background wash on /world',
      avoidUse: 'Card art',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.banner-cultivation-hero',
      filePath: '/images/banners/cultivation-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['cultivation'],
      mood: 'arcane',
      subject: 'Cultivation section hero atmosphere',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Section hero background wash on /cultivation',
      avoidUse: 'Card art',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.banner-factions-hero',
      filePath: '/images/banners/factions-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['factions'],
      mood: 'burnished',
      subject: 'Factions section hero atmosphere',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Section hero background wash on /factions',
      avoidUse: 'Card art',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.banner-artifacts-hero',
      filePath: '/images/banners/artifacts-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['artifacts'],
      mood: 'burnished',
      subject: 'Artifacts section hero atmosphere',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Section hero background wash on /artifacts',
      avoidUse: 'Card art',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.banner-home-hero',
      filePath: '/images/banners/home-hero.webp',
      role: 'hero-atmosphere',
      sectionFit: ['home'],
      mood: 'solemn',
      subject: 'Home page hero atmosphere',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Home page hero background wash',
      avoidUse: 'Card art',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.card-char-portal',
      filePath: '/images/portalcard/Character-portalcard.webp',
      role: 'card-art',
      sectionFit: ['characters'],
      mood: 'misty',
      subject: 'Character portal card illustration',
      aspectRatio: '4:5',
      cropType: 'subject-up',
      recommendedUse: 'Card art for FeaturedDossier or character card heroes',
      avoidUse: 'Dossier portrait (wrong role)',
      priority: 'p1',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.card-artifacts-portal',
      filePath: '/images/portalcard/artifacts-portalcard.jpg',
      role: 'card-art',
      sectionFit: ['artifacts'],
      mood: 'burnished',
      subject: 'Artifacts portal card illustration',
      aspectRatio: '4:5',
      cropType: 'subject-up',
      recommendedUse: 'Card art for RelicCard in Artifacts section',
      avoidUse: 'Hero atmosphere',
      priority: 'p1',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.card-cultivation-portal',
      filePath: '/images/portalcard/cultivation-portalcard.jpg',
      role: 'card-art',
      sectionFit: ['cultivation'],
      mood: 'arcane',
      subject: 'Cultivation portal card illustration',
      aspectRatio: '4:5',
      cropType: 'subject-up',
      recommendedUse: 'Card art for cultivation-related entries',
      avoidUse: 'Hero atmosphere',
      priority: 'p1',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.timeline-chen-pingan-art',
      filePath: '/images/timeline/chen-pingan-black-gold-timeline.webp',
      role: 'card-art',
      sectionFit: ['timeline', 'characters'],
      mood: 'martial',
      subject: 'Chen Ping\'an timeline illustration in black and gold',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Timeline event illustration or card art',
      avoidUse: 'Portrait (too wide)',
      priority: 'p1',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.texture-ink-wash-01',
      filePath: '/images/textures/ink-wash-01.webp',
      role: 'texture',
      sectionFit: ['global'],
      mood: 'misty',
      subject: 'Ink wash texture 01 — atmospheric paper grain',
      aspectRatio: '1:1',
      cropType: 'full-bleed',
      recommendedUse: 'Section hero atmospheric wash at 0.04–0.08 opacity',
      avoidUse: 'Card background or hero at full opacity',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.texture-ink-wash-02',
      filePath: '/images/textures/ink-wash-02.webp',
      role: 'texture',
      sectionFit: ['global'],
      mood: 'misty',
      subject: 'Ink wash texture 02 — atmospheric paper grain variant',
      aspectRatio: '1:1',
      cropType: 'full-bleed',
      recommendedUse: 'Section hero atmospheric wash at 0.04–0.08 opacity',
      avoidUse: 'Card background or hero at full opacity',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
    },
    {
      id: 'asset.seal-border-mask',
      filePath: '/images/ui/seals/seal-border-mask.svg',
      role: 'seal-stamp',
      sectionFit: ['global'],
      mood: 'burnished',
      subject: 'Seal border irregular edge mask for cinnabar stamps',
      aspectRatio: '1:1',
      cropType: 'center',
      recommendedUse: 'Mask for SealButton and SealStamp irregular edges',
      avoidUse: 'As a standalone image',
      priority: 'p0',
      curatedAt: '2025-01-01',
      curatedBy: 'curator',
      notes: 'SVG mask used via CSS mask-image',
    },
  ],
}

export const ASSET_COUNT = manifest.assets.length

export function getAssetsByRole(role: AssetRole): AssetEntry[] {
  return manifest.assets.filter((a) => a.role === role)
}

export function getAssetsBySection(section: SectionFit): AssetEntry[] {
  return manifest.assets.filter((a) => a.sectionFit.includes(section) || a.sectionFit.includes('global'))
}

export function getAssetsByRoleAndSection(role: AssetRole, section: SectionFit): AssetEntry[] {
  return manifest.assets.filter(
    (a) => a.role === role && (a.sectionFit.includes(section) || a.sectionFit.includes('global'))
  )
}

export function getAssetById(id: string): AssetEntry | undefined {
  return manifest.assets.find((a) => a.id === id)
}
