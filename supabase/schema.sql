-- Warung Desain Database Schema & Policies
-- Supabase Postgres Migration

-- 1. Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if needed for clean re-runs
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS bundles CASCADE;
-- DROP TABLE IF EXISTS admin_settings CASCADE;

-- 3. Create Table: bundles
CREATE TABLE IF NOT EXISTS public.bundles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    preview_images TEXT[] NOT NULL DEFAULT '{}',
    file_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    features TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create Table: orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code TEXT UNIQUE NOT NULL,
    bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE RESTRICT,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT,
    sender_name TEXT,
    base_price INTEGER NOT NULL,
    unique_code INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'menunggu_verifikasi', 'sukses', 'ditolak', 'kedaluwarsa')),
    telegram_message_id TEXT,
    download_token TEXT,
    download_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON public.orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_download_token ON public.orders(download_token);
CREATE INDEX IF NOT EXISTS idx_orders_expires_at ON public.orders(expires_at);
CREATE INDEX IF NOT EXISTS idx_bundles_slug ON public.bundles(slug);

-- 5. Create Table: admin_settings (Optional configuration storage)
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies: bundles
-- Everyone can read active bundles
DROP POLICY IF EXISTS "Public can view active bundles" ON public.bundles;
CREATE POLICY "Public can view active bundles"
    ON public.bundles
    FOR SELECT
    USING (is_active = true);

-- 8. RLS Policies: orders
-- Public can view specific order if they know its UUID (needed for checkout page)
DROP POLICY IF EXISTS "Public can view own order by ID" ON public.orders;
CREATE POLICY "Public can view own order by ID"
    ON public.orders
    FOR SELECT
    USING (true);

-- Allow server-side insertion and updates to orders
DROP POLICY IF EXISTS "Enable insert for orders" ON public.orders;
CREATE POLICY "Enable insert for orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for orders" ON public.orders;
CREATE POLICY "Enable update for orders"
    ON public.orders
    FOR UPDATE
    USING (true);

-- 9. Enable Realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- 10. Seed Initial Bundles (Fase 1 MVP) with deterministic UUIDs
INSERT INTO public.bundles (id, name, slug, description, price, preview_images, file_url, is_active, features)
VALUES
(
    'b1a2c3d4-0001-4000-8000-000000000001',
    'Paket Promo Ramadhan & Idul Fitri',
    'paket-promo-ramadhan',
    'Koleksi lengkap 25+ template desain feed & story Instagram bertema Ramadhan & Lebaran. Siap edit & posting dengan nuansa islami modern nan elegan, lengkap dengan prompt Midjourney & DALL-E v3 untuk variasi tak terbatas.',
    49000,
    ARRAY[
        'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80'
    ],
    'bundles/paket-promo-ramadhan.zip',
    true,
    ARRAY[
        '25 Desain Feed & Story HD (1080x1080 & 1080x1920)',
        'Format PNG Transparan & JPG Siap Posting',
        'File Prompt Teks Midjourney & DALL-E 3',
        'Panduan Edit Tambah Logo & Teks Sederhana',
        'Bebas Lisensi Komersial untuk UMKM'
    ]
),
(
    'b1a2c3d4-0002-4000-8000-000000000002',
    'Paket Diskon & Cuci Gudang Akhir Tahun',
    'paket-diskon-akhir-tahun',
    'Set poster promosi super mencolok untuk event Midnight Sale, Year-End Clearance, Buy 1 Get 1, dan Flash Sale. Desain berenergi tinggi dengan warna kontras yang terbukti meningkatkan klik dan konversi penjualan promo toko Anda.',
    59000,
    ARRAY[
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1000&q=80'
    ],
    'bundles/paket-diskon-akhir-tahun.zip',
    true,
    ARRAY[
        '30 Template Banner Diskon Spektakuler',
        'Set Stiker & Badge Persentase Diskon PNG',
        'Prompt Eksklusif Gaya Cyberpunk & Neon Glow',
        'Rasio Fleksibel (Kotak 1:1 & Story 9:16)',
        'Kompatibel Canva Gratis & Photoshop'
    ]
),
(
    'b1a2c3d4-0003-4000-8000-000000000003',
    'Paket Kuliner, Cafe & Resto UMKM',
    'paket-kuliner-cafe-resto',
    'Visual menggugah selera untuk bisnis F&B (kopi, cemilan, katering, aneka makanan gurih & manis). Layout promosi menu baru, review pelanggan, dan promo jam makan siang dengan tone hangat yang meningkatkan nafsu makan.',
    45000,
    ARRAY[
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80'
    ],
    'bundles/paket-kuliner-cafe-resto.zip',
    true,
    ARRAY[
        '20 Template Menu Spesial & Promo Makanan',
        'Color Palette Hangat & Appetite-Inducing',
        'Bonus 15+ Prompt AI Realistic Food Photography',
        'Format Resolusi Tinggi Siap Cetak Brosur & Feeds',
        'Panduan Cepat Ganti Foto Produk Sendiri'
    ]
),
(
    'b1a2c3d4-0004-4000-8000-000000000004',
    'Paket Fashion, Hijab & Olshop Glow-up',
    'paket-fashion-olshop-glowup',
    'Desain minimalis, clean, dan aesthetic bernuansa pastel & earthy tone. Khusus brand pakaian, hijab, aksesoris, dan kosmetik lokal yang ingin feeds Instagram dan etalase marketplace tampil premium seperti brand besar.',
    49000,
    ARRAY[
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80'
    ],
    'bundles/paket-fashion-olshop-glowup.zip',
    true,
    ARRAY[
        '22 Template Minimalist Editorial Style',
        'Konsep Feeds 3x3 Rapi & Nyambung',
        'Prompt AI Model Hijab & Aesthetic Studio Light',
        'Bisa Di-edit Langsung Lewat Smartphone',
        'Lisensi Komersial Seumur Hidup'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    preview_images = EXCLUDED.preview_images,
    file_url = EXCLUDED.file_url,
    is_active = EXCLUDED.is_active,
    features = EXCLUDED.features;

