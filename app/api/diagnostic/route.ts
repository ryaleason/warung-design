import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const validSecret = process.env.TELEGRAM_WEBHOOK_SECRET || 'rahasia_warung_123';
  if (secret !== validSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const vercelUrl = process.env.VERCEL_URL || '';
  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || '';

  const report: Record<string, unknown> = {
    app_url: appUrl,
    vercel_url: vercelUrl,
    vercel_project_production_url: vercelProdUrl,
    supabase: {
      url_configured: Boolean(supabaseUrl),
      url_host: supabaseUrl ? new URL(supabaseUrl).host : null,
      service_role_configured: Boolean(serviceRoleKey),
      service_role_len: serviceRoleKey.length,
      service_role_prefix: serviceRoleKey ? serviceRoleKey.substring(0, 10) + '...' : null,
      anon_key_configured: Boolean(anonKey),
      anon_key_len: anonKey.length,
      anon_key_prefix: anonKey ? anonKey.substring(0, 10) + '...' : null,
      is_supabase_admin_configured: isSupabaseAdminConfigured,
      using_fallback_anon: serviceRoleKey === 'sb_secret_kyuuOH80FJRE0FiUsbKTDw_zF1al5sj' || !serviceRoleKey,
    },
    test_query: null,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .limit(3);

      report.test_query = {
        success: !error,
        error: error ? { message: error.message, details: error.details, hint: error.hint, code: error.code } : null,
        count,
        sample: data,
      };
    } catch (err: unknown) {
      const error = err as Error;
      report.test_query = {
        success: false,
        error: error.message,
      };
    }
  } else {
    report.test_query = {
      success: false,
      error: 'Supabase client is null (isSupabaseAdminConfigured is false)',
    };
  }

  return NextResponse.json(report);
}
