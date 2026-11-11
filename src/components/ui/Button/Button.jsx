import { Link } from "react-router"
import "./Button.css"

/**
 * Tombol serbaguna.
 * variant: 'soft' (Login di hero) | 'glass' (Register) | 'solid' (submit form auth)
 *          'primary' | 'outline' | 'danger' | 'lime' (area dashboard; ukuran via size)
 * size: 'md' | 'sm' (hanya untuk varian dashboard)
 * Memakai <Link> bila ada `to`, <a> bila ada `href`, selain itu <button>.
 */
export default function Button({
  to,
  href,
  variant = "soft",
  size,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  children,
  ...rest
}) {
  const classes = [
    "btn",
    `btn--${variant}`,
    size && `btn--${size}`,
    loading && "is-loading", className]
    .filter(Boolean)
    .join(" ")
  const content = (
    <>
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <span className="btn__label">{children}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  )
}
