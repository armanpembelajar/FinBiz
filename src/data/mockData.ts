import { BudgetItem, RevenueTarget, Transaction, BankAccount, MasterFolderInfo, MasterFileItem, AuditExportLog } from '../types';

export const initialTransactions: Transaction[] = [
  {
    id: 'TX-2026-001',
    date: '2026-10-10',
    description: 'Penerimaan Penjualan Paket Grosir B2B Mitra Sejahtera',
    category: 'Penjualan Produk',
    type: 'masuk',
    amount: 14500000,
    paymentMethod: 'Transfer Bank',
    status: 'Terverifikasi',
    receiptNo: 'INV/2026/10/081'
  },
  {
    id: 'TX-2026-002',
    date: '2026-10-09',
    description: 'Pembelian Bahan Baku Utama Batch 4 dari Supplier Prima',
    category: 'Bahan Baku & HPP',
    type: 'keluar',
    amount: 6800000,
    paymentMethod: 'Transfer Bank',
    status: 'Terverifikasi',
    receiptNo: 'PO-9923'
  },
  {
    id: 'TX-2026-003',
    date: '2026-10-08',
    description: 'Penjualan Retail Kasir Toko & QRIS Pembayaran',
    category: 'Penjualan Produk',
    type: 'masuk',
    amount: 4250000,
    paymentMethod: 'QRIS',
    status: 'Terverifikasi',
    receiptNo: 'REC-1008-01'
  },
  {
    id: 'TX-2026-004',
    date: '2026-10-06',
    description: 'Biaya Iklan Digital Marketing Meta Ads & Google Ads',
    category: 'Pemasaran & Promosi',
    type: 'keluar',
    amount: 2500000,
    paymentMethod: 'Transfer Bank',
    status: 'Terverifikasi',
    receiptNo: 'INV-META-441'
  },
  {
    id: 'TX-2026-005',
    date: '2026-10-04',
    description: 'Biaya Logistik & Pengiriman Ekspedisi Pesanan Marketplace',
    category: 'Logistik & Distribusi',
    type: 'keluar',
    amount: 1150000,
    paymentMethod: 'Tunai',
    status: 'Terverifikasi',
    receiptNo: 'RESI-EXP-092'
  },
  {
    id: 'TX-2026-006',
    date: '2026-10-02',
    description: 'Pembayaran Utilitas Listrik PLN & Internet Kantor Usaha',
    category: 'Utilitas & Operasional',
    type: 'keluar',
    amount: 1850000,
    paymentMethod: 'Transfer Bank',
    status: 'Terverifikasi',
    receiptNo: 'PLN-202610-A'
  },
  {
    id: 'TX-2026-007',
    date: '2026-10-01',
    description: 'Pendapatan Jasa Konsultasi & Kustomisasi Produk',
    category: 'Pendapatan Jasa',
    type: 'masuk',
    amount: 5500000,
    paymentMethod: 'Transfer Bank',
    status: 'Menunggu Bukti',
    receiptNo: 'INV-SVC-012'
  }
];

export const initialBudgetItems: BudgetItem[] = [
  {
    id: 'BG-01',
    category: 'Bahan Baku & Persediaan',
    division: 'Produksi',
    plannedAmount: 25000000,
    realizedAmount: 16800000,
    period: 'Oktober 2026'
  },
  {
    id: 'BG-02',
    category: 'Gaji Karyawan & Upah Lembur',
    division: 'SDM & Operasional',
    plannedAmount: 28000000,
    realizedAmount: 28000000,
    period: 'Oktober 2026'
  },
  {
    id: 'BG-03',
    category: 'Pemasaran & Digital Campaign',
    division: 'Pemasaran',
    plannedAmount: 8500000,
    realizedAmount: 4900000,
    period: 'Oktober 2026'
  },
  {
    id: 'BG-04',
    category: 'Sewa Tempat & Utilitas Kantor',
    division: 'Umum & Fasilitas',
    plannedAmount: 7000000,
    realizedAmount: 5850000,
    period: 'Oktober 2026'
  },
  {
    id: 'BG-05',
    category: 'Perawatan Alat & Peralatan Usaha',
    division: 'Teknis & Aset',
    plannedAmount: 4000000,
    realizedAmount: 1200000,
    period: 'Oktober 2026'
  },
  {
    id: 'BG-06',
    category: 'Dana Cadangan & Kas Tak Terduga',
    division: 'Keuangan',
    plannedAmount: 5000000,
    realizedAmount: 800000,
    period: 'Oktober 2026'
  }
];

