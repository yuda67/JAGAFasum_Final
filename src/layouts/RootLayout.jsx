import { Outlet, ScrollRestoration, useLocation } from "react-router"
import "./RootLayout.css"

// Grup halaman: transisi hanya diputar saat berpindah grup, sehingga
// Login ↔ Register tidak me-render ulang panel gambar di kiri, dan
// sidebar dashboard tetap di tempat saat berpindah menu.
function getRouteGroup(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/"
  if (path === "/") return "home"
  if (path === "/login" || path === "/register") return "auth"
  if (path === "/dashboard" || path.startsWith("/dashboard/")) return "dashboard"
  return "other"
}

export default function RootLayout() {
  const { pathname } = useLocation()

  return (
    <>
      <div key={getRouteGroup(pathname)} className="page-transition">
        <Outlet />
      </div>
      <ScrollRestoration />
    </>
  )
}
