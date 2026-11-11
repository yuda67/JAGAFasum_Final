/*
 * Lokasi pengguna: koordinat dari Geolocation API browser, lalu diubah menjadi
 * alamat lewat OpenStreetMap (Nominatim). Bila izin GPS diblokir (mis. saat
 * situs dibuka di dalam iframe/preview), dipakai perkiraan lokasi dari jaringan.
 */
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"
const BIGDATACLOUD_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client"
const IP_LOCATION_URL = "https://get.geojs.io/v1/ip/geo.json"

const GEO_ERRORS = {
  1: "Izin lokasi ditolak. Aktifkan izin lokasi di browser, atau ketik alamat secara manual.",
  2: "Lokasi tidak dapat ditentukan. Pastikan GPS/layanan lokasi aktif.",
  3: "Waktu pencarian lokasi habis. Coba lagi.",
}

function geoError(code) {
  const error = new Error(GEO_ERRORS[code] ?? "Gagal mendapatkan lokasi.")
  error.code = code
  return error
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator) || !window.isSecureContext) {
      reject(geoError(1))
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({
          lat: coords.latitude,
          lon: coords.longitude,
          accuracy: coords.accuracy,
          approximate: false,
        }),
      (error) => reject(geoError(error.code)),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    )
  })
}

/** Perkiraan lokasi dari alamat IP (tingkat kota) — cadangan bila GPS tidak bisa dipakai. */
export async function getApproximatePosition(signal) {
  const response = await fetch(IP_LOCATION_URL, { signal })
  if (!response.ok) throw new Error("Perkiraan lokasi tidak tersedia.")
  const data = await response.json()
  const lat = Number.parseFloat(data.latitude)
  const lon = Number.parseFloat(data.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lon))
    throw new Error("Perkiraan lokasi tidak tersedia.")
  return { lat, lon, accuracy: null, approximate: true }
}

/** GPS lebih dulu; bila ditolak/tidak tersedia, pakai perkiraan lokasi jaringan. */
export async function locateUser(signal) {
  try {
    return await getCurrentPosition()
  } catch (gpsError) {
    if (gpsError.code === 3) throw gpsError
    try {
      return await getApproximatePosition(signal)
    } catch (err) {
      if (err.name === "AbortError") throw err
      throw gpsError
    }
  }
}

/** Susun alamat ringkas (jalan, kelurahan, kecamatan, kota) dari hasil Nominatim. */
function formatNominatim(data) {
  const a = data.address ?? {}
  const parts = [
    [a.road, a.house_number].filter(Boolean).join(" "),
    a.neighbourhood ?? a.hamlet,
    a.village ?? a.suburb ?? a.quarter,
    a.city_district ?? a.district ?? a.subdistrict,
    a.city ?? a.town ?? a.county ?? a.municipality,
    a.state,
  ].filter(Boolean)
  const unique = [...new Set(parts)]
  return unique.length ? unique.join(", ") : (data.display_name ?? "")
}

async function reverseWithNominatim({ lat, lon }, signal) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lon),
    zoom: "18",
    addressdetails: "1",
    "accept-language": "id",
  })
  const response = await fetch(`${NOMINATIM_URL}?${params}`, {
    signal,
    headers: { Accept: "application/json" },
  })
  if (!response.ok) throw new Error("Layanan peta sedang sibuk.")
  return formatNominatim(await response.json())
}

async function reverseWithBigDataCloud({ lat, lon }, signal) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    localityLanguage: "id",
  })
  const response = await fetch(`${BIGDATACLOUD_URL}?${params}`, { signal })
  if (!response.ok) throw new Error("Layanan peta sedang sibuk.")
  const data = await response.json()
  const parts = [
    data.locality,
    data.city,
    data.principalSubdivision,
  ].filter(Boolean)
  return [...new Set(parts)].join(", ")
}

/** Koordinat → alamat. Nominatim (OpenStreetMap) lebih dulu, BigDataCloud sebagai cadangan. */
export async function reverseGeocode(point, signal) {
  try {
    const address = await reverseWithNominatim(point, signal)
    if (address) return address
  } catch (err) {
    if (err.name === "AbortError") throw err
  }
  return reverseWithBigDataCloud(point, signal)
}

export const formatCoords = ({ lat, lon }) =>
  `${lat.toFixed(5)}, ${lon.toFixed(5)}`

export function getOsmEmbedUrl({ lat, lon }, span = 0.004) {
  const bbox = [lon - span, lat - span * 0.6, lon + span, lat + span * 0.6]
    .map((value) => value.toFixed(6))
    .join(",")
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(6)},${lon.toFixed(6)}`
}

export const getOsmLink = ({ lat, lon }) =>
  `https://www.openstreetmap.org/?mlat=${lat.toFixed(6)}&mlon=${lon.toFixed(6)}#map=18/${lat.toFixed(6)}/${lon.toFixed(6)}`
