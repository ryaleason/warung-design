'use client';

import React, { useState, useEffect, useId, useMemo } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Mail,
  Check,
  X,
  Database,
  Copy,
  Calendar,
  CreditCard,
  CheckSquare,
  ArrowUpRight,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { BuyerSummary } from '@/app/api/admin/orders/route';

interface DbHealth {
  supabaseConnected: boolean;
  supabaseError?: string;
  localFileExists: boolean;
  localOrderCount: number;
}

interface SummaryData {
  totalRevenue: number;
  totalOrders: number;
  uniqueBuyersCount: number;
  statusCounts: Record<string, number>;
  bundleStats: Array<{
    bundleId: string;
    bundleName: string;
    totalOrders: number;
    successfulOrders: number;
    totalRevenue: number;
  }>;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'sukses':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Sukses
        </span>
      );
    case 'menunggu_verifikasi':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Menunggu Verifikasi
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
          <Clock className="w-3.5 h-3.5 text-stone-500" />
          Pending
        </span>
      );
    case 'ditolak':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5" />
          Ditolak
        </span>
      );
    case 'kedaluwarsa':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-stone-100 text-stone-500 border border-stone-200">
          Kedaluwarsa
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] bg-stone-100 text-stone-700">
          {status}
        </span>
      );
  }
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-800',
    'bg-purple-100 text-purple-700',
    'bg-rose-100 text-rose-700',
    'bg-teal-100 text-teal-700',
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length];
}

