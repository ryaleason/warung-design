import Link from 'next/link';
import Image from 'next/image';
import { Bundle } from '@/types';
import { Check, Layers } from 'lucide-react';
import { formatRupiah } from '@/lib/telegram';

interface BundleCardProps {
  bundle: Bundle;
}

export default function BundleCard({ bundle }: BundleCardProps) {
  const mainImage = bundle.preview_images[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group flex flex-col overflow-hidden rounded-[12px] border border-black/[0.08] bg-[#ffffff] transition-colors hover:border-black/[0.18]">
      {/* Thumbnail Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f6f5f4] border-b border-black/[0.08]">
        <Image
          src={mainImage}
          alt={bundle.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-102"
        />

        {/* Badge Pill */}
        {bundle.badge && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-[#ffb110] px-2.5 py-0.5 text-[11px] font-semibold text-[#000000]">
              {bundle.badge}
            </span>
          </div>
        )}

        {/* Category Tag & Image Count */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-white drop-shadow-xs">
          <span className="rounded-full bg-[#000000]/75 backdrop-blur-xs px-2.5 py-0.5">
            {bundle.category || 'Desain UMKM'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#000000]/75 backdrop-blur-xs px-2 py-0.5">
            <Layers className="h-3 w-3" />
            {bundle.preview_images.length}+ Preview
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-[#000000] group-hover:text-[#0075de] transition-colors leading-snug">
          {bundle.name}
        </h3>
        
        <p className="mt-2 text-[15px] text-[#615d59] line-clamp-2 leading-relaxed">
          {bundle.description}
        </p>

        {/* Feature List */}
        <div className="mt-4 space-y-2 border-t border-black/[0.06] pt-3.5 flex-1">
          {bundle.features.slice(0, 3).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[12px] text-[#615d59]">
              <Check className="h-3.5 w-3.5 text-[#0075de] shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Price & Primary Action */}
        <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-3.5">
          <div>
            <span className="text-[11px] text-[#54504c] block uppercase tracking-wider font-medium">Harga Paket</span>
            <span className="text-[19px] font-bold tracking-tight text-[#000000]">
              {formatRupiah(bundle.price)}
            </span>
          </div>

          <Link
            href={`/bundles/${bundle.slug}`}
            className="inline-flex items-center justify-center rounded-[8px] bg-[#0075de] px-3.5 py-2 text-[13.5px] font-medium text-white hover:bg-[#0060b8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-1"
          >
            Lihat Paket
          </Link>
        </div>
      </div>
    </div>
  );
}
