import nodemailer from 'nodemailer';
import { Order, Bundle } from '@/types';

const GMAIL_USER = process.env.GMAIL_USER || 'rylaeasoncore@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || `Warung Design <${GMAIL_USER}>`;

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost') && !process.env.NEXT_PUBLIC_APP_URL.includes('.vercel.app')) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.warungdesign.web.id';
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
  const emailSubject = `Pesanan #${order.order_code}: Akses File Desain Anda - Warung Design`;

  const plainTextContent = `Halo, ${order.buyer_name}!

Pembayaran kamu untuk pesanan ${order.order_code} telah berhasil diverifikasi oleh tim Warung Design. File bundle desain kamu sudah siap diunduh!

Detail Pesanan:
- Produk: ${bundle.name}
- Total: Rp ${order.total_amount.toLocaleString('id-ID')}

Tautan Unduh File Desain:
${downloadUrl}

Halaman Status Pesanan:
${orderUrl}

Catatan:
- Tautan aktif selama 48 jam. Silakan simpan file di HP atau komputer Anda.
- Isi paket mencakup: folder gambar format PNG & JPG resolusi tinggi, template prompt AI, dan panduan edit Canva.

Ada kendala? Hubungi admin via WhatsApp di:
https://wa.me/6285182510575 (085182510575)

Terima kasih,
Warung Design
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Akses Desain - Warung Design</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f5f4; margin: 0; padding: 24px; color: #111111;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 0, 0, 0.08); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0075de; padding: 24px 32px; color: #ffffff; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Warung Design</h1>
      <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.95;">Konten Desain &amp; Prompt AI Siap Pakai untuk UMKM</p>
    </div>

    <div style="padding: 32px;">
      <h2 style="margin-top: 0; color: #111111; font-size: 20px;">Halo, ${order.buyer_name}!</h2>
      <p style="color: #615d59; font-size: 15px; line-height: 1.6;">
        Pembayaran kamu untuk pesanan <strong>${order.order_code}</strong> telah berhasil diverifikasi. File paket desain kamu sudah siap diunduh.
      </p>

      <div style="background-color: #f6f5f4; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid rgba(0, 0, 0, 0.06);">
        <p style="margin: 0 0 8px; font-size: 12px; color: #757575; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Detail Pesanan:</p>
        <p style="margin: 0 0 6px; font-size: 17px; font-weight: 700; color: #111111;">${bundle.name}</p>
        <p style="margin: 0; font-size: 14px; color: #615d59;">Total Pembayaran: <strong>Rp ${order.total_amount.toLocaleString('id-ID')}</strong></p>
      </div>

      <!-- Tombol Download Langsung -->
      <div style="text-align: center; margin: 28px 0 16px 0;">
        <a href="${downloadUrl}" style="background-color: #0075de; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
          Buka &amp; Unduh File Desain
        </a>
      </div>

      <!-- Link Halaman Order -->
      <div style="text-align: center; margin-bottom: 28px;">
        <p style="margin: 0; font-size: 13px; color: #757575;">
          Atau buka melalui halaman status pesanan:
        </p>
        <p style="margin: 6px 0 0 0;">
          <a href="${orderUrl}" style="color: #0075de; font-size: 14px; font-weight: 600; text-decoration: underline;">
            Lihat Pesanan ${order.order_code}
          </a>
        </p>
        <p style="margin-top: 12px; font-size: 12px; color: #757575;">
          * Tautan unduh aktif selama 48 jam. Simpan file di HP atau komputer Anda.
        </p>
      </div>

      <div style="border-top: 1px solid rgba(0, 0, 0, 0.08); padding-top: 20px; font-size: 14px; color: #615d59;">
        <p style="margin: 0 0 8px; font-weight: 600; color: #111111;">Isi di dalam paket desain:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
          <li>Folder gambar desain format PNG transparan &amp; JPG resolusi tinggi.</li>
          <li>Panduan ringkas &amp; template prompt AI siap pakai.</li>
          <li>Panduan cara kustomisasi desain menggunakan Canva.</li>
        </ul>
      </div>
    </div>

    <div style="background-color: #f6f5f4; border-top: 1px solid rgba(0, 0, 0, 0.08); padding: 20px 32px; text-align: center; font-size: 13px; color: #757575;">
      <p style="margin: 0 0 6px 0;">
        Ada kendala? Hubungi admin via WhatsApp di <a href="https://wa.me/6285182510575" style="color: #0075de; font-weight: 600; text-decoration: none;">085182510575</a>
      </p>
      <p style="margin: 8px 0 0 0; font-size: 11px; color: #999999;">
        Email ini dikirim otomatis sebagai konfirmasi transaksi resmi dari Warung Design (${order.order_code}).
      </p>
    </div>
  </div>
</body>
</html>
`;

  // 1. Kirim via Gmail SMTP jika kredensial Gmail terisi
  if (GMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD.replace(/\s+/g, ''),
        },
      });

      await transporter.sendMail({
        from: `"Warung Design" <${GMAIL_USER}>`,
        to: order.buyer_email,
        replyTo: GMAIL_USER,
        subject: emailSubject,
        text: plainTextContent,
        html: htmlContent,
        headers: {
          'X-Entity-Ref-ID': order.order_code,
        },
      });

      console.log(`[EMAIL GMAIL] Delivery email successfully sent to ${order.buyer_email} via ${GMAIL_USER}`);
      return { success: true };
    } catch (gmailErr: unknown) {
      const err = gmailErr as Error;
      console.error('Failed to send email via Gmail SMTP:', err);
      // Fallback ke provider berikutnya jika ada
    }
  }

  // 2. Fallback ke Resend jika RESEND_API_KEY terisi
  if (RESEND_API_KEY && !RESEND_API_KEY.includes('re_your_api_key')) {
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
          reply_to: GMAIL_USER,
          subject: emailSubject,
          text: plainTextContent,
          html: htmlContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('Resend error:', data);
        return { success: false, error: data.message || 'Resend error' };
      }

      console.log(`[EMAIL RESEND] Delivery email sent to ${order.buyer_email}`);
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Failed to send delivery email via Resend:', error);
      return { success: false, error: error.message };
    }
  }

  // 3. Mode Simulasi / Mock
  console.log(`[EMAIL MOCK] Download email prepared for ${order.buyer_email}`);
  console.log(`[EMAIL MOCK] Download URL: ${downloadUrl}`);
  console.log(`[EMAIL MOCK] Order URL: ${orderUrl}`);
  return { success: true };
}
