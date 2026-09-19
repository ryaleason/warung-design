import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.08] bg-[#f6f5f4]/90 backdrop-blur-md notion-nav-shadow">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.svg"
            alt="Warung Design"
            width={36}
            height={31}
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            priority
            unoptimized
          />
          <span className="text-[17px] font-semibold tracking-[-0.015em] text-[#111111]">
            Warung Design
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#katalog"
            className="rounded-[8px] px-3 py-1.5 text-[14px] font-medium text-[#757575] hover:text-[#000000] hover:bg-black/[0.04] transition-colors"
          >
            Katalog Paket
          </Link>
          <Link
            href="/#cara-pakai"
            className="rounded-[8px] px-3 py-1.5 text-[14px] font-medium text-[#757575] hover:text-[#000000] hover:bg-black/[0.04] transition-colors"
          >
            Cara Pakai
          </Link>
          <Link
            href="/#faq"
            className="rounded-[8px] px-3 py-1.5 text-[14px] font-medium text-[#757575] hover:text-[#000000] hover:bg-black/[0.04] transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/#katalog"
            className="ml-2 inline-flex items-center gap-1.5 rounded-[8px] bg-[#0075de] px-3.5 py-1.5 text-[14px] font-medium text-white hover:bg-[#0060b8] transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Pilih Paket</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
