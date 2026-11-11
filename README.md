# JAGAFasum

Website **JAGAFasum** — platform pengaduan fasilitas umum terintegrasi.
Dibangun dengan **React + Vite**, **JavaScript (`.jsx`)**, dan **CSS biasa per komponen**.

| Route | Halaman |
| --- | --- |
| `/` | Beranda (dashboard) |
| `/login` | Login |
| `/register` | Register |
| lainnya | Halaman 404 |

## Menjalankan

- Di komputer sendiri: `pnpm install`, lalu `pnpm dev` (development) atau `pnpm build` (produksi).

## Struktur folder

```
src/
  main.jsx, App.jsx      Titik masuk aplikasi & provider (auth, notifikasi, router)
  routes.jsx             Daftar halaman (React Router)
  index.css              CSS global: font, reset, dan impor file di styles/
  styles/                tokens.css (warna, font, ukuran, radius, animasi), base.css, animations.css, utilities.css
  data/                  content.js (semua teks & angka), images.js (wadah gambar), skyline.js (data ilustrasi gedung)
  assets/images/         Tempat file gambar Anda (lihat bagian "Mengganti gambar")
  layouts/               RootLayout (transisi halaman), AuthLayout (kerangka Login/Register)
  pages/                 HomePage, LoginPage, RegisterPage, NotFoundPage
  components/
    layout/              Navbar, Footer
    sections/            Hero (+ StatCard), FacilityGallery, ReportFlow, Categories, About, Skyline
    ui/                  Logo, Button, ImageSlot, TextField, Reveal, Toast
    icons/               Ikon SVG (kategori & UI)
  context/, hooks/       State login & notifikasi, serta hook animasi (scroll, parallax, count-up, dll.)
  services/, utils/      Simulasi auth (localStorage), validasi form, format angka
```

Setiap komponen berada di foldernya sendiri dan berisi `Nama.jsx` + `Nama.css`.

## Mengganti teks & angka

Semua teks (judul hero, angka statistik, langkah alur, kategori, isi "Tentang", kontak) ada di
`src/data/content.js`. Ubah nilainya; tampilan langsung ikut berubah.

## Mengganti gambar (wadah gambar)

Taruh file di `src/assets/images/` dengan **nama sesuai slot** — gambar langsung dipakai tanpa
mengubah kode. Selama file belum ada, website menampilkan placeholder (saat preview/development
placeholder juga menampilkan nama file & ukuran yang disarankan).

| Nama file | Tampil di | Ukuran disarankan |
| --- | --- | --- |
| `hero.jpg` | Latar hero beranda | 2880 × 2060 px |
| `fasilitas-1.jpg`, `fasilitas-2.jpg`, `fasilitas-3.jpg` | Kartu foto fasilitas | 976 × 670 px |
| `auth.jpg` | Panel kiri Login & Register (otomatis diberi efek hijau) | 1440 × 2048 px |
| `logo.svg` / `logo.png` (opsional) | Mengganti logo bawaan | ≥ 184 × 166 px |

Ekstensi `.jpg`, `.png`, `.webp`, `.avif`, dan `.svg` didukung. Untuk menambah foto galeri,
tambahkan entri di `facilityPhotos` (`src/data/content.js`) dan slotnya di `src/data/images.js`.

## Gaya (CSS)

- Warna, font, ukuran, radius, bayangan, dan kurva animasi diatur terpusat di `src/styles/tokens.css`.
- Penamaan kelas memakai pola BEM (`blok__elemen--varian`), state `is-*`, utilitas `u-*`.
- Tailwind hanya dipakai sebagai reset CSS (Preflight); styling ditulis di file CSS komponen.
- Ukuran mengikuti desain 1440 px dan menyusut otomatis (`clamp()`) di layar lebih kecil, dengan
  tata letak khusus untuk tablet (≤ 1023 px) dan HP (≤ 767 px).
- Semua animasi dimatikan/disederhanakan bila pengguna mengaktifkan "kurangi gerakan" di sistemnya.

## Login & Register (simulasi)

Autentikasi berjalan sepenuhnya di browser: akun disimpan di `localStorage`
(`jagafasum:v1:users`) dan sesi di `jagafasum:v1:session`. Password disimpan dalam bentuk hash
SHA-256, tetapi ini **tetap hanya simulasi** — bukan keamanan sungguhan, dan akun hanya ada di
browser tempat Anda mendaftar. Untuk login sungguhan diperlukan backend.
