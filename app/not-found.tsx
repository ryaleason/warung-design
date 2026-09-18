import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#ffffff] border border-black/[0.08] text-[#757575] mb-6">
        <FileQuestion className="h-8 w-8 text-[#0075de]" />
      </div>

      <span className="rounded-full bg-[#f6d5b8] px-3 py-1 text-[12px] font-semibold text-[#000000]">
        Error 404
      </span>

      <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#000000]">
        Halaman Tidak Ditemukan
      </h1>

      <p className="mx-auto mt-3 max-w-md text-[15px] text-[#615d59] leading-relaxed">
        Halaman atau pesanan yang Anda cari tidak ditemukan. Jika Anda baru saja membuat pesanan, pastikan server sedang berjalan atau buat pesanan baru dari katalog.
      </p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#0075de] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#0060b8] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Katalog Paket
        </Link>
      </div>
    </div>
  );
}
