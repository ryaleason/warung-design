import { getBundleBySlug, getBundles } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BundleImageGallery from '@/components/BundleImageGallery';
import BundleCheckoutCard from '@/components/BundleCheckoutCard';
import {
  CheckCircle2,
  ArrowLeft,
  FileCheck,
  Zap,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const bundles = await getBundles();
  return bundles.map((b) => ({ slug: b.slug }));
}

export default async function BundleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const bundle = await getBundleBySlug(slug);

  if (!bundle) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-8 sm:py-12">
      {/* Back to Catalog Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/#katalog"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#757575] hover:text-[#000000] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Semua Paket
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Image Gallery & Content (7 cols) */}
        <div data-aos="fade-right" className="lg:col-span-7 space-y-6">
          {/* Gallery */}
          <BundleImageGallery images={bundle.preview_images} bundleName={bundle.name} />

          {/* Title & Description */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-[#e6f3fe] px-2.5 py-0.5 text-[11px] font-semibold text-[#0075de]">
                {bundle.category || 'Paket Bundle'}
              </span>
              {bundle.badge && (
                <span className="rounded-full bg-[#ffb110] px-2.5 py-0.5 text-[11px] font-semibold text-[#000000]">
                  {bundle.badge}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#000000] leading-tight">
              {bundle.name}
            </h1>
            <p className="mt-3 text-[16.5px] text-[#615d59] leading-relaxed">
              {bundle.description}
            </p>
          </div>

          {/* Apa Saja yang Anda Dapatkan */}
          <div className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-6">
            <h2 className="text-[16px] font-semibold text-[#000000] flex items-center gap-2 mb-4">
              <FileCheck className="h-4 w-4 text-[#0075de]" />
              Apa Saja yang Ada di Dalam Paket Ini?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bundle.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[13px] text-[#615d59]">
                  <CheckCircle2 className="h-4 w-4 text-[#0075de] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Panduan Singkat Pemakaian */}
          <div className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-6">
            <h2 className="text-[16px] font-semibold text-[#000000] mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#ffb110]" />
              Cara Memakai File Setelah Pembelian
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-[13px] text-[#615d59] leading-relaxed">
              <li>
                Download file ZIP paket melalui halaman sukses atau link yang dikirim ke email Anda.
              </li>
              <li>
                Ekstrak file di HP atau komputer. Anda akan menemukan gambar desain PNG transparan &amp; JPG resolusi tinggi.
              </li>
              <li>
                Buka Canva atau aplikasi edit favorit Anda, pasang gambar sebagai background, lalu tambahkan logo toko dan teks promo Anda.
              </li>
              <li>
                Selesai! Desain siap diposting ke Instagram, WhatsApp Story, atau etalase olshop.
              </li>
            </ol>
          </div>
        </div>

        {/* Right Column: Sticky Checkout Form Card (5 cols) */}
        <div data-aos="fade-left" className="lg:col-span-5">
          <div className="sticky top-20">
            <BundleCheckoutCard bundle={bundle} />
          </div>
        </div>
      </div>
    </div>
  );
}
