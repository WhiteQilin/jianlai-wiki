export const HOME_HERO_VIDEOS = [
  '/videos/curated/home-hero-01.mp4',
  '/videos/curated/home-hero-02.mp4',
  '/videos/curated/home-hero-03.mp4',
  '/videos/curated/home-hero-04.mp4',
  '/videos/curated/home-hero-05.mp4',
  '/videos/curated/home-hero-06.mp4',
  '/videos/curated/home-hero-07.mp4',
  '/videos/curated/home-hero-08.mp4',
  '/videos/curated/home-hero-09.mp4',
  '/videos/curated/home-hero-10.mp4',
  '/videos/curated/home-hero-11.mp4',
  '/videos/curated/home-hero-12.mp4',
  '/videos/curated/home-hero-13.mp4',
  '/videos/curated/home-hero-14.mp4',
  '/videos/curated/home-hero-15.mp4',
  '/videos/curated/home-hero-16.mp4',
  '/videos/curated/home-hero-17.mp4',
  '/videos/curated/home-hero-18.mp4',
  '/videos/curated/home-hero-19.mp4',
  '/videos/curated/home-hero-20.mp4',
  '/videos/curated/home-hero-21.mp4',
  '/videos/curated/home-hero-22.mp4',
  '/videos/curated/home-hero-23.mp4',
  '/videos/curated/home-hero-24.mp4',
  '/videos/curated/home-hero-25.mp4',
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

