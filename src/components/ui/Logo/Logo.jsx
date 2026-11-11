import { getImageUrl } from "../../../data/images"
import "./Logo.css"

/** Logo JAGAFasum (SVG bawaan); otomatis memakai file slot `logo` bila tersedia. */
export default function Logo({
  className = "",
  decorative = false,
  title = "JAGAFasum",
}) {
  const customLogo = getImageUrl("logo")
  const classes = `logo ${className}`.trim()

  if (customLogo) {
    return (
      <img
        className={classes}
        src={customLogo}
        alt={decorative ? "" : title}
        draggable="false"
      />
    )
  }

  return (
    <svg
      className={classes}
      viewBox="0 0 91 83"
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? "true" : undefined}
      focusable="false"
    >
      <path
        className="logo__shape"
        d="M0 0H72.5A18 18 0 0 1 90.5 18V23.5A18 18 0 0 1 72.5 41.5H0Z"
      />
      <path
        className="logo__shape"
        d="M18 41.5H90.5V83H18A18 18 0 0 1 0 65V59.5A18 18 0 0 1 18 41.5Z"
      />
      <g className="logo__dashes logo__dashes--top">
        <rect x="9" y="18.5" width="22" height="4.5" rx="2.25" />
        <rect x="46" y="18.5" width="22" height="4.5" rx="2.25" />
      </g>
      <g className="logo__dashes logo__dashes--bottom">
        <rect x="17" y="60.5" width="22" height="4.5" rx="2.25" />
        <rect x="57" y="60.5" width="22" height="4.5" rx="2.25" />
      </g>
    </svg>
  )
}
