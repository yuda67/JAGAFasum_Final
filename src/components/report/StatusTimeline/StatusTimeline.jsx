import { getStatusLabel } from "../reportMeta"
import { formatDateTime } from "../../../utils/format"
import "./StatusTimeline.css"

/** Riwayat perubahan status: siapa, kapan, dan catatannya (terbaru di atas). */
export default function StatusTimeline({ history = [], className = "" }) {
  const entries = [...history].reverse()
  return (
    <ol className={`status-timeline ${className}`.trim()}>
      {entries.map((entry, index) => (
        <li
          key={`${entry.status}-${entry.at}-${index}`}
          className={`status-timeline__item status-timeline__item--${entry.status}`}
          style={{ "--i": index }}
        >
          <span className="status-timeline__dot" aria-hidden="true" />
          <div className="status-timeline__content">
            <p className="status-timeline__head">
              <strong>{getStatusLabel(entry.status)}</strong>
              <time dateTime={entry.at}>{formatDateTime(entry.at)}</time>
            </p>
            {entry.by && <p className="status-timeline__by">oleh {entry.by}</p>}
            {entry.note && (
              <p className="status-timeline__note">{entry.note}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
