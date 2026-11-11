/*
 * Laporan dummy (contoh laporan warga) agar dashboard langsung terisi.
 * Foto memakai wadah gambar `laporan-1` … `laporan-4` di src/assets/images;
 * selama file belum ada, dipakai foto contoh dari Unsplash.
 * `history`, `afterPhoto`, dan `rating` mencontohkan alur admin: status → foto
 * before/after → rating pelapor. `laporan-5` sengaja berada di lokasi yang sama
 * dengan "Trotoar Rusak" agar fitur deteksi duplikat langsung terlihat.
 */
import { getImageUrl } from "./images"

const unsplash = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&h=500&q=75`

const photo = (slot, fallbackId) => getImageUrl(slot) ?? unsplash(fallbackId)

export const DUMMY_USER_ID = "warga-jagafasum"
export const DUMMY_USER_NAME = "Warga JAGAFasum"

const ADMIN = "Admin JAGAFasum"
const step = (status, at, note = "", by = ADMIN) => ({ status, at, by, note })

export const dummyReports = [
  {
    id: "dummy-bus-stop",
    title: "Bus Stop",
    category: "transport",
    description: "Saya melihat bus stop rusak dan mengganggu jalan.",
    location: {
      address: "Jl.Masjid, Pondok Labu",
      lat: -6.30752,
      lon: 106.79602,
    },
    photo: photo("laporan-1", "photo-1654552457050-af17f56045eb"),
    status: "done",
    createdAt: "2026-10-30T09:15:00.000Z",
    history: [
      step("pending", "2026-10-30T09:15:00.000Z", "", DUMMY_USER_NAME),
      step("progress", "2026-10-30T13:00:00.000Z", "Tim Dinas Perhubungan dijadwalkan ke lokasi."),
      step("done", "2026-11-01T08:30:00.000Z", "Atap & kaca halte diganti, bangku diperbaiki."),
    ],
    startedAt: "2026-10-30T13:00:00.000Z",
    handledBy: ADMIN,
    afterPhoto: photo("laporan-1-after", "photo-1755699877166-c236690d9fdf"),
    resolvedAt: "2026-11-01T08:30:00.000Z",
    resolvedBy: ADMIN,
    resolvedById: "admin-jagafasum",
    resolutionNote: "Atap & kaca halte diganti, bangku diperbaiki.",
    rating: {
      score: 4,
      comment: "Halte sekarang jauh lebih nyaman. Pengerjaannya cepat, terima kasih!",
      at: "2026-11-01T12:10:00.000Z",
      by: DUMMY_USER_NAME,
    },
  },
  {
    id: "dummy-trotoar",
    title: "Trotoar Rusak",
    category: "road",
    description:
      "Saya mendapati trotoar yang rusak, sudah dari lama namun tidak di benahi juga. padahal ramai dilewati masyarakat setiap hari.",
    location: {
      address: "Jl.Bacang, Pasar Minggu, Jakarta selatan",
      lat: -6.28401,
      lon: 106.84205,
    },
    photo: photo("laporan-2", "photo-1779179015285-120aaa822b1b"),
    status: "pending",
    createdAt: "2026-10-29T03:40:00.000Z",
  },
  {
    id: "dummy-jalan",
    title: "Jalan Berlubang",
    category: "road",
    description:
      "Saya sedang berkendara. Saya melihat jalan berlubang yang belum diperbaiki. Tolong segera diperbaiki karena membahayakan pengendara motor.",
    location: {
      address: "Jl. Sudirman, Jakarta Selatan",
      lat: -6.22501,
      lon: 106.80302,
    },
    photo: photo("laporan-3", "photo-1635068741358-ab1b9813623f"),
    status: "progress",
    createdAt: "2026-10-27T11:05:00.000Z",
    history: [
      step("pending", "2026-10-27T11:05:00.000Z", "", DUMMY_USER_NAME),
      step("progress", "2026-10-28T02:20:00.000Z", "Penambalan aspal dijadwalkan minggu ini."),
    ],
    startedAt: "2026-10-28T02:20:00.000Z",
    handledBy: ADMIN,
  },
  {
    id: "dummy-bus-stop-2",
    title: "Bus Stop",
    category: "transport",
    description: "Saya melihat bus stop rusak dan mengganggu jalan.",
    location: {
      address: "Jl.Masjid, Pondok Labu",
      lat: -6.30811,
      lon: 106.79554,
    },
    photo: photo("laporan-4", "photo-1782852031333-70fc1999b5fa"),
    status: "progress",
    createdAt: "2026-10-25T07:30:00.000Z",
    history: [
      step("pending", "2026-10-25T07:30:00.000Z", "", DUMMY_USER_NAME),
      step("progress", "2026-10-26T04:00:00.000Z", "Tangga halte akan dicat ulang & diberi pegangan baru."),
    ],
    startedAt: "2026-10-26T04:00:00.000Z",
    handledBy: ADMIN,
  },
  {
    id: "dummy-trotoar-2",
    title: "Trotoar Amblas",
    category: "road",
    description:
      "Trotoar di depan deretan ruko amblas dan retak, pejalan kaki terpaksa turun ke jalan.",
    location: {
      address: "Jl. Bacang, Pasar Minggu",
      lat: -6.28452,
      lon: 106.84251,
    },
    photo: photo("laporan-5", "photo-1706660143732-c1d14701114e"),
    status: "pending",
    createdAt: "2026-10-31T06:20:00.000Z",
  },
].map((report) => ({ ...report, userId: DUMMY_USER_ID, isDummy: true }))
