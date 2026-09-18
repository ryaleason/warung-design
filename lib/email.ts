import { Order, Bundle } from '@/types';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Warung Desain <delivery@warungdesain.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function sendOrderDeliveryEmail(
  order: Order,
  bundle: Bundle,
  downloadToken: string
): Promise<{ success: boolean; error?: string }> {
  const downloadUrl = `${APP_URL}/api/download/${downloadToken}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Akses Desain Bundle Kamu - Warung Desain</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0284c7; padding: 24px 32px; color: #ffffff; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Warung Desain</h1>
      <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Konten Desain & Prompt AI Siap Pakai untuk UMKM</p>
    </div>

    <div style="padding: 32px;">
      <h2 style="margin-top: 0; color: #0f172a; font-size: 20px;">Halo, ${order.buyer_name}! 👋</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Pembayaran kamu untuk pesanan <strong>${order.order_code}</strong> telah berhasil diverifikasi oleh tim kami. File bundle desain kamu sudah siap diunduh!
      </p>

      <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Detail Pesanan:</p>
        <p style="margin: 0 0 6px; font-size: 16px; font-weight: 600; color: #0f172a;">${bundle.name}</p>
        <p style="margin: 0; font-size: 14px; color: #475569;">Total: Rp ${order.total_amount.toLocaleString('id-ID')}</p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${downloadUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
          📥 Download File Bundle (.ZIP)
        </a>
        <p style="margin-top: 12px; font-size: 13px; color: #94a3b8;">
          Link download berlaku selama 48 jam. Simpan file di perangkat Anda.
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 14px; color: #475569;">
        <p style="margin: 0 0 8px; font-weight: 600;">Isi di dalam paket ZIP:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
          <li>Folder gambar desain format PNG transparan & JPG resolusi tinggi.</li>
          <li>File teks (.txt) berisi panduan & template prompt AI (Midjourney & DALL-E).</li>
          <li>Panduan ringkas cara edit logo / teks pakai Canva di HP/laptop.</li>
        </ul>
      </div>
    </div>

    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 13px; color: #94a3b8;">
      Butuh bantuan? Balas email ini atau hubungi kami di media sosial Warung Desain.
    </div>
  </div>
</body>
</html>
`;

  if (!RESEND_API_KEY || RESEND_API_KEY.includes('re_your_api_key')) {
    console.log(`[EMAIL MOCK] Download email prepared for ${order.buyer_email}`);
    console.log(`[EMAIL MOCK] Download URL: ${downloadUrl}`);
    return { success: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: order.buyer_email,
        subject: `[Akses Desain] ${bundle.name} - Warung Desain`,
        html: htmlContent,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Resend error:', data);
      return { success: false, error: data.message || 'Resend error' };
    }

    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Failed to send delivery email:', error);
    return { success: false, error: error.message };
  }
}
