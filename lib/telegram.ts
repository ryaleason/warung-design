import { Order, Bundle } from '@/types';

export function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  const ownerChatId = process.env.TELEGRAM_OWNER_CHAT_ID || '';
  const isConfigured = Boolean(
    token &&
    ownerChatId &&
    !token.includes('123456789') &&
    !ownerChatId.includes('987654321')
  );
  return { token, ownerChatId, isConfigured };
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Send order verification notification to owner's Telegram with inline ACC & Tolak buttons
 */
export async function sendOrderVerificationNotification(
  order: Order,
  bundle: Bundle
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { token, ownerChatId, isConfigured } = getTelegramConfig();

  if (!isConfigured) {
    console.log('[TELEGRAM MOCK] Bot token or owner chat ID not configured. Simulated notification:');
    console.log(`Order: ${order.order_code}, Sender: ${order.sender_name}, Total: ${formatRupiah(order.total_amount)}`);
    return { success: true, messageId: `mock_${Date.now()}` };
  }

  const messageText = 
`🔔 *Order Baru Menunggu Verifikasi*

📦 *Order:* \`${order.order_code}\`
🎨 *Bundle:* ${bundle.name}
👤 *Nama Pengirim:* ${order.sender_name || '-'}
📧 *Email Pembeli:* ${order.buyer_email}
💰 *Nominal Mutasi:* *${formatRupiah(order.total_amount)}*
*(Pastikan nominal transfer sama persis termasuk 3 digit kode unik)*

Silakan cek aplikasi GoPay Merchant lalu pilih keputusan di bawah:`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: '✅ ACC (Sesuai)',
          callback_data: `acc:${order.order_code}`,
        },
        {
          text: '❌ Tolak (Tidak Masuk)',
          callback_data: `tolak:${order.order_code}`,
        },
      ],
    ],
  };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ownerChatId,
        text: messageText,
        parse_mode: 'Markdown',
        reply_markup: inlineKeyboard,
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error('Telegram API error:', data);
      return { success: false, error: data.description };
    }

    return { success: true, messageId: String(data.result.message_id) };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Failed to send Telegram message:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Edit existing Telegram message after owner clicks ACC or Tolak
 */
export async function updateTelegramMessageAfterAction(
  messageId: string | number,
  orderCode: string,
  action: 'acc' | 'tolak',
  actorName: string = 'Owner'
): Promise<boolean> {
  const { token, ownerChatId, isConfigured } = getTelegramConfig();

  if (!isConfigured) {
    console.log(`[TELEGRAM MOCK] Updated message ${messageId} action ${action}`);
    return true;
  }

  const statusBadge = action === 'acc' ? '✅ SUDAH DI-ACC' : '❌ ORDER DITOLAK';
  const nowStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const text = 
`${statusBadge}
Order Code: \`${orderCode}\`
Diverifikasi oleh: ${actorName}
Waktu: ${nowStr} WIB`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ownerChatId,
        message_id: messageId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await res.json();
    return Boolean(data.ok);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Failed to update Telegram message:', error);
    return false;
  }
}

/**
 * Answer Telegram callback query (shows quick feedback banner in Telegram UI)
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text: string
): Promise<void> {
  const { token, isConfigured } = getTelegramConfig();
  if (!isConfigured) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text,
        show_alert: false,
      }),
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Failed to answer Telegram callback query:', error);
  }
}
