import { AlertTriangleIcon, LayersIcon } from "../../icons/DashboardIcons"
import { priorityTag } from "../../../data/content"
import "./PriorityTag.css"

/**
 * Penanda prioritas duplikat.
 * info = { type: "review" | "merged" | "duplicate", size }
 */
export default function PriorityTag({ info, className = "" }) {
  if (!info) return null
  const Icon = info.type === "duplicate" ? LayersIcon : AlertTriangleIcon
  const label =
    info.type === "review"
      ? `${priorityTag.review} (${info.size})`
      : info.type === "merged"
        ? priorityTag.merged(info.size)
        : priorityTag.duplicate

  return (
    <span
      className={`priority-tag priority-tag--${info.type} ${className}`.trim()}
    >
      <Icon className="priority-tag__icon" />
      {label}
    </span>
  )
}
