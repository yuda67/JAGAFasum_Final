import { useId } from "react"
import { AlertIcon } from "../../icons/UiIcons"
import "../report-shared.css"
import "./ReportField.css"

/** Field teks form laporan (input kapsul atau textarea) dengan penghitung karakter. */
export default function ReportField({
  ref,
  label,
  multiline = false,
  error,
  maxLength,
  value = "",
  required = false,
  className = "",
  ...inputProps
}) {
  const id = useId()
  const errorId = `${id}-error`
  const Control = multiline ? "textarea" : "input"
  const nearLimit = maxLength && value.length > maxLength * 0.9

  return (
    <div
      className={`report-field${error ? " has-error" : ""} ${className}`.trim()}
    >
      <div className="report-field__head">
        <label className="report-label" htmlFor={id}>
          {label}
          {required && (
            <span className="report-required" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {maxLength && (
          <span
            className={`report-field__count${nearLimit ? " is-near" : ""}`}
            aria-hidden="true"
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <Control
        ref={ref}
        id={id}
        className={`report-field__control report-field__control--${multiline ? "area" : "line"}`}
        value={value}
        maxLength={maxLength}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        aria-required={required || undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="report-error" role="alert">
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  )
}
