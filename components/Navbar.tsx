'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, HelpCircle, MessageCircle, ShoppingBag, LogOut, History, ChevronDown, Bot } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  // Jangan render navbar publik di halaman admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] bg-white/80 backdrop-blur-xl transition-all">
        <div className="mx-auto relative flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8">
          {/* Left Side: Mobile Menu Button + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Hamburger Menu Button (mobile only, min 44px tap target) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[#111111] hover:bg-black/[0.05] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
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
              className="flex items-center gap-2.5 group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
            >
              <Image
                src="/logo.svg"
                alt="Warung Design"
                width={32}
                height={32}
                className="h-7 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                priority
                unoptimized
              />
              <span className="text-[16.5px] font-semibold tracking-[-0.02em] text-[#111111]">
                Warung Design
              </span>
            </Link>
          </div>

          {/* Centered Desktop Navigation Island (Linear/Apple Style) */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 rounded-full border border-black/[0.06] bg-[#f5f4f0]/85 p-1 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)]">
            <Link
              href="/#ai-generator"
              className="rounded-full px-4 py-1.5 text-[13px] font-medium text-[#55524e] transition-all hover:bg-white hover:text-[#111111] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
            >
              AI Studio
            </Link>
            <Link
              href="/#katalog"
              className="rounded-full px-4 py-1.5 text-[13px] font-medium text-[#55524e] transition-all hover:bg-white hover:text-[#111111] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
            >
              Katalog Paket
            </Link>
            <Link
              href="/#cara-pakai"
              className="rounded-full px-4 py-1.5 text-[13px] font-medium text-[#55524e] transition-all hover:bg-white hover:text-[#111111] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
            >
              Cara Pakai
            </Link>
            <Link
              href="/#faq"
              className="rounded-full px-4 py-1.5 text-[13px] font-medium text-[#55524e] transition-all hover:bg-white hover:text-[#111111] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
            >
              FAQ
            </Link>
          </nav>

          {/* Right Side: Auth Buttons (Ghost Masuk + Tactile Blue Daftar) or User Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div id="user-menu-container" className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-3.5 py-1.5 text-[13px] font-medium text-[#111111] hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#e6f3fe] text-[#0075de] flex items-center justify-center font-bold text-[11px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[110px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-black/[0.08] bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2.5 border-b border-black/[0.05] text-[12px]">
                      <div className="font-semibold text-[#111111] truncate">{user.name}</div>
                      <div className="text-stone-500 truncate">{user.email}</div>
                    </div>
                    <div className="p-1 space-y-0.5">
                      <Link
                        href="/riwayat"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-[13px] rounded-xl text-stone-700 hover:bg-stone-100 hover:text-black transition-colors"
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
                        className="flex items-center gap-2 w-full px-3 py-2 text-[13px] rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/login"
                  className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-[#4b4845] hover:text-[#111111] hover:bg-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] cursor-pointer"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#0084f7] via-[#0075de] to-[#0064c8] px-4.5 py-1.5 text-[13px] font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_3px_10px_rgba(0,117,222,0.25)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_6px_18px_rgba(0,117,222,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2"
                >
                  <span>Daftar</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-black/[0.08] bg-white/95 backdrop-blur-xl px-4 py-4 space-y-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
            {user ? (
              <div className="px-3.5 py-2.5 mb-2 rounded-2xl bg-stone-50 border border-black/[0.06] flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[13px] text-stone-900">{user.name}</p>
                  <p className="text-[11px] text-stone-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/riwayat"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white border border-black/10 text-[12.5px] font-medium text-stone-800 shadow-2xs hover:bg-stone-50 transition-colors"
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
                    className="py-1.5 px-3 rounded-xl border border-black/10 bg-white text-[12.5px] font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pb-3 mb-2 border-b border-black/[0.06]">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-black/10 bg-white py-2.5 text-[13px] font-medium text-[#111111] hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-gradient-to-b from-[#0084f7] via-[#0075de] to-[#0064c8] text-white py-2.5 text-[13px] font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_3px_10px_rgba(0,117,222,0.25)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_6px_18px_rgba(0,117,222,0.35)] transition-all cursor-pointer"
                >
                  Daftar
                </Link>
              </div>
            )}

            <Link
              href="/#ai-generator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14.5px] font-medium text-[#111111] hover:bg-black/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="h-4 w-4 text-[#0075de]" />
                <span>AI Studio</span>
              </div>
              <span className="text-[12px] text-[#77746e]">Generator Promo</span>
            </Link>
            <Link
              href="/#katalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14.5px] font-medium text-[#111111] hover:bg-black/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-[#0075de]" />
                <span>Katalog Paket</span>
              </div>
              <span className="text-[12px] text-[#77746e]">Pilihan Bundle</span>
            </Link>
            <Link
              href="/#cara-pakai"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14.5px] font-medium text-[#111111] hover:bg-black/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 text-[#0075de]" />
                <span>Cara Pakai</span>
              </div>
              <span className="text-[12px] text-[#77746e]">Panduan</span>
            </Link>
            <Link
              href="/#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14.5px] font-medium text-[#111111] hover:bg-black/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-[#0075de]" />
                <span>Tanya Jawab (FAQ)</span>
              </div>
              <span className="text-[12px] text-[#77746e]">Bantuan</span>
            </Link>

            <div className="pt-3 mt-2 border-t border-black/[0.06]">
              <a
                href="https://wa.me/6285182510575?text=Halo%20Admin%20Warung%20Design%2C%20saya%20butuh%20bantuan"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-emerald-700 transition-colors w-full min-h-[44px] shadow-xs"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Hubungi WhatsApp Admin</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
