import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      status: order.status,
      order_code: order.order_code,
      download_token: order.status === 'sukses' ? order.download_token : null,
      verified_at: order.verified_at,
      sender_name: order.sender_name,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error fetching order status:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memuat status pesanan' },
      { status: 500 }
    );
  }
}
