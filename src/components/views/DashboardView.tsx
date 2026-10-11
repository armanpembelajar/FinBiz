import React from 'react';
import { UserProfile, Transaction, BudgetItem, ActiveTab, FeatureControls } from '../../types';
import { formatRupiah } from '../../data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  transactions: Transaction[];
  budgetItems: BudgetItem[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenNewTransaction: () => void;
  onOpenAuthModal: (step?: 1 | 2) => void;
  featureControls: FeatureControls;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  transactions,
  budgetItems,
  onNavigateTab,
  onOpenNewTransaction,
  onOpenAuthModal,
  featureControls,
  selectedPeriod,
  onPeriodChange,
}) => {
  const totalMasuk = transactions
    .filter((t) => t.type === 'masuk')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalKeluar = transactions
    .filter((t) => t.type === 'keluar')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSaldoKas = 153900000 + (totalMasuk - totalKeluar);
  const labaBersih = totalMasuk - totalKeluar;
  const netMargin = totalMasuk > 0 ? ((labaBersih / totalMasuk) * 100).toFixed(1) : '0';

  // Sample weekly cashflow data
  const weeklyData = [
    { week: 'M1 Okt', masuk: 8500000, keluar: 4100000 },
    { week: 'M2 Okt', masuk: 12250000, keluar: 5200000 },
    { week: 'M3 Okt (Est)', masuk: 9500000, keluar: 3800000 },
    { week: 'M4 Okt (Est)', masuk: 11000000, keluar: 4900000 },
  ];

  return (
    <div className="space-y-6">
      {/* Portal Beranda Banner - Bersih, Utuh, dan Kokoh */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 md:p-8 text-white border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-teal-300">
            <Building className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-white">{userProfile.businessName}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Sektor {userProfile.businessType}</span>
            {userProfile.googleLinked && (
              <>
                <span className="text-slate-500">·</span>
                <span className="inline-flex items-center gap-1 text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded text-[10px]">
                  <ShieldCheck className="w-3 h-3" />
                  Google Linked
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Ikhtisar Kesehatan Finansial Usaha
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Selamat datang, <span className="font-semibold text-white">{userProfile.name}</span>. Pembukuan bulan berjalan menunjukkan arus kas operasional dalam kondisi surplus stabil.
          </p>
        </div>

        {/* Indikator Status Portal Beranda (Murni Informasi & Non-Input) */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-xs text-slate-300 shadow-xs shrink-0 self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-bold text-white text-xs">Portal Beranda FinBiz</span>
            <span className="text-[10px] text-teal-400 font-mono">Buku Kas Berjalan Aktif</span>
          </div>
        </div>
      </div>

      {/* 4 Kartu KPI Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Saldo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Saldo Kas &amp; Bank</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {formatRupiah(totalSaldoKas)}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-teal-600 font-semibold flex items-center">
              +4.8%
            </span>
            <span>dari saldo awal bulan</span>
          </div>
        </div>

        {/* KPI 2: Arus Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Kas Masuk (Omzet Usaha)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-600 font-mono tabular-nums">
            {formatRupiah(totalMasuk)}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12.3%
            </span>
            <span>vs bulan sebelumnya</span>
          </div>
        </div>

        {/* KPI 3: Arus Keluar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Kas Keluar (Operasional &amp; HPP)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-600 font-mono tabular-nums">
            {formatRupiah(totalKeluar)}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-rose-600 font-semibold flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> 68%
            </span>
            <span>dari pagu anggaran</span>
          </div>
        </div>

        {/* KPI 4: Laba Bersih */}
        {featureControls.showNetMarginKpi && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Laba Operasional Bersih</span>
              <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                <PieChart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-teal-700 font-mono tabular-nums">
              {formatRupiah(labaBersih)}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="text-teal-700 font-semibold">Net Margin: {netMargin}%</span>
              <span>(Sehat)</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Grafik Tren & Alokasi Anggaran */}
      {(featureControls.showCashflowChart || featureControls.showBudgetAbsorption) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grafik Arus Kas Mingguan */}
          {featureControls.showCashflowChart && (
            <div className={`${featureControls.showBudgetAbsorption ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tren Arus Kas Masuk vs Keluar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perbandingan arus uang masuk dan pengeluaran per periode mingguan
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500" />
                    <span>Kas Masuk</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-rose-400" />
                    <span>Kas Keluar</span>
                  </div>
                </div>
              </div>

              {/* SVG Visualisasi Grafik */}
              <div className="pt-4 pb-2">
                <div className="grid grid-cols-4 gap-4 h-48 items-end border-b border-slate-200 pb-2 px-2">
                  {weeklyData.map((item, idx) => {
                    const maxVal = 14000000;
                    const masukHeight = Math.min(100, Math.round((item.masuk / maxVal) * 100));
                    const keluarHeight = Math.min(100, Math.round((item.keluar / maxVal) * 100));
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="w-full flex items-end justify-center gap-2 h-36">
                          <div 
                            style={{ height: `${masukHeight}%` }}
                            className="w-5 md:w-8 bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all relative cursor-pointer"
                            title={`Masuk: ${formatRupiah(item.masuk)}`}
                          />
                          <div 
                            style={{ height: `${keluarHeight}%` }}
                            className="w-5 md:w-8 bg-rose-400 rounded-t-md hover:bg-rose-500 transition-all relative cursor-pointer"
                            title={`Keluar: ${formatRupiah(item.keluar)}`}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600 font-mono">
                          {item.week}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Rata-rata surplus mingguan: <strong className="text-slate-800 font-mono tabular-nums">Rp 5.230.000</strong></span>
                <button
                  onClick={() => onNavigateTab('pelaporan')}
                  className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
                >
                  Buka Laporan Arus Kas Lengkap <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Realisasi Anggaran Pos Usaha */}
          {featureControls.showBudgetAbsorption && (
            <div className={`${featureControls.showCashflowChart ? 'lg:col-span-1' : 'lg:col-span-3'} bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Alokasi Pagu Anggaran
                </h3>
                <button
                  onClick={() => onNavigateTab('perencanaan')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                >
                  Atur RAB
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Monitoring serapan dana operasional vs rencana awal
              </p>

              <div className="space-y-3.5 pt-1">
                {budgetItems.slice(0, 4).map((bg) => {
                  const pct = Math.min(100, Math.round((bg.realizedAmount / bg.plannedAmount) * 100));
                  const isOver = pct > 90;
                  return (
                    <div key={bg.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 truncate">{bg.category}</span>
                        <span className={`font-mono tabular-nums font-semibold ${isOver ? 'text-amber-600' : 'text-slate-600'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full transition-all ${
                            isOver ? 'bg-amber-500' : 'bg-teal-600'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono tabular-nums">
                        <span>{formatRupiah(bg.realizedAmount)}</span>
                        <span className="text-slate-400">/ {formatRupiah(bg.plannedAmount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Section: Transaksi Terkini & Tagihan Kewajiban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 5 Transaksi Pelaksanaan Terkini */}
        <div className={`${featureControls.showUpcomingDueDates ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden`}>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Buku Kas Pelaksanaan Terkini
              </h3>
              <p className="text-xs text-slate-500">
                Catatan mutasi keluar &amp; masuk harian yang telah terdata
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('pelaksanaan')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              Lihat Semua Buku Kas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    t.type === 'masuk' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {t.type === 'masuk' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {t.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{t.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{t.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{t.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-xs font-bold font-mono tabular-nums ${
                    t.type === 'masuk' ? 'text-emerald-700' : 'text-slate-900'
                  }`}>
                    {t.type === 'masuk' ? '+' : '-'}{formatRupiah(t.amount)}
                  </div>
                  <span className="text-[10px] text-teal-700 font-medium">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pengingat Kewajiban: Piutang & Utang */}
        {featureControls.showUpcomingDueDates && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Jadwal Jatuh Tempo Usaha
            </h3>
            <p className="text-xs text-slate-500">
              Kewajiban bayar supplier &amp; tagihan pelanggan berjalan
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                  <span>Piutang: PT Mitra Ritel Mandiri</span>
                  <span className="font-mono tabular-nums">Rp 12.500.000</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Jatuh tempo 15 Okt 2026 (5 hari lagi)</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span>Utang Supplier: CV Bahan Abadi</span>
                  <span className="font-mono tabular-nums text-rose-700">Rp 5.400.000</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Jatuh tempo 20 Okt 2026</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span>Pajak Usaha (PPh Final UMKM 0.5%)</span>
                  <span className="font-mono tabular-nums">Rp 372.500</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Batas setor 15 Nov 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
