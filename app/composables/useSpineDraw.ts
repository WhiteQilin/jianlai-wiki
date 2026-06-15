/**
 * useSpineDraw — GSAP ScrollTrigger composable for the blade-core spine draw effect.
 *
 * Reveals a vertical spine element downward as the reader scrolls through the
 * parent container. Designed for the Swordsmanship V3 Blade Path page only.
 *
 * - Client-only (GSAP + ScrollTrigger loaded dynamically)
 * - Respects prefers-reduced-motion (shows full spine, no animation)
 * - Shows a static visible spine if GSAP or ScrollTrigger fails to load
 * - Cleans up all ScrollTrigger instances on unmount
 */
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useSpineDraw(
  spineRef: Ref<HTMLElement | null>,
  containerRef: Ref<HTMLElement | null>,
) {
  const isReady = ref(false)
  let ctx: any = null

  onMounted(async () => {
    if (typeof window === 'undefined') return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      isReady.value = true
      return
    }

    const spine = spineRef.value
    const container = containerRef.value
    if (!spine || !container) return

    try {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Set initial state: fully clipped (hidden)
        gsap.set(spine, {
          clipPath: 'inset(0 0 100% 0)',
        })

        gsap.to(spine, {
          clipPath: 'inset(0 0 0% 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        })
      }, container)

      // Ensure ScrollTrigger has a stable measurement after layout settles.
      // `invalidateOnRefresh` on the trigger handles resize; a second refresh
      // after a rAF ensures the initial layout has been painted.
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })

      isReady.value = true
    } catch {
      // If GSAP or ScrollTrigger fails (CSP, network, bad module), show the
      // spine as a static element so it is never invisible. Removes the
      // clip-path that GSAP would normally manage.
      if (spine) {
        spine.style.clipPath = 'none'
      }
      isReady.value = true
    }
  })

  onUnmounted(() => {
    if (ctx) {
      ctx.revert()
      ctx = null
    }
  })

  return { isReady }
}

