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

-- Insertion and updates to orders are restricted to server-side (Service Role)
-- Service Role bypasses RLS in Supabase by default.

-- 9. Enable Realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- 10. Seed Initial Bundles (Fase 1 MVP)
INSERT INTO public.bundles (name, slug, description, price, preview_images, file_url, is_active, features)
VALUES
(
    'Paket Promo Ramadhan & Idul Fitri',
    'paket-promo-ramadhan',
    'Koleksi lengkap 25+ template desain feed & story Instagram bertema Ramadhan & Lebaran. Siap edit & posting dengan nuansa islami modern nan elegan, lengkap dengan prompt Midjourney & DALL-E v3.',
    49000,
    ARRAY[
        'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
    ],
    'bundles/paket-promo-ramadhan.zip',
    true,
    ARRAY['25 Desain Feed & Story HD', 'Format PNG Transparan + JPG', 'Prompt Midjourney & DALL-E Bonus', 'Panduan Edit Teks Cepat']
),
(
    'Paket Diskon & Cuci Gudang Akhir Tahun',
    'paket-diskon-akhir-tahun',
    'Set poster promosi super mencolok untuk event Midnight Sale, Year-End Clearance, Buy 1 Get 1, dan Flash Sale. Desain berenergi tinggi yang terbukti meningkatkan CTR promosi online.',
    59000,
    ARRAY[
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80'
    ],
    'bundles/paket-diskon-akhir-tahun.zip',
    true,
    ARRAY['30 Template Banner Diskon', 'Badge Persentase & Promo Siap Pakai', 'Prompt Khusus Gaya Neon & Pop-Art', 'Rasio 1:1 dan 9:16']
),
(
    'Paket Kuliner, Cafe & Resto UMKM',
    'paket-kuliner-cafe-resto',
    'Visual menggugah selera untuk bisnis F&B (kopi, cemilan, katering, makanan pedas). Layout highlight menu baru, review pelanggan, dan promo happy hour dengan fotografi makanan estetis.',
    45000,
    ARRAY[
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ],
    'bundles/paket-kuliner-cafe-resto.zip',
    true,
    ARRAY['20 Template Menu & Promo Makanan', 'Color Palette Hangat & Appetite-Inducing', 'Bonus Prompt Realistic Food AI', 'Format Siap Cetak & Posting']
),
(
    'Paket Fashion, Hijab & Olshop Glow-up',
    'paket-fashion-olshop-glowup',
    'Desain minimalis, clean, dan aesthetic bernuansa pastel & earthy tone. Khusus brand pakaian, hijab, aksesoris, dan kosmetik lokal yang ingin feeds media sosialnya terlihat profesional.',
    49000,
    ARRAY[
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80'
    ],
    'bundles/paket-fashion-olshop-glowup.zip',
    true,
    ARRAY['22 Template Minimalist Editorial', 'Grid Feeds 3x3 Nyambung', 'Prompt Aesthetic Studio Lighting', 'Format Canva Compatible']
)
ON CONFLICT (slug) DO NOTHING;