export const initialRevenueTargets: RevenueTarget[] = [
  { month: 'Juli 2026', target: 70000000, actual: 74500000, notes: 'Target tercapai 106% berkat promo tengah tahun' },
  { month: 'Agustus 2026', target: 75000000, actual: 78200000, notes: 'Penjualan B2B meningkat 12%' },
  { month: 'September 2026', target: 80000000, actual: 81900000, notes: 'Ekspansi saluran marketplace baru' },
  { month: 'Oktober 2026', target: 85000000, actual: 52250000, notes: 'Sedang berjalan (update s/d minggu ke-2)' }
];

export const initialBankAccounts: BankAccount[] = [
  {
    id: 'BA-01',
    bankName: 'Bank BCA Bisnis',
    accountNumber: '882-019-3310',
    accountHolder: 'CV Niaga Mandiri Utama',
    balance: 84350000,
    type: 'Bank Operasional'
  },
  {
    id: 'BA-02',
    bankName: 'Bank Mandiri Giro',
    accountNumber: '142-00-99812-7',
    accountHolder: 'CV Niaga Mandiri Utama',
    balance: 41200000,
    type: 'Bank Operasional'
  },
  {
    id: 'BA-03',
    bankName: 'Kas Tunai Kasir Toko',
    accountNumber: 'CASH-DRAWER-01',
    accountHolder: 'Petugas Kasir Shift 1 & 2',
    balance: 5850000,
    type: 'Kas Tunai'
  },
  {
    id: 'BA-04',
    bankName: 'Tabungan Pajak & Cadangan BRI',
    accountNumber: '0206-01-002931-50-8',
    accountHolder: 'CV Niaga Mandiri Utama',
    balance: 22500000,
    type: 'Tabungan Pajak'
  }
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export const defaultFeatureControls = {
  // Modul Utama
  enablePerencanaan: true,
  enablePelaksanaan: true,
  enablePelaporan: true,
  enableMasterData: true,

  // Dashboard
  showCashflowChart: true,
  showBudgetAbsorption: true,
  showUpcomingDueDates: true,
  showNetMarginKpi: true,

  // Perencanaan
  enableRevenueTargets: true,
  enableBepCalculator: true,
  enableNewBudgetCreation: true,

  // Pelaksanaan
  enableInvoiceGenerator: true,
  requireReceiptNumber: false,
  enableQrisPayment: true,

  // Pelaporan
  enableExportCsv: true,
  showTaxCalculation: true,
  showBalanceSheet: true,

  // Akses & Onboarding
  enableGoogleIntegration: true,
  autoShowAuthModalOnStart: true,

  // Tren Background 3D Transparan Interaktif
  enableGlobal3DBackground: false,
  bg3DTheme: 'emerald' as const,
  bg3DSensitivity: 1.2,
  bg3DAutoRotate: true,
  bg3DElementDensity: 'balanced' as const,
  glassCardOpacity: 50,
};

export const initialMasterFolders: MasterFolderInfo[] = [
  {
    id: 'admin',
    name: 'Folder Master Admin',
    shortLabel: 'Admin & Hak Akses',
    description: 'Konfigurasi master administrator, hak akses privilege, kredensial hash terenkripsi, dan peran tingkat tinggi.',
    securityLevel: 'Level 5 (Super Admin Only)',
    encryption: 'AES-256 + Argon2id',
    colorTheme: 'rose',
    itemCount: 4,
    totalSize: '4.8 MB',
    isUrgent: false,
  },
  {
    id: 'pengguna',
    name: 'Folder Master Pengguna',
    shortLabel: 'Direktori Karyawan & User',
    description: 'Database master akun pengguna, status verifikasi (NIK, email, biometrik sidik jari, 2FA), dan divisi kerja.',
    securityLevel: 'Level 4 (Strict Confidential)',
    encryption: 'AES-256 GCM',
    colorTheme: 'blue',
    itemCount: 5,
    totalSize: '12.4 MB',
    isUrgent: false,
  },
  {
    id: 'laporan',
    name: 'Folder Laporan Keuangan',
    shortLabel: 'Arsip Fiskal & Laporan',
    description: 'Arsip master laporan neraca saldo, laba rugi komprehensif, arus kas riil, dan rekapitulasi PPh final PP 55/2022.',
    securityLevel: 'Level 4 (Strict Financial)',
    encryption: 'AES-256 GCM',
    colorTheme: 'emerald',
    itemCount: 6,
    totalSize: '38.2 MB',
    isUrgent: false,
  },
  {
    id: 'audit',
    name: 'Folder Log / Audit Trail',
    shortLabel: 'Log Forensik & Aktivitas',
    description: 'Catatan forensik riwayat aktivitas sistem, log transaksi, rekam jejak ekspor data sensitif, dan log otentikasi IP.',
    securityLevel: 'Level 4 (Forensic Audit)',
    encryption: 'Immutable Append-Only Log',
    colorTheme: 'amber',
    itemCount: 5,
    totalSize: '84.6 MB',
    isUrgent: false,
  },
  {
    id: 'backup',
    name: 'Folder Backup & Restore',
    shortLabel: 'Cadangan & Pemulihan Sistem',
    description: 'Snapshot berkas cadangan database SQL/JSON, checkpoint pemulihan sistem instan, dan arsip terkompresi.',
    securityLevel: 'Level 5 (Disaster Recovery)',
    encryption: 'AES-256 Multi-layer Key',
    colorTheme: 'purple',
    itemCount: 4,
    totalSize: '215.0 MB',
    isUrgent: true,
  },
  {
    id: 'urgen',
    name: 'Folder Berkas Urgen & Legalitas',
    shortLabel: 'Dokumen Legal & Sensitif',
    description: 'Berkas perizinan NIB, NPWP badan usaha, perjanjian kerjasama rahasia (NDA), sertifikat digital, dan faktur pajak sensitif.',
    securityLevel: 'Level 5 (Top Secret Legal)',
    encryption: 'Hardware Token + AES-256',
    colorTheme: 'red',
    itemCount: 4,
    totalSize: '54.1 MB',
    isUrgent: true,
  },
];

export const initialMasterFiles: MasterFileItem[] = [
  // Folder Admin
  {
    id: 'FILE-ADM-01',
    name: 'Master_Daftar_Administrator_Sistem.csv',
    folderId: 'admin',
    description: 'Daftar lengkap akun Super Admin dan Admin Operasional beserta hak akses modul.',
    size: '142 KB',
    format: 'csv',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-12 10:45',
    recordCount: 6,
    checksum: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    tags: ['Admin', 'Privilege', 'Master Akun']
  },
  {
    id: 'FILE-ADM-02',
    name: 'Matriks_Role_Permission_RBAC.xlsx',
    folderId: 'admin',
    description: 'Tabel izin granular per peran (Super Admin, Manajer Keuangan, Kasir, Auditor).',
    size: '420 KB',
    format: 'xlsx',
    confidentiality: 'Top Secret',
    updatedAt: '2026-10-11 16:30',
    recordCount: 24,
    checksum: 'sha256:c98c614102170e4c6c9a2c3a5b9c02ff4b44558e6587c4a1796695669f52bfd5',
    tags: ['RBAC', 'Keamanan', 'Akses']
  },
  {
    id: 'FILE-ADM-03',
    name: 'Protokol_Keamanan_Kredensial_Sistem.pdf',
    folderId: 'admin',
    description: 'Dokumen SOP kebijakan rotasi kunci, autentikasi dua faktor wajib, dan isolasi root.',
    size: '1.2 MB',
    format: 'pdf',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-08 09:15',
    recordCount: 18,
    checksum: 'sha256:4d60232d3989c9dfa5eb57262c5b4e3be664879b6348d42d385f0962319ef2a2',
    tags: ['SOP', 'Kredensial', 'Kebijakan']
  },
  {
    id: 'FILE-ADM-04',
    name: 'Admin_Master_Config_Bundle.json',
    folderId: 'admin',
    description: 'Dump konfigurasi parameter global sistem, endpoint keamanan, dan batasan rate-limit.',
    size: '88 KB',
    format: 'json',
    confidentiality: 'Top Secret',
    updatedAt: '2026-10-12 08:00',
    recordCount: 1,
    checksum: 'sha256:1a8565a9dc72048ba03b4156be3e569f22771f23aec6a50172e4632177310b46',
    tags: ['Konfigurasi', 'Sistem', 'Global']
  },

  // Folder Pengguna
  {
    id: 'FILE-USR-01',
    name: 'Master_Direktori_Pengguna_Karyawan.csv',
    folderId: 'pengguna',
    description: 'Data induk karyawan, NIK terverifikasi, status 2FA, biometrik sidik jari, dan email SSO.',
    size: '385 KB',
    format: 'csv',
    confidentiality: 'Confidential',
    updatedAt: '2026-10-12 11:00',
    recordCount: 48,
    checksum: 'sha256:44243cd6e25f883da0111f1ec76e074be1d9c57f7ebae0d0b04c8651a80d5073',
    tags: ['Karyawan', 'Identitas', 'NIK']
  },
  {
    id: 'FILE-USR-02',
    name: 'Rekap_Status_Verifikasi_Biometrik_2FA.xlsx',
    folderId: 'pengguna',
    description: 'Tabel status kepatuhan keamanan profil (Autentikator TOTP aktif, Sidik Jari terdaftar).',
    size: '512 KB',
    format: 'xlsx',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-11 18:20',
    recordCount: 48,
    checksum: 'sha256:b8106198f79f22fd726f497be11f5dff7f2b1c4161bb0e9b6a37a6b7d2bf16a2',
    tags: ['2FA', 'Biometrik', 'Verifikasi']
  },
  {
    id: 'FILE-USR-03',
    name: 'Buku_Induk_Divisi_Departemen.pdf',
    folderId: 'pengguna',
    description: 'Struktur organisasi dan pembagian wewenang penanggung jawab kas operasional.',
    size: '2.1 MB',
    format: 'pdf',
    confidentiality: 'Internal',
    updatedAt: '2026-10-05 14:00',
    recordCount: 12,
    checksum: 'sha256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    tags: ['Divisi', 'Organisasi', 'Departemen']
  },
  {
    id: 'FILE-USR-04',
    name: 'Master_Tautan_Akun_Google_SSO.csv',
    folderId: 'pengguna',
    description: 'Daftar alamat akun Google terverifikasi yang memiliki izin unduh dan sinkronisasi berkas.',
    size: '95 KB',
    format: 'csv',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-12 10:15',
    recordCount: 32,
    checksum: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    tags: ['Google SSO', 'Otentikasi', 'Whitelisting']
  },
  {
    id: 'FILE-USR-05',
    name: 'Snapshot_User_Registry_Database.json',
    folderId: 'pengguna',
    description: 'Struktur serialisasi data profil pengguna untuk portabilitas dan audit lintas server.',
    size: '1.4 MB',
    format: 'json',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-10 23:59',
    recordCount: 48,
    checksum: 'sha256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    tags: ['JSON', 'Registry', 'Backup']
  },

  // Folder Laporan Keuangan
  {
    id: 'FILE-LAP-01',
    name: 'Master_Buku_Besar_Keuangan_2026.xlsx',
    folderId: 'laporan',
    description: 'Buku besar lengkap seluruh mutasi kas, bank, piutang, dan utang operasional tahun berjalan.',
    size: '8.4 MB',
    format: 'xlsx',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-12 11:02',
    recordCount: 1420,
    checksum: 'sha256:5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',
    tags: ['Buku Besar', 'Akuntansi', 'Kas']
  },
  {
    id: 'FILE-LAP-02',
    name: 'Laporan_Laba_Rugi_Komprehensif_Q3_2026.pdf',
    folderId: 'laporan',
    description: 'Rekapitulasi penjualan kotor, HPP, beban operasional, dan margin laba bersih audit.',
    size: '3.1 MB',
    format: 'pdf',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-10 17:30',
    recordCount: 1,
    checksum: 'sha256:2c624232cdd221771294dfbb310aca000a0df6ac8b66b696d90ef9f8da173e6c',
    tags: ['Laba Rugi', 'P&L', 'Kuartal 3']
  },
  {
    id: 'FILE-LAP-03',
    name: 'Master_Rekap_Pajak_PPh_Final_PP55.csv',
    folderId: 'laporan',
    description: 'Kalkulasi setor PPh Final 0.5% per bulan, kode billing, dan validasi NTPN perpajakan.',
    size: '220 KB',
    format: 'csv',
    confidentiality: 'Confidential',
    updatedAt: '2026-10-11 09:00',
    recordCount: 12,
    checksum: 'sha256:19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7',
    tags: ['Pajak', 'PPh Final', 'PP 55']
  },
  {
    id: 'FILE-LAP-04',
    name: 'Laporan_Posisi_Keuangan_Neraca_Saldo.pdf',
    folderId: 'laporan',
    description: 'Penyajian aset lancar, kas bank, perlengkapan, liabilitas jangka pendek, dan ekuitas modal.',
    size: '2.8 MB',
    format: 'pdf',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-09 11:20',
    recordCount: 1,
    checksum: 'sha256:6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    tags: ['Neraca', 'Aset', 'Liabilitas']
  },
  {
    id: 'FILE-LAP-05',
    name: 'Rekapitulasi_Arus_Kas_Riil_FinBiz.csv',
    folderId: 'laporan',
    description: 'Laporan arus kas masuk dan kas keluar dengan segmentasi operasional, investasi, dan pendanaan.',
    size: '640 KB',
    format: 'csv',
    confidentiality: 'Confidential',
    updatedAt: '2026-10-12 07:45',
    recordCount: 520,
    checksum: 'sha256:d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    tags: ['Arus Kas', 'Cashflow', 'Operasional']
  },
  {
    id: 'FILE-LAP-06',
    name: 'Rekonsiliasi_Bank_BCA_Mandiri_BRI.xlsx',
    folderId: 'laporan',
    description: 'Pencocokan saldo rekening koran bank operasional dengan catatan kas kasir sistem FinBiz.',
    size: '1.9 MB',
    format: 'xlsx',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-12 09:10',
    recordCount: 380,
    checksum: 'sha256:4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    tags: ['Rekonsiliasi', 'Bank', 'Giro']
  },

  // Folder Log / Audit
  {
    id: 'FILE-AUD-01',
    name: 'Master_Audit_Trail_Transaksi_FinBiz.csv',
    folderId: 'audit',
    description: 'Rekam jejak forensik setiap pembuatan, pengubahan, dan verifikasi nota transaksi kas.',
    size: '12.8 MB',
    format: 'csv',
    confidentiality: 'Top Secret',
    updatedAt: '2026-10-12 11:04',
    recordCount: 2840,
    checksum: 'sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    tags: ['Forensik', 'Audit Trail', 'Mutasi']
  },
  {
    id: 'FILE-AUD-02',
    name: 'Rekam_Jejak_Otentikasi_Login_SSO.csv',
    folderId: 'audit',
    description: 'Log riwayat sesi masuk, verifikasi OTP email, token Google GIS SSO, dan deteksi brute-force.',
    size: '4.5 MB',
    format: 'csv',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-12 10:55',
    recordCount: 960,
    checksum: 'sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    tags: ['Keamanan', 'Login', 'Google SSO']
  },
  {
    id: 'FILE-AUD-03',
    name: 'Log_Pemeriksaan_Integritas_Data.pdf',
    folderId: 'audit',
    description: 'Laporan hasil verifikasi checksum harian, validasi saldo neraca, dan deteksi anomali.',
    size: '1.8 MB',
    format: 'pdf',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-12 06:00',
    recordCount: 1,
    checksum: 'sha256:bc36789e7a1e2814342a0f357f86ecd816dd80a861f43473a3bc96282d00a00e',
    tags: ['Integritas', 'Checksum', 'Anomali']
  },
  {
    id: 'FILE-AUD-04',
    name: 'Audit_Ekspor_Berkas_Sensitif_Master.csv',
    folderId: 'audit',
    description: 'Catatan pengunduhan berkas rahasia lengkap dengan timestamp, format, email Google, dan IP address.',
    size: '890 KB',
    format: 'csv',
    confidentiality: 'Top Secret',
    updatedAt: '2026-10-12 11:00',
    recordCount: 145,
    checksum: 'sha256:f123b9876543210fedcba9876543210fedcba9876543210fedcba9876543210f',
    tags: ['Ekspor', 'Google SSO', 'Audit Unduh']
  },
  {
    id: 'FILE-AUD-05',
    name: 'System_Security_Events_Dump.json',
    folderId: 'audit',
    description: 'Ekstraksi peristiwa keamanan sistem dari Web Application Firewall dan filter rate limit.',
    size: '6.2 MB',
    format: 'json',
    confidentiality: 'Top Secret',
    updatedAt: '2026-10-11 23:59',
    recordCount: 1250,
    checksum: 'sha256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    tags: ['Security', 'WAF', 'Events']
  },

  // Folder Backup / Restore
  {
    id: 'FILE-BCK-01',
    name: 'FinBiz_Master_Database_Full_Snapshot.sql',
    folderId: 'backup',
    description: 'Cadangan penuh struktur skema tabel, relasi foreign key, indeks, dan seluruh data transaksional.',
    size: '148.5 MB',
    format: 'sql',
    confidentiality: 'Top Secret',
    updatedAt: '2026-10-12 04:00',
    recordCount: 52000,
    checksum: 'sha256:d82c4b75276d0cf973305b684348b67cf17b12f66ab4a7968b52c9ab9430f69d',
    tags: ['SQL', 'Database Dump', 'Full Backup']
  },
  {
    id: 'FILE-BCK-02',
    name: 'FinBiz_State_Snapshot_CheckPoint.json',
    folderId: 'backup',
    description: 'Keadaan state aplikasi (anggaran RAB, target omzet, profil usaha, preferensi fitur).',
    size: '18.2 MB',
    format: 'json',
    confidentiality: 'Top Secret',
    updatedAt: '2026-10-12 11:00',
    recordCount: 1,
    checksum: 'sha256:02c42fc26757e77f159a70952f419417f6f8292c485381be7b541d19d37404b2',
    tags: ['JSON', 'State', 'Restore Point']
  },
  {
    id: 'FILE-BCK-03',
    name: 'Arsip_Mingguan_FinBiz_Encrypted_Bundle.zip',
    folderId: 'backup',
    description: 'Paket arsip terkompresi terenkripsi AES-256 yang berisi seluruh nota kwitansi dan berkas transaksi.',
    size: '42.0 MB',
    format: 'zip',
    confidentiality: 'Top Secret',
    updatedAt: '2026-10-11 00:00',
    recordCount: 380,
    checksum: 'sha256:e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683',
    tags: ['ZIP', 'AES-256', 'Kwitansi']
  },
  {
    id: 'FILE-BCK-04',
    name: 'Disaster_Recovery_Plan_Manual.pdf',
    folderId: 'backup',
    description: 'Panduan teknis langkah pemulihan cepat (*Recovery Point Objective* < 15 menit).',
    size: '6.3 MB',
    format: 'pdf',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-01 10:00',
    recordCount: 28,
    checksum: 'sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    tags: ['Disaster Recovery', 'SOP', 'Pemulihan']
  },

  // Folder Urgen & Legalitas
  {
    id: 'FILE-URG-01',
    name: 'NIB_SIUP_Legalitas_Usaha_Resmi.pdf',
    folderId: 'urgen',
    description: 'Nomor Induk Berusaha (NIB) berbasis risiko dan perizinan berusaha kementerian investasi.',
    size: '4.8 MB',
    format: 'pdf',
    confidentiality: 'Top Secret',
    updatedAt: '2026-10-05 11:00',
    recordCount: 1,
    checksum: 'sha256:2b2432c74d32a0c6414704e9c7028faab5e85718dfb7d60ffaa60b29c9ef4ec4',
    tags: ['Legalitas', 'NIB', 'Izin Usaha']
  },
  {
    id: 'FILE-URG-02',
    name: 'NPWP_Badan_Usaha_SKT_Pajak.pdf',
    folderId: 'urgen',
    description: 'Surat Keterangan Terdaftar (SKT) Pajak dan Kartu NPWP resmi badan usaha UMKM.',
    size: '2.4 MB',
    format: 'pdf',
    confidentiality: 'Top Secret',
    updatedAt: '2026-10-05 11:30',
    recordCount: 1,
    checksum: 'sha256:7b52009b64fd0a2a49e6d8a939753077792b0554aca5080a66d525d726a57ac2',
    tags: ['Pajak', 'NPWP', 'SKT']
  },
  {
    id: 'FILE-URG-03',
    name: 'Perjanjian_Kemitraan_B2B_Kerahasiaan_NDA.pdf',
    folderId: 'urgen',
    description: 'Akta perjanjian pasokan barang, klausul kerahasiaan dagang, dan jaminan pasokan bahan baku.',
    size: '6.7 MB',
    format: 'pdf',
    confidentiality: 'Top Secret',
    updatedAt: '2026-10-08 15:40',
    recordCount: 1,
    checksum: 'sha256:3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
    tags: ['Perjanjian', 'NDA', 'Kemitraan']
  },
  {
    id: 'FILE-URG-04',
    name: 'Sertifikat_Digital_Elektronik_KBLI.pdf',
    folderId: 'urgen',
    description: 'Sertifikasi standar kelayakan usaha, sertifikat digital PSE, dan sertifikasi halal UMKM.',
    size: '3.9 MB',
    format: 'pdf',
    confidentiality: 'Restricted',
    updatedAt: '2026-10-09 14:15',
    recordCount: 1,
    checksum: 'sha256:f52fbd32b2b3b86ff88ef6c490628285f482af15ddcb29541f94bcf526a3f6c7',
    tags: ['Sertifikasi', 'Digital', 'Halal']
  },
];

export const initialAuditExportLogs: AuditExportLog[] = [
  {
    id: 'AUD-EXP-901',
    timestamp: '2026-10-12 10:45:12',
    fileName: 'Master_Daftar_Administrator_Sistem.csv',
    folderId: 'admin',
    format: 'csv',
    authenticatedGoogleEmail: 'sdn1.mantangaitengah@gmail.com',
    authMethod: 'Google SSO (GIS Verified)',
    status: 'Approved',
    ipAddress: '182.253.112.44 (Jakarta)',
    deviceInfo: 'Chrome 131 on Desktop macOS'
  },
  {
    id: 'AUD-EXP-902',
    timestamp: '2026-10-12 09:12:04',
    fileName: 'Master_Buku_Besar_Keuangan_2026.xlsx',
    folderId: 'laporan',
    format: 'xlsx',
    authenticatedGoogleEmail: 'armandmtg@gmail.com',
    authMethod: 'Google SSO (GIS Verified)',
    status: 'Approved',
    ipAddress: '114.125.80.19 (Surabaya)',
    deviceInfo: 'Edge 130 on Windows 11'
  },
  {
    id: 'AUD-EXP-903',
    timestamp: '2026-10-11 16:30:48',
    fileName: 'Master_Direktori_Pengguna_Karyawan.csv',
    folderId: 'pengguna',
    format: 'csv',
    authenticatedGoogleEmail: 'sdn1.mantangaitengah@gmail.com',
    authMethod: 'Google SSO (GIS Verified)',
    status: 'Approved',
    ipAddress: '182.253.112.44 (Jakarta)',
    deviceInfo: 'Chrome 131 on Desktop macOS'
  },
  {
    id: 'AUD-EXP-904',
    timestamp: '2026-10-11 11:20:19',
    fileName: 'FinBiz_State_Snapshot_CheckPoint.json',
    folderId: 'backup',
    format: 'json',
    authenticatedGoogleEmail: 'armandmtg@gmail.com',
    authMethod: 'Google SSO (GIS Verified)',
    status: 'Approved',
    ipAddress: '114.125.80.19 (Surabaya)',
    deviceInfo: 'Safari 18 on iPad Pro'
  }
];

