'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, HelpCircle, MessageCircle } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.08] bg-[#f6f5f4]/90 backdrop-blur-md notion-nav-shadow">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8">
        {/* Left Side: Burger Menu + Logo + Brand Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger Menu Button (mobile only, placed left of logo) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-[8px] text-[#111111] hover:bg-black/[0.05] transition-colors focus:outline-none"
            aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-[#111111]" />
            ) : (
              <Menu className="h-5 w-5 text-[#111111]" />
            )}
          </button>

          {/* Logo and Brand Link */}
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
            <span className="hidden sm:inline-block text-[17px] font-semibold tracking-[-0.015em] text-[#111111]">
              Warung Design
            </span>
          </Link>
        </div>

        {/* Right Side: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
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

        {/* Right Side: Mobile Fast CTA Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/#katalog"
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#0075de] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#0060b8] transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Pilih Paket</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.08] bg-[#f6f5f4]/98 backdrop-blur-md px-4 py-4 space-y-1 shadow-lg transition-all animate-in fade-in duration-200">
          <Link
            href="/#katalog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-[8px] px-3.5 py-2.5 text-[15px] font-medium text-[#111111] hover:bg-black/[0.05] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-4 w-4 text-[#0075de]" />
              <span>Katalog Paket</span>
            </div>
            <span className="text-[12px] text-[#757575]">Pilihan Bundle</span>
          </Link>
          <Link
            href="/#cara-pakai"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-[8px] px-3.5 py-2.5 text-[15px] font-medium text-[#111111] hover:bg-black/[0.05] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-4 w-4 text-[#0075de]" />
              <span>Cara Pakai</span>
            </div>
            <span className="text-[12px] text-[#757575]">Tutorial</span>
          </Link>
          <Link
            href="/#faq"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-[8px] px-3.5 py-2.5 text-[15px] font-medium text-[#111111] hover:bg-black/[0.05] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="h-4 w-4 text-[#0075de]" />
              <span>Tanya Jawab (FAQ)</span>
            </div>
            <span className="text-[12px] text-[#757575]">Bantuan</span>
          </Link>

          <div className="pt-3 mt-2 border-t border-black/[0.06]">
            <a
              href="https://wa.me/6285182510575?text=Halo%20Admin%20Warung%20Design%2C%20saya%20butuh%20bantuan"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-[8px] bg-emerald-600 px-4 py-2.5 text-[14px] font-medium text-white hover:bg-emerald-700 transition-colors w-full"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Hubungi WA (085182510575)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
