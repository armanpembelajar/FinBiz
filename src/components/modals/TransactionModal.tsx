import React, { useState } from 'react';
import { Transaction } from '../../types';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Transaction) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [type, setType] = useState<'masuk' | 'keluar'>('masuk');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Penjualan Produk');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Transfer Bank' | 'Tunai' | 'QRIS' | 'Giro'>('Transfer Bank');
  const [receiptNo, setReceiptNo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTx: Transaction = {
      id: `TX-2026-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      description,
      category,
      type,
      amount: Number(amount),
      paymentMethod,
      status: 'Terverifikasi',
      receiptNo: receiptNo || `INV/${Date.now().toString().slice(-6)}`,
    };

    onAddTransaction(newTx);
    setDescription('');
    setAmount('');
    setReceiptNo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="h-1.5 w-full bg-teal-600" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Catat Transaksi Kas Baru
            </h3>
            <p className="text-xs text-slate-500">
              Pencatatan mutasi kas harian untuk memperbarui arus kas operasional
            </p>
          </div>

          {/* Toggle Masuk vs Keluar */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setType('masuk');
                setCategory('Penjualan Produk');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                type === 'masuk' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Kas Masuk (Inflow)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('keluar');
                setCategory('Bahan Baku & HPP');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                type === 'keluar' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Kas Keluar (Outflow)</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Deskripsi Transaksi
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Penerimaan pembayaran invoice toko grosir"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {type === 'masuk' ? (
                    <>
                      <option value="Penjualan Produk">Penjualan Produk / Grosir</option>
                      <option value="Pendapatan Jasa">Pendapatan Jasa</option>
                      <option value="Pelunasan Piutang">Pelunasan Piutang</option>
                      <option value="Pendapatan Lain-lain">Pendapatan Lain-lain</option>
                    </>
                  ) : (
                    <>
                      <option value="Bahan Baku & HPP">Bahan Baku &amp; HPP</option>
                      <option value="Gaji & Upah">Gaji &amp; Upah Karyawan</option>
                      <option value="Pemasaran & Promosi">Pemasaran &amp; Promosi</option>
                      <option value="Utilitas & Operasional">Utilitas &amp; Operasional</option>
                      <option value="Logistik & Pengiriman">Logistik &amp; Pengiriman</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nominal Transaksi (Rp)
                </label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 3500000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="QRIS">QRIS</option>
                  <option value="Tunai">Tunai Kasir</option>
                  <option value="Giro">Giro / Cek</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Bukti / Kwitansi (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: INV-1002"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
              >
                Simpan Transaksi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
