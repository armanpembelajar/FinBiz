import React, { useState } from 'react';
import { Transaction, FeatureControls } from '../../types';
import { formatRupiah } from '../../data/mockData';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Printer, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface PelaksanaanViewProps {
  transactions: Transaction[];
  onOpenNewTransaction: () => void;
  featureControls: FeatureControls;
}

export const PelaksanaanView: React.FC<PelaksanaanViewProps> = ({
  transactions,
  onOpenNewTransaction,
  featureControls,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'masuk' | 'keluar'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [activeInvoice, setActiveInvoice] = useState<Transaction | null>(null);

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchType = filterType === 'all' || t.type === filterType;
    const matchSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.receiptNo && t.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchMethod = selectedMethod === 'all' || t.paymentMethod === selectedMethod;
    return matchType && matchSearch && matchMethod;
  });

  const totalMasuk = filteredTransactions
    .filter((t) => t.type === 'masuk')
    .reduce((a, b) => a + b.amount, 0);

  const totalKeluar = filteredTransactions
    .filter((t) => t.type === 'keluar')
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Banner Pelaksanaan */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-teal-300">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>FinBiz Keuangan</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Kas &amp; Catatan Transaksi</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Pelaksanaan Kas &amp; Buku Jurnal Harian
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Pencatatan realisasi mutasi uang masuk dan keluar usaha lengkap dengan nomor bukti dan metode pembayaran.
          </p>
        </div>

        <button
          onClick={onOpenNewTransaction}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ Catat Transaksi</span>
        </button>
      </div>

      {/* Mini summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Total Realisasi Masuk (Filter)</span>
            <div className="text-base font-bold text-emerald-600 font-mono tabular-nums">
              +{formatRupiah(totalMasuk)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Total Realisasi Keluar (Filter)</span>
            <div className="text-base font-bold text-rose-600 font-mono tabular-nums">
              -{formatRupiah(totalKeluar)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Jumlah Transaksi Terdata</span>
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
              {filteredTransactions.length} Rekaman
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Sub-sistem 1: Toolbar Filter & Pencarian Cepat */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Type tabs (Segmented Button Controls) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium shrink-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Transaksi
          </button>
          <button
            onClick={() => setFilterType('masuk')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'masuk' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Uang Masuk (+)
          </button>
          <button
            onClick={() => setFilterType('keluar')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'keluar' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Uang Keluar (-)
          </button>
        </div>

        {/* Search & Method dropdown */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari deskripsi, kategori, atau no bukti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">Semua Metode</option>
            <option value="Transfer Bank">Transfer Bank</option>
            <option value="QRIS">QRIS</option>
            <option value="Tunai">Tunai</option>
          </select>
        </div>
      </div>

      {/* Sub-sistem 2: Tabel Buku Kas Pelaksanaan */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Tanggal &amp; No. Bukti</th>
                <th className="px-5 py-3">Deskripsi Transaksi</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Metode Bayar</th>
                <th className="px-5 py-3 text-right">Nominal Arus Kas</th>
                <th className="px-5 py-3 text-center">Aksi / Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    Tidak ada transaksi yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{t.date}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{t.receiptNo || t.id}</div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{t.description}</div>
                      <div className="text-[11px] text-teal-700">{t.status}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {t.category}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono">
                      {t.paymentMethod}
                    </td>
                    <td className={`px-5 py-3.5 text-right font-mono tabular-nums font-bold ${
                      t.type === 'masuk' ? 'text-emerald-700' : 'text-slate-900'
                    }`}>
                      {t.type === 'masuk' ? '+' : '-'}{formatRupiah(t.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {featureControls.enableInvoiceGenerator ? (
                        <button
                          onClick={() => setActiveInvoice(t)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-lg transition-colors border border-teal-200"
                          title="Lihat Pratinjau Bukti / Faktur"
                        >
                          Lihat Faktur
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {t.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-sistem 3: Generator Pratinjau Faktur / Bukti Kas Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Bukti Transaksi &amp; Faktur Pembukuan
                </h3>
              </div>
              <button
                onClick={() => setActiveInvoice(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">FinBiz Usaha Voucher</h4>
                  <p className="text-slate-500 font-mono text-[11px]">No: {activeInvoice.receiptNo || activeInvoice.id}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-700">Tanggal:</span>
                  <p className="font-mono">{activeInvoice.date}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="text-slate-500">Perihal / Keterangan:</div>
                <div className="font-semibold text-slate-900">{activeInvoice.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2">
                <div>
                  <span className="text-slate-500">Kategori Akun:</span>
                  <div className="font-medium text-slate-800">{activeInvoice.category}</div>
                </div>
                <div>
                  <span className="text-slate-500">Metode Bayar:</span>
                  <div className="font-medium text-slate-800 font-mono">{activeInvoice.paymentMethod}</div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-800">Total Nominal:</span>
                <span className={`font-bold font-mono tabular-nums text-base ${
                  activeInvoice.type === 'masuk' ? 'text-emerald-700' : 'text-slate-900'
                }`}>
                  {formatRupiah(activeInvoice.amount)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Bukti</span>
              </button>
              <button
                onClick={() => setActiveInvoice(null)}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
