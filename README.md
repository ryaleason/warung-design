# Warung Desain 🎨⚡

Platform bundle desain promosi siap pakai (feed & story) untuk admin UMKM Indonesia. Lengkap dengan gambar resolusi tinggi hasil kurasi AI generatif + teks prompt bonus.

Menggunakan alur verifikasi manual via **QRIS GoPay Merchant** + notifikasi inline button **Telegram Bot**, dan delivery file otomatis.

---

## 🚀 Fitur Utama

- **Katalog Bundle Tematik**: Menampilkan paket desain (Ramadhan, Diskon Akhir Tahun, F&B/Kuliner, Fashion Olshop).
- **Checkout Cepat**: Tanpa perlu daftar akun, cukup isi nama dan email.
- **Pembayaran QRIS Statis GoPay Merchant**: Dilengkapi kode unik otomatis 3 digit untuk membedakan mutasi transfer.
- **Verifikasi Telegram Owner**: Notifikasi otomatis dikirim ke bot Telegram owner dengan tombol `[✅ ACC]` dan `[❌ Tolak]`.
- **Realtime Status Update**: Halaman pembeli otomatis berganti tampilan begitu owner melakukan approval via Supabase Realtime & polling fallback.
- **Delivery Otomatis**: Link unduh bertoken kedaluwarsa (48 jam) ditampilkan di layar dan dikirim via email.
- **Auto-Expire Scheduler**: Endpoint cron untuk menandai pesanan yang belum dibayar > 24 jam sebagai kedaluwarsa.
- **Developer Testing Sandbox**: Tersedia tombol simulasi ACC/Tolak langsung di halaman checkout saat pengujian lokal.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Database & Realtime**: Supabase Postgres & Supabase Realtime
- **File Storage**: Supabase Storage
- **Notifikasi**: Telegram Bot API
- **Cron**: cron-job.org / Vercel Cron
- **Animasi & UX**: canvas-confetti

---

## 📦 Menjalankan Proyek Secara Lokal

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Environment Variables
Salin template environment:
```bash
cp .env.example .env.local
```
Edit `.env.local` sesuai akun Supabase dan Telegram Bot Anda:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_OWNER_CHAT_ID`
- `TELEGRAM_WEBHOOK_SECRET`
- `CRON_SECRET`

*(Catatan: Tanpa env var sekalipun, aplikasi sudah dilengkapi fallback in-memory store dan simulasi mock notifikasi sehingga tetap dapat dijalankan dan diuji langsung).*

### 3. Setup Database Supabase
Buka dashboard Supabase Anda, lalu jalankan query SQL yang ada pada file:
```
supabase/schema.sql
```
Script ini akan membuat tabel `bundles`, `orders`, `admin_settings`, RLS policies, dan memasukkan data katalog bundle awal.

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 5. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 🤖 Menghubungkan Telegram Webhook

Untuk menghubungkan Bot Telegram ke aplikasi saat sudah dideploy:
```bash
curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://<domain-anda>/api/telegram/webhook/<TELEGRAM_WEBHOOK_SECRET>"}'
```

---

## ⏰ Konfigurasi Auto-Expire Cron

Daftarkan task di [cron-job.org](https://cron-job.org) atau cron scheduler pilihan Anda:
- **URL**: `https://<domain-anda>/api/cron/expire-orders`
- **Method**: `GET`
- **Header**: `Authorization: Bearer <CRON_SECRET>`
- **Interval**: Setiap 15 menit
