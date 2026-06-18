// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      mediaBaseUrl: process.env.NUXT_PUBLIC_MEDIA_BASE_URL || '',
    }
  },
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
  ],
  site: {
    url: 'https://jianlai.wiki',
    name: 'Jian Lai Wiki',
  },
  sitemap: {
    // /admin is an editor-only route (never prerendered) and /titles is an
    // intentionally ungenerated section — keep both out of the sitemap.
    exclude: ['/admin', '/titles', '/titles/**', '/dev', '/dev/**'],
  },
  // The dev-only font override stops localhost from fetching the decorative R2
  // font (and the resulting CORS/font console noise). `import.meta.dev` is false
  // during `nuxt generate`, so it is never added to the static build and the
  // production R2 font behavior is unchanged.
  css: import.meta.dev
    ? ['~/assets/css/main.css', '~/assets/css/dev-fonts.css']
    : ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'page', mode: 'out-in' }
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  routeRules: {
    '/admin': { prerender: false },
    '/dev/**': { prerender: false }
  }
})
