import { useId, useRef, useState } from "react"
import Modal from "../../ui/Modal/Modal"
import Button from "../../ui/Button/Button"
import { AlertIcon } from "../../icons/UiIcons"
import { TrashIcon } from "../../icons/DashboardIcons"
import { getStatusLabel } from "../../report/reportMeta"
import useAuth from "../../../hooks/useAuth"
import useToast from "../../../hooks/useToast"
import { adminDeleteReport } from "../../../services/reportService"
import { adminDelete as copy } from "../../../data/content"
import "../../ui/ConfirmDialog/ConfirmDialog.css"
import "./AdminDeleteDialog.css"

/**
 * Dialog hapus laporan khusus admin. Validasi: admin harus mengetik kata
 * konfirmasi ("HAPUS") sebelum tombol hapus aktif.
 */
export default function AdminDeleteDialog({ report, onClose, onDeleted }) {
  const id = useId()
  const inputRef = useRef(null)
  const { user } = useAuth()
  const { show } = useToast()
  const [word, setWord] = useState("")
  const [touched, setTouched] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  // Simpan laporan terakhir agar teks tetap tampil saat animasi tutup.
  const [shown, setShown] = useState(report)
  if (report && report !== shown) {
    setShown(report)
    setWord("")
    setTouched(false)
    setError("")
  }
  const current = report ?? shown
  const valid = word.trim() === copy.confirmWord

  const handleSubmit = async (event) => {
    event.preventDefault()
    setTouched(true)
    if (!valid || deleting) {
      inputRef.current?.focus()
      return
    }
    setDeleting(true)
    const result = await adminDeleteReport(user, current)
    setDeleting(false)
    if (!result.ok) {
      setError(result.formError)
      return
    }
    show(copy.done(current.title), { tone: "info" })
    onDeleted?.(current)
    onClose()
  }

  return (
    <Modal
      open={Boolean(report)}
      onClose={onClose}
      titleId={`${id}-title`}
      descriptionId={`${id}-body`}
      initialFocusRef={inputRef}
      dismissible={!deleting}
      className="confirm confirm--danger admin-delete"
    >
      {current && (
        <form onSubmit={handleSubmit} noValidate>
          <div className="confirm__icon" aria-hidden="true">
            <span className="confirm__ring" />
            <span className="confirm__ring confirm__ring--late" />
            <TrashIcon />
          </div>
          <h2 id={`${id}-title`} className="confirm__title">
            {copy.title}
          </h2>
          <p id={`${id}-body`} className="confirm__body">
            {copy.body(current.title, getStatusLabel(current.status))}
            {current.duplicateIds?.length > 0 && (
              <span className="admin-delete__extra">
                {copy.duplicates(current.duplicateIds.length)}
              </span>
            )}
          </p>

          <label htmlFor={`${id}-word`} className="admin-delete__label">
            {copy.inputLabel(copy.confirmWord)}
          </label>
          <input
            ref={inputRef}
            id={`${id}-word`}
            className={`admin-delete__input${
              touched && !valid ? " has-error" : ""
            }${valid ? " is-valid" : ""}`}
            value={word}
            autoComplete="off"
            spellCheck="false"
            placeholder={copy.confirmWord}
            aria-invalid={touched && !valid}
            aria-describedby={touched && !valid ? `${id}-error` : undefined}
            onChange={(event) => {
              setWord(event.target.value)
              setError("")
            }}
          />
          {(touched && !valid) || error ? (
            <p id={`${id}-error`} className="admin-delete__error" role="alert">
              <AlertIcon />
              {error || copy.mismatch(copy.confirmWord)}
            </p>
          ) : null}

          <div className="confirm__actions">
            <Button
              variant="outline"
              className="confirm__btn"
              onClick={onClose}
              disabled={deleting}
            >
              {copy.cancel}
            </Button>
            <Button
              type="submit"
              variant="danger"
              className={`confirm__btn${valid ? "" : " is-locked"}`}
              loading={deleting}
              aria-disabled={!valid || undefined}
            >
              {deleting ? copy.deleting : copy.confirm}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
