/*
 * Ikon garis (24×24) untuk area dashboard: menu sidebar, kategori fasilitas,
 * dan aksi form. Warna mengikuti `currentColor`.
 */
const strokeBase = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
}

const icon = (paths) =>
  function StrokeIcon(props) {
    return (
      <svg {...strokeBase} {...props}>
        {paths}
      </svg>
    )
  }

/* ---------- Menu sidebar ---------- */
export const GridIcon = icon(
  <>
    <rect x="3.5" y="3.5" width="7" height="7" rx="2.2" />
    <rect x="13.5" y="3.5" width="7" height="5.5" rx="2.2" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="2.2" />
    <rect x="13.5" y="12" width="7" height="8.5" rx="2.2" />
  </>,
)

export const ReportBubbleIcon = icon(
  <>
    <path d="M5 3.5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5.5L8 21.5v-4H5a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2Z" />
    <path d="M9.6 8.4a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4" />
    <path d="M12 15.1h.01" strokeWidth="2.2" />
  </>,
)

export const DocumentIcon = icon(
  <>
    <path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5Z" />
    <path d="M14 2.5v5h5" />
    <circle cx="9.6" cy="10" r="1.8" />
    <path d="M8 14.5h8M8 17.5h5.5" />
  </>,
)

export const UserIcon = icon(
  <>
    <circle cx="12" cy="7.5" r="4" />
    <path d="M4.5 20.5v-1.3a4.7 4.7 0 0 1 4.7-4.7h5.6a4.7 4.7 0 0 1 4.7 4.7v1.3Z" />
  </>,
)

export const LogoutIcon = icon(
  <>
    <path d="M13 3.5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h7" />
    <path d="M10 12h11M17.5 8l3.8 4-3.8 4" />
  </>,
)

/* ---------- Kategori fasilitas ---------- */
export const RoadIcon = icon(
  <>
    <path d="M8.5 3.5 4 20.5M15.5 3.5l4.5 17" />
    <path d="M12 4v2.5M12 10.5V13M12 17v3" />
  </>,
)

export const TransportIcon = icon(
  <>
    <rect x="4.5" y="3" width="15" height="15" rx="3" />
    <path d="M4.5 11.5h15M9 6h6" />
    <path d="M7.5 18v2.5M16.5 18v2.5" />
    <path d="M8 14.8h.01M16 14.8h.01" strokeWidth="2.4" />
    <path d="M2.5 7.5v3M21.5 7.5v3" />
  </>,
)

export const BuildingIcon = icon(
  <>
    <path d="M3.5 9 12 4l8.5 5" />
    <path d="M3.5 9h17" />
    <path d="M6.5 12v5.5M10 12v5.5M14 12v5.5M17.5 12v5.5" />
    <path d="M3.5 20.5h17M5 18h14" />
  </>,
)

export const WaterIcon = icon(
  <>
    <path d="M3 7.5c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" />
    <path d="M3 12c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" />
    <path d="M3 16.5c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" />
  </>,
)

export const ParkIcon = icon(
  <>
    <path d="M7.5 20.5v-6M7.5 14.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
    <path d="M7.5 16.5 5.5 14.6M7.5 15.5l2-1.6" />
    <path d="m16.5 3.5-3.8 6h2.3l-3 4.5h3l-2.5 3.5h8l-2.5-3.5h3l-3-4.5h2.3Z" />
    <path d="M16.5 17.5v3" />
  </>,
)

export const WrenchIcon = icon(
  <path d="M14.7 6.3a4.2 4.2 0 0 0 5.3 5.3l1-1a5.2 5.2 0 0 1-6.9 4.1l-6.5 6.5a2.1 2.1 0 1 1-3-3l6.5-6.5A5.2 5.2 0 0 1 15.2 3.6l-1 1a4.2 4.2 0 0 0 .5 1.7Z" />,
)

/* ---------- Aksi ---------- */
export const UploadIcon = icon(
  <>
    <path d="M12 15.5V4M7.5 8.5 12 4l4.5 4.5" />
    <path d="M4 15v3.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V15" />
  </>,
)

export const TrashIcon = icon(
  <>
    <path d="M4 6.5h16M9.5 6.5V4.5h5v2M6 6.5l1 13a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5l1-13" />
    <path d="M10 10.5v6M14 10.5v6" />
  </>,
)

export const RefreshIcon = icon(
  <>
    <path d="M20 11.5A8 8 0 0 0 5.6 6.8L4 8.5" />
    <path d="M4 4v4.5h4.5" />
    <path d="M4 12.5a8 8 0 0 0 14.4 4.7L20 15.5" />
    <path d="M20 20v-4.5h-4.5" />
  </>,
)

