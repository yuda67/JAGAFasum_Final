import { useId, useRef, useState } from "react"
import Modal from "../../ui/Modal/Modal"
import StatusBadge from "../StatusBadge/StatusBadge"
import BeforeAfter from "../BeforeAfter/BeforeAfter"
import StatusTimeline from "../StatusTimeline/StatusTimeline"
import RatingPanel from "../RatingPanel/RatingPanel"
import Button from "../../ui/Button/Button"
import { CloseIcon } from "../../icons/UiIcons"
import {
  CalendarIcon,
  CheckIcon,
  ClipboardIcon,
  ExternalIcon,
  LayersIcon,
  MapPinIcon,
} from "../../icons/DashboardIcons"
import { getCategoryMeta } from "../reportMeta"
import useAuth from "../../../hooks/useAuth"
import { getOsmLink } from "../../../services/locationService"
import { formatDateTime } from "../../../utils/format"
import { manageReports, ratingCopy, reportSteps, workflow } from "../../../data/content"
import "./ReportDetailDialog.css"

// Posisi laporan pada alur JAGAFasum (Foto → Laporkan → Pantau → Selesai → Nilai).
const STATUS_STEP = { pending: 1, progress: 2, done: 3 }

/**
 * Pop-up detail laporan: foto (atau perbandingan before/after), info lengkap,
 * progres alur, riwayat status, dan rating kinerja (oleh pelapor setelah Resolved).
 */
export default function ReportDetailDialog({ report, onClose }) {
  const id = useId()
  const { isAdmin } = useAuth()
  const closeRef = useRef(null)
  // Simpan laporan terakhir agar isi tetap tampil saat animasi tutup berjalan.
  const [shown, setShown] = useState(report)
  if (report && report !== shown) setShown(report)

  const current = report ?? shown
  const category = current ? getCategoryMeta(current.category) : null
  const hasPoint = current?.location.lat != null && current?.location.lon != null
  const activeStep =
    current?.status === "done" && current?.rating ? 4 : (STATUS_STEP[current?.status] ?? 1)

  return (
    <Modal
      open={Boolean(report)}
      onClose={onClose}
      titleId={`${id}-title`}
      initialFocusRef={closeRef}
      size="lg"
      className="report-detail"
    >
      {current && (
        <>
          <div className="report-detail__media">
            {current.afterPhoto ? (
              <BeforeAfter
                before={current.beforePhoto ?? current.photo}
                after={current.afterPhoto}
                title={current.title}
                className="report-detail__compare"
              />
            ) : (
              <img src={current.photo} alt={`Foto laporan: ${current.title}`} />
            )}
            <button
              ref={closeRef}
              type="button"
              className="report-detail__close"
              onClick={onClose}
              aria-label="Tutup detail"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="report-detail__body">
            <div className="report-detail__meta">
              <span className="report-detail__category">
                <category.Icon />
                {category.label}
              </span>
              <StatusBadge status={current.status} />
            </div>

            <h2 id={`${id}-title`} className="report-detail__title">
              {current.title}
            </h2>
            <p className="report-detail__desc">{current.description}</p>

            <dl className="report-detail__facts">
              <div>
                <dt>
                  <MapPinIcon /> Lokasi
                </dt>
                <dd>
                  {current.location.address}
                  {hasPoint && (
                    <a
                      href={getOsmLink(current.location)}
                      target="_blank"
                      rel="noreferrer"
                      className="report-detail__map-link"
                    >
                      Lihat di peta <ExternalIcon />
                    </a>
                  )}
                </dd>
              </div>
              <div>
                <dt>
                  <CalendarIcon /> Dikirim
                </dt>
                <dd>{formatDateTime(current.createdAt)}</dd>
              </div>
            </dl>

            {current.duplicateOf && (
              <p className="report-detail__note">
                <LayersIcon />
                {isAdmin ? workflow.duplicateInfo(current.primaryTitle) : ratingCopy.duplicateNote}
              </p>
            )}

            {current.status === "done" && current.resolvedAt && (
              <div className="report-detail__resolved">
                <p className="report-detail__resolved-title">
                  <CheckIcon /> {workflow.doneTitle}
                </p>
                <p className="report-detail__resolved-by">
                  {workflow.doneBy(current.resolvedBy ?? "Admin", formatDateTime(current.resolvedAt))}
                </p>
                {current.resolutionNote && (
                  <p className="report-detail__resolved-note">{current.resolutionNote}</p>
                )}
              </div>
            )}

            <ol className="report-detail__steps" aria-label="Progres laporan">
              {reportSteps.map((step, index) => (
                <li
                  key={step.id}
                  className={[
                    "report-detail__step",
                    index <= activeStep && "is-done",
                    index === activeStep + 1 && "is-next",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={index === activeStep ? "step" : undefined}
                  style={{ "--i": index }}
                >
                  <span className="report-detail__dot" aria-hidden="true" />
                  {step.label}
                </li>
              ))}
            </ol>

            <RatingPanel key={current.id} report={current} />

            <details className="report-detail__history">
              <summary>{workflow.historyTitle}</summary>
              <StatusTimeline history={current.history} />
            </details>

            {isAdmin && (
              <Button
                to={`/dashboard/kelola?id=${current.id}`}
                variant="primary"
                size="sm"
                className="report-detail__manage"
              >
                <ClipboardIcon className="report-detail__manage-icon" />
                {manageReports.openManage}
              </Button>
            )}
          </div>
        </>
      )}
    </Modal>
  )
}
