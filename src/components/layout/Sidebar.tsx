import React from 'react';
import { ActiveTab, UserProfile, FeatureControls } from '../../types';
import { 
  LayoutDashboard, 
  CalendarClock, 
  ReceiptText, 
  FileBarChart2, 
  Settings, 
  UserCheck, 
  Layers,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  userProfile?: UserProfile;
  onOpenAuthModal?: (step?: 1 | 2) => void;
  featureControls: FeatureControls;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  userProfile,
  featureControls,
  onLogout,
}) => {
  const allNavItems: { 
    key: ActiveTab; 
    label: string; 
    icon: React.ElementType; 
    desc: string; 
    isEnabled: boolean 
  }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Ikhtisar & Metrik', isEnabled: true },
    { key: 'perencanaan', label: 'Perencanaan', icon: CalendarClock, desc: 'RAB & Target', isEnabled: featureControls.enablePerencanaan },
    { key: 'pelaksanaan', label: 'Pelaksanaan', icon: ReceiptText, desc: 'Kas & Catatan', isEnabled: featureControls.enablePelaksanaan },
    { key: 'pelaporan', label: 'Pelaporan', icon: FileBarChart2, desc: 'Laba Rugi & Neraca', isEnabled: featureControls.enablePelaporan },
    { key: 'pengaturan', label: 'Pengaturan', icon: Settings, desc: 'Kontrol & Sistem', isEnabled: true },
    { key: 'akun', label: 'Akun', icon: UserCheck, desc: 'Profil & Usaha', isEnabled: true },
  ];

  // Hanya tampilkan modul yang aktif sehingga fitur di bagian bawah otomatis naik ke bagian atas
  const visibleNavItems = allNavItems.filter((item) => item.isEnabled);

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0 transition-all select-none">
      {/* Brand Zone */}
      <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-base">
            <Layers className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white font-sans">
              FinBiz
            </span>
            <span className="text-[10px] text-teal-400 font-medium tracking-wide">
              Keuangan UMKM
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 pb-1.5 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          <span>Keuangan</span>
          <span className="text-[10px] font-normal lowercase bg-slate-800 text-teal-400 px-1.5 py-0.5 rounded-md">
            {visibleNavItems.length} aktif
          </span>
        </div>

        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                isActive
                  ? 'bg-teal-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold truncate leading-snug">{item.label}</span>
                <span className={`text-[10px] truncate ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer User Profile & Logout */}
      {userProfile && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/50 space-y-2">
          {/* User Profile Card */}
          <button
            onClick={() => onTabChange('akun')}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
              activeTab === 'akun' ? 'bg-slate-800 text-white' : 'hover:bg-slate-850 text-slate-300 hover:text-white'
            }`}
            title="Kelola Profil & Akun"
          >
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-300 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate leading-tight">
                {userProfile.name || 'Pengguna'}
              </span>
              <span className="text-[10px] text-teal-400 truncate leading-tight">
                {userProfile.businessName || 'Profil Usaha'}
              </span>
            </div>
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-600/15 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-500 text-rose-300 hover:text-white rounded-xl text-xs font-semibold transition-all active:scale-[0.98]"
              title="Keluar dari akun Anda saat ini"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
