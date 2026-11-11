import { useEffect, useState } from "react"
import usePrefersReducedMotion from "./usePrefersReducedMotion"

const easeOutCubic = (t) => 1 - (1 - t) ** 3

/**
 * Menghitung naik dari `from` (bawaan 0) ke `target` setelah `start` bernilai true.
 * Ubah `replay` untuk memutar ulang hitungan (mis. saat kartu diklik).
 */
export default function useCountUp(
  target,
  { start = false, duration = 1600, delay = 0, from = 0, replay = 0 } = {},
) {
  const reducedMotion = usePrefersReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return undefined
    if (reducedMotion) {
      setValue(target)
      return undefined
    }

    let frame = 0
    let startTime = 0
    const tick = (now) => {
      if (!startTime) startTime = now
      const progress = Math.min(1, (now - startTime) / duration)
      setValue(Math.round(from + (target - from) * easeOutCubic(progress)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    const timer = setTimeout(() => {
      frame = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [target, start, duration, delay, from, replay, reducedMotion])

  return value
}
