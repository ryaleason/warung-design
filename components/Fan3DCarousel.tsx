'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
    id: 'geprek',
    title: 'Kuliner Ayam Geprek Sambal',
    subtitle: 'Tekstur krispi renyah, lelehan sambal membara & promo Buy 1 Get 1',
    image: '/showcase/poster-geprek.webp',
    prompt: 'poster ayam geprek krispi sambal pedas buy 1 get 1 free percikan cabai dark moody',
    category: 'Kuliner & F&B',
  },
  {
    id: 'travel-escape',
    title: 'Paket Liburan & Tour Travel',
    subtitle: 'Kalender liburan tropis, paspor destinasi & pesawat melintas di atas pulau',
    image: '/showcase/poster-travel-escape.webp',
    prompt: 'poster promo tour travel kalender liburan paspor bali lombok pesawat 3d eksotis',
    category: 'Pariwisata & Tour',
  },
  {
    id: 'sumpah-pemuda',
    title: 'Hari Sumpah Pemuda',
    subtitle: 'Semangat kebangkitan pemuda dengan panorama puncak emas & bendera pusaka',
    image: '/showcase/poster-sumpah-pemuda.webp',
    prompt: 'poster hari sumpah pemuda 28 oktober anak muda bendera indonesia puncak gunung sunrise sinematik',
    category: 'Instansi & Komunitas',
  },
  {
    id: 'fotokopi',
    title: 'Promo Usaha Fotokopi & ATK',
    subtitle: 'Visual flash sale dinamis mesin fotokopi 3D & lembaran kertas melayang',
    image: '/showcase/poster-fotokopi.webp',
    prompt: 'poster flash sale fotokopi percetakan atk mesin fotokopi 3d kertas melayang dramatis',
    category: 'Jasa & Usaha Lokal',
  },
  {
    id: 'indonesia-emas',
    title: 'Visi Indonesia Emas 2045',
    subtitle: 'Metropolis futuristik ramah lingkungan dengan monorail & kubah teknologi',
    image: '/showcase/poster-indonesia-emas.webp',
    prompt: 'poster indonesia emas 2045 kota futuristik monorail gedung megah sunrise kemegahan nasional',
    category: 'Institusi & Pendidikan',
  },
  {
    id: 'ramadhan',
    title: 'Marhaban ya Ramadhan',
    subtitle: 'Kemegahan arsitektur Masjid Nabawi dengan lentera emas & langit senja',
    image: '/showcase/poster-ramadhan-masjid.webp',
    prompt: 'poster ucapan marhaban ya ramadhan masjid nabawi madinah lentera emas kaligrafi mewah',
    category: 'Travel & Religi',
  },
];

interface Fan3DCarouselProps {
  onSelectPrompt?: (prompt: string) => void;
  theme?: 'light' | 'dark';
}

