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
  User,
  X,
  FolderLock
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  userProfile?: UserProfile;
  onOpenAuthModal?: (step?: 1 | 2) => void;
  featureControls: FeatureControls;
  onLogout?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  userProfile,
  featureControls,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
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
    { key: 'masterdata', label: 'Master Data', icon: FolderLock, desc: 'Folder & Ekspor SSO', isEnabled: featureControls.enableMasterData },
    { key: 'pengaturan', label: 'Pengaturan', icon: Settings, desc: 'Kontrol & Sistem', isEnabled: true },
    { key: 'akun', label: 'Akun', icon: UserCheck, desc: 'Profil & Usaha', isEnabled: true },
  ];

  // Hanya tampilkan modul yang aktif sehingga fitur di bagian bawah otomatis naik ke bagian atas
  const visibleNavItems = allNavItems.filter((item) => item.isEnabled);

  const renderSidebarContent = (isMobileView: boolean) => (
    <>
      {/* Brand Zone */}
      <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between shrink-0">
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

        {isMobileView && onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup menu navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        )}
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
              onClick={() => {
                onTabChange(item.key);
                if (isMobileView && onCloseMobile) {
                  onCloseMobile();
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
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
        <div className="p-3 border-t border-slate-800 bg-slate-950/50 space-y-2 shrink-0">
          {/* User Profile Card */}
          <button
            onClick={() => {
              onTabChange('akun');
              if (isMobileView && onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
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
              onClick={() => {
                if (isMobileView && onCloseMobile) onCloseMobile();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-600/15 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-500 text-rose-300 hover:text-white rounded-xl text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
              title="Keluar dari akun Anda saat ini"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* 1. Desktop & Tablet Sticky Sidebar (Tampil di md ke atas) */}
      <aside className="hidden md:flex md:w-60 lg:w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex-col shrink-0 h-screen sticky top-0 transition-all select-none">
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile Drawer & Backdrop (Tampil hanya di layar HP / mobile < md saat dibuka) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent(true)}
      </aside>
    </>
  );
};
