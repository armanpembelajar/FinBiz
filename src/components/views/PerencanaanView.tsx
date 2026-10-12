import React, { useState } from 'react';
import { BudgetItem, RevenueTarget, FeatureControls } from '../../types';
import { formatRupiah, initialRevenueTargets } from '../../data/mockData';
import { 
  Target, 
  Plus, 
  Calculator, 
  AlertCircle, 
  Check, 
  TrendingUp,
  PieChart
} from 'lucide-react';

interface PerencanaanViewProps {
  budgetItems: BudgetItem[];
  onAddBudgetItem: (item: BudgetItem) => void;
  featureControls: FeatureControls;
}

export const PerencanaanView: React.FC<PerencanaanViewProps> = ({
  budgetItems,
  onAddBudgetItem,
  featureControls,
}) => {
  const [revenueTargets, setRevenueTargets] = useState<RevenueTarget[]>(initialRevenueTargets);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);

  // Form states for new budget item
  const [newCategory, setNewCategory] = useState('');
  const [newDivision, setNewDivision] = useState('Operasional');
  const [newPlannedAmount, setNewPlannedAmount] = useState('');

  // BEP Calculator state
  const [fixedCostInput, setFixedCostInput] = useState<number>(35000000);
  const [variableCostRatio, setVariableCostRatio] = useState<number>(55); // 55% COGS
  const marginRatio = (100 - variableCostRatio) / 100;
  const breakEvenRevenue = marginRatio > 0 ? fixedCostInput / marginRatio : 0;
  const emergencyFundTarget = fixedCostInput * 3; // 3 months buffer

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newPlannedAmount) return;

    const newItem: BudgetItem = {
      id: `BG-${Date.now().toString().slice(-4)}`,
      category: newCategory,
      division: newDivision,
      plannedAmount: Number(newPlannedAmount),
      realizedAmount: 0,
      period: 'Oktober 2026',
    };

    onAddBudgetItem(newItem);
    setNewCategory('');
    setNewPlannedAmount('');
    setShowAddBudgetModal(false);
  };

  const totalPlanned = budgetItems.reduce((acc, curr) => acc + curr.plannedAmount, 0);
  const totalRealized = budgetItems.reduce((acc, curr) => acc + curr.realizedAmount, 0);
  const totalBudgetRemaining = totalPlanned - totalRealized;
  const overallAbsorption = totalPlanned > 0 ? Math.round((totalRealized / totalPlanned) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Banner Perencanaan */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-teal-300">
            <Target className="w-4 h-4 text-teal-400" />
            <span>FinBiz Keuangan</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">RAB &amp; Target Omzet</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Perencanaan Finansial &amp; Rencana Anggaran Biaya (RAB)
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Tetapkan target omzet penjualan bulanan, susun pagu batas belanja divisi, dan proyeksikan titik impas (BEP) usaha.
          </p>
        </div>

        {featureControls.enableNewBudgetCreation && (
          <button
            onClick={() => setShowAddBudgetModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ Alokasi Pos Baru</span>
          </button>
        )}
      </div>

      {/* KPI Ringkasan Perencanaan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <span className="text-xs text-slate-500 font-medium">Total Rencana Anggaran (Pagu)</span>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
            {formatRupiah(totalPlanned)}
          </div>
          <span className="text-[11px] text-slate-400">Total batas belanja yang dialokasikan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <span className="text-xs text-slate-500 font-medium">Realisasi Serapan Dana</span>
          <div className="text-lg font-bold text-teal-700 font-mono tabular-nums">
            {formatRupiah(totalRealized)} ({overallAbsorption}%)
          </div>
          <span className="text-[11px] text-teal-600 font-medium">Masih dalam batas aman anggaran</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <span className="text-xs text-slate-500 font-medium">Sisa Pagu yang Tersedia</span>
          <div className="text-lg font-bold text-slate-700 font-mono tabular-nums">
            {formatRupiah(totalBudgetRemaining)}
          </div>
          <span className="text-[11px] text-slate-400">Dapat dibelanjakan hingga akhir bulan</span>
        </div>
      </div>

      {/* Sub-sistem 1: Tabel Target Omzet & Rencana Penjualan */}
      {featureControls.enableRevenueTargets && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Target Omzet &amp; Rencana Penjualan Usaha
                </h2>
                <p className="text-xs text-slate-500">
                  Pencapaian target penjualan bulanan terhadap proyeksi rencana
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Bulan Fiskal</th>
                  <th className="px-5 py-3 text-right">Target Omzet</th>
                  <th className="px-5 py-3 text-right">Realisasi Omzet</th>
                  <th className="px-5 py-3 text-center">Pencapaian (%)</th>
                  <th className="px-5 py-3">Keterangan Evaluasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {revenueTargets.map((item, idx) => {
                  const percent = Math.round((item.actual / item.target) * 100);
                  const isPassed = percent >= 100;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{item.month}</td>
                      <td className="px-5 py-3.5 text-right font-mono tabular-nums">{formatRupiah(item.target)}</td>
                      <td className="px-5 py-3.5 text-right font-mono tabular-nums font-bold text-slate-900">
                        {formatRupiah(item.actual)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`font-mono tabular-nums font-semibold ${
                          isPassed ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {percent}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-[11px]">{item.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-sistem 2: Rencana Anggaran Biaya (RAB) per Pos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-teal-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pagu Alokasi Rencana Anggaran Biaya (RAB)
              </h2>
              <p className="text-xs text-slate-500">
                Rincian batasan pengeluaran per divisi operasional dan persentase serapan
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Pos Kategori Belanja</th>
                <th className="px-5 py-3">Divisi Penangggung Jawab</th>
                <th className="px-5 py-3 text-right">Pagu Rencana</th>
                <th className="px-5 py-3 text-right">Realisasi Kas</th>
                <th className="px-5 py-3 text-right">Sisa Pagu</th>
                <th className="px-5 py-3 text-center">Status Serapan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {budgetItems.map((item) => {
                const sisa = item.plannedAmount - item.realizedAmount;
                const pct = Math.min(100, Math.round((item.realizedAmount / item.plannedAmount) * 100));
                const isWarning = pct >= 90;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {item.category}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{item.division}</td>
                    <td className="px-5 py-3.5 text-right font-mono tabular-nums">
                      {formatRupiah(item.plannedAmount)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-900 font-semibold">
                      {formatRupiah(item.realizedAmount)}
                    </td>
                    <td className={`px-5 py-3.5 text-right font-mono tabular-nums font-semibold ${
                      sisa < 0 ? 'text-rose-600' : 'text-slate-600'
                    }`}>
                      {formatRupiah(sisa)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5 font-mono tabular-nums font-semibold">
                        <span className={`w-2 h-2 rounded-full ${isWarning ? 'bg-amber-500' : 'bg-teal-500'}`} />
                        <span>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-sistem 3: Kalkulator Titik Impas (Break Even Point / BEP) & Kas Darurat */}
      {featureControls.enableBepCalculator && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Proyeksi Titik Impas (BEP) &amp; Target Dana Cadangan Darurat
              </h2>
              <p className="text-xs text-slate-500">
                Simulasi omzet minimum agar usaha tidak mengalami kerugian operasional
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Parameter Biaya Operasional
              </h3>
              <div>
                <label className="block text-xs text-slate-600 font-medium mb-1">
                  Estimasi Biaya Tetap Bulanan (Gaji, Sewa, Utilitas):
                </label>
                <input
                  type="number"
                  value={fixedCostInput}
                  onChange={(e) => setFixedCostInput(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 font-medium mb-1">
                  Estimasi Rasio Biaya Variabel / HPP (% dari Omzet):
                </label>
                <input
                  type="number"
                  value={variableCostRatio}
                  onChange={(e) => setVariableCostRatio(Math.min(95, Math.max(5, Number(e.target.value) || 0)))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="space-y-4 p-4 bg-teal-50/60 rounded-xl border border-teal-200/80 flex flex-col justify-center">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-teal-800">
                  Omzet Minimum Titik Impas (Break Even Point):
                </span>
                <div className="text-2xl font-bold text-teal-950 font-mono tabular-nums">
                  {formatRupiah(breakEvenRevenue)}
                  <span className="text-xs font-normal text-teal-800"> / bulan</span>
                </div>
                <p className="text-[11px] text-teal-700">
                  Usaha mulai membukukan laba bersih setelah melampaui omzet ini.
                </p>
              </div>

              <div className="pt-2 border-t border-teal-200/80 space-y-1">
                <span className="text-xs font-semibold text-teal-800">
                  Rekomendasi Cadangan Kas Darurat Usaha (3 Bulan Biaya Tetap):
                </span>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {formatRupiah(emergencyFundTarget)}
                </div>
                <p className="text-[11px] text-slate-500">
                  Dana likuid yang sebaiknya selalu disimpan di rekening operasional cadangan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Pos Anggaran Baru */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">
              Tambah Alokasi Pos Anggaran Baru
            </h3>
            <form onSubmit={handleCreateBudget} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pos Kategori Belanja
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Langganan Software & Cloud"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Divisi Penanggung Jawab
                </label>
                <select
                  value={newDivision}
                  onChange={(e) => setNewDivision(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="Operasional">Operasional Usaha</option>
                  <option value="Produksi">Produksi &amp; Bahan</option>
                  <option value="Pemasaran">Pemasaran &amp; Promosi</option>
                  <option value="SDM & Umum">SDM &amp; Umum</option>
                  <option value="Teknologi & Aset">Teknologi &amp; Aset</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Besaran Pagu Rencana (Rp)
                </label>
                <input
                  type="number"
                  required
                  placeholder="5000000"
                  value={newPlannedAmount}
                  onChange={(e) => setNewPlannedAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBudgetModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  Simpan Pos Anggaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
