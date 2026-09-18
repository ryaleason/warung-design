# Product Requirements Document (PRD)
## Platform Bundle Prompt AI & Desain Instan untuk UMKM

**Versi:** 1.0 (Draft MVP)
**Status:** Draft — untuk validasi ide
**Tanggal:** 18 September 2026

---

## 1. Overview

Platform yang menjual **bundle konten desain siap pakai** (poster promosi, feed Instagram, banner diskon, dll) yang dihasilkan menggunakan AI generative image, ditujukan untuk admin media sosial UMKM yang tidak punya waktu, skill desain, atau familiaritas teknis untuk menggunakan tools AI generatif (Midjourney, DALL-E, dsb) secara langsung.

Produk bukan menjual "teks prompt mentah", melainkan **hasil jadi (preview gambar + variasi warna/layout) plus prompt sebagai bonus**, dikemas dalam bundling tematik (musiman/event) yang bisa langsung dipakai admin UMKM tanpa proses teknis tambahan.

---

## 2. Problem Statement

- Admin UMKM sering harus membuat konten promosi (poster diskon, feed Instagram, banner event) secara rutin, tapi tidak punya skill desain atau waktu untuk belajar tools AI generatif.
- Tools AI generatif seperti Midjourney/DALL-E butuh keahlian prompt-engineering yang tidak dikuasai kebanyakan pelaku UMKM.
- Template desain generik yang beredar (Canva gratisan, dsb) terasa pasaran dan kurang customizable untuk kebutuhan promosi musiman spesifik (Ramadhan, akhir tahun, dsb).
- Belum ada produk yang mengemas hasil AI generatif dalam bentuk **siap pakai** khusus untuk konteks UMKM lokal (bahasa, tema budaya, momen promosi lokal).

---

## 3. Goals & Success Metrics

| Goal | Metrik |
|---|---|
| Validasi willingness-to-pay UMKM untuk konten AI siap pakai | Minimal 50–100 transaksi bundle terjual dalam 2 bulan pertama |
| Menentukan tema bundling paling laku | Top 3 tema bundling dengan repeat purchase tertinggi |
| Mengukur efisiensi delivery (tanpa dashboard kompleks) | Waktu dari pembayaran ke delivery < 5 menit (otomatis) |
| Retensi pembeli | ≥20% pembeli melakukan pembelian bundling kedua dalam 3 bulan |

---

## 4. Target User / Persona

**Admin Sosmed UMKM ("Kak Rani")**
- Mengelola akun Instagram/media sosial 1–3 UMKM sekaligus (kadang merangkap owner).
- Tidak punya background desain grafis formal.
- Sering deadline mendadak untuk posting promo (diskon, event, hari besar).
- Sensitif harga, prefer solusi murah & cepat dibanding subscription mahal.
- Familiar pakai HP/WhatsApp untuk transaksi, belum tentu terbiasa dashboard web kompleks.

---

## 5. Scope

### 5.1 In-Scope (MVP)
- Landing page katalog produk (statis/SSG) menampilkan bundle tema.
- Halaman detail bundle: preview gambar hasil, deskripsi, harga, isi bundle.
- Sistem pembayaran **manual**: QRIS statis GoPay Merchant + verifikasi owner via Telegram bot (lihat detail alur di §7.3 & §7.7).
- Delivery otomatis pasca-approval: link download (ZIP berisi gambar + file prompt teks) dikirim via email dan/atau ditampilkan di halaman sukses begitu owner klik "ACC" di Telegram.
- Minimal 3–5 bundle tema awal untuk soft launch (mis. "Paket Promo Ramadhan", "Paket Diskon Akhir Tahun", "Paket Feed Harian Umum").
- Halaman FAQ / cara pakai (edukasi ringan cara pakai file yang didapat).

### 5.2 Out-of-Scope (Fase 2/3 — dicatat sebagai roadmap, bukan requirement MVP)
- Generate-on-demand langsung dari dalam platform (integrasi API image generation real-time).
- Akun member / dashboard login.
- Sistem langganan bulanan berulang otomatis.
- Kustomisasi teks/logo otomatis di atas hasil AI (auto text-overlay).
- Proteksi anti-pembajakan tingkat lanjut (watermark dinamis, DRM, dsb).

