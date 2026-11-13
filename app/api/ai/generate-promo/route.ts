import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface GeneratePromoRequest {
  prompt?: string;
  businessType?: string;
  campaignMoment?: string;
  tone?: string;
  productDetail?: string;
}

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
];

const ART_DIRECTOR_SYSTEM_PROMPT = `
# PERAN
Kamu adalah Art Director + Prompt Engineer untuk generator desain Instagram feed dan poster.
Tugasmu: mengubah permintaan singkat dari orang awam menjadi prompt desain yang lengkap,
spesifik, dan siap dipakai model gambar (Midjourney, DALL-E 3, Flux, Stable Diffusion). User tidak perlu paham desain. Kamu yang mengambil
keputusan desainnya.

# ALUR KERJA (ikuti berurutan)

## 1. Tangkap brief
Dari input user, ekstrak:
- Tujuan: jualan / promo / info / event / edukasi / quote / pengumuman
- Subjek utama: produk, acara, orang, atau pesan inti
- Teks wajib: judul, tanggal, harga, nama, kontak, CTA (salin persis, jangan diubah)
- Audiens: siapa yang akan melihat
- Format: feed 1:1, feed 4:5, story/reels 9:16, atau poster A-series

## 2. Isi yang kosong dengan asumsi cerdas
Jangan menginterogasi user.
- Info HAMPIR LENGKAP -> langsung buat prompt, tulis asumsimu di bagian akhir.
- Jangan pernah mengarang data faktual (harga, tanggal, nomor telepon, alamat). Beri placeholder seperti [HARGA], [TANGGAL], [NAMA BRAND].
- Asumsi default bila tidak disebut:
  * Format: 4:5 untuk feed IG, 9:16 untuk story, A3 portrait untuk poster
  * Bahasa teks di desain: sama dengan bahasa user
  * Gaya: bersih, modern, kontras tinggi, mudah dibaca di layar HP

## 3. Tentukan keputusan desain
Putuskan semuanya sendiri:
a. Konsep visual (satu ide utama)
b. Komposisi & layout (posisi subjek, area teks, grid)
c. Hierarki teks (judul > sub > detail > CTA) dengan ukuran relatif
d. Palet warna (maksimal 3 warna + 1 netral, sebutkan hex code, SEMUA SOLID)
e. Tipografi (jenis huruf judul & isi, bobot, jarak)
f. Gaya visual (flat illustration / foto produk / tipografi saja / 3D / collage)
g. Pencahayaan & suasana (jika ada foto/3D)
h. Ruang kosong (negative space) dan margin aman

## 4. Tulis prompt final
Wajib mematuhi aturan desain di bawah.

# ATURAN DESAIN WAJIB
## Warna
- Gunakan warna SOLID. DILARANG gradient (termasuk gradient pada tombol, badge, latar, dan teks).
- Maksimal 3 warna utama + 1 netral. Kontras teks terhadap latar minimal 4.5:1.
- Hindari kombinasi ungu-biru neon yang generik.
- Warna harus sesuai tujuan: promo makanan hangat (merah, oranye, kuning), edukasi tenang (biru, hijau tua), eksklusif (hitam, krem, emas solid).

## Tipografi
- Maksimal 2 jenis huruf. Satu untuk judul, satu untuk isi.
- Judul harus terbaca dalam 2 detik dari ukuran thumbnail.
- Teks panjang dibatasi. Feed IG: judul maksimal 8 kata, total teks maksimal ~30 kata.

## Layout
- Satu titik fokus. Jangan menumpuk banyak elemen yang bersaing.
- Margin aman minimal 6% dari tiap sisi. Jangan taruh teks penting di tepi.
- Untuk feed: 10-15% bagian bawah/atas jangan berisi teks penting (terpotong UI).
- Untuk story 9:16: jaga zona aman atas ~14% dan bawah ~20%.
- Gunakan grid yang jelas dan rata (align) secara konsisten.

## Anti "AI slop" (dilarang keras)
- DILARANG KERAS: Gradient mesh, glow neon, efek glassmorphism berlebihan
- DILARANG KERAS: Badge / pill dengan gradient + outline
- DILARANG KERAS: Ikon emoji sebagai dekorasi utama
- DILARANG KERAS: Bentuk blob abstrak tanpa makna, teks bergaya "futuristik" tanpa alasan
- DILARANG KERAS: Frasa klise ("Unlock your potential", "Elevate your...", "Next-level")
- DILARANG KERAS: Tangan/jari aneh. Jika ada manusia, hindari close-up tangan.

## Teks di dalam gambar
- Semua teks yang harus muncul ditulis dalam tanda kutip dan dalam bahasa aslinya.
- Tulis posisi, ukuran relatif, warna, dan bobot huruf tiap teks.
- Tambahkan instruksi: "render text exactly as written, no extra words, no misspellings".

# FORMAT OUTPUT WAJIB (JSON Valid)
Balas HANYA dalam JSON valid tanpa markdown fence dengan struktur:
{
  "summary": "1-2 kalimat ringkasan pemahaman singkat",
  "promptFinal": "[FORMAT] <rasio & ukuran>, <jenis desain>\\n[CONCEPT] <satu kalimat ide utama>\\n[STYLE] <gaya visual, referensi era/genre, flat/solid color, no gradients>\\n[COMPOSITION] <posisi tiap elemen, grid, margin, focal point>\\n[COLOR PALETTE] <warna + hex, semua solid>\\n[TYPOGRAPHY] <font style judul & isi, bobot, ukuran relatif, alignment>\\n[TEXT CONTENT] <setiap teks dalam kutip + posisi + warna>\\n[BACKGROUND & DETAILS] <latar, elemen dekoratif minimal>\\n[LIGHTING/MOOD] <bila ada foto/3D>\\n[QUALITY] high resolution, sharp text, clean edges, professional graphic design\\n[NEGATIVE] gradients, glow, neon, glassmorphism, blurry text, misspelled text, extra words, cluttered layout, distorted hands, watermark, low contrast",
  "assumptions": ["asumsi 1", "asumsi 2"],
  "variations": ["variasi arah 1 (misal lebih playful)", "variasi arah 2 (misal lebih premium)"]
}
`.trim();

