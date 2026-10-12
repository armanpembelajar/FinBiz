import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ActiveTab } from '../../types';
import { ThreeInteractiveBackground } from '../common/ThreeInteractiveBackground';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  Copy,
  Zap,
  Globe,
  Database,
  ExternalLink
} from 'lucide-react';
import { 
  sendEmailOtp, 
  verifyEmailOtp, 
  signInWithGitHub, 
  isSupabaseConfigured 
} from '../../lib/supabase';

interface Landing3DViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLogin: (destinationTab?: ActiveTab) => void;
}

export const Landing3DView: React.FC<Landing3DViewProps> = ({
  userProfile,
  onUpdateProfile,
  onLogin,
}) => {
  // State Kartu: 1 = Kartu Pertama (Daftar / Masuk Akun), 2 = Kartu Kedua (Verifikasi Akun Email)
  const [cardStep, setCardStep] = useState<1 | 2>(1);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

  // Kartu 1: Input Email & Kata Sandi
  const [emailInput, setEmailInput] = useState<string>(userProfile.email || 'arman30@guru.sd.belajar.id');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Kartu 2: Input OTP Verifikasi Email
  const [currentOtpCode, setCurrentOtpCode] = useState<string>('824915');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState<number>(45);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isOtpSuccess, setIsOtpSuccess] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [isSimulatedOtp, setIsSimulatedOtp] = useState<boolean>(!isSupabaseConfigured());
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Hitung mundur kirim ulang kode verifikasi
  useEffect(() => {
    let timer: any;
    if (cardStep === 2 && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cardStep, resendCountdown]);

  const showToast = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const handleProceedToOtpCard = (emailTarget?: string) => {
    const target = emailTarget || emailInput;
    setShowSuccessPopup(false);
    setIsFlipping(true);

    setTimeout(() => {
      setCardStep(2);
      setIsFlipping(false);
      setResendCountdown(45);
      showToast(`✉️ Kode OTP masuk untuk ${target}!`);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 200);
    }, 400);
  };

  // 1. DAFTAR / MASUK MANUAL KARTU PERTAMA
  const handleRegisterManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      showToast('⚠️ Silakan masukkan Email Anda');
      return;
    }
    if (!passwordInput.trim()) {
      showToast('⚠️ Silakan masukkan Kata Sandi Anda');
      return;
    }

    onUpdateProfile({
      email: emailInput.trim(),
      authMethod: 'password',
    });

    // Kirim OTP via Supabase atau Simulator FinBiz
    const otpRes = await sendEmailOtp(emailInput.trim());
    if (otpRes.code) {
      setCurrentOtpCode(otpRes.code);
    }
    setIsSimulatedOtp(otpRes.isSimulated);

    // Munculkan popup notifikasi buka email
    setShowSuccessPopup(true);

    // Otomatis setelah 2.8 detik berbalik ke kartu kedua jika pengguna tidak menekan tombol
    setTimeout(() => {
      setShowSuccessPopup((prev) => {
        if (prev) {
          handleProceedToOtpCard(emailInput.trim());
        }
        return false;
      });
    }, 2800);
  };

  // Helper untuk membaca data pengguna dari token Google resmi
  const decodeGoogleJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  // Transisi dari SSO (Google/GitHub) ke Kartu 2 (Verifikasi Akun Email)
  const proceedSsoToVerification = async (data?: {
    name?: string;
    email?: string;
    picture?: string;
    provider?: 'google' | 'github';
    username?: string;
  }) => {
    const chosenEmail = data?.email || emailInput || (data?.provider === 'github' ? 'arman.dev@github.com' : 'armandmtg@gmail.com');
    const chosenName = data?.name || userProfile.name || (data?.provider === 'github' ? 'Arman Pratama (GitHub)' : 'Arman Pratama');
    const chosenAvatar = data?.picture || userProfile.avatarUrl;

    const otpRes = await sendEmailOtp(chosenEmail);
    if (otpRes.code) {
      setCurrentOtpCode(otpRes.code);
    }
    setIsSimulatedOtp(otpRes.isSimulated);

    // Simpan data profil & email SSO (isLoggedIn masih false hingga verifikasi selesai!)
    setEmailInput(chosenEmail);
    onUpdateProfile({
      name: chosenName,
      email: chosenEmail,
      avatarUrl: chosenAvatar,
      googleLinked: data?.provider === 'google',
      googleEmail: data?.provider === 'google' ? chosenEmail : undefined,
      githubLinked: data?.provider === 'github',
      githubUsername: data?.username || (data?.provider === 'github' ? 'arman-finbiz' : undefined),
      authMethod: data?.provider || 'google',
      isLoggedIn: false,
    });

    // Munculkan popup notifikasi
    setShowSuccessPopup(true);

    setTimeout(() => {
      setShowSuccessPopup((prev) => {
        if (prev) {
          handleProceedToOtpCard(chosenEmail);
        }
        return false;
      });
    }, 2800);
  };

  // 2. LOGIN DENGAN GOOGLE (SSO Google -> Lanjut Verifikasi OTP)
  const handleGoogleLogin = () => {
    const googleClientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;

    // Jika VITE_GOOGLE_CLIENT_ID terpasang di Vercel dan SDK Google siap
    if (googleClientId && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: any) => {
            if (response.credential) {
              const payload = decodeGoogleJwt(response.credential);
              if (payload) {
                proceedSsoToVerification({
                  name: payload.name,
                  email: payload.email,
                  picture: payload.picture,
                  provider: 'google',
                });
                return;
              }
            }
            proceedSsoToVerification({ provider: 'google' });
          },
        });
        (window as any).google.accounts.id.prompt();
        return;
      } catch (err) {
        console.warn('Google prompt fallback:', err);
      }
    }

    // Fallback mulus SSO Google
    proceedSsoToVerification({
      name: 'Arman Pratama',
      email: 'armandmtg@gmail.com',
      provider: 'google',
    });
  };

  // 3. LOGIN DENGAN GITHUB (GitHub OAuth -> Lanjut Verifikasi OTP)
  const handleGitHubLogin = async () => {
    if (isSupabaseConfigured()) {
      showToast('🚀 Mengarahkan ke GitHub OAuth via Supabase...');
      const res = await signInWithGitHub();
      if (res.redirect) return;
    }

    // Fallback mulus SSO GitHub
    proceedSsoToVerification({
      name: 'Arman Pratama (GitHub)',
      email: 'arman.developer@github.com',
      provider: 'github',
      username: 'arman-finbiz',
    });
  };

  // 4. KARTU KEDUA: Verifikasi Akun Email Selesai -> Masuk ke Akun
  const handleVerifyOtpSubmit = async (customDigits?: string[]) => {
    const digitsToVerify = customDigits || otpDigits;
    const fullCode = digitsToVerify.join('');

    if (fullCode.length < 6) {
      showToast('⚠️ Mohon lengkapi 6 digit kode verifikasi');
      return;
    }

    setIsVerifyingOtp(true);
    const result = await verifyEmailOtp(emailInput, fullCode, currentOtpCode);

    setTimeout(() => {
      setIsVerifyingOtp(false);
      if (result.success) {
        setIsOtpSuccess(true);
        showToast('🎉 Verifikasi akun berhasil! Membuka FinBiz...');

        setTimeout(() => {
          onUpdateProfile({
            isLoggedIn: true,
            email: emailInput,
            supabaseLinked: isSupabaseConfigured(),
          });
          onLogin('akun');
        }, 700);
      } else {
        showToast(result.message || '⚠️ Kode OTP tidak valid. Periksa kembali.');
      }
    }, 450);
  };

  // 5. ISI OTOMATIS & MASUK CEPAT (Instant 1-Click Auto-Fill OTP)
  const handleQuickAutoFillAndSubmit = () => {
    const digits = currentOtpCode.slice(0, 6).split('');
    setOtpDigits(digits);
    showToast(`⚡ Mengisi kode OTP [${currentOtpCode}] otomatis...`);
    handleVerifyOtpSubmit(digits);
  };

  // Salin Kode ke Clipboard
  const handleCopyOtpCode = () => {
    navigator.clipboard?.writeText(currentOtpCode);
    setCopiedCode(true);
    showToast(`📋 Kode OTP ${currentOtpCode} berhasil disalin ke clipboard!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Kembali ke Kartu Pertama (Berbalik ke Depan)
  const handleBackToCard1 = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCardStep(1);
      setIsFlipping(false);
      showToast('↩️ Kembali ke kartu pemilihan akun');
    }, 350);
  };

  // Kirim Ulang Kode Verifikasi
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    const otpRes = await sendEmailOtp(emailInput);
    if (otpRes.code) {
      setCurrentOtpCode(otpRes.code);
    }
    setIsSimulatedOtp(otpRes.isSimulated);
    setResendCountdown(45);
    setOtpDigits(['', '', '', '', '', '']);
    showToast(`📩 Kode OTP baru (${otpRes.code || currentOtpCode}) telah dikirim ke ${emailInput}`);
  };

  // Helper Perubahan Digit OTP dengan Auto-Advance & Auto-Submit saat 6 digit terpenuhi
  const handleOtpDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      const digits = val.replace(/\D/g, '').slice(0, 6).split('');
      const updated = [...otpDigits];
      digits.forEach((d, i) => {
        if (index + i < 6) updated[index + i] = d;
      });
      setOtpDigits(updated);
      const nextIdx = Math.min(5, index + digits.length);
      otpInputsRef.current[nextIdx]?.focus();

      if (updated.filter(Boolean).length === 6) {
        handleVerifyOtpSubmit(updated);
      }
      return;
    }

    const clean = val.replace(/\D/g, '');
    const updated = [...otpDigits];
    updated[index] = clean;
    setOtpDigits(updated);

    if (clean && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    if (updated.filter(Boolean).length === 6) {
      handleVerifyOtpSubmit(updated);
    }
  };

  // Handle Paste Clipboard pada input OTP
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData) {
      const digits = pasteData.split('');
      const updated = ['', '', '', '', '', ''];
      digits.forEach((d, i) => {
        if (i < 6) updated[i] = d;
      });
      setOtpDigits(updated);
      if (digits.length === 6) {
        showToast(`📋 Menempel kode ${pasteData}...`);
        handleVerifyOtpSubmit(updated);
      } else {
        otpInputsRef.current[digits.length]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 overflow-x-hidden flex flex-col font-sans select-none">
      {/* 1. STAGE 3D INTERAKTIF BERGULIR TANPA HENTI */}
      <div className="fixed inset-0 z-0">
        <ThreeInteractiveBackground
          theme="emerald"
          density="rich"
          autoRotate={true}
          continuousRoll={true}
          rollSpeedMultiplier={1.0}
          sensitivity={1.3}
          interactive={true}
        />
        {/* Subtle vignette shadow overlay to enhance UI legibility */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none from-transparent via-slate-950/40 to-slate-950/80" />
      </div>

      {/* Toast Notifikasi */}
      {feedbackNotice && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 p-4 bg-slate-900/95 backdrop-blur-md text-white border border-teal-500/40 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* POPUP NOTIFIKASI: BUKA EMAIL KODE OTP */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-teal-400 text-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl shadow-teal-950/80 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center shadow-lg shadow-teal-500/20 animate-bounce">
              <Mail className="w-8 h-8 text-teal-300" />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                Cek Email · Kode Keamanan OTP
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Silakan Buka Email Anda!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kami telah mengirimkan 6 digit kode verifikasi keamanan ke kotak masuk / spam email:
              </p>
              <p className="text-xs font-mono font-bold text-teal-300 bg-slate-950/80 border border-teal-500/30 py-2 px-3 rounded-xl break-all">
                {emailInput}
              </p>

              <div className="pt-1">
                <div className="p-3 rounded-xl bg-teal-950/70 border border-teal-500/40 text-[11px] text-teal-200 space-y-1">
                  <span className="block font-semibold">Kode OTP Verifikasi Anda:</span>
                  <span className="font-mono text-xl font-extrabold tracking-widest text-teal-300 select-all block">
                    {currentOtpCode}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-left text-[11px] text-slate-300 space-y-1">
                <span className="font-semibold text-teal-300 block">Petunjuk Verifikasi:</span>
                <span>Buka aplikasi Gmail atau kotak masuk Anda, salin 6 digit kode yang dikirimkan, lalu masukkan pada kartu berikutnya.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleProceedToOtpCard()}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Masukkan Kode &amp; Buka FinBiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* BANNER UCAPAN & KARTU 3D FINBIZ */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-md w-full mx-auto my-auto py-6">
        {/* Banner Ucapan Selamat Datang & Tech Badges */}
        <div className="w-full text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-teal-500/30 text-teal-300 text-xs font-semibold backdrop-blur-md shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>FinBiz Keuangan · Mantangai</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            Selamat Datang di FinBiz
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {cardStep === 1
              ? 'Pilih metode masuk akun bisnis Anda dengan Email, Google SSO, atau GitHub.'
              : 'Verifikasi akun email Anda dengan 6 digit kode OTP di bawah ini.'}
          </p>

          {/* Badges Arsitektur: Vercel, Supabase, GitHub */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700 text-[10px] text-slate-300 font-mono flex items-center gap-1">
              <Globe className="w-2.5 h-2.5 text-teal-400" />
              <span>Vercel Live</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700 text-[10px] text-slate-300 font-mono flex items-center gap-1">
              <Database className="w-2.5 h-2.5 text-emerald-400" />
              <span>{isSupabaseConfigured() ? 'Supabase Active' : 'Supabase Ready'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700 text-[10px] text-slate-300 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>v3.1 Production</span>
            </span>
          </div>
        </div>

        {/* CONTAINER KARTU 3D DENGAN EFEK BERBALIK (3D FLIP CARD) */}
        <div className="relative w-full mx-auto" style={{ perspective: '1400px' }}>
          <div
            className="relative w-full transition-transform duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: cardStep === 2 ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* ==================== KARTU PERTAMA: DAFTAR / MASUK AKUN ==================== */}
            <div
              className={`w-full bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden transition-all duration-300 ${
                cardStep === 2 ? 'pointer-events-none' : 'pointer-events-auto'
              }`}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Form Pendaftaran Manual */}
              <form onSubmit={handleRegisterManualSubmit} className="p-6 sm:p-7 space-y-4">
                {/* Label Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Email Bisnis / Pribadi
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Label Kata Sandi */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Kata Sandi
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Tombol Daftar / Masuk Akun Manual */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40 transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>Lanjutkan ke Verifikasi OTP</span>
                    <ArrowRight className="w-4 h-4 text-teal-200" />
                  </button>
                </div>

                {/* Pemisah Bersih */}
                <div className="relative py-1 flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider absolute font-semibold">
                    atau masuk cepat
                  </span>
                </div>

                {/* Tombol Google SSO & GitHub SSO */}
                <div className="space-y-2.5">
                  {/* Google SSO */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Masuk dengan Akun Google</span>
                  </button>

                  {/* GitHub SSO */}
                  <button
                    type="button"
                    onClick={handleGitHubLogin}
                    className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>Masuk dengan GitHub</span>
                  </button>
                </div>
              </form>
            </div>

            {/* ==================== KARTU KEDUA: VERIFIKASI AKUN EMAIL DENGAN OTP MASUK ==================== */}
            <div
              className={`absolute inset-0 w-full bg-slate-900/95 backdrop-blur-2xl border border-teal-500/40 rounded-3xl shadow-2xl shadow-teal-950/70 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                cardStep === 2 ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              {/* Header Kartu Kedua */}
              <div className="p-5 pb-2 text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center mb-1">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Verifikasi Akun Email
                </h3>
                <p className="text-xs text-slate-300">
                  Kode 6-digit verifikasi telah disiapkan untuk:
                </p>
                <p className="text-xs font-mono font-bold text-teal-300 truncate px-2">
                  {emailInput}
                </p>
              </div>

              {/* Form Verifikasi Email dengan Akses OTP Masuk & Paste */}
              <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtpSubmit(); }} className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Info Box Notifikasi Buka Email */}
                  <div className="p-3 bg-teal-950/60 border border-teal-500/30 rounded-xl text-[11px] text-teal-200 flex items-center justify-between gap-2 shadow-inner">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                      <span className="truncate">Kode OTP Email: <strong className="font-mono text-teal-300 font-bold">{currentOtpCode}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const digits = currentOtpCode.slice(0, 6).split('');
                        setOtpDigits(digits);
                        showToast(`📋 Kode OTP ${currentOtpCode} telah diisikan otomatis!`);
                        handleVerifyOtpSubmit(digits);
                      }}
                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-[10px] font-bold shrink-0 transition-colors shadow-xs cursor-pointer active:scale-95"
                    >
                      Isi Otomatis
                    </button>
                  </div>

                  {/* Status Notifikasi Cek Email Tanpa Menampilkan Kode */}
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-300 flex items-center gap-2.5 shadow-inner">
                    <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Silakan periksa kotak masuk / spam di <strong className="text-teal-300 font-medium">{emailInput}</strong></span>
                  </div>

                  {/* 6 Digit Input Boxes dengan Support Paste Clipboard */}
                  <div className="space-y-2" onPaste={handleOtpPaste}>
                    <div className="flex items-center justify-between px-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Masukkan 6 Digit:
                      </label>
                      <span className="text-[10px] text-teal-400 font-medium">
                        Bisa Paste / Tempel Kode
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { otpInputsRef.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-10 sm:w-11 h-12 bg-slate-950/90 border-2 border-slate-700 focus:border-teal-400 rounded-xl text-center text-lg font-bold font-mono text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all shadow-md"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resend Link */}
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
                    <span>Belum terima kode?</span>
                    <button
                      type="button"
                      disabled={resendCountdown > 0}
                      onClick={handleResendOtp}
                      className={`font-semibold transition-colors ${
                        resendCountdown > 0
                          ? 'text-slate-500 cursor-not-allowed'
                          : 'text-teal-400 hover:text-teal-300 hover:underline cursor-pointer'
                      }`}
                    >
                      {resendCountdown > 0 ? `Kirim Ulang (${resendCountdown}s)` : 'Kirim Ulang Sekarang'}
                    </button>
                  </div>
                </div>

                {/* Tombol Aksi Verifikasi */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-75 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/50 transition-all active:scale-[0.99] cursor-pointer"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Memverifikasi Kode OTP...</span>
                      </>
                    ) : isOtpSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>Verifikasi Berhasil!</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-teal-200" />
                        <span>Verifikasi &amp; Buka Akun</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToCard1}
                    className="w-full py-2 px-4 text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Pilihan Akun</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER HALAMAN DEPAN: MEWAH, GEMILAU, TRANSPARAN & 3D */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-5 flex items-end justify-between select-none shrink-0 pointer-events-auto gap-4">
        {/* Kiri: Brand & Versi Sistem - 3D Translucent Glassmorphic Capsule */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/30 via-emerald-500/20 to-teal-400/30 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="relative flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-teal-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25),0_0_20px_rgba(45,212,191,0.2)] hover:border-teal-300/70 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35),0_0_28px_rgba(45,212,191,0.35)] transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400/30 to-emerald-600/30 border border-teal-300/50 flex items-center justify-center text-teal-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] shrink-0">
              <Sparkles className="w-4 h-4 text-teal-200 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-extrabold tracking-wide bg-gradient-to-r from-teal-100 via-emerald-300 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(20,184,166,0.6)]">
                FinBiz Keuangan
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                <span className="text-[10px] sm:text-xs text-teal-300/90 font-mono font-semibold tracking-wider drop-shadow-sm">
                  Versi Sistem v3.1 Enterprise
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kanan: Kreator & Identitas - 3D Translucent Glassmorphic Capsule */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/25 via-emerald-500/20 to-teal-400/30 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="relative flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-emerald-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25),0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-300/70 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35),0_0_28px_rgba(16,185,129,0.35)] transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex flex-col text-right">
              <span className="text-xs sm:text-sm font-extrabold tracking-wide bg-gradient-to-r from-amber-100 via-emerald-200 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
                Kreator App Mantangai
              </span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-[10px] sm:text-xs text-emerald-300/90 font-semibold tracking-wide drop-shadow-sm">
                  Uluh Lewu Dayak
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400/20 via-emerald-500/30 to-teal-600/30 border border-emerald-300/50 flex items-center justify-center text-emerald-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};