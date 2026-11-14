import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

export interface DynamicQuestionOption {
  letter: string;
  label: string;
  value: string;
}

export interface DynamicQuestion {
  id: string;
  type: 'text' | 'choice';
  question: string;
  placeholder?: string;
  required?: boolean;
  options?: DynamicQuestionOption[];
}

export interface AnswerItem {
  questionId?: string;
  question: string;
  answer: string;
}

interface GeneratePromoRequest {
  action?: 'questions' | 'prompt';
  prompt?: string;
  initialPrompt?: string;
  briefUnderstanding?: string;
  answers?: AnswerItem[] | Record<string, string>;
  // Legacy / fallback parameters
  brandName?: string;
  category?: string;
  goal?: string;
  visualStyle?: string;
  format?: string;
  extraDetail?: string;
}

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
];

const DYNAMIC_QUESTIONS_PROMPT = `
# PERAN: ART DIRECTOR & KONSULTAN DESAIN POSTER (AGENCY LEVEL)
Pengguna adalah orang awam yang ingin membuat materi promosi / poster / feed Instagram. Pengguna telah memasukkan ide awal / brief singkat.
Tugasmu: Menganalisis ide awal tersebut, lalu membuat 4 sampai 5 pertanyaan cerdas dan DINAMIS untuk melengkapi brief agar desain poster yang dihasilkan nantinya SANGAT ESTETIK, KAYA KEDALAMAN (DEPTH OF FIELD), DAN BERSTANDAR AGENSI.

# ATURAN PERTANYAAN WAJIB:
1. Pertanyaan 1 (Nama Brand / Usaha): Tipe "text", required: true. Tanyakan nama brand atau usaha pengguna jika belum jelas di ide awal.
2. Pertanyaan 2 (Gaya Visual & Mood Pencahayaan): Tipe "choice", pilihan A, B, C, D yang dinamis dan spesifik untuk topik pengguna (misal: sinematik 3D, warm golden hour, dark moody artisan, modern clean editorial).
3. Pertanyaan 3 (Fokus Elemen Utama / Hero Object): Tipe "choice", pilihan A, B, C, D yang spesifik terhadap topik (misal: produk hero, tipografi dominan, figur pahlawan & arsitektur kota, kolase foto dinamis).
4. Pertanyaan 4 (Strip Kontak Footer Bar): Tipe "choice", tanyakan format informasi kontak apa yang ingin ditampilkan pada strip bawah (footer bar) poster. Opsi:
   - A. Lengkap: Booking Hotline/WhatsApp, Website Resmi, dan Ikon Media Sosial (Instagram/TikTok/YouTube)
   - B. Hotline WhatsApp dan Username Instagram saja
   - C. Alamat Lokasi Fisik dan Nomor WhatsApp
   - D. Hanya Username Media Sosial (@namabrand)
   - E. Tanpa Footer Bar (Visual bersih murni tanpa strip kontak)
5. Pertanyaan 5 (Detail Kontak Spesifik): Tipe "text", required: false (opsional). Tanyakan nomor WA, website, atau akun medsos jika pengguna ingin mencantumkan data aslinya (placeholder: "Contoh: +62 812-3456-7890 | www.traveldiana.id | @traveldiana").
6. Pertanyaan 6 (Format & Rasio Kanvas): Tipe "choice", pilihan A (Feed Instagram 4:5), B (Feed Persegi 1:1), C (Story & Reels 9:16).

# ATURAN FORMAT:
- Setiap pertanyaan pilihan ganda HARUS memiliki opsi dengan label "A", "B", "C", "D" (dan "E" jika relevan).
- DILARANG menggunakan emoji atau emotikon pada teks pertanyaan maupun opsi jawaban.
- Pilihan jawaban harus terdengar estetik dan berkelas agensi.

# FORMAT OUTPUT JSON WAJIB (Hanya JSON valid murni tanpa markdown fence):
{
  "briefUnderstanding": "1 kalimat ringkasan singkat apa yang ditangkap dari ide awal pengguna",
  "questions": [
    {
      "id": "brandName",
      "type": "text",
      "required": true,
      "question": "Apa nama brand atau usaha Anda?",
      "placeholder": "Contoh: Nama Brand Resmi Anda..."
    },
    {
      "id": "visualMood",
      "type": "choice",
      "question": "<pertanyaan dinamis terkait mood/pencahayaan yang spesifik untuk tema ini>",
      "options": [
        { "letter": "A", "label": "<opsi A estetik spesifik>", "value": "<isi value A>" },
        { "letter": "B", "label": "<opsi B estetik spesifik>", "value": "<isi value B>" },
        { "letter": "C", "label": "<opsi C estetik spesifik>", "value": "<isi value C>" },
        { "letter": "D", "label": "<opsi D estetik spesifik>", "value": "<isi value D>" }
      ]
    },
    {
      "id": "focalPoint",
      "type": "choice",
      "question": "<pertanyaan dinamis terkait titik fokus visual / objek hero>",
      "options": [
        { "letter": "A", "label": "<opsi A spesifik>", "value": "<isi value A>" },
        { "letter": "B", "label": "<opsi B spesifik>", "value": "<isi value B>" },
        { "letter": "C", "label": "<opsi C spesifik>", "value": "<isi value C>" }
      ]
    },
    {
      "id": "footerContact",
      "type": "choice",
      "question": "Informasi kontak apa yang ingin ditampilkan pada strip bawah (footer bar) poster?",
      "options": [
        { "letter": "A", "label": "Lengkap: Booking Hotline/WhatsApp, Website Resmi, dan Ikon Media Sosial (Instagram/TikTok/YouTube)", "value": "Lengkap: Booking Hotline, Website Resmi, dan Ikon Media Sosial" },
        { "letter": "B", "label": "Hotline WhatsApp dan Username Instagram saja", "value": "Hotline WhatsApp dan Username Instagram" },
        { "letter": "C", "label": "Alamat Lokasi Fisik dan Nomor WhatsApp", "value": "Alamat Lokasi Fisik dan Nomor WhatsApp" },
        { "letter": "D", "label": "Hanya Username Media Sosial (@namabrand)", "value": "Hanya Username Media Sosial" },
        { "letter": "E", "label": "Tanpa Footer Bar (Visual bersih murni tanpa strip kontak)", "value": "Tanpa Footer Bar" }
      ]
    },
    {
      "id": "contactDetails",
      "type": "text",
      "required": false,
      "question": "Detail kontak Anda jika sudah ada (Opsional):",
      "placeholder": "Contoh: +62 812-3456-7890 | www.traveldiana.id | @traveldiana"
    },
    {
      "id": "format",
      "type": "choice",
      "question": "Format dan rasio kanvas yang diinginkan?",
      "options": [
        { "letter": "A", "label": "Feed Instagram Portrait 4:5 (1080x1350) — Rekomendasi Feed", "value": "Feed Instagram Portrait 4:5" },
        { "letter": "B", "label": "Feed Instagram Persegi 1:1 (1080x1080)", "value": "Feed Instagram Persegi 1:1" },
        { "letter": "C", "label": "Story & Reels Vertikal 9:16 (1080x1920)", "value": "Story & Reels Vertikal 9:16" }
      ]
    }
  ]
}
`.trim();

