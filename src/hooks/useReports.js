import { useMemo, useSyncExternalStore } from "react"
import {
  getAllReports,
  getAllUpdates,
  subscribeReports,
} from "../services/reportService"
import { buildReports } from "../services/reportModel"
import { analyzeDuplicates } from "../utils/duplicates"
import { dummyReports } from "../data/dummyReports"

const newestFirst = (a, b) => b.createdAt.localeCompare(a.createdAt)

/** Semua laporan efektif (laporan dummy + laporan di browser ini + pembaruan admin/pelapor). */
function useAllReports() {
  const stored = useSyncExternalStore(subscribeReports, getAllReports)
  const updates = useSyncExternalStore(subscribeReports, getAllUpdates)
  return useMemo(
    () => buildReports([...stored, ...dummyReports], updates).sort(newestFirst),
    [stored, updates],
  )
}

/** Daftar laporan milik pengguna, terbaru lebih dulu; otomatis ter-update. */
export default function useReports(userId) {
  const all = useAllReports()
  return useMemo(
    () => all.filter((report) => report.userId === userId),
    [all, userId],
  )
}

/** Semua laporan warga (laporan dummy + laporan yang dikirim di browser ini). */
export function useCommunityReports() {
  return useAllReports()
}

/** Laporan + hasil analisis duplikat (grup prioritas) untuk area admin. */
export function useReportInsights() {
  const reports = useAllReports()
  const insights = useMemo(() => analyzeDuplicates(reports), [reports])
  return { reports, ...insights }
}
