import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aEUUkoElSPXIVACuZpScbg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwYmZqeHprbW5lY3ZjZWRhanBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0ODAxODcsImV4cCI6MjEwNzA1NjE4N30.cp7nyB07Gq9_LfgUzQx_B2TW0CRRyH29-bmVAS54Aa0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);