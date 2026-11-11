import { CheckCircleIcon, CloseIcon, InfoCircleIcon } from "../../icons/UiIcons"
import "./Toast.css"

export default function ToastViewport({ toasts, onDismiss }) {
  return (
    <section className="toast-viewport" aria-label="Notifikasi">
      <ol className="toast-viewport__list" aria-live="polite">
        {toasts.map((toast) => (
          <li
            key={toast.id}
            className={`toast toast--${toast.tone}${
              toast.leaving ? " is-leaving" : ""
            }`}
          >
            <span className="toast__icon">
              {toast.tone === "info" ? <InfoCircleIcon /> : <CheckCircleIcon />}
            </span>
            <span className="toast__message">{toast.message}</span>
            <button
              type="button"
              className="toast__close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Tutup notifikasi"
            >
              <CloseIcon />
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
