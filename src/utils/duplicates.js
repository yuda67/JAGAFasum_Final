/*
 * Deteksi laporan duplikat: kategori fasilitas SAMA dan lokasi SAMA, yaitu
 *   (a) titik GPS berjarak ≤ DUPLICATE_RADIUS_M, ATAU
 *   (b) alamat mirip (kata-kata penting alamat hampir sama).
 * Hanya laporan yang belum selesai yang dikelompokkan, karena laporan Resolved
 * sudah ditutup. Pasangan yang ditandai admin "Bukan duplikat" diabaikan.
 */
export const DUPLICATE_RADIUS_M = 150

// Kata umum di alamat yang tidak membedakan lokasi.
const GENERIC_WORDS = new Set([
  "jl",
  "jln",
  "jalan",
  "gg",
  "gang",
  "no",
  "nomor",
  "rt",
  "rw",
  "kel",
  "kec",
  "kelurahan",
  "kecamatan",
  "kota",
  "kab",
  "kabupaten",
  "dki",
  "jakarta",
  "selatan",
  "utara",
  "barat",
  "timur",
  "pusat",
  "indonesia",
  "raya",
  "dan",
  "dekat",
  "depan",
  "samping",
  "seberang",
  "di",
])

export function distanceMeters(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function addressTokens(address = "") {
  return new Set(
    address
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((word) => word.length > 1 && !GENERIC_WORDS.has(word)),
  )
}

function similarAddress(a, b) {
  const left = addressTokens(a)
  const right = addressTokens(b)
  if (!left.size || !right.size) return false
  let shared = 0
  for (const word of left) if (right.has(word)) shared += 1
  const smaller = Math.min(left.size, right.size)
  return shared >= Math.min(2, smaller) && shared / smaller >= 0.8
}

const hasPoint = (location) => location?.lat != null && location?.lon != null

/** Kecocokan lokasi dua laporan: { match, reason: "gps" | "address", distance }. */
export function compareLocations(a, b) {
  const distance =
    hasPoint(a.location) && hasPoint(b.location)
      ? distanceMeters(a.location, b.location)
      : null
  if (distance != null && distance <= DUPLICATE_RADIUS_M)
    return { match: true, reason: "gps", distance }
  if (similarAddress(a.location.address, b.location.address))
    return { match: true, reason: "address", distance }
  return { match: false, reason: null, distance }
}

const isOpen = (report) => report.status !== "done"

/**
 * Analisis duplikat dari daftar laporan efektif.
 * - reviewGroups: grup ≥2 laporan utama terbuka yang terindikasi sama → WAJIB dicek admin
 * - mergedGroups: laporan utama terbuka yang sudah punya duplikat → tetap diprioritaskan
 * - priorityById: Map id → { type: "review" | "merged" | "duplicate", groupId, size }
 */
export function analyzeDuplicates(reports) {
  const roots = reports.filter(
    (report) => isOpen(report) && !report.duplicateOf,
  )
  const parent = new Map(roots.map((report) => [report.id, report.id]))
  const find = (id) => {
    while (parent.get(id) !== id) {
      parent.set(id, parent.get(parent.get(id)))
      id = parent.get(id)
    }
    return id
  }
  const matches = new Map()

  for (let i = 0; i < roots.length; i += 1) {
    for (let j = i + 1; j < roots.length; j += 1) {
      const a = roots[i]
      const b = roots[j]
      if (a.category !== b.category) continue
      if (a.distinctFrom.includes(b.id) || b.distinctFrom.includes(a.id))
        continue
      const result = compareLocations(a, b)
      if (!result.match) continue
      parent.set(find(a.id), find(b.id))
      matches.set(`${a.id}|${b.id}`, result)
    }
  }

  const components = new Map()
  for (const report of roots) {
    const key = find(report.id)
    components.set(key, [...(components.get(key) ?? []), report])
  }

  const byOldest = (a, b) => a.createdAt.localeCompare(b.createdAt)
  const reviewGroups = [...components.values()]
    .filter((members) => members.length > 1)
    .map((members) => {
      const sorted = [...members].sort(byOldest)
      const ids = new Set(sorted.map((member) => member.id))
      const links = [...matches.entries()]
        .filter(([key]) => key.split("|").every((id) => ids.has(id)))
        .map(([key, value]) => ({ ids: key.split("|"), ...value }))
      return {
        id: sorted.map((member) => member.id).join("+"),
        category: sorted[0].category,
        reports: sorted,
        links,
        // Laporan utama yang disarankan: yang paling jauh progresnya, lalu yang tertua.
        suggestedId:
          sorted.find((member) => member.ownStatus === "progress")?.id ??
          sorted[0].id,
        latestAt: sorted[sorted.length - 1].createdAt,
      }
    })
    .sort(
      (a, b) =>
        b.reports.length - a.reports.length ||
        b.latestAt.localeCompare(a.latestAt),
    )

  const byId = new Map(reports.map((report) => [report.id, report]))
  const mergedGroups = reports
    .filter((report) => isOpen(report) && report.duplicateIds.length)
    .map((primary) => ({
      id: primary.id,
      primary,
      duplicates: primary.duplicateIds
        .map((id) => byId.get(id))
        .filter(Boolean),
    }))

  const priorityById = new Map()
  for (const group of reviewGroups) {
    for (const report of group.reports) {
      priorityById.set(report.id, {
        type: "review",
        groupId: group.id,
        size: group.reports.length,
      })
    }
  }
  for (const group of mergedGroups) {
    const size = group.duplicates.length + 1
    if (!priorityById.has(group.primary.id))
      priorityById.set(group.primary.id, {
        type: "merged",
        groupId: group.id,
        size,
      })
    for (const duplicate of group.duplicates) {
      priorityById.set(duplicate.id, {
        type: "duplicate",
        groupId: group.id,
        size,
      })
    }
  }

  return { reviewGroups, mergedGroups, priorityById }
}
