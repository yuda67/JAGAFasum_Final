import { useRef, useState } from "react"
import { Link } from "react-router"
import Button from "../../ui/Button/Button"
import StatusBadge from "../../report/StatusBadge/StatusBadge"
import PriorityTag from "../../report/PriorityTag/PriorityTag"
import BeforeAfter from "../../report/BeforeAfter/BeforeAfter"
import StatusTimeline from "../../report/StatusTimeline/StatusTimeline"
import { RatingSummary } from "../../report/RatingPanel/RatingPanel"
import AdminPhotoField from "../AdminPhotoField/AdminPhotoField"
import AdminDeleteDialog from "../AdminDeleteDialog/AdminDeleteDialog"
import { AlertIcon } from "../../icons/UiIcons"
import {
  AlertTriangleIcon,
  CalendarIcon,
  CheckIcon,
  ExternalIcon,
  LayersIcon,
  MapPinIcon,
  PlayIcon,
  TrashIcon,
  UnlinkIcon,
  UserIcon,
} from "../../icons/DashboardIcons"
import { getCategoryMeta, getStatusLabel } from "../../report/reportMeta"
import useAuth from "../../../hooks/useAuth"
import useToast from "../../../hooks/useToast"
import {
  advanceReportStatus,
  splitDuplicate,
  STATUS_ORDER,
} from "../../../services/reportService"
import { getOsmLink } from "../../../services/locationService"
import { formatDate, formatDateTime } from "../../../utils/format"
import { adminDelete, workflow } from "../../../data/content"
import "./ReportManagePanel.css"

