import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AOSInit from '@/components/AOSInit';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.warungdesign.web.id'),
  title: 'Warung Design: Bundle Template & Desain Promosi Siap Pakai untuk UMKM',
  description:
    'Platform bundle visual promosi siap pakai (feed & story) untuk pemilik toko dan admin UMKM Indonesia. Tanpa perlu keahlian desain rumit, tinggal pasang teks di Canva dan langsung posting.',
  keywords: [
    'desain promosi umkm',
    'template feed instagram',
    'poster diskon olshop',
    'warung design',
    'konten promosi toko',
  ],
  authors: [{ name: 'Warung Design Team' }],
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#f6f5f4] text-[#000000] selection:bg-[#e6f3fe] selection:text-[#0075de] font-sans">
        <AOSInit />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
