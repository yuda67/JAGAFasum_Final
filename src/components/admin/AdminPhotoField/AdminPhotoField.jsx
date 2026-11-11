import { useId, useRef, useState } from "react"
import { AlertIcon } from "../../icons/UiIcons"
import { CameraIcon, RefreshIcon, TrashIcon } from "../../icons/DashboardIcons"
import {
  ACCEPTED_IMAGE_TYPES,
  compressImage,
  validateImageFile,
} from "../../../utils/image"
import { workflow } from "../../../data/content"
import "./AdminPhotoField.css"

/**
 * Unggah foto before/after (khusus admin): klik atau seret-lepas, pratinjau, ganti, hapus.
 * `value` = data URL; `fallback` = foto yang dipakai bila kosong (mis. foto pelapor).
 */
export default function AdminPhotoField({
  ref,
  label,
  hint,
  value,
  fallback,
  onChange,
  error,
  required = false,
  tone = "before",
}) {
  const id = useId()
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [fileError, setFileError] = useState("")
  const message = fileError || error
  const preview = value || fallback

  const handleFile = async (file) => {
    const problem = validateImageFile(file)
    if (problem) {
      setFileError(problem)
      return
    }
    setFileError("")
    setProcessing(true)
    try {
      const image = await compressImage(file, { maxSize: 1100, quality: 0.78 })
      onChange(image.dataUrl)
    } catch (err) {
      setFileError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div
      className={`admin-photo admin-photo--${tone}${
        message ? " has-error" : ""
      }`}
    >
      <p className="admin-photo__label" id={`${id}-label`}>
        {label}
        {required ? (
          <span className="report-required" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="admin-photo__optional">({workflow.optional})</span>
        )}
      </p>

      <div
        className={`admin-photo__zone${dragging ? " is-dragging" : ""}${
          preview ? " has-photo" : ""
        }`}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          const file = event.dataTransfer.files?.[0]
          if (file) handleFile(file)
        }}
      >
        {preview ? (
          <>
            <img src={preview} alt="" className="admin-photo__img" />
            {!value && fallback && (
              <span className="admin-photo__fallback">Foto pelapor</span>
            )}
            <span className="admin-photo__actions">
              <button
                ref={ref}
                type="button"
                className="admin-photo__chip"
                onClick={() => inputRef.current?.click()}
                aria-describedby={`${id}-label`}
              >
                <RefreshIcon />
                {value ? workflow.photoReplace : workflow.photoButton}
              </button>
              {value && (
                <button
                  type="button"
                  className="admin-photo__chip admin-photo__chip--danger"
                  onClick={() => onChange(null)}
                  aria-label={`${workflow.photoRemove}: ${label}`}
                >
                  <TrashIcon />
                </button>
              )}
            </span>
          </>
        ) : (
          <button
            ref={ref}
            type="button"
            className="admin-photo__empty"
            onClick={() => inputRef.current?.click()}
            aria-describedby={`${id}-label ${id}-hint`}
            disabled={processing}
          >
            <span className="admin-photo__badge" aria-hidden="true">
              {processing ? (
                <span className="admin-photo__spinner" />
              ) : (
                <CameraIcon />
              )}
            </span>
            <span className="admin-photo__cta">
              {processing ? "Memproses foto…" : workflow.photoButton}
            </span>
            <span className="admin-photo__drop">
              atau seret & lepas di sini
            </span>
          </button>
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

      {message ? (
        <p className="report-error admin-photo__message" role="alert">
          <AlertIcon />
          {message}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="admin-photo__hint">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
