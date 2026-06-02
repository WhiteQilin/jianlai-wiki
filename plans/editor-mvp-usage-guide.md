# Jian Lai Wiki — Local Editor MVP Usage Guide (Stage 9A)

**Status:** Editor MVP audited, hardened, and taxonomy-normalized
**Scope:** Local-only Markdown editor for development contributors  
**Route:** `/admin` in `npm run dev` only

---

## 1. Safety Model

The editor is a local development tool. It is not a public CMS.

- `/admin` throws a 404 outside dev mode.
- `/admin` is excluded from static prerendering by `routeRules`.
- `/api/editor/*` routes are dev-only and return 404 outside dev mode.
- File-writing routes validate paths before touching disk.
- Editable files must resolve to `content/<public-section>/<slug>.md`.
- The internal `/titles` section is blocked.
- `_meta`, `_templates`, partial paths, and `sample.md` scaffold files are blocked.
- Saves create `.editor-backups/` copies before overwriting.
- Deletes, used only for local cleanup/testing, also create `.editor-backups/` copies before removing files.

---

## 2. How to Run the Local Editor

1. Install dependencies if needed:

   ```bash
   npm install
   ```

2. Start the Nuxt dev server:

   ```bash
   npm run dev
   ```

3. Open:

   ```text
   http://localhost:3000/admin
   ```

4. Do not use random preview ports for editor QA. Use `http://localhost:3000/`.

---

## 3. Dashboard Workflow

The dashboard lists editable public entries only.

Use it to:

- Search by title, Chinese name, or route path.
- Filter by section.
- Open an existing entry for editing.
- Start the create-entry wizard.
- Start the NotebookLM Markdown import workflow.

The editor intentionally does not list:

- `/titles`
- `_meta` files
- `_templates` files
- `sample.md` scaffold files
- root pages such as `content/index.md` and `content/about.md`

---

## 4. Create an Entry

1. Click **Create Entry**.
2. Fill required fields:
   - Title
   - Chinese
   - Section
   - Category
   - Slug
   - Description
3. Confirm the route/file preview.
4. Click **Create Entry**.
5. The editor creates a new Markdown file using the section template and opens it for editing.
6. Complete the frontmatter and body.
7. Click **Save Changes**.
8. Run `npm run generate` before committing major content changes.

Creation is create-only. It will not overwrite an existing file.

---

## 5. Import NotebookLM Markdown

Use this for pasted raw Markdown that already includes YAML frontmatter.

Recommended NotebookLM import workflow:

1. Ask NotebookLM for Markdown with YAML frontmatter and section headings, not prose-only output.
2. Keep frontmatter minimal on first import: `title`, `chinese`, `pinyin`, `section`, `category`, `slug`, `description`, `importance`, `verificationStatus`, `tags`, and relationship path fields only when known.
3. Keep `verificationStatus: to-be-verified` unless references are strong and reviewed.
4. Import into a new slug first when possible; avoid overwriting existing lore until you have reviewed the parsed frontmatter/body.
5. After import, use the editor UI to normalize relationships, references, media paths, and advanced fields.
6. Save, preview, and run QA before committing.

Steps in the editor:

1. Click **Import Markdown**.
2. Paste Markdown in this shape:

   ```markdown
   ---
   title: Example Entry
   chinese: 示例
   section: glossary
   category: Term
   slug: example-entry
   description: Example description.
   importance: minor
   verificationStatus: to-be-verified
   ---

   ## Overview

   Body content here.
   ```

3. Click **Parse Markdown**.
4. Review:
   - Target route
   - Target file
   - Parsed frontmatter
   - Body preview
   - Taxonomy Review, if shown
   - Import errors/warnings
5. If Taxonomy Review appears, confirm the normalized site category and preserved canon type field.
6. If the target does not exist, click **Import and Save**.
7. If the target exists, the UI requires an explicit overwrite phrase and then routes the overwrite through the normal save endpoint so a backup is created first.

