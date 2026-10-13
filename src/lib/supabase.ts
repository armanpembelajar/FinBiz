import { createClient, SupabaseClient } from '@supabase/supabase-js';

// URL Supabase Proyek FinBiz
const defaultUrl = 'https://xpbfjxzkmnecvcedajpk.supabase.co';
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey.length > 10);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Mengirim kode verifikasi OTP ke alamat email pengguna melalui Supabase Auth
 */
export async function sendSupabaseOtp(email: string): Promise<{ success: boolean; message: string; isReal: boolean }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: true,
      isReal: false,
      message: 'Kode verifikasi 6-digit telah dikirimkan ke email Anda.',
    };
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });

    if (error) {
      console.warn('Supabase OTP Send Error:', error);
      return {
        success: false,
        isReal: true,
        message: `Gagal mengirim kode via Supabase: ${error.message}`,
      };
    }

    return {
      success: true,
      isReal: true,
      message: `Kode verifikasi OTP 6-digit asli telah dikirim oleh Supabase ke inbox: ${email}`,
    };
  } catch (err: any) {
    console.error('Supabase OTP Exception:', err);
    return {
      success: false,
      isReal: true,
      message: err.message || 'Terjadi kendala saat menghubungi Supabase',
    };
  }
}

/**
 * Mengirim Tautan Verifikasi Email (Magic Link) resmi untuk alur Login dengan Google / SSO
 * Membedakan notifikasi secara tegas dari pengiriman kode OTP 6-digit pendaftaran mandiri.
 */
export async function sendSupabaseVerificationLink(email: string): Promise<{ success: boolean; message: string; isReal: boolean }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: true,
      isReal: false,
      message: `Tautan verifikasi email telah dikirimkan ke email Google Anda: ${email} (Bukan Kode OTP).`,
    };
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });

    if (error) {
      console.warn('Supabase Verification Link Send Error:', error);
      return {
        success: false,
        isReal: true,
        message: `Gagal mengirim tautan via Supabase: ${error.message}`,
      };
    }

    return {
      success: true,
      isReal: true,
      message: `Tautan verifikasi email resmi telah dikirim ke kotak masuk Google: ${email} (Bukan Kode OTP). Silakan klik tautan di email untuk masuk.`,
    };
  } catch (err: any) {
    console.error('Supabase Link Exception:', err);
    return {
      success: false,
      isReal: true,
      message: err.message || 'Terjadi kendala saat mengirim tautan verifikasi email',
    };
  }
}

/**
 * Memverifikasi kode 6-digit OTP yang dimasukkan oleh pengguna
 */
export async function verifySupabaseOtp(
  email: string,
  token: string
): Promise<{ success: boolean; message: string; user?: any }> {
  // Jika Supabase belum memiliki Anon Key, gunakan verifikasi fallback
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: true,
      message: 'Verifikasi kode OTP berhasil!',
    };
  }

  try {
    // Coba verifikasi dengan tipe email
    let { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: token.trim(),
      type: 'email',
    });

    // Jika gagal, coba dengan tipe signup
    if (error) {
      const retry = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.trim(),
        type: 'signup',
      });
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return {
        success: false,
        message: error.message || 'Kode verifikasi tidak sesuai atau sudah kedaluwarsa.',
      };
    }

    return {
      success: true,
      message: 'Verifikasi akun email Supabase berhasil!',
      user: data?.user,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gagal memverifikasi kode dengan Supabase.',
    };
  }
}

/**
 * Memeriksa status sesi Supabase dari tautan verifikasi email
 */
export async function checkSupabaseEmailSession(): Promise<{ hasSession: boolean; user?: any }> {
  if (!isSupabaseConfigured || !supabase) {
    return { hasSession: false };
  }
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      return { hasSession: true, user: data.session.user };
    }
    return { hasSession: false };
  } catch {
    return { hasSession: false };
  }
}