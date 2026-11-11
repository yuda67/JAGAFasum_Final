import { useRef } from "react"
import useInView from "../../../hooks/useInView"
import { reportSteps } from "../../../data/content"
import "./ReportFlow.css"

// Panah putus-putus antar langkah, dalam koordinat viewBox 1180 × 121.
const ARROWS = [
  { line: "M114 69V83Q114 93 124 93H216", head: "M209 87 216 93 209 99" },
  { line: "M352 53V38Q352 28 362 28H456", head: "M449 22 456 28 449 34" },
  { line: "M590 69V83Q590 93 600 93H692", head: "M685 87 692 93 685 99" },
  { line: "M828 53V38Q828 28 838 28H932", head: "M925 22 932 28 925 34" },
]

export default function ReportFlow() {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.35 })

  return (
    <div ref={ref} className={`flow${inView ? " is-visible" : ""}`}>
      <svg
        className="flow__arrows"
        viewBox="0 0 1180 121"
        aria-hidden="true"
        focusable="false"
      >
        {ARROWS.map((arrow, index) => (
          <g key={arrow.line} className="flow__arrow" style={{ "--i": index }}>
            <path className="flow__arrow-line" d={arrow.line} />
            <path className="flow__arrow-head" d={arrow.head} />
          </g>
        ))}
      </svg>

      <ol className="flow__steps" aria-label="Alur pelaporan">
        {reportSteps.map((step, index) => (
          <li
            key={step.id}
            className="flow__step"
            style={{ "--col": index, "--row": index % 2 }}
          >
            <button
              type="button"
              className="flow__pill"
              aria-describedby={`flow-tip-${step.id}`}
            >
              {step.label}
            </button>
            <span
              id={`flow-tip-${step.id}`}
              role="tooltip"
              className={`flow__tooltip flow__tooltip--${
                index % 2 ? "below" : "above"
              }`}
            >
              {step.description}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
