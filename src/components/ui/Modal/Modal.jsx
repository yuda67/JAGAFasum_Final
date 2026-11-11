import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import "./Modal.css"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Pop-up di tengah layar: latar buram, animasi masuk/keluar, tutup dengan Esc
 * atau klik latar, fokus terkunci di dalam dialog lalu dikembalikan saat ditutup.
 */
export default function Modal({
  open,
  onClose,
  titleId,
  descriptionId,
  initialFocusRef,
  dismissible = true,
  size = "sm",
  className = "",
  children,
}) {
  const panelRef = useRef(null)
  const [rendered, setRendered] = useState(open)
  const [closing, setClosing] = useState(false)

  // Sesuaikan state saat `open` berubah (pola render-time, tanpa efek).
  if (open && (!rendered || closing)) {
    setRendered(true)
    setClosing(false)
  }
  if (!open && rendered && !closing) setClosing(true)

  const onCloseRef = useRef(onClose)
  const dismissibleRef = useRef(dismissible)
  useEffect(() => {
    onCloseRef.current = onClose
    dismissibleRef.current = dismissible
  })

  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    const scrollbar = window.innerWidth - root.clientWidth
    root.style.overflow = "hidden"
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`

    const focusTarget = initialFocusRef?.current ?? panelRef.current
    focusTarget?.focus({ preventScroll: true })

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && dismissibleRef.current) {
        event.stopPropagation()
        onCloseRef.current?.()
        return
      }
      if (event.key !== "Tab" || !panelRef.current) return
      const items = [...panelRef.current.querySelectorAll(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      root.style.overflow = previousOverflow
      root.style.paddingRight = ""
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected)
        previouslyFocused.focus({ preventScroll: true })
    }
  }, [open, initialFocusRef])

  if (!rendered) return null

  const handleAnimationEnd = (event) => {
    if (closing && event.target === event.currentTarget) {
      setRendered(false)
      setClosing(false)
    }
  }

  return createPortal(
    <div
      className={`modal${closing ? " is-closing" : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className="modal__backdrop"
        aria-hidden="true"
        onClick={() => dismissible && onClose?.()}
      />
      <div
        ref={panelRef}
        className={`modal__panel modal__panel--${size} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
