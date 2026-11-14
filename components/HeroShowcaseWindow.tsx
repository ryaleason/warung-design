'use client';

import { useState, useRef } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface HeroShowcaseWindowProps {
  featuredBundle?: any;
}

const CATEGORY_OPTIONS = [
  { letter: 'A', label: 'Kuliner, Cafe & F&B', value: 'Kuliner, Cafe & F&B' },
  { letter: 'B', label: 'Travel, Wisata & Umrah', value: 'Travel, Wisata & Umrah' },
  { letter: 'C', label: 'Properti & Real Estate', value: 'Properti & Real Estate' },
  { letter: 'D', label: 'Fashion, Hijab & Beauty', value: 'Fashion, Hijab & Beauty' },
  { letter: 'E', label: 'Jasa Profesional & Acara', value: 'Jasa Profesional & Acara' },
  { letter: 'F', label: 'Retail & Produk Konsumen', value: 'Retail & Produk Konsumen' },
];

const GOAL_OPTIONS = [
  {
    letter: 'A',
    label: 'Ucapan Hari Besar & Peringatan Nasional (Ramadhan, Idul Fitri, Hari Pahlawan)',
    value: 'Ucapan Hari Besar & Peringatan Nasional (Ramadhan, Idul Fitri, Hari Pahlawan)',
  },
  {
    letter: 'B',
    label: 'Promo Penjualan & Diskon Terbatas (Flash Sale, Bundling)',
    value: 'Promo Penjualan & Diskon Terbatas (Flash Sale, Bundling)',
  },
  {
    letter: 'C',
    label: 'Peluncuran Produk atau Menu Baru',
    value: 'Peluncuran Produk atau Menu Baru',
  },
  {
    letter: 'D',
    label: 'Info Event, Kajian, Workshop & Seminar',
    value: 'Info Event, Kajian, Workshop & Seminar',
  },
  {
    letter: 'E',
    label: 'Profil Brand & Pengumuman Resmi',
    value: 'Profil Brand & Pengumuman Resmi',
  },
];

const VISUAL_STYLE_OPTIONS = [
  {
    letter: 'A',
    label: 'Sinematik 3D & Landmark Megah (Objek monumental, cahaya volumetrik, depth-of-field)',
    value: 'Sinematik 3D & Landmark Megah (Objek monumental, cahaya volumetrik, depth-of-field)',
  },
  {
    letter: 'B',
    label: 'Kolase Dinamis & Partikel Melayang (Pita berkibar, foto melayang berbayang, bokeh)',
    value: 'Kolase Dinamis & Partikel Melayang (Pita berkibar, foto melayang berbayang, bokeh)',
  },
  {
    letter: 'C',
    label: 'Editorial Mewah & Elegan (Tipografi serif tegas, pencahayaan studio bersih & eksklusif)',
    value: 'Editorial Mewah & Elegan (Tipografi serif tegas, pencahayaan studio bersih & eksklusif)',
  },
  {
    letter: 'D',
    label: 'Hangat & Atmosferik (Golden hour sunbeams, tekstur natural lembut)',
    value: 'Hangat & Atmosferik (Golden hour sunbeams, tekstur natural lembut)',
  },
];

const FORMAT_OPTIONS = [
  {
    letter: 'A',
    label: 'Feed Instagram Portrait 4:5 (1080x1350) — Format Rekomendasi Feed',
    value: 'Feed Instagram Portrait 4:5 (1080x1350)',
  },
  {
    letter: 'B',
    label: 'Feed Instagram Persegi 1:1 (1080x1080)',
    value: 'Feed Instagram Persegi 1:1 (1080x1080)',
  },
  {
    letter: 'C',
    label: 'Story & Reels Vertikal 9:16 (1080x1920)',
    value: 'Story & Reels Vertikal 9:16 (1080x1920)',
  },
];

