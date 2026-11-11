/*
 * Menyusun "laporan efektif" dari data dasar + lapisan pembaruan.
 * - ownStatus / ownHistory: progres laporan itu sendiri
 * - status / history / foto before-after: untuk laporan Duplikat diambil dari laporan utamanya
 */
const pendingEntry = (report) => ({
  status: "pending",
  at: report.createdAt,
  by: "Pelapor",
  note: "",
})

// Kolom yang diwarisi laporan duplikat dari laporan utamanya.
const INHERITED = [
  "beforePhoto",
  "afterPhoto",
  "startedAt",
  "handledBy",
  "resolvedAt",
  "resolvedBy",
  "resolvedById",
  "resolutionNote",
]

export function buildReports(baseReports, updates) {
  const own = new Map()
  for (const report of baseReports) {
    const patch = updates[report.id] ?? {}
    if (patch.deleted) continue // dihapus admin
    const merged = { ...report, ...patch }
    own.set(report.id, {
      ...merged,
      ownStatus: merged.status ?? "pending",
      ownHistory: merged.history?.length
        ? merged.history
        : [pendingEntry(report)],
      duplicateOf: merged.duplicateOf ?? null,
      distinctFrom: merged.distinctFrom ?? [],
      rating: merged.rating ?? null,
    })
  }

  // Ikuti rantai duplikat sampai laporan utama (aman dari siklus & id yang sudah dihapus).
  const rootOf = (report) => {
    let current = report
    const seen = new Set([current.id])
    while (current.duplicateOf && own.has(current.duplicateOf)) {
      if (seen.has(current.duplicateOf)) break
      current = own.get(current.duplicateOf)
      seen.add(current.id)
    }
    return current
  }

  const result = []
  const duplicatesByRoot = new Map()
  for (const report of own.values()) {
    const root = rootOf(report)
    if (root.id === report.id) {
      result.push({
        ...report,
        duplicateOf: null,
        status: report.ownStatus,
        history: report.ownHistory,
      })
      continue
    }
    const inherited = Object.fromEntries(
      INHERITED.map((key) => [key, root[key] ?? null]),
    )
    result.push({
      ...report,
      ...inherited,
      duplicateOf: root.id,
      primaryTitle: root.title,
      status: root.ownStatus,
      history: root.ownHistory,
    })
    duplicatesByRoot.set(root.id, [
      ...(duplicatesByRoot.get(root.id) ?? []),
      report.id,
    ])
  }

  return result.map((report) =>
    duplicatesByRoot.has(report.id)
      ? { ...report, duplicateIds: duplicatesByRoot.get(report.id) }
      : { ...report, duplicateIds: [] },
  )
}
