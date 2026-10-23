'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2, UserPlus, LogIn, X } from 'lucide-react';

interface GuestCheckoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmGuest: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  buyerEmail?: string;
}

export default function GuestCheckoutConfirmModal({
  isOpen,
  onClose,
  onConfirmGuest,
  onOpenRegister,
  onOpenLogin,
  buyerEmail,
}: GuestCheckoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-black/10 bg-[#ffffff] p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Tutup modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Header */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-[#111111] leading-tight">
              Apakah Anda Yakin Ingin Melanjutkan?
            </h3>
            <p className="text-[12.5px] font-medium text-amber-800 mt-1">
              Anda belum login ke akun Warung Design {buyerEmail ? `(${buyerEmail})` : ''}
            </p>
          </div>
        </div>

        {/* Informative Explanation */}
        <div className="rounded-xl bg-amber-50/60 border border-amber-200/80 p-4 text-[13px] text-amber-900 space-y-2 leading-relaxed">
          <p>
            Jika melanjutkan sebagai <strong>tamu (tanpa login)</strong>, riwayat transaksi Anda hanya akan tersimpan di <strong>penyimpanan lokal browser</strong> ini.
          </p>
          <p className="text-[12px] text-amber-800/90 font-medium">
            ⚠️ Riwayat pesanan dan link file download Anda <strong>berisiko hilang</strong> apabila browser dibersihkan, riwayat/cache dihapus, atau jika Anda berganti perangkat (HP/Laptop).
          </p>
        </div>

        {/* Benefits of Registering */}
        <div className="space-y-2.5 pt-1">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#757575] block">
            Keuntungan Mendaftar Akun:
          </span>
          <div className="space-y-2 text-[13px] text-[#111111]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Permanen &amp; Aman:</strong> Seluruh riwayat pembelian dan link download tersimpan selamanya di cloud akun Anda.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#0075de] shrink-0 mt-0.5" />
              <span><strong>Akses Fleksibel:</strong> Akses dan unduh template kapan saja dari HP, Tablet, atau Laptop mana pun.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2 border-t border-black/[0.08]">
          <button
            type="button"
            onClick={onOpenRegister}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0075de] hover:bg-[#005bb5] text-white py-3 px-4 text-[13.5px] font-semibold transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Akun Baru Sekarang (Disarankan)</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={onOpenLogin}
              className="w-full flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-white hover:bg-stone-50 py-2.5 px-3 text-[13px] font-medium text-[#111111] transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-stone-600" />
              <span>Sudah Punya Akun? Masuk</span>
            </button>

            <button
              type="button"
              onClick={onConfirmGuest}
              className="w-full sm:w-auto text-center py-2.5 px-3 text-[12.5px] font-medium text-stone-500 hover:text-stone-800 transition-colors"
            >
              Tetap Lanjut Tanpa Akun &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
