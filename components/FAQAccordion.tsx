'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Apakah saya harus mahir tools AI seperti Midjourney atau DALL-E?',
    answer: (
      <>
        <strong>Tidak sama sekali.</strong> Yang Anda beli adalah gambar hasil jadi (PNG transparan &amp; JPG resolusi tinggi). Teks prompt hanya bonus pelengkap bagi Anda yang ingin membuat variasi tambahan.
      </>
    ),
  },
  {
    id: 'faq-2',
    question: 'Bagaimana cara menambahkan logo dan teks diskon toko saya?',
    answer: (
      <>
        Buka aplikasi <strong>Canva</strong> di HP atau laptop, unggah gambar dari paket Warung Desain sebagai background, lalu tempel logo toko dan ketik teks promo toko Anda. Hanya butuh waktu 2 menit.
      </>
    ),
  },
  {
    id: 'faq-3',
    question: 'Berapa lama waktu verifikasi pembayaran setelah transfer?',
    answer: (
      <>
        Setelah klik <em>&quot;Cek Pembayaran&quot;</em>, notifikasi langsung terkirim ke Telegram owner. Verifikasi mutasi umumnya memakan waktu <strong>5 hingga 15 menit</strong> pada jam operasional (08.00 – 21.00 WIB).
      </>
    ),
  },
  {
    id: 'faq-4',
    question: 'Apakah gambar desain ini bebas dipakai untuk kebutuhan komersial toko?',
    answer: (
      <>
        <strong>Ya, 100% bebas royalti komersial.</strong> Anda bebas menggunakannya untuk feed Instagram, WhatsApp Story, etalase Shopee/Tokopedia, dan banner promosi bisnis Anda selamanya.
      </>
    ),
  },
];

export default function FAQAccordion() {
  // Buka item pertama secara default, atau null jika ingin semua tertutup
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-3 max-w-4xl">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = Boolean(openIds[item.id]);

        return (
          <div
            key={item.id}
            className={`rounded-[12px] border transition-colors bg-[#ffffff] overflow-hidden ${
              isOpen ? 'border-[#0075de]/30 shadow-xs' : 'border-black/[0.08] hover:border-black/[0.16]'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer select-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-[8px] transition-colors shrink-0 ${
                    isOpen ? 'bg-[#e6f3fe] text-[#0075de]' : 'bg-[#f6f5f4] text-[#757575]'
                  }`}
                >
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h3
                  className={`font-semibold text-[15px] transition-colors ${
                    isOpen ? 'text-[#0075de]' : 'text-[#000000]'
                  }`}
                >
                  {item.question}
                </h3>
              </div>

              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full bg-[#f6f5f4] text-[#757575] transition-transform duration-300 shrink-0 ${
                  isOpen ? 'rotate-180 bg-[#e6f3fe] text-[#0075de]' : ''
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>

            {/* Smooth height transition via CSS grid */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-1 text-[15.5px] text-[#615d59] leading-relaxed border-t border-black/[0.04]">
                  <div className="pl-10">{item.answer}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
