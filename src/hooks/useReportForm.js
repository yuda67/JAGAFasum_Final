import { useMemo, useRef, useState } from "react"
import usePrefersReducedMotion from "./usePrefersReducedMotion"
import { validateReport } from "../utils/validation"

export const REPORT_FIELD_ORDER = [
  "photo",
  "title",
  "category",
  "description",
  "location",
]

export const EMPTY_REPORT = {
  photo: null,
  title: "",
  category: "",
  description: "",
  location: { address: "", lat: null, lon: null },
}

/**
 * State form Buat Laporan: nilai, error, dan fokus ke field pertama yang salah.
 * Setelah submit pertama, error diperbarui langsung saat pengguna mengetik.
 */
export default function useReportForm() {
  const reducedMotion = usePrefersReducedMotion()
  const [values, setValues] = useState(EMPTY_REPORT)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const refs = useRef({})

  // Error diturunkan dari nilai (baru tampil setelah submit pertama).
  const errors = useMemo(
    () => (submitted ? validateReport(values) : {}),
    [submitted, values],
  )

  // Updater fungsional: aman dipanggil dari proses async (mis. pencarian lokasi).
  const setField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setFormError("")
  }

  const register = (name) => (node) => {
    refs.current[name] = node
  }

  const focusFirstError = (nextErrors) => {
    const first = REPORT_FIELD_ORDER.find((name) => nextErrors[name])
    const node = first && refs.current[first]
    if (!node) return
    node.scrollIntoView({
      block: "center",
      behavior: reducedMotion ? "auto" : "smooth",
    })
    node.focus({ preventScroll: true })
  }

  const handleSubmit = (onValid) => async (event) => {
    event.preventDefault()
    if (loading) return
    setSubmitted(true)
    const nextErrors = validateReport(values)
    if (Object.keys(nextErrors).length) {
      focusFirstError(nextErrors)
      return
    }
    setLoading(true)
    try {
      const result = await onValid(values)
      if (result && !result.ok) setFormError(result.formError ?? "")
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setValues(EMPTY_REPORT)
    setSubmitted(false)
    setFormError("")
  }

  const isDirty =
    values.photo ||
    values.title ||
    values.category ||
    values.description ||
    values.location.address

  return {
    values,
    errors,
    loading,
    formError,
    isDirty: Boolean(isDirty),
    setField,
    register,
    handleSubmit,
    reset,
  }
}
