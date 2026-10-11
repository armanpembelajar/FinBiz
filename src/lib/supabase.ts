import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aEUUkoElSPXIVACuZpScbg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_aEUUkoElSPXIVACuZpScbg_QgL802oI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);