/*
 * Semua teks & angka yang tampil di website dikumpulkan di sini
 * supaya mudah diubah tanpa menyentuh komponen.
 */

export const brand = {
  name: "JAGAFasum",
}

export const hero = {
  title: "The comfort of our future lies in our public facilities.",
  welcome: { before: "Selamat datang di ", highlight: "JAGAFasum" },
  lead: "Tujuan program ini adalah menciptakan sistem pengaduan terintegrasi, di mana masyarakat dapat melaporkan berbagai masalah terkait fasilitas apa pun melalui satu platform.",
}

// Angka dihitung otomatis dari data laporan (lihat components/sections/Hero).
// Pelaporan = semua laporan; Perbaikan = laporan Resolved (duplikat yang digabung dihitung sekali).
export const stats = [
  { id: "reports", label: "Jumlah Pelaporan" },
  { id: "repairs", label: "Jumlah Perbaikan" },
]

export const statDetails = {
  reports: ({ pending, progress }) => `${pending} pending · ${progress} diproses`,
  repairs: ({ percent }) => `${percent}% kasus tuntas`,
  empty: "Belum ada laporan",
  hint: "Klik untuk melihat rinciannya",
}

// `slot` = nama file gambar di src/assets/images (lihat src/data/images.js)
export const facilityPhotos = [
  { slot: "fasilitas-1", caption: "Tangga JPO berkarat" },
  { slot: "fasilitas-2", caption: "Trotoar rusak" },
  { slot: "fasilitas-3", caption: "Jalan berlubang" },
]

export const reportSteps = [
  {
    id: "foto",
    label: "Foto",
    description: "Ambil foto fasilitas umum yang rusak.",
  },
  {
    id: "laporkan",
    label: "Laporkan",
    description: "Kirim laporan lengkap dengan lokasinya.",
  },
  {
    id: "pantau",
    label: "Pantau",
    description: "Pantau status tindak lanjut laporanmu.",
  },
  {
    id: "selesai",
    label: "Selesai",
    description: "Fasilitas diperbaiki oleh pihak pengelola.",
  },
  {
    id: "nilai",
    label: "Nilai Kinerja",
    description: "Beri penilaian atas kinerja perbaikan.",
  },
]

// `id` menentukan ikon yang dipakai (lihat components/sections/Categories)
export const categories = [
  { id: "bus", label: "Bis" },
  { id: "traffic", label: "Lalu lintas" },
  { id: "sidewalk", label: "Trotoar" },
  { id: "train", label: "Kereta Api" },
]

export const about = {
  title: "Tentang JAGAFasum",
  subtitle: "Satu tempat untuk menyuarakan kondisi fasilitas di sekitar Anda",
  body: "JAGAFasum menghubungkan warga dengan pihak pengelola fasilitas publik. Setiap laporan tercatat, terlihat oleh publik, dan dapat dipantau hingga selesai, sehingga perbaikan menjadi lebih cepat dan akuntabel.",
}

export const contact = {
  heading: "Contact",
  email: "JAGAFasum@gmail.com",
  phone: { display: "(021)9928 8227", href: "tel:+622199288227" },
  address: {
    lines: ["Jl. RS. Fatmawati,", "Pondok Labu, Jakarta"],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Jl.%20RS.%20Fatmawati%2C%20Pondok%20Labu%2C%20Jakarta",
  },
}

/* ===================== Area dashboard (setelah login) ===================== */

// Menu sidebar. `icon` menentukan ikon (lihat components/icons/DashboardIcons).
export const dashboardNav = [
  { id: "home", label: "Beranda", to: "/dashboard", icon: "grid", end: true },
  {
    id: "create",
    label: "Buat Laporan",
    to: "/dashboard/buat-laporan",
    icon: "report",
  },
  {
    id: "reports",
    label: "Laporan Saya",
    to: "/dashboard/laporan",
    icon: "document",
  },
  { id: "profile", label: "Profil", to: "/dashboard/profil", icon: "user" },
]