const AESTHETIC_ART_DIRECTOR_PROMPT = `
# PERAN: MASTER ART DIRECTOR & COMMERCIAL PROMPT ENGINEER (AGENCY LEVEL)
Kamu adalah Art Director senior dan Prompt Engineer kelas dunia untuk poster komersial, billboard digital, dan Instagram feed/story.
Tugasmu: Mengubah data brief dan jawaban kuesioner pengguna menjadi formula prompt desain grafis yang SANGAT ESTETIK, SINEMATIK, KAYA KEDALAMAN (DEPTH OF FIELD), DAN BERSTANDAR AGENSI INTERNASIONAL.

Bukan desain template AI murahan/flat/simple, melainkan karya visual yang memukau seperti poster profesional kelas atas:
- Komposisi berlapis (multi-plane layering): Foreground dengan elemen melayang (daun terpaan angin, lentera, partikel cahaya, polaroid mengambang), midground objek megah (arsitektur masjid 3D agung, figur patung/pahlawan heroik, produk komersial premium), background atmosferik (langit dramatis, awan volumetrik, pita bendera berkibar dinamis).
- Pencahayaan sinematik: Volumetric lighting, god rays, cinematic rim lights, soft ambient glow, bokeh kamera profesional.
- Zona grafis profesional:
  * Area atas (Top Zone): Tempat logo brand resmi & kredensial.
  * Area tengah (Center Area): Display typography (kaligrafi artistik / serif editorial / display bold sans) untuk pesan utama.
  * Area bawah (Bottom Strip / Footer Bar): Strip informasi kontak gaya frosted glass pill bar elegan dengan ikon telepon/hotline, ikon website globe, dan ikon media sosial (Instagram, TikTok, YouTube). Jika pengguna memberikan nomor telepon/website spesifik, cantumkan persis di dalam instruksi prompt!

# ALUR PENGOLAHAN
1. Analisis brief dan jawaban:
   - Nama Brand: Gunakan nama brand asli dari input (jangan diubah).
   - Jawaban Pengguna: Integrasikan semua preferensi gaya, fokus visual, detail kontak footer bar, dan format yang dipilih pengguna.
   - Format: 4:5 vertical (1080x1350), 1:1 square (1080x1080), atau 9:16 story (1080x1920).
2. Tentukan keputusan desain agensi:
   - Focal Point utama yang kuat & megah.
   - Palet warna mewah & harmonis (sebutkan hex code spesifik, misal: Royal Sapphire Blue, Warm Desert Gold, Imperial White, Crimson Velvet).
   - Layout tipografi bertingkat dengan instruksi penempatan presisi.
   - Strip kontak bawah: Deskripsikan floating frosted glass container dengan micro-labels (Booking Hotline, Book Online, Social Handles) dan ikon vector bersih.
   - Detil kamera: 8k resolution, shot on Hasselblad/50mm lens, f/1.8 shallow depth of field, photorealistic commercial graphic design poster.

# FORMAT OUTPUT WAJIB (JSON Valid murni tanpa markdown fence):
{
  "summary": "1-2 kalimat ringkasan konsep visual & arah estetik poster",
  "promptFinal": "[FORMAT] <rasio, resolusi & jenis poster>\\n[AESTHETIC THEME] <konsep utama visual estetik agensi>\\n[MULTI-LAYER COMPOSITION & DEPTH] <Foreground elements with bokeh/motion blur, Midground hero subject, Background dynamic atmosphere>\\n[LIGHTING & CINEMATICS] <pencahayaan volumetrik, rim light, ambient illumination, particle atmosphere>\\n[COLOR GRADING & PALETTE] <kombinasi warna premium beserta hex code>\\n[GRAPHIC ZONES & TYPOGRAPHY] <Top zone for brand logo, Center area for artistic display typography, Bottom strip: sleek floating frosted glass footer bar with contact icons, Booking Hotline, Book Online URL, and social media handles>\\n[CAMERA & RENDER SPECS] 8k resolution, commercial advertising masterpiece, ultra-sharp details, photorealistic 3D digital art rendering, master composition\\n[NEGATIVE PROMPT] flat boring layout, cartoonish amateur, low resolution, blurry text, distorted anatomy, messy composition, washed out lighting, generic clipart",
  "assumptions": [
    "Asumsi tata letak: Zona atas dialokasikan untuk penempatan logo resmi brand.",
    "Asumsi tipografi: Teks judul utama menggunakan hierarki visual dominan dengan aksen display elegan.",
    "Asumsi elemen: Strip bawah (footer bar) menampilkan informasi kontak dan media sosial dengan tata letak frosted glass modern."
  ],
  "variations": [
    "Arah Alternatif 1: Eksplorasi sudut pandang kamera dramatis (low-angle hero shot) dengan kontras pencahayaan lebih tajam.",
    "Arah Alternatif 2: Nuansa editorial minimalis mewah dengan fokus pada objek terisolasi dan tipografi bernafas longgar."
  ]
}
`.trim();

