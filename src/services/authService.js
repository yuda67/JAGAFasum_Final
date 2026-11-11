/*
 * Simulasi autentikasi di frontend (tanpa server).
 * Data akun & sesi disimpan di localStorage browser ini saja.
 * Catatan: ini hanya simulasi, BUKAN pengamanan sungguhan.
 */
import { readJSON, removeItem, writeJSON } from "./storage"
import { ADMIN_ACCOUNTS } from "../data/adminAccounts"

export const USERS_KEY = "jagafasum:v1:users"
export const SESSION_KEY = "jagafasum:v1:session"

export const ROLES = { citizen: "citizen", admin: "admin" }

const SIMULATED_LATENCY = 650

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const normalizeEmail = (email) => email.trim().toLowerCase()

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

async function hashPassword(email, password) {
  const input = `${email}:${password}`
  const subtle = globalThis.crypto?.subtle
  if (subtle) {
    const digest = await subtle.digest(
      "SHA-256",
      new TextEncoder().encode(input),
    )
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("")
  }
  // Cadangan non-kriptografis (FNV-1a) bila Web Crypto tidak tersedia.
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return `fnv-${(hash >>> 0).toString(16)}`
}

function getUsers() {
  const users = readJSON(USERS_KEY, [])
  return Array.isArray(users) ? users : []
}

let seedPromise = null

/** Pastikan akun admin bawaan ada di daftar akun (dibuat sekali per browser). */
function ensureAdminAccounts() {
  seedPromise ??= (async () => {
    const users = getUsers()
    const missing = ADMIN_ACCOUNTS.filter(
      (admin) =>
        !users.some((user) => user.email === normalizeEmail(admin.email)),
    )
    if (!missing.length) return
    const seeded = await Promise.all(
      missing.map(async (admin) => {
        const email = normalizeEmail(admin.email)
        return {
          id: admin.id,
          name: admin.name,
          email,
          role: ROLES.admin,
          passwordHash: await hashPassword(email, admin.password),
          createdAt: new Date().toISOString(),
        }
      }),
    )
    writeJSON(USERS_KEY, [...users, ...seeded])
  })().finally(() => {
    seedPromise = null
  })
  return seedPromise
}

const roleOf = (user) => (user?.role === ROLES.admin ? ROLES.admin : ROLES.citizen)

function toSession(user) {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: roleOf(user),
    startedAt: new Date().toISOString(),
  }
}

export function getSession() {
  const session = readJSON(SESSION_KEY, null)
  return session && typeof session === "object" && session.email
    ? { ...session, role: roleOf(session) }
    : null
}

export async function registerUser({ name, email, password }) {
  await wait(SIMULATED_LATENCY)
  await ensureAdminAccounts()
  const normalizedEmail = normalizeEmail(email)
  const users = getUsers()

  if (users.some((user) => user.email === normalizedEmail)) {
    return { ok: false, errors: { email: "This email is already registered." } }
  }

  const user = {
    id: createId(),
    name: name.trim().replace(/\s+/g, " "),
    email: normalizedEmail,
    role: ROLES.citizen,
    passwordHash: await hashPassword(normalizedEmail, password),
    createdAt: new Date().toISOString(),
  }
  writeJSON(USERS_KEY, [...users, user])

  const session = toSession(user)
  writeJSON(SESSION_KEY, session)
  return { ok: true, user: session }
}

/**
 * Login warga (`role: "citizen"`, halaman /login) atau admin
 * (`role: "admin"`, halaman /admin/login). Akun hanya bisa masuk lewat halamannya sendiri.
 */
export async function loginUser({ email, password }, { role = ROLES.citizen } = {}) {
  await wait(SIMULATED_LATENCY)
  await ensureAdminAccounts()
  const normalizedEmail = normalizeEmail(email)
  const user = getUsers().find(
    (candidate) => candidate.email === normalizedEmail,
  )
  const passwordHash = await hashPassword(normalizedEmail, password)

  if (!user || user.passwordHash !== passwordHash) {
    return { ok: false, formError: "Incorrect email or password." }
  }

  if (roleOf(user) !== role) {
    return {
      ok: false,
      formError:
        role === ROLES.admin
          ? "Akun ini bukan akun admin. Silakan masuk lewat halaman Login warga."
          : "Ini akun admin. Silakan masuk lewat halaman Login Admin.",
      wrongRole: true,
    }
  }

  const session = toSession(user)
  writeJSON(SESSION_KEY, session)
  return { ok: true, user: session }
}

export function logoutUser() {
  removeItem(SESSION_KEY)
}

/** Data akun publik (tanpa hash password) untuk halaman Profil. */
export function getAccount(userId) {
  const user = getUsers().find((candidate) => candidate.id === userId)
  if (!user) return null
  return {
    name: user.name,
    email: user.email,
    role: roleOf(user),
    domicile: user.domicile ?? "",
    phone: user.phone ?? "",
    avatar: user.avatar ?? null,
    createdAt: user.createdAt,
  }
}

/** Nomor HP: buang spasi/tanda hubung/titik → "081234567890" atau "+6281234567890". */
export const normalizePhone = (phone = "") => phone.replace(/[\s.\-()]/g, "")

/**
 * Perbarui profil (nama, domisili, No. HP, foto). Email & password tidak diubah di sini.
 * Nama di sesi ikut diperbarui agar langsung tampil di seluruh dashboard.
 */
export async function updateProfile(userId, { name, domicile = "", phone = "", avatar = null }) {
  await wait(SIMULATED_LATENCY)
  const users = getUsers()
  const index = users.findIndex((user) => user.id === userId)
  if (index < 0) return { ok: false, formError: "Akun tidak ditemukan. Coba keluar lalu masuk lagi." }

  users[index] = {
    ...users[index],
    name: name.trim().replace(/\s+/g, " "),
    domicile: domicile.trim().replace(/\s+/g, " "),
    phone: normalizePhone(phone),
    avatar: avatar || null,
    updatedAt: new Date().toISOString(),
  }
  if (!writeJSON(USERS_KEY, users)) {
    return {
      ok: false,
      formError: "Penyimpanan browser penuh. Coba pakai foto profil yang lebih kecil.",
    }
  }

  const session = { ...getSession(), name: users[index].name }
  writeJSON(SESSION_KEY, session)
  return { ok: true, user: session, account: getAccount(userId) }
}

/** Peta userId → nama, untuk menampilkan nama pelapor di area admin. */
export function getUserNames() {
  return Object.fromEntries(getUsers().map((user) => [user.id, user.name]))
}
