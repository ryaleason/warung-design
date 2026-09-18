import { NextRequest, NextResponse } from 'next/server';
import { expireOldOrders } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Check authorization header if secret is configured
    if (cronSecret) {
      const token = authHeader?.replace('Bearer ', '');
      if (token !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
      }
    }

    const expiredCount = await expireOldOrders();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      expired_orders_count: expiredCount,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error running expire orders cron:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
