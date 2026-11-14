'use client';

import { useState } from 'react';
import {
  Plus,
  Brain,
  Mic,
  AudioLines,
  ArrowUp,
  Copy,
  Check,
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
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const [output, setOutput] = useState<{
    summary: string;
    promptFinal: string;
    assumptions: string[];
    variations: string[];
  } | null>(null);

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
    <div className="relative mx-auto w-full max-w-4xl text-center py-4" id="ai-generator">
      {/* ChatGPT-Style Centered Heading */}
      <h2 className="text-2xl sm:text-4xl font-medium text-white tracking-tight mb-2 sm:mb-3 drop-shadow-sm">
        What&apos;s on your mind today?
      </h2>
      <p className="text-white/70 text-[13.5px] sm:text-[14.5px] mb-6 sm:mb-8 font-normal drop-shadow-xs max-w-xl mx-auto">
        Ketik ide poster atau feed Instagram Anda dalam bahasa santai sehari-hari.
      </p>

      {/* ChatGPT-Style Capsule Input Bar */}
      <form onSubmit={handleGenerate} className="max-w-2xl sm:max-w-3xl mx-auto">
        <div className="relative flex items-center gap-1.5 sm:gap-2.5 rounded-full bg-[#212121]/95 sm:bg-[#212121] border border-white/[0.14] shadow-[0_16px_40px_rgba(0,0,0,0.4)] px-3 sm:px-4 py-2 sm:py-2.5 transition-all focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/10">
          {/* Plus Action Button */}
          <button
            type="button"
            onClick={() => setPrompt('')}
            title="Reset ide"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="h-5 w-5" />
          </button>

          {/* Input Text */}
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask ChatGPT / Ketik ide desain poster..."
            className="flex-1 bg-transparent px-2 text-[14.5px] sm:text-[15.5px] text-white placeholder:text-white/40 focus:outline-none"
          />

          {/* Think Pill Button */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 text-[13px] font-medium transition-colors shrink-0 select-none cursor-default">
            <Brain className="h-4 w-4 text-white/80" />
            <span>Think</span>
          </div>

          {/* Microphone Icon */}
          <button
            type="button"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <Mic className="h-4 w-4" />
          </button>

          {/* Circular Blue Action Button */}
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0075de] hover:bg-[#0060b8] disabled:opacity-40 disabled:hover:bg-[#0075de] text-white transition-all shadow-md shrink-0 cursor-pointer"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
            ) : prompt.trim() ? (
              <ArrowUp className="h-5 w-5 text-white" />
            ) : (
              <AudioLines className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </form>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-2xl sm:max-w-3xl mx-auto text-[12px]">
        {SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPrompt(item)}
            className="rounded-full border border-white/15 bg-black/40 hover:bg-black/60 text-white/75 hover:text-white px-3.5 py-1.5 transition-all backdrop-blur-sm cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>

      {errorMsg && (
        <p className="mt-4 max-w-2xl mx-auto text-[12.5px] text-red-200 bg-red-950/80 border border-red-500/30 rounded-xl p-3 text-center">
          {errorMsg}
        </p>
      )}

      {/* AI Output Result Card */}
      {output && (
        <div className="mt-8 max-w-3xl mx-auto rounded-2xl border border-white/15 bg-[#171717]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 text-left text-white space-y-6">
          {/* 1. Ringkasan Brief */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
              1. Ringkasan Brief
            </span>
            <p className="text-[14.5px] font-medium text-white leading-relaxed">
              {output.summary}
            </p>
          </div>

          {/* 2. Prompt Final Code Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                2. Formula Prompt Siap Pakai (English)
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 text-[12px] font-medium text-white transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
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

            <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4 font-mono text-[12px] text-slate-200 leading-relaxed whitespace-pre-wrap break-words shadow-inner max-h-96 overflow-y-auto select-all">
              {output.promptFinal}
            </div>
          </div>

          {/* 3. Asumsi & Variasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-white/10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 block mb-2">
                3. Asumsi Desain:
              </span>
              <ul className="space-y-1.5 text-[12.5px] text-white/75 list-disc list-inside">
                {output.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 block mb-2">
                4. Variasi Arah Visual:
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
