import { useState } from "react"
import { Link } from "react-router"
import Button from "../../ui/Button/Button"
import Logo from "../../ui/Logo/Logo"
import LogoutDialog from "../../dashboard/LogoutDialog/LogoutDialog"
import useAuth from "../../../hooks/useAuth"
import useToast from "../../../hooks/useToast"
import useScrolled from "../../../hooks/useScrolled"
import usePrefersReducedMotion from "../../../hooks/usePrefersReducedMotion"
import { getFirstName, getInitials } from "../../../utils/format"
import { logoutDialog } from "../../../data/content"
import "./Navbar.css"

export default function Navbar() {
  const scrolled = useScrolled(64)
  const reducedMotion = usePrefersReducedMotion()
  const { user, isAuthenticated, logout } = useAuth()
  const { show } = useToast()
  const [logoutOpen, setLogoutOpen] = useState(false)

  const scrollToTop = (event) => {
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })
  }

  const handleLogout = () => {
    setLogoutOpen(false)
    logout()
    show(logoutDialog.toast, { tone: "info" })
  }

  return (
    <header className={`navbar${scrolled ? " is-scrolled" : ""}`}>
      <nav className="navbar__inner" aria-label="Navigasi utama">
        <Link
          to="/"
          className="navbar__brand logo-link"
          aria-label="JAGAFasum — kembali ke atas"
          onClick={scrollToTop}
        >
          <Logo className="navbar__logo" decorative />
        </Link>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="navbar__user"
                aria-label={`Buka dashboard ${user.name}`}
              >
                <span className="navbar__avatar" aria-hidden="true">
                  {getInitials(user.name)}
                </span>
                <span className="navbar__greeting">
                  Halo, {getFirstName(user.name)}
                </span>
              </Link>
              <Button
                variant="glass"
                className="navbar__btn"
                onClick={() => setLogoutOpen(true)}
                aria-haspopup="dialog"
              >
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Button to="/login" variant="soft" className="navbar__btn">
                Login
              </Button>
              <Button to="/register" variant="glass" className="navbar__btn">
                Register
              </Button>
            </>
          )}
        </div>
      </nav>
      <LogoutDialog
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </header>
  )
}
