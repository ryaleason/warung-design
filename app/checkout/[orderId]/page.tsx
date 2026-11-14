import { getOrderById } from '@/lib/db';
import CheckoutFlow from '@/components/CheckoutFlow';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileQuestion } from 'lucide-react';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    return (
      <div className="relative min-h-[calc(100vh-140px)] flex flex-col justify-center py-16 px-4 sm:px-8 text-center">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-full max-w-3xl h-[380px] bg-[radial-gradient(ellipse_at_center,rgba(0,117,222,0.07),transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-black/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-[#757575] mb-5">
            <FileQuestion className="h-7 w-7 text-[#0075de]" />
          </div>

          <span className="rounded-full bg-stone-100 px-3 py-1 text-[11.5px] font-semibold text-[#54504c]">
            Pesanan Tidak Ditemukan
          </span>

          <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-[#111111]">
            Data Pesanan Tidak Ditemukan
          </h1>

          <p className="mt-2 text-[14px] text-[#54504c] leading-relaxed">
            ID pesanan <code className="rounded bg-black/[0.05] px-1.5 py-0.5 text-[12px] font-mono">{orderId}</code> tidak ditemukan di database. Silakan buat pesanan baru langsung dari katalog paket.
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#111111] hover:bg-[#000000] px-6 py-3 text-[14px] font-semibold text-white transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Katalog Paket</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-140px)] py-8 sm:py-12 px-4 sm:px-6">
      {/* Ambient Blue Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 w-full max-w-4xl h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(0,117,222,0.07),transparent_70%)] pointer-events-none" />

      {/* Top Header Bar */}
      <div className="mx-auto max-w-4xl mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#54504c] hover:text-[#111111] transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Batal &amp; Kembali ke Beranda</span>
        </Link>

        <Link href="/" className="inline-flex items-center gap-2">
          <Image src="/logo.svg" alt="Warung Design" width={24} height={24} className="h-6 w-auto" />
          <span className="font-semibold text-[15px] tracking-tight text-[#111111]">Warung Design</span>
        </Link>
      </div>

      <CheckoutFlow initialOrder={order} />
    </div>
  );
}
