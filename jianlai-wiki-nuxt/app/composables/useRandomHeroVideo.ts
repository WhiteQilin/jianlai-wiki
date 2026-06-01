const LAST_HERO_VIDEO_KEY = 'jl:lastHeroVideo'

export function pickRandomHeroVideo(candidates: string[], fallbackVideo: string): string {
  if (!Array.isArray(candidates) || candidates.length === 0) return fallbackVideo

  const uniqueCandidates = [...new Set(candidates)]
  if (uniqueCandidates.length === 1) {
    if (process.client) localStorage.setItem(LAST_HERO_VIDEO_KEY, uniqueCandidates[0]!)
    return uniqueCandidates[0]!
  }

  if (!process.client) return uniqueCandidates[0]!

  const previousVideo = localStorage.getItem(LAST_HERO_VIDEO_KEY)
  const pool = previousVideo
    ? uniqueCandidates.filter((video) => video !== previousVideo)
    : uniqueCandidates

  const nextPool = pool.length > 0 ? pool : uniqueCandidates
  const selectedVideo = nextPool[Math.floor(Math.random() * nextPool.length)]!
  localStorage.setItem(LAST_HERO_VIDEO_KEY, selectedVideo)
  return selectedVideo
}

