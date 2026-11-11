import useCountUp from "../../../hooks/useCountUp"
import "./DashStat.css"

/** Kartu ringkasan (angka + titik warna + label). Klik untuk menyaring kartu laporan. */
export default function DashStat({ label, value, tone, index = 0, active = false, onClick }) {
  const shown = useCountUp(value, {
    start: true,
    duration: 900,
    delay: 250 + index * 110,
  })

  return (
    <li className="dash-stat-item" style={{ "--i": index }}>
      <button
        type="button"
        className={`dash-stat dash-stat--${tone}${active ? " is-active" : ""}`}
        onClick={onClick}
        aria-pressed={active}
        aria-label={`${label}: ${value}. Tampilkan laporan ini`}
      >
        <span className="dash-stat__value" aria-hidden="true">
          {shown}
        </span>
        <span className="dash-stat__label" aria-hidden="true">
          <span className="dash-stat__dot" />
          {label}
        </span>
      </button>
    </li>
  )
}
