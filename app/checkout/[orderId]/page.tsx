import { getOrderById } from '@/lib/db';
import CheckoutFlow from '@/components/CheckoutFlow';
import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[12px] bg-[#ffffff] border border-black/[0.08] text-[#757575] mb-5">
          <FileQuestion className="h-7 w-7 text-[#0075de]" />
        </div>

        <span className="rounded-full bg-[#f6d5b8] px-3 py-1 text-[11px] font-semibold text-[#000000]">
          Pesanan Tidak Ditemukan
        </span>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#000000]">
          Data Pesanan Tidak Ditemukan
        </h1>

        <p className="mx-auto mt-2 max-w-md text-[14px] text-[#615d59] leading-relaxed">
          ID pesanan <code className="rounded bg-black/[0.05] px-1.5 py-0.5 text-[12px] font-mono">{orderId}</code> tidak ditemukan di database. Jika Anda baru saja me-restart server atau mencoba link lama, silakan buat pesanan baru langsung dari katalog.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#0075de] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#0060b8] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Katalog Paket
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#757575] hover:text-[#000000] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Batal &amp; Kembali ke Beranda
        </Link>
      </div>

      <CheckoutFlow initialOrder={order} />
    </div>
  );
}
