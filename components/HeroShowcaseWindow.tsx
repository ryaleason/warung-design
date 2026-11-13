'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Copy, Check, ShoppingBag, ArrowRight, Layers, Bot, Download, Zap } from 'lucide-react';
import { Bundle } from '@/types';
import { formatRupiah } from '@/lib/telegram';

interface HeroShowcaseWindowProps {
  featuredBundle?: Bundle;
}

export default function HeroShowcaseWindow({ featuredBundle }: HeroShowcaseWindowProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai-studio' | 'canva-ready'>('ai-studio');

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

  const samplePrompt = 'cinematic commercial photography of iced caramel macchiato and Indonesian artisanal toast on rustic dark wood, golden hour sunbeam, photorealistic, 8k --ar 1:1';

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(samplePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      {/* Main Window Container */}
      <div className="overflow-hidden rounded-2xl border border-black/[0.15] bg-[#ffffff] shadow-2xl transition-all">
        {/* Window Chrome / Title Bar */}
        <div className="flex items-center justify-between border-b border-black/[0.08] bg-[#f9f8f6] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#e5e5e5] inline-block border border-black/15" />
            <span className="h-3 w-3 rounded-full bg-[#e5e5e5] inline-block border border-black/15" />
            <span className="h-3 w-3 rounded-full bg-[#e5e5e5] inline-block border border-black/15" />
            <span className="ml-3 text-[12px] sm:text-[13px] font-medium text-[#54504c] hidden sm:inline-block">
              Warung Desain AI Studio: Generator Promo &amp; E-Commerce Hub
            </span>
          </div>

          {/* Quick Tabs in Title Bar */}
          <div className="flex items-center gap-1.5 bg-black/[0.04] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('ai-studio')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11.5px] font-semibold transition-all ${
                activeTab === 'ai-studio'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#615d59] hover:text-[#111111]'
              }`}
            >
              <Bot className="h-3.5 w-3.5 text-[#0075de]" />
              <span className="hidden xs:inline">Preview</span> AI Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('canva-ready')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11.5px] font-semibold transition-all ${
                activeTab === 'canva-ready'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#615d59] hover:text-[#111111]'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-[#54504c]" />
              <span className="hidden xs:inline">Aset</span> Desain Jadi
            </button>
          </div>
        </div>

        {/* Window Content: 2-Column Split Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-black/[0.08] bg-[#ffffff]">
          {/* Left Column: AI Promo & Prompt Generator Preview (7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Studio Header */}
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 mb-4">
                <h4 className="text-[14px] font-bold text-[#111111]">
                  Simulator Promosi Toko
                </h4>
                <span className="text-[12px] text-[#54504c]">
                  Generator Teks &amp; Prompt AI
                </span>
              </div>

              {/* Form Input Simulation */}
              <div className="rounded-xl border border-black/[0.08] bg-[#fbfaf9] p-4 space-y-3.5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#54504c] mb-1">
                      Jenis Usaha Toko
                    </label>
                    <div className="rounded-lg border border-black/[0.1] bg-white px-3 py-2 text-[13px] font-medium text-[#111111] shadow-2xs">
                      Kedai Kopi &amp; Cafe Kuliner
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#54504c] mb-1">
                      Momen Kampanye Promo
                    </label>
                    <div className="rounded-lg border border-black/[0.1] bg-white px-3 py-2 text-[13px] font-medium text-[#111111] shadow-2xs">
                      Paket Bukber Ramadhan Hemat
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#54504c] mb-1">
                    Tone &amp; Gaya Bahasa
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-[#111111] text-white px-2.5 py-1 text-[11.5px] font-medium">
                      Hangat &amp; Kekeluargaan
                    </span>
                    <span className="rounded-md bg-white border border-black/[0.08] px-2.5 py-1 text-[11.5px] font-medium text-[#54504c]">
                      Menggugah Selera
                    </span>
                    <span className="rounded-md bg-white border border-black/[0.08] px-2.5 py-1 text-[11.5px] font-medium text-[#54504c]">
                      Ajakan Bukber Bareng
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Output Generation Showcase Box */}
              <div className="mt-4 rounded-xl border border-black/[0.1] bg-[#fbfaf9] p-4 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] font-bold text-[#111111] flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-[#0075de]" />
                    Rekomendasi Copywriting &amp; Prompt AI:
                  </span>
                </div>

                {/* Generated Headline */}
                <div className="rounded-lg bg-white border border-black/[0.06] p-3 shadow-2xs">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#54504c]">Headline Poster</p>
                  <p className="text-[14px] font-bold text-[#111111] mt-0.5">
                    &ldquo;Reuni Hangat, Buka Puasa Hemat! Paket Bukber Buy 2 Get 1 Free&rdquo;
                  </p>
                </div>

                {/* Generated Prompt Formula */}
                <div className="rounded-lg bg-white border border-black/[0.06] p-3 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#54504c]">
                      Prompt AI Midjourney / DALL-E (Bonus):
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0075de] hover:underline"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
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
                  <p className="text-[12px] font-mono text-[#54504c] bg-[#f6f5f4] p-2 rounded-md leading-relaxed break-all">
                    {samplePrompt}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Micro Value Bar */}
            <div className="pt-2 flex items-center justify-between text-[12px] text-[#54504c] border-t border-black/[0.06]">
              <span>Disesuaikan untuk bahasa &amp; budaya UMKM lokal</span>
              <span className="font-medium text-[#111111]">Format 1080x1080 &amp; 9:16</span>
            </div>
          </div>

          {/* Right Column: Live E-Commerce Product Bundle Showcase (5 cols) */}
          <div className="lg:col-span-5 p-5 sm:p-7 bg-[#faf9f8] flex flex-col justify-between">
            <div>
              {/* Product Info Bar */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-semibold text-[#111111]">
                  Katalog Paket Pilihan
                </span>
                <span className="text-[12px] text-[#54504c]">
                  Kategori: Promo &amp; Event
                </span>
              </div>

              {/* Product Title */}
              <h3 className="font-serif text-[18px] sm:text-[20px] font-semibold text-[#000000] leading-snug">
                {bundle.name}
              </h3>
              <p className="mt-1 text-[13px] text-[#615d59]">
                Koleksi aset grafis promosi siap pakai langsung di Canva HP + formula prompt AI.
              </p>

              {/* Tangible Visual Product Card */}
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden border border-black/[0.1] bg-[#ffffff] mt-4 shadow-sm group">
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
                  <div key={i} className="flex items-center gap-2 text-[12px] text-[#54504c]">
                    <Check className="h-3.5 w-3.5 text-[#0075de] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instant E-Commerce Checkout Action Box */}
            <div className="mt-6 pt-4 border-t border-black/[0.08] space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#757575] font-semibold block">
                    Sekali Bayar (Tanpa Langganan)
                  </span>
                  <span className="text-2xl font-bold tracking-tight text-[#111111]">
                    {formatRupiah(bundle.price)}
                  </span>
                </div>
                <span className="text-[11px] text-[#0075de] font-medium flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  Instant Download
                </span>
              </div>

              <Link
                href={`/bundles/${bundle.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0075de] hover:bg-[#0060b8] text-white py-3 px-4 text-[14px] font-semibold transition-colors shadow-xs group"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Beli Paket Ini Sekarang</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-center text-[11px] text-[#54504c]">
                Bayar aman via QRIS GoPay Merchant • Link unduhan otomatis aktif
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
