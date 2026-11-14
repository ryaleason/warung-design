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
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Mail,
  ChevronDown,
  User,
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
  const [isEmailInfoOpen, setIsEmailInfoOpen] = useState(false);

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


  const rawQrisUrl = process.env.NEXT_PUBLIC_QRIS_IMAGE_URL?.trim();
  const qrisImageSrc =
    !rawQrisUrl ||
    rawQrisUrl === '/qris-gopay-placeholder.png' ||
    rawQrisUrl === '/qris-placeholder.svg'
      ? '/qris.jpeg'
      : rawQrisUrl;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8c8884]">
                Kode Pesanan
              </span>
              <button
                type="button"
                onClick={handleCopyOrderCode}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#fbfaf9] px-2.5 py-0.5 text-[11.5px] font-mono font-bold text-[#111111] hover:bg-black/[0.06] transition-colors border border-black/[0.08] cursor-pointer"
              >
                <span>{order.order_code}</span>
                {copiedCode ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-[#8c8884]" />}
              </button>
            </div>
            <h1 className="mt-1.5 font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
              {order.bundle?.name || 'Paket Bundle Desain'}
            </h1>
            <p className="mt-1 text-[13.5px] text-[#54504c]">
              Atas nama: <strong className="text-[#111111] font-medium">{order.buyer_name}</strong> • Email: <strong className="text-[#111111] font-medium">{order.buyer_email}</strong>
            </p>
          </div>

          {/* Current Status Badge Pill */}
          <div className="shrink-0">
            {status === 'pending' && (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1.5 text-[12.5px] font-medium text-amber-800 border border-amber-200/80">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Menunggu Pembayaran
              </span>
            )}
            {status === 'menunggu_verifikasi' && (
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-[12.5px] font-medium text-[#0075de] border border-[#0075de]/20">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#0075de]" />
                Sedang Diverifikasi
              </span>
            )}
            {status === 'sukses' && (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12.5px] font-medium text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Pembayaran Berhasil
              </span>
            )}
            {status === 'ditolak' && (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1.5 text-[12.5px] font-medium text-red-800 border border-red-200">
                <XCircle className="h-3.5 w-3.5 text-red-600" />
                Pembayaran Ditolak
              </span>
            )}
            {status === 'kedaluwarsa' && (
              <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3.5 py-1.5 text-[12.5px] font-medium text-stone-700 border border-black/[0.08]">
                <AlertTriangle className="h-3.5 w-3.5 text-stone-600" />
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
          <div className="md:col-span-5 flex flex-col items-center justify-between rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.04)] text-center">
            <div>
              <h3 className="font-serif font-semibold text-[17px] sm:text-[18px] text-[#111111]">
                Scan QRIS GoPay Merchant
              </h3>
              <p className="text-[13px] text-[#54504c] mt-1 mb-5 leading-relaxed">
                Dapat di-scan dengan GoPay, BCA, OVO, DANA, ShopeePay, dan semua e-wallet / mobile banking.
              </p>

              <div className="relative mx-auto w-full max-w-[260px] aspect-[4/5] rounded-2xl overflow-hidden border border-black/[0.08] bg-white shadow-xs p-2">
                <Image
                  src={qrisImageSrc}
                  alt="QRIS GoPay Merchant"
                  fill
                  priority
                  unoptimized
                  className="object-contain p-2"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes('qris.jpeg')) {
                      target.src = '/qris.jpeg';
                    }
                  }}
                />
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-black/[0.06] w-full text-center">
              <span className="text-[12px] font-medium text-[#54504c]">
                Warung Design Official • QRIS GoPay Merchant
              </span>
            </div>
          </div>

          {/* Right Column: Exact Nominal & Confirmation Form */}
          <div className="md:col-span-7 flex flex-col justify-between rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <div>
              {/* Receipt Summary Box */}
              <div className="rounded-2xl bg-[#fbfaf9] border border-black/[0.08] p-5 space-y-3.5">
                <div className="flex items-center justify-between text-[13.5px] text-[#54504c]">
                  <span>Harga Paket:</span>
                  <span className="font-medium text-[#111111]">{formatRupiah(order.base_price)}</span>
                </div>

                <div className="flex items-center justify-between text-[13.5px] text-[#54504c]">
                  <span className="inline-flex items-center gap-1.5">
                    <span>Kode Unik Pembayaran:</span>
                    <span className="text-[11px] font-semibold bg-stone-200/70 text-[#111111] px-2 py-0.5 rounded-full">
                      Otomatis
                    </span>
                  </span>
                  <span className="font-medium text-[#111111]">+ Rp {order.unique_code}</span>
                </div>

                <div className="border-t border-black/[0.08] pt-3.5 flex items-baseline justify-between">
                  <span className="text-[12.5px] font-bold uppercase tracking-wider text-[#54504c]">
                    Total Harus Ditransfer:
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0075de] tracking-tight">
                    {formatRupiah(order.total_amount)}
                  </span>
                </div>

                <div className="border-t border-black/[0.08] pt-3.5 flex items-center justify-between gap-3">
                  <span className="text-[12px] text-[#54504c] leading-snug">
                    Transfer <strong>persis sampai 3 digit terakhir</strong> agar verifikasi otomatis.
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#111111] hover:bg-[#0075de] text-white px-4 py-2 text-[12.5px] font-medium transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    {copiedAmount ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Salin Nominal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Form Input Sender Name */}
              <form onSubmit={handleCheckPayment} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[12.5px] font-semibold text-[#111111]">
                    Nama Pemilik Rekening / Akun Pengirim <span className="text-[#0075de] font-bold">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8884]" />
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Contoh: Rani Maulida / GoPay Rani"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.12] bg-[#fbfaf9] focus:bg-white text-[14px] text-[#111111] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#0075de] focus:ring-4 focus:ring-[#0075de]/10 transition-all"
                    />
                  </div>
                  <p className="text-[12px] text-[#54504c]">
                    Diperlukan untuk mencocokkan mutasi masuk di rekening owner.
                  </p>
                </div>

                {errorMessage && (
                  <div className="rounded-2xl bg-red-50 border border-red-200/80 p-3.5 flex items-start gap-2.5 text-[13px] text-red-700 animate-in fade-in duration-200">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{errorMessage}</span>
                  </div>
                )}

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#0084f7] via-[#0075de] to-[#0064c8] py-3.5 px-6 text-[15px] font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_8px_20px_rgba(0,117,222,0.32)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_12px_28px_rgba(0,117,222,0.42)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:pointer-events-none group"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Mengirim Konfirmasi...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Sudah Transfer? Klik Cek Pembayaran</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 border-t border-black/[0.06] pt-4 flex items-center justify-between text-[12px] text-[#54504c]">
              <span className="inline-flex items-center gap-1.5">
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
        <div className="rounded-3xl border border-black/[0.08] bg-white p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0075de] ring-8 ring-blue-50/50">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
              Sedang Diverifikasi oleh Owner Warung Design
            </h2>
            <p className="mx-auto max-w-lg text-[14.5px] text-[#54504c] leading-relaxed">
              Notifikasi pembayaran sebesar <strong className="text-[#111111]">{formatRupiah(order.total_amount)}</strong> dari atas nama <strong className="text-[#111111]">{senderName || order.sender_name}</strong> telah terkirim ke Telegram owner.
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-2xl bg-[#fbfaf9] p-5 text-left border border-black/[0.06]">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#0075de] shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] font-semibold text-[#111111]">
                  Halaman ini otomatis berganti ke halaman unduh
                </p>
                <p className="text-[13px] text-[#54504c] mt-1 leading-relaxed">
                  Anda tidak perlu me-refresh halaman. Estimasi pengecekan mutasi: <strong>5 - 15 menit</strong>.
                </p>
              </div>
            </div>
          </div>

          <p className="text-[12.5px] text-[#8c8884] pt-2">
            Sedang memantau status secara realtime... (polling otomatis aktif)
          </p>
        </div>
      )}

      {/* State: Sukses */}
      {status === 'sukses' && (
        <div className="rounded-3xl border border-black/[0.08] bg-white p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
              Pembayaran Berhasil Diverifikasi!
            </h2>
            <p className="mx-auto max-w-lg text-[14.5px] text-[#54504c] leading-relaxed">
              Terima kasih, <strong className="text-[#111111]">{order.buyer_name}</strong>! Pembayaran Anda telah kami terima dan transaksi dinyatakan selesai.
            </p>
          </div>

          {/* Direct Download Action Box */}
          <div className="mx-auto max-w-lg rounded-3xl bg-[#fbfaf9] border border-black/[0.08] p-6 sm:p-8 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-[#0075de]/20 px-3 py-1 text-[11.5px] font-semibold text-[#0075de]">
              Akses Unduh Langsung
            </span>

            <div>
              <p className="font-serif font-bold text-[#111111] text-[20px]">
                {order.bundle?.name}
              </p>
              <p className="text-[13px] text-[#54504c] mt-1">
                Klik tombol di bawah untuk langsung mengunduh file paket bundle (.ZIP):
              </p>
            </div>

            <div className="pt-2">
              {downloadToken ? (
                <a
                  href={`/api/download/${downloadToken}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#0084f7] via-[#0075de] to-[#0064c8] py-4 px-7 text-[15px] font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_8px_20px_rgba(0,117,222,0.32)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_12px_28px_rgba(0,117,222,0.42)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Unduh File Paket (.ZIP) Sekarang</span>
                </a>
              ) : (
                <a
                  href={`/api/download/${order.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#0084f7] via-[#0075de] to-[#0064c8] py-4 px-7 text-[15px] font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_8px_20px_rgba(0,117,222,0.32)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_12px_28px_rgba(0,117,222,0.42)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Unduh File Paket (.ZIP)</span>
                </a>
              )}
            </div>

            <p className="text-[12px] text-[#8c8884]">
              Masa berlaku link unduh aktif selama 48 jam. Simpan file di HP atau laptop Anda.
            </p>
          </div>

          {/* Clean & Compact Collapsible: Email & Spam Notice */}
          <div className="mx-auto max-w-lg rounded-2xl border border-black/[0.08] bg-white text-left text-[13px] overflow-hidden">
            <button
              type="button"
              onClick={() => setIsEmailInfoOpen(!isEmailInfoOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-[#54504c] hover:bg-black/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#0075de] shrink-0" />
                <span className="text-[13px] text-[#111111] font-medium">
                  File ZIP juga dikirim ke email ({order.buyer_email})
                </span>
              </div>
              <div className="flex items-center gap-1 text-[12px] text-[#8c8884] shrink-0 ml-2">
                <span>{isEmailInfoOpen ? 'Tutup' : 'Cek info spam'}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isEmailInfoOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {isEmailInfoOpen && (
              <div className="px-4 pb-4 pt-2 text-[12.5px] text-[#54504c] border-t border-black/[0.06] bg-[#fbfaf9] space-y-2 leading-relaxed">
                <p>
                  Link unduhan file ZIP sudah dikirimkan ke <strong>{order.buyer_email}</strong>.
                </p>
                <div className="rounded-xl bg-white border border-black/[0.06] p-3 text-[#111111]">
                  <p className="font-semibold text-[12px]">
                    ⚠️ Jika tidak ada di Kotak Masuk (Inbox):
                  </p>
                  <p className="mt-1 text-[12px] text-[#54504c]">
                    Silakan <strong>buka folder SPAM atau Junk</strong> pada email Anda, lalu klik tombol <strong>&ldquo;Bukan Spam&rdquo; (Report not spam)</strong> agar file &amp; link dapat dibuka dengan normal.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#0075de] hover:underline"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Kembali ke Katalog Utama</span>
            </Link>
          </div>
        </div>
      )}

      {/* State: Ditolak */}
      {status === 'ditolak' && (
        <div className="rounded-3xl border border-black/[0.08] bg-white p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/50">
            <XCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
              Pembayaran Belum Dapat Dikonfirmasi
            </h2>
            <p className="mx-auto max-w-lg text-[14.5px] text-[#54504c] leading-relaxed">
              Owner tidak menemukan mutasi masuk yang sesuai dengan nominal <strong className="text-[#111111]">{formatRupiah(order.total_amount)}</strong> atau nama pengirim yang Anda masukkan.
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-2xl bg-amber-50/80 p-4 sm:p-5 text-left border border-amber-200/70">
            <p className="text-[13.5px] text-[#111111] font-semibold mb-1">
              Sudah merasa transfer tapi ditolak?
            </p>
            <p className="text-[13px] text-[#54504c] leading-relaxed">
              Jangan khawatir. Hubungi langsung admin kami via WhatsApp dengan melampirkan bukti transfer dan Order ID <strong>{order.order_code}</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/6285182510575?text=${encodeURIComponent(
                `Halo Admin Warung Design, saya ingin konfirmasi pembayaran untuk pesanan ${order.order_code} sebesar ${formatRupiah(order.total_amount)}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#0084f7] via-[#0075de] to-[#0064c8] px-6 py-3 text-[14px] font-semibold text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Hubungi Admin via WhatsApp</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white hover:bg-stone-50 px-5 py-3 text-[13.5px] font-medium text-[#111111] transition-all"
            >
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      )}

      {/* State: Kedaluwarsa */}
      {status === 'kedaluwarsa' && (
        <div className="rounded-3xl border border-black/[0.08] bg-white p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-600 ring-8 ring-stone-100/50">
            <Clock className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
              Pesanan Telah Kedaluwarsa
            </h2>
            <p className="mx-auto max-w-lg text-[14.5px] text-[#54504c] leading-relaxed">
              Pesanan ini telah melewati batas waktu pembayaran (24 jam) dan kode unik nominal telah dibebaskan untuk pesanan lain.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href={`/bundles/${order.bundle?.slug || ''}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#0084f7] via-[#0075de] to-[#0064c8] px-7 py-3.5 text-[14.5px] font-semibold text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>Buat Pesanan Baru</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
