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

/**
 * Kirim email pemberitahuan rilis paket/produk baru ke pelanggan
 */
export async function sendNewBundleBroadcastEmail(params: {
  recipientName: string;
  recipientEmail: string;
  bundle: Bundle;
  customNote?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { recipientName, recipientEmail, bundle, customNote } = params;
  const baseUrl = getBaseUrl();
  const bundleUrl = `${baseUrl}/bundles/${bundle.slug}`;
  const emailSubject = `[Koleksi Baru] ${bundle.name} - Warung Design`;
  const mainImage = bundle.preview_images?.[0] || '';

  const plainTextContent = `Halo, ${recipientName}!

Koleksi desain baru telah tersedia di Warung Design untuk materi promosi tokomu:

Paket: ${bundle.name}
Harga: Rp ${bundle.price.toLocaleString('id-ID')}
Kategori: ${bundle.category || 'Desain UMKM'}

Deskripsi:
${bundle.description}

Fitur Utama:
${bundle.features.map((f) => `- ${f}`).join('\n')}

${customNote ? `Catatan Admin:\n${customNote}\n\n` : ''}Lihat Detail & Preview Lengkap:
${bundleUrl}

Ada pertanyaan? Hubungi WhatsApp kami di: https://wa.me/6285182510575 (085182510575)

Terima kasih,
Warung Design
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${bundle.name} - Warung Design</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f5f4; margin: 0; padding: 24px; color: #111111;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 0, 0, 0.08); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);">
    <!-- Header -->
    <div style="background-color: #111111; padding: 22px 28px; text-align: left;">
      <span style="color: #ffffff; font-weight: 700; font-size: 17px; letter-spacing: -0.02em;">Warung Design</span>
      <span style="color: #ffb110; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-left: 10px; background: rgba(255,255,255,0.1); padding: 3px 8px; border-radius: 4px;">Koleksi Baru</span>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <h2 style="margin-top: 0; color: #111111; font-size: 20px; font-weight: 700;">Halo, ${recipientName}! 👋</h2>
      <p style="color: #615d59; font-size: 15px; line-height: 1.6; margin-bottom: 22px;">
        Koleksi template visual baru baru saja dirilis di Warung Design. Dirancang khusus untuk memikat calon pembeli di feed Instagram dan WhatsApp Story tokomu.
      </p>

      ${
        customNote
          ? `<div style="background-color: #fcf9f2; border-left: 3px solid #ffb110; padding: 12px 16px; margin-bottom: 22px; font-size: 14px; color: #544f49; line-height: 1.5;">
              ${customNote}
            </div>`
          : ''
      }

      <!-- Kartu Produk -->
      <div style="border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 10px; overflow: hidden; margin-bottom: 26px;">
        ${
          mainImage
            ? `<div style="background: #f6f5f4; text-align: center;">
                <img src="${mainImage}" alt="${bundle.name}" style="width: 100%; max-height: 300px; object-fit: cover; display: block;" />
              </div>`
            : ''
        }
        <div style="padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #0075de; letter-spacing: 0.05em;">
              ${bundle.category || 'Paket Template'} ${bundle.badge ? `• ${bundle.badge}` : ''}
            </span>
            <span style="font-size: 17px; font-weight: 700; color: #111111;">
              Rp ${bundle.price.toLocaleString('id-ID')}
            </span>
          </div>

          <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #111111; font-weight: 600;">
            ${bundle.name}
          </h3>

          <p style="margin: 0 0 16px 0; font-size: 14px; color: #615d59; line-height: 1.6;">
            ${bundle.description}
          </p>

          <div style="border-top: 1px solid rgba(0, 0, 0, 0.06); padding-top: 14px;">
            <p style="margin: 0 0 8px 0; font-size: 12.5px; font-weight: 600; color: #111111;">Yang kamu dapatkan:</p>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #615d59; line-height: 1.6;">
              ${bundle.features.slice(0, 4).map((f) => `<li>${f}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- Tombol CTA -->
      <div style="text-align: center; margin: 26px 0;">
        <a href="${bundleUrl}" style="background-color: #0075de; color: #ffffff; text-decoration: none; padding: 13px 30px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">
          Lihat Paket &amp; Pratinjau Desain
        </a>
      </div>

      <p style="text-align: center; margin: 0; font-size: 12.5px; color: #757575;">
        Atau buka tautan langsung: <a href="${bundleUrl}" style="color: #0075de;">${bundleUrl}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f6f5f4; border-top: 1px solid rgba(0, 0, 0, 0.08); padding: 18px 28px; text-align: center; font-size: 12px; color: #757575; line-height: 1.5;">
      <p style="margin: 0 0 6px 0;">
        Kamu menerima email ini karena pernah berbelanja di Warung Design (${recipientEmail}).
      </p>
      <p style="margin: 0;">
        Ada pertanyaan? Hubungi kami via WhatsApp di <a href="https://wa.me/6285182510575" style="color: #0075de; text-decoration: none; font-weight: 600;">085182510575</a>
      </p>
    </div>
  </div>
</body>
</html>
`.trim();

  // 1. Kirim via Gmail SMTP jika ada password
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
        to: recipientEmail,
        replyTo: GMAIL_USER,
        subject: emailSubject,
        text: plainTextContent,
        html: htmlContent,
      });

      return { success: true };
    } catch (gmailErr: unknown) {
      const err = gmailErr as Error;
      console.error(`Failed to send broadcast to ${recipientEmail} via Gmail SMTP:`, err);
    }
  }

  // 2. Fallback via Resend jika terkonfigurasi
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
          to: recipientEmail,
          reply_to: GMAIL_USER,
          subject: emailSubject,
          text: plainTextContent,
          html: htmlContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Resend error' };
      }
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  }

  // 3. Mode Simulasi di lokal
  console.log(`[BROADCAST SIMULATION] To: ${recipientName} <${recipientEmail}>, Bundle: ${bundle.name}`);
  return { success: true };
}

