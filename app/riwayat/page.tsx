'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { Order, OrderStatus } from '@/types';
import { formatRupiah } from '@/lib/telegram';
import {
  ShoppingBag,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  User,
} from 'lucide-react';

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
}

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'sukses':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Pembayaran Berhasil
        </span>
      );
    case 'menunggu_verifikasi':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Menunggu Verifikasi Admin
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
          <Clock className="w-3.5 h-3.5 text-stone-500" />
          Menunggu Pembayaran
        </span>
      );
    case 'ditolak':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5" />
          Ditolak
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] bg-stone-100 text-stone-700">
          {status}
        </span>
      );
  }
}

export default function RiwayatPesananPage() {
  const { user, isLoading: isAuthLoading, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/orders');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal memuat pesanan');
      }
      setOrders(data.orders || []);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    if (!user) {
      return;
    }

    async function loadInitialOrders() {
      try {
        const res = await fetch('/api/auth/orders');
        const data = await res.json();
        if (!ignore) {
          if (!res.ok || !data.success) {
            setErrorMsg(data.error || 'Gagal memuat pesanan');
          } else {
            setOrders(data.orders || []);
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          const error = err as Error;
          setErrorMsg(error.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadInitialOrders();
    return () => {
      ignore = true;
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f6f5f4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#757575]">
                Akun &amp; Transaksi
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-[#111111] mt-1">
                Riwayat Pembelian Saya
              </h1>
              <p className="text-[13.5px] text-[#757575] mt-1">
                Semua template bundle yang pernah Anda beli dan tautan download file digital.
              </p>
            </div>

            {user && (
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchOrders}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/10 bg-white text-[13px] font-medium text-stone-700 hover:bg-stone-50"
                  title="Segarkan riwayat"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Segarkan</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Not Logged In State */}
        {!user && !isAuthLoading && (
          <div className="rounded-2xl border border-black/[0.08] bg-white p-8 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-[#0075de] flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-[#111111]">Masuk untuk Melihat Riwayat Pesanan</h3>
              <p className="text-[13.5px] text-[#757575] mt-1 leading-relaxed">
                Silakan masuk atau daftar akun baru untuk mengakses seluruh bundle desain yang pernah Anda pesan sebelumnya.
              </p>
            </div>
            <div className="flex justify-center gap-2.5 pt-2">
              <button
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0075de] hover:bg-[#005bb5] text-white text-[13.5px] font-semibold transition-colors shadow-xs"
              >
                <span>Masuk Akun</span>
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-black/10 bg-white hover:bg-stone-50 text-stone-800 text-[13.5px] font-medium transition-colors"
              >
                <span>Daftar Akun Baru</span>
              </button>
            </div>
          </div>
        )}

        {/* Logged In Orders List */}
        {user && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-black/[0.08] bg-white p-10 text-center text-[#757575]">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0075de]" />
                <p className="text-[14px]">Memuat riwayat transaksi Anda...</p>
              </div>
            ) : errorMsg ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-[13px] text-rose-800">
                {errorMsg}
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-black/[0.08] bg-white p-10 text-center space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-[#111111]">Belum Ada Pesanan</h3>
                  <p className="text-[13.5px] text-[#757575] mt-1">
                    Anda belum memiliki riwayat pembelian bundle desain. Jelajahi katalog paket promosi kami untuk mulai meningkatkan promosi toko Anda.
                  </p>
                </div>
                <Link
                  href="/#katalog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0075de] hover:bg-[#005bb5] text-white text-[13.5px] font-semibold transition-colors shadow-xs"
                >
                  <span>Lihat Katalog Paket</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const isSukses = order.status === 'sukses';

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-black/[0.08] bg-white p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-black/[0.06] gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[13px] font-bold px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[#111111]">
                          {order.order_code}
                        </span>
                        <span className="text-[12px] text-[#757575]">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-[16px] text-[#111111]">
                          {order.bundle?.name || 'Paket Bundle Desain'}
                        </h3>
                        <p className="text-[12.5px] text-[#757575] mt-0.5">
                          Total Pembayaran:{' '}
                          <strong className="text-[#111111]">{formatRupiah(order.total_amount)}</strong>
                          <span className="text-stone-400 ml-1 font-mono text-[11px]">
                            (kode unik: {order.unique_code})
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSukses && order.download_token ? (
                          <a
                            href={`/api/download/${order.download_token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition-colors shadow-xs"
                          >
                            <Download className="w-4 h-4" />
                            <span>Unduh File Bundle</span>
                          </a>
                        ) : order.status === 'pending' || order.status === 'menunggu_verifikasi' ? (
                          <Link
                            href={`/checkout/${order.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0075de] hover:bg-[#005bb5] text-white text-[13px] font-semibold transition-colors shadow-xs"
                          >
                            <span>Buka Halaman Pembayaran</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        ) : null}
                      </div>
                    </div>

                    {isSukses && (
                      <div className="pt-2 text-[12px] text-emerald-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Akses unduh permanen aktif pada akun Anda</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
