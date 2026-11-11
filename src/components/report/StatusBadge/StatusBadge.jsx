import { getStatusLabel } from "../reportMeta"
import "./StatusBadge.css"

/** Badge status laporan: kapsul berwarna penuh dengan teks putih (sesuai desain). size: "md" | "sm" */
export default function StatusBadge({ status = "pending", size = "md", className = "" }) {
  return (
    <span
      className={`status-badge status-badge--${status}${size === "sm" ? " status-badge--sm" : ""} ${className}`.trim()}
    >
      {getStatusLabel(status)}
    </span>
  )
}
