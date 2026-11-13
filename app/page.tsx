import { getBundles } from '@/lib/db';
import HeroShowcaseWindow from '@/components/HeroShowcaseWindow';
import HomeCatalogSection from '@/components/HomeCatalogSection';
import FAQAccordion from '@/components/FAQAccordion';
import WaveTextBanner from '@/components/WaveTextBanner';
import Image from 'next/image';
import {
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Quote,
  MessageCircle,
} from 'lucide-react';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  const bundles = await getBundles();
  const featured = bundles[0];

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 w-full overflow-hidden">
      {/* ========================================================= */}
      {/* 1. HERO TOP SECTION (Heading, Subtitle, Actions, Stats)  */}
      {/* ========================================================= */}
      <section className="relative pt-8 sm:pt-14 pb-2 px-4 sm:px-8 text-center max-w-[1440px] mx-auto">
        {/* Subtle Ambient Blue Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-5xl h-[460px] bg-[radial-gradient(ellipse_at_top,rgba(0,117,222,0.08),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Announcement Bar with Blue Accent */}


          {/* Editorial Display Headline with Blue Accent Italic Serif */}
          <h1
            data-aos="fade-up"
            data-aos-duration="700"
            className="font-serif text-3xl sm:text-5xl lg:text-[62px] font-semibold tracking-tight text-[#000000] leading-[1.14]"
          >
            Asisten AI &amp; Desain Promosi{' '}
            <span className="italic font-normal text-[#000000]">
              untuk Seluruh Toko Anda
            </span>
          </h1>

          {/* Subtitle */}
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="700"
            className="text-[16px] sm:text-[19px] text-[#444444] leading-relaxed max-w-2xl mx-auto"
          >
            Ubah ide promo mendadak menjadi materi feed Instagram &amp; WhatsApp Story siap posting dalam hitungan menit. Pilih puluhan bundle desain jadi, atau racik variasi unik dengan panduan prompt AI.
          </p>

          {/* Hero CTAs */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="700"
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <a
              href="#katalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0075de] hover:bg-[#005bb5] px-7 py-4 text-[15px] font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer group"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Eksplor Katalog Paket</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#alur-transaksi"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-black/[0.12] hover:border-[#0075de]/30 px-6 py-4 text-[15px] font-semibold text-[#111111] hover:text-[#0075de] hover:bg-[#f6f5f4] transition-all cursor-pointer shadow-2xs"
            >
              <span>Cara Kerja &amp; Pembayaran</span>
            </a>
          </div>

          {/* Reassurance Micro-Copy */}
          <p
            data-aos="fade-in"
            data-aos-delay="300"
            className="text-[12.5px] text-[#54504c] pt-1"
          >
            Mulai Rp 40 ribuan • Sekali bayar tanpa langganan • Siap buka di Canva HP • Lisensi Bebas Komersial
          </p>

          {/* 4-Item Social Proof Metrics Bar with Blue Numbers & Accent Borders */}
          <div className="pt-6 border-t border-black/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left max-w-3xl mx-auto">
            <div data-aos="fade-up" data-aos-delay="100" className="border-l-2 border-[#0075de] pl-3 py-1">
              <span className="block text-xl sm:text-2xl font-bold tracking-tight text-[#0075de]">500+</span>
              <span className="text-[12px] text-[#54504c]">UMKM Terbantu</span>
            </div>
            <div data-aos="fade-up" data-aos-delay="180" className="border-l-2 border-[#0075de] pl-3 py-1">
              <span className="block text-xl sm:text-2xl font-bold tracking-tight text-[#0075de]">98%</span>
              <span className="text-[12px] text-[#54504c]">Kepuasan Pelanggan</span>
            </div>
            <div data-aos="fade-up" data-aos-delay="260" className="border-l-2 border-[#0075de] pl-3 py-1">
              <span className="block text-xl sm:text-2xl font-bold tracking-tight text-[#0075de]">100+</span>
              <span className="text-[12px] text-[#54504c]">Desain Siap Pakai</span>
            </div>
            <div data-aos="fade-up" data-aos-delay="340" className="border-l-2 border-[#0075de] pl-3 py-1">
              <span className="block text-xl sm:text-2xl font-bold tracking-tight text-[#0075de]">4.9 / 5.0</span>
              <span className="text-[12px] text-[#54504c]">Rating Ulasan UMKM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. FULL-WIDTH HERO SHOWCASE BANNER (ChatPRD Style)        */}
      {/* Full dari Ujung Kanan ke Kiri Layar                       */}
      {/* ========================================================= */}
      <section className="relative w-full py-12 sm:py-16 md:py-24 px-4 sm:px-8 lg:px-12 overflow-hidden my-2">
        {/* Full-width Background Image edge-to-edge */}
        <div className="absolute inset-0 -z-10 w-full h-full">
          <Image
            src="https://i.pinimg.com/736x/af/e7/66/afe766353ba363649756113dad79e18f.jpg"
            alt="Latar Belakang Showcase Warung Desain"
            fill
            priority
            quality={95}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Floating Mockup Window Centered */}
        <div className="relative z-10 max-w-6xl mx-auto" data-aos="fade-up" data-aos-duration="800">
          <HeroShowcaseWindow featuredBundle={featured} />
        </div>
      </section>

      {/* Main Content Sections Wrapper */}
      <div className="max-w-[1440px] mx-auto space-y-24 sm:space-y-32">
        {/* ========================================================= */}
        {/* 3. SEKTOR UMKM YANG TERBANTU                              */}
        {/* ========================================================= */}
        <section className="px-4 sm:px-8 text-center" data-aos="fade-up" data-aos-duration="700">
          <p className="text-[12px] uppercase tracking-wider font-semibold text-[#54504c] mb-3">
            Dirancang untuk berbagai jenis usaha:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] font-medium text-[#54504c] max-w-4xl mx-auto">
            <span>Kedai Kopi &amp; Cafe</span>
            <span className="text-black/20 hidden sm:inline">•</span>
            <span>Fashion &amp; Hijab Olshop</span>
            <span className="text-black/20 hidden sm:inline">•</span>
            <span>Kuliner &amp; Katering</span>
            <span className="text-black/20 hidden sm:inline">•</span>
            <span>Skincare &amp; Beauty</span>
            <span className="text-black/20 hidden sm:inline">•</span>
            <span>Bakery &amp; Pastry</span>
            <span className="text-black/20 hidden sm:inline">•</span>
            <span>Retail &amp; Toko Oleh-oleh</span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. CORE PHILOSOPHY / VALUE STATEMENT                      */}
        {/* ========================================================= */}
        <section className="px-4 sm:px-8 text-center max-w-4xl mx-auto space-y-3" data-aos="fade-up" data-aos-duration="700">
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-[44px] font-semibold tracking-tight text-[#000000] leading-tight">
            Satu platform promosi,{' '}
            <span className="italic font-normal text-[#0075de]">dari ide pertama hingga siap posting</span>
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#54504c] leading-relaxed max-w-2xl mx-auto">
            Tak perlu lagi bingung memikirkan konsep visual, meraba prompt bahasa Inggris, atau menguras kas toko untuk sewa agensi jutaan rupiah.
          </p>
        </section>

        {/* ========================================================= */}
        {/* 5. FEATURE DEEP-DIVES (3 Sections)                        */}
        {/* ========================================================= */}
        <section className="px-4 sm:px-8 space-y-16 sm:space-y-24 max-w-6xl mx-auto overflow-hidden">
          {/* Feature 1: Left Copy, Right Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div data-aos="fade-right" data-aos-duration="750" className="lg:col-span-6 space-y-5 text-left">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#000000] leading-snug">
                Rancang materi promosi{' '}
                <span className="italic font-normal text-[#0075de]">dalam hitungan menit</span>, bukan berhari-hari
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#54504c] leading-relaxed">
                Tak perlu membuka kanvas kosong dan bingung mau bikin apa saat toko butuh promo mendadak. Setiap bundle menyajikan puluhan desain beresolusi tinggi dengan tipografi dan komposisi matang yang siap menarik pembeli.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-2.5 text-[14px] text-[#111111]">
                  <CheckCircle2 className="h-5 w-5 text-[#0075de] shrink-0 mt-0.5" />
                  <span>Format PNG transparan &amp; JPG HD siap posting ke feed (1:1) dan WhatsApp Story (9:16).</span>
                </li>
                <li className="flex items-start gap-2.5 text-[14px] text-[#111111]">
                  <CheckCircle2 className="h-5 w-5 text-[#0075de] shrink-0 mt-0.5" />
                  <span>Didesain khusus untuk momen promosi toko (diskon, promo gajian, buka puasa, flash sale).</span>
                </li>
                <li className="flex items-start gap-2.5 text-[14px] text-[#111111]">
                  <CheckCircle2 className="h-5 w-5 text-[#0075de] shrink-0 mt-0.5" />
                  <span>Bebas royalti komersial untuk kebutuhan jualan tokomu selamanya.</span>
                </li>
              </ul>
              <div className="pt-2">
                <a
                  href="#katalog"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0075de] hover:underline"
                >
                  <span>Lihat paket desain di katalog</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-duration="750" className="lg:col-span-6 flex items-center justify-center">
              <Image
                src="/glosy-app-promo.png"
                alt="Materi Promosi Siap Pakai Warung Desain"
                width={1159}
                height={1358}
                className="w-full h-auto max-w-lg object-contain"
              />
            </div>
          </div>

          {/* Feature 2: Full Width / Centered Showcase */}
          <div className="rounded-2xl border border-black/[0.1] bg-white p-6 sm:p-10 shadow-sm text-center max-w-5xl mx-auto space-y-6" data-aos="fade-up" data-aos-duration="700">
            <div className="max-w-2xl mx-auto space-y-3">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#000000]">
                Formula Prompt AI yang paham{' '}
                <span className="italic font-normal text-[#0075de]">pasar &amp; budaya UMKM Indonesia</span>
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#54504c] leading-relaxed">
                Lupakan tutorial prompt bahasa Inggris yang rumit dan tidak sesuai selera lokal. Setiap paket menyertakan teks prompt Midjourney &amp; DALL-E v3 yang siap kamu salin-tempel untuk eksplorasi tanpa batas.
              </p>
            </div>

            {/* Prompt Card */}
            <div data-aos="zoom-in-up" data-aos-duration="750" className="rounded-xl border border-black/[0.08] bg-[#fbfaf9] p-5 sm:p-6 text-left max-w-3xl mx-auto space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <span className="text-[12.5px] font-semibold text-[#111111]">
                  Contoh Formula Prompt Paket Kuliner &amp; Cafe:
                </span>
                <span className="text-[12px] font-medium text-[#54504c]">
                  Midjourney v6.1 &amp; DALL-E 3
                </span>
              </div>
              <p className="font-mono text-[12.5px] sm:text-[13px] text-[#111111] bg-white p-3.5 rounded-lg leading-relaxed border border-black/[0.06]">
                &ldquo;professional appetizing food photography of Indonesian iced es kopi susu in clear cup with ice condensation, paired with golden crispy roti bakar, warm afternoon sunbeam lighting, cafe ambient background, 8k resolution, shot on 85mm lens --ar 1:1&rdquo;
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#54504c]">
                <span>Hasil foto produk realistis tanpa sewa studio foto</span>
                <span className="font-medium text-[#0075de]">Termasuk panduan modifikasi</span>
              </div>
            </div>
          </div>

          {/* Feature 3: Left Visual, Right Copy */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div data-aos="fade-right" data-aos-duration="750" className="lg:col-span-6 order-2 lg:order-1 flex items-center justify-center">
              <Image
                src="/mockup-section.png"
                alt="Mockup Canva Warung Desain"
                width={1159}
                height={1358}
                className="w-full h-auto max-w-lg object-contain"
              />
            </div>

            <div data-aos="fade-left" data-aos-duration="750" className="lg:col-span-6 order-1 lg:order-2 space-y-5 text-left">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#000000] leading-snug">
                Buka langsung di Canva HP,{' '}
                <span className="italic font-normal text-[#0075de]">edit teks &amp; logo tanpa ribet</span>
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#54504c] leading-relaxed">
                Didesain khusus untuk admin media sosial dan pemilik toko yang sering bekerja hanya bermodalkan smartphone. Tak perlu instal software berat seperti Photoshop atau laptop spek dewa.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-2.5 text-[14px] text-[#111111]">
                  <CheckCircle2 className="h-5 w-5 text-[#0075de] shrink-0 mt-0.5" />
                  <span>Drag &amp; drop foto produk tokomu langsung ke dalam frame template.</span>
                </li>
                <li className="flex items-start gap-2.5 text-[14px] text-[#111111]">
                  <CheckCircle2 className="h-5 w-5 text-[#0075de] shrink-0 mt-0.5" />
                  <span>Ubah nominal harga diskon dan alamat toko dalam 3 ketukan jari.</span>
                </li>
                <li className="flex items-start gap-2.5 text-[14px] text-[#111111]">
                  <CheckCircle2 className="h-5 w-5 text-[#0075de] shrink-0 mt-0.5" />
                  <span>Disertai panduan singkat berbahasa Indonesia yang ramah pemula.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. E-COMMERCE CATALOG SECTION                             */}
        {/* ========================================================= */}
        <HomeCatalogSection bundles={bundles} />

        {/* ========================================================= */}
        {/* 7. ECOSYSTEM / CONNECTED TOOLS GRID                       */}
        {/* ========================================================= */}
        <section className="px-4 sm:px-8 text-center max-w-5xl mx-auto space-y-10" data-aos="fade-up" data-aos-duration="700">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#000000]">
              Terhubung dengan semua tools{' '}
              <span className="italic font-normal text-[#0075de]">andalan jualanmu</span>
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#54504c]">
              Aset dan formula prompt Warung Desain dirancang agar bekerja mulus dengan ekosistem aplikasi yang kamu gunakan setiap hari.
            </p>
          </div>

          {/* 12 Tools Grid with Official Brand Logos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
            {(
              [
                {
                  name: 'Canva',
                  desc: 'Edit teks & logo di HP',
                  logos: [{ src: '/logos/canva.svg', alt: 'Canva' }],
                },
                {
                  name: 'Instagram',
                  desc: 'Feed 1:1 & Story 9:16',
                  logos: [{ src: '/logos/instagram.svg', alt: 'Instagram' }],
                },
                {
                  name: 'WhatsApp Business',
                  desc: 'Katalog & Update Status',
                  logos: [{ src: '/logos/whatsapp.svg', alt: 'WhatsApp Business' }],
                },
                {
                  name: 'TikTok',
                  desc: 'Cover video promo',
                  logos: [
                    { src: '/logos/tiktok.svg', alt: 'TikTok' },
                  ],
                },
                {
                  name: 'GoPay & QRIS',
                  desc: 'Pembayaran instan',
                  logos: [
                    { src: '/logos/gopay.svg', alt: 'GoPay' },
                    { src: '/logos/qris.svg', alt: 'QRIS', wide: true },
                  ],
                },
                {
                  name: 'CapCut',
                  desc: 'Animasi poster promo',
                  logos: [{ src: '/logos/capcut.svg', alt: 'CapCut' }],
                },
                {
                  name: 'Meta Ads',
                  desc: 'Materi iklan berkonversi',
                  logos: [{ src: '/logos/meta.svg', alt: 'Meta' }],
                },
                {
                  name: 'Midjourney',
                  desc: 'Generasi visual AI',
                  logos: [{ src: '/logos/midjourney.svg', alt: 'Midjourney' }],
                },
                {
                  name: 'Shopee & Tokopedia',
                  desc: 'Banner etalase toko',
                  logos: [
                    { src: '/logos/shopee.svg', alt: 'Shopee' },
                    { src: '/logos/tokopedia.svg', alt: 'Tokopedia' },
                  ],
                },
                {
                  name: 'Figma',
                  desc: 'Kustomisasi file desainer',
                  logos: [{ src: '/logos/figma.svg', alt: 'Figma' }],
                },
                {
                  name: 'ChatGPT & Claude',
                  desc: 'Racikan caption & copy promo',
                  logos: [
                    { src: '/logos/openai.svg', alt: 'ChatGPT' },
                    { src: '/logos/claude.svg', alt: 'Claude' },
                  ],
                },
                {
                  name: 'DALL-E 3',
                  desc: 'Formula prompt visual',
                  logos: [{ src: '/logos/dalle.svg', alt: 'DALL-E 3', isSwatch: true }],
                },
              ] as Array<{
                name: string;
                desc: string;
                logos: Array<{ src: string; alt: string; wide?: boolean; isSwatch?: boolean }>;
              }>
            ).map((tool, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={String((idx % 4) * 75)}
                data-aos-duration="600"
                className="interactive-card rounded-xl border border-black/[0.08] hover:border-[#0075de]/35 bg-white p-4 sm:p-4.5 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-3 h-8">
                    {tool.logos.map((lg, lIdx) => (
                      <div
                        key={lIdx}
                        className={`h-10 rounded-lg bg-white  flex items-center justify-center p-1.5 shrink-0 ${
                          lg.wide ? 'px-2 min-w-8' : 'w-8'
                        }`}
                      >
                        <img
                          src={lg.src}
                          alt={lg.alt}
                          className={`object-contain ${
                            lg.wide
                              ? 'h-10 w-10'
                              : lg.isSwatch
                              ? 'h-4.5 w-10 rounded-[3px]'
                              : 'h-10 w-10'
                          }`}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  <h4 className="font-bold text-[14px] text-[#111111] tracking-tight">{tool.name}</h4>
                  <p className="text-[12.5px] text-[#54504c] leading-snug mt-1">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 8. ALUR TRANSAKSI E-COMMERCE                              */}
        {/* ========================================================= */}
        <section id="alur-transaksi" className="px-4 sm:px-8 max-w-6xl mx-auto scroll-mt-20" data-aos="fade-up" data-aos-duration="700">
          <div className="border-t border-black/[0.08] pt-16">
            <div className="max-w-2xl mb-10 text-left">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#000000]">
                Cara Praktis Berbelanja{' '}
                <span className="italic font-normal text-[#000000]">di Warung Desain</span>
              </h2>
              <p className="mt-2 text-[15px] sm:text-[16px] text-[#54504c]">
                Tanpa perlu mendaftar akun atau berlangganan bulanan. Cukup beli putus paket yang sedang dibutuhkan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <div data-aos="fade-up" data-aos-delay="100" className="interactive-card rounded-xl border border-black/[0.08] hover:border-[#0075de]/30 bg-white p-5 flex flex-col justify-between">
                <div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0075de]/10 text-[#0075de] font-bold text-[13px] mb-3 border border-[#0075de]/20 shadow-2xs">
                    1
                  </div>
                  <h3 className="font-semibold text-[15px] text-[#111111] mb-1.5">Pilih Paket Desain</h3>
                  <p className="text-[13.5px] text-[#54504c] leading-relaxed">
                    Buka detail paket untuk melihat preview gambar resolusi tinggi yang pas dengan tema tokomu.
                  </p>
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="200" className="interactive-card rounded-xl border border-black/[0.08] hover:border-[#0075de]/30 bg-white p-5 flex flex-col justify-between">
                <div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0075de]/10 text-[#0075de] font-bold text-[13px] mb-3 border border-[#0075de]/20 shadow-2xs">
                    2
                  </div>
                  <h3 className="font-semibold text-[15px] text-[#111111] mb-1.5">Bayar via QRIS</h3>
                  <p className="text-[13.5px] text-[#54504c] leading-relaxed">
                    Scan QRIS resmi GoPay Merchant dengan nominal pas sampai 3 digit kode unik verifikasi.
                  </p>
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="300" className="interactive-card rounded-xl border border-black/[0.08] hover:border-[#0075de]/30 bg-white p-5 flex flex-col justify-between">
                <div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0075de]/10 text-[#0075de] font-bold text-[13px] mb-3 border border-[#0075de]/20 shadow-2xs">
                    3
                  </div>
                  <h3 className="font-semibold text-[15px] text-[#111111] mb-1.5">Konfirmasi Nama</h3>
                  <p className="text-[13.5px] text-[#54504c] leading-relaxed">
                    Ketik nama pengirim lalu klik &ldquo;Cek Pembayaran&rdquo; agar mutasi langsung dicocokkan owner via Telegram.
                  </p>
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="400" className="interactive-card rounded-xl border border-black/[0.08] hover:border-[#0075de]/30 bg-white p-5 flex flex-col justify-between">
                <div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0075de] text-white font-bold text-[13px] mb-3 shadow-xs">
                    4
                  </div>
                  <h3 className="font-semibold text-[15px] text-[#111111] mb-1.5">Unduh &amp; Langsung Edit</h3>
                  <p className="text-[13.5px] text-[#54504c] leading-relaxed">
                    Link file ZIP langsung aktif di layar dan cadangan dikirim ke email. Siap posting ke medsos!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* WAVE TEXT EFFECT BANNER (ChatPRD / Framer Style)          */}
        {/* ========================================================= */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden my-6">
          <WaveTextBanner />
        </div>

        {/* ========================================================= */}
        {/* 9. TESTIMONIAL WALL                                       */}
        {/* ========================================================= */}
        <section className="px-4 sm:px-8 max-w-6xl mx-auto space-y-10" data-aos="fade-up" data-aos-duration="700">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#000000]">
              Disukai oleh ratusan admin &amp;{' '}
              <span className="italic font-normal text-[#000000]">pemilik UMKM</span>
            </h2>
            <p className="text-[15px] text-[#54504c]">
              Cerita nyata dari mereka yang berhasil menghemat biaya desain promosi.
            </p>
          </div>

          {/* Featured Review Card + Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Featured Large Highlight Review (5 cols) */}
            <div data-aos="fade-right" data-aos-duration="750" className="interactive-card lg:col-span-5 rounded-2xl bg-white border border-black/[0.1] hover:border-[#0075de]/30 p-6 sm:p-8 flex flex-col justify-between text-left shadow-sm">
              <div>
                <Quote className="h-8 w-8 text-[#0075de] mb-4 opacity-80" />
                <p className="text-[16px] sm:text-[17px] font-medium text-[#111111] leading-relaxed">
                  &ldquo;Dulu kalau owner minta promo mendadak pas weekend, saya bisa stres begadang cuma buat cari ide di Canva dari kanvas kosong. Sejak pakai bundle Warung Desain, tinggal ganti nominal promo dan pasang foto produk, 5 menit udah tayang di feed dan story WhatsApp!&rdquo;
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-black/[0.08] flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#0075de] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  RN
                </div>
                <div>
                  <p className="font-bold text-[14px] text-[#111111]">Rani Novitasari</p>
                  <p className="text-[12px] text-[#54504c]">Admin Sosmed Coffee &amp; Eatery, Bandung</p>
                </div>
              </div>
            </div>

            {/* Grid of 4 Supporting Reviews (7 cols) */}
            <div data-aos="fade-left" data-aos-duration="750" className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                {
                  text: 'Paket Promo Ramadhannya beneran ngebantu banget! Visualnya islami modern dan gak norak. Followers pada nanya siapa yang desainin.',
                  name: 'Dimas Prasetyo',
                  role: 'Owner Katering Harian, Surabaya',
                  initial: 'DP',
                },
                {
                  text: 'Harganya murah banget cuma 40 ribuan sekali beli dapet puluhan file HD. Dibanding sewa freelancer 500rb per poster, ini jauh lebih hemat buat UMKM pemula.',
                  name: 'Siti Sarah',
                  role: 'Owner Olshop Hijab, Solo',
                  initial: 'SS',
                },
                {
                  text: 'Bonus formula prompt AI-nya daging banget! Saya coba copas ke Midjourney ternyata langsung keluar gambar estetik yang pas buat katalog produk baru.',
                  name: 'Kevin Wijaya',
                  role: 'Admin Thrift & Distro, Jakarta',
                  initial: 'KW',
                },
                {
                  text: 'Proses bayar pakai QRIS cepet banget. Habis transfer langsung dapet link download file ZIP-nya tanpa harus tunggu berjam-jam.',
                  name: 'Lestari Handayani',
                  role: 'Owner Toko Kue & Bakery, Malang',
                  initial: 'LH',
                },
              ].map((review, i) => (
                <div
                  key={i}
                  className="interactive-card rounded-xl border border-black/[0.08] bg-white p-5 flex flex-col justify-between shadow-2xs hover:border-black/[0.18]"
                >
                  <p className="text-[13.5px] text-[#54504c] leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="pt-4 mt-4 border-t border-black/[0.06] flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#f6f5f4] text-[#111111] font-bold flex items-center justify-center text-xs border border-black/[0.08]">
                      {review.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-[13px] text-[#111111]">{review.name}</p>
                      <p className="text-[11px] text-[#54504c]">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 10. FAQ ACCORDION SECTION                                 */}
        {/* ========================================================= */}
        <section id="faq" className="px-4 sm:px-8 max-w-4xl mx-auto scroll-mt-20" data-aos="fade-up" data-aos-duration="700">
          <div className="border-t border-black/[0.08] pt-16 space-y-8">
            <div className="text-left">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#000000]">
                Pertanyaan yang{' '}
                <span className="italic font-normal text-[#000000]">Sering Diajukan</span>
              </h2>
              <p className="mt-1.5 text-[15px] text-[#54504c]">
                Penjelasan ringkas seputar pembelian, format file, lisensi, dan rencana AI Studio.
              </p>
            </div>

            <div>
              <FAQAccordion />
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 11. CLOSING HIGH-IMPACT CTA BANNER                        */}
        {/* ========================================================= */}
        <section className="px-4 sm:px-8 max-w-6xl mx-auto">
          <div data-aos="zoom-in-up" data-aos-duration="800" className="rounded-3xl bg-[#111111] p-8 sm:p-14 text-white text-center shadow-xl">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight leading-tight text-white">
                Bikin materi promosi tokomu{' '}
                <span className="italic font-normal text-[#62aef0]">naik kelas hari ini</span>
              </h2>

              <p className="text-[15px] sm:text-[17px] text-white/75 leading-relaxed">
                Pilih bundle desain siap upload dengan harga terjangkau mulai Rp 40 ribuan. Beli sekali, unduh instan, dan promosikan bisnismu selamanya.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="#katalog"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-[14.5px] font-bold text-[#111111] hover:bg-white/90 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Pilih Paket di Katalog
                </a>
                <a
                  href="https://wa.me/6285182510575?text=Halo%20Admin%20Warung%20Design%2C%20saya%20ingin%20tanya%20seputar%20paket%20desain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-6 py-3.5 text-[14.5px] font-semibold text-white transition-all border border-white/15 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Konsultasi via WhatsApp
                </a>
              </div>

              <p className="text-[11.5px] text-white/50 pt-2">
                Tanpa langganan bulanan • Pembayaran QRIS instan • Bebas komersial UMKM
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
