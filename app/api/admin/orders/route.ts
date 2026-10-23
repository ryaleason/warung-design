import { NextRequest, NextResponse } from 'next/server';
import {
  getAllOrders,
  checkDatabaseHealth,
  getOrderById,
  approveOrder,
  rejectOrder,
} from '@/lib/db';
import { sendOrderDeliveryEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

function isProductionBlocked(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.ENABLE_ADMIN_PAGE !== 'true';
}

export interface BuyerSummary {
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  successfulOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  bundleNames: string[];
}

export async function GET() {
  if (isProductionBlocked()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const [orders, dbHealth] = await Promise.all([
      getAllOrders(),
      checkDatabaseHealth(),
    ]);

    // Calculate summary statistics
    let totalRevenue = 0;
    const statusCounts: Record<string, number> = {
      sukses: 0,
      pending: 0,
      menunggu_verifikasi: 0,
      ditolak: 0,
      kedaluwarsa: 0,
    };

    const bundleStatsMap = new Map<
      string,
      { bundleId: string; bundleName: string; totalOrders: number; successfulOrders: number; totalRevenue: number }
    >();

    const buyersMap = new Map<string, BuyerSummary>();

    for (const order of orders) {
      const status = order.status || 'pending';
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      const isSuccess = status === 'sukses';
      if (isSuccess) {
        totalRevenue += order.total_amount || 0;
      }

      // Bundle statistics
      const bundleId = order.bundle_id;
      const bundleName = order.bundle?.name || 'Paket Tidak Diketahui';
      if (!bundleStatsMap.has(bundleId)) {
        bundleStatsMap.set(bundleId, {
          bundleId,
          bundleName,
          totalOrders: 0,
          successfulOrders: 0,
          totalRevenue: 0,
        });
      }
      const bStat = bundleStatsMap.get(bundleId)!;
      bStat.totalOrders += 1;
      if (isSuccess) {
        bStat.successfulOrders += 1;
        bStat.totalRevenue += order.total_amount || 0;
      }

      // Buyer recap
      const email = (order.buyer_email || '').trim().toLowerCase();
      if (email) {
        if (!buyersMap.has(email)) {
          buyersMap.set(email, {
            name: (order.buyer_name || 'Tanpa Nama').trim(),
            email,
            phone: order.buyer_phone || null,
            totalOrders: 0,
            successfulOrders: 0,
            totalSpent: 0,
            lastOrderDate: order.created_at,
            bundleNames: [],
          });
        }
        const buyer = buyersMap.get(email)!;
        buyer.totalOrders += 1;
        if (order.buyer_phone && !buyer.phone) {
          buyer.phone = order.buyer_phone;
        }
        if (isSuccess) {
          buyer.successfulOrders += 1;
          buyer.totalSpent += order.total_amount || 0;
        }
        if (bundleName && !buyer.bundleNames.includes(bundleName)) {
          buyer.bundleNames.push(bundleName);
        }
        if (new Date(order.created_at).getTime() > new Date(buyer.lastOrderDate).getTime()) {
          buyer.lastOrderDate = order.created_at;
          buyer.name = order.buyer_name;
        }
      }
    }

    const buyers = Array.from(buyersMap.values()).sort(
      (a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
    );

    const bundleStats = Array.from(bundleStatsMap.values()).sort(
      (a, b) => b.successfulOrders - a.successfulOrders || b.totalOrders - a.totalOrders
    );

    return NextResponse.json({
      success: true,
      data: {
        orders,
        buyers,
        summary: {
          totalRevenue,
          totalOrders: orders.length,
          uniqueBuyersCount: buyers.length,
          statusCounts,
          bundleStats,
        },
        dbHealth,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memuat rekap pesanan';
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (isProductionBlocked()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { orderId, action } = body as { orderId: string; action: 'acc' | 'tolak' };

    if (!orderId || !action) {
      return NextResponse.json(
        { success: false, error: 'orderId dan action wajib disertakan' },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (action === 'acc') {
      const updated = await approveOrder(order.id);
      if (updated && updated.download_token && updated.bundle) {
        // Kirim email pengiriman produk secara otomatis
        try {
          await sendOrderDeliveryEmail(updated, updated.bundle, updated.download_token);
        } catch (emailErr) {
          console.error('Error sending delivery email after admin approval:', emailErr);
        }
      }
      return NextResponse.json({ success: true, order: updated, message: 'Pesanan berhasil disetujui (ACC)' });
    }

    if (action === 'tolak') {
      const updated = await rejectOrder(order.id);
      return NextResponse.json({ success: true, order: updated, message: 'Pesanan ditolak' });
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak valid' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memproses aksi pesanan';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
