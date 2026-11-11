import { useDeferredValue, useState } from "react"
import { Link } from "react-router"
import Logo from "../../components/ui/Logo/Logo"
import DashStat from "../../components/dashboard/DashStat/DashStat"
import ReportSearch from "../../components/dashboard/ReportSearch/ReportSearch"
import ReportFilter from "../../components/dashboard/ReportFilter/ReportFilter"
import ReportCard, { CardTags } from "../../components/report/ReportCard/ReportCard"
import ReportDetailDialog from "../../components/report/ReportDetailDialog/ReportDetailDialog"
import AdminDeleteDialog from "../../components/admin/AdminDeleteDialog/AdminDeleteDialog"
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  ClipboardIcon,
  PlusCircleIcon,
  SearchIcon,
} from "../../components/icons/DashboardIcons"
import { useReportInsights } from "../../hooks/useReports"
import useAuth from "../../hooks/useAuth"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import {
  adminHome,
  brand,
  dashboardHome,
  dashboardStats,
  reportStatuses,
} from "../../data/content"
import "./DashboardHomePage.css"

const FILTERS = [
  { id: "all", label: dashboardHome.filterAll },
  ...Object.entries(reportStatuses).map(([id, status]) => ({
    id,
    label: status.label,
  })),
]

const normalize = (text) => text.toLowerCase().normalize("NFKD")

function matchesQuery(report, query) {
  if (!query) return true
  const haystack = normalize(
    `${report.title} ${report.location.address} ${report.description}`,
  )
  return query
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

export default function DashboardHomePage() {
  useDocumentTitle("Dashboard — JAGAFasum")
  const { isAdmin } = useAuth()
  const { reports, reviewGroups, priorityById } = useReportInsights()
  const [filter, setFilter] = useState("all")
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(normalize(query.trim()))
  // Simpan id (bukan objek) agar detail selalu memakai data terbaru (mis. setelah memberi rating).
  const [openId, setOpenId] = useState(null)
  const openReport = reports.find((report) => report.id === openId) ?? null
  const [deleteTarget, setDeleteTarget] = useState(null)

  const visible = reports.filter(
    (report) =>
      (filter === "all" || report.status === filter) &&
      matchesQuery(report, deferredQuery),
  )
  const countFor = (status) =>
    reports.filter((report) => report.status === status).length

  const resetFilters = () => {
    setFilter("all")
    setQuery("")
  }

  return (
    <div className="dhome">
      <section className="dhome__hero">
        <div className="dhome__stage">
          {/* Dekorasi: garis krem di kanan & batang kuning diagonal */}
          <div className="dhome__stripes" aria-hidden="true" />
          <span className="dhome__bar dhome__bar--1" aria-hidden="true" />
          <span className="dhome__bar dhome__bar--2" aria-hidden="true" />
          <span className="dhome__bar dhome__bar--3" aria-hidden="true" />
          <span className="dhome__bar dhome__bar--4" aria-hidden="true" />

          <div className="dhome__inner">
            <header className="dhome__header">
              <Link
                to="/"
                className="dhome__brand logo-link"
                aria-label="JAGAFasum — ke halaman utama"
              >
                <Logo className="dhome__logo" decorative />
                <span className="dhome__wordmark">{brand.name}</span>
              </Link>
              <h1 className="u-visually-hidden">Dashboard laporan</h1>
            </header>

            <div className="dhome__cta-row">
              {isAdmin ? (
                <Link to="/dashboard/kelola" className="dhome__cta dhome__cta--admin">
                  <ClipboardIcon className="dhome__cta-icon" />
                  {adminHome.cta}
                </Link>
              ) : (
                <Link to="/dashboard/buat-laporan" className="dhome__cta">
                  <PlusCircleIcon className="dhome__cta-icon" />
                  {dashboardHome.cta}
                </Link>
              )}
            </div>

            <p className="dhome__banner">{isAdmin ? adminHome.banner : dashboardHome.banner}</p>

            {isAdmin && reviewGroups.length > 0 && (
              <Link to="/dashboard/prioritas" className="dhome__alert">
                <span className="dhome__alert-icon" aria-hidden="true">
                  <AlertTriangleIcon />
                </span>
                <span className="dhome__alert-text">
                  <strong>{adminHome.alertTitle(reviewGroups.length)}</strong>
                  <span>{adminHome.alertBody}</span>
                </span>
                <span className="dhome__alert-cta">
                  {adminHome.alertCta}
                  <ArrowRightIcon />
                </span>
              </Link>
            )}

            <ul className="dhome__stats" aria-label="Ringkasan laporan">
              {dashboardStats.map((stat, index) => (
                <DashStat
                  key={stat.id}
                  label={stat.label}
                  value={countFor(stat.status)}
                  tone={stat.id}
                  index={index}
                  active={filter === stat.status}
                  onClick={() =>
                    setFilter((current) =>
                      current === stat.status ? "all" : stat.status,
                    )
                  }
                />
              ))}
            </ul>

            <div className="dhome__toolbar">
              <ReportSearch
                value={query}
                onChange={setQuery}
                placeholder={dashboardHome.searchPlaceholder}
                label={dashboardHome.searchLabel}
              />
              <ReportFilter options={FILTERS} value={filter} onChange={setFilter} />
            </div>
          </div>
        </div>
      </section>

      <section className="dhome__list" aria-label="Daftar laporan">
        <div className="dhome__stage">
          <p className="u-visually-hidden" aria-live="polite">
            {visible.length} laporan ditampilkan
          </p>
          {visible.length ? (
            <ul key={`${filter}-${deferredQuery}`} className="dhome__grid">
              {visible.map((report, index) => (
                <li key={report.id} style={{ "--i": Math.min(index, 8) }}>
                  <ReportCard
                    report={report}
                    onOpen={(target) => setOpenId(target.id)}
                    // Admin boleh menghapus laporan dalam status apa pun (dengan validasi).
                    onDelete={isAdmin ? setDeleteTarget : undefined}
                    tag={
                      <CardTags
                        report={report}
                        priority={isAdmin ? priorityById.get(report.id) : null}
                      />
                    }
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="dhome__empty">
              <span className="dhome__empty-icon" aria-hidden="true">
                <SearchIcon />
              </span>
              <p className="dhome__empty-title">{dashboardHome.noResultTitle}</p>
              <p className="dhome__empty-body">{dashboardHome.noResultBody}</p>
              <button type="button" className="dhome__empty-btn" onClick={resetFilters}>
                {dashboardHome.noResultReset}
              </button>
            </div>
          )}
        </div>
      </section>

      <ReportDetailDialog report={openReport} onClose={() => setOpenId(null)} />
      {isAdmin && (
        <AdminDeleteDialog report={deleteTarget} onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  )
}
