import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AOSInit from '@/components/AOSInit';
import SmoothScroll from '@/components/SmoothScroll';
import { AuthProvider } from '@/components/AuthContext';
import AuthModal from '@/components/AuthModal';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.warungdesign.web.id'),
  title: 'Warung Design: Formula Prompt AI Visual Promosi Siap Pakai untuk UMKM',
  description:
    'Platform formula prompt AI visual promosi untuk pemilik toko dan admin UMKM Indonesia. Tinggal salin teks prompt ke ChatGPT atau Midjourney untuk menghasilkan visual promosi berkualitas tinggi seketika.',
  keywords: [
    'prompt ai promosi umkm',
    'formula prompt midjourney',
    'prompt chatgpt poster jualan',
    'warung design',
    'prompt ai produk toko',
  ],
  authors: [{ name: 'Warung Design Team' }],
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  verification: {
    google: '2wROcQark5fc9elW6cUkw3iFtLGB3JxEkznFDwoxjqk',
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
      className={`${plusJakartaSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#ffffff] text-[#000000] selection:bg-[#e6f3fe] selection:text-[#0075de] font-sans">
        <AuthProvider>
          <SmoothScroll />
          <AOSInit />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
