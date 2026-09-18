'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bundle } from '@/types';
import { formatRupiah } from '@/lib/telegram';
import { ArrowRight, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

interface BundleCheckoutCardProps {
  bundle: Bundle;
}

export default function BundleCheckoutCard({ bundle }: BundleCheckoutCardProps) {
  const router = useRouter();
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!buyerName.trim() || !buyerEmail.trim()) {
      setErrorMsg('Nama dan email wajib diisi untuk pengiriman file');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bundle_id: bundle.id,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_phone: buyerPhone || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal membuat pesanan');
        setIsSubmitting(false);
        return;
      }

      // Redirect directly to the checkout payment page
      router.push(`/checkout/${data.order.id}`);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Terjadi kesalahan koneksi');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-6">
      <div className="border-b border-black/[0.06] pb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#757575]">
          Ringkasan Pembelian
        </span>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-[24px] font-bold tracking-tight text-[#000000]">
            {formatRupiah(bundle.price)}
          </span>
          <span className="rounded-full bg-[#f6d5b8] px-2.5 py-0.5 text-[11px] font-semibold text-[#000000]">
            Beli Putus (Sekali Bayar)
          </span>
        </div>
        <p className="mt-1 text-[13px] text-[#615d59]">
          Akses unduh langsung tanpa biaya langganan bulanan.
        </p>
      </div>

      <form onSubmit={handleCheckout} className="mt-5 space-y-4">
        <div>
          <label className="block text-[12px] font-medium text-[#111111] mb-1">
            Nama Lengkap <span className="text-[#f64932]">*</span>
          </label>
          <input
            type="text"
            required
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Contoh: Rani Maulida"
            className="w-full rounded-[8px] border border-black/[0.12] bg-[#ffffff] px-3.5 py-2 text-[14px] text-[#000000] placeholder:text-[#757575]/60 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#111111] mb-1">
            Email Pembeli (Untuk Link Unduh) <span className="text-[#f64932]">*</span>
          </label>
          <input
            type="email"
            required
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder="Contoh: rani.olshop@gmail.com"
            className="w-full rounded-[8px] border border-black/[0.12] bg-[#ffffff] px-3.5 py-2 text-[14px] text-[#000000] placeholder:text-[#757575]/60 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
          />
          <p className="mt-1 text-[11px] text-[#757575]">
            Pastikan email aktif, file download juga akan dikirim ke sini.
          </p>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#111111] mb-1">
            Nomor WhatsApp (Opsional)
          </label>
          <input
            type="tel"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full rounded-[8px] border border-black/[0.12] bg-[#ffffff] px-3.5 py-2 text-[14px] text-[#000000] placeholder:text-[#757575]/60 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
          />
        </div>

        {errorMsg && (
          <div className="rounded-[8px] bg-[#f64932]/10 p-3 text-[13px] text-[#f64932] border border-[#f64932]/20">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0075de] px-4 py-2.5 text-[14px] font-medium text-white hover:bg-[#0060b8] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Menyiapkan Pembayaran...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Lanjut ke Pembayaran QRIS
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 space-y-2 border-t border-black/[0.06] pt-4 text-[12px] text-[#757575]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#0075de] shrink-0" />
          <span>QRIS Statis GoPay Merchant resmi &amp; aman</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#0075de] shrink-0" />
          <span>Verifikasi &amp; pengiriman otomatis &lt; 15 menit</span>
        </div>
      </div>
    </div>
  );
}
