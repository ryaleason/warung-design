'use client';

import { useState, useRef } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
} from 'lucide-react';
import type { DynamicQuestion } from '@/app/api/ai/generate-promo/route';
import Fan3DCarousel from '@/components/Fan3DCarousel';

interface HeroShowcaseWindowProps {
  featuredBundle?: any;
}

const SAMPLE_BRIEFS = [
  'bikin poster promo kopi diskon 20% weekend',
  'poster ucapan ramadhan travel umroh',
  'poster hari pahlawan untuk kantor properti',
  'feed ig baju gamis lebaran diskon buy 1 get 1',
  'promo menu baru croissant pastry cafe',
  'open recruitment barista cafe bandung',
];

export default function HeroShowcaseWindow({ featuredBundle }: HeroShowcaseWindowProps = {}) {
  // Step: 'input' -> 'questionnaire' -> 'result'
  const [step, setStep] = useState<'input' | 'questionnaire' | 'result'>('input');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Dynamic Questions from AI
  const [briefUnderstanding, setBriefUnderstanding] = useState('');
  const [questions, setQuestions] = useState<DynamicQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Final Output
  const [output, setOutput] = useState<{
    summary: string;
    promptFinal: string;
    assumptions: string[];
    variations: string[];
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Analyze initial prompt & fetch dynamic AI questions
  const handleAnalyze = async (promptText?: string) => {
    const textToSubmit = (promptText || initialPrompt).trim();
    if (!textToSubmit || isAnalyzing) return;

    if (promptText) {
      setInitialPrompt(promptText);
    }

    setIsAnalyzing(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/ai/generate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'questions',
          initialPrompt: textToSubmit,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menganalisis ide awal.');
      }

      const qList: DynamicQuestion[] = json.data.questions || [];
      setBriefUnderstanding(json.data.briefUnderstanding || `Konsep desain untuk "${textToSubmit}"`);
      setQuestions(qList);

      // Pre-fill default answers for choice questions
      const initialAnswers: Record<string, string> = { ...answers };
      qList.forEach((q) => {
        if (q.type === 'choice' && q.options && q.options.length > 0 && !initialAnswers[q.id]) {
          initialAnswers[q.id] = q.options[0].value;
        }
      });
      setAnswers(initialAnswers);
      setStep('questionnaire');

      // Scroll to view
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kendala saat menganalisis ide.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Generate final prompt from dynamic answers
  const handleGenerateFinal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isGenerating) return;

    // Check if required text questions (like brandName) are filled
    const requiredQuestions = questions.filter(
      (q) => q.type === 'text' && q.required !== false && (q.id === 'brandName' || q.required === true)
    );
    for (const rq of requiredQuestions) {
      if (!answers[rq.id]?.trim()) {
        setErrorMsg(`Silakan lengkapi jawaban untuk: "${rq.question}"`);
        return;
      }
    }

    setIsGenerating(true);
    setErrorMsg('');

    try {
      const answersPayload = questions.map((q) => ({
        questionId: q.id,
        question: q.question,
        answer: answers[q.id] || '',
      }));

      const res = await fetch('/api/ai/generate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'prompt',
          initialPrompt: initialPrompt.trim(),
          briefUnderstanding,
          answers: answersPayload,
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

      setStep('result');

      // Scroll to view
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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

  const handleResetAll = () => {
    setInitialPrompt('');
    setQuestions([]);
    setAnswers({});
    setOutput(null);
    setErrorMsg('');
    setStep('input');
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-4xl text-center py-4"
      id="ai-generator"
    >
      {/* ========================================================= */}
      {/* STEP 1: INITIAL PROMPT INPUT                              */}
      {/* ========================================================= */}
      {step === 'input' && (
        <div className="space-y-6 sm:space-y-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight mb-3 drop-shadow-md">
              Mau buat poster atau postingan apa hari ini?
            </h2>
            <p className="text-white/80 text-[14px] sm:text-[15.5px] font-normal leading-relaxed drop-shadow-sm">
              Ketik ide poster atau feed Instagram Anda dalam bahasa santai sehari-hari. AI Art Director kami akan menganalisis brief dan memberikan pertanyaan penuntun otomatis.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="max-w-2xl sm:max-w-3xl mx-auto"
          >
            <div className="relative flex items-center gap-2 rounded-2xl bg-[#161618]/92 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 sm:p-2.5 transition-all">
              <input
                type="text"
                value={initialPrompt}
                onChange={(e) => setInitialPrompt(e.target.value)}
                placeholder="Contoh: bikin poster promo kopi diskon 20% weekend..."
                style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                className="flex-1 bg-transparent px-3 sm:px-4 py-2 text-[14.5px] sm:text-[16px] text-white placeholder:text-white/40 border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 shadow-none"
              />
              <button
                type="submit"
                disabled={isAnalyzing || !initialPrompt.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0075de] hover:bg-[#0060b8] disabled:opacity-40 disabled:hover:bg-[#0075de] text-white font-semibold px-5 sm:px-6 py-3 text-[14px] sm:text-[14.5px] transition-all shadow-md shrink-0 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Menganalisis Brief...</span>
                  </>
                ) : (
                  <>
                    <span>Lanjutkan</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl sm:max-w-3xl mx-auto text-[12px]">
            {SAMPLE_BRIEFS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleAnalyze(item)}
                className="rounded-full border border-white/15 bg-black/40 hover:bg-black/60 text-white/75 hover:text-white px-3.5 py-1.5 transition-all backdrop-blur-sm cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="max-w-2xl mx-auto text-[13px] text-red-200 bg-red-950/80 border border-red-500/30 rounded-xl p-3.5 text-center">
              {errorMsg}
            </div>
          )}

          {/* 3D Fan Carousel Showcase (Kipas 3D Inspirasi Desain) */}
          <div className="pt-2 sm:pt-4">
            <Fan3DCarousel onSelectPrompt={(p) => handleAnalyze(p)} />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: DYNAMIC AI QUESTIONNAIRE                           */}
      {/* ========================================================= */}
      {step === 'questionnaire' && (
        <div className="space-y-6 sm:space-y-8 text-left">
          {/* Header & Brief Recall */}
          <div className="rounded-2xl border border-white/15 bg-[#161618]/92 backdrop-blur-xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
                  Ide Awal Anda:
                </span>
                <p className="text-[16px] sm:text-[17px] font-semibold text-white mt-0.5">
                  &ldquo;{initialPrompt}&rdquo;
                </p>
                {briefUnderstanding && (
                  <p className="text-[13px] text-white/70 mt-1">
                    {briefUnderstanding}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setStep('input')}
                className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-[12.5px] text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Ganti Ide Awal</span>
              </button>
            </div>

            {/* Dynamic Questions Form */}
            <form onSubmit={handleGenerateFinal} className="pt-6 space-y-7">
              {questions.map((q, qIndex) => (
                <div key={q.id || qIndex} className="space-y-2.5">
                  <label className="block text-[14px] font-semibold text-white/95 tracking-wide">
                    {qIndex + 1}. {q.question}
                    {q.type === 'text' && (q.required !== false && (q.id === 'brandName' || q.required === true)) ? (
                      <span className="text-[#0075de] ml-1 font-bold">*</span>
                    ) : q.type === 'text' ? (
                      <span className="text-white/40 ml-1.5 text-[12px] font-normal">(Opsional)</span>
                    ) : null}
                  </label>

                  {/* Text Input (e.g., Nama Brand, Detail Kontak) */}
                  {q.type === 'text' && (
                    <input
                      type="text"
                      required={q.required !== false && (q.id === 'brandName' || q.required === true)}
                      value={answers[q.id] || ''}
                      onChange={(e) =>
                        setAnswers({ ...answers, [q.id]: e.target.value })
                      }
                      placeholder={q.placeholder || 'Ketik jawaban Anda...'}
                      style={{
                        outline: 'none',
                        border: '1px solid rgba(255,255,255,0.18)',
                        boxShadow: 'none',
                      }}
                      className="w-full rounded-xl bg-black/45 px-4 py-3 text-[14.5px] text-white placeholder:text-white/40 focus:border-white/40 outline-none transition-all"
                    />
                  )}

                  {/* Choice Buttons (A, B, C, D) */}
                  {q.type === 'choice' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id] === opt.value;
                        const isColorPalette = Array.isArray(opt.colors) && opt.colors.length === 3;

                        if (isColorPalette) {
                          return (
                            <button
                              key={opt.letter}
                              type="button"
                              onClick={() =>
                                setAnswers({ ...answers, [q.id]: opt.value })
                              }
                              className={`flex flex-col text-left gap-2.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#0075de]/15 border-[#0075de] ring-1 ring-[#0075de] text-white shadow-lg'
                                  : 'bg-black/35 hover:bg-black/55 border-white/15 text-white/80 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                                      isSelected
                                        ? 'bg-[#0075de] text-white'
                                        : 'bg-white/10 text-white/75'
                                    }`}
                                  >
                                    {opt.letter}
                                  </span>
                                  <span className="text-[13px] font-medium leading-snug">
                                    {opt.label}
                                  </span>
                                </div>
                                {isSelected && (
                                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0075de] text-white shrink-0">
                                    <Check className="h-3 w-3" />
                                  </span>
                                )}
                              </div>

                              {/* 3 Color Swatches Band */}
                              <div className="w-full rounded-lg overflow-hidden border border-white/20 shadow-xs">
                                <div className="grid grid-cols-3 h-8 w-full">
                                  {opt.colors!.map((c, cIdx) => (
                                    <div
                                      key={cIdx}
                                      style={{ backgroundColor: c }}
                                      className="h-full w-full"
                                      title={c}
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* Hex codes */}
                              <div className="grid grid-cols-3 text-center text-[10.5px] font-mono text-white/60 tracking-tight">
                                {opt.colors!.map((c, cIdx) => (
                                  <span key={cIdx}>{c}</span>
                                ))}
                              </div>
                            </button>
                          );
                        }

                        return (
                          <button
                            key={opt.letter}
                            type="button"
                            onClick={() =>
                              setAnswers({ ...answers, [q.id]: opt.value })
                            }
                            className={`flex items-start text-left gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#0075de] border-[#0075de] text-white shadow-md'
                                : 'bg-black/35 hover:bg-black/55 border-white/15 text-white/80 hover:text-white'
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold mt-0.5 ${
                                isSelected
                                  ? 'bg-white text-[#0075de]'
                                  : 'bg-white/10 text-white/75'
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
                  )}
                </div>
              ))}

              {errorMsg && (
                <div className="text-[13px] text-red-200 bg-red-950/80 border border-red-500/30 rounded-xl p-3.5 text-center">
                  {errorMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2.5 rounded-xl bg-[#0075de] hover:bg-[#0060b8] disabled:opacity-40 text-white font-semibold py-3.5 px-6 text-[15px] shadow-lg transition-all cursor-pointer"
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

                <button
                  type="button"
                  onClick={handleResetAll}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-3.5 text-[14px] text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Mulai Ulang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 3: RESULT OUTPUT CARD                                */}
      {/* ========================================================= */}
      {step === 'result' && output && (
        <div className="space-y-6 sm:space-y-8 text-left">
          <div className="rounded-2xl border border-white/15 bg-[#161618]/95 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-6 sm:p-8 space-y-6">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <button
                type="button"
                onClick={() => setStep('questionnaire')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-[12.5px] text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Ubah Jawaban Kuesioner</span>
              </button>

              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-[12.5px] text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Buat Poster Baru</span>
              </button>
            </div>

            {/* 1. Ringkasan Konsep Visual */}
            <div className="space-y-1.5">
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
        </div>
      )}
    </div>
  );
}
