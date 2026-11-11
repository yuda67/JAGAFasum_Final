import { Navigate, Outlet, useOutletContext } from "react-router"
import useAuth from "../../hooks/useAuth"

/** Rute khusus admin: warga diarahkan kembali ke beranda dashboard. */
export function AdminOnly() {
  const context = useOutletContext()
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return <Outlet context={context} />
}

/** Rute khusus warga (Buat Laporan, Laporan Saya): admin diarahkan ke Kelola Laporan. */
export function CitizenOnly() {
  const context = useOutletContext()
  const { isAdmin } = useAuth()
  if (isAdmin) return <Navigate to="/dashboard/kelola" replace />
  return <Outlet context={context} />
}
