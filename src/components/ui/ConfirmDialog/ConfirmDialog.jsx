import { useId, useRef, useState } from "react"
import Modal from "../Modal/Modal"
import Button from "../Button/Button"
import "./ConfirmDialog.css"

/**
 * Dialog konfirmasi (mis. Logout / Hapus laporan).
 * `onConfirm` boleh async; selama berjalan tombol menampilkan loading.
 */
export default function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  icon,
  tone = "default",
  title,
  body,
  cancelLabel = "Batal",
  confirmLabel = "Ya",
  confirmingLabel,
}) {
  const id = useId()
  const cancelRef = useRef(null)
  const [confirming, setConfirming] = useState(false)

  const handleConfirm = async () => {
    setConfirming(true)
    try {
      await onConfirm?.()
    } finally {
      setConfirming(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onCancel}
      titleId={`${id}-title`}
      descriptionId={`${id}-body`}
      initialFocusRef={cancelRef}
      dismissible={!confirming}
      className={`confirm confirm--${tone}`}
    >
      {icon && (
        <div className="confirm__icon" aria-hidden="true">
          <span className="confirm__ring" />
          <span className="confirm__ring confirm__ring--late" />
          {icon}
        </div>
      )}
      <h2 id={`${id}-title`} className="confirm__title">
        {title}
      </h2>
      <p id={`${id}-body`} className="confirm__body">
        {body}
      </p>
      <div className="confirm__actions">
        <Button
          ref={cancelRef}
          variant="outline"
          className="confirm__btn"
          onClick={onCancel}
          disabled={confirming}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={tone === "danger" ? "danger" : "primary"}
          className="confirm__btn"
          onClick={handleConfirm}
          loading={confirming}
        >
          {confirming && confirmingLabel ? confirmingLabel : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