---

## 6. User Stories

**Sebagai admin UMKM, saya ingin:**
1. Melihat katalog bundle tema tanpa harus daftar akun dulu, supaya saya bisa cepat menilai relevansi produk.
2. Melihat preview hasil gambar sebelum membeli, supaya saya yakin kualitasnya sesuai kebutuhan brand saya.
3. Membayar dengan metode yang familiar (QRIS/e-wallet), supaya proses checkout cepat dan tidak ribet.
4. Langsung menerima file setelah bayar tanpa menunggu approval manual, supaya saya bisa langsung posting.
5. Mendapat prompt teks di dalam bundle, supaya saya bisa generate variasi tambahan sendiri kalau butuh.
6. (Fase 2) Login dan melihat riwayat pembelian saya, supaya saya bisa download ulang tanpa cari-cari email lama.

**Sebagai admin platform (owner produk), saya ingin:**
7. Menambah/mengubah bundle tema baru dengan mudah, supaya saya bisa cepat merilis tema musiman.
8. Melihat data transaksi & bundle terlaris, supaya saya tahu tema mana yang perlu diperbanyak.

---

## 7. Functional Requirements

### 7.1 Katalog & Landing Page
- Menampilkan daftar bundle (nama, harga, thumbnail, badge "Terlaris"/"Baru").
- Filter/kategori sederhana berdasarkan tema/musim (opsional untuk MVP jika bundle masih sedikit).

### 7.2 Halaman Detail Bundle
- Galeri preview hasil (minimal 3–5 contoh gambar per bundle).
- Deskripsi isi bundle (jumlah desain, format file, resolusi).
- Tombol beli → redirect ke checkout.

### 7.3 Checkout & Pembayaran (Manual via QRIS GoPay Merchant + Approval Telegram)
Metode pembayaran MVP tidak memakai payment gateway otomatis, melainkan **verifikasi manual oleh owner via Telegram**. Alurnya:

1. Pengguna pilih bundle → checkout → isi data minimal (nama, email/nomor WA untuk pengiriman file).
2. Sistem generate `order` baru dengan status **`pending`**, lalu menampilkan **QRIS statis GoPay Merchant** di halaman pembayaran beserta nominal yang harus dibayar.
3. Setelah transfer, pengguna klik tombol **"Cek Pembayaran"**.
4. Saat tombol diklik, sistem mengirim notifikasi ke **Telegram owner** (via Telegram Bot API) berisi: nama pengirim (isian pengguna), nominal, dan ID order.
5. Owner mengecek mutasi masuk di aplikasi GoPay Merchant secara manual.
6. Jika sesuai, owner klik tombol **"ACC"** langsung di Telegram (inline button pada bot).
7. Klik "ACC" memicu **webhook dari Telegram bot ke backend**, mengubah status order dari `pending` → `sukses`.
8. Halaman web pengguna otomatis update status (polling interval singkat atau realtime channel) tanpa perlu refresh manual.

**Status order**: `pending` → `menunggu_verifikasi` (setelah klik "Cek Pembayaran") → `sukses` / `ditolak`.

### 7.4 Delivery Otomatis
- Begitu status order berubah menjadi `sukses` (dipicu approval Telegram) → sistem generate link download (file di storage cloud, mis. S3/Cloudinary) dan kirim ke email pembeli.
- Halaman status pembayaran otomatis berubah tampilan (dari "Menunggu verifikasi" menjadi "Pembayaran berhasil") dan menampilkan tombol download langsung.
- Link download punya masa berlaku atau dibatasi jumlah akses (mitigasi ringan penyebaran, bukan DRM penuh).

### 7.7 Integrasi Telegram Bot (Verifikasi Pembayaran Manual)
- Bot Telegram terhubung ke akun owner, menerima notifikasi otomatis tiap ada klik "Cek Pembayaran".
- Format notifikasi minimal: ID order, nama pengirim, nominal, nama bundle.
- Inline button "ACC" dan "Tolak" pada pesan bot.
- Webhook dari Telegram (saat tombol ditekan) memicu update status order di database secara real-time.
- Guard sederhana: hanya chat ID owner yang terdaftar yang bisa memicu perubahan status (mencegah orang lain approve sembarangan kalau bot token bocor).

