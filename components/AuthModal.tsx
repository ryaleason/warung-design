'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { UserPlus, LogIn, X, RefreshCw, Mail, Lock, User, Phone } from 'lucide-react';

function AuthModalDialog() {
  const {
    authModalMode,
    initialFormData,
    closeAuthModal,
    login,
    register,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [name, setName] = useState(initialFormData?.name || '');
  const [email, setEmail] = useState(initialFormData?.email || '');
  const [phone, setPhone] = useState(initialFormData?.phone || '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        const res = await register({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          password,
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Gagal mendaftar');
        }
      } else {
        const res = await login(email.trim(), password);
        if (!res.success) {
          setErrorMsg(res.error || 'Email atau password tidak sesuai');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-black/10 bg-[#ffffff] p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl mb-5 border border-black/[0.05]">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[13px] font-semibold rounded-lg transition-colors ${
              mode === 'register'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-[#757575] hover:text-[#111111]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Akun</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[13px] font-semibold rounded-lg transition-colors ${
              mode === 'login'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-[#757575] hover:text-[#111111]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk</span>
          </button>
        </div>

        {/* Header Title */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#111111]">
            {mode === 'register' ? 'Buat Akun Warung Design' : 'Masuk ke Akun Anda'}
          </h3>
          <p className="text-[12.5px] text-[#757575] mt-0.5">
            {mode === 'register'
              ? 'Simpan riwayat pembelian & unduh bundle kapan saja secara permanen.'
              : 'Akses seluruh riwayat pembelian dan token download Anda.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-[12.5px] text-rose-700">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-[12px] font-semibold text-[#111111] mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rani Maulida"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-black/[0.12] text-[13.5px] text-[#111111] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-[#111111] mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-black/[0.12] text-[13.5px] text-[#111111] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0075de]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[12px] font-semibold text-[#111111] mb-1">
                Nomor WhatsApp <span className="text-stone-400 font-normal">(Opsional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-black/[0.12] text-[13.5px] text-[#111111] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0075de]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-[#111111] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-black/[0.12] text-[13.5px] text-[#111111] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0075de]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0075de] hover:bg-[#005bb5] text-white py-2.5 px-4 text-[13.5px] font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : mode === 'register' ? (
              'Daftar Akun Sekarang'
            ) : (
              'Masuk ke Akun'
            )}
          </button>
        </form>

        {/* Footer switch link */}
        <div className="mt-4 pt-3 border-t border-black/[0.06] text-center text-[12px] text-stone-600">
          {mode === 'register' ? (
            <p>
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-[#0075de] hover:underline"
              >
                Masuk di sini
              </button>
            </p>
          ) : (
            <p>
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-semibold text-[#0075de] hover:underline"
              >
                Daftar sekarang
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthModal() {
  const { isAuthModalOpen } = useAuth();
  if (!isAuthModalOpen) return null;
  return <AuthModalDialog />;
}
