/**
 * Asset Manifest — Stage 35B
 *
 * Typed manifest of all curated assets under `public/images/`.
 * Single source of truth for what image serves what design-engine role
 * on which section page.
 *
 * NOT a runtime scanner — this is a curated index. Entries must be
 * added by a human curator who has reviewed the image and assigned it
 * exactly one `role` and one or more `sectionFit` values.
 *
 * Folders that are NOT consumed from this manifest (raw pools, not live):
 *   public/images/weibo-draft/       — unreviewed fan-sourced screenshots
 *   public/images/banner-draft/      — unreviewed draft banners
 *   public/images/design-references/  — reference only, not for deployment
 *
 * Reference: plans/jianlai-frontend-design-engine.md § 5 & § 6
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  | 'home'
  | 'characters'
  | 'world'
  | 'cultivation'
  | 'swordsmanship'
  | 'factions'
  | 'artifacts'
  | 'timeline'
  | 'rankings'
  | 'teachings'
  | 'glossary'
  | 'pantheon'
  | 'global'

export type Mood =
  | 'solemn'
  | 'misty'
  | 'celestial'
  | 'martial'
  | 'pastoral'
  | 'arcane'
  | 'elegiac'
  | 'burnished'

export type CropType =
  | 'subject-up'
  | 'eyes-up'
  | 'center'
  | 'lower-third'
  | 'left-third'
  | 'right-third'
  | 'full-bleed'

export type Priority = 'p0' | 'p1' | 'p2' | 'p3'

export interface AssetEntry {
  /** Unique stable ID, e.g. "asset.char-chen-pingan-portrait" */
  id: string
  /** Leading-slash relative public path, e.g. "/images/characters/chen-pingan.webp" */
  filePath: string
  /** Design-engine role — exactly one per entry */
  role: AssetRole
  /** Which sections this asset is approved for */
  sectionFit: SectionFit[]
  /** Emotional/mood classification */
  mood: Mood
  /** Human description of what the image shows */
  subject: string
  /** Native or intended aspect ratio, e.g. "16:9", "3:4" */
  aspectRatio: string
  /** Recommended crop anchor */
  cropType: CropType
  /** Where to use this asset */
  recommendedUse: string
  /** Explicit warning about misuse */
  avoidUse: string
  /** p0 = required for launch, p3 = nice-to-have */
  priority: Priority
  /** ISO date the entry was added to the manifest */
  curatedAt: string
  /** Handle of the curator */
  curatedBy: string
  /** Optional notes, caveats, or review flags */
  notes?: string
}

export interface AssetManifest {
  /** Manifest schema version, bump on breaking changes */
  version: string
  /** All curated entries */
  assets: AssetEntry[]
}

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

