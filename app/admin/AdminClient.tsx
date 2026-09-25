'use client';

import React, { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Save,
  GitBranch,
  ExternalLink,
  ImageIcon,
  Check,
  AlertCircle,
  RefreshCw,
  Search,
  Layers,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Bundle } from '@/types';

function createUniqueId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'b' + Math.random().toString(36).substring(2, 11);
}

function createRandomCode(): string {
  return Math.floor(Math.random() * 9000 + 1000).toString();
}

interface GitInfo {
  branch: string;
  remoteUrl: string;
  hasFileChanges: boolean;
  lastCommit: string;
  error?: string;
}

interface SaveResult {
  committed: boolean;
  pushed: boolean;
  branch: string;
  commitHash?: string;
  commitMessage: string;
  output: string;
  error?: string;
}

export default function AdminClient() {
  const searchInputId = useId();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [initialBundlesJson, setInitialBundlesJson] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [gitInfo, setGitInfo] = useState<GitInfo | null>(null);

  // Modal Save & Push
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [pushToGithub, setPushToGithub] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null);
  const [saveStepStatus, setSaveStepStatus] = useState<string>('');

  // Notifikasi toast sederhana
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper untuk toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Muat data dari server
  const loadData = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/bundles');
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Gagal memuat data');
      }
      setBundles(data.bundles || []);
      setInitialBundlesJson(JSON.stringify(data.bundles || []));
      setGitInfo(data.gitInfo || null);
      if (data.bundles?.length > 0 && !selectedId) {
        setSelectedId(data.bundles[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kegagalan jaringan';
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/bundles')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data.success) {
            setBundles(data.bundles || []);
            setInitialBundlesJson(JSON.stringify(data.bundles || []));
            setGitInfo(data.gitInfo || null);
            if (data.bundles?.length > 0) {
              setSelectedId((prev) => prev || data.bundles[0].id);
            }
          } else {
            setFetchError(data.error || 'Gagal memuat data');
          }
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setFetchError(err instanceof Error ? err.message : 'Terjadi kegagalan jaringan');
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const hasUnsavedChanges = JSON.stringify(bundles) !== initialBundlesJson;

  const selectedBundle = bundles.find((b) => b.id === selectedId) || null;

  // Filter bundle berdasarkan pencarian
  const filteredBundles = bundles.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      (b.category && b.category.toLowerCase().includes(q)) ||
      (b.badge && b.badge.toLowerCase().includes(q)) ||
      b.slug.toLowerCase().includes(q)
    );
  });

  // Handler update field bundle
  const updateCurrentBundle = (field: keyof Bundle, value: unknown) => {
    if (!selectedId) return;
    setBundles((prev) =>
      prev.map((b) => {
        if (b.id === selectedId) {
          return { ...b, [field]: value };
        }
        return b;
      })
    );
  };

  // Otomatis buat slug dari nama
  const handleGenerateSlug = () => {
    if (!selectedBundle) return;
    const autoSlug = selectedBundle.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    updateCurrentBundle('slug', autoSlug);
    showToast('Slug berhasil diperbarui sesuai judul.');
  };

  // Tambah bundle baru
  const handleAddNewBundle = () => {
    const newId = createUniqueId();
    const randomCode = createRandomCode();
    const newBundle: Bundle = {
      id: newId,
      name: 'Paket Template Baru',
      slug: `paket-baru-${randomCode}`,
      category: 'Promo & Event',
      badge: 'Baru',
      description: 'Deskripsi lengkap mengenai isi paket template, format file, dan keunggulannya.',
      price: 49000,
      preview_images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      ],
      file_url: 'bundles/paket-baru.zip',
      is_active: true,
      features: [
        '20+ Template Desain Siap Pakai',
        'Format PNG Transparan & File Canva',
        'Bebas Lisensi Komersial untuk UMKM',
      ],
    };

    setBundles((prev) => [newBundle, ...prev]);
    setSelectedId(newId);
    showToast('Bundle baru berhasil ditambahkan.');
  };

  // Duplikasi bundle
  const handleDuplicateBundle = (id: string) => {
    const target = bundles.find((b) => b.id === id);
    if (!target) return;
    const newId = createUniqueId();
    const randomCode = createRandomCode();
    const duplicated: Bundle = {
      ...target,
      id: newId,
      name: `${target.name} (Salinan)`,
      slug: `${target.slug}-copy-${randomCode}`,
    };
    const index = bundles.findIndex((b) => b.id === id);
    const updated = [...bundles];
    updated.splice(index + 1, 0, duplicated);
    setBundles(updated);
    setSelectedId(newId);
    showToast('Bundle berhasil diduplikasi.');
  };

  // Hapus bundle
  const handleDeleteBundle = (id: string) => {
    const target = bundles.find((b) => b.id === id);
    if (!target) return;
    if (bundles.length <= 1) {
      alert('Minimal harus ada 1 bundle di dalam katalog.');
      return;
    }
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus "${target.name}"?`);
    if (!confirmDelete) return;

    const remaining = bundles.filter((b) => b.id !== id);
    setBundles(remaining);
    if (selectedId === id) {
      setSelectedId(remaining[0]?.id || null);
    }
    showToast(`"${target.name}" telah dihapus dari daftar.`);
  };

  // Pindah posisi (urutan)
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= bundles.length) return;
    const newBundles = [...bundles];
    const temp = newBundles[index];
    newBundles[index] = newBundles[targetIndex];
    newBundles[targetIndex] = temp;
    setBundles(newBundles);
  };

  // Handler gambar preview
  const handleAddImage = () => {
    if (!selectedBundle) return;
    const current = selectedBundle.preview_images || [];
    updateCurrentBundle('preview_images', [...current, '']);
  };

  const handleUpdateImage = (index: number, val: string) => {
    if (!selectedBundle) return;
    const current = [...(selectedBundle.preview_images || [])];
    current[index] = val;
    updateCurrentBundle('preview_images', current);
  };

  const handleRemoveImage = (index: number) => {
    if (!selectedBundle) return;
    const current = [...(selectedBundle.preview_images || [])];
    current.splice(index, 1);
    updateCurrentBundle('preview_images', current);
  };

  // Handler fitur
  const handleAddFeature = () => {
    if (!selectedBundle) return;
    const current = selectedBundle.features || [];
    updateCurrentBundle('features', [...current, '']);
  };

  const handleUpdateFeature = (index: number, val: string) => {
    if (!selectedBundle) return;
    const current = [...(selectedBundle.features || [])];
    current[index] = val;
    updateCurrentBundle('features', current);
  };

  const handleRemoveFeature = (index: number) => {
    if (!selectedBundle) return;
    const current = [...(selectedBundle.features || [])];
    current.splice(index, 1);
    updateCurrentBundle('features', current);
  };

  // Buka modal simpan
  const handleOpenSaveModal = () => {
    const currentName = selectedBundle ? selectedBundle.name : 'katalog';
    setCommitMessage(`Update katalog bundle: ${currentName}`);
    setSaveResult(null);
    setSaveStepStatus('');
    setShowSaveModal(true);
  };

  // Eksekusi Simpan & Push ke GitHub
  const handleExecuteSaveAndPush = async () => {
    setIsSaving(true);
    setSaveStepStatus('Menulis ke file lib/data/bundles.ts...');

    try {
      const response = await fetch('/api/admin/bundles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bundles,
          commitMessage,
          pushToGithub,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Terjadi kesalahan saat menyimpan data');
      }

      setSaveResult(data.git);
      setInitialBundlesJson(JSON.stringify(bundles));
      showToast('Perubahan berhasil disimpan & disinkronkan!');
      // Refresh git info
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses git sync';
      setSaveResult({
        committed: false,
        pushed: false,
        branch: gitInfo?.branch || 'main',
        commitMessage,
        output: '',
        error: msg,
      });
    } finally {
      setIsSaving(false);
      setSaveStepStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f4] text-[#111111] flex flex-col font-sans">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-[#ffffff] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-85 transition-opacity"
              title="Ke Halaman Utama"
            >
              <Image
                src="/logo.svg"
                alt="Warung Design"
                width={28}
                height={28}
                className="h-7 w-auto object-contain"
                unoptimized
              />
              <span className="font-semibold text-[15px] tracking-tight text-[#000000]">
                Warung Design
              </span>
            </Link>
            <span className="rounded bg-stone-100 px-2 py-0.5 text-[12px] font-medium text-stone-600 border border-stone-200">
              Admin Lokal
            </span>

            {/* Git Branch Badge */}
            {gitInfo && (
              <div className="hidden items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-[12px] text-emerald-800 border border-emerald-200 md:flex">
                <GitBranch className="h-3.5 w-3.5" />
                <span className="font-medium">{gitInfo.branch}</span>
                <span className="text-emerald-500">/</span>
                <span className="text-emerald-700 truncate max-w-[200px]" title={gitInfo.remoteUrl}>
                  GitHub
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {hasUnsavedChanges && (
              <span className="hidden text-[12.5px] font-medium text-amber-700 sm:inline-flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                Ada perubahan belum disimpan
              </span>
            )}

            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              title="Muat Ulang Data dari File"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-stone-600 hover:bg-stone-100 hover:text-black transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <span>Pratinjau Web</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleOpenSaveModal}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0075de] px-4 py-1.5 text-[13px] font-medium text-white hover:bg-[#005bb5] transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de]"
            >
              <Save className="h-4 w-4" />
              <span>Simpan & Push ke GitHub</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row">
        {/* Left Column: Daftar Bundles */}
        <aside className="w-full md:w-80 lg:w-96 shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-black">Daftar Bundle</h2>
              <p className="text-[12px] text-stone-500">
                {bundles.length} paket terdaftar di lib/data/bundles.ts
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddNewBundle}
              className="inline-flex items-center gap-1.5 rounded-md bg-stone-900 px-2.5 py-1.5 text-[12px] font-medium text-white hover:bg-black transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <label htmlFor={searchInputId} className="sr-only">
              Cari nama atau kategori paket
            </label>
            <input
              id={searchInputId}
              type="text"
              placeholder="Cari nama atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-black/10 bg-white py-2 pl-9 pr-3 text-[13px] text-stone-900 placeholder:text-stone-400 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
            />
          </div>

          {/* List Bundles */}
          <div className="flex flex-col gap-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="p-8 text-center text-[13px] text-stone-500">
                Memuat data dari lib/data/bundles.ts...
              </div>
            ) : fetchError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">
                <p className="font-medium">Gagal memuat bundles</p>
                <p className="mt-1 text-[12px]">{fetchError}</p>
                <button
                  type="button"
                  onClick={loadData}
                  className="mt-2 text-[12px] font-medium underline hover:text-red-900"
                >
                  Coba lagi
                </button>
              </div>
            ) : filteredBundles.length === 0 ? (
              <div className="rounded-lg border border-dashed border-stone-300 bg-white p-6 text-center text-[13px] text-stone-500">
                Tidak ada paket yang sesuai pencarian &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredBundles.map((bundle) => {
                const isSelected = bundle.id === selectedId;
                const originalIndex = bundles.findIndex((b) => b.id === bundle.id);
                const thumb = bundle.preview_images?.[0];

                return (
                  <div
                    key={bundle.id}
                    onClick={() => setSelectedId(bundle.id)}
                    className={`group relative flex cursor-pointer gap-3 rounded-xl border p-3 transition-all ${
                      isSelected
                        ? 'border-[#0075de] bg-white shadow-sm ring-1 ring-[#0075de]'
                        : 'border-black/[0.08] bg-white hover:border-black/20 hover:bg-stone-50/50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100 border border-black/[0.06]">
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={bundle.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-stone-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between overflow-hidden">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {bundle.badge && (
                            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
                              {bundle.badge}
                            </span>
                          )}
                          <span
                            className={`rounded px-1.5 py-0.2 text-[10px] font-medium ${
                              bundle.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-stone-100 text-stone-600 border border-stone-200'
                            }`}
                          >
                            {bundle.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                        <h3 className="mt-1 line-clamp-1 text-[13.5px] font-semibold text-black">
                          {bundle.name}
                        </h3>
                      </div>

                      <div className="mt-1 flex items-center justify-between text-[12.5px]">
                        <span className="font-semibold text-stone-900">
                          Rp {bundle.price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-stone-400 text-[11px] truncate max-w-[100px]">
                          {bundle.category || 'Tanpa kategori'}
                        </span>
                      </div>
                    </div>

                    {/* Action quick buttons on hover/select */}
                    <div className="flex flex-col items-center justify-between pl-1">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(originalIndex, 'up');
                          }}
                          disabled={originalIndex === 0}
                          title="Pindah ke Atas"
                          className="text-stone-400 hover:text-black disabled:opacity-30 p-0.5"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(originalIndex, 'down');
                          }}
                          disabled={originalIndex === bundles.length - 1}
                          title="Pindah ke Bawah"
                          className="text-stone-400 hover:text-black disabled:opacity-30 p-0.5"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateBundle(bundle.id);
                        }}
                        title="Duplikasi Paket"
                        className="text-stone-400 hover:text-black p-0.5"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Column: Editor Form Bundle */}
        <main className="flex-1">
          {selectedBundle ? (
            <div className="rounded-xl border border-black/[0.08] bg-white p-5 sm:p-6 shadow-sm">
              {/* Header Editor */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[18px] font-semibold text-black">
                      Edit Data: {selectedBundle.name}
                    </h1>
                    <span className="font-mono text-[11px] text-stone-400">
                      ID: {selectedBundle.id.slice(0, 8)}...
                    </span>
                  </div>
                  <p className="text-[12.5px] text-stone-500">
                    Perubahan akan disimpan ke kode TypeScript di lib/data/bundles.ts
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDuplicateBundle(selectedBundle.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-[12.5px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Duplikasi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteBundle(selectedBundle.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[12.5px] font-medium text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus Paket</span>
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="mt-6 space-y-6">
                {/* 1. Informasi Utama */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Judul */}
                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-medium text-stone-900">
                      Judul Bundle (Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedBundle.name}
                      onChange={(e) => updateCurrentBundle('name', e.target.value)}
                      placeholder="Contoh: Paket Promo Ramadhan & Idul Fitri"
                      className="mt-1.5 w-full rounded-lg border border-black/10 bg-white px-3.5 py-2 text-[14px] text-stone-900 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-[13px] font-medium text-stone-900">
                        URL Slug <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateSlug}
                        className="text-[11.5px] font-medium text-[#0075de] hover:underline"
                      >
                        Generate dari Judul
                      </button>
                    </div>
                    <div className="mt-1.5 flex rounded-lg border border-black/10 bg-stone-50 focus-within:border-[#0075de] focus-within:ring-1 focus-within:ring-[#0075de]">
                      <span className="inline-flex items-center px-3 text-[13px] text-stone-400 select-none">
                        /bundles/
                      </span>
                      <input
                        type="text"
                        value={selectedBundle.slug}
                        onChange={(e) => updateCurrentBundle('slug', e.target.value)}
                        placeholder="paket-promo-ramadhan"
                        className="w-full bg-transparent py-2 pr-3 text-[13.5px] text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Harga */}
                  <div>
                    <label className="block text-[13px] font-medium text-stone-900">
                      Harga Normal (Rp) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1.5 relative">
                      <span className="absolute left-3.5 top-2 text-[13.5px] text-stone-500">
                        Rp
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={selectedBundle.price}
                        onChange={(e) =>
                          updateCurrentBundle('price', parseInt(e.target.value || '0', 10))
                        }
                        className="w-full rounded-lg border border-black/10 bg-white py-2 pl-10 pr-3.5 text-[14px] font-semibold text-stone-900 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                      />
                    </div>
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className="block text-[13px] font-medium text-stone-900">
                      Kategori (Category)
                    </label>
                    <input
                      type="text"
                      value={selectedBundle.category || ''}
                      onChange={(e) => updateCurrentBundle('category', e.target.value)}
                      placeholder="Contoh: Promo & Event, Kuliner, Fashion"
                      className="mt-1.5 w-full rounded-lg border border-black/10 bg-white px-3.5 py-2 text-[13.5px] text-stone-900 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                    />
                  </div>

                  {/* Sub-judul / Badge */}
                  <div>
                    <label className="block text-[13px] font-medium text-stone-900">
                      Sub-judul / Badge (Pill di atas judul)
                    </label>
                    <input
                      type="text"
                      value={selectedBundle.badge || ''}
                      onChange={(e) => updateCurrentBundle('badge', e.target.value)}
                      placeholder="Contoh: Terlaris, Populer, Baru, Favorit"
                      className="mt-1.5 w-full rounded-lg border border-black/10 bg-white px-3.5 py-2 text-[13.5px] text-stone-900 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                    />
                  </div>

                  {/* File Download URL / Path */}
                  <div>
                    <label className="block text-[13px] font-medium text-stone-900">
                      File Path / Download URL
                    </label>
                    <input
                      type="text"
                      value={selectedBundle.file_url}
                      onChange={(e) => updateCurrentBundle('file_url', e.target.value)}
                      placeholder="bundles/paket-ramadhan.zip atau link Drive"
                      className="mt-1.5 w-full rounded-lg border border-black/10 bg-white px-3.5 py-2 text-[13.5px] text-stone-900 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                    />
                  </div>

                  {/* Status Publikasi */}
                  <div>
                    <label className="block text-[13px] font-medium text-stone-900">
                      Status Publikasi
                    </label>
                    <div className="mt-1.5 flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => updateCurrentBundle('is_active', !selectedBundle.is_active)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] ${
                          selectedBundle.is_active ? 'bg-emerald-600' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            selectedBundle.is_active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className="text-[13.5px] text-stone-700">
                        {selectedBundle.is_active
                          ? 'Aktif (Tampil di Katalog Web)'
                          : 'Nonaktif (Disembunyikan)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Deskripsi */}
                <div>
                  <label className="block text-[13px] font-medium text-stone-900">
                    Deskripsi Lengkap Paket
                  </label>
                  <p className="text-[12px] text-stone-500 mb-1.5">
                    Jelaskan apa yang didapatkan pembeli, gaya visual, dan manfaat desain untuk promosi bisnis mereka.
                  </p>
                  <textarea
                    rows={4}
                    value={selectedBundle.description}
                    onChange={(e) => updateCurrentBundle('description', e.target.value)}
                    placeholder="Tuliskan deskripsi lengkap paket..."
                    className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-[13.5px] text-stone-900 leading-relaxed focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                  />
                </div>

                {/* 3. Galeri Gambar Preview */}
                <div className="border-t border-black/[0.08] pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[14px] font-semibold text-black flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-stone-600" />
                        <span>Daftar Gambar Preview</span>
                      </h3>
                      <p className="text-[12px] text-stone-500">
                        URL gambar yang akan ditampilkan pada slider dan carousel katalog produk.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-white px-3 py-1 text-[12.5px] font-medium text-stone-700 hover:bg-stone-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Tambah URL Gambar</span>
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(selectedBundle.preview_images || []).map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg border border-black/[0.06] bg-stone-50 p-2.5"
                      >
                        {/* Live Image Preview Thumbnail */}
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-stone-200 border border-black/10">
                          {imgUrl.trim() ? (
                            <Image
                              src={imgUrl}
                              alt={`Preview ${idx + 1}`}
                              fill
                              sizes="56px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-400">
                              Kosong
                            </div>
                          )}
                        </div>

                        {/* Input URL */}
                        <div className="flex-1 w-full">
                          <input
                            type="text"
                            value={imgUrl}
                            onChange={(e) => handleUpdateImage(idx, e.target.value)}
                            placeholder="https://images.unsplash.com/... atau link gambar"
                            className="w-full rounded-md border border-black/10 bg-white px-3 py-1.5 text-[13px] text-stone-900 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                          />
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          title="Hapus gambar ini"
                          className="text-stone-400 hover:text-red-600 p-1.5 transition-colors self-end sm:self-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {(!selectedBundle.preview_images ||
                      selectedBundle.preview_images.length === 0) && (
                      <div className="rounded-lg border border-dashed border-stone-300 p-4 text-center text-[12.5px] text-stone-500">
                        Belum ada gambar preview. Klik &quot;Tambah URL Gambar&quot; di atas.
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Fitur-fitur Unggulan (Bullets) */}
                <div className="border-t border-black/[0.08] pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[14px] font-semibold text-black flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-stone-600" />
                        <span>Poin Keunggulan & Fitur Paket</span>
                      </h3>
                      <p className="text-[12px] text-stone-500">
                        Daftar poin checklist yang ditampilkan di halaman detail dan kartu bundle.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-white px-3 py-1 text-[12.5px] font-medium text-stone-700 hover:bg-stone-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Tambah Poin Fitur</span>
                    </button>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {(selectedBundle.features || []).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[12px] font-mono text-stone-400 w-5 text-right">
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                          placeholder="Contoh: 25 Desain Feed & Story HD (1080x1080 & 1080x1920)"
                          className="flex-1 rounded-md border border-black/10 bg-white px-3 py-1.5 text-[13px] text-stone-900 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          title="Hapus poin ini"
                          className="text-stone-400 hover:text-red-600 p-1.5 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {(!selectedBundle.features || selectedBundle.features.length === 0) && (
                      <div className="rounded-lg border border-dashed border-stone-300 p-4 text-center text-[12.5px] text-stone-500">
                        Belum ada poin fitur. Klik &quot;Tambah Poin Fitur&quot; di atas.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-500">
              <div>
                <Layers className="mx-auto h-10 w-10 text-stone-300" />
                <h3 className="mt-3 text-[15px] font-medium text-stone-900">
                  Pilih Bundle untuk Diedit
                </h3>
                <p className="mt-1 text-[13px] text-stone-500">
                  Pilih salah satu paket di sebelah kiri atau tambahkan paket baru.
                </p>
                <button
                  type="button"
                  onClick={handleAddNewBundle}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0075de] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#005bb5]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Bundle Baru</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Save & Push Modal Dialog */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-black/10 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-[#0075de]" />
                <h3 className="text-[16px] font-semibold text-black">
                  Simpan & Push ke GitHub
                </h3>
              </div>
              {!isSaving && (
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="text-stone-400 hover:text-black p-1 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {saveResult ? (
              /* Hasil Setelah Save/Push */
              <div className="mt-4 space-y-4">
                {saveResult.error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-[13px] text-red-800">
                    <div className="flex items-center gap-2 font-semibold">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span>Kendala Git Push</span>
                    </div>
                    <p className="mt-1 text-[12.5px] leading-relaxed">
                      {saveResult.error}
                    </p>
                    {saveResult.committed && (
                      <p className="mt-2 text-[12px] text-emerald-800 font-medium bg-emerald-50 p-2 rounded border border-emerald-200">
                        Catatan: File lib/data/bundles.ts sudah berhasil disimpan dan dicommit secara lokal di branch {saveResult.branch}. Hanya proses push ke remote GitHub yang gagal.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-[13px] text-emerald-900">
                    <div className="flex items-center gap-2 font-semibold">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Berhasil Disimpan & Di-push!</span>
                    </div>
                    <p className="mt-1.5 text-[12.5px]">
                      Kode TypeScript di <code className="bg-emerald-100 px-1 py-0.5 rounded">lib/data/bundles.ts</code> berhasil diperbarui dan dipush ke GitHub repository.
                    </p>
                    {saveResult.commitHash && (
                      <div className="mt-3 flex items-center gap-2 text-[12px] text-emerald-800 font-mono">
                        <span>Commit Hash:</span>
                        <span className="bg-emerald-200 px-2 py-0.5 rounded font-bold">
                          {saveResult.commitHash}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {saveResult.output && (
                  <div>
                    <label className="block text-[11.5px] font-medium text-stone-500 mb-1">
                      Log Git Output:
                    </label>
                    <pre className="max-h-32 overflow-y-auto rounded bg-stone-900 p-2.5 text-[11px] font-mono text-stone-200 whitespace-pre-wrap">
                      {saveResult.output}
                    </pre>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    className="rounded-lg bg-stone-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-black transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              /* Form Konfirmasi Simpan & Push */
              <div className="mt-4 space-y-4">
                <p className="text-[13px] text-stone-600 leading-relaxed">
                  Aksi ini akan memperbarui file{' '}
                  <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-900 font-mono text-[12px]">
                    lib/data/bundles.ts
                  </code>{' '}
                  dengan seluruh data bundle yang telah Anda ubah, membuat commit Git lokal, dan otomatis push ke GitHub.
                </p>

                {/* Commit Message Input */}
                <div>
                  <label className="block text-[13px] font-medium text-stone-900">
                    Pesan Git Commit
                  </label>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    disabled={isSaving}
                    placeholder="Update bundle catalog..."
                    className="mt-1.5 w-full rounded-lg border border-black/10 bg-white px-3.5 py-2 text-[13.5px] text-stone-900 focus:border-[#0075de] focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                  />
                </div>

                {/* Push to GitHub Checkbox */}
                <div className="flex items-start gap-2.5 rounded-lg border border-black/[0.06] bg-stone-50 p-3">
                  <input
                    type="checkbox"
                    id="pushToGithub"
                    checked={pushToGithub}
                    onChange={(e) => setPushToGithub(e.target.checked)}
                    disabled={isSaving}
                    className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#0075de] focus:ring-[#0075de]"
                  />
                  <label htmlFor="pushToGithub" className="text-[12.5px] text-stone-700 cursor-pointer">
                    <span className="font-medium text-stone-900 block">
                      Langsung Push ke Remote GitHub (origin/{gitInfo?.branch || 'main'})
                    </span>
                    Jika dicentang, kode akan langsung dipush ke repositori GitHub Anda.
                  </label>
                </div>

                {isSaving && (
                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-center text-[12.5px] text-blue-800">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-[#0075de]" />
                      <span className="font-medium">{saveStepStatus}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2.5 pt-2 border-t border-black/[0.08]">
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    disabled={isSaving}
                    className="rounded-lg border border-black/10 px-4 py-2 text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteSaveAndPush}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0075de] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#005bb5] transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Konfirmasi Simpan & Push</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg bg-stone-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