export const ArrowRightIcon = icon(<path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" />)

export const PlusIcon = icon(<path d="M12 5v14M5 12h14" />)

export const CalendarIcon = icon(
  <>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </>,
)

export const MapPinIcon = icon(
  <>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </>,
)

export const ExternalIcon = icon(
  <>
    <path d="M14 4h6v6M20 4l-8.5 8.5" />
    <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </>,
)

export const SearchIcon = icon(
  <>
    <circle cx="10.5" cy="10.5" r="7" />
    <path d="m15.8 15.8 4.7 4.7" />
  </>,
)

export const PlusCircleIcon = icon(
  <>
    <circle cx="12" cy="12" r="9.25" />
    <path d="M12 7.5v9M7.5 12h9" />
  </>,
)

/* Pin lokasi kartu laporan (kuning muda dengan garis, seperti desain) */
export function LocationPinIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 22"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M8 1.2a5.8 5.8 0 0 0-5.8 5.8c0 4.3 5.8 9.6 5.8 9.6s5.8-5.3 5.8-9.6A5.8 5.8 0 0 0 8 1.2Z"
        fill="var(--pin-fill, #fdebbb)"
        stroke="var(--pin-stroke, #f5cf5e)"
        strokeWidth="1.3"
      />
      <circle cx="8" cy="7" r="2.2" fill="#fff" stroke="var(--pin-stroke, #f5cf5e)" strokeWidth="1.2" />
      <ellipse cx="8" cy="19.4" rx="5.2" ry="1.6" fill="none" stroke="var(--pin-stroke, #f5cf5e)" strokeWidth="1.2" />
    </svg>
  )
}

/* Pintu terbuka untuk pop-up Logout (bentuk padat, warna currentColor) */
export function DoorIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130 148"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="currentColor">
        <path
          className="door__frame"
          d="M76 8h10a14 14 0 0 1 14 14v116h-9V22a5 5 0 0 0-5-5H76Z"
        />
        <path
          className="door__leaf"
          d="M20 13.5 77 6a3 3 0 0 1 3.4 3v127.5a2 2 0 0 1-2.2 2L20 136a2 2 0 0 1-2-2V15.5a2 2 0 0 1 2-2Z"
        />
        <rect x="0" y="136" width="130" height="9" rx="4.5" />
      </g>
      <ellipse
        className="door__knob"
        cx="67"
        cy="77"
        rx="4"
        ry="8"
        fill="var(--door-cutout, #fdebbb)"
      />
    </svg>
  )
}


/* ---------- Area admin ---------- */
export const ShieldIcon = icon(
  <>
    <path d="M12 2.8 4.5 5.6v5.6c0 4.6 3.1 8.7 7.5 10 4.4-1.3 7.5-5.4 7.5-10V5.6Z" />
    <path d="m8.8 12 2.2 2.2 4.3-4.4" />
  </>,
)

export const ClipboardIcon = icon(
  <>
    <rect x="5" y="4" width="14" height="17.5" rx="2.4" />
    <path d="M9 4V3.2c0-.4.3-.7.7-.7h4.6c.4 0 .7.3.7.7V4c0 .8-.7 1.5-1.5 1.5h-3C9.7 5.5 9 4.8 9 4Z" />
    <path d="m8.6 13 2.2 2.2 4.6-4.6" />
  </>,
)

export const LayersIcon = icon(
  <>
    <path d="m12 3 9 4.8-9 4.8-9-4.8Z" />
    <path d="m3 12.2 9 4.8 9-4.8" />
    <path d="m3 16.4 9 4.8 9-4.8" />
  </>,
)

export const StarIcon = icon(
  <path d="m12 3.2 2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9Z" />,
)

export const CameraIcon = icon(
  <>
    <path d="M4.5 7.5h3l1.6-2.5h5.8l1.6 2.5h3a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2Z" />
    <circle cx="12" cy="13.3" r="3.6" />
  </>,
)

export const CheckIcon = icon(<path d="m5 12.5 4.5 4.5L19 7.5" />)

export const PlayIcon = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M10.2 8.6v6.8l5.4-3.4Z" />
  </>,
)

export const MergeIcon = icon(
  <>
    <circle cx="6" cy="5.5" r="2.2" />
    <circle cx="6" cy="18.5" r="2.2" />
    <circle cx="18" cy="12" r="2.2" />
    <path d="M6 7.7v8.6M6 9c0 2.2 1.8 3 4 3h5.8" />
  </>,
)

export const UnlinkIcon = icon(
  <>
    <path d="M9.5 14.5 7.7 16.3a3 3 0 0 1-4.2-4.2l2.6-2.6a3 3 0 0 1 4.2 0" />
    <path d="m14.5 9.5 1.8-1.8a3 3 0 0 1 4.2 4.2l-2.6 2.6a3 3 0 0 1-4.2 0" />
    <path d="M4 4l2 2M18 18l2 2M9 3v2M3 9h2M15 21v-2M21 15h-2" />
  </>,
)

export const ClockIcon = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.2V12l3.2 2" />
  </>,
)

export const AlertTriangleIcon = icon(
  <>
    <path d="M10.3 4.2 2.9 17.4A2 2 0 0 0 4.6 20.4h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9.5v4" />
    <path d="M12 16.9h.01" strokeWidth="2.4" />
  </>,
)

export const CompareIcon = icon(
  <>
    <path d="m8.5 7.5-4.5 4.5 4.5 4.5" />
    <path d="m15.5 7.5 4.5 4.5-4.5 4.5" />
  </>,
)

/* Pemetaan nama → komponen agar data di content.js cukup menyebut nama ikonnya. */
export const NAV_ICONS = {
  grid: GridIcon,
  report: ReportBubbleIcon,
  document: DocumentIcon,
  user: UserIcon,
  logout: LogoutIcon,
  clipboard: ClipboardIcon,
  layers: LayersIcon,
  star: StarIcon,
}

export const CATEGORY_ICONS = {
  road: RoadIcon,
  transport: TransportIcon,
  building: BuildingIcon,
  drainage: WaterIcon,
  park: ParkIcon,
  other: WrenchIcon,
}
