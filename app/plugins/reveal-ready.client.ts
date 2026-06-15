/**
 * reveal-ready.client.ts
 *
 * Sets `data-reveal-ready` on <html> once client-side JS has hydrated.
 *
 * The reveal animation CSS gates the hidden state behind this attribute:
 *   .reveal-fade-up                                       (visible default)
 *   html[data-reveal-ready] .reveal-fade-up:not(.revealed) { opacity: 0 }
 *   .reveal-fade-up.revealed                              (visible final)
 *
 * When JS fails or hydration is blocked, the attribute is never set and all
 * reveal-wrapped content remains visible — no invisible content for no-JS
 * users, search bots, or broken hydration.
 *
 * Setting waits one animation frame after mount so that in-viewport
 * `useScrollReveal` instances have time to run their synchronous viewport
 * check and add `.revealed` to themselves first. This avoids any
 * hide-then-fade-in flash on above-the-fold content.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return

  nuxtApp.hook('app:mounted', () => {
    requestAnimationFrame(() => {
      document.documentElement.setAttribute('data-reveal-ready', '')
    })
  })
})
