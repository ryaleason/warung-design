import { NextRequest, NextResponse } from 'next/server';
import { getOrderByDownloadToken } from '@/lib/db';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    const order = await getOrderByDownloadToken(token);
    if (!order) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="id">
        <head><title>Link Download Tidak Valid</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
        <body style="font-family: sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; background:#f8fafc; color:#1e293b; text-align:center; padding:20px;">
          <div style="background:#fff; border-radius:12px; padding:32px; max-width:480px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            <h1 style="color:#ef4444; font-size:20px; margin-top:0;">⚠️ Link Tidak Ditemukan</h1>
            <p>Token download tidak valid atau pesanan belum disetujui.</p>
            <a href="/" style="display:inline-block; margin-top:16px; background:#0284c7; color:#fff; padding:10px 20px; border-radius:6px; text-decoration:none;">Kembali ke Beranda</a>
          </div>
        </body>
        </html>`,
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // Check expiration
    if (order.download_expires_at) {
      const expiresAt = new Date(order.download_expires_at).getTime();
      if (Date.now() > expiresAt) {
        return new NextResponse(
          `<!DOCTYPE html>
          <html lang="id">
          <head><title>Link Download Kedaluwarsa</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
          <body style="font-family: sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; background:#f8fafc; color:#1e293b; text-align:center; padding:20px;">
            <div style="background:#fff; border-radius:12px; padding:32px; max-width:480px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
              <h1 style="color:#f59e0b; font-size:20px; margin-top:0;">⏳ Masa Berlaku Link Habis</h1>
              <p>Masa berlaku link unduh (48 jam) untuk pesanan <strong>${order.order_code}</strong> telah kedaluwarsa.</p>
              <p style="font-size:14px; color:#64748b;">Silakan hubungi admin Warung Desain jika Anda belum sempat mengunduh file.</p>
              <a href="/" style="display:inline-block; margin-top:16px; background:#0284c7; color:#fff; padding:10px 20px; border-radius:6px; text-decoration:none;">Kembali ke Beranda</a>
            </div>
          </body>
          </html>`,
          { status: 410, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      }
    }

    const bundle = order.bundle;
    const filePath = bundle?.file_url || 'bundles/sample-bundle.zip';

    // If Supabase Storage is configured, generate signed URL
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: signedData, error: signError } = await supabase.storage
        .from('bundle-files')
        .createSignedUrl(filePath, 60 * 60); // 1 hour signed URL

      if (!signError && signedData?.signedUrl) {
        return NextResponse.redirect(signedData.signedUrl);
      }
    }

    // Fallback: Deliver a bundled text/manifest file as attachment if storage file is not uploaded yet
    const bundleNameClean = (bundle?.name || 'warung-desain-bundle')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    const downloadFileName = `${bundleNameClean}-${order.order_code}.txt`;
    const downloadContent = 
`=============================================================
WARUNG DESAIN - BUNDLE AKSES RESMI
=============================================================
Order ID: ${order.order_code}
Bundle: ${bundle?.name || 'Paket Desain'}
Pembeli: ${order.buyer_name} (${order.buyer_email})
Status: Terverifikasi
Waktu Verifikasi: ${order.verified_at || new Date().toISOString()}

-------------------------------------------------------------
DAFTAR ASSET DESAIN & LINK AKSES CLOUD
-------------------------------------------------------------
1. Folder Koleksi Desain Resolusi Tinggi (PNG & JPG):
   ${bundle?.preview_images?.join('\n   ')}

2. BONUS PROMPT AI GENERATIF (Midjourney & DALL-E v3):
   - Prompt Utama:
     "A professional modern promotional social media post for Indonesian SME, vibrant high contrast aesthetic, clean typography space, photorealistic studio lighting --ar 1:1 --v 6.0"
   - Prompt Variasi Story (9:16):
     "Minimalist editorial instagram story background, warm pastel tones, subtle Islamic pattern accents, premium luxury feel --ar 9:16 --v 6.0"
   - Prompt Food/F&B:
     "Delicious Indonesian culinary dish, close up shot, steam rising, shallow depth of field, appetizing warm lighting, food photography award winner --ar 1:1"

-------------------------------------------------------------
PANDUAN PENGGUNAAN CEPAT UNTUK ADMIN UMKM:
-------------------------------------------------------------
1. Buka aplikasi Canva (bisa lewat HP atau Laptop).
2. Buat kanvas ukuran 1080x1080 pixel (Feed) atau 1080x1920 pixel (Story).
3. Upload gambar desain dari folder ini ke Canva.
4. Tambahkan logo toko Anda dan teks promosi (diskon, harga, nomor WA).
5. Download hasil jadi dan langsung posting ke Instagram / WhatsApp Story!

Terima kasih telah mempercayai Warung Desain untuk mendukung promosi bisnis Anda!
=============================================================`;

    return new NextResponse(downloadContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${downloadFileName}"`,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Download error:', error);
    return new NextResponse('Terjadi kesalahan saat memproses download', { status: 500 });
  }
}
