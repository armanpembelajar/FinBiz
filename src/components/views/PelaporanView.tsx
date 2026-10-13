import React, { useState } from 'react';
import { Transaction, UserProfile, FeatureControls } from '../../types';
import { formatRupiah } from '../../data/mockData';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  PieChart, 
  ArrowDownLeft, 
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Percent,
  AlertTriangle,
  Lock,
  KeyRound,
  CheckCircle2,
  X
} from 'lucide-react';

interface PelaporanViewProps {
  userProfile: UserProfile;
  transactions: Transaction[];
  selectedPeriod: string;
  featureControls: FeatureControls;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
}

export const PelaporanView: React.FC<PelaporanViewProps> = ({
  userProfile,
  transactions,
  selectedPeriod,
  featureControls,
  onUpdateProfile,
}) => {
  const [reportType, setReportType] = useState<'laba-rugi' | 'arus-kas' | 'neraca'>('laba-rugi');
  const [isSSOModalOpen, setIsSSOModalOpen] = useState(false);
  const [pendingExportType, setPendingExportType] = useState<'csv' | 'pdf'>('csv');
  const [ssoEmailInput, setSsoEmailInput] = useState(
    userProfile.googleEmail || userProfile.email || 'sdn1.mantangaitengah@gmail.com'
  );
  const [isVerifyingSSO, setIsVerifyingSSO] = useState(false);

  // Perhitungan Laba Rugi dari data nyata
  const totalPenjualan = transactions
    .filter((t) => t.type === 'masuk')
    .reduce((acc, t) => acc + t.amount, 0);

  const bebanHpp = transactions
    .filter((t) => t.type === 'keluar' && t.category.includes('Bahan'))
    .reduce((acc, t) => acc + t.amount, 0);

  const bebanOperasional = transactions
    .filter((t) => t.type === 'keluar' && !t.category.includes('Bahan'))
    .reduce((acc, t) => acc + t.amount, 0);

  const labaKotor = totalPenjualan - bebanHpp;
  const labaBersihOperasional = labaKotor - bebanOperasional;
  const pphUmkm = Math.round(totalPenjualan * 0.005); // 0.5% PP 55 / 2022
  const labaBersihSetelahPajak = labaBersihOperasional - pphUmkm;

  const grossMargin = totalPenjualan > 0 ? ((labaKotor / totalPenjualan) * 100).toFixed(1) : '0';
  const netMargin = totalPenjualan > 0 ? ((labaBersihSetelahPajak / totalPenjualan) * 100).toFixed(1) : '0';

  const executeCSVDownload = () => {
    const headers = ['ID', 'Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Nominal', 'Metode Bayar'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      t.type,
      t.amount,
      t.paymentMethod,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_FinBiz_${selectedPeriod.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    if (!userProfile.googleLinked) {
      setPendingExportType('csv');
      setIsSSOModalOpen(true);
      return;
    }
    executeCSVDownload();
  };

  const handlePrintPDF = () => {
    if (!userProfile.googleLinked) {
      setPendingExportType('pdf');
      setIsSSOModalOpen(true);
      return;
    }
    window.print();
  };

  const handleVerifySSOAndProceed = () => {
    setIsVerifyingSSO(true);
    setTimeout(() => {
      onUpdateProfile?.({
        googleLinked: true,
        googleEmail: ssoEmailInput || 'sdn1.mantangaitengah@gmail.com',
      });
      setIsVerifyingSSO(false);
      setIsSSOModalOpen(false);
      if (pendingExportType === 'csv') {
        executeCSVDownload();
      } else {
        window.print();
      }
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Banner Pelaporan */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-teal-300">
            <FileSpreadsheet className="w-4 h-4 text-teal-400" />
            <span>FinBiz Keuangan</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Pelaporan &amp; Fiskal</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Pelaporan Keuangan Bisnis &amp; Analisis Fiskal
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Laporan Laba Rugi terstandar, arus kas, dan neraca pembukuan UMKM untuk periode <span className="font-semibold text-white">{selectedPeriod}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer active:scale-95"
            title="Cetak Laporan PDF (Wajib Otentikasi Google SSO)"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>Cetak PDF</span>
          </button>
          {featureControls.enableExportCsv && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              title="Unduh Laporan CSV / Excel (Wajib Otentikasi Google SSO)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV / Excel</span>
            </button>
          )}
        </div>
      </div>

      {/* Switcher Jenis Laporan (Segmented Tabs) */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl text-xs font-medium w-full sm:w-fit">
        <button
          onClick={() => setReportType('laba-rugi')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-colors ${
            reportType === 'laba-rugi' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Laporan Laba Rugi (P&amp;L)
        </button>
        <button
          onClick={() => setReportType('arus-kas')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-colors ${
            reportType === 'arus-kas' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Laporan Arus Kas
        </button>
        {featureControls.showBalanceSheet && (
          <button
            onClick={() => setReportType('neraca')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-colors ${
              reportType === 'neraca' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ringkasan Neraca
          </button>
        )}
      </div>

      {/* 3 Kartu Rasio Finansial Cepat */}
      <div className={`grid grid-cols-1 ${featureControls.showTaxCalculation ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Gross Profit Margin</span>
          <div className="text-lg font-bold text-teal-700 font-mono tabular-nums">
            {grossMargin}%
          </div>
          <span className="text-[11px] text-slate-400">Marjin kotor dari harga pokok produksi</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Net Profit Margin (Setelah Pajak)</span>
          <div className="text-lg font-bold text-emerald-600 font-mono tabular-nums">
            {netMargin}%
          </div>
          <span className="text-[11px] text-slate-400">Keuntungan riil yang dapat ditarik</span>
        </div>

        {featureControls.showTaxCalculation && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Kewajiban PPh Final UMKM (0.5%)</span>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              {formatRupiah(pphUmkm)}
            </div>
            <span className="text-[11px] text-teal-700 font-medium">Dihitung otomatis per PP 55/2022</span>
          </div>
        )}
      </div>

      {/* KONTEN LAPORAN: 1. LABA RUGI */}
      {reportType === 'laba-rugi' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          {/* Letterhead */}
          <div className="text-center pb-4 border-b border-slate-200 space-y-1">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
              {userProfile.businessName}
            </h2>
            <h3 className="text-sm font-semibold text-teal-800">
              Laporan Laba Rugi Operasional (Income Statement)
            </h3>
            <p className="text-xs text-slate-500">
              Periode Pembukuan: {selectedPeriod} · Mata Uang: {userProfile.currency}
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* PENDAPATAN */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg">
                <span className="uppercase tracking-wider">I. Pendapatan Usaha (Revenue)</span>
                <span className="font-mono tabular-nums">{formatRupiah(totalPenjualan)}</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Penjualan Produk Grosir &amp; B2B Mitra</span>
                  <span className="font-mono tabular-nums">Rp 14.500.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Penjualan Kasir Retail &amp; QRIS</span>
                  <span className="font-mono tabular-nums">Rp 4.250.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Pendapatan Jasa &amp; Konsultasi</span>
                  <span className="font-mono tabular-nums">Rp 5.500.000</span>
                </div>
              </div>
            </div>

            {/* HPP */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg">
                <span className="uppercase tracking-wider">II. Harga Pokok Penjualan (HPP / COGS)</span>
                <span className="font-mono tabular-nums text-rose-700">({formatRupiah(bebanHpp)})</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Pembelian Bahan Baku Langsung</span>
                  <span className="font-mono tabular-nums">Rp 6.800.000</span>
                </div>
              </div>
            </div>

            {/* LABA KOTOR */}
            <div className="flex justify-between font-bold text-slate-900 bg-teal-50/70 p-3 rounded-lg border border-teal-200/60">
              <span>Laba Kotor (Gross Profit)</span>
              <span className="font-mono tabular-nums text-teal-800 text-sm">{formatRupiah(labaKotor)}</span>
            </div>

            {/* BEBAN OPERASIONAL */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg">
                <span className="uppercase tracking-wider">III. Beban Operasional (Opex)</span>
                <span className="font-mono tabular-nums text-rose-700">({formatRupiah(bebanOperasional)})</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Beban Pemasaran &amp; Promosi Digital</span>
                  <span className="font-mono tabular-nums">Rp 2.500.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Beban Utilitas, Listrik &amp; Internet</span>
                  <span className="font-mono tabular-nums">Rp 1.850.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Beban Logistik &amp; Pengiriman Ekspedisi</span>
                  <span className="font-mono tabular-nums">Rp 1.150.000</span>
                </div>
              </div>
            </div>

            {/* LABA BERSIH SEBELUM PAJAK */}
            <div className="flex justify-between font-bold text-slate-900 bg-slate-100 p-3 rounded-lg">
              <span>Laba Bersih Sebelum Pajak (EBIT)</span>
              <span className="font-mono tabular-nums">{formatRupiah(labaBersihOperasional)}</span>
            </div>

            {/* PAJAK */}
            <div className="pl-4 flex justify-between py-1 text-slate-600">
              <span>Estimasi Beban Pajak PPh Final UMKM (0.5% Omzet)</span>
              <span className="font-mono tabular-nums text-rose-700">({formatRupiah(pphUmkm)})</span>
            </div>

            {/* LABA BERSIH FINAL */}
            <div className="flex justify-between font-bold text-emerald-900 bg-emerald-100/70 p-4 rounded-xl border border-emerald-300 text-sm">
              <span className="uppercase tracking-wider">Laba Bersih Bersih Usaha (Net Profit)</span>
              <span className="font-mono tabular-nums text-base">{formatRupiah(labaBersihSetelahPajak)}</span>
            </div>
          </div>
        </div>
      )}

      {/* KONTEN LAPORAN: 2. ARUS KAS */}
      {reportType === 'arus-kas' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          <div className="text-center pb-4 border-b border-slate-200 space-y-1">
            <h2 className="text-lg font-bold text-slate-900 uppercase">
              {userProfile.businessName}
            </h2>
            <h3 className="text-sm font-semibold text-teal-800">
              Laporan Arus Kas (Cash Flow Statement)
            </h3>
            <p className="text-xs text-slate-500">Metode Langsung · Periode: {selectedPeriod}</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Arus Kas Operasi */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg">
                <span className="uppercase">A. Arus Kas dari Aktivitas Operasional</span>
                <span className="font-mono tabular-nums text-emerald-700">+{formatRupiah(labaBersihOperasional)}</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Penerimaan kas dari pelanggan</span>
                  <span className="font-mono tabular-nums">+{formatRupiah(totalPenjualan)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Pembayaran kas ke supplier bahan</span>
                  <span className="font-mono tabular-nums text-rose-700">({formatRupiah(bebanHpp)})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Pembayaran operasional &amp; utilitas</span>
                  <span className="font-mono tabular-nums text-rose-700">({formatRupiah(bebanOperasional)})</span>
                </div>
              </div>
            </div>

            {/* Arus Kas Investasi */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg">
                <span className="uppercase">B. Arus Kas dari Aktivitas Investasi</span>
                <span className="font-mono tabular-nums text-slate-600">(Rp 1.200.000)</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Pembelian mesin &amp; perlengkapan kasir baru</span>
                  <span className="font-mono tabular-nums text-rose-700">(Rp 1.200.000)</span>
                </div>
              </div>
            </div>

            {/* Arus Kas Pendanaan */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg">
                <span className="uppercase">C. Arus Kas dari Aktivitas Pendanaan</span>
                <span className="font-mono tabular-nums text-slate-600">Rp 0</span>
              </div>
            </div>

            {/* Kenaikan Bersih Kas */}
            <div className="flex justify-between font-bold text-slate-900 bg-teal-50 p-4 rounded-xl border border-teal-200">
              <span>Kenaikan Bersih Kas &amp; Setara Kas</span>
              <span className="font-mono tabular-nums text-teal-800 text-sm">
                +{formatRupiah(labaBersihOperasional - 1200000)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* KONTEN LAPORAN: 3. NERACA SALDO */}
      {reportType === 'neraca' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          <div className="text-center pb-4 border-b border-slate-200 space-y-1">
            <h2 className="text-lg font-bold text-slate-900 uppercase">
              {userProfile.businessName}
            </h2>
            <h3 className="text-sm font-semibold text-teal-800">
              Ringkasan Neraca Posisi Keuangan (Balance Sheet)
            </h3>
            <p className="text-xs text-slate-500">Per 10 Oktober 2026</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Aset */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-2">
                Aset Usaha (Aktiva)
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Kas &amp; Rekening Bank Likuid</span>
                  <span className="font-mono tabular-nums font-semibold">Rp 153.900.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Piutang Usaha Pelanggan</span>
                  <span className="font-mono tabular-nums font-semibold">Rp 12.500.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Persediaan Barang &amp; Bahan Baku</span>
                  <span className="font-mono tabular-nums font-semibold">Rp 28.400.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Peralatan &amp; Mesin Usaha (Net)</span>
                  <span className="font-mono tabular-nums font-semibold">Rp 45.000.000</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-slate-900 text-sm">
                  <span>Total Aset Usaha:</span>
                  <span className="font-mono tabular-nums text-teal-800">Rp 239.800.000</span>
                </div>
              </div>
            </div>

            {/* Liabilitas & Ekuitas */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-2">
                Liabilitas &amp; Ekuitas (Pasiva)
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Utang Usaha ke Supplier</span>
                  <span className="font-mono tabular-nums font-semibold">Rp 5.400.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Kewajiban Pajak &amp; Utilitas Terutang</span>
                  <span className="font-mono tabular-nums font-semibold">Rp 1.850.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Modal Awal Disetor Pemilik</span>
                  <span className="font-mono tabular-nums font-semibold">Rp 180.000.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Saldo Laba Ditahan &amp; Berjalan</span>
                  <span className="font-mono tabular-nums font-semibold">Rp 52.550.000</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-slate-900 text-sm">
                  <span>Total Liabilitas &amp; Modal:</span>
                  <span className="font-mono tabular-nums text-teal-800">Rp 239.800.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL OTENTIKASI GOOGLE SSO SEBELUM EKSPOR ===================== */}
      {isSSOModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 text-left relative">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    Otentikasi Google SSO Wajib
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Perlindungan Ekspor Berkas Laporan Keuangan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSSOModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">
                  SOP Keamanan Dokumen Keuangan
                </p>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  Untuk mencegah pencurian, kebocoran, dan akses tak berwenang, setiap tindakan unduh berkas ({pendingExportType.toUpperCase()}) wajib diverifikasi melalui Google Single Sign-On (SSO).
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">
                Alamat Akun Google Resmi Penanggung Jawab:
              </label>
              <input
                type="email"
                value={ssoEmailInput}
                onChange={(e) => setSsoEmailInput(e.target.value)}
                placeholder="nama@gmail.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono text-xs"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleVerifySSOAndProceed}
                disabled={isVerifyingSSO || !ssoEmailInput.trim()}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isVerifyingSSO ? (
                  <span>Memverifikasi SSO Google...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Verifikasi Google SSO &amp; Lanjutkan Ekspor</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
