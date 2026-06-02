# Jian Lai Wiki — Editor Engine Roadmap

**Status:** Stage 8K Complete — Editor MVP audited and documented  
**Goal:** Keep Markdown + Nuxt Content as the source of truth while providing a safe, local-only editor workflow for Jian Lai wiki contributors.

---

## 1. Current Architecture Summary

The Jian Lai wiki is built on **Nuxt 3/4 + Nuxt Content v3**.

- **Storage:** Markdown files in `content/`, organized by public section.
- **Schema:** Frontmatter is governed by `content.config.ts` and the field definitions in `plans/entry-field-registry.md`.
- **Rendering:** The public site is statically generated with `npm run generate`.
- **Editor:** `/admin` is a development-only local editor that reads and writes Markdown through dev-only Nitro API routes.
- **Safety:** `/admin` is not prerendered, `/titles` remains internal, and write/delete APIs are blocked outside dev mode.

---

## 2. Storage Strategy

The selected MVP strategy remains **local Markdown file-backed editing**.

### Why this remains correct

1. It keeps Nuxt Content and Markdown as the source of truth.
2. It avoids premature auth/database/backend complexity.
3. It lets the team validate editor UX around relationships, references, media paths, and frontmatter.
4. It keeps all changes reviewable through Git.
5. It preserves a future path toward Git-backed CMS or database-backed workflows without forcing that migration now.

---

## 3. Editor MVP Scope

### Included in the completed MVP

- Entry listing.
- Entry reading.
- Editable frontmatter form.
- Markdown body editor.
- Client-side validation and warnings.
- Server-side validation for write paths.
- Safe save with backups.
- Relationship picker.
- Tag editor.
- Structured references editor.
- Create-entry wizard.
- NotebookLM raw Markdown import.
- Preview/open public page workflow.
- Advanced field editors.
- Media path picker for existing images and curated videos.
- Dev-only route/API safety.
- `/admin` excluded from prerendering.
- `/titles` excluded from editor/public workflows.
- Dev-only delete endpoint for temporary test cleanup, with backup-before-delete.

### Still intentionally excluded

- Public authentication.
- Database storage.
- Hosted multi-user CMS workflow.
- Media uploads.
- Full WYSIWYG rich-text editor.
- Moderation queues.
- Public delete/moderation system.
- Exposing `/admin` publicly.
- Exposing `/titles` publicly.

---

## 4. Completed Stage History

- **Stage 8A — Architecture:** Planned the local Markdown file-backed editor approach.
- **Stage 8B — Read-only editor foundation:** Added dashboard listing and entry reading.
- **Stage 8C — Editable form/save:** Added frontmatter/body editing, validation, and backup-before-overwrite save flow.
- **Stage 8D — Relationship picker/tag editor:** Added searchable relationship selection, ghost-link support, and tag chips.
- **Stage 8E — References editor:** Added structured reference rows and `## References` regeneration helpers.
- **Stage 8F — Create-entry wizard:** Added guarded new-entry creation with section defaults and slug validation.
- **Stage 8G — NotebookLM import:** Added raw Markdown parse/save workflow with overwrite safeguards.
- **Stage 8H — Preview/workflow polish:** Added public page opening, iframe preview refresh, unsaved-change warnings, and workflow messaging.
- **Stage 8I — Advanced field editors:** Added section-aware scalar fields, path arrays, ranking entries, and legacy relationship rows.
- **Stage 8J — Media path helper:** Added existing media picker for images and curated videos only.
- **Stage 8K — Audit/documentation:** Audited safety/workflows/build, documented usage, added minimal dev-only delete endpoint for temporary cleanup, and confirmed generate output remains stable.

---

## 5. Current Safety Contract

The editor must continue to satisfy these constraints:

1. `/admin` is dev-only and unavailable in production.
2. `/admin` is not prerendered.
3. `/api/editor/*` endpoints are dev-only.
4. File-writing APIs reject production.
5. Path traversal is blocked.
6. `/titles` is blocked.
7. `_meta`, `_templates`, partial paths, and `sample.md` are blocked.
8. Saves create backups before overwriting.
9. Deletes create backups before removing local test files.
10. `.editor-backups/` is gitignored.
11. Media picker lists curated videos only from `public/videos/curated`.

---

## 6. Current API Surface

- `GET /api/editor/entries` — list editable public entries.
- `GET /api/editor/entry?path=/section/slug` — read one editable entry.
- `POST /api/editor/entry` — validate, backup, and save an existing entry.
- `DELETE /api/editor/entry` — dev-only cleanup helper; backup, then delete an editable entry.
- `POST /api/editor/create-entry` — create a new entry without overwrite.
- `POST /api/editor/import-markdown` — parse or create from NotebookLM-style Markdown.
- `GET /api/editor/media` — list existing images and curated videos.

---

## 7. Known Issues and Limitations

- The editor remains local and single-user.
- Preview reflects saved content only.
- Media uploads are intentionally not implemented.
- Reference parsing handles known formats and preserves unknown lines, but it is not a full citation database.
- Advanced field coverage is pragmatic and section-aware, not a complete schema introspection engine.
- Current build logs warn about duplicate auto-import component names for `ImageFrame`, which is unrelated to Stage 8K editor safety but should be resolved in a later maintenance pass.

---

## 8. Recommended Next Stage

Proceed to **Stage 8L — Editor Hardening and QA Maintenance**.

Recommended scope:

1. Add lightweight automated tests for editor path guards and API validation.
2. Add a non-production checklist for editor contributors.
3. Resolve the duplicate `ImageFrame` component auto-import warning.
4. Tighten relationship validation coverage for all advanced path fields.
5. Keep the editor local-only and avoid auth/database/media-upload work until the content workflow is stable.

Do **not** start public CMS/auth/database work yet.
