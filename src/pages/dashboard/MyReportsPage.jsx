import { useState } from "react"
import { useLocation, useOutletContext } from "react-router"
import ReportCard, { CardTags } from "../../components/report/ReportCard/ReportCard"
import ReportDetailDialog from "../../components/report/ReportDetailDialog/ReportDetailDialog"
import EmptyState from "../../components/report/EmptyState/EmptyState"
import ConfirmDialog from "../../components/ui/ConfirmDialog/ConfirmDialog"
import Button from "../../components/ui/Button/Button"
import ReportFilter from "../../components/dashboard/ReportFilter/ReportFilter"
import { PlusIcon, TrashIcon } from "../../components/icons/DashboardIcons"
import useReports from "../../hooks/useReports"
import useToast from "../../hooks/useToast"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import { deleteReport } from "../../services/reportService"
import { myReports, reportStatuses } from "../../data/content"
import "./MyReportsPage.css"

const FILTERS = [
  { id: "all", label: myReports.filterAll },
  ...Object.entries(reportStatuses).map(([id, status]) => ({
    id,
    label: status.label,
  })),
]

export default function MyReportsPage() {
  useDocumentTitle("Laporan Saya — JAGAFasum")
  const { user } = useOutletContext()
  const { state } = useLocation()
  const { show } = useToast()
  const reports = useReports(user.userId)
  const [filter, setFilter] = useState("all")
  // Simpan id agar detail selalu memakai data terbaru (status/rating berubah saat dialog terbuka).
  const [openId, setOpenId] = useState(null)
  const openReport = reports.find((report) => report.id === openId) ?? null
  // Target hapus disimpan terpisah dari status buka agar teks tetap ada saat dialog menutup.
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const visible =
    filter === "all" ? reports : reports.filter((report) => report.status === filter)
  const countFor = (id) =>
    id === "all" ? reports.length : reports.filter((report) => report.status === id).length

  const confirmDelete = () => {
    deleteReport(user.userId, pendingDelete.id)
    setDeleteOpen(false)
    show(myReports.deleted, { tone: "info" })
  }

  return (
    <div className="my-reports dash-container">
      <header className="my-reports__header">
        <div>
          <h1 className="dash-title">{myReports.title}</h1>
          <p className="dash-lead">{myReports.lead}</p>
        </div>
        {reports.length > 0 && (
          <Button to="/dashboard/buat-laporan" variant="primary" size="sm" className="my-reports__new">
            <PlusIcon className="my-reports__plus" />
            {myReports.cta}
          </Button>
        )}
      </header>

      {reports.length > 0 && (
        <ReportFilter
          className="my-reports__filters"
          options={FILTERS.map((item) => ({
            ...item,
            label: `${item.label} (${countFor(item.id)})`,
          }))}
          value={filter}
          onChange={setFilter}
        />
      )}

      {visible.length ? (
        <ul key={filter} className="my-reports__grid">
          {visible.map((report, index) => (
            <li key={report.id} style={{ "--i": index }}>
              <ReportCard
                report={report}
                highlighted={state?.highlight === report.id}
                onOpen={(target) => setOpenId(target.id)}
                tag={<CardTags report={report} ratingNudge />}
                // Laporan yang sudah ditangani admin tidak bisa dihapus (menjaga riwayat & rating).
                onDelete={
                  report.status === "pending" && !report.duplicateOf
                    ? (target) => {
                        setPendingDelete(target)
                        setDeleteOpen(true)
                      }
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={myReports.emptyTitle}
          body={myReports.emptyBody}
          cta={myReports.cta}
        />
      )}

      <ReportDetailDialog report={openReport} onClose={() => setOpenId(null)} />
      <ConfirmDialog
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        tone="danger"
        icon={<TrashIcon />}
        title="Hapus laporan ini?"
        body={
          pendingDelete
            ? `“${pendingDelete.title}” akan dihapus permanen dari browser ini.`
            : ""
        }
        cancelLabel="Batal"
        confirmLabel={myReports.delete}
      />
    </div>
  )
}
