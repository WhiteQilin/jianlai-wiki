# Stage 21A: Public Beta Launch Readiness & Roadmap Pivot Audit

## 1. Current Status Snapshot
- **Route Count:** 207 generated routes.
- **Ghost Links:** 0 unique ghost links remaining.
- **Editor QA:** PASS (75/75 tests passed).
- **Static Generation:** PASS (Successfully generated with `NUXT_PUBLIC_MEDIA_BASE_URL`).
- **Staging Safety:** Confirmed. `.gitignore` correctly excludes `.output`, `.nuxt`, `public/videos/all-mp4`, `public/fonts/*` (except production), and local AI/editor files.
- **Admin/Titles Leak:** Confirmed safe. `/admin` is not prerendered, and `/titles` is excluded from generation and sitemap.

## 2. Public Beta Launch Blockers
- **Literal `剑来X` Strings:** Found 65 instances of literal `剑来[0-9]+` strings in content files (e.g., `剑来25：天地皆同力` in `content/characters/ruan-xiu.md`, `content/characters/li-liu.md`, etc.). These break the immersion and formatting standards.
- **Code Fence Artifacts:** Found stray ```` artifacts at the end of some content files (e.g., `content/characters/ruan-xiu.md`, `content/characters/yao-laotou.md`).
- **Sample Pages:** Sample pages (e.g., `content/artifacts/sample.md`, `content/glossary/sample.md`, `content/factions/sample.md`) are still present and being generated into the public build. These look unprofessional in a public beta.

## 3. Important Pre-Beta Polish
- **Contributor Onboarding:** There is currently no visible way for fans to suggest edits or report issues. A "Suggest an Edit" button (linking to GitHub Issues) or a basic contribution guide is needed.
- **Media Placeholders:** Ensure all entries without specific images/videos fallback gracefully to the curated ink-wash textures or official placeholders without looking broken.
- **Mobile Layout Review:** Conduct a final pass on mobile layouts, especially for complex components like `EntryRelationshipPanel` and `TimelineRail`.

## 4. Safe Post-Beta Improvements
- **"Wanted Pages" / Missing Entries:** Create a dedicated page or section highlighting entries that need to be written, encouraging community contribution.
- **Enhanced Search:** Improve search discoverability, potentially adding typo tolerance or synonym matching for complex Chinese names/terms.
- **Advanced Relationship Visualizations:** Upgrade the relationship panels to interactive graphs or more detailed visual representations.

## 5. Long-Term Roadmap Tracks
- **Comprehensive Content Coverage:** Systematically fill major lore holes, expanding beyond the initial Luopo/Dragon Springs focus to cover other continents, major factions (e.g., full Bai Yujing hierarchy), and historical events.
- **Taxonomy Evolution:** Refine the schema based on real user feedback. Some type fields might need expansion or consolidation as more edge cases are encountered.
- **Community Editor:** Explore safe ways to allow trusted community members to use a version of the local editor, perhaps via a staging environment or PR-based workflow.

## 6. Content Coverage Gaps
- While the Luopo / Dragon Springs batch is complete, major factions like the Great Li Dynasty, Bai Yujing, and the Confucian Temple have only foundational entries.
- Many secondary characters and specific artifacts mentioned in the main entries still lack their own dedicated pages.
- The timeline currently lacks comprehensive coverage of ancient events (e.g., the Heavenly Court war).

## 7. UI/UX Gaps
- **Empty States:** Some empty states (e.g., when a category has no entries) could be more engaging and visually aligned with the Shuimo identity.
- **Visual Consistency:** Ensure the restrained red seal accents are used consistently across all new components introduced in recent stages.

## 8. Editor/Backend Gaps
- **Import Normalizer:** The NotebookLM import normalizer needs to be updated to automatically strip literal `剑来X` strings and trailing code fences (` ``` `) to prevent these artifacts from entering the content base.
- **Sample Page Handling:** The editor/build system needs a mechanism to explicitly ignore `sample.md` files during production generation.

## 9. Contributor-Readiness Gaps
- **No Public Issue Tracking:** Fans have no clear path to report lore inaccuracies or typos.
- **No Contribution Guide:** Non-coder fans who want to write lore have no instructions on how to format their text or submit it.
- **No "Help Expand" CTA:** The site lacks calls-to-action encouraging fandom participation.

## 10. Recommended Next Stages After 21A
- **Stage 21B: Pre-Beta Content Polish:** Fix literal strings, remove code fences, and exclude sample pages from the build. Update the import normalizer to handle these automatically.
- **Stage 21C: Contributor Onboarding:** Add a "Contribution Guide" and integrate "Suggest an Edit" links pointing to GitHub Issues.
- **Stage 21D: Final UI/UX & Mobile Polish:** Conduct a comprehensive visual QA pass on desktop and mobile.

## 11. QA/Generate Results
- `npm run editor:qa`: **PASS** (75/75 tests).
- `npm run generate`: **PASS** (207 routes generated).
- `/admin` prerendering: **Confirmed disabled**.
- `/titles` generation: **Confirmed disabled**.
- Staging safety: **Confirmed** (no raw media or fonts staged).

## 12. Final Recommendation
**Not ready yet, with reasons.**

While the technical foundation, routing, and editor are solid, the presence of literal `剑来X` strings, code fence artifacts, and generated `sample.md` pages are blockers for a premium fandom wiki launch. These issues break the immersion and professional feel of the site. 

Once these specific content artifacts are cleaned up (Stage 21B) and a basic mechanism for user feedback is added (Stage 21C), the site will be ready for a Public Beta.