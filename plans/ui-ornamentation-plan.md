# UI Ornamentation Plan: Restrained Chinese-Style UI

## Overview
This plan outlines the introduction of subtle, reusable Chinese-style UI elements to the Jian Lai wiki, inspired by the provided reference image. The overarching design direction is **modern cinematic Shuimo (水墨)**. We will avoid flashy, heavy mobile-game styles in favor of an elegant, premium, paper-and-ink aesthetic with restrained accents.

---

## 1. SealBadge.vue
- **Purpose**: A small, inline or corner badge mimicking a traditional Chinese red ink seal (印章). Used for status, authentication, or categorization.
- **Where it should be used**: "To be verified" flags, "Official" markers on canonical lore, volume numbers (e.g., "卷"), or primary tags like "Main Protagonist".
- **Where it should not be used**: Large blocks of text, primary navigation, or as clickable primary actions (it should look like a stamp, not a button).
- **Visual Style**: Restrained cinnabar red (`#bd3124`), slightly irregular/distressed border to simulate an authentic stamp (achievable via CSS `border-radius` micro-adjustments or subtle borders). Can be vertical or square. Text is white on red (filled) or red on transparent (outline).
- **Props/API**:
  - `text` (String): The text inside the seal (1-4 characters).
  - `variant` (String: `'filled' | 'outline'`): Solid red background or transparent with red outline.
  - `shape` (String: `'square' | 'rectangle'`): Determines aspect ratio.
- **Implementation Risk**: Low. Achievable with pure CSS and standard fonts. No heavy SVGs required.
- **Test Route**: `/characters` (stamping "Main Protagonist" on a card) or `/artifacts`.

---

## 2. OrnamentalDivider.vue
- **Purpose**: A thematic horizontal break to separate major sections of content, replacing generic `<hr>` tags.
- **Where it should be used**: Between homepage sections, or at the end of long article sections before the next major heading.
- **Where it should not be used**: Inside dense data tables, between short paragraphs, or in tight UI components like sidebars.
- **Visual Style**: A thin, elegant line (ink gray or celadon blue) featuring a central motif (a subtle jade circle, a minimal lotus, or a simple ruyi knot). It mirrors the "分隔裝飾" (Divider decorations) in the reference but simplified to remain matte and ink-like rather than metallic or shiny.
- **Props/API**:
  - `motif` (String: `'jade' | 'lotus' | 'ruyi' | 'none'`): The central icon.
  - `color` (String: `'ink' | 'celadon'`): The theme color of the divider.
- **Implementation Risk**: Low-Medium. Requires clean, minimal SVG assets for the central motifs to ensure crispness. Must flex responsively using CSS `flex-grow` for the lines extending from the center.
- **Test Route**: `/` (homepage, between featured sections).

---

## 3. OrnamentalButton.vue
- **Purpose**: A highly styled button reserved for major calls to action.
- **Where it should be used**: Major CTAs like "Explore the Wiki", "Read the Timeline", or entering a major archive portal.
- **Where it should not be used**: Generic actions (submit, cancel, pagination), standard inline links, or repeated lists of tags.
- **Visual Style**: Inspired by the "主要按鈕" (Primary buttons) but flatter and more cinematic. Solid elegant background (celadon or ink blue), an intricate but low-opacity border (using corner accents), and perhaps a subtle cloud pattern overlay on hover. Text remains crisp HTML text.
- **Props/API**:
  - `to` (String/Object): NuxtLink destination.
  - `variant` (String: `'primary' | 'secondary'`): Primary has corner accents; secondary is simpler.
  - `icon` (String, optional): Optional icon to place alongside text.
- **Implementation Risk**: Medium. Building responsive corner ornamentation (`邊框角飾`) purely with CSS or minimal SVGs without breaking on different text lengths can be tricky. CSS `border-image` or absolute-positioned corner SVGs will be used.
- **Test Route**: `/` (homepage hero section CTA).

---

## 4. OrnamentalTabs.vue (Optional)
- **Purpose**: A thematic tab switcher for filtering views or content, inspired by the "分頁按鈕" (Tab buttons).
- **Where it should be used**: Archive pages (e.g., sorting Artifacts by type) or character pages (switching between 'Biography', 'Relationships', 'Cultivation').
- **Where it should not be used**: Global site navigation (header) or deep technical settings.
- **Visual Style**: A flat bottom edge with a slightly ornate or stepped top edge. Unselected tabs are faded ink gray; the selected tab stands out in celadon or deeper ink with a subtle top accent (like a small jade dot).
- **Props/API**:
  - `tabs` (Array of Objects): `[{ id, label, icon }]`
  - `modelValue` (String): Currently active tab id.
- **Implementation Risk**: Medium. Ensuring accessibility (keyboard navigation, ARIA roles) while customizing the visual shape. The custom top shape might require SVG backgrounds or CSS `clip-path`.
- **Test Route**: `/characters` or `/world`.
