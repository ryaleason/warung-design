import { getBundles } from '@/lib/db';
import BundleCard from '@/components/BundleCard';
import FAQAccordion from '@/components/FAQAccordion';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  HelpCircle,
  Clock,
  Palette,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  const bundles = await getBundles();

  return (
    <div className="space-y-20 pb-20 max-w-[1440px] mx-auto">
      {/* 1. Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 text-center px-4 sm:px-8">
        <div className="mx-auto max-w-4xl">

          {/* Headline with embedded Hero Highlight Pill */}
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl sm:text-6xl lg:text-[64px] font-semibold tracking-[-0.035em] text-[#000000] leading-[1.15]"
          >
            Posting promo jualan menarik{' '}
            <span className="inline-block rounded-full bg-[#f6d5b8] text-[#000000] px-4 sm:px-5 py-0.5 mx-1 font-semibold">
              tanpa desainer
            </span>
          </h1>

          {/* Subhead with warm graphite cast */}
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="mx-auto mt-6 max-w-2xl text-[16px] sm:text-[18px] text-[#615d59] leading-relaxed"
          >
            Paket desain musiman siap pakai (feed &amp; story) hasil kurasi AI generatif terbaik. Dapatkan gambar resolusi tinggi langsung pakai plus bonus prompt untuk variasi mandiri.
          </p>

          {/* Two-button CTA row: Primary + Ghost CTA */}
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href="#katalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0075de] px-5 py-2.5 text-[15px] font-medium text-white hover:bg-[#0060b8] transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Lihat Katalog Paket
            </a>
            <a
              href="#cara-pakai"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-[#e6f3fe] px-5 py-2.5 text-[15px] font-medium text-[#0075de] hover:bg-[#d5ebfc] transition-colors"
            >
              Cara Penggunaan
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {/* 4 Feature Accent Cards on Canvas (hairline border, no shadow) */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div
              data-aos="fade-up"
              data-aos-delay="350"
              className="p-4 rounded-[12px] bg-[#ffffff] border border-black/[0.08]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#e6f3fe] text-[#0075de] mb-3">
                <Zap className="h-4 w-4" />
              </div>
              <p className="text-[14px] font-semibold text-[#000000]">Bukan Teks Mentah</p>
              <p className="text-[12px] text-[#757575] mt-0.5">Hasil gambar jadi &amp; kurasi</p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="450"
              className="p-4 rounded-[12px] bg-[#ffffff] border border-black/[0.08]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#f6d5b8] text-[#000000] mb-3">
                <Smartphone className="h-4 w-4" />
              </div>
              <p className="text-[14px] font-semibold text-[#000000]">Edit Cukup di HP</p>
              <p className="text-[12px] text-[#757575] mt-0.5">Tinggal tempel logo &amp; teks</p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="550"
              className="p-4 rounded-[12px] bg-[#ffffff] border border-black/[0.08]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#ffb110]/20 text-[#000000] mb-3">
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-[14px] font-semibold text-[#000000]">Kirim &lt; 15 Menit</p>
              <p className="text-[12px] text-[#757575] mt-0.5">Link unduh otomatis di web</p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="650"
              className="p-4 rounded-[12px] bg-[#ffffff] border border-black/[0.08]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-emerald-50 text-emerald-700 mb-3">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="text-[14px] font-semibold text-[#000000]">Bebas Royalti</p>
              <p className="text-[12px] text-[#757575] mt-0.5">Lisensi komersial seumur hidup</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bundle Catalog Section */}
      <section id="katalog" className="px-4 sm:px-8">
        <div
          data-aos="fade-up"
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#757575]">
              Pilihan Tema Bundle
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#000000]">
              Katalog Bundle Desain Siap Pakai
            </h2>
            <p className="mt-1 text-[14px] text-[#615d59]">
              Pilih paket sesuai momen promosi toko atau kategori bisnis Anda.
            </p>
          </div>
        </div>

        {/* Grid Bundles */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bundles.map((bundle, idx) => (
            <div
              key={bundle.id}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <BundleCard bundle={bundle} />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Cara Pakai / Alur Penggunaan */}
      <section id="cara-pakai" className="px-4 sm:px-8">
        <div className="border-t border-black/[0.08] pt-16">
          <div data-aos="fade-up" className="max-w-2xl mb-10">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#757575]">
              Alur Penggunaan
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#000000]">
              4 Langkah Cepat Menggunakan Warung Desain
            </h2>
            <p className="mt-2 text-[14px] text-[#615d59]">
              Tanpa perlu akun atau langganan bulanan. Beli putus paket yang dibutuhkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-5"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#f6f5f4] text-[#111111] font-bold text-[13px] mb-3 border border-black/[0.06]">
                1
              </div>
              <h3 className="font-semibold text-[15px] text-[#000000] mb-1.5">Pilih Paket</h3>
              <p className="text-[13px] text-[#615d59] leading-normal">
                Lihat preview desain dan pilih bundle yang cocok dengan tema promosi bisnis Anda.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-5"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#f6f5f4] text-[#111111] font-bold text-[13px] mb-3 border border-black/[0.06]">
                2
              </div>
              <h3 className="font-semibold text-[15px] text-[#000000] mb-1.5">Bayar via QRIS</h3>
              <p className="text-[13px] text-[#615d59] leading-normal">
                Scan QRIS GoPay Merchant dengan nominal unik otomatis sampai 3 digit terakhir.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-5"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#f6f5f4] text-[#111111] font-bold text-[13px] mb-3 border border-black/[0.06]">
                3
              </div>
              <h3 className="font-semibold text-[15px] text-[#000000] mb-1.5">Konfirmasi Transfer</h3>
              <p className="text-[13px] text-[#615d59] leading-normal">
                Masukkan nama pengirim dan klik &quot;Cek Pembayaran&quot;. Owner menerima notifikasi via bot Telegram.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-5"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#e6f3fe] text-[#0075de] font-bold text-[13px] mb-3 border border-[#0075de]/20">
                4
              </div>
              <h3 className="font-semibold text-[15px] text-[#000000] mb-1.5">Unduh &amp; Posting</h3>
              <p className="text-[13px] text-[#615d59] leading-normal">
                Halaman otomatis menampilkan tombol download &amp; file terkirim ke email. Siap edit di Canva.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section id="faq" className="px-4 sm:px-8">
        <div className="border-t border-black/[0.08] pt-16">
          <div data-aos="fade-up" className="max-w-2xl mb-8">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#757575]">
              Tanya Jawab
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#000000]">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <FAQAccordion />
        </div>
      </section>

      {/* 5. Dark Feature Card (Midnight Ink #02093a) */}
      <section className="px-4 sm:px-8">
        <div
          data-aos="zoom-in"
          data-aos-duration="600"
          className="rounded-[12px] bg-[#02093a] p-8 sm:p-12 text-white text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Mulai Tingkatkan Kualitas Visual Media Sosial Toko Anda
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[14px] sm:text-[15px] text-white/80 leading-relaxed">
            Dapatkan puluhan template desain promosi berenergi tinggi dengan modal terjangkau mulai Rp 40 ribuan.
          </p>
          <div className="mt-6">
            <a
              href="#katalog"
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#0075de] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#0060b8] transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Pilih Paket Desain Sekarang
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
