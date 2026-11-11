import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ToastContext } from "./toast-context"
import ToastViewport from "../components/ui/Toast/ToastViewport"

const MAX_VISIBLE = 3
const EXIT_DURATION = 260
let nextToastId = 0

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Set())

  const schedule = useCallback((callback, delay) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer)
      callback()
    }, delay)
    timers.current.add(timer)
  }, [])

  const dismiss = useCallback(
    (id) => {
      setToasts((list) =>
        list.map((toast) =>
          toast.id === id ? { ...toast, leaving: true } : toast,
        ),
      )
      schedule(
        () => setToasts((list) => list.filter((toast) => toast.id !== id)),
        EXIT_DURATION,
      )
    },
    [schedule],
  )

  const show = useCallback(
    (message, { tone = "success", duration = 3500 } = {}) => {
      nextToastId += 1
      const id = nextToastId
      setToasts((list) => [
        ...list.slice(-(MAX_VISIBLE - 1)),
        { id, message, tone, leaving: false },
      ])
      schedule(() => dismiss(id), duration)
      return id
    },
    [dismiss, schedule],
  )

  useEffect(() => {
    const activeTimers = timers.current
    return () => activeTimers.forEach(clearTimeout)
  }, [])

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss])

  return (
    <ToastContext value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext>
  )
}
