'use client';

import { useEffect, useRef } from 'react';

const WAVE_PATH_D =
  'M -1500 130 C -1409.0 66.0, -1341.0 66.0, -1250 130 C -1159.0 194.0, -1091.0 194.0, -1000 130 C -909.0 66.0, -841.0 66.0, -750 130 ' +
  'C -659.0 194.0, -591.0 194.0, -500 130 C -409.0 66.0, -341.0 66.0, -250 130 C -159.0 194.0, -91.0 194.0, 0 130 C 91.0 66.0, 159.0 66.0, 250 130 ' +
  'C 341.0 194.0, 409.0 194.0, 500 130 C 591.0 66.0, 659.0 66.0, 750 130 C 841.0 194.0, 909.0 194.0, 1000 130 C 1091.0 66.0, 1159.0 66.0, 1250 130 ' +
  'C 1341.0 194.0, 1409.0 194.0, 1500 130 C 1591.0 66.0, 1659.0 66.0, 1750 130 C 1841.0 194.0, 1909.0 194.0, 2000 130 C 2091.0 66.0, 2159.0 66.0, 2250 130 ' +
  'C 2341.0 194.0, 2409.0 194.0, 2500 130 C 2591.0 66.0, 2659.0 66.0, 2750 130 C 2841.0 194.0, 2909.0 194.0, 3000 130 C 3091.0 66.0, 3159.0 66.0, 3250 130 ' +
  'C 3341.0 194.0, 3409.0 194.0, 3500 130';

export default function WaveTextBanner() {
  const containerRef = useRef<HTMLElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const patternRef = useRef<SVGTSpanElement>(null);
  const offsetRef = useRef<number>(0);
  const patternLengthRef = useRef<number>(1850);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Measure dynamic length of one pattern unit
    const measureLength = () => {
      if (patternRef.current) {
        try {
          const len = patternRef.current.getComputedTextLength();
          if (len > 300) {
            patternLengthRef.current = len;
          }
        } catch {
          patternLengthRef.current = 1850;
        }
      }
    };

    measureLength();

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(measureLength);
    }

    let animationId: number = 0;
    let isVisible = false;
    let lastTimestamp: number = performance.now();
    const speedPixelsPerSecond = 50; // Smooth, lightweight constant speed

    const loop = (currentTimestamp: number) => {
      if (!isVisible) return;

      const delta = (currentTimestamp - lastTimestamp) / 1000;
      lastTimestamp = currentTimestamp;

      // Filter out huge deltas if user switches tabs
      if (delta > 0 && delta < 0.15) {
        offsetRef.current -= speedPixelsPerSecond * delta;
        if (offsetRef.current <= -patternLengthRef.current) {
          offsetRef.current += patternLengthRef.current;
        }
        if (textPathRef.current) {
          textPathRef.current.setAttribute('startOffset', `${offsetRef.current.toFixed(1)}px`);
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    // IntersectionObserver: Only animate when visible in or near the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastTimestamp = performance.now();
          cancelAnimationFrame(animationId);
          animationId = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(animationId);
        }
      },
      { threshold: 0.01, rootMargin: '120px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  const renderPatternUnit = (isFirst = false) => (
    <tspan ref={isFirst ? patternRef : undefined}>
      <tspan
        className="font-serif italic text-white"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Warung Design
      </tspan>
      <tspan className="fill-white/60 text-[14px]"> ✦ </tspan>
      <tspan
        className="font-sans font-bold uppercase tracking-wider text-white"
        style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
      >
        Formula Prompt AI UMKM
      </tspan>
      <tspan className="fill-white/60 text-[14px]"> ✦ </tspan>
      <tspan
        className="font-serif italic text-white"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Siap Copas ke ChatGPT &amp; Midjourney
      </tspan>
      <tspan className="fill-white/60 text-[14px]"> ✦ </tspan>
      <tspan
        className="font-sans font-bold uppercase tracking-wider text-white"
        style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
      >
        Formula Prompt AI
      </tspan>
      <tspan className="fill-white/60 text-[14px]"> ✦ </tspan>
      <tspan
        className="font-serif italic text-white"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Bebas Royalti Komersial
      </tspan>
      <tspan className="fill-white/60 text-[14px]"> ✦ </tspan>
      <tspan
        className="font-sans font-bold uppercase tracking-wider text-white"
        style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
      >
        Teruji Selera Pasar Lokal
      </tspan>
      <tspan className="fill-white/60 text-[14px]"> ✦ </tspan>
      <tspan
        className="font-serif italic text-white"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Mulai Rp 40 Ribuan
      </tspan>
      <tspan className="fill-white/60 text-[14px]"> ✦ </tspan>
      <tspan
        className="font-sans font-bold uppercase tracking-wider text-white"
        style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
      >
        Visual Berkualitas Tinggi
      </tspan>
      <tspan className="fill-white/60 text-[14px]"> ✦ </tspan>
    </tspan>
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden py-2 sm:py-4 select-none bg-transparent [contain:paint_layout] transform-gpu"
    >
      <div className="relative w-full">
        <svg
          viewBox="0 0 2000 260"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-48 sm:h-56 md:h-64 lg:h-72 pointer-events-none transform-gpu"
        >
          <defs>
            <path id="wave-center-path" d={WAVE_PATH_D} fill="none" />
            <linearGradient id="wave-ribbon-blue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#006cd2" />
              <stop offset="50%" stopColor="#0075de" />
              <stop offset="100%" stopColor="#006cd2" />
            </linearGradient>
          </defs>

          {/* Hardware-accelerated soft blue underlay glow (vector strokes with zero Gaussian blur filter overhead) */}
          <path
            d={WAVE_PATH_D}
            fill="none"
            stroke="#0075de"
            strokeWidth="96"
            strokeOpacity="0.10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={WAVE_PATH_D}
            fill="none"
            stroke="#0075de"
            strokeWidth="88"
            strokeOpacity="0.20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Wavy Blue Ribbon Band - follows the wave curvature */}
          <path
            d={WAVE_PATH_D}
            fill="none"
            stroke="url(#wave-ribbon-blue)"
            strokeWidth="80"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Flowing White Text along the Wave Path (Crisp, High Contrast, 0 Filter Lag) */}
          <text
            fill="#ffffff"
            fontSize="18.5"
            letterSpacing="0.03em"
            dominantBaseline="central"
            alignmentBaseline="middle"
          >
            <textPath
              ref={textPathRef}
              href="#wave-center-path"
              startOffset="0px"
              method="align"
              spacing="auto"
            >
              {renderPatternUnit(true)}
              {renderPatternUnit(false)}
              {renderPatternUnit(false)}
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}
