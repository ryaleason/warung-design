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
WARUNG DESAIN - AKSES FORMULA PROMPT AI RESMI
=============================================================
Order ID: ${order.order_code}
Paket Prompt: ${bundle?.name || 'Paket Prompt AI'}
Pembeli: ${order.buyer_name} (${order.buyer_email})
Status: Terverifikasi
Waktu Verifikasi: ${order.verified_at || new Date().toISOString()}

-------------------------------------------------------------
DAFTAR FORMULA PROMPT AI SIAP SALIN (COPUS)
-------------------------------------------------------------
1. Prompt Utama Feed Promosi (Rasio 1:1):
   "A professional modern promotional social media post for Indonesian SME, vibrant high contrast aesthetic, clean typography space, photorealistic studio lighting --ar 1:1 --v 6.0"

2. Prompt Variasi Story (Rasio 9:16):
   "Minimalist editorial instagram story background, warm pastel tones, subtle local pattern accents, premium luxury feel --ar 9:16 --v 6.0"

3. Prompt Visual Kuliner & Produk:
   "Delicious Indonesian culinary dish, close up shot, steam rising, shallow depth of field, appetizing warm lighting, food photography award winner --ar 1:1"

-------------------------------------------------------------
CONTOH HASIL VISUAL DARI FORMULA PROMPT INI:
-------------------------------------------------------------
${bundle?.preview_images?.join('\n')}

-------------------------------------------------------------
PANDUAN CEPAT MEMAKAI PROMPT UNTUK ADMIN & PEMILIK UMKM:
-------------------------------------------------------------
1. Buka ChatGPT (fitur generate gambar DALL-E 3) atau Midjourney di HP / Laptop.
2. Salin teks prompt di atas, lalu tempelkan ke kolom pesan AI.
3. Anda dapat mengganti nama menu / objek produk sesuai barang dagangan tokomu.
4. Tekan Kirim / Enter, dan poster visual promosi memukau akan langsung terbuat!
5. Simpan gambar, tambahkan logo tokomu jika perlu, dan siap posting ke Instagram / WhatsApp Story!

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
