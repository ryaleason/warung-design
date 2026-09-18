import { NextRequest, NextResponse } from 'next/server';
import { approveOrder, rejectOrder } from '@/lib/db';
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
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    // Validate webhook secret path
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized secret' }, { status: 401 });
    }

    const update = await req.json();

    // Check if update is a callback query (inline button pressed)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const callbackQueryId = callbackQuery.id;
      const fromId = String(callbackQuery.from?.id);
      const data = callbackQuery.data as string;
      const messageId = callbackQuery.message?.message_id;

      const ownerChatId = process.env.TELEGRAM_OWNER_CHAT_ID;
      // Guard: only owner chat ID can perform actions (TDD 5.3)
      if (ownerChatId && fromId !== ownerChatId) {
        await answerCallbackQuery(
          callbackQueryId,
          'Akses ditolak: Hanya owner terdaftar yang dapat memverifikasi.'
        );
        return NextResponse.json({ error: 'Unauthorized chat ID' }, { status: 403 });
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

        // Send delivery email to buyer
        if (approvedOrder.download_token && approvedOrder.bundle) {
          await sendOrderDeliveryEmail(
            approvedOrder,
            approvedOrder.bundle,
            approvedOrder.download_token
          );
        }

        // Update message text on Telegram
        if (messageId) {
          await updateTelegramMessageAfterAction(
            messageId,
            orderCode,
            'acc',
            callbackQuery.from?.first_name || 'Owner'
          );
        }

        await answerCallbackQuery(callbackQueryId, `✅ Order ${orderCode} berhasil di-ACC!`);
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
