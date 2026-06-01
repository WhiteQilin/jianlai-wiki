# UI/UX Implementation Plan: Jian Lai Wiki

Based on the visual audit and `.clinerules` (modern cinematic Shuimo, premium fandom wiki), here is the implementation plan to elevate the site's design and user experience.

## Phase 1: High Priority - Homepage Visual Hierarchy

**Goal:** Strengthen the homepage visual hierarchy below the hero section to break the "grid of links" pattern and create a more engaging, editorial feel.

*   **Files/Components to Inspect:**
    *   `jianlai-wiki-nuxt/app/pages/index.vue`
    *   `jianlai-wiki-nuxt/app/components/FeaturedTheatre.vue`
    *   `jianlai-wiki-nuxt/app/components/FeaturedSpotlight.vue`
    *   `jianlai-wiki-nuxt/app/components/FeaturedDossier.vue`
*   **Components to Edit/Create:**
    *   Edit `jianlai-wiki-nuxt/app/pages/index.vue` to restructure the layout.
    *   Potentially modify existing featured components or create a new `FeaturedSection.vue` to implement a split-screen or magazine-style layout for featured content.
*   **Visual Improvement Expected:** A more dynamic landing experience that draws users into specific lore pieces rather than just presenting navigation categories.
*   **Implementation Risks:** Breaking the existing responsive layout on the homepage. Ensuring new media assets are optimized and follow the media rules.
*   **Testing Route:** `http://localhost:3000/`
*   **Tool:** Playwright (to verify visual layout and responsiveness across viewport sizes).

## Phase 2: High Priority - Premium Fandom Dossiers

**Goal:** Improve individual entry pages so they feel like premium fandom dossiers rather than standard markdown documentation.

*   **Files/Components to Inspect:**
    *   `jianlai-wiki-nuxt/app/pages/characters/[...slug].vue` (and other dynamic routes)
    *   `jianlai-wiki-nuxt/app/components/CharacterInfobox.vue`
    *   `jianlai-wiki-nuxt/content/characters/chen-pingan.md`
*   **Components to Edit/Create:**
    *   Edit `jianlai-wiki-nuxt/app/pages/characters/[...slug].vue` to adjust the overall page layout (e.g., allowing infoboxes to float alongside content).
    *   Create/Enhance MDC components in `jianlai-wiki-nuxt/app/components/content/` such as a stylized `QuoteBlock.vue`, an improved `Infobox.vue`, or a `LoreGallery.vue`.
*   **Visual Improvement Expected:** Breaking up long blocks of text with visually distinct elements. Creating a magazine-like reading experience that aligns with the cinematic aesthetic.
*   **Implementation Risks:** MDC component integration issues. Ensuring the layout remains robust regardless of the length or structure of the underlying markdown content.
*   **Testing Route:** `http://localhost:3000/characters/chen-pingan`
*   **Tool:** Playwright (to verify visual layout and MDC component rendering).

## Phase 3: Medium Priority - Empty States

**Goal:** Improve empty states on archive pages to maintain immersion even when content is missing.

*   **Files/Components to Inspect:**
    *   `jianlai-wiki-nuxt/app/components/EmptyArchiveState.vue`
    *   `jianlai-wiki-nuxt/app/pages/artifacts/index.vue` (as a test case)
*   **Components to Edit/Create:**
    *   Edit `jianlai-wiki-nuxt/app/components/EmptyArchiveState.vue`.
*   **Visual Improvement Expected:** Replacing generic "No items found" text with a visually interesting design, perhaps incorporating a subtle ink-wash texture or a thematic quote.
*   **Implementation Risks:** Low risk. Primarily ensuring the new design aligns with the overall aesthetic and doesn't distract from the main interface.
*   **Testing Route:** `http://localhost:3000/artifacts` (or any archive page with an active filter that yields no results).
*   **Tool:** Playwright (to verify visual appearance).

## Phase 4: Medium Priority - SiteHeader Polish

**Goal:** Polish the `SiteHeader` scroll state, active navigation state, and overall visual weight.

*   **Files/Components to Inspect:**
    *   `jianlai-wiki-nuxt/app/components/SiteHeader.vue`
    *   `jianlai-wiki-nuxt/app/assets/css/main.css`
*   **Components to Edit/Create:**
    *   Edit `jianlai-wiki-nuxt/app/components/SiteHeader.vue`.
*   **Visual Improvement Expected:** Adding a distinct visual state when scrolling (e.g., a backdrop blur or subtle bottom border) to separate navigation from content. Improving the visibility of the active navigation link.
*   **Implementation Risks:** Z-index conflicts with other floating elements. Potential performance impact of `backdrop-filter` if overused (though usually acceptable for headers).
*   **Testing Routes:** `http://localhost:3000/` and `http://localhost:3000/characters/chen-pingan` (scroll down to test).
*   **Tool:** Playwright (to verify scroll behavior and visual states).

## Phase 5: Low Priority - DossierCard Interactions

**Goal:** Improve `DossierCard` hover interactions and image motion.

*   **Files/Components to Inspect:**
    *   `jianlai-wiki-nuxt/app/components/DossierCard.vue`
    *   `jianlai-wiki-nuxt/app/assets/css/main.css`
*   **Components to Edit/Create:**
    *   Edit `jianlai-wiki-nuxt/app/components/DossierCard.vue`.
*   **Visual Improvement Expected:** Adding subtle scale effects to images on hover, or slight color shifts to borders/backgrounds using `--c-seal-red-soft`. Increasing tactile feedback without being overly flashy.
*   **Implementation Risks:** Overdoing animations, making them feel cheap rather than cinematic. Performance issues if animations are not optimized.
*   **Testing Route:** `http://localhost:3000/characters`
*   **Tool:** Playwright (to verify hover interactions).
