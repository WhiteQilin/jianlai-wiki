# Jian Lai Frontend Design Engine

**Stage 35A — Design Engine Blueprint**
**Status:** Master specification. Future section redesigns MUST conform.
**Scope:** Site thesis → section archetypes → material system → art placement → primitives → layout engines → content mapping → motion → roadmap → rubric.
**Out of scope for this stage:** Implementation of new components. Stages 35B–35G.

---

## 1. Design Thesis

### 1.1 What Jian Lai Wiki Is

Jian Lai Wiki is a **premium fan-made archive institution** for the novel/donghua *Jian Lai / Sword, Come!*. It is not a wiki, a documentation site, or a content blog. It is a **bound folio of martial and cosmological knowledge** — the kind a wandering scholar in the novel would carry: a sword manual in one leaf, a sect ledger in the next, a chronicle of the Heavens in the back.

Concretely, the product is:

- A **structured reference** for hundreds of characters, dozens of factions, cultivation systems, swords, artifacts, and eras.
- A **bilingual** (Chinese + English) encyclopedia that treats neither language as secondary.
- A **read-first** archive. Every visual decision exists to make the reader trust the source and stay in the lore.

### 1.2 What It Is Not

| Anti-reference | The wiki must NOT look like |
|---|---|
| Fandom.com / MediaWiki | Cluttered ad-driven layouts, default skins, "community portal" energy, "Recent changes" as a homepage motif. |
| VitePress / Docusaurus | Sidebar-first documentation, default monospace code samples, technical-template chrome. |
| Generic SaaS dashboard | App-shell, left-rail nav, data tables as default, sparkline metrics, indigo gradients. |
| Mobile game UI | Neon borders, glowing skill trees, gacha-style card reveals, energy beams, speed lines. |
| Purple-blue AI gradient | Glassmorphism, aurora, mesh-gradient backgrounds, "magical" blur washes. |
| Glossy card grid | Identical rounded cards with icon + heading + text repeated, gradient fills, hover-lift shadows by default. |
| Anime attack effects | Particles, sparks, slash-line transitions, parallax-on-scroll-for-its-own-sake. |

### 1.3 The North Star

**"The Sword Manual Folio."** Every page is a folio leaf. Every section is a chapter. Every entry is an inscription. The visual language draws from the physical materials of classical Chinese scholarship — **parchment, ink, cinnabar seal paste, celadon glaze, bronze fittings** — and from the document traditions they belong to (dossiers, gazetteers, ledgers, manuals, chronicles, tablets).

**The Five Commitments:**

1. **Material grammar.** Colors, textures, components derive from physical objects, not from a SaaS design system. Cinnabar is a substance, not a CSS variable.
2. **Chapter architecture.** Each section has its own accent, paper, ink, mood, and layout engine — while sharing structural DNA. A reader enters a new chapter, not a new website.
3. **Bilingual by structural choice.** Chinese and English are first-class. Chinese display text uses the calligraphy accent font. Neither is a translation afterthought.
4. **Earned motion.** Every animation has a semantic reason. No bounce, no elastic, no parallax that fights reading.
5. **Flat by default, depth by tone.** Shadows appear only as state responses. Depth hierarchy comes from paper tints and mist values, not z-axis lift.

### 1.4 The Three Failure Modes This Engine Prevents

1. **"Thin-border generic."** The current 1px gray border on a flat card. Banned.
2. **"Hero + grid + cards."** The default landing-page scaffold. Banned per section.
3. **"Section-agnostic identity."** Pages that look the same whether you're on Rankings or Pantheon. Banned — every section has its own document archetype.

---

## 2. Core Archive Concept

### 2.1 The Folio Metaphor

A real sword-manual folio has:

- A **cover page** (section hero) with calligraphy, ledger block, and atmospheric wash.
- **Section pages** (index pages) with a register of leaves, a table of categories, and a closing seal.
- **Leaf pages** (detail pages) with a running head, the entry inscription, marginalia, and a foot seal.
- **Inserts and annexes** (related entries, source notes, variant readings).

This translates to the IA as:

- **Section hero** (cover page) → first viewport of `/section/index.vue`
- **Index page** (section page) → register + filters + leaf list
- **Detail page** (leaf page) → running head + inscription + marginalia + foot seal
- **Cross-section inserts** (annexes) → `RelatedEntries`, `RelatedLinks`, source notes

### 2.2 The Chapter Architecture

Eleven chapters (one per section), one master index (the home page), one shared glossary. Each chapter is **self-contained** in identity but **open** in links — every entry may link to entries in any other chapter.

**The chapter palette is committed** in `app/utils/sectionThemes.ts` and `DESIGN.md` § 2. Every section applies its own `[data-jl-section="..."]` attribute at the page root, and the design system reads that attribute to set paper, ink, mist, accent, seal, and gold tokens.

**The chapter rules:**

- A page never carries the palette of another section.
- A page never bleeds chrome from another section (no cinnabar button on a Swordsmanship page; no slash motif on a Glossary page).
- The home page is its own chapter (the "Index Hall") with a neutral home palette.

### 2.3 The Document Traditions

Each section maps to a different physical document tradition. These are not visual styles for the same content — they are **different document types with different affordances**:

| Tradition | Section | Document function | Reader posture |
|---|---|---|---|
| Dossier / Identity Register | Characters | Identity record of a person | "Who is this?" |
| Atlas / Mountain-River Gazetteer | World | Geographic and cosmological record | "Where is this?" |
| Dao Ladder / Method Canon | Cultivation | Progression system and method lineage | "How does this work?" |
| Sword Manual / Blade Archive | Swordsmanship | Technique manual with annotations | "What is this art?" |
| Sect Ledger / Political Archive | Factions | Faction record, seats, allegiances | "Who is allied with whom?" |
| Treasure Catalogue / Reliquary Record | Artifacts | Object register, provenance, power | "What is this thing?" |
| Historical Chronicle / Time Rail | Timeline | Chronological event log | "When did this happen?" |
| Mountaintop Gazetted Registry | Rankings | Inscribed rank with verification | "Where does X stand?" |
| Scholar Lexicon | Glossary | Term definition with citations | "What does this mean?" |
| Doctrine Canon / School Tablet | Teachings | Philosophical school and lineage | "What is believed?" |
| Divine Office Registry | Pantheon | Deity register, domains, court | "Who presides here?" |

### 2.4 Reader Postures and Pacing

- **Discovery** (browsing an index) → cinematic, atmospheric, generous whitespace.
- **Lookup** (searching for a known entry) → immediate, structured, scannable.
- **Reading** (entry detail) → scholarly, calm, max 65–75ch, generous leading.
- **Comparison** (rankings, cultivation, factions) → ledger-mode, dense, with breathing room between groups.

---

## 3. Section Archetype Matrix

Every section is defined by 10 attributes. The matrix below locks these in. **A new section implementation is not a creative exercise — it is filling in the row.**

### 3.1 Characters — Dossier / Identity Register

| Attribute | Specification |
|---|---|
| **Document archetype** | Personal dossier leaf, identity register, scholar's annotated file. |
| **Visual metaphor** | A leaf pulled from a scholar's filing box, with a portrait vignette, a state-plate, and marginal notes. |
| **Material palette** | Sage-green mist, aged ivory paper, ink-wash portrait frame, cinnabar status stamp. |
| **Layout rhythm** | Wide-center prose with a right-rail infobox; portraits anchor the top; relationships as a hand-drawn margin list. |
| **Image role** | Portrait (3:4 aspect) is the dossier plate's anchor. Atmospheric wash sits behind the title, very low opacity. |
| **UI ornament type** | BrushTitle heading, SealBadge for status, CinnabarTag for affiliations, RegistryRow for relationships. |
| **Motion type** | Plate slow-fade on enter; relationships inscribe in a margin-list reveal. |
| **What to avoid** | Glassmorphism portrait overlays; identical 1:1 grid of avatars; rank-style progress bars for cultivation. |
| **Ideal index structure** | Section hero → "Identity Register" inscribed list with sage seal → DossierGrid (varied sizes by importance) → "Affiliation Clusters" board → "Recent Inscriptions" timeline strip. |
| **Ideal detail structure** | Running head with breadcrumb → name + Chinese in BrushTitle + status seal → DossierPlate (portrait + infobox stats) → prose body (sections: Overview, Appearance, Personality, Cultivation, Abilities, Relationships, Affiliations, Story, Trivia) → Cited References → Marginal Notes block. |

### 3.2 World — Atlas / Mountain-River Gazetteer

| Attribute | Specification |
|---|---|
| **Document archetype** | Imperial gazetteer (山岳志 / 山川志), scroll map, cosmological chart. |
| **Visual metaphor** | A scroll map with mountain ridges drawn in ink wash, location dots as small cinnabar seals, regions tinted by faction. |
| **Material palette** | Celadon-green ink, river-mist blue, aged-paper cream, cinnabar seal points. |
| **Layout rhythm** | Section hero (atlas) → world ledger panel → gazetteer scroll list (with cluster groups) → relational map strip. |
| **Image role** | Atmospheric wash at hero (low opacity); small ink-ridge illustration as section divider; portrait only on detail pages if a deity/ruler is featured. |
| **UI ornament type** | AtlasPanel for cluster groups, BrushTitle for headings, SealStamp for location dots, InkHoverLink for entries. |
| **Motion type** | Scroll-line draw on first view of the gazetteer; mist drift on hero banner (very subtle). |
| **What to avoid** | SVG world-map with marker pins (Google-Maps energy); tile-based location grids; identical card list of every location. |
| **Ideal index structure** | WorldAtlasHero (banner + ledger panel + 4 seal-marks drift) → "Mountains & Rivers" gazetteer scroll → "Heavens & Grottoes" cluster group → "Walls & Crossings" inventory → "Atlas Clusters" relational board → CTA to a printable scroll map. |
| **Ideal detail structure** | Running head → Chinese name in calligraphy → location-type seal → type strip (Heaven / Continent / City / Wall / Grotto) → prose body → "Governance & Affiliation" inscription panel → "Associated Records" relationship list → source chapter citations. |

