import { Link } from "react-router"
import Button from "../components/ui/Button/Button"
import Logo from "../components/ui/Logo/Logo"
import useDocumentTitle from "../hooks/useDocumentTitle"
import "./NotFoundPage.css"

export default function NotFoundPage() {
  useDocumentTitle("Halaman tidak ditemukan — JAGAFasum")

  return (
    <main className="not-found" id="main">
      <Link
        to="/"
        className="not-found__logo logo-link"
        aria-label="JAGAFasum — kembali ke beranda"
      >
        <Logo decorative />
      </Link>
      <p className="not-found__code" aria-hidden="true">
        404
      </p>
      <h1 className="not-found__title">
        Halaman yang kamu cari tidak ditemukan.
      </h1>
      <div className="not-found__action">
        <Button to="/" variant="soft" className="not-found__btn">
          Kembali ke Beranda
        </Button>
      </div>
    </main>
  )
}