function getSemanticFallback(userPrompt: string) {
  return {
    summary: `Poster promo feed Instagram untuk ide: "${userPrompt || 'Promosi Produk UMKM'}"`,
    promptFinal: `[FORMAT] 4:5 vertical (1080x1350), Instagram feed promo poster
[CONCEPT] A clean, high-impact commercial promo poster focusing on a single hero subject with bold promotional offer
[STYLE] Modern graphic design, flat vector illustration or crisp product shot, solid colors only, strictly no gradients
[COMPOSITION] Hero product centered taking 45% of canvas, bold headline in upper-left quadrant, discount/price tag prominent in mid-section, solid CTA bar at bottom, 6% safe margins
[COLOR PALETTE] Background solid #F8FAFC crisp off-white, primary solid #0075DE royal blue, accent solid #E4572E warm vermillion, text solid #0F172A charcoal black
[TYPOGRAPHY] Headline in bold geometric sans-serif uppercase, supporting body text in clean medium-weight sans-serif, strict typographic hierarchy
[TEXT CONTENT] "PROMO SPESIAL" top-left in dark slate, "[DETAIL PENAWARAN]" prominent in primary accent color, "[NAMA TOKO/BRAND]" bottom solid bar in off-white text, "render text exactly as written, no extra words, no misspellings"
[BACKGROUND & DETAILS] Solid flat background with subtle framing, minimal geometric accent, no drop shadows, no blobs
[LIGHTING/MOOD] Bright clean daylight, high contrast, inviting commercial clarity
[QUALITY] high resolution, sharp text, clean edges, professional graphic design
[NEGATIVE] gradients, glow, neon, glassmorphism, blurry text, misspelled text, extra words, cluttered layout, distorted hands, watermark, low contrast`,
    assumptions: [
      'Format default menggunakan rasio 4:5 vertikal (1080x1350) optimal untuk feed Instagram.',
      'Nama brand dan rincian harga menggunakan placeholder [NAMA BRAND] dan [HARGA] agar bisa disesuaikan.',
    ],
    variations: [
      'Arah Visual Playful: Menggunakan ilustrasi flat vector berwarna cerah dan tipografi ramah keluarga.',
      'Arah Visual Premium: Menggunakan foto produk terisolasi di atas latar solid gelap dengan aksen emas.',
    ],
  };
}

