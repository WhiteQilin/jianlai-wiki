import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import { stringify as stringifyYaml } from 'yaml'

import {
  EDITOR_SECTIONS,
  IMPORTANCE_VALUES,
  VERIFICATION_VALUES,
  categoriesForSection,
  resolveEntryPath,
  validateCreateSlug,
  buildCreateEntryFrontmatter,
  buildCreateEntryBody,
  type EditorSection,
} from '../../utils/editor'

interface CreateEntryPayload {
  title?: string
  chinese?: string
  pinyin?: string
  section?: string
  category?: string
  slug?: string
  description?: string
  importance?: string
  verificationStatus?: string
  status?: string
  seal?: string
}

function reqString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Endpoint is dev-only' })
  }

  const payload = await readBody<CreateEntryPayload>(event)

  const title = reqString(payload?.title)
  const chinese = reqString(payload?.chinese)
  const pinyin = reqString(payload?.pinyin)
  const section = reqString(payload?.section)
  const category = reqString(payload?.category)
  const slug = reqString(payload?.slug)
  const description = reqString(payload?.description)
  const importance = reqString(payload?.importance)
  const verificationStatus = reqString(payload?.verificationStatus)
  const status = reqString(payload?.status)
  const seal = reqString(payload?.seal)

  if (!title) throw createError({ statusCode: 422, statusMessage: 'Validation failed', message: 'title is required' })
  if (!chinese) throw createError({ statusCode: 422, statusMessage: 'Validation failed', message: 'chinese is required' })
  if (!description) throw createError({ statusCode: 422, statusMessage: 'Validation failed', message: 'description is required' })

  if (!(EDITOR_SECTIONS as readonly string[]).includes(section)) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed', message: `section "${section}" is not allowed` })
  }

  const validCategories = categoriesForSection(section)
  if (!category || !validCategories.includes(category)) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      message: `category "${category}" is not valid for section "${section}"`,
    })
  }

  if (!(IMPORTANCE_VALUES as readonly string[]).includes(importance)) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      message: `importance "${importance}" must be one of: ${IMPORTANCE_VALUES.join(', ')}`,
    })
  }

  if (!(VERIFICATION_VALUES as readonly string[]).includes(verificationStatus)) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      message: `verificationStatus "${verificationStatus}" must be one of: ${VERIFICATION_VALUES.join(', ')}`,
    })
  }

  const slugError = validateCreateSlug(slug)
  if (slugError) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed', message: slugError })
  }

  const resolved = resolveEntryPath(`/${section}/${slug}`)
  if ('error' in resolved) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Path', message: resolved.error })
  }

  // Prevent overwrite
  try {
    await readFile(resolved.fileAbsPath, 'utf-8')
    throw createError({ statusCode: 409, statusMessage: 'Conflict', message: 'Entry already exists' })
  } catch (e: any) {
    if (e?.statusCode === 409) throw e
    // ENOENT is expected; continue
  }

  const frontmatter = buildCreateEntryFrontmatter({
    title,
    chinese,
    pinyin,
    section: section as EditorSection,
    category,
    description,
    importance: importance as (typeof IMPORTANCE_VALUES)[number],
    verificationStatus: verificationStatus as (typeof VERIFICATION_VALUES)[number],
    status,
    seal,
  })

  const body = buildCreateEntryBody(section as EditorSection)

  let yamlStr: string
  try {
    yamlStr = stringifyYaml(frontmatter, { lineWidth: 0 })
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Serialization failed',
      message: e?.message || 'unknown error',
    })
  }

  const fileContent = `---\n${yamlStr.trimEnd()}\n---\n\n${body.trimEnd()}\n`

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
  }
})