export const logoutNav = { label: "Keluar", icon: "logout" }

export const logoutDialog = {
  title: ["Oh no! You’re leaving...", "Are you sure?"],
  cancel: "Cancel",
  confirm: "Yes, Log out",
  confirming: "Logging out…",
  toast: "Kamu sudah keluar. Sampai jumpa!",
}

// Beranda dashboard (mengikuti desain: header, banner, ringkasan, cari & filter, kartu laporan)
export const dashboardHome = {
  cta: "Create a report",
  banner:
    "Foto, tandai lokasinya, lalu pantau sampai petugas selesai memperbaikinya. Semua laporan warga ada di satu tempat.",
  searchPlaceholder: "Cari laporan atau lokasi",
  searchLabel: "Cari laporan",
  filterAll: "All",
  statusLabel: "Status :",
  noResultTitle: "Laporan tidak ditemukan",
  noResultBody: "Coba kata kunci lain atau pilih status yang berbeda.",
  noResultReset: "Tampilkan semua laporan",
}

// Kartu ringkasan di beranda dashboard (urutan & label sesuai desain).
export const dashboardStats = [
  { id: "pending", label: "Laporan Pending", status: "pending" },
  { id: "progress", label: "Laporan In Progress", status: "progress" },
  { id: "done", label: "Laporan Resolved", status: "done" },
]

export const reportStatuses = {
  pending: { label: "Pending" },
  progress: { label: "In Progress" },
  done: { label: "Resolved" },
}

// Kategori fasilitas di form Buat Laporan (3 kolom). `id` menentukan ikon.
export const reportCategories = [
  { id: "road", label: "Jalan & Trotoar" },
  { id: "transport", label: "Transportasi Umum" },
  { id: "building", label: "Gedung Publik" },
  { id: "drainage", label: "Drainase & Saluran Air" },
  { id: "park", label: "Taman & Ruang Terbuka" },
  { id: "other", label: "Fasilitas Lainnya" },
]

export const createReport = {
  title: "Buat Laporan",
  photo: {
    label: "Foto fasilitas",
    hint: "PNG, JPG atau WebP. Foto harus jelas dan terlihat fasilitas yang rusak tersebut",
    button: "Upload foto",
    dropHint: "atau seret & lepas foto ke sini (maks. 5 MB)",
    dropActive: "Lepaskan untuk mengunggah",
    replace: "Ganti foto",
    remove: "Hapus foto",
    processing: "Memproses foto…",
  },
  titleField: { label: "Judul Laporan", placeholder: "Jalan Ambles" },
  category: { label: "Kategori Fasilitas" },
  description: {
    label: "Deskripsi",
    placeholder: "detail kerusakanya, sudah dari kapan, dll",
  },
  location: {
    label: "Location",
    placeholder: "Jl, masjid, Lenteng Agungg....",
    button: "Get my Location",
    locating: "Mencari lokasi…",
    approximate:
      "Izin GPS tidak tersedia di jendela ini, jadi dipakai perkiraan lokasi dari jaringan. Periksa & rapikan alamatnya.",
    found: "Lokasi ditemukan",
    mapTitle: "Peta lokasi laporan",
    openMap: "Buka di OpenStreetMap",
  },
  submit: "Kirim Laporan",
  submitting: "Mengirim…",
  reset: "Kosongkan form",
  success: "Laporan berhasil dikirim! Kamu bisa memantaunya di Laporan Saya.",
}

export const myReports = {
  title: "Laporan Saya",
  lead: "Semua laporan yang pernah kamu kirim dan status tindak lanjutnya.",
  filterAll: "All",
  emptyTitle: "Belum ada laporan di sini",
  emptyBody: "Laporan yang kamu kirim akan tercatat dan bisa dipantau di halaman ini.",
  cta: "Buat Laporan",
  delete: "Hapus laporan",
  deleted: "Laporan dihapus.",
}

