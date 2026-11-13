'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

const SUGGESTIONS = [
  'bikin poster promo kopi diskon 20% weekend',
  'poster open recruitment barista cafe bandung',
  'feed ig baju gamis lebaran diskon buy 1 get 1',
  'promo menu baru croissant pastry cafe',
  'pengumuman libur operasional idul fitri toko sembako',
];

interface HeroShowcaseWindowProps {
  featuredBundle?: any;
}

export default function HeroShowcaseWindow({ featuredBundle }: HeroShowcaseWindowProps = {}) {
  const [prompt, setPrompt] = useState('bikin poster promo kopi diskon 20% weekend');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const [output, setOutput] = useState<{
    summary: string;
    promptFinal: string;
    assumptions: string[];
    variations: string[];
  }>({
    summary:
      'Poster promo kopi, diskon 20% khusus weekend, untuk feed Instagram (4:5).',
    promptFinal: `[FORMAT] 4:5 vertical (1080x1350), Instagram feed promo poster
[CONCEPT] A single large iced coffee cup as hero, bold "20%" as the dominant number
[STYLE] Flat vector illustration, solid colors only, no gradients, warm cafe feel
[COMPOSITION] Cup centered-right occupying 45% of canvas, headline top-left, discount number large in the middle-left, CTA bar at bottom, 6% safe margin
[COLOR PALETTE] Background solid #F4E9DC cream, primary solid #4A2C1A dark brown, accent solid #E4572E orange, text solid #1A1A1A
[TYPOGRAPHY] Headline in heavy geometric sans-serif, uppercase, tight leading; supporting text in clean medium-weight sans-serif; left-aligned
[TEXT CONTENT] "WEEKEND COFFEE SALE" top-left, dark brown; "20%" huge, orange; "OFF" smaller next to it; "Sabtu - Minggu" medium size; "[NAMA CAFE]" bottom in solid brown bar, cream text, render text exactly as written, no extra words, no misspellings
[BACKGROUND & DETAILS] Flat cream background, a few small solid coffee-bean shapes, no shadows
[LIGHTING/MOOD] Bright clean lighting, inviting weekend atmosphere
[QUALITY] high resolution, sharp crisp text, clean edges, professional graphic design
[NEGATIVE] gradients, glow, neon, glassmorphism, blurry or misspelled text, extra words, clutter, watermark`,
    assumptions: [
      'Format default menggunakan feed 4:5 vertikal (1080x1350) optimal untuk layar smartphone.',
      'Nama cafe menggunakan placeholder [NAMA CAFE] agar bisa disesuaikan dengan usaha Anda.',
      'Gaya visual flat vector solid tanpa gradasi untuk keterbacaan maksimal.',
    ],
    variations: [
      'Arah Visual Playful: Karakter cangkir kopi kartun minimalis dengan tipografi santai.',
      'Arah Visual Premium: Foto produk kopi terisolasi di atas latar solid gelap dengan sentuhan warna emas.',
    ],
  });

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai/generate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal meracik prompt desain.');
      }

      setOutput({
        summary: json.data.summary || 'Ringkasan materi promosi desain.',
        promptFinal: json.data.promptFinal || json.data.visualPrompt || '',
        assumptions: Array.isArray(json.data.assumptions)
          ? json.data.assumptions
          : [json.data.caption].filter(Boolean),
        variations: Array.isArray(json.data.variations)
          ? json.data.variations
          : [json.data.designTips].filter(Boolean),
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses generasi prompt.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!output?.promptFinal) return;
    navigator.clipboard.writeText(output.promptFinal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl text-left" id="ai-generator">
      {/* Studio Surface Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_50px_-12px_rgba(2,12,40,0.18)] p-6 sm:p-10 transition-all">
        {/* Header Brief */}
        <div className="max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0075de] block mb-1">
            Art Director &amp; Prompt Generator
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Mau buat poster atau postingan apa hari ini?
          </h2>
          <p className="text-[14px] text-slate-500 mt-1.5 leading-relaxed">
            Ketik ide promosi Anda dengan bahasa santai sehari-hari. AI Art Director kami akan meracik formula prompt visual yang spesifik, proporsional, dan siap disalin ke Midjourney, DALL-E 3, atau generator gambar lainnya.
          </p>
        </div>

        {/* Single Input Bar (ChatGPT Style) */}
        <form onSubmit={handleGenerate} className="mt-6">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-xs transition-all focus-within:border-[#0075de] focus-within:ring-4 focus-within:ring-[#0075de]/10">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: bikin poster promo kopi diskon 20% weekend, feed IG baju gamis..."
              className="w-full bg-transparent px-4 py-3 text-[14.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0075de] hover:bg-[#0060b8] disabled:opacity-60 text-white px-6 py-3.5 text-[14px] font-semibold transition-all shadow-xs cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Meracik Prompt...</span>
                </>
              ) : (
                <>
                  <span>Racik Prompt Desain</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Suggestion Chips */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[12px]">
          <span className="text-slate-400 font-medium">Contoh ide awam:</span>
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setPrompt(item);
              }}
              className="rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-3 py-1.5 transition-colors cursor-pointer text-left"
            >
              {item}
            </button>
          ))}
        </div>

        {errorMsg && (
          <p className="mt-4 text-[12.5px] text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            {errorMsg}
          </p>
        )}

        {/* Output Showcase */}
        {output && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-[#f8fafc] p-5 sm:p-7 space-y-6">
            {/* 1. Ringkasan Pemahaman */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                1. Ringkasan Brief
              </span>
              <p className="text-[14.5px] font-medium text-slate-900">
                {output.summary}
              </p>
            </div>

            {/* 2. Prompt Final Code Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  2. Formula Prompt Siap Pakai (English)
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0075de] px-3.5 py-1.5 text-[12px] font-semibold text-[#0075de] shadow-2xs transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Prompt Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-[12px] text-slate-800 leading-relaxed whitespace-pre-wrap break-words shadow-2xs max-h-96 overflow-y-auto">
                {output.promptFinal}
              </div>
            </div>

            {/* 3. Asumsi & Variasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  3. Asumsi Desain yang Diambil:
                </span>
                <ul className="space-y-1.5 text-[12.5px] text-slate-600 list-disc list-inside">
                  {output.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  4. Variasi Arah Visual Alternatif:
                </span>
                <ul className="space-y-1.5 text-[12.5px] text-slate-600 list-disc list-inside">
                  {output.variations.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
