<script setup lang="ts">
const SITE_URL = 'https://jianlai.wiki'
const LOGO_URL = `${SITE_URL}/images/logos/JianLaiLogo.png`
const SITE_DESCRIPTION =
  'A premium fan-made encyclopedia of characters, realms, factions, and legends from Sword, Come! (剑来).'

useHead({
  htmlAttrs: { lang: 'en' },
  // Pages set a bare title (e.g. 'Characters'); the template appends the
  // site suffix exactly once. When a page has no title we fall back to the
  // site name alone to avoid a leading separator. The endsWith guard keeps the
  // suffix idempotent for any page that still passes a pre-suffixed title.
  titleTemplate: (t) =>
    !t ? 'Jian Lai Wiki' : t.endsWith('| Jian Lai Wiki') ? t : `${t} | Jian Lai Wiki`,
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: LOGO_URL },
  ],
})

useSeoMeta({
  description: SITE_DESCRIPTION,
  ogSiteName: 'Jian Lai Wiki',
  ogType: 'website',
  ogImage: LOGO_URL,
  ogDescription: SITE_DESCRIPTION,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
