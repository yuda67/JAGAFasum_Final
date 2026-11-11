import { useId, useRef, useState } from "react"
import Modal from "../../ui/Modal/Modal"
import { DoorIcon } from "../../icons/DashboardIcons"
import { logoutDialog } from "../../../data/content"
import "./LogoutDialog.css"

const EXIT_DELAY = 550

/** Pop-up konfirmasi Logout di tengah layar (desain "Log out - pop up"). */
export default function LogoutDialog({ open, onCancel, onConfirm }) {
  const id = useId()
  const cancelRef = useRef(null)
  const [leaving, setLeaving] = useState(false)

  const handleConfirm = async () => {
    setLeaving(true)
    // Jeda singkat: pintu "tertutup" dulu, lalu logout dijalankan.
    await new Promise((resolve) => setTimeout(resolve, EXIT_DELAY))
    setLeaving(false)
    onConfirm?.()
  }

  return (
    <Modal
      open={open}
      onClose={onCancel}
      titleId={`${id}-title`}
      initialFocusRef={cancelRef}
      dismissible={!leaving}
      className={`logout-dialog${leaving ? " is-leaving" : ""}`}
    >
      <DoorIcon className="logout-dialog__door" />
      <h2 id={`${id}-title`} className="logout-dialog__title">
        {logoutDialog.title.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>
      <div className="logout-dialog__actions">
        <button
          ref={cancelRef}
          type="button"
          className="logout-dialog__btn logout-dialog__btn--cancel"
          onClick={onCancel}
          disabled={leaving}
        >
          {logoutDialog.cancel}
        </button>
        <button
          type="button"
          className="logout-dialog__btn logout-dialog__btn--confirm"
          onClick={handleConfirm}
          disabled={leaving}
          aria-busy={leaving || undefined}
        >
          {leaving && <span className="logout-dialog__spinner" aria-hidden="true" />}
          {leaving ? logoutDialog.confirming : logoutDialog.confirm}
        </button>
      </div>
    </Modal>
  )
}
