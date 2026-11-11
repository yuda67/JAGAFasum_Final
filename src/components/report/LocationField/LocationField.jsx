import { useEffect, useId, useRef, useState } from "react"
import Button from "../../ui/Button/Button"
import { AlertIcon, CloseIcon, PinIcon } from "../../icons/UiIcons"
import { ExternalIcon, MapPinIcon } from "../../icons/DashboardIcons"
import {
  formatCoords,
  getOsmEmbedUrl,
  getOsmLink,
  locateUser,
  reverseGeocode,
} from "../../../services/locationService"
import { createReport } from "../../../data/content"
import "../report-shared.css"
import "../ReportField/ReportField.css"
import "./LocationField.css"

const copy = createReport.location

/**
 * Lokasi laporan: ketik alamat manual, atau tekan "Get my Location" untuk
 * mengambil titik GPS + alamat dari OpenStreetMap, lalu tampilkan petanya.
 * value = { address, lat, lon }
 */
export default function LocationField({ ref, value, onChange, error }) {
  const id = useId()
  const [locating, setLocating] = useState(false)
  const [notice, setNotice] = useState(null) // { tone: 'error' | 'info', text }
  const abortRef = useRef(null)
  const hasPoint = value.lat != null && value.lon != null

  useEffect(() => () => abortRef.current?.abort(), [])

  const locate = async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLocating(true)
    setNotice(null)
    try {
      const point = await locateUser(controller.signal)
      let address = ""
      try {
        address = await reverseGeocode(point, controller.signal)
      } catch (err) {
        if (err.name === "AbortError") return
      }
      if (controller.signal.aborted) return
      onChange({ address: address || formatCoords(point), ...pickPoint(point) })
      let text = "Alamat tidak ditemukan, koordinat dipakai sebagai lokasi. Kamu bisa melengkapinya."
      if (point.approximate) text = copy.approximate
      else if (address)
        text = `${copy.found} (akurasi ±${Math.round(point.accuracy)} m). Kamu masih bisa merapikan alamatnya.`
      setNotice({ tone: "info", text })
    } catch (err) {
      if (err.name !== "AbortError") setNotice({ tone: "error", text: err.message })
    } finally {
      if (abortRef.current === controller) setLocating(false)
    }
  }

  const clearPoint = () => {
    onChange({ ...value, lat: null, lon: null })
    setNotice(null)
  }

  const message = error
    ? { tone: "error", text: error }
    : notice?.tone === "error"
      ? notice
      : null

  return (
    <div className={`location-field${message ? " has-error" : ""}`}>
      <label className="report-label" htmlFor={id}>
        {copy.label}
        <span className="report-required" aria-hidden="true">
          *
        </span>
      </label>

      <div className="location-field__row">
        <div className="location-field__control">
          <input
            ref={ref}
            id={id}
            className="report-input location-field__input"
            placeholder={copy.placeholder}
            value={value.address}
            onChange={(event) => onChange({ ...value, address: event.target.value })}
            autoComplete="street-address"
            aria-invalid={message ? "true" : undefined}
            aria-describedby={message ? `${id}-message` : undefined}
            aria-required="true"
          />
          {locating && <span className="location-field__scan" aria-hidden="true" />}
        </div>
        <Button
          variant="primary"
          className="location-field__btn"
          onClick={locate}
          loading={locating}
        >
          {!locating && <PinIcon className="location-field__pin" />}
          {locating ? copy.locating : copy.button}
        </Button>
      </div>

      {message && (
        <p id={`${id}-message`} className="report-error" role="alert">
          <AlertIcon />
          {message.text}
        </p>
      )}
      {!message && notice && (
        <p className="location-field__notice" role="status">
          <MapPinIcon />
          {notice.text}
        </p>
      )}

      {hasPoint && (
        <div className="location-field__map">
          <iframe
            key={`${value.lat},${value.lon}`}
            className="location-field__frame"
            title={copy.mapTitle}
            src={getOsmEmbedUrl(value)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="location-field__map-bar">
            <span className="location-field__coords">
              <MapPinIcon />
              {formatCoords(value)}
            </span>
            <a
              className="location-field__map-link"
              href={getOsmLink(value)}
              target="_blank"
              rel="noreferrer"
            >
              {copy.openMap}
              <ExternalIcon />
            </a>
            <button
              type="button"
              className="location-field__clear"
              onClick={clearPoint}
              aria-label="Hapus titik lokasi"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const pickPoint = ({ lat, lon }) => ({ lat, lon })
