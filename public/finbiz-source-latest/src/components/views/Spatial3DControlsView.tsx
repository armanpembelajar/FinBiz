import React, { useState, useEffect } from 'react';
import { FeatureControls, ActiveTab } from '../../types';
import { ThreeInteractiveBackground } from '../common/ThreeInteractiveBackground';
import { 
  Sparkles, 
  Orbit, 
  Compass, 
  SlidersHorizontal, 
  Search, 
  Globe, 
  Maximize2,
  Film,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Coins,
  Receipt,
  FileSpreadsheet,
  QrCode,
  ShieldCheck,
  LayoutDashboard,
  CalendarClock,
  ReceiptText,
  FileBarChart2,
  Settings,
  Zap
} from 'lucide-react';

interface FeatureDefinitionCategory {
  category: string;
  categoryTitle: string;
  categoryIcon: React.ComponentType<{ className?: string }>;
  items: Array<{
    id: string;
    code: string;
    label: string;
    description: string;
    enabled: boolean;
    badge: string;
    riskLevel: string;
    impact: string;
    onToggle: () => void;
  }>;
}

interface Spatial3DControlsViewProps {
  featureControls: FeatureControls;
  onUpdateFeatureControls: (updated: Partial<FeatureControls>) => void;
  featureDefinitions: FeatureDefinitionCategory[];
  showNotification: (msg: string) => void;
  activeCategoryFilter: 'all' | 'modul' | 'dashboard' | 'perencanaan' | 'pelaksanaan' | 'pelaporan';
  setActiveCategoryFilter: (filter: 'all' | 'modul' | 'dashboard' | 'perencanaan' | 'pelaksanaan' | 'pelaporan') => void;
  featureSearchQuery: string;
  setFeatureSearchQuery: (query: string) => void;
  onEnableAll: () => void;
  onAuditFiscal: () => void;
  onEssentialMode: () => void;
  onResetDefault: () => void;
  onNavigateTab?: (tab: ActiveTab) => void;
}

