import { readFile } from 'node:fs/promises'

import { parse as parseYaml } from 'yaml'

import { resolveEntryPath } from '../../utils/editor'

/**
 * GET /api/editor/entry?path=/section/slug — dev-only entry reader.
 *
 * Returns the parsed frontmatter object (via the `yaml` parser already present
 * in the dependency tree), the raw Markdown body, and resolved paths.
 */
export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const query = getQuery(event)
  const resolved = resolveEntryPath(query.path)

  if ('error' in resolved) {
    throw createError({ statusCode: 400, statusMessage: resolved.error })
  }

  let raw: string
  try {
    raw = await readFile(resolved.fileAbsPath, 'utf-8')
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Entry not found' })
  }

  // Split frontmatter and body. Frontmatter must be a leading `---` block.
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  let frontmatter: Record<string, any> = {}
  let body = raw

  if (match) {
    try {
      frontmatter = parseYaml(match[1] ?? '') ?? {}
    } catch (e: any) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to parse frontmatter YAML: ${e?.message || 'unknown error'}`,
      })
    }
    body = raw.slice(match[0].length)
  }

  return {
    routePath: resolved.routePath,
    section: resolved.section,
    fileRelPath: resolved.fileRelPath,
    frontmatter,
    body,
  }
})
