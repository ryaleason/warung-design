import { notFound } from 'next/navigation';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  // Hanya izinkan akses di environment lokal / development
  // Di production (Vercel dsb), halaman ini otomatis 404 Not Found
  const isProduction = process.env.NODE_ENV === 'production';
  const forceEnable = process.env.ENABLE_ADMIN_PAGE === 'true';

  if (isProduction && !forceEnable) {
    notFound();
  }

  return <AdminClient />;
}
