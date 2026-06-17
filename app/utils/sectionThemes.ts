export type JianLaiSectionThemeId =
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
  | 'pantheon'
  | 'glossary'

export type JianLaiSectionIntensity = 'normal' | 'specialized' | 'showcase'

export type JianLaiSectionTheme = {
  id: JianLaiSectionThemeId
  label: string
  englishLabel: string
  routeHint: string
  documentMetaphor: string
  mood: string
  accentName: string
  recommendedUse: string
  intensityLevel: JianLaiSectionIntensity
}

export const jianLaiSectionThemes: readonly JianLaiSectionTheme[] = [
  {
    id: 'home',
    label: 'Home',
    englishLabel: 'Home',
    routeHint: '/',
    documentMetaphor: 'entrance pavilion / public frontispiece / wiki landing scroll',
    mood: 'broad mist, balanced paper, subtle seal, restrained cinematic welcome',
    accentName: 'mist blue-gray',
    recommendedUse: 'Use for broad entry composition, restrained welcome panels, and site-level orientation.',
    intensityLevel: 'showcase',
  },
  {
    id: 'characters',
    label: 'Characters',
    englishLabel: 'Characters',
    routeHint: '/characters',
    documentMetaphor: 'dossier archive / portrait registry',
    mood: 'ivory paper, jade accents, identity stamps, relationship threads, file-card hierarchy',
    accentName: 'registry jade',
    recommendedUse: 'Use for identity states, relationship cues, portrait-adjacent metadata, and dossier filters.',
    intensityLevel: 'specialized',
  },
  {
    id: 'world',
    label: 'World',
    englishLabel: 'World',
    routeHint: '/world',
    documentMetaphor: 'mountain-river atlas / gazetteer',
    mood: 'mist blue, river gray, pale green, map labels, location seals, atlas panels',
    accentName: 'river mist',
    recommendedUse: 'Use for atlas bands, location labels, map-like panels, and region navigation.',
    intensityLevel: 'specialized',
  },
  {
    id: 'cultivation',
    label: 'Cultivation',
    englishLabel: 'Cultivation',
    routeHint: '/cultivation',
    documentMetaphor: 'Dao chart / realm scripture',
    mood: 'celadon, pale gold, mist white, circular diagrams, rank seals, layered doctrine',
    accentName: 'celadon realm',
    recommendedUse: 'Use for realm ladders, doctrine layers, rank markers, and diagram-like groupings.',
    intensityLevel: 'specialized',
  },
  {
    id: 'swordsmanship',
    label: 'Swordsmanship',
    englishLabel: 'Swordsmanship',
    routeHint: '/swordsmanship',
    documentMetaphor: 'Sword Dao manual / sword archive',
    mood: 'steel blue-gray, ink black, brush slashes, cinnabar marks, sharp manual structure',
    accentName: 'steel ink',
    recommendedUse: 'Use for manual slips, blade-trace dividers, seal-marked records, and focused archive states.',
    intensityLevel: 'specialized',
  },
  {
    id: 'factions',
    label: 'Factions',
    englishLabel: 'Factions',
    routeHint: '/factions',
    documentMetaphor: 'mountain gate ledger',
    mood: 'dark jade, bronze, parchment, oath seals, gate plaques, affiliation records',
    accentName: 'mountain jade',
    recommendedUse: 'Use for affiliation ledgers, gate plaques, faction status, and oath-like grouping.',
    intensityLevel: 'specialized',
  },
  {
    id: 'artifacts',
    label: 'Artifacts',
    englishLabel: 'Artifacts',
    routeHint: '/artifacts',
    documentMetaphor: 'treasury catalogue / relic cabinet',
    mood: 'dark lacquer, antique gold, parchment, item plaques, cabinet labels, rare-object registry',
    accentName: 'lacquer gold',
    recommendedUse: 'Use for object registries, treasury shelves, rarity hints, and compact item plaques.',
    intensityLevel: 'specialized',
  },
  {
    id: 'timeline',
    label: 'Timeline',
    englishLabel: 'Timeline',
    routeHint: '/timeline',
    documentMetaphor: 'chronicle scroll / historical annals',
    mood: 'aged parchment, date seals, archive thread, quiet red marks, historical record',
    accentName: 'annal ochre',
    recommendedUse: 'Use for dated records, chronology markers, archival threads, and historical sequence.',
    intensityLevel: 'specialized',
  },
  {
    id: 'rankings',
    label: 'Rankings',
    englishLabel: 'Rankings',
    routeHint: '/rankings',
    documentMetaphor: 'ranking board / heavenly register',
    mood: 'imperial ledger, cinnabar ranking marks, vertical plaques, formal hierarchy',
    accentName: 'imperial ledger gold',
    recommendedUse: 'Use for ordered lists, tier labels, formal plaques, and low-drama rank emphasis.',
    intensityLevel: 'normal',
  },
  {
    id: 'teachings',
    label: 'Teachings',
    englishLabel: 'Teachings',
    routeHint: '/teachings',
    documentMetaphor: 'academy manuscript / lecture notes',
    mood: 'soft parchment, brush annotations, scholastic seals, calm blue-gray ink',
    accentName: 'scholar blue-gray',
    recommendedUse: 'Use for note-like layouts, manuscript annotations, reference passages, and calm reading states.',
    intensityLevel: 'normal',
  },
  {
    id: 'pantheon',
    label: 'Pantheon',
    englishLabel: 'Pantheon',
    routeHint: '/pantheon',
    documentMetaphor: 'divine registry / ancestral shrine record',
    mood: 'solemn ink, incense mist, shrine-like framing, restrained gold linework, reverent atmosphere',
    accentName: 'shrine gold',
    recommendedUse: 'Use for reverent record frames, divine registry cues, shrine-like separators, and solemn groupings.',
    intensityLevel: 'specialized',
  },
  {
    id: 'glossary',
    label: 'Glossary',
    englishLabel: 'Glossary',
    routeHint: '/glossary',
    documentMetaphor: 'lexicon slips / dictionary archive',
    mood: 'clean paper, small labels, annotation marks, restrained ink dividers, readable reference system',
    accentName: 'reference gray',
    recommendedUse: 'Use for compact definitions, label systems, alphabetic reference blocks, and quiet dividers.',
    intensityLevel: 'normal',
  },
] as const

export const jianLaiSectionThemeIds = jianLaiSectionThemes.map((theme) => theme.id)

export function findJianLaiSectionTheme(id: string) {
  return jianLaiSectionThemes.find((theme) => theme.id === id)
}
