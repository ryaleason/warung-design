'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Order, OrderStatus } from '@/types';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/telegram';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Download,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface CheckoutFlowProps {
  initialOrder: Order;
}

export default function CheckoutFlow({ initialOrder }: CheckoutFlowProps) {
  const [order] = useState<Order>(initialOrder);
  const [status, setStatus] = useState<OrderStatus>(initialOrder.status);
  const [senderName, setSenderName] = useState(initialOrder.sender_name || '');
  const [downloadToken, setDownloadToken] = useState<string | null>(initialOrder.download_token || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Trigger celebration confetti when status becomes 'sukses'
  const confettiFiredRef = useRef(false);
  const fireConfetti = () => {
    if (confettiFiredRef.current) return;
    confettiFiredRef.current = true;
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }
  };

  useEffect(() => {
    if (status === 'sukses') {
      fireConfetti();
    }
  }, [status]);

  // 1. Supabase Realtime Listener
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`,
        },
        (payload: { new: { status?: OrderStatus; download_token?: string } }) => {
          if (payload.new && payload.new.status) {
            setStatus(payload.new.status);
            if (payload.new.download_token) {
              setDownloadToken(payload.new.download_token);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  // 2. Polling Fallback (every 4 seconds)
  useEffect(() => {
    if (status === 'sukses' || status === 'ditolak' || status === 'kedaluwarsa') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.status && data.status !== status) {
            setStatus(data.status);
            if (data.download_token) {
              setDownloadToken(data.download_token);
            }
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [order.id, status]);

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(order.total_amount.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleCopyOrderCode = () => {
    navigator.clipboard.writeText(order.order_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCheckPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!senderName.trim()) {
      setErrorMessage('Silakan isi nama pengirim atau nama rekening yang Anda gunakan transfer');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/check-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_name: senderName }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal mengirim konfirmasi');
        setIsSubmitting(false);
        return;
      }

      setStatus('menunggu_verifikasi');
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Terjadi gangguan koneksi');
    } finally {
      setIsSubmitting(false);
    }
  };


  const qrisImageSrc = process.env.NEXT_PUBLIC_QRIS_IMAGE_URL || '/qris-placeholder.svg';

  return (
    <div className="mx-auto max-w-4xl">
      {/* Top Header Card (12px radius, hairline border, no shadow) */}
      <div className="mb-6 rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#757575]">
                Kode Pesanan
              </span>
              <button
                onClick={handleCopyOrderCode}
                className="inline-flex items-center gap-1 rounded-[4px] bg-[#f6f5f4] px-2 py-0.5 text-[11px] font-mono font-bold text-[#111111] hover:bg-black/[0.08] transition-colors border border-black/[0.08]"
              >
                {order.order_code}
                {copiedCode ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-[#757575]" />}
              </button>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[#000000]">
              {order.bundle?.name || 'Paket Bundle Desain'}
            </h1>
            <p className="mt-1 text-[13px] text-[#615d59]">
              Atas nama: <strong className="text-[#000000]">{order.buyer_name}</strong> • Email: <strong className="text-[#000000]">{order.buyer_email}</strong>
            </p>
          </div>

          {/* Current Status Badge Pill */}
          <div className="shrink-0">
            {status === 'pending' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffb110]/20 px-3 py-1 text-[12px] font-semibold text-[#000000] border border-[#ffb110]/40">
                <Clock className="h-3.5 w-3.5 animate-pulse" />
                Menunggu Pembayaran
              </span>
            )}
            {status === 'menunggu_verifikasi' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f3fe] px-3 py-1 text-[12px] font-semibold text-[#0075de] border border-[#0075de]/30">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#0075de]" />
                Sedang Diverifikasi
              </span>
            )}
            {status === 'sukses' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Pembayaran Berhasil
              </span>
            )}
            {status === 'ditolak' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f64932]/10 px-3 py-1 text-[12px] font-semibold text-[#f64932] border border-[#f64932]/30">
                <XCircle className="h-3.5 w-3.5 text-[#f64932]" />
                Pembayaran Ditolak
              </span>
            )}
            {status === 'kedaluwarsa' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] px-3 py-1 text-[12px] font-semibold text-[#757575] border border-black/[0.1]">
                <AlertTriangle className="h-3.5 w-3.5 text-[#757575]" />
                Pesanan Kedaluwarsa
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Flow Content by Status */}
      {status === 'pending' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Left Column: QRIS Graphic */}
          <div className="md:col-span-5 flex flex-col items-center justify-center rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-6 text-center">
            <h3 className="font-semibold text-[15px] text-[#000000] mb-1">Scan QRIS GoPay Merchant</h3>
            <p className="text-[12px] text-[#757575] mb-4">
              Bisa di-scan menggunakan GoPay, BCA Mobile, OVO, DANA, ShopeePay, dll.
            </p>
            <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-[8px] overflow-hidden border border-black/[0.08] bg-[#f6f5f4]">
              <Image
                src={qrisImageSrc}
                alt="QRIS GoPay Merchant"
                fill
                priority
                className="object-contain p-2"
              />
            </div>
            <p className="mt-3 text-[11px] text-[#757575]">
              Warung Desain Official • QRIS GoPay Merchant
            </p>
          </div>

          {/* Right Column: Exact Nominal & Confirmation Form */}
          <div className="md:col-span-7 flex flex-col justify-between rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-6">
            <div>
              <div className="rounded-[8px] bg-[#ffb110]/10 border border-[#ffb110]/30 p-4">
                <div className="flex items-center justify-between text-[13px] text-[#615d59] mb-1">
                  <span>Harga Paket:</span>
                  <span>{formatRupiah(order.base_price)}</span>
                </div>
                <div className="flex items-center justify-between text-[13px] text-[#000000] font-medium mb-2">
                  <span className="flex items-center gap-1.5">
                    Kode Unik Pembayaran:
                    <span className="text-[10px] bg-[#ffb110] text-[#000000] px-1.5 py-0.2 rounded font-semibold">Otomatis</span>
                  </span>
                  <span>+ Rp {order.unique_code}</span>
                </div>
                <div className="border-t border-[#ffb110]/30 pt-2 flex items-center justify-between">
                  <span className="font-bold text-[#000000] text-[14px]">TOTAL HARUS DITRANSFER:</span>
                  <div className="text-right">
                    <span className="text-[22px] font-bold text-[#000000] block tracking-tight">
                      {formatRupiah(order.total_amount)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#ffb110]/20 pt-3">
                  <span className="text-[12px] text-[#615d59]">
                    ⚠️ Masukkan nominal <strong>persis sampai 3 digit</strong> agar verifikasi cepat.
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="shrink-0 inline-flex items-center gap-1 rounded-[6px] bg-[#0075de] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#0060b8] transition-colors"
                  >
                    {copiedAmount ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Salin Nominal
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Form Input Sender Name */}
              <form onSubmit={handleCheckPayment} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#111111] mb-1.5">
                    Nama Pemilik Rekening / Akun Pengirim <span className="text-[#f64932]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Contoh: Rani Maulida / GoPay Rani"
                    className="w-full rounded-[8px] border border-black/[0.12] bg-[#ffffff] px-3.5 py-2 text-[14px] text-[#000000] placeholder:text-[#757575]/60 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                  />
                  <p className="mt-1 text-[11px] text-[#757575]">
                    Diperlukan untuk mencocokkan mutasi masuk di rekening owner.
                  </p>
                </div>

                {errorMessage && (
                  <div className="rounded-[8px] bg-[#f64932]/10 p-3 text-[13px] text-[#f64932] border border-[#f64932]/20">
                    {errorMessage}
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
                      Mengirim Konfirmasi...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Sudah Transfer? Klik Cek Pembayaran
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 border-t border-black/[0.06] pt-4 flex items-center justify-between text-[12px] text-[#757575]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-[#0075de]" />
                Garansi akses langsung
              </span>
              <span>Batas verifikasi: 24 jam</span>
            </div>
          </div>
        </div>
      )}

      {/* State: Menunggu Verifikasi */}
      {status === 'menunggu_verifikasi' && (
        <div className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f3fe] text-[#0075de]">
            <RefreshCw className="h-7 w-7 animate-spin" />
          </div>

          <h2 className="mt-5 text-xl font-bold tracking-tight text-[#000000]">
            Sedang Diverifikasi oleh Owner Warung Desain
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[14px] text-[#615d59] leading-relaxed">
            Notifikasi pembayaran sebesar <strong>{formatRupiah(order.total_amount)}</strong> dari atas nama <strong>{senderName || order.sender_name}</strong> telah dikirim ke Telegram owner.
          </p>

          <div className="mx-auto mt-6 max-w-md rounded-[8px] bg-[#f6f5f4] p-4 text-left border border-black/[0.06]">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-[#0075de] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-[#000000]">
                  Halaman ini otomatis berganti ke halaman unduh
                </p>
                <p className="text-[12px] text-[#615d59] mt-1">
                  Anda tidak perlu me-refresh halaman. Estimasi pengecekan mutasi: <strong>5 - 15 menit</strong>.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[12px] text-[#757575]">
            Sedang memantau status secara realtime... (polling otomatis aktif)
          </p>
        </div>
      )}

      {/* State: Sukses */}
      {status === 'sukses' && (
        <div className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#000000]">
            Pembayaran Berhasil Diverifikasi!
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[14px] text-[#615d59] leading-relaxed">
            Terima kasih, <strong>{order.buyer_name}</strong>! File paket desain Anda sudah siap dan link unduh juga telah dikirim ke email <strong>{order.buyer_email}</strong>.
          </p>

          {/* Download Action Box */}
          <div className="mx-auto mt-8 max-w-md rounded-[12px] bg-[#f6f5f4] border border-black/[0.08] p-6 text-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f3fe] px-2.5 py-0.5 text-[11px] font-semibold text-[#0075de] mb-3">
              <Sparkles className="h-3 w-3" />
              Akses Unduh Langsung
            </span>
            
            <p className="font-bold text-[#000000] text-[17px] mb-1">
              {order.bundle?.name}
            </p>
            <p className="text-[12px] text-[#615d59] mb-6">
              Berisi gambar feed/story resolusi tinggi + prompt AI text format ZIP/manifest.
            </p>

            {downloadToken ? (
              <a
                href={`/api/download/${downloadToken}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0075de] px-5 py-3 text-[15px] font-medium text-white hover:bg-[#0060b8] transition-colors"
              >
                <Download className="h-4 w-4" />
                Unduh File Sekarang
              </a>
            ) : (
              <a
                href={`/api/download/${order.id}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0075de] px-5 py-3 text-[15px] font-medium text-white hover:bg-[#0060b8] transition-colors"
              >
                <Download className="h-4 w-4" />
                Unduh File Paket
              </a>
            )}

            <p className="mt-3 text-[11px] text-[#757575]">
              Masa berlaku link unduh aktif selama 48 jam. Simpan file di HP atau laptop Anda.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="text-[13px] font-medium text-[#0075de] hover:underline"
            >
              ← Kembali ke Katalog Utama
            </Link>
          </div>
        </div>
      )}

      {/* State: Ditolak */}
      {status === 'ditolak' && (
        <div className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f64932]/10 text-[#f64932]">
            <XCircle className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-xl font-bold tracking-tight text-[#000000]">
            Pembayaran Belum Dapat Dikonfirmasi
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[14px] text-[#615d59] leading-relaxed">
            Owner tidak menemukan mutasi masuk yang sesuai dengan nominal <strong>{formatRupiah(order.total_amount)}</strong> atau nama pengirim yang Anda masukkan.
          </p>

          <div className="mx-auto mt-6 max-w-md rounded-[8px] bg-[#ffb110]/10 p-4 text-left border border-[#ffb110]/30">
            <p className="text-[12px] text-[#000000] font-semibold mb-1">
              Sudah merasa transfer tapi ditolak?
            </p>
            <p className="text-[12px] text-[#615d59] leading-relaxed">
              Jangan khawatir. Hubungi langsung admin kami via WhatsApp dengan melampirkan bukti transfer dan Order ID <strong>{order.order_code}</strong>.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                `Halo Admin Warung Desain, saya ingin konfirmasi pembayaran untuk pesanan ${order.order_code} sebesar ${formatRupiah(order.total_amount)}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#0075de] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#0060b8] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Hubungi Admin via WhatsApp
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-[#757575] hover:text-[#000000] px-3 py-2"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      )}

      {/* State: Kedaluwarsa */}
      {status === 'kedaluwarsa' && (
        <div className="rounded-[12px] border border-black/[0.08] bg-[#ffffff] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/[0.05] text-[#757575]">
            <Clock className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-xl font-bold tracking-tight text-[#000000]">
            Pesanan Telah Kedaluwarsa
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[14px] text-[#615d59] leading-relaxed">
            Pesanan ini telah melewati batas waktu pembayaran (24 jam) dan kode unik nominal telah dibebaskan untuk pesanan lain.
          </p>

          <div className="mt-6">
            <Link
              href={`/bundles/${order.bundle?.slug || ''}`}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#0075de] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#0060b8] transition-colors"
            >
              Buat Pesanan Baru
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
