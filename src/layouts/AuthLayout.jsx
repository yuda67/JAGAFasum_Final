import { useState } from "react"
import { Link, Navigate, Outlet, useLocation } from "react-router"
import ImageSlot from "../components/ui/ImageSlot/ImageSlot"
import Logo from "../components/ui/Logo/Logo"
import useAuth from "../hooks/useAuth"
import { getImageUrl } from "../data/images"
import "./AuthLayout.css"

/** Kerangka Login & Register: panel gambar di kiri (tetap), form di kanan (beranimasi). */
export default function AuthLayout() {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()
  // Dicek sekali saat dibuka; setelah login sukses, halaman form yang menavigasi ke dashboard.
  const [alreadySignedIn] = useState(isAuthenticated)

  if (alreadySignedIn) return <Navigate to="/dashboard" replace />

  const hasPhoto = Boolean(getImageUrl("auth"))

  return (
    <div className="auth">
      <div className={`auth__visual${hasPhoto ? " auth__visual--photo" : ""}`}>
        <ImageSlot
          slot="auth"
          tone="auth"
          className="auth__image"
          decorative
          priority
        />
        {hasPhoto && (
          <>
            <div className="auth__tint" aria-hidden="true" />
            <div className="auth__glow" aria-hidden="true" />
          </>
        )}
        <Link
          to="/"
          className="auth__logo logo-link"
          aria-label="JAGAFasum — kembali ke beranda"
        >
          <Logo decorative />
        </Link>
      </div>

      <main className="auth__panel" id="main">
        <div key={pathname} className="auth__panel-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
