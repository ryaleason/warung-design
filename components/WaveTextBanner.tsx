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
        Template Promosi UMKM
      </tspan>
      <tspan className="fill-white/60 text-[14px]"> ✦ </tspan>
      <tspan
        className="font-serif italic text-white"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Buka Langsung di Canva HP
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
        Format PNG &amp; JPG HD
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
        Siap Posting Seketika
      </tspan>
      <tspan className="fill-white/60 text-[14px]"> ✦ </tspan>
    </tspan>
  );

  return (
    <section className="relative w-full overflow-hidden py-3 sm:py-6 select-none bg-transparent">
      <div className="relative w-full">
        <svg
          viewBox="0 0 1600 260"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-44 sm:h-52 md:h-60 pointer-events-none drop-shadow-[0_10px_24px_rgba(0,117,222,0.22)]"
        >
          <defs>
            <path id="wave-center-path" d={WAVE_PATH_D} fill="none" />
            <linearGradient id="wave-ribbon-blue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#006cd2" />
              <stop offset="50%" stopColor="#0075de" />
              <stop offset="100%" stopColor="#006cd2" />
            </linearGradient>
          </defs>

          {/* Wavy Blue Ribbon Band - follows the wave curvature */}
          <path
            d={WAVE_PATH_D}
            fill="none"
            stroke="url(#wave-ribbon-blue)"
            strokeWidth="84"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Flowing White Text along the Wave Path */}
          <text
            fill="#ffffff"
            fontSize="18.5"
            letterSpacing="0.03em"
            dominantBaseline="central"
            alignmentBaseline="middle"
            className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
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
