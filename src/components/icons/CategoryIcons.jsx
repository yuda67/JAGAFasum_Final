/*
 * Ikon kategori (Bis, Lalu lintas, Trotoar, Kereta Api) dibuat ulang dari desain.
 * Bentuk putih memakai `currentColor`; "lubang" memperlihatkan warna lingkaran.
 * Kelas di dalamnya dipakai untuk animasi hover (lihat Categories.css).
 */
import { useId } from "react"

const svgBase = {
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": "true",
  focusable: "false",
}

const join = (...classes) => classes.filter(Boolean).join(" ")

export function BusIcon({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={join("category-icon icon-bus", className)}
      {...svgBase}
      {...props}
    >
      <g className="icon-bus__body" fill="currentColor">
        <path
          d="M16 25h-4.5a3 3 0 0 0-3 3v1M103 25h4.5a3 3 0 0 1 3 3v1"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="5.5" y="28" width="7" height="23" rx="3" />
        <rect x="107.5" y="28" width="7" height="23" rx="3" />
        <rect x="22.5" y="95" width="15" height="15" rx="3" />
        <rect x="82.5" y="95" width="15" height="15" rx="3" />
        <path
          fillRule="evenodd"
          d="M30 5h59c7.7 0 14 6.3 14 14v73a7 7 0 0 1-7 7H23a7 7 0 0 1-7-7V19c0-7.7 6.3-14 14-14Zm13 4.5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h34a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H43ZM27.5 22a3 3 0 0 0-3 3v37a10 10 0 0 0 10 10h51a10 10 0 0 0 10-10V25a3 3 0 0 0-3-3h-65Z"
        />
        <path
          className="icon-bus__light"
          d="M23 79c7.5 1.2 15.5 4.6 21 10.5-6.5 2.2-15.5 1.6-21-1.5Z"
        />
        <path
          className="icon-bus__light"
          d="M97 79c-7.5 1.2-15.5 4.6-21 10.5 6.5 2.2 15.5 1.6 21-1.5Z"
        />
      </g>
    </svg>
  )
}

const LAMP_CENTERS = [20, 46, 72]
const LAMP_COLORS = ["red", "yellow", "green"]
const TRAFFIC_HOUSING =
  "M50 4h20a9 9 0 0 1 9 9v66a9 9 0 0 1-9 9H50a9 9 0 0 1-9-9V13a9 9 0 0 1 9-9Z" +
  LAMP_CENTERS.map(
    (cy) => `M49.5 ${cy}a10.5 10.5 0 1 0 21 0a10.5 10.5 0 1 0-21 0Z`,
  ).join("")

export function TrafficLightIcon({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={join("category-icon icon-traffic", className)}
      {...svgBase}
      {...props}
    >
      <g fill="currentColor">
        {LAMP_CENTERS.map((cy) => (
          <path
            key={cy}
            d={`M41 ${cy - 11}H29.6a2.2 2.2 0 0 0-1.7 3.6L37.6 ${cy + 6.6}c.8 1 2 1.4 3.4 1.4ZM79 ${cy - 11}h11.4a2.2 2.2 0 0 1 1.7 3.6L82.4 ${cy + 6.6}c-.8 1-2 1.4-3.4 1.4Z`}
          />
        ))}
        <path fillRule="evenodd" d={TRAFFIC_HOUSING} />
        <rect x="56" y="87" width="8" height="20" />
        <rect x="50.5" y="105" width="19" height="5" rx="1.2" />
        <rect x="45.5" y="109" width="29" height="7.5" rx="2" />
      </g>
      {LAMP_CENTERS.map((cy, index) => (
        <circle
          key={cy}
          className={`icon-traffic__lamp icon-traffic__lamp--${LAMP_COLORS[index]}`}
          cx="60"
          cy={cy}
          r="8.6"
        />
      ))}
    </svg>
  )
}

// Figur outline dibuat dengan dua lapis garis: putih tebal lalu krem tipis di atasnya.
const WALKER_TORSO = "M63 21 64 58"
const WALKER_LIMBS =
  "M60 28 47 40l-11 5M67 28l13 10 6 12M62 60l-11 16-3 20M66 60l11 16 12 20"

export function PedestrianIcon({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={join("category-icon icon-ped", className)}
      {...svgBase}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 74h33M88 74h33" />
        <path d="M9.5 81h109v22.5H101M92 103.5H9.5V81" />
      </g>
      <g
        className="icon-ped__walker"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={WALKER_TORSO} stroke="currentColor" strokeWidth="18" />
        <path d={WALKER_LIMBS} stroke="currentColor" strokeWidth="13" />
        <path d={WALKER_TORSO} stroke="var(--c-circle)" strokeWidth="11" />
        <path d={WALKER_LIMBS} stroke="var(--c-circle)" strokeWidth="6" />
        <circle
          cx="57"
          cy="5.5"
          r="9.3"
          stroke="currentColor"
          strokeWidth="3.4"
        />
      </g>
    </svg>
  )
}

const TRAIN_BODY =
  "M41 2h39c7.7 0 14 6.3 14 14v58a6 6 0 0 1-6 6H33a6 6 0 0 1-6-6V16c0-7.7 6.3-14 14-14Z" +
  "M53.5 5a1.5 1.5 0 0 0-1.5 1.5v2a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5v-2A1.5 1.5 0 0 0 67.5 5h-14Z" +
  "M37 13a4 4 0 0 0-4 4v22h26.5V13H37ZM62.5 13v26H88V17a4 4 0 0 0-4-4H62.5Z" +
  "M33.9 53.5a4.6 4.6 0 1 0 9.2 0a4.6 4.6 0 1 0-9.2 0ZM77.9 53.5a4.6 4.6 0 1 0 9.2 0a4.6 4.6 0 1 0-9.2 0Z" +
  "M35 68.5h50v3H35Z"

export function TrainIcon({ className, ...props }) {
  const clipId = `train-track-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  return (
    <svg
      viewBox="0 0 120 120"
      className={join("category-icon icon-train", className)}
      {...svgBase}
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M30 87h60l36 36H-6Z" />
        </clipPath>
      </defs>
      <g className="icon-train__body" fill="currentColor">
        <path fillRule="evenodd" d={TRAIN_BODY} />
        <path d="M32 79.5h56l-3 5H35Z" />
      </g>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M37 88 13 120M83 88l24 32" strokeWidth="3.6" />
        <g clipPath={`url(#${clipId})`}>
          <path
            className="icon-train__sleepers"
            d="M-10 83.5h140M-10 91h140M-10 98.5h140M-10 106h140M-10 113.5h140M-10 121h140"
            strokeWidth="3.2"
          />
        </g>
      </g>
    </svg>
  )
}
