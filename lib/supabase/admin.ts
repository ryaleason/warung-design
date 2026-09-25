import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const rawServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const rawAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Kunci tidak valid / kedaluwarsa yang pernah ada di .env.example
const INVALID_SERVICE_ROLE_KEYS = [
  'your-supabase-service-role-key',
  'sb_secret_kyuuOH80FJRE0FiUsbKTDw_zF1al5sj',
];

const isValidServiceKey = (key: string): boolean => {
  if (!key) return false;
  if (key.includes('your-supabase-')) return false;
  if (INVALID_SERVICE_ROLE_KEYS.includes(key)) return false;
  return true;
};

const isValidAnonKey = (key: string): boolean => {
  if (!key) return false;
  if (key.includes('your-supabase-')) return false;
  return true;
};

// Prioritaskan service_role yang valid, atau fallback ke publishable/anon key yang aktif
const effectiveKey = isValidServiceKey(rawServiceRoleKey)
  ? rawServiceRoleKey
  : isValidAnonKey(rawAnonKey)
    ? rawAnonKey
    : '';

export const isSupabaseAdminConfigured = Boolean(
  supabaseUrl && 
  effectiveKey && 
  !supabaseUrl.includes('your-project')
);

let adminClient: SupabaseClient | null = null;

export const getSupabaseAdmin = (): SupabaseClient | null => {
  if (!isSupabaseAdminConfigured) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(supabaseUrl, effectiveKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return adminClient;
};


