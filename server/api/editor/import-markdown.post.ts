import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'

import {
  EDITOR_SECTIONS,
  IMPORTANCE_VALUES,
  VERIFICATION_VALUES,
  categoriesForSection,
  resolveEntryPath,
  slugifyTitle,
  validateCreateSlug,
  EDITOR_RELATIONSHIP_PATH_FIELDS,
  validateEditorRelationshipPath,
} from '../../utils/editor'

type Mode = 'parse' | 'save'

interface ImportPayload {
  mode?: Mode
  markdown?: string
  path?: string
  frontmatter?: Record<string, any>
  body?: string
}

interface ImportResult {
  frontmatter: Record<string, any>
  body: string
  section: string
  slug: string
  routePath: string
  fileRelPath: string
  exists: boolean
  errors: string[]
  warnings: string[]
  hasReferences: boolean
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function splitMarkdown(markdown: string): { frontmatterText: string; body: string } | { error: string } {
  const raw = markdown || ''
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { error: 'Frontmatter block is required and must be wrapped in ---' }
  }

  return {
    frontmatterText: match[1] ?? '',
    body: match[2] ?? '',
  }
}

async function buildParseResult(frontmatter: Record<string, any>, body: string): Promise<ImportResult> {
  const errors: string[] = []
  const warnings: string[] = []

  const title = asString(frontmatter.title).trim()
  const chinese = asString(frontmatter.chinese).trim()
  const description = asString(frontmatter.description).trim()
  const section = asString(frontmatter.section).trim()
  const category = asString(frontmatter.category).trim()

  let slug = asString(frontmatter.slug).trim()
  if (!slug && title) slug = slugifyTitle(title)

  if (!title) errors.push('title is required')
  if (!chinese) errors.push('chinese is required')
  if (!description) errors.push('description is required')

  if (!section) {
    errors.push('section is required')
  } else if (!(EDITOR_SECTIONS as readonly string[]).includes(section)) {
    errors.push(`section "${section}" is not allowed`)
  }

  const slugError = validateCreateSlug(slug)
  if (slugError) errors.push(slugError)

  if (section) {
    const validCategories = categoriesForSection(section)
    if (!category) {
      errors.push('category is required')
    } else if (!validCategories.includes(category)) {
      errors.push(`category "${category}" is not valid for section "${section}"`)
    }
  }

  const importance = asString(frontmatter.importance)
  if (importance && !(IMPORTANCE_VALUES as readonly string[]).includes(importance)) {
    errors.push(`importance "${importance}" must be one of: ${IMPORTANCE_VALUES.join(', ')}`)
  }

  const verificationStatus = asString(frontmatter.verificationStatus)
  if (verificationStatus && !(VERIFICATION_VALUES as readonly string[]).includes(verificationStatus)) {
    errors.push(`verificationStatus "${verificationStatus}" must be one of: ${VERIFICATION_VALUES.join(', ')}`)
  }

  const tags = frontmatter.tags
  if (Array.isArray(tags)) {
    const hasInvalidTag = tags.some((t) => typeof t === 'string' && !/^[a-z0-9-]+$/.test(t))
    if (hasInvalidTag) warnings.push('Tags should be lowercase and hyphenated')
  }

  for (const field of EDITOR_RELATIONSHIP_PATH_FIELDS) {
    const val = frontmatter[field]
    if (!val) continue
    const paths = Array.isArray(val) ? val : [val]
    for (const p of paths) {
      if (typeof p !== 'string') continue
      errors.push(...validateEditorRelationshipPath(field, p))
    }
  }

  if (Array.isArray(frontmatter.entries)) {
    frontmatter.entries.forEach((row: any, idx: number) => {
      const link = typeof row?.link === 'string' ? row.link : ''
      if (!link.trim()) return
      errors.push(...validateEditorRelationshipPath(`entries[${idx}].link`, link))
    })
  }

  if (Array.isArray(frontmatter.relationships)) {
    frontmatter.relationships.forEach((row: any, idx: number) => {
      const link = typeof row?.link === 'string' ? row.link : ''
      if (!link.trim()) return
      errors.push(...validateEditorRelationshipPath(`relationships[${idx}].link`, link))
    })
  }

  if (body.trim().startsWith('# ')) {
    warnings.push('Body starts with a top-level # Title. The layout already renders the title.')
  }

  const hasReferences = /(^|\n)##\s+References\s*(\n|$)/.test(body)

  if (verificationStatus === 'verified' && !hasReferences) {
    warnings.push('Status is "verified" but no "## References" section found in body.')
  }

  let routePath = ''
  let fileRelPath = ''
  let exists = false

  if (section && slug && !errors.length) {
    const resolved = resolveEntryPath(`/${section}/${slug}`)
    if ('error' in resolved) {
      errors.push(resolved.error)
    } else {
      routePath = resolved.routePath
      fileRelPath = resolved.fileRelPath

      try {
        await readFile(resolved.fileAbsPath, 'utf-8')
        exists = true
      } catch {
        exists = false
      }
    }
  }

  return {
    frontmatter,
    body,
    section,
    slug,
    routePath,
    fileRelPath,
    exists,
    errors,
    warnings,
    hasReferences,
  }
}

