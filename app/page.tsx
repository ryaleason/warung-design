import { getBundles } from '@/lib/db';
import BundleCard from '@/components/BundleCard';
import FAQAccordion from '@/components/FAQAccordion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  MessageCircle,
} from 'lucide-react';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  const bundles = await getBundles();
  const featured = bundles[0];
  const secondaryFeatured = bundles[2] || bundles[1];

  return (
    <div className="space-y-24 pb-20 max-w-[1440px] mx-auto">
      <section className="pt-10 pb-8 sm:pt-16 sm:pb-12 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 text-left space-y-6">

            <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-[-0.03em] text-[#111111] leading-[1.2]">
              Bikin postingan promosi toko makin memikat tanpa repot sewa <span className="text-[#0075de]">desainer</span>.
            </h1>

            <p className="text-[16px] sm:text-[17px] text-[#595652] leading-relaxed max-w-xl">
              Koleksi bundle template visual musiman siap upload untuk feed dan WhatsApp Story tokomu. Beli putus paket yang sedang dibutuhkan, langsung buka di Canva di HP, ganti foto dan teks promo dalam hitungan menit.
            </p>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="#katalog"
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0075de] px-6 py-3.5 text-[15px] font-medium text-white hover:bg-[#0060b8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2 cursor-pointer shadow-xs"
              >
                <ShoppingBag className="h-4 w-4" />
                Lihat Katalog Paket
              </a>
              <a
                href="#cara-pakai"
                className="inline-flex items-center justify-center rounded-[8px] bg-[#ffffff] border border-black/[0.12] px-6 py-3.5 text-[15px] font-medium text-[#111111] hover:bg-[#f6f5f4] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2 cursor-pointer"
              >
                Cara Penggunaan
              </a>
            </div>

            {/* Handcrafted Reassurance: Clean Typography & Real Benefits (No pastel squircle boxes!) */}
            
          </div>

          {/* Right Column: Tangible Design Lookbook Preview (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Featured Showcase Card */}
              <div className="rounded-[16px] border rotate-6 border-black/[0.1] bg-[#ffffff] p-4 sm:p-5 shadow-xs transition-transform hover:-translate-y-0.5">
                <div className="relative aspect-square w-full rounded-[12px] overflow-hidden bg-[#f6f5f4] border border-black/[0.06]">
                  {featured && featured.preview_images[0] && (
                    <Image
                      src={featured.preview_images[0]}
                      alt={featured.name}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 450px"
                      className="object-cover"
                    />
                  )}
                  {/* Subtle Stamp Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-[#000000]/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-white">
                      {featured?.category || 'Template Promosi'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center rounded-full bg-[#0075de] px-3 py-1 text-[12px] font-bold text-white shadow-xs">
                      Rp 49.000 (Sekali Beli)
                    </span>
                  </div>
                </div>

                {/* Card Meta & Canva Tag */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[16px] text-[#111111]">
                      {featured?.name || 'Paket Promo Pilihan'}
                    </h3>
                    <p className="text-[13px] text-[#54504c] mt-0.5">
                      25+ file PNG transparan &amp; JPG resolusi tinggi
                    </p>
                  </div>
                  <Link
                    href={`/bundles/${featured?.slug}`}
                    className="inline-flex items-center justify-center rounded-[6px] bg-[#f6f5f4] hover:bg-black/[0.06] px-3 py-1.5 text-[12.5px] font-semibold text-[#111111] transition-colors border border-black/[0.08]"
                  >
                    Buka Preview
                  </Link>
                </div>
              </div>

              {/* Secondary Overlapping Thumbnail for Depth */}
              {secondaryFeatured && (
                <div className="hidden sm:flex items-center relative z-100 rotate-x-3 gap-3 mt-3 rounded-[12px] border border-black/[0.08] bg-[#ffffff]/90 p-3">
                  <div className="relative h-12 w-12 rounded-[8px] overflow-hidden bg-[#f6f5f4] shrink-0 border border-black/[0.06]">
                    <Image
                      src={secondaryFeatured.preview_images[0]}
                      alt={secondaryFeatured.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[#54504c]">
                      Juga Tersedia di Katalog
                    </p>
                    <p className="text-[13.5px] font-semibold text-[#111111] truncate">
                      {secondaryFeatured.name}
                    </p>
                  </div>
                  <Link
                    href={`/bundles/${secondaryFeatured.slug}`}
                    className="text-[12px] font-medium text-[#0075de] hover:underline shrink-0"
                  >
                    Lihat Paket
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bundle Catalog Section */}
      <section id="katalog" className="px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#54504c]">
              Etalase Desain
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#111111]">
              Pilihan Paket Desain Siap Pakai
            </h2>
            <p className="mt-1.5 text-[15px] sm:text-[16px] text-[#595652]">
              Pilih paket sesuai momen promosi toko atau kategori bisnis Anda.
            </p>
          </div>
        </div>

        {/* Grid Bundles */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bundles.map((bundle) => (
            <div key={bundle.id}>
              <BundleCard bundle={bundle} />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Cara Pakai / Alur Penggunaan */}
      <section id="cara-pakai" className="px-4 sm:px-8">
        <div className="border-t border-black/[0.08] pt-16">
          <div className="max-w-2xl mb-10">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#54504c]">
              Alur Penggunaan
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#111111]">
              Cara Praktis Menggunakan Warung Desain
            </h2>
            <p className="mt-2 text-[15px] sm:text-[16px] text-[#595652]">
              Tanpa perlu mendaftar akun atau langganan bulanan. Cukup beli putus paket yang sedang dibutuhkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-5 flex flex-col justify-between">
              <div>
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#f6f5f4] text-[#111111] font-bold text-[13px] mb-3 border border-black/[0.06]">
                  1
                </div>
                <h3 className="font-semibold text-[15px] text-[#111111] mb-1.5">Pilih Paket</h3>
                <p className="text-[14px] text-[#595652] leading-relaxed">
                  Buka detail paket untuk melihat preview gambar resolusi tinggi yang sesuai tema tokomu.
                </p>
              </div>
            </div>

            <div className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-5 flex flex-col justify-between">
              <div>
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#f6f5f4] text-[#111111] font-bold text-[13px] mb-3 border border-black/[0.06]">
                  2
                </div>
                <h3 className="font-semibold text-[15px] text-[#111111] mb-1.5">Bayar via QRIS</h3>
                <p className="text-[14px] text-[#595652] leading-relaxed">
                  Scan QRIS resmi GoPay Merchant dengan nominal pas sampai 3 digit kode unik verifikasi.
                </p>
              </div>
            </div>

            <div className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-5 flex flex-col justify-between">
              <div>
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#f6f5f4] text-[#111111] font-bold text-[13px] mb-3 border border-black/[0.06]">
                  3
                </div>
                <h3 className="font-semibold text-[15px] text-[#111111] mb-1.5">Konfirmasi Nama</h3>
                <p className="text-[14px] text-[#595652] leading-relaxed">
                  Ketik nama pengirim lalu klik &quot;Cek Pembayaran&quot; agar mutasi langsung dicocokkan.
                </p>
              </div>
            </div>

            <div className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-5 flex flex-col justify-between">
              <div>
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#e6f3fe] text-[#005bb5] font-bold text-[13px] mb-3 border border-[#0075de]/20">
                  4
                </div>
                <h3 className="font-semibold text-[15px] text-[#111111] mb-1.5">Unduh &amp; Edit di Canva</h3>
                <p className="text-[14px] text-[#595652] leading-relaxed">
                  File ZIP langsung bisa diunduh di web dan terkirim ke email. Siap diposting ke medsos toko!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section id="faq" className="px-4 sm:px-8">
        <div className="border-t border-black/[0.08] pt-16">
          <div className="max-w-2xl mb-8">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#54504c]">
              Tanya Jawab
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#111111]">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="mt-1.5 text-[15px] sm:text-[16px] text-[#595652]">
              Penjelasan ringkas seputar pembelian dan pemakaian file desain.
            </p>
          </div>

          <div>
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* 5. Closing Section: Authentic Warmth of Warung Design */}
      <section className="px-4 sm:px-8">
        <div className="rounded-[16px] bg-[#221f1d] p-8 sm:p-12 text-white text-center shadow-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white/90 mb-4 border border-white/10">
            Mulai Promosi Sekarang
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight max-w-2xl mx-auto leading-tight">
            Tingkatkan Kualitas Visual Media Sosial Toko Anda Hari Ini
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] sm:text-[16.5px] text-white/80 leading-relaxed">
            Pilih paket desain siap upload dengan harga terjangkau mulai Rp 40 ribuan. Beli sekali, gunakan untuk promosi bisnis Anda selamanya.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#katalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0075de] px-6 py-3 text-[14.5px] font-medium text-white hover:bg-[#0060b8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              Pilih Paket Desain di Katalog
            </a>
            <a
              href="https://wa.me/6285182510575?text=Halo%20Admin%20Warung%20Design%2C%20saya%20ingin%20tanya%20seputar%20paket%20desain"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-white/10 hover:bg-white/15 px-5 py-3 text-[14.5px] font-medium text-white transition-colors border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              Konsultasi via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
