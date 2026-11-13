'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Copy,
  Check,
  ShoppingBag,
  ArrowRight,
  Download,
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
    <div className="relative mx-auto w-full max-w-6xl text-left" id="ai-generator">
      {/* Studio Surface Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_50px_-12px_rgba(2,12,40,0.18)] transition-all">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#f8fafc] px-5 py-3 sm:px-7">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-slate-800 tracking-tight">
              Studio Promosi Warung Desain
            </span>
            <span className="text-[12px] text-slate-300 hidden sm:inline-block">•</span>
            <span className="text-[12px] text-slate-500 hidden sm:inline-block">
              Copywriting &amp; Prompt Visual Siap Pakai
            </span>
          </div>

          {/* Segmented Control */}
          <div className="flex items-center bg-slate-200/60 p-1 rounded-lg text-[12px]">
            <button
              type="button"
              onClick={() => setActiveTab('ai-studio')}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'ai-studio'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Generator Promosi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('canva-ready')}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'canva-ready'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Katalog Desain
            </button>
          </div>
        </div>

        {/* 2-Column Split Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 bg-white">
          {/* Left Column: Interactive Promo Generator (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Header */}
              <div className="border-b border-slate-100 pb-3 mb-5">
                <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">
                  Generator Materi Promosi
                </h3>
                <p className="text-[12.5px] text-slate-500 mt-0.5">
                  Pilih kategori usaha dan momen penawaran untuk meracik copywriting dan prompt visual.
                </p>
              </div>

              {/* Form Input Section */}
              <div className="rounded-xl border border-slate-200/80 bg-[#f8fafc] p-4 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Jenis Usaha Toko
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-medium text-slate-900 shadow-xs focus:border-[#0075de] focus:outline-none focus:ring-2 focus:ring-[#0075de]/15"
                    >
                      {BUSINESS_PRESETS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Momen Kampanye Promo
                    </label>
                    <select
                      value={campaignMoment}
                      onChange={(e) => setCampaignMoment(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-medium text-slate-900 shadow-xs focus:border-[#0075de] focus:outline-none focus:ring-2 focus:ring-[#0075de]/15"
                    >
                      {MOMENT_PRESETS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tone Selectors */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Tone &amp; Gaya Bahasa
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TONE_PRESETS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all cursor-pointer ${
                          tone === t
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Product Detail Input */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Detail Tawaran Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    value={productDetail}
                    onChange={(e) => setProductDetail(e.target.value)}
                    placeholder="Contoh: Diskon 20% khusus 50 pembeli pertama"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-[#0075de] focus:outline-none focus:ring-2 focus:ring-[#0075de]/15"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0075de] hover:bg-[#0060b8] disabled:opacity-70 text-white py-3 px-5 text-[14px] font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Sedang Meracik Materi Promosi...</span>
                      </>
                    ) : (
                      <span>Buat Ide Promo Sekarang</span>
                    )}
                  </button>
                </div>

                {errorMsg && (
                  <p className="text-[12.5px] text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5">
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* AI Output Section */}
              <div className="mt-5 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                    Hasil Rekomendasi Promosi
                  </span>
                </div>

                {/* Headline */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Headline Poster
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(aiOutput.headline, 'headline')}
                      className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#0075de] hover:underline cursor-pointer"
                    >
                      {copiedHeadline ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Salin Headline</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[15px] font-bold text-slate-900 leading-snug">
                    &ldquo;{aiOutput.headline}&rdquo;
                  </p>
                </div>

                {/* Caption */}
                <div className="space-y-1 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Caption Feed &amp; WhatsApp
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(aiOutput.caption, 'caption')}
                      className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#0075de] hover:underline cursor-pointer"
                    >
                      {copiedCaption ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Salin Caption</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-line max-h-36 overflow-y-auto pr-1">
                    {aiOutput.caption}
                  </p>
                </div>

                {/* Visual Prompt */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Formula Prompt AI (Midjourney / DALL-E)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(aiOutput.visualPrompt, 'prompt')}
                      className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#0075de] hover:underline cursor-pointer"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Salin Formula</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11.5px] font-mono text-slate-600 bg-slate-50 border border-slate-200/70 p-2.5 rounded-lg leading-relaxed break-all">
                    {aiOutput.visualPrompt}
                  </p>
                </div>

                {/* Design Tips */}
                {aiOutput.designTips && (
                  <div className="pt-3 border-t border-slate-100 text-[12px] text-slate-600 border-l-2 border-[#0075de] pl-3 py-0.5">
                    <span className="font-semibold text-slate-800">Panduan Desain Canva: </span>
                    {aiOutput.designTips}
                  </div>
                )}
              </div>
            </div>

            {/* Micro Value Bar */}
            <div className="pt-3 flex items-center justify-between text-[12px] text-slate-500 border-t border-slate-100">
              <span>Bahasa &amp; konteks disesuaikan untuk UMKM Indonesia</span>
              <span className="font-medium text-slate-700">Format 1080x1080 &amp; 9:16</span>
            </div>
          </div>

          {/* Right Column: Featured Product Bundle (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#f8fafc] flex flex-col justify-between">
            <div>
              {/* Product Info Bar */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Paket Pilihan Siap Pakai
                </span>
                <span className="text-[12px] text-slate-500">
                  Kategori: Promo &amp; Event
                </span>
              </div>

              {/* Product Title */}
              <h3 className="font-serif text-[19px] sm:text-[21px] font-semibold text-slate-900 leading-snug">
                {bundle.name}
              </h3>
              <p className="mt-1 text-[13px] text-slate-600">
                Koleksi aset grafis promosi siap pakai langsung di Canva HP dan formula prompt visual.
              </p>

              {/* Tangible Visual Product Card */}
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden border border-slate-200 bg-white mt-4 shadow-xs group">
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
                  <span className="rounded-md bg-slate-900/85 px-2.5 py-1">
                    25+ File PNG &amp; JPG HD
                  </span>
                  <span className="rounded-md bg-slate-900/85 px-2.5 py-1">
                    Canva Ready
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-4 space-y-2 text-left">
                {bundle.features?.slice(0, 3).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12.5px] text-slate-700">
                    <Check className="h-4 w-4 text-[#0075de] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instant Checkout Action Box */}
            <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                    Sekali Bayar (Tanpa Langganan)
                  </span>
                  <span className="text-2xl font-bold tracking-tight text-slate-900">
                    {formatRupiah(bundle.price)}
                  </span>
                </div>
                <span className="text-[11.5px] text-[#0075de] font-medium flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" />
                  Instant Download
                </span>
              </div>

              <Link
                href={`/bundles/${bundle.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0075de] hover:bg-[#0060b8] text-white py-3.5 px-4 text-[14px] font-semibold transition-colors shadow-sm group cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Beli Paket Ini Sekarang</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-center text-[11.5px] text-slate-500">
                Bayar aman via QRIS GoPay Merchant • Link unduhan otomatis aktif
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
