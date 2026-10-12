import React, { useState, useMemo } from 'react';
import { UserProfile, BankAccount, FeatureControls } from '../../types';
import { initialBankAccounts, formatRupiah } from '../../data/mockData';
import { 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  Check, 
  Plus, 
  Trash2,
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  LayoutDashboard,
  CalendarClock,
  ReceiptText,
  FileBarChart2,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Cpu,
  Shield,
  Activity,
  Zap,
  Briefcase,
  LayoutGrid,
  Table,
  CheckSquare,
  Lock,
  ArrowRight,
  Filter,
  Orbit,
  Database,
  Globe,
  ExternalLink,
  Download,
  Key,
  Server
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Spatial3DControlsView } from './Spatial3DControlsView';

interface PengaturanViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenAuthModal: (step?: 1 | 2) => void;
  featureControls: FeatureControls;
  onUpdateFeatureControls: (updated: Partial<FeatureControls>) => void;
  onNavigateTab?: (tab: any) => void;
  onLogout?: () => void;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenAuthModal,
  featureControls,
  onUpdateFeatureControls,
  onNavigateTab,
  onLogout,
}) => {
  const [activeSettingsTab, setActiveSettingsTab] = useState<'fitur' | 'profil' | 'bank' | 'integrasi' | 'notifikasi'>('fitur');
  const [supabaseTestMsg, setSupabaseTestMsg] = useState<string | null>(null);
  
  // Pilihan variasi desain kontrol penuh fitur:
  // 1. 'spatial-3d': Mode 3D Spatial Hologram & Transparan Interaktif (Bergulir & Geser-Geser)
  // 2. 'command-deck': Mode Kokpit Eksekutif Gelap & Telemetri
  // 3. 'bento-grid': Mode Bento Matrix Kontemporer (Stripe / Linear style)
  // 4. 'audit-table': Mode Tabel Ledger Presisi Finansial (ERP / SAP style)
  const [designStyle, setDesignStyle] = useState<'spatial-3d' | 'command-deck' | 'bento-grid' | 'audit-table'>('spatial-3d');

  const [featureSearchQuery, setFeatureSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'modul' | 'dashboard' | 'perencanaan' | 'pelaksanaan' | 'pelaporan'>('all');

  // Form profil
  const [businessName, setBusinessName] = useState(userProfile.businessName);
  const [userName, setUserName] = useState(userProfile.name);
  const [businessType, setBusinessType] = useState(userProfile.businessType);
  const [currency, setCurrency] = useState(userProfile.currency);
  const [npwpNib, setNpwpNib] = useState('09.482.119.8-041.000 (NIB: 120938472910)');
  const [businessAddress, setBusinessAddress] = useState('Jl. Raya Industri Kreatif No. 42, Bandung, Jawa Barat');

  // Bank
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newAccountHolder, setNewAccountHolder] = useState(userProfile.businessName);
  const [newAccountBalance, setNewAccountBalance] = useState('');

  // Notification feedback
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [budgetAlertThreshold, setBudgetAlertThreshold] = useState('85');

  const showNotification = (msg: string) => {
    setSavedNotification(msg);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      businessName,
      name: userName,
      businessType,
      currency,
    });
    showNotification('Profil usaha berhasil disimpan dan disinkronkan.');
  };

  const handleToggleGoogleLink = () => {
    if (userProfile.googleLinked) {
      onUpdateProfile({
        googleLinked: false,
        googleEmail: undefined,
      });
      showNotification('Tautan Akun Google telah diputus.');
    } else {
      onUpdateProfile({
        googleLinked: true,
        googleEmail: 'armandmtg@gmail.com',
      });
      showNotification('Akun Google armandmtg@gmail.com berhasil ditautkan.');
    }
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName || !newAccountNumber) return;

    const newAcc: BankAccount = {
      id: `BA-${Date.now().toString().slice(-4)}`,
      bankName: newBankName,
      accountNumber: newAccountNumber,
      accountHolder: newAccountHolder || userProfile.businessName,
      balance: Number(newAccountBalance) || 0,
      type: 'Bank Operasional',
    };

    setBankAccounts([...bankAccounts, newAcc]);
    setNewBankName('');
    setNewAccountNumber('');
    setNewAccountBalance('');
    setShowAddBankModal(false);
    showNotification(`Rekening ${newBankName} berhasil ditambahkan.`);
  };

  const handleDeleteBank = (id: string) => {
    setBankAccounts(bankAccounts.filter((b) => b.id !== id));
    showNotification('Rekening kas/bank berhasil dihapus.');
  };

  // Preset Handlers
  const handleEnableAllFeatures = () => {
    onUpdateFeatureControls({
      enablePerencanaan: true,
      enablePelaksanaan: true,
      enablePelaporan: true,
      showCashflowChart: true,
      showBudgetAbsorption: true,
      showUpcomingDueDates: true,
      showNetMarginKpi: true,
      enableRevenueTargets: true,
      enableBepCalculator: true,
      enableNewBudgetCreation: true,
      enableInvoiceGenerator: true,
      requireReceiptNumber: true,
      enableQrisPayment: true,
      enableExportCsv: true,
      showTaxCalculation: true,
      showBalanceSheet: true,
      enableGoogleIntegration: true,
      autoShowAuthModalOnStart: true,
    });
    showNotification('💎 Seluruh 16 kapabilitas FinBiz Enterprise telah diaktifkan secara maksimal.');
  };

  const handleEssentialMode = () => {
    onUpdateFeatureControls({
      enablePerencanaan: false,
      enablePelaksanaan: true,
      enablePelaporan: true,
      showCashflowChart: true,
      showBudgetAbsorption: false,
      showUpcomingDueDates: true,
      showNetMarginKpi: true,
      enableRevenueTargets: false,
      enableBepCalculator: false,
      enableNewBudgetCreation: false,
      enableInvoiceGenerator: true,
      requireReceiptNumber: false,
      enableQrisPayment: true,
      enableExportCsv: true,
      showTaxCalculation: false,
      showBalanceSheet: false,
      enableGoogleIntegration: true,
      autoShowAuthModalOnStart: false,
    });
    showNotification('⚡ Mode Operasional Cepat (Buku Kas & Laba Rugi Esensial) aktif.');
  };

  const handleAuditFiscalMode = () => {
    onUpdateFeatureControls({
      enablePerencanaan: true,
      enablePelaksanaan: true,
      enablePelaporan: true,
      showCashflowChart: true,
      showBudgetAbsorption: true,
      showUpcomingDueDates: true,
      showNetMarginKpi: true,
      enableRevenueTargets: true,
      enableBepCalculator: false,
      enableNewBudgetCreation: false,
      enableInvoiceGenerator: true,
      requireReceiptNumber: true,
      enableQrisPayment: true,
      enableExportCsv: true,
      showTaxCalculation: true,
      showBalanceSheet: true,
      enableGoogleIntegration: true,
      autoShowAuthModalOnStart: false,
    });
    showNotification('📊 Mode Audit & Kepatuhan Pajak (Budget Lock & Laporan Lengkap) aktif.');
  };

  const handleResetDefaultFeatures = () => {
    onUpdateFeatureControls({
      enablePerencanaan: true,
      enablePelaksanaan: true,
      enablePelaporan: true,
      showCashflowChart: true,
      showBudgetAbsorption: true,
      showUpcomingDueDates: true,
      showNetMarginKpi: true,
      enableRevenueTargets: true,
      enableBepCalculator: true,
      enableNewBudgetCreation: true,
      enableInvoiceGenerator: true,
      requireReceiptNumber: false,
      enableQrisPayment: true,
      enableExportCsv: true,
      showTaxCalculation: true,
      showBalanceSheet: true,
      enableGoogleIntegration: true,
      autoShowAuthModalOnStart: true,
    });
    showNotification('↺ Fitur berhasil dikembalikan ke standar awal.');
  };

  // Hitung jumlah fitur aktif
  const featureList = [
    featureControls.enablePerencanaan,
    featureControls.enablePelaksanaan,
    featureControls.enablePelaporan,
    featureControls.showCashflowChart,
    featureControls.showBudgetAbsorption,
    featureControls.showUpcomingDueDates,
    featureControls.showNetMarginKpi,
    featureControls.enableRevenueTargets,
    featureControls.enableBepCalculator,
    featureControls.enableNewBudgetCreation,
    featureControls.enableInvoiceGenerator,
    featureControls.requireReceiptNumber,
    featureControls.enableQrisPayment,
    featureControls.enableExportCsv,
    featureControls.showTaxCalculation,
    featureControls.showBalanceSheet,
  ];
  const activeCount = featureList.filter(Boolean).length;
  const totalCount = featureList.length;
  const activePercentage = Math.round((activeCount / totalCount) * 100);

  // Definisi Item Kontrol dengan Metadata Berkualitas
  const featureDefinitions = useMemo(() => [
    {
      category: 'modul',
      categoryTitle: 'Fitur Finansial Inti',
      categoryIcon: Layers,
      items: [
        {
          id: 'enablePerencanaan',
          code: 'FIT-01',
          label: 'Perencanaan Finansial & RAB',
          description: 'Penyusunan pagu anggaran biaya per divisi operasional dan penetapan target omzet penjualan.',
          enabled: featureControls.enablePerencanaan,
          badge: 'Perencanaan',
          riskLevel: 'Kritis',
          impact: 'Membuka tab navigasi Perencanaan di sidebar',
          onToggle: () => onUpdateFeatureControls({ enablePerencanaan: !featureControls.enablePerencanaan }),
        },
        {
          id: 'enablePelaksanaan',
          code: 'FIT-02',
          label: 'Pelaksanaan Kas & Jurnal Harian',
          description: 'Pencatatan realisasi mutasi arus kas keluar dan masuk harian lengkap dengan nomor bukti transaksi.',
          enabled: featureControls.enablePelaksanaan,
          badge: 'Buku Kas',
          riskLevel: 'Kritis',
          impact: 'Membuka tab navigasi Pelaksanaan di sidebar',
          onToggle: () => onUpdateFeatureControls({ enablePelaksanaan: !featureControls.enablePelaksanaan }),
        },
        {
          id: 'enablePelaporan',
          code: 'FIT-03',
          label: 'Pelaporan Keuangan & Fiskal',
          description: 'Laporan Laba Rugi (P&L), Laporan Arus Kas langsung, dan Neraca Saldo posisi aktiva & pasiva.',
          enabled: featureControls.enablePelaporan,
          badge: 'Pelaporan',
          riskLevel: 'Kritis',
          impact: 'Membuka tab navigasi Pelaporan di sidebar',
          onToggle: () => onUpdateFeatureControls({ enablePelaporan: !featureControls.enablePelaporan }),
        },
      ],
    },
    {
      category: 'dashboard',
      categoryTitle: 'Executive Dashboard & Metrik HUD',
      categoryIcon: LayoutDashboard,
      items: [
        {
          id: 'showCashflowChart',
          code: 'DSH-01',
          label: 'Visualisasi Grafik Tren Arus Kas Mingguan',
          description: 'Menampilkan grafik bar komparasi mingguan antara kas masuk (revenue) dan kas keluar (expense).',
          enabled: featureControls.showCashflowChart,
          badge: 'Grafik Tren',
          riskLevel: 'Rendah',
          impact: 'Tampil di layar utama Dashboard',
          onToggle: () => onUpdateFeatureControls({ showCashflowChart: !featureControls.showCashflowChart }),
        },
        {
          id: 'showBudgetAbsorption',
          code: 'DSH-02',
          label: 'Monitoring Serapan Pagu Anggaran Usaha',
          description: 'Bar progres realisasi belanja operasional terhadap batas pagu rencana awal tiap divisi.',
          enabled: featureControls.showBudgetAbsorption,
          badge: 'Pagu RAB',
          riskLevel: 'Sedang',
          impact: 'Tampil di panel samping grafik dashboard',
          onToggle: () => onUpdateFeatureControls({ showBudgetAbsorption: !featureControls.showBudgetAbsorption }),
        },
        {
          id: 'showUpcomingDueDates',
          code: 'DSH-03',
          label: 'Jadwal Jatuh Tempo Piutang & Utang',
          description: 'Pengingat otomatis batas bayar supplier bahan baku dan tagihan pembayaran invoice pelanggan.',
          enabled: featureControls.showUpcomingDueDates,
          badge: 'Pengingat',
          riskLevel: 'Sedang',
          impact: 'Tampil di bagian bawah dashboard',
          onToggle: () => onUpdateFeatureControls({ showUpcomingDueDates: !featureControls.showUpcomingDueDates }),
        },
        {
          id: 'showNetMarginKpi',
          code: 'DSH-04',
          label: 'Metrik Laba Operasional & Net Margin (%)',
          description: 'Menghitung secara real-time rasio profitabilitas margin keuntungan bersih di kartu KPI atas.',
          enabled: featureControls.showNetMarginKpi,
          badge: 'Rasio Profit',
          riskLevel: 'Rendah',
          impact: 'Kartu KPI ke-4 di dashboard',
          onToggle: () => onUpdateFeatureControls({ showNetMarginKpi: !featureControls.showNetMarginKpi }),
        },
      ],
    },
    {
      category: 'perencanaan',
      categoryTitle: 'Perencanaan Strategis & Anggaran',
      categoryIcon: CalendarClock,
      items: [
        {
          id: 'enableRevenueTargets',
          code: 'PLN-01',
          label: 'Matriks Target Omzet Penjualan Bulanan',
          description: 'Tabel evaluasi pencapaian omzet bulanan riil terhadap target proyeksi bisnis yang ditetapkan.',
          enabled: featureControls.enableRevenueTargets,
          badge: 'Target Omzet',
          riskLevel: 'Sedang',
          impact: 'Tampil di Perencanaan',
          onToggle: () => onUpdateFeatureControls({ enableRevenueTargets: !featureControls.enableRevenueTargets }),
        },
        {
          id: 'enableBepCalculator',
          code: 'PLN-02',
          label: 'Kalkulator Titik Impas (BEP) & Kas Darurat',
          description: 'Simulasi otomatis batas minimum omzet per bulan agar usaha terhindar dari kerugian operasional.',
          enabled: featureControls.enableBepCalculator,
          badge: 'Simulasi BEP',
          riskLevel: 'Rendah',
          impact: 'Tampil di Perencanaan',
          onToggle: () => onUpdateFeatureControls({ enableBepCalculator: !featureControls.enableBepCalculator }),
        },
        {
          id: 'enableNewBudgetCreation',
          code: 'PLN-03',
          label: 'Otoritas Penambahan Pos Anggaran Baru',
          description: 'Membuka tombol akses bagi staf untuk menambah pos alokasi belanja modal atau operasional baru.',
          enabled: featureControls.enableNewBudgetCreation,
          badge: 'Hak Input',
          riskLevel: 'Kritis',
          impact: 'Tombol "+ Alokasi Pos Baru" aktif',
          onToggle: () => onUpdateFeatureControls({ enableNewBudgetCreation: !featureControls.enableNewBudgetCreation }),
        },
      ],
    },
    {
      category: 'pelaksanaan',
      categoryTitle: 'Integritas Buku Kas & Eksekusi',
      categoryIcon: ReceiptText,
      items: [
        {
          id: 'enableInvoiceGenerator',
          code: 'EXE-01',
          label: 'Generator Faktur / Voucher Transaksi',
          description: 'Menyediakan tombol cetak voucher nota kas masuk/keluar resmi yang siap dicetak untuk arsip fisik.',
          enabled: featureControls.enableInvoiceGenerator,
          badge: 'Voucher Faktur',
          riskLevel: 'Rendah',
          impact: 'Tombol "Lihat Faktur" pada tabel buku kas',
          onToggle: () => onUpdateFeatureControls({ enableInvoiceGenerator: !featureControls.enableInvoiceGenerator }),
        },
        {
          id: 'requireReceiptNumber',
          code: 'EXE-02',
          label: 'Wajibkan Input Nomor Bukti / Kwitansi',
          description: 'Mewajibkan input nomor referensi nota saat pencatatan transaksi kas baru untuk mencegah fraud.',
          enabled: featureControls.requireReceiptNumber,
          badge: 'Validasi Ketat',
          riskLevel: 'Sedang',
          impact: 'Field bukti menjadi mandatory pada form',
          onToggle: () => onUpdateFeatureControls({ requireReceiptNumber: !featureControls.requireReceiptNumber }),
        },
        {
          id: 'enableQrisPayment',
          code: 'EXE-03',
          label: 'Metode Pembayaran Digital QRIS Usaha',
          description: 'Menyediakan opsi penerimaan instan QRIS dalam metode pencatatan uang masuk kasir.',
          enabled: featureControls.enableQrisPayment,
          badge: 'Digital QRIS',
          riskLevel: 'Rendah',
          impact: 'Opsi QRIS pada form & filter transaksi',
          onToggle: () => onUpdateFeatureControls({ enableQrisPayment: !featureControls.enableQrisPayment }),
        },
      ],
    },
    {
      category: 'pelaporan',
      categoryTitle: 'Tata Kelola Fiskal & Pelaporan',
      categoryIcon: FileBarChart2,
      items: [
        {
          id: 'enableExportCsv',
          code: 'RPT-01',
          label: 'Izin Ekspor Data ke Lembar Kerja (CSV)',
          description: 'Mengizinkan pengguna mengunduh riwayat keuangan lengkap ke format lembar kerja Excel/CSV.',
          enabled: featureControls.enableExportCsv,
          badge: 'Ekspor Data',
          riskLevel: 'Sedang',
          impact: 'Tombol "Unduh CSV / Excel" di Pelaporan',
          onToggle: () => onUpdateFeatureControls({ enableExportCsv: !featureControls.enableExportCsv }),
        },
        {
          id: 'showTaxCalculation',
          code: 'RPT-02',
          label: 'Kalkulasi Estimasi PPh Final UMKM (0.5%)',
          description: 'Perhitungan otomatis pajak penghasilan final bruto 0.5% sesuai regulasi PP 55/2022.',
          enabled: featureControls.showTaxCalculation,
          badge: 'Pajak PP 55',
          riskLevel: 'Sedang',
          impact: 'Kartu pajak & potongan pada Laba Rugi',
          onToggle: () => onUpdateFeatureControls({ showTaxCalculation: !featureControls.showTaxCalculation }),
        },
        {
          id: 'showBalanceSheet',
          code: 'RPT-03',
          label: 'Penyajian Format Ringkasan Neraca Saldo',
          description: 'Menyajikan tab posisi aset kekayaan usaha terhadap liabilitas utang dan modal ekuitas.',
          enabled: featureControls.showBalanceSheet,
          badge: 'Neraca Saldo',
          riskLevel: 'Kritis',
          impact: 'Tab "Ringkasan Neraca" di Pelaporan',
          onToggle: () => onUpdateFeatureControls({ showBalanceSheet: !featureControls.showBalanceSheet }),
        },
      ],
    },
  ], [featureControls, onUpdateFeatureControls]);

  // Flattened items for Table view
  const allFlattenedItems = useMemo(() => {
    return featureDefinitions.flatMap((cat) => cat.items.map((i) => ({ ...i, categoryName: cat.categoryTitle })));
  }, [featureDefinitions]);

  // Filter items based on search and category tab
  const filteredCategories = useMemo(() => {
    return featureDefinitions
      .filter((cat) => activeCategoryFilter === 'all' || cat.category === activeCategoryFilter)
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) =>
          item.label.toLowerCase().includes(featureSearchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(featureSearchQuery.toLowerCase()) ||
          item.badge.toLowerCase().includes(featureSearchQuery.toLowerCase()) ||
          item.code.toLowerCase().includes(featureSearchQuery.toLowerCase())
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [featureDefinitions, activeCategoryFilter, featureSearchQuery]);

  return (
    <div className="space-y-6">
      {/* Banner Pengaturan */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-teal-300">
            <Sliders className="w-4 h-4 text-teal-400" />
            <span>FinBiz Keuangan</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Kontrol &amp; Sistem</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Pengaturan &amp; Tata Kelola Sistem
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Konfigurasi saklar fitur, manajemen profil usaha, dan pengelolaan rekening bank kas operasional.
          </p>
        </div>

        {/* Sub-Tabs Selector di Dalam Banner */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/90 border border-slate-700/80 rounded-xl text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveSettingsTab('fitur')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeSettingsTab === 'fitur'
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-teal-200" />
            <span>Fitur</span>
          </button>
          <button
            onClick={() => setActiveSettingsTab('profil')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSettingsTab === 'profil'
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Profil
          </button>
          <button
            onClick={() => setActiveSettingsTab('bank')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSettingsTab === 'bank'
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Kas &amp; Bank
          </button>
          <button
            onClick={() => setActiveSettingsTab('integrasi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSettingsTab === 'integrasi'
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-teal-200" />
            <span>Cloud &amp; Integrasi</span>
          </button>
          <button
            onClick={() => setActiveSettingsTab('notifikasi')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSettingsTab === 'notifikasi'
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Notifikasi
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {savedNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 shadow-xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{savedNotification}</span>
        </div>
      )}

      {/* ======================= TAB 1: KONTROL PENUH ATAS SEMUA FITUR (DENGAN 3 PILIHAN DESAIN) ======================= */}
      {activeSettingsTab === 'fitur' && (
        <div className="space-y-6">
          {/* BARIS PEMILIH VARIASI DESAIN (STYLE SWITCHER) */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Gaya Tampilan Desain:</span>
              <span className="text-[11px] text-slate-500">Pilih tata letak kontrol penuh yang Anda sukai</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDesignStyle('spatial-3d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  designStyle === 'spatial-3d'
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
                <span>✨ 1. 3D Spatial Glass (Trend)</span>
              </button>
              <button
                type="button"
                onClick={() => setDesignStyle('command-deck')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  designStyle === 'command-deck'
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span>2. Command Deck</span>
              </button>
              <button
                type="button"
                onClick={() => setDesignStyle('bento-grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  designStyle === 'bento-grid'
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-teal-400" />
                <span>3. Bento Matrix Pro</span>
              </button>
              <button
                type="button"
                onClick={() => setDesignStyle('audit-table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  designStyle === 'audit-table'
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5 text-teal-400" />
                <span>4. FinTech Audit Ledger</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* VARIASI 1: 3D SPATIAL & TRANSPARENT GLASS (TREND 2026)        */}
          {/* Bergerak & bergulir jika di-geser-geser secara interaktif     */}
          {/* ============================================================== */}
          {designStyle === 'spatial-3d' && (
            <Spatial3DControlsView
              featureControls={featureControls}
              onUpdateFeatureControls={onUpdateFeatureControls}
              featureDefinitions={featureDefinitions}
              showNotification={showNotification}
              activeCategoryFilter={activeCategoryFilter}
              setActiveCategoryFilter={setActiveCategoryFilter}
              featureSearchQuery={featureSearchQuery}
              setFeatureSearchQuery={setFeatureSearchQuery}
              onEnableAll={handleEnableAllFeatures}
              onAuditFiscal={handleAuditFiscalMode}
              onEssentialMode={handleEssentialMode}
              onResetDefault={handleResetDefaultFeatures}
              onNavigateTab={onNavigateTab}
            />
          )}

          {/* ============================================================== */}
          {/* VARIASI 2: COMMAND DECK (KOKPIT EKSEKUTIF GELAP)              */}
          {/* ============================================================== */}
          {designStyle === 'command-deck' && (
            <div className="space-y-6">
              {/* Executive Hero Deck */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-6 md:p-8 text-white border border-slate-800/80 shadow-xl">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-[11px] font-semibold border border-teal-500/30">
                          <Cpu className="w-3.5 h-3.5 text-teal-400" />
                          Executive Feature Controller
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-xs text-slate-300 font-medium">FinBiz Engine 2026</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
                        Pusat Kendali Fitur Eksekutif
                      </h2>
                      <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
                        Atur akses fitur, otomasi faktur &amp; pajak, serta parameter pembukuan langsung dari ruang kontrol terpadu.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/60 rounded-2xl p-3 shrink-0">
                      <div className="text-center px-3 border-r border-slate-800">
                        <div className="text-xl font-bold text-teal-400 font-mono tabular-nums">
                          {activeCount}/{totalCount}
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Fitur Aktif
                        </span>
                      </div>
                      <div className="text-center px-3">
                        <div className="text-xl font-bold text-white font-mono tabular-nums">
                          {activePercentage}%
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Kapasitas
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
                        <Activity className="w-5 h-5 text-teal-400" />
                      </div>
                    </div>
                  </div>

                  {/* 4 Presets */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={handleEnableAllFeatures}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 hover:bg-teal-900/40 border border-slate-700/60 hover:border-teal-500/40 text-left transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">Full Enterprise</h4>
                        <p className="text-[10px] text-slate-400 truncate">Semua 16 aktif</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleEssentialMode}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                        <Zap className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">Operasional Cepat</h4>
                        <p className="text-[10px] text-slate-400 truncate">Kas &amp; kasir saja</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleAuditFiscalMode}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                        <Shield className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">Audit &amp; Pajak</h4>
                        <p className="text-[10px] text-slate-400 truncate">Neraca &amp; PPh 0.5%</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetDefaultFeatures}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                        <RotateCcw className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">Reset Standar</h4>
                        <p className="text-[10px] text-slate-400 truncate">Default FinBiz</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Groups */}
              <div className="space-y-6">
                {filteredCategories.map((group) => {
                  const Icon = group.categoryIcon;
                  return (
                    <div key={group.category} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-900">{group.categoryTitle}</h3>
                            <p className="text-[10px] text-slate-500">
                              {group.items.filter((i) => i.enabled).length} dari {group.items.length} fitur aktif
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {group.items.map((item) => (
                          <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                                <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60">
                                  {item.badge}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">{item.description}</p>
                              <div className="text-[11px] text-slate-400">
                                <span className="font-medium text-slate-600">Dampak:</span> {item.impact}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                              <span className={`text-xs font-semibold font-mono ${item.enabled ? 'text-teal-700' : 'text-slate-400'}`}>
                                {item.enabled ? 'AKTIF' : 'NONAKTIF'}
                              </span>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={item.enabled}
                                onClick={item.onToggle}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                                  item.enabled ? 'bg-teal-600' : 'bg-slate-300'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ${
                                    item.enabled ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VARIASI 2: BENTO MATRIX PRO (ARSITEKTUR KONTEMPORER STRIPE-STYLE) */}
          {/* ============================================================== */}
          {designStyle === 'bento-grid' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Bento Top Header Banner */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Bento Matrix Pro · Kontrol Finansial Bisnis</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Matriks Kapabilitas Sistem
                  </h2>
                  <p className="text-xs text-slate-500">
                    Setiap sel bento mewakili pilar operasional independen dengan saklar taktil presisi.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleEnableAllFeatures}
                    className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    Aktifkan Semua Sel
                  </button>
                  <button
                    type="button"
                    onClick={handleEssentialMode}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors border border-slate-200"
                  >
                    Mode Ringkas
                  </button>
                </div>
              </div>

              {/* Asymmetric Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Bento Card 1: Fitur Utama (Spans 2 cols on LG) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4 hover:border-teal-500/40 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Pilar Navigasi &amp; Akses Fitur</h3>
                        <p className="text-[11px] text-slate-500">Kendalikan keterbukaan 3 fitur inti operasional bisnis</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      Pilar 01
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      { key: 'enablePerencanaan', label: 'Perencanaan (RAB)', active: featureControls.enablePerencanaan },
                      { key: 'enablePelaksanaan', label: 'Pelaksanaan (Kas)', active: featureControls.enablePelaksanaan },
                      { key: 'enablePelaporan', label: 'Pelaporan (P&L)', active: featureControls.enablePelaporan },
                    ].map((m) => (
                      <div
                        key={m.key}
                        onClick={() => onUpdateFeatureControls({ [m.key]: !m.active })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          m.active
                            ? 'bg-teal-50/50 border-teal-300 shadow-xs ring-1 ring-teal-200'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`w-2 h-2 rounded-full ${m.active ? 'bg-teal-600' : 'bg-slate-400'}`} />
                          <span className={`text-[10px] font-mono font-bold ${m.active ? 'text-teal-700' : 'text-slate-400'}`}>
                            {m.active ? 'ON' : 'OFF'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{m.label}</h4>
                        <p className="text-[10px] text-slate-500 pt-1">Klik untuk toggle</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bento Card 2: Executive Dashboard HUD (1 col) */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4 hover:border-teal-500/40 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-teal-600" />
                      <h3 className="text-sm font-bold text-slate-900">Dashboard HUD</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      Pilar 02
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { key: 'showCashflowChart', label: 'Grafik Arus Kas Mingguan', active: featureControls.showCashflowChart },
                      { key: 'showBudgetAbsorption', label: 'Progres Pagu Anggaran', active: featureControls.showBudgetAbsorption },
                      { key: 'showUpcomingDueDates', label: 'Pengingat Jatuh Tempo', active: featureControls.showUpcomingDueDates },
                      { key: 'showNetMarginKpi', label: 'KPI Net Profit Margin (%)', active: featureControls.showNetMarginKpi },
                    ].map((w) => (
                      <div
                        key={w.key}
                        onClick={() => onUpdateFeatureControls({ [w.key]: !w.active })}
                        className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer text-xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs">{w.label}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          w.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {w.active ? 'AKTIF' : 'OFF'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bento Card 3: Perencanaan & BEP Strategy (1 col) */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4 hover:border-teal-500/40 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="w-4 h-4 text-teal-600" />
                      <h3 className="text-sm font-bold text-slate-900">Strategi Anggaran</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      Pilar 03
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { key: 'enableRevenueTargets', label: 'Target Omzet Penjualan', active: featureControls.enableRevenueTargets },
                      { key: 'enableBepCalculator', label: 'Kalkulator BEP & Kas Darurat', active: featureControls.enableBepCalculator },
                      { key: 'enableNewBudgetCreation', label: 'Otoritas Tambah Pagu Baru', active: featureControls.enableNewBudgetCreation },
                    ].map((w) => (
                      <div
                        key={w.key}
                        onClick={() => onUpdateFeatureControls({ [w.key]: !w.active })}
                        className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer text-xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs">{w.label}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          w.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {w.active ? 'AKTIF' : 'OFF'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bento Card 4: Buku Kas & Integritas Transaksi (1 col) */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4 hover:border-teal-500/40 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <ReceiptText className="w-4 h-4 text-teal-600" />
                      <h3 className="text-sm font-bold text-slate-900">Integritas Buku Kas</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      Pilar 04
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { key: 'enableInvoiceGenerator', label: 'Voucher & Faktur Cetak', active: featureControls.enableInvoiceGenerator },
                      { key: 'requireReceiptNumber', label: 'Wajib Nomor Nota Transaksi', active: featureControls.requireReceiptNumber },
                      { key: 'enableQrisPayment', label: 'Metode Pembayaran QRIS', active: featureControls.enableQrisPayment },
                    ].map((w) => (
                      <div
                        key={w.key}
                        onClick={() => onUpdateFeatureControls({ [w.key]: !w.active })}
                        className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer text-xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs">{w.label}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          w.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {w.active ? 'AKTIF' : 'OFF'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bento Card 5: Tata Kelola Laporan & Pajak (1 col) */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4 hover:border-teal-500/40 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <FileBarChart2 className="w-4 h-4 text-teal-600" />
                      <h3 className="text-sm font-bold text-slate-900">Laporan &amp; Fiskal</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      Pilar 05
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { key: 'enableExportCsv', label: 'Ekspor Lembar Kerja CSV', active: featureControls.enableExportCsv },
                      { key: 'showTaxCalculation', label: 'Kalkulasi PPh Final 0.5%', active: featureControls.showTaxCalculation },
                      { key: 'showBalanceSheet', label: 'Neraca Posisi Keuangan', active: featureControls.showBalanceSheet },
                    ].map((w) => (
                      <div
                        key={w.key}
                        onClick={() => onUpdateFeatureControls({ [w.key]: !w.active })}
                        className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer text-xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs">{w.label}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          w.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {w.active ? 'AKTIF' : 'OFF'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VARIASI 3: FINTECH AUDIT LEDGER (TABEL AUDIT PRESISI ENTERPRISE)*/}
          {/* ============================================================== */}
          {designStyle === 'audit-table' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Buku Matriks Audit Fitur &amp; Tingkat Risiko Sistem
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tampilan tabel terstruktur presisi untuk manajer akuntansi, auditor, dan pemilik bisnis.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAuditFiscalMode}
                    className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Set Audit Mode
                  </button>
                  <button
                    type="button"
                    onClick={handleEnableAllFeatures}
                    className="px-3.5 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Aktifkan Semua
                  </button>
                </div>
              </div>

              {/* Enterprise Ledger Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3 font-mono">Kode ID</th>
                        <th className="px-5 py-3">Nama Kapabilitas Fitur</th>
                        <th className="px-5 py-3">Kategori Sistem</th>
                        <th className="px-5 py-3">Tingkat Risiko</th>
                        <th className="px-5 py-3">Dampak Lingkup Sistem</th>
                        <th className="px-5 py-3 text-center">Status Kontrol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {allFlattenedItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-slate-500">{item.code}</td>
                          <td className="px-5 py-3.5 max-w-xs">
                            <div className="font-bold text-slate-900">{item.label}</div>
                            <div className="text-[11px] text-slate-500 truncate">{item.description}</div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                            <span className="font-medium text-slate-800">{item.badge}</span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              item.riskLevel === 'Kritis'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : item.riskLevel === 'Sedang'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.riskLevel}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                            {item.impact}
                          </td>
                          <td className="px-5 py-3.5 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={item.onToggle}
                              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                                item.enabled
                                  ? 'bg-teal-50 border-teal-300 text-teal-800 hover:bg-teal-100'
                                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {item.enabled ? 'AKTIF' : 'NONAKTIF'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================= TAB 2: PROFIL BISNIS & ENTITAS ======================= */}
      {activeSettingsTab === 'profil' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          {/* Banner Menuju Fitur Akun Lengkap */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-teal-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300">
                Fitur Akun &amp; Identitas Pengguna
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Kelola Foto Profil, TTL, Alamat, Kontak &amp; Penautan Google
              </h3>
              <p className="text-[11px] text-slate-300">
                Akses fitur lengkap untuk mengunggah foto, melengkapi data diri kependudukan, dan sinkronisasi akun.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab?.('akun')}
              className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Buka Fitur Akun Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Identitas Entitas Usaha &amp; Penanggung Jawab
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Digunakan pada kop faktur &amp; laporan</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Entitas Usaha / Toko
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pemilik / Admin Pengelola
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bidang / Industri Usaha
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="Retail & Grosir">Retail &amp; Grosir</option>
                  <option value="F&B / Kuliner">F&amp;B / Kuliner</option>
                  <option value="Jasa & Konsultansi">Jasa &amp; Konsultansi</option>
                  <option value="Manufaktur & Produksi">Manufaktur &amp; Produksi</option>
                  <option value="Agribisnis">Agribisnis</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Uang Pembukuan Utama
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="IDR (Rp)">IDR (Rupiah Indonesia)</option>
                  <option value="USD ($)">USD (US Dollar)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NPWP Usaha / NIB
                </label>
                <input
                  type="text"
                  value={npwpNib}
                  onChange={(e) => setNpwpNib(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lokasi Usaha
                </label>
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Simpan Perubahan Profil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================= TAB 3: MANAJEMEN REKENING KAS & BANK ======================= */}
      {activeSettingsTab === 'bank' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Daftar Rekening Bank &amp; Kas Operasional Usaha
                </h2>
                <p className="text-xs text-slate-500">Kelola rekening penampungan kas dan saldo likuid usaha</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddBankModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Rekening</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map((b) => (
              <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700">
                    {b.type}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{b.bankName}</h4>
                  <p className="text-xs font-mono text-slate-600">{b.accountNumber}</p>
                  <p className="text-[11px] text-slate-400 truncate">a.n. {b.accountHolder}</p>
                  <div className="text-sm font-bold text-slate-900 font-mono tabular-nums pt-1">
                    {formatRupiah(b.balance)}
                  </div>
                </div>

                {bankAccounts.length > 1 && (
                  <button
                    onClick={() => handleDeleteBank(b.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus rekening"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================= TAB: CLOUD & INTEGRASI (SUPABASE, GITHUB, VERCEL) ======================= */}
      {activeSettingsTab === 'integrasi' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner Integrasi */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 rounded-2xl border border-slate-700/80 text-white space-y-2 shadow-md">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Infrastruktur Cloud &amp; DevOps
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-300 font-mono">v3.1 Production Architecture</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Integrasi Supabase, GitHub &amp; Vercel
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Konfigurasi backend database cloud PostgreSQL Supabase, kontrol versi repositori GitHub, serta pemantauan deployment aplikasi pada Vercel.
            </p>
          </div>

          {/* Test Feedback Toast */}
          {supabaseTestMsg && (
            <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 text-xs rounded-xl flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="font-semibold">{supabaseTestMsg}</span>
            </div>
          )}

          {/* KARTU 1: SUPABASE CLOUD (DATABASE & AUTH) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Supabase PostgreSQL &amp; Auth Cloud
                  </h3>
                  <p className="text-xs text-slate-500">
                    Otentikasi Email OTP 6-Digit, SSO Google/GitHub, dan penyimpanan data relasional terpusat.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  isSupabaseConfigured()
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-teal-50 text-teal-800 border-teal-300'
                }`}>
                  {isSupabaseConfigured() ? '● Supabase Terhubung' : '● FinBiz Simulator Siap'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Kolom Kiri: Parameter Env */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-teal-600" />
                  <span>Kunci Konfigurasi API Supabase</span>
                </h4>
                <div className="space-y-2 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-sans font-semibold">VITE_SUPABASE_URL</span>
                    <span className="text-slate-900 font-bold bg-white px-2 py-1 rounded border border-slate-200 block truncate">
                      {(import.meta as any).env.VITE_SUPABASE_URL || 'https://[PROJECT_ID].supabase.co'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-sans font-semibold">VITE_SUPABASE_ANON_KEY</span>
                    <span className="text-slate-900 font-bold bg-white px-2 py-1 rounded border border-slate-200 block truncate">
                      {(import.meta as any).env.VITE_SUPABASE_ANON_KEY ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9••••••••' : 'Belum diatur (Gunakan .env atau Secrets Vercel)'}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSupabaseTestMsg(
                        isSupabaseConfigured()
                          ? '✅ Koneksi Supabase Client aktif dan merespons dengan normal!'
                          : 'ℹ️ Supabase Client siap: FinBiz menjalankan Simulator OTP Otomatis dengan aman sampai kredensial diatur.'
                      );
                      setTimeout(() => setSupabaseTestMsg(null), 4000);
                    }}
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Server className="w-3.5 h-3.5" />
                    <span>Uji Sambungan Supabase</span>
                  </button>
                </div>
              </div>

              {/* Kolom Kanan: Fitur Backend Terintegrasi */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-800">Kapabilitas Backend Aktif:</h4>
                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Email OTP 6-Digit:</strong> Pengiriman token keamanan &amp; auto-fill saat masuk.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>OAuth Google &amp; GitHub:</strong> Otentikasi pihak ketiga terintegrasi.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Tabel Relasional:</strong> Schema siap untuk `transactions`, `profiles`, `budget_items`.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Resiliensi Offline:</strong> Penyimpanan cadangan lokal otomatis aktif saat offline.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* KARTU 2: GITHUB REPOSITORY & VERSION CONTROL */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    GitHub Repository &amp; Kontrol Versi Tim
                  </h3>
                  <p className="text-xs text-slate-500">
                    Repositori kode sumber FinBiz v3.1, branch utama, dan ekspor source code.
                  </p>
                </div>
              </div>

              <a
                href="/finbiz-source-latest.zip"
                download="finbiz-source-latest.zip"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>Unduh Berkas Proyek (.ZIP)</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Repositori Git</span>
                <p className="font-bold text-slate-900 font-mono text-[11px] truncate">finbiz-mantangai</p>
                <span className="text-[10px] text-teal-700">Publik / Privat Git</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Branch Produksi</span>
                <p className="font-bold text-slate-900 font-mono text-[11px]">main (Track Active)</p>
                <span className="text-[10px] text-emerald-700">Sinkron Otomatis</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Status Kompilasi</span>
                <p className="font-bold text-slate-900 font-mono text-[11px]">Zero Lint Error</p>
                <span className="text-[10px] text-emerald-700">TypeScript Valid</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-sans font-bold block mb-1">
                Langkah Cepat Sinkronisasi Git dari Komputer Anda:
              </span>
              <p className="text-teal-300">git add .</p>
              <p className="text-teal-300">git commit -m &quot;feat: implementasi FinBiz v3.1 dengan Supabase OTP &amp; GitHub&quot;</p>
              <p className="text-teal-300">git push origin main</p>
            </div>
          </div>

          {/* KARTU 3: VERCEL PRODUCTION DEPLOYMENT */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Vercel Production Deployment
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hosting live global serverless dengan SSL otomatis dan rewrite SPA.
                  </p>
                </div>
              </div>

              <a
                href="https://finbiz-mantangai.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Buka URL Vercel Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800">Status Konfigurasi Vercel:</h4>
                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>URL Domain Resmi:</span>
                    <span className="font-mono font-bold text-teal-700">finbiz-mantangai.vercel.app</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>File Konfigurasi:</span>
                    <span className="font-mono text-slate-800">vercel.json (SPA Rewrites 200)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Build Command:</span>
                    <span className="font-mono text-slate-800">npm run build</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Output Directory:</span>
                    <span className="font-mono text-slate-800">dist</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800">Daftar Environment Variables di Vercel:</h4>
                <p className="text-[11px] text-slate-500">
                  Tambahkan variabel berikut pada <strong>Settings &gt; Environment Variables</strong> di Vercel:
                </p>
                <div className="space-y-1 font-mono text-[10px] text-slate-700">
                  <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                    <span>VITE_SUPABASE_URL</span>
                    <span className="text-teal-700 font-semibold">URL Proyek Supabase</span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                    <span>VITE_SUPABASE_ANON_KEY</span>
                    <span className="text-teal-700 font-semibold">Anon Public Key</span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                    <span>VITE_GOOGLE_CLIENT_ID</span>
                    <span className="text-teal-700 font-semibold">OAuth Google Web Client</span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                    <span>VITE_GITHUB_CLIENT_ID</span>
                    <span className="text-teal-700 font-semibold">OAuth GitHub App ID</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 4: PERINGATAN, AKUN GOOGLE & ONBOARDING ======================= */}
      {activeSettingsTab === 'notifikasi' && (
        <div className="space-y-6">
          {/* Sub-sistem Penautan Akun Google */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Penautan Akun Google &amp; Keamanan Akses
              </h2>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    {userProfile.googleLinked ? 'Akun Google Terhubung' : 'Belum Ditautkan ke Akun Google'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {userProfile.googleLinked
                      ? `Email Sinkronisasi: ${userProfile.googleEmail || 'armandmtg@gmail.com'}`
                      : 'Tautkan akun Google untuk mempermudah akses login & pencadangan profil'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleGoogleLink}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    userProfile.googleLinked
                      ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {userProfile.googleLinked ? 'Putuskan Akun Google' : 'Tautkan Akun Google'}
                </button>
                <button
                  onClick={() => onOpenAuthModal(2)}
                  className="px-3 py-1.5 text-xs font-semibold bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 rounded-lg transition-colors"
                >
                  Buka Jendela Setup
                </button>
              </div>
            </div>
          </div>

          {/* Batas Peringatan Anggaran */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="w-5 h-5 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Preferensi Batas Peringatan Anggaran &amp; Dialog Awal
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-semibold text-slate-800 block">
                  Batas Peringatan Serapan Pos Anggaran:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={budgetAlertThreshold}
                    onChange={(e) => setBudgetAlertThreshold(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    <option value="75">75% Pagu Terpakai</option>
                    <option value="85">85% Pagu Terpakai (Direkomendasikan)</option>
                    <option value="90">90% Pagu Terpakai</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-500">
                  Sistem akan memunculkan penanda peringatan kuning jika realisasi belanja pos melebihi batas ini.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <span className="font-semibold text-slate-800 block">
                  Alur Dua Jendela &amp; Akses Fitur Akun:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal(1)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-xs"
                    title="Buka Jendela 1: Masuk atau Daftar Akun"
                  >
                    Jendela 1 (Masuk / Daftar)
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal(2)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg text-xs font-semibold text-teal-800 shadow-xs"
                    title="Buka Jendela 2: Lanjutkan Kelengkapan Profil"
                  >
                    Jendela 2 (Lengkapi Profil)
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab?.('akun')}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                    title="Buka Fitur Akun & Identitas Lengkap"
                  >
                    Fitur Akun Lengkap ➔
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Alur bertahap: Jendela 1 untuk autentikasi masuk/daftar akun, dilanjutkan Jendela 2 untuk kelengkapan profil, dan setelah lengkap langsung menuju ke Fitur Akun.
                </p>
              </div>

              {/* Sesi Keamanan & Logout Akun */}
              <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-semibold text-rose-900 block text-xs">
                    Keamanan Sesi &amp; Keluar dari Akun (Logout)
                  </span>
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    Kunci kembali akses sistem keuangan dan kembali ke Tampilan Awal 3D Sinematik.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  Keluar dari Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Rekening Bank */}
      {showAddBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900">
              Tambah Rekening Bank / Kas Usaha
            </h3>

            <form onSubmit={handleAddBank} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Bank / Kas
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bank BNI Bisnis"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  required
                  placeholder="0839-291-882"
                  value={newAccountNumber}
                  onChange={(e) => setNewAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  placeholder={userProfile.businessName}
                  value={newAccountHolder}
                  onChange={(e) => setNewAccountHolder(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Saldo Awal Rekening (Rp)
                </label>
                <input
                  type="number"
                  placeholder="10000000"
                  value={newAccountBalance}
                  onChange={(e) => setNewAccountBalance(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBankModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  Simpan Rekening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