function getDynamicQuestionsFallback(userPrompt: string) {
  const p = userPrompt.toLowerCase();
  let categoryHint = 'Usaha Anda';
  let focalHint = 'Produk atau penawaran utama';

  if (p.includes('kopi') || p.includes('cafe') || p.includes('kuliner') || p.includes('makan') || p.includes('roti')) {
    categoryHint = 'kedai kopi / kafe kuliner';
    focalHint = 'Menu hidangan atau minuman kopi heroik';
  } else if (p.includes('properti') || p.includes('rumah') || p.includes('pahlawan') || p.includes('kantor')) {
    categoryHint = 'bisnis properti / instansi';
    focalHint = 'Monumen megah, figur pahlawan, atau arsitektur modern';
  } else if (p.includes('ramadhan') || p.includes('idul fitri') || p.includes('umroh') || p.includes('travel')) {
    categoryHint = 'travel umrah / ucapan islami';
    focalHint = 'Landmark masjid agung 3D dan kaligrafi artistik';
  } else if (p.includes('fashion') || p.includes('baju') || p.includes('gamis') || p.includes('hijab')) {
    categoryHint = 'brand fashion / busana';
    focalHint = 'Model busana elegan atau koleksi lookbook';
  }

  return {
    briefUnderstanding: `Poster promosi untuk tema "${userPrompt}".`,
    questions: [
      {
        id: 'brandName',
        type: 'text' as const,
        required: true,
        question: `Apa nama brand atau nama ${categoryHint} Anda?`,
        placeholder: 'Contoh: Nama Brand Resmi Anda...',
      },
      {
        id: 'visualMood',
        type: 'choice' as const,
        question: 'Suasana pencahayaan dan gaya estetik apa yang diinginkan?',
        options: [
          {
            letter: 'A',
            label: 'Sinematik 3D & Megah (Pencahayaan volumetrik god rays, bayangan lembut)',
            value: 'Sinematik 3D & Megah dengan pencahayaan volumetrik',
          },
          {
            letter: 'B',
            label: 'Kolase Dinamis & Partikel Melayang (Pita melayang, serpihan berbayang, bokeh kamera)',
            value: 'Kolase Dinamis & Partikel Melayang dengan bokeh kamera',
          },
          {
            letter: 'C',
            label: 'Editorial Mewah & Elegan (Tipografi serif tegas, pencahayaan studio bersih)',
            value: 'Editorial Mewah & Elegan dengan tipografi serif tegas',
          },
          {
            letter: 'D',
            label: 'Hangat & Atmosferik (Golden hour sunbeams alami, tekstur natural)',
            value: 'Hangat & Atmosferik golden hour sunbeams',
          },
        ],
      },
      {
        id: 'focalPoint',
        type: 'choice' as const,
        question: 'Fokus elemen visual yang ingin ditonjolkan?',
        options: [
          {
            letter: 'A',
            label: `${focalHint} sebagai objek dominan di tengah kanvas`,
            value: `${focalHint} sebagai objek dominan di tengah`,
          },
          {
            letter: 'B',
            label: 'Tipografi teks promo/ucapan besar dengan ornamen dekoratif pendukung',
            value: 'Tipografi teks dominan dengan elemen dekoratif artistik',
          },
          {
            letter: 'C',
            label: 'Komposisi seimbang antara foto produk dan pesan kampanye',
            value: 'Komposisi seimbang foto produk dan pesan kampanye',
          },
        ],
      },
      {
        id: 'footerContact',
        type: 'choice' as const,
        question: 'Informasi kontak apa yang ingin ditampilkan di footer bar (strip bawah poster)?',
        options: [
          {
            letter: 'A',
            label: 'Lengkap: Booking Hotline/WhatsApp, Website Resmi, dan Ikon Media Sosial (Instagram/TikTok/YouTube)',
            value: 'Lengkap: Booking Hotline, Website Resmi, dan Ikon Media Sosial',
          },
          {
            letter: 'B',
            label: 'Hotline WhatsApp & Username Instagram saja',
            value: 'Hotline WhatsApp dan Username Instagram',
          },
          {
            letter: 'C',
            label: 'Alamat Lokasi Usaha & Nomor WhatsApp',
            value: 'Alamat Lokasi Usaha dan Nomor WhatsApp',
          },
          {
            letter: 'D',
            label: 'Hanya Username Media Sosial (@namabrand)',
            value: 'Hanya Username Media Sosial',
          },
          {
            letter: 'E',
            label: 'Tanpa Footer Bar (Visual bersih murni tanpa strip kontak)',
            value: 'Tanpa Footer Bar',
          },
        ],
      },
      {
        id: 'contactDetails',
        type: 'text' as const,
        required: false,
        question: 'Detail nomor kontak atau media sosial Anda (Opsional):',
        placeholder: 'Contoh: +62 812-3456-7890 | www.traveldiana.id | @traveldiana',
      },
      {
        id: 'format',
        type: 'choice' as const,
        question: 'Format dan rasio kanvas poster?',
        options: [
          {
            letter: 'A',
            label: 'Feed Instagram Portrait 4:5 (1080x1350) — Rekomendasi Feed',
            value: 'Feed Instagram Portrait 4:5 (1080x1350)',
          },
          {
            letter: 'B',
            label: 'Feed Instagram Persegi 1:1 (1080x1080)',
            value: 'Feed Instagram Persegi 1:1 (1080x1080)',
          },
          {
            letter: 'C',
            label: 'Story & Reels Vertikal 9:16 (1080x1920)',
            value: 'Story & Reels Vertikal 9:16 (1080x1920)',
          },
        ],
      },
    ],
  };
}

