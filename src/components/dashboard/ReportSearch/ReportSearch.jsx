import { useId } from "react"
import { CloseIcon } from "../../icons/UiIcons"
import { SearchIcon } from "../../icons/DashboardIcons"
import "./ReportSearch.css"

/** Kolom pencarian kapsul abu-abu: "Cari laporan atau lokasi". */
export default function ReportSearch({ value, onChange, placeholder, label }) {
  const id = useId()
  return (
    <div className="report-search">
      <label htmlFor={id} className="u-visually-hidden">
        {label}
      </label>
      <SearchIcon className="report-search__icon" />
      <input
        id={id}
        type="search"
        className="report-search__input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && onChange("")}
        autoComplete="off"
        enterKeyHint="search"
      />
      {value && (
        <button
          type="button"
          className="report-search__clear"
          onClick={() => onChange("")}
          aria-label="Hapus pencarian"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}
