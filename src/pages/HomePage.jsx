import Navbar from "../components/layout/Navbar/Navbar"
import Footer from "../components/layout/Footer/Footer"
import Hero from "../components/sections/Hero/Hero"
import FacilityGallery from "../components/sections/FacilityGallery/FacilityGallery"
import ReportFlow from "../components/sections/ReportFlow/ReportFlow"
import Categories from "../components/sections/Categories/Categories"
import About from "../components/sections/About/About"
import useDocumentTitle from "../hooks/useDocumentTitle"
import "./HomePage.css"

export default function HomePage() {
  useDocumentTitle("JAGAFasum")

  return (
    <div className="home">
      <Navbar />
      <main id="main">
        <Hero />
        <section
          className="facilities"
          id="fasilitas"
          aria-labelledby="facilities-title"
        >
          <h2 id="facilities-title" className="u-visually-hidden">
            Fasilitas umum yang bisa dilaporkan
          </h2>
          <FacilityGallery />
          <ReportFlow />
          <Categories />
        </section>
        <About />
      </main>
      <Footer />
    </div>
  )
}
