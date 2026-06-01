/**
 * useSearchState — shared open/close state for the search modal (Stage 6A).
 *
 * Uses Nuxt's `useState` so the header trigger, the global keyboard shortcut,
 * and the modal itself all share one reactive flag across components.
 */
export function useSearchState() {
  const isOpen = useState<boolean>('search-open', () => false)

  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }
  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return { isOpen, open, close, toggle }
}
