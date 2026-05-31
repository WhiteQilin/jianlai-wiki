# Public Assets Directory

This folder serves as the central repository for all static media assets used on Jian Lai Wiki.

## Structure

- `images/banners/` - Horizontal images used in `<MediaBanner>` components at the top of section pages.
- `images/characters/` - Character portraits and key visuals used in `<CharacterInfobox>` and `<ImageFrame>`.
- `images/locations/` - Scenery, concept art, and maps.
- `images/logos/` - Site logos, seals, and branding elements.
- `images/textures/` - Subtle paper, ink, or noise overlays (if image-based textures are needed beyond CSS).
- `videos/` - Local `.mp4` or `.webm` files used in `<HeroMedia>` or `<VideoEmbed>`.

## Important Guidelines

1. **Disclaimer & Copyright**: Jian Lai Wiki is an unofficial fan-made encyclopedia. Official promotional images from the donghua, manhua, or other official artwork belong to their respective rights holders. We use these assets sparingly under fair use for fandom reference. **Always** include image credit and captions (e.g., using `credit="Tencent Video / Jian Lai Animation" :isOfficial="true"` in components) wherever official artwork is displayed. Do not treat official images as unrestricted or site-owned assets.
2. **Optimization**: Optimize all images (WebP/JPEG) and videos before adding them to keep the wiki lightweight.
3. **Usage**: Reference these files in markdown or components starting with a forward slash: `/images/characters/chen-pingan.webp` (Nuxt resolves `/` to the `public/` directory).
