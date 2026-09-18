# Alur Penggunaan Aplikasi
## Warung Desain

**Referensi:** PRD v1.0, TDD v1.0
**Tanggal:** 18 September 2026

---

## 1. Alur Pembeli (Admin UMKM)

```mermaid
flowchart TD
    A[Buka Warung Desain] --> B[Lihat Katalog Bundle Tema]
    B --> C[Klik Detail Bundle]
    C --> D[Lihat Preview Hasil Desain]
    D --> E{Tertarik beli?}
    E -->|Tidak| B
    E -->|Ya| F[Klik Beli]
    F --> G[Isi Nama & Email]
    G --> H[Sistem Buat Order - status: pending]
    H --> I[Tampil QRIS + Nominal Unik]
    I --> J[Bayar via GoPay/QRIS]
    J --> K[Isi Nama Pengirim]
    K --> L[Klik Cek Pembayaran]
    L --> M[Status berubah: menunggu_verifikasi]
    M --> N[Notifikasi terkirim ke Owner]
    N --> O{Owner ACC?}
    O -->|Belum diproses| P[Halaman tampil: Menunggu Verifikasi]
    P -.->|cek berkala otomatis| O
    O -->|Ditolak| Q[Status: ditolak - tampil pesan & kontak bantuan]
    O -->|Di-ACC| R[Status: sukses]
    R --> S[Halaman otomatis update: Pembayaran Berhasil]
    S --> T[Link Download muncul di halaman]
    S --> U[Email berisi link download terkirim]
    T --> V[Download file ZIP - gambar + prompt]
    U --> V
    V --> W[Selesai - siap posting ke Instagram/media sosial]
```

### Penjelasan Langkah

1. **Buka katalog** — Pembeli membuka Warung Desain, langsung lihat daftar bundle tema tanpa perlu daftar akun.
2. **Lihat detail & preview** — Klik salah satu bundle, lihat contoh hasil desain, deskripsi isi, dan harga.
3. **Checkout** — Klik "Beli", isi nama dan email (untuk pengiriman file nanti).
4. **Bayar** — Sistem tampilkan QRIS GoPay Merchant dengan nominal unik (harga asli + kode unik 3 digit, mis. Rp 49.017).
5. **Konfirmasi** — Setelah transfer, pembeli isi nama pengirim lalu klik **"Cek Pembayaran"**.
6. **Menunggu verifikasi** — Notifikasi otomatis terkirim ke Telegram owner; halaman pembeli menampilkan status "Menunggu Verifikasi" dan update otomatis tanpa refresh.
7. **Hasil** — Begitu owner approve, status berubah jadi "Berhasil", tombol download muncul, dan email otomatis terkirim sebagai cadangan.
8. **Selesai** — Pembeli download file (gambar hasil + prompt teks), siap langsung dipakai posting.

---

## 2. Alur Owner (Verifikasi Pembayaran)

```mermaid
flowchart TD
    A[Terima Notifikasi Telegram] --> B[Baca: Order Code, Nama Pengirim, Nominal]
    B --> C[Buka Aplikasi GoPay Merchant]
    C --> D[Cek Mutasi Masuk]
    D --> E{Nominal & nama cocok?}
    E -->|Cocok| F[Klik ACC di Telegram]
    E -->|Tidak cocok / tidak ditemukan| G[Klik Tolak di Telegram]
    F --> H[Sistem update status: sukses]
    H --> I[File otomatis terkirim ke pembeli]
    G --> J[Sistem update status: ditolak]
    J --> K[Pembeli lihat status ditolak + info kontak]
```

### Penjelasan Langkah

1. **Notifikasi masuk** — Owner menerima pesan Telegram berisi kode order, nama pengirim, dan nominal yang harus dicocokkan.
2. **Cek manual** — Owner buka aplikasi GoPay Merchant, cari mutasi dengan nominal yang sama persis (termasuk 3 digit kode unik di belakang).
3. **Keputusan** — Kalau cocok, klik tombol **ACC** langsung di chat Telegram. Kalau tidak ditemukan/mencurigakan, klik **Tolak**.
4. **Otomatis di sistem** — Begitu diklik, backend langsung update status order dan (kalau ACC) mengirim file ke pembeli tanpa perlu langkah manual tambahan dari owner.

---

## 3. Alur Order Kedaluwarsa (Otomatis)

```mermaid
flowchart TD
    A[Order dibuat - status: pending/menunggu_verifikasi] --> B[Cron job cek tiap 15 menit]
    B --> C{Order lebih dari 24 jam?}
    C -->|Belum| B
    C -->|Sudah lewat| D[Status berubah: kedaluwarsa]
    D --> E[Pembeli lihat status kedaluwarsa di halaman]
    E --> F[Pembeli bisa buat order baru dari awal]
```

---

## 4. Ringkasan Status Order

| Status | Kapan Terjadi | Yang Dilihat Pembeli |
|---|---|---|
| `pending` | Order baru dibuat, belum klik "Cek Pembayaran" | QRIS + instruksi bayar |
| `menunggu_verifikasi` | Setelah klik "Cek Pembayaran" | "Menunggu diverifikasi owner" |
| `sukses` | Setelah owner klik ACC | "Berhasil" + tombol download |
| `ditolak` | Setelah owner klik Tolak | "Ditolak" + info kontak bantuan |
| `kedaluwarsa` | Lebih dari 24 jam tanpa verifikasi | "Kedaluwarsa, silakan order ulang" |
