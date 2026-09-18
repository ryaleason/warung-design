'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BundleImageGalleryProps {
  images: string[];
  bundleName: string;
}

export default function BundleImageGallery({ images, bundleName }: BundleImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] || images[0];

  return (
    <div className="space-y-3">
      {/* Main Preview Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[12px] border border-black/[0.08] bg-[#ffffff]">
        <Image
          src={activeImage}
          alt={`${bundleName} preview ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-all duration-300"
        />
        <div className="absolute bottom-3 right-3 rounded-full bg-[#000000]/75 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
          Preview {selectedIndex + 1} dari {images.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2.5">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square overflow-hidden rounded-[8px] border transition-all ${
                idx === selectedIndex
                  ? 'border-[#0075de] ring-1 ring-[#0075de]'
                  : 'border-black/[0.08] opacity-75 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${bundleName} thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
