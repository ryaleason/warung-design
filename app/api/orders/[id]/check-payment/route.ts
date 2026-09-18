import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, submitPaymentCheck } from '@/lib/db';
import { sendOrderVerificationNotification } from '@/lib/telegram';
import { CheckPaymentPayload } from '@/types';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await req.json()) as CheckPaymentPayload;

    if (!body.sender_name || !body.sender_name.trim()) {
      return NextResponse.json(
        { error: 'Nama pengirim transfer wajib diisi' },
        { status: 400 }
      );
    }

    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order tidak ditemukan' },
        { status: 404 }
      );
    }

    if (order.status === 'sukses') {
      return NextResponse.json(
        { error: 'Pesanan ini sudah berhasil diverifikasi' },
        { status: 400 }
      );
    }

    if (order.status === 'kedaluwarsa') {
      return NextResponse.json(
        { error: 'Pesanan ini sudah kedaluwarsa, silakan buat pesanan baru' },
        { status: 400 }
      );
    }

    // Prepare notification to Telegram
    const tempOrder = {
      ...order,
      sender_name: body.sender_name.trim(),
    };

    const notifResult = await sendOrderVerificationNotification(
      tempOrder,
      order.bundle!
    );

    const updatedOrder = await submitPaymentCheck(
      id,
      body.sender_name.trim(),
      notifResult.messageId
    );

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      telegramNotified: notifResult.success,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error submitting payment check:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memproses pengecekan pembayaran' },
      { status: 500 }
    );
  }
}