### 7.5 Admin/Owner Panel (Sederhana)
- CRUD bundle (upload gambar preview, isi file ZIP, set harga, deskripsi).
- Melihat daftar transaksi & status pembayaran.

### 7.6 Non-Functional Requirements
- **Performance**: halaman katalog load < 3 detik di koneksi mobile 4G rata-rata.
- **Reliability**: delivery otomatis harus konsisten (< 1% kegagalan pengiriman file).
- **Security**: data pembayaran ditangani sepenuhnya oleh payment gateway (bukan disimpan sendiri); link download tidak predictable/guessable (gunakan token unik).
- **Scalability**: arsitektur awal cukup untuk trafik rendah–menengah (ratusan transaksi/bulan), tidak perlu over-engineered di MVP.
- **Compatibility**: mobile-first, mengingat mayoritas target user mengakses dari HP.

---

## 8. Mekanisme Bisnis

- **Model transaksi**: bundling tematik (beli putus per paket), bukan per-prompt satuan.
- **Harga**: per bundle, disesuaikan jumlah desain dan kompleksitas tema.
- **Roadmap monetisasi lanjutan**: langganan bulanan diperkenalkan di Fase 2 setelah ada basis pelanggan repeat buyer dari model bundling.

---

## 8.1 Risiko & Mitigasi Alur Pembayaran Manual

| Risiko | Mitigasi |
|---|---|
| QRIS statis tidak otomatis mencocokkan nominal ke order tertentu | Tambahkan kode unik di akhir nominal (mis. Rp 49.000 → Rp 49.017, angka terakhir = kode order) agar owner mudah mencocokkan mutasi |
| Pengguna salah/lupa isi nama pengirim saat checkout | Wajibkan field nama pengirim sebelum tombol "Cek Pembayaran" bisa diklik |
| Delay approval karena owner tidak selalu online | Tampilkan estimasi waktu verifikasi di halaman (mis. "Diproses maks. 1-2 jam pada jam kerja") supaya ekspektasi user terjaga |
| Bot token/chat ID bocor, orang lain bisa approve | Validasi chat ID pengirim command di sisi backend sebelum eksekusi update status |
| Order dibiarkan pending tanpa batas waktu | Set auto-expire order (mis. 24 jam) jika belum diverifikasi, status berubah jadi `kedaluwarsa` |

## 9. Proteksi Konten (Realistis untuk MVP)

- Tidak ada proteksi teknis kuat terhadap penyebaran ulang file (batasan sifat produk digital).
- Mitigasi minimal: link download bertoken unik + limit jumlah download/waktu kedaluwarsa.
- Strategi jangka panjang (bukan requirement MVP): pindah ke model generate-in-app di Fase 2, di mana prompt tidak pernah diberikan mentah ke user — nilai jual berpindah dari "file" ke "akses layanan".

---

## 10. Milestone (Indikatif)

| Fase | Cakupan | Estimasi |
|---|---|---|
| Fase 0 | Riset tema bundle awal + produksi 3–5 bundle pertama | 1–2 minggu |
| Fase 1 (MVP) | Landing page + katalog + checkout + delivery otomatis | 3–4 minggu |
| Fase 1.5 | Soft launch, kumpulkan feedback & data penjualan | 4–8 minggu |
| Fase 2 | Evaluasi: lanjut ke akun member + generate-on-demand jika traksi baik | Setelah validasi |

---

## 11. Open Questions

- Sumber generate gambar untuk produksi bundle awal: manual pakai Midjourney/DALL-E oleh tim, atau sudah ada rencana API tertentu?
- Berapa harga bundle yang realistis untuk segmen UMKM lokal (perlu riset harga kompetitor/template sejenis)?
- Apakah butuh legalitas/lisensi khusus terkait penggunaan komersial output AI generatif (tergantung tool yang dipakai)?
- Channel akuisisi awal: organik media sosial, marketplace (Tokopedia/Shopee sebagai storefront tambahan), atau komunitas UMKM?