Required fields are still enforced:

- `title`
- `chinese`
- `section`
- `category`
- `description`

---

## 6. Category vs Canon Type Fields

The editor separates public filter taxonomy from canon-specific classifications.

- `category` is the stable site filter bucket shown in public category tabs.
- Section-specific type fields preserve novel/canon labels without creating unlimited public tabs.

Current section-specific type fields:

| Section | Canon type field |
|---|---|
| `world` | `locationType` |
| `factions` | `factionType` |
| `artifacts` | `artifactType` |
| `cultivation` | `pathType` |
| `swordsmanship` | `abilityType` |
| `teachings` | `teachingType` |
| `pantheon` | `beingType` |
| `glossary` | `termType` |

NotebookLM may output canon labels as `category`, such as:

```yaml
section: world
category: Heaven
locationType: Heaven
```

This is canonically useful but not always a valid site filter category. During import, the editor normalizes recognized aliases to valid site categories and preserves the original canon label in the section-specific type field when that field is blank.

For world entries, these imported categories currently map to `World`:

- `Heaven`
- `World`
- `天下`
- `Major World`
- `Realm`
- `Macrocosm`

Example result:

```yaml
category: World
locationType: Heaven
```

Unknown imported categories are not silently accepted and are not added to public tabs. The import preview shows **Taxonomy Review**, preserves the original imported category in the canon type field or `subcategory`, and requires choosing a valid site category before final save.

New public categories should be added manually and intentionally in both runtime metadata and `_meta` content files; the editor must not create unlimited public category tabs automatically.

---

## 7. Edit Frontmatter

Open an entry and edit the form fields.

Required fields block saving when blank:

- Title
- Chinese
- Description
- Category

Other fields may generate warnings but still allow saving, such as:

- Missing pinyin
- Long seal text
- Non-hyphenated tags
- Ghost relationship links
- Verified status without references
- Media paths not found in the catalog

Unknown or complex fields are preserved because the editor saves the full frontmatter object rather than rebuilding it from scratch.

---

## 8. Edit Relationships

Relationship fields use the relationship picker.

How to use:

1. Type part of an entry title, Chinese name, pinyin, or route path.
2. Select a result from the dropdown.
3. The stored value is the route path, such as `/characters/chen-pingan`.
4. Use the remove button on a selected chip to unlink it.
5. Press Enter on an unmatched path to create a ghost link when planning an entry that does not exist yet.

Safety notes:

- `/titles` links are warned/blocked depending on endpoint and field context.
- Internal partial paths are warned/blocked.
- Relationship paths should use `/section/slug` format.

---

## 9. Edit Tags and Simple Arrays

Tag-style fields use the tag editor.

- Type a value and press Enter or comma.
- Spaces are converted to hyphens.
- Tags are lowercased.
- Remove chips with the `×` button.

This is used for tags and some section-specific arrays such as titles, abilities, teachings, key figures, and related terms.

---

## 10. Edit References

The body textarea remains the canonical Markdown source. The references editor helps structure the `## References` section.

Recommended workflow:

1. Edit or paste body Markdown.
2. Click **Parse from Body** in the references editor.
3. Add or edit reference rows:
   - Volume Title
   - Chapter Number
   - Chapter Title
   - Claim Supported
   - Confidence
   - Internal notes/markers
4. Click **Regenerate References Section**.
5. Review the body textarea after regeneration.
6. Save the entry.

The editor preserves unparsed reference lines as raw fallback text rather than deleting them.

---

## 11. Edit Advanced Fields

Stage 8I added section-aware fields beyond the basic frontmatter:

- Scalar fields such as `origin`, `realm`, `factionType`, `artifactType`, `tier`, `pathType`, `realmLevel`, `abilityType`, `lineage`, `teachingType`, `beingType`, `domain`, `territory`, `termType`, `date`, `era`, and `eraOrder`.
- Path-array fields such as `members`, `practitioners`, `users`, `owners`, `participants`, `relatedFactions`, and `inhabitants`.
- Ranking `entries` rows.
- Legacy `relationships` rows.

