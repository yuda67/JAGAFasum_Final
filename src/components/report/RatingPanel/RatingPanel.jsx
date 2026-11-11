import { useId, useState } from "react"
import Button from "../../ui/Button/Button"
import StarRating from "../StarRating/StarRating"
import { AlertIcon } from "../../icons/UiIcons"
import useAuth from "../../../hooks/useAuth"
import useToast from "../../../hooks/useToast"
import { rateReport } from "../../../services/reportService"
import { formatDate } from "../../../utils/format"
import { ratingCopy, workflow } from "../../../data/content"
import "./RatingPanel.css"

/** Tampilan rating yang sudah diberikan. */
export function RatingSummary({ rating, compact = false }) {
  return (
    <figure
      className={`rating-summary${compact ? " rating-summary--compact" : ""}`}
    >
      <div className="rating-summary__head">
        <StarRating value={rating.score} size={compact ? "sm" : "md"} />
        <span className="rating-summary__label">
          {ratingCopy.scoreLabels[rating.score - 1]}
        </span>
      </div>
      {rating.comment && (
        <blockquote className="rating-summary__comment">
          “{rating.comment}”
        </blockquote>
      )}
      <figcaption className="rating-summary__by">
        {ratingCopy.ratingBy(rating.by)} · {formatDate(rating.at)}
      </figcaption>
    </figure>
  )
}

/**
 * Bagian rating di detail laporan Resolved.
 * Pelapor (pemilik laporan) bisa menilai sekali; orang lain hanya melihat hasilnya.
 */
export default function RatingPanel({ report }) {
  const id = useId()
  const { user } = useAuth()
  const { show } = useToast()
  const [score, setScore] = useState(0)
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  if (report.status !== "done") return null
  const isOwner = user?.userId === report.userId

  if (report.rating) {
    return (
      <section className="rating-panel" aria-labelledby={`${id}-title`}>
        <h3 id={`${id}-title`} className="rating-panel__title">
          {isOwner ? ratingCopy.yourRating : ratingCopy.title}
        </h3>
        <RatingSummary rating={report.rating} />
      </section>
    )
  }

  if (!isOwner) {
    return <p className="rating-panel__waiting">{workflow.waitingRating}</p>
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!score) {
      setError("Pilih 1 sampai 5 bintang terlebih dahulu.")
      return
    }
    setSaving(true)
    const result = await rateReport(user, report, { score, comment })
    setSaving(false)
    if (!result.ok) {
      setError(result.errors?.score ?? result.formError)
      return
    }
    show(ratingCopy.thanks)
  }

  return (
    <form
      className="rating-panel rating-panel--form"
      onSubmit={handleSubmit}
      aria-labelledby={`${id}-title`}
      noValidate
    >
      <h3 id={`${id}-title`} className="rating-panel__title">
        {ratingCopy.title}
      </h3>
      <p className="rating-panel__lead">{ratingCopy.lead}</p>
      <div className="rating-panel__stars">
        <StarRating
          value={score}
          size="lg"
          label={ratingCopy.title}
          onChange={(value) => {
            setScore(value)
            setError("")
          }}
        />
        <span className="rating-panel__score" aria-live="polite">
          {score ? ratingCopy.scoreLabels[score - 1] : ""}
        </span>
      </div>
      <label htmlFor={`${id}-comment`} className="rating-panel__label">
        {ratingCopy.commentLabel}
      </label>
      <textarea
        id={`${id}-comment`}
        className="rating-panel__textarea"
        rows={3}
        maxLength={400}
        value={comment}
        placeholder={ratingCopy.commentPlaceholder}
        onChange={(event) => setComment(event.target.value)}
      />
      {error && (
        <p className="rating-panel__error" role="alert">
          <AlertIcon />
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" size="sm" loading={saving}>
        {saving ? ratingCopy.submitting : ratingCopy.submit}
      </Button>
    </form>
  )
}
