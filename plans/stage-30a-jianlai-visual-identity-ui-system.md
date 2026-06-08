# Stage 30A: Jian Lai Visual Identity & UI Primitive Audit

## Summary
Create `plans/stage-30a-jianlai-visual-identity-ui-system.md` as an audit-only document. It should use `gpt-taste`, `high-end-visual-design`, and `redesign-existing-projects` as critique lenses only, with no code, content, schema, media, font, video, staging, Playwright, screenshot, or image-capture work.

Main finding: the frontend is structurally strong, but Characters, World, Factions, Swordsmanship, Cultivation, and Artifacts lean on the same pale-paper rhythm: large hero, right-side stats/slip, seal cluster, textured card/panel, filter chips, compact archive rows, and related portal cards. Timeline is the clearest distinct section because it commits to a dark black-gold chronicle rail.

QA already run for this audit:
- `git status --short`
- `git diff --name-only`

Working tree note to record: existing tracked changes are `content/timeline/_sample.md` deleted and `plans/stage-23a-timeline-architecture-audit.md` modified; many untracked files already exist, including `.agents/`, `.playwright-mcp/`, artifacts, videos, scripts, and prior audit files. No files were staged.

## Visual Language Map
- Homepage: portal hall / animated archive theatre; official media can be dominant, but portal cards need stronger section-specific frames.
- Timeline: black-gold chronicle wall / historical rail; lacquer-dark surface, gold rules, era rail glow, minimal pale paper.
- Cultivation: Dao ascent chart / realm ladder manual; stepped path geometry, bronze markers, numbered ascent, less archive-card language.
- Characters: dossier wall / relationship atlas; paper dossiers, stamped identity slips, lifted files, relationship thread lines.
- World: mountain-river gazetteer / map folio; atlas plates, map washes, geographic ledgers, pine/celadon rulework.
- Factions: mountain gate ledger / institution registry; registry rows, seal stamps, gate plaques, official ledger columns.
- Swordsmanship: opened sword manual / blade-trace scroll; manual margins, slash dividers, sword-silver glints, long slip surfaces.
- Artifacts: reliquary cabinet / treasure registry; framed relic plates, cabinet drawers, inventory tags, darker bronze/jade shadows.
- Techniques: technique formula slips / annotated move manual; compact vertical slips, brush annotations, sequence marks.
- Glossary / More: scribe index drawer; index tabs, dictionary slips, low-drama utility surfaces.

## Stage 30B Primitive Set
Build additive primitives first, preferably as root auto-imported components in `app/components` so names remain simple. Do not remove existing shared components yet.

| Primitive | Purpose | Metaphor | Use | Avoid | Asset Need |
| --- | --- | --- | --- | --- | --- |
| `SealButton` | Primary action | red seal plaque | hero CTAs, open featured record | filters, dense rows | CSS-only |
| `InkButton` | Secondary/tertiary action | brush underline | text links, quiet nav actions | primary commands | CSS-only |
| `JadeChip` | Filters/tags/relations | jade slip | categories, tags, safe related links | primary CTAs | CSS-only |
| `PendingRouteChip` | Missing/internal links | unfinished paper tab | unresolved route display | real links | CSS-only |
| `PaperSlip` | Small record surface | archival paper slip | character/world/faction rows | hero panels | CSS-only |
| `ManualSlip` | Sword/technique record surface | opened manual page | Swordsmanship feature/archive | generic portal cards | CSS-only |
| `LedgerRow` | Dense archive row | registry line | compact archives, faction/world lists | featured hero | CSS-only |
| `SealStatBlock` | Count/stat display | stamped accounting block | hero stats, section summaries | body prose | CSS-only |
| `InkFrame` | Section panel shell | inked border/paper frame | grouped content sections | nested card-in-card layouts | CSS-only |
| `BrushDivider` | General separator | brush rule | section breaks | Sword-only motion | CSS-only |
| `SwordSlashDivider` | Sword-only separator | blade trace | Swordsmanship and Techniques | World/Factions/Characters | CSS-only |
| `VerticalSealLabel` | Side label/kicker | vertical red register seal | section labels, manual margins | long English labels | CSS-only |
| `PortalCardFrame` | Homepage/related portals | route gate plaque | portal cards | archives | existing images optional |
| `RelicFrame` | Artifact image/card shell | reliquary cabinet | Stage 31 Artifacts | non-object sections | CSS-only first |

## Material, Image, And Motion Rules
- Paper: use as base reading material, not every panel. Vary paper by metaphor: manual paper for Swordsmanship, ledger paper for Factions, gazetteer paper for World.
- Ink: use for text, brush rules, and hover underlines. Avoid decorative ink wash on every card.
- Seal red: reserve for active states, stamps, focus rings, and primary seals. Do not make every chip red.
- Jade/celadon: use for relation/filter safety and World/Sword secondary accents. Avoid turning all pale pages into the same celadon theme.
- Bronze/gold: use for Timeline chronology, Cultivation markers, artifact metal, and official prominence. Avoid generic gold borders everywhere.
- Lacquer/dark ink: mainly Timeline and occasional dramatic media/CTA surfaces. Do not drop random dark panels into pale pages.
- Sword-silver: thin glints, blade-line dividers, edge highlights. Avoid broad gray SaaS cards.
- Official art: hero only when it is the page’s first-viewport subject; framed plate when inspectable; watermark only when non-essential and very subtle; archive thumbnails only when curated and meaningful; no image if a ledger row reads better as text and seal.
- Motion: transform/opacity only, always reduced-motion safe. Timeline gets rail glow/draw; Swordsmanship gets blade-line draw; Artifacts get relic glint/drawer reveal; Factions get seal stamp/ledger registration; Characters get dossier lift/thread reveal; World gets ink spread/map wash; Cultivation gets step ascent.

## Stage 30B Implementation Plan
1. Add global material tokens and the first primitives without changing page behavior: `SealButton`, `InkButton`, `JadeChip`, `PendingRouteChip`, `SealStatBlock`, `ManualSlip`, `LedgerRow`, `SwordSlashDivider`.
2. Apply primitives only to Swordsmanship 29B-2 first: update `SwordManualHero`, `SwordManualFeaturedSlip`, `SwordAssociationStrip`, and `SwordCompactArchive` to use manual/slash/jade/ledger language while keeping the same data flow and route safety.
3. Keep existing specialized pages intact. Do not refactor Characters, World, Factions, Cultivation, Timeline, or Artifacts in 30B except for shared primitive files that are not yet consumed by them.
4. Avoid touching `content.config.ts`, content markdown, `public/videos`, `public/fonts`, media library paths, and detail routes.
5. Preserve `RouteDisplayLink`, `createEntryResolver`, `resolvePublicImage`, `ScrollReveal`, `InkDivider`, and existing relationship utilities.

## Tests And Risks
- Stage 30B checks: run `npm run build`, `git status --short`, and `git diff --name-only`. Do not use Playwright or screenshots unless later explicitly allowed.
- Main risk: over-consolidating primitives could make pages even more similar. Mitigation: primitives must have section variants and strict “where not to use” rules.
- Main implementation risk: global CSS changes could alter existing pages. Mitigation: add tokens and new components first; apply only to Swordsmanship.
- Content risk: Swordsmanship still has sparse data. Do not imply a complete Sword Dao taxonomy, power ranking, lineage map, or technique hierarchy.
- Assumption: Stage 30A is an audit document only; Stage 30B is the first code stage and should be additive, reversible, and Swordsmanship-first.
