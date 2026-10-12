/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, UserProfile, Transaction, BudgetItem, FeatureControls } from './types';
import { initialTransactions, initialBudgetItems, defaultFeatureControls } from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { PerencanaanView } from './components/views/PerencanaanView';
import { PelaksanaanView } from './components/views/PelaksanaanView';
import { PelaporanView } from './components/views/PelaporanView';
import { PengaturanView } from './components/views/PengaturanView';
import { AkunView } from './components/views/AkunView';
import { AuthModal } from './components/auth/AuthModal';
import { Landing3DView } from './components/auth/Landing3DView';
import { TransactionModal } from './components/modals/TransactionModal';
import { ThreeInteractiveBackground } from './components/common/ThreeInteractiveBackground';
import { 
  CheckCircle2, 
  LogOut, 
  Menu, 
  Layers, 
  LayoutDashboard, 
  ReceiptText, 
  CalendarClock, 
  UserCheck 
} from 'lucide-react';
import { supabase } from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Oktober 2026');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Master Kontrol Penuh Atas Semua Fitur (Feature Flags State)
  const [featureControls, setFeatureControls] = useState<FeatureControls>(defaultFeatureControls);

  // Sinkronisasi Sesi Supabase Auth (Otomatis masuk saat klik tautan di email atau sudah login)
  useEffect(() => {
    if (!supabase) return;

    // 1. Cek sesi yang ada saat aplikasi dibuka
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserProfile((prev) => ({
          ...prev,
          isLoggedIn: true,
          email: session.user.email || prev.email,
          name: session.user.user_metadata?.full_name || prev.name,
        }));
      }
    });

    // 2. Dengarkan event login (seperti saat user mengklik link dari email)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        setUserProfile((prev) => ({
          ...prev,
          isLoggedIn: true,
          email: session.user.email || prev.email,
          name: session.user.user_metadata?.full_name || prev.name,
        }));
        handleTriggerSavedPopup(`Selamat datang! Berhasil login via Supabase (${session.user.email})`);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Jika modul yang sedang dibuka dinonaktifkan di Pengaturan, otomatis alihkan ke Dashboard
  useEffect(() => {
    if (activeTab === 'perencanaan' && !featureControls.enablePerencanaan) {
      setActiveTab('dashboard');
    } else if (activeTab === 'pelaksanaan' && !featureControls.enablePelaksanaan) {
      setActiveTab('dashboard');
    } else if (activeTab === 'pelaporan' && !featureControls.enablePelaporan) {
      setActiveTab('dashboard');
    }
  }, [activeTab, featureControls]);

  const handleUpdateFeatureControls = (updated: Partial<FeatureControls>) => {
    setFeatureControls((prev) => ({ ...prev, ...updated }));
  };

  // Modal login / ganti akun tambahan
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<1 | 2>(1);

  // Modal catat transaksi baru
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState<boolean>(false);

  // Data profil pengguna & usaha lengkap (semua isian kolom kosong bersih 100%)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    businessName: '',
    businessType: '',
    currency: 'IDR (Rp)',
    email: '',
    isLoggedIn: false,
    googleLinked: false,
    googleEmail: undefined,
    birthPlace: '',
    birthDate: '',
    gender: '' as any,
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    roleTitle: '',
    nik: '',
    avatarUrl: '',
    enableAuthenticator: false,
    enableFingerprint: false,
  });

  // Data transaksi & pagu anggaran
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);

  // State Popup Push Notifikasi
  const [showLogoutPushPopup, setShowLogoutPushPopup] = useState<boolean>(false);
  const [savedPushPopup, setSavedPushPopup] = useState<string | null>(null);

  const handleTriggerSavedPopup = (message: string) => {
    setSavedPushPopup(message);
    setTimeout(() => {
      setSavedPushPopup(null);
    }, 3200);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
    handleTriggerSavedPopup('Data profil dan identitas usaha Anda berhasil disimpan dan disinkronkan.');
  };

  const handleOpenAuthModal = (step: 1 | 2 = 1) => {
    setAuthStep(step);
    setIsAuthModalOpen(true);
  };

  const handleCompleteAuth = () => {
    setUserProfile((prev) => ({ ...prev, isLoggedIn: true }));
    setIsAuthModalOpen(false);
  };

  const handleLogin = (destinationTab?: ActiveTab) => {
    setUserProfile((prev) => ({ ...prev, isLoggedIn: true }));
    setIsAuthModalOpen(false);
    setActiveTab(destinationTab || 'akun');
  };

  // Alur khusus: dari Jendela 2 jika sudah lengkap langsung menuju ke Fitur Akun
  const handleProceedToAkun = () => {
    setUserProfile((prev) => ({ ...prev, isLoggedIn: true }));
    setIsAuthModalOpen(false);
    setActiveTab('akun');
  };

  // Handler Keluar dari Akun (Logout) dengan Popup Push Tunggal & Elegan
  const handleLogout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    setUserProfile((prev) => ({
      ...prev,
      isLoggedIn: false,
      email: '',
      googleLinked: false,
      googleEmail: undefined,
    }));
    setShowLogoutPushPopup(true);
    setAuthStep(1);
    setIsAuthModalOpen(false);
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    // Update realisasi anggaran jika pos pengeluaran sesuai
    if (newTx.type === 'keluar') {
      setBudgetItems((prev) =>
        prev.map((b) => {
          if (newTx.category.toLowerCase().includes(b.category.toLowerCase().slice(0, 5))) {
            return { ...b, realizedAmount: b.realizedAmount + newTx.amount };
          }
          return b;
        })
      );
    }
    handleTriggerSavedPopup(`Transaksi "${newTx.description}" berhasil dicatat ke dalam buku kas!`);
  };

  const handleAddBudgetItem = (newItem: BudgetItem) => {
    setBudgetItems((prev) => [...prev, newItem]);
    handleTriggerSavedPopup(`Pos pagu anggaran "${newItem.category}" berhasil ditambahkan.`);
  };

  // JIKA PENGGUNA BELUM LOGIN: KHUSUS FITUR TAMPILAN AWAL 3D SAJA
  // Sistem (Sidebar, Dashboard dll) SAMA SEKALI TIDAK DITAMPILKAN sebelum login!
  if (!userProfile.isLoggedIn) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
        {/* POPUP PUSH: ANDA BERHASIL KELUAR (TUNGGAL & BERSIH) */}
        {showLogoutPushPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900 border-2 border-rose-500/80 text-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl shadow-rose-950/80 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shadow-lg shadow-rose-500/20 animate-bounce">
                <LogOut className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  Sesi Berakhir
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Anda Berhasil Keluar!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sesi akun telah ditutup dan sistem FinBiz kini dikunci kembali dengan aman.
                </p>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-rose-400 h-full w-full animate-pulse transition-all duration-1000" />
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutPushPopup(false)}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Tutup &amp; Masuk Kembali
              </button>
            </div>
          </div>
        )}

        <Landing3DView
          userProfile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* POPUP PUSH: BERHASIL TERSIMPAN */}
      {savedPushPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border-2 border-emerald-500 text-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl shadow-emerald-950/80 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                Tersimpan
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Berhasil Tersimpan!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {savedPushPopup}
              </p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full w-full animate-pulse transition-all duration-1000" />
            </div>
            <button
              type="button"
              onClick={() => setSavedPushPopup(null)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md"
            >
              Oke, Selesai
            </button>
          </div>
        </div>
      )}

      {/* Global 3D Interactive Background Layer (Aktif jika di-toggle di Pengaturan / Kontrol Penuh) */}
      {featureControls.enableGlobal3DBackground && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-35 overflow-hidden">
          <ThreeInteractiveBackground
            theme={featureControls.bg3DTheme || 'emerald'}
            density={featureControls.bg3DElementDensity || 'balanced'}
            autoRotate={featureControls.bg3DAutoRotate ?? true}
            sensitivity={featureControls.bg3DSensitivity || 1.2}
            interactive={false}
          />
        </div>
      )}

      {/* Sidebar Navigasi FinBiz (Desktop Sticky & Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userProfile={userProfile}
        onOpenAuthModal={handleOpenAuthModal}
        featureControls={featureControls}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Mobile Top Header Bar: Responsif di Smartphone / HP */}
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3.5 py-2.5 flex items-center justify-between text-white md:hidden shadow-xs">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">FinBiz</span>
            </div>
          </div>

          {/* Badge Tab Aktif & Avatar Akun Cepat */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
              {activeTab}
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('akun')}
              className="w-7 h-7 rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center bg-teal-500/20 text-teal-300 cursor-pointer"
              title="Profil Pengguna"
            >
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </header>

        {/* Viewport Konten Utama: Responsif HP / Tablet / Desktop */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-8 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6 pb-24 md:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              userProfile={userProfile}
              transactions={transactions}
              budgetItems={budgetItems}
              onNavigateTab={setActiveTab}
              onOpenNewTransaction={() => setIsTransactionModalOpen(true)}
              onOpenAuthModal={handleOpenAuthModal}
              featureControls={featureControls}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          )}

          {activeTab === 'perencanaan' && (
            <PerencanaanView
              budgetItems={budgetItems}
              onAddBudgetItem={handleAddBudgetItem}
              featureControls={featureControls}
            />
          )}

          {activeTab === 'pelaksanaan' && (
            <PelaksanaanView
              transactions={transactions}
              onOpenNewTransaction={() => setIsTransactionModalOpen(true)}
              featureControls={featureControls}
            />
          )}

          {activeTab === 'pelaporan' && (
            <PelaporanView
              userProfile={userProfile}
              transactions={transactions}
              selectedPeriod={selectedPeriod}
              featureControls={featureControls}
            />
          )}

          {activeTab === 'pengaturan' && (
            <PengaturanView
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onOpenAuthModal={handleOpenAuthModal}
              featureControls={featureControls}
              onUpdateFeatureControls={handleUpdateFeatureControls}
              onNavigateTab={setActiveTab}
              onLogout={handleLogout}
            />
          )}

          {activeTab === 'akun' && (
            <AkunView
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onOpenAuthModal={handleOpenAuthModal}
              onNavigateTab={setActiveTab}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar: Akses Cepat 1 Jempol di Smartphone */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 flex items-center justify-around py-1.5 px-2 md:hidden shadow-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-teal-400 bg-teal-500/15 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px]">Beranda</span>
          </button>

          {featureControls.enablePelaksanaan && (
            <button
              type="button"
              onClick={() => setActiveTab('pelaksanaan')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'pelaksanaan'
                  ? 'text-teal-400 bg-teal-500/15 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ReceiptText className="w-4 h-4" />
              <span className="text-[10px]">Kas</span>
            </button>
          )}

          {featureControls.enablePerencanaan && (
            <button
              type="button"
              onClick={() => setActiveTab('perencanaan')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'perencanaan'
                  ? 'text-teal-400 bg-teal-500/15 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarClock className="w-4 h-4" />
              <span className="text-[10px]">RAB</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('akun')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'akun'
                ? 'text-teal-400 bg-teal-500/15 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span className="text-[10px]">Akun</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[10px]">Menu</span>
          </button>
        </nav>
      </div>

      {/* Dua Jendela Login & Penyettingan Profil Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        step={authStep}
        onClose={() => setIsAuthModalOpen(false)}
        onSetStep={setAuthStep}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onCompleteAuth={handleCompleteAuth}
        onProceedToAkun={handleProceedToAkun}
      />

      {/* Modal Input Transaksi Cepat */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}
