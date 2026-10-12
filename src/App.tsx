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
import { CheckCircle2, LogOut } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Oktober 2026');
  const [featureControls, setFeatureControls] = useState<FeatureControls>(defaultFeatureControls);

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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<1 | 2>(1);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState<boolean>(false);

  // Initial State Profil Bersih
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    businessName: '',
    businessType: 'Retail & Grosir',
    currency: 'IDR (Rp)',
    email: '',
    isLoggedIn: false,
    googleLinked: false,
    googleEmail: undefined,
    birthPlace: '',
    birthDate: '',
    gender: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    roleTitle: '',
    nik: '',
    avatarUrl: '',
  });

  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);

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
    handleTriggerSavedPopup('Data profil berhasil disimpan.');
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

  const handleProceedToAkun = () => {
    setUserProfile((prev) => ({ ...prev, isLoggedIn: true }));
    setIsAuthModalOpen(false);
    setActiveTab('akun');
  };

  const handleLogout = () => {
    setUserProfile((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    setShowLogoutPushPopup(true);
    setAuthStep(1);
    setIsAuthModalOpen(false);
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
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
    handleTriggerSavedPopup(`Transaksi "${newTx.description}" berhasil dicatat!`);
  };

  const handleAddBudgetItem = (newItem: BudgetItem) => {
    setBudgetItems((prev) => [...prev, newItem]);
    handleTriggerSavedPopup(`Pos pagu anggaran "${newItem.category}" berhasil ditambahkan.`);
  };

  if (!userProfile.isLoggedIn) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
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
                  Sesi akun telah ditutup dan sistem dikunci kembali dengan aman.
                </p>
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

      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userProfile={userProfile}
        onOpenAuthModal={handleOpenAuthModal}
        featureControls={featureControls}
        onLogout={handleLogout}
      />

      <div className="relative z-10 flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
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
      </div>

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

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}