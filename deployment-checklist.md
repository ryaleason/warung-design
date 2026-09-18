# Deployment Checklist
## Platform Bundle Prompt AI & Desain Instan untuk UMKM

**Referensi:** PRD v1.0, TDD v1.0
**Tanggal:** 18 September 2026

---

## 1. Persiapan Akun & Layanan

- [ ] Akun **GitHub** — repo project sudah dibuat (private/public)
- [ ] Akun **Vercel** — sudah connect ke GitHub
- [ ] Akun **Supabase** — project baru sudah dibuat
- [ ] Bot **Telegram** — sudah dibuat via [@BotFather](https://t.me/BotFather), catat `TELEGRAM_BOT_TOKEN`
- [ ] Chat ID owner sudah didapat (kirim pesan ke bot lalu cek via `getUpdates`), catat `TELEGRAM_OWNER_CHAT_ID`
- [ ] Akun **cron-job.org** sudah dibuat
- [ ] Gambar **QRIS statis GoPay Merchant** sudah disiapkan (format PNG/JPG, resolusi jelas)
- [ ] Domain (kalau pakai custom domain, bukan `*.vercel.app`) sudah dibeli & siap diarahkan

---

## 2. Setup Database (Supabase)

- [ ] Jalankan SQL migration untuk tabel `bundles`
- [ ] Jalankan SQL migration untuk tabel `orders`
- [ ] Jalankan SQL migration untuk tabel `admin_settings` (jika dipakai)
- [ ] Aktifkan **Row Level Security (RLS)** di semua tabel
- [ ] Buat policy RLS: publik hanya boleh `SELECT` bundle yang `is_active = true`
- [ ] Buat policy RLS: insert/update `orders` hanya via service role (server-side), bukan langsung dari client
- [ ] Aktifkan **Realtime** untuk tabel `orders`
- [ ] Buat bucket **Storage** untuk preview images (public) dan file ZIP bundle (private)
- [ ] Test upload 1 file contoh ke masing-masing bucket untuk pastikan permission benar

---

## 3. Environment Variables (Vercel)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (⚠️ jangan pernah expose ke client-side)
- [ ] `TELEGRAM_BOT_TOKEN`
- [ ] `TELEGRAM_OWNER_CHAT_ID`
- [ ] `CRON_SECRET`
- [ ] `QRIS_IMAGE_URL`
- [ ] Semua env variable di atas sudah diisi untuk environment **Production** (bukan cuma Preview/Development)

---

## 4. Setup Telegram Webhook

- [ ] Endpoint webhook (`/api/telegram/webhook/<secret>`) sudah live di production URL
- [ ] Jalankan `setWebhook` ke Telegram Bot API mengarah ke URL production
- [ ] Test kirim pesan manual ke endpoint webhook, pastikan hanya `OWNER_CHAT_ID` yang diterima (chat ID lain harus ditolak)
- [ ] Test klik tombol "ACC" dari akun Telegram owner asli → pastikan status order di database berubah
- [ ] Test klik "Tolak" → pastikan status berubah sesuai (`ditolak`), bukan malah `sukses`

---

## 5. Setup Cron Job (Auto-Expire Order)

- [ ] Job dibuat di cron-job.org, mengarah ke `/api/cron/expire-orders` production URL
- [ ] Header `Authorization: Bearer <CRON_SECRET>` sudah diset di konfigurasi cron
- [ ] Interval job sudah diset (rekomendasi: tiap 15 menit)
- [ ] Test manual hit endpoint dengan secret yang salah → harus ditolak (401/403)
- [ ] Test manual hit endpoint dengan secret benar → order lama berubah jadi `kedaluwarsa`

---

## 6. Alur Pembayaran End-to-End (Staging/Production)

- [ ] Buat 1 order test dari katalog sampai selesai checkout
- [ ] Pastikan nominal QRIS yang muncul = `base_price + unique_code` (bukan harga asli polos)
- [ ] Klik "Cek Pembayaran" → pastikan notifikasi masuk ke Telegram owner dengan data benar (nama pengirim, nominal, order code)
- [ ] Klik "ACC" di Telegram → pastikan:
  - [ ] Status order di database berubah jadi `sukses`
  - [ ] Halaman checkout di browser **otomatis update** tanpa refresh (cek realtime jalan)
  - [ ] Email berisi link download terkirim ke `buyer_email`
  - [ ] Link download bisa diakses dan file benar sesuai bundle yang dibeli
- [ ] Test link download **setelah masa berlaku habis** → harus ditolak/expired
- [ ] Test akses langsung ke file storage tanpa token → harus ditolak (bukan public URL)

---

## 7. Keamanan

- [ ] `SUPABASE_SERVICE_ROLE_KEY` tidak pernah dipakai di kode client-side (`"use client"` components)
- [ ] Webhook Telegram pakai secret path, bukan `/api/telegram/webhook` polos
- [ ] Validasi `chat_id` di webhook sudah aktif dan teruji
- [ ] Endpoint cron tervalidasi via header secret
- [ ] File bundle (ZIP) tidak bisa diakses tanpa token valid
- [ ] Tidak ada API key/token yang ter-commit ke repo (cek `.gitignore` sudah exclude `.env`)

---

## 8. Konten & Data Awal

- [ ] Minimal 3–5 bundle sudah diinput ke tabel `bundles` (nama, harga, deskripsi, preview image, file ZIP)
- [ ] Semua preview image sudah diupload dan URL-nya valid (tidak broken)
- [ ] Harga di setiap bundle sudah difinalisasi (bukan harga placeholder)
- [ ] Halaman FAQ/cara pakai sudah terisi konten final

---

## 9. Monitoring Pasca-Launch

- [ ] Cek log Vercel (Function Logs) untuk pastikan tidak ada error di endpoint utama
- [ ] Cek dashboard Supabase untuk memastikan tidak ada row `orders` yang "nyangkut" di status aneh
- [ ] Siapkan cara cepat cek order manual dari dashboard Supabase (kalau Telegram bot down, owner masih bisa ACC manual lewat Table Editor)
- [ ] Uji ulang seluruh alur (poin 6) sekali lagi 24 jam setelah go-live, pastikan cron auto-expire benar-benar jalan sesuai jadwal

---

## 10. Go-Live

- [ ] Custom domain (jika ada) sudah aktif dan SSL terpasang (otomatis via Vercel)
- [ ] Link katalog sudah bisa dibagikan dan diakses publik
- [ ] Owner sudah standby memantau Telegram untuk beberapa jam pertama pasca-launch
- [ ] Backup rencana: kalau approval Telegram bermasalah, ada cara manual update status order langsung dari Supabase Table Editor