These fields are MVP helpers, not a complete schema-management system. Always review raw frontmatter JSON before saving unusual entries.

---

## 12. Use the Media Path Picker

The media picker helps choose existing media paths. It does not upload files.

Supported workflow:

1. Open Image Path, Banner Path, or Video Path.
2. Search by file name or path.
3. Filter by type or folder.
4. Click an existing item to set the field.
5. Use **Clear** to remove a path.
6. Use **Refresh** after manually adding files to `public/`.

Media rules:

- Images are listed from `public/images`.
- Videos are listed only from `public/videos/curated`.
- Do not use `public/videos/all-mp4` directly.
- The picker does not upload, crop, optimize, or credit media.
- Official/raw archives remain reference-only.

---

## 13. Preview and Public Page Workflow

The editor provides:

- **Open Public Page** — opens the saved route in a new tab.
- **Refresh Preview** — reloads the iframe preview with a cache-busting query.
- **Live Preview panel** — displays the saved route, not unsaved draft state.

Save first, then refresh preview.

---

## 14. Backups

Backups are stored under `.editor-backups/`.

A backup is created before:

- Saving an existing entry.
- Deleting an entry through the local cleanup endpoint.

Backups are local safety copies only. They are not a replacement for Git history.

How to recover from `.editor-backups/`:

1. Find the latest backup for the affected file. Backup names follow this pattern:

   ```text
   .editor-backups/content/<section>/<slug>.md.<timestamp>.bak
   .editor-backups/content/<section>/<slug>.md.<timestamp>.delete.bak
   ```

2. Open the backup and confirm it is the version you want.
3. Copy the backup content back to the original content path, such as:

   ```text
   content/<section>/<slug>.md
   ```

4. Restart or refresh the dev server if Nuxt Content does not pick up the restored file immediately.
5. Run `npm run generate` before committing.

---

## 15. What Not to Commit

Do not commit:

- `node_modules/`
- `.nuxt/`
- `.output/`
- `dist/`
- `.editor-backups/`
- Temporary test entries
- Raw official media archives
- Raw video dumps
- Local `.env` files
- Local-only tooling/cache directories

The `.gitignore` already excludes these local/build/backup paths and raw media archive paths.

---

## 16. Known Limitations

- Local single-user editor only.
- No authentication.
- No database.
- No hosted CMS workflow.
- No role-based permissions.
- No media uploads.
- No automated image optimization.
- No full rich-text/WYSIWYG editor.
- Preview shows saved content only, not unsaved edits.
- References parsing supports known structured formats and preserves unknown lines as raw text.
- Validation is strong enough for MVP safety but is not a full replacement for build verification.
- The local delete endpoint exists only for dev/test cleanup and should not become a public moderation/delete system.

---

## 17. Required QA Before Committing Editor or Content Changes

Quick checklist:

1. Start the local dev server:

   ```bash
   npm run dev
   ```

2. Run the lightweight editor guard checks:

   ```bash
   npm run editor:qa
   ```

3. Run static generation:

   ```bash
   npm run generate
   ```

Confirm:

- Static generation succeeds.
- Route count remains `79` unless an intentional content expansion changed it.
- `/admin` is not prerendered.
- `/titles` is not generated.
- `/api/editor/*` routes contain dev-only guards.
- Path traversal probes are blocked.
- `sample.md`, `_meta`, and `_templates` editor paths are blocked.
- Save/delete workflows create backups before writes/removal.
- Temporary test entries are removed.
- Public wiki routes still render at `http://localhost:3000/`.
- The local editor still opens at `http://localhost:3000/admin`.
- Haoran-style NotebookLM imports map `category: Heaven` to `category: World` and preserve `locationType: Heaven`.
- Public world filter tabs include `World` without adding unlimited NotebookLM categories.