export default function Fan3DCarousel({ onSelectPrompt, theme = 'light' }: Fan3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const items = FAN_CAROUSEL_ITEMS;
  const isLight = theme === 'light';

  // Smooth scroll sync: Menyesuaikan scroll window saat tombol navigasi / kartu / pill diklik
  const scrollToCard = useCallback((targetIndex: number) => {
    if (!trackRef.current) {
      setActiveIndex(targetIndex);
      return;
    }
    const rect = trackRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const stickyTop = 64;
    const totalScrollable = rect.height - windowHeight;

    if (totalScrollable <= 0) {
      setActiveIndex(targetIndex);
      return;
    }

    // Bidik bagian tengah dari segmen scroll kartu target
    const targetProgress = (targetIndex + 0.5) / items.length;
    const targetScrollY = window.scrollY + rect.top - stickyTop + targetProgress * totalScrollable;

    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, opts?: any) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScrollY, { duration: 0.6 });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  }, [items.length]);

  const handlePrev = useCallback(() => {
    const nextIdx = (activeIndex - 1 + items.length) % items.length;
    scrollToCard(nextIdx);
  }, [activeIndex, items.length, scrollToCard]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % items.length;
    scrollToCard(nextIdx);
  }, [activeIndex, items.length, scrollToCard]);

  // Scrollytelling Listener: Memetakan posisi scroll ke indeks kartu secara real-time
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const stickyTop = 64; // offset dari sticky navbar
        const totalScrollable = rect.height - windowHeight;

        if (totalScrollable <= 0) return;

        // Seberapa jauh pengguna menggulir ke dalam lintasan section sticky ini
        const scrolled = stickyTop - rect.top;
        const rawProgress = scrolled / totalScrollable;
        const progress = Math.max(0, Math.min(1, rawProgress));

        // Kalkulasi kartu yang harus aktif (0 s/d 5)
        const targetIndex = Math.min(
          items.length - 1,
          Math.max(0, Math.floor(progress * items.length))
        );

        setActiveIndex(targetIndex);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
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

  // Touch Swipe Support untuk mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diffX) > 45) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

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
    <div
      ref={trackRef}
      className="relative w-full h-[190vh] sm:h-[210vh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sticky Viewport Container - Terkunci presisi di tengah layar selama scroll */}
      <div className="sticky top-16 md:top-20 z-10 flex min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex-col justify-center items-center py-2 sm:py-4 overflow-visible select-none">
        <div className="text-center max-w-5xl lg:max-w-6xl w-full mx-auto space-y-6 sm:space-y-8 overflow-visible">
          {/* Section Heading & Subtitle */}
          <div className="max-w-3xl mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#000000]">
              Formula Prompt AI yang paham{' '}
              <span className="italic font-normal text-[#0075de]">pasar &amp; budaya UMKM Indonesia</span>
            </h3>
            <p className="text-[14px] sm:text-[15.5px] text-[#54504c] leading-relaxed max-w-2xl mx-auto">
              Lupakan tutorial prompt bahasa Inggris yang rumit dan tidak sesuai selera lokal. Setiap paket menyertakan teks prompt Midjourney &amp; DALL-E v3 siap pakai untuk eksplorasi tanpa batas.
            </p>
          </div>

          {/* 3D Fan Carousel Stage - Grand & Unclipped Display */}
          <div className="relative mx-auto w-full max-w-4xl lg:max-w-5xl h-[290px] sm:h-[360px] md:h-[410px] lg:h-[450px] flex items-center justify-center overflow-visible">
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
                transformStyle = 'translateX(-56%) translateY(14px) rotate(-7deg) scale(0.92)';
                zIndex = 20;
                opacity = 0.88;
                filter = isLight ? 'brightness(0.95)' : 'brightness(0.9)';
                pointerEvents = 'auto';
              } else if (offset === -2) {
                transformStyle = 'translateX(-104%) translateY(32px) rotate(-14deg) scale(0.82)';
                zIndex = 10;
                opacity = 0.55;
                filter = isLight ? 'brightness(0.85)' : 'brightness(0.75)';
                pointerEvents = 'auto';
              } else if (offset === 1) {
                transformStyle = 'translateX(56%) translateY(14px) rotate(7deg) scale(0.92)';
                zIndex = 20;
                opacity = 0.88;
                filter = isLight ? 'brightness(0.95)' : 'brightness(0.9)';
                pointerEvents = 'auto';
              } else if (offset === 2) {
                transformStyle = 'translateX(104%) translateY(32px) rotate(14deg) scale(0.82)';
                zIndex = 10;
                opacity = 0.55;
                filter = isLight ? 'brightness(0.85)' : 'brightness(0.75)';
                pointerEvents = 'auto';
              } else {
                transformStyle = offset < 0
                  ? 'translateX(-145%) translateY(45px) rotate(-20deg) scale(0.68)'
                  : 'translateX(145%) translateY(45px) rotate(20deg) scale(0.68)';
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
                      scrollToCard(index);
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
                  className={`absolute top-1 w-[180px] h-[255px] sm:w-[225px] sm:h-[320px] md:w-[270px] md:h-[385px] lg:w-[305px] lg:h-[435px] rounded-2xl sm:rounded-3xl overflow-hidden ${
                    isLight ? 'shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-slate-900' : 'shadow-[0_24px_60px_rgba(0,0,0,0.7)] bg-[#161618]'
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
                      sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, 340px"
                      priority={isCenter}
                    />

                    {/* Subtle vignette & category label overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex flex-col justify-end p-3.5 sm:p-5 text-left">
                      <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-white/75 block">
                        {item.category}
                      </span>
                      <span className="text-[14px] sm:text-[16px] md:text-[17px] font-semibold text-white tracking-tight leading-tight line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls (Arrows & Title) */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6">
            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Poster Sebelumnya"
              className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${
                isLight
                  ? 'bg-[#111111] hover:bg-[#0075de] text-white'
                  : 'bg-black/60 hover:bg-black/90 text-white/80 hover:text-white'
              }`}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Center Title & Subtitle */}
            <div className="text-center min-w-[220px] sm:min-w-[360px] max-w-xl px-2">
              <h4
                className={`text-[17px] sm:text-[21px] md:text-[23px] font-semibold tracking-tight leading-snug ${
                  isLight ? 'text-[#111111]' : 'text-white drop-shadow-sm'
                }`}
              >
                {activeItem.title}
              </h4>
              <p
                className={`text-[12.5px] sm:text-[14.5px] mt-1 line-clamp-1 font-normal ${
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
              className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${
                isLight
                  ? 'bg-[#111111] hover:bg-[#0075de] text-white'
                  : 'bg-black/60 hover:bg-black/90 text-white/80 hover:text-white'
              }`}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
