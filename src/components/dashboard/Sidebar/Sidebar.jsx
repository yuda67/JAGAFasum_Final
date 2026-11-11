import { Link, NavLink } from "react-router"
import Logo from "../../ui/Logo/Logo"
import { NAV_ICONS } from "../../icons/DashboardIcons"
import { useReportInsights } from "../../../hooks/useReports"
import { adminNav, dashboardNav, logoutNav } from "../../../data/content"
import "./Sidebar.css"

/**
 * Sidebar hijau: logo + menu navigasi + tombol Keluar (membuka pop-up).
 * Admin mendapat menu sendiri, dengan badge jumlah grup duplikat yang wajib dicek.
 */
export default function Sidebar({ role = "citizen", onLogout }) {
  const LogoutIcon = NAV_ICONS[logoutNav.icon]
  const isAdmin = role === "admin"
  const nav = isAdmin ? adminNav : dashboardNav
  const { reviewGroups } = useReportInsights()
  const badges = { priority: isAdmin ? reviewGroups.length : 0 }

  return (
    <aside className="sidebar">
      <Link
        to="/"
        className="sidebar__brand logo-link"
        aria-label="JAGAFasum — ke halaman utama"
      >
        <Logo decorative />
      </Link>

      {isAdmin && <span className="sidebar__role">Admin</span>}

      <nav className="sidebar__nav" aria-label="Menu dashboard">
        <ul className="sidebar__list">
          {nav.map((item, index) => {
            const Icon = NAV_ICONS[item.icon]
            const badge = item.badge ? badges[item.badge] : 0
            return (
              <li
                key={item.id}
                className="sidebar__item"
                style={{ "--i": index }}
              >
                <NavLink
                  to={item.to}
                  end={item.end}
                  className="sidebar__btn"
                  aria-label={badge ? `${item.label} (${badge} perlu dicek)` : item.label}
                >
                  <Icon className="sidebar__icon" />
                  <span className="sidebar__label">
                    <span className="sidebar__label-full">{item.label}</span>
                    {/* Label ringkas untuk bar navigasi bawah di HP */}
                    <span className="sidebar__label-short" aria-hidden="true">
                      {item.short ?? item.label}
                    </span>
                  </span>
                  {badge > 0 && (
                    <span className="sidebar__badge" aria-hidden="true">
                      {badge}
                    </span>
                  )}
                </NavLink>
              </li>
            )
          })}
          <li
            className="sidebar__item sidebar__item--logout"
            style={{ "--i": nav.length }}
          >
            <button
              type="button"
              className="sidebar__btn sidebar__btn--logout"
              onClick={onLogout}
              aria-label={logoutNav.label}
              aria-haspopup="dialog"
            >
              <LogoutIcon className="sidebar__icon" />
              <span className="sidebar__label">{logoutNav.label}</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
