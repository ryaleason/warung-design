import { Order, Bundle } from '@/types';

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function getTelegramConfig() {
  const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim().replace(/^['"]|['"]$/g, '');
  const ownerChatId = (process.env.TELEGRAM_OWNER_CHAT_ID || '').trim().replace(/^['"]|['"]$/g, '');
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
    console.warn('[TELEGRAM MOCK] Bot token or owner chat ID not configured. Simulated notification:');
    console.log(`Order: ${order.order_code}, Sender: ${order.sender_name}, Total: ${formatRupiah(order.total_amount)}`);
    return { 
      success: false, 
      messageId: `mock_${Date.now()}`,
      error: 'TELEGRAM_BOT_TOKEN atau TELEGRAM_OWNER_CHAT_ID belum aktif di serverless environment' 
    };
  }

  const messageText = 
`🔔 <b>Order Baru Menunggu Verifikasi</b>

📦 <b>Order:</b> <code>${escapeHtml(order.order_code)}</code>
🎨 <b>Bundle:</b> ${escapeHtml(bundle.name)}
👤 <b>Nama Pengirim:</b> ${escapeHtml(order.sender_name || '-')}
📧 <b>Email Pembeli:</b> ${escapeHtml(order.buyer_email)}
💰 <b>Nominal Mutasi:</b> <b>${formatRupiah(order.total_amount)}</b>
<i>(Pastikan nominal transfer sama persis termasuk 3 digit kode unik)</i>

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
        parse_mode: 'HTML',
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

  const statusBadge = action === 'acc' ? '✅ <b>SUDAH DI-ACC</b>' : '❌ <b>ORDER DITOLAK</b>';
  const nowStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const text = 
`${statusBadge}
Order Code: <code>${escapeHtml(orderCode)}</code>
Diverifikasi oleh: ${escapeHtml(actorName)}
Waktu: ${nowStr} WIB`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ownerChatId,
        message_id: messageId,
        text: text,
        parse_mode: 'HTML',
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