function buildMarkdown(frontmatter: Record<string, any>, body: string): string {
  const yamlStr = stringifyYaml(frontmatter, { lineWidth: 0 })
  const normalizedBody = (body || '').replace(/^\s+/, '')
  return `---\n${yamlStr.trimEnd()}\n---\n\n${normalizedBody.trimEnd()}\n`
}

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Endpoint is dev-only' })
  }

  const payload = await readBody<ImportPayload>(event)
  const mode = payload?.mode || 'parse'

  if (mode === 'parse') {
    const markdown = asString(payload?.markdown)
    if (!markdown.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'markdown is required' })
    }

    const split = splitMarkdown(markdown)
    if ('error' in split) {
      throw createError({ statusCode: 422, statusMessage: 'Invalid Markdown', message: split.error })
    }

    let frontmatter: Record<string, any>
    try {
      frontmatter = parseYaml(split.frontmatterText) ?? {}
    } catch (e: any) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Invalid YAML frontmatter',
        message: e?.message || 'unknown error',
      })
    }

    if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
      throw createError({ statusCode: 422, statusMessage: 'Invalid Frontmatter', message: 'Frontmatter must be a YAML object' })
    }

    const result = await buildParseResult(frontmatter, split.body)
    return { success: true, result }
  }

  // mode === 'save' (create-only path; overwrite must go through /api/editor/entry for backup behavior)
  const path = asString(payload?.path)
  const frontmatter = payload?.frontmatter
  const body = asString(payload?.body)

  if (!path) throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'path is required' })
  if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'frontmatter object is required' })
  }

  const parseResult = await buildParseResult(frontmatter, body)
  if (parseResult.errors.length) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      message: parseResult.errors.join('; '),
      data: { errors: parseResult.errors, warnings: parseResult.warnings },
    })
  }

  const resolved = resolveEntryPath(path)
  if ('error' in resolved) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Path', message: resolved.error })
  }

  if (resolved.routePath !== parseResult.routePath) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Path mismatch',
      message: `path "${resolved.routePath}" does not match parsed route "${parseResult.routePath}"`,
    })
  }

  try {
    await readFile(resolved.fileAbsPath, 'utf-8')
    throw createError({
      statusCode: 409,
      statusMessage: 'Target exists',
      message: 'Target file already exists. Use overwrite flow via /api/editor/entry with explicit confirmation.',
    })
  } catch (e: any) {
    if (e?.statusCode === 409) throw e
  }

  const fileContent = buildMarkdown(frontmatter, body)

  try {
    await mkdir(dirname(resolved.fileAbsPath), { recursive: true })
    await writeFile(resolved.fileAbsPath, fileContent, 'utf-8')
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Create failed',
      message: e?.message || 'unknown error',
    })
  }

  return {
    success: true,
    routePath: resolved.routePath,
    fileRelPath: resolved.fileRelPath,
    bytesWritten: fileContent.length,
    warnings: parseResult.warnings,
  }
})
