import { Order, Bundle } from '@/types';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Warung Design <onboarding@resend.dev>';

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export async function sendOrderDeliveryEmail(
  order: Order,
  bundle: Bundle,
  downloadToken: string
): Promise<{ success: boolean; error?: string }> {
  const baseUrl = getBaseUrl();
  const downloadUrl = `${baseUrl}/api/download/${downloadToken}`;
  const orderUrl = `${baseUrl}/checkout/${order.id}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Akses Desain Bundle Kamu - Warung Design</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f5f4; margin: 0; padding: 24px; color: #111111;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 0, 0, 0.08); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0075de; padding: 24px 32px; color: #ffffff; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Warung Design</h1>
      <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.95;">Konten Desain &amp; Prompt AI Siap Pakai untuk UMKM</p>
    </div>

    <div style="padding: 32px;">
      <h2 style="margin-top: 0; color: #111111; font-size: 20px;">Halo, ${order.buyer_name}! 👋</h2>
      <p style="color: #615d59; font-size: 15px; line-height: 1.6;">
        Pembayaran kamu untuk pesanan <strong>${order.order_code}</strong> telah berhasil diverifikasi oleh tim kami. File bundle desain kamu sudah siap diunduh!
      </p>

      <div style="background-color: #f6f5f4; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid rgba(0, 0, 0, 0.06);">
        <p style="margin: 0 0 8px; font-size: 12px; color: #757575; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Detail Pesanan:</p>
        <p style="margin: 0 0 6px; font-size: 17px; font-weight: 700; color: #111111;">${bundle.name}</p>
        <p style="margin: 0; font-size: 14px; color: #615d59;">Total Pembayaran: <strong>Rp ${order.total_amount.toLocaleString('id-ID')}</strong></p>
      </div>

      <!-- Tombol Download Langsung -->
      <div style="text-align: center; margin: 28px 0 16px 0;">
        <a href="${downloadUrl}" style="background-color: #0075de; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
          📥 Download File Bundle (.ZIP)
        </a>
      </div>

      <!-- Link Halaman Order -->
      <div style="text-align: center; margin-bottom: 28px;">
        <p style="margin: 0; font-size: 13px; color: #757575;">
          Atau buka halaman pesanan Anda:
        </p>
        <p style="margin: 4px 0 0 0;">
          <a href="${orderUrl}" style="color: #0075de; font-size: 14px; font-weight: 600; text-decoration: underline;">
            👉 Buka Halaman Pesanan ${order.order_code}
          </a>
        </p>
        <p style="margin-top: 12px; font-size: 12px; color: #757575;">
          * Link download aktif selama 48 jam. Simpan file di HP atau komputer Anda.
        </p>
      </div>

      <div style="border-top: 1px solid rgba(0, 0, 0, 0.08); padding-top: 20px; font-size: 14px; color: #615d59;">
        <p style="margin: 0 0 8px; font-weight: 600; color: #111111;">Isi di dalam paket ZIP:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
          <li>Folder gambar desain format PNG transparan &amp; JPG resolusi tinggi.</li>
          <li>File teks (.txt) berisi panduan &amp; template prompt AI (Midjourney &amp; DALL-E).</li>
          <li>Panduan ringkas cara edit logo / teks pakai Canva di HP/laptop.</li>
        </ul>
      </div>
    </div>

    <div style="background-color: #f6f5f4; border-top: 1px solid rgba(0, 0, 0, 0.08); padding: 20px 32px; text-align: center; font-size: 13px; color: #757575;">
      Ada kendala? Hubungi admin via WhatsApp di <a href="https://wa.me/6285182510575" style="color: #0075de; font-weight: 600; text-decoration: none;">085182510575</a>
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
