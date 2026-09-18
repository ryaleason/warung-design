import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getBundleById } from '@/lib/db';
import { CreateOrderPayload } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateOrderPayload;

    if (!body.bundle_id || !body.buyer_name || !body.buyer_email) {
      return NextResponse.json(
        { error: 'Mohon lengkapi nama dan email Anda' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.buyer_email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    const bundle = await getBundleById(body.bundle_id);
    if (!bundle) {
      return NextResponse.json(
        { error: 'Bundle tidak ditemukan' },
        { status: 404 }
      );
    }

    const order = await createOrder({
      bundle_id: body.bundle_id,
      buyer_name: body.buyer_name,
      buyer_email: body.buyer_email,
      buyer_phone: body.buyer_phone,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_code: order.order_code,
        base_price: order.base_price,
        unique_code: order.unique_code,
        total_amount: order.total_amount,
        status: order.status,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan sistem' },
      { status: 500 }
    );
  }
}
