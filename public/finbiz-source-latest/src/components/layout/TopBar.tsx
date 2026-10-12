import React from 'react';
import { ActiveTab, UserProfile } from '../../types';
import { 
  LogIn, 
  Calendar, 
  PlusCircle, 
  ChevronRight, 
  CheckCircle2,
  LogOut
} from 'lucide-react';

interface TopBarProps {
  activeTab: ActiveTab;
  userProfile: UserProfile;
  onOpenAuthModal: (step?: 1 | 2) => void;
  onOpenNewTransaction: () => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  userProfile,
  onOpenAuthModal,
  onOpenNewTransaction,
  selectedPeriod,
  onPeriodChange,
  onNavigateTab,
  onLogout,
}) => {
  const tabTitles: Record<ActiveTab, { title: string; category: string }> = {
    dashboard: { title: 'Dashboard', category: 'Ringkasan Keuangan' },
    perencanaan: { title: 'Perencanaan', category: 'RAB & Target Omzet' },
    pelaksanaan: { title: 'Pelaksanaan', category: 'Buku Kas & Transaksi' },
    pelaporan: { title: 'Pelaporan', category: 'Laba Rugi & Neraca' },
    pengaturan: { title: 'Pengaturan', category: 'Kontrol & Sistem' },
    akun: { title: 'Akun', category: 'Profil & Usaha' },
  };

  const current = tabTitles[activeTab];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8 sticky top-0 z-30">
      {/* Zone 1: Breadcrumb Context */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap shrink-0">
          FinBiz Usaha
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <span className="text-sm font-bold text-slate-900 truncate">
          {current.title}
        </span>
      </div>

      {/* Zone 2: Filter Periode Pembukuan */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500 font-medium">Buku Fiskal:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="Oktober 2026">Oktober 2026 (Berjalan)</option>
            <option value="September 2026">September 2026</option>
            <option value="Kuartal IV 2026">Kuartal IV 2026</option>
            <option value="Tahun 2026">Tahun Fiskal 2026</option>
          </select>
        </div>
      </div>

      {/* Zone 3: 1 Primary Actions & Login Button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenNewTransaction}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5 shrink-0" />
          <span>+ Catat Transaksi</span>
        </button>

        <button
          onClick={() => onNavigateTab ? onNavigateTab('akun') : onOpenAuthModal(1)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 shadow-xs"
          title="Buka Fitur Akun & Identitas Pengguna"
        >
          {userProfile.avatarUrl ? (
            <img 
              src={userProfile.avatarUrl} 
              alt="Avatar" 
              className="w-6 h-6 rounded-lg object-cover border border-slate-300 shrink-0" 
            />
          ) : userProfile.googleLinked ? (
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          ) : (
            <LogIn className="w-4 h-4 text-slate-500 shrink-0" />
          )}
          <span className="hidden sm:inline font-bold">
            {userProfile.name || 'Akun'}
          </span>
          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-mono hidden md:inline">
            Akun
          </span>
        </button>

        {/* Tombol Keluar (Logout) Terlihat Sangat Jelas di TopBar */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white border border-rose-500 rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm hover:shadow"
          title="Keluar dari akun Anda saat ini (Logout)"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0 text-white" />
          <span className="font-bold">Keluar</span>
        </button>
      </div>
    </header>
  );
};
