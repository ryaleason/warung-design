'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  theme?: 'light' | 'dark';
}

export default function Fan3DCarousel({ onSelectPrompt, theme = 'light' }: Fan3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = FAN_CAROUSEL_ITEMS;
  const isLight = theme === 'light';

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

  const handleActionClick = (prompt: string) => {
    if (onSelectPrompt) {
      onSelectPrompt(prompt);
    } else {
      const el = document.getElementById('ai-generator');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.dispatchEvent(new CustomEvent('select-ai-prompt', { detail: prompt }));
      }
    }
  };

  // Calculate circular offset relative to active card (-2, -1, 0, 1, 2, or outside)
  const getOffset = (index: number) => {
    let diff = (index - activeIndex) % items.length;
    if (diff > items.length / 2) diff -= items.length;
    if (diff < -items.length / 2) diff += items.length;
    return diff;
  };

  const activeItem = items[activeIndex];

  return (
    <div className="w-full pt-4 sm:pt-6 pb-4 select-none">
      {/* 3D Fan Carousel Stage - Grand / Large Display */}
      <div className="relative mx-auto w-full max-w-5xl h-[330px] sm:h-[420px] md:h-[480px] lg:h-[530px] flex items-center justify-center overflow-visible">
        {items.map((item, index) => {
          const offset = getOffset(index);
          const isCenter = offset === 0;

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
            transformStyle = 'translateX(-62%) translateY(16px) rotate(-7.5deg) scale(0.91)';
            zIndex = 20;
            opacity = 0.88;
            filter = isLight ? 'brightness(0.95)' : 'brightness(0.9)';
            pointerEvents = 'auto';
          } else if (offset === -2) {
            transformStyle = 'translateX(-118%) translateY(42px) rotate(-15deg) scale(0.8)';
            zIndex = 10;
            opacity = 0.55;
            filter = isLight ? 'brightness(0.85)' : 'brightness(0.75)';
            pointerEvents = 'auto';
          } else if (offset === 1) {
            transformStyle = 'translateX(62%) translateY(16px) rotate(7.5deg) scale(0.91)';
            zIndex = 20;
            opacity = 0.88;
            filter = isLight ? 'brightness(0.95)' : 'brightness(0.9)';
            pointerEvents = 'auto';
          } else if (offset === 2) {
            transformStyle = 'translateX(118%) translateY(42px) rotate(15deg) scale(0.8)';
            zIndex = 10;
            opacity = 0.55;
            filter = isLight ? 'brightness(0.85)' : 'brightness(0.75)';
            pointerEvents = 'auto';
          } else {
            transformStyle = offset < 0
              ? 'translateX(-160%) translateY(65px) rotate(-22deg) scale(0.65)'
              : 'translateX(160%) translateY(65px) rotate(22deg) scale(0.65)';
            zIndex = 5;
            opacity = 0;
            pointerEvents = 'none';
          }

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isCenter) {
                  handleActionClick(item.prompt);
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
              className={`absolute top-2 w-[200px] h-[280px] sm:w-[260px] sm:h-[360px] md:w-[310px] md:h-[430px] lg:w-[340px] lg:h-[470px] rounded-2xl sm:rounded-3xl overflow-hidden ${
                isLight ? 'shadow-[0_22px_55px_rgba(0,0,0,0.22)] bg-slate-900' : 'shadow-[0_24px_60px_rgba(0,0,0,0.7)] bg-[#161618]'
              } cursor-pointer group`}
            >
              {/* Poster Image */}
              <div className="relative w-full h-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  quality={90}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 220px, (max-width: 768px) 300px, 380px"
                  priority={isCenter}
                />

                {/* Subtle vignette & category label overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex flex-col justify-end p-4 sm:p-5 text-left">
                  <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-white/75 block">
                    {item.category}
                  </span>
                  <span className="text-[13.5px] sm:text-[16px] md:text-[17px] font-semibold text-white tracking-tight leading-tight line-clamp-1">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls (Arrows & Title) */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Poster Sebelumnya"
          className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${
            isLight
              ? 'bg-[#111111] hover:bg-[#0075de] text-white'
              : 'bg-black/60 hover:bg-black/90 text-white/80 hover:text-white'
          }`}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Center Title & Subtitle */}
        <div className="text-center min-w-[220px] sm:min-w-[360px] max-w-lg px-2">
          <h4
            className={`text-[17px] sm:text-[21px] md:text-[23px] font-semibold tracking-tight leading-snug ${
              isLight ? 'text-[#111111]' : 'text-white drop-shadow-sm'
            }`}
          >
            {activeItem.title}
          </h4>
          <p
            className={`text-[13px] sm:text-[14.5px] mt-1 line-clamp-1 font-normal ${
              isLight ? 'text-[#54504c]' : 'text-white/75'
            }`}
          >
            {activeItem.subtitle}
          </p>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Poster Selanjutnya"
          className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${
            isLight
              ? 'bg-[#111111] hover:bg-[#0075de] text-white'
              : 'bg-black/60 hover:bg-black/90 text-white/80 hover:text-white'
          }`}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </div>
  );
}
