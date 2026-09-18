import { NextRequest, NextResponse } from 'next/server';
import { approveOrder, rejectOrder, getOrderById } from '@/lib/db';
import { sendOrderDeliveryEmail } from '@/lib/email';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const action = body.action as 'acc' | 'tolak';

    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (action === 'acc') {
      const updated = await approveOrder(order.order_code);
      if (updated && updated.download_token && updated.bundle) {
        await sendOrderDeliveryEmail(updated, updated.bundle, updated.download_token);
      }
      return NextResponse.json({ success: true, order: updated });
    }

    if (action === 'tolak') {
      const updated = await rejectOrder(order.order_code);
      return NextResponse.json({ success: true, order: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