export default function HeroShowcaseWindow({ featuredBundle }: HeroShowcaseWindowProps = {}) {
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [goal, setGoal] = useState(GOAL_OPTIONS[0].value);
  const [visualStyle, setVisualStyle] = useState(VISUAL_STYLE_OPTIONS[0].value);
  const [format, setFormat] = useState(FORMAT_OPTIONS[0].value);
  const [extraDetail, setExtraDetail] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const [output, setOutput] = useState<{
    summary: string;
    promptFinal: string;
    assumptions: string[];
    variations: string[];
  } | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!brandName.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai/generate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brandName.trim(),
          category,
          goal,
          visualStyle,
          format,
          extraDetail: extraDetail.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal meracik formula prompt desain.');
      }

      setOutput({
        summary: json.data.summary || 'Ringkasan konsep desain estetik.',
        promptFinal: json.data.promptFinal || json.data.visualPrompt || '',
        assumptions: Array.isArray(json.data.assumptions)
          ? json.data.assumptions
          : [json.data.caption].filter(Boolean),
        variations: Array.isArray(json.data.variations)
          ? json.data.variations
          : [json.data.designTips].filter(Boolean),
      });

      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kendala saat meracik formula prompt.');
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

  const handleReset = () => {
    setBrandName('');
    setCategory(CATEGORY_OPTIONS[0].value);
    setGoal(GOAL_OPTIONS[0].value);
    setVisualStyle(VISUAL_STYLE_OPTIONS[0].value);
    setFormat(FORMAT_OPTIONS[0].value);
    setExtraDetail('');
    setOutput(null);
    setErrorMsg('');
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl text-center py-4" id="ai-generator">
      {/* Studio Header */}
      <div className="max-w-2xl mx-auto mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight mb-3 drop-shadow-md">
          Studio Racik Prompt Desain Estetik
        </h2>
        <p className="text-white/80 text-[14px] sm:text-[15.5px] font-normal leading-relaxed drop-shadow-sm">
          Jawab kuesioner singkat di bawah ini. AI Art Director kami akan otomatis menyusun formula prompt poster komersial berstandar agensi dengan kedalaman visual tinggi.
        </p>
      </div>

      {/* Main Questionnaire Card */}
      <form
        onSubmit={handleGenerate}
        className="rounded-2xl border border-white/15 bg-[#161618]/92 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.55)] p-5 sm:p-8 text-left text-white space-y-7"
      >
        {/* 1. Nama Brand (Input Teks) */}
        <div className="space-y-2">
          <label className="block text-[13.5px] font-semibold text-white/95 tracking-wide">
            1. Apa nama brand atau usaha Anda?
            <span className="text-[#0075de] ml-1 font-bold">*</span>
          </label>
          <input
            type="text"
            required
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Ketik nama brand Anda (contoh: Cahaya Multazam, Altha Property, Kopi Sejiwa...)"
            style={{ outline: 'none', border: '1px solid rgba(255,255,255,0.18)', boxShadow: 'none' }}
            className="w-full rounded-xl bg-black/45 px-4 py-3 text-[14.5px] text-white placeholder:text-white/40 focus:border-white/40 outline-none transition-all"
          />
        </div>

        {/* 2. Kategori Usaha (Pilihan Tombol A, B, C, D, E, F) */}
        <div className="space-y-2.5">
          <label className="block text-[13.5px] font-semibold text-white/95 tracking-wide">
            2. Apa bidang usaha Anda?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
            {CATEGORY_OPTIONS.map((opt) => {
              const isSelected = category === opt.value;
              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() => setCategory(opt.value)}
                  className={`flex items-center text-left gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0075de] border-[#0075de] text-white shadow-md'
                      : 'bg-black/35 hover:bg-black/55 border-white/15 text-white/80 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                      isSelected ? 'bg-white text-[#0075de]' : 'bg-white/10 text-white/75'
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <span className="text-[13px] font-medium leading-snug">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Tujuan Desain (Pilihan Tombol A, B, C, D, E) */}
        <div className="space-y-2.5">
          <label className="block text-[13.5px] font-semibold text-white/95 tracking-wide">
            3. Apa momen atau tujuan poster ini?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {GOAL_OPTIONS.map((opt) => {
              const isSelected = goal === opt.value;
              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() => setGoal(opt.value)}
                  className={`flex items-start text-left gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0075de] border-[#0075de] text-white shadow-md'
                      : 'bg-black/35 hover:bg-black/55 border-white/15 text-white/80 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold mt-0.5 ${
                      isSelected ? 'bg-white text-[#0075de]' : 'bg-white/10 text-white/75'
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <span className="text-[13px] font-medium leading-snug">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Gaya Visual Estetik (Pilihan Tombol A, B, C, D) */}
        <div className="space-y-2.5">
          <label className="block text-[13.5px] font-semibold text-white/95 tracking-wide">
            4. Gaya visual estetik yang diinginkan?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {VISUAL_STYLE_OPTIONS.map((opt) => {
              const isSelected = visualStyle === opt.value;
              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() => setVisualStyle(opt.value)}
                  className={`flex items-start text-left gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0075de] border-[#0075de] text-white shadow-md'
                      : 'bg-black/35 hover:bg-black/55 border-white/15 text-white/80 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold mt-0.5 ${
                      isSelected ? 'bg-white text-[#0075de]' : 'bg-white/10 text-white/75'
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <span className="text-[13px] font-medium leading-snug">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Format Kanvas (Pilihan Tombol A, B, C) */}
        <div className="space-y-2.5">
          <label className="block text-[13.5px] font-semibold text-white/95 tracking-wide">
            5. Format dan ukuran kanvas?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {FORMAT_OPTIONS.map((opt) => {
              const isSelected = format === opt.value;
              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() => setFormat(opt.value)}
                  className={`flex items-start text-left gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0075de] border-[#0075de] text-white shadow-md'
                      : 'bg-black/35 hover:bg-black/55 border-white/15 text-white/80 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold mt-0.5 ${
                      isSelected ? 'bg-white text-[#0075de]' : 'bg-white/10 text-white/75'
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <span className="text-[13px] font-medium leading-snug">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Detail Khusus (Input Teks Opsional) */}
        <div className="space-y-2">
          <label className="block text-[13.5px] font-semibold text-white/95 tracking-wide">
            6. Detail penawaran atau tanggal khusus (Opsional):
          </label>
          <input
            type="text"
            value={extraDetail}
            onChange={(e) => setExtraDetail(e.target.value)}
            placeholder="Contoh: Diskon 20% weekend, 10 November 2025, Marhaban yaa Ramadhan 1447 H..."
            style={{ outline: 'none', border: '1px solid rgba(255,255,255,0.18)', boxShadow: 'none' }}
            className="w-full rounded-xl bg-black/45 px-4 py-3 text-[14.5px] text-white placeholder:text-white/40 focus:border-white/40 outline-none transition-all"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isGenerating || !brandName.trim()}
            className="w-full sm:flex-1 flex items-center justify-center gap-2.5 rounded-xl bg-[#0075de] hover:bg-[#0060b8] disabled:opacity-40 disabled:hover:bg-[#0075de] text-white font-semibold py-3.5 px-6 text-[15px] shadow-lg transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Meracik Formula Desain Estetik...</span>
              </>
            ) : (
              <>
                <span>Racik Formula Prompt Desain Estetik</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {(brandName.trim() || output) && (
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-3.5 text-[14px] text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Jawaban</span>
            </button>
          )}
        </div>

        {!brandName.trim() && (
          <p className="text-[12px] text-white/50 text-center">
            * Silakan isi nama brand Anda pada pertanyaan nomor 1 untuk mulai meracik formula.
          </p>
        )}
      </form>

      {errorMsg && (
        <div className="mt-6 max-w-3xl mx-auto text-[13px] text-red-200 bg-red-950/80 border border-red-500/30 rounded-xl p-4 text-center">
          {errorMsg}
        </div>
      )}

      {/* Output Card: Only shown when output is ready */}
      {output && (
        <div
          ref={resultRef}
          className="mt-8 max-w-3xl mx-auto rounded-2xl border border-white/15 bg-[#161618]/95 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-6 sm:p-8 text-left text-white space-y-6"
        >
          {/* 1. Ringkasan Konsep Visual */}
          <div className="space-y-1.5 pb-2 border-b border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
              1. Ringkasan Konsep Desain Estetik
            </span>
            <p className="text-[15px] font-medium text-white leading-relaxed">
              {output.summary}
            </p>
          </div>

          {/* 2. Formula Prompt Siap Pakai Code Box */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                2. Formula Prompt Siap Pakai (English)
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0075de] hover:bg-[#0060b8] px-3.5 py-1.5 text-[12px] font-medium text-white transition-colors cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>Prompt Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-white" />
                    <span>Salin Prompt</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0d0d0f] p-4 sm:p-5 font-mono text-[12px] sm:text-[12.5px] text-slate-200 leading-relaxed whitespace-pre-wrap break-words shadow-inner max-h-[420px] overflow-y-auto select-all">
              {output.promptFinal}
            </div>
            <p className="text-[11.5px] text-white/50">
              Salin dan tempel prompt di atas ke Midjourney, DALL-E 3, atau generator gambar AI pilihan Anda.
            </p>
          </div>

          {/* 3. Asumsi Desain & 4. Variasi Arah Visual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-white/10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 block mb-2">
                3. Asumsi Desain yang Diterapkan:
              </span>
              <ul className="space-y-1.5 text-[12.5px] text-white/75 list-disc list-inside">
                {output.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 block mb-2">
                4. Variasi Arah Visual Alternatif:
              </span>
              <ul className="space-y-1.5 text-[12.5px] text-white/75 list-disc list-inside">
                {output.variations.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
