import { useRef, useState } from "react"
import Button from "../../ui/Button/Button"
import { AlertIcon } from "../../icons/UiIcons"
import { RefreshIcon, TrashIcon, UploadIcon } from "../../icons/DashboardIcons"
import {
  ACCEPTED_IMAGE_TYPES,
  compressImage,
  validateImageFile,
} from "../../../utils/image"
import { createReport } from "../../../data/content"
import "../report-shared.css"
import "./PhotoUpload.css"

const copy = createReport.photo

/** Kartu "Foto fasilitas": klik/seret-lepas foto, pratinjau, ganti & hapus. */
export default function PhotoUpload({ ref, value, onChange, error }) {
  const inputRef = useRef(null)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [fileError, setFileError] = useState("")
  const message = fileError || error

  const openPicker = () => inputRef.current?.click()

  const handleFile = async (file) => {
    const problem = validateImageFile(file)
    if (problem) {
      setFileError(problem)
      return
    }
    setFileError("")
    setProcessing(true)
    try {
      const image = await compressImage(file)
      onChange({ ...image, name: file.name })
    } catch (err) {
      setFileError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleDragEnter = (event) => {
    event.preventDefault()
    dragDepth.current += 1
    setDragging(true)
  }
  const handleDragLeave = (event) => {
    event.preventDefault()
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragging(false)
  }
  const handleDrop = (event) => {
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const zoneClasses = [
    "photo-upload__zone",
    dragging && "is-dragging",
    value && "has-photo",
    processing && "is-processing",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <section
      className={`photo-upload${message ? " has-error" : ""}`}
      aria-labelledby="photo-upload-title"
    >
      <h2 id="photo-upload-title" className="photo-upload__title">
        {copy.label}
        <span className="report-required" aria-hidden="true">
          *
        </span>
      </h2>
      <p className="photo-upload__hint">{copy.hint}</p>

      <div
        className={zoneClasses}
        onDragEnter={handleDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(event) => {
          if (!value && event.target === event.currentTarget) openPicker()
        }}
      >
        {value ? (
          <figure className="photo-upload__preview">
            <img
              key={value.dataUrl.length}
              src={value.dataUrl}
              alt="Pratinjau foto fasilitas yang akan dilaporkan"
              className="photo-upload__image"
            />
            <figcaption className="photo-upload__bar">
              <span className="photo-upload__name" title={value.name}>
                {value.name}
              </span>
              <span className="photo-upload__actions">
                <button
                  ref={ref}
                  type="button"
                  className="photo-upload__chip"
                  onClick={openPicker}
                >
                  <RefreshIcon />
                  {copy.replace}
                </button>
                <button
                  type="button"
                  className="photo-upload__chip photo-upload__chip--danger"
                  onClick={() => onChange(null)}
                  aria-label={copy.remove}
                >
                  <TrashIcon />
                </button>
              </span>
            </figcaption>
          </figure>
        ) : (
          <div className="photo-upload__empty">
            <span className="photo-upload__badge" aria-hidden="true">
              <UploadIcon />
            </span>
            <Button
              ref={ref}
              variant="primary"
              className="photo-upload__btn"
              onClick={openPicker}
              loading={processing}
              aria-describedby={message ? "photo-upload-message" : undefined}
            >
              {processing ? copy.processing : copy.button}
            </Button>
            <p className="photo-upload__drop" aria-hidden="true">
              {dragging ? copy.dropActive : copy.dropHint}
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="u-visually-hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (file) handleFile(file)
          }}
        />
      </div>

      {message && (
        <p id="photo-upload-message" className="report-error" role="alert">
          <AlertIcon />
          {message}
        </p>
      )}
    </section>
  )
}
