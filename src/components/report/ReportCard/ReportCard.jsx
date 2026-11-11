import StatusBadge from "../StatusBadge/StatusBadge"
import PriorityTag from "../PriorityTag/PriorityTag"
import { LocationPinIcon, StarIcon, TrashIcon } from "../../icons/DashboardIcons"
import { beforeAfter, dashboardHome, ratingCopy } from "../../../data/content"
import "./ReportCard.css"

/** Kartu laporan (desain dashboard): foto, judul, lokasi, deskripsi, status. `tag` = penanda di pojok foto. */
export default function ReportCard({
  report,
  highlighted = false,
  tag,
  onOpen,
  onDelete,
  style,
}) {
  return (
    <article
      className={`report-card${highlighted ? " is-highlighted" : ""}`}
      style={style}
    >
      <button
        type="button"
        className="report-card__hit"
        onClick={() => onOpen?.(report)}
        aria-label={`Lihat detail laporan: ${report.title}`}
      />
      <div className="report-card__media">
        <img
          src={report.photo}
          alt=""
          className="report-card__img"
          loading="lazy"
          decoding="async"
        />
        {tag && <span className="report-card__tag">{tag}</span>}
      </div>

      <div className="report-card__body">
        <h3 className="report-card__title">{report.title}</h3>
        <p className="report-card__location">
          <LocationPinIcon className="report-card__pin" />
          <span>{report.location.address}</span>
        </p>
        <p className="report-card__desc">{report.description}</p>
        <p className="report-card__status">
          <span>{dashboardHome.statusLabel}</span>
          <StatusBadge status={report.status} />
        </p>
      </div>

      {onDelete && (
        <button
          type="button"
          className="report-card__delete"
          onClick={() => onDelete(report)}
          aria-label={`Hapus laporan: ${report.title}`}
        >
          <TrashIcon />
        </button>
      )}
    </article>
  )
}

/**
 * Penanda kartu: prioritas duplikat (admin), ajakan rating (pelapor),
 * dan "Before/After" bila foto hasil pengerjaan sudah ada.
 */
export function CardTags({ report, priority, ratingNudge = false }) {
  const items = []
  if (priority) items.push(<PriorityTag key="priority" info={priority} />)
  if (ratingNudge && report.status === "done" && !report.rating)
    items.push(
      <span key="rate" className="report-card__nudge">
        <StarIcon /> {ratingCopy.needsRating}
      </span>,
    )
  else if (report.afterPhoto)
    items.push(
      <span key="ba" className="report-card__compare">
        {beforeAfter.before} / {beforeAfter.after}
      </span>,
    )
  return items.length ? <>{items}</> : null
}
