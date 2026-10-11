import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useGoogleLogin } from '@react-oauth/google'; // Library resmi Google OAuth
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  X, 
  ShieldCheck,
  Briefcase,
  UserCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  step: 1 | 2;
  onClose: () => void;
  onSetStep: (step: 1 | 2) => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onCompleteAuth: () => void;
  onProceedToAkun?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  step,
  onClose,
  onSetStep,
  userProfile,
  onUpdateProfile,
  onCompleteAuth,
  onProceedToAkun,
}) => {
  const [authMode, setAuthMode] = useState<'masuk' | 'daftar'>('masuk');
  const [emailInput, setEmailInput] = useState(userProfile.email || 'pemilik@niagamandiri.id');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [nameInput, setNameInput] = useState(userProfile.name || 'Arman Pratama');
  const [businessNameInput, setBusinessNameInput] = useState(userProfile.businessName || 'CV Niaga Mandiri Utama');
  const [businessTypeInput, setBusinessTypeInput] = useState(userProfile.businessType || 'Retail & Grosir');
  const [currencyInput, setCurrencyInput] = useState(userProfile.currency || 'IDR (Rp)');
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [googleSuccessAlert, setGoogleSuccessAlert] = useState<string | null>(null);

  // Integrasi Google Login Nyata
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLinkingGoogle(true);
      try {
        // Mengambil data profil user dari Google API
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();

        onUpdateProfile({
          googleLinked: true,
          googleEmail: googleUser.email,
          email: googleUser.email,
          name: googleUser.name || nameInput,
          avatarUrl: googleUser.picture,
          isLoggedIn: true
        });

        setGoogleSuccessAlert(`Berhasil login dengan Google: ${googleUser.email}`);
        setTimeout(() => {
          setGoogleSuccessAlert(null);
          onSetStep(2); // Lanjut ke penyiapan profil bisnis
        }, 1500);
      } catch (err) {
        console.error('Gagal mengambil profil Google:', err);
      } finally {
        setIsLinkingGoogle(false);
      }
    },
    onError: (error) => console.error('Google Login Error:', error),
  });

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ email: emailInput });
    onSetStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: nameInput,
      businessName: businessNameInput,
      businessType: businessTypeInput,
      currency: currencyInput,
      isLoggedIn: true,
    });
    
    if (onProceedToAkun) {
      onProceedToAkun();
    } else {
      onCompleteAuth();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm transition-opacity">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500" />

        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Tutup & Lihat Pratinjau Dashboard"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${step === 1 ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-600'}`}>
              Langkah 1: Akun Bisnis
            </span>
            <span className="text-slate-300">➔</span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${step === 2 ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-600'}`}>
              Langkah 2: Verifikasi &amp; Data Profil
            </span>
          </div>
          <span className="text-slate-400">Tahap {step} dari 2</span>
        </div>

        {/* ===================== KARTU 1: MASUK / DAFTAR AKUN ===================== */}
        {step === 1 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Otentikasi FinBiz Platform</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Masuk atau Daftar Akun Bisnis
              </h2>
            </div>

            {/* TOMBOL LOGIN GOOGLE NYATA */}
            <button
              type="button"
              onClick={() => googleLogin()}
              disabled={isLinkingGoogle}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl border border-slate-700 shadow-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isLinkingGoogle ? 'Menghubungkan Google...' : 'Login dengan Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-xs text-slate-400 font-medium uppercase absolute">Atau</span>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Akun Bisnis
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="nama@usahawan.id"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all group"
                >
                  <span>Lanjutkan ke Tahap Verifikasi &amp; Data Profil</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================== KARTU 2: VERIFIKASI & KELENGKAPAN PROFIL ===================== */}
        {step === 2 && (
          <div className="p-6 md:p-8 space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Tahap 2: Verifikasi &amp; Penyiapan Profil Bisnis</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Data Usaha &amp; Penyiapan Fitur Akun
              </h2>
            </div>

            {googleSuccessAlert && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{googleSuccessAlert}</span>
              </div>
            )}

            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pemilik / Admin <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Nama lengkap pemilik"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Usaha / Toko <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={businessNameInput}
                      onChange={(e) => setBusinessNameInput(e.target.value)}
                      placeholder="Contoh: CV Niaga Mandiri Utama"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => onSetStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all group"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Selesaikan &amp; Buka Fitur Akun</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};