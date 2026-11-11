import { useRef, useState } from "react"
import useInView from "../../../hooks/useInView"
import useCountUp from "../../../hooks/useCountUp"
import { formatNumber } from "../../../utils/format"
import "./StatCard.css"

/**
 * Kartu statistik miring yang melayang; angkanya menghitung naik saat terlihat.
 * Klik → kartu memantul, angka dihitung ulang, dan rincian kecil muncul/hilang.
 */
export default function StatCard({ label, value, detail, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.4, rootMargin: "0px" })
  const [replay, setReplay] = useState(0)
  const [open, setOpen] = useState(false)
  const [ripple, setRipple] = useState(null)
  const count = useCountUp(value, {
    start: inView,
    delay: replay ? 0 : 650 + index * 150,
    duration: replay ? 700 : 1600,
    from: replay ? Math.round(value * 0.6) : 0,
    replay,
  })

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    // Titik riak mengikuti posisi klik (tengah kartu bila lewat keyboard).
    const x = event.clientX ? event.clientX - rect.left : rect.width / 2
    const y = event.clientY ? event.clientY - rect.top : rect.height / 2
    setRipple({ x, y, key: Date.now() })
    setReplay((current) => current + 1)
    setOpen((current) => !current)
  }

  return (
    <div ref={ref} className={`stat-card stat-card--${index + 1}`}>
      <div className="stat-card__float">
        <button
          type="button"
          // Dua kelas bergantian agar animasi pantul bisa diputar ulang tanpa me-remount tombol.
          className={`stat-card__body${
            replay ? ` is-bumped-${replay % 2}` : ""
          }${open ? " is-open" : ""}`}
          onClick={handleClick}
          aria-expanded={open}
          aria-label={`${label}: ${formatNumber(value)}. ${detail}`}
        >
          {ripple && (
            <span
              key={ripple.key}
              className="stat-card__ripple"
              style={{ left: ripple.x, top: ripple.y }}
              aria-hidden="true"
            />
          )}
          <span className="stat-card__label" aria-hidden="true">
            {label}
          </span>
          <span className="stat-card__value" aria-hidden="true">
            {formatNumber(count)}
          </span>
          <span className="stat-card__detail" aria-hidden="true">
            {detail}
          </span>
        </button>
      </div>
    </div>
  )
}
