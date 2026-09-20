'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bundle } from '@/types';
import { formatRupiah } from '@/lib/telegram';
import { Search, X, Layers, ArrowUpRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Semua', 'Promo & Event', 'Kuliner & F&B', 'Fashion & Retail'];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch bundles on first open
  useEffect(() => {
    if (!isOpen) return;

    // Focus input on open
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    if (bundles.length === 0) {
      setIsLoading(true);
      fetch('/api/bundles')
        .then((res) => res.json())
        .then((data) => {
          if (data.bundles) {
            setBundles(data.bundles);
          }
        })
        .catch((err) => console.error('Gagal memuat daftar pencarian:', err))
        .finally(() => setIsLoading(false));
    }

    return () => clearTimeout(focusTimer);
  }, [isOpen, bundles.length]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Filter bundles based on query & category
  const filteredBundles = useMemo(() => {
    let list = bundles;

    if (selectedCategory !== 'Semua') {
      list = list.filter((b) => b.category === selectedCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          (b.category || '').toLowerCase().includes(q) ||
          b.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    return list;
  }, [bundles, query, selectedCategory]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredBundles.length]);

  // Handle keyboard navigation: Escape, ArrowDown, ArrowUp, Enter
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredBundles.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredBundles.length - 1
        );
      } else if (e.key === 'Enter') {
        if (filteredBundles.length > 0 && filteredBundles[selectedIndex]) {
          e.preventDefault();
          const target = filteredBundles[selectedIndex];
          onClose();
          router.push(`/bundles/${target.slug}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredBundles, selectedIndex, onClose, router]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian Paket Desain"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-[16px] border border-black/[0.12] bg-[#ffffff] shadow-2xl transition-all">
        {/* Search Header Bar */}
        <div className="relative flex items-center border-b border-black/[0.08] px-4 py-3 sm:px-5">
          <Search className="h-5 w-5 text-[#54504c] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari paket desain toko (misal: Ramadhan, Kuliner, Diskon)..."
            className="w-full bg-transparent text-[15px] sm:text-[16px] text-[#111111] placeholder:text-[#54504c]/60 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[#54504c] hover:bg-black/[0.05] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
              aria-label="Hapus kata kunci pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[#54504c] hover:bg-black/[0.05] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
              aria-label="Tutup pencarian"
            >
              <kbd className="hidden sm:inline-block font-mono text-[11px] bg-black/[0.05] px-1.5 py-0.5 rounded border border-black/[0.08]">
                ESC
              </kbd>
              <X className="sm:hidden h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-5 border-b border-black/[0.04] bg-[#f6f5f4]/60 text-[12.5px]">
          <span className="text-[#54504c] text-[11.5px] font-medium mr-1 uppercase tracking-wider shrink-0">
            Kategori:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-[6px] px-2.5 py-1 font-medium transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] cursor-pointer ${
                  isSelected
                    ? 'bg-[#0075de] text-white shadow-xs'
                    : 'bg-[#ffffff] text-[#54504c] hover:text-[#111111] border border-black/[0.06]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3 space-y-1">
          {isLoading ? (
            <div className="py-12 text-center text-[14px] text-[#54504c]">
              Memuat katalog paket desain...
            </div>
          ) : filteredBundles.length > 0 ? (
            filteredBundles.map((bundle, idx) => {
              const isSelected = idx === selectedIndex;
              const mainImage =
                bundle.preview_images?.[0] ||
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

              return (
                <button
                  key={bundle.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`/bundles/${bundle.slug}`);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between gap-3 p-3 rounded-[10px] text-left transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] ${
                    isSelected
                      ? 'bg-[#e6f3fe]/70 border border-[#0075de]/30'
                      : 'hover:bg-black/[0.03] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 rounded-[8px] overflow-hidden bg-[#f6f5f4] shrink-0 border border-black/[0.08]">
                      <Image
                        src={mainImage}
                        alt={bundle.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-semibold text-[#005bb5] bg-[#e6f3fe] px-2 py-0.2 rounded">
                          {bundle.category || 'Desain UMKM'}
                        </span>
                        {bundle.badge && (
                          <span className="text-[10.5px] font-semibold text-[#111111] bg-[#ffb110]/30 px-1.5 py-0.2 rounded">
                            {bundle.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-[14.5px] font-semibold text-[#111111] truncate">
                        {bundle.name}
                      </h4>
                      <p className="text-[12.5px] text-[#54504c] truncate">
                        {bundle.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right ml-2">
                    <span className="text-[14px] font-bold text-[#111111] block">
                      {formatRupiah(bundle.price)}
                    </span>
                    <span className="text-[11px] text-[#005bb5] inline-flex items-center gap-0.5 font-medium">
                      Buka <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            /* Empty State */
            <div className="py-12 px-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f5f4] text-[#54504c] mb-3 border border-black/[0.06]">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-[15px] font-semibold text-[#111111]">
                Paket tidak ditemukan
              </h3>
              <p className="mt-1 text-[13.5px] text-[#54504c] max-w-sm mx-auto">
                Tidak ada paket desain yang cocok dengan &ldquo;{query}&rdquo;.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-[12px] text-[#54504c]">Coba cari:</span>
                {['Ramadhan', 'Kuliner', 'Diskon', 'Fashion'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      setSelectedCategory('Semua');
                    }}
                    className="rounded-[6px] bg-[#f6f5f4] hover:bg-black/[0.06] border border-black/[0.08] px-2.5 py-1 text-[12px] font-medium text-[#111111] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Helper Shortcuts */}
        <div className="hidden sm:flex items-center justify-between border-t border-black/[0.06] bg-[#f6f5f4]/50 px-4 py-2.5 text-[11.5px] text-[#54504c]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-[#ffffff] border border-black/[0.1] px-1.5 py-0.5 rounded shadow-2xs">
                ↑
              </kbd>
              <kbd className="font-mono bg-[#ffffff] border border-black/[0.1] px-1.5 py-0.5 rounded shadow-2xs">
                ↓
              </kbd>
              <span>pilih</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-[#ffffff] border border-black/[0.1] px-1.5 py-0.5 rounded shadow-2xs">
                ↵
              </kbd>
              <span>buka paket</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="font-mono bg-[#ffffff] border border-black/[0.1] px-1.5 py-0.5 rounded shadow-2xs">
              ESC
            </kbd>
            <span>tutup</span>
          </span>
        </div>
      </div>
    </div>
  );
}
