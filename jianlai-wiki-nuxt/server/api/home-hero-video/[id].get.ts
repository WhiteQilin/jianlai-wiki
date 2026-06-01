import { createReadStream } from 'node:fs'
import { access, readdir, stat } from 'node:fs/promises'
import { constants } from 'node:fs'
import { join } from 'node:path'

import { HOME_HERO_VIDEO_IDS } from '../../../app/constants/homeHeroVideoIds'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  if (!HOME_HERO_VIDEO_IDS.includes(id as (typeof HOME_HERO_VIDEO_IDS)[number])) {
    throw createError({ statusCode: 404, statusMessage: 'Video not found' })
  }

  const targetDirectory = join(process.cwd(), 'public', 'videos', 'homepage-backgroundvideo')
  const entries = await readdir(targetDirectory, { withFileTypes: true })
  const matched = entries.find((entry) => {
    if (!entry.isFile()) return false
    if (!entry.name.toLowerCase().endsWith('.mp4')) return false
    if (entry.name.includes('_live_')) return false
    return entry.name.match(/_(\d+)(?:_live_\d+)?\.mp4$/)?.[1] === id
  })

  if (!matched) {
    throw createError({ statusCode: 404, statusMessage: 'Video not found' })
  }

  const fullPath = join(targetDirectory, matched.name)
  await access(fullPath, constants.R_OK)
  const fileStat = await stat(fullPath)
  const fileSize = fileStat.size
  const rangeHeader = getHeader(event, 'range')

  setHeader(event, 'Content-Type', 'video/mp4')
  setHeader(event, 'Accept-Ranges', 'bytes')
  setHeader(event, 'Cache-Control', 'public, max-age=86400')

  if (!rangeHeader) {
    setHeader(event, 'Content-Length', fileSize.toString())
    return sendStream(event, createReadStream(fullPath))
  }

  const [rawStart, rawEnd] = rangeHeader.replace(/bytes=/, '').split('-')
  const start = Number.parseInt(rawStart || '0', 10)
  const end = rawEnd ? Number.parseInt(rawEnd, 10) : fileSize - 1
  const safeStart = Number.isFinite(start) ? Math.max(0, start) : 0
  const safeEnd = Number.isFinite(end) ? Math.min(end, fileSize - 1) : fileSize - 1
  const chunkSize = safeEnd - safeStart + 1

  setResponseStatus(event, 206)
  setHeader(event, 'Content-Range', `bytes ${safeStart}-${safeEnd}/${fileSize}`)
  setHeader(event, 'Content-Length', chunkSize.toString())
  return sendStream(event, createReadStream(fullPath, { start: safeStart, end: safeEnd }))
})

