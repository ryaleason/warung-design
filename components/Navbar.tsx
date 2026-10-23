'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, HelpCircle, MessageCircle, Search, User, LogOut, History, ChevronDown } from 'lucide-react';
import SearchModal from '@/components/SearchModal';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, openAuthModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close mobile menu on Escape key press, handle Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
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
      <header className="sticky top-0 z-40 w-full border-b border-black/[0.08] bg-[#f6f5f4]/90 backdrop-blur-md notion-nav-shadow">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8">
          {/* Left Side: Burger Menu + Logo + Brand Name */}
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
            <Link href="/" className="flex items-center gap-2.5 group rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]">
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

            {/* Desktop Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:inline-flex items-center gap-2 rounded-[8px] bg-[#ffffff] hover:bg-black/[0.04] border border-black/[0.1] px-3 py-1.5 text-[13px] text-[#54504c] hover:text-[#111111] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] cursor-pointer"
              aria-label="Cari paket desain (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5 text-[#54504c]" />
              <span>Cari paket desain...</span>
              <kbd className="font-mono text-[10.5px] bg-[#f6f5f4] border border-black/[0.08] px-1.5 py-0.5 rounded text-[#54504c]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Side: Desktop Nav Links & Search */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {/* Search icon trigger for medium screens */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-[8px] text-[#54504c] hover:text-[#111111] hover:bg-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
              aria-label="Buka pencarian paket"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href="/#katalog"
              className="rounded-[8px] px-3 py-1.5 text-[14px] font-medium text-[#54504c] hover:text-[#000000] hover:bg-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
            >
              Katalog Paket
            </Link>
            <Link
              href="/#cara-pakai"
              className="rounded-[8px] px-3 py-1.5 text-[14px] font-medium text-[#54504c] hover:text-[#000000] hover:bg-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
            >
              Cara Pakai
            </Link>
            <Link
              href="/#faq"
              className="rounded-[8px] px-3 py-1.5 text-[14px] font-medium text-[#54504c] hover:text-[#000000] hover:bg-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
            >
              FAQ
            </Link>

            {user ? (
              <div className="relative ml-2">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-[8px] border border-black/[0.1] bg-white px-3 py-1.5 text-[13px] font-medium text-[#111111] hover:bg-stone-50 transition-colors"
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
                      className="flex items-center gap-2 w-full px-3 py-2 text-[13px] rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="ml-1 rounded-[8px] border border-black/[0.1] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#111111] hover:bg-stone-50 transition-colors"
              >
                Masuk / Daftar
              </button>
            )}

            <Link
              href="/#katalog"
              className="ml-1.5 inline-flex items-center gap-1.5 rounded-[8px] bg-[#0075de] px-3.5 py-2 text-[14px] font-medium text-white hover:bg-[#0060b8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Pilih Paket</span>
            </Link>
          </nav>

          {/* Right Side: Mobile Fast Actions (Search + CTA, min 44px tap targets) */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-[8px] text-[#111111] hover:bg-black/[0.05] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
              aria-label="Buka pencarian paket desain"
            >
              <Search className="h-4 w-4 text-[#111111]" />
            </button>

            <Link
              href="/#katalog"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[8px] bg-[#0075de] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-[#0060b8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Pilih Paket</span>
            </Link>
          </div>
        </div>

        {/* Mobile Drawer / Dropdown Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-black/[0.08] bg-[#f6f5f4]/98 backdrop-blur-md px-4 py-4 space-y-1 shadow-lg transition-all animate-in fade-in duration-200">
            {user ? (
              <div className="border-b border-black/[0.06] pb-3 mb-2 px-3.5 pt-1">
                <div className="text-[14px] font-bold text-[#111111]">{user.name}</div>
                <div className="text-[12px] text-stone-500">{user.email}</div>
                <div className="flex items-center gap-2 mt-2.5">
                  <Link
                    href="/riwayat"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-black/10 text-[12.5px] font-medium text-stone-800"
                  >
                    <History className="w-3.5 h-3.5 text-[#0075de]" />
                    <span>Riwayat Pesanan</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="py-1.5 px-3 rounded-lg border border-black/10 bg-white text-[12.5px] font-medium text-rose-600"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-3.5 pb-2 mb-1 border-b border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('register');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-900 text-white py-2 text-[13px] font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk atau Daftar Akun</span>
                </button>
              </div>
            )}

            {/* Quick Search trigger in drawer */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between rounded-[8px] px-3.5 py-2.5 text-[15px] font-medium text-[#111111] hover:bg-black/[0.05] transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Search className="h-4 w-4 text-[#0075de]" />
                <span>Cari Paket Desain</span>
              </div>
              <span className="text-[12px] text-[#54504c]">Pencarian</span>
            </button>

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

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
