import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

import { HOME_HERO_VIDEO_IDS } from '../../app/constants/homeHeroVideoIds'

export default defineEventHandler(async () => {
  const targetDirectory = join(process.cwd(), 'public', 'videos', 'homepage-backgroundvideo')
  const entries = await readdir(targetDirectory, { withFileTypes: true })
  const allowlist = new Set(HOME_HERO_VIDEO_IDS)

  const videos = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.mp4'))
    .filter((entry) => !entry.name.includes('_live_'))
    .map((entry) => {
      const match = entry.name.match(/_(\d+)(?:_live_\d+)?\.mp4$/)
      return match?.[1] || ''
    })
    .filter((id) => allowlist.has(id))
    .map((id) => `/api/home-hero-video/${id}`)

  if (videos.length === 0) return ['/videos/curated/home-intro.mp4']
  return videos
})

