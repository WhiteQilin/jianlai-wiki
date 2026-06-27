---
name: Jian Lai Wiki
description: A premium fandom encyclopedia — ink-wash atmosphere, scholarly precision, cinematic reverence for the source material.
colors:
  parchment: "#f9f8f6"
  paper-alt: "#ffffff"
  charcoal: "#141414"
  ink-black: "#222222"
  ink-wash: "#4a4a4a"
  mist: "#e8e6e1"
  mist-light: "#f2f0eb"
  cinnabar-seal: "#b82a2a"
  bronze: "#8c7654"
  celadon-teal: "#2c595c"
  jade: "#34645d"
  deep-teal: "#1f4b49"
  muted-gold: "#b49a62"
  lacquer: "#2b2520"
  paper-ivory: "#f7f1e4"
  aged-paper: "#ece0c8"
  mist-blue: "#d7e3e7"
  river-gray: "#9aa7aa"
  blue-gray-ink: "#39484f"
  charcoal-black: "#161514"
  cinnabar-red: "#a9352c"
  celadon-green: "#93aa8f"
  text-muted: "#737373"
  border: "rgba(20, 20, 20, 0.12)"
  divider: "rgba(20, 20, 20, 0.06)"
  dark-paper: "#0f1011"
  dark-ink: "#e2e2e2"
  dark-charcoal: "#f0f0f0"
  dark-mist: "#1a1c1e"
  dark-seal-red: "#cc3a3a"
  dark-bronze: "#a89069"
  dark-teal: "#498a8e"
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontSize: "1.12rem"
    fontWeight: 400
    lineHeight: 1.85
  heading:
    fontFamily: "Georgia, 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', serif"
    fontWeight: 500
    lineHeight: 1.3
  display:
    fontFamily: "Georgia, 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', serif"
    fontWeight: 500
    lineHeight: 1.2
  label:
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace"
    fontSize: "0.65rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.05em"
    textTransform: "uppercase"
  zh-display:
    fontFamily: "'HYDiShengHero', 'STKaiti', 'KaiTi', 'Noto Serif SC', serif"
    fontWeight: 400
    letterSpacing: "0.06em"
rounded:
  sm: "2px"
  md: "4px"
  lg: "6px"
  pill: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.md}"
    padding: "0.8em 2.5em"
  button-primary-hover:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.ink-black}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.md}"
    padding: "0.8em 2.5em"
  button-secondary-hover:
    backgroundColor: "{colors.mist-light}"
  chip:
    backgroundColor: "color-mix(in srgb, {colors.celadon-teal} 6%, {colors.paper-alt})"
    textColor: "{colors.ink-wash}"
    rounded: "{rounded.sm}"
    padding: "0.34rem 0.62rem"
  chip-active:
    backgroundColor: "{colors.celadon-teal}"
    textColor: "{colors.parchment}"
  seal-badge:
    backgroundColor: "{colors.cinnabar-seal}"
    textColor: "{colors.parchment}"
    rounded: "2px 4px 3px 2px"
---

# Design System: Jian Lai Wiki

## 1. Overview

**Creative North Star: "The Sword Manual Folio"**

The Jian Lai Wiki is designed as a bound folio of martial and cosmological knowledge — each section a chapter, each entry a leaf. The visual language draws from the physical materials of classical Chinese scholarship: parchment, ink stone, cinnabar seal paste, celadon glaze, bronze fittings. These are not decorative metaphors; they are the material grammar of the system. Every surface, every color, every transition should feel like it belongs in a scholar's private collection of sword manuals and celestial registers.

This system explicitly rejects the visual language of generic wikis (Fandom.com clutter, MediaWiki defaults), SaaS dashboards (app-shell layouts, sidebar navigation, data tables), mobile game UIs (neon borders, glowing skill trees), and AI-generated landing pages (purple-blue gradients, glassmorphism, glossy card grids). The wiki is text-first; visual effects enhance but never replace readable prose.

