import { BudgetItem, RevenueTarget, Transaction, BankAccount } from '../types';

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

