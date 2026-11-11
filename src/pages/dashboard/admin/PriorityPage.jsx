import { useState } from "react"
import { Link } from "react-router"
import Button from "../../../components/ui/Button/Button"
import ConfirmDialog from "../../../components/ui/ConfirmDialog/ConfirmDialog"
import StatusBadge from "../../../components/report/StatusBadge/StatusBadge"
import {
  AlertTriangleIcon,
  CheckIcon,
  LayersIcon,
  MapPinIcon,
  MergeIcon,
} from "../../../components/icons/DashboardIcons"
import { getCategoryMeta } from "../../../components/report/reportMeta"
import { useReportInsights } from "../../../hooks/useReports"
import useReporterNames from "../../../hooks/useReporterNames"
import useAuth from "../../../hooks/useAuth"
import useToast from "../../../hooks/useToast"
import useDocumentTitle from "../../../hooks/useDocumentTitle"
import {
  markNotDuplicate,
  mergeDuplicates,
} from "../../../services/reportService"
import { formatDateTime } from "../../../utils/format"
import { priorityPage as copy } from "../../../data/content"
import "./PriorityPage.css"

function reasonText(links) {
  const gps = links.filter(
    (link) => link.reason === "gps" && link.distance != null,
  )
  if (gps.length) {
    const max = Math.max(...gps.map((link) => link.distance))
    return copy.reasonGps(Math.max(1, Math.round(max)))
  }
  return copy.reasonAddress
}

/** Satu grup laporan terindikasi duplikat: pilih laporan utama lalu gabungkan. */
function ReviewGroup({ group, index, nameOf, onMerge, onDistinct, busy }) {
  const [primaryId, setPrimaryId] = useState(group.suggestedId)
  const category = getCategoryMeta(group.category)
  const anchor =
    group.reports.find((report) => report.id === primaryId) ?? group.reports[0]

  return (
    <article
      className="dup-group"
      style={{ "--i": index }}
      aria-labelledby={`grp-${group.id}`}
    >
      <header className="dup-group__head">
        <span className="dup-group__icon" aria-hidden="true">
          <AlertTriangleIcon />
        </span>
        <div className="dup-group__heading">
          <h3 id={`grp-${group.id}`} className="dup-group__title">
            <category.Icon className="dup-group__cat" />
            {category.label}
            <span className="dup-group__count">
              {copy.reportsCount(group.reports.length)}
            </span>
          </h3>
          <p className="dup-group__where">
            <span className="dup-group__addr">
              <MapPinIcon />
              <span>{anchor.location.address}</span>
            </span>
            <span className="dup-group__reason">{reasonText(group.links)}</span>
          </p>
        </div>
      </header>

      <fieldset className="dup-group__members">
        <legend className="u-visually-hidden">{copy.choosePrimary}</legend>
        {group.reports.map((report) => {
          const chosen = report.id === primaryId
          return (
            <label
              key={report.id}
              className={`dup-member${chosen ? " is-primary" : ""}`}
            >
              <input
                type="radio"
                name={`primary-${group.id}`}
                value={report.id}
                checked={chosen}
                onChange={() => setPrimaryId(report.id)}
                className="u-visually-hidden"
              />
              <span className="dup-member__media">
                <img src={report.photo} alt="" loading="lazy" />
                <span className="dup-member__choice" aria-hidden="true">
                  {chosen ? (
                    <>
                      <CheckIcon /> {copy.primary}
                    </>
                  ) : (
                    copy.choosePrimary
                  )}
                </span>
                {report.id === group.suggestedId && (
                  <span className="dup-member__suggested">
                    {copy.suggested}
                  </span>
                )}
              </span>
              <span className="dup-member__body">
                <span className="dup-member__title">{report.title}</span>
                <span className="dup-member__meta">
                  {nameOf(report.userId)} · {formatDateTime(report.createdAt)}
                </span>
                <span className="dup-member__desc">{report.description}</span>
                <span className="dup-member__foot">
                  <StatusBadge status={report.status} size="sm" />
                  <Link
                    to={`/dashboard/kelola?id=${report.id}`}
                    className="dup-member__link"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Detail
                  </Link>
                </span>
              </span>
            </label>
          )
        })}
      </fieldset>

      <footer className="dup-group__actions">
        <Button
          variant="primary"
          size="sm"
          className="dup-group__merge"
          onClick={() => onMerge(group, primaryId)}
          disabled={busy}
        >
          <MergeIcon className="dup-group__btn-icon" />
          {copy.merge}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDistinct(group)}
          loading={busy === `distinct-${group.id}`}
          disabled={Boolean(busy)}
        >
          {copy.notDuplicate}
        </Button>
      </footer>
    </article>
  )
}

