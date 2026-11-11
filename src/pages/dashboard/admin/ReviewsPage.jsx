import { Link } from "react-router"
import StarRating from "../../../components/report/StarRating/StarRating"
import {
  ClockIcon,
  CheckIcon,
  MapPinIcon,
  StarIcon,
} from "../../../components/icons/DashboardIcons"
import { useCommunityReports } from "../../../hooks/useReports"
import useDocumentTitle from "../../../hooks/useDocumentTitle"
import { formatDate } from "../../../utils/format"
import { ratingCopy, reviewsPage as copy } from "../../../data/content"
import "./ReviewsPage.css"

const DAY = 86_400_000

export default function ReviewsPage() {
  useDocumentTitle(copy.documentTitle)
  const reports = useCommunityReports()
  const resolved = reports.filter((report) => report.status === "done")
  const rated = resolved
    .filter((report) => report.rating)
    .sort((a, b) => b.rating.at.localeCompare(a.rating.at))

  const average = rated.length
    ? rated.reduce((sum, report) => sum + report.rating.score, 0) / rated.length
    : 0
  const distribution = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: rated.filter((report) => report.rating.score === score).length,
  }))
  const durations = resolved
    .filter((report) => report.resolvedAt)
    .map(
      (report) =>
        (new Date(report.resolvedAt) - new Date(report.createdAt)) / DAY,
    )
  const avgDays = durations.length
    ? durations.reduce((sum, days) => sum + days, 0) / durations.length
    : null

  const kpis = [
    {
      id: "resolved",
      label: copy.resolved,
      value: resolved.length,
      Icon: CheckIcon,
    },
    {
      id: "waiting",
      label: copy.waiting,
      value: resolved.length - rated.length,
      Icon: StarIcon,
    },
    {
      id: "duration",
      label: copy.avgDuration,
      value: avgDays == null ? "—" : copy.durationDays(avgDays),
      Icon: ClockIcon,
    },
  ]

  return (
    <div className="reviews dash-container">
      <header className="reviews__header">
        <span className="reviews__badge" aria-hidden="true">
          <StarIcon />
        </span>
        <div>
          <h1 className="dash-title">{copy.title}</h1>
          <p className="dash-lead">{copy.lead}</p>
        </div>
      </header>

      <section className="reviews__summary" aria-label="Ringkasan kinerja">
        <div className="reviews__score">
          <p className="reviews__score-label">{copy.average}</p>
          <p className="reviews__score-value">
            {rated.length ? average.toFixed(1).replace(".", ",") : "—"}
            <span>/5</span>
          </p>
          <StarRating value={average} size="lg" />
          <p className="reviews__score-total">{copy.total(rated.length)}</p>
        </div>

        <ul className="reviews__bars" aria-label="Sebaran rating">
          {distribution.map(({ score, count }, index) => (
            <li key={score} style={{ "--i": index }}>
              <span className="reviews__bar-label">
                {score} <StarIcon />
              </span>
              <span className="reviews__bar-track">
                <span
                  className="reviews__bar-fill"
                  style={{ "--w": rated.length ? count / rated.length : 0 }}
                />
              </span>
              <span className="reviews__bar-count">{count}</span>
            </li>
          ))}
        </ul>

        <ul className="reviews__kpis">
          {kpis.map(({ id, label, value, Icon }) => (
            <li key={id} className={`reviews__kpi reviews__kpi--${id}`}>
              <span className="reviews__kpi-icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="reviews__kpi-value">{value}</span>
              <span className="reviews__kpi-label">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="reviews-list">
        <h2 id="reviews-list" className="reviews__list-title">
          {copy.listTitle}
        </h2>
        {rated.length ? (
          <ul className="reviews__list">
            {rated.map((report, index) => (
              <li
                key={report.id}
                className="review-card"
                style={{ "--i": Math.min(index, 8) }}
              >
                <div className="review-card__photos">
                  <figure>
                    <img
                      src={report.beforePhoto ?? report.photo}
                      alt={`Before: ${report.title}`}
                      loading="lazy"
                    />
                    <figcaption>Before</figcaption>
                  </figure>
                  <figure>
                    <img
                      src={report.afterPhoto ?? report.photo}
                      alt={`After: ${report.title}`}
                      loading="lazy"
                    />
                    <figcaption className="is-after">After</figcaption>
                  </figure>
                </div>
                <div className="review-card__body">
                  <div className="review-card__top">
                    <StarRating value={report.rating.score} size="sm" />
                    <span className="review-card__label">
                      {ratingCopy.scoreLabels[report.rating.score - 1]}
                    </span>
                  </div>
                  <Link
                    to={`/dashboard/kelola?id=${report.id}`}
                    className="review-card__title"
                  >
                    {report.title}
                  </Link>
                  <p className="review-card__where">
                    <MapPinIcon /> {report.location.address}
                  </p>
                  {report.rating.comment && (
                    <blockquote className="review-card__comment">
                      “{report.rating.comment}”
                    </blockquote>
                  )}
                  <p className="review-card__by">
                    {report.rating.by} · {formatDate(report.rating.at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="reviews__empty">
            <StarIcon />
            <p className="reviews__empty-title">{copy.emptyTitle}</p>
            <p>{copy.emptyBody}</p>
          </div>
        )}
      </section>
    </div>
  )
}
