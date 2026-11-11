/* Pembungkus localStorage yang aman: tidak melempar error bila storage diblokir/rusak. */

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeItem(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // abaikan: storage tidak tersedia
  }
}
