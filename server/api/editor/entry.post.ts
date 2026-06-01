import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import { stringify as stringifyYaml } from 'yaml'

import {
  resolveEntryPath,
  categoriesForSection,
  IMPORTANCE_VALUES,
  VERIFICATION_VALUES,
} from '../../utils/editor'

/**
 * POST /api/editor/entry — dev-only safe save.
 *
 * Body: { path: '/section/slug', frontmatter: object, body: string }
 *
 * Safety:
 * - Dev-only (404 in production).
 * - Path validated/resolved through the shared resolver (no traversal, no
 *   titles/partials/samples).
 * - Required fields validated server-side (errors block the write).
 * - A timestamped backup of the original is written under `.editor-backups/`
 *   BEFORE the file is overwritten.
 * - Frontmatter is serialized with the existing `yaml` library.
 * - Unknown/complex fields are preserved because the client sends back the full
 *   merged frontmatter object (this route does not strip keys).
 */

interface SavePayload {
  path?: string
  frontmatter?: Record<string, any>
  body?: string
}

function validateFrontmatter(section: string, fm: Record<string, any>): string[] {
  const errors: string[] = []

  if (!fm.title || typeof fm.title !== 'string' || !fm.title.trim()) {
    errors.push('title is required')
  }
  if (!fm.chinese || typeof fm.chinese !== 'string' || !fm.chinese.trim()) {
    errors.push('chinese is required')
  }
  if (!fm.description || typeof fm.description !== 'string' || !fm.description.trim()) {
    errors.push('description is required')
  }
  if (!fm.section || typeof fm.section !== 'string') {
    errors.push('section is required')
  } else if (fm.section !== section) {
    errors.push(`section "${fm.section}" must match the file's section "${section}"`)
  }

  const validCategories = categoriesForSection(section)
  if (!fm.category || typeof fm.category !== 'string') {
    errors.push('category is required')
  } else if (validCategories.length && !validCategories.includes(fm.category)) {
    errors.push(`category "${fm.category}" is not valid for section "${section}"`)
  }

  if (fm.importance != null && !(IMPORTANCE_VALUES as readonly string[]).includes(fm.importance)) {
    errors.push(`importance "${fm.importance}" must be one of: ${IMPORTANCE_VALUES.join(', ')}`)
  }

  if (
    fm.verificationStatus != null &&
    !(VERIFICATION_VALUES as readonly string[]).includes(fm.verificationStatus)
  ) {
    errors.push(
      `verificationStatus "${fm.verificationStatus}" must be one of: ${VERIFICATION_VALUES.join(', ')}`,
    )
  }

  // Relationship path validation
  const relFields = ['related', 'affiliations', 'members', 'leader', 'headquarters', 'location', 'owners', 'users', 'practitioners']
  for (const field of relFields) {
    const val = fm[field]
    if (!val) continue
    const paths = Array.isArray(val) ? val : [val]
    for (const p of paths) {
      if (typeof p !== 'string') continue
      if (!p.startsWith('/')) errors.push(`${field}: Path "${p}" must start with /`)
      if (p.startsWith('/titles')) errors.push(`${field}: Path "${p}" points to internal /titles section`)
      if (p.startsWith('/_')) errors.push(`${field}: Path "${p}" points to internal partial`)
      
      const segments = p.split('/').filter(Boolean)
      if (segments.length !== 2) {
        errors.push(`${field}: Path "${p}" must be /section/slug`)
      }
    }
  }

  return errors
}

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const payload = await readBody<SavePayload>(event)

  const resolved = resolveEntryPath(payload?.path)
  if ('error' in resolved) {
    throw createError({ statusCode: 400, statusMessage: resolved.error })
  }

  const frontmatter = payload?.frontmatter
  if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    throw createError({ statusCode: 400, statusMessage: 'frontmatter object is required' })
  }

  const body = typeof payload?.body === 'string' ? payload.body : ''

  // Server-side validation (errors block the write).
  const errors = validateFrontmatter(resolved.section, frontmatter)
  if (errors.length) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { errors },
    })
  }

  // The original must exist (Stage 8C edits existing entries only).
  let original: string
  try {
    original = await readFile(resolved.fileAbsPath, 'utf-8')
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Entry not found' })
  }

  // --- Backup BEFORE overwriting ---
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupRel = join('.editor-backups', 'content', `${resolved.fileRelPath}.${timestamp}.bak`)
  const backupAbs = join(process.cwd(), backupRel)
  try {
    await mkdir(dirname(backupAbs), { recursive: true })
    await copyFile(resolved.fileAbsPath, backupAbs)
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create backup: ${e?.message || 'unknown error'}`,
    })
  }

  // --- Serialize frontmatter + body ---
  let yamlStr: string
  try {
    yamlStr = stringifyYaml(frontmatter, { lineWidth: 0 })
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to serialize frontmatter: ${e?.message || 'unknown error'}`,
    })
  }

  // Normalize: body keeps its own content; ensure a single newline gap after fm.
  const normalizedBody = body.replace(/^\s+/, '')
  const fileContent = `---\n${yamlStr.trimEnd()}\n---\n\n${normalizedBody.trimEnd()}\n`

  try {
    await writeFile(resolved.fileAbsPath, fileContent, 'utf-8')
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to write file: ${e?.message || 'unknown error'}`,
    })
  }

  return {
    success: true,
    routePath: resolved.routePath,
    fileRelPath: resolved.fileRelPath,
    backup: backupRel.replace(/\\/g, '/'),
    bytesWritten: Buffer.byteLength(fileContent, 'utf-8'),
  }
})
