import { copyFile, mkdir, readFile, unlink } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import { resolveEntryPath } from '../../utils/editor'

interface DeletePayload {
  path?: string
}

/**
 * DELETE /api/editor/entry — dev-only cleanup helper for local editor test entries.
 *
 * Safety:
 * - Dev-only (404 in production).
 * - Path is resolved through the same editor path guard used by read/save.
 * - Internal titles, partials, templates, sample files, traversal, and unknown sections
 *   are rejected by resolveEntryPath().
 * - A timestamped backup is created before deletion.
 */
export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Endpoint is dev-only' })
  }

  const payload = await readBody<DeletePayload>(event)
  const resolved = resolveEntryPath(payload?.path)

  if ('error' in resolved) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Path', message: resolved.error })
  }

  try {
    await readFile(resolved.fileAbsPath, 'utf-8')
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Entry not found' })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupRel = join('.editor-backups', 'content', `${resolved.fileRelPath}.${timestamp}.delete.bak`)
  const backupAbs = join(process.cwd(), backupRel)

  try {
    await mkdir(dirname(backupAbs), { recursive: true })
    await copyFile(resolved.fileAbsPath, backupAbs)
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Backup failed',
      message: e?.message || 'unknown error',
    })
  }

  try {
    await unlink(resolved.fileAbsPath)
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Delete failed',
      message: e?.message || 'unknown error',
    })
  }

  return {
    success: true,
    routePath: resolved.routePath,
    fileRelPath: resolved.fileRelPath,
    backup: backupRel.replace(/\\/g, '/'),
  }
})