function getSemanticFallback(
  brandName: string,
  category: string,
  goal: string,
  visualStyle: string,
  format: string,
  contactText: string
) {
  const brand = brandName || 'Brand Anda';
  const targetFormat = format || '4:5 vertical (1080x1350)';
  const contactInfo = contactText || `Booking Hotline: +62 812-3456-7890 | Book Online: www.${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.id | @${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return {
    summary: `Konsep poster komersial estetik untuk ${brand} dengan tema ${goal || category} dan pendekatan visual ${visualStyle}.`,
    promptFinal: `[FORMAT] ${targetFormat}, commercial master advertising poster
[AESTHETIC THEME] High-end agency graphic design with cinematic depth and grandeur for ${brand}
[MULTI-LAYER COMPOSITION & DEPTH] Foreground: Delicate atmospheric floating particles and ambient elements with soft cinematic lens blur. Midground: Majestic central visual focal point representing ${goal || category}, rendered with stunning architectural/monumental precision. Background: Expansive dramatic sky with volumetric clouds, dynamic flowing ribbons and atmospheric depth
[LIGHTING & CINEMATICS] Golden volumetric sunbeams, dramatic rim lighting accentuating edges, soft golden hour reflections, realistic soft shadows, studio-grade aesthetic
[COLOR GRADING & PALETTE] Harmonious color grading with deep royal sapphire blue #0B2559, luminous warm gold #D4AF37, pure imperial white #FFFFFF, and deep obsidian #111111
[GRAPHIC ZONES & TYPOGRAPHY] Top header reserved for clean ${brand} logo badge. Center visual zone reserved for headline display typography: "${goal || category}". Bottom strip: sleek floating frosted-glass capsule bar containing phone icon "Booking Hotline", globe icon "Book Online", and social media icons with contact information: "${contactInfo}"
[CAMERA & RENDER SPECS] 8k resolution, photorealistic commercial graphic design render, shot on 50mm f/1.4 lens, hyper-detailed textures, masterpiece visual advertising
[NEGATIVE PROMPT] flat boring layout, amateur clipart, low resolution, oversaturated neon, distorted hands, blurry text, cluttered messy arrangement, washed out contrast`,
    assumptions: [
      `Nama brand "${brand}" ditempatkan di header bagian atas dengan tata letak agensi profesional.`,
      `Detail pesan "${goal || category}" menjadi fokus visual utama dengan tipografi kontras tinggi.`,
      `Strip bawah (footer bar) menampilkan informasi kontak (${contactInfo}) dalam kontainer frosted glass modern.`,
    ],
    variations: [
      'Arah Alternatif 1: Pencahayaan malam celestial megah dengan aksen lentera bercahaya hangat dan bokeh bulat.',
      'Arah Alternatif 2: Kolase foto dinamis dengan pita grafis berkibar tajam dan tipografi modern sans-serif tebal.',
    ],
  };
}

async function callGemini(systemPrompt: string, userText: string, apiKey: string) {
  let rawContent: string | null = null;

  for (const model of CANDIDATE_MODELS) {
    const maxAttempts = 2;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(20000),
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nInput Pengguna:\n${userText}\n\nBuat respons dalam JSON valid sekarang.` }],
                },
              ],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.65,
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
          if (response.status === 503 || response.status === 429) {
            if (attempt < maxAttempts - 1) {
              await new Promise((resolve) => setTimeout(resolve, 800));
              continue;
            }
          }
          break;
        }
      } catch {
        break;
      }
    }

    if (rawContent) break;
  }

  if (!rawContent) return null;

  try {
    return JSON.parse(rawContent);
  } catch {
    const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}