export const profilePage = {
  title: "Profil",
  lead: "Informasi akun JAGAFasum kamu.",
  name: "Nama lengkap",
  email: "Email",
  joined: "Masuk sejak",
  reports: "Laporan dikirim",
  role: "Peran",
  roleAdmin: "Administrator",
  roleCitizen: "Warga",
  resolved: "Laporan diselesaikan",
  domicile: "Domisili",
  phone: "No. HP",
  empty: "Belum diisi",
  edit: "Edit profil",
  editTitle: "Edit profil",
  editLead: "Perbarui foto, nama, dan data kontakmu. Perubahan langsung tampil di seluruh dashboard.",
  photo: "Foto profil",
  photoHint: "PNG, JPG, atau WebP, maks. 5 MB. Foto dipotong otomatis menjadi persegi.",
  photoUpload: "Unggah foto",
  photoChange: "Ganti foto",
  photoRemove: "Hapus foto",
  namePlaceholder: "Nama lengkap kamu",
  domicilePlaceholder: "Mis. Pasar Minggu, Jakarta Selatan",
  domicileHint: "Kecamatan dan kota tempat tinggalmu.",
  useLocation: "Pakai lokasi saya",
  locating: "Mencari lokasi…",
  locationFailed: "Lokasi tidak dapat ditemukan. Ketik domisili secara manual.",
  phonePlaceholder: "0812 3456 7890",
  phoneHint: "Opsional. Dipakai petugas bila perlu konfirmasi laporan.",
  emailLocked: "Email dipakai untuk login dan tidak dapat diubah.",
  optional: "opsional",
  cancel: "Batal",
  save: "Simpan perubahan",
  saving: "Menyimpan…",
  saved: "Profil berhasil diperbarui.",
  noChanges: "Belum ada perubahan untuk disimpan.",
}

/* ===================== Fitur admin (role "admin", dashboard yang sama) ===================== */

// Menu sidebar khusus admin. `badge: "priority"` = jumlah grup duplikat yang wajib dicek.
export const adminNav = [
  { id: "home", label: "Beranda", to: "/dashboard", icon: "grid", end: true },
  {
    id: "manage",
    label: "Kelola Laporan",
    short: "Kelola",
    to: "/dashboard/kelola",
    icon: "clipboard",
  },
  {
    id: "priority",
    label: "Prioritas Duplikat",
    short: "Prioritas",
    to: "/dashboard/prioritas",
    icon: "layers",
    badge: "priority",
  },
  {
    id: "reviews",
    label: "Rating Kinerja",
    short: "Rating",
    to: "/dashboard/ulasan",
    icon: "star",
  },
  { id: "profile", label: "Profil", to: "/dashboard/profil", icon: "user" },
]

export const adminLogin = {
  documentTitle: "Login Admin — JAGAFasum",
  eyebrow: "Khusus petugas",
  title: ["Admin", "login"],
  lead: "Masuk untuk menindaklanjuti laporan warga, mengatur status pengerjaan, dan mengunggah foto hasil perbaikan.",
  submit: "Masuk sebagai Admin",
  submitting: "Memeriksa akun…",
  backToCitizen: "Bukan admin?",
  backToCitizenLink: "Login warga",
  citizenLinkLead: "Petugas pengelola?",
  citizenLink: "Masuk sebagai Admin",
  welcome: "Masuk sebagai admin. Selamat bertugas,",
}

export const adminHome = {
  cta: "Kelola laporan",
  banner:
    "Mode admin: tindak lanjuti laporan warga, cek laporan duplikat terlebih dahulu, lalu unggah foto before & after sebagai bukti pengerjaan.",
  alertTitle: (count) =>
    `${count} grup laporan terindikasi duplikat wajib dicek`,
  alertBody:
    "Kategori fasilitas dan lokasinya sama. Gabungkan ke satu laporan utama agar tidak ada pengerjaan ganda.",
  alertCta: "Cek sekarang",
}

