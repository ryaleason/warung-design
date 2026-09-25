import { NextResponse } from 'next/server';
import { getBundleById } from '@/lib/db';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { sendNewBundleBroadcastEmail } from '@/lib/email';
import fs from 'fs';
import path from 'path';
import { Order } from '@/types';

export const dynamic = 'force-dynamic';

function isProductionBlocked(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.ENABLE_ADMIN_PAGE !== 'true';
}

interface UniqueRecipient {
  name: string;
  email: string;
  isSuccessful: boolean;
  orderCount: number;
}

async function getUniqueRecipients(): Promise<UniqueRecipient[]> {
  const map = new Map<string, UniqueRecipient>();

  // 1. Coba dari Supabase
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('buyer_name, buyer_email, status')
        .order('created_at', { ascending: false });

      if (!error && data) {
        for (const row of data) {
          const email = (row.buyer_email || '').trim().toLowerCase();
          if (!email || !email.includes('@')) continue;

          const existing = map.get(email);
          const isSuccess = row.status === 'sukses';

          if (!existing) {
            map.set(email, {
              name: (row.buyer_name || 'Pelanggan').trim(),
              email,
              isSuccessful: isSuccess,
              orderCount: 1,
            });
          } else {
            existing.orderCount += 1;
            if (isSuccess) {
              existing.isSuccessful = true;
            }
          }
        }
      }
    } catch (e) {
      console.error('Error fetching recipients from Supabase:', e);
    }
  }

  // 2. Tambahkan data dari disk lokal jika ada (khusus dev)
  try {
    const ordersFilePath = path.join(process.cwd(), '.data/orders.json');
    if (fs.existsSync(ordersFilePath)) {
      const raw = fs.readFileSync(ordersFilePath, 'utf-8');
      const obj = JSON.parse(raw || '{}');
      for (const order of Object.values(obj) as Order[]) {
        const email = (order.buyer_email || '').trim().toLowerCase();
        if (!email || !email.includes('@')) continue;

        const isSuccess = order.status === 'sukses';
        const existing = map.get(email);

        if (!existing) {
          map.set(email, {
            name: (order.buyer_name || 'Pelanggan').trim(),
            email,
            isSuccessful: isSuccess,
            orderCount: 1,
          });
        } else {
          existing.orderCount += 1;
          if (isSuccess) {
            existing.isSuccessful = true;
          }
        }
      }
    }
  } catch (e) {
    console.error('Error reading local orders for recipients:', e);
  }

  return Array.from(map.values());
}

/**
 * GET: Ambil ringkasan penerima email broadcast
 */
export async function GET() {
  if (isProductionBlocked()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const recipients = await getUniqueRecipients();
    const successfulOnly = recipients.filter((r) => r.isSuccessful);

    return NextResponse.json({
      success: true,
      totalUnique: recipients.length,
      successfulCount: successfulOnly.length,
      sampleRecipients: recipients.slice(0, 10),
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST: Eksekusi pengiriman email broadcast ke pelanggan
 */
export async function POST(req: Request) {
  if (isProductionBlocked()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const {
      bundleId,
      filter = 'sukses_only', // 'sukses_only' | 'all'
      customNote = '',
      testEmail = '',
    } = body as {
      bundleId: string;
      filter?: 'sukses_only' | 'all';
      customNote?: string;
      testEmail?: string;
    };

    if (!bundleId) {
      return NextResponse.json(
        { success: false, error: 'Pilih bundle yang ingin di-broadcast.' },
        { status: 400 }
      );
    }

    const bundle = await getBundleById(bundleId);
    if (!bundle) {
      return NextResponse.json(
        { success: false, error: 'Bundle tidak ditemukan.' },
        { status: 404 }
      );
    }

    // A. Pengiriman Email Uji Coba (Test Mode)
    if (testEmail) {
      const cleanTestEmail = testEmail.trim().toLowerCase();
      if (!cleanTestEmail.includes('@')) {
        return NextResponse.json(
          { success: false, error: 'Format email tes tidak valid.' },
          { status: 400 }
        );
      }

      const result = await sendNewBundleBroadcastEmail({
        recipientName: 'Pemilik Toko (Test)',
        recipientEmail: cleanTestEmail,
        bundle,
        customNote: customNote ? `[EMAIL TESTING] ${customNote}` : '[EMAIL TESTING - Tampilan Pratinjau]',
      });

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error || 'Gagal mengirim email tes.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        isTest: true,
        sentCount: 1,
        message: `Email tes berhasil dikirim ke ${cleanTestEmail}! Periksa kotak masuk atau spam email Anda.`,
      });
    }

    // B. Pengiriman Broadcast ke Semua Pelanggan
    const allRecipients = await getUniqueRecipients();
    const targetRecipients =
      filter === 'all'
        ? allRecipients
        : allRecipients.filter((r) => r.isSuccessful);

    if (targetRecipients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Belum ada data pelanggan yang sesuai dengan filter ini.',
        },
        { status: 400 }
      );
    }

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const recipient of targetRecipients) {
      try {
        const sendRes = await sendNewBundleBroadcastEmail({
          recipientName: recipient.name,
          recipientEmail: recipient.email,
          bundle,
          customNote,
        });

        if (sendRes.success) {
          sentCount++;
        } else {
          failedCount++;
          if (sendRes.error) errors.push(`${recipient.email}: ${sendRes.error}`);
        }
      } catch (err: unknown) {
        failedCount++;
        const e = err as Error;
        errors.push(`${recipient.email}: ${e.message}`);
      }

      // Jeda 120ms antar email untuk menghindari rate limit SMTP Gmail
      await new Promise((resolve) => setTimeout(resolve, 120));
    }

    return NextResponse.json({
      success: true,
      isTest: false,
      sentCount,
      failedCount,
      totalTarget: targetRecipients.length,
      errors: errors.slice(0, 5),
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in POST /api/admin/broadcast:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan sistem' },
      { status: 500 }
    );
  }
}
