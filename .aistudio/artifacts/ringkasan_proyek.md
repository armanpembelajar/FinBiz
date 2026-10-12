# Ringkasan Proyek Utuh: FinBiz - Manajemen Keuangan Bisnis & UMKM

> **Tanggal Pembaruan Terakhir:** Senin, 12 Oktober 2026  
> **Status Sistem:** Live Online & 100% Siap Ditimpa ke Repositori Asli (Production Ready)  
> **URL Produksi:** [https://finbiz-mantangai.vercel.app/](https://finbiz-mantangai.vercel.app/)  
> **Repository GitHub:** [https://github.com/armanpembelajar/FinBiz](https://github.com/armanpembelajar/FinBiz)  
> **Versi Tata Letak:** v3.1 (Portal Beranda Kokoh, Bersih & Arsitektur Banner-Centric)  
> **Lisensi:** Apache-2.0

---

## TIPS: Pedoman Perintah Sesi Pengembang

> ### TIPS:
> **Dorongan untuk 2 kebiasaan penting:**
> - **Awal sesi:** `"Tolong pelajari ringkasan_proyek.md dan,tidak merubah pekerjaan yang ada"`
> - **Akhir sesi:** `"Perbarui ringkasan_proyek.md dengan yang sudah dikerjakan hari ini"`

---

## 1. Status Kesiapan Timpa Proyek (Overwrite Readiness)

Proyek ini **100% SIAP DAN AMAN UNTUK DITIMPA LANGSUNG** ke folder proyek lokal Anda yang terhubung dengan GitHub dan Vercel:

1. **Halaman Depan Kembali Asli & Elegan:**
   - Model kartu ganda yang tidak diinginkan telah ditiadakan.
   - Panggung 3D Interaktif Three.js (emerald, rich particles, auto-rotation & reactive mouse) berjalan mulus.
   - Kartu 1 (Formulir Pendaftaran & Google SSO) -> Popup Konfirmasi -> Animasi Flip Card 3D -> Kartu 2 (Verifikasi Kode OTP 6-Digit `8 4 2 9 1 0`).
   - Kapsul footer identitas resmi: `FinBiz Keuangan` · `Versi Sistem v3.1 Enterprise` (kiri) dan `Kreator App Mantangai` · `Uluh Lewu Dayak` (kanan).

2. **Google OAuth & Sistem Akun Terpadu:**
   - Integrasi Google Identity Services (GIS) siap dengan dukungan `VITE_GOOGLE_CLIENT_ID`.
   - Modul **Akun** mengelola profil lengkap, foto avatar, data usaha, dan penautan akun dengan aman.

3. **5 Modul Finansial Lengkap & Bebas Redundansi:**
   - **Dashboard:** Portal Beranda bersih, utuh, dan kokoh tanpa tombol/dropdown input pemantauan.
   - **Perencanaan:** RAB & Analisis BEP (Break Even Point).
   - **Pelaksanaan:** Pusat pencatatan kas jurnal, filter pembayaran, dan cetak nota.
   - **Pelaporan:** Laba Rugi, Neraca Keuangan, dan PPh Final UMKM 0.5% (PP 55/2022).
   - **Pengaturan:** Konfigurasi master saklar fitur dan rekening bank.

4. **Validasi Build:**
   - Kompilasi TypeScript (`npx tsc --noEmit`) : **0 Error**
   - Kompilasi Vite Bundle (`npm run build`) : **0 Error (Build Succeeded)**

---

## 2. Panduan Langkah Menimpa ke Folder Proyek Sebenarnya

### Langkah 1: Siapkan File yang Akan Ditimpa
Salin seluruh isi folder dan file berikut ke dalam folder proyek lokal Anda di laptop:
- `src/` (seluruh komponen, data, dan tipe)
- `public/` (aset statis dan redirect)
- `index.html`
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `vercel.json` & `netlify.toml`

> ⚠️ **Catatan Penting:** 
> - **JANGAN** menghapus folder `.git/` di komputer Anda agar koneksi Git ke GitHub tetap tersambung.
> - **JANGAN** menimpa file `.env` lokal jika Anda sudah menyimpan konfigurasi API key pribadi Anda di sana.

### Langkah 2: Jalankan di Terminal Komputer Anda (VS Code / CMD / PowerShell)
Jika saat menjalankan `npm install` muncul pesan error ERESOLVE (seperti konflik esbuild/vite):
```bash
npm install --legacy-peer-deps
```

Untuk menguji coba secara lokal:
```bash
npm run dev
```
*(Buka browser di http://localhost:3000)*

Untuk melakukan pemeriksaan tipe TypeScript tanpa error cmd/PowerShell:
```bash
npx tsc --noEmit
```

### Langkah 3: Push Pembaruan ke GitHub & Vercel
Setelah diuji di laptop dan berjalan normal, lakukan push ke GitHub:
```bash
git add .
git commit -m "feat: sinkronisasi finbiz v3.1 landing page asli dan modul keuangan utuh"
git push origin main
```
Setelah push selesai, Vercel (`finbiz-mantangai.vercel.app`) akan mendeteksi commit baru dan otomatis memperbarui website yang sedang online dalam hitungan detik!

---

*Dokumen ini merupakan catatan arsitektur resmi dan panduan sinkronisasi proyek FinBiz.*
