'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface FanCarouselItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  prompt: string;
  category: string;
}

export const FAN_CAROUSEL_ITEMS: FanCarouselItem[] = [
  {
    id: 'ramadhan',
    title: 'Ramadhan & Idul Fitri',
    subtitle: 'Kemegahan landmark 3D & kaligrafi islami modern',
    image: '/showcase/poster-ramadhan.jpg',
    prompt: 'poster ucapan ramadhan travel umroh kemegahan landmark 3d',
    category: 'Travel & Event',
  },
  {
    id: 'coffee',
    title: 'Artisan Coffee & Cafe',
    subtitle: 'Golden hour hangat, latte art presisi & serpihan biji kopi',
    image: '/showcase/poster-coffee.jpg',
    prompt: 'bikin poster promo kopi diskon 20% weekend golden hour',
    category: 'Kuliner & F&B',
  },
  {
    id: 'pahlawan',
    title: 'Hari Pahlawan Nasional',
    subtitle: 'Tribut sinematik monumental & kolase arsip sejarah melayang',
    image: '/showcase/poster-pahlawan.jpg',
    prompt: 'poster hari pahlawan untuk kantor properti nuansa sinematik',
    category: 'Instansi & Korporasi',
  },
  {
    id: 'travel',
    title: 'Paket Tour & Liburan Eksotis',
    subtitle: 'Eksotis tropis dengan floating contact bar & volumetric god rays',
    image: '/showcase/poster-travel.jpg',
    prompt: 'bikin poster promo paket tour liburan bali tropis eksotis',
    category: 'Pariwisata & Tour',
  },
  {
    id: 'croissant',
    title: 'Menu Baru Croissant & Pastry',
    subtitle: 'Tekstur flaky renyah, lelehan butter & dark moody artisan',
    image: '/showcase/poster-croissant.jpg',
    prompt: 'promo menu baru croissant pastry cafe dark moody artisan',
    category: 'Bakery & Pastry',
  },
  {
    id: 'fashion',
    title: 'Fashion & Olshop Glow-Up',
    subtitle: 'Editorial minimalis mewah, pencahayaan studio eksklusif',
    image: '/showcase/poster-fashion.jpg',
    prompt: 'feed ig baju gamis lebaran diskon buy 1 get 1 editorial elegan',
    category: 'Fashion & Beauty',
  },
];

interface Fan3DCarouselProps {
  onSelectPrompt?: (prompt: string) => void;
}

export default function Fan3DCarousel({ onSelectPrompt }: Fan3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = FAN_CAROUSEL_ITEMS;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  // Keyboard navigation when user presses Left/Right arrow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Calculate circular offset relative to active card (-2, -1, 0, 1, 2, or outside)
  const getOffset = (index: number) => {
    let diff = (index - activeIndex) % items.length;
    if (diff > items.length / 2) diff -= items.length;
    if (diff < -items.length / 2) diff += items.length;
    return diff;
  };

  const activeItem = items[activeIndex];

  return (
    <div className="w-full pt-4 sm:pt-6 pb-2 select-none">
      {/* Subheader / Inspiration Label */}
      <div className="text-center mb-4 sm:mb-6">
        <span className="text-[11.5px] sm:text-[12px] font-semibold uppercase tracking-wider text-white/60">
          Inspirasi Desain Siap Racik
        </span>
      </div>

      {/* 3D Fan Carousel Stage */}
      <div className="relative mx-auto w-full max-w-3xl h-[260px] sm:h-[320px] md:h-[360px] flex items-center justify-center overflow-visible">
        {items.map((item, index) => {
          const offset = getOffset(index);
          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          // Transform and positioning calculation based on fan offset
          let transformStyle = '';
          let zIndex = 10;
          let opacity = 0;
          let filter = 'brightness(1)';
          let pointerEvents = 'none';

          if (isCenter) {
            transformStyle = 'translateX(0%) translateY(0px) rotate(0deg) scale(1)';
            zIndex = 30;
            opacity = 1;
            filter = 'brightness(1)';
            pointerEvents = 'auto';
          } else if (offset === -1) {
            transformStyle = 'translateX(-65%) translateY(14px) rotate(-8deg) scale(0.9)';
            zIndex = 20;
            opacity = 0.88;
            filter = 'brightness(0.9)';
            pointerEvents = 'auto';
          } else if (offset === -2) {
            transformStyle = 'translateX(-122%) translateY(40px) rotate(-16deg) scale(0.78)';
            zIndex = 10;
            opacity = 0.55;
            filter = 'brightness(0.75)';
            pointerEvents = 'auto';
          } else if (offset === 1) {
            transformStyle = 'translateX(65%) translateY(14px) rotate(8deg) scale(0.9)';
            zIndex = 20;
            opacity = 0.88;
            filter = 'brightness(0.9)';
            pointerEvents = 'auto';
          } else if (offset === 2) {
            transformStyle = 'translateX(122%) translateY(40px) rotate(16deg) scale(0.78)';
            zIndex = 10;
            opacity = 0.55;
            filter = 'brightness(0.75)';
            pointerEvents = 'auto';
          } else {
            // Hidden outside cards
            transformStyle = offset < 0
              ? 'translateX(-160%) translateY(60px) rotate(-22deg) scale(0.6)'
              : 'translateX(160%) translateY(60px) rotate(22deg) scale(0.6)';
            zIndex = 5;
            opacity = 0;
            pointerEvents = 'none';
          }

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isCenter) {
                  onSelectPrompt?.(item.prompt);
                } else {
                  setActiveIndex(index);
                }
              }}
              style={{
                transform: transformStyle,
                zIndex,
                opacity,
                filter,
                pointerEvents: pointerEvents as any,
                transition: 'all 500ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className={`absolute top-2 w-36 h-48 sm:w-48 sm:h-64 md:w-56 md:h-76 rounded-2xl overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.65)] bg-[#161618] cursor-pointer group`}
            >
              {/* Poster Image */}
              <div className="relative w-full h-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  quality={90}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 150px, (max-width: 768px) 200px, 240px"
                  priority={isCenter}
                />

                {/* Subtle vignette & category label overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-3 sm:p-4 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
                    {item.category}
                  </span>
                  <span className="text-[12.5px] sm:text-[14px] font-semibold text-white tracking-tight leading-tight line-clamp-1">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls (Arrows & Title) */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Poster Sebelumnya"
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white/80 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Center Title & Subtitle */}
        <div className="text-center min-w-[200px] sm:min-w-[320px] max-w-md px-2">
          <h4 className="text-[15px] sm:text-[17px] font-semibold text-white tracking-tight leading-snug drop-shadow-sm">
            {activeItem.title}
          </h4>
          <p className="text-[12px] sm:text-[13px] text-white/75 mt-0.5 line-clamp-1 font-normal">
            {activeItem.subtitle}
          </p>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Poster Selanjutnya"
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white/80 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Action Button: Use This Design Idea */}
      <div className="mt-3.5 text-center">
        <button
          type="button"
          onClick={() => onSelectPrompt?.(activeItem.prompt)}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-[#0075de] border border-white/20 hover:border-[#0075de] px-4 py-1.5 text-[12.5px] font-medium text-white transition-all shadow-xs cursor-pointer group"
        >
          <span>Gunakan Ide Desain Ini</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
