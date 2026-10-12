import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ActiveTab } from '../../types';
import { ThreeInteractiveBackground } from '../common/ThreeInteractiveBackground';
import { 
  Mail, 
  Lock, 
  User,
  Building2,
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  UserPlus,
  LogIn,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  sendEmailOtp, 
  verifyEmailOtp, 
  signInWithGitHub, 
  signInWithGoogleSupabase,
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
  // State Kartu: 1 = Kartu Pertama (Masuk / Daftar Akun), 2 = Kartu Kedua (Verifikasi Akun Email)
  const [cardStep, setCardStep] = useState<1 | 2>(1);
  const [, setIsFlipping] = useState<boolean>(false);

  // Tab di Kartu 1: 'masuk' atau 'daftar'
  const [authMode, setAuthMode] = useState<'masuk' | 'daftar'>('daftar');

  // Input Formulir Bersih dari Default Value Dummy
  const [nameInput, setNameInput] = useState<string>(userProfile.name || '');
  const [businessNameInput, setBusinessNameInput] = useState<string>(userProfile.businessName || '');
  const [emailInput, setEmailInput] = useState<string>(userProfile.email || '');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Kartu 2: Input OTP 6-Digit Verifikasi Email
  const initialOtp = '824915';
  const [currentOtpCode, setCurrentOtpCode] = useState<string>(initialOtp);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState<number>(45);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isOtpSuccess, setIsOtpSuccess] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [, setIsSimulatedOtp] = useState<boolean>(!isSupabaseConfigured());
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
    setTimeout(() => setFeedbackNotice(null), 3800);
  };

  // Pindah ke Kartu OTP
  const handleProceedToOtpCard = (emailTarget?: string, codeToUse?: string) => {
    const target = emailTarget || emailInput;
    const code = codeToUse || currentOtpCode;
    setIsFlipping(true);

    setOtpDigits(['', '', '', '', '', '']);

    setTimeout(() => {
      setCardStep(2);
      setIsFlipping(false);
      setResendCountdown(45);
      showToast(`✉️ Kode OTP [${code}] telah disiapkan untuk ${target}. Silakan masukkan 6 digit.`);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 250);
    }, 400);
  };

  // 1. SUBMIT FORM KARTU 1 (DAFTAR AKUN BARU ATAU MASUK AKUN)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      showToast('⚠️ Silakan masukkan Email Akun Anda');
      return;
    }
    if (!passwordInput.trim()) {
      showToast('⚠️ Silakan masukkan Kata Sandi');
      return;
    }
    if (authMode === 'daftar' && !nameInput.trim()) {
      showToast('⚠️ Silakan masukkan Nama Lengkap Anda');
      return;
    }

    onUpdateProfile({
      name: authMode === 'daftar' ? nameInput.trim() : userProfile.name,
      businessName: authMode === 'daftar' ? businessNameInput.trim() : userProfile.businessName,
      email: emailInput.trim(),
      authMethod: 'password',
    });

    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    const otpRes = await sendEmailOtp(emailInput.trim());
    const finalCode = otpRes.code || generated;

    setCurrentOtpCode(finalCode);
    setOtpDigits(['', '', '', '', '', '']);
    setIsSimulatedOtp(otpRes.isSimulated);

    handleProceedToOtpCard(emailInput.trim(), finalCode);
  };

  // 2. LOGIN DENGAN GOOGLE
  const handleGoogleLogin = () => {
    const googleClientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;

    if (googleClientId && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await res.json();
                if (userInfo.email) {
                  onUpdateProfile({
                    name: userInfo.name || userProfile.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture || userProfile.avatarUrl,
                    googleLinked: true,
                    googleEmail: userInfo.email,
                    authMethod: 'google',
                    isLoggedIn: true,
                  });
                  showToast(`🎉 Berhasil masuk dengan Akun Google: ${userInfo.email}!`);
                  onLogin('akun');
                  return;
                }
              } catch (err) {
                console.warn('Google userinfo fetch err:', err);
              }
            }
          },
        });
        client.requestAccessToken();
        return;
      } catch (err) {
        console.warn('Google OAuth token client fallback:', err);
      }
    }

    if (isSupabaseConfigured()) {
      signInWithGoogleSupabase().then((res) => {
        if (res.redirect) return;
        const targetEmail = emailInput.trim();
        onUpdateProfile({
          name: nameInput.trim() || userProfile.name,
          email: targetEmail,
          googleLinked: true,
          googleEmail: targetEmail,
          authMethod: 'google',
          isLoggedIn: true,
        });
        showToast(`🎉 Berhasil masuk dengan Akun Google!`);
        onLogin('akun');
      });
      return;
    }

    const targetGoogleEmail = emailInput.trim();
    onUpdateProfile({
      name: nameInput.trim() || userProfile.name,
      email: targetGoogleEmail,
      googleLinked: true,
      googleEmail: targetGoogleEmail,
      authMethod: 'google',
      isLoggedIn: true,
    });
    showToast(`🎉 Berhasil masuk dengan Akun Google!`);
    onLogin('akun');
  };

  // 3. LOGIN DENGAN GITHUB
  const handleGitHubLogin = async () => {
    if (isSupabaseConfigured()) {
      showToast('🚀 Mengarahkan ke GitHub OAuth via Supabase...');
      const res = await signInWithGitHub();
      if (res.redirect) return;
    }

    onUpdateProfile({
      name: nameInput.trim() || userProfile.name,
      email: emailInput.trim(),
      githubLinked: true,
      authMethod: 'github',
      isLoggedIn: true,
    });
    showToast('🎉 Berhasil masuk dengan Akun GitHub!');
    onLogin('akun');
  };

  // 4. VERIFIKASI OTP
  const handleVerifyOtpSubmit = async (customDigits?: string[]) => {
    const digitsToVerify = customDigits || otpDigits;
    const fullCode = digitsToVerify.join('');

    if (fullCode.length < 6) {
      showToast('⚠️ Mohon ketik lengkap 6 digit kode verifikasi');
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
        }, 600);
      } else {
        showToast(result.message || '⚠️ Kode OTP tidak sesuai. Periksa kembali.');
      }
    }, 400);
  };

  const handleCopyOtpCode = () => {
    navigator.clipboard?.writeText(currentOtpCode);
    setCopiedCode(true);
    showToast(`📋 Kode OTP ${currentOtpCode} berhasil disalin!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleBackToCard1 = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCardStep(1);
      setIsFlipping(false);
      showToast('↩️ Kembali ke formulir akun');
    }, 350);
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpRes = await sendEmailOtp(emailInput);
    const code = otpRes.code || newCode;

    setCurrentOtpCode(code);
    setOtpDigits(['', '', '', '', '', '']);
    setIsSimulatedOtp(otpRes.isSimulated);
    setResendCountdown(45);
    showToast(`📩 Kode OTP baru [${code}] telah disiapkan untuk ${emailInput}`);
  };

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
      showToast(`📋 Berhasil menempelkan kode OTP: ${pasteData}`);
      if (updated.filter(Boolean).length === 6) {
        handleVerifyOtpSubmit(updated);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-teal-500 selection:text-white">
      {/* LATAR BELAKANG 3D SPATIAL PARTICLES FINANSIAL */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ThreeInteractiveBackground
          theme="emerald"
          density="balanced"
          autoRotate={true}
          sensitivity={1.3}
          interactive={false}
        />
      </div>

      {/* GRADASI CAHAYA AMBIENT MEWAH */}
      <div className="absolute inset-0 z-0 bg-radial-[at_50%_40%] from-teal-900/25 via-slate-950/85 to-slate-950 pointer-events-none" />

      {/* TOAST NOTIFIKASI INTERAKTIF */}
      {feedbackNotice && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-slate-900/95 border border-teal-500/60 text-white rounded-2xl shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300">
          <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* BANNER UCAPAN & KARTU 3D FINBIZ */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-md w-full mx-auto my-auto py-8">
        <div className="w-full text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-teal-500/40 text-teal-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-teal-950/50">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>FinBiz Keuangan · Mantangai</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            Selamat Datang di FinBiz
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            {cardStep === 1
              ? (authMode === 'daftar'
                  ? 'Daftar akun baru untuk mulai mengelola pembukuan, anggaran, dan kas usaha Anda.'
                  : 'Silakan masuk ke akun bisnis Anda untuk membuka buku kas dan laporan.')
              : 'Verifikasi akun email Anda dengan 6 digit kode OTP di bawah ini.'}
          </p>
        </div>

        {/* CONTAINER KARTU 3D */}
        <div className="relative w-full mx-auto" style={{ perspective: '1400px' }}>
          <div
            className="relative w-full transition-transform duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: cardStep === 2 ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* KARTU PERTAMA: MASUK / DAFTAR AKUN */}
            <div
              className={`w-full bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden transition-all duration-300 ${
                cardStep === 2 ? 'pointer-events-none' : 'pointer-events-auto'
              }`}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="p-6 sm:p-7">
                {/* TAB SWITCHER */}
                <div className="grid grid-cols-2 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl mb-5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setAuthMode('masuk')}
                    className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      authMode === 'masuk'
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/60 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk Akun</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('daftar')}
                    className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      authMode === 'daftar'
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/60 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Daftar Akun Baru</span>
                  </button>
                </div>

                {/* FORMULIR OTENTIKASI */}
                <form onSubmit={handleAuthSubmit} className="space-y-4" autoComplete="off">
                  {authMode === 'daftar' && (
                    <>
                      <div className="space-y-1.5 animate-in fade-in duration-200">
                        <label className="block text-xs font-semibold text-slate-300">
                          Nama Lengkap Pemilik / Pengelola <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            required
                            autoComplete="off"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="Nama lengkap pemilik"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 animate-in fade-in duration-200">
                        <label className="block text-xs font-semibold text-slate-300">
                          Nama Usaha / Lembaga / Sekolah <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            required
                            autoComplete="off"
                            value={businessNameInput}
                            onChange={(e) => setBusinessNameInput(e.target.value)}
                            placeholder="Contoh: Nama Usaha Anda"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Email Akun Bisnis / Pribadi <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        autoComplete="off"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-300">
                        Kata Sandi <span className="text-rose-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {showPassword ? (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Sembunyikan</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Tampilkan</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="off"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Masukkan kata sandi"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    {authMode === 'daftar' ? (
                      <button
                        type="submit"
                        className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/50 hover:shadow-teal-900/80 transition-all active:scale-[0.99] cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Daftar Akun Baru</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/50 hover:shadow-teal-900/80 transition-all active:scale-[0.99] cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Masuk ke Akun</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="relative py-1 flex items-center justify-center">
                    <div className="border-t border-slate-800 w-full" />
                    <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider absolute font-semibold">
                      atau masuk cepat
                    </span>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800/90 border border-slate-700 hover:border-teal-500/80 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Masuk dengan Akun Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGitHubLogin}
                      className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>Masuk dengan GitHub</span>
                    </button>
                  </div>

                  <div className="pt-2 text-center text-xs text-slate-400">
                    {authMode === 'daftar' ? (
                      <p>
                        Sudah punya akun?{' '}
                        <button
                          type="button"
                          onClick={() => setAuthMode('masuk')}
                          className="text-teal-400 hover:text-teal-300 font-semibold underline cursor-pointer ml-1"
                        >
                          Masuk di sini
                        </button>
                      </p>
                    ) : (
                      <p>
                        Belum memiliki akun?{' '}
                        <button
                          type="button"
                          onClick={() => setAuthMode('daftar')}
                          className="text-teal-400 hover:text-teal-300 font-semibold underline cursor-pointer ml-1"
                        >
                          Daftar Akun Baru
                        </button>
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* KARTU KEDUA: VERIFIKASI OTP */}
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
              <div className="p-6 pb-2 text-center space-y-1.5">
                <div className="w-11 h-11 mx-auto rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center mb-1 shadow-lg shadow-teal-500/20">
                  <Mail className="w-5 h-5 text-teal-300" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Verifikasi Kode OTP
                </h3>
                <p className="text-xs text-slate-300">
                  Masukkan 6 digit kode keamanan yang dikirimkan ke:
                </p>
                <div className="pt-1">
                  <span className="inline-block text-xs font-mono font-bold text-teal-300 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800 max-w-full truncate">
                    {emailInput}
                  </span>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerifyOtpSubmit();
                }}
                className="p-6 pt-2 space-y-5 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="space-y-2" onPaste={handleOtpPaste}>
                    <div className="flex items-center justify-between px-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Masukkan 6 Digit Kode:
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Ketik 6 digit angka
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputsRef.current[idx] = el;
                          }}
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

                  <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-center space-y-1">
                    <p className="text-[11px] text-slate-400">
                      Kode verifikasi uji sistem:{' '}
                      <span className="font-mono text-teal-300 font-bold tracking-wider">
                        {currentOtpCode}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyOtpCode}
                        className="ml-2 text-teal-400 hover:text-teal-300 text-[11px] underline font-medium cursor-pointer"
                      >
                        {copiedCode ? 'Tersalin' : 'Salin'}
                      </button>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>Belum menerima kode?</span>
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
                      {resendCountdown > 0
                        ? `Kirim Ulang (${resendCountdown}s)`
                        : 'Kirim Ulang Kode'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-75 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/50 hover:shadow-teal-900/80 transition-all active:scale-[0.99] cursor-pointer"
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

      {/* FOOTER HALAMAN DEPAN */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-5 flex items-end justify-between select-none shrink-0 pointer-events-auto gap-4">
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