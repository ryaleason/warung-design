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
  title: 'Warung Design — Bundle Prompt AI & Desain Instan untuk UMKM',
  description:
    'Platform bundle desain promosi siap pakai (feed & story) untuk admin UMKM Indonesia. Tanpa perlu mahir tools AI generatif, tinggal edit di Canva dan langsung posting.',
  keywords: [
    'desain umkm',
    'bundle prompt ai',
    'template feed instagram',
    'poster diskon',
    'warung design',
    'desain promosi toko',
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