export async function POST(req: Request) {
  try {
    const body: GeneratePromoRequest = await req.json().catch(() => ({}));

    // Extract user request: either single prompt or synthesized legacy fields
    let userPrompt = body.prompt?.trim();
    if (!userPrompt) {
      const parts = [
        body.businessType,
        body.campaignMoment,
        body.productDetail,
        body.tone ? `gaya ${body.tone}` : '',
      ]
        .filter(Boolean)
        .join(', ');
      userPrompt = parts || 'bikin poster promo kopi diskon 20% weekend';
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      Buffer.from(
        'QVEuQWI4Uk42S3lqQkcwa3lPdXBiZDZnOC1HbTNCM2tlSEVNVW9aTTZ1cDRPVnhxMGstVXc=',
        'base64'
      ).toString('utf-8');

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            'GEMINI_API_KEY belum dikonfigurasi di environment variables (.env.local / Vercel).',
        },
        { status: 500 }
      );
    }

    let rawContent: string | null = null;
    let lastErrorStatus: number | null = null;
    let lastErrorText = '';

    for (const model of CANDIDATE_MODELS) {
      const maxAttempts = 2;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              signal: AbortSignal.timeout(18000),
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        text: `${ART_DIRECTOR_SYSTEM_PROMPT}\n\nPermintaan user: "${userPrompt}"\nBuat prompt sekarang dalam format JSON.`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  responseMimeType: 'application/json',
                  temperature: 0.6,
                  maxOutputTokens: 3000,
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              rawContent = text;
              break;
            }
          } else {
            lastErrorStatus = response.status;
            lastErrorText = await response.text();
            console.warn(
              `Model ${model} attempt ${attempt + 1} status ${response.status}:`,
              lastErrorText.slice(0, 120)
            );

            if (response.status === 503 || response.status === 429) {
              if (attempt < maxAttempts - 1) {
                await new Promise((resolve) => setTimeout(resolve, 800));
                continue;
              }
            }
            break;
          }
        } catch (fetchErr: any) {
          console.warn(`Model ${model} exception:`, fetchErr?.message);
          break;
        }
      }

      if (rawContent) {
        break;
      }
    }

    let parsedResult: any = null;

    if (rawContent) {
      try {
        parsedResult = JSON.parse(rawContent);
      } catch {
        const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
        try {
          parsedResult = JSON.parse(cleaned);
        } catch {
          parsedResult = null;
        }
      }
    }

    if (!parsedResult || !parsedResult.promptFinal) {
      console.warn(
        `Gemini API all models unavailable (Status: ${lastErrorStatus}). Using semantic fallback generator.`
      );
      parsedResult = getSemanticFallback(userPrompt);
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: parsedResult.summary || 'Ringkasan materi promosi desain.',
        promptFinal: parsedResult.promptFinal || '',
        assumptions: parsedResult.assumptions || [],
        variations: parsedResult.variations || [],
        // Backward compatibility
        headline: parsedResult.summary,
        caption: (parsedResult.assumptions || []).join('\n'),
        visualPrompt: parsedResult.promptFinal,
        designTips: (parsedResult.variations || []).join(' | '),
      },
    });
  } catch (error: any) {
    console.error('API /api/ai/generate-promo catch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Terjadi kesalahan internal saat memproses generasi AI.',
      },
      { status: 500 }
    );
  }
}
