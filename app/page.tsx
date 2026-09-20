import { getBundles } from '@/lib/db';
import BundleCard from '@/components/BundleCard';
import FAQAccordion from '@/components/FAQAccordion';
import {
  ShoppingBag,
  ImageIcon,
  Smartphone,
  Clock,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  const bundles = await getBundles();

  return (
    <div className="space-y-24 pb-20 max-w-[1440px] mx-auto">
      {/* 1. Hero Section */}
      <section className="pt-16 pb-10 sm:pt-24 sm:pb-14 text-center px-4 sm:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Confident, Human Headline without AI pill capsules */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.03em] text-[#111111] leading-[1.18] max-w-3xl mx-auto">
            Bikin postingan promosi toko makin menarik tanpa repot sewa desainer.
          </h1>

          {/* Subhead: clear human value without AI buzzwords */}
          <p className="mx-auto mt-6 max-w-2xl text-[16px] sm:text-[17px] text-[#595652] leading-relaxed">
            Koleksi bundle template visual siap upload untuk feed dan story media sosial toko Anda. File gambar resolusi tinggi siap pakai, tinggal ganti foto dan ketik teks promo di Canva dalam hitungan menit.
          </p>

          {/* Two-button CTA row: Primary conversion + Secondary anchor */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#katalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0075de] px-6 py-3 text-[15px] font-medium text-white hover:bg-[#0060b8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="h-4 w-4" />
              Lihat Katalog Paket
            </a>
            <a
              href="#cara-pakai"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-[8px] bg-[#e6f3fe] px-6 py-3 text-[15px] font-medium text-[#005bb5] hover:bg-[#d5ebfc] hover:text-[#004ea2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2 cursor-pointer"
            >
              Cara Penggunaan
            </a>
          </div>

          {/* Unified Value Highlights: Authentic Warung Trust Bar (R-14 & R-20) */}
          <div className="mt-14 rounded-[12px] bg-[#ffffff] border border-black/[0.08] p-5 sm:p-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 divide-y sm:divide-y-0 sm:divide-x divide-black/[0.06]">
              <div className="flex items-start gap-3.5 pt-3 sm:pt-0 sm:px-3 first:pl-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#e6f3fe] text-[#005bb5]">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[14.5px] font-semibold text-[#111111]">Gambar Jadi Siap Pakai</h4>
                  <p className="text-[13px] text-[#54504c] mt-0.5 leading-snug">PNG transparan &amp; JPG tajam langsung pakai</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 sm:pt-0 sm:px-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#f6d5b8]/50 text-[#8b4513]">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[14.5px] font-semibold text-[#111111]">Edit Cepat di Canva</h4>
                  <p className="text-[13px] text-[#54504c] mt-0.5 leading-snug">Tinggal tempel logo toko &amp; teks harga di HP</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 sm:pt-0 sm:px-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#ffb110]/20 text-[#7a5200]">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[14.5px] font-semibold text-[#111111]">Verifikasi 5-15 Menit</h4>
                  <p className="text-[13px] text-[#54504c] mt-0.5 leading-snug">Link unduhan otomatis aktif di halaman web</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 sm:pt-0 sm:px-3 last:pr-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-emerald-50 text-emerald-800">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[14.5px] font-semibold text-[#111111]">Bebas Royalti Toko</h4>
                  <p className="text-[13px] text-[#54504c] mt-0.5 leading-snug">Lisensi komersial untuk olshop &amp; medsos tokomu</p>
                </div>
              </div>
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
