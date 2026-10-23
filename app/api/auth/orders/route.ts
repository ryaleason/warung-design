import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getUserOrders } from '@/lib/db/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Belum login' }, { status: 401 });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Sesi berakhir' }, { status: 401 });
    }

    const orders = await getUserOrders(session.email, session.userId);
    return NextResponse.json({ success: true, orders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat riwayat pesanan';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
