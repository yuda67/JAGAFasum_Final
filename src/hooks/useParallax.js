import { useEffect } from "react"
import usePrefersReducedMotion from "./usePrefersReducedMotion"

/**
 * Menggeser elemen `ref` lebih lambat dari scroll (efek parallax)
 * lewat CSS variable --parallax-y.
 */
export default function useParallax(ref, { factor = 0.25 } = {}) {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (reducedMotion) {
      node.style.removeProperty("--parallax-y")
      return undefined
    }

    let frame = 0
    const update = () => {
      frame = 0
      const limit = node.parentElement?.offsetHeight ?? window.innerHeight
      const offset = Math.min(Math.max(window.scrollY, 0), limit) * factor
      node.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`)
    }
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(frame)
    }
  }, [ref, factor, reducedMotion])
}
