import { useState } from "react"
import { ratingCopy } from "../../../data/content"
import "./StarRating.css"

const STARS = [1, 2, 3, 4, 5]

function Star({ fill = 1 }) {
  // fill 0..1 → sebagian bintang terisi (untuk rata-rata seperti 4,3)
  const id = `star-clip-${Math.round(fill * 100)}`
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={24 * fill} height="24" />
        </clipPath>
      </defs>
      <path
        className="star-rating__empty"
        d="m12 2.6 2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.16l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93Z"
      />
      <path
        className="star-rating__full"
        clipPath={`url(#${id})`}
        d="m12 2.6 2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.16l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93Z"
      />
    </svg>
  )
}

/**
 * Bintang 1–5.
 * Tanpa `onChange` = tampilan saja (mendukung nilai pecahan).
 * Dengan `onChange` = input radio yang bisa dipilih dengan mouse & keyboard.
 */
export default function StarRating({
  value = 0,
  onChange,
  size = "md",
  label = "Rating",
  className = "",
}) {
  const [hover, setHover] = useState(0)
  const classes = `star-rating star-rating--${size} ${className}`.trim()

  if (!onChange) {
    return (
      <span
        className={classes}
        role="img"
        aria-label={`${value.toFixed(1).replace(".0", "")} dari 5 bintang`}
      >
        {STARS.map((star) => (
          <Star key={star} fill={Math.max(0, Math.min(1, value - star + 1))} />
        ))}
      </span>
    )
  }

  const shown = hover || value
  return (
    <span
      className={`${classes} star-rating--input`}
      role="radiogroup"
      aria-label={label}
      onMouseLeave={() => setHover(0)}
    >
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} bintang — ${ratingCopy.scoreLabels[star - 1]}`}
          tabIndex={value ? (value === star ? 0 : -1) : star === 1 ? 0 : -1}
          className={`star-rating__btn${star <= shown ? " is-on" : ""}`}
          onMouseEnter={() => setHover(star)}
          onFocus={() => setHover(0)}
          onClick={() => onChange(star)}
          onKeyDown={(event) => {
            const delta = {
              ArrowRight: 1,
              ArrowUp: 1,
              ArrowLeft: -1,
              ArrowDown: -1,
            }[event.key]
            if (!delta) return
            event.preventDefault()
            const next = Math.min(5, Math.max(1, (value || 0) + delta))
            onChange(next)
            event.currentTarget.parentElement
              ?.querySelectorAll("button")
              [next - 1]?.focus()
          }}
        >
          <Star fill={star <= shown ? 1 : 0} />
        </button>
      ))}
    </span>
  )
}
