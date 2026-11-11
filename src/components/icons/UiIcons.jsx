/* Ikon UI kecil berbentuk SVG inline. Warna mengikuti `currentColor`. */
const svgBase = {
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": "true",
  focusable: "false",
}

export function MailIcon(props) {
  return (
    <svg viewBox="0 0 52 36" {...svgBase} {...props}>
      <rect width="52" height="36" rx="4.5" fill="currentColor" />
      <path
        d="M4.5 5.5 26 21.5 47.5 5.5"
        fill="none"
        stroke="var(--icon-cutout, #76a466)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PhoneIcon(props) {
  return (
    <svg viewBox="2.6 2.2 20.2 20.2" {...svgBase} {...props}>
      <path
        fill="currentColor"
        d="M6.2 2.6 9.4 2.9c.6.1 1 .5 1.1 1.1l.6 3.6c.1.6-.1 1.1-.6 1.4l-1.9 1.3c1.3 2.7 3.3 4.8 6.1 6.1l1.3-1.9c.3-.5.9-.7 1.4-.6l3.6.6c.6.1 1 .5 1.1 1.1l.3 3.2c.1 1.1-.8 2.1-1.9 2.1C10.9 20.6 3.4 13.1 3.1 3.5c0-.6.5-1 1.1-1Z"
      />
      <path
        d="M14.6 3.4a6.4 6.4 0 0 1 6 6M14.2 7a2.9 2.9 0 0 1 2.8 2.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function PinIcon(props) {
  return (
    <svg viewBox="0 0 36 56" {...svgBase} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M18 2C9.7 2 3 8.7 3 17c0 11 15 27 15 27s15-16 15-27C33 8.7 26.3 2 18 2Zm0 21.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"
      />
      <ellipse
        cx="18"
        cy="48.5"
        rx="14"
        ry="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  )
}

export function EyeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...svgBase}
      {...props}
    >
      <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function EyeOffIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...svgBase}
      {...props}
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A9.6 9.6 0 0 1 12 5c6 0 9.5 7 9.5 7a17.6 17.6 0 0 1-2.7 3.6M6.5 6.5C3.9 8.2 2.5 12 2.5 12S6 19 12 19c1.7 0 3.2-.5 4.5-1.2" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  )
}

export function ImageIcon(props) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...svgBase}
      {...props}
    >
      <rect x="6" y="9" width="36" height="30" rx="6" />
      <circle cx="17" cy="19" r="3.5" />
      <path d="m8 34 10-10 7 7 5-5 10 10" />
    </svg>
  )
}

export function CheckCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...svgBase} {...props}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="m7.5 12.3 3 3 6-6.3"
        fill="none"
        stroke="var(--icon-cutout, #2f6a20)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function InfoCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...svgBase} {...props}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M12 11v5.5"
        stroke="var(--icon-cutout, #2f6a20)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7.6" r="1.4" fill="var(--icon-cutout, #2f6a20)" />
    </svg>
  )
}

export function AlertIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...svgBase}
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5h.01" strokeWidth="2.6" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...svgBase}
      {...props}
    >
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  )
}