export const priorityTag = {
  review: "Cek duplikat",
  merged: (size) => `Prioritas · ${size} laporan`,
  duplicate: "Duplikat",
}

export const workflow = {
  sectionTitle: "Tindak lanjut",
  startTitle: "Mulai pengerjaan",
  startHint: "Status akan berubah menjadi In Progress dan pelapor dapat memantaunya.",
  startCta: "Tandai In Progress",
  finishTitle: "Selesaikan pengerjaan",
  finishHint: "Foto after wajib diunggah sebagai bukti fasilitas sudah diperbaiki.",
  finishCta: "Tandai Resolved",
  saving: "Menyimpan…",
  beforeLabel: "Foto before",
  beforeHint: "Opsional. Bila kosong, foto dari pelapor dipakai sebagai before.",
  afterLabel: "Foto after",
  afterHint: "Foto kondisi fasilitas setelah selesai diperbaiki.",
  photoButton: "Unggah foto",
  photoReplace: "Ganti",
  photoRemove: "Hapus foto",
  noteStart: "Catatan untuk pelapor",
  noteStartPlaceholder: "Mis. tim dijadwalkan ke lokasi besok pagi",
  noteFinish: "Catatan hasil pengerjaan",
  noteFinishPlaceholder: "Mis. aspal ditambal dan diberi marka baru",
  optional: "opsional",
  blockedReview:
    "Laporan ini terindikasi duplikat. Cek dan gabungkan grupnya terlebih dahulu sebelum mengubah status.",
  blockedReviewCta: "Buka Prioritas Duplikat",
  duplicateInfo: (title) =>
    `Laporan ini duplikat dari “${title}”. Status dan foto pengerjaan mengikuti laporan utama.`,
  openPrimary: "Buka laporan utama",
  split: "Pisahkan dari grup",
  splitDone: "Laporan dipisahkan dari grup duplikat.",
  mergedInfo: (count) =>
    `Laporan utama untuk ${count} laporan duplikat. Setiap perubahan status juga berlaku untuk laporan tersebut.`,
  doneTitle: "Pengerjaan selesai",
  doneBy: (name, date) => `Diselesaikan oleh ${name} · ${date}`,
  waitingRating: "Menunggu rating dari pelapor.",
  historyTitle: "Riwayat status",
  toastProgress: "Status diubah ke In Progress.",
  toastDone: "Laporan ditandai Resolved. Pelapor kini bisa memberi rating.",
  reporter: "Pelapor",
  submitted: "Dikirim",
}

export const beforeAfter = {
  before: "Before",
  after: "After",
  sliderLabel: "Geser untuk membandingkan foto before dan after",
}

export const ratingCopy = {
  title: "Nilai kinerja perbaikan",
  lead: "Bagaimana hasil perbaikan fasilitas ini? Penilaianmu membantu meningkatkan layanan.",
  scoreLabels: ["Sangat buruk", "Buruk", "Cukup", "Baik", "Sangat baik"],
  commentLabel: "Komentar",
  commentPlaceholder: "Ceritakan hasil perbaikannya (opsional)",
  submit: "Kirim rating",
  submitting: "Mengirim…",
  thanks: "Terima kasih! Rating kinerja sudah terkirim.",
  yourRating: "Rating kamu",
  ratingBy: (name) => `Rating dari ${name}`,
  needsRating: "Beri rating",
  duplicateNote:
    "Laporanmu digabung dengan laporan serupa di lokasi yang sama, sehingga progresnya mengikuti laporan utama.",
}

export const manageReports = {
  documentTitle: "Kelola Laporan — JAGAFasum",
  title: "Kelola Laporan",
  lead: "Atur status pengerjaan setiap laporan warga. Laporan prioritas (duplikat) selalu tampil paling atas.",
  searchPlaceholder: "Cari judul, lokasi, atau pelapor",
  searchLabel: "Cari laporan",
  filters: {
    all: "All",
    priority: "Prioritas",
    pending: "Pending",
    progress: "In Progress",
    done: "Resolved",
  },
  emptyTitle: "Tidak ada laporan yang cocok",
  emptyBody: "Coba kata kunci lain atau pilih filter berbeda.",
  selectTitle: "Pilih laporan",
  selectBody: "Pilih salah satu laporan di daftar untuk menindaklanjutinya.",
  openManage: "Kelola laporan ini",
}