/** Tiga tahap status dengan tanggal masing-masing. */
function StatusStepper({ report }) {
  const current = STATUS_ORDER.indexOf(report.status)
  const dates = {
    pending: report.createdAt,
    progress: report.startedAt,
    done: report.resolvedAt,
  }
  return (
    <ol className="manage-stepper" aria-label="Tahap pengerjaan">
      {STATUS_ORDER.map((status, index) => (
        <li
          key={status}
          className={[
            "manage-stepper__step",
            `manage-stepper__step--${status}`,
            index <= current && "is-done",
            index === current && "is-current",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-current={index === current ? "step" : undefined}
        >
          <span className="manage-stepper__dot" aria-hidden="true">
            {index < current || (status === "done" && index === current) ? (
              <CheckIcon />
            ) : (
              index + 1
            )}
          </span>
          <span className="manage-stepper__label">
            {getStatusLabel(status)}
          </span>
          <span className="manage-stepper__date">
            {index <= current && dates[status]
              ? formatDate(dates[status])
              : "—"}
          </span>
        </li>
      ))}
    </ol>
  )
}

/** Form aksi berikutnya: Pending → In Progress, atau In Progress → Resolved. */
function WorkflowForm({ report, blocked }) {
  const { user } = useAuth()
  const { show } = useToast()
  const afterRef = useRef(null)
  const [beforePhoto, setBeforePhoto] = useState(null)
  const [afterPhoto, setAfterPhoto] = useState(null)
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)

  const finishing = report.ownStatus === "progress"
  const Icon = finishing ? CheckIcon : PlayIcon

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (blocked || saving) return
    if (finishing && !afterPhoto) {
      setErrors({
        afterPhoto:
          "Unggah foto after (hasil pengerjaan) sebelum menandai Resolved.",
      })
      afterRef.current?.focus()
      return
    }
    setSaving(true)
    setFormError("")
    const result = await advanceReportStatus(user, report, {
      note,
      beforePhoto,
      afterPhoto,
    })
    setSaving(false)
    if (!result.ok) {
      setErrors(result.errors ?? {})
      setFormError(result.formError ?? "")
      if (result.errors?.afterPhoto) afterRef.current?.focus()
      return
    }
    show(result.status === "done" ? workflow.toastDone : workflow.toastProgress)
  }

  return (
    <form
      className={`manage-form${finishing ? " manage-form--finish" : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="manage-form__head">
        <span className="manage-form__icon" aria-hidden="true">
          <Icon />
        </span>
        <div>
          <h4 className="manage-form__title">
            {finishing ? workflow.finishTitle : workflow.startTitle}
          </h4>
          <p className="manage-form__hint">
            {finishing ? workflow.finishHint : workflow.startHint}
          </p>
        </div>
      </div>

      <div className={`manage-form__photos${finishing ? " is-pair" : ""}`}>
        <AdminPhotoField
          label={workflow.beforeLabel}
          hint={workflow.beforeHint}
          value={beforePhoto}
          fallback={report.beforePhoto ?? report.photo}
          onChange={setBeforePhoto}
          tone="before"
        />
        {finishing && (
          <AdminPhotoField
            ref={afterRef}
            label={workflow.afterLabel}
            hint={workflow.afterHint}
            value={afterPhoto}
            onChange={(value) => {
              setAfterPhoto(value)
              setErrors({})
            }}
            error={errors.afterPhoto}
            required
            tone="after"
          />
        )}
      </div>

      <label className="manage-form__label" htmlFor={`note-${report.id}`}>
        {finishing ? workflow.noteFinish : workflow.noteStart}
        <span className="admin-photo__optional">({workflow.optional})</span>
      </label>
      <textarea
        id={`note-${report.id}`}
        className="manage-form__textarea"
        rows={2}
        maxLength={300}
        value={note}
        placeholder={
          finishing
            ? workflow.noteFinishPlaceholder
            : workflow.noteStartPlaceholder
        }
        onChange={(event) => setNote(event.target.value)}
      />

      {formError && (
        <p className="report-error" role="alert">
          <AlertIcon />
          {formError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="sm"
        className={`manage-form__submit manage-form__submit--${
          finishing ? "done" : "progress"
        }`}
        loading={saving}
        disabled={blocked}
      >
        <Icon className="manage-form__submit-icon" />
        {saving
          ? workflow.saving
          : finishing
            ? workflow.finishCta
            : workflow.startCta}
      </Button>
    </form>
  )
}

/**
 * Panel kelola satu laporan (khusus admin): foto, info pelapor, peringatan duplikat,
 * aksi status dengan foto before/after, rating, dan riwayat.
 */
export default function ReportManagePanel({
  report,
  priority,
  reporterName,
  onOpenReport,
}) {
  const { user } = useAuth()
  const { show } = useToast()
  const category = getCategoryMeta(report.category)
  const hasPoint = report.location.lat != null && report.location.lon != null
  const blocked = priority?.type === "review"
  const isDuplicate = Boolean(report.duplicateOf)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleSplit = () => {
    const result = splitDuplicate(user, report)
    if (result.ok) show(workflow.splitDone, { tone: "info" })
  }

  return (
    <article className="manage-panel" aria-labelledby={`manage-${report.id}`}>
      <div className="manage-panel__media">
        {report.afterPhoto ? (
          <BeforeAfter
            before={report.beforePhoto ?? report.photo}
            after={report.afterPhoto}
            title={report.title}
            className="manage-panel__compare"
          />
        ) : (
          <img
            src={report.beforePhoto ?? report.photo}
            alt={`Foto laporan: ${report.title}`}
            className="manage-panel__img"
          />
        )}
      </div>

      <div className="manage-panel__body">
        <div className="manage-panel__meta">
          <span className="manage-panel__category">
            <category.Icon />
            {category.label}
          </span>
          <StatusBadge status={report.status} size="sm" />
          <PriorityTag info={priority} />
        </div>

        <h2 id={`manage-${report.id}`} className="manage-panel__title">
          {report.title}
        </h2>

        <dl className="manage-panel__facts">
          <div>
            <dt>
              <UserIcon /> {workflow.reporter}
            </dt>
            <dd>{reporterName}</dd>
          </div>
          <div>
            <dt>
              <CalendarIcon /> {workflow.submitted}
            </dt>
            <dd>{formatDateTime(report.createdAt)}</dd>
          </div>
          <div className="manage-panel__fact--wide">
            <dt>
              <MapPinIcon /> Lokasi
            </dt>
            <dd>
              {report.location.address}
              {hasPoint && (
                <a
                  href={getOsmLink(report.location)}
                  target="_blank"
                  rel="noreferrer"
                  className="manage-panel__map"
                >
                  Lihat di peta <ExternalIcon />
                </a>
              )}
            </dd>
          </div>
        </dl>

        <p className="manage-panel__desc">{report.description}</p>

        {blocked && (
          <div className="manage-alert manage-alert--danger" role="note">
            <AlertTriangleIcon className="manage-alert__icon" />
            <div>
              <p>{workflow.blockedReview}</p>
              <Link to="/dashboard/prioritas" className="manage-alert__link">
                {workflow.blockedReviewCta}
              </Link>
            </div>
          </div>
        )}
        {isDuplicate && (
          <div className="manage-alert" role="note">
            <LayersIcon className="manage-alert__icon" />
            <div>
              <p>{workflow.duplicateInfo(report.primaryTitle)}</p>
              <div className="manage-alert__actions">
                <button
                  type="button"
                  className="manage-alert__link"
                  onClick={() => onOpenReport?.(report.duplicateOf)}
                >
                  {workflow.openPrimary}
                </button>
                {report.status !== "done" && (
                  <button
                    type="button"
                    className="manage-alert__link manage-alert__link--muted"
                    onClick={handleSplit}
                  >
                    <UnlinkIcon /> {workflow.split}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {!isDuplicate &&
          report.duplicateIds.length > 0 &&
          report.status !== "done" && (
            <div className="manage-alert manage-alert--amber" role="note">
              <LayersIcon className="manage-alert__icon" />
              <p>{workflow.mergedInfo(report.duplicateIds.length)}</p>
            </div>
          )}

        <section
          className="manage-panel__section"
          aria-label={workflow.sectionTitle}
        >
          <h3 className="manage-panel__heading">{workflow.sectionTitle}</h3>
          <StatusStepper report={report} />

          {!isDuplicate && report.ownStatus !== "done" && (
            <WorkflowForm
              key={`${report.id}-${report.ownStatus}`}
              report={report}
              blocked={blocked}
            />
          )}

          {report.status === "done" && (
            <div className="manage-done">
              <p className="manage-done__title">
                <CheckIcon /> {workflow.doneTitle}
              </p>
              <p className="manage-done__by">
                {workflow.doneBy(
                  report.resolvedBy ?? "Admin",
                  formatDateTime(report.resolvedAt),
                )}
              </p>
              {report.resolutionNote && (
                <p className="manage-done__note">{report.resolutionNote}</p>
              )}
              <div className="manage-done__rating">
                {report.rating ? (
                  <RatingSummary rating={report.rating} />
                ) : (
                  <p className="manage-done__waiting">
                    {workflow.waitingRating}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        <section
          className="manage-panel__section"
          aria-label={workflow.historyTitle}
        >
          <h3 className="manage-panel__heading">{workflow.historyTitle}</h3>
          <StatusTimeline history={report.history} />
        </section>

        <section className="manage-danger" aria-label={adminDelete.dangerTitle}>
          <div>
            <h3 className="manage-danger__title">{adminDelete.dangerTitle}</h3>
            <p className="manage-danger__body">{adminDelete.dangerBody}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="manage-danger__btn"
            onClick={() => setDeleteTarget(report)}
            aria-haspopup="dialog"
          >
            <TrashIcon className="manage-danger__icon" />
            {adminDelete.button}
          </Button>
        </section>
      </div>

      <AdminDeleteDialog
        report={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </article>
  )
}
