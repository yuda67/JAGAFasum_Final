import { useEffect, useState } from "react"

/** Mengembalikan true saat elemen `ref` masuk ke viewport (sekali jalan secara default). */
export default function useInView(
  ref,
  { threshold = 0.18, rootMargin = "0px 0px -8% 0px", once = true } = {},
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, threshold, rootMargin, once])

  return inView
}