export const Spatial3DControlsView: React.FC<Spatial3DControlsViewProps> = ({
  featureControls,
  onUpdateFeatureControls,
  featureDefinitions,
  showNotification,
  activeCategoryFilter,
  setActiveCategoryFilter,
  featureSearchQuery,
  setFeatureSearchQuery,
  onEnableAll,
  onAuditFiscal,
  onEssentialMode,
  onResetDefault,
  onNavigateTab,
}) => {
  // 3D Parameters state
  const [theme, setTheme] = useState<'emerald' | 'cyan' | 'violet' | 'gold'>(
    featureControls.bg3DTheme || 'emerald'
  );
  const [density, setDensity] = useState<'minimal' | 'balanced' | 'rich'>(
    featureControls.bg3DElementDensity || 'balanced'
  );
  const [autoRotate, setAutoRotate] = useState<boolean>(
    featureControls.bg3DAutoRotate ?? true
  );
  const [sensitivity, setSensitivity] = useState<number>(
    featureControls.bg3DSensitivity || 1.2
  );
  const [glassOpacity, setGlassOpacity] = useState<number>(
    featureControls.glassCardOpacity || 40
  );

  // Cinema Ecosystem Showcase State
  const [activeCinemaIndex, setActiveCinemaIndex] = useState<number>(0);
  const [isCinemaTourRunning, setIsCinemaTourRunning] = useState<boolean>(false);
  const [isCinemaExpanded, setIsCinemaExpanded] = useState<boolean>(false);

  // Live Telemetry from 3D Engine
  const [telemetry, setTelemetry] = useState({
    yaw: 15,
    pitch: -8,
    roll: 0,
    speed: 0,
    isDragging: false,
  });

  // Cinema Screens Metadata
  const cinemaScreens = [
    {
      index: 0,
      tab: 'dashboard' as ActiveTab,
      badge: 'FITUR UTAMA 01',
      title: 'Beranda & Executive Dashboard',
      subtitle: 'Ringkasan Eksekutif Likuiditas Kas, Margin & Mutasi Omzet',
      description: 'Menyajikan 4 kartu metrik KPI (Total Likuiditas Rp 485 Juta, Uang Masuk Kasir, Pengeluaran Operasional, Rasio Margin Bersih) serta grafik batang arus kas mingguan.',
      keyButtons: ['+ Catat Transaksi Baru', 'Filter Periode Bulanan', 'Navigasi Cepat Fitur'],
      keyIcons: ['LayoutDashboard', 'TrendingUp', 'Wallet'],
      color: 'text-teal-400',
      borderColor: 'border-teal-500/50',
      tagBg: 'bg-teal-500/20 text-teal-300',
    },
    {
      index: 1,
      tab: 'perencanaan' as ActiveTab,
      badge: 'FITUR UTAMA 02',
      title: 'Perencanaan Strategis & Anggaran (RAB)',
      subtitle: 'Matriks Target Omzet Penjualan Bulanan & Simulasi Titik Impas (BEP)',
      description: 'Mengelola batas pengeluaran pos belanja modal & operasional, evaluasi target omzet bulanan, serta kalkulator ambang batas aman usaha bebas dari kerugian.',
      keyButtons: ['+ Alokasi Pos Baru', 'Kalkulator BEP Otomatis', 'Kunci Plafon Anggaran'],
      keyIcons: ['CalendarClock', 'Target', 'Calculator'],
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/50',
      tagBg: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      index: 2,
      tab: 'pelaksanaan' as ActiveTab,
      badge: 'FITUR UTAMA 03',
      title: 'Pelaksanaan & Buku Kas Mutasi',
      subtitle: 'Jurnal Buku Kas Masuk/Keluar, Cetak Faktur Voucher & Pembayaran QRIS',
      description: 'Buku besar transaksi kasir harian dengan filter multi-kategori, pencarian cepat, pencetakan voucher nota resmi untuk arsip fisik, serta integrasi QRIS usaha.',
      keyButtons: ['🖨️ Cetak Faktur / Voucher', '⚡ Pembayaran QRIS', 'Filter Metode Pembayaran'],
      keyIcons: ['ReceiptText', 'Printer', 'QrCode'],
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/50',
      tagBg: 'bg-cyan-500/20 text-cyan-300',
    },
    {
      index: 3,
      tab: 'pelaporan' as ActiveTab,
      badge: 'FITUR UTAMA 04',
      title: 'Pelaporan Keuangan & Fiskal Pajak',
      subtitle: 'Laba Rugi (P&L), Ringkasan Neraca Saldo & Estimasi PPh Final 0.5%',
      description: 'Menghitung secara otomatis Laba Bersih operasional, Gross Margin, Neraca posisi aset-ekuitas, perhitungan pajak PP 55/2022, serta ekspor ke lembar kerja Excel/CSV.',
      keyButtons: ['📊 Unduh CSV / Excel', '🖨️ Cetak Laporan Finansial', 'Pengalih Tampilan P&L / Neraca'],
      keyIcons: ['FileBarChart2', 'FileSpreadsheet', 'Download'],
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/50',
      tagBg: 'bg-indigo-500/20 text-indigo-300',
    },
    {
      index: 4,
      tab: 'pengaturan' as ActiveTab,
      badge: 'FITUR UTAMA 05',
      title: 'Pengaturan & Kontrol Penuh Fitur',
      subtitle: 'Tata Kelola 16 Kapabilitas FinBiz, Akun Google Cloud & Rekening Bank',
      description: 'Pusat komando eksekutif untuk mengaktifkan/menonaktifkan seluruh 16 fitur aplikasi, mengelola profil usaha, menyinkronkan akun Google, dan memilih 4 mode tampilan desain.',
      keyButtons: ['🛡️ Kontrol Penuh 16 Fitur', '🔗 Sinkronisasi Google', '+ Tambah Rekening Kas/Bank'],
      keyIcons: ['Settings', 'ShieldCheck', 'Sliders'],
      color: 'text-amber-400',
      borderColor: 'border-amber-500/50',
      tagBg: 'bg-amber-500/20 text-amber-300',
    },
  ];

  // Auto-tour animation cycle effect
  useEffect(() => {
    if (!isCinemaTourRunning) return;
    const interval = setInterval(() => {
      setActiveCinemaIndex((prev) => (prev + 1) % cinemaScreens.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isCinemaTourRunning, cinemaScreens.length]);

  // Toggle Global 3D across entire application
  const handleToggleGlobal3D = () => {
    const nextState = !featureControls.enableGlobal3DBackground;
    onUpdateFeatureControls({
      enableGlobal3DBackground: nextState,
      bg3DTheme: theme,
      bg3DElementDensity: density,
      bg3DAutoRotate: autoRotate,
      bg3DSensitivity: sensitivity,
      glassCardOpacity: glassOpacity,
    });
    showNotification(
      nextState
        ? '🌐 Latar Belakang 3D Transparan telah DIAKTIFKAN untuk SEMUA FITUR (Dashboard, Perencanaan, dll)!'
        : 'Latar Belakang 3D dinonaktifkan di fitur lain (hanya tampil di Kontrol Penuh).'
    );
  };

  const handleUpdateTheme = (newTheme: 'emerald' | 'cyan' | 'violet' | 'gold') => {
    setTheme(newTheme);
    onUpdateFeatureControls({ bg3DTheme: newTheme });
    showNotification(`Tema warna 3D diubah ke mode ${newTheme.toUpperCase()}`);
  };

  const handleUpdateDensity = (newDensity: 'minimal' | 'balanced' | 'rich') => {
    setDensity(newDensity);
    onUpdateFeatureControls({ bg3DElementDensity: newDensity });
  };

  const handleUpdateSensitivity = (val: number) => {
    setSensitivity(val);
    onUpdateFeatureControls({ bg3DSensitivity: val });
  };

  const handleSelectCinemaScreen = (idx: number) => {
    setActiveCinemaIndex(idx);
    setIsCinemaTourRunning(false);
    showNotification(`Kamera 3D mengarah ke Layar Sinema: ${cinemaScreens[idx].title}`);
  };

  const handleNavigateToModule = (tab: ActiveTab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
      showNotification(`Membuka fitur ${tab.toUpperCase()}...`);
    }
  };

  // Filter feature items
  const filteredCategories = featureDefinitions
    .filter((cat) => {
      if (activeCategoryFilter === 'all') return true;
      return cat.category === activeCategoryFilter;
    })
    .map((cat) => {
      const filteredItems = cat.items.filter((item) => {
        if (!featureSearchQuery.trim()) return true;
        const q = featureSearchQuery.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q)
        );
      });
      return { ...cat, items: filteredItems };
    })
    .filter((cat) => cat.items.length > 0);

  const getGlassCardClass = () => {
    if (glassOpacity <= 25) {
      return 'bg-slate-950/25 backdrop-blur-md border border-white/15 text-white shadow-2xl';
    } else if (glassOpacity <= 45) {
      return 'bg-slate-950/45 backdrop-blur-xl border border-white/20 text-white shadow-2xl';
    } else {
      return 'bg-slate-950/65 backdrop-blur-2xl border border-white/25 text-white shadow-2xl';
    }
  };

  const currentScreen = cinemaScreens[activeCinemaIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl p-4 sm:p-6 md:p-8 text-white min-h-[900px]">
      {/* ============================================================== */}
      {/* 3D INTERACTIVE WEBGL BACKGROUND CANVAS LAYER                   */}
      {/* Lengkap dengan 5 Layar Sinema Holografik, Koin Rp 3D & Tombol  */}
      {/* ============================================================== */}
      <div className={`absolute inset-0 z-0 transition-all duration-500 ${isCinemaExpanded ? 'h-[750px]' : 'h-full'}`}>
        <ThreeInteractiveBackground
          theme={theme}
          density={density}
          autoRotate={autoRotate && !isCinemaTourRunning}
          sensitivity={sensitivity}
          interactive={true}
          showCinemaScreens={true}
          activeCinemaIndex={activeCinemaIndex}
          onTelemetryChange={setTelemetry}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/35 to-slate-950/85 pointer-events-none" />
      </div>

      {/* ============================================================== */}
      {/* FOREGROUND TRANSPARENT GLASSMORPHIC CONTENT LAYER               */}
      {/* ============================================================== */}
      <div className="relative z-10 space-y-6">
        {/* --- 1. HERO TITLE & TELEMETRY HUB --- */}
        <div className={`${getGlassCardClass()} rounded-3xl p-6 transition-all duration-300 hover:border-teal-500/40`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
                  <span>3D SPATIAL &amp; SINEMA EKOSISTEM (TREND 2026)</span>
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold border border-indigo-500/30 font-mono">
                  <Film className="w-3 h-3 text-indigo-300" />
                  <span>5 Layar Sinema Hologram FinBiz</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold border border-emerald-500/30">
                  60 FPS WebGL
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Kontrol Penuh &amp; Sinema 3D Interaktif Ekosistem FinBiz
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Visualisasi 3D sinematik terlengkap: menggambarkan <strong className="text-teal-300 font-semibold">Beranda, perencanaan, buku kasir, laporan pajak, tombol, ikon serta koin finansial</strong> yang melayang tembus pandang secara real-time.
              </p>
            </div>

            {/* Quick Global 3D Toggle button & Telemetry Badge */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={handleToggleGlobal3D}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg ${
                  featureControls.enableGlobal3DBackground
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-teal-500/25 border border-teal-400'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <Globe className="w-4 h-4 text-teal-300" />
                <span>
                  {featureControls.enableGlobal3DBackground
                    ? '✓ 3D Aktif di Semua Halaman'
                    : 'Aktifkan 3D ke Semua Halaman'}
                </span>
              </button>

              {/* Live Telemetry Display */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 font-mono text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-teal-400" /> Sensor Orientasi 3D:
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    telemetry.isDragging ? 'bg-amber-500/30 text-amber-300' : 'bg-teal-500/20 text-teal-300'
                  }`}>
                    {telemetry.isDragging ? 'Sedang Digeser' : 'Siap Digeser'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span>Yaw (Rotasi Y): <strong className="text-teal-300">{telemetry.yaw}°</strong></span>
                  <span>Pitch: <strong className="text-teal-300">{telemetry.pitch}°</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. TEATER SINEMA 3D & PEMUTAR EKOSISTEM FITUR --- */}
        <div className={`${getGlassCardClass()} rounded-3xl p-5 sm:p-6 transition-all duration-300 space-y-5 border-teal-500/30 shadow-[0_0_25px_rgba(20,184,166,0.15)]`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-xs">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Teater Sinema 3D: Eksplorasi Seluruh Halaman &amp; Fitur
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Layar {activeCinemaIndex + 1} / 5
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Pilih layar sinema di bawah atau tekan tombol putar otomatis untuk melihat seluruh antarmuka berputar di antariksa 3D.
                </p>
              </div>
            </div>

            {/* Playback & Viewport Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsCinemaTourRunning(!isCinemaTourRunning)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isCinemaTourRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-400'
                    : 'bg-teal-600 hover:bg-teal-500 text-white border border-teal-400'
                }`}
              >
                {isCinemaTourRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Jeda Tur Sinema</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>🎬 Putar Tur Otomatis</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsCinemaExpanded(!isCinemaExpanded)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 text-xs transition-colors"
                title={isCinemaExpanded ? 'Kecilkan Panggung 3D' : 'Perbesar Panggung Teater 3D'}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 5 Cinema Tabs Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {cinemaScreens.map((scr) => (
              <button
                key={scr.index}
                type="button"
                onClick={() => handleSelectCinemaScreen(scr.index)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  activeCinemaIndex === scr.index
                    ? 'bg-teal-950/60 border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                    : 'bg-black/30 border-white/10 hover:border-white/20 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-teal-400">
                    LAYAR 0{scr.index + 1}
                  </span>
                  {activeCinemaIndex === scr.index && (
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">
                  {scr.title.split('&')[0]}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">
                  {scr.subtitle}
                </p>
              </button>
            ))}
          </div>

          {/* Active Cinema Screen Inspection Panel */}
          <div className="p-5 rounded-2xl bg-black/50 border border-white/15 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${currentScreen.tagBg}`}>
                    {currentScreen.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Fokus Tampilan Sinema 3D
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {currentScreen.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {currentScreen.description}
                </p>
              </div>

              {/* Jump to Module Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSelectCinemaScreen((activeCinemaIndex + 4) % 5)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
                  title="Layar Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCinemaScreen((activeCinemaIndex + 1) % 5)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
                  title="Layar Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateToModule(currentScreen.tab)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-500/20"
                >
                  <span>🚀 Buka Fitur Ini Sekarang</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Key Buttons & Hologram Icons displayed on this screen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-white/10">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                  Tombol Utama di Layar Ini:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentScreen.keyButtons.map((btn, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-200 text-[11px] font-semibold border border-teal-500/30">
                      {btn}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Ikon &amp; Simbol Navigasi:
                </span>
                <p className="text-xs text-slate-300">
                  Dilengkapi visualisasi grafik batang, status badge mutasi, serta ikon interaktif yang siap diklik.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Interaksi Geser Layar Sinema:
                </span>
                <p className="text-xs text-slate-300">
                  Geser mouse ke kiri/kanan untuk melihat panel sinema lainnya berbaris melingkar dalam silinder 3D!
                </p>
              </div>
            </div>
          </div>

          {/* 3D Floating Token & Buttons Gallery */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-300 block">
              Galeri Token Tombol, Ikon &amp; Koin Finansial 3D yang Melayang:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { label: 'Koin Emas Rp', sub: 'Simbol Kas Likuid', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
                { label: '+ Catat Kas', sub: 'Tombol Cepat Input', icon: Zap, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' },
                { label: 'Cetak Faktur', sub: 'Nota & Voucher Kasir', icon: Receipt, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
                { label: 'Ekspor Excel', sub: 'Lembar Kerja CSV', icon: FileSpreadsheet, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
                { label: 'QRIS Usaha', sub: 'Pembayaran Digital', icon: QrCode, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
                { label: 'Tautan Google', sub: 'Sinkronisasi Cloud', icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
              ].map((tok, i) => {
                const TokIcon = tok.icon;
                return (
                  <div key={i} className={`p-2.5 rounded-xl border flex items-center gap-2 ${tok.bg}`}>
                    <TokIcon className={`w-4 h-4 shrink-0 ${tok.color}`} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">{tok.label}</p>
                      <p className="text-[9px] text-slate-400 truncate">{tok.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- 3. 3D CUSTOMIZATION & GLASS TUNER BAR --- */}
        <div className={`${getGlassCardClass()} rounded-3xl p-4 sm:p-5 transition-all duration-300 space-y-4`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Pengatur Parameter Alam Semesta 3D &amp; Transparansi
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Atur warna, kecepatan geser &amp; densitas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Palette Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 block">Tema Warna 3D</label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 rounded-xl border border-white/10">
                {[
                  { id: 'emerald', label: 'Teal', bg: 'bg-emerald-500' },
                  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500' },
                  { id: 'violet', label: 'Violet', bg: 'bg-purple-500' },
                  { id: 'gold', label: 'Gold', bg: 'bg-amber-500' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleUpdateTheme(p.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
                      theme === p.id
                        ? 'bg-white/20 text-white shadow-xs border border-white/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${p.bg}`} />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Density Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 block">Kepadatan Objek &amp; Partikel</label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-white/10">
                {[
                  { id: 'minimal', label: 'Minimal' },
                  { id: 'balanced', label: 'Seimbang' },
                  { id: 'rich', label: 'Spektakuler' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleUpdateDensity(d.id as any)}
                    className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all truncate text-center ${
                      density === d.id
                        ? 'bg-teal-500/30 text-teal-300 border border-teal-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag Sensitivity */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 block">Kecepatan Geser / Putar</label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-white/10">
                {[
                  { val: 0.8, label: '0.8x Halus' },
                  { val: 1.2, label: '1.2x Standar' },
                  { val: 2.0, label: '2.0x Cepat' },
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => handleUpdateSensitivity(s.val)}
                    className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                      sensitivity === s.val
                        ? 'bg-teal-500/30 text-teal-300 border border-teal-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Glass Transparency Level */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold">Transparansi Kartu Kaca</span>
                <span className="font-mono text-teal-300">{glassOpacity}%</span>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-white/10">
                {[
                  { val: 25, label: 'Bening 25%' },
                  { val: 45, label: 'Sedang 45%' },
                  { val: 65, label: 'Solid 65%' },
                ].map((g) => (
                  <button
                    key={g.val}
                    type="button"
                    onClick={() => {
                      setGlassOpacity(g.val);
                      onUpdateFeatureControls({ glassCardOpacity: g.val });
                    }}
                    className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                      glassOpacity === g.val
                        ? 'bg-teal-500/30 text-teal-300 border border-teal-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Switches: Auto-rotation toggle & Quick Preset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const nextVal = !autoRotate;
                  setAutoRotate(nextVal);
                  onUpdateFeatureControls({ bg3DAutoRotate: nextVal });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  autoRotate
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-xs'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <Orbit className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span>Rotasi Otomatis: {autoRotate ? 'AKTIF' : 'NONAKTIF'}</span>
              </button>
            </div>

            {/* Quick Action Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-semibold">Preset Fitur:</span>
              <button
                type="button"
                onClick={onEnableAll}
                className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-500/30 text-[11px] font-bold transition-all"
              >
                Semua Fitur ON
              </button>
              <button
                type="button"
                onClick={onAuditFiscal}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 text-[11px] font-bold transition-all"
              >
                Mode Audit
              </button>
              <button
                type="button"
                onClick={onEssentialMode}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-[11px] font-bold transition-all"
              >
                Mode Cepat
              </button>
              <button
                type="button"
                onClick={onResetDefault}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 border border-white/20 text-[11px] font-semibold transition-all"
              >
                Reset Default
              </button>
            </div>
          </div>
        </div>

        {/* --- 4. FILTER & SEARCH BAR (FROSTED GLASS) --- */}
        <div className={`${getGlassCardClass()} rounded-2xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3`}>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-semibold">
            {[
              { id: 'all', label: 'Semua Pilar (16)' },
              { id: 'modul', label: 'Fitur Inti (3)' },
              { id: 'dashboard', label: 'Dashboard (4)' },
              { id: 'perencanaan', label: 'Perencanaan (3)' },
              { id: 'pelaksanaan', label: 'Pelaksanaan (3)' },
              { id: 'pelaporan', label: 'Pelaporan (3)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategoryFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs ${
                  activeCategoryFilter === tab.id
                    ? 'bg-teal-500 text-slate-950 font-black shadow-[0_0_15px_rgba(20,184,166,0.5)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari fitur kontrol..."
              value={featureSearchQuery}
              onChange={(e) => setFeatureSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-black/40 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
          </div>
        </div>

        {/* --- 5. FEATURE CONTROL PANELS (TRANSPARENT GLASS CARDS) --- */}
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const Icon = category.categoryIcon;
            return (
              <div
                key={category.category}
                className={`${getGlassCardClass()} rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:border-teal-500/30 space-y-4`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        {category.categoryTitle}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {category.items.filter((i) => i.enabled).length} dari {category.items.length} fitur aktif
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                    Glass Layer Active
                  </span>
                </div>

                {/* Grid of Switches within Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {category.items.map((item) => {
                    return (
                      <div
                        key={item.id}
                        onClick={item.onToggle}
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between gap-3 ${
                          item.enabled
                            ? 'bg-teal-950/30 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.15)] hover:border-teal-400'
                            : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-black/40'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] text-slate-400 font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                              {item.code}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                item.enabled
                                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-[0_0_8px_rgba(20,184,166,0.3)]'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {item.enabled ? 'AKTIF' : 'NONAKTIF'}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-white leading-snug">
                            {item.label}
                          </h4>
                          <p className="text-[11px] text-slate-300/80 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* Card Footer with Switch Toggle */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
                          <span className="text-slate-400 truncate max-w-[150px]">
                            {item.impact}
                          </span>

                          <div
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-all shrink-0 ${
                              item.enabled
                                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-[0_0_12px_rgba(20,184,166,0.6)]'
                                : 'bg-slate-800 border border-white/10'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                item.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