export async function POST(req: Request) {
  try {
    const body: GeneratePromoRequest = await req.json().catch(() => ({}));
    const action = body.action || (body.answers ? 'prompt' : (body.initialPrompt || body.prompt ? 'questions' : 'prompt'));

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
          error: 'GEMINI_API_KEY belum dikonfigurasi di environment variables (.env.local / Vercel).',
        },
        { status: 500 }
      );
    }

    // =========================================================================
    // MODE 1: GENERATE DYNAMIC QUESTIONS FROM INITIAL PROMPT
    // =========================================================================
    if (action === 'questions') {
      const userPrompt = body.initialPrompt?.trim() || body.prompt?.trim() || '';
      if (!userPrompt) {
        return NextResponse.json(
          { success: false, error: 'Silakan masukkan ide awal desain poster Anda terlebih dahulu.' },
          { status: 400 }
        );
      }

      const parsedQuestions = await callGemini(
        DYNAMIC_QUESTIONS_PROMPT,
        `Ide Awal Pengguna: "${userPrompt}"`,
        apiKey
      );

      if (parsedQuestions && Array.isArray(parsedQuestions.questions) && parsedQuestions.questions.length > 0) {
        let qList: DynamicQuestion[] = parsedQuestions.questions;

        // Ensure footer bar question is ALWAYS present
        const hasFooterQuestion = qList.some((q) =>
          q.id?.toLowerCase().includes('footer') ||
          q.question?.toLowerCase().includes('footer') ||
          q.question?.toLowerCase().includes('kontak')
        );

        if (!hasFooterQuestion) {
          const footerQuestion: DynamicQuestion = {
            id: 'footerContact',
            type: 'choice',
            question: 'Informasi kontak apa yang ingin ditampilkan pada strip bawah (footer bar) poster?',
            options: [
              {
                letter: 'A',
                label: 'Lengkap: Booking Hotline/WhatsApp, Website Resmi, dan Ikon Media Sosial (Instagram/TikTok/YouTube)',
                value: 'Lengkap: Booking Hotline, Website Resmi, dan Ikon Media Sosial',
              },
              {
                letter: 'B',
                label: 'Hotline WhatsApp dan Username Instagram saja',
                value: 'Hotline WhatsApp dan Username Instagram',
              },
              {
                letter: 'C',
                label: 'Alamat Lokasi Fisik dan Nomor WhatsApp',
                value: 'Alamat Lokasi Fisik dan Nomor WhatsApp',
              },
              {
                letter: 'D',
                label: 'Hanya Username Media Sosial (@namabrand)',
                value: 'Hanya Username Media Sosial',
              },
              {
                letter: 'E',
                label: 'Tanpa Footer Bar (Visual bersih murni tanpa strip kontak)',
                value: 'Tanpa Footer Bar',
              },
            ],
          };

          const contactDetailQuestion: DynamicQuestion = {
            id: 'contactDetails',
            type: 'text',
            required: false,
            question: 'Detail nomor kontak atau media sosial Anda (Opsional):',
            placeholder: 'Contoh: +62 812-3456-7890 | www.traveldiana.id | @traveldiana',
          };

          const formatIndex = qList.findIndex((q) => q.id === 'format');
          if (formatIndex !== -1) {
            qList.splice(formatIndex, 0, footerQuestion, contactDetailQuestion);
          } else {
            qList.push(footerQuestion, contactDetailQuestion);
          }
        }

        return NextResponse.json({
          success: true,
          action: 'questions',
          data: {
            briefUnderstanding: parsedQuestions.briefUnderstanding || `Konsep desain untuk "${userPrompt}".`,
            questions: qList,
          },
        });
      }

      // Fallback if AI was unavailable
      const fallback = getDynamicQuestionsFallback(userPrompt);
      return NextResponse.json({
        success: true,
        action: 'questions',
        data: fallback,
      });
    }

    // =========================================================================
    // MODE 2: GENERATE FINAL AESTHETIC PROMPT FROM USER ANSWERS
    // =========================================================================
    const initialPrompt = body.initialPrompt?.trim() || body.prompt?.trim() || '';
    const briefUnderstanding = body.briefUnderstanding?.trim() || '';

    // Extract answers
    let answersFormatted = '';
    let extractedBrand = body.brandName?.trim() || '';
    let extractedGoal = body.goal?.trim() || initialPrompt || '';
    let extractedStyle = body.visualStyle?.trim() || '';
    let extractedFormat = body.format?.trim() || 'Feed Instagram 4:5 (1080x1350)';
    let extractedContact = '';

    if (Array.isArray(body.answers)) {
      answersFormatted = body.answers
        .map((a, i) => {
          const qLower = a.question.toLowerCase();
          if (qLower.includes('brand') || qLower.includes('nama')) {
            extractedBrand = a.answer;
          }
          if (qLower.includes('kontak') || qLower.includes('footer') || qLower.includes('nomor')) {
            extractedContact = (extractedContact ? `${extractedContact} | ` : '') + a.answer;
          }
          return `${i + 1}. Pertanyaan: ${a.question}\n   Jawaban Pengguna: ${a.answer}`;
        })
        .join('\n\n');
    } else if (body.answers && typeof body.answers === 'object') {
      const entries = Object.entries(body.answers);
      answersFormatted = entries
        .map(([k, v], i) => {
          if (k.toLowerCase().includes('brand')) extractedBrand = String(v);
          if (k.toLowerCase().includes('contact') || k.toLowerCase().includes('footer')) {
            extractedContact = (extractedContact ? `${extractedContact} | ` : '') + String(v);
          }
          return `${i + 1}. ${k}: ${v}`;
        })
        .join('\n');
    }

    const promptUserText = `
Brief Awal Pengguna: "${initialPrompt || 'Poster Komersial Estetik'}"
Ringkasan Pemahaman: "${briefUnderstanding}"

Hasil Jawaban Kuesioner Pengguna:
${answersFormatted}
    `.trim();

    const parsedResult = await callGemini(
      AESTHETIC_ART_DIRECTOR_PROMPT,
      promptUserText,
      apiKey
    );

    if (parsedResult && parsedResult.promptFinal) {
      return NextResponse.json({
        success: true,
        action: 'prompt',
        data: {
          summary: parsedResult.summary || 'Konsep poster desain komersial estetik.',
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
    }

    // Fallback if AI was unavailable
    const fallback = getSemanticFallback(
      extractedBrand,
      body.category || 'Bisnis Anda',
      extractedGoal || initialPrompt,
      extractedStyle || 'Sinematik 3D & Megah',
      extractedFormat,
      extractedContact || body.extraDetail || ''
    );

    return NextResponse.json({
      success: true,
      action: 'prompt',
      data: {
        summary: fallback.summary,
        promptFinal: fallback.promptFinal,
        assumptions: fallback.assumptions,
        variations: fallback.variations,
        headline: fallback.summary,
        caption: fallback.assumptions.join('\n'),
        visualPrompt: fallback.promptFinal,
        designTips: fallback.variations.join(' | '),
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
