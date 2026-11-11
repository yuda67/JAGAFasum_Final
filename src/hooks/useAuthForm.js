import { useCallback, useRef, useState } from "react"

/**
 * Logika form bersama untuk Login & Register:
 * nilai field, validasi (saat submit lalu live), fokus ke field yang salah,
 * animasi getar, status loading, dan pesan error tingkat form.
 */
export default function useAuthForm({
  initialValues,
  validate,
  fieldOrder,
  clearOnFormError = [],
}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shaking, setShaking] = useState(false)
  const fieldRefs = useRef({})

  const triggerShake = useCallback(() => {
    setShaking(false)
    requestAnimationFrame(() => setShaking(true))
  }, [])

  const focusField = (name) => {
    if (name) fieldRefs.current[name]?.focus()
  }

  const fieldProps = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    ref: (element) => {
      fieldRefs.current[name] = element
    },
    onChange: (event) => {
      const next = { ...values, [name]: event.target.value }
      setValues(next)
      if (formError) setFormError("")
      if (submitted) setErrors(validate(next))
    },
  })

  const handleSubmit = (action) => async (event) => {
    event.preventDefault()
    if (loading) return

    setSubmitted(true)
    setFormError("")
    const nextErrors = validate(values)
    setErrors(nextErrors)
    const firstInvalid = fieldOrder.find((name) => nextErrors[name])
    if (firstInvalid) {
      focusField(firstInvalid)
      triggerShake()
      return
    }

    setLoading(true)
    const result = await action(values)
    if (result?.ok) return // halaman pemanggil yang menavigasi

    setLoading(false)
    triggerShake()
    if (result?.errors) {
      setErrors(result.errors)
      focusField(fieldOrder.find((name) => result.errors[name]))
    }
    if (result?.formError) {
      setFormError(result.formError)
      if (clearOnFormError.length) {
        setValues((current) => ({
          ...current,
          ...Object.fromEntries(clearOnFormError.map((name) => [name, ""])),
        }))
        focusField(clearOnFormError[0])
      }
    }
  }

  return {
    values,
    formError,
    loading,
    shaking,
    fieldProps,
    handleSubmit,
    stopShaking: () => setShaking(false),
  }
}