const manifest: AssetManifest = {
  version: '1.0.0',

  assets: [

    // ─── Textures ──────────────────────────────────────────────────────────

    {
      id: 'asset.texture-ink-wash-01',
      filePath: '/images/textures/ink-wash-01.webp',
      role: 'texture',
      sectionFit: ['global'],
      mood: 'elegiac',
      subject: 'Ink-wash paper texture, light grain',
      aspectRatio: '16:9',
      cropType: 'full-bleed',
      recommendedUse: 'Subtle paper grain behind cards, ledgers, infoboxes. Opacity 0.02–0.06.',
      avoidUse: 'As a hero background or card hero image.',
      priority: 'p0',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.texture-ink-wash-02',
      filePath: '/images/textures/ink-wash-02.webp',
      role: 'texture',
      sectionFit: ['global'],
      mood: 'elegiac',
      subject: 'Ink-wash paper texture, medium grain',
      aspectRatio: '16:9',
      cropType: 'full-bleed',
      recommendedUse: 'Deeper paper grain behind section heroes or ledger sheets. Opacity 0.03–0.07.',
      avoidUse: 'As a card hero image or portrait frame background.',
      priority: 'p0',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },

    // ─── Section Hero Atmospheres ────────────────────────────────────────────

    {
      id: 'asset.hero-home',
      filePath: '/images/banners/home-hero.webp',
      role: 'hero-atmosphere',
      sectionFit: ['home'],
      mood: 'celestial',
      subject: 'Home section hero banner — atmospheric mist, archive atmosphere',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Home page hero background wash, opacity 0.18–0.28.',
      avoidUse: 'As a card thumbnail or section banner for any other section.',
      priority: 'p0',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
      notes: 'Verify it is official or commissioned art. 10 unnamed pinterest images in banners/ are not included — curate separately.',
    },
    {
      id: 'asset.hero-characters',
      filePath: '/images/banners/characters-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['characters'],
      mood: 'misty',
      subject: 'Characters section hero banner',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Characters index hero background wash.',
      avoidUse: 'As a card thumbnail or portrait.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.hero-world',
      filePath: '/images/banners/world-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['world'],
      mood: 'pastoral',
      subject: 'World section hero banner — mountain-river atlas atmosphere',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'World index hero background wash.',
      avoidUse: 'As a card thumbnail.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.hero-cultivation',
      filePath: '/images/banners/cultivation-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['cultivation'],
      mood: 'celestial',
      subject: 'Cultivation section hero banner',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Cultivation index hero background wash.',
      avoidUse: 'As a card thumbnail.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.hero-swordsmanship',
      filePath: '/images/banners/swordsmanship-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['swordsmanship'],
      mood: 'martial',
      subject: 'Swordsmanship section hero banner',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Swordsmanship index hero background wash.',
      avoidUse: 'As a card thumbnail.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.hero-factions',
      filePath: '/images/banners/factions-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['factions'],
      mood: 'solemn',
      subject: 'Factions section hero banner',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Factions index hero background wash.',
      avoidUse: 'As a card thumbnail.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.hero-artifacts',
      filePath: '/images/banners/artifacts-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['artifacts'],
      mood: 'burnished',
      subject: 'Artifacts section hero banner',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Artifacts index hero background wash.',
      avoidUse: 'As a card thumbnail.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.hero-timeline',
      filePath: '/images/banners/timeline-banner.webp',
      role: 'hero-atmosphere',
      sectionFit: ['timeline'],
      mood: 'elegiac',
      subject: 'Timeline section hero banner',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Timeline index hero background wash.',
      avoidUse: 'As a card thumbnail.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
      notes: 'Named "pinterest_" files in banners/ are NOT included. Review before promoting to manifest.',
    },
    {
      id: 'asset.hero-swordsmanship-mist',
      filePath: '/images/ui/generated/swordsmanship-v2/swordsmanship-hero-mist-bg.webp',
      role: 'hero-atmosphere',
      sectionFit: ['swordsmanship'],
      mood: 'misty',
      subject: 'Swordsmanship v2 hero mist background — pale steel atmosphere',
      aspectRatio: '16:9',
      cropType: 'center',
      recommendedUse: 'Swordsmanship detail hero atmosphere layer.',
      avoidUse: 'As a card thumbnail.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },

    // ─── Card Art ───────────────────────────────────────────────────────────

    {
      id: 'asset.card-caged-sparrow',
      filePath: '/images/ui/generated/swordsmanship-v2/swordsmanship-caged-sparrow-slip-art.webp',
      role: 'card-art',
      sectionFit: ['swordsmanship'],
      mood: 'martial',
      subject: 'Caged Sparrow sword art — illustration on a sword manual slip',
      aspectRatio: '4:5',
      cropType: 'subject-up',
      recommendedUse: 'ManualSlip hero illustration for the Caged Sparrow sword art entry.',
      avoidUse: 'As a section hero or background wash.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
      notes: 'Also available at swordsmanship-caged-sparrow-slip-art-960.webp (960px wide variant).',
    },

    // ─── Portal Cards ───────────────────────────────────────────────────────

    {
      id: 'asset.card-portal-characters',
      filePath: '/images/portalcard/Character-portalcard.webp',
      role: 'card-art',
      sectionFit: ['characters'],
      mood: 'misty',
      subject: 'Characters section portal card',
      aspectRatio: '4:5',
      cropType: 'center',
      recommendedUse: 'Section portal card on the home or index page.',
      avoidUse: 'As a hero atmosphere or dossier portrait.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.card-portal-world',
      filePath: '/images/portalcard/world-portalcard.jpg',
      role: 'card-art',
      sectionFit: ['world'],
      mood: 'pastoral',
      subject: 'World section portal card',
      aspectRatio: '4:5',
      cropType: 'center',
      recommendedUse: 'Section portal card on the home or index page.',
      avoidUse: 'As a hero atmosphere.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.card-portal-cultivation',
      filePath: '/images/portalcard/cultivation-portalcard.jpg',
      role: 'card-art',
      sectionFit: ['cultivation'],
      mood: 'celestial',
      subject: 'Cultivation section portal card',
      aspectRatio: '4:5',
      cropType: 'center',
      recommendedUse: 'Section portal card on the home or index page.',
      avoidUse: 'As a hero atmosphere.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.card-portal-swordsmanship',
      filePath: '/images/portalcard/swordsmanship-portalcard.png',
      role: 'card-art',
      sectionFit: ['swordsmanship'],
      mood: 'martial',
      subject: 'Swordsmanship section portal card',
      aspectRatio: '4:5',
      cropType: 'center',
      recommendedUse: 'Section portal card on the home or index page.',
      avoidUse: 'As a hero atmosphere.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.card-portal-factions',
      filePath: '/images/portalcard/factions-portalcard.jpg',
      role: 'card-art',
      sectionFit: ['factions'],
      mood: 'solemn',
      subject: 'Factions section portal card',
      aspectRatio: '4:5',
      cropType: 'center',
      recommendedUse: 'Section portal card on the home or index page.',
      avoidUse: 'As a hero atmosphere.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.card-portal-artifacts',
      filePath: '/images/portalcard/artifacts-portalcard.jpg',
      role: 'card-art',
      sectionFit: ['artifacts'],
      mood: 'burnished',
      subject: 'Artifacts section portal card',
      aspectRatio: '4:5',
      cropType: 'center',
      recommendedUse: 'Section portal card on the home or index page.',
      avoidUse: 'As a hero atmosphere.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.card-portal-timeline',
      filePath: '/images/portalcard/timeline-portalcard.jpg',
      role: 'card-art',
      sectionFit: ['timeline'],
      mood: 'elegiac',
      subject: 'Timeline section portal card',
      aspectRatio: '4:5',
      cropType: 'center',
      recommendedUse: 'Section portal card on the home or index page.',
      avoidUse: 'As a hero atmosphere.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.card-portal-glossary',
      filePath: '/images/portalcard/glossary-portalcard.jpg',
      role: 'card-art',
      sectionFit: ['glossary'],
      mood: 'solemn',
      subject: 'Glossary section portal card',
      aspectRatio: '4:5',
      cropType: 'center',
      recommendedUse: 'Section portal card on the home or index page.',
      avoidUse: 'As a hero atmosphere.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },

    // ─── Section Dividers ───────────────────────────────────────────────────

    {
      id: 'asset.divider-swordsmanship-slash-01',
      filePath: '/images/ui/generated/swordsmanship-v2/swordsmanship-divider-slash-01.webp',
      role: 'section-divider',
      sectionFit: ['swordsmanship'],
      mood: 'martial',
      subject: 'Swordsmanship section divider — blade slash line 1',
      aspectRatio: '16:5',
      cropType: 'center',
      recommendedUse: 'Section divider between major parts of a swordsmanship detail page.',
      avoidUse: 'Outside Swordsmanship. As a hero.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.divider-swordsmanship-slash-02',
      filePath: '/images/ui/generated/swordsmanship-v2/swordsmanship-divider-slash-02.webp',
      role: 'section-divider',
      sectionFit: ['swordsmanship'],
      mood: 'martial',
      subject: 'Swordsmanship section divider — blade slash line 2',
      aspectRatio: '16:5',
      cropType: 'center',
      recommendedUse: 'Section divider for Swordsmanship. Alternate variant.',
      avoidUse: 'Outside Swordsmanship.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.divider-swordsmanship-slash-03',
      filePath: '/images/ui/generated/swordsmanship-v2/swordsmanship-divider-slash-03.webp',
      role: 'section-divider',
      sectionFit: ['swordsmanship'],
      mood: 'martial',
      subject: 'Swordsmanship section divider — blade slash line 3',
      aspectRatio: '16:5',
      cropType: 'center',
      recommendedUse: 'Section divider for Swordsmanship. Alternate variant.',
      avoidUse: 'Outside Swordsmanship.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.divider-swordsmanship-slash-04',
      filePath: '/images/ui/generated/swordsmanship-v2/swordsmanship-divider-slash-04.webp',
      role: 'section-divider',
      sectionFit: ['swordsmanship'],
      mood: 'martial',
      subject: 'Swordsmanship section divider — blade slash line 4',
      aspectRatio: '16:5',
      cropType: 'center',
      recommendedUse: 'Section divider for Swordsmanship. Alternate variant.',
      avoidUse: 'Outside Swordsmanship.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.divider-swordsmanship-slash-05',
      filePath: '/images/ui/generated/swordsmanship-v2/swordsmanship-divider-slash-05.webp',
      role: 'section-divider',
      sectionFit: ['swordsmanship'],
      mood: 'martial',
      subject: 'Swordsmanship section divider — blade slash line 5 (lightest)',
      aspectRatio: '16:5',
      cropType: 'center',
      recommendedUse: 'Subtle section divider for Swordsmanship.',
      avoidUse: 'Outside Swordsmanship.',
      priority: 'p3',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },

    // ─── Hover Ornaments ────────────────────────────────────────────────────

    {
      id: 'asset.hover-brush-soft-01',
      filePath: '/images/ui/generated/hover-marks/generated-hover-brush-soft-01.webp',
      role: 'hover-ornament',
      sectionFit: ['global'],
      mood: 'elegiac',
      subject: 'Soft brush hover ornament — ink smear, medium weight',
      aspectRatio: 'variable',
      cropType: 'full-bleed',
      recommendedUse: 'Hover ornament on ledger rows or content strips. Opacity 0→0.85 on hover.',
      avoidUse: 'As a static background or hero image.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.hover-brush-soft-02',
      filePath: '/images/ui/generated/hover-marks/generated-hover-brush-soft-02.webp',
      role: 'hover-ornament',
      sectionFit: ['global'],
      mood: 'elegiac',
      subject: 'Soft brush hover ornament — variant 2',
      aspectRatio: 'variable',
      cropType: 'full-bleed',
      recommendedUse: 'Hover ornament on ledger rows. Alternate variant.',
      avoidUse: 'As a static background.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.hover-brush-soft-03',
      filePath: '/images/ui/generated/hover-marks/generated-hover-brush-soft-03.webp',
      role: 'hover-ornament',
      sectionFit: ['global'],
      mood: 'elegiac',
      subject: 'Soft brush hover ornament — variant 3',
      aspectRatio: 'variable',
      cropType: 'full-bleed',
      recommendedUse: 'Hover ornament on ledger rows. Alternate variant.',
      avoidUse: 'As a static background.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.hover-brush-soft-04',
      filePath: '/images/ui/generated/hover-marks/generated-hover-brush-soft-04.webp',
      role: 'hover-ornament',
      sectionFit: ['global'],
      mood: 'elegiac',
      subject: 'Soft brush hover ornament — variant 4 (ink-tinted)',
      aspectRatio: 'variable',
      cropType: 'full-bleed',
      recommendedUse: 'Hover ornament on ledger rows. Alternate variant with ink hue shift.',
      avoidUse: 'As a static background.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.hover-blot-ink-01',
      filePath: '/images/ui/generated/hover-marks/generated-hover-blot-ink-01.webp',
      role: 'hover-ornament',
      sectionFit: ['global'],
      mood: 'solemn',
      subject: 'Ink blot hover ornament — small concentrated mark',
      aspectRatio: 'variable',
      cropType: 'center',
      recommendedUse: 'Hover ornament accent on active/selected states.',
      avoidUse: 'As a static background.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.hover-blot-gray-01',
      filePath: '/images/ui/generated/hover-marks/generated-hover-blot-gray-01.webp',
      role: 'hover-ornament',
      sectionFit: ['global'],
      mood: 'pastoral',
      subject: 'Gray blot hover ornament — subtle neutral mark',
      aspectRatio: 'variable',
      cropType: 'center',
      recommendedUse: 'Hover ornament on inactive or disabled states.',
      avoidUse: 'As a static background.',
      priority: 'p3',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.underline-ink-thin-01',
      filePath: '/images/ui/generated/hover-marks/generated-underline-ink-thin-01.webp',
      role: 'hover-ornament',
      sectionFit: ['global'],
      mood: 'elegiac',
      subject: 'Thin ink underline — horizontal brush stroke for text hovers',
      aspectRatio: '16:1',
      cropType: 'full-bleed',
      recommendedUse: 'Text link underline on hover, replacing browser default.',
      avoidUse: 'As a section divider (use section-divider role).',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.underline-ink-thin-04',
      filePath: '/images/ui/generated/hover-marks/generated-underline-ink-thin-04.webp',
      role: 'hover-ornament',
      sectionFit: ['global'],
      mood: 'elegiac',
      subject: 'Thin ink underline — variant tinted toward swordsmanship teal',
      aspectRatio: '16:1',
      cropType: 'full-bleed',
      recommendedUse: 'Text link underline on Swordsmanship pages.',
      avoidUse: 'On characters or glossary pages.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
      notes: 'Used in SwordArtRegister filter buttons with hue-rotate(172deg) filter.',
    },

    // ─── Purchased UI Assets ─────────────────────────────────────────────────
    // These are purchased commercial-use textures and ornaments. Each needs
    // review against the design-engine role definitions before first use.
    // Listed here as p2/p3 because they require per-use review.

    {
      id: 'asset.panel-aged-parchment',
      filePath: '/images/ui/purchased/panel-aged-parchment-rolls.webp',
      role: 'background-wash',
      sectionFit: ['global'],
      mood: 'burnished',
      subject: 'Aged parchment panel texture — warm ivory with roll marks',
      aspectRatio: '4:5',
      cropType: 'full-bleed',
      recommendedUse: 'Section hero background wash or ledger sheet texture. Opacity 0.04–0.10.',
      avoidUse: 'As a card hero image.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
      notes: 'Requires per-use review. Purchased asset — commercial license confirmed.',
    },
    {
      id: 'asset.panel-ivory-manual',
      filePath: '/images/ui/purchased/panel-ivory-manual-sheet.webp',
      role: 'background-wash',
      sectionFit: ['global'],
      mood: 'elegiac',
      subject: 'Ivory manual sheet — clean paper surface for Swordsmanship manual slips',
      aspectRatio: '3:4',
      cropType: 'full-bleed',
      recommendedUse: 'ManualSlip paper surface. Opacity 0.06–0.12.',
      avoidUse: 'As a hero atmosphere.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.scroll-mountain-ink',
      filePath: '/images/ui/purchased/scroll-mountain-ink-wide.webp',
      role: 'background-wash',
      sectionFit: ['world', 'timeline', 'rankings'],
      mood: 'misty',
      subject: 'Mountain ink landscape scroll — misty mountains on parchment',
      aspectRatio: '16:5',
      cropType: 'full-bleed',
      recommendedUse: 'World or Timeline section hero background wash. Opacity 0.04–0.08.',
      avoidUse: 'As card art or portrait.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.scroll-ink-landscape',
      filePath: '/images/ui/purchased/scroll-ink-landscape-panel.webp',
      role: 'background-wash',
      sectionFit: ['world'],
      mood: 'pastoral',
      subject: 'Ink landscape panel — serene mountain-river scroll',
      aspectRatio: '16:9',
      cropType: 'full-bleed',
      recommendedUse: 'World section hero atmosphere layer. Opacity 0.04–0.08.',
      avoidUse: 'As card art.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.paper-cinnabar-speckle',
      filePath: '/images/ui/purchased/paper-cinnabar-speckle.webp',
      role: 'texture',
      sectionFit: ['rankings', 'swordsmanship'],
      mood: 'martial',
      subject: 'Cinnabar-speckled paper texture — red mineral flecks on aged paper',
      aspectRatio: '16:9',
      cropType: 'full-bleed',
      recommendedUse: 'Rankings or Swordsmanship ledger background texture. Opacity 0.03–0.06.',
      avoidUse: 'As a hero atmosphere.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.paper-jade-pattern',
      filePath: '/images/ui/purchased/paper-jade-pattern.webp',
      role: 'texture',
      sectionFit: ['characters', 'cultivation'],
      mood: 'celestial',
      subject: 'Jade-pattern paper texture — celadon wash with subtle pattern',
      aspectRatio: '16:9',
      cropType: 'full-bleed',
      recommendedUse: 'Characters or Cultivation section background texture. Opacity 0.03–0.06.',
      avoidUse: 'As a hero atmosphere.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.seal-irregular-large-blank-01',
      filePath: '/images/ui/purchased/seals/seal-irregular-large-blank-01.webp',
      role: 'seal-stamp',
      sectionFit: ['global'],
      mood: 'solemn',
      subject: 'Irregular large seal stamp blank — rough edges, uninscribed',
      aspectRatio: '1:1',
      cropType: 'center',
      recommendedUse: 'Base for SealStamp component — add text in post or via CSS.',
      avoidUse: 'As a card image or background.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
      notes: 'Design engine § 7 uses SVG-based SealStamp with feTurbulence noise. This is a fallback raster option.',
    },
    {
      id: 'asset.seal-square-rough-block-01',
      filePath: '/images/ui/purchased/seals/seal-square-rough-block-01.webp',
      role: 'seal-stamp',
      sectionFit: ['global'],
      mood: 'solemn',
      subject: 'Square rough-block seal — solid filled square seal',
      aspectRatio: '1:1',
      cropType: 'center',
      recommendedUse: 'SealStamp component base for sect/faction sigils.',
      avoidUse: 'As a card image.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.seal-oval-rough-01',
      filePath: '/images/ui/purchased/seals/seal-oval-rough-01.webp',
      role: 'seal-stamp',
      sectionFit: ['global'],
      mood: 'solemn',
      subject: 'Oval rough seal stamp blank',
      aspectRatio: '2:3',
      cropType: 'center',
      recommendedUse: 'SealStamp component base for character/realm status seals.',
      avoidUse: 'As a card image.',
      priority: 'p3',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.ink-title-stroke-long-01',
      filePath: '/images/ui/purchased/ink/ink-title-stroke-long-01.webp',
      role: 'section-divider',
      sectionFit: ['global'],
      mood: 'elegiac',
      subject: 'Long ink title stroke — horizontal brush mark for section headings',
      aspectRatio: '16:3',
      cropType: 'center',
      recommendedUse: 'Section divider between major page sections.',
      avoidUse: 'As a hero or card image.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.ink-title-stroke-long-04',
      filePath: '/images/ui/purchased/ink/ink-title-stroke-long-04.webp',
      role: 'section-divider',
      sectionFit: ['characters', 'world', 'cultivation'],
      mood: 'elegiac',
      subject: 'Long ink title stroke — variant 4',
      aspectRatio: '16:3',
      cropType: 'center',
      recommendedUse: 'Section divider for non-swordsmanship sections.',
      avoidUse: 'On Swordsmanship (use blade-slash dividers there).',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.ink-divider-thin-01',
      filePath: '/images/ui/purchased/ink/ink-divider-thin-01.webp',
      role: 'section-divider',
      sectionFit: ['global'],
      mood: 'elegiac',
      subject: 'Thin ink divider — hairline horizontal stroke',
      aspectRatio: '16:1',
      cropType: 'full-bleed',
      recommendedUse: 'Between subsections in dense ledger layouts.',
      avoidUse: 'As a hero or hover ornament.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.ink-corner-stain-01',
      filePath: '/images/ui/purchased/ink/ink-corner-stain-01.webp',
      role: 'hover-ornament',
      sectionFit: ['global'],
      mood: 'arcane',
      subject: 'Ink corner stain — decorative mark for corner placement',
      aspectRatio: '1:1',
      cropType: 'lower-third',
      recommendedUse: 'Corner ornament on section heroes or detail pages.',
      avoidUse: 'As a primary image.',
      priority: 'p3',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.ink-wash-cloud-soft-01',
      filePath: '/images/ui/purchased/ink/ink-wash-cloud-soft-01.webp',
      role: 'background-wash',
      sectionFit: ['global'],
      mood: 'misty',
      subject: 'Soft cloud ink wash — misty atmospheric cloud form',
      aspectRatio: '16:9',
      cropType: 'full-bleed',
      recommendedUse: 'Background wash for Pantheon or Teachings hero sections.',
      avoidUse: 'As card art.',
      priority: 'p2',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.ornament-corner-interlock-01',
      filePath: '/images/ui/purchased/ornaments/ornament-corner-interlock-01.webp',
      role: 'watermark',
      sectionFit: ['global'],
      mood: 'burnished',
      subject: 'Corner interlock ornament — meander border corner element',
      aspectRatio: '1:1',
      cropType: 'lower-third',
      recommendedUse: 'Corner watermark on detail pages.',
      avoidUse: 'As a hero or card image.',
      priority: 'p3',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },
    {
      id: 'asset.ornament-corner-meander-01',
      filePath: '/images/ui/purchased/ornaments/ornament-corner-meander-01.webp',
      role: 'watermark',
      sectionFit: ['global'],
      mood: 'burnished',
      subject: 'Meander corner ornament — Greek/fret border corner',
      aspectRatio: '1:1',
      cropType: 'lower-third',
      recommendedUse: 'Corner watermark for Pantheon or Artifacts detail pages.',
      avoidUse: 'As a hero or card.',
      priority: 'p3',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },

    // ─── Characters (PROVISIONAL — verify before use) ────────────────────────

    {
      id: 'asset.char-chen-pingan-portrait',
      filePath: '/images/characters/chen-pingan.webp',
      role: 'dossier-portrait',
      sectionFit: ['characters'],
      mood: 'solemn',
      subject: 'Portrait of Chen Ping\'an — primary protagonist',
      aspectRatio: '3:4',
      cropType: 'eyes-up',
      recommendedUse: 'Dossier plate portrait on Chen Ping\'an character detail page.',
      avoidUse: 'As a card thumbnail (use card-art role if cropped differently).',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
      notes: 'PROVISIONAL — verify this is an official or commissioned image. The characters/ folder only has 5 files total; these need individual curation review.',
    },
    {
      id: 'asset.char-ning-yao-portrait',
      filePath: '/images/characters/ning-yao.webp',
      role: 'dossier-portrait',
      sectionFit: ['characters'],
      mood: 'misty',
      subject: 'Portrait of Ning Yao — character',
      aspectRatio: '3:4',
      cropType: 'eyes-up',
      recommendedUse: 'Dossier plate portrait on Ning Yao character detail page.',
      avoidUse: 'As a card thumbnail.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
      notes: 'PROVISIONAL — verify official/commissioned. jpg variant exists; webp is preferred.',
    },
    {
      id: 'asset.char-qi-jingchun-portrait',
      filePath: '/images/characters/qi-jingchun.webp',
      role: 'dossier-portrait',
      sectionFit: ['characters'],
      mood: 'solemn',
      subject: 'Portrait of Qi Jingchun — character',
      aspectRatio: '3:4',
      cropType: 'eyes-up',
      recommendedUse: 'Dossier plate portrait on Qi Jingchun character detail page.',
      avoidUse: 'As a card thumbnail.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
      notes: 'PROVISIONAL — verify official/commissioned. jpg variant exists; webp is preferred.',
    },

    // ─── Timeline ───────────────────────────────────────────────────────────

    {
      id: 'asset.timeline-chen-pingan-black-gold',
      filePath: '/images/timeline/chen-pingan-black-gold-timeline.webp',
      role: 'background-wash',
      sectionFit: ['timeline'],
      mood: 'burnished',
      subject: 'Chen Ping\'an black and gold timeline illustration — timeline section wash',
      aspectRatio: '16:5',
      cropType: 'center',
      recommendedUse: 'Timeline section hero or ChronicleNode background wash.',
      avoidUse: 'As a card thumbnail.',
      priority: 'p1',
      curatedAt: '2026-06-20',
      curatedBy: 'design-engine-35b',
    },

  ],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const ASSET_MANIFEST_VERSION = manifest.version

/**
 * Get all assets matching a given role.
 */
export function getAssetsByRole(role: AssetRole): AssetEntry[] {
  return manifest.assets.filter((a) => a.role === role)
}

/**
 * Get all assets approved for a given section.
 */
export function getAssetsForSection(section: SectionFit): AssetEntry[] {
  return manifest.assets.filter((a) => a.sectionFit.includes(section) || a.sectionFit.includes('global'))
}

/**
 * Get hero atmosphere assets for a given section.
 */
export function getHeroAssetsForSection(section: SectionFit): AssetEntry[] {
  return manifest.assets.filter(
    (a) => a.role === 'hero-atmosphere' && (a.sectionFit.includes(section) || a.sectionFit.includes('global')),
  )
}

/**
 * Get all dossier portrait assets.
 */
export function getPortraitAssets(): AssetEntry[] {
  return manifest.assets.filter((a) => a.role === 'dossier-portrait')
}

/**
 * Get assets by priority.
 */
export function getAssetsByPriority(priority: Priority): AssetEntry[] {
  return manifest.assets.filter((a) => a.priority === priority)
}

/**
 * Get a single asset by its stable ID.
 */
export function getAssetById(id: string): AssetEntry | undefined {
  return manifest.assets.find((a) => a.id === id)
}

/**
 * Get all distinct moods across the manifest.
 */
export function getDistinctMoods(): Mood[] {
  return [...new Set(manifest.assets.map((a) => a.mood))]
}

/**
 * Get all roles that have at least one entry.
 */
export function getRolesInManifest(): AssetRole[] {
  return [...new Set(manifest.assets.map((a) => a.role))]
}

/**
 * Count of total assets in the manifest.
 */
export const ASSET_COUNT = manifest.assets.length
