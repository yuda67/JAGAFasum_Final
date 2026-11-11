/*
 * Simulasi penyimpanan laporan di frontend (tanpa server).
 * Semua laporan disimpan di localStorage browser ini dan bisa dipantau
 * lewat hook useReports (memakai useSyncExternalStore).
 *
 * Perubahan dari admin & pelapor (status, foto before/after, penggabungan
 * duplikat, rating) disimpan TERPISAH sebagai "lapisan pembaruan" per id laporan
 * (UPDATES_KEY), sehingga berlaku sama untuk laporan dummy maupun laporan baru.
 */
import { writeJSON } from "./storage"

export const REPORTS_KEY = "jagafasum:v1:reports"
export const UPDATES_KEY = "jagafasum:v1:report-updates"

export const STATUS_ORDER = ["pending", "progress", "done"]
export const NEXT_STATUS = { pending: "progress", progress: "done" }

const SIMULATED_LATENCY = 900
const ACTION_LATENCY = 600
const EMPTY = []
const EMPTY_UPDATES = {}
const listeners = new Set()

let cachedRaw = null
let cachedReports = EMPTY
let cachedUpdatesRaw = null
let cachedUpdates = EMPTY_UPDATES

const STORAGE_FULL =
  "Penyimpanan browser penuh. Hapus beberapa laporan lama atau pakai foto yang lebih kecil."

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `r_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

function readRaw(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/** Snapshot stabil: hanya mem-parse ulang bila isi storage berubah. */
export function getAllReports() {
  const raw = readRaw(REPORTS_KEY)
  if (raw === cachedRaw) return cachedReports
  cachedRaw = raw
  try {
    const parsed = raw ? JSON.parse(raw) : EMPTY
    cachedReports = Array.isArray(parsed) ? parsed : EMPTY
  } catch {
    cachedReports = EMPTY
  }
  return cachedReports
}

/** Snapshot lapisan pembaruan: { [reportId]: patch }. */
export function getAllUpdates() {
  const raw = readRaw(UPDATES_KEY)
  if (raw === cachedUpdatesRaw) return cachedUpdates
  cachedUpdatesRaw = raw
  try {
    const parsed = raw ? JSON.parse(raw) : EMPTY_UPDATES
    cachedUpdates =
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : EMPTY_UPDATES
  } catch {
    cachedUpdates = EMPTY_UPDATES
  }
  return cachedUpdates
}

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeReports(listener) {
  listeners.add(listener)
  const handleStorage = (event) => {
    if (
      event.key === null ||
      event.key === REPORTS_KEY ||
      event.key === UPDATES_KEY
    )
      listener()
  }
  window.addEventListener("storage", handleStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", handleStorage)
  }
}

export async function createReport(userId, values) {
  await wait(SIMULATED_LATENCY)
  const report = {
    id: createId(),
    userId,
    title: values.title.trim().replace(/\s+/g, " "),
    category: values.category,
    description: values.description.trim(),
    location: {
      address: values.location.address.trim(),
      lat: values.location.lat ?? null,
      lon: values.location.lon ?? null,
    },
    photo: values.photo,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  const saved = writeJSON(REPORTS_KEY, [report, ...getAllReports()])
  if (!saved) {
    return { ok: false, formError: STORAGE_FULL }
  }
  emit()
  return { ok: true, report }
}

export function deleteReport(userId, reportId) {
  const next = getAllReports().filter(
    (report) => !(report.id === reportId && report.userId === userId),
  )
  writeJSON(REPORTS_KEY, next)
  const { [reportId]: _removed, ...rest } = getAllUpdates()
  writeJSON(UPDATES_KEY, rest)
  emit()
}

/* ============================ Alur kerja laporan ============================ */

/** Gabungkan beberapa patch sekaligus: { [id]: partial }. */
function savePatches(patches) {
  const current = getAllUpdates()
  const next = { ...current }
  for (const [id, patch] of Object.entries(patches)) {
    next[id] = { ...(current[id] ?? {}), ...patch }
  }
  if (!writeJSON(UPDATES_KEY, next)) return { ok: false, formError: STORAGE_FULL }
  emit()
  return { ok: true }
}

const isAdmin = (actor) => actor?.role === "admin"
const ADMIN_ONLY = { ok: false, formError: "Hanya admin yang dapat melakukan aksi ini." }
const historyEntry = (actor, status, note = "", at = new Date().toISOString()) => ({
  status,
  at,
  by: actor.name,
  byId: actor.userId,
  note: note.trim(),
})

/**
 * Admin: naikkan status laporan satu langkah (Pending → In Progress → Resolved).
 * Foto "before" opsional (bawaan = foto pelapor); foto "after" WAJIB untuk Resolved.
 */
export async function advanceReportStatus(
  actor,
  report,
  { note = "", beforePhoto = null, afterPhoto = null } = {},
) {
  await wait(ACTION_LATENCY)
  if (!isAdmin(actor)) return ADMIN_ONLY
  if (report.duplicateOf)
    return {
      ok: false,
      formError: "Laporan duplikat mengikuti status laporan utamanya.",
    }
  const next = NEXT_STATUS[report.ownStatus]
  if (!next) return { ok: false, formError: "Laporan ini sudah selesai." }
  if (next === "done" && !afterPhoto)
    return {
      ok: false,
      errors: {
        afterPhoto: "Unggah foto after (hasil pengerjaan) sebelum menandai Resolved.",
      },
    }

  const entry = historyEntry(actor, next, note)
  const patch = { status: next, history: [...report.ownHistory, entry] }
  if (beforePhoto) patch.beforePhoto = beforePhoto
  if (next === "progress") {
    patch.startedAt = entry.at
    patch.handledBy = actor.name
  }
  if (next === "done") {
    patch.afterPhoto = afterPhoto
    patch.resolvedAt = entry.at
    patch.resolvedBy = actor.name
    patch.resolvedById = actor.userId
    patch.resolutionNote = entry.note
  }
  return { ...savePatches({ [report.id]: patch }), status: next }
}

/** Admin: ganti foto before saat laporan masih dikerjakan. */
export function setBeforePhoto(actor, report, beforePhoto) {
  if (!isAdmin(actor)) return ADMIN_ONLY
  return savePatches({ [report.id]: { beforePhoto } })
}

/**
 * Admin: gabungkan grup duplikat. `primary` menjadi laporan utama; laporan lain
 * ditandai Duplikat dan otomatis mengikuti status & foto laporan utama.
 * Bila ada anggota yang sudah In Progress, laporan utama ikut dinaikkan agar progres tidak mundur.
 */
export async function mergeDuplicates(actor, primary, members) {
  await wait(ACTION_LATENCY)
  if (!isAdmin(actor)) return ADMIN_ONLY
  const others = members.filter((member) => member.id !== primary.id)
  if (!others.length) return { ok: false, formError: "Pilih minimal dua laporan." }

  const at = new Date().toISOString()
  const rank = (status) => STATUS_ORDER.indexOf(status)
  const furthest = others.reduce(
    (best, member) => (rank(member.ownStatus) > rank(best) ? member.ownStatus : best),
    primary.ownStatus,
  )

  const primaryPatch = {
    duplicateOf: null,
    mergedHistory: [
      ...(primary.mergedHistory ?? []),
      { at, by: actor.name, ids: others.map((member) => member.id) },
    ],
  }
  if (rank(furthest) > rank(primary.ownStatus)) {
    primaryPatch.status = furthest
    primaryPatch.startedAt = at
    primaryPatch.history = [
      ...primary.ownHistory,
      historyEntry(
        actor,
        furthest,
        "Status disesuaikan dengan laporan duplikat yang sudah ditangani.",
        at,
      ),
    ]
  }
  const donor = others.find((member) => member.beforePhoto)
  if (!primary.beforePhoto && donor) primaryPatch.beforePhoto = donor.beforePhoto

  const patches = { [primary.id]: primaryPatch }
  for (const member of others) {
    patches[member.id] = { duplicateOf: primary.id, mergedAt: at, mergedBy: actor.name }
  }
  return savePatches(patches)
}

/** Admin: lepaskan laporan dari grup duplikat (dan jangan dikelompokkan lagi dengan utamanya). */
export function splitDuplicate(actor, report) {
  if (!isAdmin(actor)) return ADMIN_ONLY
  const primaryId = report.duplicateOf
  if (!primaryId) return { ok: true }
  const updates = getAllUpdates()
  const addDistinct = (id, otherId) => [
    ...new Set([...(updates[id]?.distinctFrom ?? []), otherId]),
  ]
  return savePatches({
    [report.id]: {
      duplicateOf: null,
      mergedAt: null,
      distinctFrom: addDistinct(report.id, primaryId),
    },
    [primaryId]: { distinctFrom: addDistinct(primaryId, report.id) },
  })
}

/** Admin: tandai laporan-laporan dalam satu grup sebagai BUKAN duplikat satu sama lain. */
export async function markNotDuplicate(actor, members) {
  await wait(ACTION_LATENCY)
  if (!isAdmin(actor)) return ADMIN_ONLY
  const updates = getAllUpdates()
  const ids = members.map((member) => member.id)
  const patches = {}
  for (const id of ids) {
    patches[id] = {
      distinctFrom: [
        ...new Set([
          ...(updates[id]?.distinctFrom ?? []),
          ...ids.filter((other) => other !== id),
        ]),
      ],
    }
  }
  return savePatches(patches)
}

/** Pelapor: beri rating 1–5 + komentar, sekali, setelah laporan Resolved. */
export async function rateReport(actor, report, { score, comment = "" }) {
  await wait(ACTION_LATENCY)
  if (!actor || actor.userId !== report.userId)
    return { ok: false, formError: "Hanya pelapor yang dapat menilai laporan ini." }
  if (report.status !== "done")
    return { ok: false, formError: "Rating bisa diberikan setelah laporan selesai." }
  if (report.rating) return { ok: false, formError: "Laporan ini sudah dinilai." }
  const value = Math.round(Number(score))
  if (!(value >= 1 && value <= 5))
    return { ok: false, errors: { score: "Pilih 1 sampai 5 bintang." } }

  return savePatches({
    [report.id]: {
      rating: {
        score: value,
        comment: comment.trim().slice(0, 400),
        at: new Date().toISOString(),
        by: actor.name,
      },
    },
  })
}

/**
 * Admin: hapus laporan dalam status apa pun (setelah divalidasi di dialog).
 * Laporan dari browser ini dihapus permanen; laporan dummy disembunyikan lewat penanda `deleted`.
 * Laporan duplikat yang menginduk ke laporan ini dilepas agar kembali ditangani sendiri.
 */
export async function adminDeleteReport(actor, report) {
  await wait(ACTION_LATENCY)
  if (!isAdmin(actor)) return ADMIN_ONLY

  const stored = getAllReports()
  const isStored = stored.some((item) => item.id === report.id)
  const updates = { ...getAllUpdates() }
  for (const id of report.duplicateIds ?? []) {
    updates[id] = { ...(updates[id] ?? {}), duplicateOf: null, mergedAt: null }
  }
  if (isStored) {
    delete updates[report.id]
    writeJSON(REPORTS_KEY, stored.filter((item) => item.id !== report.id))
  } else {
    updates[report.id] = {
      ...(updates[report.id] ?? {}),
      deleted: true,
      deletedAt: new Date().toISOString(),
      deletedBy: actor.name,
    }
  }
  if (!writeJSON(UPDATES_KEY, updates)) return { ok: false, formError: STORAGE_FULL }
  emit()
  return { ok: true }
}
