import React, { useState, useRef } from 'react';
import { UserProfile, ActiveTab } from '../../types';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Upload, 
  Trash2, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Camera, 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  LogIn, 
  Briefcase,
  AlertCircle,
  Award,
  Globe,
  LogOut,
  X
} from 'lucide-react';

interface AkunViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenAuthModal: (step?: 1 | 2) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onLogout?: () => void;
}

export const AkunView: React.FC<AkunViewProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenAuthModal,
  onNavigateTab,
  onLogout,
}) => {
  // Form State Identitas
  const [name, setName] = useState(userProfile.name || 'Arman Pratama');
  const [birthPlace, setBirthPlace] = useState(userProfile.birthPlace || 'Bandung');
  const [birthDate, setBirthDate] = useState(userProfile.birthDate || '1992-06-15');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan' | ''>(userProfile.gender || 'Laki-laki');
  const [nik, setNik] = useState(userProfile.nik || '3273011506920003');
  
  // Alamat
  const [address, setAddress] = useState(userProfile.address || 'Jl. Surya Kencana No. 45, RT 02 / RW 04, Kel. Ciumbuleuit');
  const [city, setCity] = useState(userProfile.city || 'Bandung');
  const [province, setProvince] = useState(userProfile.province || 'Jawa Barat');
  const [postalCode, setPostalCode] = useState(userProfile.postalCode || '40132');

  // Kontak & Usaha
  const [phone, setPhone] = useState(userProfile.phone || '0812-3456-7890');
  const [email, setEmail] = useState(userProfile.email || 'armandmtg@gmail.com');
  const [businessName, setBusinessName] = useState(userProfile.businessName || 'CV Niaga Mandiri Utama');
  const [roleTitle, setRoleTitle] = useState(userProfile.roleTitle || 'Pemilik Usaha (Founder)');
  const [businessType, setBusinessType] = useState(userProfile.businessType || 'Retail & Grosir');
  const [currency, setCurrency] = useState(userProfile.currency || 'IDR (Rp)');

  // Foto Profil
  const [avatarUrl, setAvatarUrl] = useState<string>(
    userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Google Link State
  const [googleEmailInput, setGoogleEmailInput] = useState(userProfile.googleEmail || 'armandmtg@gmail.com');
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);

  // Logout Confirmation Modal State
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Preset Avatar Eksekutif / Pengusaha UMKM
  const presetAvatars = [
    { label: 'Eksekutif Pria 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=80' },
    { label: 'Eksekutif Wanita 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80' },
    { label: 'Eksekutif Pria 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=80' },
    { label: 'Eksekutif Wanita 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&h=240&q=80' },
    { label: 'Wirausaha Muda', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&h=240&q=80' },
  ];

  // Handle Upload Foto dari Device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('⚠️ Ukuran foto maksimal 5 MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setAvatarUrl(result);
          onUpdateProfile({ avatarUrl: result });
          showToast('📸 Foto profil baru berhasil diunggah!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetAvatar = (url: string) => {
    setAvatarUrl(url);
    onUpdateProfile({ avatarUrl: url });
    showToast('✨ Foto profil diperbarui dengan avatar pilihan!');
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    onUpdateProfile({ avatarUrl: undefined });
    showToast('🗑️ Foto profil telah direset ke inisial nama.');
  };

  // Google Link Toggle
  const handleToggleGoogleLink = () => {
    if (userProfile.googleLinked) {
      onUpdateProfile({
        googleLinked: false,
        googleEmail: undefined,
      });
      showToast('Tautan akun Google telah diputus.');
    } else {
      setIsLinkingGoogle(true);
      setTimeout(() => {
        setIsLinkingGoogle(false);
        const linkedEmail = googleEmailInput || 'armandmtg@gmail.com';
        onUpdateProfile({
          googleLinked: true,
          googleEmail: linkedEmail,
        });
        showToast(`🎉 Sukses menautkan akun Google (${linkedEmail})!`);
      }, 750);
    }
  };

  // Hitung Umur dari Tanggal Lahir
  const calculateAge = (dateStr: string) => {
    if (!dateStr) return '';
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? `${age} Tahun` : '';
  };

  // Hitung Skor Kelengkapan Profil
  const calculateCompletionScore = () => {
    let score = 0;
    if (name.trim()) score += 15;
    if (avatarUrl) score += 15;
    if (birthPlace.trim() && birthDate) score += 15;
    if (gender) score += 10;
    if (address.trim() && city.trim()) score += 15;
    if (phone.trim() && email.trim()) score += 15;
    if (userProfile.googleLinked) score += 15;
    return Math.min(100, score);
  };

  const completionScore = calculateCompletionScore();

  // Simpan Form Identitas Lengkap
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      birthPlace,
      birthDate,
      gender,
      nik,
      address,
      city,
      province,
      postalCode,
      phone,
      email,
      businessName,
      roleTitle,
      businessType,
      currency,
      avatarUrl,
      isLoggedIn: true,
    });
    showToast('💾 Seluruh identitas & profil akun berhasil disimpan!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 bg-slate-900 text-white border border-teal-500/40 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-top duration-200">
          <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Navigasi Cepat */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 md:p-8 text-white border border-slate-700/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Akun
              </span>
              {userProfile.googleLinked ? (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Google Terhubung
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Belum Ditautkan
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Profil &amp; Usaha
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Kelola data profil, alamat, kontak, dan akun Google.
            </p>
          </div>


        </div>
      </div>

      {/* Meter Bar Kelengkapan Profil */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900">Kelengkapan Profil</h2>
              <p className="text-[11px] text-slate-500">
                {completionScore === 100 
                  ? 'Profil lengkap dan terverifikasi.'
                  : 'Lengkapi data untuk verifikasi optimal.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-teal-700 font-mono tabular-nums">
              {completionScore}%
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              completionScore === 100 
                ? 'bg-emerald-100 text-emerald-800' 
                : completionScore >= 70 
                ? 'bg-teal-100 text-teal-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {completionScore === 100 ? 'Lengkap' : 'Tahap Pengisian'}
            </span>
          </div>
        </div>

        {/* Progres Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${completionScore}%` }}
          />
        </div>

        {/* Checklist Kelengkapan */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1 text-[11px]">
          <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${name ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${name ? 'text-emerald-600' : 'text-slate-300'}`} />
            <span className="truncate">Nama</span>
          </div>
          <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${avatarUrl ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${avatarUrl ? 'text-emerald-600' : 'text-slate-300'}`} />
            <span className="truncate">Foto</span>
          </div>
          <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${birthPlace && birthDate ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${birthPlace && birthDate ? 'text-emerald-600' : 'text-slate-300'}`} />
            <span className="truncate">TTL</span>
          </div>
          <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${gender ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${gender ? 'text-emerald-600' : 'text-slate-300'}`} />
            <span className="truncate">Gender</span>
          </div>
          <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${address && city ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${address && city ? 'text-emerald-600' : 'text-slate-300'}`} />
            <span className="truncate">Alamat</span>
          </div>
          <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${phone ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${phone ? 'text-emerald-600' : 'text-slate-300'}`} />
            <span className="truncate">Kontak</span>
          </div>
          <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${userProfile.googleLinked ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' : 'bg-amber-50/70 border-amber-200 text-amber-800'}`}>
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${userProfile.googleLinked ? 'text-emerald-600' : 'text-amber-500'}`} />
            <span className="truncate">Google</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* ===================== ZONA 1: FOTO ===================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Foto</h2>
                <p className="text-xs text-slate-500">Foto profil untuk sistem dan laporan.</p>
              </div>
            </div>
            <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium">
              Maks. 5MB
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-teal-500/40 shadow-md bg-slate-100 flex items-center justify-center">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Foto Profil" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-teal-300 font-bold text-3xl">
                    {name.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg border-2 border-white transition-transform hover:scale-110"
                title="Pilih file foto"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>

            {/* Input File Tersembunyi */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />

            {/* Opsi Upload & Preset */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div>
                <h3 className="text-xs font-bold text-slate-900">{name || 'Nama Pengguna'}</h3>
                <p className="text-xs text-slate-500">
                  {roleTitle} di <span className="font-semibold text-slate-700">{businessName}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Foto</span>
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>

              {/* Preset Avatar Cepat */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[11px] font-medium text-slate-500 mb-2">
                  Atau pilih avatar:
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {presetAvatars.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(preset.url)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                        avatarUrl === preset.url ? 'border-teal-600 ring-2 ring-teal-200' : 'border-slate-200 opacity-80 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== ZONA 2: IDENTITAS ===================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Identitas</h2>
              <p className="text-xs text-slate-500">Data diri sesuai identitas resmi.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Nama Lengkap */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arman Pratama"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>
            </div>

            {/* NIK */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIK
              </label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="16 digit NIK"
                maxLength={16}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono tracking-wider"
              />
            </div>

            {/* Tempat Lahir */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tempat Lahir <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="Bandung"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Tanggal Lahir */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Tanggal Lahir <span className="text-rose-500">*</span>
                </label>
                {birthDate && (
                  <span className="text-[10px] text-teal-700 font-medium bg-teal-50 px-1.5 py-0.5 rounded">
                    {calculateAge(birthDate)}
                  </span>
                )}
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('Laki-laki')}
                  className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                    gender === 'Laki-laki'
                      ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Laki-laki
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Perempuan')}
                  className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                    gender === 'Perempuan'
                      ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Perempuan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== ZONA 3: ALAMAT ===================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Alamat</h2>
              <p className="text-xs text-slate-500">Alamat operasional atau kantor.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Lengkap <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Surya Kencana No. 45, Ciumbuleuit"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kota <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bandung"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Provinsi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Jawa Barat"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="40132"
                  maxLength={5}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===================== ZONA 4: KONTAK & USAHA ===================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Kontak &amp; Usaha</h2>
              <p className="text-xs text-slate-500">Kontak aktif dan detail usaha.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp / Telepon <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Nama Usaha */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Usaha <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="CV Niaga Mandiri Utama"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Jabatan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jabatan
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="Pemilik Usaha"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Bidang Usaha */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bidang Usaha
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="Retail & Grosir">Retail &amp; Grosir</option>
                <option value="F&B / Kuliner">F&amp;B / Kuliner</option>
                <option value="Jasa & Konsultansi">Jasa &amp; Konsultansi</option>
                <option value="Manufaktur & Produksi">Manufaktur &amp; Produksi</option>
                <option value="Agribisnis">Agribisnis</option>
              </select>
            </div>

            {/* Mata Uang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mata Uang
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="IDR (Rp)">IDR (Rp)</option>
                <option value="USD ($)">USD ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===================== ZONA 5: GOOGLE ===================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Google
                </h2>
                <p className="text-xs text-slate-500">
                  {userProfile.googleLinked 
                    ? 'Akun Google aktif terhubung.' 
                    : 'Tautkan akun Google untuk akses cepat.'}
                </p>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
              userProfile.googleLinked
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {userProfile.googleLinked ? '● Terhubung' : '○ Belum Ditautkan'}
            </span>
          </div>

          {userProfile.googleLinked ? (
            /* Tampilan Jika SUDAH Ditautkan */
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-emerald-950">
                      Google Terhubung
                    </h3>
                    <p className="text-xs font-mono text-emerald-800">
                      {userProfile.googleEmail || 'armandmtg@gmail.com'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleGoogleLink}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 hover:border-rose-300 border border-slate-300 rounded-lg text-xs font-semibold transition-all shadow-xs"
                  >
                    Putus Tautan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-emerald-800 border-t border-emerald-200/60">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Login 1-Klik</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cadangan Cloud</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sinkronisasi Data</span>
                </div>
              </div>
            </div>
          ) : (
            /* Tampilan Jika BELUM Ditautkan */
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Belum Ditautkan</span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-lg">
                    Tautkan akun Google untuk mempermudah akses masuk tanpa kata sandi.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  <input
                    type="email"
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  <button
                    type="button"
                    onClick={handleToggleGoogleLink}
                    disabled={isLinkingGoogle}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all whitespace-nowrap"
                  >
                    {isLinkingGoogle ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menghubungkan...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                        <span>Tautkan Google</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===================== ZONA 6: KELUAR SESI ===================== */}
        <div className="bg-white rounded-2xl border border-rose-200/70 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-rose-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Keluar Sesi</h2>
                <p className="text-xs text-slate-500">Keluar dari akun di perangkat ini.</p>
              </div>
            </div>
            <span className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full font-semibold">
              Sesi: {userProfile.name}
            </span>
          </div>

          <div className="p-4 bg-rose-50/40 border border-rose-200/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">Keluar dari Akun?</h4>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                Menutup sesi akan mengamankan data Anda. Anda dapat masuk kembali kapan saja.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all shrink-0 hover:shadow"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* ===================== TOMBOL AKSI SIMPAN UTAMA ===================== */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Data tersimpan aman dan tersinkronisasi.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              Dashboard
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all group"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </form>

      {/* Modal Dialog Konfirmasi Keluar Akun */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">
                Keluar dari Akun?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keluar dari akun <strong>{userProfile.name}</strong> ({userProfile.businessName})? Anda dapat masuk kembali kapan saja.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    onOpenAuthModal(1);
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ya, Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
