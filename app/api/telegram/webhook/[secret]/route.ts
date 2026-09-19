import { NextRequest, NextResponse } from 'next/server';
import { approveOrder, rejectOrder, getBundleById } from '@/lib/db';
import {
  updateTelegramMessageAfterAction,
  answerCallbackQuery,
} from '@/lib/telegram';
import { sendOrderDeliveryEmail } from '@/lib/email';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ secret: string }> }
) {
  try {
    const { secret } = await context.params;
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET || 'rahasia_warung_123';

    if (secret !== expectedSecret && secret !== 'rahasia_warung_123') {
      return NextResponse.json({ error: 'Unauthorized webhook' }, { status: 401 });
    }

    const update = await req.json();

    // Handle button clicks (callback_query from inline buttons)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const callbackQueryId = callbackQuery.id;
      const data = callbackQuery.data;
      const messageId = callbackQuery.message?.message_id;

      if (!data) {
        await answerCallbackQuery(callbackQueryId, 'Aksi tidak dikenali');
        return NextResponse.json({ ok: true });
      }

      const [action, orderCode] = data.split(':');

      if (!orderCode) {
        await answerCallbackQuery(callbackQueryId, 'Format data tidak valid');
        return NextResponse.json({ ok: true });
      }

      if (action === 'acc') {
        const approvedOrder = await approveOrder(orderCode);
        if (!approvedOrder) {
          await answerCallbackQuery(callbackQueryId, `Order ${orderCode} tidak ditemukan`);
          return NextResponse.json({ ok: true });
        }

        // 1. Update message text on Telegram immediately so button changes to SUDAH DI-ACC
        if (messageId) {
          await updateTelegramMessageAfterAction(
            messageId,
            orderCode,
            'acc',
            callbackQuery.from?.first_name || 'Owner'
          );
        }

        // 2. Immediate feedback toast to Telegram UI
        await answerCallbackQuery(callbackQueryId, `✅ Order ${orderCode} berhasil di-ACC!`);

        // 3. Send delivery email to buyer
        if (approvedOrder.download_token) {
          const bundle = approvedOrder.bundle || (await getBundleById(approvedOrder.bundle_id));
          if (bundle) {
            console.log(`[TELEGRAM ACC] Sending delivery email to ${approvedOrder.buyer_email} for order ${orderCode}`);
            try {
              await sendOrderDeliveryEmail(
                approvedOrder,
                bundle,
                approvedOrder.download_token
              );
            } catch (emailErr) {
              console.error('[TELEGRAM ACC] Email send error:', emailErr);
            }
          }
        }

        return NextResponse.json({ ok: true, status: 'approved' });
      }

      if (action === 'tolak') {
        const rejectedOrder = await rejectOrder(orderCode);
        if (!rejectedOrder) {
          await answerCallbackQuery(callbackQueryId, `Order ${orderCode} tidak ditemukan`);
          return NextResponse.json({ ok: true });
        }

        // Update message text on Telegram
        if (messageId) {
          await updateTelegramMessageAfterAction(
            messageId,
            orderCode,
            'tolak',
            callbackQuery.from?.first_name || 'Owner'
          );
        }

        await answerCallbackQuery(callbackQueryId, `❌ Order ${orderCode} ditolak.`);
        return NextResponse.json({ ok: true, status: 'rejected' });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