export default function DashboardView({
  activeView = 'analytics',
  onNavigate,
}: {
  activeView?: 'analytics' | 'orders' | 'customers';
  onNavigate?: (view: 'analytics' | 'orders' | 'customers' | 'catalog') => void;
}) {
  const searchInputId = useId();
  const [orders, setOrders] = useState<Order[]>([]);
  const [buyers, setBuyers] = useState<BuyerSummary[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [dbHealth, setDbHealth] = useState<DbHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal Detail & Action
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Gagal mengambil data pesanan');
      }
      setOrders(data.data.orders || []);
      setBuyers(data.data.buyers || []);
      setSummary(data.data.summary || null);
      setDbHealth(data.data.dbHealth || null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data.success) {
            setOrders(data.data.orders || []);
            setBuyers(data.data.buyers || []);
            setSummary(data.data.summary || null);
            setDbHealth(data.data.dbHealth || null);
          } else {
            setErrorMsg(data.error || 'Gagal mengambil data pesanan');
          }
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan';
          setErrorMsg(msg);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Handler approve / reject
  const handleOrderAction = async (orderId: string, action: 'acc' | 'tolak') => {
    setIsProcessingAction(true);
    setActionFeedback(null);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Aksi gagal diproses');
      }

      showToast(action === 'acc' ? 'Pesanan disetujui & email download dikirim.' : 'Pesanan ditolak.');
      
      if (data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      }

      fetchDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses aksi';
      setActionFeedback(msg);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Filtered orders for table
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchStatus;

      const matchCode = (o.order_code || '').toLowerCase().includes(q);
      const matchName = (o.buyer_name || '').toLowerCase().includes(q);
      const matchEmail = (o.buyer_email || '').toLowerCase().includes(q);
      const matchBundle = (o.bundle?.name || '').toLowerCase().includes(q);
      const matchSender = (o.sender_name || '').toLowerCase().includes(q);

      return matchStatus && (matchCode || matchName || matchEmail || matchBundle || matchSender);
    });
  }, [orders, statusFilter, searchQuery]);

  // Filtered buyers
  const filteredBuyers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return buyers;
    return buyers.filter((b) => {
      const matchName = b.name.toLowerCase().includes(q);
      const matchEmail = b.email.toLowerCase().includes(q);
      const matchPhone = (b.phone || '').toLowerCase().includes(q);
      const matchBundle = b.bundleNames.some((bn) => bn.toLowerCase().includes(q));
      return matchName || matchEmail || matchPhone || matchBundle;
    });
  }, [buyers, searchQuery]);

  // Monthly sales dynamics calculation (Year 2026)
  const monthlyDynamics = useMemo(() => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const data = months.map((name, idx) => ({
      name,
      monthIndex: idx,
      revenue: 0,
      count: 0,
    }));

    orders.forEach((o) => {
      try {
        const d = new Date(o.created_at);
        const m = d.getMonth();
        if (m >= 0 && m < 12) {
          data[m].count += 1;
          if (o.status === 'sukses') {
            data[m].revenue += o.total_amount || 0;
          }
        }
      } catch {
        // ignore date error
      }
    });

    const maxRevenue = Math.max(...data.map((d) => d.revenue), 100000);
    return { data, maxRevenue };
  }, [orders]);

  // Status donut proportions
  const statusProportions = useMemo(() => {
    const total = orders.length || 1;
    const sukses = summary?.statusCounts.sukses || 0;
    const pending = summary?.statusCounts.pending || 0;
    const waiting = summary?.statusCounts.menunggu_verifikasi || 0;
    const ditolak = (summary?.statusCounts.ditolak || 0) + (summary?.statusCounts.kedaluwarsa || 0);

    return [
      { label: 'Sukses', count: sukses, pct: Math.round((sukses / total) * 100), color: '#10b981' },
      { label: 'Pending', count: pending, pct: Math.round((pending / total) * 100), color: '#0075de' },
      { label: 'Verifikasi', count: waiting, pct: Math.round((waiting / total) * 100), color: '#f59e0b' },
      { label: 'Ditolak', count: ditolak, pct: Math.round((ditolak / total) * 100), color: '#f43f5e' },
    ];
  }, [orders, summary]);

  // Bundle donut proportions
  const bundleProportions = useMemo(() => {
    const bStats = summary?.bundleStats || [];
    const total = bStats.reduce((acc, b) => acc + b.totalOrders, 0) || 1;
    const colors = ['#0075de', '#ffb110', '#10b981', '#8b5cf6', '#ec4899'];

    return bStats.map((b, idx) => ({
      label: b.bundleName,
      count: b.totalOrders,
      pct: Math.round((b.totalOrders / total) * 100),
      color: colors[idx % colors.length],
    }));
  }, [summary]);

  // Average Order Value (AOV) & Success Rate
  const averageOrderValue = useMemo(() => {
    const suksesCount = summary?.statusCounts.sukses || 0;
    if (suksesCount === 0) return 0;
    return Math.round((summary?.totalRevenue || 0) / suksesCount);
  }, [summary]);

  const successRate = useMemo(() => {
    const total = summary?.totalOrders || 0;
    if (total === 0) return 0;
    return Math.round(((summary?.statusCounts.sukses || 0) / total) * 100);
  }, [summary]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} disalin ke clipboard`);
  };

  return (
    <div className="flex-1 w-full p-4 sm:p-7 space-y-6 max-w-[1440px] mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg bg-stone-900 text-stone-50 px-4 py-2.5 text-[13px] shadow-lg animate-in fade-in duration-200">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Row (Matches screenshot header with date chip & actions) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            {activeView === 'analytics' && 'Analytics'}
            {activeView === 'orders' && 'Daftar Pesanan'}
            {activeView === 'customers' && 'Data Pelanggan'}
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/[0.08] text-[12px] font-medium text-[#757575] shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span>01.09.2026 - 23.10.2026</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Database Health Pill */}
          {dbHealth && (
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-white border border-black/[0.08] text-[#111111]">
              <Database className="w-3.5 h-3.5 text-[#757575]" />
              {dbHealth.supabaseConnected ? (
                <span className="text-emerald-700">Supabase OK</span>
              ) : (
                <span className="text-amber-700">Storage Lokal (.json)</span>
              )}
            </div>
          )}

          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-black/[0.08] text-[13px] font-medium text-[#111111] hover:bg-stone-50 transition-colors shadow-xs"
            title="Segarkan data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* Error Banner if any */}
      {errorMsg && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-[13px] text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Gagal memuat data</p>
            <p className="text-rose-700 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* VIEW 1: ANALYTICS DASHBOARD (MATCHING THE SCREENSHOT LAYOUT) */}
      {activeView === 'analytics' && (
        <div className="space-y-6">
          {/* Row 1: Modular Grid (2x2 Stat Cards on Left + 2 Donut Cards on Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Left 2x2 Subgrid: Orders & Approved */}
            <div className="rounded-2xl bg-white border border-black/[0.08] p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#757575]">
                <span className="text-[13px] font-semibold text-[#111111]">Orders</span>
                <div className="p-1.5 rounded-lg bg-stone-100 text-stone-600">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-[#111111] tracking-tight">
                  {summary?.totalOrders || 0}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 mt-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Real order database</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-black/[0.08] p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#757575]">
                <span className="text-[13px] font-semibold text-[#111111]">Approved</span>
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-[#111111] tracking-tight">
                  {summary?.statusCounts.sukses || 0}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 mt-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Terverifikasi bayar</span>
                </div>
              </div>
            </div>

            {/* Donut Card 1: Users & Order Statuses (Screenshot Card 3) */}
            <div className="rounded-2xl bg-white border border-black/[0.08] p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-semibold text-[#111111]">Distribusi Status</span>
                  <div className="text-2xl font-bold text-[#111111] mt-1">
                    {summary?.totalOrders || 0}
                  </div>
                  <span className="text-[11px] text-[#757575]">Total pesanan</span>
                </div>

                {/* SVG Donut Chart */}
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-stone-100"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {(() => {
                      const c = 2 * Math.PI * 40;
                      let accumulated = 0;
                      return statusProportions.map((p, idx) => {
                        const strokeDasharray = `${(p.pct / 100) * c} ${c}`;
                        const strokeDashoffset = -((accumulated / 100) * c);
                        accumulated += p.pct;
                        return (
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r="40"
                            stroke={p.color}
                            strokeWidth="12"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            fill="transparent"
                            strokeLinecap="round"
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>
              </div>

              {/* Donut Legend */}
              <div className="mt-3 pt-3 border-t border-black/[0.06] grid grid-cols-2 gap-1.5 text-[11px] text-[#757575]">
                {statusProportions.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="truncate">{p.label} ({p.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut Card 2: Bundle Distribution (Screenshot Card 4) */}
            <div className="rounded-2xl bg-white border border-black/[0.08] p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-semibold text-[#111111]">Peminat Bundle</span>
                  <div className="text-2xl font-bold text-[#111111] mt-1">
                    {summary?.bundleStats.length || 0}
                  </div>
                  <span className="text-[11px] text-[#757575]">Paket katalog</span>
                </div>

                {/* SVG Donut Chart */}
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-stone-100"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {(() => {
                      const c = 2 * Math.PI * 40;
                      let accumulated = 0;
                      return bundleProportions.map((b, idx) => {
                        const strokeDasharray = `${(b.pct / 100) * c} ${c}`;
                        const strokeDashoffset = -((accumulated / 100) * c);
                        accumulated += b.pct;
                        return (
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r="40"
                            stroke={b.color}
                            strokeWidth="12"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            fill="transparent"
                            strokeLinecap="round"
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>
              </div>

              {/* Bundle Legend */}
              <div className="mt-3 pt-3 border-t border-black/[0.06] space-y-1 text-[11px] text-[#757575]">
                {bundleProportions.slice(0, 2).map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                      <span className="truncate max-w-[130px]">{b.label}</span>
                    </div>
                    <span className="font-medium text-[#111111]">{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-row: 2 Cards (Menunggu Verifikasi & Total Revenue) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white border border-black/[0.08] p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#757575]">
                <span className="text-[13px] font-semibold text-[#111111]">Menunggu Verifikasi</span>
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-[#111111] tracking-tight">
                    {summary?.statusCounts.menunggu_verifikasi || 0}
                  </div>
                  <span className="text-[12px] text-[#757575] mt-1 block">
                    {(summary?.statusCounts.menunggu_verifikasi || 0) > 0
                      ? 'Butuh persetujuan admin segera'
                      : 'Semua konfirmasi telah diperiksa'}
                  </span>
                </div>
                {(summary?.statusCounts.menunggu_verifikasi || 0) > 0 && onNavigate && (
                  <button
                    onClick={() => onNavigate('orders')}
                    className="text-[12px] font-medium text-[#0075de] hover:underline"
                  >
                    Buka antrean &rarr;
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-black/[0.08] p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#757575]">
                <span className="text-[13px] font-semibold text-[#111111]">Total Pendapatan Terverifikasi</span>
                <div className="p-1.5 rounded-lg bg-blue-50 text-[#0075de]">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-[#111111] tracking-tight">
                  {summary ? formatRupiah(summary.totalRevenue) : 'Rp 0'}
                </div>
                <span className="text-[12px] text-emerald-700 font-medium mt-1 block">
                  Murni dari {summary?.statusCounts.sukses || 0} pesanan berhasil
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Sales Dynamics Bar Chart + 2 Secondary Metric Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Sales Dynamics Bar Chart (7 Cols) */}
            <div className="lg:col-span-7 rounded-2xl bg-white border border-black/[0.08] p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                <div>
                  <h3 className="font-bold text-[15px] text-[#111111]">Dinamika Penjualan</h3>
                  <p className="text-[12px] text-[#757575]">Rekap omset pesanan sukses per bulan</p>
                </div>
                <div className="text-[12px] font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                  Tahun 2026
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="mt-6 pt-4 flex items-end justify-between gap-2 h-44 px-2">
                {monthlyDynamics.data.map((m, idx) => {
                  const heightPercent = m.revenue > 0
                    ? Math.max(Math.round((m.revenue / monthlyDynamics.maxRevenue) * 100), 14)
                    : 6;
                  const isActive = m.revenue > 0;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
                        {m.name}: {formatRupiah(m.revenue)} ({m.count} order)
                      </div>

                      {/* Bar Column */}
                      <div className="w-full max-w-[28px] h-32 flex items-end justify-center rounded-md bg-stone-100/80 overflow-hidden">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-md transition-all duration-300 ${
                            isActive
                              ? 'bg-[#0075de] hover:bg-[#005bb5]'
                              : 'bg-stone-200/80'
                          }`}
                        />
                      </div>

                      {/* Month Label */}
                      <span className={`text-[11px] ${isActive ? 'font-semibold text-[#111111]' : 'text-stone-400'}`}>
                        {m.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side: 2 Metric Cards (5 Cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Card A: Average Order Value */}
              <div className="rounded-2xl bg-white border border-black/[0.08] p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-sky-50 text-[#0075de]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    AOV
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-[12px] text-[#757575] font-medium block">
                    Rata-rata Nilai Transaksi
                  </span>
                  <div className="text-2xl font-bold text-[#111111] mt-1">
                    {formatRupiah(averageOrderValue)}
                  </div>
                  <span className="text-[11px] text-[#757575] mt-1 block">
                    Per transaksi pesanan sukses
                  </span>
                </div>
              </div>

              {/* Card B: Success Rate with Radial Ring */}
              <div className="rounded-2xl bg-white border border-black/[0.08] p-5 shadow-xs flex items-center justify-between">
                <div>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 inline-block">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div className="mt-3">
                    <span className="text-[12px] text-[#757575] font-medium block">
                      Tingkat Keberhasilan
                    </span>
                    <div className="text-2xl font-bold text-[#111111] mt-0.5">
                      {successRate}% Sukses
                    </div>
                    <span className="text-[11px] text-[#757575] mt-0.5 block">
                      {summary?.statusCounts.sukses || 0} dari {summary?.totalOrders || 0} pesanan
                    </span>
                  </div>
                </div>

                {/* Progress Circle Ring */}
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-stone-100"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-emerald-500"
                      strokeWidth="12"
                      strokeDasharray={`${(successRate / 100) * 251.32} 251.32`}
                      strokeDashoffset="0"
                      fill="transparent"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-[#111111]">
                    {successRate}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Customer Orders Recent Table (Matching the Screenshot Table) */}
          <div className="rounded-2xl bg-white border border-black/[0.08] shadow-xs overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-black/[0.06]">
              <div>
                <h3 className="font-bold text-[15px] text-[#111111]">Pesanan Pelanggan Terbaru</h3>
                <p className="text-[12px] text-[#757575]">Rekap 6 transaksi terkini yang masuk ke sistem</p>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('orders')}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0075de] hover:underline"
                >
                  <span>Lihat Semua Pesanan</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-stone-50/80 text-[#757575] border-b border-black/[0.06] font-medium text-[12px]">
                  <tr>
                    <th className="py-3 px-5">Pelanggan</th>
                    <th className="py-3 px-5">Paket Bundle</th>
                    <th className="py-3 px-5">Tanggal</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Total Bayar</th>
                    <th className="py-3 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#757575]">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-stone-400" />
                        Memuat data...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#757575]">
                        Belum ada pesanan masuk.
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 6).map((order) => {
                      const initial = (order.buyer_name || 'U').charAt(0).toUpperCase();
                      const avatarClass = getAvatarColor(order.buyer_name || 'User');

                      return (
                        <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                          {/* Profile */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 ${avatarClass}`}
                              >
                                {initial}
                              </div>
                              <div>
                                <div className="font-semibold text-[#111111]">{order.buyer_name}</div>
                                <div className="text-[11px] text-[#757575] truncate max-w-[170px]">
                                  {order.buyer_email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Bundle */}
                          <td className="py-3.5 px-5">
                            <div className="font-medium text-[#111111] line-clamp-1 max-w-[220px]" title={order.bundle?.name}>
                              {order.bundle?.name || 'Paket Bundle'}
                            </div>
                            <span className="font-mono text-[11px] text-stone-400">
                              {order.order_code}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-5 text-[#757575] text-[12px]">
                            {formatDate(order.created_at)}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-5">
                            {getStatusBadge(order.status)}
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-5 font-bold text-[#111111]">
                            {formatRupiah(order.total_amount)}
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {order.status === 'menunggu_verifikasi' && (
                                <button
                                  onClick={() => handleOrderAction(order.id, 'acc')}
                                  disabled={isProcessingAction}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-medium transition-colors"
                                  title="ACC dan kirim email link download"
                                >
                                  ACC
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-black/[0.1] hover:bg-stone-50 text-[#111111] text-[12px] font-medium transition-colors"
                              >
                                Detail
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL ORDERS TABLE */}
      {activeView === 'orders' && (
        <div className="rounded-2xl bg-white border border-black/[0.08] shadow-xs overflow-hidden">
          {/* Header & Filter Chips */}
          <div className="p-5 border-b border-black/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#111111]">Semua Pesanan ({orders.length})</h2>
                <p className="text-[12px] text-[#757575]">Filter status dan verifikasi bukti transfer pelanggan</p>
              </div>

              {/* Search Box */}
              <div className="w-full sm:w-72">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                  <input
                    id={searchInputId}
                    type="text"
                    placeholder="Cari kode, nama, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-black/[0.1] bg-[#ffffff] text-[13px] text-[#111111] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Status Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/[0.05] text-[12px]">
              <span className="text-[#757575] font-medium mr-1">Status:</span>
              {[
                { key: 'all', label: `Semua (${orders.length})` },
                {
                  key: 'menunggu_verifikasi',
                  label: `Menunggu Verifikasi (${summary?.statusCounts.menunggu_verifikasi || 0})`,
                },
                { key: 'sukses', label: `Sukses (${summary?.statusCounts.sukses || 0})` },
                { key: 'pending', label: `Pending (${summary?.statusCounts.pending || 0})` },
                { key: 'ditolak', label: `Ditolak (${summary?.statusCounts.ditolak || 0})` },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    statusFilter === filter.key
                      ? 'bg-stone-900 text-stone-50 font-medium shadow-xs'
                      : 'bg-stone-50 border border-black/[0.08] text-[#757575] hover:bg-stone-100 hover:text-[#111111]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-stone-50/80 text-[#757575] border-b border-black/[0.06] font-medium text-[12px]">
                <tr>
                  <th className="py-3 px-5">Kode & Waktu</th>
                  <th className="py-3 px-5">Pembeli</th>
                  <th className="py-3 px-5">Paket Bundle</th>
                  <th className="py-3 px-5">Total Tagihan</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#757575]">
                      Tidak ada pesanan yang sesuai dengan filter atau kata kunci.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-mono font-bold text-[#111111]">{order.order_code}</div>
                        <div className="text-[11px] text-[#757575]">{formatDate(order.created_at)}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-[#111111]">{order.buyer_name}</div>
                        <div className="text-[12px] text-[#757575]">{order.buyer_email}</div>
                        {order.buyer_phone && (
                          <div className="text-[11px] text-stone-500">{order.buyer_phone}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-5 max-w-[220px]">
                        <div className="font-medium text-[#111111] line-clamp-1">{order.bundle?.name || 'Bundle'}</div>
                        <span className="text-[11px] text-[#757575]">Base: {formatRupiah(order.base_price)}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-[#111111]">{formatRupiah(order.total_amount)}</div>
                        <div className="text-[11px] text-[#757575]">Kode unik: +{order.unique_code}</div>
                      </td>
                      <td className="py-3.5 px-5">{getStatusBadge(order.status)}</td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'menunggu_verifikasi' && (
                            <button
                              onClick={() => handleOrderAction(order.id, 'acc')}
                              disabled={isProcessingAction}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-medium"
                            >
                              ACC
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-black/[0.1] hover:bg-stone-50 text-[#111111] text-[12px] font-medium"
                          >
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: FULL CUSTOMERS TABLE */}
      {activeView === 'customers' && (
        <div className="rounded-2xl bg-white border border-black/[0.08] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#111111]">Data Pelanggan ({buyers.length})</h2>
              <p className="text-[12px] text-[#757575]">Rekap kontak dan total belanja tiap pelanggan</p>
            </div>

            <div className="w-full sm:w-72">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                <input
                  type="text"
                  placeholder="Cari pembeli, email, HP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-black/[0.1] bg-[#ffffff] text-[13px] text-[#111111] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-stone-50/80 text-[#757575] border-b border-black/[0.06] font-medium text-[12px]">
                <tr>
                  <th className="py-3 px-5">Nama Pelanggan</th>
                  <th className="py-3 px-5">Email</th>
                  <th className="py-3 px-5">Nomor WhatsApp</th>
                  <th className="py-3 px-5">Total Order</th>
                  <th className="py-3 px-5">Total Belanja Sukses</th>
                  <th className="py-3 px-5">Paket yang Dibeli</th>
                  <th className="py-3 px-5 text-right">Hubungi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05]">
                {filteredBuyers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#757575]">
                      Tidak ada data pelanggan yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredBuyers.map((buyer, idx) => (
                    <tr key={`${buyer.email}-${idx}`} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-[#111111]">{buyer.name}</td>
                      <td className="py-3.5 px-5 text-[#111111]">{buyer.email}</td>
                      <td className="py-3.5 px-5">
                        {buyer.phone ? (
                          <a
                            href={`https://wa.me/${buyer.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#0075de] hover:underline"
                          >
                            <span>{buyer.phone}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-stone-400 italic">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-semibold text-[#111111]">{buyer.totalOrders} kali</span>
                        <div className="text-[11px] text-emerald-700">{buyer.successfulOrders} sukses</div>
                      </td>
                      <td className="py-3.5 px-5 font-bold text-[#111111]">{formatRupiah(buyer.totalSpent)}</td>
                      <td className="py-3.5 px-5 max-w-[240px]">
                        <div className="flex flex-wrap gap-1">
                          {buyer.bundleNames.map((bn, bIdx) => (
                            <span
                              key={bIdx}
                              className="px-2 py-0.5 rounded text-[11px] bg-stone-100 text-stone-800 border border-stone-200 truncate"
                            >
                              {bn}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`mailto:${buyer.email}`}
                            className="p-1.5 rounded-lg border border-black/[0.08] hover:bg-stone-100 text-stone-700"
                            title="Kirim Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          {buyer.phone && (
                            <a
                              href={`https://wa.me/${buyer.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-black/[0.08] hover:bg-stone-100 text-stone-700"
                              title="Chat WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl bg-[#ffffff] border border-black/[0.1] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-black/[0.08]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#111111]">Detail Pesanan</h3>
                  <span className="font-mono text-[13px] bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200 text-stone-800 font-bold">
                    {selectedOrder.order_code}
                  </span>
                </div>
                <p className="text-[12px] text-[#757575] mt-0.5">ID: {selectedOrder.id}</p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-[#757575] hover:text-[#111111]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-3.5 text-[13px]">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-black/[0.05] flex items-center justify-between">
                <div>
                  <span className="text-[12px] text-[#757575] block">Status Pembayaran</span>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div className="text-right">
                  <span className="text-[12px] text-[#757575] block">Waktu Dibuat</span>
                  <span className="font-semibold text-[#111111]">{formatDate(selectedOrder.created_at)}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-black/[0.08] space-y-2">
                <h4 className="font-bold text-[13px] text-[#111111]">Informasi Pembeli</h4>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <span className="text-[#757575] block">Nama:</span>
                    <span className="font-semibold text-[#111111]">{selectedOrder.buyer_name}</span>
                  </div>
                  <div>
                    <span className="text-[#757575] block">Email:</span>
                    <span className="font-semibold text-[#111111]">{selectedOrder.buyer_email}</span>
                  </div>
                  <div>
                    <span className="text-[#757575] block">No. WhatsApp / HP:</span>
                    <span className="font-semibold text-[#111111]">{selectedOrder.buyer_phone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[#757575] block">Nama Pengirim Transfer:</span>
                    <span className="font-semibold text-[#111111]">{selectedOrder.sender_name || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-black/[0.08] space-y-2">
                <h4 className="font-bold text-[13px] text-[#111111]">Rincian Transaksi</h4>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-[#757575]">Paket Bundle:</span>
                    <span className="font-medium text-[#111111] text-right">{selectedOrder.bundle?.name || 'Paket Bundle'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757575]">Harga Normal:</span>
                    <span>{formatRupiah(selectedOrder.base_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757575]">Kode Unik Transfer:</span>
                    <span className="font-mono font-bold text-amber-700">+{selectedOrder.unique_code}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-black/[0.05] text-[13px]">
                    <span className="font-bold text-[#111111]">Total Tagihan:</span>
                    <span className="font-extrabold text-[#111111]">{formatRupiah(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.status === 'sukses' && selectedOrder.download_token && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-emerald-900">Token & Link Download Aktif</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${window.location.origin}/api/download/${selectedOrder.download_token}`,
                          'Link download'
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950"
                    >
                      <Copy className="w-3 h-3" /> Salin Link
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-emerald-800 break-all bg-white/80 p-2 rounded-lg border border-emerald-200">
                    {`${typeof window !== 'undefined' ? window.location.origin : ''}/api/download/${selectedOrder.download_token}`}
                  </p>
                </div>
              )}

              {actionFeedback && (
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-800 text-[12px] border border-rose-200">
                  {actionFeedback}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-black/[0.08] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {selectedOrder.buyer_phone && (
                  <a
                    href={`https://wa.me/${selectedOrder.buyer_phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/[0.1] text-[12px] font-medium text-stone-700 hover:bg-stone-50"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedOrder.buyer_email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/[0.1] text-[12px] font-medium text-stone-700 hover:bg-stone-50"
                >
                  <Mail className="w-3.5 h-3.5 text-stone-600" />
                  <span>Email</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                {selectedOrder.status !== 'sukses' && (
                  <button
                    onClick={() => handleOrderAction(selectedOrder.id, 'acc')}
                    disabled={isProcessingAction}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-medium transition-colors disabled:opacity-50 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Setujui (ACC)</span>
                  </button>
                )}

                {selectedOrder.status !== 'ditolak' && selectedOrder.status !== 'sukses' && (
                  <button
                    onClick={() => handleOrderAction(selectedOrder.id, 'tolak')}
                    disabled={isProcessingAction}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[12px] font-medium transition-colors disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Tolak</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[12px] font-medium transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
