import { useId, useState } from "react"
import { EyeIcon, EyeOffIcon } from "../../icons/UiIcons"
import "./TextField.css"

/** Field form auth: label + input + hint/error, plus tombol lihat password. */
export default function TextField({
  ref,
  id,
  label,
  type = "text",
  error,
  hint,
  className = "",
  ...inputProps
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === "password"
  const messageId = `${inputId}-message`
  const message = error || hint

  const classes = [
    "field",
    isPassword && "field--password",
    error && "has-error",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={classes}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="field__control">
        <input
          ref={ref}
          id={inputId}
          className="field__input"
          type={isPassword && revealed ? "text" : type}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={message ? messageId : undefined}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            aria-controls={inputId}
          >
            {revealed ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {message && (
        <p
          id={messageId}
          className={
            error ? "field__message field__message--error" : "field__message"
          }
        >
          {message}
        </p>
      )}
    </div>
  )
}
