'use client';

import { useState, useMemo } from 'react';
import { Bundle } from '@/types';
import BundleCard from './BundleCard';

interface HomeCatalogSectionProps {
  bundles: Bundle[];
}

export default function HomeCatalogSection({ bundles }: HomeCatalogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    bundles.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [bundles]);

  const filteredBundles = useMemo(() => {
    if (selectedCategory === 'all') return bundles;
    return bundles.filter((b) => b.category === selectedCategory);
  }, [bundles, selectedCategory]);

  return (
    <section id="katalog" className="px-4 sm:px-8 scroll-mt-20">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-black/[0.08] pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#000000]">
            Pilihan Paket Desain{' '}
            <span className="italic font-normal text-[#0075de]">Siap Pakai</span>
          </h2>
          <p className="mt-2 text-[15px] sm:text-[16px] text-[#595652] max-w-xl">
            Pilih bundle yang sesuai dengan kampanye tokomu saat ini. Bayar sekali lewat QRIS, unduh file resolusi tinggi, dan langsung posting ke media sosial.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0075de] text-white shadow-xs'
                : 'bg-white border border-black/[0.1] text-[#54504c] hover:border-[#0075de]/30 hover:text-[#0075de] hover:bg-[#f6f5f4]'
            }`}
          >
            Semua ({bundles.length})
          </button>

          {categories.map((cat) => {
            const count = bundles.filter((b) => b.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0075de] text-white shadow-xs'
                    : 'bg-white border border-black/[0.1] text-[#54504c] hover:border-[#0075de]/30 hover:text-[#0075de] hover:bg-[#f6f5f4]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Bundles */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredBundles.map((bundle) => (
          <div key={bundle.id} className="h-full">
            <BundleCard bundle={bundle} />
          </div>
        ))}
      </div>

      {filteredBundles.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/[0.12] p-12 text-center bg-white/50">
          <p className="text-[15px] text-[#757575]">
            Belum ada paket di kategori ini. Silakan pilih kategori lain.
          </p>
        </div>
      )}
    </section>
  );
}
