# Phase 2 Implementation Plan: Premium Fandom Dossiers

**Goal:** Elevate individual entry pages (starting with `/characters/chen-pingan`) from standard markdown documentation to premium, cinematic fandom dossiers.

## 1. Files to Modify
*   `jianlai-wiki-nuxt/app/pages/characters/[...slug].vue` (Main layout template for characters)
*   `jianlai-wiki-nuxt/app/components/CharacterInfobox.vue` (Sidebar stats component)
*   `jianlai-wiki-nuxt/app/components/NameBlock.vue` (Title and seal component)
*   `jianlai-wiki-nuxt/app/assets/css/main.css` (For any global `.mdc-prose` typography tweaks)
*   `jianlai-wiki-nuxt/content/characters/chen-pingan.md` (To test new MDC components)

## 2. Components to Create or Improve
*   **Improve `CharacterInfobox.vue`:** 
    *   Enhance the visual design to feel more like a classified dossier or ancient scroll.
    *   Add subtle background textures (`ink-wash-01.webp`).
    *   Refine typography for labels and values.
    *   Add a visual "stamp" effect for the `status` (e.g., "Verified", "Legend").
*   **Improve `NameBlock.vue`:**
    *   Refine spacing and alignment between English, Chinese, Pinyin, and the Seal.
    *   Ensure it scales elegantly on mobile.
*   **Create `QuoteBlock.vue` (New MDC Component):**
    *   Create a stylized blockquote component in `app/components/content/` specifically for novel excerpts or character quotes.
    *   Design: Large decorative quotation marks, italicized serif font (`--font-heading`), subtle red accent border or background.

## 3. Layout Structure (`[...slug].vue`)
*   **Header Integration:** Tightly integrate the `NameBlock` with the top of the page, potentially overlapping the `SectionHero` (if present) or creating a distinct header area if no video is available.
*   **Dossier Split:** Maintain the `article-layout` with the main content on one side and the `article-sidebar` (containing the `CharacterInfobox` and `sticky-toc`) on the other.
*   **Section Rhythm:** Ensure ample spacing between markdown sections (`## Overview`, `## Cultivation`, etc.) to prevent the page from feeling like a dense wall of text. Use `InkDivider` components strategically if needed.

## 4. Risks
*   **Mobile Responsiveness:** The sidebar/main content split must stack gracefully on smaller screens. The `CharacterInfobox` should probably appear *before* the main text on mobile.
*   **MDC Compatibility:** Ensuring any new MDC components (like `QuoteBlock`) render correctly within the `<ContentRenderer>`.
*   **Consistency:** Changes made to the character layout might need to be replicated across other dynamic routes (e.g., `/artifacts/[...slug].vue`, `/world/[...slug].vue`) later to maintain site-wide consistency.

## 5. Testing Steps
1.  Use Playwright/Browser Tools to navigate to `http://localhost:3000/characters/chen-pingan`.
2.  **Visual QA (Desktop):** Verify the sidebar layout, infobox styling, and typography hierarchy.
3.  **Visual QA (Mobile):** Emulate a mobile viewport to ensure the layout stacks correctly and remains readable.
4.  **Content QA:** Add a test `::quote-block` to `chen-pingan.md` and verify it renders with the correct styling.

## 6. What Should Remain Unchanged from Phase 1
*   The global layout constraints (`.page-container`, `.mdc-content`).
*   The core cinematic Shuimo aesthetic (color palette, typography variables, textures).
*   The newly restructured homepage (`index.vue`) and `FeaturedSection.vue`.