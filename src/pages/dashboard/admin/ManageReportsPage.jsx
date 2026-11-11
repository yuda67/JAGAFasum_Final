import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router"
import ReportSearch from "../../../components/dashboard/ReportSearch/ReportSearch"
import ReportFilter from "../../../components/dashboard/ReportFilter/ReportFilter"
import StatusBadge from "../../../components/report/StatusBadge/StatusBadge"
import PriorityTag from "../../../components/report/PriorityTag/PriorityTag"
import ReportManagePanel from "../../../components/admin/ReportManagePanel/ReportManagePanel"
import {
  ClipboardIcon,
  SearchIcon,
  StarIcon,
} from "../../../components/icons/DashboardIcons"
import { getCategoryMeta } from "../../../components/report/reportMeta"
import { useReportInsights } from "../../../hooks/useReports"
import useReporterNames from "../../../hooks/useReporterNames"
import useDocumentTitle from "../../../hooks/useDocumentTitle"
import { formatRelative } from "../../../utils/format"
import { manageReports as copy } from "../../../data/content"
import "./ManageReportsPage.css"

const PRIORITY_RANK = { review: 0, merged: 1, duplicate: 3 }
const STATUS_RANK = { pending: 0, progress: 1, done: 2 }
const normalize = (text) => text.toLowerCase().normalize("NFKD")

export default function ManageReportsPage() {
  useDocumentTitle(copy.documentTitle)
  const { reports, priorityById } = useReportInsights()
  const nameOf = useReporterNames()
  const [params, setParams] = useSearchParams()
  const [filter, setFilter] = useState(params.get("filter") ?? "all")
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(normalize(query.trim()))
  const panelRef = useRef(null)

  // Urutan kerja admin: wajib-cek duplikat → prioritas tergabung → Pending → In Progress → Resolved.
  const sorted = useMemo(() => {
    const rank = (report) => {
      const priority = priorityById.get(report.id)
      const p = priority ? PRIORITY_RANK[priority.type] : 2
      return p * 10 + STATUS_RANK[report.status]
    }
    return [...reports].sort(
      (a, b) => rank(a) - rank(b) || b.createdAt.localeCompare(a.createdAt),
    )
  }, [reports, priorityById])

  const counts = {
    all: reports.length,
    priority: reports.filter((report) => {
      const type = priorityById.get(report.id)?.type
      return type === "review" || type === "merged"
    }).length,
    pending: reports.filter((report) => report.status === "pending").length,
    progress: reports.filter((report) => report.status === "progress").length,
    done: reports.filter((report) => report.status === "done").length,
  }

  const visible = sorted.filter((report) => {
    const type = priorityById.get(report.id)?.type
    const passFilter =
      filter === "all" ||
      (filter === "priority"
        ? type === "review" || type === "merged"
        : report.status === filter)
    if (!passFilter) return false
    if (!deferredQuery) return true
    const haystack = normalize(
      `${report.title} ${report.location.address} ${report.description} ${nameOf(report.userId)}`,
    )
    return deferredQuery.split(/\s+/).every((word) => haystack.includes(word))
  })

  const selectedId = params.get("id")
  const selected =
    reports.find((report) => report.id === selectedId) ?? visible[0] ?? null

  const select = (id, { scroll = false } = {}) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        next.set("id", id)
        return next
      },
      { replace: true },
    )
    if (scroll && window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() =>
        panelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      )
    }
  }

  // Panel kembali ke atas saat laporan berganti.
  useEffect(() => {
    panelRef.current?.scrollTo?.({ top: 0 })
  }, [selected?.id])

  const options = Object.entries(copy.filters).map(([id, label]) => ({
    id,
    label: `${label} (${counts[id]})`,
  }))

  return (
    <div className="manage dash-container">
      <header className="manage__header">
        <span className="manage__badge" aria-hidden="true">
          <ClipboardIcon />
        </span>
        <div>
          <h1 className="dash-title">{copy.title}</h1>
          <p className="dash-lead">{copy.lead}</p>
        </div>
      </header>

      <div className="manage__toolbar">
        <ReportSearch
          value={query}
          onChange={setQuery}
          placeholder={copy.searchPlaceholder}
          label={copy.searchLabel}
        />
        <ReportFilter
          options={options}
          value={filter}
          onChange={setFilter}
          className="manage__filters"
        />
      </div>

      <div className="manage__layout">
        <section className="manage__list" aria-label="Daftar laporan">
          <p className="u-visually-hidden" aria-live="polite">
            {visible.length} laporan ditampilkan
          </p>
          {visible.length ? (
            <ul key={`${filter}-${deferredQuery}`} className="manage__rows">
              {visible.map((report, index) => {
                const category = getCategoryMeta(report.category)
                const active = selected?.id === report.id
                return (
                  <li key={report.id} style={{ "--i": Math.min(index, 10) }}>
                    <button
                      type="button"
                      className={`manage-row${active ? " is-active" : ""}`}
                      aria-pressed={active}
                      onClick={() => select(report.id, { scroll: true })}
                    >
                      <img
                        src={report.photo}
                        alt=""
                        className="manage-row__thumb"
                        loading="lazy"
                      />
                      <span className="manage-row__body">
                        <span className="manage-row__top">
                          <span className="manage-row__title">
                            {report.title}
                          </span>
                          <span className="manage-row__time">
                            {formatRelative(report.createdAt)}
                          </span>
                        </span>
                        <span className="manage-row__sub">
                          <category.Icon className="manage-row__cat-icon" />
                          <span className="manage-row__address">
                            {report.location.address}
                          </span>
                        </span>
                        <span className="manage-row__tags">
                          <StatusBadge status={report.status} size="sm" />
                          <PriorityTag info={priorityById.get(report.id)} />
                          {report.rating && (
                            <span className="manage-row__rating">
                              <StarIcon /> {report.rating.score}
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="manage__empty">
              <SearchIcon />
              <p className="manage__empty-title">{copy.emptyTitle}</p>
              <p>{copy.emptyBody}</p>
            </div>
          )}
        </section>

        <aside
          ref={panelRef}
          className="manage__panel"
          aria-label="Detail & tindak lanjut"
        >
          {selected ? (
            <ReportManagePanel
              key={selected.id}
              report={selected}
              priority={priorityById.get(selected.id)}
              reporterName={nameOf(selected.userId)}
              onOpenReport={(id) => select(id)}
            />
          ) : (
            <div className="manage__empty manage__empty--panel">
              <ClipboardIcon />
              <p className="manage__empty-title">{copy.selectTitle}</p>
              <p>{copy.selectBody}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
