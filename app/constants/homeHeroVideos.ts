export const HOME_HERO_VIDEOS = [
  '/videos/curated/home-hero-04.mp4',
  '/videos/curated/home-hero-07.mp4',
  '/videos/curated/home-hero-13.mp4',
  '/videos/curated/home-hero-16.mp4',
] as const

export function getMediaUrl(path: string): string {
  const config = useRuntimeConfig()
  const baseUrl = config.public.mediaBaseUrl as string
  if (!baseUrl) return path
  
  // Ensure no double slashes if baseUrl has trailing slash and path has leading slash
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  return `${cleanBase}${cleanPath}`
}

