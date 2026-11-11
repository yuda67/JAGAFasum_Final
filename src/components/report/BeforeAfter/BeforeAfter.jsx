import { useId, useState } from "react"
import { CompareIcon } from "../../icons/DashboardIcons"
import { beforeAfter as copy } from "../../../data/content"
import "./BeforeAfter.css"

/**
 * Perbandingan foto before & after dengan penggeser.
 * Geser dengan mouse/jari, atau pakai tombol panah saat slider difokuskan.
 */
export default function BeforeAfter({
  before,
  after,
  title = "",
  className = "",
}) {
  const id = useId()
  const [position, setPosition] = useState(50)

  return (
    <div
      className={`before-after ${className}`.trim()}
      style={{ "--pos": `${position}%` }}
    >
      <img
        src={before}
        alt={`Sebelum pengerjaan: ${title}`}
        className="before-after__img"
        draggable="false"
      />
      <img
        src={after}
        alt={`Sesudah pengerjaan: ${title}`}
        className="before-after__img before-after__img--after"
        draggable="false"
      />
      <span
        className="before-after__tag before-after__tag--before"
        aria-hidden="true"
      >
        {copy.before}
      </span>
      <span
        className="before-after__tag before-after__tag--after"
        aria-hidden="true"
      >
        {copy.after}
      </span>
      <span className="before-after__divider" aria-hidden="true">
        <span className="before-after__knob">
          <CompareIcon />
        </span>
      </span>
      <label htmlFor={id} className="u-visually-hidden">
        {copy.sliderLabel}
      </label>
      <input
        id={id}
        type="range"
        min="0"
        max="100"
        step="1"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="before-after__range"
      />
    </div>
  )
}
