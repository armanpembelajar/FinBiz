import React from 'react';

// Tipe props disesuaikan dengan kebutuhan komponen kamu
interface AuthModalProps {
  onUpdateProfile: (profileData: any) => void;
  onLogin: (page: string) => void;
  showToast: (message: string) => void;
  isSupabaseConfigured?: () => boolean;
  signInWithGoogleSupabase?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onUpdateProfile,
  onLogin,
  showToast,
  isSupabaseConfigured = () => false,
  signInWithGoogleSupabase = () => {},
}) => {

  // 2. LOGIN DENGAN GOOGLE (Wajib Otorisasi Resmi Google / OAuth)
  const handleGoogleLogin = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const googleOauth = (window as any).google?.accounts?.oauth2;

    // 1. Opsi Google Identity Services (GIS SDK)
    if (googleClientId && googleOauth) {
      try {
        const client = googleOauth.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              console.error('OAuth Error:', tokenResponse);
              showToast('❌ Gagal melakukan otorisasi Google.');
              return;
            }

            if (tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });

                if (!res.ok) throw new Error('Gagal mengambil data userinfo');

                const userInfo = await res.json();
                if (userInfo.email) {
                  onUpdateProfile({
                    name: userInfo.name || '',
                    email: userInfo.email,
                    avatarUrl: userInfo.picture || '',
                    googleLinked: true,
                    googleEmail: userInfo.email,
                    authMethod: 'google',
                    isLoggedIn: true,
                  });
                  showToast(`🎉 Berhasil terhubung dengan Akun Google: ${userInfo.email}!`);
                  onLogin('dashboard');
                  return;
                }
              } catch (err) {
                console.warn('Google userinfo fetch err:', err);
                showToast('⚠️ Gagal mengambil data profil Google.');
              }
            }
          },
        });

        // Panggil pop-up otorisasi
        client.requestAccessToken();
        return;
      } catch (err) {
        console.warn('Google OAuth token client error:', err);
      }
    }

    // 2. Opsi Supabase Google OAuth (jika pakai Supabase)
    if (typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
      showToast('🚀 Mengarahkan ke halaman otorisasi Google...');
      signInWithGoogleSupabase();
      return;
    }

    // 3. Jika SDK Google belum terload atau Client ID kosong
    if (!googleOauth && googleClientId) {
      showToast('⚠️ SDK Google belum siap, silakan muat ulang halaman (F5).');
      return;
    }

    showToast('⚠️ Fitur Google Login memerlukan VITE_GOOGLE_CLIENT_ID atau Supabase OAuth.');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg text-center max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Masuk ke FinBiz</h2>
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
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
        Lanjutkan dengan Google
      </button>
    </div>
  );
};