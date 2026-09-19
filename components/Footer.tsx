import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.08] bg-[#f6f5f4] mt-20">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt="Warung Design"
                width={32}
                height={28}
                className="h-7 w-auto object-contain"
                unoptimized
              />
              <span className="text-[16px] font-semibold text-[#111111]">Warung Design</span>
            </div>
            <p className="mt-3 max-w-sm text-[13px] text-[#615d59] leading-relaxed">
              Solusi konten promosi &amp; visual siap pakai untuk admin media sosial UMKM Indonesia.
              Tanpa repot belajar prompt generatif, tinggal edit teks di Canva dan langsung posting!
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#000000]">
              Navigasi Cepat
            </h4>
            <ul className="mt-3 space-y-2 text-[13px] text-[#757575]">
              <li>
                <Link href="/#katalog" className="hover:text-[#000000] transition-colors">
                  Katalog Bundle
                </Link>
              </li>
              <li>
                <Link href="/#cara-pakai" className="hover:text-[#000000] transition-colors">
                  Cara Kerja &amp; Tutorial
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#000000] transition-colors">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#000000]">
              Jika Ada Kendala
            </h4>
            <p className="mt-3 text-[13px] text-[#615d59] leading-relaxed">
              Ada pertanyaan atau kendala terkait pesanan? Silakan hubungi kami via WhatsApp:
            </p>
            <div className="mt-3">
              <a
                href="https://wa.me/6285182510575?text=Halo%20Admin%20Warung%20Desain%2C%20saya%20butuh%20bantuan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[8px] bg-emerald-600 px-3.5 py-2 text-[13px] font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WA 085182510575</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-black/[0.06] pt-6 text-center text-[12px] text-[#757575]">
          <p>© {new Date().getFullYear()} Warung Design</p>
        </div>
      </div>
    </footer>
  );
}
