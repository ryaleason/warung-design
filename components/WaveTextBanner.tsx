'use client';

import { useEffect, useRef } from 'react';

const WAVE_PATH_D =
  'M -1500 110 C -1420.0 41.2, -1330.0 41.2, -1250.0 110.0 C -1170.0 178.8, -1080.0 178.8, -1000.0 110.0 ' +
  'C -920.0 41.2, -830.0 41.2, -750.0 110.0 C -670.0 178.8, -580.0 178.8, -500.0 110.0 ' +
  'C -420.0 41.2, -330.0 41.2, -250.0 110.0 C -170.0 178.8, -80.0 178.8, 0.0 110.0 ' +
  'C 80.0 41.2, 170.0 41.2, 250.0 110.0 C 330.0 178.8, 420.0 178.8, 500.0 110.0 ' +
  'C 580.0 41.2, 670.0 41.2, 750.0 110.0 C 830.0 178.8, 920.0 178.8, 1000.0 110.0 ' +
  'C 1080.0 41.2, 1170.0 41.2, 1250.0 110.0 C 1330.0 178.8, 1420.0 178.8, 1500.0 110.0 ' +
  'C 1580.0 41.2, 1670.0 41.2, 1750.0 110.0 C 1830.0 178.8, 1920.0 178.8, 2000.0 110.0 ' +
  'C 2080.0 41.2, 2170.0 41.2, 2250.0 110.0 C 2330.0 178.8, 2420.0 178.8, 2500.0 110.0 ' +
  'C 2580.0 41.2, 2670.0 41.2, 2750.0 110.0 C 2830.0 178.8, 2920.0 178.8, 3000.0 110.0 ' +
  'C 3080.0 41.2, 3170.0 41.2, 3250.0 110.0 C 3330.0 178.8, 3420.0 178.8, 3500.0 110.0';

export default function WaveTextBanner() {
  const textPathRef = useRef<SVGTextPathElement>(null);
  const patternRef = useRef<SVGTSpanElement>(null);
  const offsetRef = useRef<number>(0);
  const patternLengthRef = useRef<number>(1850);

  useEffect(() => {
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

    let animationId: number;
    const speed = 0.85; // Silky smooth 60fps marquee velocity

    const loop = () => {
      offsetRef.current -= speed;
      if (offsetRef.current <= -patternLengthRef.current) {
        offsetRef.current += patternLengthRef.current;
      }
      if (textPathRef.current) {
        textPathRef.current.setAttribute('startOffset', `${offsetRef.current}px`);
      }
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const renderPatternUnit = (isFirst = false) => (
    <tspan ref={isFirst ? patternRef : undefined}>
      <tspan className="font-serif italic text-white" style={{ fontFamily: 'var(--font-serif)' }}>
        Warung Design
      </tspan>
      <tspan className="fill-white/50 text-[14px]"> ✦ </tspan>
      <tspan className="font-sans font-bold uppercase tracking-wider text-white">
        Template Promosi UMKM
      </tspan>
      <tspan className="fill-white/50 text-[14px]"> ✦ </tspan>
      <tspan className="font-serif italic text-white" style={{ fontFamily: 'var(--font-serif)' }}>
        Buka Langsung di Canva HP
      </tspan>
      <tspan className="fill-white/50 text-[14px]"> ✦ </tspan>
      <tspan className="font-sans font-bold uppercase tracking-wider text-white">
        Formula Prompt AI
      </tspan>
      <tspan className="fill-white/50 text-[14px]"> ✦ </tspan>
      <tspan className="font-serif italic text-white" style={{ fontFamily: 'var(--font-serif)' }}>
        Bebas Royalti Komersial
      </tspan>
      <tspan className="fill-white/50 text-[14px]"> ✦ </tspan>
      <tspan className="font-sans font-bold uppercase tracking-wider text-white">
        Format PNG &amp; JPG HD
      </tspan>
      <tspan className="fill-white/50 text-[14px]"> ✦ </tspan>
      <tspan className="font-serif italic text-white" style={{ fontFamily: 'var(--font-serif)' }}>
        Mulai Rp 40 Ribuan
      </tspan>
      <tspan className="fill-white/50 text-[14px]"> ✦ </tspan>
      <tspan className="font-sans font-bold uppercase tracking-wider text-white">
        Siap Posting Seketika
      </tspan>
      <tspan className="fill-white/50 text-[14px]"> ✦ </tspan>
    </tspan>
  );

  return (
    <section className="relative w-full overflow-hidden bg-[#0075de] py-6 sm:py-10 select-none shadow-md">
      {/* Subtle top & bottom ambient glow inside the blue banner */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0060b8]/40 via-transparent to-[#0055a3]/40 pointer-events-none" />

      <div className="relative w-full">
        <svg
          viewBox="0 0 1600 220"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-44 sm:h-56 md:h-64 pointer-events-none"
        >
          <defs>
            <path id="wave-center-path" d={WAVE_PATH_D} fill="none" />
            <linearGradient id="wave-ribbon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
            </linearGradient>
          </defs>

          {/* Wavy Ribbon Band behind text */}
          <path
            d={WAVE_PATH_D}
            fill="none"
            stroke="url(#wave-ribbon-gradient)"
            strokeWidth="74"
            strokeLinecap="round"
          />

          {/* Ribbon Border Guide Lines */}
          <path
            d={WAVE_PATH_D}
            fill="none"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.5"
            transform="translate(0, -37)"
          />
          <path
            d={WAVE_PATH_D}
            fill="none"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.5"
            transform="translate(0, 37)"
          />

          {/* Flowing White Text along the Wave Path */}
          <text
            fill="#ffffff"
            fontSize="19"
            letterSpacing="0.04em"
            dominantBaseline="central"
            alignmentBaseline="middle"
            className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
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
              {renderPatternUnit(false)}
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}
