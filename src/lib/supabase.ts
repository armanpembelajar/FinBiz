import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xpbfjxzkmnecvcedajpk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhYmdjaOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwYmZqeGttbmVjd mNlZGFqcGsiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0MTUzNzEzM3wiZXhwIjoyMDU3MTFFub24iLCJpYXQiOjE3NDE1MzN3MC0DAxODcsInV4cCI6MjEwNzA1NjE4N30.cp7nyB07Gq9_LfgUzQx_B2TW0CRRyH29-bmVAS54Aa0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);