import { useEffect, useState } from "react"

/** true bila halaman sudah di-scroll melewati `threshold` piksel. */
export default function useScrolled(threshold = 64) {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > threshold,
  )

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > threshold)
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
  }, [threshold])

  return scrolled
}
