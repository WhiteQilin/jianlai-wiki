import { MEDIA_LIBRARY } from '~/data/mediaLibrary'
import { getMediaUrl } from '~/constants/homeHeroVideos'

const CURATED_IMAGE_PATHS = new Set(
  MEDIA_LIBRARY
    .filter((item) => item.type === 'image')
    .map((item) => item.path),
)

function cleanMediaPath(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function isAbsoluteMediaUrl(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

export function isCuratedImagePath(value: unknown): value is string {
  const path = cleanMediaPath(value)
  if (!path) return false
  if (isAbsoluteMediaUrl(path)) return true
  return CURATED_IMAGE_PATHS.has(path)
}

export function resolvePublicImage(value: unknown): string {
  const path = cleanMediaPath(value)
  if (!path || !isCuratedImagePath(path)) return ''
  return getMediaUrl(path)
}
