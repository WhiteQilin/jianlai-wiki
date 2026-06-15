import { onMounted, onUnmounted, ref } from 'vue'

export function useScrollReveal(options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) {
  const isRevealed = ref(false)
  const el = ref<HTMLElement | null>(null)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    // Respect user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      isRevealed.value = true
      return
    }

    if (!el.value) return

    // Synchronous in-viewport check: elements already on screen at mount are
    // marked revealed immediately, before the IntersectionObserver schedules
    // its first callback. This prevents a hide-then-fade-in flash for
    // above-the-fold content once the global reveal CSS gate engages.
    const rect = el.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const isAlreadyInView = rect.top < viewportHeight && rect.bottom > 0

    if (isAlreadyInView) {
      isRevealed.value = true
      return
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isRevealed.value = true
          // Stop observing once revealed if we only want it to happen once
          if (observer && el.value) {
            observer.unobserve(el.value)
          }
        }
      })
    }, options)

    observer.observe(el.value)
  })

  onUnmounted(() => {
    if (observer && el.value) {
      observer.unobserve(el.value)
    }
  })

  return {
    el,
    isRevealed
  }
}
