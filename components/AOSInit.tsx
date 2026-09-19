'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true, // Sekali animasi selesai, konten tetap terlihat permanen dan tidak akan hilang
      offset: 40,
      disableMutationObserver: false,
    });

    // Refresh setelah client hydration selesai
    const timer = setTimeout(() => {
      AOS.refreshHard();
    }, 120);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
