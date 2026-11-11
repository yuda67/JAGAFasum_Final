import { useLayoutEffect, useRef, useState } from "react"
import "./ReportFilter.css"

/**
 * Filter status berbentuk kapsul (All / Pending / In Progress / Resolved).
 * Pil hijau bergeser halus ke pilihan yang aktif.
 * options = [{ id, label }]
 */
export default function ReportFilter({ options, value, onChange, label = "Saring status laporan", className = "" }) {
  const listRef = useRef(null)
  const [pill, setPill] = useState(null)

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return undefined
    const measure = () => {
      const active = list.querySelector('[aria-pressed="true"]')
      if (!active) return
      setPill({ left: active.offsetLeft, width: active.offsetWidth })
      // Di bilah yang bisa digeser, pastikan pilihan aktif terlihat.
      if (list.scrollWidth > list.clientWidth) {
        const left = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2
        list.scrollTo({ left: Math.max(0, left), behavior: "smooth" })
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    list.querySelectorAll("button").forEach((button) => observer.observe(button))
    document.fonts?.ready.then(measure)
    return () => observer.disconnect()
  }, [value])

  return (
    <div
      ref={listRef}
      className={`report-filter ${className}`.trim()}
      role="group"
      aria-label={label}
    >
      {pill && (
        <span
          className="report-filter__pill"
          aria-hidden="true"
          style={{ transform: `translateX(${pill.left}px)`, width: pill.width }}
        />
      )}
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`report-filter__option${value === option.id ? " is-active" : ""}`}
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
