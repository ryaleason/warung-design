'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, HelpCircle, MessageCircle, ShoppingBag, User, LogOut, History, ChevronDown, Bot } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, openAuthModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Jangan render navbar publik di halaman admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-black/[0.08] bg-[#ffffff]/90 backdrop-blur-md notion-nav-shadow">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8">
          {/* Left Side: Burger Menu + Logo + Brand + Left Nav Links (Framer Style) */}
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Hamburger Menu Button (mobile only, min 44px tap target) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-[8px] text-[#111111] hover:bg-black/[0.05] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2"
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
              <Link
                href="/"
                className="flex items-center gap-2.5 group rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
              >
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
            </div>

            {/* Desktop Navigation Links aligned to left right next to Logo (Framer Style) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
              <Link
                href="/#ai-generator"
                className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-[#54504c] hover:text-[#111111] hover:bg-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
              >
                AI Studio
              </Link>
              <Link
                href="/#katalog"
                className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-[#54504c] hover:text-[#111111] hover:bg-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
              >
                Katalog Paket
              </Link>
              <Link
                href="/#cara-pakai"
                className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-[#54504c] hover:text-[#111111] hover:bg-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
              >
                Cara Pakai
              </Link>
              <Link
                href="/#faq"
                className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-[#54504c] hover:text-[#111111] hover:bg-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Right Side: Framer Style Dual Buttons (Masuk + Daftar) or User Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-black/[0.1] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#111111] hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-[#e6f3fe] text-[#0075de] flex items-center justify-center font-bold text-[11px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[110px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-black/[0.08] bg-white p-1.5 shadow-lg z-50 animate-in fade-in duration-100">
                    <div className="px-3 py-2 border-b border-black/[0.05] text-[12px]">
                      <div className="font-semibold text-[#111111] truncate">{user.name}</div>
                      <div className="text-stone-500 truncate">{user.email}</div>
                    </div>
                    <Link
                      href="/riwayat"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[13px] rounded-lg text-stone-700 hover:bg-stone-100 hover:text-black transition-colors"
                    >
                      <History className="w-4 h-4 text-[#0075de]" />
                      <span>Riwayat Pesanan</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[13px] rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="rounded-lg px-3.5 py-1.5 text-[13.5px] font-medium text-[#111111] hover:text-[#0075de] hover:bg-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="rounded-full bg-[#111111] hover:bg-[#000000] text-white px-4 py-1.5 text-[13.5px] font-medium transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-black/[0.08] bg-[#ffffff] px-4 py-4 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            {user ? (
              <div className="px-3.5 py-2 mb-2 rounded-xl bg-stone-50 border border-black/[0.06] flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[13px] text-stone-900">{user.name}</p>
                  <p className="text-[11px] text-stone-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/riwayat"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-black/10 text-[12.5px] font-medium text-stone-800"
                  >
                    <History className="w-3.5 h-3.5 text-[#0075de]" />
                    <span>Riwayat</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="py-1.5 px-3 rounded-lg border border-black/10 bg-white text-[12.5px] font-medium text-rose-600 cursor-pointer"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pb-3 mb-2 border-b border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="flex items-center justify-center rounded-xl border border-black/10 bg-white py-2 text-[13px] font-medium text-[#111111] hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('register');
                  }}
                  className="flex items-center justify-center rounded-xl bg-[#111111] text-white py-2 text-[13px] font-medium hover:bg-black transition-colors cursor-pointer"
                >
                  Daftar
                </button>
              </div>
            )}

            <Link
              href="/#ai-generator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-[8px] px-3.5 py-2.5 text-[15px] font-medium text-[#111111] hover:bg-black/[0.05] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="h-4 w-4 text-[#0075de]" />
                <span>AI Studio</span>
              </div>
              <span className="text-[12px] text-[#54504c]">Generator Promo</span>
            </Link>
            <Link
              href="/#katalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-[8px] px-3.5 py-2.5 text-[15px] font-medium text-[#111111] hover:bg-black/[0.05] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-[#0075de]" />
                <span>Katalog Paket</span>
              </div>
              <span className="text-[12px] text-[#54504c]">Pilihan Bundle</span>
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
              <span className="text-[12px] text-[#54504c]">Tutorial</span>
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
              <span className="text-[12px] text-[#54504c]">Bantuan</span>
            </Link>

            <div className="pt-3 mt-2 border-t border-black/[0.06]">
              <a
                href="https://wa.me/6285182510575?text=Halo%20Admin%20Warung%20Design%2C%20saya%20butuh%20bantuan"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-[8px] bg-emerald-600 px-4 py-2.5 text-[14px] font-medium text-white hover:bg-emerald-700 transition-colors w-full min-h-[44px]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Hubungi WA (085182510575)</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
