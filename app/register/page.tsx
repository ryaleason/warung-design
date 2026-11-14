'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/riwayat';

  const { user, isLoading: isAuthLoading, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already logged in, redirect
  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace(redirectUrl);
    }
  }, [user, isAuthLoading, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Gagal mendaftar akun.');
      } else {
        router.push(redirectUrl);
      }
    } catch {
      setErrorMsg('Terjadi kesalahan jaringan. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-10 px-4 sm:px-6 relative">
      {/* Ambient Blue Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-full max-w-3xl h-[380px] bg-[radial-gradient(ellipse_at_center,rgba(0,117,222,0.07),transparent_70%)] pointer-events-none" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#54504c] hover:text-[#111111] transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>

        <Link href="/" className="inline-flex items-center gap-2">
          <Image src="/logo.svg" alt="Warung Design" width={24} height={24} className="h-6 w-auto" />
          <span className="font-semibold text-[15px] tracking-tight text-[#111111]">Warung Design</span>
        </Link>
      </div>

      {/* Main Register Card */}
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-black/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-7 sm:p-9">
        {/* Header */}
        <div className="text-left space-y-1.5 mb-7">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
            Buat Akun Baru
          </h1>
          <p className="text-[13.5px] text-[#54504c] leading-relaxed">
            Daftar gratis untuk menyimpan riwayat pesanan dan mengunduh paket promosi kapan saja.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200/80 p-3.5 flex items-start gap-2.5 text-[13px] text-red-700 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-[12.5px] font-semibold text-[#111111]">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8884]" />
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Siti Sarah"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.12] bg-[#fbfaf9] focus:bg-white text-[14px] text-[#111111] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#0075de] focus:ring-4 focus:ring-[#0075de]/10 transition-all"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-[12.5px] font-semibold text-[#111111]">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8884]" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.12] bg-[#fbfaf9] focus:bg-white text-[14px] text-[#111111] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#0075de] focus:ring-4 focus:ring-[#0075de]/10 transition-all"
              />
            </div>
          </div>

          {/* WhatsApp Phone (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[12.5px] font-semibold text-[#111111]">
                Nomor WhatsApp
              </label>
              <span className="text-[11.5px] text-[#8c8884]">Opsional</span>
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8884]" />
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.12] bg-[#fbfaf9] focus:bg-white text-[14px] text-[#111111] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#0075de] focus:ring-4 focus:ring-[#0075de]/10 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-[12.5px] font-semibold text-[#111111]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8884]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-11 py-3 rounded-2xl border border-black/[0.12] bg-[#fbfaf9] focus:bg-white text-[14px] text-[#111111] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#0075de] focus:ring-4 focus:ring-[#0075de]/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c8884] hover:text-[#111111] transition-colors p-1"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#0084f7] via-[#0075de] to-[#0064c8] py-3.5 px-6 text-[15px] font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_8px_20px_rgba(0,117,222,0.32)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_12px_28px_rgba(0,117,222,0.42)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:pointer-events-none group"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <>
                  <span>Daftar Akun Sekarang</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Switch Link to Login */}
        <div className="mt-6 pt-5 border-t border-black/[0.06] text-center">
          <p className="text-[13px] text-[#54504c]">
            Sudah punya akun?{' '}
            <Link
              href={redirectUrl !== '/riwayat' ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'}
              className="font-semibold text-[#0075de] hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Trust & Reassurance Badges */}
      <div className="w-full max-w-md mx-auto mt-6 text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] text-[#54504c]">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0075de]" />
            Bebas Biaya Langganan
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0075de]" />
            Akses Unduh Permanen
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0075de]" />
            Terenkripsi Aman
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <RefreshCw className="h-6 w-6 text-[#0075de] animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
