import { AlertIcon, CheckCircleIcon } from "../../icons/UiIcons"
import { CATEGORY_ICONS } from "../../icons/DashboardIcons"
import { createReport, reportCategories } from "../../../data/content"
import "../report-shared.css"
import "./CategoryPicker.css"

/** Pilihan kategori fasilitas: 6 kartu radio dalam 3 kolom. */
export default function CategoryPicker({ ref, value, onChange, error }) {
  return (
    <fieldset
      className={`category-picker${error ? " has-error" : ""}`}
      aria-describedby={error ? "category-picker-error" : undefined}
    >
      <legend className="report-label">
        {createReport.category.label}
        <span className="report-required" aria-hidden="true">
          *
        </span>
      </legend>

      <div className="category-picker__grid">
        {reportCategories.map((category, index) => {
          const Icon = CATEGORY_ICONS[category.id]
          const checked = value === category.id
          return (
            <label
              key={category.id}
              className={`category-picker__option${checked ? " is-checked" : ""}`}
              style={{ "--i": index }}
            >
              <input
                ref={index === 0 ? ref : undefined}
                type="radio"
                name="category"
                value={category.id}
                checked={checked}
                onChange={() => onChange(category.id)}
                className="category-picker__input"
              />
              <span className="category-picker__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="category-picker__text">{category.label}</span>
              <CheckCircleIcon className="category-picker__check" />
            </label>
          )
        })}
      </div>

      {error && (
        <p id="category-picker-error" className="report-error" role="alert">
          <AlertIcon />
          {error}
        </p>
      )}
    </fieldset>
  )
}