### 3.3 Cultivation — Dao Ladder / Method Canon

| Attribute | Specification |
|---|---|
| **Document archetype** | Cultivation canon (道藏), method lineage tree, ladder diagram. |
| **Visual metaphor** | A vertical ladder drawn in single-stroke ink, rungs labeled with realms; lineage charts as branching hand-drawn lines. |
| **Material palette** | Sage-green accent, ivory paper, ink-wash mist, cinnabar for "ascended" markers. |
| **Layout rhythm** | Section hero → RealmLadder (full vertical ladder) → method canon (categorized ledger) → path comparison table. |
| **Image role** | No portraits. Atmospheric wash on hero only. Ink-line illustrations of symbols (sword, talisman, seal) as icons. |
| **UI ornament type** | RealmBadge, LedgerTab, SealStamp, CinnabarTag. |
| **Motion type** | Ladder rungs reveal top-to-bottom (staggered 60ms). Lineage lines draw on enter. |
| **What to avoid** | Skill tree nodes connected by angled lines (mobile game); glowing progression bars; 3D ascending path. |
| **Ideal index structure** | Section hero with "Dao Ladder" copy → RealmLadder component (canonical vertical diagram) → "Method Canons" categorized ledger (groups by school) → "Path Comparison" panel for similar/competing methods → CTA to a printable ladder chart. |
| **Ideal detail structure** | Running head → method name in calligraphy → school seal → "Realm" inscription strip → "Origin" + "Lineage" inscription → prose body → "Step-by-Step" numbered manual (using BrushUnderline numbers) → "Risks & Taboos" inscribed warnings → cited references. |

### 3.4 Swordsmanship — Sword Manual / Blade Archive

| Attribute | Specification |
|---|---|
| **Document archetype** | Sword manual (剑谱) with annotated diagram, blade tang inscriptions, marginalia. |
| **Visual metaphor** | An open sword manual; the spine is the page, the left leaf is the manual proper, the right leaf is the annotated margin. |
| **Material palette** | Steel-blue ink, mist-blue paper, cinnabar for active state, jade-green for derived arts. |
| **Layout rhythm** | Section hero (Blade Dao Manual) → SwordArtRegister (dense ledger) → SwordManualHero per art → annotations and exits. |
| **Image role** | Slip-art (single hero illustration per sword art) at 960×1440 ideal. Slash-line dividers between sections. |
| **UI ornament type** | ManualSlip, SwordRecordSlip, BladePathRail, ManualAnnotationPanel, SwordManualRelatedExits. |
| **Motion type** | Slash-line draws on section dividers. ManualSlip fades + slides 8px. |
| **What to avoid** | Card grid of sword arts; Gantt-chart-style ability comparison; energy-beam effects on hover. |
| **Ideal index structure** | SwordDaoManualHero (the spine view) → SwordArtRegister (dense ledger with category filters) → "Recent Manual Entries" strip → "Annotated by the Editor" panel → CTA. |
| **Ideal detail structure** | Running head → art name in BrushTitle with classification seal → ManualSlip (hero illustration + side annotations) → "Forms" annotated panel → "Known Practitioners" ledger → "Related Arts" exits → cited chapter references. |

### 3.5 Factions — Sect Ledger / Political Archive

| Attribute | Specification |
|---|---|
| **Document archetype** | Sect ledger (宗门簿), seat map, political archive. |
| **Visual metaphor** | A political archive with a sect seal, a seat map of influence, and a roster of named positions. |
| **Material palette** | Deep jade-green accent, aged-ivory paper, ink-wash mist, cinnabar for contested seats. |
| **Layout rhythm** | Section hero → seat ledger → seat map visualization → faction registry → affiliation board → prominence ledger. |
| **Image role** | Sect seal image (square, 1:1, with noise) on detail pages. No portraits. |
| **UI ornament type** | FactionSeatLedger, FactionRegistryHero, FactionCompactArchive, FactionAffiliationBoard, FactionProminenceLedger. |
| **Motion type** | Seat marks reveal in a circular sweep on the seat map. |
| **What to avoid** | Org-chart tree with rounded nodes; data-table of members; generic "team" grid. |
| **Ideal index structure** | FactionRegistryHero (with sect seal watermark) → "Seat Ledger" panel → "Faction Compact Archive" (categorized cards with sect seal) → "Affiliation Board" (relational visualization) → "Prominence Ledger" (ranked factions). |
| **Ideal detail structure** | Running head → sect name in calligraphy → sect seal at large → "Tenets & Doctrine" prose → "Seats & Offices" inscription panel → "Members" roster with linked names → "Affiliations & Rivalries" panel → "Notable Events" time-rail excerpt → cited references. |

### 3.6 Artifacts — Treasure Catalogue / Reliquary Record

| Attribute | Specification |
|---|---|
| **Document archetype** | Reliquary catalogue (宝器录), provenance record, appraisal certificate. |
| **Visual metaphor** | A curio dealer's catalogue, with each item on its own page, a provenance ribbon, and a small woodblock illustration. |
| **Material palette** | Antique-bronze accent, aged-ivory paper with deeper cream, ink-wash mist, cinnabar for danger-tier. |
| **Layout rhythm** | Section hero → grade-tinted filter tabs → reliquary card list (varied size by grade) → provenance timeline. |
| **Image role** | Object illustration (1:1 or 4:5) is the primary identity. Atmospheric wash only on detail hero. |
| **UI ornament type** | RelicCard, CinnabarTag (for grade), ImageWashFrame, SectionDivider (sword, jade, bronze variants). |
| **Motion type** | Card slow-fade on enter; provenance line draws on view. |
| **What to avoid** | Gacha-style reveal animation; glowing aura around objects; identical 1:1 thumbnail grid. |
| **Ideal index structure** | Section hero with "Reliquary" copy → grade filter (Heavenly / Earthly / Mortal) with chip variants → RelicCard list (varied size by grade — Heavenly at 2×2, Earthly at 1×2, Mortal at 1×1) → "Provenance Roll" provenance timeline → CTA. |
| **Ideal detail structure** | Running head → object name in BrushTitle → grade seal at large → ImageWashFrame with 4:5 aspect illustration → "Materials" inscription strip → "Recorded Powers" panel → "Provenance" line-draw timeline → "Current Bearer" (if any) → cited references. |

### 3.7 Timeline — Historical Chronicle / Time Rail

| Attribute | Specification |
|---|---|
| **Document archetype** | Imperial chronicle (编年史), date rail, era banner. |
| **Visual metaphor** | A vertical or horizontal rail with era banners, event nodes, and a year-axis. |
| **Material palette** | Bronze accent, warm aged-paper, ink-wash mist, cinnabar for "decisive" events. |
| **Layout rhythm** | Cinematic hero (TimelineCinematicHero) → Time Rail → chronicle nodes → related entries. |
| **Image role** | Hero atmosphere art on the cinematic hero. No portraits on individual events. |
| **UI ornament type** | ChronicleNode, TimelineRail, TimelineChronicleRail, TimelineAmbientLayer. |
| **Motion type** | Rail line draws on first view; nodes reveal in sequence. |
| **What to avoid** | Vertical timeline as a single line with circle markers (Figma default); decade ribbons as colored bars; animated counters as parallax. |
| **Ideal index structure** | TimelineCinematicHero (atmosphere art + era summary) → TimelineChronicleRail (era bands with event nodes) → "Decisive Events" highlight panel → "Era Comparisons" side panel. |
| **Ideal detail structure** | Running head → event title in BrushTitle with date seal → "Era Context" inscription panel → prose body → "Principals Involved" roster → "Causes" + "Consequences" split panel → cited chapter references. |

### 3.8 Rankings — Mountaintop Gazetted Registry