export default function PriorityPage() {
  useDocumentTitle(copy.documentTitle)
  const { user } = useAuth()
  const { show } = useToast()
  const nameOf = useReporterNames()
  const { reviewGroups, mergedGroups } = useReportInsights()
  const [pendingMerge, setPendingMerge] = useState(null)
  const [mergeOpen, setMergeOpen] = useState(false)
  const [busy, setBusy] = useState("")

  const requestMerge = (group, primaryId) => {
    setPendingMerge({
      group,
      primary: group.reports.find((report) => report.id === primaryId),
    })
    setMergeOpen(true)
  }

  const confirmMerge = async () => {
    const { group, primary } = pendingMerge
    const result = await mergeDuplicates(user, primary, group.reports)
    setMergeOpen(false)
    show(result.ok ? copy.merged : result.formError, {
      tone: result.ok ? "success" : "info",
    })
  }

  const handleDistinct = async (group) => {
    setBusy(`distinct-${group.id}`)
    const result = await markNotDuplicate(user, group.reports)
    setBusy("")
    show(result.ok ? copy.notDuplicateDone : result.formError, { tone: "info" })
  }

  return (
    <div className="priority dash-container">
      <header className="priority__header">
        <span className="priority__badge" aria-hidden="true">
          <LayersIcon />
        </span>
        <div>
          <h1 className="dash-title">{copy.title}</h1>
          <p className="dash-lead priority__lead">{copy.lead}</p>
        </div>
      </header>

      <section className="priority__section" aria-labelledby="priority-review">
        <h2 id="priority-review" className="priority__section-title">
          {copy.reviewTitle}
          <span className="priority__pill priority__pill--danger">
            {reviewGroups.length}
          </span>
        </h2>
        {reviewGroups.length ? (
          <div className="priority__groups">
            {reviewGroups.map((group, index) => (
              <ReviewGroup
                key={group.id}
                group={group}
                index={index}
                nameOf={nameOf}
                onMerge={requestMerge}
                onDistinct={handleDistinct}
                busy={busy}
              />
            ))}
          </div>
        ) : (
          <div className="priority__clear">
            <span className="priority__clear-icon" aria-hidden="true">
              <CheckIcon />
            </span>
            <div>
              <p className="priority__clear-title">{copy.reviewEmptyTitle}</p>
              <p>{copy.reviewEmptyBody}</p>
            </div>
          </div>
        )}
      </section>

      <section className="priority__section" aria-labelledby="priority-merged">
        <h2 id="priority-merged" className="priority__section-title">
          {copy.mergedTitle}
          <span className="priority__pill">{mergedGroups.length}</span>
        </h2>
        {mergedGroups.length ? (
          <ul className="priority__merged">
            {mergedGroups.map(({ id, primary, duplicates }) => (
              <li key={id} className="merged-row">
                <span className="merged-row__stack" aria-hidden="true">
                  {[primary, ...duplicates].slice(0, 3).map((report, i) => (
                    <img
                      key={report.id}
                      src={report.photo}
                      alt=""
                      style={{ "--n": i }}
                    />
                  ))}
                </span>
                <span className="merged-row__body">
                  <span className="merged-row__title">{primary.title}</span>
                  <span className="merged-row__meta">
                    <MapPinIcon /> {primary.location.address}
                  </span>
                </span>
                <span className="merged-row__count">
                  {copy.duplicatesOf(duplicates.length)}
                </span>
                <StatusBadge status={primary.status} size="sm" />
                <Button
                  to={`/dashboard/kelola?id=${primary.id}`}
                  variant="outline"
                  size="sm"
                >
                  {copy.manage}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="priority__muted">{copy.mergedEmpty}</p>
        )}
      </section>

      <ConfirmDialog
        open={mergeOpen}
        onCancel={() => setMergeOpen(false)}
        onConfirm={confirmMerge}
        icon={<MergeIcon />}
        title={copy.mergeConfirmTitle}
        body={
          pendingMerge
            ? copy.mergeConfirmBody(
                pendingMerge.primary.title,
                pendingMerge.group.reports.length - 1,
              )
            : ""
        }
        cancelLabel="Batal"
        confirmLabel={copy.mergeConfirm}
        confirmingLabel="Menggabungkan…"
      />
    </div>
  )
}
