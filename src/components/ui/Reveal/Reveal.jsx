import { useRef } from "react"
import useInView from "../../../hooks/useInView"
import "./Reveal.css"

/**
 * Memunculkan konten dengan animasi saat masuk viewport.
 * variant: 'fade-up' | 'slide-left' | 'pop'; delay dalam milidetik.
 */
export default function Reveal({
  as: Tag = "div",
  variant = "fade-up",
  delay = 0,
  className = "",
  style,
  children,
  ...rest
}) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const classes = [
    "reveal",
    `reveal--${variant}`,
    inView && "is-visible",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