export const priorityPage = {
  documentTitle: "Prioritas Duplikat — JAGAFasum",
  title: "Prioritas Duplikat",
  lead: "Laporan dengan kategori fasilitas yang sama di lokasi yang sama (radius ±150 m atau alamat mirip) wajib dicek lebih dulu agar satu kasus tidak dikerjakan dua kali.",
  reviewTitle: "Wajib dicek",
  reviewEmptyTitle: "Tidak ada laporan duplikat",
  reviewEmptyBody: "Semua laporan terbuka sudah unik atau sudah digabungkan.",
  mergedTitle: "Sudah digabung, sedang diprioritaskan",
  mergedEmpty: "Belum ada grup yang digabungkan.",
  reasonGps: (meters) => `Titik GPS berjarak ±${meters} m`,
  reasonAddress: "Alamat mirip",
  reportsCount: (count) => `${count} laporan`,
  choosePrimary: "Jadikan utama",
  primary: "Laporan utama",
  suggested: "Disarankan",
  merge: "Gabungkan ke laporan utama",
  notDuplicate: "Bukan duplikat",
  mergeConfirmTitle: "Gabungkan laporan duplikat?",
  mergeConfirmBody: (title, count) =>
    `${count} laporan lain akan ditandai Duplikat dan mengikuti status serta foto pengerjaan “${title}”. Pelapornya tetap bisa memantau dan memberi rating.`,
  mergeConfirm: "Ya, gabungkan",
  merged: "Laporan digabungkan. Silakan tindak lanjuti laporan utamanya.",
  notDuplicateDone: "Ditandai bukan duplikat. Laporan akan ditangani terpisah.",
  manage: "Kelola",
  duplicatesOf: (count) => `+${count} duplikat`,
}

export const reviewsPage = {
  documentTitle: "Rating Kinerja — JAGAFasum",
  title: "Rating Kinerja",
  lead: "Penilaian warga atas hasil perbaikan fasilitas yang sudah selesai.",
  average: "Rata-rata rating",
  total: (count) => `dari ${count} penilaian`,
  resolved: "Laporan selesai",
  waiting: "Menunggu rating",
  avgDuration: "Rata-rata waktu selesai",
  durationDays: (days) => (days < 1 ? "< 1 hari" : `${days.toFixed(1).replace(".", ",")} hari`),
  listTitle: "Ulasan warga",
  emptyTitle: "Belum ada rating",
  emptyBody: "Rating muncul setelah pelapor menilai laporan yang sudah Resolved.",
}

// Hapus laporan oleh admin (status apa pun, wajib validasi ketik kata konfirmasi)
export const adminDelete = {
  button: "Hapus laporan",
  title: "Hapus laporan ini?",
  body: (title, status) =>
    `“${title}” (${status}) akan dihapus permanen beserta foto before/after, riwayat status, dan ratingnya.`,
  duplicates: (count) =>
    `${count} laporan duplikat yang tergabung akan dilepas dan kembali ditangani terpisah.`,
  confirmWord: "HAPUS",
  inputLabel: (word) => `Ketik ${word} untuk mengonfirmasi`,
  mismatch: (word) => `Ketik “${word}” (huruf kapital) agar laporan bisa dihapus.`,
  cancel: "Batal",
  confirm: "Ya, hapus laporan",
  deleting: "Menghapus…",
  done: (title) => `Laporan “${title}” dihapus.`,
  dangerTitle: "Zona berbahaya",
  dangerBody: "Hapus laporan palsu, spam, atau yang tidak relevan. Tindakan ini tidak dapat dibatalkan.",
}
