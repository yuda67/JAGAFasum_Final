const numberFormatter = new Intl.NumberFormat("en-US")

/** 2245 → "2,245" (format angka sesuai desain). */
export const formatNumber = (value) => numberFormatter.format(value)

export const getFirstName = (name = "") => name.trim().split(/\s+/)[0] ?? ""

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
})
const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})
const relativeFormatter = new Intl.RelativeTimeFormat("id-ID", {
  numeric: "auto",
})

/** "1 November 2026" */
export const formatDate = (iso) => dateFormatter.format(new Date(iso))

/** "1 Nov 2026, 16.41" */
export const formatDateTime = (iso) => dateTimeFormatter.format(new Date(iso))

/** "5 menit yang lalu", "kemarin", dst. */
export function formatRelative(iso, now = Date.now()) {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000)
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ]
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size)
      return relativeFormatter.format(Math.round(seconds / size), unit)
  }
  return "baru saja"
}

/** Salam sesuai jam: pagi / siang / sore / malam. */
export function getDayGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 11) return "Selamat pagi"
  if (hour < 15) return "Selamat siang"
  if (hour < 18) return "Selamat sore"
  return "Selamat malam"
}