| Attribute | Specification |
|---|---|
| **Document archetype** | Mountaintop gazette (山巅昭告榜), inscribed register, verification memo. |
| **Visual metaphor** | A formal inscribed register, posted on a mountain wall, with seal marks and editorial notes for contested entries. |
| **Material palette** | Antique-bronze accent, deep-ivory paper, ink-wash mist, cinnabar for "removed from record" state. |
| **Layout rhythm** | Section hero (Mountaintop Registry) → register panel with kicker + count + 榜 seal → ledger rows by category. |
| **Image role** | Hero atmosphere art (mountain banner) for the section hero. No portraits on detail pages. |
| **UI ornament type** | RankingRegister (the gazetted panel), RankingRegisterRow (inscribed row), RankingLedgerRow (compact row), RankingContextBar (editor's meta strip). |
| **Motion type** | Seal stamp animation on first view of a register panel (the 榜 character stamps in with a brief scale + opacity). |
| **What to avoid** | Leaderboard with arrows, score deltas, "rising/falling" charts, "Rank #1" podium styling, sortable column tables. |
| **Ideal index structure** | Section hero with "Mountaintop Gazetted Registry" copy → RankingContextBar (editor's meta) → list of registers (Realm-Ladder / Named-List / Tier-List) as inscribed cards → "Disputed Placements" callout. |
| **Ideal detail structure** | Running head → list name in BrushTitle with category seal → "Criteria" inscription panel → the ranking register (only on this page, not duplicated in a sidebar) → "Disputed / Unverified" callout (only if applicable) → "Editorial Notes" → cited references. **Do not render the full register above the title — that breaks reading flow.** |

### 3.9 Glossary — Scholar Lexicon

| Attribute | Specification |
|---|---|
| **Document archetype** | Scholar lexicon (辞书), term card, etymology strip. |
| **Visual metaphor** | A scholar's lexicon, with each term in a definitional cell, an etymology strip, and a citation footer. |
| **Material palette** | Cool stone-gray accent, ivory paper, ink-wash mist, cinnabar for "deprecated term" marker. |
| **Layout rhythm** | Section hero → search-first filter strip → term list (alphabetical with radical index for Chinese) → detail definition. |
| **Image role** | No images. Type-only page. Symbols appear as inline ink-line illustrations at most. |
| **UI ornament type** | BrushUnderline, InkHoverLink, CinnabarTag, PaperSlipCard. |
| **Motion type** | Underline draws on hover only. No entrance animation per term. |
| **What to avoid** | Card grid of terms; alphabetical sidebar; definition tooltips; "popular terms" cloud. |
| **Ideal index structure** | Section hero with "Scholar Lexicon" copy → search filter strip (in-line, not modal) → "Radical Index" for CJK lookup → alphabetical term list with BrushUnderline accents on first-letter markers → CTA. |
| **Ideal detail structure** | Running head → term in BrushTitle with reading in calligraphy → "Etymology" inscription strip → "Definition" prose → "First Appearance" inscription → "Cited In" chapter list → related terms (small link list). |

### 3.10 Teachings — Doctrine Canon / School Tablet

| Attribute | Specification |
|---|---|
| **Document archetype** | Doctrine tablet (学派碑), canonical text, school lineage. |
| **Visual metaphor** | A stone tablet inscription of a school's tenets, with a school seal and a lineage roll. |
| **Material palette** | Bronze accent (different from Factions), aged-ivory paper, ink-wash mist, cinnabar for "revised doctrine" markers. |
| **Layout rhythm** | Section hero → school tablet with inscribed tenets → lineage roll → comparative doctrines panel. |
| **Image role** | No images. Type-only or simple ink-line school sigil. |
| **UI ornament type** | DoctrineTablet, SealStamp (for school sigil), CinnabarTag, RegistryRow. |
| **Motion type** | Tablet inscription reveal (lines appear in sequence, 80ms stagger). |
| **What to avoid** | Quote-card grid; philosophy-card grid; "What we believe" template with three icon columns. |
| **Ideal index structure** | Section hero with "Doctrine Canon" copy → "Schools" tablet list (each school as an inscribed card) → "Lineage Roll" (chronological evolution) → "Comparative Doctrines" panel. |
| **Ideal detail structure** | Running head → school name in BrushTitle → school sigil seal → "Tenets" inscribed in numbered lines (no, NOT "01/02/03" — use BrushUnderline numerals with Chinese ordinals 壹 贰 叁) → "Origin Story" prose → "Lineage" roll → "Notable Adherents" roster → cited references. |

### 3.11 Pantheon — Divine Office Registry

| Attribute | Specification |
|---|---|
| **Document archetype** | Divine office registry (神职簿), court roll, domain assignment. |
| **Visual metaphor** | A celestial court's roster, with divine offices, domains, and a hierarchy of thrones. |
| **Material palette** | Deep bronze, ivory paper with a slight gold tint, ink-wash mist, cinnabar for "enthroned / deposed" markers. |
| **Layout rhythm** | Section hero → court roll (ranked deities) → domain assignments → associated myths. |
| **Image role** | No portraits. Atmospheric wash on hero only. |
| **UI ornament type** | DoctrineTablet (variant), CinnabarTag, SealStamp, RegistryRow. |
| **Motion type** | Throne-rank reveal (top-to-bottom stagger 80ms). |
| **What to avoid** | Deity card grid with halo glow; power-stat bars; "tier list" framing. |
| **Ideal index structure** | Section hero with "Divine Office Registry" copy → "Court Roll" ranked panel → "Domains" categorized group → "Myths & Festivals" cultural-archive panel. |
| **Ideal detail structure** | Running head → deity name in BrushTitle → "Office" inscription panel → "Domain" inscription panel → "Court Standing" inscription (with cinnabar marker for enthroned/deposed/banished) → prose body → "Associated Cults" → cited references. |

---

## 4. Material System

Thirteen materials. Each has a **place**, a **role**, and a **never-elsewhere rule**.

| Material | Place | Role | Never elsewhere |
|---|---|---|---|
| **Ink (墨)** | Body type, dividers, frame rules, captions. | The universal substrate. Anything that reads as "written" is ink. | Never used as a saturated background or as a fill for cards. |
| **Paper (纸)** | Section page bg, infobox bg, ledger sheet bg. | The surface. | Never a strong color; never more than 8% chroma from its section's hue. |
| **Seal (印泥)** | Active state, link hover, status stamp, signature element. | Authority. Used on ≤10% of any screen. | Never as a wash, never as a card bg, never as a section's main accent (cinnabar is the rarity, not the theme). |
| **Bronze (铜)** | Borders, frame rules, list bullets, ornament edges. | The metal of fittings. | Never for primary actions; never as a body text color (legibility risk). |
| **Jade (玉)** | Tags, chips, status indicators, secondary buttons. | The scholar's desk object. | Never for body text; never as a background wash. |
| **Steel (钢)** | Swordsmanship accent, blade line, slash divider. | The metal of the sword. Swordsmanship only. | Never in Characters, Factions, Teachings, Pantheon. |
| **Mist (雾)** | Borders, dividers, tonal depth, paper-to-paper transitions. | Atmospheric depth. | Never as a fill for active states. |
| **Cloth (帛)** | Background atmospheric washes, hero banners. | The textile of scroll covers and banners. | Never as a card surface. |
| **Wood (木)** | Tab backgrounds, table headers, ledger frames. | The substrate of tablets. | Never for primary actions. |
| **Scroll (卷)** | Long-form content surfaces, prose body wrapper. | The container of long reading. | Never for short snippets. |
| **Ledger (册)** | Data-rich lists (rankings, registries, rosters). | The spine of dense reference. | Never for prose. |
| **Blade light (剑光)** | A single 1px line or hairline stroke, always horizontal, in Swordsmanship only. | The line of a sword. | Never vertical, never thick, never outside Swordsmanship. |
| **Mountain wash (山影)** | Hero atmospheric backgrounds, ink-ridge silhouettes. | The far landscape. | Never inside cards; never as a hover background. |

### 4.1 Material-Placement Rules

- **Cinnabar rule:** ≤10% of any viewport surface. Used on link hover, active state, status seal, the rare blockquote border. Its rarity is the point.
- **Section chapter rule:** Each page's palette is exactly the section's tokens. No bleeding from sibling sections.
- **Tinted-neutral rule:** Mist and paper tints are pulled 0.005–0.015 toward the section's hue, never toward generic warmth.
- **No stacked materials:** A card surface is paper, not paper + cloth. A button is ink-on-paper, not seal-on-bronze. Stacking erodes the material grammar.

### 4.2 Material-to-Component Map (the quick lookup)

| Component | Material(s) |
|---|---|
| `OrnamentalButton` (primary) | Ink-on-paper |
| `SealButton` | Seal-on-paper |
| `LedgerTab` active | Jade on wood |
| `ArchiveTab` inactive | Ink-on-paper (transparent) |
| `PaperSlipCard` | Paper with mist border |
| `DossierPlate` | Paper + ink-wash portrait + cinnabar status |
| `ImageWashFrame` | Paper + cloth wash + bronze edge |
| `SectionDivider` | Bronze rule + mist gap |
| `SealStamp` | Seal (cinnabar) on paper |
| `RegistryRow` | Ink on ledger |
| `ManualSlip` | Scroll + blade light + ink |
| `ChronicleNode` | Paper + bronze node + ink line |
| `AtlasPanel` | Paper + cloth wash + seal dots |
| `RelicCard` | Paper + bronze edge + cinnabar tier marker |
| `DoctrineTablet` | Wood tablet + ink inscription + seal sigil |

---

## 5. Official Art Placement Engine

Eleven roles. For each, the ideal aspect ratio, opacity, crop, mobile, contrast, and "do-not-use" rule. **This is the single source of truth for placing `public/images/characters/`, `public/images/banners/`, `public/images/portalcard/`, `public/images/timeline/`, and the curated subset of `public/images/weibo-draft/`.**

### 5.1 Roles

#### 5.1.1 Hero Atmosphere Art

- **Use:** Section hero background wash. Full-bleed, behind the title.
- **Ideal aspect ratio:** 16:9 (desktop), 4:5 (mobile).
- **Opacity:** 0.18–0.28. Never higher. Never full-saturation.
- **Crop:** `object-fit: cover; object-position: center top;` to keep faces in frame on narrow viewports.
- **Mobile:** Disable `background-attachment: fixed` (causes jank). Use a smaller, tighter crop variant if available.
- **Contrast:** Title must have ≥4.5:1 against the visible image. Use a directional gradient (`linear-gradient(90deg, paper 0%, transparent 50%, paper 100%)`) where the title sits.
- **Do not use:** As a card thumbnail. As a list-row image. As an inline figure in prose.

#### 5.1.2 Dossier Portrait

- **Use:** Character detail page. Anchors the infobox.
- **Ideal aspect ratio:** 3:4 (portrait orientation). Square crops are acceptable for 1:1 sigil use.
- **Opacity:** 100% inside the frame. Frame border at 1px ink, inner 4px frame at 30% opacity.
- **Crop:** `object-fit: cover; object-position: center 20%;` (eyes-up bias).
- **Mobile:** Maintain 3:4 on portrait phones. On landscape phones (>700px tall), 1:1 is fine.
- **Contrast:** Frame must isolate the portrait from the page bg. A 4-px inner border + a paper-soft inset shadow is the only shadow allowed on a portrait frame.
- **Do not use:** As a card hero. As a list-row thumbnail. In a square aspect for any other purpose.

#### 5.1.3 Card Art

- **Use:** `DossierCard`, `RelicCard`, `FactionCompactArchive` card hero.
- **Ideal aspect ratio:** 4:5 (slightly portrait). 1:1 acceptable.
- **Opacity:** 100% inside the card; the card's bottom edge fades to paper via a 0%→80% gradient overlay (top of fade at 60% of card height).
- **Crop:** `object-fit: cover; object-position: center 30%;` (subject-up).
- **Mobile:** 4:5 on portrait, 1:1 on landscape.
- **Contrast:** Card body text sits on paper, not on the image, so contrast is with paper.
- **Do not use:** As a hero atmosphere. As a section banner.

#### 5.1.4 Background Wash (cloth/ink)

- **Use:** Decorative bg behind prose, behind a register, behind a tablet. Never carries information.
- **Ideal aspect ratio:** Any (will be cropped or tiled).
- **Opacity:** 0.04–0.10. Never higher.
- **Crop:** N/A (tiled or full-bleed).
- **Mobile:** Same.
- **Contrast:** Invisible. The text sits above it with full opacity.
- **Do not use:** As a section hero (use Hero Atmosphere for that). As a card bg (use Paper). As a hover state.

#### 5.1.5 Watermark

- **Use:** Behind section titles, behind the `榜` register seal mark, behind a doctrinal tablet.
- **Ideal aspect ratio:** 1:1 (sigils) or 4:5 (calligraphy).
- **Opacity:** 0.06–0.16. The watermark is felt, not seen.
- **Crop:** Centered.
- **Mobile:** Slightly higher opacity (0.10–0.18) because the screen is smaller.
- **Contrast:** Negative. The watermark is darker on light, lighter on dark.
- **Do not use:** As a primary content image. As a button ornament.

#### 5.1.6 Section Divider

- **Use:** Between major sections on a detail page. A horizontal ink line, possibly with a centered motif.
- **Ideal aspect ratio:** 16:5 (wide strip). The motif occupies the center 10% of the width.
- **Opacity:** 0.30–0.55 on the motif, 0.10–0.20 on the line.
- **Crop:** Centered motif, full-width line.
- **Mobile:** Same.
- **Contrast:** Hairline ink at 30% opacity, motif at 50% opacity.
- **Do not use:** Between every paragraph (use InkDivider for that). As a hero.

#### 5.1.7 Hover Ornament

- **Use:** Image that appears on hover of a card or row (e.g., a slash-line on a sword-art row, a brush-streak on a ledger row).
- **Ideal aspect ratio:** Designed for the surface it overlays.
- **Opacity:** 0.0 → 0.85 on hover. Transition 220–280ms.
- **Crop:** Anchored to the row.
- **Mobile:** Replace with a static low-opacity (0.15) base, no hover transition.
- **Contrast:** Always low contrast — hover ornament is decorative, not informational.
- **Do not use:** As a primary identifier. As a click target.

#### 5.1.8 Button Ornament

- **Use:** Inside an `OrnamentalButton` or `SealButton` — a small icon, character, or motif.
- **Ideal aspect ratio:** 1:1.
- **Opacity:** 100% (it's part of the button's identity).
- **Crop:** N/A.
- **Mobile:** Same.
- **Contrast:** Must be 4.5:1 against the button bg.
- **Do not use:** As a card image. As a section icon.

#### 5.1.9 Seal / Stamp Support

- **Use:** SVG / PNG used as the backplate of a `SealStamp` or `SealBadge`.
- **Ideal aspect ratio:** 1:1 (square stamp) or 2:3 (rectangle, vertical writing).
- **Opacity:** 100%, with feTurbulence noise at 15% on top.
- **Crop:** N/A.
- **Mobile:** Same.
- **Contrast:** Cinnabar fills at 100%; paper-colored text at 100%.
- **Do not use:** As a watermark. As a divider.

#### 5.1.10 Texture

- **Use:** `public/images/textures/ink-wash-01.webp` and `ink-wash-02.webp` applied at very low opacity behind a card, behind a ledger, behind a hero, behind a frame.
- **Ideal aspect ratio:** N/A (tile or cover).
- **Opacity:** 0.02–0.06. Never higher.
- **Crop:** `background-size: cover`.
- **Mobile:** Same.
- **Contrast:** Negative. Pure texture.
- **Do not use:** As a hero. As a section divider. As a card hero.

#### 5.1.11 Unusable / Archive Only

- **Use:** Stored in `public/images/weibo-draft/`, `public/images/banner-draft/`, `public/images/design-references/`. Not deployed. **These folders are not part of the live frontend pipeline.**
- **Do not use:** Anywhere in the live frontend. They exist as the curation pool.

### 5.2 The Master Rule

> **The image must be classified into exactly one role. If it serves two roles, it goes nowhere — drop it from the manifest.**

A weibo screenshot of a real person is unusable. A clean character portrait is `Dossier Portrait`. A wide mountain banner is `Hero Atmosphere`. A sword-illustration is `Card Art` (if the art is clean) or `Unusable` (if it's a screenshot with chat bubbles). The classification is the decision.

---

## 6. Asset Manifest Proposal

A TypeScript module that becomes the single source of truth for what image serves what role on what page. Replaces the current "scan a folder and pray" workflow.

### 6.1 Schema (TypeScript)

```ts
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
  id: string                        // 'asset.char-chen-pingan-portrait'
  filePath: string                  // '/images/characters/chen-pingan.webp'
  role: AssetRole
  sectionFit: SectionFit[]          // which sections this asset is allowed in
  mood: Mood
  subject: string                   // 'portrait of Chen Ping\'an in scholar robes'
  aspectRatio: string               // '3:4'
  cropType: CropType
  recommendedUse: string            // 'dossier plate on /characters/chen-pingan'
  avoidUse: string                  // 'hero atmosphere (too tight a crop)'
  priority: 'p0' | 'p1' | 'p2' | 'p3'  // p0 = required for launch, p3 = nice-to-have
  curatedAt: string                 // ISO date
  curatedBy: string                 // curator handle
  notes?: string
}

export interface AssetManifest {
  version: string
  assets: AssetEntry[]
}
```

### 6.2 Workflow

1. **Curation pass.** A curator walks `weibo-draft/`, `banner-draft/`, and any other raw pool. For each candidate, they fill the schema. They assign exactly one `role`. If it doesn't fit a role, it goes in `unusable`.
2. **Validation pass.** A second pass checks aspect ratio matches the role's spec, contrast meets 4.5:1, and `sectionFit` doesn't violate the chapter rule.
3. **Promotion.** Curated assets move from `weibo-draft/` to `characters/`, `banners/`, etc., with a manifest entry added.
4. **Consumption.** Components read from the manifest, not from the filesystem. A new component asks "give me all `dossier-portrait` assets for `characters`" — it gets a typed list.

### 6.3 Initial Targets (for Stage 35B)

- 30+ character portraits (`dossier-portrait`)
- 11+ hero atmospheres (one per section)
- 20+ card arts (artifacts, sword arts, factions)
- 8+ section dividers (one per section's blade/brush/jade motif)
- 12+ textures and washes (extension of the existing `ink-wash-01/02`)
- Mark all `weibo-draft/` and `banner-draft/` assets as `unusable` until curated.

### 6.4 Storage Location

- Manifest: `app/utils/assetManifest.ts` (typed module, importable)
- Curated pool: `public/images/{characters,banners,artifacts,factions,swordsmanship,timeline,wash,seal}/`
- Raw pool (not deployed): `public/images/{weibo-draft,banner-draft,design-references}/` (these stay, but no component imports from them)

---

## 7. UI Primitive System

Seventeen primitives. Each has a **purpose**, **where used**, **visual grammar**, **CSS/SVG strategy**, **section variants**, **motion**, and **a11y** notes.

### 7.1 InkButton

- **Purpose:** Inline link or compact action that lives in prose.
- **Where used:** "Read more," "Cite source," inline navigation in body text.
- **Visual grammar:** Mono font, 0.74rem, no background, dual-line brush underline (ink base 26% + cinnabar→teal gradient 34% expanding to 100% on hover).
- **Strategy:** Vue component with `to` prop. Pseudo-element `::after` for the gradient.
- **Section variants:** None — color is always cinnabar→teal across sections.
- **Motion:** Underline scaleX 220ms ease-out.
- **A11y:** Standard `<a>` semantics. Focus ring 2px cinnabar.

### 7.2 SealButton

- **Purpose:** Primary action that warrants a stamp (rare, used in hero CTAs and verification actions).
- **Where used:** Hero CTAs, "Submit Verification," "Add to Register."
- **Visual grammar:** Irregular border-radius (2px 4px 3px 2px), cinnabar fill, paper text, feTurbulence noise at 15%, optional Chinese character on the right.
- **Strategy:** Vue component. SVG noise as a base64 data-URI background.
- **Section variants:** Cinnabar always (the rarity is the point).
- **Motion:** Stamp-in on enter (scale 0.92 → 1.0, opacity 0 → 1, 280ms ease-out).
- **A11y:** `<button>` semantics. Focus ring 2px ink at 2px offset.

### 7.3 ArchiveTab

- **Purpose:** A "navigate the archive" tab (e.g., Characters / World / Cultivation on a cross-section page).
- **Where used:** The shared sub-nav on a section's index, the global header.
- **Visual grammar:** Mono font, 0.7rem, uppercase, 1px ink underline at 30% base width, expanding to 100% cinnabar on active/hover.
- **Strategy:** Vue component. Pseudo-element `::after` for underline.
- **Section variants:** None — text changes, not color.
- **Motion:** Underline scaleX 220ms ease-out.
- **A11y:** `role="tab"`, `aria-selected`, arrow-key navigation.

### 7.4 LedgerTab

- **Purpose:** A "filter by category" tab (e.g., Sword Art category filter).
- **Where used:** Index pages with category filters (Swordsmanship, Factions, Artifacts).
- **Visual grammar:** Padded, 1px border, mist-light bg, mono font, small underline image on active.
- **Strategy:** Vue component. Active state toggles a `is-active` class.
- **Section variants:** Tints to section's accent in the border and active underline.
- **Motion:** 220ms ease-out on hover, no entrance animation.
- **A11y:** `role="tab"`, `aria-pressed`.

### 7.5 BrushUnderline

- **Purpose:** A short, deliberate accent under a word or short phrase in a heading.
- **Where used:** Hero titles, hero kickers, hand-marked emphases.
- **Visual grammar:** A 2-4px stroke with a feTurbulence-distorted edge, drawn from a generated SVG.
- **Strategy:** CSS background-image (SVG) on `::after`.
- **Section variants:** Tints to section accent.
- **Motion:** Optional draw-in on enter (scaleX 0 → 1, 320ms).
- **A11y:** Purely decorative. `aria-hidden`.

### 7.6 CinnabarTag

- **Purpose:** A small status or category tag, used sparingly.
- **Where used:** "Status: Alive," "Grade: Heavenly," "Era: Warring States."
- **Visual grammar:** 1px cinnabar border, cinnabar text, paper bg, 0.65rem mono, 2px 4px 3px 2px border-radius.
- **Strategy:** Vue component with `tone` prop (default cinnabar, optional jade for affiliation, optional bronze for grade).
- **Section variants:** Tints to section accent for the border + text.
- **Motion:** None.
- **A11y:** `<span>` with a `title` for full text if truncated.

### 7.7 PaperSlipCard

- **Purpose:** The default card — a small, paper-textured, bordered surface. Replaces the generic "1px gray border card."
- **Where used:** Anywhere a card is needed but a section-specific card (DossierPlate, RelicCard) doesn't apply.
- **Visual grammar:** Paper bg, mist border, optional 1px inner border via `::before`, a corner seal mark in the top-right at 12% opacity, no shadow at rest.
- **Strategy:** Vue component with `accent` prop (sets inner border + seal color).
- **Section variants:** Tint via the section theme tokens.
- **Motion:** Hover lifts 4px and adds a 0 8px 24px rgba(0,0,0,0.06) shadow. Subtle.
- **A11y:** `<article>` or `<a>` if linked. Focus ring 2px cinnabar.

### 7.8 DossierPlate

- **Purpose:** A character detail's identity anchor — a portrait + stats panel.
- **Where used:** Character detail page (right rail or top), only.
- **Visual grammar:** Paper bg, portrait at 3:4 in a 1px ink frame, 4px inner frame at 30%, status stamp (SealBadge) at the top-right, stats list below the portrait.
- **Strategy:** Vue component, takes `portrait`, `name`, `stats[]`, `status`.
- **Section variants:** Characters only. Other sections don't use a DossierPlate.
- **Motion:** Slow fade-in on enter (280ms). No hover state (this is a static identifier).
- **A11y:** `<aside>` with `aria-label`. Portrait has `alt`.

### 7.9 ImageWashFrame

- **Purpose:** A framed illustration with a soft cloth-wash background and a bronze edge.
- **Where used:** ManualSlip, RelicCard detail, Faction detail seal illustration.
- **Visual grammar:** Paper bg with a cloth-wash overlay (0.04 opacity), 1px bronze edge, 4px paper inner border, aspect-locked.
- **Strategy:** Vue component with `aspect` prop (default 4:5).
- **Section variants:** Tints to section.
- **Motion:** None.
- **A11y:** `<figure>` with `<figcaption>`. Image has `alt`.

### 7.10 SectionDivider

- **Purpose:** A horizontal rule between major sections on a detail page.
- **Where used:** End of a section, before the next section starts.
- **Visual grammar:** 1px ink rule + a centered motif (different per section: brush mark for Characters, blade line for Swordsmanship, jade node for Factions, etc.).
- **Strategy:** Vue component with `motif` prop (one of a fixed set of inline SVGs).
- **Section variants:** Motif changes per section, line tint changes per section.
- **Motion:** None. The divider is structural.
- **A11y:** `aria-hidden`. The next section's heading is the structural marker.

### 7.11 SealStamp

- **Purpose:** A large decorative seal that anchors a section or category.
- **Where used:** Section hero, register header, sect sigil, deity office.
- **Visual grammar:** Square or rectangle, cinnabar fill, paper text, feTurbulence noise, Chinese character inside.
- **Strategy:** Vue component with `text`, `shape`, `variant` (filled / outline) props.
- **Section variants:** Cinnabar always.
- **Motion:** Stamp-in (scale 0.92 → 1.0, opacity 0 → 1, 320ms) on first view. Once per session.
- **A11y:** `aria-hidden` if decorative. If informational, includes a `sr-only` text equivalent.

### 7.12 RegistryRow

- **Purpose:** A row in a register (rankings, rosters, member lists).
- **Where used:** RankingRegister, Faction roster, Pantheon court roll.
- **Visual grammar:** Tabular-num mono index, ink title, mono metadata strip, 1px divider between rows, hover reveals a cinnabar→teal gradient underline image.
- **Strategy:** Vue component, takes `index`, `title`, `meta[]`.
- **Section variants:** Tints to section.
- **Motion:** Hover gradient reveal 220ms.
- **A11y:** `<li>` inside `<ol>`. If linked, `<a>` inside.

### 7.13 ManualSlip

- **Purpose:** A sword-art "leaf" in a swordsmanship detail page. The hero illustration + side annotation panel.
- **Where used:** Swordsmanship detail only.
- **Visual grammar:** Paper bg with a 4:5 illustration on the left, an annotation panel on the right, a thin blade-light (1px horizontal) divider between them.
- **Strategy:** Vue component, takes `art`, `annotations[]`.
- **Section variants:** Swordsmanship only.
- **Motion:** Slow fade-in on enter. No hover.
- **A11y:** `<figure>` with `<figcaption>`. Image has `alt`.

### 7.14 ChronicleNode

- **Purpose:** A node on a timeline rail.
- **Where used:** TimelineChronicleRail, "Notable Events" rail on faction/character detail.
- **Visual grammar:** Small bronze node (1.5rem circle), connecting ink line, date in mono at left, title at right.
- **Strategy:** Vue component, takes `date`, `title`, `to?`.
- **Section variants:** Tints to section.
- **Motion:** Line draws on first view, nodes reveal in sequence (60ms stagger).
- **A11y:** `<li>` with `datetime` attribute on the date.

### 7.15 AtlasPanel

- **Purpose:** A cluster panel in a gazetteer — groups related locations.
- **Where used:** World index (clusters by heaven/continent/city), Cultivation index (clusters by school).
- **Visual grammar:** Paper bg, cluster name in BrushTitle, 1-2 sentence description, 3-6 small cinnabar seal-dots representing locations, no card chrome.
- **Strategy:** Vue component, takes `name`, `description`, `items[]`.
- **Section variants:** Tints to section.
- **Motion:** Slow fade-in.
- **A11y:** `<section>` with `aria-labelledby`.

### 7.16 RelicCard

- **Purpose:** A card for an artifact — sized by grade.
- **Where used:** Artifacts index.
- **Visual grammar:** PaperSlipCard base, with an ImageWashFrame at 1:1, a grade seal (CinnabarTag) at top-right, a provenance ribbon (small bronze rule + mono year) at bottom.
- **Strategy:** Vue component, takes `object`, `grade`, `era?`.
- **Section variants:** Artifacts only.
- **Motion:** Hover lifts 4px.
- **A11y:** `<article>` or `<a>`.

### 7.17 DoctrineTablet

- **Purpose:** A school or deity's inscribed panel — the "tenets" surface.
- **Where used:** Teachings detail, Pantheon detail.
- **Visual grammar:** Wood-tinted paper, a school sigil (SealStamp) at top, numbered tenets in serif (using BrushUnderline numerals with Chinese ordinals 壹 贰 叁 — never "01/02/03"), a foot seal.
- **Strategy:** Vue component, takes `sigil`, `tenets[]`, `lineageRoll[]`.
- **Section variants:** Tints to section.
- **Motion:** Tablet inscription reveal (lines stagger 80ms). Once per session.
- **A11y:** `<section>` with `aria-labelledby`.

### 7.18 Master Primitive Rules

- **One primitive per role.** No "Card 1, Card 2, Card 3." Pick the right one.
- **No primitive is allowed to invent a new visual pattern.** If a new pattern is needed, it becomes a new primitive and goes through this document.
- **All primitives respect the section chapter rule.** No primitive hardcodes a non-section color.
- **All primitives wrap motion in `prefers-reduced-motion`.**
- **All primitives meet 4.5:1 contrast for body text and 3:1 for large text.**

---

## 8. Layout Engines

Eight layout engines. Each is a **reusable composition of primitives that defines how a section type's index or detail page assembles**. They prevent every page from becoming "hero + grid + cards."

### 8.1 Dossier Layout (Characters)

```
[SectionHero (chapter cover)]
   ↓
[Affiliation Cluster Strip — horizontal scroll of affiliation seals]
   ↓
[DossierGrid — 2/3/4 column varied-size grid by importance, NOT identical cards]
   ↓
[Recent Inscriptions Strip — last 5 entries, compact, "recently added" framing]
   ↓
[Cross-section Inserts — "see also: Swordsmanship, Factions"]
```

**Detail page:**
```
[Running head — breadcrumb + section chapter]
   ↓
[Name + Chinese in BrushTitle + status seal]
   ↓
[DossierPlate (portrait + stats) — right-rail on desktop, top on mobile]
   ↓
[Prose body — Overview, Appearance, Personality, Cultivation, Abilities, Relationships, Affiliations, Story, Trivia]
   ↓
[Relationships — RegistryRow list, hand-drawn margin list style]
   ↓
[Cited References — chapter citations]
```

**Anti-pattern prevented:** "Identical 1×1 grid of all characters with 1px border + name + 2-line bio." Banned.

### 8.2 Ledger Layout (Rankings, Pantheon Court, Faction Roster)

```
[SectionHero (chapter cover)]
   ↓
[Editor's Meta Strip — "Verification: Reviewed | Last: 2026-06-15" — top, slim]
   ↓
[Register Index — list of registers as inscribed cards, NOT a sidebar]
   ↓
[Disputed Placements Callout — only if applicable]
   ↓
[Cross-section Inserts]
```

**Detail page:**
```
[Running head]
   ↓
[Register name in BrushTitle + category seal]
   ↓
[Criteria Inscription Panel]
   ↓
[THE REGISTER — only here, not above the title, not duplicated in a sidebar]
   ↓
[Disputed / Unverified — only if applicable]
   ↓
[Editorial Notes]
   ↓
[Cited References]
```

**Anti-patterns prevented:** (1) Register rendered above the title, breaking reading flow. (2) Register duplicated in the sidebar. (3) Leaderboard-style sorted column table. (4) "Rank #1" podium styling.

### 8.3 Manual Layout (Swordsmanship)

```
[SwordDaoManualHero (the spine view — illustration + classification)]
   ↓
[SwordArtRegister (dense ledger with category filters)]
   ↓
[Annotated by the Editor Panel — small, narrow]
   ↓
[Recent Manual Entries Strip]
   ↓
[Cross-section Inserts — "practitioners: see Characters"]
```

**Detail page:**
```
[Running head]
   ↓
[Art name in BrushTitle + classification seal]
   ↓
[ManualSlip (hero illustration + side annotation panel)]
   ↓
[Forms Annotated Panel]
   ↓
[Known Practitioners Ledger — RegistryRow]
   ↓
[Related Arts Exits — list, NOT a grid]
   ↓
[Cited References]
```

**Anti-patterns prevented:** (1) Card grid of sword arts. (2) Gantt-chart ability comparison. (3) Energy-beam hover effects.

### 8.4 Chronicle Layout (Timeline)

```
[TimelineCinematicHero (atmosphere art + era summary)]
   ↓
[Era Banner Strip — list of eras, horizontal scroll, each is a BrushUnderline-marked year range]
   ↓
[TimelineChronicleRail (era bands with event nodes)]
   ↓
[Decisive Events Highlight Panel]
   ↓
[Era Comparisons Side Panel — only if filters active]
```

**Detail page:**
```
[Running head]
   ↓
[Event title in BrushTitle + date seal]
   ↓
[Era Context Inscription Panel — sets the year + era]
   ↓
[Prose body]
   ↓
[Principals Involved Roster — RegistryRow, linked to character pages]
   ↓
[Causes + Consequences Split Panel — two-column on desktop, stacked on mobile]
   ↓
[Cited References]
```

**Anti-patterns prevented:** (1) Figma default vertical timeline with circle markers. (2) Decade ribbons as colored bars. (3) Animated counters as parallax.

### 8.5 Atlas Layout (World, Cultivation clusters)

```
[SectionHero with atmospheric wash]
   ↓
[World/Method Ledger Panel — total count, breakdown by type]
   ↓
[AtlasPanel Cluster Group 1 — e.g., "Five Great Heavens"]
   ↓
[AtlasPanel Cluster Group 2 — e.g., "Continents of the Middle-Earth"]
   ↓
[AtlasPanel Cluster Group 3 — e.g., "Walls and Crossings"]
   ↓
[AtlasPanel Cluster Group 4 — e.g., "Grotto-Heavens"]
   ↓
[CTA — "View printable scroll map" — InkButton]
```

**Detail page:**
```
[Running head]
   ↓
[Name in BrushTitle + type seal (Heaven / Continent / City / Wall / Grotto)]
   ↓
[Type Strip — quick metadata]
   ↓
[Prose body]
   ↓
[Governance & Affiliation Inscription Panel]
   ↓
[Associated Records Relationship List]
   ↓
[Cited References]
```

**Anti-patterns prevented:** (1) Google-Maps marker pins. (2) Tile-based location grids. (3) Identical card lists of all locations.

### 8.6 Catalogue Layout (Artifacts)

```
[SectionHero with "Reliquary" copy]
   ↓
[Grade Filter Strip — chips, not tabs: Heavenly / Earthly / Mortal / Curio]
   ↓
[RelicCard List — varied size by grade: Heavenly 2×2, Earthly 1×2, Mortal 1×1]
   ↓
[Provenance Roll — timeline strip of when key objects changed hands]
```

**Detail page:**
```
[Running head]
   ↓
[Object name in BrushTitle + grade seal]
   ↓
[ImageWashFrame at 4:5]
   ↓
[Materials Inscription Strip]
   ↓
[Recorded Powers Panel]
   ↓
[Provenance Line-draw Timeline]
   ↓
[Current Bearer — if any, linked]
   ↓
[Cited References]
```

**Anti-patterns prevented:** (1) Gacha-style reveal. (2) Glowing aura around objects. (3) Identical 1:1 thumbnail grid.

### 8.7 Doctrine Layout (Teachings, Pantheon detail)

```
[SectionHero with "Doctrine Canon" copy]
   ↓
[Schools / Deities Tablet List — DoctrineTablet cards, NOT a card grid]
   ↓
[Lineage Roll — chronological evolution panel]
   ↓
[Comparative Doctrines Panel — for Teachings: side-by-side tenets; for Pantheon: domain map]
```

**Detail page:**
```
[Running head]
   ↓
[Name in BrushTitle + school sigil / deity office seal]
   ↓
[DoctrineTablet — sigil + numbered tenets + lineage roll]
   ↓
[Origin Story prose]
   ↓
[Notable Adherents / Associated Cults Roster]
   ↓
[Cited References]
```

**Anti-patterns prevented:** (1) Quote-card grid. (2) "What we believe" template with three icon columns. (3) Numbered eyebrow scaffolding (use BrushUnderline numerals with Chinese ordinals).

### 8.8 Registry Layout (Glossary, Faction Roster compact)

```
[SectionHero with "Scholar Lexicon" / "Sect Ledger" copy]
   ↓
[Search Filter Strip — in-line, not modal]
   ↓
[Radical Index for CJK lookup — Glossary only]
   ↓
[Alphabetical / Categorized Term List — BrushUnderline accents on first-letter markers]
   ↓
[CTA]
```

**Detail page:**
```
[Running head]
   ↓
[Term / Name in BrushTitle + reading in calligraphy]
   ↓
[Etymology Inscription Strip — Glossary only]
   ↓
[Definition / Prose body]
   ↓
[First Appearance Inscription]
   ↓
[Cited In Chapter List]
   ↓
[Related Terms — small link list]
```

**Anti-patterns prevented:** (1) Card grid of terms. (2) Alphabetical sidebar. (3) Definition tooltips. (4) "Popular terms" cloud.

---

## 9. Content-to-Design Mapping

The frontend reads frontmatter and routes the rendering through the layout engine. This is the contract.

### 9.1 Characters

| Frontmatter field | Drives | Component |
|---|---|---|
| `title` | Heading | BrushTitle (English) |
| `chinese` | Calligraphy display | BrushTitle (Chinese calligraphic line) |
| `image` | Portrait | DossierPlate portrait slot |
| `status` (Alive / Deceased / Unknown / …) | Status stamp | SealBadge in DossierPlate |
| `realm` | Realm inscription strip | RealmBadge row |
| `affiliations[]` | Affiliation tags | CinnabarTag list |
| `titles[]` | Title inscription panel | RegistryRow list |
| `abilities[]` | Abilities body section | Standard prose |
| `importance` | Card size in grid (major / supporting / minor) | DossierGrid sizing |
| `relationships[]` | Relationships section | RegistryRow list with relation types |

### 9.2 Rankings

| Frontmatter field | Drives | Component |
|---|---|---|
| `title` | Heading | BrushTitle |
| `chinese` | Calligraphy display | BrushTitle (Chinese) |
| `category` (Realm-Ladder / Named-List / Tier-List) | Register archetype (Ascension Register / Gazetted Roster / Tier Inventory) | RankingRegister header |
| `listType` | Register header label | RankingRegister |
| `entries[]` | The register itself | RankingRegister → RankingRegisterRow |
| `entry.rank` | Numeric column | RankingRegisterRow (mono, tabular) |
| `entry.name` | Title column | RankingRegisterRow |
| `entry.link` | Link or ghost state | RankingRegisterRow (ghost = struck-from-record) |
| `entry.note` | Editorial note | RankingRegisterRow (small serif) |
| `verificationStatus` | Editor's Meta Strip | RankingContextBar |
| `firstAppearance`, `sourceNotes` | Cited References block | Standard citation list |
| `status: Removed` (or `rank: Removed`) | Struck-from-record state | RankingRegisterRow (62% opacity, mono "Struck from Record" tag) |
| `importance` | Register panel emphasis | Border thickness, seal size |

### 9.3 Swordsmanship

| Frontmatter field | Drives | Component |
|---|---|---|
| `title` | Heading | BrushTitle |
| `chinese` | Calligraphy display | BrushTitle |
| `category` (Sword Art / Sword Domain / Sword Intent / Sword Scripture) | Manual classification seal | SwordArtRegister filter |
| `abilityType` | Treatment type — Sword Domain → domain/boundary treatment, Sword Intent → inscription treatment, etc. | ManualSlip variant |
| `importance` | Register row emphasis | Border thickness, larger typography |
| `verificationStatus` | Editor's verification strip | ManualSlip annotation |
| `lastUpdated` | Date in row | Mono date column |
| `tags[]` | Tag chips | LedgerTab mini-variants |
| `practitioners[]` (if present) | Known Practitioners section | RegistryRow list |

### 9.4 World

| Frontmatter field | Drives | Component |
|---|---|---|
| `title` | Heading | BrushTitle |
| `chinese` | Calligraphy display | BrushTitle |
| `locationType` (Heaven / Continent / City / Wall / Grotto) | Type seal | AtlasPanel grouping |
| `parentLocation` | Cluster assignment | AtlasPanel cluster key |
| `location` | Sub-cluster assignment | AtlasPanel |
| `governingFaction` | Governance inscription panel | InscriptionPanel (a small component) |
| `leader` | Leader inscription | InscriptionPanel |

### 9.5 Factions

| Frontmatter field | Drives | Component |
|---|---|---|
| `title` | Heading | BrushTitle |
| `chinese` | Calligraphy display | BrushTitle |
| `seal` | Sect seal image | ImageWashFrame (1:1 sigil) |
| `affiliations[]` | Affiliation board entries | FactionAffiliationBoard |
| `seats[]` / `offices[]` | Seat ledger | FactionSeatLedger |
| `prominence` | Prominence ledger rank | FactionProminenceLedger |

### 9.6 Artifacts

| Frontmatter field | Drives | Component |
|---|---|---|
| `title` | Heading | BrushTitle |
| `chinese` | Calligraphy display | BrushTitle |
| `grade` (Heavenly / Earthly / Mortal / Curio) | Grade seal + RelicCard size | RelicCard size tier |
| `type` (Sword / Talisman / Jade / Cauldron / Mirror / Robe / …) | Object type inscription | InscriptionPanel |
| `provenance[]` | Provenance line-draw | ProvenanceTimeline (new component) |
| `currentBearer` | Current Bearer panel | InscriptionPanel with link |
| `image` | Object illustration | ImageWashFrame (1:1 or 4:5) |

### 9.7 Timeline

| Frontmatter field | Drives | Component |
|---|---|---|
| `title` | Heading | BrushTitle |
| `chinese` | Calligraphy display | BrushTitle |
| `date` / `era` | Era band + event node position | ChronicleNode |
| `decisive` (true / false) | Highlight panel inclusion | DecisiveEventsPanel |
| `principals[]` | Principals Involved roster | RegistryRow |
| `causes` / `consequences` | Split panel | CausesConsequencesSplit |

### 9.8 Glossary

| Frontmatter field | Drives | Component |
|---|---|---|
| `term` | Heading | BrushTitle |
| `chinese` | Calligraphy display | BrushTitle |
| `pinyin` | Reading inscription | InscriptionPanel |
| `radical` | Radical index entry | RadicalIndex (CJK lookup) |
| `etymology` | Etymology strip | InscriptionPanel |
| `definition` | Body prose | Standard prose |
| `firstAppearance` | First Appearance inscription | InscriptionPanel |
| `deprecated` (true / false) | CinnabarTag marker | CinnabarTag (deprecated) |

### 9.9 Teachings

| Frontmatter field | Drives | Component |
|---|---|---|
| `title` | Heading | BrushTitle |
| `chinese` | Calligraphy display | BrushTitle |
| `schoolSigil` (image or character) | DoctrineTablet sigil | SealStamp |
| `tenets[]` | Numbered tenets | DoctrineTablet (BrushUnderline numerals with Chinese ordinals) |
| `lineage[]` | Lineage roll | DoctrineTablet |
| `notableAdherents[]` | Notable Adherents roster | RegistryRow |

### 9.10 Pantheon

| Frontmatter field | Drives | Component |
|---|---|---|
| `title` | Heading | BrushTitle |
| `chinese` | Calligraphy display | BrushTitle |
| `office` | Office inscription | InscriptionPanel |
| `domain` | Domain inscription | InscriptionPanel |
| `courtStanding` (Enthroned / Deposed / Banished) | Standing marker | CinnabarTag (Enthroned=default, Deposed/Banished=outline) |
| `associatedCults[]` | Associated Cults roster | RegistryRow |

### 9.11 Master Frontmatter Rule

> **Every frontmatter field used in the frontend must appear in `plans/entry-field-registry.md`.** If a new field is added, the registry is updated in the same commit. No "just add it once" exceptions.

---

## 10. Motion Grammar

### 10.1 Allowed Motion

| Motion | Where | Spec |
|---|---|---|
| **Ink reveal** | Hero titles, section copy on enter | Opacity 0→1 + translateY 8px→0, 320ms ease-out-quart. Once. |
| **Seal stamp** | SealStamp on first view | Scale 0.92→1.0, opacity 0→1, 320ms ease-out-quart. Once per session. |
| **Scroll unfold** | ManualSlip image on detail page | Height 0→auto (CSS grid trick) + opacity 0→1, 480ms ease-out-quart. Once. |
| **Ledger row inscription** | RankingRegisterRow, RegistryRow on first view | Stagger 60ms, opacity 0→1 + translateX -8px→0, 280ms ease-out-quart. Once. |
| **Blade line draw** | Swordsmanship section dividers, blade-light accents | scaleX 0→1 from left, 320ms ease-out-quart. Once. |
| **Chronicle line draw** | TimelineChronicleRail | scaleY 0→1 from top, 600ms ease-out-quart, line draws first then nodes. Once. |
| **Mist drift** | Hero atmosphere bg | Very subtle (translateX 0→1rem over 12s, infinite alternate). Pauses on `prefers-reduced-motion`. |
| **Paper parallax** | Hero atmosphere on scroll | translateY(scroll * 0.04), capped at 2rem. Disabled on mobile and on reduced-motion. |

### 10.2 Forbidden Motion

- Random particles as decoration.
- Flashy sparks (red/orange/yellow bloom effects).
- Game-leaderboard animation (number counters, rising/falling arrows, "Rank #1" podium bounce).
- 3D card spinning (rotateX/Y on hover).
- Heavy WebGL without purpose (no shader-only hero, no canvas-only decoration).
- Neon effects (glow, blur shadows in saturated colors).

### 10.3 Easing

- **Default:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-quart). Used for entrance.
- **Hover:** `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out). Used for state.
- **Never:** bounce, elastic, back, anticipate.

### 10.4 Reduced Motion

Every animation is wrapped:

```css
@media (prefers-reduced-motion: reduce) {
  .ink-reveal { animation: none; opacity: 1; transform: none; }
}
```

Crossfade is acceptable as a reduced-motion alternative for entrance. Instant transition is acceptable for hover. **No animation is decorative-only** — if removing it loses no meaning, it shouldn't exist.

### 10.5 When to Use GSAP vs CSS

- **CSS:** All entrance animations on single elements, all hover states, all underline/scale transitions, all opacity fades.
- **GSAP:** Only when there is a *true* multi-element timeline that CSS cannot express. Currently, **zero planned uses** — the SectionDivider, ManualSlip, and ChronicleNode sequences are all CSS keyframe staggers. GSAP is reserved for future ScrollTrigger-based scroll narratives on the home page, **if and only if** the home page redesign calls for it. It is not introduced preemptively.

---

## 11. What To Avoid

This is the hard list. Every item maps to a real failure mode observed in the current codebase or in the broader AI-default reflex.

### 11.1 Structural Bans

- **Thin-border generic.** The 1px gray border on a flat card with 16px padding. Replace with `PaperSlipCard` (paper + mist border + corner seal + tonal depth).
- **Hero + grid + cards.** The default landing-page scaffold. Banned per section. Every section has a non-grid layout (see § 8).
- **Identical card grids.** Same-sized cards with icon + heading + text repeated. Use varied sizes (by importance/grade) and varied primitives.
- **Numbered section markers as default scaffolding.** `01 / 02 / 03` above every section is a kicker-trope variant. Use Chinese ordinals 壹 贰 叁 with `BrushUnderline` *only* on real sequential content (Doctrine tenets, Manual steps).
- **Eyebrow on every section.** The "ABOUT / PROCESS / PRICING" small-caps tracked label is now an AI tell. One named kicker as a deliberate brand system is voice; an eyebrow on every section is AI grammar.

### 11.2 Visual Bans

- **Side-stripe borders.** `border-left` or `border-right` greater than 1px as a colored accent on cards, list items, callouts, or alerts. Rewrite with full borders, background tints, leading numbers/icons, or nothing.
- **Gradient text.** `background-clip: text` with a gradient fill. Decorative, never meaningful. Use a single solid color. Emphasis via weight or size.
- **Glassmorphism as default.** Blurs and glass cards used decoratively. Rare and purposeful (e.g., the search modal), or nothing.
- **The hero-metric template.** Big number + small label + supporting stats + gradient accent. SaaS cliché. Replace with a real document archetype (ledger panel, inscription strip).
- **Neon glow.** Saturated color shadows. Banned.
- **Saturated body bg in cream/sand/beige band.** OKLCH L 0.84–0.97, C < 0.06, hue 40–100 is the 2026 AI default. Pick a true off-white at chroma 0, a saturated brand color, or a darker mid-tone tinted neutral.

### 11.3 Motion Bans

- **Bounce / elastic / back easing.** Banned. No exceptions.
- **Particles.** Banned as decoration. Reserved for actual contextual use (e.g., a one-time sword-shard burst on a Swordsmanship seal stamp — and even then, sparse, 6–8 elements max, 400ms).
- **3D transforms on cards.** `rotateX` / `rotateY` on hover. Banned. Depth comes from tonal layering, not z-axis tilt.
- **Parallax on body text.** Parallax on hero bg only. Body content is static.

### 11.4 Content Bans

- **Text overflow on mobile.** Long heading words + large clamp scales + narrow grids cause overflow. Test at 320px, 375px, 414px, 768px, 1024px. If overflow, reduce clamp max or rewrite copy.
- **Color-only indicators.** Every status/category/importance indicator must have a text label, icon, or pattern alongside color. Color blindness accessibility is non-negotiable.
- **"Lorem ipsum" or stub data in screenshots.** The manifest must be honest. Stub entries get a "pending" tag and a lower opacity, not a fake illustration.

### 11.5 Process Bans

- **Implementing before the manifest is complete.** No new section ships with raw `weibo-draft/` assets. They go through the manifest first.
- **Mixing section palettes on one page.** Each page is exactly one section's chapter.
- **Editing source files outside the plan mode contract.** The blueprint is a planning artifact. Implementation happens in Stage 35B onward, in implementation sessions.

---

## 12. Implementation Roadmap

### Stage 35A — Design Engine Blueprint (THIS DOCUMENT)

- **Deliverable:** This file at `plans/jianlai-frontend-design-engine.md`.
- **Status:** Drafted. Awaiting user review.
- **Exit criterion:** Document reviewed and approved.

### Stage 35B — Asset Inventory & Manifest

- **Goal:** Stand up the asset manifest. Curate the first batch.
- **Tasks:**
  1. Create `app/utils/assetManifest.ts` with the schema from § 6.1.
  2. Curation pass on `weibo-draft/`, `banner-draft/`. Assign role + sectionFit + priority to every candidate.
  3. Promote p0/p1 assets to their proper folders (`characters/`, `banners/`, etc.).
  4. Mark all uncurated assets as `unusable` in the manifest.
  5. Build a small admin view (dev-only) at `/dev/asset-manifest` to inspect the manifest.
- **Validation:** The manifest has at least 30 character portraits, 11 hero atmospheres, 20 card arts, 8 section dividers. Every entry passes role + sectionFit validation.
- **Exit criterion:** Manifest is complete for p0/p1 assets. Admin view works.

### Stage 35C — UI Primitive Foundation

- **Goal:** Lock in the 17 primitives from § 7 as production components.
- **Tasks:**
  1. Audit existing components: `InkHoverLink`, `InkTextButton`, `InkActiveTab`, `InkDivider`, `BrushTitle`, `SealStamp`, `SealBadge`. Promote them to the official primitive set.
  2. Build the missing primitives: `SealButton`, `ArchiveTab`, `LedgerTab`, `BrushUnderline`, `CinnabarTag`, `PaperSlipCard`, `DossierPlate`, `ImageWashFrame`, `SectionDivider`, `RegistryRow`, `ManualSlip`, `ChronicleNode`, `AtlasPanel`, `RelicCard`, `DoctrineTablet`.
  3. Write a primitives test page at `/dev/primitives` (already exists as a stub) covering all 17.
  4. Document each primitive in `app/components/ui/README.md`.
- **Validation:** Every primitive renders in dark mode, light mode, mobile, and with reduced motion. Every primitive meets contrast requirements.
- **Exit criterion:** Primitives are production-ready. Test page covers all 17. README documents each.

### Stage 35D — Apply to Rankings & Swordsmanship Cleanup

- **Goal:** Resolve the structural issues identified in `stage-34b-rankings-creative-quality-review.md`.
- **Tasks:**
  1. Apply the Ledger Layout (§ 8.2) to Rankings index and detail pages.
  2. Apply the Manual Layout (§ 8.3) to Swordsmanship v3 bladepath.
  3. Remove the duplicated register (don't show it in the sidebar if it's already in the body).
  4. Editorial-status copy: "Unranked" → "Member," "Listed / Candidate" → "Awaiting Confirmation," "Removed" → "Struck from Record" or "Former [N]st."
  5. Use the new `SealButton` for the verification-action CTAs.
- **Validation:** Re-run the quality rubric. Rankings and Swordsmanship pass all 8 dimensions.
- **Exit criterion:** Both sections pass the rubric.

### Stage 35E — Apply to Characters / World / Cultivation

- **Goal:** Refit the three highest-traffic sections to the new primitives.
- **Tasks:**
  1. Characters: DossierPlate in detail, DossierGrid (varied-size) in index, AffiliationClusterStrip replacing the Affiliation Clusters header.
  2. World: WorldAtlasHero stays; replace the gazetteer with AtlasPanel clusters. Remove the "Identical card list of all locations."
  3. Cultivation: RealmLadder as the canonical vertical; Method Canon as categorized ledger; Path Comparison panel.
- **Validation:** All three pass the rubric.
- **Exit criterion:** All three pass the rubric.

### Stage 35F — Motion Layer

- **Goal:** Wire the motion grammar (§ 10) across all sections.
- **Tasks:**
  1. Add `ScrollReveal` directive to entrance animation (currently exists, audit it).
  2. Add `prefers-reduced-motion` wrappers to every animated primitive.
  3. Add the SealStamp stamp-in animation, the blade line draw, the chronicle line draw.
  4. Audit and fix any existing bounce/elastic easing.
- **Validation:** Lighthouse prefers-reduced-motion audit passes. No animation runs on `prefers-reduced-motion: reduce`.
- **Exit criterion:** Motion grammar is live and reduced-motion-safe.

### Stage 35G — Final Consistency Audit

- **Goal:** Pass the quality rubric (§ 13) across all 11 sections.
- **Tasks:**
  1. Apply the rubric to every section.
  2. Fix any failures.
  3. Update DESIGN.md with any token additions discovered during implementation.
  4. Update PRODUCT.md anti-references if any new anti-patterns were encountered.
  5. Take screenshots of every section in light and dark mode at desktop, tablet, mobile. Archive in `plans/screenshots/stage-35g/`.
- **Validation:** All 11 sections pass all 8 rubric dimensions. Screenshots archived.
- **Exit criterion:** Design engine is shipped. Subsequent section redesigns use this document as the contract.

---

## 13. Quality Rubric

Every future section must pass this 8-dimension checklist. **A section is not "done" until it passes all 8.**

### 13.1 Section Identity (pass/fail)

- The section's chapter palette is applied (no token from another section leaks in).
- The section's hero uses the correct document archetype (Dossier, Atlas, Manual, Chronicle, Catalogue, Doctrine, Ledger, Registry).
- A reader entering the section feels they have entered a new chapter, not a new website.
- **Pass criterion:** All three.

### 13.2 Image Richness (1–5)

- Hero atmosphere art exists and is correctly classified.
- At least 3 distinct art roles are used across the section.
- No image is used in a role it doesn't fit.
- The `unusable` / `weibo-draft` folders are not referenced in components.
- **Pass criterion:** ≥4.

### 13.3 UI Primitive Usage (1–5)

- At least 5 primitives from § 7 are used in the section.
- No "1px gray border card" appears (replaced by `PaperSlipCard` or section-specific).
- The correct section-specific primitives (DossierPlate, ManualSlip, RelicCard, etc.) appear in their sections.
- No invented new visual pattern (if a new pattern is needed, it goes through this document first).
- **Pass criterion:** ≥4.

### 13.4 Non-Generic Cards / Buttons / Tabs (1–5)

- Buttons are not all "primary + secondary pill" — they use the primitive set.
- Tabs are not all identical chips — they differentiate (ArchiveTab vs LedgerTab).
- Cards are not all identical size — they vary by importance / grade.
- No "hero + grid + cards" pattern.
- **Pass criterion:** ≥4.

### 13.5 Mobile Behavior (1–5)

- Hero title does not overflow at 320px.
- Ledger rows stack to a sensible 2-column layout (or single column with metadata blocks).
- Atlas panels reflow to a single column.
- ManualSlip side annotations move below the illustration.
- DossierPlate moves from right-rail to top.
- **Pass criterion:** ≥4, with no overflow at 320px.

### 13.6 Content-to-Design Mapping (1–5)

- Every frontmatter field used in the section appears in `plans/entry-field-registry.md`.
- Every field maps to a primitive (no "raw field value displayed directly").
- Editorial copy is editorial ("Struck from Record," "Awaiting Confirmation"), not raw ("Removed," "Listed").
- **Pass criterion:** ≥4.

### 13.7 No Decorative Noise (1–5)

- No particles.
- No bounce / elastic easing.
- No glassmorphism, no neon glow, no gradient text.
- No SaaS-dashboard app-shell.
- No "Lorem ipsum" or stub data in production.
- **Pass criterion:** 5 (zero tolerance on these bans).

### 13.8 Build / Generate Safety (1–5)

- Section generates successfully (`nuxt generate`).
- Section renders without console errors in light and dark mode.
- Section is keyboard-navigable end to end.
- Section passes Lighthouse Accessibility ≥ 95.
- Section has `prefers-reduced-motion` coverage.
- **Pass criterion:** ≥4, with Lighthouse a11y ≥ 95.

### 13.9 Section-Specific Checks

- **Rankings:** No register above the title. No duplicate register in the sidebar. Editorial copy throughout. Seal stamp animation on the register header.
- **Swordsmanship:** No card grid. Blade light 1px horizontal only. ManualSlip with side annotations.
- **World:** No Google-Maps marker pins. AtlasPanel clusters, not identical card list.
- **Characters:** No identical 1×1 portrait grid. DossierPlate, not a sidebar widget.
- **Cultivation:** Ladder is vertical, not a 3D path. Methods are categorized, not card grid.
- **Factions:** No org-chart tree. Sect seal is square 1:1.
- **Artifacts:** No gacha reveal. RelicCard size varies by grade.
- **Timeline:** No Figma-default vertical line. Era bands, not colored ribbons.
- **Glossary:** No card grid. Type-only, no images.
- **Teachings:** No quote-card grid. DoctrineTablet with BrushUnderline Chinese ordinals.
- **Pantheon:** No deity card grid with halo. Court roll, ranked panel.

### 13.10 Composite Pass

A section is **shipped** when all 8 dimensions score ≥4 (with 13.7 = 5) and the section-specific checks pass.

---

## 14. Final Recommendation

The Jian Lai Wiki is at a structural inflection point. The design system is committed (PRODUCT.md, DESIGN.md, section themes), the component inventory is rich (90+ Vue components), and the recent stages (29 Swordsmanship, 34 Rankings) have shown that a section can be elevated from "generic wiki with thin borders" to "document-tradition archive" — but each section has been elevated *in isolation*, with its own patterns and primitives.

This blueprint is the contract that makes the next ten sections faster, more cohesive, and harder to break. It says:

- Every section has a **document archetype** and a **layout engine**. You don't invent a new layout; you apply the right engine.
- Every interactive element is a **primitive** from a 17-item set. You don't invent a new button; you pick the right one.
- Every image is **classified** into a role. You don't drop a weibo screenshot in; it goes through the manifest.
- Every motion is **named** and **gated by reduced motion**. You don't add a bounce; you pick from the allowed set.
- Every section passes the **quality rubric**. "Done" is a measurable state.

The work for Stage 35A is this document. The work for 35B–35G is implementation. The work after that is any new section that joins the wiki — Characters for a new character, a new ranking, a new sword art — and the new section will look like the rest of the archive because the engine tells it how.

**The wiki stops being a collection of pages and starts being a folio.**

---

*End of Stage 35A Design Engine Blueprint. Awaiting approval to proceed to Stage 35B (Asset Inventory & Manifest).*
