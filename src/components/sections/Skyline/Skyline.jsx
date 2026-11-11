import { useMemo, useRef } from "react"
import useInView from "../../../hooks/useInView"
import { SKYLINE_SIZE, skylineBuildings } from "../../../data/skyline"
import "./Skyline.css"

const { width: WIDTH, height: HEIGHT } = SKYLINE_SIZE
const TWINKLE_RATIO = 0.25

// PRNG kecil (mulberry32) supaya pola warna jendela selalu sama di setiap render.
function createRandom(seedText) {
  let seed = 2166136261
  for (const char of seedText)
    seed = Math.imul(seed ^ char.charCodeAt(0), 16777619)
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickTone(value) {
  if (value < 0.15) return "off"
  if (value < 0.38) return "warm"
  if (value < 0.6) return "peach"
  return "mint"
}

function rowPositions(group) {
  if (group.ys) return group.ys
  const rows = []
  for (let y = group.from; y < HEIGHT - 6; y += group.step)
    rows.push(Math.round(y * 10) / 10)
  return rows
}

function buildWindows(building) {
  const random = createRandom(building.id)
  const [width, height] = building.windowSize
  const windows = []

  building.windows.forEach((group) => {
    rowPositions(group).forEach((y, row) => {
      group.xs.forEach((x) => {
        if (group.density && random() > group.density) return
        const tone = group.tones
          ? group.tones[row % group.tones.length]
          : pickTone(random())
        const twinkle = tone !== "off" && random() < TWINKLE_RATIO
        windows.push({
          key: `${x}-${y}`,
          x: x - width / 2,
          y: y - height / 2,
          width,
          height,
          tone,
          style: twinkle
            ? {
                "--tw-delay": `${(random() * 9).toFixed(2)}s`,
                "--tw-duration": `${(6 + random() * 6).toFixed(2)}s`,
              }
            : undefined,
        })
      })
    })
  })

  return windows
}

/** Ilustrasi gedung-gedung kota: tumbuh dari bawah, jendela berkedip, lampu antena berdenyut. */
export default function Skyline({ className = "" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.2 })
  const buildings = useMemo(
    () =>
      skylineBuildings.map((building) => ({
        ...building,
        windowList: buildWindows(building),
      })),
    [],
  )

  return (
    <svg
      ref={ref}
      className={`skyline${inView ? " is-visible" : ""} ${className}`.trim()}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {buildings.map((building, index) => (
        <g
          key={building.id}
          className="skyline__building"
          style={{ "--i": index }}
        >
          {building.rims?.map((points) => (
            <polygon key={points} className="skyline__rim" points={points} />
          ))}
          {building.antenna && (
            <rect
              className="skyline__shape"
              x={building.antenna.x}
              y={building.antenna.top}
              width={building.antenna.width}
              height={building.antenna.base - building.antenna.top + 4}
            />
          )}
          {building.blocks.map((block) => (
            <rect
              key={`${block.x1}-${block.top}`}
              className="skyline__shape"
              x={block.x1}
              y={block.top}
              width={block.x2 - block.x1}
              height={HEIGHT - block.top + 60}
              rx={block.radius}
            />
          ))}
          {building.stripe && (
            <rect
              className="skyline__stripe"
              x={building.stripe.x1}
              y={building.stripe.top}
              width={building.stripe.x2 - building.stripe.x1}
              height={HEIGHT - building.stripe.top + 60}
            />
          )}
          {building.windowList.map((win) => (
            <rect
              key={win.key}
              className={`skyline__window is-${win.tone}${
                win.style ? " is-twinkle" : ""
              }`}
              x={win.x}
              y={win.y}
              width={win.width}
              height={win.height}
              rx="1.5"
              style={win.style}
            />
          ))}
          {building.antenna?.beacon && (
            <rect
              className="skyline__beacon"
              x={building.antenna.x - 1}
              y={building.antenna.top - 1}
              width={building.antenna.width + 2}
              height="10"
              rx="1.5"
            />
          )}
        </g>
      ))}
    </svg>
  )
}
