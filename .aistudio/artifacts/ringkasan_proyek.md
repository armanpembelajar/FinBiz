# Ringkasan Proyek Utuh: FinBiz - Manajemen Keuangan Bisnis & UMKM

> **Tanggal Pembaruan Terakhir:** Minggu, 11 Oktober 2026 (Pukul 09:18 PDT / 23:18 WIB)  
> **Status Sistem:** Live Online (Production Active)  
> **URL Produksi:** [https://finbiz-mantangai.vercel.app/](https://finbiz-mantangai.vercel.app/)  
> **Versi Tata Letak:** v3.1 (Portal Beranda Kokoh, Bersih & Arsitektur Banner-Centric)  
> **Lisensi:** Apache-2.0

---

## 1. Ikhtisar & Tujuan Aplikasi

**FinBiz** adalah platform tata kelola finansial terpadu yang dirancang khusus untuk pelaku usaha, wirausaha mandiri, dan UMKM. FinBiz menyatukan kepatuhan akuntansi regulasi Indonesia (termasuk kepatuhan PPh Final UMKM 0.5% PP 55/2022) dengan antarmuka digital berkinerja tinggi, visualisasi panggung 3D interaktif Three.js, dan arsitektur tata kelola tanpa redundansi.

Prinsip utama FinBiz versi 3.1 adalah **Fokus Fungsional & Portal Beranda Kokoh**:
- **Portal Beranda (Dashboard):** Didesain murni sebagai kokpit pemantauan eksekutif yang bersih, utuh, dan kokoh tanpa tombol atau dropdown input, menyajikan visualisasi data tanpa distraksi.
- **Pencatatan Terpusat di Pelaksanaan:** Seluruh alur pencatatan mutasi kas dan pembuatan faktur/kwitansi difokuskan secara disiplin pada modul **Pelaksanaan**.

---

## 2. Arsitektur Tampilan & Sistem Popup Push Terpadu

### A. Layar Awal 3D Interaktif & Alur Otentikasi Terpadu (Unauthenticated Stage)
- **Isolasi Keamanan Total:** Seluruh sistem pembukuan (Sidebar, Dashboard, Perencanaan, Pelaksanaan, Pelaporan, Pengaturan, Akun) **terkunci penuh** sebelum verifikasi akun email selesai 100%.
- **Panggung Visual 3D Bergulir (Three.js):** Latar belakang 3D partikel finansial yang berputar halus dan bereaksi secara dinamis terhadap kursor mouse.
- **Alur Masuk Wajib Verifikasi (Mandiri & Google SSO):**
  1. *Kartu 1 (Pendaftaran / Pemilihan Akun):* Form input Email & Kata Sandi atau tombol resmi *Login dengan Google (SSO)*.
  2. *Popup Sukses & Animasi Berbalik:* Data akun tersimpan aman, memunculkan popup konfirmasi dan kartu berbalik 3D secara otomatis ke Kartu 2.
  3. *Kartu 2 (Wajib Verifikasi Akun Email):* Baik pendaftar mandiri maupun pengguna Google SSO **wajib melengkapi 6-digit kode verifikasi email**.
  4. *Akses Sistem:* Hanya setelah verifikasi kode 6-digit dinyatakan sukses (*"Verifikasi Berhasil"*), sistem FinBiz terbuka dan pengguna masuk ke akun.

### B. Portal Beranda (Dashboard) Bersih, Utuh, & Kokoh
- **Tanpa Tombol & Dropdown Input:** Meniadakan dropdown buku fiskal dan tombol catat kas di beranda agar ruang pemantauan tetap lapang, berwibawa, dan kokoh.
- **Badge Status Portal Beranda:** Menampilkan indikator real-time *"Portal Beranda FinBiz · Buku Kas Berjalan Aktif"* yang elegan dan informatif.
- **4 Kartu Metrik KPI Finansial Utama:**
  - *Total Saldo Kas & Bank* (akumulasi likuiditas aktual).
  - *Kas Masuk* (omzet pendapatan periode berjalan).
  - *Kas Keluar* (beban operasional & HPP).
  - *Laba Operasional Bersih* (dilengkapi persentase *Net Profit Margin*).
- **Grafik Tren Arus Kas Mingguan:** Visualisasi perbandingan pemasukan vs pengeluaran.
- **Monitoring Serapan Pagu Anggaran:** Progress bar serapan dana belanja divisi operasional.

### C. Sistem Popup Push FinBiz
Aplikasi dilengkapi sistem **Popup Push Modal** terpusat, modern, dan responsif:

1. **Popup Push "Anda Berhasil Keluar" (Logout):**
   - Muncul saat pengguna menekan tombol **Keluar**.
   - Menampilkan kartu modal terpusat dengan ikon animasi `LogOut`, badge status *"Sesi Berakhir"*, progres bar animasi, dan tombol *"Tutup & Masuk Kembali"*.
   - **Bebas Dobel Popup:** Tidak ada lagi toast atau floating banner yang tertinggal di bagian footer layar.

2. **Popup Push "Berhasil Tersimpan":**
   - Muncul otomatis saat pengguna menyimpan perubahan data:
     - Menyimpan identitas profil usaha di modul **Akun**.
     - Menyimpan konfigurasi fitur & rekening perbankan di modul **Pengaturan**.
     - Mencatat mutasi kas masuk/keluar baru melalui modul **Pelaksanaan**.
     - Menambahkan alokasi pos pagu anggaran baru di modul **Perencanaan (RAB)**.
   - Desain kartu modal gelap dengan border emerald, animasi checkmark memantul, rincian data tersimpan, dan tombol konfirmasi *"Oke, Selesai"*.

### D. Eliminasi Header Redundan & Banner Terintegrasi
- **Penghapusan Bilah Header Atas (`TopBar`):** Tidak ada lagi bilah putih di atas yang memakan ruang pandang.
- **Banner Eksekutif Seragam:** Setiap modul dipimpin oleh Banner bergradasi gelap (*dark slate to teal*) yang mengintegrasikan judul, deskripsi, dan tombol aksi spesifik modul tersebut.
- **Sidebar Navigasi Murni:**
  - Bagian atas murni menampilkan brand FinBiz dan langsung dilanjutkan dengan 6 menu navigasi utama.
  - Bagian bawah dilengkapi kartu ringkas profil pengguna dan tombol **Keluar** berwarna merah.

---

## 3. Matriks 5 Modul Finansial & 1 Modul Akun Terpadu

| Modul | Peran Utama | Desain Banner & Kontrol Aksi |
|---|---|---|
| **1. Dashboard (Beranda)** | Kokpit Pemantauan Kesehatan Finansial | **Banner Kokoh & Bersih**; bebas dari tombol/dropdown input, fokus pada 4 KPI, grafik mingguan, dan serapan RAB. |
| **2. Perencanaan (RAB)** | Anggaran Biaya & Target Omzet | **Banner RAB Terintegrasi**; tombol `+ Alokasi Pos Baru`, tabel target omzet bulanan, dan kalkulator Titik Impas (BEP). |
| **3. Pelaksanaan (Buku Kas)** | **Pusat Pencatatan Mutasi Kas & Transaksi** | **Banner Kas Terintegrasi**; tombol `+ Catat Transaksi`, buku kas jurnal harian, pencarian instan, filter pembayaran, dan generator nota. |
| **4. Pelaporan (Fiskal)** | Laba Rugi, Neraca & Kepatuhan Pajak | **Banner Fiskal Terintegrasi**; tombol aksi *Cetak PDF* dan *Unduh CSV / Excel*, perhitungan PPh Final UMKM 0.5% (PP 55/2022). |
| **5. Pengaturan (Sistem)**| Kontrol Fitur & Konfigurasi Kas/Bank | **Banner Kontrol Terintegrasi**; switcher sub-tab (*Fitur, Profil, Kas & Bank, Notifikasi*), master saklar fitur. |
| **6. Akun (Profil Usaha)** | Identitas Lengkap & Integrasi Google | **Banner Profil Terintegrasi**; indikator status penautan Google SSO, upload avatar, dan meteran skor kelengkapan. |

---

## 4. Matriks Komparasi Sebelum & Sesudah Pembaruan

| Elemen UI/UX | Versi Sebelumnya | Versi Terkini (v3.1) |
|---|---|---|
| **Portal Beranda (Dashboard)** | Memuat tombol catat transaksi & dropdown periode | **Bersih, Utuh, & Kokoh**; murni sebagai kokpit pemantauan eksekutif |
| **Lokasi Pencatatan Kas** | Tersebar di header, atas sidebar, dan dashboard | **Terpusat & Disiplin di Fitur Pelaksanaan** |
| **Header Atas (TopBar)** | Bilah putih memakan ruang di atas setiap halaman | **Dihapus total**; langsung dipimpin oleh Banner |
| **Notifikasi Keluar (Logout)** | Dobel notifikasi (modal tengah + toast di footer) | **Satu Popup Push terpusat**, bersih tanpa residu toast footer |
| **Notifikasi Tersimpan** | Hanya toast teks biasa | **Popup Push Modal "Berhasil Tersimpan"** berdesain emerald interaktif |
| **Sidebar Bagian Atas** | Padat oleh tombol catat kas | **Murni & Bersih**, langsung menampilkan menu navigasi di bawah logo brand |
| **Sidebar Bagian Bawah** | Tidak ada profil terpadu | **Footer Akun Lengkap** dengan avatar, nama usaha, & tombol Logout merah |

---

## 5. Ringkasan Teknis (Tech Stack)

- **Framework:** React 19 (SPA dengan Vite 8 & TypeScript)
- **Styling:** Tailwind CSS v4 dengan sistem palet warna Slate-Teal-Emerald
- **3D Graphics:** Three.js (Interactive particles, spatial background & lighting)
- **Ikonografi:** Lucide React
- **Validasi Kualitas Kode:** Lulus kompilasi `tsc` & `npm run lint` dengan zero error

---

## 6. Tips & Budaya Kerja Sesi

> ### TIPS:
> **Dorongan untuk 2 kebiasaan penting:**
> - **Awal sesi:** `"ringkasan_proyek.md dan lanjutkan"`
> - **Akhir sesi:** `"perbarui ringkasan_proyek.md dengan yang sudah dikerjakan hari ini"`

---

## 7. Identitas Pengembang & Penanda Footer Halaman Depan

**Identitas Resmi (Tampil pada Footer Halaman Depan - Desain 3D Transparan & Gemilau):**  
- **Sisi Kiri (Kapsul Glassmorphic 3D & Ikon Sparkles):**  
  - Baris 1: `FinBiz Keuangan` (tipografi metalik gemilau gradasi emerald-teal)  
  - Baris 2 (lebih kecil): `Versi Sistem v3.1 Enterprise` (indikator radar aktif & monospace teal)  
- **Sisi Kanan (Kapsul Glassmorphic 3D & Lencana Perisai):**  
  - Baris 1: `Kreator App Mantangai` (tipografi metalik gemilau gradasi emas-emerald)  
  - Baris 2 (lebih kecil): `Uluh Lewu Dayak` (kristal hijau emerald berkilau)  

## 8. Panduan Deployment ke Netlify (https://app.netlify.com/)

Konfigurasi produksi telah disiapkan secara otomatis:
- **File Konfigurasi:** `netlify.toml` dan `public/_redirects` (mendukung SPA fallback `/* -> /index.html 200`).
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`

### 2 Opsi Mudah Mengonlinekan ke Netlify:

#### Opsi A: Drag & Drop (Manual Deploy - Paling Cepat)
1. Buka [app.netlify.com](https://app.netlify.com/) dan login ke akun Netlify Anda.
2. Masuk ke menu **Sites** -> pilih **"Add new site"** -> pilih **"Deploy manually"**.
3. Tarik dan lepas (Drag & Drop) folder **`dist`** hasil kompilasi ke area dropzone Netlify.
4. Situs FinBiz langsung online dengan URL aktif (`.netlify.app`).

#### Opsi B: Sambungkan via Repository Git (GitHub / GitLab)
1. Push proyek ke repository GitHub Anda.
2. Di dashboard Netlify, pilih **"Import an existing project"** dan pilih repository GitHub Anda.
3. Konfigurasi build otomatis terdeteksi via `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Klik **Deploy Site**. Setiap kali Anda commit atau push, Netlify akan memperbarui web secara otomatis.

## 9. Panduan Mengaktifkan Google Auth (Google Sign-In Resmi)

Aplikasi FinBiz telah mendukung integrasi resmi **Google Identity Services (GIS)** dengan sistem fallback cerdas:
- **Status Saat Ini:** Tombol *"Login dengan Google"* sudah dapat digunakan langsung di situs Vercel (`https://finbiz-mantangai.vercel.app/`).
- **Untuk Memunculkan Popup Akun Google Riil (Google Cloud Console):**
  1. Buka [console.cloud.google.com](https://console.cloud.google.com/) dan login dengan akun Google Anda.
  2. Buka menu **APIs & Services** -> **Credentials**.
  3. Klik **Create Credentials** -> pilih **OAuth client ID**.
  4. Pilih Application type: **Web application**.
  5. Pada bagian **Authorized JavaScript origins**, tambahkan:
     - `https://finbiz-mantangai.vercel.app`
     - `http://localhost:3000` (untuk pengujian lokal)
  6. Klik **Create** dan salin **Client ID** yang diberikan (berakhiran `.apps.googleusercontent.com`).
  7. Di dashboard Vercel Anda:
     - Masuk ke proyek `finbiz-mantangai` -> **Settings** -> **Environment Variables**.
     - Tambahkan variabel: `VITE_GOOGLE_CLIENT_ID` dengan nilai Client ID yang disalin tadi.
     - Klik **Save** lalu lakukan **Redeploy**.
  8. Sekarang, setiap pengguna yang menekan tombol *"Login dengan Google"* akan disajikan jendela pemilih akun Google resmi dari browser mereka dan foto profil, nama, serta email asli mereka otomatis terisi ke dalam FinBiz!

---

*Dokumen ini merupakan catatan arsitektur resmi dan lengkap dari proyek FinBiz.*
