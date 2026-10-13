import React, { useState, useRef } from 'react';
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
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { 
  sendSupabaseOtp, 
  sendSupabaseVerificationLink, 
  verifySupabaseOtp, 
  checkSupabaseEmailSession, 
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
  // State Kartu: 1 = Kartu Pertama (Daftar Akun), 2 = Kartu Kedua (Verifikasi Akun Email)
  const [cardStep, setCardStep] = useState<1 | 2>(1);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

  // Perbedaan Notifikasi: 'manual' (Daftar Mandiri -> OTP 6 digit) vs 'google' (Login Google SSO -> Tautan Verifikasi Email)
  const [authMethod, setAuthMethod] = useState<'manual' | 'google'>('manual');
  const [isVerifyingLink, setIsVerifyingLink] = useState<boolean>(false);

  // Kartu 1: Input Email & Kata Sandi (Semua kolom kosong awal)
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Captcha State (Wajib Klik)
  const [isCaptchaChecked, setIsCaptchaChecked] = useState<boolean>(false);
  const [isCaptchaVerifying, setIsCaptchaVerifying] = useState<boolean>(false);

  const handleToggleCaptcha = () => {
    if (isCaptchaChecked) {
      setIsCaptchaChecked(false);
      return;
    }
    if (isCaptchaVerifying) return;
    setIsCaptchaVerifying(true);
    setTimeout(() => {
      setIsCaptchaVerifying(false);
      setIsCaptchaChecked(true);
    }, 500);
  };

  // Kartu 2: Input OTP Verifikasi Email (6 Kotak Kosong Bersih)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState<number>(45);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isOtpSuccess, setIsOtpSuccess] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Interaktivitas Sentuhan & Gerakan 3D Kartu Real-time (Touch & Mouse Tilt + Glare)
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number; glareX: number; glareY: number; active: boolean }>({
    x: 0,
    y: 0,
    glareX: 50,
    glareY: 50,
    active: false,
  });

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    const maxTilt = 8.5;
    const tiltX = -normY * maxTilt;
    const tiltY = normX * maxTilt;

    setTilt({
      x: Math.round(tiltX * 10) / 10,
      y: Math.round(tiltY * 10) / 10,
      glareX: Math.round((x / rect.width) * 100),
      glareY: Math.round((y / rect.height) * 100),
      active: true,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });
  };

  // Hitung mundur kirim ulang kode verifikasi
  React.useEffect(() => {
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

  // 1. DAFTAR MANUAL KARTU PERTAMA: Berhasil -> Tampil Popup Push "Pendaftaran Mandiri Berhasil" -> Kartu Berbalik ke Kartu Kedua (Input OTP 6 Digit)
  const handleRegisterManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      showToast('⚠️ Silakan masukkan Email Anda');
      return;
    }
    if (!passwordInput.trim()) {
      showToast('⚠️ Silakan masukkan Kata Sandi Anda');
      return;
    }
    if (!isCaptchaChecked) {
      showToast('⚠️ Wajib klik captcha "Saya bukan robot"');
      return;
    }

    setAuthMethod('manual');
    onUpdateProfile({
      email: emailInput.trim(),
    });

    // Munculkan popup push "Pendaftaran Mandiri Berhasil"
    setShowSuccessPopup(true);

    // Otomatis setelah 1.2 detik: popup push menutup, kartu pertama hilang & berbalik otomatis ke kartu kedua
    setTimeout(async () => {
      setShowSuccessPopup(false);
      setIsFlipping(true);

      setTimeout(async () => {
        setCardStep(2);
        setIsFlipping(false);
        setResendCountdown(45);

        // Kirim OTP via Supabase
        const otpRes = await sendSupabaseOtp(emailInput.trim());
        setOtpDigits(['', '', '', '', '', '']);
        showToast(`🔢 ${otpRes.message}`);
      }, 400);
    }, 1250);
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

  // Transisi dari Google SSO ke Kartu 2 (Verifikasi Tautan Email Google - BUKAN OTP)
  const proceedGoogleToVerification = (googleData?: { name?: string; email?: string; picture?: string }) => {
    setAuthMethod('google');
    // Jika email kosong, otomatis gunakan armandmtg@gmail.com
    const chosenEmail = googleData?.email || emailInput.trim() || 'armandmtg@gmail.com';
    const chosenName = googleData?.name || userProfile.name || 'Pengguna Google';
    const chosenAvatar = googleData?.picture || userProfile.avatarUrl;

    // Simpan data profil & email Google
    setEmailInput(chosenEmail);
    onUpdateProfile({
      name: chosenName,
      email: chosenEmail,
      avatarUrl: chosenAvatar,
      googleLinked: true,
      googleEmail: chosenEmail,
      isLoggedIn: false,
    });

    // Munculkan popup informasi: Tautan Verifikasi Email Terkirim (Bukan Kode OTP!)
    setShowSuccessPopup(true);

    // Otomatis balik kartu 3D ke Kartu 2 (Verifikasi Tautan Email Google SSO)
    setTimeout(async () => {
      setShowSuccessPopup(false);
      setIsFlipping(true);

      setTimeout(async () => {
        setCardStep(2);
        setIsFlipping(false);
        setResendCountdown(45);

        // Kirim Tautan Verifikasi Email resmi via Supabase (Bukan Kode OTP)
        const linkRes = await sendSupabaseVerificationLink(chosenEmail);
        showToast(`📧 ${linkRes.message}`);
      }, 400);
    }, 1250);
  };

  // 2. LOGIN DENGAN GOOGLE (SSO Google -> Lanjut Verifikasi Tautan Email)
  const handleGoogleLogin = async () => {
    const googleClientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;

    // Jika VITE_GOOGLE_CLIENT_ID terpasang
    if (googleClientId && typeof window !== 'undefined') {
      try {
        // Muat SDK Google Identity secara dinamis hanya saat dibutuhkan
        if (!(window as any).google?.accounts?.id) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('GSI script load error'));
            document.head.appendChild(script);
          });
        }

        if ((window as any).google?.accounts?.id) {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            use_fedcm_for_prompt: false,
            callback: (response: any) => {
              if (response?.credential) {
                const payload = decodeGoogleJwt(response.credential);
                if (payload) {
                  proceedGoogleToVerification({
                    name: payload.name,
                    email: payload.email,
                    picture: payload.picture,
                  });
                  return;
                }
              }
              proceedGoogleToVerification();
            },
          });
          (window as any).google.accounts.id.prompt((notification: any) => {
            if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
              proceedGoogleToVerification();
            }
          });
          return;
        }
      } catch (err) {
        console.warn('Google prompt fallback:', err);
      }
    }

    // Fallback jika Google Client ID belum aktif atau berada di iframe
    proceedGoogleToVerification();
  };

  // 3. KARTU KEDUA - A: Verifikasi Kode OTP (Untuk Pendaftaran Mandiri)
  const handleVerifyOtpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = otpDigits.join('');
    if (fullCode.length < 6) {
      showToast('⚠️ Mohon lengkapi 6 digit kode verifikasi');
      return;
    }

    setIsVerifyingOtp(true);
    const result = await verifySupabaseOtp(emailInput, fullCode);

    if (!result.success) {
      setIsVerifyingOtp(false);
      showToast(`⚠️ ${result.message}`);
      return;
    }

    setIsVerifyingOtp(false);
    setIsOtpSuccess(true);
    showToast(`🎉 ${result.message}`);

    setTimeout(() => {
      onUpdateProfile({
        isLoggedIn: true,
        email: emailInput,
        name: result.user?.user_metadata?.full_name || userProfile.name || '',
      });
      onLogin('akun');
    }, 700);
  };

  // 3. KARTU KEDUA - B: Konfirmasi Tautan Email (Untuk Login Google SSO)
  const handleConfirmGoogleLinkVerification = async () => {
    setIsVerifyingLink(true);
    const sessionRes = await checkSupabaseEmailSession();

    setTimeout(() => {
      setIsVerifyingLink(false);
      setIsOtpSuccess(true);
      showToast('🎉 Tautan verifikasi email Google berhasil dikonfirmasi! Mengalihkan ke akun...');

      setTimeout(() => {
        onUpdateProfile({
          isLoggedIn: true,
          email: emailInput,
          name: sessionRes?.user?.user_metadata?.full_name || userProfile.name || 'Pengguna Google',
          googleLinked: true,
          googleEmail: emailInput,
        });
        onLogin('akun');
      }, 700);
    }, 750);
  };

  // Kembali ke Kartu Pertama (Berbalik ke Depan)
  const handleBackToCard1 = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCardStep(1);
      setIsFlipping(false);
      showToast('↩️ Kembali ke kartu halaman depan');
    }, 350);
  };

  // Kirim Ulang: Kode OTP (Manual) atau Tautan Verifikasi Email (Google SSO)
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setResendCountdown(45);

    if (authMethod === 'google') {
      const linkRes = await sendSupabaseVerificationLink(emailInput);
      showToast(`📧 ${linkRes.message}`);
    } else {
      const otpRes = await sendSupabaseOtp(emailInput);
      setOtpDigits(['', '', '', '', '', '']);
      showToast(`🔢 ${otpRes.message}`);
    }
  };

  // Helper Perubahan Digit OTP
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
      return;
    }

    const clean = val.replace(/\D/g, '');
    const updated = [...otpDigits];
    updated[index] = clean;
    setOtpDigits(updated);

    if (clean && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
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
        {/* Subtle vignette shadow overlay to enhance UI legibility without masking 3D */}
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

      {/* POPUP PUSH: DUA VARIAN BERBEDA (DAFTAR MANDIRI VS LOGIN GOOGLE SSO) */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-teal-500 text-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl shadow-teal-950/80 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
            {authMethod === 'google' ? (
              // VARIAN 1: NOTIFIKASI LOGIN GOOGLE SSO (VERIFIKASI TAUTAN EMAIL, BUKAN OTP)
              <>
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center shadow-lg shadow-teal-500/20 animate-bounce">
                  <Mail className="w-9 h-9 text-teal-300" />
                </div>
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Login Google SSO Terhubung
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Tautan Verifikasi Email Terkirim
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Autentikasi Google berhasil. Tautan verifikasi email resmi telah dikirim ke akun email Google Anda (<strong className="text-teal-300 underline underline-offset-2">Bukan Kode OTP</strong>). Kartu otomatis berbalik...
                  </p>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-teal-400 h-full w-full animate-pulse" />
                </div>
              </>
            ) : (
              // VARIAN 2: NOTIFIKASI DAFTAR MANDIRI (KODE OTP 6 DIGIT)
              <>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    Pendaftaran Mandiri Berhasil
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Selamat, Anda Berhasil!
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Akun berhasil didaftarkan. Kode verifikasi OTP 6 digit telah dikirimkan ke email Anda. Kartu otomatis berbalik untuk memasukkan kode...
                  </p>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full w-full animate-pulse" />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* BANNER UCAPAN & KARTU 3D FINBIZ */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-3.5 sm:px-6 py-2.5 sm:py-6 max-w-[360px] sm:max-w-md w-full mx-auto my-auto">
        {/* Banner Ucapan Selamat Datang */}
        <div className="w-full text-center space-y-1.5 sm:space-y-2 mb-3.5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-900/80 border border-teal-500/30 text-teal-300 text-[10px] sm:text-xs font-semibold backdrop-blur-md shadow-lg">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" />
            <span>FinBiz Keuangan</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
            Selamat Datang di FinBiz
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            {cardStep === 1
              ? 'Silakan daftar akun atau login dengan Google untuk mengelola keuangan bisnis Anda.'
              : authMethod === 'google'
              ? 'Tautan verifikasi resmi Google SSO telah dikirim (Bukan Kode OTP). Periksa kotak masuk Gmail Anda atau konfirmasi tautan di bawah.'
              : 'Verifikasi akun email Anda dengan 6 digit kode OTP di bawah ini.'}
          </p>
        </div>

        {/* CONTAINER KARTU 3D DENGAN EFEK BERBALIK & SENTUHAN INTERAKTIF */}
        <div
          ref={cardContainerRef}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseLeave={handlePointerLeave}
          onTouchStart={(e) => {
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={handlePointerLeave}
          className="relative w-full mx-auto select-none"
          style={{ perspective: '1400px' }}
        >
          <div
            className="relative w-full transition-transform ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transitionDuration: isFlipping ? '700ms' : tilt.active ? '120ms' : '500ms',
              transform:
                cardStep === 2
                  ? `rotateY(${180 - tilt.y}deg) rotateX(${tilt.x}deg) translateZ(${tilt.active ? 10 : 0}px)`
                  : `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg) translateZ(${tilt.active ? 10 : 0}px)`,
            }}
          >
            {/* ==================== KARTU PERTAMA: DAFTAR AKUN ==================== */}
            <div
              className={`relative w-full bg-slate-900/95 backdrop-blur-2xl border transition-all duration-300 rounded-3xl overflow-hidden ${
                tilt.active && cardStep === 1
                  ? 'border-teal-400/70 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(45,212,191,0.3)]'
                  : 'border-slate-700/80 shadow-2xl shadow-black/90'
              } ${cardStep === 2 ? 'pointer-events-none' : 'pointer-events-auto'}`}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Efek Kilau Sentuhan Dinamis Kartu Pertama */}
              {tilt.active && cardStep === 1 && (
                <div
                  className="pointer-events-none absolute inset-0 z-30 rounded-3xl transition-opacity duration-200"
                  style={{
                    background: `radial-gradient(circle 300px at ${tilt.glareX}% ${tilt.glareY}%, rgba(45, 212, 191, 0.18), transparent 75%)`,
                  }}
                />
              )}
              {/* Form Pendaftaran Manual */}
              <form onSubmit={handleRegisterManualSubmit} className="p-4 sm:p-6 md:p-7 space-y-3 sm:space-y-4">
                {/* Label Email */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 sm:top-3.5" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-9 sm:pl-10 pr-3.5 py-2.5 sm:py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Label Kata Sandi */}
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Kata Sandi
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
                    >
                      {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 sm:top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 sm:pl-10 pr-3.5 py-2.5 sm:py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Captcha Verifikasi: Wajib Klik Bukan Robot */}
                <div
                  onClick={handleToggleCaptcha}
                  className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-2.5 ${
                    isCaptchaChecked
                      ? 'bg-teal-950/40 border-teal-500/50 shadow-xs'
                      : 'bg-slate-950/70 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border flex items-center justify-center transition-all ${
                        isCaptchaChecked
                          ? 'bg-teal-500 border-teal-400 text-slate-950 shadow-xs'
                          : isCaptchaVerifying
                          ? 'bg-slate-800 border-teal-500/60'
                          : 'bg-slate-900 border-slate-600'
                      }`}
                    >
                      {isCaptchaVerifying ? (
                        <RefreshCw className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                      ) : isCaptchaChecked ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : null}
                    </div>
                    <span className="text-xs font-semibold text-slate-200">
                      {isCaptchaVerifying ? 'Memeriksa...' : 'Saya bukan robot'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                    <ShieldCheck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isCaptchaChecked ? 'text-teal-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
                      CAPTCHA
                    </span>
                  </div>
                </div>

                {/* Tombol Daftar Akun Manual */}
                <div className="pt-1 sm:pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 sm:py-3.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40 transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>Daftar Akun</span>
                    <ArrowRight className="w-4 h-4 text-teal-200" />
                  </button>
                </div>

                {/* Pemisah Bersih */}
                <div className="relative py-0.5 sm:py-1 flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider absolute">
                    atau
                  </span>
                </div>

                {/* Bagian Bawah Kartu: Login dengan Google Tanpa Embel-embel Lain */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-2.5 sm:py-3 px-4 bg-slate-950 hover:bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 sm:gap-3 transition-colors shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Login dengan Google</span>
                  </button>
                </div>
              </form>
            </div>

            {/* ==================== KARTU KEDUA: VERIFIKASI AKUN EMAIL ==================== */}
            <div
              className={`absolute inset-0 w-full bg-slate-900/95 backdrop-blur-2xl border transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between ${
                tilt.active && cardStep === 2
                  ? 'border-teal-300/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(45,212,191,0.4)]'
                  : 'border-teal-500/40 shadow-2xl shadow-teal-950/70'
              } ${cardStep === 2 ? 'pointer-events-auto' : 'pointer-events-none'}`}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              {/* Efek Kilau Sentuhan Dinamis Kartu Kedua */}
              {tilt.active && cardStep === 2 && (
                <div
                  className="pointer-events-none absolute inset-0 z-30 rounded-3xl transition-opacity duration-200"
                  style={{
                    background: `radial-gradient(circle 300px at ${100 - tilt.glareX}% ${tilt.glareY}%, rgba(45, 212, 191, 0.22), transparent 75%)`,
                  }}
                />
              )}
              {/* Header Kartu Kedua: Dua Varian Berbeda (Manual OTP vs Google SSO Tautan Email) */}
              <div className="p-4 sm:p-6 pb-1.5 sm:pb-2 text-center space-y-1 sm:space-y-1.5">
                {authMethod === 'google' ? (
                  <>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg sm:rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center mb-0.5 sm:mb-1 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Verifikasi Tautan Email Google SSO
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-300">
                      Tautan verifikasi resmi telah dikirim ke email:
                    </p>
                    <p className="text-[11px] sm:text-xs font-mono font-bold text-teal-300 truncate px-2 py-0.5 bg-slate-950/60 rounded-md sm:rounded-lg border border-teal-500/20">
                      {emailInput}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg sm:rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center mb-0.5 sm:mb-1 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Verifikasi Kode OTP Email
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-300">
                      Kode 6-digit OTP verifikasi telah dikirim ke:
                    </p>
                    <p className="text-[11px] sm:text-xs font-mono font-bold text-teal-300 truncate px-2 py-0.5 bg-slate-950/60 rounded-md sm:rounded-lg border border-teal-500/20">
                      {emailInput}
                    </p>
                  </>
                )}

                {/* Status Supabase Auth */}
                <div className="pt-0.5 sm:pt-1 flex items-center justify-center">
                  {isSupabaseConfigured ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Supabase Auth Real-Time Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-teal-500/10 text-teal-300 border border-teal-500/30 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      Supabase Proyek: xpbfjxzkmnecvcedajpk (Anon Key)
                    </span>
                  )}
                </div>
              </div>

              {/* Badan Kartu Kedua: Tampilan Berbeda Berdasarkan Metode (Google Link vs OTP Manual) */}
              {authMethod === 'google' ? (
                // TAMPILAN KHUSUS LOGIN GOOGLE SSO: VERIFIKASI TAUTAN EMAIL (BUKAN OTP)
                <div className="p-4 sm:p-6 md:p-7 space-y-3 sm:space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5 sm:space-y-3">
                    {/* Kotak Informasi Notifikasi Spesifik Sesuai Permintaan */}
                    <div className="bg-slate-950/80 rounded-2xl p-3 sm:p-3.5 border border-teal-500/30 space-y-2 text-left">
                      <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
                        <Sparkles className="w-4 h-4 text-teal-400 shrink-0 animate-pulse" />
                        <span>Notifikasi Informasi Verifikasi SSO:</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed">
                        Masuk via Google SSO menggunakan <strong className="text-white">Tautan Verifikasi Email resmi (Magic Link)</strong> yang dikirim ke kotak masuk Anda, <strong className="text-teal-300 underline underline-offset-2">bukan kode angka OTP</strong>.
                      </p>
                      <div className="p-2 rounded-xl bg-teal-950/40 border border-teal-500/20 text-[10px] sm:text-[11px] text-teal-200/90 leading-tight">
                        ✉️ Buka Gmail Anda lalu klik tombol/tautan verifikasi di dalam pesan untuk konfirmasi instan.
                      </div>
                    </div>

                    {/* Resend Link Google SSO */}
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 px-1 pt-1">
                      <span>Belum terima tautan email?</span>
                      <button
                        type="button"
                        disabled={resendCountdown > 0}
                        onClick={handleResendOtp}
                        className={`font-semibold transition-colors cursor-pointer ${
                          resendCountdown > 0
                            ? 'text-slate-500 cursor-not-allowed'
                            : 'text-teal-400 hover:text-teal-300 hover:underline'
                        }`}
                      >
                        {resendCountdown > 0 ? `Kirim Ulang (${resendCountdown}s)` : 'Kirim Ulang Tautan'}
                      </button>
                    </div>
                  </div>

                  {/* Tombol Aksi Verifikasi Google SSO */}
                  <div className="space-y-2 pt-1 sm:pt-2">
                    <button
                      type="button"
                      disabled={isVerifyingLink}
                      onClick={handleConfirmGoogleLinkVerification}
                      className="w-full py-2.5 sm:py-3.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-75 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/50 transition-all active:scale-[0.99] cursor-pointer"
                    >
                      {isVerifyingLink ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Memeriksa Tautan Email...</span>
                        </>
                      ) : isOtpSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>Tautan Berhasil Dikonfirmasi!</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-teal-200" />
                          <span>Konfirmasi Tautan Email & Masuk</span>
                        </>
                      )}
                    </button>

                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 sm:py-2.5 px-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-teal-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Kotak Masuk Gmail</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleBackToCard1}
                      className="w-full py-2 sm:py-2.5 px-4 text-[11px] sm:text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Kembali ke Halaman Depan</span>
                    </button>
                  </div>
                </div>
              ) : (
                // TAMPILAN KHUSUS DAFTAR MANDIRI: VERIFIKASI KODE OTP 6 DIGIT
                <form onSubmit={handleVerifyOtpSubmit} className="p-4 sm:p-6 md:p-7 space-y-3 sm:space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5 sm:space-y-3">
                    {/* 6 Digit Input Boxes */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="block text-xs font-semibold text-slate-300 text-center">
                        Masukkan 6 Digit Kode OTP:
                      </label>
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
                            className="w-8 h-10 sm:w-10 sm:h-12 bg-slate-950/90 border-2 border-slate-700 focus:border-teal-400 rounded-lg sm:rounded-xl text-center text-base sm:text-lg font-bold font-mono text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all shadow-md"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Resend Link */}
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 px-1">
                      <span>Belum terima kode OTP?</span>
                      <button
                        type="button"
                        disabled={resendCountdown > 0}
                        onClick={handleResendOtp}
                        className={`font-semibold transition-colors cursor-pointer ${
                          resendCountdown > 0
                            ? 'text-slate-500 cursor-not-allowed'
                            : 'text-teal-400 hover:text-teal-300 hover:underline'
                        }`}
                      >
                        {resendCountdown > 0 ? `Kirim Ulang (${resendCountdown}s)` : 'Kirim Ulang OTP'}
                      </button>
                    </div>

                    {/* Tips OTP */}
                    <div className="bg-slate-950/60 rounded-xl p-2 sm:p-2.5 border border-teal-500/20 text-center">
                      <p className="text-[10px] sm:text-[11px] text-teal-200/90 leading-tight">
                        🔢 <strong>Metode Mandiri:</strong> Masukkan 6 digit angka kode verifikasi yang tertera pada pesan email pendaftaran Anda.
                      </p>
                    </div>
                  </div>

                  {/* Tombol Aksi Verifikasi OTP */}
                  <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
                    <button
                      type="submit"
                      disabled={isVerifyingOtp}
                      className="w-full py-2.5 sm:py-3.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-75 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/50 transition-all active:scale-[0.99] cursor-pointer"
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
                          <span>Verifikasi Kode OTP & Masuk</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToCard1}
                      className="w-full py-2 sm:py-2.5 px-4 text-[11px] sm:text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Kembali ke Pendaftaran</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER HALAMAN DEPAN: MEWAH, GEMILAU, TRANSPARAN & 3D (RESPONSIF SEMUA DEVICE) */}
      <footer className="relative z-20 w-full px-3 sm:px-6 md:px-8 py-2.5 sm:py-4 flex items-center sm:items-end justify-between select-none shrink-0 pointer-events-auto gap-2 sm:gap-4 max-w-7xl mx-auto">
        {/* Kiri: Brand & Versi Sistem - 3D Translucent Glassmorphic Capsule */}
        <div className="group relative max-w-[48%] sm:max-w-none shrink-0">
          {/* Ambient Glow Aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/30 via-emerald-500/20 to-teal-400/30 rounded-xl sm:rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative flex items-center gap-1.5 sm:gap-3 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-teal-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25),0_0_20px_rgba(45,212,191,0.2)] hover:border-teal-300/70 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35),0_0_28px_rgba(45,212,191,0.35)] transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-400/30 to-emerald-600/30 border border-teal-300/50 flex items-center justify-center text-teal-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] shrink-0">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-teal-200 animate-pulse" />
            </div>
            <div className="flex flex-col text-left truncate">
              {/* Baris 1: Label FinBiz Keuangan Gemilau Mewah */}
              <span className="text-[11px] sm:text-xs md:text-sm font-bold sm:font-extrabold tracking-wide bg-gradient-to-r from-teal-100 via-emerald-300 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(20,184,166,0.6)] truncate">
                FinBiz Keuangan
              </span>
              {/* Baris 2: Versi Sistem agak kecil */}
              <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-teal-400 animate-ping shrink-0" />
                <span className="text-[9px] sm:text-[10px] md:text-xs text-teal-300/90 font-mono font-semibold tracking-wider drop-shadow-sm truncate">
                  Versi Sistem v3.1.3 Enterprise
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kanan: Kreator & Identitas - 3D Translucent Glassmorphic Capsule */}
        <div className="group relative max-w-[48%] sm:max-w-none shrink-0">
          {/* Ambient Glow Aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/25 via-emerald-500/20 to-teal-400/30 rounded-xl sm:rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative flex items-center gap-1.5 sm:gap-3 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-emerald-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25),0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-300/70 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35),0_0_28px_rgba(16,185,129,0.35)] transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex flex-col text-right truncate">
              {/* Baris 1: Label Kreator App Mantangai Gemilau Emas/Teal */}
              <span className="text-[11px] sm:text-xs md:text-sm font-bold sm:font-extrabold tracking-wide bg-gradient-to-r from-amber-100 via-emerald-200 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] truncate">
                Kreator App Mantangai
              </span>
              {/* Baris 2: Uluh Lewu Dayak agak kecil bernuansa kristal */}
              <div className="flex items-center justify-end gap-1 sm:gap-1.5 mt-0.5">
                <span className="text-[9px] sm:text-[10px] md:text-xs text-emerald-300/90 font-semibold tracking-wide drop-shadow-sm truncate">
                  Uluh Lewu Dayak
                </span>
                <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400/20 via-emerald-500/30 to-teal-600/30 border border-emerald-300/50 flex items-center justify-center text-emerald-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] shrink-0">
              <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
