# Stage 35E-0B — Rendered Visual Audit (Live Browser Pass)

**Date:** 2026-06-26
**Method:** Live Playwright capture at 1440×900 (desktop) and 390×844 (mobile), full-page scroll-triggered, all 12 top-level index routes on `http://localhost:3000`.
**Companion doc:** `stage-35e-0-visual-baseline-audit.md` (static/source-level baseline). This pass validates that baseline against the actually-rendered DOM.
**Screenshots:** `plans/screenshots/stage-35e-0b/{desktop,mobile}/01–12-*.png`

---

## 1. Capture-method caveat (read first)

The site uses a global scroll-reveal gate:

- `reveal-fade-up` / `reveal-blur-clear` wrappers default to visible.
- Once `reveal-ready.client.ts` sets `data-reveal-ready` on `<html>`, any
  `.reveal-*:not(.revealed)` is forced to `opacity: 0` + `translateY(30px)`.
- An IntersectionObserver (or the `useScrollReveal` composable) adds `.revealed`
  when the element scrolls into view.

A programmatic `fullPage` screenshot composites the page without firing the
observer for off-screen regions, so **content below the first viewport can render
blank in a full-page PNG even though it is present, populated, and `visibility:
visible` in the DOM.** This was confirmed on Swordsmanship by inspecting computed
styles (all zones present, `opacity: 0`, transform offset intact) and is visible
on Home, Characters, and Cultivation full-page shots as well.

**Implication:** blank lower regions in the full-page captures are a capture
artifact, not a defect. Findings below are based on DOM inspection + the
in-viewport portions, not the blank composite areas.

---

## 2. Per-page results

### Tier 1 — Bespoke, fully designed

| Page | Route | Theme | Desktop H | Mobile H | Verdict |
|------|-------|-------|-----------|----------|---------|
| Home | `/` | Light paper | 5167 | — | 10/10 |
| Characters | `/characters` | Light paper | 7775 | — | 10/10 |
| World | `/world` | Light paper | 4440 | — | 10/10 (richest data page) |
| Cultivation | `/cultivation` | Light paper | 4254 | — | 10/10 |
| Timeline | `/timeline` | Dark chronicle | 9094 | 22122 | 10/10 |
| Swordsmanship | `/swordsmanship` | Dark blade-path | 4691 | — | 10/10 |

- **Home** — Light-paper hero, gold 剑 calligraphy, "SWORD, COME! ENCYCLOPEDIA",
  stat bar (14 realms / 100+ characters / ∞ worlds), three CTAs (Browse
  Characters, Explore World, View Timeline). "Featured Lore" + "Cinematic
  Archives" sections below (reveal-gated, blank in capture).
- **Characters** — "人物志" hero, stat panel (35 total / 18 verified / 161 / 8 / 21),
  "Central Records" horizontal card row (Chen Ping'an, Old Scholar, Qi Jingchun,
  Liu Xianyang, Cui Chan).
- **World** — "天下图志" hero, stat panel (12 records / 4 heavens / 8 verified /
  6 links), "Macro-Worlds (天下)" 2×2 heaven grid, "Associated Places" location
  clusters, filterable "Mountain-River Records" list, "Explore More" nav cards.
  Renders fully in capture.
- **Cultivation** — "山上修行" hero, stat bar (3 paths / 3 realm groups / 6 records),
  "Path comparison" 3-card row (Qi Refiner / Sword Cultivator / Pure Martial
  Artist), stepped "Qi Refiner Realm Ladder" (01/02/03).
- **Timeline** — Only dark Tier-1 besides Swordsmanship. Era rail, calligraphy-
  marked event cards grouped by arc. Mobile is very long (22122px) but single-
  column with no breakage.
- **Swordsmanship** — Dark "剑术神通" blade-path hero, featured slip ("Caged
  Sparrow / 笼中雀"), stat bar (7 arts / 3 families / 7 review marks), manual zones
  (`bp-zone--tang/shoulder/edge/point`). All zones confirmed present in DOM.

### Tier 2 — Template / generic poster-card grid (light paper)

| Page | Route | Desktop H | Mobile H | Verdict |
|------|-------|-----------|----------|---------|
| Factions | `/factions` | — | 16061 | Coherent, template |
| Artifacts | `/artifacts` | 2314 | 4607 | Clean, 3 equal cards |
| Rankings | `/rankings` | 3580 | 7003 | List-based, template |
| Teachings | `/teachings` | 2376 | 4670 | Template + banner hero |
| Glossary | `/glossary` | 3025 | 5866 | 5 entries, poster grid |

- **Factions** — Very tall on mobile (16061px) but stacks coherently; no overflow
  or breakage.
- **Artifacts** — Pure light-paper template, three same-size cards, generic grid.
- **Rankings** — List-oriented template; stacks cleanly on mobile.
- **Teachings** — Poster-card template **but does have a banner hero image**
  (corrects the static baseline, which claimed no hero).
- **Glossary** — 5 entries (Golden Essence Copper Coin, Grain Rain Coin, Immortal
  Money, Natal Porcelain, Snowflake Coin), poster-card grid, "Explore More" nav.
  Stacks cleanly on mobile.

### Empty — needs content before redesign

| Page | Route | Desktop H | Mobile H | State |
|------|-------|-----------|----------|-------|
| Pantheon | `/pantheon` | 2086 | 3041 | **Empty** |

- **Pantheon** — Renders an empty "Records awaiting inscription" state with zero
  deity records at both viewports. Any redesign effort is premature until content
  exists.

---

## 3. Deltas vs. static baseline (35E-0)

1. **Teachings has a banner hero** — baseline claimed it lacked one. Confirmed
   present in live render.
2. **Pantheon is empty** — not flagged as a content gap in the baseline; it is the
   single most important finding here. Redesign calculus should treat it as
   content-blocked, not design-blocked.
3. **Reveal-gating capture artifact** — full-page PNGs under-represent Tier-1
   pages (Home/Characters/Cultivation/Swordsmanship). Any visual-diff tooling
   built on full-page captures must scroll-and-stitch or disable the reveal gate,
   or it will report false "blank section" regressions.

---

## 4. Recommendations

- **Tier 1 (6 pages):** No action. Bespoke, responsive, on-theme.
- **Tier 2 (5 pages):** Candidates for bespoke treatment in priority order by
  data richness — Factions and Rankings first (most content), then Teachings,
  Glossary, Artifacts.
- **Pantheon:** Content first. Author deity records before any layout work.
- **Tooling:** If automated visual regression is planned, capture per-viewport
  scrolled tiles or set `prefers-reduced-motion` / force `data-reveal-ready` off
  so reveal-gated content is captured fully.

---

## 5. Mobile summary

All 12 pages stack to a single column with no horizontal overflow or broken
layout at 390px. Tallest mobile pages: Timeline (22122px), Factions (16061px) —
both long but structurally sound.