The atmosphere is cinematic where it earns it (hero sections, page transitions, scroll-driven reveals) and scholarly where it matters (body content, entry prose, reference material). The shift between these modes is deliberate, not a compromise. Motion serves hierarchy; stillness serves reading.

**Key Characteristics:**
- **Material grammar.** Colors, textures, and treatments derive from physical objects — parchment, ink, cinnabar, celadon, bronze — not from abstract design systems.
- **Chapter architecture.** Each major section (Characters, World, Swordsmanship, etc.) has its own accent color, paper tint, and atmospheric mood while sharing structural DNA. A reader enters a new chapter, not a new website.
- **Bilingual structure.** Chinese calligraphy display text and English prose coexist by structural choice. Neither language is secondary.
- **Tactile components.** Buttons have corner decorations. Links have brush-stroke underlines. Badges simulate seal-stamp texture. The interface feels handcrafted, not templated.
- **Earned motion.** Every animation has a semantic reason — reveals mark content hierarchy, transitions signal navigation, staggered entrances group related items.

## 2. Colors: The Shuimo Palette

The palette is drawn from the physical materials of Chinese ink-wash painting and classical scholarship. Six core roles anchor the system; twelve section-specific themes extend it.

### Primary
- **Cinnabar Seal** (#b82a2a): The signature accent. Used for active states, link hovers, seal-stamp badges, and the occasional blockquote border. Its rarity is the point — cinnabar appears where emphasis is earned, never as a background wash.

### Secondary
- **Celadon Teal** (#2c595c): The secondary accent. Used for chips, tags, interactive elements, and the Swordsmanship section theme. Cooler and more restrained than cinnabar; it carries the "jade" and "scholar's desk" associations.
- **Antique Bronze** (#8c7654): The tertiary accent. Used for list bullets, decorative borders, frame elements, and the Artifacts/Timeline section themes. Evokes aged metal fittings and ink-wash warmth.

### Neutral
- **Parchment** (#f9f8f6): The default background. A near-white with minimal warmth — not cream, not beige, just enough to soften against pure white content areas.
- **Charcoal** (#141414): The deepest dark. Used for primary text in light mode, and as the primary button background.
- **Ink Black** (#222222): The primary text color. Slightly softer than charcoal; reads as black without the harshness of #000.
- **Ink Wash** (#4a4a4a): Secondary text. Used for body prose, descriptions, and de-emphasized content. Must maintain ≥4.5:1 against parchment.
- **Mist** (#e8e6e1): Borders, dividers, and subtle background differentiation. The "paper grain" neutral.
- **Mist Light** (#f2f0eb): Soft background for cards, code blocks, and inset surfaces.
- **Text Muted** (#737373): Tertiary text for timestamps, metadata, and captions. Must maintain ≥4.5:1 against parchment.

### Section Themes

Each major section overrides the accent, ink, mist, paper, seal, and gold tokens via `[data-jl-section]` attributes. The full palette:

| Section | Accent | Paper | Ink | Seal |
|---|---|---|---|---|
| Home | #667d81 | #f8f2e6 | #324247 | #a9352c |
| Characters | #5d857b | #fbf5e8 | #354640 | #a83a32 |
| World | #6f9391 | #f5f0e4 | #31464d | #9f332d |
| Cultivation | #8fae92 | #f8f2e4 | #33463d | #a6362d |
| Swordsmanship | #587988 | #f6f9f5 | #18262d | #a9342d |
| Factions | #2f6255 | #f3ead8 | #263d37 | #9e332c |
| Artifacts | #6f5a38 | #f2e6d1 | #2b2520 | #9f332b |
| Timeline | #9b6f4b | #f4e8d1 | #3f332a | #a33b31 |
| Rankings | #8a7448 | #f6ecd8 | #332c22 | #aa352d |
| Teachings | #687f87 | #f8f1e3 | #34454a | #a53931 |
| Pantheon | #746949 | #f2e9d8 | #252522 | #96332d |
| Glossary | #647071 | #fbf6ea | #303839 | #a83a32 |

### Named Rules

**The Cinnabar Rarity Rule.** The seal-red accent is used on ≤10% of any given screen. Its rarity is the point — cinnabar marks the most important interactive states (link hover, active seal, blockquote accent). Overuse dilutes its authority.

**The Section Chapter Rule.** Each section's accent, paper, and ink are a cohesive chapter palette. Never mix tokens from different sections on the same screen. A reader on the Characters page sees the Characters palette; the Swordsmanship palette does not bleed in.

**The Tinted Neutral Rule.** Neutrals are tinted toward the section's own hue, never toward generic warmth or coolness. The Characters section's mist (#e5e1d7) is warm-green; the Swordsmanship section's mist (#d8e8ee) is cool-blue. This is structural, not decorative.

## 3. Typography

**Display Font:** Georgia with Noto Serif SC / Source Han Serif SC / Songti SC (CJK serif fallbacks)
**Body Font:** System sans-serif stack with Noto Sans SC / PingFang SC (CJK sans fallbacks)
**Label/Mono Font:** JetBrains Mono with Fira Code / Consolas fallbacks
**Chinese Display Accent:** HYDiShengHero (custom calligraphy font) with STKaiti / KaiTi fallbacks

**Character:** The pairing is classical serif headings against clean sans-serif body — a scholar's annotated manuscript. Georgia carries authority for section titles and entry names; the system sans stays invisible for long-form reading. The calligraphy accent font (HYDiShengHero) is reserved exclusively for short Chinese display text: nav labels, section names, watermark characters. Never for body copy.

### Hierarchy
- **Display** (Georgia 500, clamp(2.5rem, 5vw, 4rem), line-height 1.2): Hero headlines and section titles. Used sparingly; only one per viewport.
- **Heading** (Georgia 500, 2.2rem, line-height 1.3): Entry titles and major subsections. Always accompanied by a 2px underline rule at 80px width.
- **Title** (Georgia 500, 1.6rem, line-height 1.4): Subsection headings within entries.
- **Body** (System sans 400, 1.12rem, line-height 1.85): Entry prose and long-form content. Max line length 65–75ch via `max-width: 1200px` container.
- **Label** (JetBrains Mono 400, 0.65rem, line-height 1.2, letter-spacing 0.05em, uppercase): Section labels, metadata, breadcrumbs. The "small mono label" is the system's voice for secondary information.
- **Chinese Display** (HYDiShengHero 400, letter-spacing 0.06em): Navigation labels (人物, 天下, 剑术), section watermarks, seal-stamp text. Never for paragraphs or body copy.

### Named Rules

**The Calligraphy Accent Rule.** The HYDiShengHero font is used only for short Chinese display text — nav labels, section names, watermark characters, seal stamps. Applying it to body copy, descriptions, or any text longer than 5 words is prohibited.

**The Serif Authority Rule.** Georgia (with CJK serif fallbacks) carries all heading hierarchy. Body text never uses serif. The contrast between serif headings and sans body is the system's typographic voice.

**The Mono Label Rule.** JetBrains Mono is reserved for metadata, labels, and UI chrome (search placeholders, keyboard shortcuts, breadcrumbs). Never for body copy or headings.

## 4. Elevation

This system is flat by default. Depth is conveyed through tonal layering (different paper tints and mist values), not through shadows. The paper-grain overlay (a fixed SVG feTurbulence texture at 4% opacity) adds subtle tactile depth across the entire viewport without creating elevation hierarchy.

Shadows appear only as a response to state: hover-lift on cards (`0 20px 40px rgba(0,0,0,0.06)`), box-shadow on scrolled header (`0 4px 20px rgba(0,0,0,0.02)`), and the ornamental button hover (`0 4px 15px rgba(0,0,0,0.15)`). These are ambient, not structural — they suggest the element has lifted slightly off the surface, not that it sits on a different plane.

### Shadow Vocabulary
- **Hover Lift** (`box-shadow: 0 20px 40px rgba(0,0,0,0.06)`): Cards and interactive elements on hover. Dark mode: `rgba(0,0,0,0.4)`.
- **Header Scroll** (`box-shadow: 0 4px 20px rgba(0,0,0,0.02)`): The fixed header when scrolled past 20px. Subtle; the blur and opacity are intentionally weak.
- **Button Hover** (`box-shadow: 0 4px 15px rgba(0,0,0,0.15)`): Ornamental primary button on hover only.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, scroll, focus). A card that ships with a default shadow has the wrong elevation.

**The Tonal Depth Rule.** Depth hierarchy uses paper tints and mist values, not shadow depth. The section paper (#f8f2e6 vs #f6f9f5) and mist (#e5e1d7 vs #d8e8ee) create tonal layering that reads as depth without lifting elements off the surface.

## 5. Components

### Buttons

Three button families serve different contexts: OrnamentalButton (hero CTAs), InkButton (inline links), and the global btn-primary / btn-secondary classes.

- **Shape:** No border-radius on OrnamentalButton (sharp edges with corner decorations). btn-primary/btn-secondary use default browser radius. InkButton has no visible border — only a brush-stroke underline.
- **Primary (OrnamentalButton):** Ink-black background (#222222), parchment text (#f9f8f6), corner decorations (8px L-shaped borders at each corner that expand to 14px on hover), Georgia serif font, 0.8em 2.5em padding. Hover: charcoal background (#141414), subtle radial glow from bottom, shadow lift.
- **Secondary (OrnamentalButton):** Transparent background, ink-black text, 1px border at `rgba(20,20,20,0.12)`, same corner decorations. Hover: mist-light background, border darkens to charcoal.
- **InkButton:** Mono font (0.74rem), no background, dual-line underline (26% ink base layer + gradient cinnabar-to-teal accent layer that expands from 34% to full width on hover). Used for inline "read more" and navigation actions.
- **btn-primary (global):** Ink-black background, white text, 1px ink border. Hover: ink-to-paper wipe animation (horizontal scaleX transition via ::after pseudo-element).
- **btn-secondary (global):** Transparent background, ink text, 1px border. Hover: mist-light fill wipe animation.

### Chips / Tags

- **Style:** JadeChip — subtle celadon-tinted gradient background, 1px celadon-tinted border, 3px border-radius, inset highlight on top edge. A small circular indicator (0.28rem) precedes the label text.
- **Active state:** Celadon-teal solid background, parchment text, border matches background.
- **Pending state:** Dashed border, bronze-tinted background, muted text color.
- **Focus:** 2px cinnabar-seal outline with 3px offset.

### Seal Badges

- **Style:** SealBadge — simulates a traditional Chinese seal stamp. Irregular border-radius (2px 4px 3px 2px), internal SVG noise texture at 15% opacity, cinnabar-seal background (#b82a2a) with parchment text.
- **Shapes:** Square (2.2em × 2.2em, text wraps) and Rectangle (vertical-rl writing mode, text upright).
- **Outline variant:** Transparent background, cinnabar text, 1.5px cinnabar border.

### Navigation

- **Header:** Fixed position, 80px height. Transparent at top; gains parchment background with 90% opacity and blur(12px) on scroll. Background texture image (header/site-header.jpeg) fades in at 15% opacity on scroll.
- **Nav items:** Chinese calligraphy label (HYDiShengHero, 1.15rem) above mono English label (0.65rem, uppercase). Cinnabar underline on hover/active (scaleX transition from right).
- **More dropdown:** Absolute positioned panel, parchment background with blur, 6px border-radius, 12px shadow. Items show cinnabar-tinted background on hover.
- **Mobile:** Full-viewport overlay at 1100px breakpoint. Staggered entrance animation (0.1s–0.65s delays). Large calligraphy labels (2rem) with mono English subtitles. Cinnabar seal watermark in bottom-right corner.

### Search Modal

- **Trigger:** Mono-font placeholder button with ⌘K keyboard shortcut indicator. Opens on click, `/` key, or Cmd/Ctrl+K.
- **Results:** Grouped by section with bilingual labels (Chinese + English). Keyboard navigation (arrow keys, Enter, Escape). Active item highlighted with celadon tint.

### Prose / Content

- **Container:** max-width 1200px, 2rem padding (1.5rem 1rem on mobile).
- **Headings:** Georgia serif, 500 weight. h2 gets a bottom border (1px divider) with an 80px-wide charcoal accent line.
- **Links:** Ink-black text, 1px border-bottom at 12% opacity. Hover: cinnabar text and border.
- **Lists:** No default bullets. Custom bronze bullet (•) positioned at -1.2rem.
- **Blockquotes:** 2px cinnabar left border, cinnabar-soft gradient background, Georgia italic, 1.25rem.
- **Horizontal rules:** 1px divider line with centered diamond (♦) ornament.

### Named Rules

**The Corner Decoration Rule.** OrnamentalButton corner decorations are the system's signature tactile element — 8px L-shaped borders at each corner with 2px dot terminals. They expand to 14px on hover. Never apply this pattern to other components; it belongs exclusively to hero CTAs.

**The Brush-Stroke Underline Rule.** InkButton's dual-layer underline (ink base + cinnabar-to-teal gradient accent) is the system's inline-link signature. The accent layer starts at 34% width and expands to full on hover. Never replace with a simple solid underline.

**The Seal Texture Rule.** SealBadge uses SVG feTurbulence noise at 15% opacity to simulate ink-on-paper texture. This is applied to seal badges only; never use the noise texture as a generic background treatment.

## 6. Section Cinematic Identity System

**Why this exists.** The Factions archive-ledger direction was rejected because it collapsed into a conservative, static, generic table of rows — indistinguishable in silhouette from any other section's archive. The scholarly / cinematic / reverent brand foundation (PRODUCT.md) is unchanged, but it is no longer sufficient on its own to stop a section redesign from defaulting to parchment archive surfaces. This doctrine makes section-specific cinematic composition an explicit, required part of the design system — not an exception to it.

### Definition

Before implementation, **every major section redesign must define and approve** all six of the following. A section redesign that cannot answer these six has not started.

- **Core metaphor** — the real-world object the section *is* (a war table, an atlas, a reliquary cabinet, a doctrine wall). Not a color, not a primitive.
- **Visual mechanic** — the structural device that makes the section feel like that metaphor (great-power plates orbiting a triad; a vertical chronicle rail; a radical-index lookup). The mechanic is the concept.
- **Image strategy** — whether the section is image-led, and if so, what kind of imagery fits the concept (see "Image-Led Composition" below).
- **Layout silhouette** — the page's distinctive shape at a far zoom, with all text blurred (see "The Silhouette Test").
- **Motion language** — which motions the section earns and why (see §7 Motion, and the brand "Earned motion" principle).
- **Typography mood** — how the section uses the system's font roles to carry its metaphor (heavier display for carved signage, italic serif for secondaries, mono for registry labels, etc.).

**A section redesign begins from concept and composition, not primitive adoption.** A section that begins by "adopting the design primitives" without an approved visual mechanic has no concept to express — it is reskinning the old layout with new tokens. That is the failure mode this doctrine exists to prevent.

### Approved Section Identities

Each section has a canonical metaphor. These are the default concepts for section redesigns; deviating requires an explicit, approved alternative concept of equal distinctiveness.

| Section | Metaphor |
|---|---|
| Timeline | Chronicle Rail |
| Swordsmanship | Blade Path / Manual Zones |
| Factions | 天下势力盘 / Sect Power Board / Political War Table |
| World | Atlas / Gazetteer Map |
| Characters | Dossier / Identity Register |
| Artifacts | Reliquary Cabinet |
| Teachings | Doctrine Tablet Wall |
| Pantheon | Divine Court / Office Registry |
| Glossary | Scholar Lexicon / Radical Index |

### Named Rules

**The Silhouette Test.** A page must still feel distinct from every other section if all its text is blurred. If the layout reduces to *hero + tabs + equal cards + footer*, it has failed the test regardless of how well the primitives are applied. The visual mechanic must produce a recognizable silhouette — plates on a field, a vertical rail, a cabinet of drawers, a layered map — before any typography or token work begins.

**Archive Is Not The Default.** Archive / register / table treatments belong only where the section concept demands them (Glossary's radical index, the appendix register on a board page, a verbatim citation list). They must not become the default layout for every section. When a section's metaphor is not archive-shaped, reaching for a ledger of rows is the conservative trap — reject it and return to the approved visual mechanic.

**Primitive Adoption Is Not Redesign.** Primitives (brush titles, seal stamps, cinnabar tags, ink underlines, section tokens) *support* the visual concept; they do not *create* it. Do not begin Stage 35E section work with primitive adoption unless the section's visual mechanic is already approved. A redesign whose plan is "adopt the primitives across the existing layout" is a reskin, not a redesign.

**Image-Led Composition.** Important section pages may use strong official / cinematic art as **structural composition**, not only as subtle texture or a 15%-opacity wash. An image may anchor the page's identity when it fits the section concept:
- **Factions:** halls, courts, political assemblies, mountain gates, war tables, walled cities, dynastic capitals.
- **Character-focused sections:** portraiture is permitted.
- **Not permitted as section atmosphere:** lone character close-ups on non-character sections, random spiritual tunnels, generic landscapes with no power / institutional context, washed placeholders where a real image belongs.

When a section is image-led, the image must be sourced or commissioned to fit the concept; a placeholder that fights the page concept (e.g. a lone-wanderer landscape on a political board) is a defect, not a stopgap.

### Approved New-Doctrine Section: Factions / 天下势力盘

Factions is the first section migrated under this doctrine. Its concept is approved:

- **Core metaphor:** 天下势力盘 / Sect Power Board — a political war table.
- **Visual mechanic:** great powers as large political plates (a central triad of paramount powers, an orbit field of secondary powers, a satellite band of lesser powers), with an alliance / relationship web and mountain-gate territory plates, and a compact register demoted to appendix.
- **Identity rules (enforced):**
  - Dark political war-table board field.
  - Great powers rendered as large political plates, not rows.
  - Alliance lanes / relationship web, not chip-dumped cards.
  - Mountain-gate territories as registered seat plates, not mini lists.
  - Compact register as appendix only; it must not define the page identity.
  - No seal spam — seals are authority marks on the paramount powers, not a decorative rack.
  - No repeated ledger rows above the fold.
  - No beige archive default — the section's dark board field is intentional.
  - No generic card grid.

This concept replaces the rejected Factions archive-ledger. It is the reference implementation for how the Section Cinematic Identity System is applied to a real section.

## 7. Motion

This system uses motion semantically. The brand foundation's "Earned motion" principle (PRODUCT.md Design Principle 5) governs all animation: every animation has a semantic reason, and if removing it loses no meaning, it should not exist.

- **Reveal motion** marks content hierarchy (fade-up, blur-clear, line-draw reveals via `useScrollReveal`).
- **Entrance motion** groups related items (staggered plate rises, orbit rises, lane rises on section-defining compositions).
- **Atmospheric motion** is permitted on image-led sections (slow hero-drift parallax, seal-pulse on paramount elements) when it supports the section's visual mechanic and is gated by `@media (prefers-reduced-motion: reduce)`.

**The Reduced-Motion Rule (non-negotiable).** Every animation must have a `@media (prefers-reduced-motion: reduce)` alternative (instant transition or crossfade). No motion is decorative-only; all motion can be removed without losing content or meaning. This is also a PRODUCT.md accessibility commitment.

## 8. Do's and Don'ts

### Do:
- **Do** use cinnabar-seal (#b82a2a) as the primary accent on ≤10% of any screen. Its rarity is authority.
- **Do** maintain ≥4.5:1 contrast for body text (ink-wash #4a4a4a on parchment #f9f8f6 = 7.2:1). Verify every text/background pair.
- **Do** use section-specific themes via `[data-jl-section]` attributes. Each section is a chapter with its own palette.
- **Do** wrap all animations in `@media (prefers-reduced-motion: reduce)` with instant or crossfade alternatives.
- **Do** use the calligraphy accent font (HYDiShengHero) only for short Chinese display text — nav labels, section names, watermarks.
- **Do** use serif headings (Georgia) against sans body (system stack). This contrast is the system's typographic voice.
- **Do** use JetBrains Mono exclusively for metadata, labels, and UI chrome.
- **Do** include text labels alongside color-only indicators (badges, status, tags) for color blindness accessibility.
- **Do** use semantic HTML landmarks (<header>, <nav>, <main>, <footer>) and proper heading hierarchy.
- **Do** test all section accent colors under deuteranopia, protanopia, and tritanopia simulations.
- **Do** begin every major section redesign from an approved concept — core metaphor, visual mechanic, image strategy, layout silhouette, motion language, typography mood (see §6 Section Cinematic Identity System). A section with no approved visual mechanic has not started.
- **Do** pass The Silhouette Test (§6): a page blurred of all text must still feel distinct from every other section.
- **Do** use strong official / cinematic art as structural composition on image-led sections when the art fits the section concept. A real image that fits the metaphor beats a washed texture that doesn't.

### Don't:
- **Don't** use generic SaaS dashboard layouts — no app-shell patterns, no sidebar navigation, no data tables as default presentation. (PRODUCT.md anti-reference: "Generic SaaS dashboards")
- **Don't** use Fandom.com / wiki-farm visual patterns — no cluttered ad-driven layouts, no default MediaWiki skins, no "community portal" energy. (PRODUCT.md anti-reference: "Fandom.com / wiki farms")
- **Don't** use mobile game UI elements — no neon borders, no glowing skill trees, no gacha-style card reveals. (PRODUCT.md anti-reference: "Mobile game UI")
- **Don't** use purple-blue AI gradients, glassmorphism, or aurora effects. (PRODUCT.md anti-reference: "Purple-blue AI gradients")
- **Don't** use identical card grids — same-sized cards with icon + heading + text repeated endlessly. (PRODUCT.md anti-reference: "Glossy card grids")
- **Don't** use anime attack effects — no energy beams, no speed lines, no particle explosions as decorative elements. (PRODUCT.md anti-reference: "Anime attack effects")
- **Don't** animate for animation's sake. No bounce/elastic easing. No parallax that fights the reader. (PRODUCT.md anti-reference: "Over-animation")
- **Don't** let canvas/WebGL/visual effects *replace* readable prose. The wiki is text-first; visual effects enhance, never replace, content. (PRODUCT.md anti-reference: "Canvas/WebGL replacing content".) This is a content-preservation rule, **not** a technology ban. CSS, SVG, WebGL, and Tres.js are all permitted when they (a) support an approved section visual mechanic (§6), (b) remain accessible (keyboard, screen-reader, reduced-motion safe), and (c) preserve readable text content. What is banned is using a visual effect *instead of* content — not the technology itself.
- **Don't** apply the calligraphy accent font to body copy or any text longer than 5 words.
- **Don't** use shadow depth for elevation hierarchy. Use tonal layering (paper tints, mist values).
- **Don't** mix section theme tokens on the same screen. Each section is a self-contained chapter.
- **Don't** use border-radius above 6px on cards or containers. Buttons and chips use their own radius scale.
- **Don't** ship elements with default shadows. Shadows are hover/state responses only.
- **Don't** use `text-shadow` on nav labels in non-timeline contexts. The timeline header variant is the only exception.
- **Don't** default a section to an archive / register / table of rows unless that section's concept is archive-shaped (see §6 "Archive Is Not The Default"). Reaching for a ledger when the metaphor is a board, a map, or a cabinet is the conservative trap.
- **Don't** begin section redesign work with primitive adoption (see §6 "Primitive Adoption Is Not Redesign"). Adopting brush titles, seal stamps, and section tokens across an existing layout is a reskin, not a redesign — the visual mechanic must be approved first.
- **Don't** use imagery that fights the section concept — lone character close-ups on non-character sections, random spiritual tunnels, or generic landscapes with no power/institutional context as section atmosphere (see §6 "Image-Led Composition").
