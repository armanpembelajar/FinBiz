// 2. LOGIN DENGAN GOOGLE (Wajib Otorisasi Resmi Google / OAuth)
  const handleGoogleLogin = () => {
    const googleClientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;

    // 1. Opsi Google Identity Services (GIS)
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
        client.requestAccessToken();
        return;
      } catch (err) {
        console.warn('Google OAuth token client error:', err);
      }
    }

    // 2. Opsi Supabase Google OAuth
    if (isSupabaseConfigured()) {
      showToast('🚀 Mengarahkan ke halaman otorisasi Google...');
      signInWithGoogleSupabase();
      return;
    }

    // 3. Jika Client ID belum terpasang di Environment Variables
    showToast('⚠️ Fitur Google Login memerlukan VITE_GOOGLE_CLIENT_ID atau Supabase OAuth.');
  };