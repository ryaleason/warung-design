import { NextResponse } from 'next/server';
import { getBundles } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';
    const category = searchParams.get('category') || '';

    const bundles = await getBundles();

    let filtered = bundles;

    if (category && category !== 'Semua') {
      filtered = filtered.filter((b) => b.category === category);
    }

    if (query) {
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          (b.category || '').toLowerCase().includes(query) ||
          b.features.some((f) => f.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({ bundles: filtered });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memuat katalog paket' },
      { status: 500 }
    );
  }
}
