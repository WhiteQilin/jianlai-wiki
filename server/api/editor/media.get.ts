import { readdir, stat } from 'node:fs/promises'
import { join, relative, extname } from 'node:path'

type MediaKind = 'image' | 'video'

interface MediaItem {
  publicPath: string
  fileName: string
  folder: string
  extension: string
  type: MediaKind
  size: number
}

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'])
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov'])

function isHiddenOrSystem(name: string) {
  if (!name) return true
  const lower = name.toLowerCase()
  return name.startsWith('.') || lower === 'thumbs.db' || lower === 'desktop.ini'
}

async function scanMediaRoot(
  rootAbs: string,
  publicPrefix: string,
  kind: MediaKind,
  allowedExts: Set<string>,
): Promise<MediaItem[]> {
  const out: MediaItem[] = []

  async function walk(dirAbs: string) {
    if (!dirAbs.startsWith(rootAbs)) return

    const entries = await readdir(dirAbs, { withFileTypes: true })
    for (const entry of entries) {
      if (isHiddenOrSystem(entry.name)) continue

      const entryAbs = join(dirAbs, entry.name)
      if (!entryAbs.startsWith(rootAbs)) continue

      if (entry.isDirectory()) {
        await walk(entryAbs)
        continue
      }

      if (!entry.isFile()) continue

      const ext = extname(entry.name).toLowerCase()
      if (!allowedExts.has(ext)) continue

      const rel = relative(rootAbs, entryAbs).replace(/\\/g, '/')
      const folder = rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : ''
      const publicPath = `${publicPrefix}/${rel}`

      let size = 0
      try {
        size = (await stat(entryAbs)).size
      } catch {
        size = 0
      }

      out.push({
        publicPath,
        fileName: entry.name,
        folder,
        extension: ext,
        type: kind,
        size,
      })
    }
  }

  await walk(rootAbs)
  return out
}

export default defineEventHandler(async () => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Endpoint is dev-only' })
  }

  const publicRoot = join(process.cwd(), 'public')
  const imagesRoot = join(publicRoot, 'images')
  // Curated-only video listing by policy.
  const curatedVideosRoot = join(publicRoot, 'videos', 'curated')

  const [images, videos] = await Promise.all([
    scanMediaRoot(imagesRoot, '/images', 'image', IMAGE_EXTS),
    scanMediaRoot(curatedVideosRoot, '/videos/curated', 'video', VIDEO_EXTS),
  ])

  const media = [...images, ...videos].sort((a, b) => a.publicPath.localeCompare(b.publicPath))

  return {
    success: true,
    media,
  }
})
