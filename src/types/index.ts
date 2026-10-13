export type ActiveTab = 'dashboard' | 'perencanaan' | 'pelaksanaan' | 'pelaporan' | 'masterdata' | 'pengaturan' | 'akun';

export interface UserProfile {
  name: string;
  businessName: string;
  businessType: string;
  currency: string;
  email: string;
  isLoggedIn: boolean;
  googleLinked: boolean;
  googleEmail?: string;
  avatarUrl?: string;

  // Identitas Lengkap Pengguna
  birthPlace?: string;        // Tempat Lahir
  birthDate?: string;         // Tanggal Lahir (YYYY-MM-DD)
  gender?: 'Laki-laki' | 'Perempuan' | ''; // Jenis Kelamin
  address?: string;           // Alamat Lengkap
  city?: string;              // Kota / Kabupaten
  province?: string;          // Provinsi
  postalCode?: string;        // Kode Pos
  phone?: string;             // Kontak Telepon / WhatsApp
  roleTitle?: string;         // Jabatan (misal: Pemilik Usaha / Direktur)
  nik?: string;               // Nomor Induk Kependudukan (NIK)

  // Keamanan Profil Tambahan
  enableAuthenticator?: boolean; // Autentikator 2FA
  enableFingerprint?: boolean;   // Sidik Jari / Biometrik
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'masuk' | 'keluar';
  amount: number;
  paymentMethod: 'Transfer Bank' | 'Tunai' | 'QRIS' | 'Giro';
  status: 'Terverifikasi' | 'Menunggu Bukti';
  receiptNo?: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  plannedAmount: number;
  realizedAmount: number;
  division: string;
  period: string;
}

export interface RevenueTarget {
  month: string;
  target: number;
  actual: number;
  notes: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  balance: number;
  type: 'Bank Operasional' | 'Kas Tunai' | 'Tabungan Pajak';
}

export interface FeatureControls {
  // Modul Utama
  enablePerencanaan: boolean;
  enablePelaksanaan: boolean;
  enablePelaporan: boolean;
  enableMasterData: boolean;

  // Dashboard
  showCashflowChart: boolean;
  showBudgetAbsorption: boolean;
  showUpcomingDueDates: boolean;
  showNetMarginKpi: boolean;

  // Perencanaan
  enableRevenueTargets: boolean;
  enableBepCalculator: boolean;
  enableNewBudgetCreation: boolean;

  // Pelaksanaan
  enableInvoiceGenerator: boolean;
  requireReceiptNumber: boolean;
  enableQrisPayment: boolean;

  // Pelaporan
  enableExportCsv: boolean;
  showTaxCalculation: boolean;
  showBalanceSheet: boolean;

  // Akses & Onboarding
  enableGoogleIntegration: boolean;
  autoShowAuthModalOnStart: boolean;

  // Tren Background 3D Transparan Interaktif (Bergulir & Geser-Geser)
  enableGlobal3DBackground: boolean;
  bg3DTheme: 'emerald' | 'cyan' | 'violet' | 'gold';
  bg3DSensitivity: number;
  bg3DAutoRotate: boolean;
  bg3DElementDensity: 'minimal' | 'balanced' | 'rich';
  glassCardOpacity: number;
}

// Master Data Folder & File Architecture
export type MasterFolderId = 'admin' | 'pengguna' | 'laporan' | 'audit' | 'backup' | 'urgen';

export type FileConfidentiality = 'Restricted' | 'Confidential' | 'Top Secret' | 'Internal';

export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json' | 'sql' | 'zip';

export interface MasterFileItem {
  id: string;
  name: string;
  folderId: MasterFolderId;
  description: string;
  size: string;
  format: ExportFormat;
  confidentiality: FileConfidentiality;
  updatedAt: string;
  recordCount: number;
  checksum: string;
  tags: string[];
}

export interface MasterFolderInfo {
  id: MasterFolderId;
  name: string;
  shortLabel: string;
  description: string;
  securityLevel: string;
  encryption: string;
  colorTheme: string;
  itemCount: number;
  totalSize: string;
  isUrgent?: boolean;
}

export interface AuditExportLog {
  id: string;
  timestamp: string;
  fileName: string;
  folderId: MasterFolderId;
  format: ExportFormat;
  authenticatedGoogleEmail: string;
  authMethod: 'Google SSO (GIS Verified)' | 'Google One-Tap' | 'Google OAuth Bearer';
  status: 'Approved' | 'Blocked' | 'Security Check Failed';
  ipAddress: string;
  deviceInfo: string;
}

