import { useRef } from "react"
import ImageSlot from "../../ui/ImageSlot/ImageSlot"
import { ImageIcon } from "../../icons/UiIcons"
import StatCard from "./StatCard"
import useParallax from "../../../hooks/useParallax"
import { useCommunityReports } from "../../../hooks/useReports"
import { hero, statDetails, stats } from "../../../data/content"
import { IMAGE_SLOTS, getImageUrl } from "../../../data/images"
import "./Hero.css"

export default function Hero() {
  const mediaRef = useRef(null)
  useParallax(mediaRef, { factor: 0.25 })
  // Petunjuk wadah gambar hanya saat development & selama foto hero belum ada.
  const showSlotHint = import.meta.env.DEV && !getImageUrl("hero")

  // Angka statistik mengikuti kondisi laporan di website (otomatis ter-update).
  const reports = useCommunityReports()
  const cases = reports.filter((report) => !report.duplicateOf)
  const repairs = cases.filter((report) => report.status === "done").length
  const count = (status) => reports.filter((report) => report.status === status).length
  const values = { reports: reports.length, repairs }
  const details = reports.length
    ? {
        reports: statDetails.reports({ pending: count("pending"), progress: count("progress") }),
        repairs: statDetails.repairs({
          percent: cases.length ? Math.round((repairs / cases.length) * 100) : 0,
        }),
      }
    : { reports: statDetails.empty, repairs: statDetails.empty }

  return (
    <section className="hero" id="beranda" aria-labelledby="hero-title">
      <div className="hero__media" ref={mediaRef}>
        <ImageSlot
          slot="hero"
          tone="hero"
          className="hero__image"
          decorative
          priority
          showHint={false}
        />
      </div>
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            {hero.title}
          </h1>
          <h2 className="hero__welcome">
            {hero.welcome.before}
            <span className="hero__accent">{hero.welcome.highlight}</span>
          </h2>
          <p className="hero__lead">{hero.lead}</p>
        </div>

        <div className="hero__stats">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={values[stat.id]}
              detail={details[stat.id]}
              index={index}
            />
          ))}
        </div>
      </div>

      {showSlotHint && (
        <p className="hero__slot-hint">
          <ImageIcon className="hero__slot-hint-icon" />
          <span>
            <strong>{IMAGE_SLOTS.hero.label}</strong> ·
            src/assets/images/hero.jpg · {IMAGE_SLOTS.hero.size}
          </span>
        </p>
      )}
    </section>
  )
}
