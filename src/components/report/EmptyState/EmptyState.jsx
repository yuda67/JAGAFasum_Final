import Button from "../../ui/Button/Button"
import { DocumentIcon, PlusIcon } from "../../icons/DashboardIcons"
import "./EmptyState.css"

/** Tampilan saat belum ada laporan. */
export default function EmptyState({ title, body, cta, to = "/dashboard/buat-laporan", compact = false }) {
  return (
    <div className={`empty-state${compact ? " empty-state--compact" : ""}`}>
      <span className="empty-state__icon" aria-hidden="true">
        <DocumentIcon />
      </span>
      <p className="empty-state__title">{title}</p>
      <p className="empty-state__body">{body}</p>
      {cta && (
        <Button to={to} variant="primary" size="sm" className="empty-state__cta">
          <PlusIcon className="empty-state__plus" />
          {cta}
        </Button>
      )}
    </div>
  )
}
