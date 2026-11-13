'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Copy,
  Check,
  ShoppingBag,
  ArrowRight,
  Layers,
  Bot,
  Download,
  Zap,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Bundle } from '@/types';
import { formatRupiah } from '@/lib/telegram';

interface HeroShowcaseWindowProps {
  featuredBundle?: Bundle;
}

const BUSINESS_PRESETS = [
  'Kedai Kopi & Cafe Kuliner',
  'Fashion & Hijab Muslimah',
  'Skincare & Klinik Kecantikan',
  'Kuliner & Makanan Ringan',
  'Toko Kelontong & Sembako',
  'Jasa Servis & Percetakan',
];

const MOMENT_PRESETS = [
  'Paket Bukber Ramadhan Hemat',
  'Diskon Gajian Payday Sale',
  'Flash Sale Akhir Pekan (Weekend Deal)',
  'Launching Produk / Menu Baru',
  'Promo Buy 1 Get 1 Free',
];

const TONE_PRESETS = [
  'Hangat & Kekeluargaan',
  'Elegan & Anggun',
  'Mendesak & FOMO',
  'Santai & Akrab',
];

export default function HeroShowcaseWindow({ featuredBundle }: HeroShowcaseWindowProps) {
  const [activeTab, setActiveTab] = useState<'ai-studio' | 'canva-ready'>('ai-studio');

  // Interactive AI Inputs
  const [businessType, setBusinessType] = useState('Kedai Kopi & Cafe Kuliner');
  const [campaignMoment, setCampaignMoment] = useState('Paket Bukber Ramadhan Hemat');
  const [tone, setTone] = useState('Hangat & Kekeluargaan');
  const [productDetail, setProductDetail] = useState('');

  // AI Output & State
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const [aiOutput, setAiOutput] = useState({
    headline: 'Reuni Hangat, Buka Puasa Hemat! Paket Bukber Buy 2 Get 1 Free',
    caption:
      'Bulan Ramadhan tiba, saatnya menjalin silaturahmi bersama keluarga dan sahabat terdekat. Nikmati paket bukber hemat kami dengan menu pilihan kopi dan hidangan istimewa. Dapatkan penawaran Buy 2 Get 1 Free khusus reservasi minggu ini. Hubungi kami via link di bio untuk amankan meja Anda.',
    visualPrompt:
      'cinematic commercial photography of iced caramel macchiato and Indonesian artisanal toast on rustic dark wood, golden hour sunbeam, photorealistic, 8k --ar 1:1',
    designTips:
      'Gunakan palet warna hangat (krem & cokelat kayu), taruh teks judul di area sepertiga atas foto agar tidak menutupi produk.',
  });

  const bundle = featuredBundle || {
    id: 'b1a2c3d4-0001-4000-8000-000000000001',
    name: 'Paket Promo Ramadhan & Idul Fitri',
    slug: 'paket-promo-ramadhan',
    price: 49000,
    preview_images: [
      'https://i.pinimg.com/736x/8a/93/84/8a9384ebb309b7cad4241b11a686164b.jpg',
    ],
    features: [
      '25 Desain Feed & Story HD',
      'Format PNG Transparan & JPG',
      'File Prompt Teks Midjourney & DALL-E 3',
      'Bebas Lisensi Komersial UMKM',
    ],
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai/generate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType,
          campaignMoment,
          tone,
          productDetail: productDetail.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menghasilkan konten dengan AI.');
      }

      const formattedTips = Array.isArray(json.data.designTips)
        ? json.data.designTips.join(' ')
        : json.data.designTips;

      setAiOutput({
        headline: json.data.headline,
        caption: json.data.caption,
        visualPrompt: json.data.visualPrompt,
        designTips: formattedTips,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses generasi AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, type: 'headline' | 'caption' | 'prompt') => {
    navigator.clipboard.writeText(text);
    if (type === 'headline') {
      setCopiedHeadline(true);
      setTimeout(() => setCopiedHeadline(false), 2000);
    } else if (type === 'caption') {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } else {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-6xl" id="ai-generator">
      {/* Main Window Container - Harmonized with Deep Sapphire Background Image */}
      <div className="overflow-hidden rounded-2xl border border-blue-400/25 bg-[#03091e]/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,117,222,0.45),0_0_0_1px_rgba(59,130,246,0.18)] transition-all">
        {/* Window Chrome / Title Bar */}
        <div className="flex items-center justify-between border-b border-blue-500/20 bg-[#071338]/90 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-white/20 inline-block border border-white/10" />
            <span className="h-3 w-3 rounded-full bg-white/20 inline-block border border-white/10" />
            <span className="h-3 w-3 rounded-full bg-white/20 inline-block border border-white/10" />
            <span className="ml-3 text-[12px] sm:text-[13px] font-medium text-blue-100/90 hidden sm:inline-block">
              Warung Desain AI Studio: Generator Promo &amp; E-Commerce Hub
            </span>
          </div>

          {/* Quick Tabs in Title Bar */}
          <div className="flex items-center gap-1.5 bg-[#020718]/60 border border-blue-500/20 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('ai-studio')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11.5px] font-semibold transition-all cursor-pointer ${
                activeTab === 'ai-studio'
                  ? 'bg-[#0075de] text-white shadow-xs'
                  : 'text-blue-200/70 hover:text-white'
              }`}
            >
              <Bot className="h-3.5 w-3.5 text-blue-200" />
              <span>AI Studio Live</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('canva-ready')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11.5px] font-semibold transition-all cursor-pointer ${
                activeTab === 'canva-ready'
                  ? 'bg-[#0075de] text-white shadow-xs'
                  : 'text-blue-200/70 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-blue-300" />
              <span>Aset Desain Jadi</span>
            </button>
          </div>
        </div>

        {/* Window Content: 2-Column Split Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-blue-500/20 bg-transparent">
          {/* Left Column: Interactive AI Studio Generator (7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-6 bg-[#040c24]/85">
            <div>
              {/* Studio Header */}
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#38bdf8]" />
                  <h4 className="text-[14px] font-bold text-white">
                    Generator Promosi Gemini AI
                  </h4>
                </div>
                <span className="text-[12px] text-blue-200/70">
                  Live Powered by Google Gemini
                </span>
              </div>

              {/* Form Input Section */}
              <div className="rounded-xl border border-blue-400/25 bg-[#071744]/75 p-4 space-y-3.5 text-left shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-blue-200/80 mb-1">
                      Jenis Usaha Toko
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full rounded-lg border border-blue-400/30 bg-[#030c26] px-3 py-2 text-[13px] font-medium text-white shadow-2xs focus:border-[#38bdf8] focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
                    >
                      {BUSINESS_PRESETS.map((item) => (
                        <option key={item} value={item} className="bg-[#030c26] text-white">
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-blue-200/80 mb-1">
                      Momen Kampanye Promo
                    </label>
                    <select
                      value={campaignMoment}
                      onChange={(e) => setCampaignMoment(e.target.value)}
                      className="w-full rounded-lg border border-blue-400/30 bg-[#030c26] px-3 py-2 text-[13px] font-medium text-white shadow-2xs focus:border-[#38bdf8] focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
                    >
                      {MOMENT_PRESETS.map((item) => (
                        <option key={item} value={item} className="bg-[#030c26] text-white">
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tone Selectors */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-blue-200/80 mb-1.5">
                    Tone &amp; Gaya Bahasa
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TONE_PRESETS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={`rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-all cursor-pointer ${
                          tone === t
                            ? 'bg-[#0075de] text-white border border-blue-300/40 shadow-[0_0_12px_rgba(0,117,222,0.45)]'
                            : 'bg-[#030c26]/80 border border-blue-400/25 text-blue-200 hover:text-white hover:border-[#38bdf8]/60'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Product Detail Input */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-blue-200/80 mb-1">
                    Detail Tawaran Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    value={productDetail}
                    onChange={(e) => setProductDetail(e.target.value)}
                    placeholder="Contoh: Diskon 20% khusus 50 pembeli pertama"
                    className="w-full rounded-lg border border-blue-400/30 bg-[#030c26] px-3 py-2 text-[13px] text-white placeholder:text-blue-300/40 shadow-2xs focus:border-[#38bdf8] focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
                  />
                </div>

                {/* Trigger Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0060c7] via-[#0075de] to-[#0284c7] hover:brightness-110 disabled:opacity-70 text-white py-2.5 px-4 text-[13.5px] font-semibold transition-all shadow-[0_4px_18px_rgba(0,117,222,0.45)] cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Sedang Meracik dengan Gemini AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Buat Ide Promo dengan Gemini AI</span>
                      </>
                    )}
                  </button>
                </div>

                {errorMsg && (
                  <p className="text-[12px] text-red-200 bg-red-950/70 border border-red-500/40 rounded-md p-2">
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* AI Output Generation Showcase Box */}
              <div className="mt-4 rounded-xl border border-blue-400/25 bg-[#071744]/75 p-4 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] font-bold text-white flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-[#38bdf8]" />
                    Hasil Racikan Copywriting &amp; Prompt AI:
                  </span>
                </div>

                {/* Generated Headline */}
                <div className="rounded-lg bg-[#030c26]/90 border border-blue-400/20 p-3 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-200/80">
                      Headline Poster Promosi
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(aiOutput.headline, 'headline')}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#38bdf8] hover:text-white cursor-pointer"
                    >
                      {copiedHeadline ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Salin Headline</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[14px] font-bold text-white leading-snug">
                    &ldquo;{aiOutput.headline}&rdquo;
                  </p>
                </div>

                {/* Generated Social Media Caption */}
                <div className="rounded-lg bg-[#030c26]/90 border border-blue-400/20 p-3 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-200/80">
                      Caption Feed &amp; Broadcast WhatsApp
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(aiOutput.caption, 'caption')}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#38bdf8] hover:text-white cursor-pointer"
                    >
                      {copiedCaption ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Salin Caption</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[12.5px] text-blue-50/90 leading-relaxed whitespace-pre-line max-h-36 overflow-y-auto pr-1">
                    {aiOutput.caption}
                  </p>
                </div>

                {/* Generated Prompt Formula */}
                <div className="rounded-lg bg-[#030c26]/90 border border-blue-400/20 p-3 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-200/80">
                      Formula Prompt AI Midjourney / DALL-E 3:
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(aiOutput.visualPrompt, 'prompt')}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#38bdf8] hover:text-white cursor-pointer"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Salin Formula</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[12px] font-mono text-blue-200 bg-[#020717] border border-blue-500/20 p-2 rounded-md leading-relaxed break-all">
                    {aiOutput.visualPrompt}
                  </p>
                </div>

                {/* Design Tips */}
                {aiOutput.designTips && (
                  <div className="rounded-lg bg-blue-950/70 border border-blue-400/30 p-2.5 text-[11.5px] text-blue-200 leading-relaxed">
                    <span className="font-semibold block mb-0.5 text-[#38bdf8]">Saran Desain Canva:</span>
                    {aiOutput.designTips}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Micro Value Bar */}
            <div className="pt-2 flex items-center justify-between text-[12px] text-blue-200/70 border-t border-blue-500/20">
              <span>Disesuaikan untuk bahasa &amp; budaya UMKM lokal</span>
              <span className="font-medium text-white">Format 1080x1080 &amp; 9:16</span>
            </div>
          </div>

          {/* Right Column: Live E-Commerce Product Bundle Showcase (5 cols) */}
          <div className="lg:col-span-5 p-5 sm:p-7 bg-[#05102d]/85 flex flex-col justify-between">
            <div>
              {/* Product Info Bar */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-semibold text-blue-100">
                  Katalog Paket Pilihan
                </span>
                <span className="text-[12px] text-blue-200/70">
                  Kategori: Promo &amp; Event
                </span>
              </div>

              {/* Product Title */}
              <h3 className="font-serif text-[18px] sm:text-[20px] font-semibold text-white leading-snug">
                {bundle.name}
              </h3>
              <p className="mt-1 text-[13px] text-blue-200/80">
                Koleksi aset grafis promosi siap pakai langsung di Canva HP + formula prompt AI.
              </p>

              {/* Tangible Visual Product Card */}
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden border border-blue-400/30 bg-[#020718] mt-4 shadow-md group">
                {bundle.preview_images && bundle.preview_images[0] && (
                  <Image
                    src={bundle.preview_images[0]}
                    alt={bundle.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                )}
                {/* Overlay Tag */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-medium text-white drop-shadow-xs">
                  <span className="rounded-md bg-black/80 px-2.5 py-1">
                    25+ File PNG &amp; JPG HD
                  </span>
                  <span className="rounded-md bg-black/80 px-2.5 py-1">
                    Canva Ready
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-4 space-y-1.5 text-left">
                {bundle.features?.slice(0, 3).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-blue-100/90">
                    <Check className="h-3.5 w-3.5 text-[#38bdf8] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instant E-Commerce Checkout Action Box */}
            <div className="mt-6 pt-4 border-t border-blue-500/20 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-blue-300/70 font-semibold block">
                    Sekali Bayar (Tanpa Langganan)
                  </span>
                  <span className="text-2xl font-bold tracking-tight text-white">
                    {formatRupiah(bundle.price)}
                  </span>
                </div>
                <span className="text-[11px] text-[#38bdf8] font-medium flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  Instant Download
                </span>
              </div>

              <Link
                href={`/bundles/${bundle.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0066d6] to-[#0075de] hover:from-[#0058b8] hover:to-[#006cc9] text-white py-3 px-4 text-[14px] font-semibold transition-all shadow-[0_4px_18px_rgba(0,117,222,0.45)] group cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Beli Paket Ini Sekarang</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-center text-[11px] text-blue-200/60">
                Bayar aman via QRIS GoPay Merchant • Link unduhan otomatis aktif
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
